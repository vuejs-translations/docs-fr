# API Globale : Générale {#global-api-general}

## version {#version}

Expose la version actuelle de Vue.

- **Type :** `string`

- **Exemple :**

  ```js
  import { version } from 'vue'

  console.log(version)
  ```

## nextTick() {#nexttick}

Un outil pour attendre la prochaine mise à jour du DOM.

- **Type :**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **Détails :**

  Lorsque vous modifiez un état réactif dans Vue, les mises à jour du DOM qui en résultent ne sont pas appliquées de manière synchrone. Au lieu de cela, Vue les met en mémoire tampon jusqu'au "next tick" afin de garantir que chaque composant ne soit mis à jour qu'une seule fois, quel que soit le nombre de modifications d'état que vous avez effectuées.

  `nextTick()` peut être utilisé immédiatement après un changement d'état pour attendre que les mises à jour du DOM soient terminées. Vous pouvez soit passer une fonction de rappel comme argument, soit attendre la promesse retournée.

- **Exemple :**

  <div class="composition-api">

  ```vue
  <script setup>
  import { ref, nextTick } from 'vue'

  const count = ref(0)

  async function increment() {
    count.value++

    // DOM pas encore mis à jour
    console.log(document.getElementById('counter').textContent) // 0

    await nextTick()
    // DOM désormais mis à jour
    console.log(document.getElementById('counter').textContent) // 1
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>
  <div class="options-api">

  ```vue
  <script>
  import { nextTick } from 'vue'

  export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      async increment() {
        this.count++

        // DOM pas encore mis à jour
        console.log(document.getElementById('counter').textContent) // 0

        await nextTick()
        // DOM désormais mis à jour
        console.log(document.getElementById('counter').textContent) // 1
      }
    }
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>

