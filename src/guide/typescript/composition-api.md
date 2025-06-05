# TypeScript avec la Composition API {#typescript-with-composition-api}

<ScrimbaLink href="https://scrimba.com/links/vue-ts-composition-api" title="Leçon gratuite de TypeScript Vue.js avec la Composition API"  type="scrimba">
  Voir une leçon vidéo interactive sur Scrimba
</ScrimbaLink>

> Cette page part du principe que vous avez déjà pris connaissance de comment [utiliser Vue avec TypeScript](./overview).

## Typer les props des composants {#typing-component-props}

### Utiliser `<script setup>` {#using-script-setup}

Lorsque vous utilisez `<script setup>`, la macro `defineProps()` permet de déduire les types des props en fonction de l'argument qu'elle reçoit :

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
```

Ceci est appelé "déclaration à l'exécution" de fait que l'argument passé à `defineProps()` sera utilisé comme l'option `props` lors de l'exécution.

Cependant, il est généralement plus simple de définir des props avec des types purs via un argument de type générique :

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

C'est ce qu'on appelle la "déclaration basée sur le type". Le compilateur fera de son mieux pour déduire les options à l'exécution équivalentes en fonction de l'argument de type. Dans ce cas, notre deuxième exemple compile avec exactement les mêmes options à l'exécution que le premier exemple.

Vous pouvez utiliser la déclaration basée sur les types OU la déclaration à l'exécution, mais vous ne pouvez pas utiliser les deux en même temps.

Nous pouvons également déplacer les types des props dans une interface séparée :

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

const props = defineProps<Props>()
</script>
```

Cela fonctionne également si `Props` est importé d'une source externe. Cette fonctionnalité nécessite que TypeScript soit une dépendance peer de Vue.

```vue
<script setup lang="ts">
import type { Props } from './foo'

const props = defineProps<Props>()
</script>
```

#### Limitations de syntaxe {#syntax-limitations}

Dans la version 3.2 et les versions antérieures, le paramètre de type générique pour `defineProps()` était limité à un littéral de type ou à une référence à une interface locale.

Cette limitation a été résolue en 3.3. La dernière version de Vue prend en charge le référencement importé et un ensemble limité de types complexes dans la position du paramètre de type. Cependant, étant donné que la conversion de type à l'exécution est toujours basée sur AST, certains types complexes qui nécessitent une analyse de type réelle, par exemple les types conditionnels ne sont pas pris en charge. Vous pouvez utiliser des types conditionnels pour le type d'une props, mais pas pour l'ensemble de l'objet props.

### Valeurs par défaut des props {#props-default-values}

En utilisant la déclaration basée sur le type, nous perdons la possibilité de déclarer des valeurs par défaut pour les props. Ceci peut être résolu par la [destructuration réactive des props](/guide/components/props#reactive-props-destructure) <sup class="vt-badge" data-text="3.5+" /> :

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()
```

Dans les versions 3.4 et suivantes, la destructuration réactive des props n'est pas activé par défaut. Une alternative est d'utiliser la macro de compilation `withDefaults` :

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

Ceci sera compilé en options à l'exécution `default` équivalentes aux props. De plus, `withDefaults` fournit des vérifications de type pour les valeurs par défaut, et assure que le type `props` retourné n'a pas les options facultatives pour les propriétés qui ont des valeurs déclarées par défaut.

:::info
Notez que les valeurs par défaut de référence mutables (comme les tableaux ou les objets) doivent être enveloppées dans des fonctions lors de l'utilisation de `withDefaults` afin d'éviter toute modification accidentelle et tout effet de bord externe. Cela permet de s'assurer que chaque instance de composant reçoit sa propre copie de la valeur par défaut. Ceci n'est **pas** nécessaire lors de l'utilisation de valeurs par défaut avec destructuration.
:::

### Sans `<script setup>` {#without-script-setup}

Si vous n'utilisez pas `<script setup>`, il est nécessaire d'utiliser `defineComponent()` pour activer l'inférence de type des props. Le type de l'objet props passé à `setup()` est déduit de l'option `props`.

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String
  },
  setup(props) {
    props.message // <-- type : string
  }
})
```

### Types complexes de props {#complex-prop-types}

Avec la déclaration basée sur le type, une prop peut utiliser un type complexe comme n'importe quel autre type :

```vue
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  book: Book
}>()
</script>
```

Pour la déclaration à l'exécution, nous pouvons utiliser le type utilitaire `PropType` :

```ts
import type { PropType } from 'vue'

const props = defineProps({
  book: Object as PropType<Book>
})
```

Cela fonctionne de la même manière si nous spécifions directement l'option `props` :

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    book: Object as PropType<Book>
  }
})
```

L'option `props` est plus couramment utilisée avec l'Options API, vous trouverez donc des exemples plus détaillés dans le guide de [TypeScript avec l'Options API](/guide/typescript/options-api#typing-component-props). Les techniques présentées dans ces exemples s'appliquent également aux déclarations à l'exécution utilisant `defineProps()`.

## Typer les événements d'un composant {#typing-component-emits}

Dans `<script setup>`, la fonction `emit` peut également être typée en utilisant la déclaration à l'exécution OU la déclaration de type :

```vue
<script setup lang="ts">
// à l'exécution
const emit = defineEmits(['change', 'update'])

