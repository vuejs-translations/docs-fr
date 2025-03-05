# Liaisons d'attributs {#attribute-bindings}

Dans Vue, la syntaxe des moustaches ne sert que pour l'interpolation du texte. Pour lier un attribut à une valeur dynamique, nous utilisons la directive `v-bind` :

```vue-html
<div v-bind:id="dynamicId"></div>
```

Une **directive** est un attribut spécial qui commence par le préfixe `v-`. Celles-ci font partie de la syntaxe du template de Vue. Similaire à l'interpolation du texte, les valeurs des directives sont des expressions en JavaScript qui ont accès au state du composant. Les détails complets de `v-bind` et la syntaxe des directives sont abordés dans <a target="_blank" href="/guide/essentials/template-syntax.html">Guide - Syntaxe du Template</a>.

La partie après les deux points (`:id`) est "argument" de la directive. Ici, l'attribut `id` de l'élément sera synchronisé avec la propriété `dynamicId` du state du composant.

Parce que `v-bind` est utilisé si fréquemment, il a une syntaxe abrégée dédiée :

```vue-html
<div :id="dynamicId"></div>
```

Maintenant, essayez d'ajouter une liaison dynamique `class` au `<h1>`, en utilisant la propriété `titleClass` <span class="options-api">data</span><span class="composition-api">ref</span> comme valeur. S'il est lié correctement, le texte devrait devenir rouge.
