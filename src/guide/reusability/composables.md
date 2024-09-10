# Composables {#composables}

<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>

:::tip
Cette section suppose une connaissance de base de la Composition API. Si vous avez appris Vue avec l'Options API uniquement, vous pouvez définir la préférence de l'API sur la Composition API (à l'aide de l'interrupteur en haut de la barre latérale gauche) et relire les [Principes fondamentaux des composants](/guide/essentials/reactivity-fundamentals) et [Les hooks du cycle de vie](/guide/essentials/lifecycle).
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

<template>Mouse position is at: {{ x }}, {{ y }}</template>
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
  // propriétaire pour configurer et démonter les effets de bord.
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

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

<div class="demo">
  La position de la souris est à : {{ x }}, {{ y }}
</div>

[Essayer en ligne](https://play.vuejs.org/#eNqNkj1rwzAQhv/KocUOGKVzSAIdurVjoQUvJj4XlfgkJNmxMfrvPcmJkkKHLrbu69H7SlrEszFyHFDsxN6drDIeHPrBHGtSvdHWwwKDwzfNHwjQWd1DIbd9jOW3K2qq6aTJxb6pgpl7Dnmg3NS0365YBnLgsTfnxiNHACvUaKe80gTKQeN3sDAIQqjignEhIvKYqMRta1acFVrsKtDEQPLYxuU7cV8Msmg2mdTilIa6gU5p27tYWKKq1c3ENphaPrGFW25+yMXsHWFaFlfiiOSvFIBJjs15QJ5JeWmaL/xYS/Mfpc9YYrPxl52ULOpwhIuiVl9k07Yvsf9VOY+EtizSWfR6xKK6itgkvQ/+fyNs6v4XJXIsPwVL+WprCiL8AEUxw5s=)

Comme nous pouvons le voir, la logique de base reste identique, tout ce que nous avions à faire était de la déplacer dans une fonction externe et de renvoyer l'état qui devrait être exposé. Tout comme à l'intérieur d'un composant, vous pouvez utiliser la gamme complète des [Fonctions de la Composition API](/api/#composition-api) dans les composables. La même fonctionnalité `useMouse()` peut désormais être utilisée dans n'importe quel composant.

La partie intéressante des composables est que vous pouvez également les imbriquer : une fonction composable peut appeler une ou plusieurs autres fonctions composables. Cela nous permet de composer une logique complexe à l'aide de petites unités isolées, de la même manière que nous composons une application entière à l'aide de composants. En fait, c'est pourquoi nous avons décidé d'appeler la collection d'API rendant ce modèle possible **Composition API**.

Par exemple, nous pouvons extraire la logique d'ajout et de suppression d'un écouteur d'événement DOM dans son propre composable :

```js
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // au lieu d'utiliser target, vous pouvez aussi
  // utiliser un sélecteur CSS pour trouver l'élément cible
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
Chaque instance de composant appelant `useMouse()` créera ses propres copies de l'état `x` et `y` afin qu'elles n'interfèrent pas l'une avec l'autre. Si vous souhaitez gérer l'état partagé entre les composants, lisez le chapitre [Gestion d'état](/guide/scaling-up/state-management).
:::

## Exemple d'état asynchrone {#async-state-example}

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
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
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

### Acceptation de l'état réactif {#accepting-reactive-state}

`useFetch()` prend une chaîne d'URL statique en entrée, il n'effectue donc la récupération qu'une seule fois. Que se passe-t-il si nous voulons qu'il récupère chaque fois que l'URL change ? Nous pouvons y parvenir en acceptant également une `ref` comme argument :

Par exemple, `useFetch()` devrait être capable d'accepter une ref :

```js
const url = ref('/initial-url')

const { data, error } = useFetch(url)

// cela devrait déclencher un nouveau rendu
url.value = '/new-url'
```

Ou, accepter une fonction [accesseur](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) :

```js
// nouveau rendu lorsque props.id change
const { data, error } = useFetch(() => `/posts/${props.id}`)
```

Nous pouvons refactoriser notre implémentation avec les API [`watchEffect()`](/api/reactivity-core.html#watcheffect) et [`toValue()`](/api/reactivity-utilities.html#tovalue) :

```js{8,13}
// fetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    // réinitialiser l'état avant de récupérer..
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
```

`toValue()` est une API ajoutée en 3.3. Elle est conçue pour normaliser les refs ou les accesseurs en valeurs. Si l'argument est une ref, elle retourne la valeur de la ref ; si l'argument est une fonction, elle appellera la fonction et retournera sa valeur de retour. Sinon, elle retourne l'argument tel quel. Son fonctionnement est similaire à celui de [`unref()`](/api/reactivity-utilities.html#unref), mais avec un traitement spécial pour les fonctions.

Notez que `toValue(url)` est appelée **à l'intérieur** du callback `watchEffect`. Cela garantit que toutes les dépendances réactives accédées pendant la normalisation de `toValue()` sont traquées par l'observateur.

Cette version de `useFetch()` accepte maintenant les chaînes d'URL statiques, les refs et les accesseurs, ce qui la rend beaucoup plus flexible. L'effet d'observation s'exécutera immédiatement, et suivra toutes les dépendances accédées pendant `toValue(url)`. Si aucune dépendance n'est suivie (par exemple si l'url est déjà une chaîne), l'effet ne s'exécute qu'une seule fois ; sinon, il s'exécute à nouveau chaque fois qu'une dépendance suivie change.

Voici [la version mise à jour de `useFetch()`](https://play.vuejs.org/#eNp9Vdtu20YQ/ZUpUUA0qpAOjL4YktCbC7Rom8BN8sSHrMihtfZql9iLZEHgv2dml6SpxMiDIWkuZ+acmR2fs1+7rjgEzG6zlaut7Dw49KHbVFruO2M9nMFiu4Ta7LvgsYEeWmv2sKCkxSwoOPwTfb2b/EU5mopHR5GVro12HrbC4UerYA2Lnfeduy3LR2d0p0SNO6MatIU/dbI2DRZUtPSmMa4kgJQuG8qkjvLF28XVaAwRb2wxz69gvZkK/UQ5xUGogBQ/ZpyhEV4sAa01lnpeTwRyApsFWvT2RO6Eea40THBMgfq6NLwlS1/pVZnUJB3ph8c98fNIvwD+MaKBzkQut2xYbYP3RsPhTWvsusokSA0/Vxn8UitZP7GFSX/+8Sz7z1W2OZ9BQt+vypQXS1R+1cgDQciW4iMrimR0wu8270znfoC7SBaJWdAeLTa3QFgxuNijc+IBIy5PPyYOjU19RDEI954/Z/UptKTy6VvqA5XD1AwLTTl/0Aco4s5lV51F5sG+VJJ+v4qxYbmkfiiKYvSvyknPbJnNtoyW+HJpj4Icd22LtV+CN5/ikC4XuNL4HFPaoGsvie3FIqSJp1WIzabl00HxkoyetEVfufhv1kAu3EnX8z0CKEtKofcGzhMb2CItAELL1SPlFMV1pwVj+GROc/vWPoc26oDgdxhfSArlLnbWaBOcOoEzIP3CgbeifqLXLRyICaDBDnVD+3KC7emCSyQ4sifspOx61Hh4Qy/d8BsaOEdkYb1sZS2FoiJKnIC6FbqhsaTVZfk8gDgK6cHLPZowFGUzAQTNWl/BUSrFbzRYHXmSdeAp28RMsI0fyFDaUJg9Spd0SbERZcvZDBRleCPdQMCPh8ARwdRRnBCTjGz5WkT0i0GlSMqixTR6VKyHmmWEHIfV+naSOETyRx8vEYwMv7pa8dJU+hU9Kz2t86ReqjcgaTzCe3oGpEOeD4uyJOcjTXe+obScHwaAi82lo9dC/q/wuyINjrwbuC5uZrS4WAQeyTN9ftOXIVwy537iecoX92kR4q/F1UvqIMsSbq6vo5XF6ekCeEcTauVDFJpuQESvMv53IBXadx3r4KqMrt0w0kwoZY5/R5u3AZejvd5h/fSK/dE9s63K3vN7tQesssnnhX1An9x3//+Hz/R9cu5NExRFf8d5zyIF7jGF/RZ0Q23P4mK3f8XLRmfhg7t79qjdSIobjXLE+Cqju/b7d6i/tHtT3MQ8VrH/Ahstp5A=), avec un délai artificiel et une erreur aléatoire à des fins de démonstration.

## Conventions et bonnes pratiques {#conventions-and-best-practices}

### Nommage {#naming}

C'est une convention de nommer les fonctions composables avec des noms camelCase qui commencent par "use".

### Arguments d'entrée {#input-arguments}

Un composable peut accepter des arguments ref même s'il ne s'appuie pas sur eux pour la réactivité. Si vous écrivez un composable qui peut être utilisé par d'autres développeurs, c'est une bonne idée de gérer le cas où les arguments d'entrée sont des refs au lieu de valeurs brutes. La fonction utilitaire [`toValue()`](/api/reactivity-utilities#tovalue) sera utile à cette fin :

```js
import { toValue } from 'vue'

function useFeature(maybeRefOrGetter) {
  // Si maybeRefOrGetter est une ref ou un accesseur,
  // sa valeur normalisée sera retournée.
  // Sinon, elle sera renvoyée telle quelle.
  const value = toValue(maybeRefOrGetter)
}
```

Si votre composable crée des effets réactifs lorsque l'entrée est une référence ou un accesseur, assurez-vous soit de surveiller explicitement la référence / l'accesseur avec `watch()`, ou d'appeler `toValue()` à l'intérieur d'un `watchEffect()` afin qu'il soit correctement suivi.

L'implémentation [useFetch() présentée précédemment](#accepting-reactive-state) fournit un exemple concret d'un composable qui accepte des refs, des accesseurs et des valeurs simples en tant qu'argument d'entrée.

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
Mouse position is at: {{ mouse.x }}, {{ mouse.y }}
```

### Effets de bord {#side-effects}

C'est OK d'effectuer des effets de bord (par exemple, ajouter des écouteurs d'événements DOM ou récupérer des données) dans les composables, mais faites attention aux règles suivantes :

- Si vous travaillez sur une application qui utilise du [Rendu côté serveur](/guide/scaling-up/ssr) (SSR), assurez-vous d'effectuer des effets de bord spécifiques au DOM dans les hooks de cycle de vie post-montage, par ex. `onMounted()`. Ces hooks ne sont appelés que dans le navigateur, vous pouvez donc être sûr que le code qu'ils contiennent a bien accès au DOM.

- N'oubliez pas de nettoyer les effets de bord dans `onUnmount()`. Par exemple, si un composable configure un écouteur d'événement DOM, il doit supprimer cet écouteur dans `onUnmount()` comme nous l'avons vu dans l'exemple `useMouse()`. Ça peut être une bonne idée d'utiliser un composable qui le fait automatiquement pour vous, comme l'exemple `useEventListener()`.

### Restriction d'usage {#usage-restrictions}

Les composables ne peuvent être appelés que dans `<script setup>` ou dans le hook `setup()`. Ils ne doivent être appelés que de manière **synchrone** dans ces contextes. Dans certains cas, vous pouvez également les appeler dans des hooks de cycle de vie comme `onMounted()`.

Ces restrictions sont importantes car ce sont ces contextes où Vue est capable de déterminer l'instance de composant active actuelle. L'accès à une instance de composant actif est nécessaire pour que :

1. Les hooks de cycle de vie puissent y être enregistrés.

2. Les propriétés calculées et les observateurs puissent y être liés, afin qu'ils puissent être supprimés lorsque l'instance est démontée pour éviter les fuites de mémoire.

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

Les utilisateurs venant de Vue 2 sont familiers avec l'option [mixins](/api/options-composition#mixins), qui permet d'extraire la logique des composants dans des unités réutilisables. Les mixins présentent trois principaux inconvénients :

1. **Source de propriétés peu claire** : lors de l'utilisation de nombreux mixins, il devient difficile de savoir quelle propriété d'instance est injectée par quel mixin, ce qui rend difficile le suivi de l'implémentation et la compréhension du comportement du composant. C'est aussi pourquoi nous recommandons d'utiliser le modèle refs + destructure pour les composables : il rend la source de la propriété claire lors de la consommation de composants.

2. **Collisions d'espaces de noms** : plusieurs mixins d'auteurs différents peuvent potentiellement enregistrer les mêmes clés de propriété, provoquant des collisions d'espaces de noms. Avec les composables, vous pouvez renommer les variables déstructurées s'il existe des clés en conflit de différents composables.

3. **Communication implicite inter-mixins** : plusieurs mixins qui doivent interagir les uns avec les autres doivent s'appuyer sur des clés de propriété partagées, ce qui les rend implicitement couplés. Avec les composables, les valeurs renvoyées par un composable peuvent être transmises à un autre en tant qu'arguments, tout comme les fonctions normales.

Pour les raisons ci-dessus, nous ne recommandons plus d'utiliser des mixins dans Vue 3. La fonctionnalité est conservée uniquement pour des raisons de migration et de familiarité.

### vs. Composants sans affichage {#vs-renderless-components}

Dans le chapitre sur les slots de composants, nous avons discuté du modèle du [Composant sans affichage](/guide/components/slots#renderless-components) basé sur des slots délimités. Nous avons même implémenté la même démo de suivi de la souris en utilisant des composants sans affichage.

Le principal avantage des composables par rapport aux composants sans affichage est que les composables n'encourent pas de surcharge d'instance de composant supplémentaire. Lorsqu'il est utilisé dans une application entière, la quantité d'instances de composants supplémentaires créées par le modèle de Composant sans affichage peut devenir une surcharge de performances notable.

La recommandation est d'employer les composables pour centraliser une logique pure, et d'utiliser des composants pour une réutilisation de logique **et** de disposition visuelle.

### vs. les hooks de React {#vs-react-hooks}

Si vous avez de l'expérience avec React, vous remarquerez peut-être que cela ressemble beaucoup aux hooks personnalisés de React. La Composition API a été en partie inspirée des hooks de React, et les composables Vue sont en effet similaires aux hooks de React en termes de capacités de composition logique. Cependant, les composables Vue sont basés sur le système de réactivité de Vue, qui est fondamentalement différent du modèle d'exécution des hooks React. Ceci est discuté plus en détail dans la [FAQ sur la Composition API](/guide/extras/composition-api-faq#comparison-with-react-hooks).

## Lecture complémentaire {#further-reading}

- [La réactivité en détails](/guide/extras/reactivity-in-depth) : pour une compréhension de bas niveau du fonctionnement du système de réactivité de Vue.
- [Gestion d'état](/guide/scaling-up/state-management) : pour les patterns de gestion d'état partagés par plusieurs composants.
- [Tester les composables](/guide/scaling-up/testing#testing-composables) : conseils sur les tests de composables.
- [VueUse](https://vueuse.org/): une collection de composables Vue. Le code source est également une excellente ressource d'apprentissage.
