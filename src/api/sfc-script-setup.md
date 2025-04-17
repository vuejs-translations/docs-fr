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

Un composant monofichier peut implicitement se référer à lui-même via son nom de fichier. Par exemple, un fichier nommé `FooBar.vue` peut se référer à lui-même comme `<FooBar/>` dans son template.

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
// code du script setup
</script>
```

- `defineProps` et `defineEmits` sont des **macros de compilation** utilisables uniquement à l'intérieur de `<script setup>`. Elles n'ont pas besoin d'être importées, et sont compilées lorsque `<script setup>` est traité.

- `defineProps` accepte la même valeur que l'option `props`, tandis que `defineEmits` accepte la même valeur que l'option `emits`.

- `defineProps` et `defineEmits` fournissent une inférence de type appropriée basée sur les options passées.

- Les options passées à `defineProps` et `defineEmits` seront placées en dehors de setup dans la portée du module. Par conséquent, les options ne peuvent pas faire référence à des variables locales déclarées dans la portée de setup. Cela entraînerait une erreur de compilation. Cependant, elles _peuvent_ faire référence à des liaisons importées puisqu'elles sont également dans la portée du module.

### Déclaration des types de props et emits <sup class="vt-badge ts" /> {#type-only-props-emit-declarations}

Les props et les emits peuvent également être déclarés à l'aide d'un typage pur en passant un argument de type littéral à `defineProps` ou `defineEmits` :

```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+ : alternative, syntaxe plus succincte
const emit = defineEmits<{
  change: [id: number] // syntaxe avec tuple nommé
  update: [value: string]
}>()
```

- `defineProps` ou `defineEmits` ne peuvent utiliser que la déclaration à l'exécution OU la déclaration de type. L'utilisation des deux en même temps entraînera une erreur de compilation.

- Lors de l'utilisation de la déclaration de type, la déclaration à l'exécution équivalente est automatiquement générée à partir de l'analyse statique pour supprimer la nécessité d'une double déclaration tout en garantissant un comportement d'exécution correct.

  - En mode dev, le compilateur essaiera de déduire la validation d'exécution correspondante à partir des types. Par exemple ici `foo: String` est déduit du type `foo: string`. Si le type est une référence à un type importé, le résultat déduit sera `foo: null` (égal au type `any`) car le compilateur ne dispose pas d'informations sur les fichiers externes.

  - En mode prod, le compilateur générera la déclaration au format tableau pour réduire la taille du bundle (les props ici seront compilées dans `['foo', 'bar']`)

- Dans la version 3.2 et les versions antérieures, le paramètre de type générique pour `defineProps()` était limité à un littéral de type ou à une référence à une interface locale.

  Cette limitation a été résolue en 3.3. La dernière version de Vue prend en charge le référencement importé et un ensemble limité de types complexes dans le paramètre de type. Cependant, étant donné que la conversion de type à l'exécution est toujours basée sur AST, certains types complexes qui nécessitent une analyse de type réelle, par exemple les types conditionnels ne sont pas pris en charge. Vous pouvez utiliser des types conditionnels pour le type d'une prop, mais pas pour l'ensemble de l'objet props.

### Destructuration réactive des props <sup class="vt-badge" data-text="3.5+" /> {#reactive-props-destructure}

À partir de la Vue 3.5, les variables destructurées retournées par `defineProps` sont réactives. Le compilateur de Vue ajoute automatiquement `props.` quand le code dans le même bloc `<script setup>` accède aux variables destructurées provenant de `defineProps` :

```ts
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // s'exécute une seule fois avant la version 3.5
  // se ré-exécute quand la props "foo" change à partir de la version 3.5
  console.log(foo)
})
```

Le code ci-dessus est compilé comme suit :

```js {5}
const props = defineProps(['foo'])

watchEffect(() => {
  // `foo` transformé en `props.foo` par le compilateur
  console.log(props.foo)
})
```

De plus, vous pouvez utiliser la syntaxe native des valeurs par défaut de JavaScript pour déclarer des valeurs par défaut pour les accessoires. Ceci est particulièrement utile lorsque vous utilisez la déclaration de props basée sur le type :

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()
```

### Valeurs par défaut des props quand on utilise une déclaration de type <sup class="vt-badge ts" /> {#default-props-values-when-using-type-declaration}

