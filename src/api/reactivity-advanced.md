# API de la réactivité : Avancé {#reactivity-api-advanced}

## shallowRef() {#shallowref}

Version partiallement réactive de [`ref()`](./reactivity-core.html#ref).

- **Type**

  ```ts
  function shallowRef<T>(value: T): ShallowRef<T>

  interface ShallowRef<T> {
    value: T
  }
  ```

- **Détails :**

  Contrairement à `ref()`, la valeur interne d'une référence partiallement réactive est stockée et exposée telle quelle, et ne sera pas rendue profondément réactive. Seul l'accès `.value` est réactif.

  `shallowRef()` est généralement utilisé pour l'optimisation des performances de grandes structures de données ou l'intégration avec des systèmes de gestion d'état externes.

- **Exemple :**

  ```js
  const state = shallowRef({ count: 1 })

  // ne déclenche PAS de changement
  state.value.count = 2

  // déclenche un changement
  state.value = { count: 2 }
  ```

- **Voir aussi :**
  - [Guide - Reduce Reactivity Overhead for Large Immutable Structures](/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures)
  - [Guide - Intégration avec des systèmes externes de gestion d'état](/guide/extras/reactivity-in-depth.html#integration-with-external-state-systems)

## triggerRef() {#triggerref}

Force le déclenchement d'effets qui dépendent d'une [ref supperficielle](#shallowref). Ceci est généralement utilisé après avoir effectué des mutations profondes sur la valeur interne d'une référence partiallement réactive.

- **Type :**

  ```ts
  function triggerRef(ref: ShallowRef): void
  ```

- **Exemple :**

  ```js
  const shallow = shallowRef({
    greet: 'Hello, world'
  })

  // Logue "Hello, world" une fois pour la première exécution
  watchEffect(() => {
    console.log(shallow.value.greet)
  })

  // Cela ne déclenchera pas l'effet car la référence est partiallement réactive
  shallow.value.greet = 'Hello, universe'

  // Logue "Hello, universe"
  triggerRef(shallow)
  ```

## customRef() {#customref}

Crée une référence personnalisée avec un contrôle explicite sur son suivi des dépendances et le déclenchement des mises à jour.

- **Type :**

  ```ts
  function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

  type CustomRefFactory<T> = (
    track: () => void,
    trigger: () => void
  ) => {
    get: () => T
    set: (value: T) => void
  }
  ```

- **Détails :**

  `customRef()` attend une fonction _factory_, qui reçoit les fonctions `track` et `trigger` comme arguments et doit renvoyer un objet avec les méthodes `get` et `set`.

  En général, `track()` doit être appelé à l'intérieur de `get()`, et `trigger()` doit être appelé à l'intérieur de `set()`. Cependant, vous avez un contrôle total sur le moment où ils doivent être appelés.

- **Exemple :**

  Création d'une référence _debounced_ qui ne met à jour la valeur qu'après un certain délai après le dernier appel défini :

  ```js
  import { customRef } from 'vue'
  
  export function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }
  ```

  Utilisation dans un composant :

  ```vue
  <script setup>
  import { useDebouncedRef } from './debouncedRef'
  const text = useDebouncedRef('hello')
  </script>

  <template>
    <input v-model="text" />
  </template>
  ```

  [Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHVzZURlYm91bmNlZFJlZiB9IGZyb20gJy4vZGVib3VuY2VkUmVmLmpzJ1xuY29uc3QgdGV4dCA9IHVzZURlYm91bmNlZFJlZignaGVsbG8nLCAxMDAwKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPHA+XG4gICAgVGhpcyB0ZXh0IG9ubHkgdXBkYXRlcyAxIHNlY29uZCBhZnRlciB5b3UndmUgc3RvcHBlZCB0eXBpbmc6XG4gIDwvcD5cbiAgPHA+e3sgdGV4dCB9fTwvcD5cbiAgPGlucHV0IHYtbW9kZWw9XCJ0ZXh0XCIgLz5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsImRlYm91bmNlZFJlZi5qcyI6ImltcG9ydCB7IGN1c3RvbVJlZiB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZURlYm91bmNlZFJlZih2YWx1ZSwgZGVsYXkgPSAyMDApIHtcbiAgbGV0IHRpbWVvdXRcbiAgcmV0dXJuIGN1c3RvbVJlZigodHJhY2ssIHRyaWdnZXIpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0KCkge1xuICAgICAgICB0cmFjaygpXG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgfSxcbiAgICAgIHNldChuZXdWYWx1ZSkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHZhbHVlID0gbmV3VmFsdWVcbiAgICAgICAgICB0cmlnZ2VyKClcbiAgICAgICAgfSwgZGVsYXkpXG4gICAgICB9XG4gICAgfVxuICB9KVxufSJ9)

## shallowReactive() {#shallowreactive}

Version partiallement réactive de [`reactive()`](./reactivity-core.html#reactive).

- **Type :**

  ```ts
  function shallowReactive<T extends object>(target: T): T
  ```

- **Détails :**

  Contrairement à `reactive()`, il n'y a pas de conversion profonde : seules les propriétés de niveau racine sont réactives pour un objet réactif superficiel. Les valeurs de propriété sont stockées et exposées telles quelles - cela signifie également que les propriétés avec des valeurs de référence ne seront **pas** automatiquement déballées.

  :::warning À utiliser avec précaution
  Les structures de données partiallement réactives ne doivent être utilisées que pour l'état de niveau racine dans un composant. Évitez de l'imbriquer dans un objet réactif profond car cela crée un arbre avec un comportement de réactivité incohérent qui peut être difficile à comprendre et à déboguer.
  :::

- **Exemple :**

  ```js
  const state = shallowReactive({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // muter les propriétés propres de l'état est réactif
  state.foo++

  // ...mais ne convertit pas les objets imbriqués
  isReactive(state.nested) // false

  // PAS réactif
  state.nested.bar++
  ```

## shallowReadonly() {#shallowreadonly}

Version partiallement réactive de [`readonly()`](./reactivity-core.html#readonly).

- **Type :**

  ```ts
  function shallowReadonly<T extends object>(target: T): Readonly<T>
  ```

- **Détails :**

  Contrairement à `readonly()`, il n'y a pas de conversion profonde : seules les propriétés de niveau racine sont en lecture seule. Les valeurs de propriété sont stockées et exposées telles quelles - cela signifie également que les propriétés avec des valeurs de référence ne seront **pas** automatiquement déballées.

  :::warning À utiliser avec précaution
  Les structures de données partiallement réactives ne doivent être utilisées que pour l'état de niveau racine dans un composant. Évitez de l'imbriquer dans un objet réactif profond car cela crée un arbre avec un comportement de réactivité incohérent qui peut être difficile à comprendre et à déboguer.
  :::

- **Exemple :**

  ```js
  const state = shallowReadonly({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // muter les propriétés propre de l'état va échouer
  state.foo++

  // ...mais fonctionne sur des objets imbriqués
  isReadonly(state.nested) // false

  // fonctione
  state.nested.bar++
  ```

## toRaw() {#toraw}

Renvoie l'objet brut d'origine d'un proxy créé par Vue.

- **Type :**

  ```ts
  function toRaw<T>(proxy: T): T
  ```

- **Détails :**

  `toRaw()` peut renvoyer l'objet d'origine à partir de proxys créés par [`reactive()`](./reactivity-core.html#reactive), [`readonly()`](./reactivity-core.html#readonly ), [`shallowReactive()`](#shallowreactive) ou [`shallowReadonly()`](#shallowreadonly).

  Il s'agit d'une solution d'échappement qui peut être utilisée pour lire temporairement sans encourir d'accès au proxy / de surcharge de suivi ou pour écrire sans déclencher de modifications. Il n'est **pas** recommandé de conserver une référence persistante à l'objet d'origine. À utiliser avec précaution.

- **Exemple :**

  ```js
  const foo = {}
  const reactiveFoo = reactive(foo)

  console.log(toRaw(reactiveFoo) === foo) // true
  ```

## markRaw() {#markraw}

Marque un objet afin qu'il ne soit jamais converti en proxy. Renvoie l'objet lui-même.

- **Typ :**

  ```ts
  function markRaw<T extends object>(value: T): T
  ```

- **Exemple :**

  ```js
  const foo = markRaw({})
  console.log(isReactive(reactive(foo))) // false

  // fonctionne également lorsqu'il est imbriqué dans d'autres objets réactifs
  const bar = reactive({ foo })
  console.log(isReactive(bar.foo)) // false
  ```

  :::warning À utiliser avec précaution
  `markRaw()` et les API partiallement réactives telles que `shallowReactive()` vous permettent de désactiver de manière sélective la conversion profonde réactive/lecture seule par défaut et d'intégrer des objets bruts sans proxy dans votre graphe d'état. Ils peuvent être utilisés pour diverses raisons :

  - Certaines valeurs ne doivent tout simplement pas être rendues réactives, par exemple une instance de classe tierce complexe ou un objet de composant Vue.

  - Ignorer la conversion proxy peut améliorer les performances lors du rendu de grandes listes avec des sources de données immuables.

  Ils sont considérés comme avancés car l'objet brut n'est définie qu'au niveau racine, donc si vous définissez un objet brut imbriqué et non marqué comme brut dans un objet réactif, puis y accédez à nouveau, vous récupérez la version proxyfiée. Cela peut entraîner des **risques d'identité** - par exemple effectuer une opération qui repose sur l'identité de l'objet mais en utilisant à la fois la version brute et la version proxyfiée du même objet :

  ```js
  const foo = markRaw({
    nested: {}
  })

  const bar = reactive({
    // bien que `foo` soit marqué comme brut, foo.nested ne l'est pas.
    nested: foo.nested
  })

  console.log(foo.nested === bar.nested) // false
  ```

  Les risques d'identité sont en général rares. Cependant, pour utiliser correctement ces API tout en évitant en toute sécurité les risques d'identité, il faut une solide compréhension du fonctionnement du système de réactivité.

  :::

## effectScope() {#effectscope}

Crée un objet de portée d'effet qui peut capturer les effets réactifs (c'est-à-dire _computed_ et les observateurs) créés en son sein afin que ces effets puissent être disposés ensemble. Pour des cas d'utilisation détaillés de cette API, veuillez consulter son [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md) correspondant.

- **Type :**

  ```ts
  function effectScope(detached?: boolean): EffectScope

  interface EffectScope {
    run<T>(fn: () => T): T | undefined // undefined si le scope est inactif
    stop(): void
  }
  ```

- **Exemple :**

  ```js
  const scope = effectScope()

  scope.run(() => {
    const doubled = computed(() => counter.value * 2)

    watch(doubled, () => console.log(doubled.value))

    watchEffect(() => console.log('Count: ', doubled.value))
  })

  // pour disposer tous les effets du scope
  scope.stop()
  ```

## getCurrentScope() {#getcurrentscope}

Renvoie la [portée d'effet](#effectscope) active actuelle s'il y en a une.

- **Type :**

  ```ts
  function getCurrentScope(): EffectScope | undefined
  ```

## onScopeDispose() {#onscopedispose}

Enregistre une fonction de suppression sur la [portée d'effet](#effectscope) active actuelle. La fonction sera appelée lorsque la portée d'effet associée sera arrêtée.

Cette méthode peut être utilisée comme remplacement non couplé à un composant de `onUnmount` dans les fonctions de composition réutilisables, puisque la fonction `setup()` de chaque composant Vue est également invoquée dans une portée d'effet.

- **Type :**

  ```ts
  function onScopeDispose(fn: () => void): void
  ```
