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
      answer: 'Questions usually contain a question mark. ;-)'
    }
  },
  watch: {
    // à chaque fois que question change, cette fonction sera exécutée
    question(newQuestion, oldQuestion) {
      if (newQuestion.includes('?')) {
        this.getAnswer()
      }
    }
  },
  methods: {
    async getAnswer() {
      this.answer = 'Thinking...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (error) {
        this.answer = 'Error! Could not reach the API. ' + error
      }
    }
  }
}
```

```vue-html
<p>
  Ask a yes/no question:
  <input v-model="question" />
</p>
<p>{{ answer }}</p>
```

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcXVlc3Rpb246ICcnLFxuICAgICAgYW5zd2VyOiAnUXVlc3Rpb25zIHVzdWFsbHkgY29udGFpbiBhIHF1ZXN0aW9uIG1hcmsuIDstKSdcbiAgICB9XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgLy8gd2hlbmV2ZXIgcXVlc3Rpb24gY2hhbmdlcywgdGhpcyBmdW5jdGlvbiB3aWxsIHJ1blxuICAgIHF1ZXN0aW9uKG5ld1F1ZXN0aW9uLCBvbGRRdWVzdGlvbikge1xuICAgICAgaWYgKG5ld1F1ZXN0aW9uLmluZGV4T2YoJz8nKSA+IC0xKSB7XG4gICAgICAgIHRoaXMuZ2V0QW5zd2VyKClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBhc3luYyBnZXRBbnN3ZXIoKSB7XG4gICAgICB0aGlzLmFuc3dlciA9ICdUaGlua2luZy4uLidcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL3llc25vLnd0Zi9hcGknKVxuICAgICAgICB0aGlzLmFuc3dlciA9IChhd2FpdCByZXMuanNvbigpKS5hbnN3ZXJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRoaXMuYW5zd2VyID0gJ0Vycm9yISBDb3VsZCBub3QgcmVhY2ggdGhlIEFQSS4gJyArIGVycm9yXG4gICAgICB9XG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5cbiAgICBBc2sgYSB5ZXMvbm8gcXVlc3Rpb246XG4gICAgPGlucHV0IHYtbW9kZWw9XCJxdWVzdGlvblwiIC8+XG4gIDwvcD5cbiAgPHA+e3sgYW5zd2VyIH19PC9wPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

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

// watch agit directement sur une ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexOf('?') > -1) {
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgd2F0Y2ggfSBmcm9tICd2dWUnXG5cbmNvbnN0IHF1ZXN0aW9uID0gcmVmKCcnKVxuY29uc3QgYW5zd2VyID0gcmVmKCdRdWVzdGlvbnMgdXN1YWxseSBjb250YWluIGEgcXVlc3Rpb24gbWFyay4gOy0pJylcblxud2F0Y2gocXVlc3Rpb24sIGFzeW5jIChuZXdRdWVzdGlvbikgPT4ge1xuICBpZiAobmV3UXVlc3Rpb24uaW5kZXhPZignPycpID4gLTEpIHtcbiAgICBhbnN3ZXIudmFsdWUgPSAnVGhpbmtpbmcuLi4nXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL3llc25vLnd0Zi9hcGknKVxuICAgICAgYW5zd2VyLnZhbHVlID0gKGF3YWl0IHJlcy5qc29uKCkpLmFuc3dlclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhbnN3ZXIudmFsdWUgPSAnRXJyb3IhIENvdWxkIG5vdCByZWFjaCB0aGUgQVBJLiAnICsgZXJyb3JcbiAgICB9XG4gIH1cbn0pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5cbiAgICBBc2sgYSB5ZXMvbm8gcXVlc3Rpb246XG4gICAgPGlucHV0IHYtbW9kZWw9XCJxdWVzdGlvblwiIC8+XG4gIDwvcD5cbiAgPHA+e3sgYW5zd2VyIH19PC9wPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

### Les types de sources de watch {#watch-source-types}

Le premier argument de `watch` peut être différents types de "sources" réactives : ça peut être une ref (y compris des refs calculées), un objet réactif, une fonction accesseur, ou un tableau de différentes sources :

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
  console.log(`count is: ${count}`)
})
```

À la place, utilisez un accesseur :

```js
// à la place, utilisez un accesseur :
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
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

:::warning À utiliser avec précaution
Les observateurs profonds nécessitent de traverser toutes les propriétés imbriquées de l'objet observé, et peuvent être consommateur de ressources lorsqu'ils sont utilisés sur des structures importantes de données. Utilisez les seulement si nécessaire, en ayant conscience des implications en matière de performances.
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
watch(source, (newValue, oldValue) => {
  // exécuté immédiatement, à nouveau quand la `source` changera
}, { immediate: true })
```

</div>

<div class="composition-api">

## `watchEffect()` \*\* {#watcheffect}

Il est commun pour la fonction de l'observateur d'utiliser exactement le même état réactif comme source. Par exemple, considérez le code suivant, qui utiliser un observateur pour charger une ressource distante à chaque changement de la ref `todoId` :

```js
const todoId = ref(1)
const data = ref(null)

watch(todoId, async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
}, { immediate: true })
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

## Timing de nettoyage des rappels {#callback-flush-timing}

Lorsque vous mutez un état réactif, cela peut déclencher à la fois la mise à jour des composants Vue et des rappels d'observateur que vous avez créés.

Par défaut, les rappels des observateurs créés par les utilisateurs sont appelés **avant** la mise à jour des composants Vue. Cela signifie que si vous essayez d'accéder au DOM pendant le rappel d'un observateur, le DOM sera dans l'état d'avant la mise à jour de Vue.

Si vous voulez accéder au DOM **après** après que Vue l'ait mis à jour, vous devez spécifier l'option `flush: 'post'` :

<div class="options-api">

```js
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

```js
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
