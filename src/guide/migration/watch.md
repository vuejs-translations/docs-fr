---
title: Surveillance des tableaux
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

- **BREAKING** : Lorsque vous surveillez un tableau, le callback ne se déclenchera que lorsque le tableau est remplacé. Si vous avez besoin de déclencher sur une mutation, l'option `deep` doit être spécifiée.

## Syntaxe 3.x

Lorsque vous utilisez [l'option `watch`](/api/options-data.html#watch) pour surveiller un tableau, le callback ne sera déclenché que lorsque le tableau sera remplacé. En d'autres termes, la callback de surveillance ne sera plus déclenchée lors de la mutation du tableau. Pour déclencher sur une mutation, l'option `deep` doit être spécifiée.

```js
watch: {
  bookList: {
    handler(val, oldVal) {
      console.log('book list changed')
    },
    deep: true
  },
}
```

## Stratégie de migration

Si vous comptez sur la surveillance des mutations de tableaux, ajoutez la propriété `deep` pour vous assurer que votre callback est déclenché correctement.
