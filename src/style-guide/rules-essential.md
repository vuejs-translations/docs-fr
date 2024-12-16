# Règles de priorité A : Essentielles {#priority-a-rules-essential}

::: warning Note
Ce guide de style Vue.js est obsolète et doit être revu. Si vous avez des questions ou des suggestions, veuillez [ouvrir une issue](https://github.com/vuejs/docs/issues/new).
:::

Ces règles aident à prévenir les erreurs, donc apprenez les et tenez-y vous coûte que coûte. Il peut y avoir des exceptions, mais elles sont rares et devraient être faites par ceux ayant une expertise à la fois dans JavaScript et dans Vue.

## Utilisez des noms de composants avec plusieurs mots {#use-multi-word-component-names}

Les noms de composants créés par l'utilisateur devraient toujours être composés de plusieurs mots, à l'exception du composant racine `App`. Cela [évite les conflits](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) avec les éléments HTML existants et à venir, puisqu'ils sont tous composés d'un seul mot.

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```vue-html
<!-- dans les templates pré-compilés -->
<Item />

<!-- dans les templates à l'intérieur du DOM -->
<item></item>
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```vue-html
<!-- dans les templates pré-compilés -->
<TodoItem />

<!-- dans les templates à l'intérieur du DOM -->
<todo-item></todo-item>
```

</div>

## Utilisez des définitions de prop détaillées {#use-detailed-prop-definitions}

Dans le code source, les définitions de prop devraient toujours être le plus détaillées possible, en spécifiant au moins le ou les types.

::: details Explications détaillées
[Les définitions de prop](/guide/components/props#prop-validation) détaillées présentent deux avantages :

- Elles documentent l'API du composant, de manière à ce qu'il soit facile de voir comment le composant doit être utilisé.
- Pendant le développement, Vue vous avertira si jamais un composant se voit fournir des props au mauvais format, ce qui vous aidera à régler les potentielles sources d'erreurs.
  :::

<div class="options-api">

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```js
// OK seulement lorsque vous prototyper
props: ['status']
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```js
props: {
  status: String
}
```

```js
// Encore mieux !
props: {
  status: {
    type: String,
    required: true,

    validator: value => {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].includes(value)
    }
  }
}
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```js
// OK seulement lorsque vous prototyper
const props = defineProps(['status'])
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```js
const props = defineProps({
  status: String
})
```

```js
// Encore mieux !

const props = defineProps({
  status: {
    type: String,
    required: true,

    validator: (value) => {
      return ['syncing', 'synced', 'version-conflict', 'error'].includes(
        value
      )
    }
  }
})
```

</div>

</div>

## Utilisez `v-for` avec une clé {#use-keyed-v-for}

`key` avec `v-for` est _toujours_ requis sur les composants, afin de maintenir l'état interne du composant à travers le sous-arbre. Cependant même pour les éléments, une bonne pratique est de maintenir un comportement prédictible, telle que [la persistance de l'objet](https://bost.ocks.org/mike/constancy/) dans les animations.

::: details Explications détaillées
Imaginons que vous ayez une liste de todos :

<div class="options-api">

```js
data() {
  return {
    todos: [
      {
        id: 1,
        text: 'Learn to use v-for'
      },
      {
        id: 2,
        text: 'Learn to use key'
      }
    ]
  }
}
```

</div>

<div class="composition-api">

```js
const todos = ref([
  {
    id: 1,
    text: 'Learn to use v-for'
  },
  {
    id: 2,
    text: 'Learn to use key'
  }
])
```

</div>

Puis vous les triez par ordre alphabétique. Lors de la mise à jour du DOM, Vue va optimiser le rendu de manière à réaliser les mutations du DOM les moins coûteuses. Cela peut signifier supprimer la première todo, puis la remettre à la fin de la liste.

Le problème est que, dans certains cas il peut être important de ne pas supprimer d'éléments qui vont rester dans le DOM. Par exemple, vous pouvez vouloir utiliser `<transition-group>` pour animer le tri de la liste, ou maintenir le focus si l'élément rendu est un `<input>`. Dans ces cas, ajouter une clé unique pour chaque item (par exemple `:key="todo.id"`) précisera de manière plus prédictible à Vue comment se comporter.

De notre expérience, il est préférable de _toujours_ ajouter une clé unique, de sorte que vous et votre équipe n'ayez jamais à vous soucier de ces rares cas. Dans les scenarios rares et critiques, d'un point de vue des performances, où la persistance de l'objet n'est pas nécessaire, vous pouvez faire une exception.
:::

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```vue-html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```vue-html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

</div>

## Évitez les `v-if` avec les `v-for` {#avoid-v-if-with-v-for}

**N'utilisez jamais `v-if` et `v-for` sur le même élément.**

Il y a deux situations courantes où cela peut être tentant :

- Pour filtrer des items dans une liste (par exemple `v-for="user in users" v-if="user.isActive"`). Dans ces cas, remplacez `users` par une nouvelle propriété calculée qui vous retourne votre liste filtrée (par exemple `activeUsers`).

- Pour éviter le rendu d'une liste si elle doit être cachée (par exemple `v-for="user in users" v-if="shouldShowUsers"`). Dans ces cas, déplacez le `v-if` sur un élément conteneur (par exemple `ul`, `ol`).

::: details Explications détaillées
Lorsque Vue traite les directives, `v-if` a la priorité sur `v-for`, donc ce template :

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

Va produire une erreur, car la directive `v-if` sera d'abord évaluée et la variable d'itération `user` n'existe pas à ce moment précis.

Cela peut être résolu en itérant sur une propriété calculée à la place, de cette façon :

<div class="options-api">

```js
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```

</div>

<div class="composition-api">

```js
const activeUsers = computed(() => {
  return users.filter((user) => user.isActive)
})
```

</div>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

Ou encore, nous pouvons utiliser une balise `<template>` avec `v-for` pour envelopper l'élément `<li>` :

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

:::

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

</div>

## Utilisez du style avec une portée limitée au composant {#use-component-scoped-styling}

Pour les applications, les styles du composant `App` et des composants de mise en page peuvent être globaux, mais tous les autres styles des composants devraient avoir une portée limitée.

Cela n'est pertinent que pour les [composants monofichiers](/guide/scaling-up/sfc). Cela ne nécessite _pas_ que l'[attribut `scoped`](https://vue-loader.vuejs.org/en/features/scoped-css) soit utilisé. La limitation de la portée peut se faire via des [modules CSS](https://vue-loader.vuejs.org/en/features/css-modules), une stratégie basée sur les classes telle que [BEM](http://getbem.com/), ou tout autre librairie/convention.

**Toutefois, pour les librairies de composants, il est préférable d'utiliser une stratégie basée sur les classes au lieu d'utiliser l'attribut `scoped`.**

Cela permet de remplacer les styles internes plus facilement, avec des noms de classe compréhensibles par des humains et qui ne sont pas trop spécifiques, mais ont tout de même qu'une faible probabilité d'être à l'origine d'un conflit.

::: details Explications détaillées
Si vous développez un projet conséquent, travaillez avec d'autres développeurs, or incluez parfois du HTML/CSS tiers (par exemple à partir d'Auth0), une gestion des portées cohérente assurera que vos styles ne s'appliquent qu'aux composants pour lesquels ils sont destinés.

Au-delà de l'attribut `scoped`, utiliser des noms de classe uniques permet de s'assurer que du CSS tiers ne s'applique pas à votre HTML. Par exemple, de nombreux projets utilise les noms de classe `button`, `btn`, ou `icon`, donc même si vous n'utilisez pas de stratégie comme BEM, ajouter un préfixe spécifique à votre application ou votre composant (par exemple `ButtonClose-icon`) peut fournir une certaine protection.
:::

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```vue-html
<template>
  <button class="button button-close">×</button>
</template>

<!-- Using the `scoped` attribute -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button :class="[$style.button, $style.buttonClose]">×</button>
</template>

<!-- En utilisant des modules CSS -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button class="c-Button c-Button--close">×</button>
</template>

<!-- En utilisant la convention BEM -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```

</div>
