# Propriétés calculées {#computed-properties}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/computed-properties-in-vue-3" title="Free Vue.js Computed Properties Lesson"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-computed-properties-in-vue-with-the-composition-api" title="Free Vue.js Computed Properties Lesson"/>
</div>

## Exemple basique {#basic-example}

Les expressions dans le template sont pratiques, mais elles sont destinées à des opérations simples. Mettre trop de logique dans vos templates peut les encombrer et les rendre difficiles à maintenir. Par exemple, si nous avons un objet avec un tableau imbriqué :

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})
```

</div>

Et que nous voulons afficher des messages différents selon que `author` contiennent déjà ou non des livres :

```vue-html
<p>Has published books:</p>
<span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>
```

A ce stade, le template devient un peu chargé. Nous devons bien l'examiner avant de réaliser qu'il effectue une opération dépendante de `author.books`. Plus important encore, nous ne voulons sûrement pas nous répéter si nous avons besoin de cette opération dans le template plus d'une fois.

C'est pourquoi pour des logiques complexes incluant des données réactives, il est recommandé d'utiliser une **propriété calculée**. Voici le même exemple, refactorisé :

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  },
  computed: {
    // un accesseur calculé
    publishedBooksMessage() {
      // `this` pointe sur l'instance du composant
      return this.author.books.length > 0 ? 'Yes' : 'No'
    }
  }
}
```

```vue-html
<p>Has published books:</p>
<span>{{ publishedBooksMessage }}</span>
```

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYXV0aG9yOiB7XG4gICAgICAgIG5hbWU6ICdKb2huIERvZScsXG4gICAgICAgIGJvb2tzOiBbXG4gICAgICAgICAgJ1Z1ZSAyIC0gQWR2YW5jZWQgR3VpZGUnLFxuICAgICAgICAgICdWdWUgMyAtIEJhc2ljIEd1aWRlJyxcbiAgICAgICAgICAnVnVlIDQgLSBUaGUgTXlzdGVyeSdcbiAgICAgICAgXVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgY29tcHV0ZWQ6IHtcbiAgICBwdWJsaXNoZWRCb29rc01lc3NhZ2UoKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdXRob3IuYm9va3MubGVuZ3RoID4gMCA/ICdZZXMnIDogJ05vJ1xuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPHA+SGFzIHB1Ymxpc2hlZCBib29rczo8L3A+XG4gIDxzcGFuPnt7IGF1dGhvci5ib29rcy5sZW5ndGggPiAwID8gJ1llcycgOiAnTm8nIH19PC9zcGFuPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

Ici nous avons déclaré une propriété calculée `publishedBooksMessage`.

Essayez de changer la valeur du tableau `books` dans l'application `data` et vous remarquerez comment `publishedBooksMessage` change en conséquence.

Vous pouvez lier des données à des propriétés calculées dans les templates comme pour une propriété normale. Vue sait que `this.publishedBooksMessage` dépend de `this.author.books`, donc il va mettre à jour les liaisons dépendantes de `this.publishedBooksMessage` lorsque `this.author.books` change.

