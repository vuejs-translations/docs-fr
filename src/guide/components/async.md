# Composants asynchrones {#async-components}

## Utilisation de base {#basic-usage}

Dans des applications de taille importante, il est parfois judicieux de diviser l'application en plus petits morceaux et ne charger un composant depuis le serveur que lorsque cela est nécessaire. Pour rendre cela possible, Vue a une fonction [`defineAsyncComponent`](/api/general#defineasynccomponent) :

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...charger le composant depuis le serveur
    resolve(/* composant chargé */)
  })
})
// ... utiliser `AsyncComp` comme un composant normal
```

Comme vous pouvez le voir, `defineAsyncComponent` accepte une fonction de chargement qui renvoie une promesse (Promise). La fonction `resolve` de la promesse doit être appelée lorsque vous avez récupéré la définition de votre composant à partir du serveur. Vous pouvez également appeler `reject(reason)` pour indiquer que le chargement a échoué.

L'[import dynamique des modules ES](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports) renvoie également une promesse, ainsi la plupart du temps, nous l'utiliserons en combinaison avec `defineAsyncComponent`. Les Bundlers comme Vite et webpack prennent également en charge la syntaxe (et l'utiliseront comme méthode de séparation du bundle), nous pouvons donc l'utiliser pour importer des SFC Vue :

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

L'`AsyncComp` résultant est un composant wrapper qui n'appelle la fonction de chargement que lorsque le composant est réellement rendu sur la page. De plus, il transmettra tous les props et slots au composant sous-jacent, de sorte que vous pouvez utiliser le wrapper asynchrone pour remplacer de manière transparente le composant d'origine tout en réalisant un lazy loading.

Comme pour les composants normaux, les composants asynchrones peuvent être [enregistrés globalement](/guide/components/registration#global-registration) à l'aide de `app.component()` :

```js
app.component(
  'MyComponent',
  defineAsyncComponent(() => import('./components/MyComponent.vue'))
)
```

<div class="options-api">

Vous pouvez également utiliser `defineAsyncComponent` lors de l'[enregistrement local d'un composant](/guide/components/registration#local-registration) :

```vue
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AdminPage: defineAsyncComponent(() =>
      import('./components/AdminPageComponent.vue')
    )
  }
}
</script>

<template>
  <AdminPage />
</template>
```

</div>

<div class="composition-api">

Ils peuvent également être définis directement à l'intérieur de leur composant parent :

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

</div>

## Etats de chargement et d'erreur {#loading-and-error-states}

Les opérations asynchrones impliquent inévitablement des états de chargement et d'erreur - `defineAsyncComponent()` prend en charge la gestion de ces états via des options avancées :

```js
const AsyncComp = defineAsyncComponent({
  // la fonction de chargememnt
  loader: () => import('./Foo.vue'),

  // Un composant à utiliser pendant le chargement du composant asynchrone
  loadingComponent: LoadingComponent,
  // Délai avant l'affichage du composant de chargement. Par défaut : 200 ms.
  delay: 200,

  // Un composant à utiliser si le chargement échoue
  errorComponent: ErrorComponent,
  // Le composant d'erreur sera affiché si un délai d'attente est
  // fourni et dépassé. Par défaut : Infini.
  timeout: 3000
})
```

Si un composant de chargement est fourni, il sera affiché en premier lors du chargement du composant sous-jacent. Il y a un délai par défaut de 200 ms avant que le composant de chargement ne s'affiche - car sur les réseaux rapides, un état de chargement instantané peut être remplacé trop rapidement et finir par apparaitre comme un effet de scintillement à l'écran.

Si un composant d'erreur est fourni, il sera affiché lorsque la promesse renvoyée par la fonction de chargement est rejetée. Vous pouvez également spécifier un délai d'expiration pour afficher le composant d'erreur lorsque la demande prend trop de temps.

## Hydratation paresseuse <sup class="vt-badge" data-text="3.5+" /> {#lazy-hydration}

> Cette section ne s'applique que si vous utilisez [Rendu côté serveur (SSR)](/guide/scaling-up/ssr).

Dans Vue 3.5+, les composants asynchrones peuvent contrôler le moment où ils sont hydratés en fournissant une stratégie d'hydratation.

- Vue fournit un certain nombre de stratégies d'hydratation intégrées. Ces stratégies intégrées doivent être importées individuellement afin qu'elles puissent être supprimées si elles ne sont pas utilisées.

- La conception est intentionnellement de bas niveau pour plus de flexibilité. Le sucre syntaxique du compilateur peut potentiellement être construit sur cette base à l'avenir, soit dans le noyau, soit dans des solutions de plus haut niveau (par exemple, Nuxt).

### Hydratation quand stable  {#hydrate-on-idle}

Hydrate par `requestIdleCallback`:

```js
import { defineAsyncComponent, hydrateOnIdle } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnIdle(/* optionnellement, passer un délai maximum */)
})
```

### Hydratation quand visible {#hydrate-on-visible}

Hydratez lorsque le(s) élément(s) devient(ent) visible(s) via `IntersectionObserver`.

```js
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnVisible()
})
```

Peut optionnellement passer une valeur d'objet d'options pour l'observateur :

```js
hydrateOnVisible({ rootMargin: '100px' })
```

### Hydrate on Media Query {#hydrate-on-media-query}

Hydrates when the specified media query matches.

```js
import { defineAsyncComponent, hydrateOnMediaQuery } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnMediaQuery('(max-width:500px)')
})
```

### Hydratation à l'interaction {#hydrate-on-interaction}

S'hydrate lorsque le ou les événements spécifiés sont déclenchés sur le ou les éléments du composant. L'événement qui a déclenché l'hydratation sera également rejoué une fois l'hydratation terminée.

```js
import { defineAsyncComponent, hydrateOnInteraction } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnInteraction('click')
})
```

Il peut également s'agir d'une liste de plusieurs types d'événements :

```js
hydrateOnInteraction(['wheel', 'mouseover'])
```

### Stratégie personnalisée {#custom-strategy}

```ts
import { defineAsyncComponent, type HydrationStrategy } from 'vue'

const myStrategy: HydrationStrategy = (hydrate, forEachElement) => {
  // forEachElement est un helper qui permet de parcourir tous les éléments de la racine
  // dans le DOM non hydraté du composant, puisque la racine peut être un fragment
  // au lieu d'un seul élément
  forEachElement(el => {
    // ...
  })
  // appeler `hydrate` lorsqu'il est prêt
  hydrate()
  return () => {
    // retourner une fonction de démontage si nécessaire
  }
}

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: myStrategy
})
```

## Utilisation avec Suspense {#using-with-suspense}

Les composants asynchrones peuvent être utilisés avec le composant fourni `<Suspense>`. L'interaction entre `<Suspense>` et les composants asynchrones est documentée dans le [chapitre dédié à `<Suspense>`](/guide/built-ins/suspense).