- **Voir aussi :** [`this.$nextTick()`](/api/component-instance#nexttick)

## defineComponent() {#definecomponent}

Un utilitaire de type pour définir un composant Vue avec l'inférence de type.

- **Type :**

  ```ts
  // options syntax
  function defineComponent(
    component: ComponentOptions
  ): ComponentConstructor

  // function syntax (requires 3.3+)
  function defineComponent(
    setup: ComponentOptions['setup'],
    extraOptions?: ComponentOptions
  ): () => any
  ```

  > Le type est simplifié dans un souci de lisibilité.

- **Détails :**

  Le premier argument attend un objet d'options de composant. La valeur retournée sera le même objet d'options, puisque la fonction est essentiellement sans opération à l'exécution pour seulement apporter l'inférence de type.

  Notez que le type retourné est un peu spécial : il s'agit d'un type constructeur dont le type d'instance est le type d'instance du composant déduit en fonction des options. C'est utilisé pour l'inférence de type lorsque le type retourné est utilisé comme balise dans du TSX.

  Vous pouvez extraire le type d'instance d'un composant (équivalent au type de `this` dans ses options) à partir du type retourné par `defineComponent()` de cette façon :

  ```ts
  const Foo = defineComponent(/* ... */)

  type FooInstance = InstanceType<typeof Foo>
  ```

  ### Function Signature <sup class="vt-badge" data-text="3.3+" /> {#function-signature}

  `defineComponent()` also has an alternative signature that is meant to be used with Composition API and [render functions or JSX](/guide/extras/render-function.html).

  Instead of passing in an options object, a function is expected instead. This function works the same as the Composition API [`setup()`](/api/composition-api-setup.html#composition-api-setup) function: it receives the props and the setup context. The return value should be a render function - both `h()` and JSX are supported:

  ```js
  import { ref, h } from 'vue'

  const Comp = defineComponent(
    (props) => {
      // use Composition API here like in <script setup>
      const count = ref(0)

      return () => {
        // render function or JSX
        return h('div', count.value)
      }
    },
    // extra options, e.g. declare props and emits
    {
      props: {
        /* ... */
      }
    }
  )
  ```

  The main use case for this signature is with TypeScript (and in particular with TSX), as it supports generics:

  ```tsx
  const Comp = defineComponent(
    <T extends string | number>(props: { msg: T; list: T[] }) => {
      // use Composition API here like in <script setup>
      const count = ref(0)

      return () => {
        // render function or JSX
        return <div>{count.value}</div>
      }
    },
    // manual runtime props declaration is currently still needed.
    {
      props: ['msg', 'list']
    }
  )
  ```

  In the future, we plan to provide a Babel plugin that automatically infers and injects the runtime props (like for `defineProps` in SFCs) so that the runtime props declaration can be omitted.

  ### Note sur le treeshaking de webpack {#note-on-webpack-treeshaking}

  Étant donné que `defineComponent()` est un appel de fonction, on pourrait attendre qu'il produise des effets de bord pour certains outils de build, par exemple webpack. Cela empêchera le composant d'être retiré de l'arbre même s'il n'est jamais utilisé.

  Pour indiquer à webpack que cet appel de fonction peut être retirée en toute tranquillité, vous pouvez ajouter un commentaire `/*#__PURE__*/` avant l'appel de fonction :

  ```js
  export default /*#__PURE__*/ defineComponent(/* ... */)
  ```

  Notez que cela n'est pas nécessaire si vous utilisez Vite, car Rollup (le bundler de production sous-jacent utilisé par Vite) est suffisamment intelligent pour déterminer que `defineComponent()` est en fait exempte d'effet secondaire sans avoir besoin d'annotations manuelles.

- **Voir aussi :** [Guide - Utiliser Vue avec TypeScript](/guide/typescript/overview#general-usage-notes)

## defineAsyncComponent() {#defineasynccomponent}

Définit un composant asynchrone qui est chargé de manière paresseuse uniquement lors de son rendu. L'argument peut être au choix une fonction de chargement, ou bien un objet d'options pour un contrôle plus avancé du comportement de chargement.

- **Type :**

  ```ts
  function defineAsyncComponent(
    source: AsyncComponentLoader | AsyncComponentOptions
  ): Component

  type AsyncComponentLoader = () => Promise<Component>

  interface AsyncComponentOptions {
    loader: AsyncComponentLoader
    loadingComponent?: Component
    errorComponent?: Component
    delay?: number
    timeout?: number
    suspensible?: boolean
    onError?: (
      error: Error,
      retry: () => void,
      fail: () => void,
      attempts: number
    ) => any
  }
  ```

- **Voir aussi :** [Guide - Composants asynchrones](/guide/components/async)

## defineCustomElement() {#definecustomelement}

Cette méthode accepte le même argument que [`defineComponent`](#definecomponent), mais renvoie à la place un constructeur natif de la classe [Custom Element](https://developer.mozilla.org/fr/docs/Web/Web_Components/Using_custom_elements).

- **Type :**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & { styles?: string[] })
      | ComponentOptions['setup']
  ): {
    new (props?: object): HTMLElement
  }
  ```

  > Le type est simplifié dans un souci de lisibilité.

- **Détails :**

  En plus des options classiques du composant, `defineCustomElement()` supporte également une option spéciale `styles`, qui doit être un tableau de chaînes de caractères CSS en ligne, pour fournir le CSS qui doit être injecté dans la racine du shadow DOM de l'élément.

  La valeur retournée est un constructeur d'élément personnalisé qui peut être enregistré en utilisant [`customElements.define()`](https://developer.mozilla.org/fr/docs/Web/API/CustomElementRegistry/define).

- **Exemple :**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* options du composant */
  })

  // Enregistrement de l'élément personnalisé.
  customElements.define('my-vue-element', MyVueElement)
  ```

- **Voir aussi :**

  - [Guide - Créer des éléments personnalisés avec Vue](/guide/extras/web-components#building-custom-elements-with-vue)

  - Notez également que `defineCustomElement()` nécessite une [configuration spéciale](/guide/extras/web-components#sfc-as-custom-element) lorsqu'elle est utilisée avec des composants monofichiers.
