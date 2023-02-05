---
outline: deep
---

# Rendu côté serveur (SSR) {#server-side-rendering-ssr}

## Vue d'ensemble {#overview}

### Qu'est-ce que le SSR ? {#what-is-ssr}

Vue.js est un framework pour développer des applications côté client. Par défaut, les composants Vue produisent et manipulent le DOM dans le navigateur en tant que sortie. Cependant, il est également possible de rendre les mêmes composants en chaînes HTML sur le serveur, de les envoyer directement au navigateur et de finalement "hydrater" le balisage statique en une application entièrement interactive côté client.

Une application Vue.js rendue côté serveur peut également être considérée "isomorphe" ou "universelle", dans le sens que la majorité de votre code d'application s'exécute à la fois sur le serveur **et** sur le client.

### Pourquoi le SSR ? {#why-ssr}

Par rapport à une application monopage (SPA) côté client, l'avantage du SSR réside principalement dans :

- **Temps d'affichage plus rapide** : cela est plus important sur une connexion internet ou sur des périphériques lents. Le balisage rendu côté serveur n'a pas besoin d'attendre que tout le JavaScript soit téléchargé et exécuté pour être affiché, de sorte que votre utilisateur verra une page entièrement rendue plus rapidement. De plus, la récupération de données est effectuée côté serveur lors de la première visite, ce qui permet probablement une connexion plus rapide à votre base de données que le client. Cela entraîne généralement une amélioration des métriques [Core Web Vitals](https://web.dev/vitals/), une meilleure expérience utilisateur et peut être critique pour les applications où le temps d'affichage est directement associé au taux de conversion.

- **Modèle mental unifié** : vous pouvez utiliser le même langage et le même modèle mental déclaratif orienté composant pour développer votre application entière, au lieu de sauter sans arrêt entre un système de modèle de backend et un framework frontend.

- **Meilleur référencement** : les crawlers de moteur de recherche verront directement la page entièrement rendue.

  :::tip
  Pour l'instant, Google et Bing peuvent indexer correctement les applications JavaScript synchrones. Synchrone étant le mot clé ici. Si votre application commence par un indicateur de chargement, puis récupère du contenu via Ajax, le crawler n'attendra pas que vous terminiez. Cela signifie que si vous avez du contenu récupéré de manière asynchrone sur des pages où le référencement est important, le SSR peut être nécessaire.
  :::

Il y a aussi des compromis à considérer lors de l'utilisation du SSR :

- Contraintes de développement. Le code spécifique à un navigateur ne peut être utilisé que dans certains hooks de cycle de vie, certaines bibliothèques externes peuvent nécessiter un traitement spécial pour fonctionner dans une application SSR.

- Configuration de build et exigences de déploiement plus complexes. Contrairement à une SPA entièrement statique qui peut être déployée sur n'importe quel serveur de fichiers statiques, une application SSR nécessite un environnement où un serveur Node.js peut s'exécuter.

- Charge supplémentaire côté serveur. Le rendu d'une application complète dans Node.js sera plus gourmand en CPU que le simple service de fichiers statiques, donc si vous prévoyez une forte fréquentation, préparez-vous à une charge correspondante sur le serveur et utilisez judicieusement les stratégies de mise en cache.

Avant d'utiliser le SSR pour votre application, la première question à se poser est de savoir si vous en avez réellement besoin. Cela dépend principalement de l'importance du temps d'affichage pour votre application. Par exemple, si vous construisez un tableau de bord interne où quelques centaines de millisecondes supplémentaires au chargement initial n'ont pas une grande importance, le SSR serait un surdimensionnement. Cependant, dans les cas où le temps d'affichage est absolument crucial, le SSR peut vous aider à obtenir les meilleures performances possibles au chargement initial.

### SSR vs. SSG {#ssr-vs-ssg}

**La génération de site statique (SSG)**, également appelée pré-rendu, est une autre technique populaire pour construire des sites web rapides. Si les données nécessaires pour le rendu côté serveur d'une page sont les mêmes pour chaque utilisateur, alors au lieu de rendre la page à chaque fois qu'une demande est reçue, nous pouvons la rendre une seule fois, à l'avance, pendant le processus de build. Les pages pré-rendues sont générées et servies en tant que fichiers HTML statiques.

