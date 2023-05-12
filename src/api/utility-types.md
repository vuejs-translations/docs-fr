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

- **Voir aussi :** [Guide - Typer les props des composants](/guide/typescript/options-api#typing-component-props)

## MaybeRef\<T> {#mayberef}

Alias for `T | Ref<T>`. Useful for annotating arguments of [Composables](/guide/reusability/composables.html).

- Only supported in 3.3+.

## MaybeRefOrGetter\<T> {#maybereforgetter}

Alias for `T | Ref<T> | (() => T)`. Useful for annotating arguments of [Composables](/guide/reusability/composables.html).

- Only supported in 3.3+.

## ExtractPropTypes\<T> {#extractproptypes}

Extract prop types from a runtime props options object. The extracted types are internal facing - i.e. the resolved props received by the component. This means boolean props and props with default values are always defined, even if they are not required.

To extract public facing props, i.e. props that the parent is allowed to pass, use [`ExtractPublicPropTypes`](#extractpublicproptypes).

- **Example**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar: boolean,
  //   baz: number,
  //   qux: number
  // }
  ```

## ExtractPublicPropTypes\<T> {#extractpublicproptypes}

Extract prop types from a runtime props options object. The extracted types are public facing - i.e. the props that the parent is allowed to pass.

- **Example**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPublicPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar?: boolean,
  //   baz: number,
  //   qux?: number
  // }
  ```

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
  Les augmentations doivent être placées dans un fichier module `.ts` ou `.d.ts`. Consultez le [placement des annotations de types](/guide/typescript/options-api#augmenting-global-properties) pour plus de détails.
  :::

- **Voir aussi :** [Guide - Augmenter les propriétés globales](/guide/typescript/options-api#augmenting-global-properties)

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
  Les augmentations doivent être placées dans un fichier module `.ts` ou `.d.ts`. Consultez le [placement des annotations de types](/guide/typescript/options-api#augmenting-global-properties) pour plus de détails.
  :::

- **Voir aussi :** [Guide - Augmenter les options personnalisées](/guide/typescript/options-api#augmenting-custom-options)

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
  Les augmentations doivent être placées dans un fichier module `.ts` ou `.d.ts`. Consultez le [placement des annotations de types](/guide/typescript/options-api#augmenting-global-properties) pour plus de détails.
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
  <div :style="{ '--bg-color': 'blue' }"></div>
  ```

:::tip
Les augmentations doivent être placées dans un fichier module `.ts` ou `.d.ts`. Consultez le [placement des annotations de types](/guide/typescript/options-api#augmenting-global-properties) pour plus de détails.
:::
  
:::info Voir aussi
Les balises `<style>` des composants monofichiers permettent de lier les valeurs CSS à l'état dynamique des composants via la fonction CSS `v-bind`. Cela permet d'obtenir des propriétés personnalisées sans augmentation de type.

- [v-bind() dans du CSS](/api/sfc-css-features#v-bind-in-css)
:::
