# Commencer {#getting-started}

Bienvenue sur le tutoriel de Vue !

Le but de ce tutoriel est de vous montrer ce qu'est l'expérience de travailler avec Vue, directement dans votre navigateur. Il n'a pas pour but d'être exhaustif, et vous n'avez pas besoin de tout comprendre avant de continuer. Cependant, une fois que vous l'aurez terminé, assurez-vous de lire également le <a target="_blank" href="/guide/introduction.html">Guide</a> qui couvre chaque sujet davantage en détail.

## Pré-requis {#prerequisites}

Ce tutoriel suppose une connaissance de base du HTML, CSS et JavaScript. Si vous êtes totalement novice en développement front-end, il serait peut-être judicieux de ne pas se lancer tout de suite dans l'utilisation d'un framework pour commencer - apprenez les bases puis revenez ! Une expérience préalable avec d'autres frameworks est utile, mais non obligatoire.

## Comment fonctionne ce tutoriel {#how-to-use-this-tutorial}

Vous pouvez modifier le code <span class="wide">sur la droite</span><span class="narrow">en bas</span> et voir le résultat se mettre à jour instantanément. Chaque étape présentera une fonctionnalité essentielle de Vue, et vous devrez compléter le code pour que la démo fonctionne. Si vous êtes bloqué, vous disposerez d'un bouton "Montrez-moi !" qui vous révélera le code fonctionnel. Essayez de ne pas trop vous y fier - vous apprendrez plus vite en vous débrouillant tout seul.

Si vous êtes un développeur expérimenté venant de Vue 2 ou d'autres frameworks, il y a quelques paramètres que vous pouvez modifier pour tirer le meilleur parti de ce tutoriel. Si vous êtes un débutant, il est recommandé d'utiliser les paramètres par défaut.

<details>
<summary>Détails des paramètres du tutoriel</summary>

- Vue offre deux styles différents d'API: Options API et Composition API. Ce tutoriel est fait de sorte à fonctioner avec les deux variantes - vous pouvez chosir votre style préferé en utilisant le switch **Préférence d'API** situé en haut de page. <a target="_blank" href="/guide/introduction.html#api-styles">En savoir plus sur les styles d'API</a>.

- Vous pouvez également passer du mode SFC au mode HTML. Le premier affichera des exemples de code dans le format <a target="_blank" href="/guide/introduction.html#single-file-components">monofichier (SFC)</a>, qui est celui utilisé par la plupart des dévelopeurs quand il s'agit de Vue avec des outils de build.

<div class="html">

:::tip
Si vous êtes sur le point d'utiliser le mode HTML sans outil de build dans vos propres applications, assurez-vous de changer les importations en :

```js
import { ... } from 'vue/dist/vue.esm-bundler.js'
```

dans vos scripts ou configurez votre outil de build pour résoudre `vue` en conséquence. Exemple de configuration pour [Vite](https://vitejs.dev/):

```js [vite.config.js]
export default {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  }
}
```

Voir la page [Note sur la compilation des templates dans le navigateur](/guide/scaling-up/tooling.html#note-on-in-browser-template-compilation) pour plus d'informations.
:::

</div>

<div class="html">

:::tip
If you're about to use HTML-mode without a build step in your own applications, make sure you either change imports to:

```js
import { ... } from 'vue/dist/vue.esm-bundler.js'
```

inside your scripts or configure your build tool to resolve `vue` accordingly. Sample config for [Vite](https://vitejs.dev/):

```js [vite.config.js]
export default {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  }
}
```

See the respective [section in Tooling guide](/guide/scaling-up/tooling.html#note-on-in-browser-template-compilation) for more information.
:::

</div>

</details>

Prêts? Cliquez sur "Suivant" pour commencer.
