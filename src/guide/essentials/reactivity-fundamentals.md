---
outline: deep
---

# Fondamentaux de la réactivité {#reactivity-fundamentals}

:::tip Préférence d'API
Cette page et de nombreux autres chapitres plus loin dans le guide contiennent un contenu différent pour l'Options API et la Composition API. Actuellement, votre préférence est <span class="options-api">l'Options API</span><span class="composition-api">la Composition API</span>. Vous pouvez passer d'un style d'API à l'autre à l'aide des boutons "Préférence d'API" situés en haut de la barre latérale gauche.
:::

<div class="options-api">

## Déclarer un état réactif \* {#declaring-reactive-state}

Avec l'Options API, nous utilisons l'option `data` pour déclarer l'état réactif d'un composant. La valeur de l'option doit être une fonction qui renvoie un objet. Vue appellera la fonction lors de la création d'une nouvelle instance de composant, et enveloppera l'objet retourné dans son système de réactivité. Toutes les propriétés de premier niveau de cet objet sont transmises à l'instance du composant (`this` dans les méthodes et dans les hooks du cycle de vie) :

```js{2-6}
export default {
  data() {
    return {
      count: 1
    }
  },

  // `mounted` est un hook du cycle de vie que nous aborderons plus tard
  mounted() {
    // `this` fait référence à l'instance du composant.
    console.log(this.count) // => 1

    // les données peuvent également être mutées
    this.count = 2
  }
}
```

[Essayer en ligne](https://play.vuejs.org/#eNpFUNFqhDAQ/JXBpzsoHu2j3B2U/oYPpnGtoetGkrW2iP/eRFsPApthd2Zndilex7H8mqioimu0wY16r4W+Rx8ULXVmYsVSC9AaNafz/gcC6RTkHwHWT6IVnne85rI+1ZLr5YJmyG1qG7gIA3Yd2R/LhN77T8y9sz1mwuyYkXazcQI2SiHz/7iP3VlQexeb5KKjEKEe2lPyMIxeSBROohqxVO4E6yV6ppL9xykTy83tOQvd7tnzoZtDwhrBO2GYNFloYWLyxrzPPOi44WWLWUt618txvASUhhRCKSHgbZt2scKy7HfCujGOqWL9BVfOgyI=)

Ces propriétés d'instance ne sont ajoutées que lors de la première création de l'instance, vous devez donc vous assurer qu'elles sont toutes présentes dans l'objet retourné par la fonction `data`. Si besoin, utilisez `null`, `undefined` ou une autre valeur temporaire pour les propriétés pour lesquelles la valeur souhaitée n'est pas encore disponible.

Vous pouvez ajouter une nouvelle propriété directement à `this` sans l'inclure dans `data`. Cependant, les propriétés ajoutées de cette manière ne pourront pas déclencher de mises à jour réactives.

Vue utilise un préfixe `$` lorsqu'il expose ses propres API natives via l'instance du composant. Il réserve également le préfixe `_` pour les propriétés internes. Il faut éviter d'utiliser des noms qui commencent par l'un de ces caractères pour les propriétés `data` à sa racine.

### Proxy réactif vs. original \* {#reactive-proxy-vs-original}

Dans Vue 3, les données sont rendues dynamiques en tirant parti des [proxys JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Les utilisateurs venant de Vue 2 doivent être conscients du cas limite suivant :

```js
export default {
  data() {
    return {
      someObject: {}
    }
  },
  mounted() {
    const newObject = {}
    this.someObject = newObject

    console.log(newObject === this.someObject) // faux
  }
}
```

Lorsque vous accédez à `this.someObject` après lui avoir assigné une valeur, la valeur est un proxy réactif de l'objet d'origine `newObject`. **Contrairement à Vue 2, le `newObject` d'origine reste intact et ne sera pas rendu réactif : assurez-vous de toujours accéder à l'état réactif comme une propriété de `this`.**

</div>

<div class="composition-api">

## Déclarer un état réactif \*\* {#declaring-reactive-state-1}

### `ref()` \*\* {#ref}

Avec la Composition API, la méthode recommandée pour déclarer l'état réactif consiste à utiliser la fonction [`ref()`](/api/reactivity-core#ref) :

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` prend l'argument et le renvoie enveloppé dans un objet ref avec une propriété `.value` :

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

> Voir aussi : [Typer les variables réactives](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

Pour utiliser un état réactif dans le template d'un composant, déclarez et renvoyez-le depuis la fonction `setup()` du composant :

```js{5,9-11}
import { ref } from 'vue'

export default {
  // `setup` est un hook spécial dédié à la Composition API.
  setup() {
    const count = ref(0)

    // expose l'état au template
    return {
      count
    }
  }
}
```

```vue-html
<div>{{ count }}</div>
```

Notez que nous n'avons **pas** besoin d'ajouter `.value` lors de l'utilisation de la ref dans le template. Pour plus de commodité, les refs sont automatiquement déballées lorsqu'elles sont utilisées dans des templates (avec quelques [pièges](#caveat-when-unwrapping-in-templates)).

Vous pouvez également muter une ref directement dans les gestionnaires d'événements :

```vue-html{1}
<button @click="count++">
  {{ count }}
</button>
```

Pour une logique plus complexe, nous pouvons déclarer des fonctions qui modifient les refs dans la même portée et les exposer en tant que méthodes à côté de l'état :

```js{7-10,15}
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      // .value est nécessaire en JavaScript
      count.value++
    }

    // n'oubliez pas d'également exposer la fonction.
    return {
      count,
      increment
    }
  }
}
```

Les méthodes exposées sont généralement utilisées comme écouteurs d'événements :

```vue-html{1}
<button @click="increment">
  {{ count }}
