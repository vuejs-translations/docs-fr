# Options : État {#options-state}

## data {#data}

Une fonction qui retourne l'état réactif initial de l'instance du composant.

- **Type :**

  ```ts
  interface ComponentOptions {
    data?(
      this: ComponentPublicInstance,
      vm: ComponentPublicInstance
    ): object
  }
  ```

- **Détails**

  La fonction doit retourner un objet JavaScript simple, qui sera rendu réactif par Vue. Après la création de l'instance, l'objet de données réactif est accessible via `this.$data`. L'instance du composant proxifie également toutes les propriétés de l'objet de données, ainsi `this.a` sera équivalent à `this.$data.a`.

  Toutes les propriétés de données de niveau supérieur doivent être incluses dans l'objet de données retourné. Il est possible d'ajouter de nouvelles propriétés à `this.$data`, mais ce n'est **pas** recommandé. Si la valeur souhaitée d'une propriété n'est pas encore disponible, une valeur vide telle que `undefined` ou `null` doit être incluse en tant que placeholder pour s'assurer que Vue sait que la propriété existe.

  Les propriétés commençant par `_` ou `$` ne seront **pas** proxifiées sur l'instance du composant car elles peuvent entrer en conflit avec les propriétés internes de Vue et les méthodes d'API. Vous devrez y accéder via `this.$data._property`.

  Il n'est **pas** recommandé de retourner des objets ayant leur propre comportement d'état comme les objets de l'API du navigateur et les propriétés prototypes. L'objet retourné doit idéalement être un objet simple représentant seulement l'état du composant.

- **Exemple**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    created() {
      console.log(this.a) // 1
      console.log(this.$data) // { a: 1 }
    }
  }
  ```

  Notez que si vous utilisez une fonction fléchée avec la propriété `data`, `this` ne représentera pas l'instance du composant, mais vous pouvez toujours y accéder via le premier argument de la fonction :

  ```js
  data: (vm) => ({ a: vm.myProp })
  ```

- **Voir aussi** [La réactivité en détails](/guide/extras/reactivity-in-depth)

## props {#props}

Déclare les props d'un composant.

- **Type :**

  ```ts
  interface ComponentOptions {
    props?: ArrayPropsOptions | ObjectPropsOptions
  }

  type ArrayPropsOptions = string[]

  type ObjectPropsOptions = { [key: string]: Prop }

  type Prop<T = any> = PropOptions<T> | PropType<T> | null

  interface PropOptions<T> {
    type?: PropType<T>
    required?: boolean
    default?: T | ((rawProps: object) => T)
    validator?: (value: unknown, rawProps: object) => boolean
  }

  type PropType<T> = { new (): T } | { new (): T }[]
  ```

  > Les types sont simplifiés dans un souci de lisibilité.

- **Détails**

  Dans Vue, toutes les props d'un composant doivent être déclarées de manière explicite. Les props peuvent être déclarées de deux manières :

  - Forme simple utilisant un tableau de chaînes de caractères
  - Forme complète utilisant un objet où chaque clé d'une propriété représente le nom de la prop, et la valeur représente son type (une fonction constructeur) ou des options avancées.

  Avec la syntaxe basée sur les objets, chaque prop peut ensuite définir les options suivantes :

  - **`type`** : Peut être l'un des constructeurs natifs suivants : `String`, `Number`, `Boolean`, `Array`, `Object`, `Date`, `Function`, `Symbol`, toute fonction constructeur personnalisée ou un tableau de ces dernières. En mode développement, Vue vérifiera si la valeur d'une prop correspond au type déclaré, et enverra un avertissement si ce n'est pas le cas. Voir la [validation de prop](/guide/components/props#prop-validation) pour plus de détails.

    Notez également qu'une prop de type `Boolean` modifie le comportement de la conversion de sa valeur, tant en mode développement qu'en production. Voir la [conversion en booléen](/guide/components/props#boolean-casting) pour plus de détails.

  - **`default`** : Spécifie une valeur par défaut pour la prop quand elle n'est pas passée par le parent ou a une valeur valant `undefined`. Les valeurs par défaut des objets ou des tableaux doivent être retournées en utilisant une fonction _factory_. La fonction _factory_ reçoit également l'objet props brut comme argument.

  - **`required`** : Définit si la prop est requise. Dans tout autre environnement que celui de production, un message d'avertissement sera affiché dans la console si cette valeur est vraie et que la prop n'est pas passée.

  - **`validator`** : Fonction de validation personnalisée qui prend la valeur de la prop et l'object props comme arguments. En mode développement, un message d'avertissement sera envoyé à la console si cette fonction renvoie une valeur fausse (c'est-à-dire si la validation échoue).

- **Exemple**

  Simple déclaration :

  ```js
  export default {
    props: ['size', 'myMessage']
  }
  ```

  Déclaration d'un objet avec des validations :

  ```js
  export default {
    props: {
      // vérification de type
      height: Number,
      // vérification de type plus d'autres validations
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
          return value >= 0
        }
      }
    }
  }
  ```

- **Voir aussi**
  - [Guide - Props](/guide/components/props)
  - [Guide - Typer les props des composants](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

## computed {#computed}

Déclare les propriétés calculées à exposer à l'instance du composant.

- **Type :**

  ```ts
  interface ComponentOptions {
    computed?: {
      [key: string]: ComputedGetter<any> | WritableComputedOptions<any>
    }
  }

  type ComputedGetter<T> = (
    this: ComponentPublicInstance,
    vm: ComponentPublicInstance
  ) => T

  type ComputedSetter<T> = (
    this: ComponentPublicInstance,
    value: T
  ) => void

  type WritableComputedOptions<T> = {
    get: ComputedGetter<T>
    set: ComputedSetter<T>
  }
  ```

- **Détails**

  L'option accepte un objet où la clé est le nom de la propriété calculée, et la valeur est soit un accesseur calculé, soit un objet avec des méthodes `get` et `set` (pour les propriétés calculées modifiables).

  Tous les accesseurs et les mutateurs ont leur contexte `this` automatiquement lié à l'instance du composant.

  Notez que si vous utilisez une fonction fléchée avec une propriété calculée, `this` ne pointera pas vers l'instance du composant, mais vous pourrez toujours accéder à l'instance comme premier argument de la fonction :

  ```js
  export default {
    computed: {
      aDouble: (vm) => vm.a * 2
    }
  }
  ```

- **Exemple**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    computed: {
      // lecture seulement
      aDouble() {
        return this.a * 2
      },
      // modifiable
      aPlus: {
        get() {
          return this.a + 1
        },
        set(v) {
          this.a = v - 1
        }
      }
    },
    created() {
      console.log(this.aDouble) // => 2
      console.log(this.aPlus) // => 2

      this.aPlus = 3
      console.log(this.a) // => 2
      console.log(this.aDouble) // => 4
    }
  }
  ```

