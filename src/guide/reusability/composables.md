# Composables

<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>

:::tip
Cette section suppose une connaissance de base de la Composition API. Si vous avez appris Vue avec l'API Options uniquement, vous pouvez définir la préférence de l'API sur la Composition API (à l'aide de l'interrupteur en haut de la barre latérale gauche) et relire les [Reactivity Fundamentals](/guide/essentials/reactivity-fundamentals.html) et [Lifecycle Hooks](/guide/essentials/lifecycle.html).
:::

## Qu'est-ce qu'un "Composable"? {#what-is-a-composable}

Dans le contexte des applications Vue, un "composable" est une fonction qui exploite la Composition API de Vue pour encapsuler et réutiliser une **logique avec état**.

Lors de la création d'applications frontend, nous devons souvent réutiliser la logique pour les tâches courantes. Par exemple, nous pouvons avoir besoin de formater des dates à de nombreux endroits, on extrait une fonction réutilisable pour cela. Cette fonction de formatage encapsule la **logique sans état** : elle prend des arguments et renvoie immédiatement la sortie attendue. Il existe de nombreuses bibliothèques pour réutiliser la logique sans état, par exemple [lodash](https://lodash.com/) et [date-fns](https://date-fns.org/), dont vous avez peut-être déjà entendu parler.

En revanche, la logique avec état implique la gestion d'un état qui change au fil du temps. Un exemple simple serait de suivre la position actuelle de la souris sur une page. Dans des scénarios réels, il peut également s'agir d'une logique plus complexe, telle que des gestes tactiles ou l'état de la connexion à une base de données.

## Exemple de suivi de la souris {#mouse-tracker-example}

Si nous devions implémenter la fonctionnalité de suivi de la souris à l'aide de la Composition API directement dans un composant, cela ressemblerait à ceci :

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>La position de la souris est à : {{ x }}, {{ y }}</template>
```

Mais que se passe-t-il si nous voulons réutiliser la même logique dans plusieurs composants ? Nous pouvons extraire la logique dans un fichier externe, en tant que fonction composable :

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// par convention, les noms de fonctions composables commencent par "use"
export function useMouse() {
  // état encapsulé et géré par le composable
  const x = ref(0)
  const y = ref(0)

  // un composable peut mettre à jour son état géré au fil du temps.
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // un composable peut également s'accrocher au cycle de vie de son composant
  // propriétaire pour configurer et démonter les effets secondaires.
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // expose l'état géré comme valeur de retour
  return { x, y }
}
```

Et voici comment il peut être utilisé dans les composants :

```vue
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>La position de la souris est à : {{ x }}, {{ y }}</template>
```

<div class="demo">
  La position de la souris est à : {{ x }}, {{ y }}
</div>

