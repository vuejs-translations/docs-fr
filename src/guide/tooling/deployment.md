# Déploiement de la production

::: info
La plupart des conseils ci-dessous sont activés par défaut si vous utilisez [Vue CLI] (https://cli.vuejs.org). Cette section n'est pertinente que si vous utilisez une configuration de construction personnalisée.
:::

## Activer le mode production

Pendant le développement, Vue fournit de nombreux avertissements pour vous aider à éviter les erreurs et les pièges courants. Cependant, ces chaînes d'avertissement deviennent inutiles en production et gonflent la taille de la charge utile de votre application. En outre, certains de ces contrôles d'avertissement ont un coût d'exécution faible qui peut être évité en [mode production](https://cli.vuejs.org/guide/mode-and-env.html#modes).

### Sans outils de compilation

Si vous utilisez la version complète, c'est-à-dire si vous incluez directement Vue via une balise de script sans outil de compilation, assurez-vous d'utiliser la version miniaturisée pour la production. Vous trouverez cette version dans le [Guide d'installation](/guide/installation.html#cdn).

### Avec les outils de construction

Lorsque vous utilisez un outil de construction comme Webpack ou Browserify, le mode de production sera déterminé par `process.env.NODE_ENV` dans le code source de Vue, et il sera en mode développement par défaut. Les deux outils de construction permettent d'écraser cette variable pour activer le mode production de Vue, et les avertissements seront supprimés par les mineurs pendant la construction. La CLI de Vue est préconfigurée pour vous, mais il serait utile de savoir comment cela se passe :

#### Webpack

Dans Webpack 4+, vous pouvez utiliser l'option `mode` :

```js
module.exports = {
  mode: 'production'
}
```

#### Browserify

- Exécutez votre commande de regroupement avec la variable d'environnement `NODE_ENV` définie sur `"production"`. Cela indique à `vueify` d'éviter d'inclure le code lié au hot-reload et au développement.

- Appliquez une transformation globale [envify](https://github.com/hughsk/envify) à votre paquet. Cela permet au mineur de supprimer tous les avertissements dans le code source de Vue enveloppé dans des blocs conditionnels de variables env. Par exemple :

  ```bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
  ```

- Or, using [envify](https://github.com/hughsk/envify) with Gulp:

  ```js
  // Utilisez le module personnalisé envify pour spécifier les variables d'environnement.
  const envify = require('envify/custom')

  browserify(browserifyOptions)
    .transform(vueify)
    .transform(
      // Requis afin de traiter les fichiers node_modules
      { global: true },
      envify({ NODE_ENV: 'production' })
    )
    .bundle()
  ```

- Or, using [envify](https://github.com/hughsk/envify) with Grunt and [grunt-browserify](https://github.com/jmreidy/grunt-browserify):

  ```js
  // Utilisez le module personnalisé envify pour spécifier les variables d'environnement.
  const envify = require('envify/custom')

  browserify: {
    dist: {
      options: {
        // Fonction pour dévier de l'ordre par défaut de grunt-browserify
        configure: (b) =>
          b
            .transform('vueify')
            .transform(
              // Requis afin de traiter les fichiers node_modules
              { global: true },
              envify({ NODE_ENV: 'production' })
            )
            .bundle()
      }
    }
  }
  ```

#### Rollup

Utilisez [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace):

```js
const replace = require('@rollup/plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
}).then(...)
```

## Pré-compilation des modèles

Lorsque vous utilisez des modèles in-DOM ou des chaînes de modèles in-JavaScript, la compilation modèle-fonction de rendu est effectuée à la volée. Cette méthode est généralement assez rapide dans la plupart des cas, mais il est préférable de l'éviter si votre application est sensible aux performances.

La façon la plus simple de précompiler les modèles est d'utiliser [Single-File Components](/guide/single-file-component.html) - les configurations de construction associées effectuent automatiquement la précompilation pour vous, de sorte que le code construit contient les fonctions de rendu déjà compilées au lieu des chaînes de modèle brutes.

Si vous utilisez Webpack et préférez séparer les fichiers JavaScript et les fichiers de modèle, vous pouvez utiliser [vue-template-loader](https://github.com/ktsn/vue-template-loader), qui transforme également les fichiers de modèle en fonctions de rendu JavaScript pendant l'étape de construction.

## Extraction du CSS des composants

Lorsque vous utilisez des composants à fichier unique, les feuilles de style CSS contenues dans les composants sont injectées dynamiquement sous forme de balises `<style>` via JavaScript. Cela a un faible coût d'exécution, et si vous utilisez le rendu côté serveur, cela provoquera un "flash de contenu non stylisé". L'extraction du CSS de tous les composants dans un même fichier permet d'éviter ces problèmes et d'améliorer la minification et la mise en cache du CSS.

Reportez-vous aux documentations des outils de construction respectifs pour savoir comment procéder :

- [Webpack + vue-loader](https://vue-loader.vuejs.org/en/configurations/extract-css.html) (the `vue-cli` webpack template has this pre-configured)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://rollup-plugin-vue.vuejs.org/)

## Suivi des erreurs d'exécution

Si une erreur d'exécution se produit pendant le rendu d'un composant, elle sera transmise à la fonction de configuration globale `app.config.errorHandler` si elle a été définie. Ce serait une bonne idée d'utiliser ce crochet avec un service de suivi des erreurs comme [Sentry](https://sentry.io), qui fournit [une intégration officielle](https://sentry.io/for/vue/) pour Vue.
