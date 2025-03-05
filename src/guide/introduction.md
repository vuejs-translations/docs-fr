---
footer: false
---

# Introduction {#introduction}

:::info Vous êtes en train de lire la documentation de Vue 3

- Le support de Vue 2 s'est terminé le **31 décembre 2023**. En savoir plus sur [Vue 2 EOL (Fin de vie)](https://v2.vuejs.org/eol/).
- Vous souhaitez migrer depuis Vue 2 ? Jetez un œil sur [le guide de migration (EN)](https://v3-migration.vuejs.org/).
  :::

<style src="@theme/styles/vue-mastery.css"></style>
<div class="vue-mastery-link">
  <a href="https://www.vuemastery.com/courses/" target="_blank">
    <div class="banner-wrapper">
      <img class="banner" alt="Vue Mastery banner" width="96px" height="56px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vuemastery-graphical-link-96x56.png" />
    </div>
    <p class="description">Apprenez Vue avec des tutoriels vidéos sur <span>VueMastery.com</span></p>
    <div class="logo-wrapper">
        <img alt="Vue Mastery Logo" width="25px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vue-mastery-logo.png" />
    </div>
  </a>
</div>

## Qu'est-ce que Vue? {#what-is-vue}

Vue (/vjuː/ à prononcer comme en anglais: **view**) est un framework JavaScript qui se repose sur les standards HTML, CSS et JavaScript. Il propose une manière efficace de déclarer des composants pour la construction d'interfaces utilisateur de toute complexité.

Voici un exemple simple :

<div class="options-api">

```js
import { createApp } from 'vue'

createApp({
  data() {
    return {
      count: 0
    }
  }
}).mount('#app')
```

</div>
<div class="composition-api">

```js
import { createApp, ref } from 'vue'

createApp({
  setup() {
    return {
      count: ref(0)
    }
  }
}).mount('#app')
```

</div>

```vue-html
<div id="app">
  <button @click="count++">
    Le compteur est à {{ count }}
  </button>
</div>
```

**Résultat**

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<div class="demo">
  <button @click="count++">
    Le compteur est à {{ count }}
  </button>
</div>

Cet exemple illustre les deux principales fonctionnalités de Vue :

- **Rendu déclaratif** : Vue s'appuie sur le standard HTML avec une syntaxe de type template qui permet de décrire de manière déclarative la structure HTML tout en étant basée sur un état JavaScript.

- **Réactivité** : Vue traque automatiquement tout changement d'état JavaScript et met à jour efficacement le DOM en cas de changement.

Il se peut que vous ayez déjà des questions - pas d'inquiétude. Nous allons couvrir tous les petits détails dans la suite de la documentation. Pour l'instant, veuillez lire scrupuleusement la documentation afin d'avoir une vision d'ensemble de ce que propose Vue.

:::tip Pré-requis
La suite de la documentation présuppose que vous soyez familier avec le HTML, le CSS et le JavaScript. Si vous débutez totalement dans le développement front-end, ce n'est peut-être pas la meilleure idée de vous lancer directement dans un framework pour vos premiers pas. Apprenez les bases puis revenez ! Vous pouvez consolider votre niveau de connaissance avec ces aperçus pour [JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Introduction), [HTML](https://developer.mozilla.org/fr/docs/Learn/HTML/Introduction_to_HTML) et [CSS](https://developer.mozilla.org/fr/docs/Learn/CSS/First_steps) si nécessaire. Une précédente expérience avec d'autres frameworks vous aidera, mais n'est pas strictement requise.
:::

## Le Framework Évolutif {#the-progressive-framework}

Vue est un framework et un écosystème qui couvre la plupart des fonctionnalités courantes nécessaires au développement front-end. Le Web est très diversifié; les choses que nous y construisons peuvent varier radicalement. C'est pourquoi Vue a été conçu pour être flexible et adoptable de manière incrémentale. En fonction de votre cas d'utilisation, Vue peut être utilisé de différentes manières :

- Extension du HTML statique sans étape de construction
- Intégration de Web Components (éléments personnalisés) sur n'importe quelle page
- Application mono-page (SPA)
- Fullstack / Rendu côté serveur (SSR)
- JAMStack / Génération de sites statiques (SSG)
- Adapté pour l'ordinateur de bureau, le mobile, pour le WebGL et même le terminal.

Si vous trouvez ces concepts intimidants, ne vous inquiétez pas ! Le tutoriel et le guide ne requièrent que des connaissances de base en HTML et en JavaScript, et vous devriez pouvoir les suivre sans être un expert dans l'un de ces domaines.

Si vous êtes un développeur expérimenté et que vous souhaitez savoir comment intégrer au mieux Vue dans vos outils, ou si vous êtes curieux de savoir ce que ces termes signifient, nous en parlons plus en détail dans [Les manières d'utiliser Vue](/guide/extras/ways-of-using-vue).

Malgré la flexibilité, les connaissances de base sur le fonctionnement de Vue sont partagées dans tous ces cas d'utilisation. Même si vous n'êtes qu'à vos débuts, les connaissances acquises en cours de route vous seront utiles pour atteindre des objectifs plus ambitieux à l'avenir. Si vous avez un niveau expérimenté, vous pouvez choisir la manière optimale de tirer parti de Vue en fonction des problèmes que vous essayez de résoudre, tout en conservant la même productivité. C'est pourquoi nous appelons Vue "le framework évolutif" : c'est un framework qui peut grandir avec vous et s'adapter à vos besoins.

## Composant monofichier (Single-File Components) {#single-file-components}

Dans la plupart des projets Vue dotés d'outils de construction, nous créons des composants Vue en utilisant un format de fichier semblable à HTML appelé **Composant monofichier**, ou **Single-File Component** en anglais (également connu sous le nom de fichiers `*.vue`, abrégé en **SFC**). Un SFC Vue, comme son nom l'indique, encapsule la logique (JavaScript), le modèle (HTML) et les styles (CSS) du composant dans un seul fichier. Voici l'exemple précédent, écrit au format SFC :

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">Le compteur est à {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">Le compteur est à {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

</div>

Les SFC sont une fonctionnalité essentielle de Vue, et c'est la manière recommandée de créer des composants Vue **si** votre usage justifie une configuration avancée (usant d'outils de construction). Vous pouvez en savoir plus sur le [comment et pourquoi faire des SFC](/guide/scaling-up/sfc) dans la section qui lui est consacrée - mais pour l'instant, sachez que Vue se chargera de la configuration des outils de construction pour vous.

## Styles d'API {#api-styles}

Les composants Vue peuvent être créés dans deux styles d'API différents : l'**Options API** et la **Composition API**.

### Options API {#options-api}

Avec l'Options API, nous définissons la logique d'un composant en utilisant un objet d'options telles que `data`, `methods`, et `mounted`. Les propriétés définies par les options sont exposées sur `this` dans les fonctions, qui pointe sur l'instance du composant :

```vue
<script>
export default {
  // état réactif
  data() {
    return {
      count: 0
    }
  },

  // Les méthodes sont des fonctions qui modifient l'état et déclenchent des mises à jour
  // Elles peuvent être utilisées par des gestionnaires d'événements dans le template.
  methods: {
    increment() {
      this.count++
    }
  },

  // hooks de cycle de vie
  mounted() {
    console.log(`La valeur initiale de count est ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[Essayer en ligne](https://play.vuejs.org/#eNptUEtOwzAQvcooQqJVUcK6ChWILUfIosaZkKGOHexxBYpyF7Y9Ry7GOOlng2TZ80bzPuMhe+n7/Bgx22Zl0J563lUWv3vnGWpsVDQMQ2UBigKmEysGP52UZmpSs1asVutlAMAjR28vCEC7aHkLjwse0zM+VPas1jgrMs4G+IoEnaupIbQM5n7xQQkwnbRBq9vUrzFAR0Hu6Rc+XfRJp0NuXR22F1Oy2mMn47dUANxSyOcwm83/WVrnDkEcQP+IYSqOhLN+YmF9U9MS2BnMjftY7d9kThmMXnyJScpZI3EAA8PdcLMe8/16dq2snLK4frYAxq43ilEQQPkemZ2FZ21IH56q7LpTle1eZ21KCw9no3Esi4Ui9LK4amXjH+vhpTQ=)

### Composition API {#composition-api}

Avec la Composition API, nous définissons la logique d'un composant à l'aide de fonctions API importées. Dans les SFC, la Composition API est généralement utilisée avec [`<script setup>`](/api/sfc-script-setup). L'attribut `setup` est une indication qui permet à Vue d'effectuer des transformations au moment de la compilation, ce qui nous permet d'utiliser la Composition API avec moins de code nécessaire aux déclarations. Par exemple, les importations et les variables / fonctions déclarées au niveau racine dans `<script setup>` sont directement utilisables dans le modèle.

Voici le même composant, avec exactement le même modèle, mais en utilisant la Composition API et `<script setup>` à la place :

```vue
<script setup>
import { ref, onMounted } from 'vue'

// état réactif
const count = ref(0)

// fonctions qui modifient l'état et déclenchent des mises à jour
function increment() {
  count.value++
}

// hooks de cycle de vie
onMounted(() => {
  console.log(`La valeur initiale de count est ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[Essayer en ligne](https://play.vuejs.org/#eNo9UF1OwzAMvopVIa3TUMvz1E0gXuEGeVhJXRaWOiVxJqEqd+F15+jFcNvRh0S28/3k85C99H1xjZjtsypob3qGgBz7oyLT9c4zDOCxfQRH7y4SYwMJWu862Ahro0hRWcJ445rBj7das2kVaUeBQU8EOEz8/Gl7h7aOBCPv8B0NdK4xrUGB2c0iggzNeNMWSZ+neYMBOhPkHn/hy0WvqI2LBBjSHjtB5VsYFMHiWFxrG3G3U5TunmfnLiIE+kd0p+JqUNGaKBf64fivQMFZLKz7zE9vgqwtRi9Oho2Us8ocCyXgw8BnE4p5kIqTRExyqnJZpKxQGsautzWjdADVR2SWjz9ra/TloLI1gcqOr7OuCXsYhrtJSlW5UIRelatWlv4ArcWg0Q==)

### Laquelle choisir ? {#which-to-choose}

Tout d'abord, les deux styles d'API sont parfaitement capables de couvrir les cas d'utilisation courants. Il s'agit de différentes interfaces alimentées par le même système sous-jacent. En fait, l'Options API est implémentée par dessus la Composition API ! Les concepts fondamentaux et les connaissances sur Vue sont partagés entre les deux styles.

L'Options API est centrée sur le concept d'une "instance de composant" (`this` comme dans l'exemple), qui s'aligne généralement mieux sur un modèle mental basé sur les classes pour les utilisateurs issus de la POO. Elle est également plus adaptée aux débutants, car elle fait abstraction des détails de la réactivité et impose une organisation du code par le biais de groupes d'options.

La Composition API est centrée sur la déclaration de variables d'état réactives directement dans la portée d'une fonction, et sur la composition de l'état de plusieurs fonctions pour gérer la complexité. Elle offre une plus grande liberté d'écriture et nécessite une compréhension du fonctionnement de la réactivité dans Vue pour être utilisée efficacement. En retour, sa flexibilité permet des modèles plus puissants pour organiser et réutiliser la logique.

Pour en savoir plus sur la comparaison entre les deux styles et les avantages potentiels de la Composition API, consultez la [FAQ sur la Composition API](/guide/extras/composition-api-faq).

Si Vue est nouveau pour vous, voici notre recommandation générale :

- Pour l'apprentissage, choisissez le style qui vous semble le plus facile à comprendre. Encore une fois, la plupart des concepts fondamentaux sont partagés entre les deux styles. Vous pourrez toujours choisir l'autre style plus tard.

- Pour une utilisation en production :

  - Optez pour l'Options API si vous n'utilisez pas d'outils de construction ou si vous prévoyez d'utiliser Vue principalement dans des scénarios peu complexes, par exemple par une amélioration progressive de votre projet.

  - Choisissez la Composition API + les composants monofichiers (SFC) si vous envisagez de créer des applications complètes avec Vue.

Vous n'avez pas à vous engager dans un seul style pendant la phase d'apprentissage. Le reste de la documentation fournira des exemples de code dans les deux styles, et vous pourrez passer de l'un à l'autre à tout moment à l'aide du bouton **Préférence d'API** en haut de la barre latérale gauche.

## Encore des questions ? {#still-got-questions}

Consultez notre [FAQ](/about/faq).

## Choisissez votre parcours d'apprentissage {#pick-your-learning-path}

Chaque développeur a un style d'apprentissage différent. N'hésitez pas à choisir le parcours d'apprentissage qui vous convient le mieux, même si nous vous recommandons de revoir l'ensemble du contenu si possible !

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Essayer le tutoriel</p>
    <p class="next-steps-caption">Pour ceux qui préfèrent apprendre par la pratique.</p>
  </a>
  <a class="vt-box" href="/guide/quick-start.html">
    <p class="next-steps-link">Lire le guide</p>
    <p class="next-steps-caption">Le guide vous amènera à travers tous les aspects du framework, dans tous ses détails.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Découvrir les exemples</p>
    <p class="next-steps-caption">Explorez les exemples de fonctionnalités de base et de cas d'usage courants.</p>
  </a>
</div>
