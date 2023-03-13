# L'instance de composant {#component-instance}

:::info
Cette page présente les propriétés et méthodes natives exposées par l'instance de composant publique, autrement dit `this`.

Toutes les propriétés sur cette page sont en lecture seule (excepté les propriétés imbriquées dans `data`).
:::

## $data {#data}

L'objet retourné par l'option [`data`](./options-state#data), rendu réactif par le composant. L'instance de composant donne accès aux propriétés de son objet `data` via un proxy.

- **Type :**

  ```ts
  interface ComponentPublicInstance {
    $data: object
  }
  ```

## $props {#props}

// TODO: améliorer
Un objet représentant les `props` courantes et résolues du composant.

- **Type :**

  ```ts
  interface ComponentPublicInstance {
    $props: object
  }
  ```

- **Details**

  Seules les props déclarées via l'option [`props`](./options-state#props) seront incluses. L'instance du composant donne accès aux propriétés de son objet props via un proxy. 

## $el {#el}

Le nœud du DOM racine que l'instance du composant gère.

- **Type :**

  ```ts
  interface ComponentPublicInstance {
    $el: Node | undefined
  }
  ```

- **Details**

  `$el` sera `undefined` jusqu'à ce que le composant soit [monté](./options-lifecycle#mounted).

  - Pour les composants avec un unique élément racine, `$el` pointera sur cet élément.
  - Pour les composants avec un élément racine `Text`, `$el` pointera sur ce nœud `Text`.
  - Pour les composants avec des nœuds racines multiples, `$el` sera un nœud du DOM fictif que Vue utilise pour suivre la position du composant dans le DOM (un nœud `Text`, ou un nœud `Comment` en mode hydratation SSR).
  // TODO : voir comment traduire `in SSR hydratation mode`

  :::tip
  Par cohérence, il est recommandé d'utiliser [les refs du template](/guide/essentials/template-refs) pour accéder directement aux éléments du DOM plutôt que `$el`.
  :::

## $options {#options}

// TODO : voir comment traduire `resolved`, j'ai utilisé `résolu`
Les options du composant résolues utilisées pour instancier l'instance courante du composant.

- **Type :**

  ```ts
  interface ComponentPublicInstance {
    $options: ComponentOptions
  }
  ```

- **Details**

  // TODO: traduire `merge` ?
  L'objet `$options` expose les options résolues pour l'instance courante du composant et est le résultat du merge de trois sources possibles :

  - Mixins globaux
  - La base `extends` du composant
  - Mixins du composant

  C'est typiquement utilisé pour supporter l'ajout d'options personnalisées au composant :

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

- **Voir aussi :** [`app.config.optionMergeStrategies`](/api/application#app-config-optionmergestrategies)

## $parent {#parent}

L'instance du composant parent, si l'instance courante en a une. Cette propriété vaudra `null` dans le cas du composant racine.

- **Type :**

  ```ts
  interface ComponentPublicInstance {
    $parent: ComponentPublicInstance | null
  }
  ```

## $root {#root}

L'instance du composant à la racine de l'arbre de composants courant. Si l'instance de composant courante n'a pas de composants parents, cette propriété vaudra l'instance du composant elle-même.

- **Type :**

  ```ts
  interface ComponentPublicInstance {
    $root: ComponentPublicInstance
  }
  ```

## $slots {#slots}

Un objet représentant les [slots](/guide/components/slots) passés par le composant parent.

- **Type :**

  ```ts
  interface ComponentPublicInstance {
    $slots: { [name: string]: Slot }
  }

  type Slot = (...args: any[]) => VNode[]
  ```

- **Details**

  Cette option est typiquement utilisée quand on créé manuellement des [render functions](/guide/extras/render-function), mais elle peut aussi être utilisée pour détecter si un slot est présent.

  Chaque slot est exposé par `this.$slots` comme une fonction qui retourne un tableau de `vnode` sous la clé correspondant au nom de ce slot. Le slot par défaut est exposé comme `this.$slots.default`.

  Si un slot est un [scoped slot](/guide/components/slots#scoped-slots), les arguments passés à la fonction de slot sont rendus disponibles au slot en tant que props du slot.

- **Voir aussi :** [Fonctions de rendu - Rendu des slots](/guide/extras/render-function#rendering-slots)

## $refs {#refs}

Un objet constitué d'éléments du DOM et d'instances de composants, enregistré via les [template refs](/guide/essentials/template-refs).

- **Type :**

  ```ts
  interface ComponentPublicInstance {
    $refs: { [name: string]: Element | ComponentPublicInstance | null }
  }
  ```

- **Voir aussi :**

  - [Les refs du template](/guide/essentials/template-refs)
  - [Attributs spéciaux - ref](./built-in-special-attributes.md#ref)

## $attrs {#attrs}

Un objet qui contient les attributs implicitement déclarés (fallthrough attributes) du composant.

- **Type :**

  ```ts
  interface ComponentPublicInstance {
    $attrs: object
  }
  ```

- **Details**

  [Attributs implicitement déclarés](/guide/components/attrs) sont des attributs ou écouteurs d'événement `v-on` passés par le composant parent mais non déclarés comme prop ou émission par le composant enfant.

  Par défaut, si le composant a un unique nœud racine, tout ce qui se trouve dans `$attrs` sera automatiquement passé à ce nœud racine. Ce comportement est désactivé si le composant a des nœuds racines multiples, et peut être explicitement désactivé avec l'option [`inheritAttrs`](./options-misc.#inheritattrs).

- **Voir aussi :**

  - [Attributs implicitement déclarés](/guide/components/attrs)

## $watch() {#watch}

API impérative pour créer des observateurs (watchers).

- **Type :**

  ```ts
  interface ComponentPublicInstance {
    $watch(
      source: string | (() => any),
      callback: WatchCallback,
      options?: WatchOptions
    ): StopHandle
  }

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  interface WatchOptions {
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **Details**

  Le premier argument est la source observée. Cela peut être une string correspondant au nom d'une propriété du composant, ou une fonction accesseur.

  Le second argument est la fonction de rappel. La fonction de rappel reçoit en paramètres la nouvelle et l'ancienne valeur de la source observée.

  - **`immediate`**: déclenche la fonction de rappel immédiatement à la création de l'observateur. L'ancienne valeur vaudra `undefined` lors du premier appel.
  - **`deep`**: force la traversée profonde de la source si c'est un objet, de sorte que la fonction de rappel se déclenche sur les mutations profondes. Voir [les observateurs profonds](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: ajuste le timing de nettoyage de la fonction de rappel. Voir [timing du nettoyage des rappels](/guide/essentials/watchers#callback-flush-timing) et [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: débogue les dépendances de l'observateur. Voir [Débogage des observateur](/guide/extras/reactivity-in-depth#watcher-debugging).

- **Example**

  Observer via le nom d'une propriété :

  ```js
  this.$watch('a', (newVal, oldVal) => {})
  ```

  Observer via un path (délimité par des points) :

  ```js
  this.$watch('a.b', (newVal, oldVal) => {})
  ```

  Utiliser un accesseur pour des expressions plus complexes :

  ```js
  this.$watch(
    // every time the expression `this.a + this.b` yields
    // a different result, the handler will be called.
    // It's as if we were watching a computed property
    // without defining the computed property itself.
    () => this.a + this.b,
    (newVal, oldVal) => {}
  )
  ```

  Arrêter l'observateur :

  ```js
  const unwatch = this.$watch('a', cb)

  // later...
  unwatch()
  ```

- **Voir aussi :**
  - [Options - `watch`](/api/options-state#watch)
  - [Guide - Observateurs](/guide/essentials/watchers)

## $emit() {#emit}

Emmet un événement personnalisé depuis l'instance courante. Tout argument additionnel sera passé à la fonction de rappel.

- **Type :**

  ```ts
  interface ComponentPublicInstance {
    $emit(event: string, ...args: any[]): void
  }
  ```

- **Example**

  ```js
  export default {
    created() {
      // only event
      this.$emit('foo')
      // with additional arguments
      this.$emit('bar', 1, 2, 3)
    }
  }
  ```

- **Voir aussi :**

  - [Composant - Gestion des événements](/guide/components/events)
  - [L'option `emits`](./options-state#emits)

## $forceUpdate() {#forceupdate}

Force l'instance du composant à effectuer un nouveau rendu.

- **Type :**

  ```ts
  interface ComponentPublicInstance {
    $forceUpdate(): void
  }
  ```

- **Details**

  Ceci devrait être rarement nécessaire grâce au système de réactivité entièrement automatique de Vue. Le seul cas où vous devriez en avoir besoin est celui où vous auriez créé un composant à l'état explicitement non-réactif en utilisant des APIs de réactivité avancées.

## $nextTick() {#nexttick}

Version propre à l'instance de l'utilité globale [`nextTick()`](./general#nexttick).

- **Type :**

  ```ts
  interface ComponentPublicInstance {
    $nextTick(callback?: (this: ComponentPublicInstance) => void): Promise<void>
  }
  ```

- **Details**

  La seule différence avec la version globale de `nextTick()` est que la fonction de rendu passée à `this.$nextTick()` aura son contexte `this` lié à l'instance courante du composant.

- **Voir aussi :** [`nextTick()`](./general#nexttick)
