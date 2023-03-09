# Les refs du template {#template-refs}

Bien que le modèle de rendu déclaratif de Vue fasse abstraction pour vous de la plupart des opérations directes sur le DOM, il peut tout de même y avoir des cas où nous avons besoin d'accéder aux éléments sous-jacents du DOM. Pour ce faire, nous pouvons utiliser l'attribut spécial `ref`:

```vue-html
<input ref="input">
```

`ref` est un attribut spécial, semblable à l'attribut `key` évoqué dans le chapitre `v-for`. Il nous permet d'obtenir une référence directe à un élément spécifique du DOM ou à une instance d'un composant enfant une fois qu'il a été monté. Cela peut être utile lorsque vous voulez, par exemple, se concentrer de manière programmatique sur une entrée lors du montage d'un composant, ou bien initialiser une librairie tierce sur un élément.

## Accéder aux refs {#accessing-the-refs}

<div class="composition-api">

Pour obtenir la référence avec la Composition API, nous devons déclarer une ref avec le même nom :

```vue
<script setup>
import { ref, onMounted } from 'vue'

// déclare une ref contenant la référence à l'élément
// le nom doit correspondre à la valeur de la ref dans le template
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

Si vous n'utilisez pas `<script setup>`, assurez vous d'également retourner la ref depuis `setup()`:

```js{6}
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}
```

</div>
<div class="options-api">

La ref correspondante est accessible via `this.$refs`:

```vue
<script>
export default {
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<template>
  <input ref="input" />
</template>
```

</div>

Notez que vous ne pouvez accéder à la ref **qu'après que le composant ait été monté.** Si vous essayez d'accéder à <span class="options-api">`$refs.input`</span><span class="composition-api">`input`</span> via une expression dans le template, ça sera `null` lors du premier rendu. C'est parce que l'élément n'existe pas avant la fin du premier rendu !

<div class="composition-api">

Si vous essayez d'observer les changements d'une ref du template, assurez vous de prendre en compte le cas où la raf a une valeur `null` :

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // pas encore monté, où l'élément a été démonté (par ex. par v-if)
  }
})
```

Voir aussi : [Typer les refs du template](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />

</div>

## Refs à l'intérieur d'un `v-for` {#refs-inside-v-for}

> Requiert v3.2.25 ou ultérieure 

<div class="composition-api">

Lorsque `ref` est utilisée à l'intérieur d'un `v-for`, la ref correspondante doit contenir un tableau, qui sera alimenté avec les éléments après le montage :

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgb25Nb3VudGVkIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBsaXN0ID0gcmVmKFsxLCAyLCAzXSlcblxuY29uc3QgaXRlbVJlZnMgPSByZWYoW10pXG5cbm9uTW91bnRlZCgoKSA9PiB7XG4gIGFsZXJ0KGl0ZW1SZWZzLnZhbHVlLm1hcChpID0+IGkudGV4dENvbnRlbnQpKVxufSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDx1bD5cbiAgICA8bGkgdi1mb3I9XCJpdGVtIGluIGxpc3RcIiByZWY9XCJpdGVtUmVmc1wiPlxuICAgICAge3sgaXRlbSB9fVxuICAgIDwvbGk+XG4gIDwvdWw+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

Lorsque `ref` est utilisée à l'intérieur d'un `v-for`, la valeur ref qui en résulte sera un tableau contenant les éléments correspondants :

```vue
<script>
export default {
  data() {
    return {
      list: [
        /* ... */
      ]
    }
  },
  mounted() {
    console.log(this.$refs.items)
  }
}
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGlzdDogWzEsIDIsIDNdXG4gICAgfVxuICB9LFxuICBtb3VudGVkKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMuJHJlZnMuaXRlbXMpXG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDx1bD5cbiAgICA8bGkgdi1mb3I9XCJpdGVtIGluIGxpc3RcIiByZWY9XCJpdGVtc1wiPlxuICAgICAge3sgaXRlbSB9fVxuICAgIDwvbGk+XG4gIDwvdWw+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>

À noter que le tableau ref ne garantit **pas** le même ordre que celui du tableau source.

## Les fonctions refs {#function-refs}

Au lieu d'une chaîne de caractères comme clé, l'attribut `ref` peut également être lié à une fonction, qui sera appelée à chaque mise à jour du composant et vous donne une flexibilité totale sur l'endroit où stocker la référence à l'élément. La fonction reçoit la référence à l'élément comme premier argument :

```vue-html
<input :ref="(el) => { /* assigne l'élément à une propriété ou à une ref */ }">
```

Notez l'utilisation d'une liaison dynamique `:ref` permettant de passer une fonction au lieu d'un nom de ref en chaîne de caractères. Lorsque l'élément est démonté, l'argument sera `null`. Vous pouvez, bien entendu, utiliser une méthode au lieu d'une fonction en une ligne.

## Ref sur un composant {#ref-on-component}

> Cette section considère [les composants](/guide/essentials/component-basics) comme acquis. N'hésitez pas à la passer et revenir plus tard.

`ref` peut également être utilisée sur un composant enfant. Dans ce cas la référence sera celle d'une instance du composant :

<div class="composition-api">

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value contiendra une instance de <Child />
})
</script>

<template>
  <Child ref="child" />
</template>
```

</div>
<div class="options-api">

```vue
<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  mounted() {
    // this.$refs.child ne contiendra pas une instance de <Child />
  }
}
</script>

<template>
  <Child ref="child" />
</template>
```

</div>

<span class="composition-api">Si le composant enfant utilise l'Options API ou n'utilise pas `<script setup>`, l'</span><span class="options-api">L'</span>instance référencée sera identique au `this` du composant enfant, ce qui signifie que le composant parent aura un accès total aux propriétés et méthodes du composant enfant. Cela simplifie la création de détails de mise en oeuvre étroitement liés entre le parent en l'enfant, donc les refs sur un composant devraient être utilisées seulement si nécessaire - dans la plupart des cas, vous devriez essayez d'implémenter des interactions parent / enfant en utilisant d'abord les props standards et les interfaces emit.

<div class="composition-api">

Une exception ici est que les composants utilisant `<script setup>` sont **privés par défaut** : un composant parent faisant référence à un composant enfant en utilisant `<script setup>` n'aura accès à rien, à moins que le composant enfant choisisse d'exposer une interface publique via la macro `defineExpose` :

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

// Les macros de compilation, telle que defineExpose, n'ont pas besoin d'être importées
defineExpose({
  a,
  b
})
</script>
```

Lorsqu'un parent accède à une instance de ce composant via les refs du template, l'instance récupérée aura la forme suivante : `{ a: number, b: number }` (les refs sont automatiquement désenveloppées comme sur les instances classiques).

Voir aussi : [Typer les refs du template d'un composant](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

</div>
<div class="options-api">

L'option `expose` peut être utilisée afin de limiter l'accès à une instance du composant enfant :

```js
export default {
  expose: ['publicData', 'publicMethod'],
  data() {
    return {
      publicData: 'foo',
      privateData: 'bar'
    }
  },
  methods: {
    publicMethod() {
      /* ... */
    },
    privateMethod() {
      /* ... */
    }
  }
}
```

Dans l'exemple ci-dessus, un parent référençant ce composant via une ref du template n'aura pas accès à `publicData` et `publicMethod`.

</div>
