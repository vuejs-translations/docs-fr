---
footer: false
---

# Démarrage rapide

En fonction de vos besoins et de vos préférences, vous pouvez utiliser Vue avec ou sans étape de compilation.

## Avec des outils de compilation

La compilation nous permet d'utiliser les [Composants monofichiers](/guide/scaling-up/sfc) (SFC) de Vue. La configuration officielle de Vue est basée sur [Vite](https://vitejs.dev), un outil de compilation front-end moderne, léger et extrêmement rapide.

### En ligne

Vous pouvez essayer Vue avec les SFC en ligne sur [StackBlitz](https://vite.new/vue). StackBlitz exécute la configuration de compilation basée sur Vite directement dans le navigateur, elle est donc presque identique à la configuration locale mais ne nécessite pas d'installation sur votre machine.

### En local

:::tip Pré-requis

- Être familier avec l'invite de commandes
- Avoir installé [Node.js](https://nodejs.org/)
  :::

Pour créer un projet Vue avec toute la suite d'outils de compilation, exécutez la commande suivante dans votre invite de commandes (sans le symbole `>`) :

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt;</span> <span style="color:#A6ACCD;">npm init vue@latest</span></span></code></pre></div>

Cette commande installera et exécutera [create-vue](https://github.com/vuejs/create-vue), l'outil officiel de création de projets Vue. Des questions (en anglais) vous seront posées pour un certain nombre de fonctionnalités optionnelles telles que la prise en charge de TypeScript et des tests :

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add TypeScript? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add JSX Support? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue Router for Single Page Application development? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Pinia for state management? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vitest for Unit testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Cypress for both Unit and End-to-End testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add ESLint for code quality? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Prettier for code formating? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

Si vous n'êtes pas sûr d'une option, choisissez simplement `No` en appuyant sur entrée pour le moment. Une fois le projet créé, suivez les instructions pour installer les dépendances et démarrer le serveur de développement :

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#888;">votre-nouveau-projet</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm install</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run dev</span></span>
<span class="line"></span></code></pre></div>

Vous devriez maintenant avoir votre premier projet Vue en cours d'exécution ! Voici quelques conseils supplémentaires :

- L'IDE recommandé est [Visual Studio Code] (https://code.visualstudio.com/) + [Volar extension](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar). [WebStorm](https://www.jetbrains.com/webstorm/) est également une bonne solution.
- Le [TODO(fr)Guide des outillages](/guide/scaling-up/tooling.html) fournit plus de détails sur l'outillage, notamment sur l'intégration avec les frameworks back-end.
- Pour en savoir plus sur l'outil de compilation Vite, consultez la [documentation Vite](https://fr.vitejs.dev).
- Si vous avez choisi d'utiliser TypeScript, consultez le [TODO(fr)Guide d'utilisation de TypeScript](typescript/overview.html).

Dès que vous êtes prêts à livrer votre application en production, exécutez la commande suivante :

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run build</span></span>
<span class="line"></span></code></pre></div>

Cela créera une version de votre application prête pour la production dans le répertoire `./dist` du projet. Consultez le [TODO(fr)Guide du déploiement en production](/guide/best-practices/production-deployment.html) pour en savoir plus sur l'envoi de votre application en production.

[Etapes suivantes >](#etapes-suivantes)

## Sans outils de compilation

Pour commencer à utiliser Vue sans compilation, il suffit de copier le code suivant dans un fichier HTML et de l'ouvrir dans votre navigateur :

```html
<script src="https://unpkg.com/vue@3"></script>

<div id="app">{{ message }}</div>

<script>
  Vue.createApp({
    data() {
      return {
        message: 'Salut Vue!'
      }
    }
  }).mount('#app')
</script>
```

L'exemple ci-dessus utilise la version globale de Vue où toutes les API sont exposées sous la variable globale `Vue`.

Bien que le build global fonctionne, nous utiliserons principalement la syntaxe des [modules ES](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules) dans le reste de la documentation par souci de cohérence. Afin d'utiliser Vue avec les modules ES natifs, utilisez plutôt le HTML suivant :

```html
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
        message: 'Salut Vue!'
      }
    }
  }).mount('#app')
</script>
```

Remarquez que l'on peut importer directement `'vue'` dans notre code - ceci est rendu possible par le bloc `<script type="importmap">`, qui tire parti d'une fonctionnalité native du navigateur appelée [Import Maps](https://caniuse.com/import-maps). Pour le moment, les Import Maps ne sont disponibles que dans les navigateurs basés sur Chromium, nous vous recommandons donc d'utiliser Chrome ou Edge pendant le processus d'apprentissage. Si votre navigateur préféré ne prend pas encore en charge les Import Maps, vous pouvez ajouter le support (polyfill) avec [es-module-shims](https://github.com/guybedford/es-module-shims).

Vous pouvez ajouter des entrées pour d'autres dépendances à l'Import Map, assurez-vous simplement qu'elles pointent vers la version des modules ES de la bibliothèque que vous avez l'intention d'utiliser.

:::tip À éviter en production
L'usage des Import Maps est destiné à l'apprentissage uniquement. Si vous avez l'intention d'utiliser Vue sans outils de compilation en production, consultez le [TODO(fr)Guide de déploiement en production](/guide/best-practices/production-deployment.html#without-build-tools).
:::

### Servir via HTTP

Au fur et à mesure que nous progressons dans le guide, il se peut que nous devions diviser notre code en plusieurs fichiers JavaScript distincts afin d'en faciliter la gestion. Par exemple :

```html
<!-- index.html -->
<script type="module">
  import { createApp } from 'vue'
  import MonComposant from './mon-composant.js'

  createApp(MonComposant).mount('#app')
</script>
```

```js
// mon-composant.js
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>count is {{ count }}</div>`
}
```

Pour que cela fonctionne, vous devez servir votre HTML via le protocole `http://` au lieu du protocole `file://`. Pour démarrer un serveur HTTP local, installez d'abord [Node.js](https://nodejs.org/en/), puis exécutez `npx serve` depuis la ligne de commande dans le même répertoire que votre fichier HTML. Vous pouvez également utiliser n'importe quel autre serveur HTTP qui peut servir des fichiers statiques avec les types MIME corrects.

Vous avez peut-être remarqué que le template du composant importé est souligné comme une chaîne JavaScript. Si vous utilisez VSCode, vous pouvez installer l'extension [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) et préfixer les chaînes avec un commentaire `/*html*/` pour obtenir la coloration syntaxique.

## Étapes suivantes

Si vous avez sauté l'[Introduction](/guide/introduction), nous vous recommandons vivement de la lire avant de passer au reste de la documentation.

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Essayer le tutoriel</p>
    <p class="next-steps-caption">Pour ceux qui préfèrent apprendre par la pratique.</p>
  </a>
  <a class="vt-box" href="/guide/quick-start.html">
    <p class="next-steps-link">Lire le guide</p>
    <p class="next-steps-caption">Le guide vous amènera à travers tous les aspects du framework, dans tous ses détails.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Découvrir les exemples</p>
    <p class="next-steps-caption">Explorez les exemples de fonctionnalités de base et de cas d'usage courants.</p>
  </a>
</div>
