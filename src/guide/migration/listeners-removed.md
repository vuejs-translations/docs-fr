---
title: $listeners removed
badges:
  - breaking
---

# `$listeners` supprimé <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

L'objet `$listeners` a été supprimé dans Vue 3. Les écouteurs d'événements font maintenant partie de `$attrs` :

```javascript
{
  text: 'this is an attribute',
  onClose: () => console.log('close Event triggered')
}
```

## Syntaxe 2.x

Dans Vue 2, vous pouvez accéder aux attributs passés à vos composants avec `this.$attrs`, et aux écouteurs d'événements avec `this.$listeners`.
En combinaison avec `inheritAttrs : false`, ils permettent au développeur d'appliquer ces attributs et listeners à un autre élément au lieu de l'élément racine :

```html
<template>
  <label>
    <input type="text" v-bind="$attrs" v-on="$listeners" />
  </label>
</template>
<script>
  export default {
    inheritAttrs: false
  }
</script>
```

## Syntaxe 3.x

Dans le DOM virtuel de Vue 3, les écouteurs d'événements sont maintenant juste des attributs, préfixés par `on`, et en tant que tels font partie de l'objet `$attrs`, donc `$listeners` a été supprimé.

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

Si ce composant a reçu un attribut `id` et un écouteur `v-on:close`, l'objet `$attrs` ressemblera maintenant à ceci :

```javascript
{
  id: 'my-input',
  onClose: () => console.log('close Event triggered')
}
```

## Stratégie de migration

Supprimez tous les usages de `$listeners`.

## Voir aussi

- [RFC pertinent](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0031-attr-fallthrough.md)
- [Guide de migration - `$attrs`includes `class` & `style` ](./attrs-includes-class-style.md)
- [Guide de migration - Changements dans l'API des fonctions de rendu](./render-function-api.md)
- [Guide de migration - Nouvelle option Emits](./emits-option.md)
- [Guide de migration - Suppression du modificateur `.native`](./v-on-native-modifier-removed.md)
