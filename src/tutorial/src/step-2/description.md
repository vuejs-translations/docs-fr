# Rendu déclaratif {#declarative-rendering}

<div class="sfc">

Ce que vous voyez dans l'éditeur est un composant Vue monofichier (SFC). Un SFC est un bloc de code autonome réutilisable qui encapsule le HTML, le CSS et le JavaScript qui vont ensemble, écrit dans un fichier `.vue`.

</div>

La caractéristique principale de Vue est le **rendu déclaratif** : à l'aide d'une syntaxe de modèle qui étend le HTML, nous pouvons décrire la structure du HTML en fonction de l'état du JavaScript. Lorsque l'état change, le HTML est automatiquement mis à jour.

<div class="composition-api">

Un état qui peut déclencher des mises à jour lorsqu'il est modifié est considéré comme **réactif**. Nous pouvons déclarer un état réactif en utilisant l'API `reactive()` de Vue. Les objets créés par `reactive()` sont des [Proxy JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Proxy) qui fonctionnent comme des objets normaux :

```js
import { reactive } from 'vue'

const counter = reactive({
  count: 0
})

console.log(counter.count) // 0
counter.count++
```

`reactive()` ne fonctionne que sur les objets (y compris les tableaux et les types par défaut comme `Map` et `Set`). D'un autre côté, `ref()`, peut prendre n'importe quel type de valeur et créer un objet qui expose la valeur interne sous une propriété `.value` :

```js
import { ref } from 'vue'

const message = ref('Hello World!')

console.log(message.value) // "Hello World!"
message.value = 'Mis à jour'
```

Les détails sur `reactive()` et `ref()` sont abordés dans <a target="_blank" href="/guide/essentials/reactivity-fundamentals.html">Guide - Fondamentaux de la réactivité</a>.

<div class="sfc">

Le state réactif déclaré dans le bloc `<script setup>` du composant peut être utilisé directement dans le template. C'est ainsi que nous pouvons rendre un texte dynamique basé sur la valeur de l'objet `counter` et de la réf `message`, en utilisant la syntaxe des moustaches :

</div>

<div class="html">

L'objet passé à `createApp()` est un composant Vue. Le state d'un composant doit être déclaré dans sa fonction `setup()`, et retourné en utilisant un objet :

```js{2,5}
setup() {
  const counter = reactive({ count: 0 })
  const message = ref('Hello World!')
  return {
    counter,
    message
  }
}
```

Les propriétés renvoyées par l'objet seront disponibles dans le template. C'est ainsi que nous pouvons rendre un texte dynamique basé sur la valeur de `message`, en utilisant la syntaxe des moustaches :

</div>

```vue-html
<h1>{{ message }}</h1>
<p>Count à: {{ counter.count }}</p>
```

Remarquez que nous n'avons pas eu besoin d'utiliser `.value` pour accéder à la référence `message` dans le template : elle est automatiquement déballée pour une utilisation plus succincte.

</div>

<div class="options-api">

Un state qui peut déclencher des rafraîchissements est considéré comme **réactif**. Dans Vue, tout state réactif reste dans les composants. <span class="html">Dans l'exemple de code, l'objet passé à `createApp()` est un composant.</span>

Nous pouvons déclarer un state réactif en utilisant l'option de composant `data`, qui doit être une fonction qui renvoie un objet :

<div class="sfc">

```js{3-5}
export default {
  data() {
    return {
      message: 'Hello World!'
    }
  }
}
```

</div>
<div class="html">

```js{3-5}
createApp({
  data() {
    return {
      message: 'Hello World!'
    }
  }
})
```

</div>

La propriété `message` sera disponible dans le template. C'est ainsi que nous pouvons render un texte dynamique basé sur la valeur de `message`, en utilisant la syntaxe des moustaches :

```vue-html
<h1>{{ message }}</h1>
```

</div>

Le contenu à l'intérieur des moustaches n'est pas limité aux identifiants ou aux chemins - nous pouvons utiliser toute expression JavaScript valide :

```vue-html
<h1>{{ message.split('').reverse().join('') }}</h1>
```

<div class="composition-api">

Maintenant, essayez de créer vous-même un state réactif et utilisez-le pour rendre un contenu textuel dynamique pour le `<h1>` dans le template.

</div>

<div class="options-api">

Maintenant, essayez de créer vous-même une propriété `data`, et utilisez-la comme contenu textuel pour le `<h1>` dans le template.

</div>
