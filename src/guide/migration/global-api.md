---
badges:
  - breaking
---

# API globale <MigrationBadges :badges="$frontmatter.badges" />

Vue 2.x possède un certain nombre d'API globales et de configurations qui mutent globalement le comportement de Vue. Par exemple, pour enregistrer un composant global, vous devez utiliser l'API `Vue.component` comme ceci :

```js
Vue.component('button-counter', {
  data: () => ({
    count: 0
  }),
  template: '<button @click="count++">Clicked {{ count }} times.</button>'
})
```

De même, voici comment est déclarée une directive globale :

```js
Vue.directive('focus', {
  inserted: el => el.focus()
})
```

Bien que cette approche soit pratique, elle entraîne quelques problèmes. Techniquement, Vue 2 n'a pas le concept d'une "application". Ce que nous définissons comme une application est simplement une instance racine de Vue créée via `new Vue()`. Chaque instance racine créée à partir du même constructeur Vue **partage la même configuration globale**. Par conséquent :

- La configuration globale rend facile la pollution accidentelle d'autres cas de test pendant les tests. Les utilisateurs doivent stocker soigneusement la configuration globale originale et la restaurer après chaque test (par exemple en réinitialisant `Vue.config.errorHandler`). Certaines API comme `Vue.use` et `Vue.mixin` n'ont même pas la possibilité de revenir sur leurs effets. Cela rend les tests impliquant des plugins particulièrement délicats. En fait, vue-test-utils doit implémenter une API spéciale `createLocalVue` pour gérer cela :

  ```js
  import { createLocalVue, mount } from '@vue/test-utils'

  // créer un constructeur `Vue` étendu
  const localVue = createLocalVue()

  // installer un plugin "globalement" sur le constructeur Vue "local".
  localVue.use(MyPlugin)

  // passer le `localVue` aux options de montage
  mount(Component, { localVue })
  ```

- La configuration globale rend difficile le partage de la même copie de Vue entre plusieurs "apps" sur la même page, mais avec des configurations globales différentes.

  ```js
  // ceci affecte les deux instances de la racine
  Vue.mixin({
    /* ... */
  })

  const app1 = new Vue({ el: '#app-1' })
  const app2 = new Vue({ el: '#app-2' })
  ```

Pour éviter ces problèmes, dans Vue 3 nous introduisons...

## Une nouvelle API globale : `createApp`

L'appel à `createApp` renvoie une _app instance_, un nouveau concept dans Vue 3.

```js
import { createApp } from 'vue'

const app = createApp({})
```

