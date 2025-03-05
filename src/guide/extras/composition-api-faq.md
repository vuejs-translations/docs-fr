---
outline: deep
---

# FAQ sur la Composition API {#composition-api-faq}

:::tip
Cette FAQ part du principe que avez déjà une expérience avec Vue - en particulier, une expérience avec Vue 2, en utilisant principalement l'Options API.
:::

## Qu'est-ce que la Composition API ? {#what-is-composition-api}

<VueSchoolLink href="https://vueschool.io/lessons/introduction-to-the-vue-js-3-composition-api" title="Cours gratuit sur la Composition API"/>

La Composition API est un ensemble d'API qui nous permet de créer des composants Vue en utilisant des fonctions importées au lieu de déclarer des options. Il s'agit d'un terme générique rassemblant les API suivantes :

- [API de la réactivité](/api/reactivity-core), par exemple `ref()` et `reactive()`, qui nous permettent de créer directement un état réactif, un état calculé et des observateurs.

- [Les hooks du cycle de vie ](/api/composition-api-lifecycle), par exemple `onMounted()` et `onUnmounted()`, qui nous permettent de nous implanter dans le cycle de vie du composant.

- [Injection de dépendances](/api/composition-api-dependency-injection), c'est-à-dire `provide()` et `inject()`, qui nous permettent de tirer parti du système d'injection de dépendances de Vue tout en utilisant les API de la Réactivité.

