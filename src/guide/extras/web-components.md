# Vue et les Web Components {#vue-and-web-components}

Les [Web Components](https://developer.mozilla.org/fr/docs/Web/Web_Components) est un terme générique pour l'ensemble des API web natives qui permettent aux développeurs de créer des éléments personnalisés réutilisables.

Nous considérons que Vue et les Web Components sont avant tout des technologies complémentaires. Vue offre un excellent support pour la consommation et la création d'éléments personnalisés. Que vous intégriez des éléments personnalisés dans une application Vue existante ou que vous utilisiez Vue pour créer et distribuer des éléments personnalisés, vous êtes au bon endroit.

## Utiliser des éléments personnalisés dans Vue {#using-custom-elements-in-vue}

Vue [obtient un score parfait de 100 % dans les tests Custom Elements Everywhere](https://custom-elements-everywhere.com/libraries/vue/results/results.html). L'utilisation d'éléments personnalisés dans une application Vue fonctionne en grande partie de la même manière que l'utilisation d'éléments HTML natifs, avec quelques éléments à garder à l'esprit :

### Ignorer la résolution des composants {#skipping-component-resolution}

Par défaut, Vue tentera de résoudre une balise HTML non native en tant que composant Vue enregistré avant de revenir à son rendu en tant qu'élément personnalisé. Cela entraînera l'émission par Vue d'un avertissement "Échec de la résolution du composant" pendant le développement. Pour faire savoir à Vue que certains éléments doivent être traités comme des éléments personnalisés et ignorer la résolution des composants, nous pouvons spécifier l'[`option compilerOptions.isCustomElement`](/api/application#app-config-compileroptions).

Si vous utilisez Vue avec une configuration de build, l'option doit être transmise via les configurations de build car il s'agit d'une option de compilation.

#### Exemple de configuration dans le navigateur {#example-in-browser-config}

```js
// Ne fonctionne que si vous utilisez la compilation dans le navigateur.
// Si vous utilisez des outils de build, consultez les exemples de configuration ci-dessous.
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
```

#### Exemple pour une config Vite {#example-vite-config}

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // traiter toutes les balises avec un tiret comme des éléments personnalisés
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Exemple avec une config Vue CLI {#example-vue-cli-config}

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          // traiter toute balise commençant par ion- comme un élément personnalisé
          isCustomElement: tag => tag.startsWith('ion-')
        }
      }))
  }
}
```

### Passer des propriétés DOM {#passing-dom-properties}

Bien que que les attributs DOM ne peuvent être que des chaînes de caractères, nous devons transmettre des données complexes à des éléments personnalisés en tant que propriétés DOM. Lors de la définition de props sur un élément personnalisé, Vue 3 vérifie automatiquement la présence de la propriété DOM à l'aide de l'opérateur "in" et préfère définir la valeur en tant que propriété DOM si la clé est présente. Cela signifie que, dans la plupart des cas, vous n'aurez pas besoin d'y penser si l'élément personnalisé suit les [bonnes pratiques recommandées](https://web.dev/custom-elements-best-practices/).

Cependant, il peut y avoir de rares cas où les données doivent être transmises en tant que propriété DOM, mais l'élément personnalisé ne définit / ne reflète pas correctement la propriété (provoquant l'échec de la vérification `in`). Dans ce cas, vous pouvez forcer la définition d'une liaison `v-bind` en tant que propriété DOM à l'aide du modificateur `.prop` :

```vue-html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- raccourci équivalent -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## Créer des éléments personnalisés avec Vue {#building-custom-elements-with-vue}

Le principal avantage des éléments personnalisés est qu'ils peuvent être utilisés avec n'importe quel framework, ou même sans framework. Cela les rend parfaits pour distribuer des composants là où le consommateur final n'utilise peut-être pas la même stack frontend, ou lorsque vous souhaitez isoler l'application finale des détails d'implémentation des composants qu'elle utilise.

### defineCustomElement {#definecustomelement}

Vue prend en charge la création d'éléments personnalisés en utilisant exactement les mêmes API de composants Vue via la méthode [`defineCustomElement`](/api/general#definecustomelement). La méthode accepte le même argument que [`defineComponent`](/api/general#definecomponent), mais renvoie à la place un constructeur d'élément personnalisé qui étend `HTMLElement` :

