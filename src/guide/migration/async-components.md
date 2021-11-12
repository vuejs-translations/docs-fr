---
badges:
  - new
---

# Async Components <MigrationBadges :badges="$frontmatter.badges" />

## Aperçu

Voici un aperçu de haut niveau de ce qui a changé :

- Nouvelle méthode d'aide `defineAsyncComponent` qui définit explicitement les composants asynchrones.
- L'option `component` a été renommée en `loader`.
- La fonction Loader ne reçoit pas intrinsèquement les arguments `resolve` et `reject` et doit retourner une Promise

Pour une explication plus approfondie, lisez la suite !

## Introduction

Auparavant, les composants asynchrones étaient créés en définissant simplement un composant comme une fonction qui retournait une promesse, comme par exemple :

```js
const asyncPage = () => import('./NextPage.vue')
```

Ou, pour la syntaxe plus avancée des composants avec options :

```js
const asyncPage = {
  component: () => import('./NextPage.vue'),
  delay: 200,
  timeout: 3000,
  error: ErrorComponent,
  loading: LoadingComponent
}
```

## Syntaxe 3.x

Maintenant, dans Vue 3, puisque les composants fonctionnels sont définis comme de pures fonctions, les définitions de composants asynchrones doivent être explicitement définies en les enveloppant dans une nouvelle aide `defineAsyncComponent` :

```js
import { defineAsyncComponent } from 'vue'
import ErrorComponent from './components/ErrorComponent.vue'
import LoadingComponent from './components/LoadingComponent.vue'

// Composant asynchrone sans options
const asyncPage = defineAsyncComponent(() => import('./NextPage.vue'))

// Composant asynchrone avec options
const asyncPageWithOptions = defineAsyncComponent({
  loader: () => import('./NextPage.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
```

Une autre modification apportée par rapport à la version 2.x est que l'option `component` est maintenant renommée en `loader` afin de communiquer de manière précise qu'une définition de composant ne peut être fournie directement.

```js{4}
import { defineAsyncComponent } from 'vue'

const asyncPageWithOptions = defineAsyncComponent({
  loader: () => import('./NextPage.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
```

De plus, contrairement à la version 2.x, la fonction loader ne reçoit plus les arguments `resolve` et `reject` et doit toujours retourner une Promise.

```js
// 2.x version
const oldAsyncComponent = (resolve, reject) => {
  /* ... */
}

// 3.x version
const asyncComponent = defineAsyncComponent(
  () =>
    new Promise((resolve, reject) => {
      /* ... */
    })
)
```

Pour plus d'informations sur l'utilisation des composants asynchrones, voir :

- [Guide : Composants dynamiques et asynchrones](/guide/component-dynamic-async.html#composants-dynamiques-avec-keep-alive)