SSG conserve les mêmes caractéristiques de performance que les applications en SSR : il offre une excellente performance en termes de temps-à-contenu. En même temps, il est moins cher et plus facile à déployer que les applications SSR car la sortie est du HTML et des actifs statiques. Le mot clé ici est **statique** : SSG ne peut être appliqué qu'à des pages consommant des données statiques, c'est-à-dire des données connues au moment du build et qui ne changent pas entre les déploiements. À chaque fois que les données changent, un nouveau déploiement est nécessaire.

Si vous envisagez l'utilisation du SSR uniquement pour améliorer le référencement (SEO) d'un petit nombre de pages marketing (par exemple, `/`, `/about`, `/contact`, etc.), alors vous voulez probablement du SSG au lieu du SSR. Le SSG est également idéal pour les sites web basés sur du contenu tels que les sites de documentation ou les blogs. En fait, ce site web que vous êtes en train de lire est généré de manière statique à l'aide de [VitePress](https://vitepress.vuejs.org/), un générateur de site statique alimenté par Vue.

## Tutoriel de base {#basic-tutorial}

### Rendu d'une application {#rendering-an-app}

Jetons un coup d'œil à l'exemple le plus simple de Vue SSR en action.

1. Créez un nouveau répertoire et `cd` à l'intérieur
2. Exécutez `npm init -y`
3. Ajoutez `"type": "module"` dans `package.json` pour que Node.js fonctionne en [ES modules mode](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
4. Exécutez `npm install vue`
5. Créez un fichier `example.js` :

```js
// cela fonctionne en Node.js sur le serveur.
import { createSSRApp } from 'vue'
// L'API de rendu de serveur de Vue est exposée sous `vue/server-renderer`.
import { renderToString } from 'vue/server-renderer'

const app = createSSRApp({
  data: () => ({ count: 1 }),
  template: `<button @click="count++">{{ count }}</button>`
})

renderToString(app).then((html) => {
  console.log(html)
})
```

Après, lancez :

```sh
> node example.js
```

Cela devrait imprimer ce qui suit sur la ligne de commande :

```
<button>1</button>
```

La fonction [`renderToString()`](/api/ssr.html#rendertostring) prend une instance d'application Vue et renvoie une Promise qui correspond au rendu HTML de l'application. Il est également possible d'effectuer un rendu en continu à l'aide de la [Node.js Stream API](https://nodejs.org/api/stream.html) ou de la [Web Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). Consultez la [SSR API Reference](/api/ssr.html) pour plus de détails.

Nous pouvons ensuite déplacer le code Vue SSR dans un gestionnaire de requêtes serveur, qui englobe le balisage de l'application avec la page HTML complète. Nous allons utiliser [`express`](https://expressjs.com/) pour les étapes suivantes :

- Lancez `npm install express`
- Créez le fichier `server.js` suivant :

```js
import express from 'express'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const server = express()

server.get('/', (req, res) => {
  const app = createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `)
  })
})

server.listen(3000, () => {
  console.log('ready')
})
```

Enfin, exécutez `node server.js` et visitez `http://localhost:3000`. Vous devriez voir la page fonctionner avec le bouton.

