---
outline: deep
---

<script setup>
import SpreadSheet from './demos/SpreadSheet.vue'
</script>

# La réactivité en profondeur {#reactivity-in-depth}

One of Vue’s most distinctive features is the unobtrusive reactivity system. Component state consists of reactive JavaScript objects. When you modify them, the view updates. It makes state management simple and intuitive, but it’s also important to understand how it works to avoid some common gotchas. In this section, we are going to dig into some of the lower-level details of Vue’s reactivity system.

## What is Reactivity? {#what-is-reactivity}

This term comes up in programming quite a bit these days, but what do people mean when they say it? Reactivity is a programming paradigm that allows us to adjust to changes in a declarative manner. The canonical example that people usually show, because it’s a great one, is an Excel spreadsheet:

<SpreadSheet />

Here cell A2 is defined via a formula of `= A0 + A1` (you can click on A2 to view or edit the formula), so the spreadsheet gives us 3. No surprises there. But if you update A0 or A1, you'll notice that A2 automagically updates too.

JavaScript doesn’t usually work like this. If we were to write something comparable in JavaScript:

```js
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3

A0 = 2
console.log(A2) // Still 3
```

When we mutate `A0`, `A2` does not change automatically.

So how would we do this in JavaScript? First, in order to re-run the code that updates `A2`, let's wrap it in a function:

```js
let A2

function update() {
  A2 = A0 + A1
}
```

Then, we need to define a few terms:

- The `update()` function produces a **side effect**, or **effect** for short, because it modifies the state of the program.

- `A0` and `A1` are considered **dependencies** of the effect, as their values are used to perform the effect. The effect is said to be a **subscriber** to its dependencies.

What we need is a magic function that can invoke `update()` (the **effect**) whenever `A0` or `A1` (the **dependencies**) change:

```js
whenDepsChange(update)
```

This `whenDepsChange()` function has the following tasks:

1. Track when a variable is read. E.g. when evaluating the expression `A0 + A1`, both `A0` and `A1` are read.

2. If a variable is read when there is a currently running effect, make that effect a subscriber to that variable. E.g. because `A0` and `A1` are read when `update()` is being executed, `update()` becomes a subscriber to both `A0` and `A1` after the first call.

3. Detect when a variable is mutated. E.g. when `A0` is assigned a new value, notify all its subscriber effects to re-run.

## Fonctionnement de la réactivité dans Vue {#how-reactivity-works-in-vue}

Nous ne pouvons pas tout à fait suivre la lecture et l'écriture des variables locales comme dans l'exemple. Il n'y a tout simplement pas de mécanisme pour le faire dans le JavaScript classique. Ce que nous **pouvons** faire cependant, c'est intercepter la lecture et l'écriture des **propriétés d'un objet**.

