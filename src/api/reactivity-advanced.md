# API de la réactivité : Avancé {#reactivity-api-advanced}

## shallowRef() {#shallowref}

Version partiellement réactive de [`ref()`](./reactivity-core#ref).

- **Type :**

  ```ts
  function shallowRef<T>(value: T): ShallowRef<T>

  interface ShallowRef<T> {
    value: T
  }
  ```

- **Détails**

  Contrairement à `ref()`, la valeur interne d'une ref partiellement réactive est stockée et exposée telle quelle, et ne sera pas rendue profondément réactive. Seul l'accès `.value` est réactif.

  `shallowRef()` est généralement utilisée pour l'optimisation des performances de grandes structures de données ou l'intégration avec des systèmes de gestion d'état externes.

- **Exemple**

  ```js
  const state = shallowRef({ count: 1 })

  // ne déclenche PAS de changement
  state.value.count = 2

  // déclenche un changement
  state.value = { count: 2 }
  ```

- **Voir aussi**
  - [Guide - Réduire la surcharge de réactivité pour les grandes structures immuables](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
  - [Guide - Intégration avec des systèmes externes de gestion d'état](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

## triggerRef() {#triggerref}

Force le déclenchement d'effets qui dépendent d'une [ref partiellement réactive](#shallowref). Ceci est généralement utilisé après avoir effectué des mutations profondes sur la valeur interne d'une ref partiellement réactive.

- **Type :**

  ```ts
  function triggerRef(ref: ShallowRef): void
  ```

- **Exemple**

  ```js
  const shallow = shallowRef({
    greet: 'Hello, world'
  })

  // Logue "Hello, world" une fois pour la première exécution
  watchEffect(() => {
    console.log(shallow.value.greet)
  })

  // Cela ne déclenchera pas l'effet car la ref est partiellement réactive
  shallow.value.greet = 'Hello, universe'

  // Logue "Hello, universe"
  triggerRef(shallow)
  ```

## customRef() {#customref}

Crée une ref personnalisée avec un contrôle explicite sur son suivi des dépendances et le déclenchement des mises à jour.

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

- **Détails**

  `customRef()` attend une fonction _factory_, qui reçoit les fonctions `track` et `trigger` comme arguments et doit renvoyer un objet avec les méthodes `get` et `set`.

  En général, `track()` doit être appelée à l'intérieur de `get()`, et `trigger()` doit être appelée à l'intérieur de `set()`. Cependant, vous avez un contrôle total sur le moment où elles doivent être appelées.

- **Exemple**

  Création d'une ref _debounced_ qui ne met à jour la valeur qu'après un certain délai après le dernier appel défini :

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

  [Essayer en ligne](https://play.vuejs.org/#eNplUkFugzAQ/MqKC1SiIekxIpEq9QVV1BMXCguhBdsyaxqE/PcuGAhNfYGd3Z0ZDwzeq1K7zqB39OI205UiaJGMOieiapTUBAOYFt/wUxqRYf6OBVgotGzA30X5Bt59tX4iMilaAsIbwelxMfCvWNfSD+Gw3++fEhFHTpLFuCBsVJ0ScgUQjw6Az+VatY5PiroHo3IeaeHANlkrh7Qg1NBL43cILUmlMAfqVSXK40QUOSYmHAZHZO0KVkIZgu65kTnWp8Qb+4kHEXfjaDXkhd7DTTmuNZ7MsGyzDYbz5CgSgbdppOBFqqT4l0eX1gZDYOm057heOBQYRl81coZVg9LQWGr+IlrchYKAdJp9h0C6KkvUT3A6u8V1dq4ASqRgZnVnWg04/QWYNyYzC2rD5Y3/hkDgz8fY/cOT1ZjqizMZzGY3rDPC12KGZYyd3J26M8ny1KKx7c3X25q1c1wrZN3L9LCMWs/+AmeG6xI=)

  :::warning À utiliser avec précaution
  Lorsque l'on utilise une ref personnalisée, il convient d'être prudent quant à la valeur de retour de son accesseur, en particulier lorsque l'on génère de nouveaux types de données d'objets à chaque fois que le getter est exécuté. Cela affecte la relation entre les composants parent et enfant, lorsqu'une ref a été transmise en tant que prop.

  La fonction de rendu du composant parent pourrait être déclenchée par des changements dans un état réactif différent. Pendant le rendu, la valeur de notre ref personnalisée est réévaluée, renvoyant un nouveau type de données d'objet en tant que prop à un composant enfant. Cette prop est comparé à sa dernière valeur dans le composant enfant, et comme ils sont différents, les dépendances réactives de la ref personnalisée sont déclenchées dans le composant enfant. Pendant ce temps, les dépendances réactives du composant parent ne s'exécutent pas car le mutateur de la ref n'a pas été appelé et ses dépendances n'ont pas été déclenchées en conséquence.

  [Essayer en ligne](https://play.vuejs.org/#eNqFVEtP3DAQ/itTS9Vm1ZCt1J6WBZUiDvTQIsoNcwiOkzU4tmU7+9Aq/71jO1mCWuhlN/PyfPP45kAujCk2HSdLsnLMCuPBcd+Zc6pEa7T1cADWOa/bW17nYMPPtvRsDT3UVrcww+DZ0flStybpKSkWQQqPU0IVVUwr58FYvdvDWXgpu6ek1pqSHL0fS0vJw/z0xbN1jUPHY/Ys87Zkzzl4K5qG2zmcnUN2oAqg4T6bQ/wENKNXNk+CxWKsSlmLTSk7XlhedYxnWclYDiK+MkQCoK4wnVtnIiBJuuEJNA2qPof7hzkEoc8DXgg9yzYTBBFgNr4xyY4FbaK2p6qfI0iqFgtgulOe27HyQRy69Dk1JXY9C03JIeQ6wg4xWvJCqFpnlNytOcyC2wzYulQNr0Ao+Mhw0KnTTEttl/CIaIJiMz8NGBHFtYetVrPwa58/IL48Zag4N0ssquNYLYBoW16J0vOkC3VQtVqk7cG9QcHz1kj0QAlgVYkNMFk6d0bJ1pbGYKUkmtD42HmvFfi94WhOEiXwjUnBnlEz9OLTJwy5qCo44D4O7en71SIFjI/F9VuG4jEy/GHQKq5hQrJAKOc4uNVighBF5/cygS0GgOMoK+HQb7+EWvLdMM7weVIJy5kXWi0Rj+xaNRhLKRp1IvB9hxYegA6WJ1xkUe9PcF4e9a+suA3YwYiC5MQ79KlFUzw5rZCZEUtoRWuE5PaXCXmxtuWIkpJSSr39EXXHQcWYNWfP/9A/uV3QUXJjueN2E1ZhtPnSIqGS+er3T77D76Ox1VUn0fsd4y3HfewCxuT2vVMVwp74RbTX8WQI1dy5qx12xI1Fpa1K5AreeEHCCN8q/QXul+LrSC3s4nh93jltkVPDIYt5KJkcIKStCReo4rVQ/CZI6dyEzToCCJu7hAtry/1QH/qXncQB400KJwqPxZHxEyona0xS/E3rt1m9Ld1rZl+uhaxecRtP3EjtgddCyimtXyj9H/Ii3eId7uOGTkyk/wOEbQ9h)

  :::

  :::warning Use with caution
  When using customRef, we should be cautious about the return value of its getter, particularly when generating new object datatypes each time the getter is run. This affects the relationship between parent and child components, where such a customRef has been passed as a prop.

  The parent component's render function could be triggered by changes to a different reactive state. During rerender, the value of our customRef is reevaluated, returning a new object datatype as a prop to a child component. This prop is compared with its last value in the child component, and since they are different, the reactive dependencies of the customRef are triggered in the child component. Meanwhile, the reactive dependencies in the parent component do not run because the customRef's setter was not called, and its dependencies were not triggered as a result.

  [See it in the Playground](https://play.vuejs.org/#eNqFVEtP3DAQ/itTS9Vm1ZCt1J6WBZUiDvTQIsoNcwiOkzU4tmU7+9Aq/71jO1mCWuhlN/PyfPP45kAujCk2HSdLsnLMCuPBcd+Zc6pEa7T1cADWOa/bW17nYMPPtvRsDT3UVrcww+DZ0flStybpKSkWQQqPU0IVVUwr58FYvdvDWXgpu6ek1pqSHL0fS0vJw/z0xbN1jUPHY/Ys87Zkzzl4K5qG2zmcnUN2oAqg4T6bQ/wENKNXNk+CxWKsSlmLTSk7XlhedYxnWclYDiK+MkQCoK4wnVtnIiBJuuEJNA2qPof7hzkEoc8DXgg9yzYTBBFgNr4xyY4FbaK2p6qfI0iqFgtgulOe27HyQRy69Dk1JXY9C03JIeQ6wg4xWvJCqFpnlNytOcyC2wzYulQNr0Ao+Mhw0KnTTEttl/CIaIJiMz8NGBHFtYetVrPwa58/IL48Zag4N0ssquNYLYBoW16J0vOkC3VQtVqk7cG9QcHz1kj0QAlgVYkNMFk6d0bJ1pbGYKUkmtD42HmvFfi94WhOEiXwjUnBnlEz9OLTJwy5qCo44D4O7en71SIFjI/F9VuG4jEy/GHQKq5hQrJAKOc4uNVighBF5/cygS0GgOMoK+HQb7+EWvLdMM7weVIJy5kXWi0Rj+xaNRhLKRp1IvB9hxYegA6WJ1xkUe9PcF4e9a+suA3YwYiC5MQ79KlFUzw5rZCZEUtoRWuE5PaXCXmxtuWIkpJSSr39EXXHQcWYNWfP/9A/uV3QUXJjueN2E1ZhtPnSIqGS+er3T77D76Ox1VUn0fsd4y3HfewCxuT2vVMVwp74RbTX8WQI1dy5qx12xI1Fpa1K5AreeEHCCN8q/QXul+LrSC3s4nh93jltkVPDIYt5KJkcIKStCReo4rVQ/CZI6dyEzToCCJu7hAtry/1QH/qXncQB400KJwqPxZHxEyona0xS/E3rt1m9Ld1rZl+uhaxecRtP3EjtgddCyimtXyj9H/Ii3eId7uOGTkyk/wOEbQ9h)

  :::

## shallowReactive() {#shallowreactive}

Version partiellement réactive de [`reactive()`](./reactivity-core#reactive).

- **Type :**

  ```ts
  function shallowReactive<T extends object>(target: T): T
  ```

- **Détails**

  Contrairement à `reactive()`, il n'y a pas de conversion profonde : seules les propriétés de niveau racine sont réactives pour un objet partiellement réactif. Les valeurs de propriété sont stockées et exposées telles quelles - cela signifie également que les propriétés avec des valeurs de ref ne seront **pas** automatiquement déballées.

  :::warning À utiliser avec précaution
  Les structures de données partiellement réactives ne doivent être utilisées que pour l'état de niveau racine dans un composant. Évitez de l'imbriquer dans un objet réactif profond car cela crée un arbre avec un comportement de réactivité incohérent qui peut être difficile à comprendre et à déboguer.
  :::

- **Exemple**

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

Version partiellement réactive de [`readonly()`](./reactivity-core#readonly).

- **Type :**

  ```ts
  function shallowReadonly<T extends object>(target: T): Readonly<T>
  ```

- **Détails**

  Contrairement à `readonly()`, il n'y a pas de conversion profonde : seules les propriétés de niveau racine sont en lecture seule. Les valeurs de propriété sont stockées et exposées telles quelles - cela signifie également que les propriétés avec des valeurs de ref ne seront **pas** automatiquement déballées.

  :::warning À utiliser avec précaution
  Les structures de données partiellement réactives ne doivent être utilisées que pour l'état de niveau racine dans un composant. Évitez de l'imbriquer dans un objet réactif profond car cela crée un arbre avec un comportement de réactivité incohérent qui peut être difficile à comprendre et à déboguer.
  :::

- **Exemple**

  ```js
  const state = shallowReadonly({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // muter les propriétés propres de l'état va échouer
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

- **Détails**

  `toRaw()` peut renvoyer l'objet d'origine à partir de proxys créés par [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](#shallowreactive) ou [`shallowReadonly()`](#shallowreadonly).

  Il s'agit d'une solution d'échappement qui peut être utilisée pour lire temporairement sans encourir d'accès au proxy / de surcharge de suivi ou pour écrire sans déclencher de modifications. Il n'est **pas** recommandé de conserver une ref persistante à l'objet d'origine. À utiliser avec précaution.

- **Exemple**

  ```js
  const foo = {}
  const reactiveFoo = reactive(foo)

  console.log(toRaw(reactiveFoo) === foo) // true
  ```

## markRaw() {#markraw}

Marque un objet afin qu'il ne soit jamais converti en proxy. Renvoie l'objet lui-même.

- **Type :**

  ```ts
  function markRaw<T extends object>(value: T): T
  ```

- **Exemple**

  ```js
  const foo = markRaw({})
  console.log(isReactive(reactive(foo))) // false

  // fonctionne également lorsqu'il est imbriqué dans d'autres objets réactifs
  const bar = reactive({ foo })
  console.log(isReactive(bar.foo)) // false
  ```

  :::warning À utiliser avec précaution
  `markRaw()` et les API partiellement réactives telles que `shallowReactive()` vous permettent de désactiver de manière sélective la conversion profonde réactive/lecture seule par défaut et d'intégrer des objets bruts sans proxy dans votre graphe d'état. Elles peuvent être utilisées pour diverses raisons :

  - Certaines valeurs ne doivent tout simplement pas être rendues réactives, par exemple une instance de classe tierce complexe ou un objet de composant Vue.

  - Ignorer la conversion proxy peut améliorer les performances lors du rendu de grandes listes avec des sources de données immuables.

  Elles sont considérées comme avancées car l'objet brut n'est défini qu'au niveau racine, donc si vous définissez un objet brut imbriqué et non marqué comme brut dans un objet réactif, puis y accédez à nouveau, vous récupérez la version proxyfiée. Cela peut entraîner des **risques d'identité** - par exemple effectuer une opération qui repose sur l'identité de l'objet mais en utilisant à la fois la version brute et la version proxyfiée du même objet :

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

Crée un objet de portée d'effet qui peut capturer les effets réactifs (c'est-à-dire les propriétés calculées et les observateurs) créés en son sein afin que ces effets puissent être disposés. Pour des cas d'utilisation détaillés de cette API, veuillez consulter son [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md) correspondant.

- **Type :**

  ```ts
  function effectScope(detached?: boolean): EffectScope

  interface EffectScope {
    run<T>(fn: () => T): T | undefined // undefined si le scope est inactif
    stop(): void
  }
  ```

- **Exemple**

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

Un avertissement sera levé si la fonction est appelée sans d'effect scope actif. À partir de la version 3.5, cet avertissement peut être désactivé en passant `tre` au second argument.

- **Type :**

  ```ts
  function onScopeDispose(fn: () => void, failSilently?: boolean): void
  ```
