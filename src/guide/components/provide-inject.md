# Provide / Inject {#provide-inject}

> Cette page suppose que vous avez déjà lu les [principes fondamentaux des composants](/guide/essentials/component-basics). Lisez-les d'abord si vous débutez avec les composants.

## Passage de props en profondeur (Prop Drilling) {#prop-drilling}

Habituellement, lorsque nous devons transmettre des données du parent à un composant enfant, nous utilisons des [props](/guide/components/props). Cependant, imaginez le cas où nous avons un arbre de composants important, et qu'un composant profondément imbriqué aurait besoin d'accéder à des informations d'un de ses composants parents. Avec seulement des props, nous devrions passer la même prop sur toute la chaîne composants parents :

![prop drilling diagram](./images/prop-drilling.png)

<!-- https://www.figma.com/file/yNDTtReM2xVgjcGVRzChss/prop-drilling -->

Notez que bien que le composant `<Footer>` n'utilise pas du tout ces props, il doit malgré tout les déclarer et les transmettre uniquement afin que `<DeepChild>` puisse y accéder. S'il y a une chaîne de composants parents plus longue, encore plus de composants seront affectés par le problème. C'est ce qu'on appelle le "props drilling" et ce n'est certainement pas amusant à gérer.

Nous pouvons résoudre le "props drilling" avec `provide` et `inject`. Un composant parent peut servir de **fournisseur de dépendances** pour tous ses descendants. Tout composant enfant de l'arborescence, quelle que soit sa profondeur, peut **injecter** des dépendances fournies par des composants présent dans sa chaîne de composants parents.

![Provide/inject scheme](./images/provide-inject.png)

<!-- https://www.figma.com/file/PbTJ9oXis5KUawEOWdy2cE/provide-inject -->

## Provide {#provide}

<div class="composition-api">

Pour fournir des données aux descendants d'un composant, utilisez la fonction [`provide()`](/api/composition-api-dependency-injection#provide) :

```vue
<script setup>
import { provide } from 'vue'

provide(/* clé */ 'message', /* valeur */ 'hello!')
</script>
```

Si vous n'utilisez pas `<script setup>`, assurez-vous que `provide()` est appelé de manière synchrone dans `setup()` :

```js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* clé */ 'message', /* valeur */ 'hello!')
  }
}
```

La fonction `provide()` accepte deux arguments. Le premier argument est appelé la **clé d'injection**, qui peut être une chaîne de caractères ou un `Symbol`. La clé d'injection est utilisée par les composants descendants pour rechercher la valeur souhaitée à injecter. Un composant peut appeler `provide()` plusieurs fois avec différentes clés d'injection pour fournir différentes valeurs.

Le deuxième argument est la valeur fournie. La valeur peut être de n'importe quel type, y compris un état réactif tel que des refs :

```js
import { ref, provide } from 'vue'

const count = ref(0)
provide('key', count)
```

Fournir des valeurs réactives permet aux composants descendants qui les utilisent d'établir une connexion réactive au composant fournisseur.

</div>

<div class="options-api">

Pour fournir des données aux descendants d'un composant, utilisez l'option [`provide`](/api/options-composition#provide) :

```js
export default {
  provide: {
    message: 'hello!'
  }
}
```

Pour chaque propriété de l'objet `provide`, la clé est utilisée par les composants enfants pour localiser la valeur correcte à injecter, tandis que la valeur est celle qui finit par être injectée.

Si nous devons fournir un état par instance, par exemple des données déclarées via `data()`, alors `provide` doit utiliser une valeur de type fonction :

```js{7-12}
export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    // utiliser la syntaxe avec une fonction afin de pouvoir accéder à `this`
    return {
      message: this.message
    }
  }
}
```

Cependant, notez que cela **ne rend pas** l'injection réactive. Nous discuterons ci-dessous de la [manière de rendre les injections réactives](#working-with-reactivity).

</div>

## Provide au niveau de l'application {#app-level-provide}

En plus de fournir des données dans un composant, nous pouvons également fournir des données au niveau de l'application :

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* clé */ 'message', /* valeur */ 'hello!')
```

Les données fournies au niveau de l'application sont disponibles pour tous les composants rendus dans l'application. Ceci est particulièrement utile lors de l'écriture de [plugins](/guide/reusability/plugins), car les plugins ne seraient généralement pas en mesure de fournir des valeurs à l'aide de composants.

## Inject {#inject}

<div class="composition-api">

Pour injecter des données fournies par un composant parent, utilisez la fonction [`inject()`](/api/composition-api-dependency-injection#inject) :

```vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

Si plusieurs parents fournissent des données avec la même clé, l'injection se résoudra à la valeur du parent le plus proche dans la chaîne des parents du composant.

