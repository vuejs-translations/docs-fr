# Reactivity Transform {#reactivity-transform}

:::danger Fonctionnalité expérimentale dépréciée
Reactivity Transform était une fonctionnalité expérimentale, et a été supprimée dans la dernière version 3.4. Consultez [le raisonnement ici](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028).

Si vous voulez continuer de l'utiliser, cela est désormais possible en utilisant le plugin [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html).
:::

:::tip Spécifique à la Composition API
Reactivity Transform est une fonctionnalité spécifique à la Composition API et nécessite un outil de build.
:::

## Refs vs. variables réactives {#refs-vs-reactive-variables}

Depuis l'introduction de la Composition API, l'une des principales questions non résolues est l'utilisation des refs par rapport aux objets réactifs. Il est facile de perdre la réactivité lors de la déstructuration des objets réactifs, mais il peut être fastidieux d'utiliser `.value` partout lors de l'utilisation des refs. De plus, `.value` est facilement oubliable si l'on n'utilise pas un système de typage.

[Reactivity Transform de Vue](https://github.com/vuejs/core/tree/main/packages/reactivity-transform) consiste en une transformation réalisée au moment de la compilation, nous permettant d'écrire du code comme celui-ci :

```vue
<script setup>
let count = $ref(0)

console.log(count)

function increment() {
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

La méthode `$ref()` est ici une **macro de compilation** : ce n'est pas une méthode réelle qui sera appelée à l'exécution. Au lieu de cela, le compilateur Vue l'utilise comme une indication pour traiter la variable `count` qui en résulte comme une **variable réactive**.

Les variables réactives peuvent être accédées et réassignées comme des variables normales, mais ces opérations sont compilées en des refs avec `.value`. Par exemple, la partie `<script>` du composant ci-dessus est compilée en :

```js{5,8}
import { ref } from 'vue'

let count = ref(0)

console.log(count.value)

function increment() {
  count.value++
}
```

Chaque API de réactivité qui renvoie des refs aura un équivalent en macro préfixé `$`. Ces API incluent :

- [`ref`](/api/reactivity-core#ref) -> `$ref`
- [`computed`](/api/reactivity-core#computed) -> `$computed`
- [`shallowRef`](/api/reactivity-advanced#shallowref) -> `$shallowRef`
- [`customRef`](/api/reactivity-advanced#customref) -> `$customRef`
- [`toRef`](/api/reactivity-utilities#toref) -> `$toRef`

Ces macros sont disponibles globalement et n'ont pas besoin d'être importées lorsque Reactivity Transform est activée, mais vous pouvez éventuellement les importer depuis `vue/macros` si vous voulez être plus explicite :

```js
import { $ref } from 'vue/macros'

let count = $ref(0)
```

## Déstructuration avec `$()` {#destructuring-with}

Il est courant pour une fonction de composition de retourner un objet de refs, et d'utiliser la déstructuration pour récupérer ces même refs. Pour ce faire, Reactivity Transform fournit la macro **`$()`** :

```js
import { useMouse } from '@vueuse/core'

const { x, y } = $(useMouse())

console.log(x, y)
```

Compilé en :

```js
import { toRef } from 'vue'
import { useMouse } from '@vueuse/core'

const __temp = useMouse(),
  x = toRef(__temp, 'x'),
  y = toRef(__temp, 'y')

console.log(x.value, y.value)
```

Notez que si `x` est déjà une ref, `toRef(__temp, 'x')` le retournera simplement tel quel et aucune ref supplémentaire ne sera créée. Si une valeur déstructurée n'est pas une ref (par exemple une fonction), cela fonctionnera quand même - la valeur sera enveloppée dans une ref afin que le reste du code fonctionne comme prévu.

La déstructuration avec `$()` fonctionne à la fois sur les objets réactifs **et** les objets simples contenant des refs.

## Convertir les refs existantes en variables réactives avec `$()` {#convert-existing-refs-to-reactive-variables-with}

Dans certains cas, nous pouvons avoir des fonctions enveloppées qui renvoient également des refs. Cependant, le compilateur Vue ne sera pas capable de savoir à l'avance qu'une fonction va retourner une ref. Dans ce cas, la macro `$()` peut également être utilisée pour convertir les refs existantes en variables réactives :

```js
function myCreateRef() {
  return ref(0)
}

let count = $(myCreateRef())
```

## Déstructuration de props réactives {#reactive-props-destructure}

Il y a deux problèmes avec l'utilisation actuelle de `defineProps()` dans `<script setup>` :

1. Comme pour `.value`, vous devez toujours accéder aux props via `props.x` afin de conserver la réactivité. Cela signifie que vous ne pouvez pas déstructurer `defineProps` car les variables déstructurées résultantes ne sont pas réactives et ne seront pas mises à jour.

2. Lorsque l'on utilise la [déclaration de type pour les props](/api/sfc-script-setup#type-only-props-emit-declarations), il n'y a pas de moyen facile de déclarer des valeurs par défaut pour les props. Nous avons introduit l'API `withDefaults()` dans ce but précis, mais elle reste toujours difficile à utiliser.

Nous pouvons résoudre ces problèmes en appliquant une transformation au moment de la compilation lorsque `defineProps` est utilisée avec la déstructuration, de la même manière que ce que nous avons vu précédemment avec `$()` :

```html
<script setup lang="ts">
  interface Props {
    msg: string
    count?: number
    foo?: string
  }

  const {
    msg,
    // une valeur par défaut fonctionne
    count = 1,
    // l'utilisation d'alias locaux fonctionne également
    // ici nous utilisons l'alias `bar` pour `props.foo`
    foo: bar
  } = defineProps<Props>()

  watchEffect(() => {
    // va loguer chaque fois que les props changent
    console.log(msg, count, bar)
  })
</script>
```

Ce qui précède sera compilé en un équivalent de la déclaration d'exécution suivante :

```js
export default {
  props: {
    msg: { type: String, required: true },
    count: { type: Number, default: 1 },
    foo: String
  },
  setup(props) {
    watchEffect(() => {
      console.log(props.msg, props.count, props.foo)
    })
  }
}
```

## Conserver la réactivité au-delà des frontières des fonctions {#retaining-reactivity-across-function-boundaries}

Bien que les variables réactives nous évitent de devoir utiliser `.value` partout, cela crée un problème de "perte de réactivité" lorsque nous passons des variables réactives à travers les frontières des fonctions. Cela peut se produire dans deux cas :

### Passage dans une fonction comme argument {#passing-into-function-as-argument}

Prenons une fonction qui attend une ref comme argument, par exemple :

```ts
function trackChange(x: Ref<number>) {
  watch(x, (x) => {
    console.log('x changed!')
  })
}

let count = $ref(0)
trackChange(count) // ne fonctionne pas !
```

Le cas ci-dessus ne fonctionnera pas comme prévu car il sera compilé en :

```ts
let count = ref(0)
trackChange(count.value)
```

Ici, `count.value` est passée comme un nombre, alors que `trackChange` attend une ref réelle. Cela peut être corrigé en enveloppant `count` avec `$$()` avant de le passer :

```diff
let count = $ref(0)
- trackChange(count)
+ trackChange($$(count))
```

Se compile comme suit :

```js
import { ref } from 'vue'

let count = ref(0)
trackChange(count)
```

Comme nous pouvons le voir, `$$()` est une macro qui sert d'indice **échappatoire** : les variables réactives contenues dans `$$()` ne se verront pas ajouter `.value`.

### Retour à l'intérieur du scope d'une fonction {#returning-inside-function-scope}

La réactivité peut également être perdue si les variables réactives sont utilisées directement dans une expression retournée :

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // écout les mouvements de la souris...

  // ne fonctionne pas !
  return {
    x,
    y
  }
}
```

L'instruction de retour ci-dessus se compile comme suit :

```ts
return {
  x: x.value,
  y: y.value
}
```

Afin de conserver la réactivité, nous devrions renvoyer les refs réelles, et non la valeur actuelle au moment du retour.

Encore une fois, nous pouvons utiliser `$$()` pour résoudre ce problème. Dans ce cas, `$$()` peut être utilisée directement sur l'objet retourné - toute référence à des variables réactives à l'intérieur de l'appel `$$()` conservera la référence à leurs refs sous-jacentes :

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // écoute les mouvements de la souris...

  // corrigé
  return $$({
    x,
    y
  })
}
```

### Utiliser `$$()` sur des props déstructurées {#using-on-destructured-props}

`$$()` fonctionne sur les props déstructurées puisqu'elles sont elles aussi des variables réactives. Le compilateur le convertira avec `toRef` pour plus d'efficacité :

```ts
const { count } = defineProps<{ count: number }>()