Il existe deux façons d'intercepter l'accès aux propriétés en JavaScript : [les accesseurs](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Functions/get) / [les mutateurs](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Functions/set) et [les proxys](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Vue 2 utilisait exclusivement les accesseurs / mutateurs en raison des limitations de prise en charge du navigateur. Dans Vue 3, les proxys sont utilisés pour les objets réactifs et les accesseurs / mutateurs sont utilisés pour les refs. Voici un pseudo-code qui illustre leur fonctionnement :

```js{4,9,17,22}
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

:::tip
Ces extraits de code et ceux situés ci-dessous ont pour but d'expliquer les concepts de base de la manière la plus simple possible, c'est pourquoi de nombreux détails sont omis et les cas limites ignorés.
:::

Cela explique certaines [limitations des objets réactifs](/guide/essentials/reactivity-fundamentals.html#limitations-of-reactive) que nous avons abordées dans la section sur les principes fondamentaux des composants :

- Lorsque vous assignez ou déstructurez la propriété d'un objet réactif à une variable locale, la réactivité est "déconnectée" car l'accès à la variable locale ne déclenche plus les pièges d'accès / de mutation du proxy.

- Le proxy retourné par `reactive()`, bien que se comportant comme l'original, n'a pas la même identité lorsqu'on le compare à ce dernier en utilisant l'opérateur `===`.

Dans `track()`, nous vérifions s'il existe un effet en cours d'exécution. S'il y en a un, nous recherchons les effets abonnés (stockés dans un Set) à la propriété suivie, et ajoutons l'effet au Set :

```js
// Cela sera défini juste avant qu'un effet soit sur le point
// d'être exécuté. Nous nous en occuperons plus tard.
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

Les abonnements aux effets sont stockés dans une structure de données globale `WeakMap<target, Map<key, Set<effect>>`. Si aucun Set d'effets souscripteurs n'a été trouvé pour une propriété (suivie pour la première fois), il sera créé. C'est en résumé ce que fait la fonction `getSubscribersForProperty()`. Pour plus de simplicité, nous n'entrerons pas dans les détails.

Dans `trigger()`, nous recherchons à nouveau les effets abonnés à la propriété. Mais cette fois, nous les invoquons :

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```

Maintenant, revenons à la fonction `whenDepsChange()` :

```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

Elle enveloppe la fonction brute `update` dans un effet étant l'effet actif actuel avant d'exécuter la mise à jour correspondante. Cela permet aux appels `track()` pendant la mise à jour de localiser l'effet actif actuel.

À ce stade, nous avons créé un effet qui traque automatiquement ses dépendances et qui s'exécute à nouveau dès qu'une d'elles change. Nous appelons cela un **effet réactif**.

Vue fournit une API qui vous permet de créer des effets réactifs : [`watchEffect()`](/api/reactivity-core.html#watcheffect). En fait, vous avez peut-être remarqué qu'elle fonctionne de manière assez similaire à la fonction magique `whenDepsChange()` de l'exemple. Nous pouvons maintenant retravailler l'exemple original en utilisant les API de Vue :

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // traque A0 et A1
  A2.value = A0.value + A1.value
})

// déclenche l'effet
A0.value = 2
```

L'utilisation d'un effet réactif pour modifier une ref n'est pas le cas d'utilisation le plus intéressant - en fait, l'utilisation d'une propriété calculée rend cela plus déclaratif :

```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

En interne, `computed` gère son invalidation et son re-calcul en utilisant un effet réactif.

Alors, quel pourrait être un exemple d'un effet réactif courant et utile ? Et bien, la mise à jour du DOM ! Nous pouvons implémenter un simple "rendu réactif" de cette manière :

```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `count is: ${count.value}`
})

// met à jour le DOM
count.value++
```

En fait, cela est assez proche de la façon dont un composant Vue maintient l'état et le DOM synchronisés - chaque instance de composant crée un effet réactif pour rendre et mettre à jour le DOM. Bien sûr, les composants Vue utilisent des moyens beaucoup plus efficaces pour mettre à jour le DOM que `innerHTML`. Ce point est abordé dans [Mécanismes de rendu](./rendering-mechanism).

<div class="options-api">

Les API `ref()`, `computed()` et `watchEffect()` font toutes partie de la Composition API. Si vous n'avez utilisé que l'Options API avec Vue jusqu'à présent, vous remarquerez que la Composition API est plus proche de la façon dont le système de réactivité de Vue fonctionne sous le capot. En fait, dans Vue 3, l'Options API est mise en œuvre par dessus l'Options API. Tous les accès aux propriétés de l'instance du composant (`this`) déclenchent des accesseurs / mutateurs pour le suivi de la réactivité, et les options comme `watch` et `computed` invoquent leurs équivalents de la Composition API en interne.

</div>

## Réactivité à l'exécution vs. à la compilation {#runtime-vs-compile-time-reactivity}

Le système de réactivité de Vue est principalement basé sur l'exécution : le suivi et le déclenchement sont tous deux effectués pendant l'exécution du code, directement dans le navigateur. Les avantages de la réactivité d'exécution sont qu'elle peut fonctionner sans outil de build et qu'il y a moins de cas limites. En revanche, elle est limitée par les contraintes syntaxiques de JavaScript.

