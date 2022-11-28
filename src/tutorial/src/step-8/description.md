# Propriétés calculées {#computed-property}

Continuons à construire sur la liste des tâches de la dernière étape. Ici, nous avons déjà ajouté une fonctionnalité de basculement à chaque todo. Ceci est fait en ajoutant une propriété `done` à chaque objet todo, et en utilisant `v-model` pour la lier à une checkbox :

```vue-html{2}
<li v-for="todo in todos">
  <input type="checkbox" v-model="todo.done">
  ...
</li>
```

La prochaine amélioration que nous pouvons ajouter est de pouvoir cacher les tâches déjà terminées. Nous avons déjà un bouton qui bascule le state `hideCompleted`. Mais comment render les différents éléments de la liste en fonction de ce state ?

<div class="options-api">

Voici donc <a target="_blank" href="/guide/essentials/computed.html">la propriété calculée</a>. Nous pouvons déclarer une propriété qui est calculée de manière réactive à partir d'autres propriétés en utilisant l'option `computed` :

<div class="sfc">

```js
export default {
  // ...
  computed: {
    filteredTodos() {
      // retourne les todos filtrés en fonction de `this.hideCompleted`.
    }
  }
}
```

</div>
<div class="html">

```js
createApp({
  // ...
  computed: {
    filteredTodos() {
      // retourne les todos filtrés en fonction de `this.hideCompleted`.
    }
  }
})
```

</div>

</div>
<div class="composition-api">

Voici <a target="_blank" href="/guide/essentials/computed.html">`computed()`</a>. Nous pouvons créer une réf calculée qui calcule sa `.value` en fonction d'autres sources de données réactives :

<div class="sfc">

```js{8-11}
import { ref, computed } from 'vue'

const hideCompleted = ref(false)
const todos = ref([
  /* ... */
])

const filteredTodos = computed(() => {
  // retourne les todos filtrés en fonction de
  // `todos.value` et `hideCompleted.value`.
})
```

</div>
<div class="html">

```js{10-13}
import { createApp, ref, computed } from 'vue'

createApp({
  setup() {
    const hideCompleted = ref(false)
    const todos = ref([
      /* ... */
    ])

    const filteredTodos = computed(() => {
      // retourne les todos filtrés en fonction de
      // `todos.value` et `hideCompleted.value`.
    })

    return {
      // ...
    }
  }
})
```

</div>

</div>

```diff
- <li v-for="todo in todos">
+ <li v-for="todo in filteredTodos">
```

Une propriété calculée traque les autres states réactifs utilisés dans son calcul en tant que dépendances. Elle met en cache le résultat et le met automatiquement à jour lorsque ses dépendances changent.

Maintenant, essayez d'ajouter la propriété calculée `filteredTodos` et implémentez sa logique de calcul ! Si l'implémentation est correcte, cocher une tâche lors du masquage des éléments terminés devrait instantanément la masquer également.
