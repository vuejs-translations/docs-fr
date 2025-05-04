# Rendu de liste {#list-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/list-rendering-in-vue-3" title="Free Vue.js List Rendering Lesson"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-list-rendering-in-vue" title="Free Vue.js List Rendering Lesson"/>
</div>

## `v-for` {#v-for}

Nous pouvons utiliser la directive `v-for` pour rendre une liste d'items basée sur un tableau. La directive `v-for` nécessite une syntaxe spéciale de la forme `item in items`, où `items` est le tableau de données source et `item` est un **alias** pour l'élément du tableau sur lequel on itère :

<div class="composition-api">

```js
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>

<div class="options-api">

```js
data() {
  return {
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="item in items">
  {{ item.message }}
</li>
```

À l'intérieur de la portée du `v-for`, les expressions du template ont accès à toutes les propriétés de la portée du parent. De plus, `v-for` supporte également un second et optionnel alias pour l'index de l'item actuel :

<div class="composition-api">

```js
const parentMessage = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>
<div class="options-api">

```js
data() {
  return {
    parentMessage: 'Parent',
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```

<script setup>
const parentMessage = 'Parent'
const items = [{ message: 'Foo' }, { message: 'Bar' }]
</script>
<div class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</div>

<div class="composition-api">

[Essayer en ligne](https://play.vuejs.org/#eNpdTsuqwjAQ/ZVDNlFQu5d64bpwJ7g3LopOJdAmIRlFCPl3p60PcDWcM+eV1X8Iq/uN1FrV6RxtYCTiW/gzzvbBR0ZGpBYFbfQ9tEi1ccadvUuM0ERyvKeUmithMyhn+jCSev4WWaY+vZ7HjH5Sr6F33muUhTR8uW0ThTuJua6mPbJEgGSErmEaENedxX3Z+rgxajbEL2DdhR5zOVOdUSIEDOf8M7IULCHsaPgiMa1eK4QcS6rOSkhdfapVeQLQEWnH)

</div>
<div class="options-api">

[Essayer en ligne](https://play.vuejs.org/#eNpVTssKwjAQ/JUllyr0cS9V0IM3wbvxEOxWAm0a0m0phPy7m1aqhpDsDLMz48XJ2nwaUZSiGp5OWzpKg7PtHUGNjRpbAi8NQK1I7fbrLMkhjc5EJAn4WOXQ0BWHQb2whOS24CSN6qjXhN1Qwt1Dt2kufZ9ASOGXOyvH3GMNCdGdH75VsZVjwGa2VYQRUdVqmLKmdwcpdjEnBW1qnPf8wZIrBQujoff/RSEEyIDZZeGLeCn/dGJyCSlazSZVsUWL8AYme21i)

</div>

La portée des variables de `v-for` est similaire au JavaScript suivant :

```js
const parentMessage = 'Parent'
const items = [
  /* ... */
]

items.forEach((item, index) => {
  // a accès à `parentMessage` de la portée extérieure
  // mais `item` et `index` ne sont disponibles qu'ici
  console.log(parentMessage, item.message, index)
})
```

Remarquez comment la valeur de `v-for` correspond à la fonction signature du rappel du `forEach`. En fait, vous pouvez utiliser la déstructuration sur l'alias item du `v-for` de la même manière que la déstructuration des arguments de fonction :

```vue-html
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- avec l'index alias -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

Pour les `v-for` imbriqués, les portées fonctionnent de la même manière qu'avec les fonctions imbriquées. Chaque portée de `v-for` a accès aux portées de ses parents :

```vue-html
<li v-for="item in items">
  <span v-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>
```

Vous pouvez également utiliser `of` comme séparateur au lieu de `in`, pour que cela soit plus proche de la syntaxe JavaScript pour les itérateurs :

```vue-html
<div v-for="item of items"></div>
```

## `v-for` avec un objet {#v-for-with-an-object}

Vous pouvez également utiliser `v-for` pour itérer sur les propriétés d'un objet. L'ordre d'itération sera basé sur le résultat de l'appel à `Object.values()` sur l'objet :

<div class="composition-api">

```js
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    myObject: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
}
```

</div>

```vue-html
<ul>
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

Vous pouvez également fournir un second alias pour le nom de la propriété (aussi appelé clé) :

```vue-html
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

Et un autre pour l'index :

```vue-html
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

<div class="composition-api">

[Essayer en ligne](https://play.vuejs.org/#eNo9jjFvgzAQhf/KE0sSCQKpqg7IqRSpQ9WlWycvBC6KW2NbcKaNEP+9B7Tx4nt33917Y3IKYT9ESspE9XVnAqMnjuFZO9MG3zFGdFTVbAbChEvnW2yE32inXe1dz2hv7+dPqhnHO7kdtQPYsKUSm1f/DfZoPKzpuYdx+JAL6cxUka++E+itcoQX/9cO8SzslZoTy+yhODxlxWN2KMR22mmn8jWrpBTB1AZbMc2KVbTyQ56yBkN28d1RJ9uhspFSfNEtFf+GfnZzjP/oOll2NQPjuM4xTftZyIaU5VwuN0SsqMqtWZxUvliq/J4jmX4BTCp08A==)

</div>
<div class="options-api">

[Essayer en ligne](https://play.vuejs.org/#eNo9T8FqwzAM/RWRS1pImnSMHYI3KOwwdtltJ1/cRqXe3Ng4ctYS8u+TbVJjLD3rPelpLg7O7aaARVeI8eS1ozc54M1ZT9DjWQVDMMsBoFekNtucS/JIwQ8RSQI+1/vX8QdP1K2E+EmaDHZQftg/IAu9BaNHGkEP8B2wrFYxgAp0sZ6pn2pAeLepmEuSXDiy7oL9gduXT+3+pW6f631bZoqkJY/kkB6+onnswoDw6owijIhEMByjUBgNU322/lUWm0mZgBX84r1ifz3ettHmupYskjbanedch2XZRcAKTnnvGVIPBpkqGqPTJNGkkaJ5+CiWf4KkfBs=)

</div>

## `v-for` avec une portée {#v-for-with-a-range}

`v-for` peut également prendre un nombre entier. Dans ce cas il va répéter le template un certain nombre de fois, basé sur une portée `1...n`.

```vue-html
<span v-for="n in 10">{{ n }}</span>
```

Notez qu'ici `n` démarre avec une valeur initiale de `1` au lieu de `0`.

## `v-for` sur le `<template>` {#v-for-on-template}

Comme le modèle `v-if`, vous pouvez aussi utiliser une balise `<template>` avec `v-for` pour effectuer le rendu d'un bloc composé de plusieurs éléments. Par exemple :

```vue-html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` avec `v-if` {#v-for-with-v-if}

Lorsqu'ils existent sur le même nœud, `v-if` a une priorité plus importante que `v-for`. Cela signifie que la condition du `v-if` n'aura pas accès aux variables de la portée du `v-for` :

```vue-html
<!--
Une erreur va être levée car la propriété "todo" n'est pas définie sur l'instance.
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

Cela peut être résolu en déplaçant le `v-for` sur une balise `<template>` enveloppante (ce qui est également plus explicite) :

```vue-html
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

:::warning Note
Il n'est **pas** recommandé d'utiliser `v-if` et `v-for` sur le même élément à cause de la préséance implicite.

Il y a deux cas courants où cela peut être tentant :

- Pour filtrer les éléments d'une liste (par exemple `v-for="user in users" v-if="user.isActive"`). Dans ce cas, remplacez `users` par une nouvelle propriété calculée qui retourne votre liste filtrée (par exemple `activeUsers`).

- Pour éviter de rendre une liste si elle doit être cachée (par exemple, `v-for="user in users" v-if="shouldShowUsers"`). Dans ce cas, déplacez le `v-if` dans un élément conteneur (par exemple `ul`, `ol`).

:::

## Maintenir l'état avec `key` {#maintaining-state-with-key}

Lorsque Vue met à jour une liste d'éléments rendue avec `v-for`, il utilise par défaut une stratégie d'"ajustement sur place". Si l'ordre des données a changé, au lieu de déplacer les éléments du DOM de manière à respecter l'ordre des items, Vue va ajuster chaque élément en place et s'assurer qu'il reflète ce qui devrait être rendu à un index particulier.

Ce mode par défaut est efficace, mais **seulement approprié lorsque votre rendu de liste ne dépend pas de l'état d'un composant enfant ou de l'état temporaire du DOM (par exemple les valeurs d'entrées d'un formulaire)**.

Pour aiguiller Vue afin qu'il puisse tracer l'identité de chaque nœud, et ainsi réutiliser et réarranger l'ordre des éléments existants, vous devez fournir un attribut `key` unique pour chaque item :

```vue-html
<div v-for="item in items" :key="item.id">
  <!-- contenu -->
</div>
```

Lorsque vous utilisez `<template v-for>`, la `key` doit être placée sur le conteneur `<template>` :

```vue-html
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

:::tip Note
Ici, `key` est un attribut spécial qui est lié avec `v-bind`. Il ne doit pas être confondu avec la variable de clé de propriété utilisée dans le cas d'un [`v-for` avec un objet](#v-for-with-an-object).
:::

Il est recommandé de fournir un attribut `key` avec `v-for` dès que possible, sauf si le contenu du DOM itéré est simple (c'est-à-dire qu'il ne comporte pas de composants ou d'éléments du DOM avec un état), ou si vous comptez intentionnellement sur le comportement par défaut dans un but de gain de performances.

La liaison `key` attend des valeurs - c'est-à-dire des chaînes de caractères et des nombres. N'utilisez pas d'objets comme clé de `v-for`. Pour l'utilisation détaillée de l'attribut `key`, référez-vous à la [documentation de l'API `key`](/api/built-in-special-attributes#key).

## `v-for` avec un composant {#v-for-with-a-component}

> Cette section part du principe que vous connaissez déjà les [Composants](/guide/essentials/component-basics). N'hésitez pas à la sauter et à revenir plus tard !

Vous pouvez utiliser `v-for` directement sur un composant, comme avec n'importe quel élément (n'oubliez pas de fournir une `key`):

```vue-html
<MyComponent v-for="item in items" :key="item.id" />
```

Toutefois, les données ne vont pas être automatiquement passées au composant, car les composants ont chacun leur propre portée isolée. Afin de passer la donnée itérée au composant, il faut également utiliser les props :

```vue-html
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

La raison pour laquelle on n'injecte pas automatiquement `item` dans le composant est que cela rendrait le composant étroitement lié au fonctionnement de `v-for`. Être explicite sur la source d'où proviennent les données rend le composant réutilisable dans d'autres situations.

<div class="composition-api">

Regardez [cet exemple d'une simple todo list](https://play.vuejs.org/#eNp1U8Fu2zAM/RXCGGAHTWx02ylwgxZYB+ywYRhyq3dwLGYRYkuCJTsZjPz7KMmK3ay9JBQfH/meKA/Rk1Jp32G0jnJdtVwZ0Gg6tSkEb5RsDQzQ4h4usG9lAzGVxldoK5n8ZrAZsTQLCduRygAKUUmhDQg8WWyLZwMPtmESx4sAGkL0mH6xrMH+AHC2hvuljw03Na4h/iLBHBAY1wfUbsTFVcwoH28o2/KIIDuaQ0TTlvrwNu/TDe+7PDlKXZ6EZxTiN4kuRI3W0dk4u4yUf7bZfScqw6WAkrEf3m+y8AOcw7Qv6w5T1elDMhs7Nbq7e61gdmme60SQAvgfIhExiSSJeeb3SBukAy1D1aVBezL5XrYN9Csp1rrbNdykqsUehXkookl0EVGxlZHX5Q5rIBLhNHFlbRD6xBiUzlOeuZJQz4XqjI+BxjSSYe2pQWwRBZizV01DmsRWeJA1Qzv0Of2TwldE5hZRlVd+FkbuOmOksJLybIwtkmfWqg+7qz47asXpSiaN3lxikSVwwfC8oD+/sEnV+oh/qcxmU85mebepgLjDBD622Mg+oDrVquYVJm7IEu4XoXKTZ1dho3gnmdJhedEymn9ab3ysDPdc4M9WKp28xE5JbB+rzz/Trm3eK3LAu8/E7p2PNzYM/i3ChR7W7L7hsSIvR7L2Aal1EhqTp80vF95sw3WcG7r8A0XaeME=) pour comprendre comment rendre une liste de composants en utilisant `v-for`, et en passant des données différentes à chaque instance.

</div>
<div class="options-api">

Consultez [cet exemple d'une simple todo list](https://play.vuejs.org/#eNqNVE2PmzAQ/SsjVIlEm4C27Qmx0a7UVuqhPVS5lT04eFKsgG2BSVJF+e8d2xhIu10tihR75s2bNx9wiZ60To49RlmUd2UrtNkUUjRatQa2iquvBhvYt6qBOEmDwQbEhQQoJJ4dlOOe9bWBi7WWiuIlStNlcJlYrivr5MywxdIDAVo0fSvDDUDiyeK3eDYZxLGLsI8hI7H9DHeYQuwjeAb3I9gFCFMjUXxSYCoELroKO6fZP17Mf6jev0i1ZQcE1RtHaFrWVW/l+/Ai3zd1clQ1O8k5Uzg+j1HUZePaSFwfvdGhfNIGTaW47bV3Mc6/+zZOfaaslegS18ZE9121mIm0Ep17ynN3N5M8CB4g44AC4Lq8yTFDwAPNcK63kPTL03HR6EKboWtm0N5MvldtA8e1klnX7xphEt3ikTbpoYimsoqIwJY0r9kOa6Ag8lPeta2PvE+cA3M7k6cOEvBC6n7UfVw3imPtQ8eiouAW/IY0mElsiZWqOdqkn5NfCXxB5G6SJRvj05By1xujpJWUp8PZevLUluqP/ajPploLasmk0Re3sJ4VCMnxvKQ//0JMqrID/iaYtSaCz+xudsHjLpPzscVGHYO3SzpdixIXLskK7pcBucnTUdgg3kkmcxhetIrmH4ebr8m/n4jC6FZp+z7HTlLsVx1p4M7odcXPr6+Lnb8YOne5+C2F6/D6DH2Hx5JqOlCJ7yz7IlBTbZsf7vjXVBzjvLDrH5T0lgo=) pour voir comment rendre une liste de composants en utilisant `v-for`, en passant des données différentes à chaque instance.

</div>

## Détection des changements pour un tableau {#array-change-detection}

### Méthodes de mutation {#mutation-methods}

Vue est capable de détecter quand une méthode de mutation d'un tableau réactif est appelée et d'engendrer les mises à jour nécessaires. Ces méthodes de mutation sont :

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

### Remplacer un tableau {#replacing-an-array}

Les méthodes de mutation, comme leur nom l'indique, vont entrainer des mutations du tableau sur lequel elles sont appelées. En comparaison, il existe également des méthodes non-mutantes, par exemple `filter()`, `concat()` et `slice()`, qui ne modifient pas le tableau original mais **retournent toujours un nouveau tableau**. Lorsqu'on travaille avec des méthodes non-mutantes, il faut remplacer l'ancien tableau par le nouveau :

<div class="composition-api">

```js
// `items` est une ref qui a pour valeur un tableau
items.value = items.value.filter((item) => item.message.match(/Foo/))
```

</div>
<div class="options-api">

```js
this.items = this.items.filter((item) => item.message.match(/Foo/))
```

</div>

On pourrait penser que cela va pousser Vue à se débarrasser du DOM actuel et à rendre à nouveau toute la liste - heureusement, ça n'est pas le cas. Vue implémente des approches intelligentes afin de maximiser la réutilisation des éléments du DOM, de manière à ce que remplacer un tableau par un autre tableau composé en partie des mêmes éléments soit une opération très efficace.

## Afficher des résultats filtrés/triés {#displaying-filtered-sorted-results}

Il arrive parfois que nous voulions afficher une version filtrée ou triée d'un tableau sans muter ou remettre à zéro les données originales. Dans ce cas, on peut créer une propriété calculée qui retourne le tableau filtré ou trié.

Par exemple :

<div class="composition-api">

```js
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    numbers: [1, 2, 3, 4, 5]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(n => n % 2 === 0)
  }
}
```

</div>

```vue-html
<li v-for="n in evenNumbers">{{ n }}</li>
```

Dans les situations où les propriétés calculées ne sont pas envisageables (par exemple dans des boucles imbriquées `v-for`), vous pouvez utiliser une méthode :

<div class="composition-api">

```js
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])

function even(numbers) {
  return numbers.filter((number) => number % 2 === 0)
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

</div>

```vue-html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)">{{ n }}</li>
</ul>
```

Faites attention à `reverse()` et `sort()` dans une propriété calculée ! Ces deux méthodes vont muter le tableau original, ce qui doit être évité dans des accesseurs calculés. Créez plutôt une copie du tableau original avant d'appeler ces méthodes :

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```
