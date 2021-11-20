---
title: Transition Class Change
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

La classe de transition `v-enter` a été renommée en `v-enter-from` et la classe de transition `v-leave` a été renommée en `v-leave-from`.

## Syntaxe 2.x

Avant la v2.1.8, nous avions deux classes de transition pour chaque direction de transition : les états initial et actif.

Dans la v2.1.8, nous avons introduit `v-enter-to` pour résoudre le problème du décalage entre les transitions enter/leave. Cependant, pour des raisons de compatibilité ascendante, le nom `v-enter` n'a pas été modifié :

```css
.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-leave,
.v-enter-to {
  opacity: 1;
}
```

Cela devenait confus, car _enter_ et _leave_ étaient larges et n'utilisaient pas la même convention de dénomination que leurs homologues de classe.

## Mise à jour 3.x

Afin d'être plus explicite et lisible, nous avons maintenant renommé ces classes d'état initial :

```css
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-leave-from,
.v-enter-to {
  opacity: 1;
}
```

La différence entre ces deux états est maintenant beaucoup plus claire.

![Transition Diagram](/images/transitions.svg)

Les noms des accessoires liés au composant `<transition>` sont également modifiés :

- `leave-class` est renommé en `leave-from-class` (peut être écrit comme `leaveFromClass` dans les fonctions de rendu ou JSX)
- `enter-class` est renommé en `enter-from-class` (peut être écrit `enterFromClass` dans les fonctions de rendu ou en JSX).

## Stratégie de migration

1. Remplacer les instances de `.v-enter' par `.v-enter-from'.
2. Remplacer les instances de `.v-leave` par `.v-leave-from`.
3. Remplacer les instances des noms de prop connexes, comme ci-dessus.

## Voir aussi

- [`<TransitionGroup>` ne rend plus d'élément d'habillage par défaut](/guide/migration/transition-group.html)
