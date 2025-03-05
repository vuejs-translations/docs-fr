---
outline: deep
---

# Performance {#performance}

## Vue d'ensemble {#overview}

Vue est conçu pour être performant dans la plupart des cas d'utilisation courants, sans que vous soyez contraints de procéder à des optimisations manuelles. Cependant, il y a toujours des scénarios complexes où un réglage plus fin est requis. Dans cette section, nous allons voir à quoi vous devez faire attention concernant les performances dans une application Vue.

Tout d'abord, discutons des deux principaux aspects de la performance web :

- **Performance de chargement des pages** : rapidité avec laquelle l'application affiche le contenu et devient interactive lors de la première visite. Elle est généralement mesurée à l'aide de mesures web vitales comme [Largest Contentful Paint (LCP)](https://web.dev/lcp/) et [Interaction to Next Paint](https://web.dev/articles/inp).

- **Performance de mise à jour** : vitesse à laquelle l'application se met à jour en réponse aux entrées de l'utilisateur. Par exemple, la vitesse à laquelle une liste se met à jour lorsque l'utilisateur tape dans un champ de recherche, ou la vitesse à laquelle la page change lorsque l'utilisateur clique sur un lien de navigation dans une application monopage (SPA).

L'idéal serait de maximiser les deux, mais les différentes architectures frontend ont tendance à rendre compliqué d'atteindre les performances souhaitées. En outre, le type d'application que vous construisez influence grandement ce à quoi vous devez donner la priorité en termes de performances. Par conséquent, la première étape pour garantir des performances optimales consiste à choisir la bonne architecture pour votre application :

- Consulter les [Manières d'utiliser Vue](/guide/extras/ways-of-using-vue) pour voir comment vous pouvez tirer parti de Vue de différentes manières.

- Jason Miller examine les types d'applications web et leur mise en œuvre idéale dans [les holotypes des applications](https://jasonformat.com/application-holotypes/).

## Options d'analyse {#profiling-options}

Pour améliorer les performances, nous devons d'abord savoir comment les mesurer. Il existe un certain nombre d'outils performants qui peuvent vous aider :

Pour l'analyse des performances de chargement des déploiements de production :

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

Pour l'analyse des performances durant le développement local :

- [Panneau de performances des Chrome DevTools](https://developer.chrome.com/docs/devtools/evaluate-performance/)
  - [`app.config.performance`](/api/application#app-config-performance) active les marqueurs de performance spécifiques à Vue dans la timeline des performances de Chrome DevTools.
- [L'extension Vue DevTools](/guide/scaling-up/tooling#browser-devtools) fournit également une fonctionnalité d'analyse des performances.

## Optimisation du chargement des pages {#page-load-optimizations}

Il existe de nombreux aspects indépendants du framework pour optimiser les performances de chargement des pages - consultez [le guide web.dev](https://web.dev/fast/) pour un tour d'horizon complet. Ici, nous nous concentrerons principalement sur les techniques spécifiques à Vue.

### Choisir la bonne architecture {#choosing-the-right-architecture}

Si votre application est sensible aux performances de chargement des pages, évitez de la rendre en tant que SPA entièrement côté client. Vous voulez que votre serveur envoie directement le HTML contenant le contenu que les utilisateurs veulent voir. Le rendu côté purement client souffre d'un temps d'accès au contenu plus lent. Ceci peut être atténué avec [le rendu côté serveur (SSR)](/guide/extras/ways-of-using-vue#fullstack-ssr) ou [la génération de site statique (SSG)](/guide/extras/ways-of-using-vue#jamstack-ssg). Consultez le [Guide SSR](/guide/scaling-up/ssr) pour en savoir plus sur l'exécution SSR avec Vue. Si votre application n'a pas besoin d'une grande interactivité, vous pouvez également utiliser un serveur backend traditionnel pour rendre le HTML et le rendre interactif avec Vue côté client.

Si votre application doit être une SPA, mais qu'elle comporte des pages marketing (accueil, à propos, blog), envoyez-les séparément ! Vos pages marketing devraient idéalement être déployées en HTML statique avec un minimum de JS, en utilisant la SSG.

### Taille des paquets et _Tree-shaking_ {#bundle-size-and-tree-shaking}

L'un des moyens les plus efficaces d'améliorer les performances de chargement des pages consiste à envoyer des paquets JavaScript plus petits. Voici quelques moyens de réduire la taille des paquets lorsque vous utilisez Vue :

- Utilisez un outil de build si possible.

  - De nombreuses API de Vue peuvent être ["retirées de l'arbre"](https://developer.mozilla.org/fr/docs/Glossary/Tree_shaking) si elles sont groupées via un outil de construction moderne. Par exemple, si vous n'utilisez pas le composant natif `<Transition>`, il ne sera pas inclus dans le paquet de production final. Le _tree-shaking_ peut également supprimer d'autres modules inutilisés dans votre code source.

  - Lors de l'utilisation d'un outil de build, les templates sont pré-compilés afin que nous n'ayons pas besoin d'envoyer le compilateur Vue au navigateur. Cela permet d'économiser **14kb** de JavaScript au format min + gzipped et d'éviter le coût de la compilation au moment de l'exécution.

- Faites attention à la taille lorsque vous incorporez de nouvelles dépendances ! Dans les applications du monde réel, les paquets trop volumineux sont le plus souvent le résultat de l'introduction de lourdes dépendances sans s'en rendre compte.

  - Si vous utilisez un outil de build, préférez les dépendances qui offrent des formats de modules ES et qui sont compatibles au _tree-shaking._ Par exemple, préférez `lodash-es` à `lodash`.

  - Vérifiez la taille d'une dépendance et évaluez si elle vaut le coup par rapport à la fonctionnalité qu'elle apporte. Notez que si la dépendance peut être supprimée de l'arbre, l'augmentation réelle de la taille dépendra des API que vous importerez réellement. Des outils comme [bundlejs.com](https://bundlejs.com/) peuvent être utilisés pour des vérifications rapides, mais la mesure avec votre configuration de build réelle sera toujours la plus précise.

- Si vous utilisez Vue principalement pour une intégration progressive et préférez éviter un outil de build, envisagez plutôt d'utiliser [petite-vue](https://github.com/vuejs/petite-vue) (seulement **6kb**).

### Séparation du code {#code-splitting}

Le fractionnement du code consiste pour un outil de build à diviser le paquet d'applications en plusieurs petits morceaux, qui peuvent ensuite être chargés à la demande ou en parallèle. Avec un fractionnement de code approprié, les fonctionnalités requises au chargement de la page peuvent être téléchargées immédiatement, les morceaux supplémentaires n'étant chargés à la volée qu'en cas de besoin, ce qui améliore les performances.

Les bundlers comme Rollup (sur lequel Vite est basé) ou webpack peuvent créer automatiquement des morceaux de code fractionnés en détectant la syntaxe d'importation dynamique ESM :

```js
// lazy.js et ses dépendances seront divisées en un morceau à part
// et chargés que lorsque `loadLazy()` sera appelée.
function loadLazy() {
  return import('./lazy.js')
}
```

Le chargement à la volée est optimal pour les fonctionnalités qui ne sont pas immédiatement nécessaires après le chargement initial de la page. Dans les applications Vue, il peut être utilisé en combinaison avec la fonctionnalité [composants asynchrones](/guide/components/async) de Vue pour créer des morceaux fractionnés pour les arbres de composants :

```js
import { defineAsyncComponent } from 'vue'

// un morceau séparé est créé pour Foo.vue et ses dépendances.
// il n'est récupéré à la demande que lorsque le composant asynchrone est
// rendu sur la page.
const Foo = defineAsyncComponent(() => import('./Foo.vue'))
```

Pour les applications utilisant Vue Router, il est fortement recommandé d'utiliser le chargement à la volée pour les composants de route. Vue Router a un support explicite pour le chargement à la volée, séparé de `defineAsyncComponent`. Voir [le chargement à la volée des routes](https://router.vuejs.org/guide/advanced/lazy-loading.html) pour plus de détails.

## Optimisations des mises à jour {#update-optimizations}

### Stabilité des props {#props-stability}

Dans Vue, un composant enfant ne se met à jour que lorsqu'au moins une de ses props reçues a changé. Prenons l'exemple suivant :

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active-id="activeId" />
```

Dans le composant `<ListItem>`, les props `id` et `activeId` sont utilisées pour déterminer s'il s'agit de l'élément actif. Bien que cela fonctionne, le problème est que chaque fois que `activeId` change, **l'entièreté** des `<ListItem>` inclus dans la liste doit être mis à jour !

Dans l'idéal, seuls les éléments dont le statut d'activation a changé devraient être mis à jour. Nous pouvons y parvenir en déplaçant le calcul du statut d'activation dans le parent, et en faisant en sorte que `<ListItem>` accepte directement une prop `active` à la place :

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active="item.id === activeId" />
```

Désormais, pour la plupart des composants, la prop `active` restera la même lorsque `activeId` change, donc ils n'ont plus besoin de se mettre à jour. En général, l'idée est de garder les props passées aux composants enfants aussi stables que possible.

### `v-once` {#v-once}

`v-once` est une directive intégrée qui peut être utilisée pour rendre un contenu qui repose sur des données d'exécution mais qui n'a jamais besoin d'être mis à jour. Toute la sous-arborescence sur laquelle elle est utilisée sera ignorée pour toutes les mises à jour à venir. Consultez la [référence de son API](/api/built-in-directives#v-once) pour plus de détails.

### `v-memo` {#v-memo}

`v-memo` est une directive intégrée qui peut être utilisée pour éviter conditionnellement la mise à jour de grands sous-arbres ou de listes `v-for`. Consultez la [référence de son API](/api/built-in-directives#v-memo) pour plus de détails.

### Stabilité des Computed {#computed-stability}

À partir de 3.4, une propriété calculée ne déclenchera des effets que lorsque la valeur calculée aura changé par rapport à sa valeur précédente. Par exemple, la propriété calculée `isEven` ne va déclencher des effets que si la valeur retournée a changé de `true` à `false`, ou vice-versa :

```js
const count = ref(0)
const isEven = computed(() => count.value % 2 === 0)

watchEffect(() => console.log(isEven.value)) // true

// ne vas pas déclencher de nouveaux logs car la valeur calculée reste à `true`
count.value = 2
count.value = 4
```

Cela réduit le déclenchement inutile d'effet, mais ne fonctionne pas si la la propriété calculée retourne un nouvel object à chaque calcul :

```js
const computedObj = computed(() => {
  return {
    isEven: count.value % 2 === 0
  }
})
```

Du fait qu'un objet est créé à chaque fois, la nouvelle valeur sera techniquement toujours différente comparée à son ancienne valeur. Même si la propriété `isEven` reste la même, Vue ne sera pas capable de savoir sans une comparaison profonde entre son ancienne et sa nouvelle valeur. Ce genre de comparaison peut être très coûteuse and ne vaudrait pas toujours le coup.

À la place, nous pouvons optimiser cela en comparant manuellement la nouvelle valeur avec l'ancienne, et retourner l'ancienne valeur si l'on détecte aucun changement.

```js
const computedObj = computed((oldValue) => {
  const newValue = {
    isEven: count.value % 2 === 0
  }
  if (oldValue && oldValue.isEven === newValue.isEven) {
    return oldValue
  }
  return newValue
})
```

[Essayer en ligne](https://play.vuejs.org/#eNqVVMtu2zAQ/JUFgSZK4UpuczMkow/40AJ9IC3aQ9mDIlG2EokUyKVt1PC/d0lKtoEminMQQC1nZ4c7S+7Yu66L11awGUtNoesOwQi03ZzLuu2URtiBFtUECtV2FkU5gU2OxWpRVaJA2EOlVQuXxHDJJZeFkgYJayVC5hKj6dUxLnzSjZXmV40rZfFrh3Vb/82xVrLH//5DCQNNKPkweNiNVFP+zBsrIJvDjksgGrRahjVAbRZrIWdBVLz2yBfwBrIsg6mD7LncPyryfIVnywupUmz68HOEEqqCI+XFBQzrOKR79MDdx66GCn1jhpQDZx8f0oZ+nBgdRVcH/aMuBt1xZ80qGvGvh/X6nlXwnGpPl6qsLLxTtitzFFTNl0oSN/79AKOCHHQuS5pw4XorbXsr9ImHZN7nHFdx1SilI78MeOJ7Ca+nbvgd+GgomQOv6CNjSQqXaRJuHd03+kHRdg3JoT+A3a7XsfcmpbcWkQS/LZq6uM84C8o5m4fFuOg0CemeOXXX2w2E6ylsgj2gTgeYio/f1l5UEqj+Z3yC7lGuNDlpApswNNTrql7Gd0ZJeqW8TZw5t+tGaMdDXnA2G4acs7xp1OaTj6G2YjLEi5Uo7h+I35mti3H2TQsj9Jp6etjDXC8Fhu3F9y9iS+vDZqtK2xB6ZPNGGNVYpzHA3ltZkuwTnFf70b+1tVz+MIstCmmGQzmh/p56PGf00H4YOfpR7nV8PTxubP8P2GAP9Q==)

Notez que vous devez toujours effectuer le calcul complet avant la comparaison et retourner l'ancienne valeur, ainsi les mêmes dépendances pourront être réutiliser à chaque exécution.

## Optimisations générales {#general-optimizations}

> Les conseils suivants concernent les performances de chargement et de mise à jour des pages.

### Virtualiser des grandes listes {#virtualize-large-lists}

L'un des problèmes de performance les plus courants dans toutes les applications frontend est le rendu de grandes listes. Quelle que soit la performance d'un framework, le rendu d'une liste contenant des milliers d'éléments **sera** lent en raison du nombre de nœuds du DOM que le navigateur doit gérer.

Cependant, nous ne devons pas nécessairement rendre tous ces nœuds directement. Dans la plupart des cas, l'écran de l'utilisateur ne peut afficher qu'un petit sous-ensemble de notre grande liste. Nous pouvons améliorer considérablement les performances grâce à la **virtualisation de liste**, une technique qui consiste à ne rendre que les éléments d'une grande liste qui se trouvent actuellement dans la fenêtre d'affichage ou à proximité de celle-ci.

La mise en œuvre de la virtualisation des listes n'est pas facile, heureusement il existe des bibliothèques communautaires que vous pouvez utiliser directement :

- [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
- [vue-virtual-scroll-grid](https://github.com/rocwang/vue-virtual-scroll-grid)
- [vueuc/VVirtualList](https://github.com/07akioni/vueuc)

### Réduire la surcharge de réactivité pour les grandes structures immuables {#reduce-reactivity-overhead-for-large-immutable-structures}

Le système de réactivité de Vue est profond par défaut. Bien que cela rende la gestion de l'état intuitive, cela crée un certain niveau de surcharge lorsque la taille des données est importante, car chaque accès à une propriété déclenche un mécanisme des proxys qui effectuent un suivi des dépendances. Ce problème est généralement perceptible lorsque l'on traite de grands tableaux d'objets profondément imbriqués, où un seul rendu doit accéder à plus de 100 000 propriétés, et ne devrait donc affecter que des cas d'utilisation très spécifiques.

Vue fournit une échappatoire pour contourner la réactivité profonde en utilisant [`shallowRef()`](/api/reactivity-advanced#shallowref) et [`shallowReactive()`](/api/reactivity-advanced#shallowreactive). Les API partiellement réactives créent un état qui n'est réactif qu'au niveau de la racine, et exposent tous les objets imbriqués sans les modifier. L'accès aux propriétés imbriquées reste ainsi rapide, mais la contrepartie est que nous devons désormais traiter tous les objets imbriqués comme des objets immuables et que les mises à jour ne peuvent être déclenchées qu'en remplaçant l'état racine :

```js
const shallowArray = shallowRef([
  /* grande liste d'objets imbriqués */
])

// cela ne déclenchera pas de mise à jour...
shallowArray.value.push(newObject)
// mais cela si :
shallowArray.value = [...shallowArray.value, newObject]

// cela ne déclenchera pas de mise à jour...
shallowArray.value[0].foo = 1
// mais cela si :
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1
  },
  ...shallowArray.value.slice(1)
]
```

### Éviter les abstractions de composants inutiles {#avoid-unnecessary-component-abstractions}

Parfois, nous pouvons créer des [composants sans rendu](/guide/components/slots#renderless-components) ou des composants d'ordre supérieur (c'est-à-dire des composants qui rendent d'autres composants avec des props supplémentaires) pour une meilleure abstraction ou organisation du code. Bien qu'il n'y ait rien de mal à cela, gardez à l'esprit que les instances de composants sont beaucoup plus gourmandes d'un point de vue des performances que les simples nœuds du DOM, et que la création d'un trop grand nombre d'entre eux en raison des modèles d'abstraction entraînera des performances réduites.

Notez que la réduction de quelques instances seulement n'aura pas d'effet notable, donc ne vous inquiétez pas si le composant n'est rendu que quelques fois dans l'application. Le meilleur scénario pour envisager cette optimisation concerne à nouveau les grandes listes. Imaginez une liste de 100 éléments où chaque composant d'élément contient de nombreux composants enfants. La suppression d'une abstraction de composant inutile pourrait entraîner une réduction de centaines d'instances de composants.
