# Plugins {#plugins}

## Introduction {#introduction}

Les plugins sont des codes autonomes qui ajoutent généralement des fonctionnalités au niveau de l'application à Vue. Voici comment installer un plugin :

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* options facultatives */
})
```

Un plugin est défini comme étant soit un objet qui expose la méthode `install()`, ou simplement comme une fonction qui agit comme la fonction d'installation elle-même. La fonction d'installation reçoit l'[instance de l'application](/api/application) ainsi que les options additionnelles passées à `app.use()`, s'il y en a :

```js
const myPlugin = {
  install(app, options) {
    // configure l'application
  }
}
```

Il n'y a pas de champ d'application strictement défini pour un plugin, mais les scénarios courants où les plugins sont utiles incluent :

1. Enregistrer un ou plusieurs composants globaux ou directives personnalisées avec [`app.component()`](/api/application#app-component) et [`app.directive()`](/api/application#app-directive).

2. Rendre une ressource [injectable](/guide/components/provide-inject) dans toute l'application en appelant [`app.provide()`](/api/application#app-provide).

3. Ajouter quelques propriétés ou méthodes d'instance globale en les attachant à [`app.config.globalProperties`](/api/application#app-config-globalproperties).

4. Une librairie qui doit effectuer une combinaison des éléments ci-dessus (par exemple, [vue-router](https://github.com/vuejs/vue-router-next)).

## Écrire un plugin {#writing-a-plugin}

Afin de mieux comprendre comment créer vos propres plugins Vue.js, nous allons créer une version très simplifiée d'un plugin qui affiche les chaînes de caractères `i18n` (abréviation d'[internationalisation](https://en.wikipedia.org/wiki/Internationalization_and_localization)).

Commençons par configurer l'objet plugin. Il est recommandé de le créer dans un fichier séparé et de l'exporter, comme montré ci-dessous, afin que la logique reste contenue et séparée.

```js [plugins/i18n.js]
export default {
  install: (app, options) => {
    // Le code du plugin s'écrit ici
  }
}
```

Nous voulons créer une fonction de traduction. Cette fonction recevra une chaîne de caractères `key` délimitée par des points, que nous utiliserons pour rechercher la chaîne de caractères traduite dans les options fournies par l'utilisateur. C'est l'utilisation prévue dans les templates :

```vue-html
<h1>{{ $translate('greetings.hello') }}</h1>
```

Puisque cette fonction devrait être disponible globalement dans tous les templates, nous allons nous en assurer en l'attachant à `app.config.globalProperties` dans notre plugin :

```js{4-11} [plugins/i18n.js]
export default {
  install: (app, options) => {
    // injecte une méthode globalement disponible $translate()
    app.config.globalProperties.$translate = (key) => {
      // récupérer une propriété imbriquée dans `options`
      // en utilisant `key` comme chemin
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

Notre fonction `$translate` va prendre une chaîne de caractères telle que `greetings.hello`, regarder dans la configuration fournie par l'utilisateur et retourner la valeur traduite.

L'objet contenant les clés traduites doit être passé au plugin pendant l'installation via des paramètres supplémentaires à `app.use()` :

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

Maintenant, notre expression initiale `$translate('greetings.hello')` sera remplacée par `Bonjour!` au moment de l'exécution.

Voir aussi : [Augmenter les propriétés globales](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

:::tip
N'utilisez que rarement les propriétés globales, car cela peut rapidement devenir confus si trop de propriétés globales injectées par différents plugins sont utilisées dans une application.
:::

### Provide / Inject avec les plugins {#provide-inject-with-plugins}

Les plugins nous permettent également d'utiliser `provide` pour donner aux utilisateurs du plugin l'accès à une fonction ou à un attribut. Par exemple, nous pouvons permettre à l'application d'avoir accès au paramètre `options` pour pouvoir utiliser l'objet translations.

```js{10} [plugins/i18n.js]
export default {
  install: (app, options) => {
    app.provide('i18n', options)
  }
}
```

Les utilisateurs de plugins pourront désormais injecter les options du plugin dans leurs composants en utilisant la clé `i18n` :

<div class="composition-api">

```vue
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```

</div>
<div class="options-api">

```js
export default {
  inject: ['i18n'],
  created() {
    console.log(this.i18n.greetings.hello)
  }
}
```

</div>

### Bundle pour NPM {#bundle-for-npm}

Si vous souhaitez ensuite créer et publier votre plugin pour que d'autres puissent l'utiliser, consultez [la section de Vite sur le mode bibliothèque](https://vitejs.dev/guide/build.html#library-mode).
