# Options: Composition {#options-composition}

## provide {#provide}

Fournit des valeurs qui peuvent être injectées par les composants descendants.

- **Type**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **Détails:**

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

  Notez que dans l'exemple ci-dessus, le `msg` fourni ne sera PAS réactif. Consultez [travailler avec la réactivité](/guide/components/provide-inject.html#working-with-reactivity) pour plus de détails.

- **Voir aussi :** [Provide / Inject](/guide/components/provide-inject.html)

## inject {#inject}

Déclare les propriétés à injecter dans le composant actuel en les localisant à partir des fournisseurs ancêtres.

- **Type**

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
      - La propriété `default` est utilisée comme valeur de secours. Comme pour les valeurs par défaut des props, une fonction d'usine est nécessaire pour les types objets afin d'éviter le partage de valeurs entre plusieurs instances de composants.

  Une propriété injectée sera `undefined` si aucune propriété correspondante ou valeur par défaut n'a été fournie.

  Notez que les liaisons injectées ne sont PAS réactives. Ceci est intentionnel. Cependant, si la valeur injectée est un objet réactif, les propriétés de cet objet restent réactives. Consultez [travailler avec la réactivité](/guide/components/provide-inject.html#working-with-reactivity) pour plus de détails.

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

  Comme pour les valeurs par défaut des props, vous devez utiliser une fonction d'usine pour les valeurs non primitives :

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

- **Voir aussi :** [Provide / Inject](/guide/components/provide-inject.html)

## mixins {#mixins}

An array of option objects to be mixed into the current component.

- **Type**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **Details:**

  The `mixins` option accepts an array of mixin objects. These mixin objects can contain instance options like normal instance objects, and they will be merged against the eventual options using the certain option merging logic. For example, if your mixin contains a `created` hook and the component itself also has one, both functions will be called.

  Mixin hooks are called in the order they are provided, and called before the component's own hooks.

  :::warning No Longer Recommended
  In Vue 2, mixins were the primary mechanism for creating reusable chunks of component logic. While mixins continue to be supported in Vue 3, [Composition API](/guide/reusability/composables.html) is now the preferred approach for code reuse between components.
  :::

- **Example:**

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

A "base class" component to extend from.

- **Type:**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **Details:**

  Allows one component to extend another, inheriting its component options.

  From an implementation perspective, `extends` is almost identical to `mixins`. The component specified by `extends` will be treated as though it were the first mixin.

  However, `extends` and `mixins` express different intents. The `mixins` option is primarily used to compose chunks of functionality, whereas `extends` is primarily concerned with inheritance.

  As with `mixins`, any options will be merged using the relevant merge strategy.

- **Example:**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```
