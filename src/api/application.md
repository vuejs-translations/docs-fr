# Application API {#application-api}

## createApp() {#createapp}

Crée une instance d'application.

- **Type :**

  ```ts
  function createApp(rootComponent: Component, rootProps?: object): App
  ```

- **Détails**

  Le premier argument est le composant racine. Le deuxième argument facultatif est les props à transmettre au composant racine.

- **Exemple**

  Avec un composant racine littéral :

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* options du composant racine */
  })
  ```

  Avec un composant importé :

  ```js
  import { createApp } from 'vue'
  import App from './App.vue'

  const app = createApp(App)
  ```

- **Voir aussi** [Guide - Créer une application Vue](/guide/essentials/application)

## createSSRApp() {#createssrapp}

Crée une instance d'application en mode [Hydratation SSR](/guide/scaling-up/ssr#client-hydration). L'utilisation est exactement la même que `createApp()`.

## app.mount() {#app-mount}

Monte l'instance d'application dans un élément conteneur.

- **Type :**

  ```ts
  interface App {
    mount(rootContainer: Element | string): ComponentPublicInstance
  }
  ```

- **Détails**

  L'argument peut être soit un élément réel du DOM, soit un sélecteur CSS (le premier élément correspondant sera utilisé). Renvoie l'instance du composant racine.

  Si le composant a un template ou une fonction de rendu défini, il remplacera tous les nœuds du DOM existants à l'intérieur du conteneur. Sinon, si le compilateur est disponible, le `innerHTML` du conteneur sera utilisé comme template.

  En mode hydratation SSR, il hydratera les nœuds DOM existants à l'intérieur du conteneur. S'il y a [des incohérences](/guide/scaling-up/ssr#hydration-mismatch), les nœuds du DOM existants seront transformés pour correspondre à la sortie attendue.

  Pour chaque instance d'application, `mount()` ne peut être appelée qu'une seule fois.

- **Exemple**

  ```js
  import { createApp } from 'vue'
  const app = createApp(/* ... */)

  app.mount('#app')
  ```

  Peut également être montée sur un élément du DOM réel :

  ```js
  app.mount(document.body.firstChild)
  ```

## app.unmount() {#app-unmount}

Démonte une instance d'application montée, déclenchant les hooks de cycle de vie de démontage pour tous les composants de l'arborescence des composants de l'application.

- **Type :**

  ```ts
  interface App {
    unmount(): void
  }
  ```

## app.onUnmount() <sup class="vt-badge" data-text="3.5+" /> {#app-onunmount}

Enregistre une fonction de rappel à exécuter lorsque l'application est démontée.

- **Type**

  ```ts
  interface App {
    onUnmount(callback: () => any): void
  }
  ```

## app.component() {#app-component}

Enregistre un composant global si un nom et une définition de composant sont passés ensemble, ou récupère un composant déjà enregistré si seul le nom est passé.

- **Type :**

  ```ts
  interface App {
    component(name: string): Component | undefined
    component(name: string, component: Component): this
  }
  ```

- **Exemple**

  ```js
  import { createApp } from 'vue'

  const app = createApp({})

  // enregistre un objet d'options
  app.component('MyComponent', {
    /* ... */
  })

  // récupère un composant enregistré
  const MyComponent = app.component('MyComponent')
  ```

- **Voir aussi** [Enregistrement des composants](/guide/components/registration)

## app.directive() {#app-directive}

Enregistre une directive personnalisée globale si un nom et une définition de directive sont passés, ou récupère une directive déjà enregistrée si seul le nom est passé.

- **Type :**

  ```ts
  interface App {
    directive(name: string): Directive | undefined
    directive(name: string, directive: Directive): this
  }
  ```

- **Exemple**

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* ... */
  })

  // enregistrement (options de directive)
  app.directive('myDirective', {
    /* custom directive hooks */
  })

  // enregistrement (raccourci d'une fonction de directive)
  app.directive('myDirective', () => {
    /* ... */
  })

  // récupère une directive enregistrée
  const myDirective = app.directive('myDirective')
  ```