```vue-html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // options normales de composant Vue ici
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement uniquement : CSS à injecter dans le shadowRoot
  styles: [`/* css littéraux */`]
})

// Enregistre l'élément personnalisé.
// Après l'enregistrement, toutes les balises `<my-vue-element>`
// sur la page seront mises à jour.
customElements.define('my-vue-element', MyVueElement)

// Vous pouvez également instancier programmatiquement l'élément :
// (ne peut être fait qu'après l'enregistrement)
document.body.appendChild(
  new MyVueElement({
    // props initiales (facultatif)
  })
)
```

#### Cycle de vie {#lifecycle}

- Un élément personnalisé Vue montera une instance de composant Vue interne à l'intérieur du shadowRoot lorsque la fonction [`connectedCallback`](https://developer.mozilla.org/fr/docs/Web/Web_Components/Using_custom_elements#utilisation_des_rappels_de_cycle_de_vie) de l'élément est appelée pour la première fois.

- Lorsque la fonction `disconnectedCallback` de l'élément est invoquée, Vue vérifiera si l'élément est détaché du document après un tic de micro-tâche.

  - Si l'élément est toujours dans le document, c'est un déplacement et l'instance du composant sera conservée ;

  - Si l'élément est détaché du document, il s'agit d'une suppression et l'instance du composant sera démontée.

#### Props {#props}

- Toutes les props déclarées à l'aide de l'option `props` seront définies sur l'élément personnalisé en tant que propriétés. Vue gérera automatiquement la réflexion entre les attributs / propriétés le cas échéant.

  - Les attributs sont toujours reflétés dans les propriétés correspondantes.

  - Les propriétés avec des valeurs primitives (`string`, `boolean` ou `number`) sont reflétées en tant qu'attributs.

- Vue convertit également automatiquement les props déclarées avec les types `Boolean` ou `Number` dans le type souhaité lorsqu'elles sont définies en tant qu'attributs (qui sont toujours des chaînes de caractères). Par exemple, étant donné la déclaration de props suivante :

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  Et l'utilisation de l'élément personnalisé :

  ```vue-html
  <my-element selected index="1"></my-element>
  ```

  Dans le composant, `selected` sera converti en `true` (booléen) et `index` sera converti en `1` (nombre).

#### Événements {#events}

