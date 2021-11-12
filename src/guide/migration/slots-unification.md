---
badges:
  - breaking
---

## Unification des slots <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

Cette modification unifie les slots normaux et les slots scopés dans la version 3.x.

Voici un résumé rapide de ce qui a changé :

- `this.$slots` expose maintenant les slots comme des fonctions.
- **BREAKING** : `this.$scopedSlots` est supprimé.

Pour plus d'informations, lisez la suite !

## Syntaxe 2.x

Lors de l'utilisation de la fonction de rendu, c'est-à-dire `h`, 2.x avait l'habitude de définir la propriété de données `slot` sur les noeuds de contenu.

```js
// 2.x Syntax
h(LayoutComponent, [
  h('div', { slot: 'header' }, this.header),
  h('div', { slot: 'content' }, this.content)
])
```

En outre, lorsque l'on fait référence à des créneaux scopés, on peut les référencer en utilisant la syntaxe suivante :

```js
// 2.x Syntax
this.$scopedSlots.header
```

## Syntaxe 3.x

En 3.x, les slots sont définis comme des enfants du noeud courant en tant qu'objet :

```js
// 3.x Syntax
h(LayoutComponent, {}, {
  header: () => h('div', this.header),
  content: () => h('div', this.content)
})
```

Et lorsque vous avez besoin de référencer les slots de manière programmatique, ils sont maintenant unifiés dans l'option `$slots`.

```js
// 2.x Syntax
this.$scopedSlots.header

// 3.x Syntax
this.$slots.header()
```

## Stratégie de migration

La majorité des changements ont déjà été livrés en 2.6. Par conséquent, la migration peut se faire en une seule étape :

1. Remplacer toutes les occurrences de `this.$scopedSlots` par `this.$slots` en 3.x.
2. Remplacez toutes les occurrences de `this.$slots.mySlot` par `this.$slots.mySlot()`.
