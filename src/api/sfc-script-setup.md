# \<script setup> {#script-setup}

`<script setup>` est un sucre syntaxique de compilation pour l'utilisation de la Composition API dans les composants monopages (SFC). C'est la syntaxe recommandée si vous utilisez à la fois les SFC et la Composition API. Elle offre un certain nombre d'avantages par rapport à la syntaxe classique `<script>` :

- Un code plus succinct avec moins de répétitions
- Possibilité de déclarer des props et des événements émis en utilisant du TypeScript pur.
- Meilleures performances d'exécution (le template est compilé dans une fonction de rendu dans la même portée, sans proxy intermédiaire).
- Meilleures performances de l'environnement de développement concernant l'inférence de type (moins de travail pour le serveur de langage pour extraire les types du code).

## Syntaxe basique {#basic-syntax}

Pour utiliser cette syntaxe, ajoutez l'attribut `setup` au bloc `<script>` :

```vue
<script setup>
console.log('hello script setup')
</script>
```

Le code qu'il contient est compilé en tant que contenu de la fonction `setup()` du composant. Cela signifie que, contrairement au `<script>` normal, qui ne s'exécute qu'une fois lorsque le composant est importé pour la première fois, le code contenu dans `<script setup>` sera **exécuté à chaque fois qu'une instance du composant sera créée**.

### Les liaisons de haut niveau sont exposées au template {#top-level-bindings-are-exposed-to-template}

Lorsque vous utilisez `<script setup>`, toutes les liaisons de haut niveau (y compris les variables, les déclarations de fonctions et les imports) déclarées dans `<script setup>` sont directement utilisables dans le template :

```vue
<script setup>
// variable
const msg = 'Hello!'

// fonctions
function log() {
  console.log(msg)
}
</script>

<template>
  <button @click="log">{{ msg }}</button>
</template>
```

Les importations sont exposées de la même manière. Cela signifie que vous pouvez utiliser directement une fonction utilitaire importée dans des expressions de template sans avoir à l'exposer via l'option `methods` :

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

## Réactivité {#reactivity}

L'état réactif doit être créé explicitement à l'aide des [API de réactivité](./reactivity-core.html). Comme les valeurs retournées par une fonction `setup()`, les refs sont automatiquement déballées lorsqu'elles sont référencées dans les templates :

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## Using Components {#using-components}

Values in the scope of `<script setup>` can also be used directly as custom component tag names:

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

Think of `MyComponent` as being referenced as a variable. If you have used JSX, the mental model is similar here. The kebab-case equivalent `<my-component>` also works in the template - however PascalCase component tags are strongly recommended for consistency. It also helps differentiating from native custom elements.

### Dynamic Components {#dynamic-components}

Since components are referenced as variables instead of registered under string keys, we should use dynamic `:is` binding when using dynamic components inside `<script setup>`:

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

Note how the components can be used as variables in a ternary expression.

### Recursive Components {#recursive-components}

An SFC can implicitly refer to itself via its filename. E.g. a file named `FooBar.vue` can refer to itself as `<FooBar/>` in its template.

Note this has lower priority than imported components. If you have a named import that conflicts with the component's inferred name, you can alias the import:

```js
import { FooBar as FooBarChild } from './components'
```

### Namespaced Components {#namespaced-components}

You can use component tags with dots like `<Foo.Bar>` to refer to components nested under object properties. This is useful when you import multiple components from a single file:

```vue
<script setup>
import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```

## Using Custom Directives {#using-custom-directives}

Globally registered custom directives just work as normal. Local custom directives don't need to be explicitly registered with `<script setup>`, but they must follow the naming scheme `vNameOfDirective`:

```vue
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // do something with the element
  }
}
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```

If you're importing a directive from elsewhere, it can be renamed to fit the required naming scheme:

```vue
<script setup>
import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## defineProps() & defineEmits() {#defineprops-defineemits}

To declare options like `props` and `emits` with full type inference support, we can use the `defineProps` and `defineEmits` APIs, which are automatically available inside `<script setup>`:

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// setup code
</script>
```

- `defineProps` and `defineEmits` are **compiler macros** only usable inside `<script setup>`. They do not need to be imported, and are compiled away when `<script setup>` is processed.

- `defineProps` accepts the same value as the `props` option, while `defineEmits` accepts the same value as the `emits` option.

- `defineProps` and `defineEmits` provide proper type inference based on the options passed.

- The options passed to `defineProps` and `defineEmits` will be hoisted out of setup into module scope. Therefore, the options cannot reference local variables declared in setup scope. Doing so will result in a compile error. However, it _can_ reference imported bindings since they are in the module scope as well.

