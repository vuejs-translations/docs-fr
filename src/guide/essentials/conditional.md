# Rendu conditionnel {#conditional-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/conditional-rendering-in-vue-3" title="Cours gratuit sur le rendu conditionnel Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-conditionals-in-vue" title="Cours gratuit sur le rendu conditionnel Vue.js"/>
</div>

<script setup>
import { ref } from 'vue'
const awesome = ref(true)
</script>

## `v-if` {#v-if}

La directive `v-if` est utilisée pour restituer conditionnellement un bloc. Le bloc ne sera rendu que si l'expression de la directive retourne une valeur évaluée à vrai.

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
```

## `v-else` {#v-else}

Vous pouvez utiliser la directive `v-else` pour indiquer un bloc "sinon" lié à un `v-if`:

```vue-html
<button @click="awesome = !awesome">Basculer</button>

<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

<div class="demo">
  <button @click="awesome = !awesome">Toggle</button>
  <h1 v-if="awesome">Vue is awesome!</h1>
  <h1 v-else>Oh no 😢</h1>
</div>

<div class="composition-api">

[Essayer en ligne](https://play.vuejs.org/#eNpFjkEOgjAQRa8ydIMulLA1hegJ3LnqBskAjdA27RQXhHu4M/GEHsEiKLv5mfdf/sBOxux7j+zAuCutNAQOyZtcKNkZbQkGsFjBCJXVHcQBjYUSqtTKERR3dLpDyCZmQ9bjViiezKKgCIGwM21BGBIAv3oireBYtrK8ZYKtgmg5BctJ13WLPJnhr0YQb1Lod7JaS4G8eATpfjMinjTphC8wtg7zcwNKw/v5eC1fnvwnsfEDwaha7w==)

</div>
<div class="options-api">

[Essayer en ligne](https://play.vuejs.org/#eNpFjj0OwjAMha9iMsEAFWuVVnACNqYsoXV/RJpEqVOQqt6DDYkTcgRSWoplWX7y56fXs6O1u84jixlvM1dbSoXGuzWOIMdCekXQCw2QS5LrzbQLckje6VEJglDyhq1pMAZyHidkGG9hhObRYh0EYWOVJAwKgF88kdFwyFSdXRPBZidIYDWvgqVkylIhjyb4ayOIV3votnXxfwrk2SPU7S/PikfVfsRnGFWL6akCbeD9fLzmK4+WSGz4AA5dYQY=)

</div>

Un élément `v-else` doit immédiatement suivre un élément `v-if` ou un élément `v-else-if` sinon il ne sera pas reconnu.

## `v-else-if` {#v-else-if}

Le `v-else-if`, comme son nom l'indique, sert de bloc "else if" lié à un `v-if`. Il peut également être enchaîné plusieurs fois :

```vue-html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

Similaire à `v-else`, un bloc `v-else-if` doit immédiatement suivre un bloc `v-if` ou `v-else-if`.

## `v-if` avec `<template>` {#v-if-on-template}

Puisque `v-if` est une directive, elle doit être attachée à un seul élément. Mais que se passe-t-il si nous voulons basculer plus d'un élément ? Dans ce cas, nous pouvons utiliser `v-if` sur un élément `<template>`, qui sert de conteneur invisible. Le résultat du rendu final n'inclura pas l'élément `<template>`.

```vue-html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

`v-else` et `v-else-if` peuvent également être utilisées dans `<template>`.

## `v-show` {#v-show}

Une autre option pour afficher conditionnellement un élément est la directive `v-show`. L'utilisation est sensiblement la même :

```vue-html
<h1 v-show="ok">Hello!</h1>
```

La différence est qu'un élément avec `v-show` sera toujours rendu et restera dans le DOM; `v-show` bascule uniquement la propriété CSS `display` de l'élément.

`v-show` ne prend pas en charge l'élément `<template>`, et ne fonctionne pas avec `v-else`.

## `v-if` vs. `v-show` {#v-if-vs-v-show}

`v-if` est un rendu conditionnel "réel" car il garantit que les écouteurs d'événements et les composants enfants à l'intérieur du bloc conditionnel sont correctement détruits et recréés lors des basculements.

`v-if` fonctionne également **à la volée** : si la condition est fausse lors du rendu initial, elle ne fera rien - le bloc conditionnel ne sera rendu que lorsque la condition deviendra vraie pour la première fois.

En comparaison, `v-show` est beaucoup plus simple - l'élément est toujours rendu quelle que soit la condition initiale, avec un basculement basé sur du CSS.

De manière générale, `v-if` a des coûts de basculement plus élevés tandis que `v-show` a des coûts de rendu initiaux plus élevés. Préférez donc `v-show` si vous avez besoin de basculer quelque chose très souvent, et préférez `v-if` si la condition est peu susceptible de changer à l'exécution.

## `v-if` avec `v-for` {#v-if-with-v-for}

Lorsque `v-if` et `v-for` sont toutes les deux utilisées sur le même élément, `v-if` sera évaluée en premier. Voir le [guide de rendu de liste](list#v-for-with-v-if) pour plus de détails.

::: warning Note
Il n'est **pas** recommandé d'utiliser `v-if` et `v-for` sur le même élément en raison de la priorité implicite. Reportez-vous au [guide de rendu de liste](list#v-for-with-v-if) pour plus de détails.
:::
