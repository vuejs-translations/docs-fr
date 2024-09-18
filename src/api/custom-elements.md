# API des éléments personnalisés {#custom-elements-api}

## defineCustomElement() {#definecustomelement}

Cette méthode accepte le même argument que [`defineComponent`](#definecomponent), mais renvoie à la place un constructeur natif de classe [Élément personnalisé](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

- **Type**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & CustomElementsOptions)
      | ComponentOptions['setup'],
    options?: CustomElementsOptions
  ): {
    new (props?: object): HTMLElement
  }

  interface CustomElementsOptions {
    styles?: string[]

    // les options suivantes sont possibles 3.5+
    configureApp?: (app: App) => void
    shadowRoot?: boolean
    nonce?: string
  }
  ```

  > Les caractères sont simplifiés pour une meilleure lisibilité.

- **Détails**

  En plus des options normales des composants, `defineCustomElement()` supporte également un certain nombre d'options spécifiques aux éléments personnalisés :

  - **`styles`**: un tableau de chaînes CSS intégrées pour fournir du CSS à injecter dans la racine de l'ombre de l'élément.

  - **`configureApp`** <sup class="vt-badge" data-text="3.5+"/>: une fonction qui peut être utilisée pour configurer l'instance de l'application Vue pour l'élément personnalisé.

  - **`shadowRoot`** <sup class="vt-badge" data-text="3.5+"/>: `boolean`, par défaut `true`. Définir à `false` pour restituer l'élément personnalisé sans racine fantôme. Cela signifie que `<style>` dans les SFC d'éléments personnalisés ne sera plus encapsulé.

  - **`nonce`** <sup class="vt-badge" data-text="3.5+"/>: `string`, s'il est fourni, sera défini comme l'attribut `nonce` sur les tags de style injectés dans la racine de l'ombre.

  Notez qu'au lieu d'être transmises dans le cadre du composant lui-même, ces options peuvent également être transmises via un deuxième argument :

  ```js
  import Element from './MyElement.ce.vue'

  defineCustomElement(Element, {
    configureApp(app) {
      // ...
    }
  })
  ```

  La valeur de retour est un constructeur d'élément personnalisé qui peut être enregistré à l'aide de [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define).

- **Example**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* component options */
  })

  // Register the custom element.
  customElements.define('my-vue-element', MyVueElement)
  ```

- **See also**

  - [Guide - Building Custom Elements with Vue](/guide/extras/web-components#building-custom-elements-with-vue)

  - Also note that `defineCustomElement()` requires [special config](/guide/extras/web-components#sfc-as-custom-element) when used with Single-File Components.

## useHost() <sup class="vt-badge" data-text="3.5+"/> {#usehost}

A Composition API helper that returns the host element of the current Vue custom element.

## useShadowRoot() <sup class="vt-badge" data-text="3.5+"/> {#useshadowroot}

A Composition API helper that returns the shadow root of the current Vue custom element.

## this.$host <sup class="vt-badge" data-text="3.5+"/> {#this-host}

An Options API property that exposes the host element of the current Vue custom element.
