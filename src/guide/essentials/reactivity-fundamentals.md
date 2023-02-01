---
outline: deep
---

# Fondamentaux de la réactivité {#reactivity-fundamentals}

:::tip Préférence d'API
Cette page et de nombreux autres chapitres plus loin dans le guide contiennent un contenu différent pour l'Options API et la Composition API. Actuellement, votre préférence est <span class="options-api">l'Options API</span><span class="composition-api">la Composition API</span>. Vous pouvez passer d'un style d'API à l'autre à l'aide des boutons "Préférence d'API" situés en haut de la barre latérale gauche.
:::

## Déclarer un état réactif {#declaring-reactive-state}

<div class="options-api">

Avec l'Options API, nous utilisons l'option `data` pour déclarer l'état réactif d'un composant. La valeur de l'option doit être une fonction qui renvoie un objet. Vue appellera la fonction lors de la création d'une nouvelle instance de composant, et enveloppera l'objet retourné dans son système de réactivité. Toutes les propriétés de premier niveau de cet objet sont transmises à l'instance du composant (`this` dans les méthodes et dans les hooks du cycle de vie).:

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

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY291bnQ6IDFcbiAgICB9XG4gIH0sXG5cbiAgLy8gYG1vdW50ZWRgIGlzIGEgbGlmZWN5Y2xlIGhvb2sgd2hpY2ggd2Ugd2lsbCBleHBsYWluIGxhdGVyXG4gIG1vdW50ZWQoKSB7XG4gICAgLy8gYHRoaXNgIHJlZmVycyB0byB0aGUgY29tcG9uZW50IGluc3RhbmNlLlxuICAgIGNvbnNvbGUubG9nKHRoaXMuY291bnQpIC8vID0+IDFcblxuICAgIC8vIGRhdGEgY2FuIGJlIG11dGF0ZWQgYXMgd2VsbFxuICAgIHRoaXMuY291bnQgPSAyXG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIENvdW50IGlzOiB7eyBjb3VudCB9fVxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

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

