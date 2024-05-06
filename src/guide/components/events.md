<script setup>
import { onMounted } from 'vue'

if (typeof window !== 'undefined') {
  const hash = window.location.hash

  // The docs for v-model used to be part of this page. Attempt to redirect outdated links.
  if ([
    '#usage-with-v-model',
    '#v-model-arguments',
    '#multiple-v-model-bindings',
    '#handling-v-model-modifiers'
  ].includes(hash)) {
    onMounted(() => {
      window.location = './v-model.html' + hash
    })
  }
}
</script>

# Les événements de composant {#component-events}

> Cette page suppose que vous avez déjà lu les [principes fondamentaux des composants](/guide/essentials/component-basics). Lisez-les d'abord si vous débutez avec les composants.

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/defining-custom-events-emits" title="Free Vue.js Lesson on Defining Custom Events (EN)"/>
</div>

## Émettre et écouter des événements {#emitting-and-listening-to-events}

Un composant peut émettre des événements personnalisés directement à partir du template (par exemple, dans un gestionnaire d'événement `v-on`) à l'aide de la méthode native `$emit` :

```vue-html
<!-- MyComponent -->
<button @click="$emit('someEvent')">Cliquez-Moi</button>
```

<div class="options-api">

La méthode `$emit()` est également disponible sur l'instance du composant avec `this.$emit()` :

```js
export default {
  methods: {
    submit() {
      this.$emit('someEvent')
    }
  }
}
```

</div>

Le composant parent peut alors l'écouter en utilisant `v-on` :

```vue-html
<MyComponent @some-event="callback" />
```

Le modificateur `.once` est également pris en charge sur les écouteurs d'événements de composants :

```vue-html
<MyComponent @some-event.once="callback" />
```

Comme les composants et les props, les noms d'événements fournissent une transformation de casse automatique. Notez que nous avons émis un événement `camelCase`, mais que nous pouvons l'écouter à l'aide d'un écouteur `kebab-case` dans le parent. Comme pour la [casse des props](/guide/components/props#prop-name-casing), nous vous recommandons d'utiliser des noms d'écouteurs d'événement au format `kebab-case` dans les templates.

:::tip
Contrairement aux événements DOM natifs, les événements émis par les composants **ne se propagent pas** au delà de leur parent direct. Vous ne pouvez écouter que les événements émis par un composant enfant direct. S'il est nécessaire de communiquer entre des composants frères ou profondément imbriqués, utilisez un bus d'événements externe ou une [solution de gestion d'état global](/guide/scaling-up/state-management).
:::

## Arguments d'événement {#event-arguments}

Il est parfois utile d'émettre une valeur spécifique avec un événement. Par exemple, nous pouvons vouloir que le composant `<BlogPost>` soit en charge d'agrandir plus ou moins le texte. Dans ces cas, nous pouvons passer des arguments supplémentaires à `$emit` pour fournir cette valeur :

```vue-html
<button @click="$emit('increaseBy', 1)">
  Increase by 1
</button>
```

Ensuite, lorsque nous écoutons l'événement dans le composant parent, nous pouvons utiliser une fonction fléchée comme écouteur, ce qui nous permet d'accéder à l'argument de l'événement :

```vue-html
<MyButton @increase-by="(n) => count += n" />
```

Ou, si le gestionnaire d'événements est une méthode :

```vue-html
<MyButton @increase-by="increaseCount" />
```

Ensuite, la valeur sera transmise comme premier paramètre de cette méthode :

<div class="options-api">

```js
methods: {
  increaseCount(n) {
    this.count += n
  }
}
```

</div>
<div class="composition-api">

```js
function increaseCount(n) {
  count.value += n
}
```

</div>

:::tip
Tous les arguments supplémentaires passés à `$emit()` après le nom de l'événement seront transmis à l'écouteur. Par exemple, avec `$emit('foo', 1, 2, 3)` la fonction d'écoute recevra trois arguments.
:::

## Déclaration des événements émis {#declaring-emitted-events}

Les événements émis peuvent être explicitement déclarés sur le composant via <span class="composition-api">la macro [`defineEmits()`](/api/sfc-script-setup#defineprops-defineemits)</span><span class="options-api">l'option [`emits`](/api/options-state#emits)</span> :

<div class="composition-api">

```vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```

La méthode `$emit` que nous avons utilisée dans le `<template>` n'est pas accessible dans la section `<script setup>` d'un composant, mais `defineEmits()` renvoie une fonction équivalente que nous pouvons utiliser à la place :

```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

La macro `defineEmits()` **ne peut pas** être utilisée dans une fonction, elle doit être placée directement dans `<script setup>`, comme dans l'exemple ci-dessus.

Si vous utilisez une fonction `setup` explicite au lieu de `<script setup>`, les événements doivent être déclarés à l'aide de l'option [`emits`](/api/options-state#emits), et la fonction `emit` est exposée dans le contexte de `setup()` :

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

Comme pour les autres propriétés du contexte de `setup()`, `emit` peut être déstructurée en toute sécurité :

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```

</div>
<div class="options-api">

```js
export default {
  emits: ['inFocus', 'submit']
}
```

</div>

L'option `emits` et la macro `defineEmits()` supportent également une syntaxe avec un objet. Si vous utilisez TypeScript, vous pouvez utiliser les arguments, ce qui nous permet d'effectuer une validation à l'exécution du contenu des événements émis :

<div class="composition-api">

```vue
<script setup lang="ts">
const emit = defineEmits({
  submit(payload: { email: string, password: string }) {
    // renvoie `true` ou `false` pour indiquer
    // que la validation a réussi/échoué
  }
})
</script>
```

Si vous utilisez TypeScript avec `<script setup>`, il est également possible de déclarer des événements émis à l'aide d'annotations de type :

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

Plus de détails : [Typer les données émises par les composants](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

</div>
<div class="options-api">

```js
export default {
  emits: {
    submit(payload: { email: string, password: string }) {
      // renvoie `true` ou `false` pour indiquer
      // que la validation a réussi/échoué
    }
  }
}
```

Voir également : [Typer les données émises par les composants](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

</div>

Bien que facultatif, il est recommandé de définir tous les événements émis afin de mieux documenter le fonctionnement d'un composant. Cela permet également à Vue d'exclure les écouteurs connus des [attributs implicitement déclarés (fallthrough attributes)](/guide/components/attrs#v-on-listener-inheritance), évitant ainsi les problèmes liés aux cas à la marge causés par des événements DOM envoyés manuellement par du code tiers.

:::tip
Si un événement natif (par exemple, `click`) est défini dans l'option `emits`, l'écouteur n'écoutera alors que les événements `click` émis par le composant et ne réagira plus aux événements `click` natifs.
:::

## Validation des événements {#events-validation}

Semblable à la validation de type de prop, un événement émis peut être validé s'il est défini avec la syntaxe utilisant un objet au lieu d'un tableau.

Pour ajouter une validation, l'événement se voit attribuer une fonction qui reçoit les arguments passés à l'appel de <span class="options-api">`this.$emit`</span><span class="composition-api">`emit`</span> et renvoie un booléen pour indiquer si l'événement est valide ou non.

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  // Pas de validation
  click: null,

  // Validation de l'événement soumis
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

</div>
<div class="options-api">

```js
export default {
  emits: {
    // Pas de validation
    click: null,

    // Validation de l'événement soumis
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```

</div>