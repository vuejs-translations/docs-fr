# Enregistrement des composants {#component-registration}

> Cette page suppose que vous avez déjà lu les [principes fondamentaux des composants](/guide/essentials/component-basics). Lisez-les d'abord si vous débutez avec les composants.

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-global-vs-local-vue-components" title="Cours gratuit sur l'enregistrement des composantsn Vue.js"/>

Un composant Vue doit être "enregistré" afin que Vue sache où localiser son implémentation lorsqu'il est rencontré dans un template. Il existe deux façons d'enregistrer des composants : globale et locale.

## Enregistrement global {#global-registration}

Nous pouvons rendre les composants disponibles globalement dans l'[application Vue](/guide/essentials/application) actuelle en utilisant la méthode `.component()` :

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // le nom enregistré
  'MyComponent',
  // l'implémentation
  {
    /* ... */
  }
)
```

Si vous utilisez des SFC, vous enregistrerez les fichiers `.vue` importés :

```js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
```

La méthode `.component()` peut être chaînée :

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

Les composants enregistrés globalement peuvent être utilisés dans le template de n'importe quel composant de cette application :

```vue-html
<!-- cela fonctionnera dans n'importe quel composant de l'application -->
<ComponentA/>
<ComponentB/>
<ComponentC/>
```

Cela s'applique même à tous les sous-composants, ce qui signifie que ces trois composants seront également disponibles _dans chacun d'eux_.

## Enregistrement local {#local-registration}

Bien que pratique, l'enregistrement global présente quelques inconvénients :

1. L'enregistrement global empêche les systèmes de build de supprimer les composants inutilisés (alias "tree-shaking"). Si vous enregistrez globalement un composant mais que vous ne l'utilisez nulle part dans votre application, il sera toujours inclus dans le bundle final.

2. L'enregistrement global rend les relations entre dépendances moins explicites dans les applications de taille importante. Cela rend difficile la localisation de l'implémentation d'un composant enfant à partir d'un composant parent qui l'utilise. Cela peut affecter la maintenabilité à long terme, de la même manière que si vous utilisiez trop de variables globales.

L'enregistrement local limite la disponibilité des composants enregistrés au composant actuel uniquement. Cela rend la relation de dépendance plus explicite et est plus adaptée au tree-shaking.

<div class="composition-api">

Lors de l'utilisation de SFC avec `<script setup>`, les composants importés peuvent être utilisés localement sans enregistrement :

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

Dans une configuration sans `<script setup>`, vous devrez utiliser l'option `components` :

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```

</div>
<div class="options-api">

L'enregistrement local se fait à l'aide de l'option `components` :

```vue
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```

</div>

Pour chaque propriété de l'objet `components`, la clé sera le nom enregistré du composant, tandis que la valeur contiendra l'implémentation du composant. L'exemple ci-dessus utilise le raccourci de propriété ES2015 et équivaut à :

```js
export default {
  components: {
    ComponentA: ComponentA
  }
  // ...
}
```

Notez que **les composants enregistrés localement _ne_ sont _pas_ également disponibles dans les composants descendants**. Dans ce cas, `ComponentA` ne sera disponible que dans le composant actuel, et non pas dans tous autres de ses composants enfants ou descendants.

## Casse des noms des composants {#component-name-casing}

Tout au long de ce guide, nous utilisons des noms en casse Pascal (PascalCase) lors de l'enregistrement des composants. Ceci est dû au fait que :

1. Les noms en casse Pascal sont des identifiants JavaScript valides. Cela facilite l'import et l'enregistrement des composants en JavaScript. Il aide également les IDE avec l'auto-complétion.

2. `<PascalCase />` rend plus évident qu'il s'agit d'un composant Vue au lieu d'un élément HTML natif dans les templates. Il différencie également les composants Vue des custom elements (web components).

Il s'agit du style recommandé lorsque vous travaillez avec des templates à base de SFC ou de chaînes de caractères. Cependant, comme indiqué dans [les mises en garde concernant l'analyse du template DOM](/guide/essentials/component-basics#in-dom-template-parsing-caveats), les balises déclarées en casse Pascal ne sont pas utilisables dans les templates DOM.

Heureusement, Vue prend en charge la résolution des balises au format kebab-case et leur équivalent composants enregistrés à la condition qu'ils utilisent la casse Pascal. Cela signifie qu'un composant enregistré en tant que `MyComponent` peut être référencé à l'intérieur du template (ou à l'intérieur d'un élément HTML rendu par Vue) via à la fois `<MyComponent>` et `<my-component>`. Cela nous permet d'utiliser le même code d'enregistrement de composant JavaScript quelle que soit la source du template.