Nous pouvons créer un objet ou un tableau réactif avec la fonction [`reactive()`](/api/reactivity-core.html#reactive) :

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

Les objets réactifs sont des [proxys JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Proxy) et se comportent comme des objets classiques. La différence est que Vue est capable de traquer l'accès aux propriétés et les mutations d'un objet réactif. Si vous êtes curieux de connaître les détails, nous expliquons comment fonctionne le système de réactivité de Vue dans [Reactivity in Depth](/guide/extras/reactivity-in-depth.html) - mais nous vous recommandons de le lire après avoir terminé le guide principal.

See also: [Typing Reactive](/guide/typescript/composition-api.html#typing-reactive) <sup class="vt-badge ts" />

Pour utiliser un état réactif dans le template d'un composant, déclarez et renvoyez-le depuis la fonction `setup()` du composant :

```js{5,9-11}
import { reactive } from 'vue'

export default {
  // `setup` est un hook spécial conçu pour la Composition API.
  setup() {
    const state = reactive({ count: 0 })

    // expose l'état au template
    return {
      state
    }
  }
}
```

```vue-html
<div>{{ state.count }}</div>
```

De la même manière, nous pouvons déclarer des fonctions qui modifient l'état réactif dans la même portée et les exposer en tant que méthodes au côté de l'état :

```js{7-9,14}
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({ count: 0 })

    function increment() {
      state.count++
    }

    // n'oubliez pas d'également exposer la fonction.
    return {
      state,
      increment
    }
  }
}
```

Les méthodes exposées sont généralement utilisées comme écouteurs d'événements :

```vue-html
<button @click="increment">
  {{ state.count }}
</button>
```

### `<script setup>` \*\* {#script-setup}

Exposer manuellement l'état et les méthodes via `setup()` peut être verbeux. Heureusement, cela n'est nécessaire que lorsqu'on n'utilise pas d'outil de build. Lorsque l'on utilise des composants monofichiers, nous pouvons grandement simplifier l'utilisation avec `<script setup>` :

```vue
<script setup>
import { reactive } from 'vue'

const state = reactive({ count: 0 })

function increment() {
  state.count++
}
</script>

<template>
  <button @click="increment">
    {{ state.count }}
  </button>
</template>
```

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlYWN0aXZlIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBzdGF0ZSA9IHJlYWN0aXZlKHsgY291bnQ6IDAgfSlcblxuZnVuY3Rpb24gaW5jcmVtZW50KCkge1xuICBzdGF0ZS5jb3VudCsrXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPlxuICAgIHt7IHN0YXRlLmNvdW50IH19XG4gIDwvYnV0dG9uPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

Les importations de premier niveau et les variables déclarées dans `<script setup>` sont automatiquement utilisables dans le template du même composant.

> Pour le reste du guide, nous utiliserons principalement la syntaxe monofichier + `<script setup>` pour les exemples de code de la Composition API, car c'est l'utilisation la plus courante pour les développeurs Vue.

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

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY291bnQ6IDBcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBpbmNyZW1lbnQoKSB7XG4gICAgICB0aGlzLmNvdW50KytcbiAgICB9XG4gIH0sXG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5pbmNyZW1lbnQoKVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPnt7IGNvdW50IH19PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

Dans l'exemple ci-dessus, la méthode `increment` sera appelée lorsque l'on clique sur le `<button>`.

</div>

### Timing de mise à jour du DOM  {#dom-update-timing}

Lorsque vous modifiez un état réactif, le DOM est automatiquement mis à jour. Toutefois, il convient de noter que les mises à jour du DOM ne sont pas appliquées de manière synchrone. En effet, Vue les met en mémoire tampon jusqu'au prochain "tick" du cycle de mises à jour pour s'assurer que chaque composant ne soit mis à jour qu'une seule fois, quel que soit le nombre de modifications d'état que vous avez effectuées.

Pour attendre que la mise à jour du DOM soit terminée après un changement d'état, vous pouvez utiliser l'API globale [nextTick()](/api/general.html#nexttick) :

<div class="composition-api">

```js
import { nextTick } from 'vue'

function increment() {
  state.count++
  nextTick(() => {
    // accès au DOM mis à jour
  })
}
```

</div>
<div class="options-api">

```js
import { nextTick } from 'vue'

export default {
  methods: {
    increment() {
      this.count++
      nextTick(() => {
        // accès au DOM mis à jour
      })
    }
  }
}
```

</div>

### Réactivité profonde {#deep-reactivity}

Dans Vue, l'état est profondément réactif par défaut. Cela signifie que vous pouvez vous attendre à ce que les changements soient détectés même lorsque vous modifiez des objets ou des tableaux imbriqués :

<div class="options-api">

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

```js
import { reactive } from 'vue'

const obj = reactive({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // cela va fonctionner comme prévu.
  obj.nested.count++
  obj.arr.push('baz')
}
```

</div>

Il est également possible de créer de manière explicite des [objets partiellement réactifs](/api/reactivity-advanced.html#shallowreactive) où la réactivité n'est traquée qu'au niveau de la racine, mais ces objets ne sont généralement nécessaires que dans des cas d'utilisation avancée.

<div class="composition-api">

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

L'API `reactive()` a deux limitations :

1. Elle ne fonctionne que pour les types d'objets (objets, tableaux et [objets de type collections](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects#collections_indexées) tels que `Map` et `Set`). Elle ne peut pas contenir les [types primitifs](https://developer.mozilla.org/fr/docs/Glossary/Primitive) tels que `string`, `number` ou `boolean`.

2. Comme le suivi de la réactivité de Vue fonctionne sur l'accès aux propriétés, nous devons toujours conserver la même référence à l'objet réactif. Cela signifie que nous ne pouvons pas facilement "remplacer" un objet réactif car la connexion de réactivité à la première référence serait perdue :

   ```js
   let state = reactive({ count: 0 })

   // la référence précédente ({ count: 0 }) n'est plus suivie (la connexion de réactivité est perdue !)
   state = reactive({ count: 1 })
   ```

   Cela signifie également que lorsque nous assignons ou déstructurons la propriété d'un objet réactif à des variables locales, ou lorsque nous passons cette propriété dans une fonction, nous perdons la connexion de réactivité :

   ```js
   const state = reactive({ count: 0 })

   // n est une variable locale qui est déconnectée
   // de state.count.
   let n = state.count
   // n'affecte pas l'état original
   n++

   // count est aussi déconnecté de state.count.
   let { count } = state
   // n'affecte pas l'état original
   count++

   // la fonction reçoit un simple nombre et
   // ne sera pas capable de traquer les changements de state.count
   callSomeFunction(state.count)
   ```

## Variables réactives avec `ref()` \*\* {#reactive-variables-with-ref}

Pour pallier aux limites de `reactive()`, Vue fournit également une fonction [`ref()`](/api/reactivity-core.html#ref) qui nous permet de créer des **"refs"** réactives pouvant contenir n'importe quel type de valeur :

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` prend l'argument et le retourne enveloppé dans un objet ref avec une propriété `.value` :

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

See also: [Typing Refs](/guide/typescript/composition-api.html#typing-ref) <sup class="vt-badge ts" />

De la même manière que pour les propriétés d'un objet réactif, la propriété `.value` d'une ref est réactive. De plus, lorsqu'elle contient des types d'objets, la ref convertit automatiquement sa `.value` avec `reactive()`.

Une ref contenant une valeur d'objet peut remplacer l'objet entier de manière réactive :

```js
const objectRef = ref({ count: 0 })

// cela fonctionne de manière réactive
objectRef.value = { count: 1 }
```

Les refs peuvent également être passées à des fonctions ou déstructurées à partir d'objets simples sans perdre leur réactivité :

```js
const obj = {
  foo: ref(1),
  bar: ref(2)
}

// la fonction reçoit une ref
// elle doit accéder à la valeur via .value mais elle
// va conserver la connexion de réactivité
callSomeFunction(obj.foo)

// toujours reactive
const { foo, bar } = obj
```

En d'autres termes, `ref()` nous permet de créer une "référence" à n'importe quelle valeur et de la faire circuler sans perdre la réactivité. Cette capacité est très importante car elle est fréquemment utilisée pour extraire la logique dans les [fonctions composables](/guide/reusability/composables.html).

### Déballage d'une ref dans les templates \*\* {#ref-unwrapping-in-templates}

Lorsque les refs sont accédées en tant que propriétés de premier niveau dans le template, elles sont automatiquement "déballées", il n'y a donc pas besoin d'utiliser `.value`. Voici l'exemple précédent du compteur, en utilisant `ref()` à la place :

```vue{13}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }} <!-- pas besoin de .value -->
  </button>
</template>
```

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgY291bnQgPSByZWYoMClcblxuZnVuY3Rpb24gaW5jcmVtZW50KCkge1xuICBjb3VudC52YWx1ZSsrXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPnt7IGNvdW50IH19PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

Notez que le déballage ne s'applique que si la référence est une propriété de premier niveau dans le contexte du rendu du template. Par exemple, `foo` est une propriété de premier niveau, mais `object.foo` ne l'est pas.

Ainsi, étant donné l'objet suivant :

```js
const object = { foo: ref(1) }
```

L'expression suivante ne fonctionnera **PAS** comme prévu :

```vue-html
{{ object.foo + 1 }}
```

Le résultat rendu sera `[object Object]` car `object.foo` est un objet ref. Nous pouvons corriger cela en faisant de `foo` une propriété de premier niveau :

```js
const { foo } = object
```

```vue-html
{{ foo + 1 }}
```

Désormais le résultat rendu sera `2`.

Une chose à noter est qu'une ref sera également déballée si elle est la valeur finale évaluée d'une interpolation de texte (par exemple une balise <code v-pre>{{ }}</code>), donc ce qui suit rendra `1`:

```vue-html
{{ object.foo }}
```

Il s'agit simplement d'une fonctionnalité pratique de l'interpolation de texte et elle est équivalente à <code v-pre>{{ objet.foo.value }}</code>.

### Déballage d'une ref dans des objets réactifs \*\* {#ref-unwrapping-in-reactive-objects}

Lorsqu'une `ref` est accédée ou mutée en tant que propriété d'un objet réactif, elle est également automatiquement déballée, donc elle se comporte comme une propriété normale :

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
// la ref originale est désormais déconnectée de state.count
console.log(count.value) // 1
```

Le déballage des refs ne se produit que lorsqu'elles sont imbriquées dans un objet réactif profond. Il ne s'applique pas lorsqu'on y accède en tant que propriété d'un [objet partiellement réactif](/api/reactivity-advanced.html#shallowreactive).

### Déballage d'une ref dans les tableaux et les collections {#ref-unwrapping-in-arrays-and-collections}

Contrairement aux objets réactifs, aucun déballage n'est effectué lorsque la ref est accédée en tant qu'élément d'un tableau réactif ou d'un type de collection natif comme `Map` :

```js
const books = reactive([ref('Vue 3 Guide')])
// besoin de .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// besoin de .value
console.log(map.get('count').value)
```

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

<div class="composition-api">

## Reactivity Transform <sup class="vt-badge experimental" /> \*\* {#reactivity-transform}

Devoir utiliser `.value` avec les refs est un inconvénient imposé par les contraintes du langage JavaScript. Cependant, grâce aux transformations à la compilation nous pouvons améliorer l'ergonomie en ajoutant automatiquement `.value` aux endroits appropriés. Vue fournit une transformation compilatoire qui nous permet d'écrire l'exemple précédent du "compteur" comme ceci :

```vue
<script setup>
let count = $ref(0)

function increment() {
  // pas besoin de .value
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

Vous pouvez en savoir plus sur [Reactivity Transform](/guide/extras/reactivity-transform.html) dans la section qui lui est consacrée. Notez qu'elle est actuellement encore expérimentale et peut être modifiée avant d'être finalisée.

</div>
