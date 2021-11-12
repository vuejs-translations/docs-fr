---
title: suppression du modificateur v-on.native
badges:
  - breaking
---

# Le modificateur `v-on.native` a été supprimé <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

Le modificateur `.native` pour `v-on` a été supprimé.

## Syntaxe 2.x

Les écouteurs d'événements passés à un composant avec `v-on` sont par défaut uniquement déclenchés par l'émission d'un événement avec `this.$emit`. Pour ajouter un écouteur DOM natif à l'élément racine du composant enfant, le modificateur `.native` peut être utilisé :

```html
<my-component
  v-on:close="handleComponentEvent"
  v-on:click.native="handleNativeClickEvent"
/>
```

## Syntaxe 3.x

Le modificateur `.native` pour `v-on` a été supprimé. En même temps, la [nouvelle option `emits`](./emits-option.md) permet à l'enfant de définir les événements qu'il émet effectivement.

Par conséquent, Vue ajoutera désormais tous les écouteurs d'événements qui ne sont _pas_ définis comme des événements émis par les composants dans l'enfant comme des écouteurs d'événements natifs à l'élément racine de l'enfant (à moins que `inheritAttrs : false` ait été défini dans les options de l'enfant).

```html
<my-component
  v-on:close="handleComponentEvent"
  v-on:click="handleNativeClickEvent"
/>
```

`MyComponent.vue`

```html
<script>
  export default {
    emits: ['close']
  }
</script>
```

## Stratégie de migration

- supprimez toutes les instances du modificateur `.native`.
- assurez-vous que tous vos composants documentent leurs événements avec l'option `emits`.

## Voir aussi

- [RFC pertinente](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0031-attr-fallthrough.md#v-on-listener-fallthrough)
- [Guide de migration - Nouvelle option Emits](./emits-option.md)
- [Guide de migration - Suppression de `$listeners`](./listeners-removed.md)
- [Guide de migration - Changements dans l'API des fonctions de rendu](./render-function-api.md)
