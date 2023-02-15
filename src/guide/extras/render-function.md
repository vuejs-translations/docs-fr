---
outline: deep
---

# Fonctions de rendu et JSX {#render-functions-jsx}

Vue recommande d'utiliser des templates pour construire des applications dans la plupart des cas. Cependant, il existe des situations où nous avons besoin de toute la puissance programmatique de JavaScript. C'est alors que nous pouvons utiliser la fonction **render**.

> Si les concepts de DOM virtuel et de fonctions de rendu vous sont inconnus, lisez d'abord le chapitre [Mécanismes de rendu](/guide/extras/rendering-mechanism.html).

## Utilisation basique {#basic-usage}

### Créer des vnodes {#creating-vnodes}

Vue fournit une fonction `h()` afin de créer des vnodes :

```js
import { h } from 'vue'

const vnode = h(
  'div', // type
  { id: 'foo', class: 'bar' }, // props
  [
    /* enfants */
  ]
)
```

`h()` est l'abréviation de **hyperscript** - ce qui signifie "JavaScript produisant du HTML (langage de balises pour l'hypertexte)". Ce nom est hérité de conventions partagées par de nombreuses implémentations du DOM virtuel. Un nom plus descriptif serait `createVnode()`, mais un nom plus court aide lorsque vous devez appeler cette fonction plusieurs fois dans une fonction de rendu.

La fonction `h()` est conçue pour être très flexible :

```js
// tous les arguments, sauf le type, sont facultatifs
h('div')
h('div', { id: 'foo' })

// les attributs et les propriétés peuvent être utilisés dans les props
// Vue choisit automatiquement la bonne façon de les assigner
h('div', { class: 'bar', innerHTML: 'hello' })

// des modificateurs de props tels que .prop et .attr peuvent être ajoutés
// via les préfixes '.' et `^' respectivement
h('div', { '.name': 'some-name', '^width': '100' })

// la classe et le style ont la même prise en charge pour la valeur d'objet / tableau
// qu'ils ont dans les modèles
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// les écouteurs d'événements doivent être passés suivant le modèle onXxx
h('div', { onClick: () => {} })

// les enfants peuvent être une chaîne de caractères
h('div', { id: 'foo' }, 'hello')

// les props peuvent être omises lorsqu'il n'y en a pas
h('div', 'hello')
h('div', [h('span', 'hello')])

// le tableau représentant les enfants peut contenir un mélange de vnodes et de chaînes de caractères.
h('div', ['hello', h('span', 'hello')])
```

Le vnode résultant a la forme suivante :

```js
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

:::warning Remarque
L'interface complète `VNode` contient de nombreuses autres propriétés internes, mais il est fortement recommandé d'éviter de s'appuyer sur d'autres propriétés que celles listées ici. Cela permet d'éviter les ruptures involontaires en cas de modification des propriétés internes.
:::

### Déclarer des fonctions de rendu {#declaring-render-functions}

<div class="composition-api">

Lorsque vous utilisez des templates avec la Composition API, la valeur retournée par le hook `setup()` est utilisée pour exposer les données au template. Cependant, lors de l'utilisation de fonctions de rendu, nous pouvons retourner directement la fonction de rendu à la place :

```js
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // retourne la fonction de rendu
    return () => h('div', props.msg + count.value)
  }
}
```

La fonction de rendu est déclarée à l'intérieur de `setup()`, elle a donc naturellement accès aux props et à tout état réactif déclaré dans la même portée.

En plus de retourner un seul vnode, vous pouvez également retourner des chaînes de caractères ou des tableaux :

```js
export default {
  setup() {
    return () => 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  setup() {
    // utiliser un tableau pour retourner plusieurs nœuds racines
    return () => [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

:::tip
Assurez-vous de retourner une fonction au lieu de retourner directement des valeurs ! La fonction `setup()` n'est appelée qu'une seule fois par composant, alors que la fonction de rendu retournée sera appelée plusieurs fois.
:::

</div>
<div class="options-api">

Nous pouvons déclarer des fonctions de rendu en utilisant l'option `render` :

```js
import { h } from 'vue'

