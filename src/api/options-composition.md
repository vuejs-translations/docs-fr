# Options : Composition {#options-composition}

## provide {#provide}

Fournit des valeurs qui peuvent être injectées par les composants descendants.

- **Type :**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **Détails**

  `provide` et [`inject`](#inject) sont utilisées ensemble pour permettre à un composant ancêtre de servir d'injecteur de dépendances pour tous ses descendants, peu importe la profondeur de la hiérarchie des composants, tant qu'ils sont de la même lignée.

  L'option `provide` doit être soit un objet, soit une fonction qui renvoie un objet. Cet objet contient les propriétés qui sont disponibles pour l'injection dans ses descendants. Vous pouvez utiliser des symboles comme clés dans cet objet.

- **Exemple**

  Utilisation basique :

  ```js
  const s = Symbol()

  export default {
    provide: {
      foo: 'foo',
      [s]: 'bar'
    }
  }
  ```

  Utilisation d'une fonction pour fournir un état par composant :

  ```js
  export default {
    data() {
      return {
        msg: 'foo'
      }
    }
    provide() {
      return {
        msg: this.msg
      }
    }
  }
  ```

  Notez que dans l'exemple ci-dessus, le `msg` fourni ne sera PAS réactif. Consultez [travailler avec la réactivité](/guide/components/provide-inject#working-with-reactivity) pour plus de détails.

- **Voir aussi** [Provide / Inject](/guide/components/provide-inject)

## inject {#inject}

Déclare les propriétés à injecter dans le composant actuel en les localisant à partir des fournisseurs ancêtres.

- **Type :**

  ```ts
  interface ComponentOptions {
    inject?: ArrayInjectOptions | ObjectInjectOptions
  }

  type ArrayInjectOptions = string[]

  type ObjectInjectOptions = {
    [key: string | symbol]:
      | string
      | symbol
      | { from?: string | symbol; default?: any }
  }
  ```

- **Détails**

  L'option `inject` doit être soit :

  - Un tableau de chaînes de caractères, ou
  - Un objet où les clés sont le nom de la liaison locale et la valeur est soit :
    - La clé (chaîne de caractères ou symbole) à rechercher dans les injections disponibles, ou bien
    - Un objet où :
      - La propriété `from` est la clé (chaîne de caractères ou symbole) à rechercher dans les injections disponibles, et
      - La propriété `default` est utilisée comme valeur de secours. Comme pour les valeurs par défaut des props, une fonction _factory_ est nécessaire pour les types objets afin d'éviter le partage de valeurs entre plusieurs instances de composants.

  Une propriété injectée sera `undefined` si aucune propriété correspondante ou valeur par défaut n'a été fournie.

  Notez que les liaisons injectées ne sont PAS réactives. Ceci est intentionnel. Cependant, si la valeur injectée est un objet réactif, les propriétés de cet objet restent réactives. Consultez [travailler avec la réactivité](/guide/components/provide-inject#working-with-reactivity) pour plus de détails.

- **Exemple**

  Utilisation basique :

  ```js
  export default {
    inject: ['foo'],
    created() {
      console.log(this.foo)
    }
  }
  ```

  En utilisant une valeur injectée comme valeur par défaut pour une prop :

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  En utilisant une valeur injectée comme entrée de données :

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  Les injections peuvent être optionnelles avec une valeur par défaut :

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  Si l'injection doit se faire à partir d'une propriété portant un nom différent, utilisez `from` pour désigner la propriété source :

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  Comme pour les valeurs par défaut des props, vous devez utiliser une fonction _factory_ pour les valeurs non primitives :

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

- **Voir aussi** [Provide / Inject](/guide/components/provide-inject)

## mixins {#mixins}

Un tableau d'objets d'options à introduire dans le composant actuel.

- **Type :**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **Détails**

  L'option `mixins` accepte un tableau d'objets mixins. Ces objets mixins peuvent contenir des options d'instance comme des objets d'instance normaux, et ils seront fusionnés avec les options éventuelles en utilisant la logique de fusion des options. Par exemple, si votre mixin contient un hook `created` et que le composant lui-même en possède un, les deux fonctions seront appelées.

  Les hooks des mixins sont appelés dans l'ordre où ils sont fournis, et sont appelés avant les propres hooks du composant.

  :::warning N'est plus recommandé
  Avec Vue 2, les mixins étaient le principal mécanisme pour créer des morceaux réutilisables des logiques de composants. Bien que les mixins continuent d'être pris en charge avec Vue 3, la [Composition API](/guide/reusability/composables) est désormais l'approche privilégiée pour la réutilisation du code entre les composants.
  :::

- **Exemple**

  ```js
  const mixin = {
    created() {
      console.log(1)
    }
  }

  createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

## extends {#extends}

Un composant de la "classe de base" à partir duquel on peut étendre un composant.

- **Type :**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **Détails**

  Permet à un composant d'en étendre un autre, en héritant de ses options de composant.

  Du point de vue de l'implémentation, `extends` est presque identique à `mixins`. Le composant spécifié par `extends` sera traité comme s'il était le premier mixin.

  Cependant, `extends` et `mixins` expriment des intentions différentes. L'option `mixins` est principalement utilisée pour composer des morceaux de fonctionnalité, alors que `extends` est principalement concerné par l'héritage.

  Comme avec `mixins`, toutes les options (excepté pour `setup()`) seront fusionnées en utilisant la stratégie de fusion appropriée.

- **Exemple**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```

  :::warning Non recommandé pour la Composition API
  `extends` est conçu pour l'Options API et ne gère pas la fusion du hook `setup()`.

  Avec la Composition API, le modèle mental préféré pour la réutilisation logique est la « composition » plutôt que « l'héritage ». Si vous avez besoin de réutiliser la logique d'un composant dans un autre, envisagez d'extraire ce qui est pertinent dans un [Composable](/guide/reusability/composables#composables).

  Si vous avez toujours l'intention d'« étendre » un composant à l'aide de la Composition API, vous pouvez appeler le `setup()` du composant de base dans le `setup()` du composant d'extension :

  ```js
  import Base from './Base.js'
  export default {
    extends: Base,
    setup(props, ctx) {
      return {
        ...Base.setup(props, ctx),
        // liaisons locales
      }
    }
  }
  ```
  :::
