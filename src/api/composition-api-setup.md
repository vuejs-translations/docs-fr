# Composition API : setup() {#composition-api-setup}

## Utilisation basique {#basic-usage}
:::info Note
Cette page documente l'usage de `setup`. Si vous utilisez la Composition API avec les composants monofichiers, [`<script setup>`](/api/sfc-script-setup) est recommandé pour une syntaxe plus succincte et ergonomique.
:::

Dans les cas suivants, le hook `setup()` sert de point d'entrée pour la Composition API dans les composants :

1. Si vous souhaitez utiliser la Composition API sans outil de build;
2. Si vous intégrez du code avec la Composition API dans un composant utilisant l'Options API.

On peut déclarer un état réactif en utilisant [l'API de réactivité](./reactivity-core) et l'exposer dans le template en retournant l'objet depuis `setup()`. Les propriétés retournées par l'objet seront aussi disponibles dans l'instance du composant (si aucune autre option n'est utilisée) :

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // expose la variable count dans le template
    // et dans tous les autres hooks de l'Options API
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

Les [refs](/api/reactivity-core#ref) renvoyées par `setup` sont [automatiquement distribuées](/guide/essentials/reactivity-fundamentals#deep-reactivity) lorsqu'elles sont invoquées dans le template, vous n'avez donc pas besoin d'utiliser `.value` lorsque vous souhaitez y accéder. Elles sont également déballées de la même façon lorsqu'elles sont invoquées sur `this`.

`setup()` n'a pas accès à l'instance du composant - `this` aura une valeur `undefined` à l'intérieur de `setup()`. Vous pouvez accéder aux valeurs exposées par la Composition API depuis l'Options, mais pas l'inverse.

`setup()` doit renvoyer un objet _synchrone_. Le seul cas où `async setup()` peut être utilisé est lorsque le composant est un descendant d'un composant [Suspense](../guide/built-ins/suspense).

## Accéder aux props {#accessing-props}

Le premier argument dans la fonction `setup` est l'argument `props`. Tout comme l'on s'y attendrait dans un composant standard, les `props` à l'intérieur d'une fonction `setup` sont réactives et seront mises à jour lorsque de nouvelles props seront transmises.

```js
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

Notez que si vous déstructurez l'objet `props`, les variables déstructurées perdront leur réactivité. Il est donc recommandé d'accéder aux props sous la forme de `props.xxx`.

Si vous avez vraiment besoin de déstructurer les props, ou si vous devez passer une prop dans une fonction externe tout en conservant la réactivité, vous pouvez le faire avec les utilitaires de l'API de Réactivité [toRefs()](./reactivity-utilities#torefs) et [toRef()](/api/reactivity-utilities#toref).

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // transforme props en un objet de refs puis le déstructure
    const { title } = toRefs(props)
    // `title` est une ref rattachée à `props.title` 
    console.log(title.value)

    // Ou, transformer l'une des props en une ref
    const title = toRef(props, 'title')
  }
}
```

## Contexte de la fonction setup {#setup-context}

Le deuxième argument passé à la fonction `setup` est un objet **Setup Context**. Cet objet expose d'autres valeurs qui peuvent être utiles à l'intérieur de `setup` :

```js
export default {
  setup(props, context) {
    // Attributs (objet non réactif, équivalent à $attrs)
    console.log(context.attrs)

    // Slots (objet non réactif, équivalent à $slots)
    console.log(context.slots)

    // Émettre des événements (fonction, équivalent à $emit)
    console.log(context.emit)

    // Exposer des propriétés publiques (fonction)
    console.log(context.expose)
  }
}
```

L'objet contexte n'est pas réactif et peut être déstructuré en toute sécurité :


```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` et `slots` sont des objets d'état qui sont toujours mis à jour lorsque le composant lui-même est mis à jour. Cela signifie que vous devriez éviter de les déstructurer et toujours faire référence aux propriétés via `attrs.x` ou `slots.x`. Notez également que, contrairement aux `props`, les propriétés d'`attrs` et de `slots` **ne sont pas réactives**. Si vous avez l'intention d'appliquer des effets de bord en fonction des changements apportés à `attrs` ou `slots`, vous devriez le faire à l'intérieur du hook de cycle de vie `onBeforeUpdate`.

### Exposer des propriétés publiques {#exposing-public-properties}

`expose` est une fonction qui peut être utilisée pour limiter explicitement les propriétés exposées lorsque l'instance de composant est accédée par un composant parent via [les refs du template](/guide/essentials/template-refs#ref-on-component) :

```js{5,10}
export default {
  setup(props, { expose }) {
    // rend l'instance inaccessible
    // c.-à-d. n'exposera rien au parent
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // n'expose qu'une sélection de l'état local
    expose({ count: publicCount })
  }
}
```

## Utilisation avec les fonctions de rendu {#usage-with-render-functions}

`setup` peut également retourner [une fonction de rendu](/guide/extras/render-function) qui peut directement utiliser l'état réactif déclaré dans le scope partagé :

```js{6}
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return () => h('div', count.value)
  }
}
```

Retourner une fonction de rendu nous empêche de retourner autre chose. En pratique, cela ne devrait pas poser de problème mais cela peut être problématique si nous voulons exposer des méthodes de ce composant enfant au composant parent via les refs du template.

Nous pouvons résoudre ce problème en appellant [`expose()`](#exposing-public-properties) :

```js{8-10}
import { h, ref } from 'vue'

export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
```

La méthode `increment` sera dès lors disponible dans le composant parent via une référence.
