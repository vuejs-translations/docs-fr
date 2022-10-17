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

Lors de la création d'applications frontend, nous devons souvent réutiliser de la logique pour les tâches courantes. Par exemple, nous pouvons avoir besoin de formater des dates à de nombreux endroits, on extrait une fonction réutilisable pour cela. Cette fonction de formatage encapsule la **logique sans état** : elle prend des arguments et renvoie immédiatement la sortie attendue. Il existe de nombreuses bibliothèques pour réutiliser la logique sans état, par exemple [lodash](https://lodash.com/) et [date-fns](https://date-fns.org/), dont vous avez peut-être déjà entendu parler.

En revanche, la logique avec état implique la gestion d'un état qui change au fil du temps. Un exemple simple serait de suivre la position actuelle de la souris sur une page. Dans des scénarios réels, il peut également s'agir d'une logique plus complexe, telle que des interactions tactiles ou l'état de la connexion à une base de données.

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

La partie intéressante des composables est que vous pouvez également les imbriquer : une fonction composable peut appeler une ou plusieurs autres fonctions composables. Cela nous permet de composer une logique complexe à l'aide de petites unités isolées, de la même manière que nous composons une application entière à l'aide de composants. En fait, c'est pourquoi nous avons décidé d'appeler la collection d'API rendant ce modèle possible **Composition API**.

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
Chaque instance de composant appelant `useMouse()` créera ses propres copies de l'état `x` et `y` afin qu'elles n'interfèrent pas l'une avec l'autre. Si vous souhaitez gérer l'état partagé entre les composants, lisez le chapitre [Gestion d'état](/guide/scaling-up/state-management.html).
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
    // sinon, ne récupérer qu'une seule fois
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

C'est une convention de nommer les fonctions composables avec des noms camelCase qui commencent par "use".

### Arguments d'entrée {#input-arguments}

Un composable peut accepter des arguments ref même s'il ne s'appuie pas sur eux pour la réactivité. Si vous écrivez un composable qui peut être utilisé par d'autres développeurs, c'est une bonne idée de gérer le cas où les arguments d'entrée sont des refs au lieu de valeurs brutes. La fonction utilitaire [`unref()`](/api/reactivity-utilities.html#unref) sera utile à cette fin :

```js
import { unref } from 'vue'

function useFeature(maybeRef) {
  // si maybeRef est bien une ref, .value sera retournée
  // sinon, maybeRef est renvoyé tel quel
  const value = unref(maybeRef)
}
```

Si votre composable crée des effets réactifs lorsque l'entrée est une référence, assurez-vous soit de surveiller explicitement la référence avec `watch()`, ou d'appeler `unref()` à l'intérieur d'un `watchEffect()` afin qu'il soit correctement suivi.

### Valeurs de retour {#return-values}

Vous avez probablement remarqué que nous utilisons exclusivement `ref()` au lieu de `reactive()` dans les composables. La convention recommandée est que les composables renvoient toujours un objet simple et non réactif contenant plusieurs références. Cela lui permet d'être déstructuré en composants tout en gardant de la réactivité :

```js
// x et y sont des refs
const { x, y } = useMouse()
```

Retourner un objet réactif à partir d'un composable fera perdre à ses membres la connexion de réactivité de l'état à l'intérieur du composable, tandis que les références conserveront cette connexion.

Si vous préférez utiliser l'état renvoyé par les composables en tant que propriétés d'objet, vous pouvez envelopper l'objet renvoyé avec `reactive()` afin que les références soient développées. Par exemple :

```js
const mouse = reactive(useMouse())
// mouse.x est lié à la référence d'origine
console.log(mouse.x)
```

```vue-html
Position de la souris est à : {{ mouse.x }}, {{ mouse.y }}
```

### Effets de bord {#side-effects}

C'est OK d'effectuer des effets de bord (par exemple, ajouter des écouteurs d'événements DOM ou récupérer des données) dans les composables, mais faites attention aux règles suivantes :

- Si vous travaillez sur une application qui utilise du [Rendu côté serveur](/guide/scaling-up/ssr.html) (SSR), assurez-vous d'effectuer des effets de bord spécifiques au DOM dans les hooks de cycle de vie post-montage, par ex. `onMounted()`. Ces hooks ne sont appelés que dans le navigateur, vous pouvez donc être sûr que le code qu'ils contiennent a bien accès au DOM.

- N'oubliez pas de nettoyer les effets de bord dans `onUnmount()`. Par exemple, si un composable configure un écouteur d'événement DOM, il doit supprimer cet écouteur dans `onUnmount()` comme nous l'avons vu dans l'exemple `useMouse()`. Ça peut être une bonne idée d'utiliser un composable qui le fait automatiquement pour vous, comme l'exemple `useEventListener()`.

### Restriction d'usage {#usage-restrictions}

Les composables ne peuvent être appelés que de manière **synchrone** dans `<script setup>` ou dans le hook `setup()`. Dans certains cas, vous pouvez également les appeler dans des hooks de cycle de vie comme `onMounted()`.

Ce sont les contextes dans lesquels Vue est capable de déterminer l'instance de composant active actuelle. L'accès à une instance de composant actif est nécessaire pour que :

1. Les hooks de cycle de vie peuvent y être enregistrés.

2. Les propriétés calculées et les observateurs peuvent y être liés, afin qu'ils puissent être supprimés lorsque l'instance est démontée pour éviter les fuites de mémoire.

:::tip
`<script setup>` est le seul endroit où vous pouvez appeler des composables **après** avoir utilisé `await`. Le compilateur restaure automatiquement le contexte d'instance actif pour vous après l'opération asynchrone.
:::

## Extraction des composables pour l'organisation de son code {#extracting-composables-for-code-organization}

Les composables peuvent être extraits non seulement pour être réutilisés, mais aussi au bénéfice de l'organisation du code. Au fur et à mesure que la complexité de vos composants augmente, vous pouvez vous retrouver avec des composants trop volumineux pour naviguer et raisonner. La Composition API vous offre toute la flexibilité nécessaire pour organiser votre code de composant en fonctions plus petites selon leurs responsabilités logiques :

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

Dans une certaine mesure, vous pouvez considérer ces composables extraits comme des services à portée de composant qui peuvent communiquer entre eux.

## Utilisation de composables dans l'Options API {#using-composables-in-options-api}

Si vous utilisez l'Options API, les éléments composables doivent être appelés dans `setup()`, et les liaisons renvoyées doivent être renvoyées par `setup()` afin qu'elles soient exposées à `this` et au template :

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
    // Les propriétés exposées de setup() sont accessibles sur `this`
    console.log(this.x)
  }
  // ...autres options
}
```

## Comparaisons avec d'autres techniques {#Comparisons with Other Techniques}

### vs. les mixins {#vs-mixins}

Les utilisateurs venant de Vue 2 sont familiers avec l'option [mixins](/api/options-composition.html#mixins), qui permet d'extraire la logique des composants dans des unités réutilisables. Les mixins présentent trois principaux inconvénients :

1. **Source de propriétés peu claire** : lors de l'utilisation de nombreux mixins, il devient difficile de savoir quelle propriété d'instance est injectée par quel mixin, ce qui rend difficile le suivi de l'implémentation et la compréhension du comportement du composant. C'est aussi pourquoi nous recommandons d'utiliser le modèle refs + destructure pour les composables : il rend la source de la propriété claire lors de la consommation de composants.

2. **Collisions d'espaces de noms** : plusieurs mixins d'auteurs différents peuvent potentiellement enregistrer les mêmes clés de propriété, provoquant des collisions d'espaces de noms. Avec les composables, vous pouvez renommer les variables déstructurées s'il existe des clés en conflit de différents composables.

3. **Communication implicite inter-mixins** : plusieurs mixins qui doivent interagir les uns avec les autres doivent s'appuyer sur des clés de propriété partagées, ce qui les rend implicitement couplés. Avec les composables, les valeurs renvoyées par un composable peuvent être transmises à un autre en tant qu'arguments, tout comme les fonctions normales.

Pour les raisons ci-dessus, nous ne recommandons plus d'utiliser des mixins dans Vue 3. La fonctionnalité est conservée uniquement pour des raisons de migration et de familiarité.

### vs. Composants Renderless {#vs-renderless-components}

Dans le chapitre sur les slots de composants, nous avons discuté du modèle du [Composant Renderless](/guide/components/slots.html#renderless-components) basé sur des slots délimités. Nous avons même implémenté la même démo de suivi de la souris en utilisant des composants renderless.

Le principal avantage des composables par rapport aux composants renderless est que les composables n'encourent pas de surcharge d'instance de composant supplémentaire. Lorsqu'il est utilisé dans une application entière, la quantité d'instances de composants supplémentaires créées par le modèle de Composant Renderless peut devenir une surcharge de performances notable.

La recommandation est d'employer les composables pour centraliser une logique pure, et d'utiliser des composants pour une réutilisation de logique **et** de disposition visuelle.

### vs. les hooks de React {#vs-react-hooks}

Si vous avez de l'expérience avec React, vous remarquerez peut-être que cela ressemble beaucoup aux hooks personnalisés de React. La Composition API a été en partie inspirée des hooks de React, et les composables Vue sont en effet similaires aux hooks de React en termes de capacités de composition logique. Cependant, les composables Vue sont basés sur le système de réactivité de Vue, qui est fondamentalement différent du modèle d'exécution des hooks React. Ceci est discuté plus en détail dans la [FAQ de la Composition API](/guide/extras/composition-api-faq#comparison-with-react-hooks).

## Lecture complémentaire {#further-reading}

- [Réactivité en profondeur](/guide/extras/reactivity-in-depth.html) : pour une compréhension de bas niveau du fonctionnement du système de réactivité de Vue.
- [Gestion d'état](/guide/scaling-up/state-management.html) : pour les patterns de gestion d'état partagés par plusieurs composants.
- [Tester les composables](/guide/scaling-up/testing.html#testing-composables) : conseils sur les tests de composables.
- [VueUse](https://vueuse.org/): une collection de composables Vue. Le code source est également une excellente ressource d'apprentissage.
