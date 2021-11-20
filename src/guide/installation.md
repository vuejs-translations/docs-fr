# Installation

Vue.js a été conçu pour être adopté de manière incrémentielle. Cela signifie qu'il peut être intégré à un projet de plusieurs façons, en fonction des besoins.

Il y a trois façons principales d'ajouter Vue.js à un projet :

1. Importez-le en tant que [paquet CDN](#cdn) sur la page.
2. L'installer en utilisant [npm](#npm)
3. Utilisez la [CLI](#cli) officielle pour échafauder un projet, qui fournit des configurations de construction incluses dans les batteries pour un flux de travail frontal moderne (par exemple, hot-reload, lint-on-save, et bien plus encore).

## Notes de version

Dernière version : ![npm](https://img.shields.io/npm/v/vue/next.svg)

Des notes de version détaillées pour chaque version sont disponibles sur [GitHub](https://github.com/vuejs/vue-next/blob/master/CHANGELOG.md).

## Vue Devtools

> Actuellement en version bêta - l'intégration de Vuex et Router est toujours en cours.

Lorsque vous utilisez Vue, nous vous recommandons d'installer également l'extension [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools) dans votre navigateur, ce qui vous permettra d'inspecter et de déboguer vos applications Vue dans une interface plus conviviale.

[Télécharger l'extension Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg)

[Obtenez l'extension Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

[Obtenir l'application autonome Electron](https://github.com/vuejs/vue-devtools/blob/dev/packages/shell-electron/README.md)

## CDN

Pour le prototypage ou l'apprentissage, vous pouvez utiliser la dernière version avec :

```html
<script src="https://unpkg.com/vue@next"></script>
```

Pour la production, nous recommandons d'établir un lien vers un numéro de version et une construction spécifiques afin d'éviter toute rupture inattendue avec les nouvelles versions.

## npm

npm est la méthode d'installation recommandée lors de la création d'applications à grande échelle avec Vue. Elle s'associe parfaitement à des regroupeurs de modules tels que [Webpack](https://webpack.js.org/) ou [Rollup](https://rollupjs.org/). Vue fournit également des outils d'accompagnement pour la création de [Single File Components](../guide/single-file-component.html).

```bash
# latest stable
$ npm install vue@next
```

## CLI

Vue fournit une [CLI officielle](https://github.com/vuejs/vue-cli) pour échafauder rapidement des applications monopages ambitieuses. Il fournit des configurations de construction incluses dans les batteries pour un flux de travail frontal moderne. Il ne faut que quelques minutes pour être opérationnel avec des constructions à chaud (hot-reload), en ligne (lint-on-save) et prêtes pour la production. Consultez [la documentation Vue CLI](https://cli.vuejs.org) pour plus de détails.

::: tip
Le CLI suppose une connaissance préalable de Node.js et des outils de construction associés. Si vous ne connaissez pas Vue ou les outils de construction frontale, nous vous conseillons vivement de parcourir [le guide](./introduction.html) sans outils de construction avant d'utiliser le CLI.
:::

Pour Vue 3, vous devez utiliser Vue CLI v4.5 disponible sur `npm` comme `@vue/cli`. Pour mettre à jour, vous devez réinstaller la dernière version de `@vue/cli` globalement :

```bash
yarn global add @vue/cli
# OR
npm install -g @vue/cli
```

Ensuite, dans les projets Vue, exécutez

```bash
vue upgrade --next
```

## Vite

[Vite](https://github.com/vitejs/vite) est un outil de développement web qui permet de servir le code à la vitesse de l'éclair grâce à son approche native d'importation de modules ES.

Les projets Vue peuvent être rapidement configurés avec Vite en exécutant les commandes suivantes dans votre terminal.

Avec npm :

```bash
$ npm init vite-app <project-name>
$ cd <project-name>
$ npm install
$ npm run dev
```

Ou avec Yarn:

```bash
$ yarn create vite-app <project-name>
$ cd <project-name>
$ yarn
$ yarn dev
```

## Explication des différentes constructions

Dans le [répertoire `dist/` du paquet npm](https://cdn.jsdelivr.net/npm/vue@3.0.2/dist/), vous trouverez de nombreuses constructions différentes de Vue.js. Voici un aperçu du fichier `dist` à utiliser en fonction du cas d'utilisation.

### Depuis un CDN ou sans Bundler

#### `vue(.runtime).global(.prod).js` :

- Pour une utilisation directe via `<script src="...">` dans le navigateur, expose le global Vue.
- Compilation de modèles dans le navigateur :
  - `vue.global.js` est le build "complet" qui inclut à la fois le compilateur et le runtime afin de supporter la compilation des templates à la volée.
  - `vue.runtime.global.js` ne contient que le runtime et nécessite que les templates soient pré-compilés pendant une étape de construction.
- Il contient tous les paquets internes du noyau de Vue - c'est-à-dire qu'il s'agit d'un fichier unique sans aucune dépendance avec d'autres fichiers. Cela signifie que vous devez importer tout à partir de ce fichier et de ce fichier seulement pour vous assurer que vous obtenez la même instance de code.
- Contient des branches prod/dev codées en dur, et la version prod est pré-minifiée. Utilisez les fichiers `*.prod.js` pour la production.

:::tip Note
Les builds globaux ne sont pas des builds [UMD](https://github.com/umdjs/umd). Elles sont construites en tant que [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) et ne sont destinées qu'à une utilisation directe via `<script src="...">`.
:::

#### vue(.runtime).esm-browser(.prod).js :

- Pour une utilisation via les importations de modules ES natifs (dans le navigateur via `<script type="module">`.
- Partage la même compilation d'exécution, l'alignement des dépendances et le comportement prod/dev codé en dur avec la compilation globale.

### Avec un Bundler

#### vue(.runtime).esm-bundler.js:

- A utiliser avec des bundlers comme `webpack`, `rollup` et `parcel`.
- Laisse les branches prod/dev avec les gardes `process.env.NODE_ENV` (doit être remplacé par bundler)
- N'expédie pas de builds minifiés (à faire avec le reste du code après le bundler)
- Importe des dépendances (par exemple, `@vue/runtime-core`, `@vue/runtime-compiler`)
  - Les dépendances importées sont également construites par esm-bundler et importeront à leur tour leurs dépendances (par exemple, @vue/runtime-core importe @vue/reactivity).
  - Cela signifie que vous **pouvez** installer/importer ces dépendances individuellement sans vous retrouver avec différentes instances de ces dépendances, mais vous devez vous assurer qu'elles se résolvent toutes à la même version.
- Compilation des modèles dans le navigateur :
  - `vue.runtime.esm-bundler.js` **(default)** est uniquement exécutable, et nécessite que tous les templates soient précompilés. C'est l'entrée par défaut pour les bundlers (via le champ module dans `package.json`) car lors de l'utilisation d'un bundler, les templates sont généralement pré-compilés (par exemple dans les fichiers `*.vue`).
  - `vue.esm-bundler.js` : inclut le compilateur d'exécution. Utilisez-le si vous utilisez un bundler mais que vous voulez quand même compiler les templates au moment de l'exécution (par exemple les templates in-DOM ou les templates via des chaînes JavaScript en ligne). Vous devrez configurer votre bundler pour aliaser vue à ce fichier.

### Pour le rendu côté serveur

#### `vue.cjs(.prod).js`:

- Pour une utilisation dans le rendu côté serveur de Node.js via `require()`.
- Si vous regroupez votre application avec webpack avec `target : 'node'` et externalisez correctement `vue`, c'est cette construction qui sera chargée.
- Les fichiers dev/prod sont pré-construits, mais le fichier approprié est automatiquement requis en fonction de `process.env.NODE_ENV`.

## Runtime + Compiler vs. Runtime-only

Si vous avez besoin de compiler des modèles sur le client (par exemple en passant une chaîne à l'option de modèle, ou en montant sur un élément en utilisant son HTML in-DOM comme modèle), vous aurez besoin du compilateur et donc du build complet :

```js
// ceci nécessite le compilateur
Vue.createApp({
  template: '<div>{{ hi }}</div>'
})

// ce n'est pas le cas
Vue.createApp({
  render() {
    return Vue.h('div', {}, this.hi)
  }
})
```

Lorsque vous utilisez `vue-loader`, les modèles contenus dans les fichiers `*.vue` sont précompilés en JavaScript au moment de la construction. Vous n'avez pas vraiment besoin du compilateur dans le bundle final, et pouvez donc utiliser la compilation à l'exécution seulement.
