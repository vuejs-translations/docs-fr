# \<script setup> {#script-setup}

`<script setup>` est un sucre syntaxique de compilation pour l'utilisation de la Composition API dans les composants monofichiers (SFC). C'est la syntaxe recommandée si vous utilisez à la fois les SFC et la Composition API. Elle offre un certain nombre d'avantages par rapport à la syntaxe classique `<script>` :

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

Lorsque vous utilisez `<script setup>`, toute liaison de haut niveau (y compris les variables, les déclarations de fonctions et les imports) déclarées dans `<script setup>` est directement utilisable dans le template :

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

L'état réactif doit être créé explicitement à l'aide des [API de réactivité](./reactivity-core). Comme les valeurs retournées par une fonction `setup()`, les refs sont automatiquement déballées lorsqu'elles sont référencées dans les templates :

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## Utilisation des composants {#using-components}

Les valeurs dans la portée de `<script setup>` peuvent également être utilisées directement comme noms de balises de composants personnalisés :

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

Voyez `MyComponent` comme référencé à l'instar d'une variable. Si vous avez utilisé du JSX, le modèle mental est le même ici. L'équivalent en casse kebab `<my-component>` fonctionne aussi dans le template - mais les balises de composant en casse Pascal sont fortement recommandées pour des raisons de cohérence. Cela permet également de faire la différence avec les éléments personnalisés natifs.

### Composants dynamiques {#dynamic-components}

Puisque les composants sont référencés comme des variables au lieu d'être enregistrés sous des clés de chaîne de caractères, nous devons utiliser la liaison dynamique `:is` lorsque nous utilisons des composants dynamiques dans `<script setup>` :

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

Notez comment les composants peuvent être utilisés comme variables dans une expression ternaire.

### Composants récursifs {#recursive-components}

Un composant monopage peut implicitement se référer à lui-même via son nom de fichier. Par exemple, un fichier nommé `FooBar.vue` peut se référer à lui-même comme `<FooBar/>` dans son template.

Notez cependant que la priorité est inférieure à celle des composants importés. Si vous avez une importation nommée qui entre en conflit avec le nom inféré du composant, vous pouvez utiliser un alias pour l'importation :

```js
import { FooBar as FooBarChild } from './components'
```

### Composants sous espace de nom {#namespaced-components}

Vous pouvez utiliser des balises de composants avec des points comme `<Foo.Bar>` pour faire référence à des composants imbriqués dans des propriétés d'objets. Ceci est utile lorsque vous importez plusieurs composants à partir d'un seul fichier :

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

## Utilisation de directives personnalisées {#using-custom-directives}

Les directives personnalisées enregistrées de manière globale fonctionnent normalement. Les directives locales personnalisées n'ont pas besoin d'être explicitement enregistrées avec `<script setup>`, mais elles doivent suivre le schéma de dénomination `vNameOfDirective` :

```vue
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // faire quelque chose avec l'élément
  }
}
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```

Si vous importez une directive d'ailleurs, vous pouvez la renommer pour qu'elle corresponde au schéma de dénomination requis :

```vue
<script setup>
import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## defineProps() et defineEmits() {#defineprops-defineemits}

Pour déclarer des options comme `props` et `emits` avec une prise en charge complète de l'inférence de type, nous pouvons utiliser les API `defineProps` et `defineEmits`, qui sont automatiquement disponibles dans `<script setup>` :

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// setup code
</script>
```

- `defineProps` et `defineEmits` sont des **macros de compilation** utilisables uniquement à l'intérieur de `<script setup>`. Elles n'ont pas besoin d'être importées, et sont compilées lorsque `<script setup>` est traité.

- `defineProps` accepte la même valeur que l'option `props`, tandis que `defineEmits` accepte la même valeur que l'option `emits`.

- `defineProps` et `defineEmits` fournissent une inférence de type appropriée basée sur les options passées.

- Les options passées à `defineProps` et `defineEmits` seront placées en dehors de setup dans la portée du module. Par conséquent, les options ne peuvent pas faire référence à des variables locales déclarées dans la portée de setup. Cela entraînerait une erreur de compilation. Cependant, elles _peuvent_ faire référence à des liaisons importées puisqu'elles sont également dans la portée du module.

### Type-only props/emit declarations<sup class="vt-badge ts" /> {#type-only-props-emit-declarations}

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