Les événements émis via `this.$emit` ou la configuration `emit` sont distribués en tant que [CustomEvents](https://developer.mozilla.org/fr/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent) natifs sur l'élément personnalisé. Des arguments d'événement supplémentaires (données) seront exposés sous forme de tableau sur l'objet CustomEvent en tant que propriété `detail`.

#### Slots {#slots}

À l'intérieur du composant, les slots peuvent être rendus en utilisant l'élément `<slot/>` comme d'habitude. Cependant, lors de la consommation de l'élément résultant, il n'accepte que la [syntaxe native des slots](https://developer.mozilla.org/fr/docs/Web/Web_Components/Using_templates_and_slots) :

- Les [scoped slots](/guide/components/slots#scoped-slots) ne sont pas supportés.

- Lorsque vous passez des slots nommés, utilisez l'attribut `slot` au lieu de la directive `v-slot` :

  ```vue-html
  <my-element>
    <div slot="named">hello</div>
  </my-element>
  ```

#### Provide / Inject {#provide-inject}

L'[API Provide /Inject](/guide/components/provide-inject#provide-inject) et son [équivalent pour la Composition API](/api/composition-api-dependency-injection#provide) fonctionnent également entre les éléments personnalisés définis par Vue. Cependant, notez que cela fonctionne **uniquement entre les éléments personnalisés**. C'est-à-dire qu'un élément personnalisé défini par Vue ne pourra pas injecter les propriétés fournies par un composant Vue non personnalisé.

### SFC comme élément personnalisé {#sfc-as-custom-element}

`defineCustomElement` fonctionne également avec les composants monofichiers (SFC). Cependant, avec la configuration des outils par défaut, le `<style>` à l'intérieur des SFC sera toujours extrait et fusionné dans un seul fichier CSS lors du build en production. Lors de l'utilisation d'un SFC comme élément personnalisé, il est souvent préférable d'injecter les balises `<style>` dans le shadowRoot de l'élément personnalisé.

Les outils SFC officiels prennent en charge l'importation de SFC en "mode élément personnalisé" (nécessite `@vitejs/plugin-vue@^1.4.0` ou `vue-loader@^16.5.0`). Un SFC chargé en mode élément personnalisé place ses balises `<style>` comme des chaînes de caractères de CSS litérales et les expose sous l'option `styles` du composant. Ceci sera récupéré par `defineCustomElement` et injecté dans le shadowRoot de l'élément lors de son instanciation.

Pour activer ce mode, terminez simplement le nom de votre fichier de composant par `.ce.vue` :

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* css litéral */"]

// convertion en constructeur d'élément personnalisé
const ExampleElement = defineCustomElement(Example)

// enregistrement
customElements.define('my-example', ExampleElement)
```

Si vous souhaitez personnaliser les fichiers à importer en mode élément personnalisé (par exemple, traiter _tous_ les SFC comme des éléments personnalisés), vous pouvez passer l'option `customElement` aux plugins de build respectifs :

- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### Conseils pour une bibliothèque d'éléments personnalisés Vue {#tips-for-a-vue-custom-elements-library}

Lors de la création d'éléments personnalisés avec Vue, les éléments s'appuieront sur l'environnement d'exécution de Vue. Il y a un coût de taille de base d'environ 16 Ko en fonction du nombre de fonctionnalités utilisées. Cela signifie qu'il n'est pas idéal d'utiliser Vue si vous expédiez un seul élément personnalisé - vous pouvez utiliser du JavaScript pur, [petite-vue](https://github.com/vuejs/petite-vue) ou des frameworks qui se spécialisent dans leur petite taille d'exécution. Cependant, la taille de base est plus que rentable si vous expédiez une collection d'éléments personnalisés avec une logique complexe, car Vue permettra à chaque composant d'être créé avec beaucoup moins de code. Plus vous expédiez d'éléments ensemble, meilleur est le compromis.

Si les éléments personnalisés seront utilisés dans une application qui utilise également Vue, vous pouvez choisir d'externaliser Vue à partir du bundle construit afin que les éléments utilisent la même copie de Vue à partir de l'application hôte.

Il est recommandé d'exporter les constructeurs d'éléments individuels pour donner à vos utilisateurs la possibilité de les importer à la demande et de les enregistrer avec les noms de balises souhaités. Vous pouvez également exporter une fonction pratique pour enregistrer automatiquement tous les éléments. Voici un exemple de point d'entrée d'une bibliothèque d'éléments personnalisés Vue :

```js
import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// exporte des éléments individuellement
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

Si vous avez de nombreux composants, vous pouvez également tirer parti des fonctionnalités de l'outil de build telles que le [glob import](https://vitejs.dev/guide/features.html#glob-import) de Vite ou [`require.context`](https://webpack.js.org/guides/dependency-management/#requirecontext) pour charger tous les composants à partir d'un répertoire.

### Web Components et Typescript {#web-components-and-typescript}

Si vous développez une application ou une bibliothèque, vous souhaiterez peut-être [vérifier le type](/guide/scaling-up/tooling.html#typescript) de vos composants Vue, y compris ceux qui sont définis comme éléments personnalisés.

Les éléments personnalisés sont enregistrés globalement à l'aide d'API natives, donc par défaut, ils n'auront pas d'inférence de type lorsqu'ils sont utilisés dans des templates Vue. Pour fournir un support de type pour les composants Vue enregistrés en tant qu'éléments personnalisés, nous pouvons enregistrer les typages de composants globaux à l'aide de l'[interface "GlobalComponents"](https://github.com/vuejs/language-tools/blob/master/packages/vscode-vue/README.md#usage) dans les template Vue et/ou dans le [JSX](https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements) :

```typescript
import { defineCustomElement } from 'vue'

// SFC Vue
import CounterSFC from './src/components/counter.ce.vue'

// converti le composant en élément personnalisé
export const Counter = defineCustomElement(CounterSFC)

// enregistre les typages globaux
declare module 'vue' {
  export interface GlobalComponents {
    'Counter': typeof Counter,
  }
}
```

## Web Components vs. les composants Vue {#web-components-vs-vue-components}

Certains développeurs pensent que les modèles de composants propriétaires du framework doivent être évités et que l'utilisation exclusive d'éléments personnalisés rend une application "à l'épreuve du temps". Ici, nous allons essayer d'expliquer pourquoi nous pensons qu'il s'agit d'une approche trop simpliste du problème.

Il existe en effet un certain niveau de chevauchement de fonctionnalités entre les éléments personnalisés et les composants Vue : ils nous permettent tous deux de définir des composants réutilisables avec transmission de données, émission d'événements et gestion du cycle de vie. Cependant, les API des Web Components sont de niveau relativement bas et rudimentaires. Pour créer une application réelle, nous avons besoin de quelques fonctionnalités supplémentaires que la plate-forme ne couvre pas :

- Un système de template déclaratif et efficace ;

- Un système de gestion d'état réactif qui facilite l'extraction et la réutilisation de la logique entre composants ;

- Un moyen performant de rendre les composants sur le serveur et de les hydrater sur le client (SSR), ce qui est important pour le référencement et [les métriques Web Vitals telles que LCP](https://web.dev/vitals/). Les éléments personnalisés natifs SSR impliquent généralement de simuler le DOM dans Node.js, puis de sérialiser le DOM muté, tandis que Vue SSR se compile en concaténation de chaînes autant que nécessaire, ce qui est beaucoup plus efficace.

Le modèle de composants de Vue est conçu avec ces besoins à l'esprit en tant que système cohérent.

Avec une équipe d'ingénieurs compétente, vous pourriez probablement créer l'équivalent au-dessus des éléments personnalisés natifs - mais cela signifie également que vous assumez le fardeau de la maintenance à long terme d'un framework interne, tout en perdant les avantages écosystémiques et communautaires d'un framework mature comme Vue.

Il existe également des frameworks construits à l'aide d'éléments personnalisés comme base de leur modèle de composants, mais ils doivent tous inévitablement introduire leurs solutions propriétaires aux problèmes répertoriés ci-dessus. L'utilisation de ces frameworks implique d'accepter leurs décisions techniques sur la façon de résoudre ces problèmes - ce qui, malgré ce qui peut être annoncé, ne vous isole pas automatiquement des futures évolutions potentielles.

Il existe également des domaines dans lesquels nous trouvons que les éléments personnalisés sont limités :

- L'évaluation en avance des slots entrave la composition des composants. Les [scoped slots](/guide/components/slots#scoped-slots) de Vue sont un mécanisme puissant pour la composition de composants, qui ne peut pas être prise en charge par des éléments personnalisés en raison de la déclaration en avance des slots natifs. Les slots en avance signifient également que le composant récepteur ne peut pas contrôler quand ou s'il faut rendre un élément du contenu du slot.

- Aujourd’hui, distribuer des éléments personnalisés avec du CSS à portée limitée étendus au shadow DOM nécessite l'intégration du CSS dans JavaScript afin qu'ils puissent être injectés dans les shadowRoot lors de l'exécution. Ils entraînent également des styles dupliqués dans le balisage des scénarios SSR. Il y a des [fonctionnalités de la plate-forme](https://github.com/whatwg/html/pull/4898/) en cours d'élaboration dans ce domaine - mais pour l'instant, elles ne sont pas encore universellement prises en charge, et il existe encore des performances de production / préoccupations SSR à traiter. En attendant, les SFC Vue fournissent des [mécanismes de limitation de la portée du CSS](/api/sfc-css-features) qui prennent en charge l'extraction des styles dans des fichiers CSS simples.

Vue restera toujours à jour avec les dernières normes de la plate-forme Web, et nous nous ferons un plaisir de tirer parti de tout ce que la plate-forme fournit si cela facilite notre travail. Cependant, notre objectif est de fournir des solutions qui fonctionnent bien et qui fonctionnent aujourd’hui. Cela signifie que nous devons intégrer de nouvelles fonctionnalités de plate-forme avec un état d'esprit critique - et cela implique de combler les lacunes là où les normes sont insuffisantes aussi longtemps que ce sera nécessaire.
