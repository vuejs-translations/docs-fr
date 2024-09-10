# Options : Rendu {#options-rendering}

## template {#template}

Un modèle de chaîne de caractères pour le composant.

- **Type :**

  ```ts
  interface ComponentOptions {
    template?: string
  }
  ```

- **Détails**

  Un template fourni via l'option `template` sera compilé à la volée lors de l'exécution. Cette option n'est prise en charge que si vous utilisez une version de Vue qui inclut le compilateur de templates. Ce dernier n'est **PAS** inclus dans les builds de Vue qui ont le mot `runtime` dans leur nom, comme par exemple `vue.runtime.esm-bundler.js`. Consultez le [guide sur le fichier dist](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use) pour plus de détails sur les différents builds.

  Si la chaîne de caractères commence par `#`, elle sera utilisée comme `querySelector` et utilisera le `innerHTML` de l'élément sélectionné en guise de chaîne de caractères pour le template. Cela permet de créer le template source à l'aide d'éléments `<template>` natifs.

  Si l'option `render` est également présente dans le même composant, `template` sera ignoré.

  Si le composant racine de votre application n'a pas d'option `template` ou `render` de spécifiée, Vue essaiera à la place d'utiliser le `innerHTML` de l'élément monté comme template.

  :::warning Remarque sur la sécurité
  N'utilisez que des sources de templates auxquelles vous pouvez faire confiance. N'utilisez pas de contenu fourni par l'utilisateur en guise de template. Voir le [guide sur la sécurité](/guide/best-practices/security#rule-no-1-never-use-non-trusted-templates) pour plus de détails.
  :::

## render {#render}

Une fonction qui retourne automatiquement l'arbre du DOM virtuel du composant.

- **Type :**

  ```ts
  interface ComponentOptions {
    render?(this: ComponentPublicInstance) => VNodeChild
  }

  type VNodeChild = VNodeChildAtom | VNodeArrayChildren

  type VNodeChildAtom =
    | VNode
    | string
    | number
    | boolean
    | null
    | undefined
    | void

  type VNodeArrayChildren = (VNodeArrayChildren | VNodeChildAtom)[]
  ```

- **Détails**

  `render` est une alternative aux templates qui vous permet de tirer parti de toute la puissance de JavaScript pour déclarer le rendu du composant.

  Les templates pré-compilés, par exemple ceux des composants monofichiers, sont compilés dans l'option `render` au moment du build. Si les deux options `render` et `template` sont présentes dans un composant, `render` aura la priorité.

- **Voir aussi**
  - [Mécanismes de rendu](/guide/extras/rendering-mechanism)
  - [Fonctions de rendu](/guide/extras/render-function)

## compilerOptions {#compileroptions}

Configure les options du compilateur d'exécution pour le template du composant.

- **Type :**

  ```ts
  interface ComponentOptions {
    compilerOptions?: {
      isCustomElement?: (tag: string) => boolean
      whitespace?: 'condense' | 'preserve' // par défaut: 'condense'
      delimiters?: [string, string] // par défaut : ['{{', '}}']
      comments?: boolean // par défaut : false
    }
  }
  ```

- **Détails**

  Cette option de configuration n'est respectée que lors de l'utilisation du build complet (c'est-à-dire le build `vue.js` autonome qui peut compiler des templates dans le navigateur). Elle prend en charge les mêmes options que [app.config.compilerOptions](/api/application#app-config-compileroptions) au niveau de l'application, et a la plus haute priorité pour le composant actuel.

- **Voir aussi** [app.config.compilerOptions](/api/application#app-config-compileroptions)

## slots<sup class="vt-badge ts"/> {#slots}

- Prise en charge à partir de la version 3.3+

Une option pour aider à l'inférence de type lors de l'utilisation de slots dans les fonctions de rendu. 

- **Détails**

  La valeur de cette option lors de l'exécution n'est pas utilisée. Les types réels doivent être déclarés via un casting de type grâce à l'utilitaire de type `SlotsType` :

  ```ts
  import { SlotsType } from 'vue'

  defineComponent({
    slots: Object as SlotsType<{
      default: { foo: string; bar: number }
      item: { data: number }
    }>,
    setup(props, { slots }) {
      expectType<
        undefined | ((scope: { foo: string; bar: number }) => any)
      >(slots.default)
      expectType<undefined | ((scope: { data: number }) => any)>(
        slots.item
      )
    }
  })
  ```
