# Gestion d'état {#state-management}

## Qu'est-ce que la gestion d'état ? {#what-is-state-management}

Techniquement, chaque instance de composant Vue "gère" déjà son propre état réactif. Prenons l'exemple d'un simple composant compteur :

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

// état
const count = ref(0)

// actions
function increment() {
  count.value++
}
</script>

<!-- vue -->
<template>{{ count }}</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  // état
  data() {
    return {
      count: 0
    }
  },
  // actions
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<!-- vue -->
<template>{{ count }}</template>
```

</div>

Il s'agit d'une unité autonome composée de la manière suivante :

- L'**état**, la source de vérité qui dirige notre application;
- La **vue**, une cartographie déclarative de l'**état**;
- Les **actions**, les différentes manières dont l'état pourrait changer, en réaction aux entrées de l'utilisateur dans la **vue**.

C'est une représentation simple du concept de "flux de données à sens unique" :

<p style="text-align: center">
  <img alt="state flow diagram" src="./images/state-flow.png" width="252px" style="margin: 40px auto">
</p>

Toutefois, la simplicité commence à disparaître lorsque nous avons **plusieurs composants qui partagent un état commun** :

1. Plusieurs vues peuvent dépendre de la même partie d'un état.
2. Les actions de différentes vues peuvent avoir besoin de muter la même partie d'un état.

Dans le premier cas, une solution possible consiste à "élever" l'état partagé jusqu'à un composant ancêtre commun, puis à le transmettre en tant que props. Cependant, cela devient rapidement fastidieux dans les arbres de composants avec des hiérarchies profondes, conduisant à un autre problème connu sous le nom de [Prop Drilling](/guide/components/provide-inject#prop-drilling).

Dans le deuxième cas, nous nous retrouvons souvent à utiliser des solutions telles que l'atteinte d'instances directes parent/enfant par le biais des refs de template, ou à essayer de modifier et de synchroniser plusieurs copies de l'état par le biais d'événements émis. Ces deux modèles sont fragiles et conduisent rapidement à un code non maintenable.

Une solution plus simple et plus directe consiste à extraire l'état partagé des composants, et à le gérer dans un singleton global. Ainsi, notre arbre de composants devient une grande "vue", et n'importe quel composant peut accéder à l'état ou déclencher des actions, peu importe où il se trouve dans l'arbre !

## Gestion d'état simple avec l'API de réactivité {#simple-state-management-with-reactivity-api}

<div class="options-api">

Dans l'Options API, les données réactives sont déclarées via l'option `data()`. En interne, l'objet renvoyé par `data()` est rendu réactif via la fonction [`reactive()`](/api/reactivity-core#reactive), qui est également disponible en tant qu'API publique.

</div>

Si vous avez un élément d'état qui doit être partagé par plusieurs instances, vous pouvez utiliser [`reactive()`](/api/reactivity-core#reactive) pour créer un objet réactif, puis l'importer dans plusieurs composants :

```js
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0
})
```

<div class="composition-api">

```vue
<!-- ComponentA.vue -->
<script setup>
import { store } from './store.js'
</script>

<template>From A: {{ store.count }}</template>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { store } from './store.js'
</script>

<template>From B: {{ store.count }}</template>
```

</div>
<div class="options-api">

```vue
<!-- ComponentA.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From A: {{ store.count }}</template>
```

```vue
<!-- ComponentB.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From B: {{ store.count }}</template>
```

</div>

Maintenant, chaque fois que l'objet `store` est modifié, `<ComposantA>` et `<ComposantB>` mettront à jour leur vue automatiquement - nous avons désormais une seule source de vérité.

Cependant, cela signifie également que n'importe quel composant important `store` peut le modifier comme il le souhaite :

```vue-html{2}
<template>
  <button @click="store.count++">
    From B: {{ store.count }}
  </button>
</template>
```

Bien que cela fonctionne dans des cas simples, un état global qui peut être arbitrairement modifié par n'importe quel composant ne sera pas très facile à maintenir à long terme. Pour s'assurer que la logique de modification de l'état soit centralisée comme l'état lui-même, il est recommandé de définir des méthodes sur le store avec des noms qui expriment l'intention des actions :

```js{6-8}
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
```

```vue-html{2}
<template>
  <button @click="store.increment()">
    From B: {{ store.count }}
  </button>