- **Voir aussi**
  - [Guide - Propriétés calculées](/guide/essentials/computed)
  - [Guide - Typer les propriétés calculées](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

## methods {#methods}

Déclarer les méthodes à rendre accessibles dans l'instance du composant.

- **Type :**

  ```ts
  interface ComponentOptions {
    methods?: {
      [key: string]: (this: ComponentPublicInstance, ...args: any[]) => any
    }
  }
  ```

- **Détails**

  Les méthodes déclarées peuvent être accédées directement sur l'instance du composant, ou utilisées dans des expressions de template. Toutes les méthodes ont leur contexte `this` automatiquement lié à l'instance du composant, même lorsqu'elles sont passées d'un composant à l'autre.

  Évitez d'utiliser les fonctions fléchées lorsque vous déclarez des méthodes, car elles n'auront pas accès à l'instance du composant via `this`.

- **Exemple**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    methods: {
      plus() {
        this.a++
      }
    },
    created() {
      this.plus()
      console.log(this.a) // => 2
    }
  }
  ```

- **Voir aussi** [Gestion d'événement](/guide/essentials/event-handling)

## watch {#watch}

Déclare les fonctions d'observation à invoquer lors d'un changement de données.

- **Type :**

  ```ts
  interface ComponentOptions {
    watch?: {
      [key: string]: WatchOptionItem | WatchOptionItem[]
    }
  }

  type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type ObjectWatchOptionItem = {
    handler: WatchCallback | string
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }
  ```

  > Les types sont simplifiés dans un souci de lisibilité.

- **Détails**

  L'option `watch` attend un objet où les clés sont les propriétés de l'instance du composant réactif à surveiller (par exemple les propriétés déclarées via `data` ou `computed`) - et les valeurs sont les fonctions de rappel correspondantes. La fonction de rappel reçoit à la fois la nouvelle valeur et l'ancienne valeur de la source surveillée.

  La clé peut être une propriété racine, mais également un simple chemin délimité par des points, par exemple `a.b.c`. Notez que cette utilisation ne prend **pas** en charge les expressions complexes - seuls les chemins délimités par des points sont acceptés. Si vous devez surveiller des sources de données complexes, utilisez plutôt l'API impérative [`$watch()`](/api/component-instance#watch).

  La valeur peut également être une chaîne de caractères d'un nom de méthode (déclarée via `methods`), ou un objet qui contient des options supplémentaires. Lorsque vous utilisez la syntaxe objet, la fonction de rappel doit être déclarée via le champ `handler`. Les options supplémentaires incluent :

  - **`immediate`** : déclenche la fonction de rappel immédiatement à la création de l'observateur. L'ancienne valeur vaudra `undefined` lors du premier appel.
  - **`deep`** : force la traversée profonde de la source si c'est un objet ou un tableau, de sorte que la fonction de rappel se déclenche lors des mutations profondes. Voir [les observateurs profonds](/guide/essentials/watchers#deep-watchers).
  - **`flush`** : ajuste le timing du nettoyage de la fonction de rappel. Voir [Timing de nettoyage des fonctions de rappel](/guide/essentials/watchers#callback-flush-timing) et [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`** : débogue les dépendances de l'observateur. Voir [Débogage des observateur](/guide/extras/reactivity-in-depth#watcher-debugging).

  Évitez d'utiliser les fonctions fléchées lorsque vous déclarez des fonctions de rappel d'un observateur car elles n'auront pas accès à l'instance du composant via `this`.

