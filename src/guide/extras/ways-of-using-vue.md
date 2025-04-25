# Manières d'utiliser Vue {#ways-of-using-vue}

Nous pensons qu'il n'existe pas de solution unique pour le web. C'est pourquoi Vue est conçu pour être flexible et facilement adoptable. Selon votre cas d'utilisation, Vue peut être utilisé de différentes manières pour trouver l'équilibre optimal entre la complexité de la stack, l'expérience de développement et les performances finales.

## Script autonome {#standalone-script}

Vue peut être utilisé comme un fichier de script autonome, sans outil de build nécessaire! Si vous avez déjà un framework backend qui rend la plupart de l'HTML ou si votre logique frontend n'est pas assez complexe pour justifier des outils de build, c'est la manière la plus facile d'intégrer Vue à votre stack. Vous pouvez considérer Vue comme un remplacement plus déclaratif de jQuery dans de tels cas.

Vue fournit également une distribution alternative appelée [petite-vue](https://github.com/vuejs/petite-vue) qui est spécifiquement optimisée pour améliorer progressivement l'HTML existant. Elle a un jeu de fonctionnalités plus restreint, mais est extrêmement légère et utilise une implémentation plus efficace dans les scénarios sans étape de build.

## Intégration des Web Components {#embedded-web-components}

Vous pouvez utiliser Vue pour [construire des composants personnalisés standards](/guide/extras/web-components) qui peuvent être intégrés dans n'importe quelle page HTML, quelle que soit la manière dont ils sont rendus. Cette option vous permet de tirer parti de Vue de manière complètement agnostique pour le consommateur: les web components résultants peuvent être intégrés dans des applications legacy, dans du HTML statique, ou même dans des applications construites avec d'autres frameworks.

## Application monopage (SPA) {#single-page-application-spa}

Certaines applications nécessitent une interactivité riche, une profondeur de session importante et une logique d'état soignée sur le frontend. La meilleure manière de construire de telles applications consiste à utiliser une architecture où Vue contrôle non seulement toutes les pages, mais gère également les mises à jour de données et la navigation sans avoir à recharger la page. Ce type d'application est généralement appelé une application monopage (SPA).

Vue fournit des bibliothèques de base et un [support d'outils exhaustif](/guide/scaling-up/tooling) avec une expérience de développeur incroyable pour construire des SPAs modernes, y compris :

- Routeur côté client
- Chaîne d'outils de build rapide
- Support IDE
- Outils de développement pour navigateur
- Intégrations TypeScript
- Utilitaires de test

Les SPAs nécessitent généralement que le backend expose une API, mais vous pouvez également associer Vue à des solutions telles que [Inertia.js](https://inertiajs.com) pour bénéficier des avantages d'une SPA tout en conservant un modèle de développement centré sur le serveur.

## Fullstack / SSR {#fullstack-ssr}

Les SPAs entièrement côté client posent problème lorsque l'application est sensible au SEO et au temps d'accès au contenu. Cela est dû au fait que le navigateur recevra une page HTML totalement vide et devra attendre que le JavaScript soit téléchargé avant de rendre quoi que ce soit.

Vue fournit des API de première classe pour "rendre" une application Vue en chaînes HTML sur le serveur. Cela permet au serveur de renvoyer de l'HTML déjà rendu, permettant aux utilisateurs finaux de voir immédiatement le contenu tandis que le JavaScript est en cours de téléchargement. Vue hydratera alors l'application côté client pour la rendre interactive. Cela s'appelle [Rendu côté serveur ou _Server-Side Rendering_ (SSR)](/guide/scaling-up/ssr) et améliore considérablement les métriques Core Web Vital telles que [Largest Contentful Paint (LCP)](https://web.dev/lcp/).

Il y a des frameworks basés sur Vue, par exemple [Nuxt](https://nuxt.com/), qui permettent de développer une application avec Vue et JavaScript.

## JAMStack / SSG {#jamstack-ssg}

Le rendu côté serveur peut être effectué à l'avance si les données requises sont statiques. Cela signifie que nous pouvons pré-rendre une application entière en HTML et les servir en tant que fichiers statiques. Cela améliore les performances du site et simplifie le déploiement, car nous n'avons plus besoin de rendre dynamiquement les pages à chaque requête. Vue peut toujours hydrater de telles applications pour fournir une interactivité riche côté client. Cette technique est communément appelée génération de site statique (SSG), également connue sous le nom de [JAMStack](https://jamstack.org/what-is-jamstack/).

Il existe deux types de SSG : monopage et multi-page. Les deux types pré-rendent le site en HTML statique, la différence étant que :

- Après le chargement initial de la page, une SSG à une seule page "hydrate" la page en une SPA. Cela nécessite un payload JS plus important et un coût d'hydratation plus élevé, mais les navigations ultérieures seront plus rapides, car il n'aura qu'à mettre à jour partiellement le contenu de la page au lieu de recharger toute la page.

- Une SSG à plusieurs pages charge une nouvelle page à chaque navigation. L'avantage est qu'elle peut livrer un JS minimal - ou pas du tout s'il n'y a pas besoin d'interaction ! Certains frameworks SSG à plusieurs pages, tels que [Astro](https://astro.build/) prennent également en charge une "hydratation partielle" - ce qui vous permet d'utiliser des composants Vue pour créer des "îlots" interactifs à l'intérieur de l'HTML statique.

Les SSG monopages conviennent mieux si vous attendez une interactivité non négligeable, des sessions profondes ou des éléments / états persistants à travers les navigations. Dans le cas contraire, une SSG à plusieurs pages serait un choix plus judicieux.

L'équipe Vue maintient également un générateur de site statique appelé [VitePress](https://vitepress.dev/), qui alimente le site web que vous êtes en train de lire en ce moment même! VitePress prend en charge les deux types de SSG. [Nuxt](https://nuxt.com/) prend également en charge le SSG. Vous pouvez même mélanger SSR et SSG pour différentes routes dans la même application Nuxt.

## Au-delà du web {#beyond-the-web}

Bien que Vue soit principalement conçu pour construire des applications Web, il n'est en aucun cas limité au navigateur. Vous pouvez :

- Construire des applications de bureau avec [Electron](https://www.electronjs.org/) ou [Wails](https://wails.io)
- Construire des applications mobiles avec [Ionic Vue](https://ionicframework.com/docs/vue/overview)
- Construire des applications de bureau et mobile à partir du même code avec [Quasar](https://quasar.dev/) ou [Tauri](https://tauri.app)
- Créez des expériences 3D WebGL avec [TresJS](https://tresjs.org/)
- Utiliser l'API de [rendu personnalisé](/api/custom-renderer) de Vue pour construire des rendus personnalisés comme ceux du [terminal](https://github.com/vue-terminal/vue-termui) !
