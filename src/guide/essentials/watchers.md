# Observateurs {#watchers}

## Exemple Basique {#basic-example}

Les propriétés calculées nous permettent de calculer des valeurs dérivées de manière déclarative. Toutefois, il y a des cas dans lesquels nous devons réaliser des "effets de bord" en réaction aux changements de l'état - par exemple, muter le DOM, ou changer une autre partie de l'état en fonction du résultat d'une opération asynchrone.

<div class="options-api">

Avec l'Options API, on peut utiliser l'[option `watch`](/api/options-state#watch) pour déclencher une fonction chaque fois qu'une propriété réactive change :

```js
export default {
  data() {
    return {
      question: '',
      answer: 'Questions usually contain a question mark. ;-)',
      loading: false
    }
  },
  watch: {
    // à chaque fois que question change, cette fonction sera exécutée
    question(newQuestion) {
      if (newQuestion.includes('?')) {
        this.getAnswer()
      }
    }
  },
  methods: {
    async getAnswer() {
      this.loading = true
      this.answer = 'Thinking...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (error) {
        this.answer = 'Error! Could not reach the API. ' + error
      } finally {
        this.loading = false
      }
    }
  }
}
```

```vue-html
<p>
  Ask a yes/no question:
  <input v-model="question" :disabled="loading" />
</p>
<p>{{ answer }}</p>
```

[Essayer en ligne](https://play.vuejs.org/#eNp9VE1v2zAM/SucLnaw1D70lqUbsiKH7rB1W4++aDYdq5ElTx9xgiD/fbT8lXZFAQO2+Mgn8pH0mW2aJjl4ZCu2trkRjfucKTw22jgosOReOjhnCqDgjseL/hvAoPNGjSeAvx6tE1qtIIqWo5Er26Ih088BteCt51KeINfKcaGAT5FQc7NP4NPNYiaQmhdC7VZQcmlxMF+61yUcWu7yajVmkabQVqjwgGZmzSuudmiX4CphofQqD+ZWSAnGqz5y9I4VtmOuS9CyGA9T3QCihGu3RKhc+gJtHH2JFld+EG5Mdug2QYZ4MSKhgBd11OgqXdipEm5PKoer0Jk2kA66wB044/EF1GtOSPRUCbUnryRJosnFnK4zpC5YR7205M9bLhyUSIrGUeVcY1dpekKrdNK6MuWNiKYKXt8V98FElDxbknGxGLCpZMi7VkGMxmjzv0pz1tvO4QPcay8LULoj5RToKoTN40MCEXyEQDJTl0KFmXpNOqsUxudN+TNFzzqdJp8ODutGcod0Alg34QWwsXsaVtIjVXqe9h5bC9V4B4ebWhco7zI24hmDVSEs/yOxIPOQEFnTnjzt2emS83nYFrhcevM6nRJhS+Ys9aoUu6Av7WqoNWO5rhsh0fxownplbBqhjJEmuv0WbN2UDNtDMRXm+zfsz/bY2TL2SH1Ec8CMTZjjhqaxh7e/v+ORvieQqvaSvN8Bf6HV0veSdG5fvSoo7Su/kO1D3f13SKInuz06VHYsahzzfl0yRj+s+3dKn9O9TW7HPrPLP624lFU=)

L'option `watch` supporte également comme clé un chemin délimité par des points :

```js
export default {
  watch: {
    // Remarque : seulement des chemins simples. Les expressions ne sont pas supportées.
    'some.nested.key'(newValue) {
      // ...
    }
  }
}
```

</div>

<div class="composition-api">

Avec la Composition API, nous pouvons utiliser la [fonction `watch`](/api/reactivity-core#watch) pour déclencher une fonction de rappel chaque fois qu'une partie d'un état réactif change :

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')
const loading = ref(false)

// watch agit directement sur une ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexOf('?')) {
    loading.value = true
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" :disabled="loading" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[Essayer en ligne](https://play.vuejs.org/#eNp9U8Fy0zAQ/ZVFF9tDah96C2mZ0umhHKBAj7oIe52oUSQjyXEyGf87KytyoDC9JPa+p+e3b1cndtd15b5HtmQrV1vZeXDo++6Wa7nrjPVwAovtAgbh6w2M0Fqzg4xOZFxzXRvtPPzq0XlpNNwEbp5lRUKEdgPaVP925jnoXS+UOgKxvJAaxEVjJ+y2hA9XxUVFGdFIvT7LtEI5JIzrqjrbGozdOmikxdqTKqmIQOV6gvOkvQDhjrqGXOOQvCzAqCa9FHBzCyeuAWT7F6uUulZ9gy7PPmZFETmQjJV7oXoke972GJHY+Axkzxupt4FalhRcYHh7TDIQcqA+LTriikFIDy0G59nG+84tq+qITpty8G0lOhmSiedefSaPZ0mnfHFG50VRRkbkj1BPceVorbFzF/+6fQj4O7g3vWpAm6Ao6JzfINw9PZaQwXuYNJJuK/U0z1nxdTLT0M7s8Ec/I3WxquLS0brRi8ddp4RHegNYhR0M/Du3pXFSAJU285osI7aSuus97K92pkF1w1nCOYNlI534qbCh8tkOVasoXkV1+sjplLZ0HGN5Vc1G2IJ5R8Np5XpKlK7J1CJntdl1UqH92k0bzdkyNc8ZRWGGz1MtbMQi1esN1tv/1F/cIdQ4e6LJod0jZzPmhV2jj/DDjy94oOcZpK57Rew3wO/ojOpjJIH2qdcN2f6DN7l9nC47RfTsHg4etUtNpZUeJz5ndPPv32j9Yve6vE6DZuNvu1R2Tg==)

### Les types de sources de watch {#watch-source-types}

Le premier argument de `watch` peut être différents types de "sources" réactives : ça peut être une ref (y compris des refs calculées), un objet réactif, une fonction [accesseur](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description), ou un tableau de différentes sources :

```js
const x = ref(0)
const y = ref(0)

// simple ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// accesseur
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// tableau de différentes sources
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

Notez que vous ne pouvez pas observer une propriété d'un objet réactif de cette manière :

```js
const obj = reactive({ count: 0 })

// cela ne fonctionnera pas car on passe un nombre à watch()
watch(obj.count, (count) => {
  console.log(`Count est égal à: ${count}`)
})
```

À la place, utilisez un accesseur :

```js
// à la place, utilisez un accesseur :
watch(
  () => obj.count,
  (count) => {
    console.log(`Count est égal à: ${count}`)
  }
)
```

</div>

## Observateurs profonds {#deep-watchers}

<div class="options-api">

`watch` est par défaut superficiel : la fonction de rappel ne sera déclenchée que lorsque la propriété observée se verra assigner une nouvelle valeur - elle ne sera pas déclenchée lors du changement d'une propriété imbriquée. Si vous voulez que la fonction de rappel s'exécute à chaque mutation imbriquée, vous devez utiliser un observateur profond :

```js
export default {
  watch: {
    someObject: {
      handler(newValue, oldValue) {
        // Remarque: `newValue` sera égale à `oldValue` ici
        // à chaque mutation imbriquée tant que l'objet lui-même
        // n'a pas été remplacé.
      },
      deep: true
    }
  }
}
```

</div>

<div class="composition-api">

Lorsque vous appelez `watch()` directement sur un objet réactif, un observateur profond va implicitement être créé - la fonction de rappel sera déclenchée à chaque mutation imbriquée :

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // exécution à chaque mutation d'une propriété imbriquée
  // Remarque : `newValue` sera égale à `oldValue` ici
  // car elles pointent toutes les deux sur le même objet !
})

obj.count++
```

Il ne faut pas confondre avec un accesseur qui retourne un objet réactif - dans ce dernier cas, la fonction de rappel ne sera exécutée que si l'accesseur retourne un objet différent :

```js
watch(
  () => state.someObject,
  () => {
    // exécution seulement lorsque state.someObject est remplacé
  }
)
```

Toutefois, vous pouvez transformer ce second cas en un observateur profond en utilisant explicitement l'option `deep` :

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // Remarque : `newValue` sera égale à `oldValue` ici
    // *sauf si* state.someObject a été remplacé
  },
  { deep: true }
)
```

</div>

À partir de la version 3.5, l'option `deep` peut aussi être un nombre indiquant la profondeur maximale à traverser, c'est-à-dire de combien de niveaux Vue traverse un objet avec des propriétés imbriquées.

:::warning À utiliser avec précaution
Les observateurs profonds nécessitent de traverser toutes les propriétés imbriquées de l'objet observé, et peuvent être consommateurs de ressources lorsqu'ils sont utilisés sur des structures importantes de données. Utilisez-les seulement si nécessaire, en ayant conscience des implications en matière de performances.
:::

## Les observateurs impatients {#eager-watchers}

`watch` fonctionne à la volée par défaut : la fonction de rappel ne sera pas appelée tant que la source observée n'aura pas changé. Mais dans certains cas, on peut souhaiter que cette même logique de rappel soit exécutée de manière précoce - par exemple, on peut vouloir récupérer des données initiales, puis les récupérer de nouveau chaque fois qu'un état pertinent change.

<div class="options-api">

Nous pouvons forcer la fonction de rappel d'un observateur à être exécutée immédiatement en la déclarant via un objet avec une fonction de gestion et l'option `immediate: true` :

```js
export default {
  // ...
  watch: {
    question: {
      handler(newQuestion) {
        // cela sera exécuté immédiatement à la création du composant
      },
      // force l'exécution précoce de la fonction de rappel
      immediate: true
    }
  }
  // ...
}
```

L'exécution initiale d'une fonction de gestion aura lieu juste avant le hook `created`. Vue aura déjà traité les options `data`, `computed`, et `méthodes`, donc ces propriétés seront disponibles à la première invocation.

</div>

<div class="composition-api">

Nous pouvons forcer l'exécution immédiate d'un observateur en passant l'option `immediate: true` :

```js
watch(
  source,
  (newValue, oldValue) => {
    // execution immédiate, puis à chaque fois que `source` change
  },
  { immediate: true }
)
```

</div>

## Observateurs unitaires {#once-watchers}

- Supporté à partir de la version 3.4

La fonction de rappel de l'observateur sera exécutée dès lors qu'une source observée change. Si vous voulez que la fonction de rappel soit déclenchée une seule fois quand il y a un changement, utilisez l'option `once: true`.

<div class="options-api">

```js
export default {
  watch: {
    source: {
      handler(newValue, oldValue) {
        // quand `source` change, déclenchée une seule fois
      },
      once: true
    }
  }
}
```

</div>

<div class="composition-api">

```js
watch(
  source,
  (newValue, oldValue) => {
    // quand `source` change, déclenchée une seule fois
  },
  { once: true }
)
```

</div>

<div class="composition-api">

## `watchEffect()` \*\* {#watcheffect}

Il est commun pour la fonction de l'observateur d'utiliser exactement le même état réactif comme source. Par exemple, considérez le code suivant, qui utilise un observateur pour charger une ressource distante à chaque changement de la ref `todoId` :

```js
const todoId = ref(1)
const data = ref(null)

watch(
  todoId,
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    data.value = await response.json()
  },
  { immediate: true }
)
```

En particulier, remarquez comment l'observateur utilise doublement `todoId`, une fois comme source, ensuite à nouveau à l'intérieur de la fonction.

Cela peut être simplifié par [`watchEffect()`](/api/reactivity-core#watcheffect). `watchEffect()` nous permet d'effectuer des effets de bord immédiatement tout en traquant automatiquement les dépendances réactives de cet effet. L'exemple précédent peut être réécrit de la sorte :

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

Ici, la fonction sera exécutée immédiatement, il n'y a pas besoin de spécifier `immediate : true`. Pendant son exécution, elle suivra automatiquement `todoId.value` comme une dépendance (similaire aux propriétés calculées). Chaque fois que `todoId.value` change, la fonction sera exécutée à nouveau. Avec `watchEffect()`, nous n'avons plus besoin de passer explicitement `todoId` comme source.

Vous pouvez vous référer à [cet exemple](/examples/#fetching-data) avec `watchEffect` et une récupération de données en action.

Pour des exemples comme ceux-ci, avec une seule dépendance, le bénéfice de `watchEffect()` est relativement faible. Mais pour les surveillances qui ont plusieurs dépendances, l'utilisation de `watchEffect()` supprime la charge de maintenir la liste des dépendances manuellement. De plus, si vous devez surveiller plusieurs propriétés dans une structure de données imbriquée, `watchEffect()` peut s'avérer plus efficace qu'un observateur profond, car il ne suivra que les propriétés qui sont utilisées dans la fonction, plutôt que de les suivre toutes de manière récursive.

:::tip
`watchEffect` traque les dépendances seulement pendant son exécution **synchrone**. Lorsque vous l'utilisez avec un rappel asynchrone, seules les propriétés accédées avant le premier événement `await` seront traquées.
:::

### `watch` vs. `watchEffect` {#watch-vs-watcheffect}

`watch` et `watchEffect` permettent tous les deux de réaliser des effets de bord. Leur principale différence réside dans la manière dont ils traquent leurs dépendances réactives :

- `watch` traque seulement la source explicitement observée . De plus, le rappel n'est déclenché que lorsque la source a bien changé. `watch` sépare la traque des dépendances et les effets de bord, ce qui nous donne plus de contrôle sur le moment où le rappel doit être exécuté.

- `watchEffect`, d'un autre côté, combine la traque des dépendances et les effets de bord en une phase. Il traque automatiquement chaque propriété réactive accédée durant son exécution synchrone. Cela est plus pratique et rend généralement le code plus concis, mais rend les dépendances réactives moins explicites.

</div>

## Nettoyage des effets de bord {#side-effect-cleanup}

Parfois, nous pouvons effectuer des effets secondaires, par exemple des requêtes asynchrones, dans un observateur :

<div class="composition-api">

```js
watch(id, (newId) => {
  fetch(`/api/${newId}`).then(() => {
    // logique de rappel
  })
})
```

</div>
<div class="options-api">

```js
export default {
  watch: {
    id(newId) {
      fetch(`/api/${newId}`).then(() => {
        // logique de rappel
      })
    }
  }
}
```

</div>

Mais que se passe-t-il si `id` change avant que la requête ne soit terminée ? Lorsque la requête précédente se termine, elle déclenche toujours le callback avec une valeur d'ID qui est déjà périmée. Idéalement, nous voulons pouvoir annuler la requête périmée lorsque `id` change pour une nouvelle valeur.

Nous pouvons utiliser l'API [`onWatcherCleanup()`](/api/reactivity-core#onwatchercleanup) <sup class="vt-badge" data-text="3.5+" /> pour enregistrer une fonction de nettoyage qui sera appelée lorsque l'observateur est invalidé et sur le point d'être réexécuté :

<div class="composition-api">

```js {10-13}
import { watch, onWatcherCleanup } from 'vue'

