---
badges:
  - removed
---

# $children <MigrationBadges :badges="$frontmatter.badges" />

## Vue

La propriété d'instance `$children` a été supprimée de Vue 3.0 et n'est plus supportée.

## Syntaxe 2.x

En 2.x, les développeurs pouvaient accéder aux composants enfants directs de l'instance courante avec `this.$children` :

```vue
<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png">
    <my-button>Change logo</my-button>
  </div>
</template>

<script>
import MyButton from './MyButton'

export default {
  components: {
    MyButton
  },
  mounted() {
    console.log(this.$children) // [VueComponent]
  }
}
</script>
```

## Mise à jour 3.x

En 3.x, la propriété `$children` est supprimée et n'est plus supportée. À la place, si vous avez besoin d'accéder à une instance de composant enfant, nous vous recommandons d'utiliser [$refs](/guide/component-template-refs.html#refs-de-template).
