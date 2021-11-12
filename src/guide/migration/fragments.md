---
badges:
  - new
---

# Fragments <MigrationBadges :badges="$frontmatter.badges" />

## Vue

Dans Vue 3, les composants ont maintenant un support officiel pour les composants de nœuds multi-roots, c'est-à-dire les fragments !

## Syntaxe 2.x

Dans la version 2.x, les composants à racines multiples n'étaient pas supportés et émettaient un avertissement lorsqu'un utilisateur en créait accidentellement un. Par conséquent, de nombreux composants sont enveloppés dans un seul `<div>` afin de corriger cette erreur.

```html
<!-- Layout.vue -->
<template>
  <div>
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  </div>
</template>
```

## Syntaxe 3.x

En 3.x, les composants peuvent désormais avoir plusieurs nœuds racines ! Cependant, cela oblige les développeurs à définir explicitement où les attributs doivent être distribués.

```html
<!-- Layout.vue -->
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>
  <footer>...</footer>
</template>
```

Pour plus d'informations sur le fonctionnement de l'héritage des attributs, reportez-vous à la section [Non-Prop Attributes](/guide/component-attrs.html).