watch(id, (newId) => {
  const controller = new AbortController()

  fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {
    // logique de rappel
  })

  onWatcherCleanup(() => {
    // annuler la demande périmée
    controller.abort()
  })
})
```

</div>
<div class="options-api">

```js {12-15}
import { onWatcherCleanup } from 'vue'

export default {
  watch: {
    id(newId) {
      const controller = new AbortController()

      fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {
        // logique de rappel
      })

      onWatcherCleanup(() => {
        // annuler la demande périmée
        controller.abort()
      })
    }
  }
}
```

</div>

Notez que `onWatcherCleanup` n'est supporté que dans Vue 3.5+ et doit être appelé pendant l'exécution synchrone d'une fonction d'effet `watchEffect` ou d'une fonction de callback `watch` : vous ne pouvez pas l'appeler après une instruction `await` dans une fonction asynchrone.

Alternativement, une fonction `onCleanup` est également transmise aux callbacks des observateurs en tant que troisième argument<span class="composition-api">, et à la fonction d'effet `watchEffect` en tant que premier argument</span>:

<div class="composition-api">

```js
watch(id, (newId, oldId, onCleanup) => {
  // ...
  onCleanup(() => {
    // logique de rappel
  })
})

watchEffect((onCleanup) => {
  // ...
  onCleanup(() => {
    // logique de rappel
  })
})
```

</div>
<div class="options-api">

```js
export default {
  watch: {
    id(newId, oldId, onCleanup) {
      // ...
      onCleanup(() => {
        // logique de rappel
      })
    }
  }
}
```

</div>

Cela fonctionne dans les versions antérieures à la 3.5. De plus, `onCleanup` passé en argument de la fonction est lié à l'instance de l'observateur et n'est donc pas soumis à la contrainte de synchronisation de `onWatcherCleanup`.

## Timing de nettoyage des rappels {#callback-flush-timing}

Lorsque vous mutez un état réactif, cela peut déclencher à la fois la mise à jour des composants Vue et des rappels d'observateur que vous avez créés.

Comme pour les mises à jour de composants, les rappels de l'observateur créés par l'utilisateur sont regroupés afin d'éviter les invocations en double. Par exemple, nous ne voulons probablement pas qu'un observateur se déclenche mille fois si nous introduisons de manière synchrone mille éléments dans un tableau observé.

Par défaut, le rappel d'un observateur est appelé **après** les mises à jour du composant parent (le cas échéant), et **avant** les mises à jour du DOM du composant propriétaire. Cela signifie que si vous tentez d'accéder au DOM du composant propriétaire à l'intérieur d'un callback de l'observateur, le DOM sera dans un état de pré-mise à jour.

### Observateurs à posterio {#post-watchers}

Si vous voulez accéder au DOM **après** que Vue l'ait mis à jour, vous devez spécifier l'option `flush: 'post'` :

<div class="options-api">

```js{6}
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'post'
    }
  }
}
```

</div>

<div class="composition-api">

```js{2,6}
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