[Essayer en ligne](https://sfc.vuejs.org/#eNqNks9uwjAMxl/F6oUilXRnBEg77MaOkzapl44aVkSdyEkLCPVd9i57sdktFPZH0y5t7Di/+POXU3TvnGlqjKbRzK+4dAE8htotMiorZznACWqPj1Y+0MKabQUjk1Yam60fZZTRypLXukMCR6mZDwficUaztMcKUIKAldvlASUCWObgrC9DaQkKhF0O3tZcekDBfbzDFE4ChbZNdCHoVnEDIkqivsVJlTvpxZKIOCk4O2/4LBKGZjQnKjXOorcQnJ+mqV+vVPrWG8ubVFaGawplhQZ9NXllu/fIAs6i5IaRSrJBnjBSgYz8F/Nb6Q+uYkVUK1IuExUNw+AZ1wlYkllSwEKXTyR1GgxeyGWdCXjoDq1rWnUDvXrQT6A36SDuCDW+E2cuueNNTrNXhCtkzjE2SOFMATiYJt/VKGe6vHH5Bp/7reMvWy9nifoblMTS1HwB+5IKuzd5UTxo/bL0AQk5HnWzqGyDo+TcxLjr90b/VwR31f+iKIflhTMNL1YNaD8Be2IObA==)

Comme nous pouvons le voir, la logique de base reste identique, tout ce que nous avions à faire était de la déplacer dans une fonction externe et de renvoyer l'état qui devrait être exposé. Tout comme à l'intérieur d'un composant, vous pouvez utiliser la gamme complète des [Fonctions de la Composition API](/api/#composition-api) dans les composables. La même fonctionnalité `useMouse()` peut désormais être utilisée dans n'importe quel composant.

La partie la plus cool des composables est que vous pouvez également les imbriquer : une fonction composable peut appeler une ou plusieurs autres fonctions composables. Cela nous permet de composer une logique complexe à l'aide de petites unités isolées, de la même manière que nous composons une application entière à l'aide de composants. En fait, c'est pourquoi nous avons décidé d'appeler la collection d'API qui rendent ce modèle possible **Composition API**.

Par exemple, nous pouvons extraire la logique d'ajout et de suppression d'un écouteur d'événement DOM dans son propre composable :

```js
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // si vous voulez, vous pouvez aussi faire ça
  // écoute d'un événement sur target
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

Et maintenant, notre composable `useMouse()` peut être simplifié en :

```js{3,9-12}
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

:::tip
Chaque instance de composant appelant `useMouse()` créera ses propres copies de l'état `x` et `y` afin qu'elles n'interfèrent pas l'une avec l'autre. Si vous souhaitez gérer l'état partagé entre les composants, lisez le chapitre [Gestion de l'état](/guide/scaling-up/state-management.html).
:::

## Example d'état asynchrone {#async-state-example}

Le composable `useMouse()` ne prend aucun argument, alors regardons un autre exemple qui en utilise un. Lors de la récupération de données asynchrone, nous devons souvent gérer différents états : chargement, succès et erreur :

```vue
<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">Oups! Une erreur est survenue : {{ error.message }}</div>
  <div v-else-if="data">
    Données chargées :
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Chargement...</div>
</template>
```
Il serait fastidieux de devoir répéter ce modèle dans chaque composant qui doit récupérer des données. Extrayons-le dans un composable :

```js
// fetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

Maintenant, dans notre composant, nous pouvons simplement faire :

```vue
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>
```

`useFetch()` prend une chaîne d'URL statique en entrée, il n'effectue donc la récupération qu'une seule fois. Que se passe-t-il si nous voulons qu'il récupère chaque fois que l'URL change ? Nous pouvons y parvenir en acceptant également une `ref` comme argument :

```js
// fetch.js
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  function doFetch() {
    // réinitialiser l'état avant de récupérer..
    data.value = null
    error.value = null
    // unref() déballe les refs potentielles
    fetch(unref(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  if (isRef(url)) {
    // configure la récupération réactive si l'URL d'entrée est une ref
    watchEffect(doFetch)
  } else {
    // sinon, récupérer qu'une seule fois
    // et éviter la surcharge d'un observateur
    doFetch()
  }

  return { data, error }
}
```

Cette version de `useFetch()` accepte désormais à la fois les chaînes d'URL statiques et les références de chaînes d'URL. Lorsqu'il détecte que l'URL est une référence dynamique à l'aide de [`isRef()`](/api/reactivity-utilities.html#isref), il configure un effet réactif à l'aide de [`watchEffect()`](/api/reactivity-core.html#watcheffect). L'effet s'exécutera immédiatement et suivra également la référence d'URL en tant que dépendance. Chaque fois que la référence d'URL change, les données sont réinitialisées et récupérées à nouveau.

Voici [la version mise à jour de `useFetch()`](https://sfc.vuejs.org/#eNp1Vc1u4zYQfpWpLlZQR9pi0YvhGC3a7WmLFkHTky6MRMVMJVLlj9LA8PvUfQ2/WL8hJUfJZi+SSM588803M9Qh+3EYijHIbJNtXW3V4MlJH4ZdpVU/GOvpQFa2a6pNPwQvGzpSa01PKzitFkbByV+kr/eX86Kct4pHB8tK10Y7T/fCyTvb0Q2t9t4PblOWj87ooRO13Juukbbwz4OqTSMLBC29aYwrAZDcVQNPMMpX362u5s0Q8WaKeX5FN7tLoG/hU4yiCxL2s8eBGuHFmqS1xq4B6O0zqN9c8siBCfttmVSBHlh42YOnl1gRfTaiocFEThve2N4H742m8bo19qbKFClN31cZ/VB3qv6Ld5i8qrLd4UCKjsdtmVwieuW3jRrhrVqYRmKwZGBAD7vfwuC+oTstmbMMliQiu2BHqYOkDQEy+hS9dE48yAjPdYz+E7ULk5gw4G/PJzZ/lnbBBfYlqKSvxEl2TiZirBscfzZasy/Ve2Ef4tcGNK3k3Ngmxcf6XazdT+wme6l9URSzyba8KJyts9Rb170Y0EFGo0UPjAIZ44GrMmSd8qsytCOvq2xuKtfW3NiPrjD2ocRXYYP2qpeFdP31vTVPDq32CJT1AqPE5ijttZUanShRga9jvjH9Apdhj5U+IpXFKCCN15Ol3C2/go6rJwGzT20ra/9m1Cot/4l+bdC1V6jmq15NUqTujvqnMdGh4z6eT2KLvD7iQ+Gedf0C3JiEO4ESlSXZ80lp5ZXoFBKkbnU+eeFJjEIjoOTzOgznEytRJC+mkSYPETla2k5t+uX+MpQzoUEMHmxg90Kr879WEtPcW4MhGAxGAI/RKEvn/zwfBjUqvgV6eYEKMG3Op4FrpGu4CbuUOI/SzOIg2p8Tq1iN6Q544caXxKRIRAdyJxQJ61WraiU7KufpFN35JDzIRS6Vh8ZPQnniDjRhCszbkSQHu6IR5DCYyEyzwgIbHWNBASxgQ06RW0kdZx+p8aUxUXFKo3AvPqgRu0QwTCd52XWS/g6r+Ib/lJdPqVvM781EsZ17KorBHRKDvKpmsoRXHM1ZxiPVrC3l8tI5b8s9lQZzER/8Ui3lcQii3sueA7dWPQTUlvOfG0zEHsVSoFtH1F2hU+5uP1MDaTz2Y36x9NAsgS1rPnV35Hwkvo0WIaOO+CG8dDOLxlhOBijXGuWm7p6HZJEKBIfe7/5dNrNDvBPY/L0GqvRlCC+dkthN0Fo+0e+4FTCEeQ79TTdKjvCIzOJvb0oFf/E/JoD0O7zUg+X+Vfh9YYVuTI/THX0oPi4qxsEi8FzXtzolEw6ZM59PnGa+uo14abW6enGdKr6mjx8+JLHwPGbH/wFWsuhk), avec un délai artificiel et une erreur aléatoire à des fins de démonstration.

## Conventions et bonnes pratiques {#conventions-and-best-practices}

### Nommage {#naming}

It is a convention to name composable functions with camelCase names that start with "use".

### Input Arguments

A composable can accept ref arguments even if it doesn't rely on them for reactivity. If you are writing a composable that may be used by other developers, it's a good idea to handle the case of input arguments being refs instead of raw values. The [`unref()`](/api/reactivity-utilities.html#unref) utility function will come in handy for this purpose:

```js
import { unref } from 'vue'

function useFeature(maybeRef) {
  // if maybeRef is indeed a ref, its .value will be returned
  // otherwise, maybeRef is returned as-is
  const value = unref(maybeRef)
}
```

If your composable creates reactive effects when the input is a ref, make sure to either explicitly watch the ref with `watch()`, or call `unref()` inside a `watchEffect()` so that it is properly tracked.

### Return Values

You have probably noticed that we have been exclusively using `ref()` instead of `reactive()` in composables. The recommended convention is for composables to always return a plain, non-reactive object containing multiple refs. This allows it to be destructured in components while retaining reactivity:

```js
// x and y are refs
const { x, y } = useMouse()
```

Returning a reactive object from a composable will cause such destructures to lose the reactivity connection to the state inside the composable, while the refs will retain that connection.

If you prefer to use returned state from composables as object properties, you can wrap the returned object with `reactive()` so that the refs are unwrapped. For example:

```js
const mouse = reactive(useMouse())
// mouse.x is linked to original ref
console.log(mouse.x)
```

```vue-html
Mouse position is at: {{ mouse.x }}, {{ mouse.y }}
```

### Side Effects

It is OK to perform side effects (e.g. adding DOM event listeners or fetching data) in composables, but pay attention to the following rules:

- If you are working on an application that uses [Server-Side Rendering](/guide/scaling-up/ssr.html) (SSR), make sure to perform DOM-specific side effects in post-mount lifecycle hooks, e.g. `onMounted()`. These hooks are only called in the browser, so you can be sure that code inside them has access to the DOM.

- Remember to clean up side effects in `onUnmounted()`. For example, if a composable sets up a DOM event listener, it should remove that listener in `onUnmounted()` as we have seen in the `useMouse()` example. It can be a good idea to use a composable that automatically does this for you, like the `useEventListener()` example.

### Usage Restrictions

Composables should only be called **synchronously** in `<script setup>` or the `setup()` hook. In some cases, you can also call them in lifecycle hooks like `onMounted()`.

These are the contexts where Vue is able to determine the current active component instance. Access to an active component instance is necessary so that:

1. Lifecycle hooks can be registered to it.

2. Computed properties and watchers can be linked to it, so that they can be disposed when the instance is unmounted to prevent memory leaks.

:::tip
`<script setup>` is the only place where you can call composables **after** using `await`. The compiler automatically restores the active instance context for you after the async operation.
:::

## Extracting Composables for Code Organization

Composables can be extracted not only for reuse, but also for code organization. As the complexity of your components grow, you may end up with components that are too large to navigate and reason about. Composition API gives you the full flexibility to organize your component code into smaller functions based on logical concerns:

```vue
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = useFeatureC(baz)
</script>
```

To some extent, you can think of these extracted composables as component-scoped services that can talk to one another.

## Using Composables in Options API

If you are using Options API, composables must be called inside `setup()`, and the returned bindings must be returned from `setup()` so that they are exposed to `this` and the template:

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // setup() exposed properties can be accessed on `this`
    console.log(this.x)
  }
  // ...other options
}
```

## Comparisons with Other Techniques

### vs. Mixins

Users coming from Vue 2 may be familiar with the [mixins](/api/options-composition.html#mixins) option, which also allows us to extract component logic into reusable units. There are three primary drawbacks to mixins:

1. **Unclear source of properties**: when using many mixins, it becomes unclear which instance property is injected by which mixin, making it difficult to trace the implementation and understand the component's behavior. This is also why we recommend using the refs + destructure pattern for composables: it makes the property source clear in consuming components.

2. **Namespace collisions**: multiple mixins from different authors can potentially register the same property keys, causing namespace collisions. With composables, you can rename the destructured variables if there are conflicting keys from different composables.

3. **Implicit cross-mixin communication**: multiple mixins that need to interact with one another have to rely on shared property keys, making them implicitly coupled. With composables, values returned from one composable can be passed into another as arguments, just like normal functions.

For the above reasons, we no longer recommend using mixins in Vue 3. The feature is kept only for migration and familiarity reasons.

### vs. Renderless Components

In the component slots chapter, we discussed the [Renderless Component](/guide/components/slots.html#renderless-components) pattern based on scoped slots. We even implemented the same mouse tracking demo using renderless components.

The main advantage of composables over renderless components is that composables do not incur the extra component instance overhead. When used across an entire application, the amount of extra component instances created by the renderless component pattern can become a noticeable performance overhead.

The recommendation is to use composables when reusing pure logic, and use components when reusing both logic and visual layout.

### vs. React Hooks

If you have experience with React, you may notice that this looks very similar to custom React hooks. Composition API was in part inspired by React hooks, and Vue composables are indeed similar to React hooks in terms of logic composition capabilities. However, Vue composables are based on Vue's fine-grained reactivity system, which is fundamentally different from React hooks' execution model. This is discussed in more detail in the [Composition API FAQ](/guide/extras/composition-api-faq#comparison-with-react-hooks).

## Further Reading

- [Reactivity In Depth](/guide/extras/reactivity-in-depth.html): for a low-level understanding of how Vue's reactivity system works.
- [State Management](/guide/scaling-up/state-management.html): for patterns of managing state shared by multiple components.
- [Testing Composables](/guide/scaling-up/testing.html#testing-composables): tips on unit testing composables.
- [VueUse](https://vueuse.org/): an ever-growing collection of Vue composables. The source code is also a great learning resource.