If you are using TypeScript, it is also possible to [declare props and emits using pure type annotations](#typescript-only-features).

## defineExpose() {#defineexpose}

Components using `<script setup>` are **closed by default** - i.e. the public instance of the component, which is retrieved via template refs or `$parent` chains, will **not** expose any of the bindings declared inside `<script setup>`.

To explicitly expose properties in a `<script setup>` component, use the `defineExpose` compiler macro:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

When a parent gets an instance of this component via template refs, the retrieved instance will be of the shape `{ a: number, b: number }` (refs are automatically unwrapped just like on normal instances).

## `useSlots()` & `useAttrs()` {#useslots-useattrs}

Usage of `slots` and `attrs` inside `<script setup>` should be relatively rare, since you can access them directly as `$slots` and `$attrs` in the template. In the rare case where you do need them, use the `useSlots` and `useAttrs` helpers respectively:

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` and `useAttrs` are actual runtime functions that return the equivalent of `setupContext.slots` and `setupContext.attrs`. They can be used in normal composition API functions as well.

## Usage alongside normal `<script>` {#usage-alongside-normal-script}

`<script setup>` can be used alongside normal `<script>`. A normal `<script>` may be needed in cases where we need to:

- Declare options that cannot be expressed in `<script setup>`, for example `inheritAttrs` or custom options enabled via plugins.
- Declaring named exports.
- Run side effects or create objects that should only execute once.

```vue
<script>
// normal <script>, executed in module scope (only once)
runSideEffectOnce()

// declare additional options
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// executed in setup() scope (for each instance)
</script>
```

Support for combining `<script setup>` and `<script>` in the same component is limited to the scenarios described above. Specifically:

- Do **NOT** use a separate `<script>` section for options that can already be defined using `<script setup>`, such as `props` and `emits`.
- Variables created inside `<script setup>` are not added as properties to the component instance, making them inaccessible from the Options API. Mixing APIs in this way is strongly discouraged.

If you find yourself in one of the scenarios that is not supported then you should consider switching to an explicit [`setup()`](/api/composition-api-setup.html) function, instead of using `<script setup>`.

## Top-level `await` {#top-level-await}

Top-level `await` can be used inside `<script setup>`. The resulting code will be compiled as `async setup()`:

```vue
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

In addition, the awaited expression will be automatically compiled in a format that preserves the current component instance context after the `await`.

:::warning Note
`async setup()` must be used in combination with `Suspense`, which is currently still an experimental feature. We plan to finalize and document it in a future release - but if you are curious now, you can refer to its [tests](https://github.com/vuejs/core/blob/main/packages/runtime-core/__tests__/components/Suspense.spec.ts) to see how it works.
:::

## TypeScript-only Features <sup class="vt-badge ts" /> {#typescript-only-features}

### Type-only props/emit declarations {#type-only-props-emit-declarations}

Props and emits can also be declared using pure-type syntax by passing a literal type argument to `defineProps` or `defineEmits`:

```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
```

- `defineProps` or `defineEmits` can only use either runtime declaration OR type declaration. Using both at the same time will result in a compile error.

- When using type declaration, the equivalent runtime declaration is automatically generated from static analysis to remove the need for double declaration and still ensure correct runtime behavior.

  - In dev mode, the compiler will try to infer corresponding runtime validation from the types. For example here `foo: String` is inferred from the `foo: string` type. If the type is a reference to an imported type, the inferred result will be `foo: null` (equal to `any` type) since the compiler does not have information of external files.

  - In prod mode, the compiler will generate the array format declaration to reduce bundle size (the props here will be compiled into `['foo', 'bar']`)

  - The emitted code is still TypeScript with valid typing, which can be further processed by other tools.

- As of now, the type declaration argument must be one of the following to ensure correct static analysis:

  - A type literal
  - A reference to an interface or a type literal in the same file

  Currently complex types and type imports from other files are not supported. It is possible to support type imports in the future.

### Default props values when using type declaration {#default-props-values-when-using-type-declaration}

One drawback of the type-only `defineProps` declaration is that it doesn't have a way to provide default values for the props. To resolve this problem, a `withDefaults` compiler macro is also provided:

```ts
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

This will be compiled to equivalent runtime props `default` options. In addition, the `withDefaults` helper provides type checks for the default values, and ensures the returned `props` type has the optional flags removed for properties that do have default values declared.

## Restrictions {#restrictions}

Due to the difference in module execution semantics, code inside `<script setup>` relies on the context of an SFC. When moved into external `.js` or `.ts` files, it may lead to confusion for both developers and tools. Therefore, **`<script setup>`** cannot be used with the `src` attribute.
