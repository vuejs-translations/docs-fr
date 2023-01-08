# Rendu conditionnel {#conditional-rendering}

Nous pouvons utiliser la directive `v-if` pour rendre un élément de manière conditionnelle :

```vue-html
<h1 v-if="awesome">Vue est génial!</h1>
```

Ce `<h1>` sera render uniquement si la valeur de `awesome` est [truthy](https://developer.mozilla.org/fr/docs/Glossary/Truthy). Si `awesome` prend une valeur [falsy](https://developer.mozilla.org/fr/docs/Glossary/Falsy), il sera supprimé du DOM.

On peut aussi utiliser `v-else` et `v-else-if` pour désigner les autres branches de la condition :

```vue-html
<h1 v-if="awesome">Vue est génial!</h1>
<h1 v-else>Oh non 😢</h1>
```

Actuellement, la démo affiche les deux `<h1>`s en même temps, et le bouton ne fait rien. Essayez d'y ajouter des directives `v-if` et `v-else`, et implémentez la méthode `toggle()` pour que nous puissions utiliser le bouton pour basculer entre les deux.

Davantage de détails sur le `v-if`: <a target="_blank" href="/guide/essentials/conditional.html">Guide - Rendu Conditionnel</a>
