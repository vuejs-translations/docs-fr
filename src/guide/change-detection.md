# Change Detection Caveats in Vue 2

> Cette page ne s'applique qu'à Vue 2.x et aux versions ultérieures, et suppose que vous avez déjà lu la [Section Reactivity](reactivity.md). Veuillez lire cette section en premier.

En raison des limitations de JavaScript, il existe des types de modifications que Vue **ne peut pas détecter**. Cependant, il existe des moyens de les contourner pour préserver la réactivité.

#### Pour les objets

Vue ne peut pas détecter l'ajout ou la suppression de propriétés. Puisque Vue effectue le processus de conversion getter/setter pendant l'initialisation de l'instance, une propriété doit être présente dans l'objet `data` pour que Vue la convertisse et la rende réactive. Par exemple :

```js
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` est maintenant réactif

vm.b = 2
// `vm.b` n'est PAS réactif
```

Vue ne permet pas d'ajouter dynamiquement de nouvelles propriétés réactives de niveau racine à une instance déjà créée. Cependant, il est possible d'ajouter des propriétés réactives à un objet imbriqué en utilisant la méthode `Vue.set(object, propertyName, value)` :

```js
Vue.set(vm.someObject, 'b', 2)
```

Vous pouvez également utiliser la méthode d'instance `vm.$set`, qui est un alias de la méthode globale `Vue.set` :

```js
this.$set(this.someObject, 'b', 2)
```

Parfois, vous pouvez vouloir attribuer un certain nombre de propriétés à un objet existant, par exemple en utilisant `Object.assign()` ou `_.extend()`. Cependant, les nouvelles propriétés ajoutées à l'objet ne déclencheront pas de modifications. Dans ce cas, créez un nouvel objet avec les propriétés de l'objet original et de l'objet mixin :

```js
// au lieu de `Object.assign(this.someObject, { a : 1, b : 2 })`.
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

#### Pour les tableaux

Vue ne peut pas détecter les changements suivants dans un tableau :

1. Lorsque vous définissez directement un élément avec l'index, par exemple `vm.items[indexOfItem] = newValue`.
2. Lorsque vous modifiez la longueur du tableau, par exemple `vm.items.length = newLength`.

Par exemple :

```js
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // n'est PAS réactif
vm.items.length = 2 // n'est PAS réactif
```

Pour surmonter l'obstacle 1, les deux actions suivantes accompliront la même chose que `vm.items[indexOfItem] = newValue`, mais déclencheront également des mises à jour d'état dans le système de réactivité :

```js
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
```

```js
// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```

Vous pouvez également utiliser la méthode d'instance [`vm.$set`](https://vuejs.org/v2/api/#vm-set), qui est un alias de la méthode globale `Vue.set` :

```js
vm.$set(vm.items, indexOfItem, newValue)
```

To deal with caveat 2, you can use `splice`:

```js
vm.items.splice(newLength)
```

## Déclarer les propriétés réactives

Puisque Vue ne permet pas d'ajouter dynamiquement des propriétés réactives de niveau racine, vous devez initialiser les instances de composants en déclarant toutes les propriétés de données réactives de niveau racine, même avec une valeur vide :

```js
var vm = new Vue({
  data: {
    // déclarer le message avec une valeur vide
    message: ''
  },
  template: '<div>{{ message }}</div>'
})
// set `message` later
vm.message = 'Hello!'
```

Si vous ne déclarez pas `message` dans l'option de données, Vue vous avertira que la fonction de rendu tente d'accéder à une propriété qui n'existe pas.

Il y a des raisons techniques derrière cette restriction - elle élimine une classe de cas limites dans le système de suivi des dépendances, et permet également aux instances de composants de mieux s'adapter aux systèmes de vérification de type. Mais il y a aussi une considération importante en termes de maintenabilité du code : l'objet `data` est comme le schéma de l'état de votre composant. Déclarer toutes les propriétés réactives en amont rend le code du composant plus facile à comprendre lorsqu'il est revu plus tard ou lu par un autre développeur.

## Queue de mise à jour asynchrone

Au cas où vous ne l'auriez pas encore remarqué, Vue effectue les mises à jour du DOM de manière **asynchrone**. Chaque fois qu'un changement de données est observé, il ouvrira une file d'attente et mettra en mémoire tampon tous les changements de données qui se produisent dans la même boucle d'événement. Si le même observateur est déclenché plusieurs fois, il ne sera poussé dans la file d'attente qu'une seule fois. Ce dédoublement en mémoire tampon est important pour éviter les calculs inutiles et les manipulations du DOM. Ensuite, au prochain "tick" de la boucle d'événement, Vue vide la file d'attente et effectue le travail réel (déjà dé-dupliqué). En interne, Vue essaie les natifs `Promise.then`, `MutationObserver`, et `setImmediate` pour la mise en file d'attente asynchrone et se rabat sur `setTimeout(fn, 0)`.

Par exemple, lorsque vous définissez `vm.someData = 'nouvelle valeur'`, le composant ne sera pas rendu immédiatement. Il sera mis à jour au prochain "tick", lorsque la file d'attente sera vidée. La plupart du temps, nous n'avons pas besoin de nous en préoccuper, mais cela peut être délicat lorsque vous voulez faire quelque chose qui dépend de l'état du DOM après la mise à jour. Bien que Vue.js encourage généralement les développeurs à penser de manière "orientée données" et à éviter de toucher directement le DOM, il est parfois nécessaire de se salir les mains. Afin d'attendre que Vue.js ait fini de mettre à jour le DOM après un changement de données, vous pouvez utiliser `Vue.nextTick(callback)` immédiatement après la modification des données. Le callback sera appelé après que le DOM ait été mis à jour. Par exemple :

```html
<div id="example">{{ message }}</div>
```

```js
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // modifier les données
vm.$el.textContent === 'new message' // faux
Vue.nextTick(function() {
  vm.$el.textContent === 'new message' // vrai
})
```

Il y a aussi la méthode d'instance `vm.$nextTick()`, qui est particulièrement pratique à l'intérieur des composants, car elle n'a pas besoin de `Vue` global et le contexte `this` de son callback sera automatiquement lié à l'instance courante du composant :

```js
Vue.component('example', {
  template: '<span>{{ message }}</span>',
  data: function() {
    return {
      message: 'not updated'
    }
  },
  methods: {
    updateMessage: function() {
      this.message = 'updated'
      console.log(this.$el.textContent) // => 'not updated'
      this.$nextTick(function() {
        console.log(this.$el.textContent) // => 'updated'
      })
    }
  }
})
```

Puisque `$nextTick()` renvoie une promesse, vous pouvez réaliser la même chose que ci-dessus en utilisant la nouvelle syntaxe [ES2017 async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) :

```js
  methods: {
    updateMessage: async function () {
      this.message = 'updated'
      console.log(this.$el.textContent) // => 'not updated'
      await this.$nextTick()
      console.log(this.$el.textContent) // => 'updated'
    }
  }
```