Nous avons déjà rencontré une limitation dans l'exemple précédent : JavaScript ne nous permet pas d'intercepter la lecture et l'écriture des variables locales. Nous devons donc toujours accéder à l'état réactif via les propriétés d'un objet, en utilisant des objets réactifs ou des refs.

Nous avons expérimenté la fonctionnalité [Reactivity Transform](/guide/extras/reactivity-transform.html) pour réduire la verbosité du code :

```js
let A0 = $ref(0)
let A1 = $ref(1)

// traque lors de la lecture de la variable
const A2 = $computed(() => A0 + A1)

// se déclenche lorsque la variable est modifiée
A0 = 2
```

Le résultat de la compilation de cet extrait de code sera le même que celui résultant de ce que nous aurions écrit sans la transformation, via l'ajout automatique de `.value` après les références aux variables. Avec Reactivity Transform, le système de réactivité de Vue devient un système hybride.

## Déboguer la réactivité {#reactivity-debugging}

C'est une bonne chose que le système de réactivité de Vue traque automatiquement les dépendances, mais dans certains cas, il se peut que nous voulions savoir exactement ce qui est traqué, ou ce qui provoque le nouveau rendu d'un composant.

### Hooks de débogage des composants {#component-debugging-hooks}

Nous pouvons vérifier quelles dépendances sont utilisées pendant le rendu d'un composant et quelle dépendance déclenche une mise à jour à l'aide des hooks de cycle de vie <span class="options-api">`renderTracked`</span><span class="composition-api">`onRenderTracked`</span> et <span class="options-api">`renderTriggered`</span><span class="composition-api">`onRenderTriggered`</span>. Les deux hooks recevront un événement de débogage qui contient des informations sur la dépendance en question. Il est recommandé de placer une instruction `debugger` dans les fonctions de rappel pour inspecter de manière interactive la dépendance :

<div class="composition-api">

```vue
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  renderTracked(event) {
    debugger
  },
  renderTriggered(event) {
    debugger
  }
}
```

</div>

:::tip
Les hooks de débogage des composants ne fonctionnent qu'en mode développement.
:::

Les objets d'événements de débogage ont le type suivant :

<span id="debugger-event"></span>

```ts
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

### Débogage des propriétés calculées {#computed-debugging}

<!-- TODO options API equivalent -->

Nous pouvons déboguer les propriétés calculées en passant à `computed()` un second objet d'options avec des fonctions de rappel `onTrack` et `onTrigger` :

- `onTrack` sera appelée lorsqu'une propriété ou une ref réactive sera traquée en tant que dépendance.
- `onTrigger` sera appelée lorsque la fonction de rappel de l'observateur sera déclenchée par la mutation d'une dépendance.

Les deux fonctions de rappel recevront les événements du débogueur dans le [même format](#debugger-event) que les hooks de débogage des composants :

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // déclenchée lorsque count.value est traquée en tant que dépendance
    debugger
  },
  onTrigger(e) {
    // déclenchée lorsque count.value est mutée
    debugger
  }
})

// accès à plusOne, devrait déclencher onTrack
console.log(plusOne.value)

// mutation de count.value, devrait déclencher onTrigger
count.value++
```

:::tip
Les propriétés calculées `onTrack` et `onTrigger` ne fonctionnent qu'en mode développement.
:::

### Débogage des observateurs {#watcher-debugging}

<!-- TODO options API equivalent -->

Comme pour `computed()`, les observateurs prennent aussi en charge les options `onTrack` et `onTrigger` :

