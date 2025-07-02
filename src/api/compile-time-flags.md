---
outline: deep
---

# Indicateurs à la compilation {#compile-time-flags}

:::tip
Les indicateurs à la compilation ne s'appliquent que lors de l'utilisation de la version `esm-bundler` de Vue (c'est-à-dire `vue/dist/vue.esm-bundler.js`).
:::

Lorsque l'on utilise Vue avec des outils de build, il est possible de configurer un certain nombre d'indicateurs à la compilation pour activer/désactiver certaines fonctionnalités. L'avantage de l'utilisation des indicateurs à la compilation est que les fonctionnalités désactivées de cette manière peuvent être supprimées du paquet final via le *tree-shaking*.

Vue fonctionnera même si ces indicateurs ne sont pas explicitement configurés. Cependant, il est recommandé de toujours les configurer afin que les fonctionnalités concernées puissent être correctement supprimées lorsque cela est possible.

Voir [Guides de configuration](#configuration-guides) pour savoir comment les configurer en fonction de votre outil de construction.

## `__VUE_OPTIONS_API__` {#VUE_OPTIONS_API}

- **Par défaut:** `true`

  Activer / désactiver la prise en charge de l'Option API. La désactivation de cette fonction permet d'obtenir des paquets plus petits, mais peut affecter la compatibilité avec les bibliothèques tierces si elles s'appuient sur l'Option API.

## `__VUE_PROD_DEVTOOLS__` {#VUE_PROD_DEVTOOLS}

- **Par défaut:** `false`

  Activer / désactiver le support des outils de développement dans les versions de production. Cela aura pour conséquence d'inclure plus de code dans le *bundle*, il est donc recommandé de ne l'activer qu'à des fins de débogage.

## `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` {#VUE_PROD_HYDRATION_MISMATCH_DETAILS}

- **Par défaut :** `false`

  Activer / désactiver les avertissements détaillés pour les erreurs d'hydratation dans les versions de production. Cela aura pour conséquence d'inclure plus de code dans le bundle, il est donc recommandé de ne l'activer qu'à des fins de débogage.

## Guides de configuration {#configuration-guides}

- Disponible à partir de la version 3.4

### Vite {#vite}

`@vitejs/plugin-vue` fournit automatiquement des valeurs par défaut pour ces indicateurs. Pour changer les valeurs par défaut, utilisez [l'option de configuration `define`](https://vitejs.dev/config/shared-options.html#define) de Vite :

```js [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // activer les détails d'incohérences lors de l'hydratation dans la version de production
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})
```

### vue-cli {#vue-cli}

`@vue/cli-service` fournit automatiquement des valeurs par défaut pour certains de ces indicateurs. Pour configurer / modifier les valeurs :

```js [vue.config.js]
module.exports = {
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}
```

### webpack {#webpack}

Les indicateurs doivent être définis à l'aide de la fonction [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) de webpack :

```js [webpack.config.js]
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```

### Rollup {#rollup}

Les indicateurs doivent être définis à l'aide de [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace) :

```js [rollup.config.js]
import replace from '@rollup/plugin-replace'

export default {
  plugins: [
    replace({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```
