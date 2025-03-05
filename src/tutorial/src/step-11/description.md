# Composants {#components}

Jusqu'à présent, nous n'avons travaillé qu'avec un seul composant. Les véritables applications Vue sont généralement créées avec des composants imbriqués.

Un composant parent peut render un autre composant dans son template en tant que composant enfant. Pour utiliser un composant enfant, nous devons d'abord l'importer :

<div class="composition-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'
```

</div>
</div>

<div class="options-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  }
}
```

Nous devons également enregistrer le composant en utilisant l'option `components`. Ici, nous utilisons le raccourci de la propriété de l'objet pour enregistrer le composant `ChildComp` sous la clé `ChildComp`.

</div>
</div>

<div class="sfc">

Ensuite, nous pouvons utiliser le composant dans le template ainsi :

```vue-html
<ChildComp />
```

</div>

<div class="html">

```js
import ChildComp from './ChildComp.js'

createApp({
  components: {
    ChildComp
  }
})
```

Nous devons également enregistrer le composant en utilisant l'option `components`. Ici, nous utilisons le raccourci de la propriété de l'objet pour enregistrer le composant `ChildComp` sous la clé `ChildComp`.

Comme nous écrivons le template dans le DOM, il sera soumis aux règles analytiques du navigateur, lequel n'est pas sensible à la casse pour les noms de balises. Par conséquent, nous devons utiliser le nom en kebab-case pour référencer le composant enfant :

```vue-html
<child-comp></child-comp>
```

</div>


Maintenant, essayez vous-même - importez le composant enfant et faites le render dans le template.