// basée sur la déclaration d'options
const emit = defineEmits({
  change: (id: number) => {
    // retourner `true` ou `false`
    // selon si validation ou échec
  },
  update: (value: string) => {
    // retourner `true` ou `false`
    // selon si validation ou échec
  }
})

// basée sur les types
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+ : syntaxe alternative, plus succincte
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

L'argument du type peut être l'un des suivants :

1. Un type de fonction, mais écrit comme un littéral de type avec les [_Call Signatures_](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures). Il sera utilisé comme type de la fonction `emit` renvoyée.
2. Un littéral de type où les clés sont les noms d'événement et les valeurs sont des tableaux ou des tuples représentant les paramètres supplémentaires acceptés pour l'événement. L'exemple ci-dessus utilise des tuples nommés afin que chaque argument puisse avoir un nom explicite.

Comme nous pouvons le constater, la déclaration de type nous permet d'exercer un contrôle beaucoup plus fin sur les contraintes de type des événements émis.

Lorsque l'on n'utilise pas `<script setup>`, `defineComponent()` est capable de déduire les événements autorisés pour la fonction `emit` exposée sur le contexte setup :

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- vérification du type / auto-complétion
  }
})
```

## Typer `ref()` {#typing-ref}

Le type des refs est déduit à partir de leur valeur initiale :

```ts
import { ref } from 'vue'

// type déduit : Ref<number>
const year = ref(2020)

// => TS Error: Type 'string' is not assignable to type 'number'.
year.value = '2020'
```

Parfois, nous pouvons avoir besoin de spécifier des types complexes pour la valeur d'une ref. Nous pouvons le faire en utilisant le type `Ref` :

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // ok!
```

Ou, en passant un argument générique lors de l'appel de `ref()` pour remplacer l'inférence par défaut :

```ts
// type résultant : Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // ok!
```

Si vous spécifiez un argument de type générique mais omettez la valeur initiale, le type résultant sera un type d'union qui inclut `undefined` :

```ts
// type déduit : Ref<number | undefined>
const n = ref<number>()
```

## Typer `reactive()` {#typing-reactive}

`reactive()` déduit également de manière implicite le type à partir de son argument :

```ts
import { reactive } from 'vue'

// type déduit : { title: string }
const book = reactive({ title: 'Vue 3 Guide' })
```

Pour typer explicitement une propriété `reactive`, nous pouvons utiliser des interfaces :

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 Guide' })
```

:::tip
Il n'est pas recommandé d'utiliser l'argument générique de `reactive()` car le type retourné, qui gère le déballage des refs imbriquées, est différent du type de l'argument générique.
:::

## Typer `computed()` {#typing-computed}

`computed()` déduit son type en fonction de la valeur de retour de l'accesseur :

```ts
import { ref, computed } from 'vue'

const count = ref(0)

// type déduit : ComputedRef<number>
const double = computed(() => count.value * 2)

// => TS Error: Property 'split' does not exist on type 'number'
const result = double.value.split('')
```

Vous pouvez également spécifier un type explicite via un argument générique :

```ts
const double = computed<number>(() => {
  // erreur de type si un nombre n'est pas retourné
})
```

## Typer les gestionnaires d'événements {#typing-event-handlers}

Lorsque vous traitez des événements natifs du DOM, il peut être utile de typer correctement l'argument que nous passons au gestionnaire. Jetons un coup d'œil à cet exemple :

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` a implicitement un type `any`
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Sans annotation de type, l'argument `event` aura implicitement un type `any`. Cela entraînera également une erreur TS si `"strict" : true` ou `"noImplicitAny" : true` sont utilisés dans `tsconfig.json`. Il est donc recommandé d'annoter explicitement l'argument des gestionnaires d'événements. De plus, vous pouvez avoir besoin de caster explicitement des propriétés sur `event` :

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## Typer Provide / Inject {#typing-provide-inject}

Provide et Inject sont généralement utilisés dans des composants séparés. Pour typer correctement les valeurs injectées, Vue fournit une interface `InjectionKey`, qui est un type générique qui étend `Symbol`. Elle peut être utilisée pour synchroniser le type de la valeur injectée entre le fournisseur et le consommateur :

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // fournir une valeur qui n'est pas une chaîne de caractères va entraîner une erreur