Le `watchEffect()` "post-flush" a également un pseudonyme de confort, `watchPostEffect()`:

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* exécution après la mise à jour de Vue */
})
```

</div>

### Observateurs synchrones {#sync-watchers}

Il est également possible de créer un observateur qui se déclenche de manière synchrone, avant toute mise à jour gérée par Vue.

<div class="options-api">

```js{6}
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'sync'
    }
  }
}
```

</div>

<div class="composition-api">

```js{2,6}
watch(source, callback, {
  flush: 'sync'
})

watchEffect(callback, {
  flush: 'sync'
})
```

Sync `watchEffect()` a également un alias de commodité, `watchSyncEffect()` :

```js
import { watchSyncEffect } from 'vue'

watchSyncEffect(() => {
  /* exécuté de manière synchrone lors d'une modification réactive des données */
})
```

</div>

:::warning A utiliser avec précaution
Les observateurs synchrones n'ont pas de fonction de mise en lot et se déclenchent à chaque fois qu'une mutation réactive est détectée. Il est possible de les utiliser pour surveiller de simples valeurs booléennes, mais il faut éviter de les utiliser sur des sources de données qui peuvent être mutées plusieurs fois de manière synchrone, par exemple des tableaux.
:::

<div class="options-api">

## `this.$watch()` \* {#this-watch}

Il est également possible de créer des observateurs de manière impérative en utilisant [la méthode d'instance `$watch()`](/api/component-instance#watch):

```js
export default {
  created() {
    this.$watch('question', (newQuestion) => {
      // ...
    })
  }
}
```

Cela est utile lorsque vous avez besoin de paramétrer un observateur de manière conditionnelle, ou de seulement observer quelque chose en réponse à une interaction de l'utilisateur. Cela vous permet également d'arrêter l'observateur précocement.

</div>

## Arrêter un observateur {#stopping-a-watcher}

<div class="options-api">

Les observateurs déclarés via l'option `watch` ou la méthode d'instance `$watch()` sont automatiquement arrêtés lorsque le composant propriétaire est démonté, donc dans la plupart des cas vous n'avez pas à vous soucier d'arrêter les observateurs vous-même.

Dans les rares cas où vous auriez besoin d'arrêter un observateur avant que le composant propriétaire ne soit démonté, l'API `$watch()` retourne une fonction permettant de le faire :

```js
const unwatch = this.$watch('foo', callback)

