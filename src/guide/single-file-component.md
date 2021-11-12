## Composants d'un fichier unique

## Introduction

Dans de nombreux projets Vue, les composants globaux seront définis en utilisant `app.component()`, suivi de `app.mount('#app')` pour cibler un élément conteneur dans le corps de chaque page.

Cela peut fonctionner très bien pour des projets de petite ou moyenne envergure, où JavaScript n'est utilisé que pour améliorer certaines vues. Cependant, dans des projets plus complexes, ou lorsque votre frontend est entièrement piloté par JavaScript, ces inconvénients deviennent apparents :

- **Les définitions globales** obligent à donner un nom unique à chaque composant.
- **Les modèles de chaîne de caractères** manquent de coloration syntaxique et nécessitent d'affreuses barres obliques pour le HTML multiligne.
- **Pas de support CSS** signifie que si HTML et JavaScript sont modularisés en composants, CSS est ostensiblement laissé de côté.
- **Aucune étape de construction** nous limite au HTML et au JavaScript ES5, plutôt qu'à des préprocesseurs comme Pug (anciennement Jade) et Babel.

Tous ces problèmes sont résolus par des **composants à fichier unique** avec une extension `.vue`, rendus possibles par des outils de construction tels que Webpack ou Browserify.

Voici un exemple de fichier que nous appellerons `Hello.vue` :

<a href="https://codepen.io/team/Vue/pen/3de13b5cd0133df4ecf307b6cf2c5f94" target="_blank" rel="noopener noreferrer"><img src="/images/sfc.png" width="403" alt="Single-file component example (click for code as text)" style="display : block ; margin : 15px auto ; max-width : 100%"></a>

Nous obtenons maintenant :