Voir aussi : [Typing Computed Properties](/guide/typescript/options-api.html#typing-computed-properties) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

```vue
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// a computed ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlYWN0aXZlLCBjb21wdXRlZCB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgYXV0aG9yID0gcmVhY3RpdmUoe1xuICBuYW1lOiAnSm9obiBEb2UnLFxuICBib29rczogW1xuICAgICdWdWUgMiAtIEFkdmFuY2VkIEd1aWRlJyxcbiAgICAnVnVlIDMgLSBCYXNpYyBHdWlkZScsXG4gICAgJ1Z1ZSA0IC0gVGhlIE15c3RlcnknXG4gIF1cbn0pXG5cbi8vIGEgY29tcHV0ZWQgcmVmXG5jb25zdCBwdWJsaXNoZWRCb29rc01lc3NhZ2UgPSBjb21wdXRlZCgoKSA9PiB7XG4gIHJldHVybiBhdXRob3IuYm9va3MubGVuZ3RoID4gMCA/ICdZZXMnIDogJ05vJ1xufSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxwPkhhcyBwdWJsaXNoZWQgYm9va3M6PC9wPlxuICA8c3Bhbj57eyBwdWJsaXNoZWRCb29rc01lc3NhZ2UgfX08L3NwYW4+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

Ici nous avons déclaré une propriété calculée `publishedBooksMessage`. La fonction `computed()` prend une fonction accesseur en argument, et la valeur retournée est une **ref calculée**. De la même manière que pour les refs classiques, vous pouvez accéder au résultat calculé grâce à `publishedBooksMessage.value`. Les refs calculées sont automatiquement déballées dans les templates de manière à ce que vous puissiez y faire référence sans `.value` dans les expressions au sein du template.

Une propriété calculée traque automatiquement ses dépendances réactives. Vue sait que le calcul de `publishedBooksMessage` dépend de `author.books`, donc il va mettre à jour les liaisons dépendantes de `publishedBooksMessage` lorsque `author.books` change.

Voir aussi : [Typing Computed](/guide/typescript/composition-api.html#typing-computed) <sup class="vt-badge ts" />

</div>

## Propriétés calculées mises en cache vs.. les méthodes {#computed-caching-vs-methods}

Vous avez peut-être remarqué que nous pouvons obtenir le même résultat en invoquant une méthode dans l'expression :

```vue-html
<p>{{ calculateBooksMessage() }}</p>
```

<div class="options-api">

```js
// dans le composant
methods: {
  calculateBooksMessage() {
    return this.author.books.length > 0 ? 'Yes' : 'No'
  }
}
```

</div>

<div class="composition-api">

```js
// dans le composant
function calculateBooksMessage() {
  return author.books.length > 0 ? 'Yes' : 'No'
}
```

</div>

À la place d'une propriété calculée, nous pouvons définir la même fonction comme une méthode. Les deux approches mènent au même résultat final. Cependant, la différence est que **les propriétés calculées sont mises en cache en fonction de leurs dépendances réactives.** Une propriété calculée ne sera réévaluée que lorsque l'une de ses dépendances réactives aura changé. Cela signifie que tant que `author.books` n'a pas changé, les accès multiples à `publishedBooksMessage` vont immédiatement retourner le résultat calculé précédent sans avoir à réexécuter la fonction accesseur.

Cela signifie également que la propriété calculée suivante ne sera jamais mise à jour, car `Date.now()` n'est pas une dépendance réactive :

<div class="options-api">

```js
computed: {
  now() {
    return Date.now()
  }
}
```

</div>

<div class="composition-api">

```js
const now = computed(() => Date.now())
```

</div>

En comparaison, l'invocation d'une méthode va **toujours** exécuter la fonction, à chaque nouveau rendu.

Pourquoi avons nous besoin de la mise en cache ? Imaginons que nous ayons une propriété calculée conséquente `list`, qui nécessite de boucler à travers un important tableau et de réaliser de nombreuses opérations. Nous pourrions également avoir d'autres propriétés calculées dépendantes à leur tour de `list`. Sans mise en cache, nous exécuterions les accesseurs de `list` bien plus de fois que nécessaire ! Dans les cas où vous ne voulez pas de mise en cache, vous pouvez utiliser l'appel à une méthode.

## Propriétés calculées modifiables {#writable-computed}

Par défaut, les propriétés calculées ne sont soumises qu'aux accesseurs. Si vous essayez d'assigner une nouvelle valeur à une propriété calculée, vous aurez un avertissement au moment de l'exécution. Dans les rares cas où vous avez besoin d'une propriété calculée "modifiable", vous pouvez en créer une en lui fournissant à la fois un accesseur et un mutateur :

<div class="options-api">

```js
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    fullName: {
      // accesseur
      get() {
        return this.firstName + ' ' + this.lastName
      },
      // mutateur
      set(newValue) {
        // Note : nous utilisons ici la syntaxe d'assignation par déstructuration
        ;[this.firstName, this.lastName] = newValue.split(' ')
      }
    }
  }
}
```

Désormais lorsque vous allez exécuter `this.fullName = 'John Doe'`, le mutateur sera invoqué et `this.firstName` et `this.lastName` seront mis à jour en conséquence.

</div>

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // accesseur
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // mutateur
  set(newValue) {
    // Note : nous utilisons ici la syntaxe d'assignation par déstructuration
    ;[firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

Désormais lorsque vous allez exécuter `fullName.value = 'John Doe'`, le mutateur sera invoqué et `firstName` et `lastName` seront mis à jour en conséquence.

</div>

## Bonnes Pratiques {#best-practices}

### Les accesseurs ne doivent pas entraîner d'effets secondaires {#getters-should-be-side-effect-free}

Il est important de se rappeler que les fonctions accesseurs de propriétés calculées doivent seulement réaliser des opérations pures et ne pas entraîner d'effets secondaires. Par exemple, **ne faites pas de requêtes asynchrones ou ne mutez pas le DOM à l'intérieur d'un accesseur calculé !** Pensez à une propriété calculée comme une description déclarative de la manière d'obtenir une valeur selon d'autres valeurs - sa seule responsabilité devrait être de calculer et de retourner cette valeur. Plus loin dans le guide nous traiterons de la manière d'effectuer des effets secondaires en réaction à des changements de l'état avec les [observateurs](./watchers).

### Évitez de modifier les valeurs calculées {#avoid-mutating-computed-value}

La valeur retournée par une propriété calculée est un état dérivé. Pensez-y comme un snapshot temporaire - chaque fois que l'état de base change, un nouveau snapshot est créé. Il n'est pas logique de modifier un snapshot, donc une valeur calculée retournée ne devrait être traitée qu'en lecture seule et ne pas être modifiée - à la place, modifiez l'état de base dont elle dépend afin d'engendrer de nouveaux calculs.
