# API de rendu personnalisé {#custom-renderer-api}

## createRenderer() {#createrenderer}

Crée un rendu personnalisé. En fournissant des API de création et de manipulation de nœuds spécifiques à la plate-forme, vous pouvez tirer parti du noyau d'exécution de Vue pour cibler les environnements non DOM.

- **Type :**

  ```ts
  function createRenderer<HostNode, HostElement>(
    options: RendererOptions<HostNode, HostElement>
  ): Renderer<HostElement>

  interface Renderer<HostElement> {
    render: RootRenderFunction<HostElement>
    createApp: CreateAppFunction<HostElement>
  }

  interface RendererOptions<HostNode, HostElement> {
    patchProp(
      el: HostElement,
      key: string,
      prevValue: any,
      nextValue: any,
      namespace?: ElementNamespace,
      parentComponent?: ComponentInternalInstance | null
    ): void
    insert(
      el: HostNode,
      parent: HostElement,
      anchor?: HostNode | null
    ): void
    remove(el: HostNode): void
    createElement(
      type: string,
      namespace?: ElementNamespace,
      isCustomizedBuiltIn?: string,
      vnodeProps?: (VNodeProps & { [key: string]: any }) | null
    ): HostElement
    createText(text: string): HostNode
    createComment(text: string): HostNode
    setText(node: HostNode, text: string): void
    setElementText(node: HostElement, text: string): void
    parentNode(node: HostNode): HostElement | null
    nextSibling(node: HostNode): HostNode | null
    querySelector?(selector: string): HostElement | null
    setScopeId?(el: HostElement, id: string): void
    cloneNode?(node: HostNode): HostNode
    insertStaticContent?(
      content: string,
      parent: HostElement,
      anchor: HostNode | null,
      namespace: ElementNamespace,
      start?: HostNode | null,
      end?: HostNode | null
    ): [HostNode, HostNode]
  }
  ```

- **Exemple**

  ```js
  import { createRenderer } from '@vue/runtime-core'

  const { render, createApp } = createRenderer({
    patchProp,
    insert,
    remove,
    createElement
    // ...
  })

  // `render` est l'API de bas niveau
  // `createApp` retourne une instance de l'application
  export { render, createApp }

  // réexporte les API principales de Vue
  export * from '@vue/runtime-core'
  ```

  Le propre `@vue/runtime-dom` de Vue est [implémenté en utilisant la même API](https://github.com/vuejs/core/blob/main/packages/runtime-dom/src/index.ts). Pour une implémentation plus simple, consultez [`@vue/runtime-test`](https://github.com/vuejs/core/blob/main/packages/runtime-test/src/index.ts) qui est un paquet privé pour les tests unitaires de Vue.
