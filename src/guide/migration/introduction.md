# Introduction

::: info
Vous ne connaissez pas Vue.js ? Consultez notre [Guide des fondamentaux](/guide/introduction.html) pour commencer.
:::

Ce guide s'adresse principalement aux utilisateurs ayant déjà une expérience de Vue 2 et qui souhaitent se familiariser avec les nouvelles fonctionnalités et les changements de Vue 3. **Il ne s'agit pas d'un document que vous devez lire de bout en bout avant d'essayer Vue 3.** Bien qu'il semble que beaucoup de choses aient changé, une grande partie de ce que vous connaissez et aimez de Vue est toujours la même ; mais nous avons voulu être aussi minutieux que possible et fournir des explications détaillées et des exemples pour chaque changement documenté.

- [Démarrage rapide](#quickstart)
- [Nouvelles fonctionnalités notables](#notable-new-features)
- [Breaking Changes](#breaking-changes)
- [Supporting Libraries](#supporting-libraries)

## Overview

<br>
<iframe src="https://player.vimeo.com/video/440868720" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

Commencez à apprendre Vue 3 à [Vue Mastery](https://www.vuemastery.com/courses-path/vue3).

## Démarrage rapide

- Via CDN : `<script src="https://unpkg.com/vue@next"></script>`
- Terrain de jeu dans le navigateur sur [Codepen](https://codepen.io/yyx990803/pen/OJNoaZL)
- Sandbox dans le navigateur sur [CodeSandbox](https://v3.vue.new)
- Échafaudage via [Vite](https://github.com/vitejs/vite) :

  ```bash
  npm init vite-app hello-vue3 # OR yarn create vite-app hello-vue3
  ```

- Scaffold via [vue-cli](https://cli.vuejs.org/):

  ```bash
  npm install -g @vue/cli # OR yarn global add @vue/cli
  vue create hello-vue3
  # select vue 3 preset
  ```

## Nouvelles fonctionnalités notables

Voici quelques-unes des nouvelles fonctionnalités à surveiller dans Vue 3 :

- [Composition API](/guide/composition-api-introduction.html)
- [Teleport](/guide/teleport.html)
- [Fragments](/guide/migration/fragments.html)
- [Option d'émission de composants](/guide/component-custom-events.html)
- [`createRenderer` API from `@vue/runtime-core`](https://github.com/vuejs/vue-next/tree/master/packages/runtime-core) to create custom renderers
- [SFC Composition API Syntax Sugar (`<script setup>`)](https://github.com/vuejs/rfcs/blob/sfc-improvements/active-rfcs/0000-sfc-script-setup.md) <Badge text="experimental" type="warning" />
- [SFC State-driven CSS Variables (`<style vars>`)](https://github.com/vuejs/rfcs/blob/sfc-improvements/active-rfcs/0000-sfc-style-variables.md) <Badge text="experimental" type="warning" />
- [SFC `<style scoped>` can now include global rules or rules that target only slotted content](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0023-scoped-styles-changes.md)

## Breaking Changes

::: info INFO
Nous travaillons toujours sur une version de migration dédiée de Vue 3 avec un comportement compatible avec Vue 2 et des avertissements d'utilisation incompatible. Si vous envisagez de migrer une application Vue 2 non triviale, nous vous recommandons fortement d'attendre la Migration Build pour une expérience plus fluide.
:::

Ce qui suit consiste en une liste de changements de rupture par rapport à la version 2.x :

### API globale

- [L'API Vue globale a été modifiée pour utiliser une instance d'application](/guide/migration/global-api.html)
- [Les API globales et internes ont été restructurées afin d'être modifiables par arborescence](/guide/migration/global-api-treeshaking.html)

### Directives pour les templates

- [L'utilisation de `v-model` sur les composants a été retravaillée, remplaçant `v-bind.sync`](/guide/migration/v-model.html)
- [L'utilisation de `key` sur les noeuds `<template v-for>` et non-`v-for` a été modifiée](/guide/migration/key-attribute.html)
- [La préséance de `v-if` et `v-for` lorsqu'ils sont utilisés sur le même élément a été modifiée](/guide/migration/v-if-v-for.html)
- [`v-bind="object"` est maintenant sensible à l'ordre](/guide/migration/v-bind.html)
- [Le modificateur `v-on:event.native` a été supprimé](./v-on-native-modifier-removed.md)
- [`ref` dans `v-for` n'enregistre plus un tableau de refs](/guide/migration/array-refs.html)

### Les Composants

- [Les composants fonctionnels ne peuvent être créés qu'à l'aide d'une fonction simple](/guide/migration/functional-components.html)
- [L'attribut `functional` du composant à fichier unique (SFC) `<template>` et l'option de composant `functional` sont obsolètes](/guide/migration/functional-components.html)
- [Les composants asynchrones nécessitent désormais la méthode `defineAsyncComponent` pour être créés](/guide/migration/async-components.html)
- [Les événements des composants doivent maintenant être déclarés avec l'option `emits`](./emits-option.md)

### Fonction de rendu

- [L'API de la fonction de rendu a été modifiée](/guide/migration/render-function-api.html)
- [La propriété `$scopedSlots` est supprimée et tous les slots sont exposés via `$slots` en tant que fonctions](/guide/migration/slots-unification.html)
- [`$listeners` a été supprimé / fusionné dans `$attrs`](./listeners-removed)
- [`$attrs` inclut maintenant les attributs `class` et `style`](./attrs-includes-class-style.md)

### Éléments personnalisés

- [La mise en liste blanche des éléments personnalisés est maintenant effectuée pendant la compilation du modèle](/guide/migration/custom-elements-interop.html)
- [L'utilisation de l'accessoire spécial `is` est limitée à la balise réservée `<component>`](/guide/migration/custom-elements-interop.html#customized-built-in-elements)

### Autres changements mineurs

- L'option de cycle de vie `destroyed` a été renommée en `unmounted`.
- L'option de cycle de vie `beforeDestroy` a été renommée en `beforeUnmount`.
- [La fonction de fabrique des props `default` n'a plus accès au contexte `this`](/guide/migration/props-default-this.html)
- [L'API des directives personnalisées a été modifiée pour s'aligner sur le cycle de vie des composants](/guide/migration/custom-directives.html)
- L'option `data` doit toujours être déclarée comme une fonction](/guide/migration/data-option.html)
- [L'option `data` des mixins est maintenant fusionnée de manière superficielle](/guide/migration/data-option.html#mixin-merge-behavior-change)
- [La stratégie de coercition des attributs a été modifiée](/guide/migration/attribute-coercion.html)
- [Certaines classes de transition ont été renommées](/guide/migration/transition.html)
- [`<TransitionGroup>` ne rend plus d'élément wrapper par défaut](/guide/migration/transition-group.html)
- [Lorsque l'on surveille un tableau, la callback ne se déclenche que lorsque le tableau est remplacé. Si vous avez besoin de déclencher une mutation, l'option `deep` doit être spécifiée](/guide/migration/watch.html)
- Les balises `<template>` sans directives spéciales (`v-if/else-if/else`, `v-for`, ou `v-slot`) sont maintenant traitées comme des éléments ordinaires et donneront lieu à un élément `<template>` natif au lieu de rendre son contenu interne.
- Dans Vue 2.x, le `outerHTML` du conteneur racine de l'application est remplacé par le modèle du composant racine (ou éventuellement compilé en modèle, si le composant racine n'a pas d'option de modèle/rendu). Vue 3.x utilise maintenant le `innerHTML` du conteneur de l'application à la place - cela signifie que le conteneur lui-même n'est plus considéré comme faisant partie du modèle.

### APIs supprimées

- [Support du `keyCode` en tant que modificateurs `v-on`](/guide/migration/keycode-modifiers.html)
- [Méthodes d'instance $on, $off et $once](/guide/migration/events-api.html)
- [Filtres](/guide/migration/filtres.html)
- [Attributs des modèles en ligne](/guide/migration/inline-template-attribute.html)
- [Propriété d'instance `$children`](/guide/migration/children.md)
- Méthode d'instance `$destroy`. Les utilisateurs ne doivent plus gérer manuellement le cycle de vie des composants Vue individuels.

## Bibliothèques supportées

Toutes nos bibliothèques et tous nos outils officiels prennent désormais en charge Vue 3, mais la plupart d'entre eux sont encore en version bêta et distribués sous la balise `next` dist sur npm. **Nous prévoyons de stabiliser et de basculer tous les projets pour utiliser la balise dist `latest` d'ici la fin de 2020.

### Vue CLI

<a href="https://www.npmjs.com/package/@vue/cli" target="_blank" noopener noreferrer><img src="https://img.shields.io/npm/v/@vue/cli"></a>

Depuis la version 4.5.0, `vue-cli` fournit maintenant l'option intégrée de choisir Vue 3 lors de la création d'un nouveau projet. Vous pouvez mettre à jour `vue-cli` et exécuter `vue create` pour créer un projet Vue 3 dès aujourd'hui.

- [Documentation](https://cli.vuejs.org/)
- [GitHub](https://github.com/vuejs/vue-cli)

### Vue Router

<a href="https://www.npmjs.com/package/vue-router/v/next" target="_blank" noopener noreferrer><img src="https://img.shields.io/npm/v/vue-router/next.svg"></a>

Vue Router 4.0 prend en charge Vue 3 et apporte un certain nombre de modifications importantes. Consultez son [guide de migration](https://next.router.vuejs.org/guide/migration/) pour plus de détails.

- [Documentation](https://next.router.vuejs.org/)
- [GitHub](https://github.com/vuejs/vue-router-next)
- [RFCs](https://github.com/vuejs/rfcs/pulls?q=is%3Apr+is%3Amerged+label%3Arouter)

### Vuex

<a href="https://www.npmjs.com/package/vuex/v/next" target="_blank" noopener noreferrer><img src="https://img.shields.io/npm/v/vuex/next.svg"></a>

Vuex 4.0 assure la prise en charge de Vue 3 avec une API largement identique à celle de la version 3.x. La seule modification importante concerne [l'installation du plugin](https://next.vuex.vuejs.org/guide/migrating-to-4-0-from-3-x.html#breaking-changes).

- [Documentation](https://next.vuex.vuejs.org/)
- [GitHub](https://github.com/vuejs/vuex/tree/4.0)

### Extension des Devtools

Nous travaillons sur une nouvelle version des Devtools avec une nouvelle interface utilisateur et des composants internes remaniés pour supporter plusieurs versions de Vue. La nouvelle version est actuellement en bêta et ne supporte que Vue 3 (pour l'instant). L'intégration de Vuex et Router est également en cours.

- Pour Chrome : [Installer à partir du magasin Web de Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg?hl=en)

  - Remarque : le canal bêta peut entrer en conflit avec la version stable de devtools. Vous devrez peut-être désactiver temporairement la version stable pour que le canal bêta fonctionne correctement.

- Pour Firefox : [Télécharger l'extension signée](https://github.com/vuejs/vue-devtools/releases/tag/v6.0.0-beta.2) (fichier `.xpi` sous Assets)

### IDE Support

Il est recommandé d'utiliser [VSCode](https://code.visualstudio.com/) avec notre extension officielle [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), qui fournit un support IDE complet pour Vue 3.

### Other Projects

| Project               | npm                           | Repo                 |
| --------------------- | ----------------------------- | -------------------- |
| @vue/babel-plugin-jsx | [![rc][jsx-badge]][jsx-npm]   | [[GitHub][jsx-code]] |
| eslint-plugin-vue     | [![ga][epv-badge]][epv-npm]   | [[GitHub][epv-code]] |
| @vue/test-utils       | [![beta][vtu-badge]][vtu-npm] | [[GitHub][vtu-code]] |
| vue-class-component   | [![beta][vcc-badge]][vcc-npm] | [[GitHub][vcc-code]] |
| vue-loader            | [![rc][vl-badge]][vl-npm]     | [[GitHub][vl-code]]  |
| rollup-plugin-vue     | [![beta][rpv-badge]][rpv-npm] | [[GitHub][rpv-code]] |

[jsx-badge]: https://img.shields.io/npm/v/@vue/babel-plugin-jsx.svg
[jsx-npm]: https://www.npmjs.com/package/@vue/babel-plugin-jsx
[jsx-code]: https://github.com/vuejs/jsx-next
[vd-badge]: https://img.shields.io/npm/v/@vue/devtools/beta.svg
[vd-npm]: https://www.npmjs.com/package/@vue/devtools/v/beta
[vd-code]: https://github.com/vuejs/vue-devtools/tree/next
[epv-badge]: https://img.shields.io/npm/v/eslint-plugin-vue.svg
[epv-npm]: https://www.npmjs.com/package/eslint-plugin-vue
[epv-code]: https://github.com/vuejs/eslint-plugin-vue
[vtu-badge]: https://img.shields.io/npm/v/@vue/test-utils/next.svg
[vtu-npm]: https://www.npmjs.com/package/@vue/test-utils/v/next
[vtu-code]: https://github.com/vuejs/vue-test-utils-next
[jsx-badge]: https://img.shields.io/npm/v/@ant-design-vue/babel-plugin-jsx.svg
[jsx-npm]: https://www.npmjs.com/package/@ant-design-vue/babel-plugin-jsx
[jsx-code]: https://github.com/vueComponent/jsx
[vcc-badge]: https://img.shields.io/npm/v/vue-class-component/next.svg
[vcc-npm]: https://www.npmjs.com/package/vue-class-component/v/next
[vcc-code]: https://github.com/vuejs/vue-class-component/tree/next
[vl-badge]: https://img.shields.io/npm/v/vue-loader/next.svg
[vl-npm]: https://www.npmjs.com/package/vue-loader/v/next
[vl-code]: https://github.com/vuejs/vue-loader/tree/next
[rpv-badge]: https://img.shields.io/npm/v/rollup-plugin-vue/next.svg
[rpv-npm]: https://www.npmjs.com/package/rollup-plugin-vue/v/next
[rpv-code]: https://github.com/vuejs/rollup-plugin-vue/tree/next

::: info
Pour plus d'informations sur la compatibilité de Vue 3 avec les bibliothèques et les plugins, consultez [ce problème dans awesome-vue](https://github.com/vuejs/awesome-vue/issues/3544).
:::
