# API de la réactivité : Essentiel {#reactivity-api-core}

:::info Voir aussi
Pour mieux comprendre les API de réactivité, il est recommandé de lire les chapitres suivants du guide :

- [Fondamentaux de la réactivité](/guide/essentials/reactivity-fundamentals) (avec la préférence API définie sur Composition API)
- [La réactivité en détails](/guide/extras/reactivity-in-depth)
  :::

## ref() {#ref}

Prend une valeur interne et retourne un objet ref réactif et mutable, qui n'a qu'une seule propriété `.value` pointant sur la valeur interne.

- **Type :**

  ```ts
  function ref<T>(value: T): Ref<UnwrapRef<T>>

  interface Ref<T> {
    value: T
  }
  ```

- **Détails**

  L'objet ref est mutable - c'est-à-dire que vous pouvez attribuer de nouvelles valeurs à `.value`. Il est également réactif - c'est-à-dire que toute lecture de `.value` est traquée, et que les opérations d'écriture déclenchent les effets associés.

  Si un objet est assigné comme valeur d'une ref, l'objet est rendu profondément réactif via [reactive()](#reactive). Cela signifie également que si l'objet contient des refs imbriquées, elles seront déballées en profondeur.

  Pour éviter la conversion profonde, utilisez plutôt [`shallowRef()`](./reactivity-advanced#shallowref).

- **Exemple**

  ```js
  const count = ref(0)
  console.log(count.value) // 0

  count.value = 1
  console.log(count.value) // 1
  ```

- **Voir aussi**
  - [Guide - Les fondamentaux de la réactivité avec `ref()`](/guide/essentials/reactivity-fundamentals#ref)
  - [Guide - Typer `ref()`](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

## computed() {#computed}

Prend une fonction [accesseur](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Functions/get#description) et retourne un objet [ref](#ref) réactif en lecture seule pour la valeur retournée par la fonction acesseur. Elle peut aussi prendre un objet avec les fonctions `get` et `set` pour créer un objet ref modifiable.

- **Type :**

  ```ts
  // lecture seule
  function computed<T>(
    getter: (oldValue: T | undefined) => T,
    // voir "Débogage des propriétés calculées" plus bas
    debuggerOptions?: DebuggerOptions
  ): Readonly<Ref<Readonly<T>>>

  // modifiable
  function computed<T>(
    options: {
      get: (oldValue: T | undefined) => T
      set: (value: T) => void
    },
    debuggerOptions?: DebuggerOptions
  ): Ref<T>
  ```

- **Exemple**

  Création d'une ref d'une propriété calculée en lecture seule :

  ```js
  const count = ref(1)
  const plusOne = computed(() => count.value + 1)

  console.log(plusOne.value) // 2

  plusOne.value++ // erreur
  ```

  Création d'une ref d'une propriété calculée modifiable :

  ```js
  const count = ref(1)
  const plusOne = computed({
    get: () => count.value + 1,
    set: (val) => {
      count.value = val - 1
    }
  })

  plusOne.value = 1
  console.log(count.value) // 0
  ```

  Débogage :

  ```js
  const plusOne = computed(() => count.value + 1, {
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **Voir aussi**
  - [Guide - Propriétés calculées](/guide/essentials/computed)
  - [Guide - Débogage des propriétés calculées](/guide/extras/reactivity-in-depth#computed-debugging)
  - [Guide - Typer `computed()`](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />
  - [Guide - Performance - Stabilité des Computed](/guide/best-practices/performance#computed-stability)

## reactive() {#reactive}

Retourne un proxy réactif de l'objet.

- **Type :**

  ```ts
  function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
  ```

- **Détails**

  La conversion réactive est "profonde" : elle affecte toutes les propriétés imbriquées. Un objet réactif déballe également en profondeur toutes les propriétés qui sont des [refs](#ref) tout en maintenant la réactivité.

  Il faut également noter qu'il n'y a pas de déballage de refs lorsque la ref est accédée en tant qu'élément d'un tableau réactif ou d'un type de collection natif comme `Map`.

  Pour éviter la conversion profonde et ne conserver la réactivité qu'au niveau de la racine, utilisez plutôt [shallowReactive()](./reactivity-advanced#shallowreactive).

  L'objet retourné et ses objets imbriqués sont enveloppés par un [proxy ES](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Proxy) et **non** égaux aux objets originaux. Il est recommandé de travailler exclusivement avec le proxy réactif et d'éviter de se fier à l'objet original.

- **Exemple**

  Création d'un objet réactif :

  ```js
  const obj = reactive({ count: 0 })
  obj.count++
  ```

  Déballage de refs :

  ```ts
  const count = ref(1)
  const obj = reactive({ count })

  // la ref sera déballée
  console.log(obj.count === count.value) // true

  // cela va mettre à jour `obj.count`
  count.value++
  console.log(count.value) // 2
  console.log(obj.count) // 2

  // la ref `count` va également être mise à jour
  obj.count++
  console.log(obj.count) // 3
  console.log(count.value) // 3
  ```

  Notez que les refs ne sont **pas** déballées lorsqu'on y accède en tant qu'éléments de tableau ou de collection :

  ```js
  const books = reactive([ref('Vue 3 Guide')])
  // besoin d'utiliser .value ici
  console.log(books[0].value)

  const map = reactive(new Map([['count', ref(0)]]))
  // besoin d'utiliser .value ici
  console.log(map.get('count').value)
  ```

  Lorsque vous assignez une [ref](#ref) à une propriété `reactive`, cette ref sera également automatiquement déballée :

  ```ts
  const count = ref(1)
  const obj = reactive({})

  obj.count = count

  console.log(obj.count) // 1
  console.log(obj.count === count.value) // true
  ```

- **Voir aussi**
  - [Guide - Fondamentaux de la réactivité](/guide/essentials/reactivity-fundamentals)
  - [Guide - Typer `reactive()`](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

## readonly() {#readonly}

Prend un objet (réactif ou simple) ou une [ref](#ref) et renvoie un proxy en lecture seule vers l'original.

- **Type :**

  ```ts
  function readonly<T extends object>(
    target: T
  ): DeepReadonly<UnwrapNestedRefs<T>>
  ```

- **Détails**

  Un proxy en lecture seule est profond : toute propriété imbriquée à laquelle on accède sera également en lecture seule. Il a également le même comportement en termes de déballage que `reactive()`, sauf que les valeurs déballées seront aussi en lecture seule.

  Pour éviter la conversion profonde, utilisez plutôt [shallowReadonly()](./reactivity-advanced#shallowreadonly).

- **Exemple**

  ```js
  const original = reactive({ count: 0 })

  const copy = readonly(original)

  watchEffect(() => {
    // fonctionne pour le suivi de la réactivité
    console.log(copy.count)
  })

  // La mutation de l'original déclenchera les observateurs qui s'appuient sur la copie
  original.count++

  // la mutation de la copie échouera et donnera lieu à un avertissement
  copy.count++ // avertissement !
  ```

## watchEffect() {#watcheffect}

Exécute immédiatement une fonction tout en suivant de manière réactive ses dépendances et la ré-exécute dès que les dépendances sont modifiées.

- **Type :**

  ```ts
  function watchEffect(
    effect: (onCleanup: OnCleanup) => void,
    options?: WatchEffectOptions
  ): WatchHandle

  type OnCleanup = (cleanupFn: () => void) => void

  interface WatchEffectOptions {
    flush?: 'pre' | 'post' | 'sync' // par défaut : 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  interface WatchHandle {
    (): void // appelable, comme `stop`
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

- **Détails**

  Le premier argument est la fonction à exécuter qui reçoit elle-même en argument une fonction qui peut être utilisée pour enregistrer une fonction de nettoyage. La fonction de nettoyage sera appelée juste avant la prochaine exécution de l'effet, et peut être utilisé pour nettoyer les effets de bord invalidés, par exemple une requête asynchrone en attente (voir l'exemple ci-dessous).

  Le second argument est un objet optionnel d'options qui peut être utilisé pour ajuster le timing du nettoyage de l'effet ou pour déboguer ses dépendances.

  Par défaut, les observateurs seront exécutés juste avant le rendu du composant. Définir `flush: 'post'` reportera l'exécution du watcher après le rendu du composant. Voir le paragraphe sur [le timing du nettoyage des fonctions de rappel](/guide/essentials/watchers#callback-flush-timing) pour plus d'informations. Dans de rares cas, il peut être nécessaire de déclencher un observateur immédiatement lorsqu'une dépendance réactive change, par exemple pour invalider un cache. Ceci peut être réalisé en utilisant `flush: 'sync'`. Cependant, ce paramètre doit être utilisé avec prudence, car il peut entraîner des problèmes de performance et de cohérence des données si plusieurs propriétés sont mises à jour en même temps.

  La valeur de retour est une fonction de gestion qui peut être appelée pour empêcher l'effet de s'exécuter à nouveau.

- **Exemple**

  ```js
  const count = ref(0)

  watchEffect(() => console.log(count.value))
  // -> affiche 0

  count.value++
  // -> affiche 1
  ```

  Arrêter l'observateur :

  ```js
  const stop = watchEffect(() => {})

  // lorsqu'on a plus besoin de l'observateur :
  stop()
  ```

  Mettre en pause / reprendre un observateur : <sup class="vt-badge" data-text="3.5+" />

  ```js
  const { stop, pause, resume } = watch(() => {})

  // mettre en pause temporairement l'observateur
  pause()

  // reprendre plus tard
  resume()

  // arrêter
  stop()
  ```

  Nettoyage des effets de bord :

  ```js
  watchEffect(async (onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` sera appelé si `id` change,
    // annulant la requête précédente si elle n'a pas déjà été complétée.
    onCleanup(cancel)
    data.value = await response
  })
  ```

  Nettoyage des effets de bord à partir de la version 3.5 :

  ```js
  import { onWatcherCleanup } from 'vue'

  watchEffect(async () => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` sera appelé si `id` change,
    // annulant la requête précédente si elle n'a pas déjà été complétée.
    onWatcherCleanup(cancel)
    data.value = await response
  })
  ```

  Options :

  ```js
  watchEffect(() => {}, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **Voir aussi**
  - [Guide - Observateurs](/guide/essentials/watchers#watcheffect)
  - [Guide - Débogage des observateurs](/guide/extras/reactivity-in-depth#watcher-debugging)

## watchPostEffect() {#watchposteffect}

Alias de [`watchEffect()`](#watcheffect) avec l'option `flush : 'post'`.

## watchSyncEffect() {#watchsynceffect}

Alias de [`watchEffect()`](#watcheffect) avec l'option `flush : 'sync'`.

## watch() {#watch}

Observe une ou plusieurs sources de données réactives et invoque une fonction de rappel lorsque les sources changent.

- **Type :**

  ```ts
  // observation d'une source unique
  function watch<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T>,
    options?: WatchOptions
  ): WatchHandle

  // observation de plusieurs sources
  function watch<T>(
    sources: WatchSource<T>[],
    callback: WatchCallback<T[]>,
    options?: WatchOptions
  ): WatchHandle

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type WatchSource<T> =
    | Ref<T> // ref
    | (() => T) // accesseur
    | (T extends object ? T : never) // objet réactif

  interface WatchOptions extends WatchEffectOptions {
    immediate?: boolean // Par défaut: false
    deep?: boolean | number // Par défaut: false
    flush?: 'pre' | 'post' | 'sync' // Par défaut: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
    once?: boolean // Par défaut: false (3.4+)
  }

  interface WatchHandle {
    (): void // appelable, comme `stop`
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

  > Le type est simplifié dans un souci de lisibilité.

- **Détails**

  `watch()` fonctionne à la volée par défaut - c'est-à-dire que la fonction de rappel n'est appelée que lorsque la source surveillée a changé.

  Le premier argument est la **source** de l'observateur. La source peut être l'une des suivantes :

  - Une fonction accesseur qui renvoie une valeur
  - Une ref
  - Un objet réactif
  - ...ou un tableau des éléments ci-dessus.

  Le second argument est la fonction de rappel qui sera appelée lorsque la source sera modifiée. Celle-ci reçoit trois arguments : la nouvelle valeur, l'ancienne, et une fonction pour enregistrer une fonction de nettoyage des effets de bord. La fonction de nettoyage sera appelée juste avant la prochaine exécution de l'effet, et peut être utilisée pour nettoyer les effets de bord invalidés, par exemple une requête asynchrone en attente.

  Lors de l'observation de plusieurs sources, la fonction de rappel reçoit deux tableaux contenant les nouvelles / anciennes valeurs correspondant au tableau des sources.

  Le troisième argument optionnel est un objet d'options qui prend en charge les options suivantes :

  - **`immediate`** : déclenche la fonction de rappel immédiatement à la création de l'observateur. L'ancienne valeur vaudra `undefined` lors du premier appel.
  - **`deep`** : force la traversée profonde de la source si c'est un objet, de sorte que la fonction de rappel se déclenche sur les mutations profondes. Voir [les observateurs profonds](/guide/essentials/watchers#deep-watchers).
  - **`flush`** : ajuste le timing de nettoyage de la fonction de rappel. Voir [timing du nettoyage des rappels](/guide/essentials/watchers#callback-flush-timing) et [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`** : débogue les dépendances de l'observateur. Voir [Débogage des observateur](/guide/extras/reactivity-in-depth#watcher-debugging).
  - **`once`** : (3.4+) déclenche la fonction de rappel une seul fois. L'observateur sera automatiquement arrêté après le premier déclenchement.

  Comparée à [`watchEffect()`](#watcheffect), `watch()` nous permet de :

  - Exécuter l'effet de bord à la volée ;
  - Être plus spécifique quant à l'état qui doit déclencher la ré-exécution de l'observateur ;
  - Accéder à la fois à la valeur précédente et à la valeur actuelle de l'état surveillé.

- **Exemple**

  Observation d'un accesseur :

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  ```

  Observation d'une ref :

  ```js
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

  Lorsque l'on observe plusieurs sources, la fonction de rappel reçoit des tableaux contenant les nouvelles / anciennes valeurs correspondant au tableau source :

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```

  Lorsque vous utilisez une source accesseur, l'observateur ne se déclenche que si la valeur de retour de l'accesseur a changé. Si vous voulez que la fonction de rappel se déclenche même lors de mutations profondes, vous devez explicitement forcer l'observateur à fonctionner en mode profond avec `{ deep: true }`. Notez qu'en mode profond, la nouvelle valeur et l'ancienne seront le même objet si la fonction de rappel a été déclenchée par une mutation profonde :

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state,
    (newValue, oldValue) => {
      // newValue === oldValue
    },
    { deep: true }
  )
  ```

  Lorsqu'il observe directement un objet réactif, l'observateur est automatiquement en mode profond :

  ```js
  const state = reactive({ count: 0 })
  watch(state, () => {
    /* se déclenche lors des mutations profondes de l'état */
  })
  ```

`watch()` a les mêmes options de timing et de débogage que [`watchEffect()`](#watcheffect) :

```js
watch(source, callback, {
  flush: 'post',
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

Arrêter l'observateur :

```js
const stop = watch(source, callback)

// lorsqu'on n'a plus besoin de l'observateur :
stop()
```

Mettre en pause / reprendre un observateur : <sup class="vt-badge" data-text="3.5+" />

```js
const { stop, pause, resume } = watchEffect(() => {})

// mettre en pause temporairement l'observateur
pause()

// reprendre plus tard
resume()

// arrêter
stop()
```

Nettoyage des effets de bord :

```js
watch(id, async (newId, oldId, onCleanup) => {
  const { response, cancel } = doAsyncWork(newId)
  // `cancel` sera appelée si `id` change, annulant
  // la requête précédente si elle n'est pas terminée
  onCleanup(cancel)
  data.value = await response
})
```

Nettoyage des effets de bord à partir de la version 3.5 :

```js
import { onWatcherCleanup } from 'vue'

watch(id, async (newId) => {
  const { response, cancel } = doAsyncWork(newId)
  onWatcherCleanup(cancel)
  data.value = await response
})
```

- **Voir aussi**

  - [Guide - Observateurs](/guide/essentials/watchers)
  - [Guide - Débogage des observateurs](/guide/extras/reactivity-in-depth#watcher-debugging)

## onWatcherCleanup() <sup class="vt-badge" data-text="3.5+" /> {#onwatchercleanup}

Enregistre une fonction de nettoyage à exécuter lorsque l'observateur actuel est sur le point de s'exécuter à nouveau. Elle ne peut être appelée que pendant l'exécution synchrone d'une fonction d'effet `watchEffect` ou d'une fonction de rappel `watch` (c'est-à-dire qu'elle ne peut pas être appelée après une instruction `await` dans une fonction asynchrone).

- **Type**

  ```ts
  function onWatcherCleanup(
    cleanupFn: () => void,
    failSilently?: boolean
  ): void
  ```

- **Exemple**

  ```ts
  import { watch, onWatcherCleanup } from 'vue'

  watch(id, (newId) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` sera appelé si `id` change, ce qui annulera
    // la demande précédente si elle n'est pas encore terminée
    onWatcherCleanup(cancel)
  })
  ```
