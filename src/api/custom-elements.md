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

    // les options suivantes sont possibles à partir de la version 3.5
    configureApp?: (app: App) => void
    shadowRoot?: boolean
    nonce?: string
  }
  ```

  > Les types sont simplifiés pour une meilleure lisibilité.

- **Détails**

  En plus des options normales des composants, `defineCustomElement()` supporte également un certain nombre d'options spécifiques aux éléments personnalisés :

  - **`styles`**: un tableau de chaînes CSS pour fournir du CSS à injecter dans la shadow root de l'élément.

  - **`configureApp`** <sup class="vt-badge" data-text="3.5+"/>: une fonction qui peut être utilisée pour configurer l'instance de l'application Vue pour l'élément personnalisé.

  - **`shadowRoot`** <sup class="vt-badge" data-text="3.5+"/>: `boolean`, par défaut `true`. Définir à `false` pour restituer l'élément personnalisé sans shadow root. Cela signifie que `<style>` dans les SFC d'éléments personnalisés ne sera plus encapsulé.

  - **`nonce`** <sup class="vt-badge" data-text="3.5+"/>: `string`, s'il est fourni, sera défini comme l'attribut `nonce` sur les tags de style injectés dans la shadow root.

  Notez qu'au lieu d'être transmises comme une partie du composant lui-même, ces options peuvent également être transmises via un deuxième argument :

  ```js
  import Element from './MyElement.ce.vue'

  defineCustomElement(Element, {
    configureApp(app) {
      // ...
    }
  })
  ```

  La valeur de retour est un constructeur d'élément personnalisé qui peut être enregistré à l'aide de [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define).

- **Exemple**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* options des composants */
  })

  // Enregistrez l'élément personnalisé.
  customElements.define('my-vue-element', MyVueElement)
  ```

- **Voir aussi**

  - [Guide - Créer des éléments personnalisés avec Vue](/guide/extras/web-components#building-custom-elements-with-vue)

  - Notez également que `defineCustomElement()` nécessite une [configuration spéciale](/guide/extras/web-components#sfc-as-custom-element) lorsqu'il est utilisé avec des composants monofichiers.

## useHost() <sup class="vt-badge" data-text="3.5+"/> {#usehost}

Un assistant helper de la Composition API qui renvoie l'élément hôte de l'élément personnalisé Vue actuel.

## useShadowRoot() <sup class="vt-badge" data-text="3.5+"/> {#useshadowroot}

Un assistant helper de la Composition API qui renvoie la shadow root de l'élément personnalisé Vue actuel.

## this.$host <sup class="vt-badge" data-text="3.5+"/> {#this-host}

Une propriété de l'Options API qui expose l’élément hôte de l’élément personnalisé Vue actuel.
