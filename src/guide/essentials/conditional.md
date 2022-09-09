# Rendu conditionnel

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/conditional-rendering-in-vue-3" title="Free Vue.js Conditional Rendering Lesson"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-conditionals-in-vue" title="Free Vue.js Conditional Rendering Lesson"/>
</div>

<script setup>
import { ref } from 'vue'
const awesome = ref(true)
</script>

## `v-if`

La directive `v-if` est utilisée pour restituer conditionnellement un bloc. Le bloc ne sera rendu que si l'expression de la directive retourne une valeur évaluée à vrai.

```vue-html
<h1 v-if="awesome">Vue est magnifique!</h1>
```

## `v-else`

Vous pouvez utiliser la directive `v-else` pour indiquer un bloc "sinon" lié à un `v-if`:

```vue-html
<button @click="awesome = !awesome">Basculer</button>

<h1 v-if="awesome">Vue est magnifique!</h1>
<h1 v-else>Oh non 😢</h1>
```

<div class="demo">
  <button @click="awesome = !awesome">Basculer</button>
  <h1 v-if="awesome">Vue est magnifique!</h1>
  <h1 v-else>Oh non 😢</h1>
</div>

<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgYXdlc29tZSA9IHJlZih0cnVlKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJhd2Vzb21lID0gIWF3ZXNvbWVcIj50b2dnbGU8L2J1dHRvbj5cblxuXHQ8aDEgdi1pZj1cImF3ZXNvbWVcIj5WdWUgaXMgYXdlc29tZSE8L2gxPlxuXHQ8aDEgdi1lbHNlPk9oIG5vIPCfmKI8L2gxPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>
<div class="options-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgXHRyZXR1cm4ge1xuXHQgICAgYXdlc29tZTogdHJ1ZVxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJhd2Vzb21lID0gIWF3ZXNvbWVcIj50b2dnbGU8L2J1dHRvbj5cblxuXHQ8aDEgdi1pZj1cImF3ZXNvbWVcIj5WdWUgaXMgYXdlc29tZSE8L2gxPlxuXHQ8aDEgdi1lbHNlPk9oIG5vIPCfmKI8L2gxPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

Un élément `v-else` doit immédiatement suivre un élément `v-if` ou un élément `v-else-if` sinon il ne sera pas reconnu.

## `v-else-if`

Le `v-else-if`, comme son nom l'indique, sert de bloc "else if" lié à un `v-if`. Il peut également être enchaîné plusieurs fois:

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
  Pas A/B/C
</div>
```

Similaire à `v-else`, un bloc `v-else-if` doit immédiatement suivre un bloc `v-if` ou `v-else-if`.

## `v-if` on `<template>`

Puisque `v-if` est une directive, elle doit être attachée à un seul élément. Mais que se passe-t-il si nous voulons basculer plus d'un élément ? Dans ce cas, nous pouvons utiliser `v-if` sur un élément du `<template>`, qui sert de conteneur invisible. Le résultat du rendu final n'inclura pas l'élément `<template>`.

```vue-html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

`v-else` et `v-else-if` peuvent également être utilisés dans `<template>`.

## `v-show`

Une autre option pour afficher conditionnellement un élément est la directive `v-show`. L'utilisation est sensiblement la même:

```vue-html
<h1 v-show="ok">Bonjour!</h1>
```

La différence est qu'un élément avec `v-show` sera toujours rendu et restera dans le DOM; `v-show` bascule uniquement la propriété CSS `display` de l'élément.

`v-show` ne prend pas en charge l'élément `<template>`, et ne fonctionne pas avec `v-else`.

## `v-if` vs `v-show`

`v-if` est un rendu conditionnel "réel" car il garantit que les écouteurs d'événements et les composants enfants à l'intérieur du bloc conditionnel sont correctement détruits et recréés lors des basculements.

`v-if` est également **paresseux** : si la condition est fausse lors du rendu initial, il ne fera rien - le bloc conditionnel ne sera rendu que lorsque la condition deviendra vraie pour la première fois.

En comparaison, `v-show` est beaucoup plus simple - l'élément est toujours rendu quelle que soit la condition initiale, avec un basculement basé sur CSS.

De manière générale, `v-if` a des coûts de basculement plus élevés tandis que `v-show` a des coûts de rendu initiaux plus élevés. Préférez donc `v-show` si vous avez besoin de basculer quelque chose très souvent, et préférez `v-if` si la condition est peu susceptible de changer à l'exécution.

## `v-if` avec `v-for`

::: warning Note
Il n'est **pas** recommandé d'utiliser `v-if` et `v-for` sur le même élément en raison de la priorité implicite. Reportez-vous au [TODO(fr)guide de style](/style-guide/rules-essential.html#avoid-v-if-with-v-for) pour plus de détails.
:::

Lorsque `v-if` et `v-for` sont tous les deux utilisés sur le même élément, `v-if` sera évalué en premier. Voir le [TODO(fr)guide de rendu de liste](list#v-for-with-v-if) pour plus de détails.