const foo = inject(key) // type de foo : string | undefined
```

Il est recommandé de placer la clé d'injection dans un fichier séparé afin qu'elle puisse être importée dans plusieurs composants.

Lors de l'utilisation de clés d'injection sous la forme de chaînes de caractères, le type de la valeur injectée sera `unknown`, et devra être déclaré explicitement via un argument de type générique :

```ts
const foo = inject<string>('foo') // type : string | undefined
```

Notez que la valeur injectée peut toujours être `undefined`, car il n'y a aucune garantie qu'un fournisseur fournira cette valeur au moment de l'exécution.

Le type `undefined` peut être supprimé en fournissant une valeur par défaut :

```ts
const foo = inject<string>('foo', 'bar') // type : string
```

Si vous êtes sûr que la valeur est toujours fournie, vous pouvez également forcer le casting de la valeur :

```ts
const foo = inject('foo') as string
```

## Typer les refs de template {#typing-template-refs}

Avec Vue 3.5 et `@vue/language-tools` 2.1 (qui alimente à la fois le service linguistique de l'IDE et `vue-tsc`), le typage des refs créées par `useTemplateRef()` dans les SFC peut être **automatiquement déduit** pour les refs statiques en fonction de l'élément sur lequel l'attribut `ref` correspondant est utilisé.

Dans les cas où l'auto-inférence n'est pas possible, vous pouvez toujours convertir le template ref en un type explicite via l'argument générique :

```ts
const el = useTemplateRef<HTMLInputElement>('el')
```

<details>
<summary>Utilisation avant la version 3.5</summary>

Les références du template doivent être créées avec un argument de type générique explicite et une valeur initiale de `null` :

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

</details>

Pour obtenir la bonne interface du DOM, vous pouvez consulter les pages comme [MDN](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#technical_summary).

Notez que pour une sécurité de type stricte, il est nécessaire d'utiliser un chaînage optionnel ou des gardes de type lors de l'accès à `el.value`. Ceci s'explique par le fait que la valeur initiale d'une ref est `null` jusqu'à ce que le composant soit monté, et elle peut aussi être mise à `null` si l'élément référencé est démonté via un `v-if`.

## Typer les refs du template d'un composant {#typing-component-template-refs}

Avec Vue 3.5 et `@vue/language-tools` 2.1 (qui alimente à la fois le service linguistique de l'IDE et `vue-tsc`), le typage de refs créées par `useTemplateRef()` dans les SFC peut être **automatiquement déduit** pour les refs statiques en fonction de l'élément ou du composant sur lequel l'attribut `ref` correspondant est utilisé.

Dans les cas où l'auto-inférence n'est pas possible (par exemple, utilisation non-SFC ou composants dynamiques), vous pouvez toujours convertir la référence du template en un type explicite par l'intermédiaire de l'argument générique.

Pour obtenir le type d'instance d'un composant importé, nous devons d'abord obtenir son type via `typeof`, puis utiliser l'utilitaire intégré `InstanceType` de TypeScript pour extraire son type d'instance :

```vue{5}
<!-- App.vue -->
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

type FooType = InstanceType<typeof Foo>
type BarType = InstanceType<typeof Bar>

const compRef = useTemplateRef<FooType | BarType>('comp')
</script>

<template>
  <component :is="Math.random() > 0.5 ? Foo : Bar" ref="comp" />
</template>
```

Dans les cas où le type exact du composant n'est pas disponible ou n'est pas important, `ComponentPublicInstance` peut être utilisé à la place. Cela n'inclura que les propriétés qui sont partagées par tous les composants, comme `$el` :

```ts
import { useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = useTemplateRef<ComponentPublicInstance>('child')
```

Dans le cas où le composant référencé est un [composant générique](/guide/typescript/overview.html#generic-components), par exemple `MyGenericModal` :

```vue
<!-- MyGenericModal.vue -->
<script setup lang="ts" generic="ContentType extends string | number">
import { ref } from 'vue'

const content = ref<ContentType | null>(null)

const open = (newContent: ContentType) => (content.value = newContent)

defineExpose({
  open
})
</script>
```

Il doit être référencé en utilisant `ComponentExposed` de la bibliothèque [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers) car `InstanceType` ne fonctionnera pas.

```vue
<!-- App.vue -->
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import MyGenericModal from './MyGenericModal.vue'
import type { ComponentExposed } from 'vue-component-type-helpers'

const modal =
  useTemplateRef<ComponentExposed<typeof MyGenericModal>>('modal')

const openModal = () => {
  modal.value?.open('newValue')
}
</script>
```

Notez qu'avec `@vue/language-tools` 2.1+, les types des refs statiques des templates peuvent être automatiquement déduits et ce qui précède n'est nécessaire que dans les cas extrêmes.