Dans les versions 3.5 et supérieures, les valeurs par défaut peuvent être déclarées naturellement lors de l'utilisation de la destructuration réactive des props. Mais dans les versions 3.4 et inférieures, la destructuration réactive des props n'est pas activé par défaut. Afin de déclarer les valeurs par défaut des props avec la déclaration basée sur le type, la macro de compilation `withDefaults` est nécessaire :

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

Cela sera compilé avec les options `default` des props à l'exécution. De plus, l'assistant `withDefaults` fournit des vérifications de type pour les valeurs par défaut et s'assure que le type `props` renvoyé a les drapeaux facultatifs supprimés pour les propriétés qui ont des valeurs par défaut déclarées.

:::info
Notez que les valeurs par défaut de référence mutables (comme les tableaux ou les objets) doivent être enveloppées dans des fonctions lors de l'utilisation de `withDefaults` afin d'éviter toute modification accidentelle et tout effet de bord externe. Cela permet de s'assurer que chaque instance de composant reçoit sa propre copie de la valeur par défaut. Ceci n'est **pas** nécessaire lors de l'utilisation de valeurs par défaut avec destructuration.
:::

## defineModel() {#definemodel}

- Disponible à partir de la version 3.4

Cette macro peut être utilisée pour déclarer une prop bidirectionnelle qui peut être consommée via `v-model` à partir du composant parent. Des exemples d'utilisation sont également présentés dans le guide [v-model du composant](/guide/components/v-model).

Sous le capot, cette macro déclare un modèle prop et un événement de mise à jour de valeur correspondant. Si le premier argument est une chaîne littérale, il sera utilisé comme nom de la prop, sinon, le nom de la propriété sera par défaut `"modelValue"`. Dans les deux cas, vous pouvez également passer un objet supplémentaire qui peut inclure les options de la prop et les options de transformation de la valeur de la ref du modèle.

```js
// déclare la prop "modelValue", consommée par le parent via le v-model
const model = defineModel()
// OU : déclare la prop "modelValue" avec des options
const model = defineModel({ type: String })

// émet "update:modelValue" lorsqu'il est modifié
model.value = 'hello'

// déclare la prop "count", consommée par le parent via v-model:count
const count = defineModel('count')
// OU : déclare la prop "count" avec des options
const count = defineModel('count', { type: Number, default: 0 })

function inc() {
  // émet "update:count" lorsqu'il est muté
  count.value++
}
```

:::warning
Si vous avez une valeur `default` pour la propriété `defineModel` et que vous ne fournissez aucune valeur pour cette propriété à partir du composant parent, cela peut provoquer une désynchronisation entre les composants parent et enfant. Dans l'exemple ci-dessous, le composant parent `myRef` est undefined, mais le composant enfant `model` vaut 1 :

```js
// composant enfant :
const model = defineModel({ default: 1 })

// composant parent :
const myRef = ref()
```

```html
<Child v-model="myRef"></Child>
```

:::

### Modificateurs et transformateurs

Pour accéder aux modificateurs utilisés avec la directive `v-model`, nous pouvons déstructurer la valeur de retour de `defineModel()` comme ceci :

```js
const [modelValue, modelModifiers] = defineModel()

// correspond à v-model.trim
if (modelModifiers.trim) {
  // ...
}
```

Lorsqu'un modificateur est présent, il est probable que nous devions transformer la valeur lors de la lecture ou de la synchronisation avec le parent. Nous pouvons y parvenir en utilisant les options de transformation `get` et `set` :

```js
const [modelValue, modelModifiers] = defineModel({
  // get() est omis car il n'est pas nécessaire ici
  set(value) {
    // si le modificateur .trim est utilisé, renvoie la valeur sans espaces supplémentaires
    if (modelModifiers.trim) {
      return value.trim()
    }
    // sinon, renvoie la valeur telle quelle
    return value
  }
})
```

### Utilisation avec TypeScript <sup class="vt-badge ts" /> {#usage-with-typescript}

Comme `defineProps` et `defineEmits`, `defineModel` peut aussi recevoir des arguments de type pour spécifier les types de la valeur du modèle et des modificateurs :

```ts
const modelValue = defineModel<string>()
//    ^? Ref<string | undefined>

// modèle par défaut avec options, les valeurs requises suppriment les possibles valeurs indéfinies
const modelValue = defineModel<string>({ required: true })
//    ^? Ref<string>

const [modelValue, modifiers] = defineModel<string, 'trim' | 'uppercase'>()
//                 ^? Record<'trim' | 'uppercase', true | undefined>
```

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

