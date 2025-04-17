# Les refs du template {#template-refs}

Bien que le modèle de rendu déclaratif de Vue fasse abstraction pour vous de la plupart des opérations directes sur le DOM, il peut tout de même y avoir des cas où nous avons besoin d'accéder aux éléments sous-jacents du DOM. Pour ce faire, nous pouvons utiliser l'attribut spécial `ref`:

```vue-html
<input ref="input">
```

`ref` est un attribut spécial, semblable à l'attribut `key` évoqué dans le chapitre `v-for`. Il nous permet d'obtenir une référence directe à un élément spécifique du DOM ou à une instance d'un composant enfant une fois qu'il a été monté. Cela peut être utile lorsque vous voulez, par exemple, vous concentrer de manière programmatique sur une entrée lors du montage d'un composant, ou bien initialiser une librairie tierce sur un élément.

## Accéder aux refs {#accessing-the-refs}

<div class="composition-api">

Pour obtenir la référence avec l'API Composition, nous pouvons utiliser le helper [`useTemplateRef()`](/api/composition-api-helpers#usetemplateref) <sup class="vt-badge" data-text="3.5+" />:

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

// le premier argument doit correspondre à la valeur ref dans le template
const input = useTemplateRef('my-input')

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="my-input" />
</template>
```

Lorsque vous utilisez TypeScript, le support IDE de Vue et `vue-tsc` déduiront automatiquement le type de `input.value` en fonction de l'élément ou du composant sur lequel l'attribut `ref` correspondant est utilisé.

<details>
<summary>Utilisation avant 3.5</summary>

Dans les versions antérieures à la 3.5 où `useTemplateRef()` n'a pas été introduit, nous devons déclarer une ref avec un nom qui correspond à la valeur de l'attribut template ref :

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

Si vous n'utilisez pas `<script setup>`, assurez vous également de retourner la ref depuis `setup()` :

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

</details>

</div>
<div class="options-api">

La ref correspondante est accessible via `this.$refs` :

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

Notez que vous ne pouvez accéder à la ref **qu'après que le composant ait été monté.** Si vous essayez d'accéder à <span class="options-api">`$refs.input`</span><span class="composition-api">`input`</span> via une expression dans le template, ça sera <span class="options-api">`undefined`</span><span class="composition-api">`null`</span> lors du premier rendu. C'est parce que l'élément n'existe pas avant la fin du premier rendu !

<div class="composition-api">

Si vous essayez d'observer les changements d'une ref du template, assurez vous de prendre en compte le cas où la ref a une valeur `null` :

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // pas encore monté ou l'élément a été démonté (par ex. par v-if)
  }
})
```

Voir aussi : [Typer les refs du template](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />

</div>

## Ref sur un composant {#ref-on-component}

> Cette section considère [les composants](/guide/essentials/component-basics) comme acquis. N'hésitez pas à la passer et revenir plus tard.

`ref` peut également être utilisée sur un composant enfant. Dans ce cas la référence sera celle d'une instance du composant :

<div class="composition-api">

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'
import Child from './Child.vue'

const childRef = useTemplateRef('child')

onMounted(() => {
  // childRef.value contiendra une instance de <Child />
})
</script>

<template>
  <Child ref="child" />
</template>
```

<details>
<summary>Utilisation avant 3.5</summary>

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

</details>

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

Notez que defineExpose doit être appelé avant toute opération await. Sinon, les propriétés et les méthodes exposées après l'opération await ne seront pas accessibles.

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

## Refs à l'intérieur d'un `v-for` {#refs-inside-v-for}

> Requiert v3.5 ou ultérieure

<div class="composition-api">

Lorsque `ref` est utilisée à l'intérieur d'un `v-for`, la ref correspondante doit contenir un tableau, qui sera alimenté avec les éléments après le montage :

```vue
<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = useTemplateRef('items')

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Essayer en ligne](https://play.vuejs.org/#eNp9UsluwjAQ/ZWRLwQpDepyQoDUIg6t1EWUW91DFAZq6tiWF4oU5d87dtgqVRyyzLw3b+aN3bB7Y4ptQDZkI1dZYTw49MFMuBK10dZDAxZXOQSHC6yNLD3OY6zVsw7K4xJaWFldQ49UelxxVWnlPEhBr3GszT6uc7jJ4fazf4KFx5p0HFH+Kme9CLle4h6bZFkfxhNouAIoJVqfHQSKbSkDFnVpMhEpovC481NNVcr3SaWlZzTovJErCqgydaMIYBRk+tKfFLC9Wmk75iyqg1DJBWfRxT7pONvTAZom2YC23QsMpOg0B0l0NDh2YjnzjpyvxLrYOK1o3ckLZ5WujSBHr8YL2gxnw85lxEop9c9TynkbMD/kqy+svv/Jb9wu5jh7s+jQbpGzI+ZLu0byEuHZ+wvt6Ays9TJIYl8A5+i0DHHGjvYQ1JLGPuOlaR/TpRFqvXCzHR2BO5iKg0Zmm/ic0W2ZXrB+Gve2uEt1dJKs/QXbwePE)

<details>
<summary>Utilisation avant 3.5</summary>

Dans les versions antérieurs à la 3.5 où `useTemplateRef()` n'était pas encore introduit, nous devions déclarer une ref avec un nom qui corresponde à la valeur de l'attribut ref du template. La ref devait également contenir un valeur sous forme de tableau :

In versions before 3.5 where `useTemplateRef()` was not introduced, we need to declare a ref with a name that matches the template ref attribute's value. The ref should also contain an array value:

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

</details>

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

[Essayer en ligne](https://play.vuejs.org/#eNpFjk0KwjAQha/yCC4Uaou6kyp4DuOi2KkGYhKSiQildzdNa4WQmTc/37xeXJwr35HEUdTh7pXjszT0cdYzWuqaqBm9NEDbcLPeTDngiaM3PwVoFfiI667AvsDhNpWHMQzF+L9sNEztH3C3JlhNpbaPNT9VKFeeulAqplfY5D1p0qurxVQSqel0w5QUUEedY8q0wnvbWX+SYgRAmWxIiuSzm4tBinkc6HvkuSE7TIBKq4lZZWhdLZfE8AWp4l3T)

</div>

À noter que le tableau ref ne garantit **pas** le même ordre que celui du tableau source.

## Les fonctions refs {#function-refs}

Au lieu d'une chaîne de caractères comme clé, l'attribut `ref` peut également être lié à une fonction, qui sera appelée à chaque mise à jour du composant et vous donne une flexibilité totale sur l'endroit où stocker la référence à l'élément. La fonction reçoit la référence à l'élément comme premier argument :

```vue-html
<input :ref="(el) => { /* assigne l'élément à une propriété ou à une ref */ }">
```

Notez l'utilisation d'une liaison dynamique `:ref` permettant de passer une fonction au lieu d'un nom de ref en chaîne de caractères. Lorsque l'élément est démonté, l'argument sera `null`. Vous pouvez, bien entendu, utiliser une méthode au lieu d'une fonction en une ligne.