</template>
```

<div class="composition-api">

[Essayer en ligne](https://play.vuejs.org/#eNrNkk1uwyAQha8yYpNEiUzXllPVrtRTeJNSqtLGgGBsVbK4ewdwnT9FWWSTFczwmPc+xMhqa4uhl6xklRdOWQQvsbfPrVadNQ7h1dCqpcYaPp3pYFHwQyteXVxKm0tpM0krnm3IgAqUnd3vUFIFUB1Z8bNOkzoVny+wDTuNcZ1gBI/GSQhzqlQX3/5Gng81pA1t33tEo+FF7JX42bYsT1BaONlRguWqZZMU4C261CWMk3EhTK8RQphm8Twse/BscoUsvdqDkTX3kP3nI6aZwcmdQDUcMPJPabX8TQphtCf0RLqd1csxuqQAJTxtYnEUGtIpAH4pn1Ou17FDScOKhT+QNAVM)

</div>
<div class="options-api">

[Essayer en ligne](https://play.vuejs.org/#eNrdU8FqhDAU/JVHLruyi+lZ3FIt9Cu82JilaTWR5CkF8d8bE5O1u1so9FYQzAyTvJnRTKTo+3QcOMlIbpgWPT5WUnS90gjPyr4ll1jAWasOdim9UMum3a20vJWWqxSgkvzTyRt+rocWYVpYFoQm8wRsJh+viHLBcyXtk9No2ALkXd/WyC0CyDfW6RVTOiancQM5ku+x7nUxgUGlOcwxn8Ppu7HJ7udqaqz3SYikOQ5aBgT+OA9slt9kasToFnb5OiAqCU+sFezjVBHvRUimeWdT7JOKrFKAl8VvYatdI6RMDRJhdlPtWdQf5mdQP+SHdtyX/IftlH9pJyS1vcQ2NK8ZivFSiL8BsQmmpMG1s1NU79frYA1k8OD+/I3pUA6+CeNdHg6hmoTMX9pPSnk=)

</div>

:::tip
Notez que le gestionnaire de clic utilise `store.increment()` avec des parenthèses - cela est nécessaire pour appeler la méthode avec le contexte `this` adapté puisqu'il ne s'agit pas d'une méthode de composant.
:::

Bien que nous utilisions ici un seul objet réactif en guise de store, vous pouvez également partager un état réactif créé à l'aide d'autres [API de réactivité](/api/reactivity-core) telles que `ref()` ou `computed()`, ou même renvoyer un état global à partir d'un [Composable](/guide/reusability/composables) :

```js
import { ref } from 'vue'

// état global, créé dans la portée du module
const globalCount = ref(1)

export function useCount() {
  // état local, créé composant par composant
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```

Le fait que le système de réactivité de Vue soit découplé du modèle de composants le rend extrêmement flexible.

## Considérations relatives au SSR {#ssr-considerations}

Si vous construisez une application qui utilise le [Server-Side Rendering (SSR)](./ssr), le modèle ci-dessus peut entraîner des problèmes car le store est un singleton partagé entre plusieurs requêtes. Ce problème est abordé avec [plus de détails](./ssr#cross-request-state-pollution) dans le guide SSR.

## Pinia {#pinia}

Si notre solution de gestion d'état à la main suffit dans les scénarios simples, il y a beaucoup plus d'éléments à prendre en compte dans les applications de production à grande échelle :

- Des conventions plus solides pour la collaboration en équipe
- L'intégration avec les Vue DevTools, y compris la timeline, l'inspection des composants et le débogage par voyage dans le temps.
- Remplacement de module à chaud
- Prise en charge du rendu côté serveur

[Pinia](https://pinia.vuejs.org) est une bibliothèque de gestion d'état qui implémente tout ce qui précède. Elle est maintenue par l'équipe principale de Vue, et fonctionne à la fois avec Vue 2 et Vue 3.

Les utilisateurs actuels connaissent peut-être [Vuex](https://vuex.vuejs.org/), l'ancienne bibliothèque officielle de gestion d'état pour Vue. Pinia jouant le même rôle dans l'écosystème, Vuex est désormais en mode maintenance. Elle fonctionne toujours, mais ne proposera plus de nouvelles fonctionnalités. Il est recommandé d'utiliser Pinia pour les nouvelles applications.

Pinia a commencé comme une exploration de ce à quoi pourrait ressembler la prochaine itération de Vuex, incorporant de nombreuses idées issues des discussions de l'équipe centrale pour Vuex 5. Finalement, nous avons réalisé que Pinia implémentait déjà la plupart de ce que nous voulions dans Vuex 5, et donc nous avons finalement décidé d'en faire la nouvelle recommandation.

Par rapport à Vuex, Pinia offre une API plus simple avec moins de fioritures, propose des API de type Composition-API et, surtout, dispose d'une solide prise en charge de l'inférence de type lorsqu'elle est utilisée avec TypeScript.
