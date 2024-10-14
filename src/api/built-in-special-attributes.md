# Attributs spéciaux natifs {#built-in-special-attributes}

## key {#key}

L'attribut spécial `key` est principalement utilisé comme une indication aidant l'algorithme du DOM virtuel de Vue à identifier les VNodes lors de la comparaison de la nouvelle et de l'ancienne liste de nœuds.

- **Attendu :** `number | string | symbol`

- **Détails**

  Sans clés, Vue utilise un algorithme qui minimise le mouvement des éléments et essaie de remplacer/réutiliser les éléments du même type déjà en place autant que possible. Avec des clés, il réorganisera les éléments en fonction du changement d'ordre des clés, et les éléments dont les clés ne sont plus présentes seront toujours supprimés / détruits.

  Les clés des enfants d'un même parent doivent être **uniques**. Les clés dupliquées entraîneront des erreurs de rendu.

  Le cas d'utilisation le plus courant est en combinaison avec `v-for` :

  ```vue-html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  Elle peut également être utilisée pour forcer le remplacement d'un élément/composant au lieu de le réutiliser. Cela peut être utile lorsque vous voulez :

  - Déclencher correctement les hooks de cycle de vie d'un composant
  - Déclencher des transitions

  Par exemple :

  ```vue-html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  Quand `text` change, le `<span>` sera toujours remplacé au lieu d'être corrigé, donc une transition sera déclenchée.

- **Voir aussi** [Guide - Rendu de liste - Maintenir l'état avec `key`](/guide/essentials/list#maintaining-state-with-key)

## ref {#ref}

Désigne une [ref du template](/guide/essentials/template-refs).

- **Attendu :** `string | Function`

- **Détails**

  `ref` est utilisée pour enregistrer une référence à un élément ou à un composant enfant.

  Dans l'Options API, la référence sera enregistrée sous l'objet `this.$refs` du composant :

  ```vue-html
  <!-- stockée sous this.$refs.p -->
  <p ref="p">hello</p>
  ```

  Dans la Composition API, la référence sera stockée dans une ref avec le nom correspondant :

  ```vue
  <script setup>
  import { useTemplateRef } from 'vue'

  const pRef = useTemplateRef('p')
  </script>

  <template>
    <p ref="p">hello</p>
  </template>
  ```

  Si elle est utilisée sur un élément simple du DOM, la référence sera cet élément ; si elle est utilisée sur un composant enfant, la référence sera l'instance du composant enfant.

  De manière alternative, `ref` peut accepter une valeur de fonction qui fournit un contrôle total sur l'endroit où la référence sera stockée :

  ```vue-html
  <ChildComponent :ref="(el) => child = el" />
  ```

  Une remarque importante concernant le timing de l'enregistrement des refs : comme les refs elles-mêmes sont créées à la suite de la fonction de rendu, vous devez attendre que le composant soit monté avant d'y accéder.

  `this.$refs` est également non réactive, vous ne devez donc pas l'utiliser dans les templates pour la liaison de données.

- **Voir aussi**
  - [Guide - Template Refs](/guide/essentials/template-refs)
  - [Guide - Typer les refs du template](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [Guide - Typer les refs du template d'un composant](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## is {#is}

  Utilisé pour lier les [composants dynamiques](/guide/essentials/component-basics#dynamic-components).

- **Attendu :** `string | Component`

- **Utilisation sur des éléments natifs**
 
  - Supporté à partir de la version 3.1

  Lorsque l'attribut "is" est utilisé sur un élément HTML natif, il sera interprété comme un [élément natif personnalisé](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example), qui est une fonctionnalité native de la plate-forme Web.

  Il existe cependant un cas d'utilisation où vous pouvez avoir besoin que Vue remplace un élément natif par un composant Vue, comme expliqué dans [Mises en garde concernant l'analyse du template DOM](/guide/essentials/component-basics#in-dom-template-parsing-caveats). Vous pouvez préfixer la valeur de l'attribut `is` avec `vue:` pour que Vue rende l'élément comme un composant Vue :

  ```vue-html
  <table>
    <tr is="vue:my-row-component"></tr>
  </table>
  ```

- **Voir aussi**

  - [Éléments spéciaux natifs - `<component>`](/api/built-in-special-elements#component)
  - [Composants dynamiques](/guide/essentials/component-basics#dynamic-components)
