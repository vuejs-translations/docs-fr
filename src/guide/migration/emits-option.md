---
title: emits Option
badges:
  - new
---

# `emits` Option <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

Vue 3 offre maintenant une option `emits`, similaire à l'option `props` existante. Cette option peut être utilisée pour définir les événements qu'un composant peut émettre vers son parent.

## Comportement 2.x

Dans Vue 2, vous pouvez définir les props qu'un composant reçoit, mais vous ne pouvez pas déclarer quels événements il peut émettre :

```vue
<template>
  <div>
    <p>{{ text }}</p>
    <button v-on:click="$emit('accepted')">OK</button>
  </div>
</template>
<script>
  export default {
    props: ['text']
  }
</script>
```

## Comportement 3.x

Comme pour les props, les événements que le composant émet peuvent maintenant être définis avec l'option `emits` :

```vue
<template>
  <div>
    <p>{{ text }}</p>
    <button v-on:click="$emit('accepted')">OK</button>
  </div>
</template>
<script>
  export default {
    props: ['text'],
    emits: ['accepted']
  }
</script>
```

L'option accepte également un objet, qui permet au développeur de définir des validateurs pour les arguments qui sont passés avec l'événement émis, de façon similaire aux validateurs dans les définitions de `props`.

Pour plus d'informations à ce sujet, veuillez lire la [documentation de l'API pour cette fonctionnalité](../../api/options-data.md#emits).

## Stratégie de migration

Il est fortement recommandé de documenter tous les événements émis par chacun de vos composants en utilisant `emits`.

Ceci est particulièrement important en raison de [la suppression du modificateur `.native`](./v-on-native-modifier-removed.md). Tous les écouteurs pour les événements qui ne sont pas déclarés avec `emits` seront maintenant inclus dans le `$attrs` du composant, qui par défaut sera lié au noeud racine du composant.

### Exemple

Pour les composants qui réémettent des événements natifs vers leur parent, deux événements sont déclenchés :

```vue
<template>
  <button v-on:click="$emit('click', $event)">OK</button>
</template>
<script>
export default {
  emits: [] // sans événement déclaré
}
</script>
```

Quand un parent écoute l'événement `click` sur le composant :

```html
<my-button v-on:click="handleClick"></my-button>
```

il serait maintenant déclenché _deux_ fois :

- Une fois par `$emit()`.
- Une fois à partir d'un écouteur d'événement natif appliqué à l'élément racine.

Ici, vous avez deux options :

1. Déclarer correctement l'événement `click`. Ceci est utile si vous ajoutez de la logique à ce gestionnaire d'événement dans `<my-button>`.
2. Supprimer la réémission de l'événement, puisque le parent peut maintenant écouter l'événement natif facilement, sans ajouter `.native`. Convient lorsque vous ne faites que réémettre l'événement de toute façon.

## Voir aussi

- [RFC pertinent](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0030-emits-option.md)
- [Guide de migration - Suppression du modificateur `.native`](./v-on-native-modifier-removed.md)
- [Guide de migration - Suppression de `$listeners`](./listeners-removed.md)
- [Guide de migration - `$attrs` inclut `class` & `style`](./attrs-includes-class-style.md)
- [Guide de migration - Changements dans l'API Render Functions](./render-function-api.md)
