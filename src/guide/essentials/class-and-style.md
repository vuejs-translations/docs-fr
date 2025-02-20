# Liaison de classes et de styles {#class-and-style-bindings}

La liaison de données consiste à manipuler la liste des classes et les styles CSS inline d'un élément. Puisque `class` et `style` sont tous les deux des attributs, nous pouvons utiliser `v-bind` pour leur attribuer dynamiquement une valeur de chaîne, un peu comme avec les autres attributs. Cependant, essayer de générer ces valeurs à l'aide de la concaténation de chaînes peut être ennuyeux et sujet aux erreurs. Pour cette raison, Vue fournit des améliorations spéciales lorsque `v-bind` est utilisé avec `class` et `style`. En plus des chaînes, les expressions peuvent également évaluer des objets ou des tableaux.

## Liaison des classes HTML {#binding-html-classes}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/dynamic-css-classes-with-vue-3" title="Free Vue.js Dynamic CSS Classes Lesson"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-dynamic-css-classes-with-vue" title="Free Vue.js Dynamic CSS Classes Lesson"/>
</div>

### Liaison par objet {#binding-to-objects-1}

Nous pouvons passer un objet à `:class` (abréviation de `v-bind:class`) pour basculer dynamiquement entre les classes :

```vue-html
<div :class="{ active: isActive }"></div>
```

La syntaxe ci-dessus signifie que la présence de la classe "active" sera déterminée par la [valeur évaluée à vrai](https://developer.mozilla.org/fr/docs/Glossary/Truthy) de la donnée "isActive".

Vous pouvez basculer plusieurs classes en ayant plus de clés dans l'objet. De plus, la directive `:class` peut également coexister avec l'attribut simple `class`. Admettons la chose suivante :

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

Cela rendra :

```vue-html
<div class="active"></div>
```

Nous pouvons également lier à une [propriété calculée](./computed) qui renvoie un objet. Il s'agit d'un modèle commun et puissant :

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

Là encore, la liaison de style objet est souvent utilisée avec des propriétés calculées qui renvoient des objets.

Les directives `:style` peuvent également coexister avec des attributs de style ordinaires, tout comme `:class`.

Template:

```vue-html
<h1 style="color: red" :style="'font-size: 1em'">hello</h1>
```

Il rendra :

```vue-html
<h1 style="color: red; font-size: 1em;">hello</h1>
```

### Liaison par tableau {#binding-to-arrays-1}

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
<div class="text-danger active"></div>
```

Si vous souhaitez également basculer une classe dans la liste de manière conditionnelle, vous pouvez le faire avec une expression ternaire :

```vue-html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

Cela appliquera toujours `errorClass`, mais `activeClass` ne sera appliqué que lorsque `isActive` est vrai.

Cependant, cela peut être un peu verbeux si vous avez plusieurs classes conditionnelles. C'est pourquoi il est également possible d'utiliser la syntaxe objet à l'intérieur de la syntaxe tableau :

```vue-html
<div :class="[{ [activeClass]: isActive }, errorClass]"></div>
```

### Avec les composants {#with-components}

> Cette section suppose une connaissance des [Composants](/guide/essentials/component-basics). N'hésitez pas à sauter cette partie et à y revenir plus tard.

Lorsque vous utilisez l'attribut `class` sur un composant avec un seul élément racine, ces classes seront ajoutées à l'élément racine du composant et fusionnées avec toute classe existante déjà présente.

Par exemple, si nous avons un composant nommé "MyComponent" avec le template suivant :

```vue-html
<!-- template du composant enfant -->
<p class="foo bar">Hello !</p>
```

Ajoutez ensuite quelques classes lors de son utilisation :

```vue-html
<!-- usage du composant -->
<MyComponent class="baz boo" />
```

Le HTML rendu sera :

```vue-html
<p class="foo bar baz boo">Hi!</p>
```

Il en va de même pour les liaisons de classe :

```vue-html
<MyComponent :class="{ active: isActive }" />
```

Lorsque `isActive` est vrai, le rendu HTML sera :

```vue-html
<p class="foo bar active">Hello !</p>
```

Si votre composant a plusieurs éléments racine, vous devrez définir quel élément recevra cette classe. Vous pouvez le faire en utilisant la propriété de composant `$attrs` :

```vue-html
<!-- Template de MyComponent utilisant $attrs -->
<p :class="$attrs.class">Hello !</p>
<span>This is a child component</span>
```

```vue-html
<MyComponent class="baz" />
```

Sera rendu :

```html
<p class="baz">Hello !</p>
<span>This is a child component</span>
```

Vous pouvez en savoir plus sur l'héritage des attributs de composant dans la section [Attributs implicitement déclarés](/guide/components/attrs).

## Liaison des styles inline {#binding-inline-styles}

### Liaison par objet {#binding-to-objects-2}

`:style` supporte les liaisons avec des objets JavaScript - ça correspond à la [propriété `style` des éléments HTML](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/style):

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

Bien que les clés camelCase soient recommandées, `:style` prend également en charge les clés de propriété CSS en casse kebab (correspond à la façon dont elles sont utilisées dans le CSS réel), par exemple :

```vue-html
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

C'est souvent une bonne idée de lier directement un objet de style pour que le template soit plus propre :

<div class="composition-api">

```js
const styleObject = reactive({
  color: 'red',
  fontSize: '30px'
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

À nouveau, la liaison par objet est souvent utilisée conjointement avec des propriétés calculées qui renvoient des objets.

### Liaison par tableau {binding-to-arrays-1}

Nous pouvons lier `:style` à un tableau de plusieurs objets de style. Ces objets seront fusionnés et appliqués au même élément :

```vue-html
<div :style="[baseStyles, overridingStyles]"></div>
```

### Préfixe automatique {#auto-prefixing}

Lorsque vous utilisez une propriété CSS qui nécessite un [préfixe vendeur](https://developer.mozilla.org/fr/docs/Glossary/Vendor_Prefix) dans `:style`, Vue ajoutera automatiquement le préfixe approprié. Vue le fait en vérifiant lors de l'exécution quelles propriétés de style sont prises en charge dans le navigateur actuel. Si le navigateur ne prend pas en charge une propriété particulière, différentes variantes préfixées seront testées pour essayer d'en trouver une qui soit prise en charge.

### Valeurs multiples {#multiple-values}

Vous pouvez fournir un tableau de plusieurs valeurs (préfixées) à une propriété de style, par exemple :

```vue-html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

Cela ne rendra que la dernière valeur du tableau prise en charge par le navigateur. Dans cet exemple, il affichera `display: flex` pour les navigateurs prenant en charge la version sans préfixe de flexbox.
