---
title: Transition Group Root Element
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

`<transition-group>` ne rend plus un élément racine par défaut, mais peut toujours en créer un avec la prop `tag`.

## Syntaxe 2.x

Dans Vue 2, `<transition-group>`, comme d'autres composants personnalisés, avait besoin d'un élément racine, qui était par défaut un `<span>` mais qui était personnalisable via la prop `tag`.

```html
<transition-group tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</transition-group>
```

## Syntaxe 3.x

Dans Vue 3, nous avons [support des fragments](/guide/migration/fragments.html), donc les composants n'ont plus besoin d'un noeud racine. Par conséquent, `<transition-group>` n'en rend plus un par défaut.

- Si vous avez déjà défini la prop `tag` dans votre code Vue 2, comme dans l'exemple ci-dessus, tout fonctionnera comme avant.
- Si vous n'en aviez pas défini _et_ que votre style ou d'autres comportements dépendaient de la présence de l'élément racine `<span>` pour fonctionner correctement, ajoutez simplement `tag="span"` au `<transition-group>` :

```html
<transition-group tag="span">
  <!-- -->
</transition-group>
```

## Voir aussi

- [Certaines classes de transition ont été renommées](/guide/migration/transition.html)
