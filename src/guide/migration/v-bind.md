---
title: Comportement de fusion de v-bind
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

- **BREAKING** : L'ordre des liaisons pour v-bind affectera le résultat du rendu.

## Introduction

Lorsque l'on lie dynamiquement des attributs sur un élément, un scénario courant consiste à utiliser à la fois la syntaxe `v-bind="object"` et des propriétés individuelles dans le même élément. Cependant, cela soulève des questions quant à la priorité de la fusion.

## Syntaxe 2.x

En 2.x, si un élément avait à la fois `v-bind="object"` et une propriété individuelle identique définie, la propriété individuelle écrasait toujours les liaisons dans l'`object`. 

```html
<!-- template -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- result -->
<div id="red"></div>
```

## Syntaxe 3.x

Dans 3x, si un élément a à la fois `v-bind="object"` et une propriété individuelle identique définie, l'ordre dans lequel les liaisons sont déclarées détermine comment elles sont fusionnées. En d'autres termes, plutôt que de supposer que les développeurs veulent que la propriété individuelle prévale toujours sur ce qui est défini dans le `object`, les développeurs ont maintenant plus de contrôle sur le comportement de fusion souhaité.

```html
<!-- template -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- result -->
<div id="blue"></div>

<!-- template -->
<div v-bind="{ id: 'blue' }" id="red"></div>
<!-- result -->
<div id="red"></div>
```

## Stratégie de migration

Si vous comptez sur cette fonctionnalité de remplacement pour `v-bind`, nous vous recommandons actuellement de vous assurer que votre attribut `v-bind` est défini avant les propriétés individuelles.