</button>
```

Voici l'exemple sur [Codepen](https://codepen.io/vuejs-examples/pen/WNYbaqo), sans utiliser d'outils de build.

### `<script setup>` \*\* {#script-setup}

Exposer manuellement l'état et les méthodes via `setup()` peut être verbeux. Heureusement, cela peut être évité avec l'utilisation de [composants monofichiers (SFC)](/guide/scaling-up/sfc). Nous pouvons simplifier l'utilisation avec `<script setup>` :

```vue{1}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

[Essayer en ligne](https://play.vuejs.org/#eNo9jUEKgzAQRa8yZKMiaNcllvYe2dgwQqiZhDhxE3L3jrW4/DPvv1/UK8Zhz6juSm82uciwIef4MOR8DImhQMIFKiwpeGgEbQwZsoE2BhsyMUwH0d66475ksuwCgSOb0CNx20ExBCc77POase8NVUN6PBdlSwKjj+vMKAlAvzOzWJ52dfYzGXXpjPoBAKX856uopDGeFfnq8XKp+gWq4FAi)

Les importations de premier niveau et les variables déclarées dans `<script setup>` sont automatiquement utilisables dans le template du même composant. Considérez le template comme une fonction JavaScript déclarée dans la même portée - il a naturellement accès à tout ce qui est déclaré à ses côtés.

:::tip
Pour le reste du guide, nous utiliserons principalement la syntaxe monofichier + `<script setup>` pour les exemples de code de la Composition API, car c'est l'utilisation la plus courante pour les développeurs Vue.

Si vous n'utilisez pas SFC, vous pouvez toujours utiliser la Composition API avec l'option [`setup()`](/api/composition-api-setup).
:::


### Pourquoi Refs ? \*\* {#why-refs}

Lorsque vous utilisez une ref dans un template et modifiez la valeur de la ref ultérieurement, Vue détecte automatiquement le changement et met à jour le DOM en conséquence. Ceci est possible grâce à un système de réactivité basé sur le suivi des dépendances. Lorsqu'un composant est rendu pour la première fois, Vue **trace** toutes les refs utilisées pendant le rendu. Plus tard, lorsqu'une ref est modifiée, elle **déclenche** un nouveau rendu pour les composants qui la suivent.

En JavaScript standard, il n'existe aucun moyen de détecter l'accès ou la mutation de variables simples. Cependant, il est possible d'intercepter les opérations get et set des propriétés d'un objet à l'aide des méthodes accesseur et mutateur.

La propriété `.value` donne à Vue la possibilité de détecter quand une ref a été consultée ou mutée. Sous le capot, Vue effectue le suivi dans son accesseur, et effectue le déclenchement dans son mutateur. Conceptuellement, vous pouvez considérer une ref comme un objet qui ressemble à ceci :

```js
// pseudo-code, pas la mise en œuvre effective
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```

Une autre caractéristique intéressante des refs est que, contrairement aux variables ordinaires, vous pouvez passer des refs dans des fonctions tout en conservant l'accès à la dernière valeur et à la connexion de la réactivité. Cela s'avère particulièrement utile lors de la refonte d'une logique complexe en un code réutilisable.

Le système de réactivité est décrit plus en détail dans la section [La réactivité en détails](/guide/extras/reactivity-in-depth).
</div>

<div class="options-api">

## Déclarer des méthodes \* {#declaring-methods}

<VueSchoolLink href="https://vueschool.io/lessons/methods-in-vue-3" title="Free Vue.js Methods Lesson"/>

Pour ajouter des méthodes à une instance d'un composant, nous utilisons l'option `methods`. Il doit s'agir d'un objet contenant les méthodes souhaitées :

```js{7-11}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    // les méthodes peuvent être appellées dans les hooks du cycle de vie, ou dans d'autres méthodes !
    this.increment()
  }
}
```

Vue lie automatiquement la valeur `this` pour `methods` afin qu'elle se réfère toujours à l'instance du composant. Cela garantit qu'une méthode conserve la bonne valeur `this` si elle est utilisée comme un écouteur d'événement ou comme une fonction de rappel. Vous devez éviter d'utiliser des fonctions fléchées lorsque vous définissez des méthodes, car cela empêche Vue de lier la valeur `this` appropriée :

```js
export default {
  methods: {
    increment: () => {
      // À éviter: pas d'accès à `this` ici!
    }
  }
}
```

Comme toutes les autres propriétés de l'instance du composant, les `méthodes` sont accessibles depuis le template du composant. Dans un template, elles sont le plus souvent utilisées comme des écouteurs d'événements :

```vue-html
<button @click="increment">{{ count }}</button>
```

[Essayer en ligne](https://play.vuejs.org/#eNplj9EKwyAMRX8l+LSx0e65uLL9hy+dZlTWqtg4BuK/z1baDgZicsPJgUR2d656B2QN45P02lErDH6c9QQKn10YCKIwAKqj7nAsPYBHCt6sCUDaYKiBS8lpLuk8/yNSb9XUrKg20uOIhnYXAPV6qhbF6fRvmOeodn6hfzwLKkx+vN5OyIFwdENHmBMAfwQia+AmBy1fV8E2gWBtjOUASInXBcxLvN4MLH0BCe1i4Q==)

Dans l'exemple ci-dessus, la méthode `increment` sera appelée lorsque l'on clique sur le `<button>`.

</div>

### Réactivité profonde {#deep-reactivity}

<div class="options-api">

Dans Vue, l'état est profondément réactif par défaut. Cela signifie que vous pouvez vous attendre à ce que les changements soient détectés même lorsque vous modifiez des objets ou des tableaux imbriqués :

```js
export default {
  data() {
    return {
      obj: {
        nested: { count: 0 },
        arr: ['foo', 'bar']
      }
    }
  },
  methods: {
    mutateDeeply() {
      // cela va fonctionner comme prévu.
      this.obj.nested.count++
      this.obj.arr.push('baz')
    }
  }
}
```

</div>

<div class="composition-api">

Les refs peuvent contenir n'importe quel type de valeur, y compris des objets profondément imbriqués, des tableaux ou des structures de données JavaScript natives comme `Map`.

Une ref rendra sa valeur profondément réactive. Cela signifie que vous pouvez vous attendre à ce que les changements soient détectés même lorsque vous mutez des objets imbriqués ou des tableaux :

```js
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // cela va fonctionner comme prévu.
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```

Les valeurs non primitives sont transformées en proxies réactifs via [`reactive()`](#reactive), ce qui est expliqué ci-dessous.

Il est également possible de renoncer à la réactivité profonde avec [shallow refs](/api/reactivity-advanced#shallowref). Pour les refs peu profondes, seul l'accès à `.value` est suivi pour la réactivité. Les refs peu profondes peuvent être utilisées pour optimiser les performances en évitant le coût d'observation des gros objets, ou dans les cas où l'état interne est géré par une bibliothèque externe.

Pour en savoir plus :

- [Réduire la surcharge de réactivité pour les grandes structures immuables](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
- [Intégration avec des systèmes externes de gestion d'état](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

</div>

### Timing de mise à jour du DOM {#dom-update-timing}

Lorsque vous modifiez un état réactif, le DOM est automatiquement mis à jour. Toutefois, il convient de noter que les mises à jour du DOM ne sont pas appliquées de manière synchrone. En effet, Vue les met en mémoire tampon jusqu'au prochain "tick" du cycle de mises à jour pour s'assurer que chaque composant ne soit mis à jour qu'une seule fois, quel que soit le nombre de modifications d'état que vous avez effectuées.

Pour attendre que la mise à jour du DOM soit terminée après un changement d'état, vous pouvez utiliser l'API globale [nextTick()](/api/general#nexttick) :

<div class="composition-api">

```js
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // Maintenant le DOM est mis à jour
}
```

</div>
<div class="options-api">

```js
import { nextTick } from 'vue'

export default {
  methods: {
    async increment() {
      this.count++
      await nextTick()
      // Maintenant le DOM est mis à jour
    }
  }
}
```

</div>

<div class="composition-api">

## `reactive()` \*\* {#reactive}

Il existe une autre façon de déclarer un état réactif, avec l'API `reactive()`. Contrairement à une ref qui enveloppe la valeur interne dans un objet spécial, `reactive()` rend un objet lui-même réactif :

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

> Voir aussi : [Typer reactive()](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

Utilisation dans le template :

```vue-html
<button @click="state.count++">
  {{ state.count }}
</button>
```

Les objets réactifs sont des [proxys JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Proxy) et se comportent comme des objets classiques. La différence est que Vue est capable de traquer l'accès aux propriétés et les mutations d'un objet réactif.

`reactive()` convertit l'objet en profondeur : les objets imbriqués sont également enveloppés par `reactive()` lorsqu'on y accède. Il est également appelé par `ref()` en interne lorsque la valeur de ref est un objet. Comme pour les refs peu profondes, il existe aussi l'API [`shallowReactive()`](/api/reactivity-advanced#shallowreactive) pour choisir de ne pas utiliser la réactivité profonde.

### Proxy réactif vs. original \*\* {#reactive-proxy-vs-original-1}

Il est important de noter que la valeur retournée par `reactive()` est un [proxy](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Proxy) de l'objet original, qui n'est pas égal à l'objet original :

```js
const raw = {}
const proxy = reactive(raw)

// le proxy n'est PAS égal à l'original.
console.log(proxy === raw) // faux
```

Seul le proxy est réactif - muter l'objet original ne déclenchera pas de mises à jour. Par conséquent, la meilleure pratique pour travailler avec le système de réactivité de Vue est d'utiliser **exclusivement les versions proxifiées de votre état**.

Pour assurer un accès cohérent au proxy, appeler `reactive()` sur le même objet retournera toujours le même proxy, et appeler `reactive()` sur un proxy existant retournera également ce même proxy :

```js
// appeler reactive() sur le même objet retourne le même proxy
console.log(reactive(raw) === proxy) // true

// appeler reactive() sur un proxy se retourne lui-même
console.log(reactive(proxy) === proxy) // vrai
```

Cette règle s'applique tout aussi bien aux objets imbriqués. En raison de la réactivité profonde, les objets imbriqués à l'intérieur d'un objet réactif sont également des proxys :

```js
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### Limitations de `reactive()` \*\* {#limitations-of-reactive}

L'API `reactive()` a quelques limitations :

1. **Types limités :** Elle ne fonctionne que pour les types d'objets (objets, tableaux et [objets de type collections](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects#collections_indexées) tels que `Map` et `Set`). Elle ne peut pas contenir les [types primitifs](https://developer.mozilla.org/fr/docs/Glossary/Primitive) tels que `string`, `number` ou `boolean`.

2. **Remplacement impossible de l'intégralité de l'objet :** Comme le suivi de la réactivité de Vue fonctionne sur l'accès aux propriétés, nous devons toujours conserver la même référence à l'objet réactif. Cela signifie que nous ne pouvons pas facilement "remplacer" un objet réactif car la connexion de réactivité à la première référence serait perdue :

   ```js
   let state = reactive({ count: 0 })

   // la référence précédente ({ count: 0 }) n'est plus suivie
   // (la connexion de réactivité est perdue !)
   state = reactive({ count: 1 })
   ```

3. **Ne fonctionne pas avec la destructuration :** lorsque nous déstructurons la propriété de type primitif d'un objet réactif en variables locales, ou lorsque nous passons cette propriété dans une fonction, nous perdons la connexion à la réactivité :

   ```js
   const state = reactive({ count: 0 })

   // count est déconnecté de state.count lorsqu'il est déstructuré.
   let { count } = state
   // n'affecte pas l'état original
   count++

   // la fonction reçoit un simple nombre et
   // ne sera pas capable de traquer les changements de state.count
   // nous devons passer l'objet entier pour conserver la réactivité
   callSomeFunction(state.count)
   ```


À cause de ces limites, nous recommandons l'usage de `ref()` en tant qu'API principale pour déclarer un état réactif.

### En tant que propriété d'un objet réactif \*\* {#ref-unwrapping-as-reactive-object-property}

Une ref est automatiquement déballée lorsqu'elle est accédée ou mutée en tant que propriété d'un objet réactif. En d'autres termes, elle se comporte comme une propriété normale :

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

Si une nouvelle ref est attribuée à une propriété liée à une ref existante, elle remplacera l'ancienne ref :

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// la ref originale est maintenant déconnectée de state.count
console.log(count.value) // 1
```

Le déballage de ref ne se produit que lorsqu'elle est imbriquée dans un objet réactif profond. Il ne s'applique pas lorsqu'elle est accédée en tant que propriété d'une [shallowReactive](/api/reactivity-advanced#shallowreactive).

### Pièges lors de déballage de tableaux et collections \*\* {#caveat-in-arrays-and-collections}

Contrairement aux objets réactifs, il n'y a **pas** de déballage effectué lorsque la ref est accédée en tant qu'élément d'un tableau réactif ou d'un type de collection natif comme `Map` :

```js
const books = reactive([ref('Vue 3 Guide')])
// il faut ici .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// il faut ici .value
console.log(map.get('count').value)
```

### Pièges lors de déballage dans les templates \*\* {#caveat-when-unwrapping-in-templates}

Le déballage de ref dans les templates ne s'applique que si la ref est une propriété de premier niveau dans le contexte de rendu du template.

Dans l'exemple ci-dessous, `count` et `object` sont des propriétés de premier niveau, mais `object.id` ne l'est pas :

```js
const count = ref(0)
const object = { id: ref(1) }
```

Cette expression fonctionne donc comme prévu :

```vue-html
{{ count + 1 }}
```

...alors que celui-ci ne le fait **PAS** :

```vue-html
{{ object.id + 1 }}
```

Le résultat rendu sera `[object Object]1` car `object.id` n'est pas déballé lors de l'évaluation de l'expression et reste un objet ref. Pour résoudre ce problème, nous pouvons déstructurer `id` en une propriété de premier niveau :

```js
const { id } = object
```

```vue-html
{{ id + 1 }}
```

Désormais le résultat rendu sera `2`.

Une autre chose à noter est qu'une ref est déballée s'il s'agit de la valeur finale évaluée d'une interpolation de texte (c'est-à-dire une balise <code v-pre>{{ }}</code>), donc ce qui suit rendra `1` :

```vue-html
{{ object.id }}
```

Il s'agit d'une fonctionnalité de commodité de l'interpolation de texte et est équivalent à <code v-pre>{{ object.id.value }}</code>.

</div>

<div class="options-api">

### Méthodes avec état \* {#stateful-methods}

Dans certains cas, nous pouvons avoir besoin de créer dynamiquement une méthode, par exemple en créant un gestionnaire d'événements _debounced_ :

```js
import { debounce } from 'lodash-es'

export default {
  methods: {
    // Debounce avec Lodash
    click: debounce(function () {
      // ... répond au clic ...
    }, 500)
  }
}
```

Toutefois, cette approche est problématique pour les composants réutilisés, car une fonction debounced possède un **état** : elle maintient un état interne sur le temps écoulé. Si plusieurs instances de composants partagent la même fonction debounced, elles interféreront les unes avec les autres.

Pour que la fonction debounced de chaque instance de composant soit indépendante des autres, nous pouvons créer la version debounced dans le hook de cycle de vie `created` :

```js
export default {
  created() {
    // chaque instance a maintenant sa propre copie du gestionnaire debounced
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // c'est aussi une bonne idée d'annuler le minuteur
    // lorsque le composant est supprimé
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... répond au clic ...
    }
  }
}
```

</div>