Si la valeur fournie est une référence, elle sera injectée telle quelle et **ne sera pas** automatiquement exposée. Cela permet au composant injecteur de conserver la connexion de réactivité au composant fournisseur.

[Exemple complet provide + inject avec réactivité](https://play.vuejs.org/#eNqFUUFugzAQ/MrKF1IpxfeIVKp66Kk/8MWFDXYFtmUbpArx967BhURRU9/WOzO7MzuxV+fKcUB2YlWovXYRAsbBvQije2d9hAk8Xo7gvB11gzDDxdseCuIUG+ZN6a7JjZIvVRIlgDCcw+d3pmvTglz1okJ499I0C3qB1dJQT9YRooVaSdNiACWdQ5OICj2WwtTWhAg9hiBbhHNSOxQKu84WT8LkNQ9FBhTHXyg1K75aJHNUROxdJyNSBVBp44YI43NvG+zOgmWWYGt7dcipqPhGZEe2ef07wN3lltD+lWN6tNkV/37+rdKjK2rzhRTt7f3u41xhe37/xJZGAL2PLECXa9NKdD/a6QTTtGnP88LgiXJtYv4BaLHhvg==)

Encore une fois, si vous n'utilisez pas `<script setup>`, `inject()` ne doit être appelé que de manière synchrone dans `setup()` :

```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```

</div>

<div class="options-api">

Pour injecter des données fournies par un composant parent, utilisez l'option [`inject`](/api/options-composition#inject) :

```js
export default {
  inject: ['message'],
  created() {
    console.log(this.message) // valeur injectée
  }
}
```

Les injections sont résolues **avant** l'état même du composant, vous pouvez donc accéder aux propriétés injectées dans `data()` :

```js
export default {
  inject: ['message'],
  data() {
    return {
      // données initiales basées sur la valeur injectée
      fullMessage: this.message
    }
  }
}
```

Si plusieurs parents fournissent des données avec la même clé, l'injection se résoudra à la valeur du parent le plus proche dans la chaîne des parents du composant.

[Exemple complet provide + inject](https://play.vuejs.org/#eNqNkcFqwzAQRH9l0EUthOhuRKH00FO/oO7B2JtERZaEvA4F43+vZCdOTAIJCImRdpi32kG8h7A99iQKobs6msBvpTNt8JHxcTC2wS76FnKrJpVLZelKR39TSUO7qreMoXRA7ZPPkeOuwHByj5v8EqI/moZeXudCIBL30Z0V0FLXVXsqIA9krU8R+XbMR9rS0mqhS4KpDbZiSgrQc5JKQqvlRWzEQnyvuc9YuWbd4eXq+TZn0IvzOeKr8FvsNcaK/R6Ocb9Uc4FvefpE+fMwP0wH8DU7wB77nIo6x6a2hvNEME5D0CpbrjnHf+8excI=)

### Alias d'injection {#injection-aliasing}

Si la syntaxe utilisée avec `inject` est sous la forme d'un tableau, les propriétés injectées sont exposées sur l'instance de composant à l'aide de la même clé. Dans l'exemple ci-dessus, la propriété a été fournie sous la clé `"message"` et injectée en tant que `this.message`. La clé locale est la même que la clé d'injection.

Si nous voulons injecter la propriété en utilisant une clé locale différente, nous devrions utiliser la syntaxe sous la forme d'un objet avec l'option `inject` :

```js
export default {
  inject: {
    /* clé locale */ localMessage: {
      from: /* clé d'injection */ 'message'
    }
  }
}
```

Ici, le composant localisera une propriété fournie avec la clé `"message"`, puis l'exposera en tant que `this.localMessage`.

</div>

### Valeurs par défaut lors de l'injection {#injection-default-values}

Par défaut, `inject` suppose que la clé injectée est fournie quelque part dans la chaîne de composants parents. Dans le cas où la clé n'est pas fournie, il y aura un message d'avertissement lors de l'exécution.

Si nous voulons faire fonctionner une propriété injectée avec des fournisseurs facultatifs, nous devons déclarer une valeur par défaut, de la même manière qu'avec les props :

<div class="composition-api">

```js
// `value` sera "default value"
// si aucune donnée correspondant à la clé "message" n'a été fournie
const value = inject('message', 'default value')
```

Dans certains cas, la valeur par défaut peut devoir être créée en appelant une fonction ou en instanciant une nouvelle classe. Pour éviter des calculs inutiles ou des effets de bord si la valeur facultative n'est pas utilisée, nous pouvons utiliser une fonction factory pour créer la valeur par défaut :

```js
const value = inject('key', () => new ExpensiveClass(), true)
```

Le troisième paramètre indique la valeur par défaut à traiter comme une fonction _factory_.

</div>

<div class="options-api">

```js
export default {
  // la syntaxe utilisant un objet est requise
  // lors de la déclaration des valeurs par défaut pour les injections
  inject: {
    message: {
      from: 'message', // ceci est facultatif si vous utilisez la même clé pour l'injection
      default: 'default value'
    },
    user: {
      // utiliser une fonction factory pour les valeurs non primitives coûteuse
      // à créer, ou celles qui doivent être uniques par instance de composant.
      default: () => ({ name: 'John' })
    }
  }
}
```

</div>

## Injections réactives {#working-with-reactivity}

<div class="composition-api">

Lors de l'utilisation de valeurs de réactives avec provide / inject, **il est recommandé de conserver toutes les mutations d'un état réactif à l'intérieur du _fournisseur_ dans la mesure du possible**. Cela garantit que l'état fourni et ses éventuelles mutations sont localisés dans le même composant, ce qui facilite sa maintenabilité à l'avenir.

Il peut arriver que nous ayons besoin de mettre à jour les données depuis un composant réalisant l'injection. Dans de tels cas, nous vous recommandons de fournir une fonction responsable de la mutation de l'état :

```vue{7-9,13}
<!-- à l'intérieur du composant fournisseur -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})
</script>
```

```vue{5}
<!-- dans le composant injecteur -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```

Enfin, vous pouvez encapsuler la valeur fournie avec [`readonly()`](/api/reactivity-core#readonly) si vous souhaitez vous assurer que les données transmises via `provide` ne puissent pas être mutées par le composant réalisant l'injection.

```vue
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>
```

</div>

<div class="options-api">

Afin de rendre les injections liées de manière réactive au fournisseur, nous devons fournir une propriété calculée à l'aide de la fonction [computed()](/api/reactivity-core#computed) :

```js{10}
import { computed } from 'vue'

export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    return {
      // fournir explicitement une propriété calculée
      message: computed(() => this.message)
    }
  }
}
```

[Exemple complet provide + inject avec réactivité](https://play.vuejs.org/#eNqNUctqwzAQ/JVFFyeQxnfjBEoPPfULqh6EtYlV9EKWTcH43ytZtmPTQA0CsdqZ2dlRT16tPXctkoKUTeWE9VeqhbLGeXirheRwc0ZBds7HKkKzBdBDZZRtPXIYJlzqU40/I4LjjbUyIKmGEWw0at8UgZrUh1PscObZ4ZhQAA596/RcAShsGnbHArIapTRBP74O8Up060wnOO5QmP0eAvZyBV+L5jw1j2tZqsMp8yWRUHhUVjKPoQIohQ460L0ow1FeKJlEKEnttFweijJfiORElhCf5f3umObb0B9PU/I7kk17PJj7FloN/2t7a2Pj/Zkdob+x8gV8ZlMs2de/8+14AXwkBngD9zgVqjg2rNXPvwjD+EdlHilrn8MvtvD1+Q==)

La fonction `computed()` est généralement utilisée dans les composants utilisant la Composition API, mais peut également être utilisée pour compléter certains cas d'usage avec l'Options API. Vous pouvez en savoir plus sur son utilisation en lisant [les fondamentaux de la réactivité](/guide/essentials/reactivity-fundamentals) et [les propriétés calculées](/guide/essentials/computed) avec la préférence d'API définie sur Composition API.

</div>

## Injection avec des Symbols en tant que clés {#working-with-symbol-keys}

Jusqu'à présent, nous avons utilisé dans les exemples des clés d'injection qui étaient des chaînes de caractères. Si vous travaillez dans une application de taille importante avec de nombreux fournisseurs de dépendances, ou si vous créez des composants qui seront utilisés par d'autres développeurs, il est préférable d'utiliser des clés d'injection utilisant des Symbols pour éviter les collisions potentielles.

Il est recommandé d'exporter les Symbols dans un fichier dédié :

```js
// keys.js
export const myInjectionKey = Symbol()
```

<div class="composition-api">

```js
// dans le composant fournisseur
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, {
  /* données à fournir */
})
```

```js
// dans le composant injecteur
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

Voir aussi : [Définir le type des données avec Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

</div>

<div class="options-api">

```js
// dans le composant fournisseur
import { myInjectionKey } from './keys.js'

export default {
  provide() {
    return {
      [myInjectionKey]: {
        /* données à fournir */
      }
    }
  }
}
```

```js
// dans le composant injecteur
import { myInjectionKey } from './keys.js'

export default {
  inject: {
    injected: { from: myInjectionKey }
  }
}
```

</div>
