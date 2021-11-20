---
title: $attrs inclut la classe et le style
badges:
  - breaking
---

# `$attrs` inclut `class` & `style` <MigrationBadges :badges="$frontmatter.badges" />

## Aperçu

`$attrs` contient maintenant _tous_ les attributs passés à un composant, y compris `class` et `style`.

## Comportement 2.x

Les attributs `class` et `style` bénéficient d'un traitement spécial dans l'implémentation du DOM virtuel de Vue 2. Pour cette raison, ils ne sont _pas_ inclus dans `$attrs`, alors que tous les autres attributs le sont.

Un effet secondaire de ceci se manifeste quand on utilise `inheritAttrs : `false` :

- Les attributs de `$attrs` ne sont plus automatiquement ajoutés à l'élément racine, laissant au développeur le soin de décider où les ajouter.
- Mais `class` et `style`, ne faisant pas partie de `$attrs`, seront toujours appliqués à l'élément racine du composant :

```vue
<template>
  <label>
    <input type="text" v-bind="$attrs" />
  </label>
</template>
<script>
export default {
  inheritAttrs: false
}
</script>
```

lorsqu'il est utilisé comme ceci :

```html
<my-component id="my-id" class="my-class"></my-component>
```

...va générer ce HTML :

```html
<label class="my-class">
  <input type="text" id="my-id" />
</label>
```

## Comportement 3.x

`$attrs` contient _tous_ les attributs, ce qui facilite leur application à un élément différent. L'exemple ci-dessus génère maintenant le HTML suivant :

```html
<label>
  <input type="text" id="my-id" class="my-class" />
</label>
```

## Stratégie de migration

Dans les composants qui utilisent `inheritAttrs : false`, assurez-vous que le style fonctionne toujours comme prévu. Si vous vous reposiez auparavant sur le comportement spécial de `class` et `style`, certains visuels pourraient être cassés car ces attributs pourraient maintenant être appliqués à un autre élément.

## Voir aussi

- [RFC pertinent](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0031-attr-fallthrough.md)
- [Guide de migration - Suppression de `$listeners`](./listeners-removed.md)
- [Guide de migration - Nouvelle option Emits](./emits-option.md)
- [Guide de migration - Suppression du modificateur `.native`](./v-on-native-modifier-removed.md)
- [Guide de migration - Changements dans l'API des fonctions de rendu](./render-function-api.md)
