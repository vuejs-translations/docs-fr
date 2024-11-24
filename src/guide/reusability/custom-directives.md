# Directives personnalisées {#custom-directives}

<script setup>
const vHighlight = {
  mounted: el => {
    el.classList.add('is-highlight')
  }
}
</script>

<style>
.vt-doc p.is-highlight {
  margin-bottom: 0;
}

.is-highlight {
  background-color: yellow;
  color: black;
}
</style>

## Introduction {#introduction}

En plus du jeu de directives par défaut fourni par Vue (comme `v-model` ou `v-show`), Vue permet également d'enregistrer vos propres directives personnalisées.

Nous avons introduit deux formes de code réutilisable dans Vue : [les composants](/guide/essentials/component-basics) et [les composables](./composables). Les composants sont les principaux éléments de construction, alors que les composables sont axés sur la réutilisation de la logique d'état. Les directives personnalisées, quant à elles, sont principalement destinées à réutiliser la logique qui implique un accès de bas niveau au DOM sur des éléments simples.

Une directive personnalisée se définit comme un objet contenant des hooks du cycle de vie, similaires à ceux d'un composant. Les hooks reçoivent l'élément auquel la directive est liée. Voici un exemple de directive qui ajoute une classe à un élément lorsqu'il est inséré dans le DOM par Vue :

<div class="composition-api">

```vue
<script setup>
// active v-highlight dans les templates
const vHighlight = {
  mounted: (el) => {
    el.classList.add('is-highlight')
  }
}
</script>

<template>
  <p v-highlight>Cette phrase est importante !</p>
</template>
```

</div>

<div class="options-api">

```js
const highlight = {
  mounted: (el) => el.classList.add('is-highlight')
}

export default {
  directives: {
    // active v-highlight dans le template
    highlight
  }
}
```

```vue-html
<p v-highlight>Cette phrase est importante !</p>
```

</div>

<div class="demo">
  <p v-highlight>Cette phrase est importante !</p>
</div>

<div class="composition-api">

Dans `<script setup>`, toute variable camelCase qui commence par le préfixe `v` peut être utilisée comme une directive personnalisée. Dans l'exemple ci-dessus, `vHighlight` peut être utilisé dans le template via `v-highlight`.

Si vous n'utilisez pas `<script setup>`, les directives personnalisées peuvent être enregistrées grâce à l'option `directives` :

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // active v-highlight dans le template
    highlight: {
      /* ... */
    }
  }
}
```

</div>

<div class="options-api">

Comme pour les composants, les directives personnalisées doivent être enregistrées afin de pouvoir être utilisées dans les modèles. Dans l'exemple ci-dessus, nous utilisons l'enregistrement local via l'option `directives`.

</div>

Il est également courant d'enregistrer globalement des directives personnalisées au niveau de l'application :

```js
const app = createApp({})

// rendre v-highlight utilisable dans tous les composants
app.directive('highlight', {
  /* ... */
})
```

## Quand utiliser les directives personnalisées {#when-to-use}

Les directives personnalisées ne doivent être utilisées que lorsque la fonctionnalité souhaitée ne peut être obtenue que par une manipulation directe du DOM.

Un exemple courant est la directive personnalisée `v-focus` qui met un élément au premier plan.

<div class="composition-api">

```vue
<script setup>
// active v-focus dans le template
const vFocus = {
  mounted: (el) => el.focus()
}
</script>
<template>
  <input v-focus />
</template>
```

</div>

<div class="options-api">

```js
const focus = {
  mounted: (el) => el.focus()
}