[Essayez-le sur StackBlitz](https://stackblitz.com/fork/vue-ssr-example-basic?file=index.js)

### Client Hydration {#client-hydration}

Si vous cliquez sur le bouton, vous verrez que le nombre ne change pas. L'HTML est complètement statique côté client car nous n'avons pas chargé Vue dans le navigateur.

Pour rendre l'application côté client interactive, Vue doit effectuer l'étape de **hydratation**. Pendant l'hydratation, elle crée la même application Vue qui a été exécutée sur le serveur, associe chaque composant aux nœuds DOM qu'il doit contrôler et attache les écouteurs d'événements DOM.

Pour monter une application en mode hydratation, nous devons utiliser [`createSSRApp()`](/api/application.html#createssrapp) au lieu de `createApp()`:

```js{2}
// cela fonctionne dans le navigateur.
import { createSSRApp } from 'vue'

const app = createSSRApp({
  // ...même application que sur le serveur
})

// Le montage d'une application SSR sur le client suppose
// que le HTML a été pré-rendu et qu'il effectuera une
// l'hydratation au lieu de monter de nouveaux noeuds DOM.

app.mount('#app')
```

### Structure du code {#code-structure}

Remarquez que nous devons réutiliser la même implémentation d'application côté serveur. C'est là que nous devons commencer à réfléchir à la structure du code dans une application SSR - comment partager le même code d'application entre le serveur et le client ?

Ici, nous allons démontrer la configuration la plus simple. Tout d'abord, divisons la logique de création d'application en un fichier dédié, `app.js`:

```js
// app.js (partagé entre le serveur et le client)
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })
}
```

Ce fichier et ses dépendances sont partagés entre le serveur et le client - nous les appelons **code universel**. Il y a un certain nombre de choses à prendre en compte lors de la rédaction du code universel,  nous allons le [voir ci-dessous](#writing-ssr-friendly-code).

Notre entrée client importe le code universel, crée l'application et effectue le montage :

```js
// client.js
import { createApp } from './app.js'

createApp().mount('#app')
```

Et le serveur utilise la même logique de création d'application dans le gestionnaire de demande :

```js{2,5}
// server.js (code non pertinent omis)
import { createApp } from './app.js'

server.get('/', (req, res) => {
  const app = createApp()
  renderToString(app).then(html => {
    // ...
  })
})
```

De plus, pour charger les fichiers client dans le navigateur, nous devons également :

1. Servir les fichiers client en ajoutant `server.use(express.static('.'))` dans `server.js`.
2. Charger l'entrée client en ajoutant `<script type="module" src="/client.js"></script>` à la coque HTML.
3. Prend en charge l'utilisation comme `import * from 'vue'` dans le navigateur en ajoutant [Import Map](https://github.com/WICG/import-maps) à la coque HTML.

[Essayez l'exemple complété sur StackBlitz](https://stackblitz.com/fork/vue-ssr-example?file=index.js).  Le bouton est maintenant interactif !

## Solutions de haut niveau {#higher-level-solutions}

Lorsque vous passez d'un exemple à une application SSR en production, il y a beaucoup plus de considérations à prendre en compte. Nous aurons besoin de :

- Prise en charge des SFC Vue et d'autres exigences de la phase de construction. En fait, nous aurons besoin de coordonner deux builds pour la même application: un pour le client et un pour le serveur.

  :::tip
  Les composants Vue sont compilés différemment lorsqu'ils sont utilisés en SSR - les modèles sont compilés en concaténations de chaînes au lieu de fonctions de rendu de DOM virtuel pour un rendu plus efficace en performance.
  :::

- Dans le gestionnaire de requête du serveur, afficher le HTML avec les liens de ressources client corrects et les astuces de ressources optimales. Il peut également être nécessaire de basculer entre le mode SSR et SSG, ou même de mélanger les deux dans la même application.

- Gestion du routage, de la récupération de données et des magasins de gestion d'état de manière universelle.

Une implémentation complète serait assez complexe et dépend de la chaîne d'outils de build que vous avez choisie. Par conséquent, nous vous recommandons fortement d'adopter une solution plus élevée et orientée afin d'abstraire la complexité pour vous. Ci-dessous, nous présenterons quelques solutions SSR recommandées dans l'écosystème Vue.





### Nuxt {#nuxt}

[Nuxt](https://nuxt.com/) est une plateforme de haut niveau construite sur l'écosystème Vue qui offre une expérience de développement simplifiée pour écrire des applications Vue universelles. Encore mieux, vous pouvez également l'utiliser en tant que générateur de site statique! Nous vous recommandons fortement de l'essayer.

### Quasar {#quasar}

[Quasar](https://quasar.dev) est une solution complète basée sur Vue qui vous permet de cibler du SPA, du SSR, de la PWA, de l'application mobile, de l'application de bureau et de l'extension de navigateur en utilisant une seule base de code. Il gère non seulement la mise en place du build, mais fournit également une collection complète de composants d'interface utilisateur conformes à Material Design.

### Vite SSR {#vite-ssr}

Vite fournit [un support intégré pour le rendu côté serveur de Vue](https://vitejs.dev/guide/ssr.html), mais il est intentionnellement de niveau bas. Si vous souhaitez aller directement avec Vite, consultez [vite-plugin-ssr](https://vite-plugin-ssr.com/), un plugin communautaire qui fait abstraction de nombreux détails difficiles pour vous.

Vous pouvez également trouver un exemple de projet Vue + Vite SSR en utilisant une configuration manuelle ici, qui peut servir de base pour la construction. Notez que ceci n'est recommandé que si vous avez de l'expérience avec SSR / outils de build et que vous souhaitez avoir un contrôle complet sur l'architecture de haut niveau.

## Écrire un code convivial pour du SSR {#writing-ssr-friendly-code}

Indépendamment de votre configuration de construction ou de votre choix de framework de haut niveau, il existe des principes qui s'appliquent à toutes les applications Vue SSR.

### Réactivité sur le serveur {#reactivity-on-the-server}

Pendant le SSR, chaque URL de demande correspond à un état souhaité de notre application. Il n'y a pas d'interaction utilisateur et aucune mise à jour DOM, donc la réactivité n'est pas nécessaire sur le serveur. Par défaut, la réactivité est désactivée pendant le SSR pour une meilleure performance.

### Les hooks du cycle de vie du composant {#component-lifecycle-hooks}

Depuis qu'il n'y a plus de mises à jour dynamiques, les hooks de cycle de vie tels que <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> ou <span class="options-api">`updated`</span><span class="composition-api">`onUpdated`</span> ne seront **PAS** appelées pendant le SSR et ne seront exécutées que côté client.<span class="options-api"> Les seuls hooks qui sont appelés pendant le SSR sont `beforeCreate` et `created`</span>

Vous devriez éviter le code qui produit des effets secondaires qui nécessitent un nettoyage dans <span class="options-api">`beforeCreate` et `created`</span><span class="composition-api">`setup()` ou dans le scope de `<script setup>`</span>. Un exemple d'effets secondaires est la configuration de minuteries avec `setInterval`. Dans le code exécuté côté client, nous pouvons configurer une minuterie et la démonter dans <span class="options-api">`beforeUnmount`</span><span class="composition-api">`onBeforeUnmount`</span> ou <span class="options-api">`unmounted`</span><span class="composition-api">`onUnmounted`</span>. Cependant, étant donné que les hooks de démontage ne seront jamais appelés pendant le SSR, les minuteries resteront à jamais. Pour éviter cela, déplacez votre code d'effets secondaires dans <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>.

###  Accès aux API spécifiques à la plateforme {#access-to-platform-specific-apis}

Universal code cannot assume access to platform-specific APIs, so if your code directly uses browser-only globals like `window` or `document`, they will throw errors when executed in Node.js, and vice-versa.

Le code universel ne peut pas supposer l'accès aux API spécifiques à la plateforme, donc si votre code utilise directement des éléments spécifiques au navigateur comme `window` ou `document`, ils lanceront des erreurs lorsqu'ils seront exécutés dans Node.js et vice-versa.

For tasks that are shared between server and client but with different platform APIs, it's recommended to wrap the platform-specific implementations inside a universal API, or use libraries that do this for you. For example, you can use [`node-fetch`](https://github.com/node-fetch/node-fetch) to use the same fetch API on both server and client.

Pour les tâches partagées entre le serveur et le client mais avec des API de plateforme différentes, il est recommandé de wraper les implémentations spécifiques à la plateforme dans une API universelle ou d'utiliser des bibliothèques qui le font pour vous. Par exemple, vous pouvez utiliser [`node-fetch`](https://github.com/node-fetch/node-fetch) pour utiliser la même API fetch sur le serveur et le client.

Pour les API spécifiques au navigateur, la démarche courante consiste à y accéder de manière paresseuse dans des hooks de cycle de vie client uniquement tels que <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>.

Notez que si une bibliothèque tiers n'est pas écrite en vue d'une utilisation universelle, il peut être difficile de l'intégrer dans une application rendue côté serveur. Vous _pourriez_ être en mesure de la faire fonctionner en simulant certaines des globales, mais ce serait un bricolage et peut interférer avec le code de détection de l'environnement d'autres bibliothèques.

### Pollution d'État à demande croisée {#cross-request-state-pollution}

Dans le chapitre de Gestion d'État, nous avons introduit un [patron de gestion d'état simple en utilisant les API de réactivité](state-management.html#simple-state-management-with-reactivity-api). Dans un contexte SSR, ce modèle nécessite des ajustements supplémentaires.

Le modèle déclare un état partagé dans le scope d'un module JavaScript. Cela les rend **singletons** - c'est-à-dire qu'il n'y a qu'une seule instance de l'objet réactif tout au long de la vie de notre application. Cela fonctionne comme prévu dans une application Vue côté client, car les modules de notre application sont initialisés à nouveau pour chaque visite de page navigateur.

Cependant, dans un contexte SSR, les modules d'application sont généralement initialisés une seule fois sur le serveur, lorsque le serveur démarre. Les mêmes instances de modules seront réutilisées à travers plusieurs demandes de serveur, et donc nos objets d'état singletons. Si nous modifions l'état partagé singleton avec des données spécifiques à un utilisateur, cela peut être accidentellement fuite à une demande provenant d'un autre utilisateur. Nous appelons cela une **pollution d'état cross-request.**

Techniquement, nous pouvons ré-initialiser tous les modules JavaScript à chaque demande, tout comme nous le faisons dans les navigateurs. Cependant, l'initialisation des modules JavaScript peut être coûteuse, ce qui affecterait significativement les performances du serveur.

The recommended solution is to create a new instance of the entire application - including the router and global stores - on each request. Then, instead of directly importing it in our components, we provide the shared state using [app-level provide](/guide/components/provide-inject.html#app-level-provide) and inject it in components that need it:

La solution recommandée est de créer une nouvelle instance de l'application entière - y compris le routeur et les stores globaux - à chaque demande. Ensuite, au lieu de l'importer directement dans nos composants, nous fournissons l'état partagé en utilisant [le fournisseur de niveau d'application](/guide/components/provide-inject.html#app-level-provide) et l'injecterons dans les composants qui en ont besoin :

```js
// app.js (partagé entre le serveur et le client)
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

// appelé sur chaque demande
export function createApp() {
  const app = createSSRApp(/* ... */)
  // créer une nouvelle instance de store par requête
  const store = createStore(/* ... */)
  // fournir un store au niveau de l'application
  app.provide('store', store)
  // expose également le store à des fins d'hydratation
  return { app, store }
}
```

Les bibliothèques de gestion d'état comme Pinia sont conçues dans cet esprit. Consultez le [guide SSR de Pinia](https://pinia.vuejs.org/ssr/) pour plus de détails.

### Déséquilibre de l'hydratation {#hydration-mismatch}

Si la structure du DOM du HTML pré-rendu ne correspond pas à la sortie attendue de l'application côté client, il y aura une erreur de désaccord d'hydratation. Le désaccord d'hydratation est généralement introduit par les causes suivantes :

1. Le modèle contient une structure de nesting HTML non valide, et le HTML rendu a été "corrigé" par le comportement de parsing HTML natif du navigateur. Par exemple, une erreur courante est que [`<div>` ne peut pas être placé à l'intérieur de `<p>`](https://stackoverflow.com/questions/8397852/why-cant-the-p-tag-contain-a-div-tag-inside-it):

   ```html
   <p><div>hi</div></p>
   ```

   Si nous produisons ceci dans notre HTML rendu par le serveur, le navigateur terminera le premier `<p>` lorsque `<div>` sera rencontré et l'analysera en la structure de DOM suivante :

   ```html
   <p></p>
   <div>hi</div>
   <p></p>
   ```

2. Les données utilisées lors de la mise en forme contiennent des valeurs générées aléatoirement. Étant donné que la même application s'exécutera deux fois - une fois sur le serveur et une fois sur le client - les valeurs aléatoires ne sont pas garanties d'être les mêmes entre les deux exécutions. Il existe deux façons d'éviter les incohérences causées par les valeurs aléatoires :

   1. Utilisez `v-if` + `onMounted` pour rendre uniquement sur le client la partie dépendante de valeurs aléatoires. Votre framework peut également disposer de fonctionnalités intégrées pour faciliter cela, par exemple le composant `<ClientOnly>` de VitePress.

   2. Use a random number generator library that supports generating with seeds, and guarantee the server run and the client run are using the same seed (e.g. by including the seed in serialized state and retrieving it on the client).
   Utilisez une bibliothèque de générateur de nombres aléatoires qui prend en charge la génération avec des seeds, et assurez-vous que l'exécution du serveur et l'exécution du client utilisent la même seed (par exemple en incluant la seed dans l'état sérialisé et en la récupérant sur le client).

3. Le serveur et le client se trouvent dans des fuseaux horaires différents. Parfois, nous pouvons vouloir convertir un horodatage en temps local de l'utilisateur. Cependant, le fuseau horaire lors de l'exécution du serveur et le fuseau horaire lors de l'exécution du client ne sont pas toujours les mêmes, et nous ne pouvons pas toujours connaître de manière fiable le fuseau horaire de l'utilisateur lors de l'exécution du serveur. Dans de tels cas, la conversion de l'heure locale doit également être effectuée en tant qu'opération uniquement côté client.

Lorsque Vue rencontre une incohérence d'hydratation, il tentera de récupérer automatiquement et de régler le DOM pré-rendu pour correspondre à l'état côté client. Cela entraînera une perte de performance de rendu due à la suppression de nœuds incorrects et au montage de nouveaux nœuds, mais dans la plupart des cas, l'application devrait continuer à fonctionner comme prévu. Cela dit, il est toujours préférable d'éliminer les incohérences d'hydratation pendant le développement.

### Directives personnalisées {#custom-directives}

Comme la plupart des directives personnalisées impliquent une manipulation directe du DOM, elles sont ignorées lors du SSR. Cependant, si vous souhaitez spécifier comment une directive personnalisée doit être rendue (c'est-à-dire quels attributs elle devrait ajouter à l'élément rendu), vous pouvez utiliser le hook de directive `getSSRProps` :

```js
const myDirective = {
  mounted(el, binding) {
    // implémentation côté client :
    // mettre à jour directement le DOM
    el.id = binding.value
  },
  getSSRProps(binding) {
    // implémentation côté serveur :
    // renvoie les props à rendre.
    // getSSRProps ne reçoit que la liaison de la directive.
    return {
      id: binding.value
    }
  }
}
```

### Teleports {#teleports}

L'utilisation de Teleports nécessite une gestion spéciale lors de la SSR. Si l'application rendue contient Teleports, le contenu téléporté ne sera pas inclus dans la chaîne rendue. Une solution plus facile consiste à rendre Teleport lors du montage.

Si vous devez hydrater le contenu téléporté, ils seront exposés dans la propriété `teleports` de l'objet de contexte du SSR :

```js
const ctx = {}
const html = await renderToString(app, ctx)

console.log(ctx.teleports) // { '#teleported': 'teleported content' }
```

You need to inject the teleport markup into the correct location in your final page HTML similar to how you need to inject the main app markup.
Vous devez injecter le markup de téléportation dans l'emplacement correct dans votre HTML de page finale, tout comme vous devez injecter le markup principal de l'application.

:::tip
Évitez de cibler `body` lorsque vous utilisez Teleports et le SSR ensemble - généralement, `<body>` contiendra d'autres contenus rendus sur le serveur ce qui rend impossible pour Teleports de déterminer le bon emplacement de départ pour l'hydratation.

Préférez plutôt un conteneur dédié, par exemple `<div id="teleported"></div>` qui ne contient que le contenu téléporté.
:::
