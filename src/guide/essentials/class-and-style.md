# Liaison de classes et de styles

Un besoin courant de liaison de données consiste à manipuler la liste des classes et les styles CSS inline d'un élément. Puisque `class` et `style` sont tous les deux des attributs, nous pouvons utiliser `v-bind` pour leur attribuer dynamiquement une valeur de chaîne, un peu comme avec les autres attributs. Cependant, essayer de générer ces valeurs à l'aide de la concaténation de chaînes peut être ennuyeux et sujet aux erreurs. Pour cette raison, Vue fournit des améliorations spéciales lorsque `v-bind` est utilisé avec `class` et `style`. En plus des chaînes, les expressions peuvent également évaluer des objets ou des tableaux.

## Liaison des classes HTML

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/dynamic-css-classes-with-vue-3" title="Free Vue.js Dynamic CSS Classes Lesson"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-dynamic-css-classes-with-vue" title="Free Vue.js Dynamic CSS Classes Lesson"/>
</div>

### Syntaxe object

Nous pouvons passer un objet à `:class` (abréviation de `v-bind:class`) pour basculer dynamiquement entre les classes :

```vue-html
<div :class="{ active: isActive }"></div>
```

La syntaxe ci-dessus signifie que la présence de la classe "active" sera déterminée par la [valeur évaluée à vrai](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) de la propriété de données "isActive".

Vous pouvez basculer plusieurs classes en ayant plus de champs dans l'objet. De plus, la directive `:class` peut également coexister avec l'attribut simple `class`. Admettons la chose :

<div class="composition-api">

```js
const isActive = ref(true)
const hasError = ref(false)
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

</div>

Et avec le template suivant :

```vue-html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

Cela sera rendu :

```vue-html
<div class="static active"></div>
```

Lorsque `isActive` ou `hasError` change, la liste des classes sera mise à jour en conséquence. Par exemple, si `hasError` devient `true`, la liste des classes deviendra `"static active text-danger"`.

L'objet lié n'a pas besoin d'être décrit dans le template :

<div class="composition-api">

```js
const classObject = reactive({
  active: true,
  'text-danger': false
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    classObject: {
      active: true,
      'text-danger': false
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

Cela rendra le même résultat. Nous pouvons également lier à une [propriété calculée](./computed) qui renvoie un objet. Il s'agit d'un modèle commun et puissant :

<div class="composition-api">

```js
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

### Syntaxe tableau

Nous pouvons lier `:class` à un tableau pour appliquer une liste de classes :

<div class="composition-api">

```js
const activeClass = ref('active')
const errorClass = ref('text-danger')
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
```

</div>

```vue-html
<div :class="[activeClass, errorClass]"></div>
```

Ceci sera rendu :

```vue-html
<div class="active text-danger"></div>
```

Si vous souhaitez également basculer une classe dans la liste de manière conditionnelle, vous pouvez le faire avec une expression ternaire :

```vue-html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

Cela appliquera toujours `errorClass`, mais `activeClass` ne sera appliqué que lorsque `isActive` est vrai.

Cependant, cela peut être un peu verbeux si vous avez plusieurs classes conditionnelles. C'est pourquoi il est également possible d'utiliser la syntaxe objet à l'intérieur de la syntaxe tableau :

```vue-html
<div :class="[{ active: isActive }, errorClass]"></div>
```

### Avec les composants

> Cette section suppose une connaissance des [Composants](/guide/essentials/component-basics). N'hésitez pas à sauter cette partie et à revenir plus tard.

Lorsque vous utilisez l'attribut `class` sur un composant avec un seul élément racine, ces classes seront ajoutées à l'élément racine du composant et fusionnées avec toute classe existante déjà présente.

Par exemple, si nous avons un composant nommé "MyComponent" avec le template suivant :

```vue-html
<!-- template du composant enfant -->
<p class="foo bar">Hi!</p>
```

Ajoutez ensuite quelques classes lors de son utilisation :

```vue-html
<!-- usage du composant -->
<MyComponent class="baz boo" />
```

Le HTML rendu sera :

```vue-html
<p class="foo bar baz boo">Hi</p>
```

Il en va de même pour les liaisons de classe :

```vue-html
<MyComponent :class="{ active: isActive }" />
```

Lorsque `isActive` est vrai, le rendu HTML sera :

```vue-html
<p class="foo bar active">Hello</p>
```

Si votre composant a plusieurs éléments racine, vous devrez définir quel élément recevra cette classe. Vous pouvez le faire en utilisant la propriété de composant `$attrs` :

```vue-html
<!-- Template de MyComponent utilisant $attrs -->
<p :class="$attrs.class">Hi!</p>
<span>Ceci est un composant enfant</span>
```

```vue-html
<MyComponent class="baz" />
```

Sera rendu :

```html
<p class="baz">Hi!</p>
<span>Ceci est un composant enfant</span>
```

Vous pouvez en savoir plus sur l'héritage des attributs de composant dans la section [Attributs implicitement déclarés](/guide/components/attrs.html).

## Binding Inline Styles

### Binding to Objects

`:style` supports binding to JavaScript object values - it corresponds to an [HTML element's `style` property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style):

<div class="composition-api">

```js
const activeColor = ref('red')
const fontSize = ref(30)
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeColor: 'red',
    fontSize: 30
  }
}
```

</div>

```vue-html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

Although camelCase keys are recommended, `:style` also supports kebab-cased CSS property keys (corresponds to how they are used in actual CSS) - for example:

```vue-html
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

It is often a good idea to bind to a style object directly so that the template is cleaner:

<div class="composition-api">

```js
const styleObject = reactive({
  color: 'red',
  fontSize: '13px'
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
}
```

</div>

```vue-html
<div :style="styleObject"></div>
```

Again, object style binding is often used in conjunction with computed properties that return objects.

### Binding to Arrays

We can bind `:style` to an array of multiple style objects. These objects will be merged and applied to the same element:

```vue-html
<div :style="[baseStyles, overridingStyles]"></div>
```

### Auto-prefixing

When you use a CSS property that requires a [vendor prefix](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) in `:style`, Vue will automatically add the appropriate prefix. Vue does this by checking at runtime to see which style properties are supported in the current browser. If the browser doesn't support a particular property then various prefixed variants will be tested to try to find one that is supported.

### Multiple Values

You can provide an array of multiple (prefixed) values to a style property, for example:

```vue-html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

This will only render the last value in the array which the browser supports. In this example, it will render `display: flex` for browsers that support the unprefixed version of flexbox.
