# Emits {#emits}

En plus de recevoir des props, un composant enfant peut également émettre des événements vers le parent :

<div class="composition-api">
<div class="sfc">

```vue
<script setup>
// déclare les événements émis
const emit = defineEmits(['response'])

// emit avec un argument
emit('response', "hello à partir de l'enfant")
</script>
```

</div>

<div class="html">

```js
export default {
  // déclare les événements émis
  emits: ['response'],
  setup(props, { emit }) {
    // emit avec un argument
    emit('response', "hello à partir de l'enfant")
  }
}
```

</div>

</div>

<div class="options-api">

```js
export default {
  // déclare les événements émis
  emits: ['response'],
  created() {
    // emit avec un argument
    this.$emit('response', "hello à partir de l'enfant")
  }
}
```

</div>

Le premier argument passé à <span class="options-api">`this.$emit()`</span><span class="composition-api">`emit()`</span> est le nom de l'événement. Tout argument supplémentaire est transmis à l'event listener.

Le parent peut écouter les événements émis par l'enfant en utilisant `v-on` - ici le gestionnaire reçoit l'argument supplémentaire de l'emit de l'enfant et l'assigne au state local :

<div class="sfc">

```vue-html
<ChildComp @response="(msg) => childMsg = msg" />
```

</div>
<div class="html">

```vue-html
<child-comp @response="(msg) => childMsg = msg"></child-comp>
```

</div>

Essayez maintenant de le faire vous-même dans l'éditeur.