La Composition API est une fonctionnalité intégrée de Vue 3 et [Vue 2.7](https://blog.vuejs.org/posts/vue-2-7-naruto.html). Pour les anciennes versions de Vue 2, utilisez le plugin [`@vue/composition-api`](https://github.com/vuejs/composition-api) maintenu par l'équipe officielle. Dans Vue 3, elle est principalement utilisée avec la syntaxe [`<script setup>`](/api/sfc-script-setup) dans les composants monofichiers. Voici un exemple de base d'un composant utilisant la Composition API :

```vue
<script setup>
import { ref, onMounted } from 'vue'

// état réactif
const count = ref(0)

// fonctions mutant l'état et déclenchant des mises à jour
function increment() {
  count.value++
}

// hooks du cycle de vie
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

Malgré un style d'API basé sur la composition de fonctions, **la Composition API n'est PAS de la programmation fonctionnelle**. La Composition API est basée sur le paradigme de réactivité mutable et à grain fin de Vue, alors que la programmation fonctionnelle met l'accent sur l'immuabilité.

Si vous souhaitez apprendre à utiliser Vue avec la Composition API, vous pouvez définir la préférence API pour l'ensemble du site sur la Composition API à l'aide du bouton situé en haut de la barre latérale gauche, puis parcourir le guide depuis le début.

## Pourquoi la Composition API? {#why-composition-api}

### Une meilleure réutilisation de la logique {#better-logic-reuse}

Le principal avantage de la Composition API est qu'elle permet une réutilisation de la logique propre et efficace via des [fonctions composables](/guide/reusability/composables). Elle résout [tous les inconvénients des mixins](/guide/reusability/composables#vs-mixins), le principal mécanisme de réutilisation de la logique pour l'Options API.

La capacité de réutilisation de la logique de la Composition API a donné naissance à d'impressionnants projets communautaires tels que [VueUse](https://vueuse.org/), une collection toujours plus grande d'utilitaires composables. Elle sert également de mécanisme propre pour intégrer facilement des services ou des bibliothèques tiers possédant un état dans le système de réactivité de Vue, par exemple des [données persistantes](/guide/extras/reactivity-in-depth#immutable-data), [des machines d'état](/guide/extras/reactivity-in-depth#state-machines) et [RxJS](/guide/extras/reactivity-in-depth#rxjs).

### Une organisation du code plus flexible {#more-flexible-code-organization}

De nombreux utilisateurs apprécient le fait que nous écrivions du code qui est organisé par défaut avec l'Options API : chaque élément a sa place en fonction de l'option dont il relève. Cependant, l'Options API présente de sérieuses limitations lorsque la logique d'un seul composant dépasse un certain seuil de complexité. Cette limitation est particulièrement importante pour les composants qui doivent gérer de multiples **préoccupations logiques**, ce dont nous avons été les témoins directs dans de nombreuses applications Vue 2 en production.

Prenons l'exemple du composant explorateur de dossiers de l'interface graphique de Vue CLI : ce composant entraîne les préoccupations logiques suivantes :

- Traque de l'état actuel du dossier et affichage de son contenu
- Gestion de la navigation dans les dossiers (ouverture, fermeture, rafraîchissement...)
- Gestion de la création de nouveaux dossiers
- N'afficher seulement que les dossiers favoris
- Afficher les dossiers cachés
- Gestion des modifications du répertoire de travail actuel

La [version originale](https://github.com/vuejs/vue-cli/blob/a09407dd5b9f18ace7501ddb603b95e31d6d93c0/packages/@vue/cli-ui/src/components/folder/FolderExplorer.vue#L198-L404) du composant a été écrite en Options API. Si nous donnons à chaque ligne de code une couleur basée sur la préoccupation logique qu'elle entraîne, voici à quoi cela ressemble :

<img alt="folder component before" src="./images/options-api.png" width="129" height="500" style="margin: 1.2em auto">

Remarquez comment le code s'occupant de la même préoccupation logique est obligé d'être divisé via différentes options, situées dans différentes parties du fichier. Dans un composant de plusieurs centaines de lignes, comprendre et naviguer dans une seule préoccupation logique nécessite de faire constamment défiler le fichier de haut en bas, ce qui rend la tâche beaucoup plus difficile qu'elle ne devrait l'être. En outre, si nous avons l'intention d'extraire une préoccupation logique dans un utilitaire réutilisable, il faut beaucoup de travail pour trouver et extraire les bons morceaux de code à partir de différentes parties du fichier.

Voici le même composant, avant et après la [refactorisation en Composition API](https://gist.github.com/yyx990803/8854f8f6a97631576c14b63c8acd8f2e) :

![folder component after](./images/composition-api-after.png)

Remarquez comment le code lié à la même préoccupation logique peut maintenant être regroupé : nous n'avons plus besoin de passer d'un bloc d'options à un autre lorsque nous travaillons sur une préoccupation logique spécifique. De plus, nous pouvons maintenant déplacer un groupe de code dans un fichier externe avec un effort moindre, puisque nous n'avons plus besoin de mélanger le code pour l'extraire. Cette réduction de la friction pour le remaniement est essentielle à la maintenabilité à long terme des grandes bases de code.

### Une meilleure inférence de type {#better-type-inference}

Ces dernières années, de plus en plus de développeurs frontend adoptent [TypeScript](https://www.typescriptlang.org/) car il nous aide à écrire un code plus robuste, à effectuer des modifications avec plus de confiance et à offrir une excellente expérience de développement grâce au support des environnements de développement. Cependant, l'Options API, a été initialement conçue en 2013 sans inférence de type. Nous avons dû mettre en œuvre une [gymnastique de type absurdement complexe](https://github.com/vuejs/core/blob/44b95276f5c086e1d88fa3c686a5f39eb5bb7821/packages/runtime-core/src/componentPublicInstance.ts#L132-L165) pour que l'inférence de type fonctionne avec l'Options API. Même avec tous ces efforts, l'inférence de type pour l'Options API peut encore causer des problèmes lors de l'utilisation des mixins et des injections de dépendances.

Cela avait conduit de nombreux développeurs qui voulaient utiliser Vue avec TS à se pencher sur l'API de classe alimentée par `vue-class-component`. Cependant, une API basée sur les classes s'appuie fortement sur les décorateurs ES, une fonctionnalité du langage qui n'était qu'une proposition de stade 2 lorsque Vue 3 était en cours de développement en 2019. Nous avons estimé qu'il était trop risqué de baser une API officielle sur une proposition instable. Depuis lors, la proposition de décorateurs a subi une autre révision complète, pour finalement atteindre le stade 3 en 2022. En outre, l'API basée sur les classes souffre de limitations de réutilisation de la logique et d'organisation similaires à celles de l'Options API.

À titre de comparaison, la Composition API utilise principalement des variables et des fonctions simples, qui sont naturellement adaptées aux types. Le code écrit dans la Composition API peut bénéficier d'une inférence de type complète, avec un faible besoin d'utiliser des indications de type manuelles. La plupart du temps, le code de la Composition API aura une apparence similaire en TypeScript et en JavaScript. Cela permet également aux utilisateurs de JavaScript ordinaire de bénéficier d'une inférence de type partielle.

### Un paquet de production réduit {#smaller-production-bundle-and-less-overhead}

Le code écrit en Composition API et `<script setup>` est également plus efficace et plus facile à compresser que son équivalent en Options API. En effet, le template d'un composant `<script setup>` est compilé en une fonction dans le même scope que le code `<script setup>`. Contrairement à l'accès aux propriétés à partir de `this`, le code du template compilé peut accéder directement aux variables déclarées à l'intérieur de `<script setup>`, sans proxy d'instance entre les deux. Cela conduit également à une meilleure compression, car tous les noms de variables peuvent être raccourcis en toute sécurité.

## Relations avec l'Options API {#relationship-with-options-api}

### Compromis {#trade-offs}

Certains utilisateurs passant de l'Options API à la Composition API ont trouvé leur code moins bien organisé, et en ont conclu que la Composition API était "moins bien" en termes d'organisation du code. Nous recommandons aux utilisateurs ayant une telle opinion de considérer ce problème sous un angle différent.

Il est vrai que la Composition API ne fournit plus les "garde-fous" qui vous guident pour placer votre code dans les emplacements adaptés. En contrepartie, vous pouvez écrire du code de composant comme vous le feriez avec du JavaScript normal. Cela signifie que **vous pouvez et devez appliquer toutes les meilleures pratiques d'organisation du code à votre code Composition API comme vous le feriez pour écrire du JavaScript normal**. Si vous pouvez écrire du JavaScript bien organisé, vous devriez également être en mesure d'écrire du code de même facture en Composition API.

L'Options API vous permet de "moins réfléchir" lorsque vous écrivez du code de composant, ce qui explique pourquoi de nombreux utilisateurs l'adorent. Toutefois, en réduisant la charge mentale, elle vous enferme également dans le modèle d'organisation du code prescrit sans échappatoire, ce qui peut rendre difficile la refactorisation ou l'amélioration de la qualité du code dans les projets à grande échelle. À cet égard, la Composition API offre une meilleure évolutivité à long terme.

### Est-ce que la Composition API couvre tous les cas d'utilisation ? {#does-composition-api-cover-all-use-cases}

Oui, en termes de logique avec état. Lorsque vous utilisez la Composition API, seules quelques options peuvent encore être nécessaires : `props`, `emits`, `name`, et `inheritAttrs`.

:::tip

Depuis la version 3.3, vous pouvez directement utiliser `defineOptions` dans `<script setup>` pour définir le nom du composant ou la propriété `inheritAttrs`

:::

Si vous avez l'intention d'utiliser exclusivement la Composition API (ainsi que les options énumérées ci-dessus), vous pouvez réduire de quelques kilobits votre paquet de production grâce à un [flag de compilation](/api/compile-time-flags) qui supprime le code lié à l'Options API de Vue. Notez que cela affecte également les composants Vue dans vos dépendances.

### Puis-je utiliser les deux API simultanément ? {#can-i-use-both-apis-together}

Oui. Vous pouvez utiliser la Composition API via l'option [`setup()`](/api/composition-api-setup) dans un composant en Options API.

Toutefois, nous vous recommandons de le faire que si vous disposez d'une base de code existante en Options API qui doit s'intégrer à de nouvelles fonctionnalités / bibliothèques externes écrites avec la Composition API.

### L'Options API va-t-elle être dépréciée ? {#will-options-api-be-deprecated}

Non, nous n'avons pas l'intention de le faire. L'Options API fait partie intégrante de Vue et c'est la raison pour laquelle de nombreux développeurs l'apprécient. Nous sommes également conscients que de nombreux avantages de la Composition API ne se manifestent que dans les projets à grande échelle, et l'Options API reste un choix solide pour de nombreux scénarios de complexité faible à moyenne.

## Relations avec la Class API {#relationship-with-class-api}

Nous ne recommandons plus l'utilisation de la Class API avec Vue 3, étant donné que la Composition API offre une excellente intégration de TypeScript avec des avantages supplémentaires en matière de réutilisation de la logique et d'organisation du code.

## Comparaison avec les hooks de React {#comparison-with-react-hooks}

La Composition API offre le même niveau de capacités de composition logique que les hooks de React, mais avec quelques différences importantes.

Les hooks React sont invoqués de manière répétée à chaque fois qu'un composant se met à jour. Cela crée un certain nombre de réserves qui peuvent dérouter même les développeurs React chevronnés. Cela conduit également à des problèmes d'optimisation des performances qui peuvent gravement affecter l'expérience de développement. Voici quelques exemples :

- Les hooks sont appelés dans un certain ordre et ne peuvent pas être conditionnels.

- Les variables déclarées dans un composant React peuvent être interceptées par un hook et devenir "périmées" si le développeur ne transmet pas correctement le tableau de dépendances. Cela conduit les développeurs React à s'appuyer sur les règles ESLint pour s'assurer que les dépendances correctes sont transmises. Cependant, la règle n'est souvent pas assez intelligente et sur-compense l'exactitude, ce qui entraîne une invalidation inutile et des maux de tête lorsque des cas limites sont rencontrées.

- Les calculs coûteux requièrent l'utilisation de `useMemo`, qui nécessite à nouveau de passer manuellement le bon tableau de dépendances.

- Les gestionnaires d'événements passés aux composants enfants provoquent par défaut des mises à jour inutiles des enfants, et nécessitent l'utilisation explicite de `useCallback` pour optimiser. Cela est presque toujours nécessaire, et nécessite à nouveau un tableau de dépendances correct. Négliger cela conduit à sur-rendre les applications par défaut et peut causer des problèmes de performance sans que l'on s'en rende compte.

- Le problème des fermetures périmées, combiné aux fonctionnalités concurrentes, rend difficile de repérer le moment où un morceau de code d'un hook est exécuté, et rend difficile de travailler avec un état mutable qui devrait persister à travers les rendus (via `useRef`).

> Note: certains des problèmes mentionnés ci-dessus liés à la mémoïsation peuvent être résolus par le prochain système de mémoïsation [React Compiler](https://react.dev/learn/react-compiler).

En comparaison, la Composition API de Vue :

- Appelle le code de `setup()` ou de `<script setup>` une seule fois. Cela permet au code de mieux s'aligner avec les intuitions d'une utilisation idiomatique de JavaScript, car il n'y a pas de fermetures périmées à craindre. Les appels de la Composition API ne sont pas non plus dans un ordre figé et peuvent être conditionnels.

- Le système de réactivité à l'exécution de Vue collecte automatiquement les dépendances réactives utilisées dans les propriétés calculées et les observateurs, de sorte qu'il n'est pas nécessaire de déclarer manuellement les dépendances.

- Il n'est pas nécessaire de mettre manuellement en cache les fonctions de rappel pour éviter les mises à jour inutiles des enfants. En général, le système de réactivité à grain fin de Vue garantit que les composants enfants ne sont mis à jour que lorsqu'ils en ont besoin. L'optimisation manuelle des mises à jour des enfants est rarement une préoccupation pour les développeurs Vue.

Nous reconnaissons la créativité des hooks de React, et c'est une source d'inspiration majeure pour la Composition API. Cependant, les problèmes mentionnés ci-dessus existent dans leur conception et nous avons remarqué que le modèle de réactivité de Vue fournit un moyen de les contourner.