Si vous utilisez une version [CDN](/guide/installation.html#cdn) de Vue, `createApp` est exposé via l'objet global `Vue` :

```js
const { createApp } = Vue

const app = createApp({})
```

Une instance d'application expose un sous-ensemble des API globales de Vue 2. La règle générale est la suivante : " toutes les API qui modifient globalement le comportement de Vue sont maintenant déplacées vers l'instance d'application ". Voici un tableau des API globales de Vue 2 et des API d'instance correspondantes :

| 2.x Global API             | 3.x Instance API (`app`)                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| Vue.config                 | app.config                                                                                      |
| Vue.config.productionTip   | _removed_ ([see below](#config-productiontip-removed))                                          |
| Vue.config.ignoredElements | app.config.isCustomElement ([see below](#config-ignoredelements-is-now-config-iscustomelement)) |
| Vue.component              | app.component                                                                                   |
| Vue.directive              | app.directive                                                                                   |
| Vue.mixin                  | app.mixin                                                                                       |
| Vue.use                    | app.use ([see below](#a-note-for-plugin-authors))                                               |
| Vue.prototype              | app.config.globalProperties ([see below](#vue-prototype-replaced-by-config-globalproperties))   |                                                                     |

Toutes les autres API globales qui ne mutent pas globalement le comportement sont maintenant nommées exportations, comme documenté dans [Global API Treeshaking](./global-api-treeshaking.html).

### `config.productionTip` supprimé

Dans Vue 3.x, l'astuce "use production build" ne s'affichera que lors de l'utilisation de la "dev + full build" (la build qui inclut le compilateur d'exécution et comporte des avertissements).

Pour les modules ES, étant donné qu'ils sont utilisés avec des bundlers, et que dans la plupart des cas, une CLI ou un boilerplate aurait configuré l'environnement de production correctement, cette astuce n'apparaîtra plus.

### `config.ignoredElements` Devient `config.isCustomElement`.

Cette option de configuration a été introduite avec l'intention de supporter les éléments personnalisés natifs, donc le changement de nom reflète mieux ce qu'elle fait. La nouvelle option attend également une fonction qui fournit plus de flexibilité que l'ancienne approche chaîne / RegExp :

```js
// avant
Vue.config.ignoredElements = ['my-el', /^ion-/]

// après
const app = createApp({})
app.config.isCustomElement = tag => tag.startsWith('ion-')
```

::: tip Important

Dans Vue 3, la vérification de savoir si un élément est un composant ou non a été déplacée à la phase de compilation du template, donc cette option de configuration n'est respectée que lors de l'utilisation du compilateur d'exécution. Si vous utilisez le compilateur d'exécution seulement, `isCustomElement` doit être passé à `@vue/compiler-dom` dans la configuration de la construction à la place - par exemple, via l'option [`compilerOptions` dans vue-loader](https://vue-loader.vuejs.org/options.html#compileroptions).

- Si l'option `config.isCustomElement` est assignée lors de l'utilisation d'une construction en exécution seule, un avertissement sera émis pour indiquer à l'utilisateur de passer l'option dans la configuration de la construction à la place ;
- Ce sera une nouvelle option de haut niveau dans la configuration de Vue CLI.
:::

### Remplacement de `Vue.prototype` par `config.globalProperties`.

Dans Vue 2, `Vue.prototype` était couramment utilisé pour ajouter des propriétés qui seraient accessibles dans tous les composants.

L'équivalent dans Vue 3 est [`config.globalProperties`](/api/application-config.html#globalproperties). Ces propriétés seront copiées lors de l'instanciation d'un composant dans l'application :

```js
// Avant - Vue 2
Vue.prototype.$http = () => {}
```

```js
// Après - Vue 3
const app = createApp({})
app.config.globalProperties.$http = () => {}
```

L'utilisation de `provide` (discuté [ci-dessous](#provide-inject)) devrait également être considérée comme une alternative à `globalProperties`.

#### Une note pour les auteurs de plugins

C'est une pratique courante pour les auteurs de plugins d'installer automatiquement les plugins dans leurs builds UMD en utilisant `Vue.use`. Par exemple, c'est ainsi que le plugin officiel `vue-router` s'installe dans un environnement de navigateur :

```js
var inBrowser = typeof window !== 'undefined'
/* … */
if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}
```

Comme l'API globale `use` n'est plus disponible dans Vue 3, cette méthode ne fonctionnera plus et l'appel à `Vue.use()` déclenchera désormais un avertissement. Au lieu de cela, l'utilisateur final devra maintenant spécifier explicitement l'utilisation du plugin sur l'instance de l'application :

```js
const app = createApp(MyApp)
app.use(VueRouter)
```

## Montage de l'instance de l'application

Après avoir été initialisée avec `createApp(/* options */)`, l'instance d'application `app` peut être utilisée pour monter une instance de composant racine avec `app.mount(domTarget)` :

```js
import { createApp } from 'vue'
import MyApp from './MyApp.vue'

const app = createApp(MyApp)
app.mount('#app')
```

Avec tous ces changements, le composant et la directive que nous avons au début du guide seront réécrits en quelque chose comme ceci :

```js
const app = createApp(MyApp)

app.component('button-counter', {
  data: () => ({
    count: 0
  }),
  template: '<button @click="count++">Clicked {{ count }} times.</button>'
})

app.directive('focus', {
  mounted: el => el.focus()
})

// maintenant, chaque instance d'application montée avec app.mount(), avec son arbre de composants, aura le même composant "button-counter".
// l'arbre de composants, aura le même composant "button-counter" (compteur de boutons)
// et la même directive "focus" sans polluer l'environnement global.
app.mount('#app')
```

## Fournir / Injecter

Tout comme l'utilisation de l'option `provide` dans une instance racine 2.x, une instance d'application Vue 3 peut également fournir des dépendances qui peuvent être injectées par n'importe quel composant de l'application :

```js
// dans l'entrée
app.provide('guide', 'Vue 3 Guide')

// dans un composant enfant
export default {
  inject: {
    book: {
      from: 'guide'
    }
  },
  template: `<div>{{ book }}</div>`
}
```

Utiliser `provide` est particulièrement utile lors de l'écriture d'un plugin, comme alternative à `globalProperties`.

## Partager des configurations entre applications

Une façon de partager des configurations, par exemple des composants ou des directives entre applications, est de créer une fonction d'usine, comme ceci :

```js
import { createApp } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

const createMyApp = options => {
  const app = createApp(options)
  app.directive('focus', /* ... */)

  return app
}

createMyApp(Foo).mount('#foo')
createMyApp(Bar).mount('#bar')
```

Maintenant la directive `focus` sera disponible dans les instances `Foo` et `Bar` et leurs descendants.
