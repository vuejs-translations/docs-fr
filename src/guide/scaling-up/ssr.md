---
outline: deep
---

# Rendu côté serveur (SSR) {#server-side-rendering-ssr}

## Vue d'ensemble {#overview}

### Qu'est-ce que le SSR ? {#what-is-ssr}

Vue.js est un framework pour développer des applications côté client avec des composants qui produisent et manipulent le DOM. Il peut également rendre les composants en HTML côté serveur et les hydrater en une application interactive côté client.

Une application Vue côté serveur peut être "isomorphe" ou "universelle", avec la majorité du code qui s'exécute sur le serveur **et** le client.

### Pourquoi le SSR ? {#why-ssr}

L'avantage du SSR par rapport à une application monopage SPA côté client :

- **Temps d'affichage plus rapide** : cela est plus important sur une connexion internet ou sur des périphériques lents. Le rendu côté serveur permet qu'une page soit rendue plus rapidement car elle n'a pas besoin d'attendre le téléchargement et l'exécution du JavaScript. La récupération des données se fait également côté serveur, ce qui peut améliorer la vitesse de connexion à la base de données. Cela peut entraîner une amélioration de l'expérience utilisateur et des métriques [Core Web Vitals](https://web.dev/vitals/), en particulier pour les applications où le temps d'affichage est important pour le taux de conversion.

- **Modèle mental unifié** : vous pouvez utiliser le même langage et le même modèle mental déclaratif orienté composant pour développer votre application entière, au lieu de sauter sans arrêt entre un système de modèle de backend et un framework frontend.

- **Meilleur référencement** : les robots d'indexation de moteur de recherche verront directement la page entièrement rendue.

  :::tip
  Les moteurs de recherche, par exemple Google et Bing, peuvent indexer correctement les applications JavaScript synchronisées. Si l'application utilise du contenu chargé de manière asynchrone, le rendu côté serveur peut être nécessaire pour un bon référencement.
  :::

Il y a aussi des compromis à considérer lors de l'utilisation du SSR :

- Contraintes de développement. Le code spécifique à un navigateur ne peut être utilisé que dans certains hooks de cycle de vie, certaines bibliothèques externes peuvent nécessiter un traitement spécial pour fonctionner dans une application SSR.

- Configuration de build et exigences de déploiement plus complexes. Contrairement à une SPA entièrement statique qui peut être déployée sur n'importe quel serveur de fichiers statiques, une application SSR nécessite un environnement où un serveur Node.js peut s'exécuter.

- Charge supplémentaire côté serveur. Le rendu d'une application dans Node.js sera plus gourmand en ressources, il faut prévoir une charge supplémentaire sur le serveur et utiliser les stratégies de mise en cache

Pensez à vos besoins en temps d'affichage avant d'utiliser SSR pour votre application, car cela peut consommer plus de CPU que les fichiers statiques. Si le temps d'affichage n'est pas crucial, SSR peut être inutile. Mais si c'est important, SSR peut améliorer les performances au chargement initial.

### SSR vs. SSG {#ssr-vs-ssg}

**La génération de site statique (SSG)**, également appelée pré-rendu, est une autre technique populaire pour construire des sites web rapides. Le rendu préalable des pages peut améliorer les performances en les rendant en une seule fois pour chaque utilisateur si les données nécessaires sont les mêmes. Les pages sont alors générées et servies sous forme de fichiers HTML statiques.

SSG conserve les mêmes caractéristiques de performance que les applications SSR : il offre une excellente performance en termes de délai de mise à disposition du contenu. De plus, il est moins cher et plus facile à déployer que les applications SSR parce que le résultat est un HTML statique avec des assets. SSG ne peut être appliqué qu'aux pages fournissant des données statiques, c'est-à-dire des données qui sont connues au moment de la création et qui ne peuvent pas changer entre les requêtes. Chaque fois que les données changent, un nouveau déploiement est nécessaire.

Si vous envisagez l'utilisation du SSR uniquement pour améliorer le référencement (SEO) d'un petit nombre de pages marketing (par exemple, `/`, `/about`, `/contact`, etc.), alors vous voulez probablement du SSG au lieu du SSR. Le SSG convient aux sites web de contenu, tels que les blogs et les sites de documentation. Il est utilisé pour générer des sites web statiques, comme ce site que vous lisez maintenant qui est créé avec [VitePress](https://vitepress.dev/).

## Tutoriel de base {#basic-tutorial}

### Rendu d'une application {#rendering-an-app}

Jetons un coup d'œil à l'exemple le plus simple du SSR de Vue en action.

1. Créez un nouveau répertoire et `cd` à l'intérieur
2. Exécutez `npm init -y`
3. Ajoutez `"type": "module"` dans `package.json` pour que Node.js fonctionne en [Mode modules ES](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
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

Cela devrait retourner :

```
<button>1</button>
```

La fonction [`renderToString()`](/api/ssr#rendertostring) rend une application Vue en HTML et renvoie une Promise avec le rendu. Il peut également être rendu en continu avec l'API de stream [Node.js Stream API](https://nodejs.org/api/stream.html) ou [Web Streams API](https://developer.mozilla.org/fr/docs/Web/API/Streams_API). Voir la [référence de l'API SSR](/api/ssr) pour plus d'informations.

Nous utilisons [`express`](https://expressjs.com/) pour inclure le code Vue SSR dans une page HTML complète sur le serveur :

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

### Hydratation des clients {#client-hydration}

Si vous cliquez sur le bouton, vous verrez que le nombre ne change pas. L'HTML est complètement statique côté client car nous n'avons pas chargé Vue dans le navigateur.

Pour rendre l'application côté client interactive, Vue doit effectuer l'étape de l'**hydratation**. Pendant l'hydratation, il crée la même application Vue qui a été exécutée sur le serveur, associe chaque composant aux nœuds DOM qu'il doit contrôler et attache les écouteurs d'événements du DOM.

Pour monter une application en mode hydratation, nous devons utiliser [`createSSRApp()`](/api/application#createssrapp) au lieu de `createApp()` :

```js{2}
// cela fonctionne dans le navigateur.
import { createSSRApp } from 'vue'

const app = createSSRApp({
  // ...même application que sur le serveur
})

// Le montage d'une application SSR sur le client suppose
// que le HTML a été pré-rendu et qu'il effectuera une
// hydratation au lieu de monter de nouveaux nœuds du DOM.
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

Ce fichier et ses dépendances sont partagés entre le serveur et le client - nous les appelons **code universel**. Il y a un certain nombre de choses à prendre en compte lors de la rédaction du code universel, nous allons le [voir ci-dessous](#writing-ssr-friendly-code).

Notre entrée client importe le code universel, crée l'application et effectue le montage :

```js [client.js]
import { createApp } from './app.js'

createApp().mount('#app')
```

Et le serveur utilise la même logique de création d'application dans le gestionnaire de demande :

```js{2,5} [server.js]
// (code non pertinent omis)
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
2. Charger l'entrée client en ajoutant `<script type="module" src="/client.js"></script>` au fichier HTML.
3. Prendre en charge l'utilisation comme `import * from 'vue'` dans le navigateur en ajoutant [Import Map](https://github.com/WICG/import-maps) au fichier HTML.

[Essayez l'exemple complété sur StackBlitz](https://stackblitz.com/fork/vue-ssr-example?file=index.js). Le bouton est maintenant interactif !

## Solutions de haut niveau {#higher-level-solutions}

Pour une application SSR en production, plusieurs considérations supplémentaires doivent être prises en compte :

- Prendre en charge les SFC Vue et d'autres exigences de l'étape de build. En fait, nous aurons besoin de coordonner deux builds pour la même application : un pour le client et un pour le serveur.

  :::tip
  Les composants Vue sont compilés différemment en SSR : les templates compilés sont compilés en chaînes, par rapport à des fonctions de rendu de DOM virtuel, pour une performance accrue.
  :::

- Dans le gestionnaire de requête du serveur, afficher le HTML avec les liens corrects des ressources clientes et autres ressources optimisées. Il peut également être nécessaire de basculer entre le mode SSR et SSG, ou même de mélanger les deux dans la même application.

- Gestion du routage, de la récupération de données et des stores de gestion d'état de manière universelle.

Une implémentation complète serait assez complexe et dépend de la chaîne d'outils de build que vous avez choisie. Par conséquent, nous vous recommandons fortement d'adopter une solution plus élevée et orientée afin d'abstraire la complexité pour vous. Ci-dessous, nous présenterons quelques solutions SSR recommandées dans l'écosystème Vue.

### Nuxt {#nuxt}

[Nuxt](https://nuxt.com/) est une plateforme Vue simplifiée pour développer des applications universelles et peut être utilisée comme générateur de site statique. Nous vous recommandons fortement de l'essayer.

### Quasar {#quasar}

[Quasar](https://quasar.dev) est une plateforme basée sur Vue qui vous permet de développer des applications pour plusieurs plateformes (SSR, SPA, PWA, mobile, bureau, extension de navigateur) avec un seul code de base. Il fournit également des composants d'interface utilisateur conformes à Material Design.

### Vite SSR {#vite-ssr}

Vite fournit [un support natif pour le rendu côté serveur de Vue](https://vitejs.dev/guide/ssr.html), mais il est intentionnellement de bas niveau. Si vous souhaitez utiliser directement avec Vite, consultez [vite-plugin-ssr](https://vite-plugin-ssr.com/), un plugin communautaire qui fait abstraction de nombreux détails complexes pour vous.

Vous pouvez également trouver un exemple de projet Vue + Vite SSR en utilisant une configuration manuelle ici, qui peut servir de base pour le build. Notez que ceci n'est recommandé que si vous avez de l'expérience avec SSR / outils de build et que vous souhaitez avoir un contrôle complet sur l'architecture de haut niveau.

## Écrire du code SSR propre {#writing-ssr-friendly-code}

Indépendamment de votre configuration de build ou de votre choix de framework de haut niveau, il existe des principes qui s'appliquent à toutes les applications Vue SSR.

### Réactivité sur le serveur {#reactivity-on-the-server}

Pendant le SSR, chaque URL requêtée correspond à un état souhaité de notre application. Il n'y a pas d'interaction utilisateur et aucune mise à jour du DOM, donc la réactivité n'est pas nécessaire sur le serveur. Par défaut, la réactivité est désactivée pendant le SSR pour une meilleure performance.

### Les hooks du cycle de vie du composant {#component-lifecycle-hooks}

Vu qu'il n'y a pas de mises à jour dynamiques, les hooks de cycle de vie tels que <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> ou <span class="options-api">`updated`</span><span class="composition-api">`onUpdated`</span> ne seront **PAS** appelés pendant le SSR et ne seront exécutés que côté client.<span class="options-api"> Les seuls hooks qui sont appelés pendant le SSR sont `beforeCreate` et `created`</span>

Vous devriez éviter le code qui produit des effets de bord qui nécessitent un nettoyage dans <span class="options-api">`beforeCreate` et `created`</span><span class="composition-api">`setup()` ou dans la portée de `<script setup>`</span>. Un exemple d'effets de bord est la configuration de minuteries avec `setInterval`. Dans le code exécuté côté client, nous pouvons configurer une minuterie et la démonter dans <span class="options-api">`beforeUnmount`</span><span class="composition-api">`onBeforeUnmount`</span> ou <span class="options-api">`unmounted`</span><span class="composition-api">`onUnmounted`</span>. Cependant, étant donné que les hooks de démontage ne seront jamais appelés pendant le SSR, les minuteries resteront à jamais. Pour éviter cela, déplacez votre code d'effets de bord dans <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>.

### Accès aux API spécifiques à la plateforme {#access-to-platform-specific-apis}

Le code universel ne peut pas supposer l'accès aux API spécifiques à la plateforme, donc si votre code utilise directement des éléments spécifiques au navigateur comme `window` ou `document`, ils lanceront des erreurs lorsqu'ils seront exécutés dans Node.js et vice-versa.

Pour les tâches partagées entre le serveur et le client mais avec des API de plateforme différentes, il est recommandé d'envelopper les implémentations spécifiques à la plateforme dans une API universelle ou d'utiliser des bibliothèques qui le font pour vous. Par exemple, vous pouvez utiliser [`node-fetch`](https://github.com/node-fetch/node-fetch) pour utiliser la même API fetch sur le serveur et le client.

Pour les API spécifiques au navigateur, la démarche courante consiste à y accéder de manière paresseuse dans des hooks de cycle de vie client uniquement tels que <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>.

Notez que si une bibliothèque tiers n'est pas écrite en vue d'une utilisation universelle, il peut être difficile de l'intégrer dans une application rendue côté serveur. Vous _pourriez_ être en mesure de la faire fonctionner en simulant certaines des globales, mais ce serait un bricolage et pourrait interférer avec le code de détection de l'environnement d'autres bibliothèques.

### Pollution d'état par demandes croisées {#cross-request-state-pollution}

Dans le chapitre de Gestion d'État, nous avons introduit un [patron de gestion d'état simple en utilisant les API de réactivité](state-management.html#simple-state-management-with-reactivity-api). Dans un contexte SSR, ce modèle nécessite des ajustements supplémentaires.

Le modèle déclare un état partagé dans la portée d'un module JavaScript. Cela les rend **singletons** - c'est-à-dire qu'il n'y a qu'une seule instance de l'objet réactif tout au long de la vie de notre application. Cela fonctionne comme prévu dans une application Vue côté client, car les modules de notre application sont initialisés à nouveau pour chaque visite de page navigateur.

Cependant, dans un contexte SSR, les modules d'application sont généralement initialisés une seule fois sur le serveur, lorsque le serveur démarre. Les mêmes instances de modules seront réutilisées à travers plusieurs demandes de serveur, et donc nos objets d'état singletons. Si nous modifions l'état partagé singleton avec des données spécifiques à un utilisateur, cela peut accidentellement causer une fuite vers une demande provenant d'un autre utilisateur. Nous appelons cela une **pollution d'état par demandes croisées.**

Techniquement, nous pouvons ré-initialiser tous les modules JavaScript à chaque demande, tout comme nous le faisons dans les navigateurs. Cependant, l'initialisation des modules JavaScript peut être coûteuse, ce qui affecterait significativement les performances du serveur.

La solution recommandée est de créer une nouvelle instance de l'application entière - y compris le routeur et les stores globaux - à chaque demande. Ensuite, au lieu de l'importer directement dans nos composants, nous fournissons l'état partagé en utilisant [provide au niveau de l'application](/guide/components/provide-inject#app-level-provide) et l'injecterons dans les composants qui en ont besoin :

```js
// app.js (partagé entre le serveur et le client)
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

// appelée sur chaque demande
export function createApp() {
  const app = createSSRApp(/* ... */)
  // crée une nouvelle instance de store par requête
  const store = createStore(/* ... */)
  // fournit un store au niveau de l'application
  app.provide('store', store)
  // expose également le store à des fins d'hydratation
  return { app, store }
}
```

Les bibliothèques de gestion d'état comme Pinia sont conçues dans cet esprit. Consultez le [guide SSR de Pinia](https://pinia.vuejs.org/ssr/) pour plus de détails.

### Déséquilibre de l'hydratation {#hydration-mismatch}

Si la structure du DOM du HTML pré-rendu ne correspond pas à la sortie attendue de l'application côté client, il y aura une erreur de désaccord d'hydratation. Le désaccord d'hydratation est généralement introduit par les causes suivantes :

1. Le modèle contient une structure HTML imbriqué non valide, et le HTML rendu a été "corrigé" par le comportement d'analyse syntaxique du HTML natif du navigateur. Par exemple, une erreur courante est que [`<div>` ne peut pas être placée à l'intérieur de `<p>`](https://stackoverflow.com/questions/8397852/why-cant-the-p-tag-contain-a-div-tag-inside-it):

   ```html
   <p><div>hi</div></p>
   ```

   Si nous produisons ceci dans notre HTML rendu par le serveur, le navigateur terminera le premier `<p>` lorsque `<div>` sera rencontré et l'analysera en la structure de DOM suivante :

   ```html
   <p></p>
   <div>hi</div>
   <p></p>
   ```

2. Les données de mise en forme avec des valeurs aléatoires causent des incohérences lors de l'exécution serveur/client. Pour éviter cela, il existe deux solutions.

   1. Utilisez `v-if` + `onMounted` pour rendre uniquement sur le client la partie dépendante de valeurs aléatoires. Votre framework peut également disposer de fonctionnalités intégrées pour faciliter cela, par exemple le composant `<ClientOnly>` de VitePress.

   2. Utilisez une bibliothèque de générateur de nombres aléatoires qui prend en charge la génération avec des seeds, et assurez-vous que l'exécution du serveur et l'exécution du client utilisent la même seed (par exemple en incluant la seed dans l'état sérialisé et en la récupérant sur le client).

3. Le temps local pour l'utilisateur ne peut pas toujours être déterminé sur le serveur en raison de différences de fuseau horaire, il doit donc être converti côté client.

Lorsque Vue rencontre une incohérence d'hydratation, il tentera de récupérer automatiquement et de régler le DOM pré-rendu pour correspondre à l'état côté client. Cela entraînera une perte de performance de rendu due à la suppression de nœuds incorrects et au montage de nouveaux nœuds, mais dans la plupart des cas, l'application devrait continuer à fonctionner comme prévu. Cela dit, il est toujours préférable d'éliminer les incohérences d'hydratation pendant le développement.

#### Suppression de la non-concordance lors de l'hydratation <sup class="vt-badge" data-text="3.5+" /> {#suppressing-hydration-mismatches}

Dans Vue 3.5+, il est possible de supprimer sélectivement les non-concordances lors de l'hydratation inévitables en utilisant l'attribut [`data-allow-mismatch`](/api/ssr#data-allow-mismatch).

### Directives personnalisées {#custom-directives}

Les directives personnalisées ne sont pas prises en compte lors du SSR. Mais si vous souhaitez spécifier comment une directive personnalisée doit être rendue, vous pouvez les rendre en utilisant le hook `getSSRProps` :

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

Vous devez injecter le markup de téléportation dans l'emplacement correct dans votre HTML de page finale, tout comme vous devez injecter le markup principal de l'application.

:::tip
Évitez de cibler `body` lorsque vous utilisez Teleports et le SSR ensemble - généralement, `<body>` contiendra d'autres contenus rendus sur le serveur ce qui rend impossible pour Teleports de déterminer le bon emplacement de départ pour l'hydratation.

Préférez plutôt un conteneur dédié, par exemple `<div id="teleported"></div>` qui ne contient que le contenu téléporté.
:::
