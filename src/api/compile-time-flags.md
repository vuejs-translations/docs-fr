---
outline: deep
---

# Indicateurs de temps de compilation {#compile-time-flags}

:::tip
Les indicateurs de compilation ne s'appliquent que lors de l'utilisation de la version `esm-bundler` de Vue (c'est-à-dire `vue/dist/vue.esm-bundler.js`).
:::

Lorsque l'on utilise Vue avec une étape de construction, il est possible de configurer un certain nombre d'indicateurs de compilation pour activer/désactiver certaines fonctionnalités. L'avantage de l'utilisation des indicateurs à la compilation est que les fonctionnalités désactivées de cette manière peuvent être supprimées du paquet final via le *tree-shaking*.

Vue fonctionnera même si ces indicateurs ne sont pas explicitement configurés. Cependant, il est recommandé de toujours les configurer afin que les fonctionnalités concernées puissent être correctement supprimées lorsque cela est possible.

Voir [Guides de configuration](#configuration-guides) pour savoir comment les configurer en fonction de votre outil de construction.

## `__VUE_OPTIONS_API__`

- **Par défaut:** `true`

  Activer / désactiver la prise en charge de l'Option API. La désactivation de cette fonction permet d'obtenir des paquets plus petits, mais peut affecter la compatibilité avec les bibliothèques tierces si elles s'appuient sur l'Option API.

## `__VUE_PROD_DEVTOOLS__`

- **Par défaut:** `false`

  Activer / désactiver le support des outils de développement dans les versions de production. Cela aura pour conséquence d'inclure plus de code dans le *bundle*, il est donc recommandé de ne l'activer qu'à des fins de débogage.

## `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` <sup class="vt-badge" data-text="3.4+" />

- **Default:** `false`

  Enable/disable detailed warnings for hydration mismatches in production builds. This will result in more code included in the bundle, so it is recommended to only enable this for debugging purposes.

## Guides de configuration

### Vite

`@vitejs/plugin-vue` automatically provides default values for these flags. To change the default values, use Vite's [`define` config option](https://vitejs.dev/config/shared-options.html#define):

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})
```

### vue-cli

`@vue/cli-service` automatically provides default values for some of these flags. To configure /change the values:

```js
// vue.config.js
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

### webpack

Flags should be defined using webpack's [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

```js
// webpack.config.js
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

### Rollup

Flags should be defined using [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace):

```js
// rollup.config.js
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
