# TypeScript Support

> [Vue CLI](https://cli.vuejs.org) provides built-in TypeScript tooling support.

## Déclaration officielle dans les paquets NPM

Un système de types statiques peut aider à prévenir de nombreuses erreurs d'exécution potentielles au fur et à mesure que les applications se développent, c'est pourquoi Vue 3 est écrit en TypeScript. Cela signifie que vous n'avez pas besoin d'outils supplémentaires pour utiliser TypeScript avec Vue - il bénéficie d'un support citoyen de première classe.

## Recommended Configuration

```js
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    // this enables stricter inference for data properties on `this`
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "node"
  }
}
```

Notez que vous devez inclure `strict : true` (ou au moins `noImplicitThis : true` qui est une partie du drapeau `strict`) pour tirer parti de la vérification du type de `this` dans les méthodes des composants, sinon il est toujours traité comme un type `any`.

Voir [TypeScript compiler options docs](https://www.typescriptlang.org/docs/handbook/compiler-options.html) pour plus de détails.

## Configuration de Webpack

Si vous utilisez une configuration Webpack personnalisée, `ts-loader` doit être configuré pour analyser les blocs `<script lang="ts">` dans les fichiers `.vue` :

```js{10}
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      }
      ...
```

## Outil de développement

### Création de projets

[Vue CLI](https://github.com/vuejs/vue-cli) peut générer de nouveaux projets qui utilisent TypeScript. Pour commencer :

```bash
# 1. Installez Vue CLI, s'il n'est pas déjà installé.
npm install --global @vue/cli

# 2. Créez un nouveau projet, puis choisissez l'option "Sélectionner manuellement les caractéristiques".
vue create my-project-name

# Si vous avez déjà un projet Vue CLI sans TypeScript, veuillez ajouter un plugin Vue CLI approprié :
vue add typescript
```

Assurez-vous que la partie `script` du composant a TypeScript comme langage :

```html
<script lang="ts">
  ...
</script>
```

### Support de l'éditeur

Pour le développement d'applications Vue avec TypeScript, nous vous recommandons vivement d'utiliser [Visual Studio Code](https://code.visualstudio.com/), qui offre une excellente prise en charge immédiate de TypeScript. Si vous utilisez des [single-file components](./single-file-component.html) (SFCs), procurez-vous l'impressionnante [extension Vetur](https://github.com/vuejs/vetur), qui fournit l'inférence TypeScript dans les SFCs et bien d'autres fonctionnalités.

[WebStorm](https://www.jetbrains.com/webstorm/) fournit également un support prêt à l'emploi pour TypeScript et Vue.

## Définir les composants Vue

Pour permettre à TypeScript de déduire correctement les types dans les options des composants Vue, vous devez définir les composants avec la méthode globale `defineComponent` :

```ts
import { defineComponent } from 'vue'

const Component = defineComponent({
  // inférence de type activée
})
```

### Utilisation avec l'API Options

TypeScript devrait être capable de déduire la plupart des types sans avoir à les définir explicitement. Par exemple, si vous avez un composant avec une propriété numérique `count`, vous aurez une erreur si vous essayez d'appeler une méthode spécifique aux chaînes de caractères sur celui-ci :

```ts
const Component = defineComponent({
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    const result = this.count.split('') // => La propriété 'split' n'existe pas sur le type 'number'.
  }
})
```

Si vous disposez d'un type ou d'une interface complexe, vous pouvez le caster en utilisant [type assertion](https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions) :

```ts
interface Book {
  title: string
  author: string
  year: number
}

const Component = defineComponent({
  data() {
    return {
      book: {
        title: 'Vue 3 Guide',
        author: 'Vue Team',
        year: 2020
      } as Book
    }
  }
})
```

### Annotation des types de retour

En raison de la nature circulaire des fichiers de déclaration de Vue, TypeScript peut avoir des difficultés à déduire les types de propriétés calculées. Pour cette raison, vous pouvez avoir besoin d'annoter le type de retour des propriétés calculées.

```ts
import { defineComponent } from 'vue'

const Component = defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    // a besoin d'une annotation
    greeting(): string {
      return this.message + '!'
    }

    // dans un compute avec un setter, le getter doit être annoté
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase();
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase();
      },
    },
  }
})
```

### Annoter les props

Vue fait une validation à l'exécution sur les props avec un `type` défini. Pour fournir ces types à TypeScript, nous devons caster le constructeur avec `PropType` :

```ts
import { defineComponent, PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

const Component = defineComponent({
  props: {
    name: String,
    success: { type: String },
    callback: {
      type: Function as PropType<() => void>
    },
    book: {
      type: Object as PropType<Book>,
      required: true
    }
  }
})
```

::: warning
En raison d'une [limitation de conception](https://github.com/microsoft/TypeScript/issues/38845) dans TypeScript lorsqu'il s'agit de l'inférence de type des expressions de fonction, vous devez faire attention aux valeurs `validators` et `default` pour les objets et les tableaux :
:::

```ts
import { defineComponent, PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

const Component = defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // Assurez-vous d'utiliser les fonctions de flèche
      default: () => ({
        title: 'Arrow Function Expression'
      }),
      validator: (book: Book) => !!book.title
    },
    bookB: {
      type: Object as PropType<Book>,
      // Ou fournir un paramètre this explicite
      default(this: void) {
        return {
          title: 'Function Expression'
        }
      },
      validator(this: void, book: Book) {
        return !!book.title
      }
    }
  }
})
```

### Annoter les émetteurs

Nous pouvons annoter une charge utile pour l'événement émis. De plus, tous les événements émis non déclarés produiront une erreur de type lorsqu'ils seront appelés :

```ts
const Component = defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // perform runtime validation      // effectuer la validation de l'exécution

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

## Utilisation avec l'API de composition

Dans la fonction `setup()`, vous n'avez pas besoin de passer un type au paramètre `props` car il déduira les types de l'option du composant `props`.

```ts
import { defineComponent } from 'vue'

const Component = defineComponent({
  props: {
    message: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const result = props.message.split('') // correct, 'message' est tapé comme une chaîne de caractères.
    const filtered = props.message.filter(p => p.value) // une erreur sera déclenchée : La propriété 'filter' n'existe pas sur le type 'string'.
  }
})
```

### Typage des `refs'.

Les références déduisent le type à partir de la valeur initiale :

```ts
import { defineComponent, ref } from 'vue'

const Component = defineComponent({
  setup() {
    const year = ref(2020)

    const result = year.value.split('') // => La propriété 'split' n'existe pas sur le type 'number'.
  }
})
```

Parfois, nous pouvons avoir besoin de spécifier des types complexes pour la valeur interne d'un ref. Pour ce faire, il suffit de passer un argument générique lors de l'appel de ref pour remplacer l'inférence par défaut :

```ts
const year = ref<string | number>('2020') // le type de l'année: Ref<string | number>

year.value = 2020 // ok!
```

::: tip Note
Si le type du générique est inconnu, il est recommandé de convertir `ref` en `Ref<T>`.
:::

### Typing `reactive` (typage)

Lorsque l'on tape une propriété `reactive`, on peut utiliser des interfaces :

```ts
import { defineComponent, reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  name: 'HelloWorld',
  setup() {
    const book = reactive<Book>({ title: 'Vue 3 Guide' })
    // or
    const book: Book = reactive({ title: 'Vue 3 Guide' })
    // or
    const book = reactive({ title: 'Vue 3 Guide' }) as Book
  }
})
```

### Typage de `computed`.

Les valeurs calculées déduiront automatiquement le type de la valeur retournée.

```ts
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'CounterButton',
  setup() {
    let count = ref(0)

    // en lecture seule
    const doubleCount = computed(() => count.value * 2)

    const result = doubleCount.value.split('') // => La propriété 'split' n'existe pas sur le type 'number'.
  }
})
```
