## Gestion des états

## Mise en œuvre officielle de Flux-Like

Les grandes applications peuvent souvent devenir de plus en plus complexes, en raison des multiples éléments d'état dispersés dans de nombreux composants et des interactions entre eux. Pour résoudre ce problème, Vue propose [Vuex](https://next.vuex.vuejs.org/), notre propre bibliothèque de gestion d'état inspirée d'Elm. Elle s'intègre même à [vue-devtools](https://github.com/vuejs/vue-devtools), offrant un accès immédiat au [débogage par voyage dans le temps](https://raw.githubusercontent.com/vuejs/vue-devtools/master/media/demo.gif).

### Informations pour les développeurs React

Si vous venez de React, vous vous demandez peut-être comment vuex se compare à [redux](https://github.com/reactjs/redux), l'implémentation de Flux la plus populaire dans cet écosystème. Redux est en fait agnostique à la couche de visualisation, il peut donc facilement être utilisé avec Vue via [liaisons simples](https://classic.yarnpkg.com/en/packages?q=redux%20vue&p=1). Vuex est différent en ce sens qu'il _sait_ qu'il se trouve dans une application Vue. Cela lui permet de mieux s'intégrer à Vue, en offrant une API plus intuitive et une expérience de développement améliorée.

## Gestion d'état simple à partir de zéro

On oublie souvent que la source de vérité dans les applications Vue est l'objet réactif `data` - une instance de composant ne fait qu'y accéder par procuration. Par conséquent, si vous avez un élément d'état qui doit être partagé par plusieurs instances, vous pouvez utiliser une méthode [reactive](/guide/reactivity-fundamentals.html#declarer-un-etat-reactive) pour rendre un objet réactif :

```js
const { createApp, reactive } = Vue

const sourceOfTruth = reactive({
  message: 'Hello'
})

const appA = createApp({
  data() {
    return sourceOfTruth
  }
}).mount('#app-a')

const appB = createApp({
  data() {
    return sourceOfTruth
  }
}).mount('#app-b')
```

```html
<div id="app-a">App A: {{ message }}</div>

<div id="app-b">App B: {{ message }}</div>
```

Maintenant, chaque fois que `sourceOfTruth` est muté, les deux `appA` et `appB` vont mettre à jour leurs vues automatiquement. Nous avons maintenant une seule source de vérité, mais le débogage serait un cauchemar. N'importe quelle donnée pourrait être modifiée par n'importe quelle partie de notre application à n'importe quel moment, sans laisser de trace.

```js
const appB = createApp({
  data() {
    return sourceOfTruth
  },
  mounted() {
    sourceOfTruth.message = 'Goodbye' // les deux applications vont rendre le message 'Goodbye' maintenant.
  }
}).mount('#app-b')
```

Pour aider à résoudre ce problème, nous pouvons adopter un **modèle de magasin** :

```js
const store = {
  debug: true,

  state: reactive({
    message: 'Hello!'
  }),

  setMessageAction(newValue) {
    if (this.debug) {
      console.log('setMessageAction triggered with', newValue)
    }

    this.state.message = newValue
  },

  clearMessageAction() {
    if (this.debug) {
      console.log('clearMessageAction triggered')
    }

    this.state.message = ''
  }
}
```

Remarquez que toutes les actions qui modifient l'état du magasin sont placées dans le magasin lui-même. Grâce à ce type de gestion centralisée de l'état, il est plus facile de comprendre quels types de mutations peuvent se produire et comment elles sont déclenchées. Désormais, lorsque quelque chose ne va pas, nous aurons également un journal de ce qui s'est passé jusqu'au bug.

En outre, chaque instance/composant peut toujours posséder et gérer son propre état privé :

```html
<div id="app-a">{{sharedState.message}}</div>

<div id="app-b">{{sharedState.message}}</div>
```

```js
const appA = createApp({
  data() {
    return {
      privateState: {},
      sharedState: store.state
    }
  },
  mounted() {
    store.setMessageAction('Goodbye!')
  }
}).mount('#app-a')

const appB = createApp({
  data() {
    return {
      privateState: {},
      sharedState: store.state
    }
  }
}).mount('#app-b')
```

![State Management](/images/state.png)

::: tip
Vous ne devez jamais remplacer l'objet d'état original dans vos actions - les composants et le magasin doivent partager la référence au même objet pour que les mutations soient observées.
:::

En poursuivant le développement de cette convention, selon laquelle les composants ne sont jamais autorisés à modifier directement l'état d'un magasin, mais doivent au contraire envoyer des événements qui notifient au magasin d'effectuer des actions, nous arrivons finalement à l'architecture [Flux](https://facebook.github.io/flux/). L'avantage de cette convention est que nous pouvons enregistrer toutes les mutations d'état qui se produisent dans le magasin et mettre en œuvre des aides au débogage avancées telles que les journaux de mutation, les instantanés et les relances de l'historique/le voyage dans le temps.

Cela nous ramène à [Vuex](https://next.vuex.vuejs.org/), donc si vous avez lu jusqu'ici, il est probablement temps de l'essayer !
