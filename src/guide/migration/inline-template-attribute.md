---
badges:
  - breaking
---

# Attribut de modèle en ligne <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

La prise en charge de la fonctionnalité [inline-template](https://vuejs.org/v2/guide/components-edge-cases.html#Inline-Templates) a été supprimée.

## Syntaxe 2.x

En 2.x, Vue fournissait l'attribut `inline-template` sur les composants enfants pour utiliser son contenu interne comme modèle au lieu de le traiter comme un contenu distribué.

```html
<my-component inline-template>
  <div>
    <p>These are compiled as the component's own template.</p>
    <p>Not parent's transclusion content.</p>
  </div>
</my-component>
```

## Syntaxe 3.x

Cette fonctionnalité ne sera plus supportée.

## Stratégie de migration

La plupart des cas d'utilisation de `inline-template` suppose une configuration sans outil de construction, où tous les modèles sont écrits directement dans la page HTML.

### Option 1 : utiliser la balise `<script>`.

La solution la plus simple dans ce cas est d'utiliser la balise `<script>` avec un autre type :

```html
<script type="text/html" id="my-comp-template">
  <div>{{ hello }}</div>
</script>
```

Et dans le composant, ciblez le modèle en utilisant un sélecteur :

```js
const MyComp = {
  template: '#my-comp-template'
  // ...
}
```

Cela ne nécessite aucune configuration de construction, fonctionne dans tous les navigateurs, n'est pas soumis à des restrictions d'analyse HTML in-DOM (par exemple, vous pouvez utiliser des noms de prop en camelCase) et fournit une coloration syntaxique appropriée dans la plupart des IDE. Dans les frameworks traditionnels côté serveur, ces modèles peuvent être divisés en partiels de modèle de serveur (inclus dans le modèle HTML principal) pour une meilleure maintenabilité.

### Option 2 : Slot par défaut

Un composant qui utilisait précédemment `inline-template` peut également être remanié en utilisant le slot par défaut - ce qui rend le scoping des données plus explicite tout en préservant la commodité d'écrire le contenu enfant en ligne :

```html
<!-- 2.x Syntax -->
<my-comp inline-template :msg="parentMsg">
  {{ msg }} {{ childState }}
</my-comp>

<!-- Version par défaut de la fente -->
<my-comp v-slot="{ childState }">
  {{ parentMsg }} {{ childState }}
</my-comp>
```

L'enfant, au lieu de ne fournir aucun modèle, devrait maintenant rendre le slot\* par défaut :

```html
<!--
  dans le modèle enfant, rendre le slot par défaut tout en passant
  l'état privé nécessaire de l'enfant.
-->
<template>
  <slot :childState="childState" />
</template>
```

> - Note: In 3.x, slots can be rendered as the root with native [fragments](/guide/migration/fragments) support!