- **Voir aussi** [Directives personnalisées](/guide/reusability/custom-directives)

## app.use() {#app-use}

Installe un [plugin](/guide/reusability/plugins).

- **Type :**

  ```ts
  interface App {
    use(plugin: Plugin, ...options: any[]): this
  }
  ```

- **Détails**

  Attend le plugin comme premier argument et les options facultatives du plugin comme deuxième argument.

  Le plugin peut être soit un objet avec une méthode `install()`, soit simplement une fonction qui sera utilisée comme méthode `install()`. Les options (deuxième argument de `app.use()`) seront transmises à la méthode `install()` du plugin.

  Lorsque `app.use()` est appelé plusieurs fois sur le même plugin, le plugin ne sera installé qu'une seule fois.

- **Exemple**

  ```js
  import { createApp } from 'vue'
  import MyPlugin from './plugins/MyPlugin'

  const app = createApp({
    /* ... */
  })

  app.use(MyPlugin)
  ```

- **Voir aussi** [Plugins](/guide/reusability/plugins)

## app.mixin() {#app-mixin}

Applique un mixin global (limité à l'application). Un mixin global applique ses options incluses à chaque instance de composant dans l'application.

:::warning Non recommandé
Les mixins sont pris en charge dans Vue 3 principalement pour la rétrocompatibilité, en raison de leur utilisation répandue dans les bibliothèques de l'écosystème. L'utilisation de mixins, en particulier de mixins globaux, doit être évitée dans le code de l'application.

Pour une réutilisation logique, préférez plutôt les [Composables](/guide/reusability/composables).
:::

- **Type :**

  ```ts
  interface App {
    mixin(mixin: ComponentOptions): this
  }
  ```

## app.provide() {#app-provide}

Fournit une valeur pouvant être injectée dans tous les composants descendants de l'application.

- **Type :**

  ```ts
  interface App {
    provide<T>(key: InjectionKey<T> | symbol | string, value: T): this
  }
  ```

- **Détails**

  Attend la clé d'injection comme premier argument et la valeur fournie comme second. Renvoie l'instance d'application elle-même.

- **Exemple**

  ```js
  import { createApp } from 'vue'

  const app = createApp(/* ... */)

  app.provide('message', 'hello')
  ```

  Dans un composant de l'application :

  <div class="composition-api">

  ```js
  import { inject } from 'vue'

  export default {
    setup() {
      console.log(inject('message')) // 'hello'
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  export default {
    inject: ['message'],
    created() {
      console.log(this.message) // 'hello'
    }
  }
  ```

  </div>

- **Voir aussi**
  - [Provide / Inject](/guide/components/provide-inject)
  - [App-level Provide](/guide/components/provide-inject#app-level-provide)
  - [app.runWithContext()](#app-runwithcontext)

## app.runWithContext() {#app-runwithcontext}

- Supporté à partir de la version 3.3

Exécute une fonction de rappel avec l'application courante comme contexte injecté.

- **Type**

  ```ts
  interface App {
    runWithContext<T>(fn: () => T): T
  }
  ```

- **Détails**

  Attend une fonction de rappel et l'exécute immédiatement. Lors de l'appel synchrone du rappel, les appels `inject()` sont capables de rechercher des injections à partir des valeurs fournies par l'application actuelle, même lorsqu'il n'y a pas d'instance de composant active actuelle. La valeur de retour du rappel sera également retournée.

- **Exemple**

  ```js
  import { inject } from 'vue'

  app.provide('id', 1)

  const injected = app.runWithContext(() => {
    return inject('id')
  })

  console.log(injected) // 1
  ```

## app.version {#app-version}

Fournit la version de Vue avec laquelle l'application a été créée. Ceci est utile pour les [plugins](/guide/reusability/plugins), où vous pourriez avoir besoin d'une logique conditionnelle basée sur différentes versions de Vue.

- **Type :**

  ```ts
  interface App {
    version: string
  }
  ```

- **Exemple**

  Effectuer une vérification de version à l'intérieur d'un plugin :

  ```js
  export default {
    install(app) {
      const version = Number(app.version.split('.')[0])
      if (version < 3) {
        console.warn('This plugin requires Vue 3')
      }
    }
  }
  ```

- **Voir aussi** [API générale - version](/api/general#version)

## app.config {#app-config}

Chaque instance d'application expose un objet `config` qui contient les paramètres de configuration de cette application. Vous pouvez modifier ses propriétés (documentées ci-dessous) avant de monter votre application.

```js
import { createApp } from 'vue'

const app = createApp(/* ... */)

console.log(app.config)
```

## app.config.errorHandler {#app-config-errorhandler}

Installe un gestionnaire global pour les erreurs non détectées se propageant depuis l'application.

- **Type :**

  ```ts
  interface AppConfig {
    errorHandler?: (
      err: unknown,
      instance: ComponentPublicInstance | null,
      // `info` est spécifique à Vue pour les infos d' erreur,
      // par exemple, de quel hook de cycle de vie l'erreur provient
      info: string
    ) => void
  }
  ```

- **Détails**

  Le gestionnaire d'erreurs attend trois arguments : l'erreur, l'instance de composant qui a déclenché l'erreur et une chaîne d'informations spécifiant le type de source d'erreur.

  Il peut capturer les erreurs provenant des sources suivantes :

  - Rendus de composants
  - Gestionnaires d'événements
  - Les hooks du cycle de vie
  - Fonction `setup()`
  - Observateurs
  - Hooks de directives personnalisés
  - Hooks de transition

  :::tip
  En production, le troisième argument (`info`) sera un code raccourci plutôt que toute la chaîne d'information. Vous pouvez trouver le code correspondant dans la [Référence des erreurs en production](/error-reference/#runtime-errors).
  :::

- **Exemple**

  ```js
  app.config.errorHandler = (err, instance, info) => {
    // gère l'erreur, par exemple pour la reporter à un service tiers
  }
  ```

## app.config.warnHandler {#app-config-warnhandler}

Ajoute un gestionnaire personnalisé pour les avertissements d'exécution de Vue.

- **Type :**

  ```ts
  interface AppConfig {
    warnHandler?: (
      msg: string,
      instance: ComponentPublicInstance | null,
      trace: string
    ) => void
  }
  ```

- **Détails**

  Le gestionnaire d'avertissement attend le message d'avertissement comme premier argument, l'instance du composant source comme deuxième argument et les traces du composant comme troisième.

  Il peut être utilisé pour filtrer des avertissements spécifiques afin de réduire la verbosité de la console. Tous les avertissements de Vue doivent être traités pendant le développement, donc cela n'est recommandé que pendant les sessions de débogage pour se concentrer sur des avertissements spécifiques parmi tant d'autres, et doit être supprimé une fois le débogage terminé.

  :::tip
  Les avertissements ne fonctionnent que pendant le développement, donc cette configuration est ignorée en mode production.
  :::

- **Exemple**

  ```js
  app.config.warnHandler = (msg, instance, trace) => {
    // `trace` est la trace hiérarchique du composant
  }
  ```

## app.config.performance {#app-config-performance}

Définissez-le sur `true` pour activer le suivi des performances d'initialisation, de compilation, de rendu et de correction des composants dans le panneau de performances/timeline de l'outil de développement du navigateur. Fonctionne uniquement en mode développement et dans les navigateurs prenant en charge l'API [performance.mark](https://developer.mozilla.org/fr/docs/Web/API/Performance/mark).

- **Type :** : `boolean`

- **Voir aussi** [Guide - Performance](/guide/best-practices/performance)

## app.config.compilerOptions {#app-config-compileroptions}

Configure des options du compilateur fonctionnant à l'exécution. Les valeurs définies sur cet objet seront transmises au compilateur de template dans le navigateur et affecteront chaque composant de l'application configurée. Notez que vous pouvez également remplacer ces options par composant à l'aide de l'[option `compilerOptions`](/api/options-rendering#compileroptions).

::: warning Important
Cette option de configuration n'est respectée que lors de l'utilisation de la version complète (c'est-à-dire `vue.js` qui peut compiler des templates dans le navigateur). Si vous utilisez le build uniquement à l'exécution avec une configuration de build, les options du compilateur doivent être transmises plutôt à `@vue/compiler-dom` via les configurations de l'outil de build.

- Pour `vue-loader` : [passez via l'option `compilerOptions` du loader](https://vue-loader.vuejs.org/options.html#compileroptions). Aussi, regardez [comment le configurer avec `vue-cli`](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

- Pour `vite` : [passez via les options de `@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#options).
  :::

### app.config.compilerOptions.isCustomElement {#app-config-compileroptions-iscustomelement}

Spécifie une méthode de vérification pour reconnaître les éléments personnalisés (Web Component).

- **Type :** `(tag: string) => boolean`

- **Détails**

  Doit renvoyer `true` si la balise doit être traitée comme un élément personnalisé. Pour une balise qui correspond, Vue la restituera en tant qu'élément natif au lieu d'essayer de la résoudre en tant que composant Vue.

  Les éléments natifs HTML et SVG n'ont pas besoin d'être mis en correspondance dans cette fonction - l'analyseur de Vue les reconnaît automatiquement.

- **Exemple**

  ```js
  // traite toutes les balises commençant par 'ion-' comme des éléments personnalisés
  app.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('ion-')
  }
  ```

- **Voir aussi** [Vue et les Web Components](/guide/extras/web-components)

### app.config.compilerOptions.whitespace {#app-config-compileroptions-whitespace}

Ajuste le comportement des espaces blancs des templates.

- **Type :** `'condense' | 'preserve'`

- **Par défaut :** `'condense'`

- **Détails**

  Vue supprime/condense les caractères d'espacement dans les templates pour produire une sortie compilée plus efficace. La stratégie par défaut est "condense", avec le comportement suivant :

  1. Les caractères d'espacement de début/fin à l'intérieur d'un élément sont condensés en un seul espace.
  2. Les caractères d'espacement entre les éléments qui contiennent des retours à la ligne sont supprimés.
  3. Les caractères d'espacement consécutifs dans les nœuds de texte sont condensés en un seul espace.

  Régler cette option sur `'preserve'` désactivera (2) et (3).

- **Exemple**

  ```js
  app.config.compilerOptions.whitespace = 'preserve'
  ```

### app.config.compilerOptions.delimiters {#app-config-compileroptions-delimiters}

Ajuste les délimiteurs utilisés pour l'interpolation de texte dans le template.

- **Type :** `[string, string]`

- **Par défaut :** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **Détails**

  Ceci est généralement utilisé pour éviter les conflits avec les frameworks côté serveur qui utilisent également la syntaxe des moustaches.

- **Exemple**

  ```js
  // Délimiteurs changés en style de chaîne de template ES6
  app.config.compilerOptions.delimiters = ['${', '}']
  ```

### app.config.compilerOptions.comments {#app-config-compileroptions-comments}

Ajuste le traitement des commentaires HTML dans les modèles.

- **Type :** `boolean`

- **Par défaut :** `false`

- **Détails**

  Par défaut, Vue supprimera les commentaires en production. Définir cette option sur `true` forcera Vue à conserver les commentaires même en production. Les commentaires sont toujours conservés pendant le développement. Cette option est généralement utilisée lorsque Vue est utilisé avec d'autres bibliothèques qui reposent sur des commentaires HTML.

- **Exemple**

  ```js
  app.config.compilerOptions.comments = true
  ```

## app.config.globalProperties {#app-config-globalproperties}

Un objet qui peut être utilisé pour enregistrer des propriétés globales accessibles sur n'importe quelle instance de composant dans l'application.

- **Type :**

  ```ts
  interface AppConfig {
    globalProperties: Record<string, any>
  }
  ```

- **Détails**

  Il s'agit du remplaçant de `Vue.prototype` de Vue 2 qui n'est plus présent dans Vue 3. Comme pour tout ce qui est global, cela doit être utilisé avec attention.

  Si une propriété globale est en conflit avec la propriété propre d'un composant, la propriété propre du composant aura une priorité plus élevée.

- **Utilisation :**

  ```js
  app.config.globalProperties.msg = 'hello'
  ```

  Cela rend `msg` disponible dans n'importe quel template de composant de l'application, ainsi que sur `this` de n'importe quelle instance de composant :

  ```js
  export default {
    mounted() {
      console.log(this.msg) // 'hello'
    }
  }
  ```

- **Voir aussi** [Guide - Augmenter les propriétés globales](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

## app.config.optionMergeStrategies {#app-config-optionmergestrategies}

Objet permettant de définir des stratégies de fusion pour les options de composants personnalisés.

- **Type :**

  ```ts
  interface AppConfig {
    optionMergeStrategies: Record<string, OptionMergeFunction>
  }

  type OptionMergeFunction = (to: unknown, from: unknown) => any
  ```

- **Détails**

  Certains plugins/bibliothèques ajoutent la prise en charge des options de composants personnalisés (en injectant des mixins globaux). Ces options peuvent nécessiter une logique de fusion spéciale lorsque la même option doit être "fusionnée" à partir de plusieurs sources (par exemple, mixins ou héritage de composants).

  Une fonction de stratégie de fusion peut être enregistrée pour une option personnalisée en l'affectant à l'objet `app.config.optionMergeStrategies` en utilisant le nom de l'option comme clé.

  La fonction de stratégie de fusion reçoit la valeur de cette option définie sur les instances parent et enfant comme premier et deuxième arguments, respectivement.

- **Exemple**

  ```js
  const app = createApp({
    // option d'ici
    msg: 'Vue',
    // option d'un mixin
    mixins: [
      {
        msg: 'Hello '
      }
    ],
    mounted() {
      // options fusionnées exposées dans this.$options
      console.log(this.$options.msg)
    }
  })

  // définie une stratégie de fusion personnalisée pour `msg`
  app.config.optionMergeStrategies.msg = (parent, child) => {
    return (parent || '') + (child || '')
  }

  app.mount('#app')
  // logue 'Hello Vue'
  ```

- **Voir aussi** [L'instance de composant - `$options`](/api/component-instance#options)

## app.config.idPrefix <sup class="vt-badge" data-text="3.5+" /> {#app-config-idprefix}

Configurer un préfixe pour tous les identifiants générés via [useId()](/api/composition-api-helpers.html#useid) dans l'application.

- **Type:** `string`

- **Default:** `undefined`

- **Example**

  ```js
  app.config.idPrefix = 'myApp'
  ```

  ```js
  // in a component:
  const id1 = useId() // 'myApp:0'
  const id2 = useId() // 'myApp:1'
  ```

## app.config.throwUnhandledErrorInProduction <sup class="vt-badge" data-text="3.5+" /> {#app-config-throwunhandlederrorinproduction}

Forcer l'envoi des erreurs non gérées en mode production.

- **Type:** `boolean`

- **Default:** `false`

- **Détails**

  Par défaut, les erreurs lancées dans une application Vue mais non gérées explicitement ont un comportement différent entre les modes développement et production :

  - Lors du développement, l'erreur est lancée et peut éventuellement faire planter l'application. Il s'agit de rendre l'erreur plus visible afin qu'elle puisse être remarquée et corrigée au cours du développement.

  - En production, l'erreur ne sera consignée que dans la console afin de minimiser l'impact sur les utilisateurs finaux. Toutefois, cela peut empêcher les erreurs qui ne se produisent qu'en production d'être détectées par les services de surveillance des erreurs.

  En mettant `app.config.throwUnhandledErrorInProduction` à `true`, les erreurs non gérées seront lancées même en mode production.