export default {
  directives: {
    // active v-focus dans le template
    focus
  }
}
```

```vue-html
<input v-focus />
```

</div>

Cette directive est plus utile que l'attribut `autofocus` car elle ne fonctionne pas seulement au chargement de la page - elle fonctionne également lorsque l'élément est inséré dynamiquement par Vue !

La déclaration de template avec des directives intégrées telles que `v-bind` est recommandé lorsque c'est possible, car il est plus efficace et plus facile à gérer pour le serveur.

## Hooks des directives {#directive-hooks}

La définition d'un objet directive peut fournir plusieurs fonctions de hook (toutes optionnelles) :

```js
const myDirective = {
  // appelé avant les attributs de l'élément lié
  // ou que les écouteurs d'événements soient appliqués
  created(el, binding, vnode) {
    // voir ci-dessous pour plus de détails sur les arguments
  },
  // appelé juste avant que l'élément ne soit inséré dans le DOM.
  beforeMount(el, binding, vnode) {},
  // appelé lorsque le composant parent de l'élément lié
  // et tous ses enfants sont montés.
  mounted(el, binding, vnode) {},
  // appelé avant que le composant parent ne soit mis à jour
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // appelé après que le composant parent et
  // tous ses enfants aient été mis à jour
  updated(el, binding, vnode, prevVnode) {},
  // appelé avant que le composant parent ne soit démonté
  beforeUnmount(el, binding, vnode) {},
  // appelé lorsque le composant parent est démonté
  unmounted(el, binding, vnode) {}
}
```

### Arguments d'un hook {#hook-arguments}

Les hooks des directives fournissent ces différents arguments :

- `el`: l'élément auquel la directive est liée. Il peut être utilisé pour manipuler le DOM directement.

- `binding`: un objet contenant les propriétés suivantes.

  - `value`: La valeur transmise à la directive. Par exemple, dans `v-my-directive="1 + 1"`, la valeur sera `2`.
  - `oldValue`: La valeur précédente, disponible uniquement dans `beforeUpdate` et `updated`. Elle est disponible que la valeur ait changé ou non.
  - `arg`: L'argument passé à la directive, s'il y en a un. Par exemple, dans `v-my-directive:foo`, l'argument sera `"foo"`.
  - `modifiers`: Un objet contenant des modificateurs, s'il y en a. Par exemple, dans `v-my-directive.foo.bar`, l'objet modificateur sera `{ foo : true, bar : true }`.
  - `instance`: L'instance du composant où la directive est utilisée.
  - `dir`: l'objet de définition de la directive.

- `vnode`: le VNode sous-jacent représentant l'élément lié.
- `prevVnode`: le VNode représentant l'élément lié du rendu précédent. Disponible uniquement dans les hooks `beforeUpdate` et `updated`.

En guise d'exemple, considérez l'utilisation de la directive suivante :

```vue-html
<div v-example:foo.bar="baz">
```

L'argument `binding` serait un objet de la forme de :

```js
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* valeur de `baz` */,
  oldValue: /* valeur de `baz` de la mise à jour précédente */
}
```

De la même manière que pour les directives natives, les arguments des directives personnalisées peuvent être dynamiques. Par exemple :

```vue-html
<div v-example:[arg]="value"></div>
```

Ici, l'argument de la directive sera mis à jour de manière réactive en fonction de la propriété `arg` dans l'état de notre composant.

:::tip Remarque
En dehors de `el`, vous devez traiter ces arguments comme étant en lecture seule et ne jamais les modifier. Si vous devez partager des informations entre plusieurs hooks, il est recommandé de le faire par le biais de [dataset](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/dataset) de l'élément.
:::

## Abréviations de fonctions {#function-shorthand}

Il est courant qu'une directive personnalisée ait le même comportement pour `mounted` et `updated`, sans avoir besoin des autres hooks. Dans ce cas, nous pouvons définir la directive comme une fonction :

```vue-html
<div v-color="color"></div>
```

```js
app.directive('color', (el, binding) => {
  // sera appelée à la fois au `mounted` et au `updated`
  el.style.color = binding.value
})
```

## Littéraux d'un objet {#object-literals}

Si votre directive a besoin de plusieurs valeurs, vous pouvez également lui passer un objet JavaScript littéral. Souvenez-vous, les directives peuvent prendre n'importe quelle expression JavaScript valide.

```vue-html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "blanc"
  console.log(binding.value.text) // => "bonjour!"
})
```

## Utilisation sur les composants {#usage-on-components}

:::warning Non recommandé
L'utilisation de directives personnalisées sur les composants n'est pas recommandée. Un comportement inattendu peut se produire lorsqu'un composant a plusieurs nœuds racine.
:::

Lorsqu'elles sont utilisées sur des composants, les directives personnalisées s'appliquent toujours au nœud racine du composant, comme dans les [attributs implicitement déclarés](/guide/components/attrs).

```vue-html
<MyComponent v-demo="test" />
```

```vue-html
<!-- template de MyComponent -->

<div> <!-- la directive v-demo sera appliquée ici -->
  <span>My component content</span>
</div>
```

Notez que les composants peuvent potentiellement avoir plus d'un nœud racine. Lorsqu'elle est appliquée à un composant multi-racine, une directive sera ignorée et un avertissement sera envoyé. Contrairement aux attributs, les directives ne peuvent pas être passées à un autre élément avec `v-bind="$attrs"`.
