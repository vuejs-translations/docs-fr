# TypeScript avec l'Options API {#typescript-with-options-api}

> Cette page suppose que vous avez déjà lu l'aperçu de [Using Vue with TypeScript](./overview).

:::tip
Bien que Vue prenne en charge l'utilisation de TypeScript avec l'Options API, il est recommandé d'utiliser Vue avec TypeScript via la Composition API car elle offre une inférence de type plus simple, plus efficace et plus robuste.
:::

## Typer les props d'un composant {#typing-component-props}

L'inférence de type pour les props dans l'Options API nécessite d'envelopper le composant avec `defineComponent()`. Grâce à ce dernier, Vue est capable de déduire les types des props en fonction de l'option `props`, en prenant en compte des options supplémentaires telles que `required : true` et `default` :

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // inférence de type activée
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null
  },
  mounted() {
    this.name // type : string | undefined
    this.id // type : number | string | undefined
    this.msg // type : string
    this.metadata // type : any
  }
})
```

Cependant, les options `props` du runtime ne prennent en charge que l'utilisation des fonctions de constructeur comme type de prop - il n'y a aucun moyen de spécifier des types complexes tels que des objets avec des propriétés imbriquées ou des signatures d'appel de fonction.

Pour annoter des types de props complexes, nous pouvons utiliser le type utilitaire `PropType` :

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      // fournit un type plus spécifique à `Object`
      type: Object as PropType<Book>,
      required: true
    },
    // permet aussi d'annoter les fonctions
    callback: Function as PropType<(id: number) => void>
  },
  mounted() {
    this.book.title // string
    this.book.year // number

    // TS Error: argument of type 'string' is not
    // assignable to parameter of type 'number'
    this.callback?.('123')
  }
})
```

### Avertissements {#caveats}

Si votre version de TypeScript est inférieure à `4.7`, vous devez faire attention lorsque vous utilisez des valeurs de fonction pour les options `validator` et `default` d'une prop - assurez-vous d'utiliser des fonctions fléchées :

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // assurez-vous d'utiliser des fonctions fléchées si votre version de TypeScript est inférieure à 4.7
      default: () => ({
        title: 'Arrow Function Expression'
      }),
      validator: (book: Book) => !!book.title
    }
  }
})
```

Cela évite à TypeScript de devoir déduire le type de `this` à l'intérieur de ces fonctions, ce qui, malheureusement, peut faire échouer l'inférence de type.  C'était une [limitation de conception](https://github.com/microsoft/TypeScript/issues/38845), et elle a été corrigé dans [TypeScript 4.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#improved-function-inference-in-objects-and-methods).

## Typer les émissions d'un composant {#typing-component-emits}

Nous pouvons déclarer le type de charge utile attendue pour un événement émis en utilisant la syntaxe objet de l'option `emits`. De plus, tous les événements émis non déclarés produiront une erreur de type lorsqu'ils seront appelés :

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // performe une validation durant le runtime
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // Erreur de type !
      })

      this.$emit('non-declared-event') // Erreur de type !
    }
  }
})
```

## Typer les propriétés calculées {#typing-computed-properties}

Une propriété calculée déduit son type à partir de sa valeur de retour :

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    greeting() {
      return this.message + '!'
    }
  },
  mounted() {
    this.greeting // type : string
  }
})
```

Dans certains cas, vous pouvez vouloir annoter explicitement le type d'une propriété calculée pour vous assurer que son implémentation est correcte :

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    // annote explicitement le type retourné
    greeting(): string {
      return this.message + '!'
    },

    // annote une propriété calculée accessible en écriture
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

Des annotations explicites peuvent également être nécessaires dans de rares cas où TypeScript ne parvient pas à déduire le type d'une propriété calculée en raison de boucles d'inférence circulaires.

## Typer les gestionnaires d'événements {#typing-event-handlers}

Lorsque vous traitez des événements natifs du DOM, il peut être utile de typer correctement l'argument que vous passez au gestionnaire. Jetons un coup d'œil à cet exemple :

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event) {
      // `event` a implicitement un type `any`
      console.log(event.target.value)
    }
  }
})
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Sans annotation de type, l'argument `event` aura implicitement un type `any`. Cela entraînera également une erreur TS si `"strict" : true` ou `"noImplicitAny" : true` sont utilisés dans `tsconfig.json`. Il est donc recommandé d'annoter explicitement l'argument des gestionnaires d'événements. De plus, vous pouvez avoir besoin de caster explicitement des propriétés sur `event` :

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    }
  }
})
```

## Augmenter les propriétés globales {#augmenting-global-properties}

Certains plugins installent des propriétés disponibles globalement dans toutes les instances de composants via [`app.config.globalProperties`](/api/application.html#app-config-globalproperties). Par exemple, nous pouvons installer `this.$http` pour la récupération des données ou `this.$translate` pour l'internationalisation. Pour que cela fonctionne bien avec TypeScript, Vue expose une interface `ComponentCustomProperties` conçue pour être augmentée via [TypeScript module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) :

```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

Voir aussi :

- [TypeScript unit tests for component type extensions](https://github.com/vuejs/core/blob/main/test-dts/componentTypeExtensions.test-d.tsx)

### Placement des augmentations d'un type {#type-augmentation-placement}

We can put this type augmentation in a `.ts` file, or in a project-wide `*.d.ts` file. Either way, make sure it is included in `tsconfig.json`. For library / plugin authors, this file should be specified in the `types` property in `package.json`.

In order to take advantage of module augmentation, you will need to ensure the augmentation is placed in a [TypeScript module](https://www.typescriptlang.org/docs/handbook/modules.html). That is to say, the file needs to contain at least one top-level `import` or `export`, even if it is just `export {}`. If the augmentation is placed outside of a module, it will overwrite the original types rather than augmenting them!

```ts
// Does not work, overwrites the original types.
declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

```ts
// Works correctly
export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

## Augmenter des options personnalisées {#augmenting-custom-options}

Certains plugins, par exemple `vue-router`, fournissent un support pour les options de composants personnalisées telles que `beforeRouteEnter` :

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // ...
  }
})
```

Sans augmentation de type appropriée, les arguments de ce hook auront implicitement le type `any`. Nous pouvons augmenter l'interface `ComponentCustomOptions` pour supporter ces options personnalisées :

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```

Maintenant l'option `beforeRouteEnter` sera correctement typée. Il est à noter que que c'est juste un exemple - les bibliothèques bien typées comme `vue-router` devraient effectuer automatiquement ces augmentations dans leurs propres définitions de type.

Le placement de cette augmentation est soumis aux [mêmes restrictions](#type-augmentation-placement) que les augmentations de propriétés globales.

Voir aussi :

- [TypeScript unit tests for component type extensions](https://github.com/vuejs/core/blob/main/test-dts/componentTypeExtensions.test-d.tsx)
