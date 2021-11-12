---
badges:
  - breaking
---

# Global API Treeshaking <MigrationBadges :badges="$frontmatter.badges" />

## Syntaxe 2.x

Si vous avez déjà eu à manipuler manuellement le DOM dans Vue, vous avez peut-être rencontré ce schéma :

```js
import Vue from 'vue'

Vue.nextTick(() => {
  // quelque chose lié au DOM
})
```

Ou, si vous avez testé en unité une application impliquant des [composants asynchrones](/guide/composant-dynamique-async.html), il est probable que vous ayez écrit quelque chose comme ceci :

```js
import { shallowMount } from '@vue/test-utils'
import { MyComponent } from './MyComponent.vue'

test('an async feature', async () => {
  const wrapper = shallowMount(MyComponent)

  // exécuter certaines tâches liées au DOM

  await wrapper.vm.$nextTick()

  // exécutez vos assertions
})
```

`Vue.nextTick()` est une API globale exposée directement sur un seul objet Vue - en fait, la méthode d'instance `$nextTick()` n'est qu'une enveloppe pratique autour de `Vue.nextTick()` avec le contexte `this` du callback automatiquement lié à l'instance courante pour plus de commodité.

Mais que faire si vous n'avez jamais eu à manipuler manuellement le DOM, et que vous n'utilisez pas ou ne testez pas de composants asynchrones dans votre application ? Ou si, pour une raison quelconque, vous préférez utiliser le bon vieux `window.setTimeout()` à la place ? Dans ce cas, le code pour `nextTick()` deviendra du code mort - c'est-à-dire du code écrit mais jamais utilisé. Et le code mort n'est pas une bonne chose, surtout dans notre contexte côté client où chaque kilooctet compte.

Les regroupeurs de modules comme [webpack](https://webpack.js.org/) prennent en charge [tree-shaking](https://webpack.js.org/guides/tree-shaking/), qui est un terme sophistiqué pour "élimination du code mort". Malheureusement, en raison de la façon dont le code est écrit dans les versions précédentes de Vue, les API globales comme `Vue.nextTick()` ne sont pas tree-shakeable et seront incluses dans le bundle final indépendamment de l'endroit où elles sont réellement utilisées ou non.

## Syntaxe 3.x

Dans Vue 3, les API globales et internes ont été restructurées en tenant compte de la prise en charge du tree-shaking. En conséquence, les API globales ne sont désormais accessibles qu'en tant qu'exportations nommées pour la construction des modules ES. Par exemple, nos snippets précédents devraient maintenant ressembler à ceci :

```js
import { nextTick } from 'vue'

nextTick(() => {
  // quelque chose lié au DOM
})
```

and

```js
import { shallowMount } from '@vue/test-utils'
import { MyComponent } from './MyComponent.vue'
import { nextTick } from 'vue'

test('an async feature', async () => {
  const wrapper = shallowMount(MyComponent)

  // exécuter certaines tâches liées au DOM

  await nextTick()

  // exécutez vos assertions
})
```

L'appel direct de `Vue.nextTick()` entraînera désormais la fameuse erreur `undefined is not a function`.

Avec ce changement, à condition que le module bundler supporte le tree-shaking, les APIs globales qui ne sont pas utilisées dans une application Vue seront éliminées du bundle final, résultant en une taille de fichier optimale.

## API affectées

Ces API globales dans Vue 2.x sont affectées par ce changement :

- `Vue.nextTick`
- `Vue.observable` (remplacé par `Vue.reactive`)
- `Vue.version`
- `Vue.compile` (seulement dans les builds complets)
- `Vue.set` (uniquement dans les builds compat)
- `Vue.delete` (seulement dans les compats)

## Aides internes

En plus des API publiques, de nombreux composants/assistants internes sont maintenant exportés en tant qu'exportations nommées. Cela permet au compilateur de produire un code qui n'importe les fonctionnalités que lorsqu'elles sont utilisées. Par exemple, le modèle suivant :

```html
<transition>
  <div v-show="ok">hello</div>
</transition>
```

est compilé en quelque chose de similaire à ce qui suit :

```js
import { h, Transition, withDirectives, vShow } from 'vue'

export function render() {
  return h(Transition, [withDirectives(h('div', 'hello'), [[vShow, this.ok]])])
}
```

Cela signifie essentiellement que le composant `Transition` n'est importé que lorsque l'application l'utilise réellement. En d'autres termes, si l'application n'a pas de composant `<transition>`, le code supportant cette fonctionnalité ne sera pas présent dans le bundle final.

Avec l'arborescence globale, l'utilisateur ne "paie" que pour les fonctionnalités qu'il utilise réellement. Mieux encore, sachant que les fonctionnalités optionnelles n'augmenteront pas la taille du bundle pour les applications qui ne les utilisent pas, la taille du framework est devenue une préoccupation beaucoup moins importante pour les fonctionnalités de base supplémentaires à l'avenir, voire pas du tout.

::: warning Important
Ce qui précède ne s'applique qu'aux [constructions des modules ES] (/guide/installation.html#explanation-of-different-builds) pour une utilisation avec des bundlers capables de secouer l'arbre - la construction UMD inclut toujours toutes les fonctionnalités et expose tout sur la variable globale Vue (et le compilateur produira une sortie appropriée pour utiliser les APIs de la variable globale au lieu de les importer).
:::

## Utilisation dans les plugins

Si votre plugin repose sur une API globale Vue 2.x affectée, par exemple :

```js
const plugin = {
  install: Vue => {
    Vue.nextTick(() => {
      // ...
    })
  }
}
```

Dans Vue 3, vous devrez l'importer explicitement :

```js
import { nextTick } from 'vue'

const plugin = {
  install: app => {
    nextTick(() => {
      // ...
    })
  }
}
```

Si vous utilisez un module bundle comme webpack, il se peut que le code source de Vue soit intégré au plugin, et le plus souvent, ce n'est pas ce que vous attendez. Une pratique courante pour éviter cela est de configurer le module bundler pour exclure Vue du bundle final. Dans le cas de webpack, vous pouvez utiliser l'option de configuration [`externals`](https://webpack.js.org/configuration/externals/) :

```js
// webpack.config.js
module.exports = {
  /*...*/
  externals: {
    vue: 'Vue'
  }
}
```

Ceci indique à webpack de traiter le module Vue comme une bibliothèque externe et de ne pas le regrouper.

Si votre module de choix est [Rollup](https://rollupjs.org/), vous obtiendrez le même effet gratuitement, car par défaut, Rollup traitera les ID de modules absolus (`'vue'` dans notre cas) comme des dépendances externes et ne les inclura pas dans le paquet final. Pendant le regroupement, il peut émettre un avertissement ["Treating vue as external dependency"](https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency), qui peut être supprimé avec l'option `external` :

```js
// rollup.config.js
export default {
  /*...*/
  external: ['vue']
}
```
