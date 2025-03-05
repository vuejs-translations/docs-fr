# Rendu de liste {#list-rendering}

Nous pouvons utiliser la directive `v-for` pour render une liste d'éléments basée sur un tableau source :

```vue-html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

Ici, `todo` est une variable locale représentant l'élément du tableau en cours d'itération. Elle n'est accessible que sur ou à l'intérieur de l'élément `v-for`, de façon similaire à la portée d'une fonction.

Remarquez comment nous fournissons à chaque objet todo un unique `id`, et le lions avec un <a target="_blank" href="/api/built-in-special-attributes.html#key">attribute spécial `key`</a> pour chaque `<li>`. La `key` permet à Vue de déplacer de manière précise chaque `<li>` afin qu'il corresponde à la position de son objet correspondant dans le tableau.

Il y a deux façons de mettre à jour la liste :

1. Appeler des [méthodes de mutation](https://stackoverflow.com/questions/9009879/which-javascript-array-functions-are-mutating) sur le tableau source :

   <div class="composition-api">

   ```js
   todos.value.push(newTodo)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos.push(newTodo)
   ```

   </div>

2. Remplacer le tableau par un nouveau :

   <div class="composition-api">

   ```js
   todos.value = todos.value.filter(/* ... */)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos = this.todos.filter(/* ... */)
   ```

   </div>

Nous avons ici une simple liste de choses à faire - essayez d'implémenter la logique des méthodes `addTodo()` et `removeTodo()` pour la faire fonctionner !

Davantage de détails sur `v-for`: <a target="_blank" href="/guide/essentials/list.html">Guide - Rendu de liste</a>