- **Exemple**

  ```js
  export default {
    data() {
      return {
        a: 1,
        b: 2,
        c: {
          d: 4
        },
        e: 5,
        f: 6
      }
    },
    watch: {
      // observation des propriétés de haut niveau
      a(val, oldVal) {
        console.log(`new: ${val}, old: ${oldVal}`)
      },
      // chaînes de caractères représentant le nom d'une méthode
      b: 'someMethod',
      // la fonction de rappel sera appelée chaque fois que l'une des propriétés de l'objet surveillé changera, quelle que soit la profondeur de l'imbrication
      c: {
        handler(val, oldVal) {
          console.log('c changed')
        },
        deep: true
      },
      // observation d'une seule propriété imbriquée :
      'c.d': function (val, oldVal) {
        // faire quelque chose
      },
      // la fonction de rappel sera appelée immédiatement après le début de l'observation
      e: {
        handler(val, oldVal) {
          console.log('e changed')
        },
        immediate: true
      },
      // vous pouvez passer un tableau de fonctions de rappel, elles seront appelées une par une
      f: [
        'handle1',
        function handle2(val, oldVal) {
          console.log('handle2 triggered')
        },
        {
          handler: function handle3(val, oldVal) {
            console.log('handle3 triggered')
          }
          /* ... */
        }
      ]
    },
    methods: {
      someMethod() {
        console.log('b changed')
      },
      handle1() {
        console.log('handle 1 triggered')
      }
    },
    created() {
      this.a = 3 // => nouvelle valeur : 3, ancienne valeur : 1
    }
  }
  ```

- **Voir aussi** [Observateurs](/guide/essentials/watchers)

## emits {#emits}

Déclare les événements personnalisés émis par le composant.

- **Type :**

  ```ts
  interface ComponentOptions {
    emits?: ArrayEmitsOptions | ObjectEmitsOptions
  }

  type ArrayEmitsOptions = string[]

  type ObjectEmitsOptions = { [key: string]: EmitValidator | null }

  type EmitValidator = (...args: unknown[]) => boolean
  ```

- **Détails**

  Les événements émis peuvent être déclarés de deux manières :

  - Forme simple utilisant un tableau de chaînes de caractères
  - Forme complète utilisant un objet où chaque clé de propriété représente le nom de l'événement, et la valeur est soit `null` soit une fonction de validation.

  La fonction de validation recevra les arguments additionnels passés à l'appel `$emit` du composant. Par exemple, si `this.$emit('foo', 1)` est appelé, le validateur correspondant à `foo` recevra l'argument `1`. La fonction de validation doit retourner un booléen pour indiquer si les arguments de l'événement sont valides.

  Notez que l'option `emits` affecte les écouteurs d'événements considérés comme appartenant au composant, plutôt que des écouteurs d'événements natifs du DOM. Les écouteurs d'événements déclarés seront supprimés de l'objet `$attrs` du composant, et ne seront donc pas transmis à son élément racine. Voir [Attributs implicitement déclarés](/guide/components/attrs) pour plus de détails.

- **Exemple**

  Syntaxe avec un tableau :

  ```js
  export default {
    emits: ['check'],
    created() {
      this.$emit('check')
    }
  }
  ```

  Syntaxe objet :

  ```js
  export default {
    emits: {
      // sans validation
      click: null,

      // avec validation
      submit: (payload) => {
        if (payload.email && payload.password) {
          return true
        } else {
          console.warn(`Invalid submit event payload!`)
          return false
        }
      }
    }
  }
  ```

- **Voir aussi**
  - [Guide - Attributs implicitement déclarés](/guide/components/attrs)
  - [Guide - Typer les événements émis par un composant](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

## expose {#expose}

Déclare les propriétés publiques exposées lorsque l'instance du composant est accédée par un parent via des refs de template.

- **Type :**

  ```ts
  interface ComponentOptions {
    expose?: string[]
  }
  ```

- **Détails**

  Par défaut, une instance de composant expose toutes les propriétés de l'instance au parent lorsqu'on y accède via `$parent`, `$root`, ou les refs de template. Cela peut être indésirable, car un composant a très probablement un état interne ou des méthodes qui doivent rester privées pour éviter des conflits.

  L'option `expose` attend une liste de chaînes de caractères représentant des noms de propriétés. Lorsque `expose` est utilisée, seules les propriétés explicitement listées seront exposées sur l'instance publique du composant.

  `expose` n'affecte que les propriétés définies par l'utilisateur - elle ne filtre pas les propriétés natives de l'instance du composant.

- **Exemple**

  ```js
  export default {
    // seule `publicMethod` sera disponible sur l'instance publique.
    expose: ['publicMethod'],
    methods: {
      publicMethod() {
        // ...
      },
      privateMethod() {
        // ...
      }
    }
  }
  ```
