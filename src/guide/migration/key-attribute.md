---
badges:
  - breaking
---

# `key` attribute <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

- **NEW : ** Les `clés` ne sont plus nécessaires sur les branches `v-if`/`v-else`/`v-else-if`, puisque Vue génère maintenant automatiquement des `clés` uniques.
  - **BREAKING:** Si vous fournissez manuellement des `key`s, alors chaque branche doit utiliser une `key` unique. Vous ne pouvez plus utiliser intentionnellement la même `key` pour forcer la réutilisation des branches.
- **BREAKING:** La `key` de `<template v-for>` doit être placée sur la balise `<template>` (plutôt que sur ses enfants).

## Contexte

L'attribut spécial `key` est utilisé comme une indication pour l'algorithme DOM virtuel de Vue pour garder une trace de l'identité d'un noeud. De cette façon, Vue sait quand il peut réutiliser et patcher les nœuds existants et quand il doit les réorganiser ou les recréer. Pour plus d'informations, consultez les sections suivantes :

- [List Rendering : Maintaining State](/guide/list.html#maintien-de-l-etat)
- [Référence API : Attribut spécial `key`](/api/special-attributes.html#key)

## Sur les branches conditionnelles

Dans Vue 2.x, il était recommandé d'utiliser les `key`s sur les branches `v-if`/`v-else`/`v-else-if`.

```html
<!-- Vue 2.x -->
<div v-if="condition" key="yes">Yes</div>
<div v-else key="no">No</div>
```

L'exemple ci-dessus fonctionne toujours dans Vue 3.x. Cependant, nous ne recommandons plus l'utilisation de l'attribut `key` sur les branches `v-if`/`v-else`/`v-else-if`, puisque des `key` uniques sont maintenant générés automatiquement sur les branches conditionnelles si vous ne les fournissez pas.

```html
<!-- Vue 3.x -->
<div v-if="condition">Yes</div>
<div v-else>No</div>
```

Le changement de rupture est que si vous fournissez manuellement des `key`s, chaque branche doit utiliser une `key` unique. Dans la plupart des cas, vous pouvez supprimer ces `key`.

```html
<!-- Vue 2.x -->
<div v-if="condition" key="a">Yes</div>
<div v-else key="a">No</div>

<!-- Vue 3.x (solution recommandée : supprimer les clés) -->
<div v-if="condition">Yes</div>
<div v-else>No</div>

<!-- Vue 3.x (solution alternative : s'assurer que les clés sont toujours uniques) -->
<div v-if="condition" key="a">Yes</div>
<div v-else key="b">No</div>
```

## Avec la balise `<template v-for>`

Dans Vue 2.x, une balise `<template>` ne pouvait pas avoir de `key`. Au lieu de cela, vous pouviez placer les `key`s sur chacun de ses enfants.

```html
<!-- Vue 2.x -->
<template v-for="item in list">
  <div :key="item.id">...</div>
  <span :key="item.id">...</span>
</template>
```

Dans Vue 3.x, la `key` doit être placée sur la balise `<template>` à la place.

```html
<!-- Vue 3.x -->
<template v-for="item in list" :key="item.id">
  <div>...</div>
  <span>...</span>
</template>
```

De même, lorsque vous utilisez `<template v-for>` avec un enfant qui utilise `v-if`, la `key` doit être déplacée vers le haut de la balise `<template>`.

```html
<!-- Vue 2.x -->
<template v-for="item in list">
  <div v-if="item.isVisible" :key="item.id">...</div>
  <span v-else :key="item.id">...</span>
</template>

<!-- Vue 3.x -->
<template v-for="item in list" :key="item.id">
  <div v-if="item.isVisible">...</div>
  <span v-else>...</span>
</template>
```