passAsRef($$(count))
```

Se compile comme suit :

```js
setup(props) {
  const __props_count = toRef(props, 'count')
  passAsRef(__props_count)
}
```

## Intégration avec TypeScript <sup class="vt-badge ts" /> {#typescript-integration}

Vue fournit des typages pour ces macros (disponibles globalement) et tous les types fonctionneront comme prévu. Il n'y a aucune incompatibilité avec la sémantique TypeScript standard, et donc la syntaxe fonctionnera avec tous les outils existants.

Cela signifie également que les macros peuvent fonctionner dans n'importe quel fichier où les JS / TS valides sont autorisés - pas seulement dans les SFC de Vue.

Puisque les macros sont disponibles globalement, leurs types doivent être explicitement référencés (par exemple dans un fichier `env.d.ts`) :

```ts
/// <reference types="vue/macros-global" />
```

Si vous importez explicitement les macros à partir de `vue/macros`, le type fonctionnera sans déclarer les globaux.

## Activation explicite {#explicit-opt-in}

:::warning
Ce qui suit ne s'applique qu'aux versions 3.3 et inférieures de Vue. La prise en charge par le noyau a été supprimée depuis la version 3.4, et la version 5 et plus de `@vitejs/plugin-vue`. Si vous voulez continuer à utiliser la transformation, veuillez migrer vers [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html) à la place.
:::

### Vite {#vite}

- Nécessite `@vitejs/plugin-vue@>=2.0.0`.
- S'applique aux SFC et aux fichiers js(x)/ts(x). Une vérification rapide de l'utilisation est effectuée sur les fichiers avant d'appliquer la transformation, il ne devrait donc pas y avoir de perte de performance pour les fichiers n'utilisant pas les macros.
- Notez que `reactivityTransform` est désormais une option au niveau de la racine du plugin au lieu d'être imbriquée comme `script.refSugar`, puisqu'elle n'affecte pas seulement les SFC.

```js [vite.config.js]
export default {
  plugins: [
    vue({
      reactivityTransform: true
    })
  ]
}
```

### `vue-cli` {#vue-cli}

- N'affecte actuellement que les SFC
- Nécessite `vue-loader@>=17.0.0`.

```js [vue.config.js]
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          reactivityTransform: true
        }
      })
  }
}
```

### `webpack` simple + `vue-loader` {#plain-webpack-vue-loader}

- N'affecte actuellement que les SFC
- Nécessite `vue-loader@>=17.0.0`.

```js [webpack.config.js]
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          reactivityTransform: true
        }
      }
    ]
  }
}
```
