# Débogage dans VS Code

Chaque application atteint un point où il est nécessaire de comprendre les défaillances, petites ou grandes. Dans cette recette, nous explorons quelques flux de travail pour les utilisateurs de VS Code qui souhaitent déboguer leur application dans le navigateur.

Cette recette montre comment déboguer les applications [Vue CLI](https://github.com/vuejs/vue-cli) dans VS Code lorsqu'elles s'exécutent dans le navigateur.

## Prérequis

Assurez-vous d'avoir VS Code et le navigateur de votre choix installés, ainsi que la dernière version de l'extension Debugger correspondante installée et activée :

- [Debugger pour Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
- [Debugger pour Firefox](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-firefox-debug)

Installez et créez un projet avec [vue-cli](https://github.com/vuejs/vue-cli), en suivant les instructions du [Guide Vue CLI](https://cli.vuejs.org/). Passez dans le répertoire d'application nouvellement créé et ouvrez VS Code.

### Affichage du code source dans le navigateur

Avant de pouvoir déboguer vos composants Vue à partir de VS Code, vous devez mettre à jour la configuration Webpack générée pour construire des cartes de source. Nous faisons cela pour que notre débogueur ait un moyen de faire correspondre le code dans un fichier compressé à sa position dans le fichier original. Cela garantit que vous pouvez déboguer une application même après que vos ressources ont été optimisées par Webpack.

Si vous utilisez Vue CLI 2, définissez ou mettez à jour la propriété `devtool` dans `config/index.js` :

```json
devtool: 'source-map',
```

Si vous utilisez Vue CLI 3, définissez ou mettez à jour la propriété `devtool` dans `vue.config.js` :

```js
module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
}
```

### Lancement de l'application à partir de VS Code

::: info
Nous supposons que le port est `8080` ici. Si ce n'est pas le cas (par exemple, si `8080` a été pris et que Vue CLI choisit automatiquement un autre port pour vous), modifiez simplement la configuration en conséquence.
:::

Cliquez sur l'icône de débogage dans la barre d'activités pour faire apparaître la vue de débogage, puis cliquez sur l'icône d'engrenage pour configurer un fichier launch.json, en sélectionnant **Chrome/Firefox : Launch** comme environnement. Remplacez le contenu du fichier launch.json généré par la configuration correspondante :

![Ajouter la configuration de Chrome](/images/config_add.png)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "vuejs: chrome",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    },
    {
      "type": "firefox",
      "request": "launch",
      "name": "vuejs: firefox",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "pathMappings": [{ "url": "webpack:///src/", "path": "${webRoot}/" }]
    }
  ]
}
```

## Réglage d'un point d'arrêt

1.  Définissez un point d'arrêt dans **src/components/HelloWorld.vue** à la `ligne 90` où la fonction `data` renvoie une chaîne.

![Rendu du point d'arrêt](/images/breakpoint_set.png)

2.  Ouvrez votre terminal préféré à la racine du dossier et servez l'application en utilisant Vue CLI :

```
npm run serve
```

3.  Allez dans la vue Debug, sélectionnez la configuration **'vuejs : chrome/firefox'**, puis appuyez sur F5 ou cliquez sur le bouton vert de lecture.

4.  Votre point d'arrêt devrait maintenant être atteint alors qu'une nouvelle instance du navigateur s'ouvre `http://localhost:8080`.

![Breakpoint Hit](/images/breakpoint_hit.png)

## Alternative Patterns

### Vue Devtools

Il existe d'autres méthodes de débogage, plus ou moins complexes. La plus populaire et la plus simple consiste à utiliser les excellents outils de développement Vue.js [pour Chrome] (https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) et [pour Firefox] (https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/). Parmi les avantages de l'utilisation des outils de développement, citons le fait qu'ils vous permettent de modifier en direct les propriétés des données et de voir les changements se refléter immédiatement. L'autre avantage majeur est la possibilité d'effectuer un débogage temporel pour Vuex.

![Devtools Timetravel Debugger](/images/devtools-timetravel.gif)

Veuillez noter que si la page utilise une version de production/minifiée de Vue.js (comme le lien standard d'un CDN), l'inspection devtools est désactivée par défaut et le panneau Vue n'apparaîtra pas. Si vous passez à une version non modifiée, vous devrez peut-être rafraîchir la page pour les voir.

### Déclaration simple du débogueur

L'exemple ci-dessus présente un excellent flux de travail. Cependant, il existe une autre option qui consiste à utiliser la [déclaration du débogueur natif] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) directement dans votre code. Si vous choisissez de travailler de cette manière, il est important de ne pas oublier de supprimer les instructions lorsque vous avez terminé.

```vue
<script>
export default {
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    const hello = 'Hello World!'
    debugger
    this.message = hello
  }
};
</script>
```

## Remerciements

Cette recette est basée sur une contribution de [Kenneth Auchenberg](https://twitter.com/auchenberg), [disponible ici](https://github.com/Microsoft/VSCode-recipes/tree/master/vuejs-cli).
