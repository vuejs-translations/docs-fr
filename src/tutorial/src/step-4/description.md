# Gestion des événements {#event-listeners}

Nous pouvons écouter les événements DOM en utilisant la directive `v-on` :

```vue-html
<button v-on:click="increment">{{ count }}</button>
```

De part son usage fréquent, `v-on` a également une syntaxe abrégée :

```vue-html
<button @click="increment">{{ count }}</button>
```

<div class="options-api">

Ici, `increment` fait référence à une fonction déclarée à l'aide de l'option `methods` :

<div class="sfc">

```js{7-12}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // met à jour le state du component
      this.count++
    }
  }
}
```

</div>
<div class="html">

```js{7-12}
createApp({
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // met à jour le state du component
      this.count++
    }
  }
})
```

</div>

À l'intérieur d'une méthode, nous pouvons accéder à l'instance du composant en utilisant `this`. L'instance du composant expose les propriétés déclarées par `data`. Nous pouvons mettre à jour l'état du composant en modifiant ces propriétés.

</div>

<div class="composition-api">

<div class="sfc">

Ici, `increment` fait référence à une fonction déclarée dans `<script setup>` :

```vue{6-9}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  // met à jour le state du component
  count.value++
}
</script>
```

</div>

<div class="html">

Ici, `increment` fait référence à une méthode dans l'objet retourné par `setup()` :

```js{$}
setup() {
  const count = ref(0)

  function increment(e) {
  // met à jour le state du component
    count.value++
  }

  return {
    count,
    increment
  }
}
```

</div>

A l'intérieur de la fonction, nous pouvons mettre à jour le state du composant en mutant les refs.

</div>

Les gestionnaires d'événements peuvent également utiliser des expressions inline, et peuvent simplifier des tâches courantes avec des modifiers. Davantage de détails dans <a target="_blank" href="/guide/essentials/event-handling.html">Guide - Gestion des événements</a>.

Maintenant, essayez d'implémenter vous-même la méthode `increment` <span class="options-api">méthode</span><span class="composition-api">fonction</span> et liez-la au bouton en utilisant `v-on`.
