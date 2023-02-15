# Types utilitaires {#utility-types}

:::info
Cette page ne liste que quelques types d'utilitaires couramment utilisés et dont l'utilisation peut nécessiter une explication. Pour une liste complète des types exportés, consultez le [code source](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131).
:::

## PropType\<T> {#proptype-t}

Utilisé pour annoter une prop avec des types plus avancés lors de l'utilisation de déclarations de props à l'exécution.

- **Exemple :**

  ```ts
  import type { PropType } from 'vue'

  interface Book {
    title: string
    author: string
    year: number
  }

  export default {
    props: {
      book: {
        // fournit un type plus spécifique à `Object`.
        type: Object as PropType<Book>,
        required: true
      }
    }
  }
  ```

- **Voir aussi :** [Guide - Typer les props des composants](/guide/typescript/options-api.html#typing-component-props)

## ComponentCustomProperties {#componentcustomproperties}

Utilisé pour augmenter le type de l'instance du composant afin de prendre en charge les propriétés globales personnalisées.

- **Exemple :**

  ```ts
  import axios from 'axios'

  declare module 'vue' {
    interface ComponentCustomProperties {
      $http: typeof axios
      $translate: (key: string) => string
    }
  }
  ```

  :::tip
  Les augmentations doivent être placées dans un fichier module `.ts` ou `.d.ts`. Consultez le [placement des annotations de types](/guide/typescript/options-api.html#augmenting-global-properties) pour plus de détails.
  :::

- **Voir aussi :** [Guide - Augmenter les propriétés globales](/guide/typescript/options-api.html#augmenting-global-properties)

## ComponentCustomOptions {#componentcustomoptions}

Utilisé pour augmenter le type des options du composant afin de prendre en charge les options personnalisées.

- **Exemple :**

  ```ts
  import { Route } from 'vue-router'

  declare module 'vue' {
    interface ComponentCustomOptions {
      beforeRouteEnter?(to: any, from: any, next: () => void): void
    }
  }
  ```

  :::tip
  Les augmentations doivent être placées dans un fichier module `.ts` ou `.d.ts`. Consultez le [placement des annotations de types](/guide/typescript/options-api.html#augmenting-global-properties) pour plus de détails.
  :::

- **Voir aussi :** [Guide - Augmenter les options personnalisées](/guide/typescript/options-api.html#augmenting-custom-options)

## ComponentCustomProps {#componentcustomprops}

Utilisé pour augmenter les props TSX autorisées afin d'utiliser des props non déclarées sur des éléments TSX.

- **Exemple :**

  ```ts
  declare module 'vue' {
    interface ComponentCustomProps {
      hello?: string
    }
  }

  export {}
  ```

  ```tsx
  // fonctionne maintenant même si hello n'est pas une prop déclarée
  <MyComponent hello="world" />
  ```

  :::tip
  Les augmentations doivent être placées dans un fichier module `.ts` ou `.d.ts`. Consultez le [placement des annotations de types](/guide/typescript/options-api.html#augmenting-global-properties) pour plus de détails.
  :::

## CSSProperties {#cssproperties}

Utilisé pour augmenter les valeurs autorisées dans les liaisons de propriétés de style.

- **Exemple :**

  Permet l'utilisation de n'importe quelle propriété CSS personnalisée

  ```ts
  declare module 'vue' {
    interface CSSProperties {
      [key: `--${string}`]: string
    }
  }
  ```

  ```tsx
  <div style={ { '--bg-color': 'blue' } }>
  ```
  ```html
  <div :style="{ '--bg-color': 'blue' }">
  ```

 :::tip
  Les augmentations doivent être placées dans un fichier module `.ts` ou `.d.ts`. Consultez le [placement des annotations de types](/guide/typescript/options-api.html#augmenting-global-properties) pour plus de détails.
  :::
  
  :::info Voir aussi
Les balises `<style>` des composants monofichiers permettent de lier les valeurs CSS à l'état dynamique des composants via la fonction CSS `v-bind`. Cela permet d'obtenir des propriétés personnalisées sans augmentation de type.

- [v-bind() dans du CSS](/api/sfc-css-features.html#v-bind-in-css)
  :::