- [Coloration syntaxique complète](https://github.com/vuejs/awesome-vue#source-code-editing)
- [Modules CommonJS](https://webpack.js.org/concepts/modules/#what-is-a-webpack-module)
- [CSS adapté aux composants](https://vue-loader.vuejs.org/en/features/scoped-css.html)

Comme promis, nous pouvons également utiliser des préprocesseurs tels que Pug, Babel (avec les modules ES2015) et Stylus pour obtenir des composants plus propres et plus riches en fonctionnalités.

<a href="https://codesandbox.io/s/vue-single-file-component-with-pre-processors-mr3ik?file=/src/App.vue" target="_blank" rel="noopener noreferrer"><img src="/images/sfc-with-preprocessors.png" width="563" alt="Single-file component with pre-processors example (click for code as text)" style="display : block ; margin : 15px auto ; max-width : 100%"></a>

Ces langages spécifiques ne sont que des exemples. Vous pourriez tout aussi bien utiliser TypeScript, SCSS, PostCSS, ou tout autre préprocesseur qui vous aide à être productif. Si vous utilisez Webpack avec `vue-loader`, il a également un support de première classe pour les modules CSS.

### Qu'en est-il de la séparation des préoccupations ?

Dans le développement d'interfaces utilisateur modernes, nous avons constaté qu'au lieu de diviser la base de code en trois énormes couches qui s'entrecroisent, il est beaucoup plus logique de les diviser en composants faiblement couplés et de les composer. À l'intérieur d'un composant, son modèle, sa logique et ses styles sont intrinsèquement couplés, et leur regroupement rend le composant plus cohérent et plus facile à maintenir.

Même si vous n'aimez pas l'idée des composants à fichier unique, vous pouvez toujours tirer parti de ses fonctions de chargement à chaud et de précompilation en séparant votre JavaScript et votre CSS dans des fichiers distincts :

```html
<!-- my-component.vue -->
<template>
  <div>This will be pre-compiled</div>
</template>
<script src="./my-component.js"></script>
<style src="./my-component.css"></style>
```

### Démarrage

### Exemple Sandbox

Si vous souhaitez vous lancer dans l'aventure et commencer à jouer avec des composants à fichier unique, consultez [this simple todo app](https://codesandbox.io/s/vue-todo-list-app-with-single-file-component-vzkl3?file=/src/App.vue) sur CodeSandbox.

### Pour les utilisateurs novices en matière de systèmes de construction de modules en JavaScript

Avec les composants `.vue`, nous entrons dans le domaine des applications JavaScript avancées. Cela signifie que vous devez apprendre à utiliser quelques outils supplémentaires si vous ne l'avez pas déjà fait :

- **Node Package Manager (npm)** : Lisez la section [Guide de démarrage](https://docs.npmjs.com/packages-and-modules/getting-packages-from-the-registry) pour savoir comment obtenir des paquets à partir du registre.

- **Modern JavaScript with ES2015/16** : Lisez le [Guide d'apprentissage ES2015](https://babeljs.io/docs/en/learn) de Babel. Vous n'avez pas besoin de mémoriser toutes les fonctionnalités pour le moment, mais gardez cette page comme référence à laquelle vous pourrez revenir.

Après avoir pris une journée pour vous plonger dans ces ressources, nous vous recommandons de consulter [Vue CLI](https://cli.vuejs.org/). Suivez les instructions et vous devriez avoir un projet Vue avec des composants `.vue`, ES2015, webpack et hot-reloading en un rien de temps !

### Pour les utilisateurs avancés

L'interface CLI prend en charge la plupart des configurations d'outils pour vous, mais permet également une personnalisation plus fine grâce à ses propres [options de configuration](https://cli.vuejs.org/config/).

Si vous préférez mettre en place votre propre configuration de construction à partir de zéro, vous devrez configurer manuellement webpack avec [vue-loader](https://vue-loader.vuejs.org). Pour en savoir plus sur webpack, consultez [sa documentation officielle](https://webpack.js.org/configuration/) et [webpack learning academy](https://webpack.academy/p/the-core-concepts).

### Construction avec rollup

La plupart du temps, lorsque nous développons une bibliothèque tierce, nous voulons la construire de manière à ce que les utilisateurs de la bibliothèque puissent la [tree shake](https://webpack.js.org/guides/tree-shaking/). Pour permettre le tree-shaking, nous devons construire des modules `esm`. Comme webpack et, à son tour, vue-cli ne prennent pas en charge la construction de modules `esm`, nous devons compter sur [rollup](https://rollupjs.org/).

#### Installation de Rollup

Nous allons devoir installer Rollup et quelques dépendances :

```bash
npm install --save-dev rollup @rollup/plugin-commonjs rollup-plugin-vue 
```

Il s'agit de la quantité minimale de plugins rollup que nous devons utiliser pour compiler le code d'un module `esm`. Nous pouvons également ajouter [rollup-plugin-babel](https://github.com/rollup/plugins/tree/master/packages/babel) pour transpiler leur code et [node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) si nous utilisons des dépendances que nous voulons regrouper avec notre bibliothèque.

#### Configurer Rollup

Pour configurer notre build avec Rollup, nous devons créer un fichier `rollup.config.js` à la racine de notre projet :

```bash
touch rollup.config.js
```

Une fois le fichier créé, nous devrons l'ouvrir avec l'éditeur de notre choix et ajouter le code suivant.

```javascript
// import de nos plugins tiers
import commonjs from 'rollup-plugin-commonjs'
import VuePlugin from 'rollup-plugin-vue'
import pkg from './package.json' // importer notre fichier package.json pour réutiliser le nommage

export default {
  // c'est le fichier contenant tous nos composants/fonctions exportés
  input: 'src/index.js',
  // il s'agit d'un tableau de formats exportés
  output: [ 
    {
      file : pkg.module, // le nom de notre bibliothèque esm
      format : 'esm', // le format de votre choix
      sourcemap : true, // demande au rollup d'inclure les sourcesmaps
    }
  ],
  // c'est un tableau des plugins que nous incluons.
  plugins: [
    commonjs(),
    VuePlugin()
  ],
  // demander au rollup de ne pas regrouper Vue dans la bibliothèque
  external: ['vue']
}
```

#### Configuration du fichier package.json

Pour profiter de notre module `esm` nouvellement créé, nous devons ajouter quelques champs dans notre fichier `package.json` :

```json
 "scripts": {
   ...
   "build": "rollup -c rollup.config.js",
   ...
 },
 "module": "dist/my-library-name.esm.js",
 "files": [
   "dist/",
 ],
 ```
 
Ici, nous spécifions

- comment construire notre paquet
- quels fichiers nous voulons regrouper dans notre paquetage
- Quel fichier représente notre module `esm` ?

#### Regroupement des modules `umd` et `cjs`.

Pour construire également les modules `umd` et `cjs`, nous pouvons simplement ajouter quelques lignes de configuration à nos fichiers `rollup.config.js` et `package.json`.

##### rollup.config.js 
```javascript
output: [
  ...
   {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.unpkg,
      format: 'umd',
      name: 'MyLibraryName',
      sourcemap: true,
      globals: {
        vue: 'Vue',
      },
    },
]
```
##### package.json
```json
"module": "dist/my-library-name.esm.js",
"main": "dist/my-library-name.cjs.js",
"unpkg": "dist/my-library-name.global.js",
```