// 3.3+: alternative, more succinct syntax
const emit = defineEmits<{
  change: [id: number] // named tuple syntax
  update: [value: string]
}>()
```

- `defineProps` or `defineEmits` can only use either runtime declaration OR type declaration. Using both at the same time will result in a compile error.

- When using type declaration, the equivalent runtime declaration is automatically generated from static analysis to remove the need for double declaration and still ensure correct runtime behavior.

  - In dev mode, the compiler will try to infer corresponding runtime validation from the types. For example here `foo: String` is inferred from the `foo: string` type. If the type is a reference to an imported type, the inferred result will be `foo: null` (equal to `any` type) since the compiler does not have information of external files.

  - In prod mode, the compiler will generate the array format declaration to reduce bundle size (the props here will be compiled into `['foo', 'bar']`)

- In version 3.2 and below, the generic type parameter for `defineProps()` were limited to a type literal or a reference to a local interface.

  This limitation has been resolved in 3.3. The latest version of Vue supports referencing imported and a limited set of complex types in the type parameter position. However, because the type to runtime conversion is still AST-based, some complex types that require actual type analysis, e.g. conditional types, are not supported. You can use conditional types for the type of a single prop, but not the entire props object.

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

## defineExpose() {#defineexpose}

Les composants utilisant `<script setup>` sont **fermés par défaut** - c'est à dire que l'instance publique du composant, qui est récupérée via les refs du template ou via `$parent`, n'exposera **aucune** des liaisons déclarées dans `<script setup>`.

Pour exposer explicitement des propriétés dans un composant utilisant `<script setup>`, utilisez la macro de compilation `defineExpose` :

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

Lorsqu'un parent accède à une instance de ce composant via des refs de template, l'instance récupérée sera de la forme `{ a: number, b: number }` (les refs sont automatiquement déballés comme pour les instances normales).

## defineOptions() {#defineoptions}

This macro can be used to declare component options directly inside `<script setup>` without having to use a separate `<script>` block:

```vue
<script setup>
defineOptions({
  inheritAttrs: false,
  customOptions: {
    /* ... */
  }
})
</script>
```

- Only supported in 3.3+.
- This is a macro. The options will be hoisted to module scope and cannot access local variables in `<script setup>` that are not literal constants.

## defineSlots()<sup class="vt-badge ts"/> {#defineslots}

This macro can be used to provide type hints to IDEs for slot name and props type checking.

`defineSlots()` only accepts a type parameter and no runtime arguments. The type parameter should be a type literal where the property key is the slot name, and the value type is the slot function. The first argument of the function is the props the slot expects to receive, and its type will be used for slot props in the template. The return type is currently ignored and can be `any`, but we may leverage it for slot content checking in the future.

It also returns the `slots` object, which is equivalent to the `slots` object exposed on the setup context or returned by `useSlots()`.

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
}>()
</script>
```

- Only supported in 3.3+.

## `useSlots()` et `useAttrs()` {#useslots-useattrs}

L'utilisation de `slots` et `attrs` à l'intérieur de `<script setup>` devrait être relativement rare, puisque vous pouvez y accéder directement via `$slots` et `$attrs` dans le template. Dans les rares cas où vous en avez besoin, utilisez respectivement les utilitaires `useSlots` et `useAttrs` :

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` et `useAttrs` sont des fonctions d'exécution qui retournent l'équivalent de `setupContext.slots` et `setupContext.attrs`. Elles peuvent également être utilisées dans les fonctions classiques de la Composition API.

## Utilisation en parallèle du `<script>` normal {#usage-alongside-normal-script}

`<script setup>` peut être utilisée en parallèle du `<script>` normal. Un `<script>` normal peut être nécessaire dans les cas où nous avons besoin de :

- Déclarer des options qui ne peuvent pas être exprimées dans `<script setup>`, par exemple `inheritAttrs` ou des options personnalisées activées par des plugins.
- Déclarer des exportations nommées.
- Exécuter des effets secondaires ou créer des objets qui ne doivent être exécutés qu'une fois.

```vue
<script>
// <script> normal, exécuté dans la portée du module (une seule fois)
runSideEffectOnce()

// déclare des options supplémentaires
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// exécuté dans la portée de setup() (pour chaque instance)
</script>
```

La prise en charge de la combinaison de `<script setup>` et de `<script>` dans le même composant est limitée aux scénarios décrits ci-dessus. Plus précisément :

- N'utilisez **PAS** une section `<script>` distincte pour les options qui peuvent déjà être définies à l'aide de `<script setup>`, comme `props` et `emits`.
- Les variables créées à l'intérieur de `<script setup>` ne sont pas ajoutées comme propriétés à l'instance du composant, ce qui les rend inaccessibles depuis l'Options API. Il est fortement déconseillé de mélanger les API de cette manière.

Si vous vous trouvez dans un scénario non pris en charge, vous devriez envisager d'utiliser une fonction explicite [`setup()`](/api/composition-api-setup), au lieu d'utiliser `<script setup>`.

## `await` de haut niveau {#top-level-await}

Un `await` de haut niveau peut être utilisé à l'intérieur de `<script setup>`. Le code résultant sera compilé comme `async setup()` :

```vue
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

De plus, l'expression attendue sera automatiquement compilée dans un format qui préserve le contexte de l'instance du composant courant après le `await`.

:::warning Remarque
`async setup()` doit être utilisée en combinaison avec `Suspense`, qui est actuellement encore une fonctionnalité expérimentale. Nous prévoyons de la finaliser et de la documenter dans une prochaine version - mais si vous êtes curieux, vous pouvez vous référer à ses [tests](https://github.com/vuejs/core/blob/main/packages/runtime-core/__tests__/components/Suspense.spec.ts) pour voir comment elle fonctionne.
:::

## Generics <sup class="vt-badge ts" /> {#generics}

Generic type parameters can be declared using the `generic` attribute on the `<script>` tag:

```vue
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
</script>
```

The value of `generic` works exactly the same as the parameter list between `<...>` in TypeScript. For example, you can use multiple parameters, `extends` constraints, default types, and reference imported types:

```vue
<script
  setup
  lang="ts"
  generic="T extends string | number, U extends Item"
>
import type { Item } from './types'
defineProps<{
  id: T
  list: U[]
}>()
</script>
```

## Restrictions {#restrictions}

En raison de la différence de sémantique d'exécution des modules, le code contenu dans `<script setup>` s'appuie sur le contexte d'un composant monofichier. Lorsqu'il est déplacé dans des fichiers externes `.js` ou `.ts`, il peut être source de confusion pour les développeurs et les outils. Par conséquent, **`<script setup>`** ne peut pas être utilisée avec l'attribut `src`.
