# Éléments spéciaux natifs {#built-in-special-elements}

:::info Pas des composants
`<component>`, `<slot>` et `<template>` sont des fonctionnalités semblables aux composants et font partie de la syntaxe des templates. Ce ne sont pas de véritables composants et ils sont supprimés lors de la compilation des templates. En tant que tels, ils sont conventionnellement écrits en minuscules dans les templates.
:::

## `<component>` {#component}

Un "méta-composant" pour rendre des composants ou éléments dynamiques.

- **Props :**

  ```ts
  interface DynamicComponentProps {
    is: string | Component
  }
  ```

- **Détails**

  Le composant à rendre est déterminé par la propriété "is".

  - Lorsque `is` est une chaîne de caractères, il peut s'agir du nom d'une balise HTML ou du nom d'un composant enregistré.

  - De manière alternative, `is` peut également être directement lié à la définition d'un composant.

- **Exemple**

  Rendu des composants par nom d'enregistrement (Options API) :

  ```vue
  <script>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: { Foo, Bar },
    data() {
      return {
        view: 'Foo'
      }
    }
  }
  </script>

  <template>
    <component :is="view" />
  </template>
  ```

  Rendu de composants par définition (Composition API avec `<script setup>`) :

  ```vue
  <script setup>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'
  </script>

  <template>
    <component :is="Math.random() > 0.5 ? Foo : Bar" />
  </template>
  ```

  Rendu d'éléments HTML :

  ```vue-html
  <component :is="href ? 'a' : 'span'"></component>
  ```

  Les [composants natifs](./built-in-components) peuvent tous être passés à `is`, mais vous devez les enregistrer si vous voulez les passer par leur nom. Par exemple :

  ```vue
  <script>
  import { Transition, TransitionGroup } from 'vue'

  export default {
    components: {
      Transition,
      TransitionGroup
    }
  }
  </script>

  <template>
    <component :is="isGroup ? 'TransitionGroup' : 'Transition'">
      ...
    </component>
  </template>
  ```

  L'enregistrement n'est pas nécessaire si vous passez directement le composant à `is` plutôt que son nom, par exemple dans `<script setup>`.

  Si `v-model` est utilisée sur une balise `<component>`, le compilateur de templates le transformera en une prop `modelValue` et un écouteur d'événements `update:modelValue`, comme il le ferait pour tout autre composant. Cependant, cela ne sera pas compatible avec les éléments HTML natifs, tels que `<input>` ou `<select>`. Par conséquent, l'utilisation de `v-model` avec un élément natif créé dynamiquement ne fonctionnera pas :

  ```vue
  <script setup>
  import { ref } from 'vue'

  const tag = ref('input')
  const username = ref('')
  </script>

  <template>
    <!-- Cela ne fonctionnera pas car "input" est un élément HTML natif. -->
    <component :is="tag" v-model="username" />
  </template>
  ```

  En pratique, ce cas de figure n'est pas courant car les champs de formulaire natifs sont généralement enveloppés dans des composants dans les applications réelles. Si vous avez besoin d'utiliser directement un élément natif, vous pouvez diviser manuellement le "v-model" en un attribut et un événement.

- **Voir aussi** [Composants dynamiques](/guide/essentials/component-basics#dynamic-components)

## `<slot>` {#slot}

Indique l'emplacement du contenu d'un slot dans les templates.

- **Props :**

  ```ts
  interface SlotProps {
    /**
     * Toutes les props passées à <slot> à passer comme arguments
     * aux slots scopés
     */
    [key: string]: any
    /**
     * Réservé pour spécifier le nom du slot.
     */
    name?: string
  }
  ```

- **Détails**

  L'élément `<slot>` peut utiliser l'attribut `name` pour spécifier un nom de slot. Si aucun `name` n'est spécifié, l'élément rendra le slot par défaut. Les attributs supplémentaires passés à l'élément slot seront passés comme des props de slot au slot scopé défini dans le parent.

  L'élément lui-même sera remplacé par le contenu du slot correspondant.

  Les éléments `<slot>` dans les templates Vue sont compilés en JavaScript, ils ne doivent donc pas être confondus avec les [éléments `<slot>` natifs](https://developer.mozilla.org/fr/docs/Web/HTML/Element/slot).

- **Voir aussi** [Composant - Slots](/guide/components/slots)

## `<template>` {#template}

La balise `<template>` est utilisée comme placeholder lorsque nous voulons utiliser une directive native sans rendre un élément dans le DOM.

- **Détails**

  Le traitement spécial de `<template>` n'est déclenché que s'il est utilisé avec l'une de ces directives :

  - `v-if`, `v-else-if`, or `v-else`
  - `v-for`
  - `v-slot`
  
  Si aucune de ces directives n'est présente, il sera rendu comme un [élément natif `<template>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/template) à la place.

  Un `<template>` avec un `v-for` peut aussi avoir un attribut [`key`](/api/built-in-special-attributes#key). Tous les autres attributs et directives seront rejetés, car ils n'ont pas de sens sans l'élément correspondant.

  Les composants monofichiers utilisent une [top-level `<template>` tag](/api/sfc-spec#language-blocks) pour envelopper l'ensemble du template. Cette utilisation est distincte de l'utilisation de `<template>` décrite ci-dessus. Cette balise de haut niveau ne fait pas partie du modèle lui-même et ne supporte pas la syntaxe template, comme les directives.

- **Voir aussi**
  - [Guide - `v-if` avec `<template>`](/guide/essentials/conditional#v-if-on-template) 
  - [Guide - `v-for` avec `<template>`](/guide/essentials/list#v-for-on-template) 
  - [Guide - Slots nommés](/guide/components/slots#named-slots) 
