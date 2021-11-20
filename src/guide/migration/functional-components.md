---
badges:
  - breaking
---

## Composants fonctionnels <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

En termes de ce qui a changé, à un niveau élevé :

- Les gains de performance de la 2.x pour les composants fonctionnels sont maintenant négligeables dans la 3.x, nous recommandons donc de simplement utiliser des composants stateful.
- Les composants fonctionnels peuvent seulement être créés en utilisant une fonction simple qui reçoit `props` et `context` (i.e., `slots`, `attrs`, `emit`)
- **BREAKING:** L'attribut `functional` sur le composant mono-fichier (SFC) `<template>` est supprimé
- **BREAKING:** L'option `{functional : true }` dans les composants créés par des fonctions est supprimée.

Pour plus d'informations, lisez la suite !

## Introduction

Dans Vue 2, les composants fonctionnels avaient deux cas d'utilisation principaux :

- comme une optimisation des performances, car ils s'initialisaient beaucoup plus rapidement que les composants à états
- pour renvoyer plusieurs nœuds racines

Cependant, dans Vue 3, les performances des composants étatiques ont été améliorées au point que la différence est négligeable. En outre, les composants à état incluent désormais la possibilité de renvoyer plusieurs nœuds racine.

Par conséquent, le seul cas d'utilisation restant pour les composants fonctionnels est celui des composants simples, tels qu'un composant permettant de créer une rubrique dynamique. Sinon, il est recommandé d'utiliser les composants à état comme vous le feriez normalement.

## Syntaxe 2.x

En utilisant le composant `<dynamic-heading>`, qui est responsable du rendu de l'en-tête approprié (c'est-à-dire, `h1`, `h2`, `h3`, etc.), ceci aurait pu être écrit comme un composant à fichier unique dans 2.x comme :

```js
// Exemple de composant fonctionnel Vue 2
export default {
  functional: true,
  props: ['level'],
  render(h, { props, data, children }) {
    return h(`h${props.level}`, data, children)
  }
}
```

Ou, pour ceux qui préféraient le `<template>` dans un composant à fichier unique :

```vue
<!-- Vue 2 Functional Component Example with <template> -->
<template functional>
  <component
    :is="`h${props.level}`"
    v-bind="attrs"
    v-on="listeners"
  />
</template>

<script>
export default {
  props: ['level']
}
</script>
```

### Syntaxe 3.x

### Composants créés par des fonctions

Maintenant dans Vue 3, tous les composants fonctionnels sont créés avec une simple fonction. En d'autres termes, il n'est pas nécessaire de définir l'option de composant `{ functional : true }`.

Ils recevront deux arguments : `props` et `context`. L'argument `context` est un objet qui contient les propriétés `attrs`, `slots`, et `emit` d'un composant.

De plus, plutôt que de fournir implicitement `h` dans une fonction `render`, `h` est maintenant importé globalement.

En utilisant l'exemple précédemment mentionné d'un composant `<dynamic-heading>`, voici à quoi il ressemble maintenant.

```js
import { h } from 'vue'

const DynamicHeading = (props, context) => {
  return h(`h${props.level}`, context.attrs, context.slots)
}

DynamicHeading.props = ['level']

export default DynamicHeading
```

### Composants à fichier unique (SFC)

Dans la version 3.x, la différence de performance entre les composants à état et les composants fonctionnels a été considérablement réduite et sera insignifiante dans la plupart des cas d'utilisation. En conséquence, le chemin de migration pour les développeurs utilisant `functional` sur les SFCs est de supprimer l'attribut et de renommer toutes les références de `props` en `$props` et de `attrs` en `$attrs`.

En reprenant notre exemple de `<dynamic-heading>` de tout à l'heure, voici à quoi il ressemblerait maintenant.

```vue{1,3,4}
<template>
  <component
    v-bind:is="`h${$props.level}`"
    v-bind="$attrs"
  />
</template>

<script>
export default {
  props: ['level']
}
</script>
```

Les principales différences sont les suivantes :

1. Suppression de l'attribut `functional` sur `<template>`.
1. `listeners` sont maintenant passés comme faisant partie de `$attrs` et peuvent être retirés

## Prochaines étapes

Pour plus d'informations sur l'utilisation des nouveaux composants fonctionnels et les changements apportés aux fonctions de rendu en général, voir :

- [Migration : Fonctions de rendu](/guide/migration/render-function-api.html)
- [Guide : Fonctions de rendu](/guide/render-function.html)
