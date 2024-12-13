# Règles de priorité C : Recommandées {#priority-c-rules-recommended}

::: warning Note
Ce guide de style Vue.js est obsolète et doit être revu. Si vous avez des questions ou des suggestions, veuillez [ouvrir une issue](https://github.com/vuejs/docs/issues/new).
:::

Lorsqu'il existe plusieurs options correctes, un choix arbitraire peut être fait pour assurer une certaine cohérence. Dans ces règles, nous décrivons chaque option acceptable et suggérons un choix par défaut. Cela signifie que vous être libres de faire un choix différent dans votre code, tant que vous restez cohérent et avez une bonne raison. Vous avez certainement une bonne raison ! En adaptant les standards de la communauté, vous :

1. Entraînerez votre cerveau à analyser plus facilement la plupart du code que vous rencontrerez
2. Serez capable de copier et coller la plupart du code de la communauté sans modification
3. Réaliserez souvent que les nouvelles recrues sont habituées à votre style de code favori, du moins en ce qui concerne Vue

## Ordre des options du composant/de l'instance {#component-instance-options-order}

**Les options du composant/de l'instance devraient être ordonnées de manière constante.**

Voici l'ordre par défaut que nous recommandons pour les options d'un composant. Les options sont divisées en catégories, afin que vous sachiez où ajouter de nouvelles propriétés depuis les plugins.

1. **Conscience globale** (requiert des informations au-delà du composant)

   - `name`

2. **Options du compilateur de templates** (change la manière dont les templates sont compilés)

   - `compilerOptions`

3. **Dépendances du template** (ressources utilisées dans le template)

   - `components`
   - `directives`

4. **Composition** (fusionne les propriétés dans les options)

   - `extends`
   - `mixins`
   - `provide`/`inject`

5. **Interface** (l'interface du composant)

   - `inheritAttrs`
   - `props`
   - `emits`

6. **Composition API** (le point d'entrée pour l'utilisation de la Composition API)

   - `setup`

7. **État local** (propriétés réactives locales)

   - `data`
   - `computed`

8. **Événements** (fonctions de rappel déclenchées par des événements réactifs)

   - `watch`
   - Événements du cycles de vie (dans l'ordre où ils sont appelés)
     - `beforeCreate`
     - `created`
     - `beforeMount`
     - `mounted`
     - `beforeUpdate`
     - `updated`
     - `activated`
     - `deactivated`
     - `beforeUnmount`
     - `unmounted`
     - `errorCaptured`
     - `renderTracked`
     - `renderTriggered`

9. **Propriétés non réactives** (propriétés de l'instance indépendantes du système de réactivité)

   - `methods`

10. **Rendu** (la description déclaratif du résultat du composant)
    - `template`/`render`

## Ordre des attributs des éléments {#element-attribute-order}

**Les attributs des éléments (et des composants) devraient être ordonnés de manière constante.**

Voici l'ordre par défaut que nous recommandons pour les options d'un composant. Les options sont divisées en catégories, afin que vous sachiez où ajouter des attributs personnalisés et des directives.

1. **Définition** (fourni les options du composant)

   - `is`

2. **Rendu de liste** (crée plusieurs variations d'un même élément)

   - `v-for`

3. **Conditionnelles** (indiquent si l'élément est rendu/affiché)

   - `v-if`
   - `v-else-if`
   - `v-else`
   - `v-show`
   - `v-cloak`

4. **Modificateurs du rendu** (changent la façon dont l'élément est rendu)

   - `v-pre`
   - `v-once`

5. **Conscience globale** (requiert des informations au-delà du composant)

   - `id`

6. **Attributs uniques** (attributs nécessitant des valeurs uniques)

   - `ref`
   - `key`

7. **Liaison bidirectionnelle** (combinaison de la liaison et des événements)

   - `v-model`

8. **Autres attributs** (tous les attributs liés et non liés non spécifiés)

9. **Événements** (écouteurs d'événements du composant)

   - `v-on`

10. **Contenu** (remplace le contenu de l'élément)
    - `v-html`
    - `v-text`

## Lignes vides dans les options du composant/de l'instance {#empty-lines-in-component-instance-options}

**Vous pouvez être tenté d'ajouter une ligne vide entre les propriétés multi-lignes, notamment si les options ne peuvent plus tenir sur votre écran sans défilement.**

Lorsque les composants commencent à prendre beaucoup d'espace ou deviennent difficiles à lire, l'ajout d'espaces entre les propriétés multi-lignes peut les rendre plus faciles à parcourir. Dans certains éditeurs, comme Vim, des options de formatage comme celle-ci peuvent également faciliter la navigation au clavier.

<div class="options-api">

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue() {
    // ...
  },

  inputClasses() {
    // ...
  }
}
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```js
// Sans espace c'est aussi bon tant que
// le composant soit toujours facile à lire
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue() {
    // ...
  },
  inputClasses() {
    // ...
  }
}
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>Bad</h3>

```js
defineProps({
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
})
const formattedValue = computed(() => {
  // ...
})
const inputClasses = computed(() => {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>Good</h3>

```js
defineProps({
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
})

const formattedValue = computed(() => {
  // ...
})

const inputClasses = computed(() => {
  // ...
})
```

</div>

</div>

## Ordre des éléments de premier niveau des composants monofichiers {#single-file-component-top-level-element-order}

**[Les composants monofichiers](/guide/scaling-up/sfc) devraient toujours ordonner les balises `<script>`, `<template>`, et `<style>` de manière constante, avec `<style>` en dernier, car au moins l'un des deux autres est toujours nécessaire.**

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```vue-html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```vue-html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>
