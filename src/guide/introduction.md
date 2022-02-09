---
footer: false
---

# Introduction

:::info Vous êtes en train de lire la documentation de Vue 3

- La documentation de Vue 2 est désormais disponible sur [v2.vuejs.org](https://v2.vuejs.org/).
- Vous souhaitez migrer vers Vue 2? Jetez un oeil sur [le guide de migration (EN)](https://v3-migration.vuejs.org/).
  :::

## Qu'est-ce que Vue?

Vue (/vjuː/ à prononcer comme en anglais: **view**) est un framework JavaScript pour la création d'interfaces utilisateur. Il se repose sur les standards HTML, CSS et JavaScript, et propose une manière efficace de déclarer des composants pour la construction d'interfaces utilisateur simples comme complexes.

Voici un exemple simple :
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

```vue-html
<div id="app">
  <button @click="count++">
    count is {{ count }}
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
    count is {{ count }}
  </button>
</div>

Cet exemple illustre les deux principales fonctionnalités de Vue :

- **Rendu déclaratif** : Vue s'appuie sur le standard HTML avec une syntaxe de type template qui permet de décrire de manière déclarative la structure HTML tout en étant basée sur un état JavaScript.

- **Réactivité** : Vue traque automatiquement tout changement d'état JavaScript et met à jour efficacement le DOM en cas de changement.

Il se peut que des questions vous assaillent - pas d'inquiétude. Nous allons couvrir tous les petits détails dans la suite de la documentation. Pour l'instant, veuillez lire scrupuleusement la documentation afin d'avoir une compréhension large de ce que propose Vue.

:::tip Pré-requis
La suite de la documentation présuppose que vous soyez familier avec l'HTML, le CSS et le JavaScript. Si vous êtes à vos tous premiers pas dans le développement front-end, il est préférable de ne pas vous lancer tout de suite dans l'usage d'un framework - armez-vous des basiques et revenez ici.  
Une expérience préalable avec d'autres framework peut aider, mais n'est pas obligatoire.
:::

## Le Framework Évolutif

Vue est un framework et un écosystème qui couvre la plupart des fonctionnalités courantes nécessaires au développement front-end. Par la diversité du web; les choses que nous y construisons peuvent varier radicalement. C'est pourquoi Vue a été conçu pour être flexible et adaptable de manière incrémentale. En fonction de votre besoin, Vue peut être utilisé de différentes manières :

- Extension du HTML statique sans étape de construction
- Intégration de composants web (custom element) sur n'importe quelle page
- Application mono-page (SPA)
- Fullstack / Rendu côté serveur (SSR)
- JAMStack / Génération de sites statiques (SSG)
- Adapté pour l'ordinateur de bureau, le mobile, pour le WebGL et même le terminal.

Si vous trouvez ces concepts intimidants, ne vous inquiétez pas ! Le tutoriel et le guide ne requièrent que des connaissances de base en HTML et en JavaScript, et vous devriez pouvoir les suivre sans être un expert dans l'un de ces domaines.

Si vous êtes un développeur expérimenté et que vous souhaitez savoir comment intégrer au mieux Vue dans vos outils, ou si vous êtes curieux de savoir ce que ces termes signifient, nous en parlons plus en détail dans [TODO(fr)Les manières d'utiliser Vue](/guide/extras/ways-of-using-vue).

Malgré la flexibilité, les connaissances de base sur le fonctionnement de Vue sont partagées dans tous ces cas d'utilisation. Même si vous n'êtes qu'à vos débuts, les connaissances acquises en cours de route vous seront utiles pour atteindre des objectifs plus ambitieux à l'avenir. Si vous avez niveau expérimenté, vous pouvez choisir la manière optimale de tirer parti de Vue en fonction des problèmes que vous essayez de résoudre, tout en conservant la même productivité. C'est pourquoi nous appelons Vue "le framework évolutif" : c'est un framework qui peut grandir avec vous et s'adapter à vos besoins.

## Composant à fichier unique (Single-File Components)

Dans la plupart des projets Vue dotés d'outils de construction, nous créons des composants Vue en utilisant un format de fichier de type HTML appelé **Single-File Component** (également connu sous le nom de fichiers `*.vue`, abrégé en **SFC**). Un SFC Vue, comme son nom l'indique, encapsule la logique (JavaScript), le modèle (HTML) et les styles (CSS) du composant dans un seul fichier. Voici l'exemple précédent, écrit au format SFC :

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
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

SFC est une fonctionnalité essentielle de Vue, et c'est la manière recommandée de créer des composants Vue **si** votre usage justifie une configuration avancée (usant d'outils de construction). Vous pouvez en savoir plus sur le [TODO(fr)comment et pourquoi du SFC](/guide/scaling-up/sfc) dans la section qui lui est consacrée - mais pour l'instant, sachez que Vue se chargera de la configuration des outils de construction pour vous.

## Styles d'API

Les composants Vue peuvent être créés dans deux styles d'API différents : l'**API Options** et l'**API de Composition**.

### API Options

Avec l'API Options, nous définissons la logique d'un composant en utilisant un objet d'options telles que `data`, `methods`, et `mounted`. Les propriétés définies par les options sont exposées sur `this` dans les fonctions, qui pointe sur l'instance du composant :

```vue
<script>
export default {
  // Les propriétés retournées par data() deviennent des états réactifs.
  // et seront exposées sur `this`.
  data() {
    return {
      count: 0
    }
  },

  // Les méthodes sont des fonctions qui modifient l'état et déclenchent des mises à jour.
  // Elles peuvent être liées en tant qu'écouteurs d'événements dans les modèles.
  methods: {
    increment() {
      this.count++
    }
  },

  // Les hooks de cycle de vie sont appelés à différentes étapes
  // du cycle de vie d'un composant.
  // Cette fonction sera appelée lorsque le composant sera monté.
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">count is: {{ count }}</button>
</template>
```

[Try it in the Playground](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLy8gcmVhY3RpdmUgc3RhdGVcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY291bnQ6IDBcbiAgICB9XG4gIH0sXG5cbiAgLy8gZnVuY3Rpb25zIHRoYXQgbXV0YXRlIHN0YXRlIGFuZCB0cmlnZ2VyIHVwZGF0ZXNcbiAgbWV0aG9kczoge1xuICAgIGluY3JlbWVudCgpIHtcbiAgICAgIHRoaXMuY291bnQrK1xuICAgIH1cbiAgfSxcblxuICAvLyBsaWZlY3ljbGUgaG9va3NcbiAgbW91bnRlZCgpIHtcbiAgICBjb25zb2xlLmxvZyhgVGhlIGluaXRpYWwgY291bnQgaXMgJHt0aGlzLmNvdW50fS5gKVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPmNvdW50IGlzOiB7eyBjb3VudCB9fTwvYnV0dG9uPlxuPC90ZW1wbGF0ZT4ifQ==)

### API de Composition

Avec l'API de Composition, nous définissons la logique d'un composant à l'aide de fonctions API importées. Dans les SFC, l'API de Composition est généralement utilisée avec [`<script setup>`](/api/sfc-script-setup). L'attribut `setup` est une indication qui permet à Vue d'effectuer des transformations au moment de la compilation, ce qui nous permet d'utiliser l'API de Composition avec moins de texte passe-partout. Par exemple, les importations et les variables / fonctions de premier niveau déclarées dans `<script setup>` sont directement utilisables dans le modèle.

Voici le même composant, avec exactement le même modèle, mais en utilisant l'API de Composition et `<script setup>` à la place :

```vue
<script setup>
import { ref, onMounted } from 'vue'

// reactive state
const count = ref(0)

// functions that mutate state and trigger updates
function increment() {
  count.value++
}

// lifecycle hooks
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[Try it in the Playground](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgb25Nb3VudGVkIH0gZnJvbSAndnVlJ1xuXG4vLyByZWFjdGl2ZSBzdGF0ZVxuY29uc3QgY291bnQgPSByZWYoMClcblxuLy8gZnVuY3Rpb25zIHRoYXQgbXV0YXRlIHN0YXRlIGFuZCB0cmlnZ2VyIHVwZGF0ZXNcbmZ1bmN0aW9uIGluY3JlbWVudCgpIHtcbiAgY291bnQudmFsdWUrK1xufVxuXG4vLyBsaWZlY3ljbGUgaG9va3Ncbm9uTW91bnRlZCgoKSA9PiB7XG4gIGNvbnNvbGUubG9nKGBUaGUgaW5pdGlhbCBjb3VudCBpcyAke2NvdW50LnZhbHVlfS5gKVxufSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxidXR0b24gQGNsaWNrPVwiaW5jcmVtZW50XCI+Y291bnQgaXM6IHt7IGNvdW50IH19PC9idXR0b24+XG48L3RlbXBsYXRlPiJ9)

### Laquelle choisir ?

Tout d'abord, les deux styles d'API sont parfaitement capables de couvrir les cas d'utilisation courants. Il s'agit de différentes interfaces alimentées par le même système sous-jacent. En fait, l'API Options est mise en œuvre au-dessus de l'API de Composition ! Les concepts fondamentaux et les connaissances sur Vue sont partagés entre les deux styles.

L'API Options est centrée sur le concept d'une "instance de composant" (`this` comme dans l'exemple), qui s'aligne généralement mieux sur un modèle mental basé sur les classes pour les utilisateurs issus de la POO. Elle est également plus conviviale pour les débutants, car elle fait abstraction des détails de la réactivité et impose une organisation du code par le biais de groupes d'options.

L'API de Composition est centrée sur la déclaration de variables d'état réactives directement dans la portée d'une fonction, et sur la composition de l'état de plusieurs fonctions pour gérer la complexité. Elle est plus libre et nécessite une compréhension du fonctionnement de la réactivité dans Vue pour être utilisée efficacement. En retour, sa flexibilité permet des modèles plus puissants pour organiser et réutiliser la logique.

Pour en savoir plus sur la comparaison entre les deux styles et les avantages potentiels de l'API de Composition, consultez la [TODO(fr)FAQ sur l'API de Composition](/guide/extras/composition-api-faq).

Si Vue est nouveau pour vous, voici notre recommandation générale :

- Pour l'apprentissage, choisissez le style qui vous semble le plus facile à comprendre. Encore une fois, la plupart des concepts fondamentaux sont partagés entre les deux styles. Vous pourrez toujours choisir l'autre style plus tard.

- Pour une utilisation en production :

  - Optez pour l'API Options si vous n'utilisez pas d'outils de construction ou si vous prévoyez d'utiliser Vue principalement dans des scénarios peu complexes, par exemple par une amélioration progressive de votre projet.

  - Choisissez l'API de Composition + les composants à fichier unique (SFC) si vous envisagez de créer des applications complètes avec Vue.

Vous n'avez pas à vous engager dans un seul style pendant la phase d'apprentissage. Le reste de la documentation fournira des exemples de code dans les deux styles, le cas échéant, et vous pourrez passer de l'un à l'autre à tout moment à l'aide du bouton **Préférence d'API** en haut de la barre latérale gauche.

## Toujours des questions ?

Consultez notre [TODO(fr)FAQ](/about/faq).

## Choisissez votre parcours d'apprentissage

Chaque développeur a un style d'apprentissage différent. N'hésitez pas à choisir le parcours d'apprentissage qui vous convient le mieux, même si nous vous recommandons de revoir l'ensemble du contenu si possible !

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Essayer le tutoriel</p>
    <p class="next-steps-caption">Si apprendre en faisant est dans vos habitudes d'apprentissage.</p>
  </a>
  <a class="vt-box" href="/guide/quick-start.html">
    <p class="next-steps-link">Lire le guide</p>
    <p class="next-steps-caption">Le guide vous amènera à travers tous les aspects du framework, dans tous ses détails..</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Découvrir les exemples</p>
    <p class="next-steps-caption">Explorez les exemples de fonctionnalités de base et de cas d'usage courants..</p>
  </a>
</div>