// ...lorsque l'observateur n'est plus nécessaire :
unwatch()
```

</div>

<div class="composition-api">

Les observateurs déclarés de manière synchrone à l'intérieur de `setup()` ou `<script setup>` sont liés à l'instance du composant propriétaire, et seront automatiquement arrêtés lorsque ce dernier sera démonté. Dans la plupart des cas, vous n'avez pas à vous soucier d'arrêter les observateurs vous-même.

La clé ici est que l'observateur doit être créé de **manière synchrone** : si l'observateur est créé dans un rappel asynchrone, il ne sera pas lié au composant propriétaire et devra être arrêté manuellement afin d'éviter des fuites de mémoire. Voici un exemple :

```vue
<script setup>
import { watchEffect } from 'vue'

// celui-ci sera automatiquement arrêté
watchEffect(() => {})

// ...celui-là non!
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

Pour arrêter manuellement un observateur, utilisez la fonction de gestion qu'il retourne. Cela fonctionne pour `watch` et pour `watchEffect`:

```js
const unwatch = watchEffect(() => {})

// ...plus tard, lorsqu'il n'est plus nécessaire
unwatch()
```

Notez que les cas où vous devriez être amenés à créer des observateurs de manière asynchrone sont rares, et une création synchrone devrait être choisie lorsque c'est possible. Si vous devez attendre des données asynchrones, vous pouvez intégrer votre logique d'observation dans une condition :

```js
// données à récupérer de manière asynchrone
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // on fait quelque chose lorsque les données sont chargées
  }
})
```

</div>