export default {
  data() {
    return {
      msg: 'hello'
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

La fonction `render()` a accès à l'instance du composant via `this`.

En plus de retourner un seul vnode, vous pouvez également retourner des chaînes de caractères ou des tableaux :

```js
export default {
  render() {
    return 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  render() {
    // utiliser un tableau pour retourner plusieurs nœuds racines
    return [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

</div>

Si un composant d'une fonction de rendu n'a pas besoin d'état d'instance, il peut également être déclaré directement comme une fonction pour des raisons de simplicité :

```js
function Hello() {
  return 'hello world!'
}
```

C'est exact, c'est un composant Vue valide ! Voir [les composants fonctionnels](#functional-components) pour plus de détails sur cette syntaxe.

### Les vnodes doivent être uniques {#vnodes-must-be-unique}

Tous les vnodes présents dans l'arbre des composants doivent être uniques. Cela signifie que la fonction de rendu suivante n'est pas valide :

```js
function render() {
  const p = h('p', 'hi')
  return h('div', [
    // Oups - duplication de vnodes!
    p,
    p
  ])
}
```

Si vous voulez vraiment dupliquer le même élément/composant, vous pouvez le faire via une fonction _factory_. Par exemple, la fonction de rendu suivante est un moyen parfaitement valable de rendre 20 paragraphes identiques :

```js
function render() {
  return h(
    'div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'hi')
    })
  )
}
```

## JSX / TSX {#jsx-tsx}

[JSX](https://facebook.github.io/jsx/) is an XML-like extension to JavaScript that allows us to write code like this:

```jsx
const vnode = <div>hello</div>
```

Inside JSX expressions, use curly braces to embed dynamic values:

```jsx
const vnode = <div id={dynamicId}>hello, {userName}</div>
```

`create-vue` and Vue CLI both have options for scaffolding projects with pre-configured JSX support. If you are configuring JSX manually, please refer to the documentation of [`@vue/babel-plugin-jsx`](https://github.com/vuejs/jsx-next) for details.

Although first introduced by React, JSX actually has no defined runtime semantics and can be compiled into various different outputs. If you have worked with JSX before, do note that **Vue JSX transform is different from React's JSX transform**, so you can't use React's JSX transform in Vue applications. Some notable differences from React JSX include:

- You can use HTML attributes such as `class` and `for` as props - no need to use `className` or `htmlFor`.
- Passing children to components (i.e. slots) [works differently](#passing-slots).

Vue's type definition also provides type inference for TSX usage. When using TSX, make sure to specify `"jsx": "preserve"` in `tsconfig.json` so that TypeScript leaves the JSX syntax intact for Vue JSX transform to process.

## Render Function Recipes {#render-function-recipes}

Below we will provide some common recipes for implementing template features as their equivalent render functions / JSX.

### `v-if` {#v-if}

Template:

```vue-html
<div>
  <div v-if="ok">yes</div>
  <span v-else>no</span>
</div>
```

Equivalent render function / JSX:

<div class="composition-api">

```js
h('div', [ok.value ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{ok.value ? <div>yes</div> : <span>no</span>}</div>
```

</div>
<div class="options-api">

```js
h('div', [this.ok ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{this.ok ? <div>yes</div> : <span>no</span>}</div>
```

</div>

### `v-for` {#v-for}

Template:

```vue-html
<ul>
  <li v-for="{ id, text } in items" :key="id">
    {{ text }}
  </li>
</ul>
```

Equivalent render function / JSX:

<div class="composition-api">

```js
h(
  'ul',
  // assuming `items` is a ref with array value
  items.value.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {items.value.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>
<div class="options-api">

```js
h(
  'ul',
  this.items.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {this.items.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>

### `v-on` {#v-on}

Props with names that start with `on` followed by an uppercase letter are treated as event listeners. For example, `onClick` is the equivalent of `@click` in templates.

```js
h(
  'button',
  {
    onClick(event) {
      /* ... */
    }
  },
  'click me'
)
```

```jsx
<button
  onClick={(event) => {
    /* ... */
  }}
>
  click me
</button>
```

#### Event Modifiers {#event-modifiers}

For the `.passive`, `.capture`, and `.once` event modifiers, they can be concatenated after the event name using camelCase.

For example:

```js
h('input', {
  onClickCapture() {
    /* listener in capture mode */
  },
  onKeyupOnce() {
    /* triggers only once */
  },
  onMouseoverOnceCapture() {
    /* once + capture */
  }
})
```

```jsx
<input
  onClickCapture={() => {}}
  onKeyupOnce={() => {}}
  onMouseoverOnceCapture={() => {}}
/>
```

For other event and key modifiers, the [`withModifiers`](/api/render-function.html#withmodifiers) helper can be used:

```js
import { withModifiers } from 'vue'

h('div', {
  onClick: withModifiers(() => {}, ['self'])
})
```

```jsx
<div onClick={withModifiers(() => {}, ['self'])} />
```

### Components {#components}

To create a vnode for a component, the first argument passed to `h()` should be the component definition. This means when using render functions, it is unnecessary to register components - you can just use the imported components directly:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
```

```jsx
function render() {
  return (
    <div>
      <Foo />
      <Bar />
    </div>
  )
}
```

As we can see, `h` can work with components imported from any file format as long as it's a valid Vue component.

Dynamic components are straightforward with render functions:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return ok.value ? h(Foo) : h(Bar)
}
```

```jsx
function render() {
  return ok.value ? <Foo /> : <Bar />
}
```

If a component is registered by name and cannot be imported directly (for example, globally registered by a library), it can be programmatically resolved by using the [`resolveComponent()`](/api/render-function.html#resolvecomponent) helper.

### Rendering Slots {#rendering-slots}

<div class="composition-api">

In render functions, slots can be accessed from the `setup()` context. Each slot on the `slots` object is a **function that returns an array of vnodes**:

```js
export default {
  props: ['message'],
  setup(props, { slots }) {
    return () => [
      // default slot:
      // <div><slot /></div>
      h('div', slots.default()),

      // named slot:
      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        slots.footer({
          text: props.message
        })
      )
    ]
  }
}
```

JSX equivalent:

```jsx
// default
<div>{slots.default()}</div>

// named
<div>{slots.footer({ text: props.message })}</div>
```

</div>
<div class="options-api">

In render functions, slots can be accessed from [`this.$slots`](/api/component-instance.html#slots):

```js
export default {
  props: ['message'],
  render() {
    return [
      // <div><slot /></div>
      h('div', this.$slots.default()),

      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        this.$slots.footer({
          text: this.message
        })
      )
    ]
  }
}
```

JSX equivalent:

```jsx
// <div><slot /></div>
<div>{this.$slots.default()}</div>

// <div><slot name="footer" :text="message" /></div>
<div>{this.$slots.footer({ text: this.message })}</div>
```

</div>

### Passing Slots {#passing-slots}

Passing children to components works a bit differently from passing children to elements. Instead of an array, we need to pass either a slot function, or an object of slot functions. Slot functions can return anything a normal render function can return - which will always be normalized to arrays of vnodes when accessed in the child component.

```js
// single default slot
h(MyComponent, () => 'hello')

// named slots
// notice the `null` is required to avoid
// the slots object being treated as props
h(MyComponent, null, {
  default: () => 'default slot',
  foo: () => h('div', 'foo'),
  bar: () => [h('span', 'one'), h('span', 'two')]
})
```

JSX equivalent:

```jsx
// default
<MyComponent>{() => 'hello'}</MyComponent>

// named
<MyComponent>{{
  default: () => 'default slot',
  foo: () => <div>foo</div>,
  bar: () => [<span>one</span>, <span>two</span>]
}}</MyComponent>
```

Passing slots as functions allows them to be invoked lazily by the child component. This leads to the slot's dependencies being tracked by the child instead of the parent, which results in more accurate and efficient updates.

### Built-in Components {#built-in-components}

[Les composants natifs](/api/built-in-components.html) such as `<KeepAlive>`, `<Transition>`, `<TransitionGroup>`, `<Teleport>` and `<Suspense>` must be imported for use in render functions:

<div class="composition-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  setup () {
    return () => h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>
<div class="options-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  render () {
    return h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>

### `v-model` {#v-model}

The `v-model` directive is expanded to `modelValue` and `onUpdate:modelValue` props during template compilation—we will have to provide these props ourselves:

<div class="composition-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(SomeComponent, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value)
      })
  }
}
```

</div>
<div class="options-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  render() {
    return h(SomeComponent, {
      modelValue: this.modelValue,
      'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value)
    })
  }
}
```

</div>

### Custom Directives {#custom-directives}

Custom directives can be applied to a vnode using [`withDirectives`](/api/render-function.html#withdirectives):

```js
import { h, withDirectives } from 'vue'

// a custom directive
const pin = {
  mounted() { /* ... */ },
  updated() { /* ... */ }
}

// <div v-pin:top.animate="200"></div>
const vnode = withDirectives(h('div'), [
  [pin, 200, 'top', { animate: true }]
])
```

If the directive is registered by name and cannot be imported directly, it can be resolved using the [`resolveDirective`](/api/render-function.html#resolvedirective) helper.

## Functional Components {#functional-components}

Functional components are an alternative form of component that don't have any state of their own. They act like pure functions: props in, vnodes out. They are rendered without creating a component instance (i.e. no `this`), and without the usual component lifecycle hooks.

To create a functional component we use a plain function, rather than an options object. The function is effectively the `render` function for the component.

<div class="composition-api">

The signature of a functional component is the same as the `setup()` hook:

```js
function MyComponent(props, { slots, emit, attrs }) {
  // ...
}
```

</div>
<div class="options-api">

As there is no `this` reference for a functional component, Vue will pass in the `props` as the first argument:

```js
function MyComponent(props, context) {
  // ...
}
```

The second argument, `context`, contains three properties: `attrs`, `emit`, and `slots`. These are equivalent to the instance properties [`$attrs`](/api/component-instance.html#attrs), [`$emit`](/api/component-instance.html#emit), and [`$slots`](/api/component-instance.html#slots) respectively.

</div>

Most of the usual configuration options for components are not available for functional components. However, it is possible to define [`props`](/api/options-state.html#props) and [`emits`](/api/options-state.html#emits) by adding them as properties:

```js
MyComponent.props = ['value']
MyComponent.emits = ['click']
```

If the `props` option is not specified, then the `props` object passed to the function will contain all attributes, the same as `attrs`. The prop names will not be normalized to camelCase unless the `props` option is specified.

For functional components with explicit `props`, [attribute fallthrough](/guide/components/attrs.html) works much the same as with normal components. However, for functional components that don't explicitly specify their `props`, only the `class`, `style`, and `onXxx` event listeners will be inherited from the `attrs` by default. In either case, `inheritAttrs` can be set to `false` to disable attribute inheritance:

```js
MyComponent.inheritAttrs = false
```

Functional components can be registered and consumed just like normal components. If you pass a function as the first argument to `h()`, it will be treated as a functional component.
