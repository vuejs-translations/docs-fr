# Foire aux questions {#frequently-asked-questions}

## Qui maintient Vue? {#who-maintains-vue}

Vue est un projet indépendant, piloté par la communauté. Il a été créé par [Evan You](https://twitter.com/youyuxi) en 2014 comme un projet personnel. Aujourd’hui, Vue est activement maintenu par [une équipe composée de membres à temps plein et de bénévoles du monde entier](/about/team), où Evan occupe le poste de chef de projet. Vous pouvez en apprendre davantage sur l'histoire de Vue dans ce [documentaire](https://www.youtube.com/watch?v=OrxmtDw4pVI).

Le développement de Vue est principalement financé par des sponsors et nous sommes financièrement viables depuis 2016. Si vous ou votre entreprise bénéficiez de Vue, envisagez de [nous sponsoriser](/sponsor/) pour soutenir son développement !

## Quelles sont les différences entre Vue 2 et Vue 3? {#what-s-the-difference-between-vue-2-and-vue-3}

Vue 3 est la dernière version majeure de Vue. Elle contient de nouvelles fonctionnalités qui ne sont pas présentes dans Vue 2, comme Teleport, Suspense, et la possibilité de combiner plusieurs éléments racines par template. Elle contient également des changements importants qui la rendent incompatible avec Vue 2. Tous les détails sont documentés dans le [Guide de migration vers Vue 3](https://v3-migration.vuejs.org/).

Malgré les différences, la majorité des API de Vue sont partagées entre les deux versions majeures, donc la plupart de vos connaissances de Vue 2 continueront à fonctionner dans Vue 3. Notamment, la Composition API était à l'origine une fonctionnalité réservée à Vue 3, mais elle a été intégrée à Vue 2 de façon rétroactive et est disponible avec [Vue 2.7](https://github.com/vuejs/vue/blob/main/CHANGELOG.md#270-2022-07-01).

En général, Vue 3 offre des paquets plus petits, de meilleures performances, une meilleure évolutivité et une meilleure prise en charge de TypeScript / intégration avec l'environnement de développement. Si vous démarrez un nouveau projet, Vue 3 est recommandé. Il n'y a que quelques raisons pour lesquelles vous pourriez considérer d'utiliser Vue 2 :

- Vous devez prendre en charge IE11. Vue 3 exploite les fonctionnalités JavaScript modernes et ne prend pas en charge IE11.

## Est-ce que Vue 2 est toujours maintenu ? {#is-vue-2-still-supported}

Si vous avez l'intention de migrer une application Vue 2 existante vers Vue 3, consultez le [guide de migration](https://v3-migration.vuejs.org/).

Vue 2.7, qui a été publiée en juillet 2022, est la dernière version mineure de Vue 2. Vue 2 est maintenant entré en mode maintenance : de nouvelles fonctionnalités ne seront plus publiées, mais Vue 2 continuera à recevoir des corrections de bugs critiques et des mises à jour de sécurité pendant 18 mois à partir de la date de sortie de la version 2.7. Cela signifie que **Vue 2 a atteint sa fin de vie le 31 décembre 2023**.

Nous pensons que cela devrait laisser suffisamment de temps à la majeure partie de l'écosystème pour migrer vers Vue 3. Cependant, nous comprenons également que certaines équipes ou certains projets ne peuvent pas effectuer la mise à niveau dans ce délai tout en devant répondre aux exigences de sécurité et de conformité. Nous nous associons à des experts du secteur pour fournir un support étendu pour Vue 2 aux équipes ayant de tels besoins. Si votre équipe prévoit d'utiliser Vue 2 au-delà de la fin de l'année 2023, assurez-vous d'anticiper et d'en savoir plus sur [Vue 2 Extended LTS](https://v2.vuejs.org/lts/).

## Sous quelle licence Vue est publié ? {#what-license-does-vue-use}

Vue est un projet libre et open source publié sous la [Licence MIT](https://opensource.org/licenses/MIT).

## Quels navigateurs supporte Vue ? {#what-browsers-does-vue-support}

La dernière version de Vue (3.x) ne prend en charge que les [navigateurs avec support ES2016 natif](https://caniuse.com/es2016). Cela exclut IE11. Vue 3.x utilise des fonctionnalités ES2016 qui ne peuvent pas recevoir de polyfills dans les anciens navigateurs, donc si vous avez besoin de prendre en charge les anciens navigateurs, vous devrez utiliser Vue 2.x à la place.

## Est-ce que Vue est fiable ? {#is-vue-reliable}

Vue est un framework mature et éprouvé. C'est l'un des frameworks JavaScript les plus utilisés en production aujourd’hui, avec plus de 1,5 million d'utilisateurs dans le monde, et il est téléchargé près de 10 millions de fois par mois sur npm.

Vue est utilisé en production par des organisations renommées dans le monde entier, notamment la Wikimedia Foundation, la NASA, Apple, Google, Microsoft, GitLab, Zoom, Tencent, Weibo, Bilibili, Kuaishou, et bien d'autres encore.

## Est-ce que Vue est rapide ? {#is-vue-fast}

Vue 3 est l'un des frameworks frontend grand public les plus performants, et gère la plupart des cas d'utilisation des applications web avec facilité, sans nécessiter d'optimisations manuelles.

Dans les scénarios de test de stress, Vue surpasse React et Angular avec une marge décente dans le [js-framework-benchmark](https://krausest.github.io/js-framework-benchmark/current.html). Il est également au coude à coude avec certains des frameworks sans DOM virtuel les plus rapides du benchmark.

Notez que les benchmarks synthétiques comme ceux présentés ci-dessus se concentrent sur les performances de rendu brutes avec des optimisations dédiées et peuvent ne pas être totalement représentatifs des résultats de performance du monde réel. Si vous vous intéressez davantage aux performances de chargement des pages, vous pouvez vérifier ce qui est avancé sur ce site à l'aide de [WebPageTest](https://www.webpagetest.org/lighthouse) ou de [PageSpeed Insights](https://pagespeed.web.dev/). Ce site est propulsé par Vue lui-même, avec un pré-rendu SSG, une hydratation complète de la page et une navigation côté client SPA. Il obtient un score de 100 en termes de performances sur un Moto G4 émulé avec une accélération du processeur de 4x sur des réseaux 4G lents.

Vous pouvez en savoir plus sur la façon dont Vue optimise automatiquement les performances d'exécution dans la section [Mécanismes de rendu](/guide/extras/rendering-mechanism), et sur la façon d'optimiser une application Vue dans des cas particulièrement exigeants dans le [Guide sur l'optimisation des performances](/guide/best-practices/performance).

## Est-ce que Vue est léger ? {#is-vue-lightweight}

Lorsque vous utilisez un outil de build, de nombreuses API de Vue peuvent être ["retirées de l'arbre"](https://developer.mozilla.org/fr/docs/Glossary/Tree_shaking). Par exemple, si vous n'utilisez pas le composant natif `<Transition>`, il ne sera pas inclus dans le paquet de production final.

Une application Vue "hello world" qui n'utilise que les API absolument nécessaires a une taille de base d'environ **16 Ko** seulement, après minification et compression Brotli. La taille réelle de l'application dépendra du nombre de fonctionnalités optionnelles que vous utilisez dans le framework. Dans le cas improbable où une application utilise toutes les fonctionnalités de Vue, la taille totale lors de l'exécution sera d'environ **27 Ko**.

Lorsque Vue est utilisé sans outil de build, non seulement nous perdons la possibilité d'alléger l'arbre, mais nous devons également envoyer le compilateur de templates au navigateur. Cela fait gonfler la taille à environ **41 Ko**. Par conséquent, si vous utilisez Vue principalement pour l'amélioration progressive sans outil de build, envisagez d'utiliser [petite-vue](https://github.com/vuejs/petite-vue) (seulement **6 Ko**) à la place.

Certains frameworks, comme Svelte, utilisent une stratégie de compilation qui produit un résultat extrêmement léger dans les scénarios à un seul composant. Cependant, [notre recherche](https://github.com/yyx990803/vue-svelte-size-analysis) montre que la différence de taille dépend fortement du nombre de composants dans l'application. Bien que Vue ait une taille de base plus importante, il génère moins de code par composant. Dans les scénarios réels, une application Vue peut très bien finir par être plus légère.

## Est-ce que Vue est scalable ? {#does-vue-scale}

Oui. Bien que l'on pense souvent à tort que Vue ne convient qu'aux cas d'utilisation simples, Vue est parfaitement capable de gérer des applications à grande échelle :

- Les [composants monofichiers](/guide/scaling-up/sfc) fournissent un modèle de développement modulaire qui permet de développer différentes parties d'une application de manière isolée.

- La [Composition API](/guide/reusability/composables) offre une intégration TypeScript de qualité et permet de créer des modèles propres pour organiser, extraire et réutiliser une logique complexe.

- [Le support complet des outils](/guide/scaling-up/tooling) garantit une expérience de développement fluide au fur et à mesure que l'application se développe.

- Une barrière à l'entrée moins élevée et une excellente documentation se traduisent par une intégration et une formation des nouveaux développeurs facilitées.

## Comment puis-je contribuer à Vue ? {#how-do-i-contribute-to-vue}

Merci pour votre intérêt ! Veuillez consulter notre [Guide de la communauté](/about/community-guide).

## Devrais-je plutôt utiliser l'Options API ou la Composition API ? {#should-i-use-options-api-or-composition-api}

Si vous ne connaissez pas Vue, nous vous proposons une comparaison de haut niveau entre les deux styles [ici](/guide/introduction#which-to-choose).

Si vous avez déjà utilisé l'Options API et que vous envisagez actuellement d'utiliser la Composition API, consultez [cette FAQ](/guide/extras/composition-api-faq).

## Devrais-je plutôt utiliser JavaScript ou TypeScript avec Vue ? {#should-i-use-javascript-or-typescript-with-vue}

Bien que Vue lui-même soit implémenté en TypeScript et fournisse une prise en charge de TypeScript de qualité, nous n'encourageons pas particulièrement l'utilisation de TypeScript ou de JavaScript.

La prise en charge de TypeScript est une considération importante lorsque de nouvelles fonctionnalités sont ajoutées à Vue. Les API conçues avec TypeScript en tête sont généralement plus faciles à comprendre pour les environnement de développement et les linters, même si vous n'utilisez pas TypeScript vous-même. Tout le monde y gagne. Les API de Vue sont également conçues pour fonctionner de la même manière en JavaScript et en TypeScript dans la mesure du possible.

L'adoption de TypeScript implique un compromis entre la complexité de l'intégration et les gains de maintenabilité à long terme. La justification d'un tel compromis peut varier en fonction des antécédents de votre équipe et de l'ampleur du projet, mais Vue n'est pas vraiment un facteur d'influence pour prendre cette décision.

## Comment Vue se compare-t-il aux Web Components ? {#how-does-vue-compare-to-web-components}

Vue a été créé avant que les Web Components ne soient disponibles de manière native, et certains aspects de la conception de Vue (par exemple, les slots) ont été inspirés par le modèle des Web Components.

Les spécifications des Web Components sont de relativement bas niveau, car elles sont centrées sur la définition d'éléments personnalisés. En tant que framework, Vue répond à des préoccupations supplémentaires de plus haut niveau, telles que le rendu efficace du DOM, la gestion réactive de l'état, les outils, le routage côté client et le rendu côté serveur.

Vue prend également en charge la consommation ou l'exportation vers des éléments personnalisés natifs. Consultez le [guide sur Vue et les Web Components](/guide/extras/web-components) pour plus de détails.

<!-- ## TODO How does Vue compare to React? -->

<!-- ## TODO How does Vue compare to Angular? -->
