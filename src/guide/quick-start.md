---
footer: false
---

# Démarrage rapide {#quick-start}

## En ligne {#try-vue-online}

- Pour vous familiariser rapidement avec Vue, vous pouvez l'essayer directement dans notre [Playground](https://play.vuejs.org/#eNo9jcEKwjAMhl/lt5fpQYfXUQfefAMvvRQbddC1pUuHUPrudg4HIcmXjyRZXEM4zYlEJ+T0iEPgXjn6BB8Zhp46WUZWDjCa9f6w9kAkTtH9CRinV4fmRtZ63H20Ztesqiylphqy3R5UYBqD1UyVAPk+9zkvV1CKbCv9poMLiTEfR2/IXpSoXomqZLtti/IFwVtA9A==).

- Si vous préférez une configuration HTML simple sans outil de build, vous pouvez utiliser [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/) comme point de départ.

- Si vous êtes déjà familiarisé avec Node.js et le concept des outils de construction, vous pouvez également essayer une configuration de build complète directement dans votre navigateur sur [StackBlitz](https://vite.new/vue).

## Créer une application Vue {#creating-a-vue-application}

:::tip Pré-requis

- Être familier avec l'invite de commandes
- Avoir installé [Node.js](https://nodejs.org/) version 18.0 ou plus
  :::

Dans cette section, nous allons vous présenter comment créer une [Single Page Application avec Vue](/guide/extras/ways-of-using-vue#single-page-application-spa) sur votre machine locale. Le projet créé utilisera une configuration de build basée sur [Vite](https://vitejs.dev) et nous permettra d'utiliser les [composants monofichiers](/guide/scaling-up/sfc) (SFCs).

Assurez-vous d'avoir une version à jour de [Node.js](https://nodejs.org/) d'installée et que votre répertoire de travail courant est bien celui où vous souhaitez créer un projet. Exécutez la commande suivante dans votre invite de commandes (sans le symbole `>`) :

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt;</span> <span style="color:#A6ACCD;">npm create vue@latest</span></span></code></pre></div>

Cette commande installera et exécutera [create-vue](https://github.com/vuejs/create-vue), l'outil officiel de création de projets Vue. Des questions (en anglais) vous seront posées pour un certain nombre de fonctionnalités optionnelles telles que la prise en charge de TypeScript et des tests :

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add TypeScript? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add JSX Support? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue Router for Single Page Application development? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Pinia for state management? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vitest for Unit testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add an End-to-End Testing Solution? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Cypress / Playwright</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add ESLint for code quality? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Prettier for code formatting? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

Si vous n'êtes pas sûr d'une option, choisissez simplement `No` en appuyant sur entrée pour le moment. Une fois le projet créé, suivez les instructions pour installer les dépendances et démarrer le serveur de développement :

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#888;">votre-nouveau-projet</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm install</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run dev</span></span>
<span class="line"></span></code></pre></div>

Vous devriez maintenant avoir votre premier projet Vue en cours d'exécution ! Notez que les composants d'exemple dans le projet généré sont écrits avec la [Composition API](/guide/introduction#composition-api) et `<script setup>`, plutôt que l'[Options API](/guide/introduction#options-api). Voici quelques conseils supplémentaires :

- L'environnement de développement recommandé est [Visual Studio Code](https://code.visualstudio.com/) + [Volar extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Si vous utilisez d'autres éditeurs, lisez la [section sur le support des environnements de développement](/guide/scaling-up/tooling#ide-support).
- [Guide - Outils](/guide/scaling-up/tooling) fournit plus de détails sur les utilitaires, notamment sur l'intégration avec les frameworks back-end.
- Pour en savoir plus sur l'outil de compilation Vite, consultez la [documentation Vite](https://vitejs.dev).
- Si vous avez choisi d'utiliser TypeScript, consultez le [Guide d'utilisation de TypeScript](typescript/overview).

Dès que vous êtes prêts à livrer votre application en production, exécutez la commande suivante :

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run build</span></span>
<span class="line"></span></code></pre></div>

Cela créera une version de votre application prête pour la production dans le répertoire `./dist` du projet. Consultez le [Guide du déploiement en production](/guide/best-practices/production-deployment) pour en savoir plus sur l'envoi de votre application en production.

[Étapes suivantes >](#next-steps)

## Utiliser Vue depuis un CDN {#using-vue-from-cdn}

Vous pouvez utiliser Vue directement depuis un CDN via une balise script :

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

Ici nous utilisons [unpkg](https://unpkg.com/), mais vous pouvez utiliser tout autre CDN qui sert des paquets NPM, par exemple [jsdelivr](https://www.jsdelivr.com/package/npm/vue) ou [cdnjs](https://cdnjs.com/libraries/vue). Bien évidemment, vous pouvez également télécharger le fichier pour le servir par vous-même.

Lorsque Vue est utilisé depuis un CDN, aucun outil de build n'est nécessaire. Cela permet d'avoir une configuration plus simple, et plus adaptée pour enrichir du HTML statique ou intégrer un framework backend. Par contre, vous n'aurez pas la possibilité de bénéficier de la syntaxe des components monofichiers (SFC).

### Utiliser le build global {#using-the-global-build}

Le lien ci-dessus charge le _build global_ de Vue, où toutes les API haut-niveau sont exposées comme des propriétés sur l'objet global `Vue`. Ci-dessous, un exemple utilisant le build global :

<div class="options-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp } = Vue

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

[Codepen demo](https://codepen.io/vuejs-examples/pen/QWJwJLp)

</div>

<div class="composition-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp, ref } = Vue

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Codepen demo](https://codepen.io/vuejs-examples/pen/eYQpQEG)

:::tip
De nombreux exemples de la Composition API tout au long du guide utiliseront la syntaxe `<script setup>`, qui nécessite des outils de génération. Si vous avez l'intention d'utiliser la Composition API sans outil de build, consultez l'utilisation de l'option [`setup()`](/api/composition-api-setup).
:::

</div>

### Utiliser le build des modules ES {#using-the-es-module-build}

Bien que le build global fonctionne, nous utiliserons principalement la syntaxe des [modules ES](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules) dans le reste de la documentation par souci de cohérence. La plupart des navigateurs supportant désormais les modules ES nativement, nous pouvons utiliser Vue depuis un CDN via les modules ES natifs :

<div class="options-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

</div>

<div class="composition-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

</div>

Notez que nous utilisons `<script type="module">`, et que l'url CDN importée pointe vers le **build des modules ES** de Vue.

<div class="options-api">

[Codepen demo](https://codepen.io/vuejs-examples/pen/VwVYVZO)

</div>
<div class="composition-api">

[Codepen demo](https://codepen.io/vuejs-examples/pen/MWzazEv)

</div>

### Activer l'Import maps {#enabling-import-maps}

Dans l'exemple ci-dessus, nous importons depuis l'URL CDN complète, mais dans le reste de la documentation, vous verrez un code comme celui-ci :

```js
const { createApp, ref } = Vue
```

Nous pouvons dire au navigateur où trouver l'import `vue` par l'usage de l'[Import Maps](https://caniuse.com/import-maps) :

<div class="options-api">

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

[Codepen demo](https://codepen.io/vuejs-examples/pen/wvQKQyM)


</div>

<div class="composition-api">

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'vue'

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Codepen demo](https://codepen.io/vuejs-examples/pen/YzRyRYM)

</div>

Vous pouvez ajouter des entrées pour d'autres dépendances à l'Import Map, assurez-vous simplement qu'elles pointent vers la version des modules ES de la bibliothèque que vous avez l'intention d'utiliser.

:::tip Support navigateur de l'Import Maps
Pour le moment, les Import Maps ne sont disponibles que dans les navigateurs basés sur Chromium, nous vous recommandons donc d'utiliser Chrome ou Edge pendant le processus d'apprentissage.

Si vous utilisez Firefox, c'est supporté par défaut à partir de la version 108+ sinon vous devez l'activer via la config `dom.importMaps.enabled` dans `about:config` pour les versions 102 et supérieures.

Si votre navigateur préféré ne prend pas encore en charge les Import Maps, vous pouvez ajouter le support (polyfill) avec [es-module-shims](https://github.com/guybedford/es-module-shims).

:::warning À éviter en production
L'usage des Import Maps est destiné à l'apprentissage uniquement. Si vous avez l'intention d'utiliser Vue sans outils de compilation en production, consultez le [Guide de déploiement en production](/guide/best-practices/production-deployment#without-build-tools).
:::

### Séparation des modules {#splitting-up-the-modules}

Au fur et à mesure que nous progressons dans le guide, il se peut que nous devions diviser notre code en plusieurs fichiers JavaScript distincts afin d'en faciliter la gestion. Par exemple :

```html
<!-- index.html -->
<div id="app"></div>

<script type="module">
  import { createApp } from 'vue'
  import MyComposant from './my-composant.js'

  createApp(MyComposant).mount('#app')
</script>
```

<div class="options-api">

```js
// my-composant.js
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>count is {{ count }}</div>`
}
```

</div>
<div class="composition-api">

```js
// my-component.js
import { ref } from 'vue'
export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `<div>count is {{ count }}</div>`
}
```

</div>

Si vous tentez d'ouvrir le fichier `index.html` ci-dessus dans votre navigateur, vous trouverez des erreurs relevées parce que les modules ES ne peuvent fonctionner via le protocol `file://`, qui est le protocole utilisé par le navigateur lorsque vous ouvrez un fichier local.

Pour des raisons de sécurité, les modules ES ne peuvent fonctionner que sur le protocole `http://`, qui est celui que les navigateurs utilisent lors de l'ouverture de pages sur le Web. Pour que les modules ES fonctionnent sur notre machine locale, nous devons servir le `index.html` sur le protocole `http://`, avec un serveur HTTP local.

Pour démarrer un serveur HTTP local, installez d'abord [Node.js](https://nodejs.org/en/), puis exécutez `npx serve` depuis la ligne de commande dans le même répertoire que votre fichier HTML. Vous pouvez également utiliser n'importe quel autre serveur HTTP qui peut servir des fichiers statiques avec les types MIME corrects.

Vous avez peut-être remarqué que le template du composant importé est souligné comme une chaîne JavaScript. Si vous utilisez VSCode, vous pouvez installer l'extension [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) et préfixer les chaînes avec un commentaire `/*html*/` pour obtenir la coloration syntaxique.

## Étapes suivantes {#next-steps}

Si vous avez raté l'[Introduction](/guide/introduction), nous vous recommandons fortement d'en prendre connaissance avant de continuer sur la documentation.

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/guide/essentials/application.html">
    <p class="next-steps-link">Lire le guide</p>
    <p class="next-steps-caption">Le guide vous amènera à travers tous les aspects du framework, dans tous ses détails.</p>
  </a>
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Essayer le tutoriel</p>
    <p class="next-steps-caption">Pour ceux qui préfèrent apprendre par la pratique.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Découvrir les exemples</p>
    <p class="next-steps-caption">Explorez les exemples de fonctionnalités de base et de cas d'usage courants.</p>
  </a>
</div>