```js
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

:::tip
Les options d'observation `onTrack` et `onTrigger` ne fonctionnent qu'en mode développement.
:::

## Intégration avec des systèmes externes de gestion d'état {#integration-with-external-state-systems}

Le système de réactivité de Vue fonctionne en convertissant en profondeur les objets JavaScript simples en proxys réactifs. Cette conversion profonde peut s'avérer inutile ou parfois indésirable lors de l'intégration avec des systèmes externes de gestion d'état (par exemple, si une solution externe utilise également des proxys).

L'idée générale derrière l'intégration du système de réactivité de Vue avec une solution externe de gestion d'état est de conserver l'état externe dans un [`shallowRef`](/api/reactivity-advanced.html#shallowref). Une ref peu profonde n'est réactive que lorsqu'on accède à sa propriété `.value` - la valeur interne reste intacte. Lorsque l'état externe change, remplacez la valeur de la ref pour déclencher les mises à jour.

### Données persistantes {#immutable-data}

Si vous mettez en œuvre une fonctionnalité d'annulation et de rétablissement, vous souhaitez probablement avoir un instantané de l'état de l'application à chaque modification de l'utilisateur. Cependant, le système de réactivité mutable de Vue n'est pas le mieux adapté si l'arbre d'état est grand, car la sérialisation de l'objet d'état entier à chaque mise à jour peut être coûteuse en termes de coûts de CPU et de mémoire.

Les [structures de données persistantes](https://fr.wikipedia.org/wiki/Structure_de_donn%C3%A9es_persistante) résolvent ce problème en ne modifiant jamais les objets d'état - au lieu de cela, elles créent de nouveaux objets qui partagent les mêmes parties persistantes avec les anciens. Il existe différentes façons d'utiliser des données persistantes en JavaScript, mais nous recommandons d'utiliser [Immer](https://immerjs.github.io/immer/) avec Vue car il vous permet d'utiliser des données persistantes tout en conservant une syntaxe de mutation plus ergonomique.

Nous pouvons intégrer Immer avec Vue via un simple composable :

```js
import produce from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHVzZUltbWVyIH0gZnJvbSAnLi9pbW1lci5qcydcbiAgXG5jb25zdCBbaXRlbXMsIHVwZGF0ZUl0ZW1zXSA9IHVzZUltbWVyKFtcbiAge1xuICAgICB0aXRsZTogXCJMZWFybiBWdWVcIixcbiAgICAgZG9uZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgIHRpdGxlOiBcIlVzZSBWdWUgd2l0aCBJbW1lclwiLFxuICAgICBkb25lOiBmYWxzZVxuICB9XG5dKVxuXG5mdW5jdGlvbiB0b2dnbGVJdGVtKGluZGV4KSB7XG4gIHVwZGF0ZUl0ZW1zKGl0ZW1zID0+IHtcbiAgICBpdGVtc1tpbmRleF0uZG9uZSA9ICFpdGVtc1tpbmRleF0uZG9uZVxuICB9KVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPHVsPlxuICAgIDxsaSB2LWZvcj1cIih7IHRpdGxlLCBkb25lIH0sIGluZGV4KSBpbiBpdGVtc1wiXG4gICAgICAgIDpjbGFzcz1cInsgZG9uZSB9XCJcbiAgICAgICAgQGNsaWNrPVwidG9nZ2xlSXRlbShpbmRleClcIj5cbiAgICAgICAge3sgdGl0bGUgfX1cbiAgICA8L2xpPlxuICA8L3VsPlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuLmRvbmUge1xuICB0ZXh0LWRlY29yYXRpb246IGxpbmUtdGhyb3VnaDtcbn1cbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCIsXG4gICAgXCJpbW1lclwiOiBcImh0dHBzOi8vdW5wa2cuY29tL2ltbWVyQDkuMC43L2Rpc3QvaW1tZXIuZXNtLmpzP21vZHVsZVwiXG4gIH1cbn0iLCJpbW1lci5qcyI6ImltcG9ydCBwcm9kdWNlIGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHsgc2hhbGxvd1JlZiB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUltbWVyKGJhc2VTdGF0ZSkge1xuICBjb25zdCBzdGF0ZSA9IHNoYWxsb3dSZWYoYmFzZVN0YXRlKVxuICBjb25zdCB1cGRhdGUgPSAodXBkYXRlcikgPT4ge1xuICAgIHN0YXRlLnZhbHVlID0gcHJvZHVjZShzdGF0ZS52YWx1ZSwgdXBkYXRlcilcbiAgfVxuXG4gIHJldHVybiBbc3RhdGUsIHVwZGF0ZV1cbn0ifQ==)