- Uniquement pris en charge à partir de la version 3.3.

Cette macro peut être utilisée pour déclarer des options de composant directement dans `<script setup>` sans avoir à utiliser un bloc `<script>` séparé :

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

- Ceci est une macro. Les options seront hissées à la portée du module et ne pourront pas accéder aux variables locales du `<script setup>` qui ne sont pas des constantes littérales.

## defineSlots()<sup class="vt-badge ts"/> {#defineslots}

- Uniquement pris en charge à partir de la version 3.3.

Cette macro peut être utilisée pour fournir des indications de type aux IDE pour la vérification du nom de slot et du type des props.

`defineSlots()` n'accepte qu'un paramètre de type et aucun argument d'exécution. Le paramètre de type doit être un littéral de type où la clé de propriété est le nom du slot et le type de valeur est la fonction du slot. Le premier argument de la fonction est les props que le slot s'attend à recevoir, et son type sera utilisé pour les props de slot dans le template. Le type de retour est actuellement ignoré et peut être `any`, mais nous pouvons l'utiliser pour vérifier le contenu des slots à l'avenir.

Il renvoie également l'objet `slots`, qui est équivalent à l'objet `slots` exposé dans le contexte setup ou renvoyé par `useSlots()`.

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
}>()
</script>
```

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
- Exécuter des effets de bord ou créer des objets qui ne doivent être exécutés qu'une fois.

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
`async setup()` doit être utilisée en combinaison avec [`Suspense`](/guide/built-ins/suspense.html), qui est actuellement encore une fonctionnalité expérimentale. Nous prévoyons de la finaliser et de la documenter dans une prochaine version - mais si vous êtes curieux, vous pouvez vous référer à ses [tests](https://github.com/vuejs/core/blob/main/packages/runtime-core/__tests__/components/Suspense.spec.ts) pour voir comment elle fonctionne.
:::

## Déclaration d'importation {#imports-statements}

Les déclarations d'importation en Vue sont conformes à la [spécification des modules ECMAScript](https://nodejs.org/api/esm.html).
En outre, vous pouvez utiliser des alias définis dans la configuration de votre outil de construction :

```vue
<script setup>
import { ref } from 'vue'
import { componentA } from './Components'
import { componentB } from '@/Components'
import { componentC } from '~/Components'
</script>
```

## Génériques <sup class="vt-badge ts" /> {#generics}

Les paramètres de type générique peuvent être déclarés à l'aide de l'attribut `generic` sur la balise `<script>` :

```vue
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
</script>
```

La valeur de `generic` fonctionne exactement de la même manière que la liste de paramètres entre `<...>` dans TypeScript. Par exemple, vous pouvez utiliser plusieurs paramètres, des contraintes "extends", des types par défaut et des types importés de référence :

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

Vous pouvez utiliser la directive `@vue-generic` pour passer des types explicites, lorsque le type ne peut pas être déduit :

```vue
<template>
  <!-- @vue-generic {import('@/api').Actor} -->
  <ApiSelect v-model="peopleIds" endpoint="/api/actors" id-prop="actorId" />

  <!-- @vue-generic {import('@/api').Genre} -->
  <ApiSelect v-model="genreIds" endpoint="/api/genres" id-prop="genreId" />
</template>
```

Pour utiliser une référence d'un composant générique dans une 'ref', il convient d'utiliser la librairie [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers) au lieu de `InstanceType` qui ne fonctionnera pas.

```vue
<script
  setup
  lang="ts"
>
import componentWithoutGenerics from '../component-without-generics.vue';
import genericComponent from '../generic-component.vue';

import type { ComponentExposed } from 'vue-component-type-helpers';

// Fonctionne pour un composant non générique
ref<InstanceType<typeof componentWithoutGenerics>>();

ref<ComponentExposed<typeof genericComponent>>();
```

## Restrictions {#restrictions}

- En raison de la différence de sémantique d'exécution des modules, le code contenu dans `<script setup>` s'appuie sur le contexte d'un composant monofichier. Lorsqu'il est déplacé dans des fichiers externes `.js` ou `.ts`, il peut être source de confusion pour les développeurs et les outils. Par conséquent, **`<script setup>`** ne peut pas être utilisée avec l'attribut `src`.
- `<script setup>` ne supporte pas les composants dont le template est récupéré depuis le DOM. ([Discussion](https://github.com/vuejs/core/issues/8391))
