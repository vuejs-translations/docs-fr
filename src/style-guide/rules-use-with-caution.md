# Règles de priorité D: À utiliser avec précaution {#priority-d-rules-use-with-caution}

::: warning Note
Ce guide de style Vue.js est obsolète et doit être revu. Si vous avez des questions ou des suggestions, veuillez [ouvrir une issue](https://github.com/vuejs/docs/issues/new).
:::

Certaines fonctionnalités de Vue existent pour prévoir de rares cas particuliers ou des migrations plus douces depuis une base de code héritée. Toutefois, lorsqu'elles sont surexploitées, elles peuvent rendre le code plus difficile à maintenir ou même devenir une source de bugs. Ces règles mettent en lumière ces fonctionnalités potentiellement risquées, en décrivant quand et pourquoi elles devraient être évitées.

## Sélecteurs d'éléments avec `scoped` {#element-selectors-with-scoped}

**Les sélecteurs d'éléments ne devraient pas être utilisés avec `scoped`.**

Préférez les sélecteurs de classes aux sélecteurs d'éléments dans les styles `scoped`, parce qu'un grand nombre de sélecteurs d'éléments sont lents.

::: details Explications détaillées
Pour limiter la portée des styles, Vue ajoute un attribut unique aux éléments des composants, tel que `data-v-f3f3eg9`. Les sélecteurs sont ensuite modifiés de manière à ce que seuls les éléments correspondant à cet attribut soient sélectionnés (par exemple `button[data-v-f3f3eg9]`).

Le problème est qu'un large nombre de sélecteurs d'éléments-attributs (par exemple `button[data-v-f3f3eg9]`) sera considérablement plus lent que des sélecteurs de classes-attributs (par exemple `.btn-close[data-v-f3f3eg9]`), donc les sélecteurs de classes doivent être privilégiés lorsque c'est possible.
:::

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```vue-html
<template>
  <button>×</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```

</div>

## Communication parent-enfant implicite {#implicit-parent-child-communication}

**Les props et les événements doivent être privilégiés pour la communication entre les composants parent-enfant, plutôt que `this.$parent` ou les props mutants.**

Une application Vue idéale est composée de flux de props vers le bas, et d'événements vers le haut. Respecter cette convention rendra vos composants beaucoup plus faciles à comprendre. Cependant, il existe des cas limites où la mutation de prop ou `this.$parent` peuvent simplifier deux composants déjà profondément couplés.

Le problème, c'est qu'il existe aussi de nombreux cas _simples_ où ces modèles peuvent être pratiques. Attention : ne vous laissez pas séduire par l'idée d'échanger la simplicité (être capable de comprendre le flux de votre état) contre la commodité à court terme (écrire moins de code).

<div class="options-api">

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: '<input v-model="todo.text">'
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeTodo() {
      this.$parent.todos = this.$parent.todos.filter(
        (todo) => todo.id !== vm.todo.id
      )
    }
  },

  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        ×
      </button>
    </span>
  `
})
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['input'],

  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['delete'],

  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        ×
      </button>
    </span>
  `
})
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>Bad</h3>

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <input v-model="todo.text" />
</template>
```

```vue
<script setup>
import { getCurrentInstance } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const instance = getCurrentInstance()

function removeTodo() {
  const parent = instance.parent
  if (!parent) return

  parent.props.todos = parent.props.todos.filter((todo) => {
    return todo.id !== props.todo.id
  })
}
</script>
<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo">×</button>
  </span>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>Good</h3>

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['input'])
</script>

<template>
  <input :value="todo.text" @input="emit('input', $event.target.value)" />
</template>
```

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="emit('delete')">×</button>
  </span>
</template>
```

</div>

</div>