### Machines d'état {#state-machines}

[Une machine d'état](https://developer.mozilla.org/fr/docs/Glossary/State_machine) est un modèle permettant de décrire tous les états possibles d'une application et toutes les façons possibles de passer d'un état à un autre. Bien qu'il puisse être excessif pour les composants simples, il peut aider à rendre les flux d'états complexes plus robustes et plus faciles à gérer.

L'une des implémentations de machine d'état les plus populaires en JavaScript est [XState](https://xstate.js.org/). Voici un composable qui s'intègre avec :

```js
import { createMachine, interpret } from 'xstate'
import { shallowRef } from 'vue'

export function useMachine(options) {
  const machine = createMachine(options)
  const state = shallowRef(machine.initialState)
  const service = interpret(machine)
    .onTransition((newState) => (state.value = newState))
    .start()
  const send = (event) => service.send(event)

  return [state, send]
}
```

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHVzZU1hY2hpbmUgfSBmcm9tICcuL21hY2hpbmUuanMnXG4gIFxuY29uc3QgW3N0YXRlLCBzZW5kXSA9IHVzZU1hY2hpbmUoe1xuICBpZDogJ3RvZ2dsZScsXG4gIGluaXRpYWw6ICdpbmFjdGl2ZScsXG4gIHN0YXRlczoge1xuICAgIGluYWN0aXZlOiB7IG9uOiB7IFRPR0dMRTogJ2FjdGl2ZScgfSB9LFxuICAgIGFjdGl2ZTogeyBvbjogeyBUT0dHTEU6ICdpbmFjdGl2ZScgfSB9XG4gIH1cbn0pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cInNlbmQoJ1RPR0dMRScpXCI+XG4gICAge3sgc3RhdGUubWF0Y2hlcyhcImluYWN0aXZlXCIpID8gXCJPZmZcIiA6IFwiT25cIiB9fVxuICA8L2J1dHRvbj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCIsXG4gICAgXCJ4c3RhdGVcIjogXCJodHRwczovL3VucGtnLmNvbS94c3RhdGVANC4yNy4wL2VzL2luZGV4LmpzP21vZHVsZVwiXG4gIH1cbn0iLCJtYWNoaW5lLmpzIjoiaW1wb3J0IHsgY3JlYXRlTWFjaGluZSwgaW50ZXJwcmV0IH0gZnJvbSAneHN0YXRlJ1xuaW1wb3J0IHsgc2hhbGxvd1JlZiB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1hY2hpbmUob3B0aW9ucykge1xuICBjb25zdCBtYWNoaW5lID0gY3JlYXRlTWFjaGluZShvcHRpb25zKVxuICBjb25zdCBzdGF0ZSA9IHNoYWxsb3dSZWYobWFjaGluZS5pbml0aWFsU3RhdGUpXG4gIGNvbnN0IHNlcnZpY2UgPSBpbnRlcnByZXQobWFjaGluZSlcbiAgICAub25UcmFuc2l0aW9uKChuZXdTdGF0ZSkgPT4gKHN0YXRlLnZhbHVlID0gbmV3U3RhdGUpKVxuICAgIC5zdGFydCgpXG4gIGNvbnN0IHNlbmQgPSAoZXZlbnQpID0+IHNlcnZpY2Uuc2VuZChldmVudClcblxuICByZXR1cm4gW3N0YXRlLCBzZW5kXVxufSJ9)

### RxJS {#rxjs}

[RxJS](https://rxjs.dev/) est une bibliothèque permettant de travailler avec des flux d'événements asynchrones. La bibliothèque [VueUse](https://vueuse.org/) fournit le module complémentaire [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) permettant de connecter les flux RxJS au système de réactivité de Vue.