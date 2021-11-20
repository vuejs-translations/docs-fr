---
title: Prédominance de v-if par rapport à v-for
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## Aperçu

- **BREAKING** : Si elle est utilisée sur le même élément, `v-if` aura une plus grande priorité que `v-for`.

## Introduction

Deux des directives les plus utilisées dans Vue.js sont `v-if` et `v-for`. Il n'est donc pas surprenant qu'il arrive un moment où les développeurs souhaitent utiliser les deux ensemble. Bien que ce ne soit pas une pratique recommandée, il peut y avoir des moments où cela est nécessaire, nous avons donc voulu fournir des conseils sur la façon dont cela fonctionne.

## Syntaxe 2.x

En 2.x, lorsque vous utilisiez `v-if` et `v-for` sur le même élément, `v-for` était prioritaire.

## Syntaxe 3.x

En 3.x, `v-if` aura toujours la priorité sur `v-for`.

## Stratégie de migration

Il est recommandé d'éviter d'utiliser les deux sur le même élément en raison de l'ambiguïté de la syntaxe.

Plutôt que de gérer cela au niveau du modèle, une méthode pour y parvenir consiste à créer une propriété calculée qui filtre une liste pour les éléments visibles.

## Voir aussi

- [List Rendering - Displaying Filtered/Sorted Results](/guide/list.html#affichage-des-resultats-filtres-tries)
- [Rendu de liste - `v-for` avec `v-if`](/guide/list.html#v-for-avec-v-if)
