# Composition API: Les hooks du cycle de vie {#composition-api-lifecycle-hooks}

:::info Note d'utilisation
Toutes les API listées sur cette page doivent être appelées de manière synchrone pendant la phase `setup()` d'un composant. Consultez [Guide - Les hooks du cycle de vie](/guide/essentials/lifecycle) pour plus de détails.
:::

## onMounted() {#onmounted}

Enregistre une fonction de rappel qui sera appelée après le montage du composant.

- **Type :**

  ```ts
  function onMounted(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Détails**

  Un composant est considéré comme monté après que :

  - Tous ses composants enfants synchrones ont été montés (n'inclut pas les composants asynchrones ou les composants à l'intérieur des arbres `<Suspense>`).

  - Son propre arbre du DOM a été créé et inséré dans le conteneur parent. Notez que cela garantit que seulement l'arbre du DOM du composant est déjà placé dans le document, même si le conteneur racine de l'application y est.

  Ce hook est généralement utilisé pour effectuer des effets de bord qui nécessitent un accès au DOM rendu du composant, ou pour limiter le code lié au DOM au client dans une [application rendue par le serveur](/guide/scaling-up/ssr).

  **Ce hook n'est pas appelé pendant le rendu côté serveur.**

- **Exemple**

  Accès à un élément via une ref de template :

  ```vue
  <script setup>
  import { ref, onMounted } from 'vue'

  const el = ref()

  onMounted(() => {
    el.value // <div>
  })
  </script>

  <template>
    <div ref="el"></div>
  </template>
  ```

## onUpdated() {#onupdated}

Enregistre une fonction de rappel à appeler après que le composant ait mis à jour son arbre du DOM en raison d'un changement d'état réactif.

- **Type :**

  ```ts
  function onUpdated(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Détails**

  Le hook de mise à jour d'un composant parent est appelé après celui de ses composants enfants.

  Ce hook est appelé après toute mise à jour du DOM du composant, qui peut être causée par différents changements d'état. Si vous devez accéder au DOM mis à jour après un changement d'état spécifique, utilisez plutôt [nextTick()](/api/general#nexttick).

  **Ce hook n'est pas appelé pendant le rendu côté serveur.**

  :::warning
  Ne modifiez pas l'état du composant dans le hook _updated_ - cela conduirait à une boucle de mises à jour infinie !
  :::

- **Exemple**

  Accès au DOM mis à jour :

  ```vue
  <script setup>
  import { ref, onUpdated } from 'vue'

  const count = ref(0)

  onUpdated(() => {
    // le contenu du texte devrait être égal à `count.value`
    console.log(document.getElementById('count').textContent)
  })
  </script>

  <template>
    <button id="count" @click="count++">{{ count }}</button>
  </template>
  ```

## onUnmounted() {#onunmounted}

Enregistre une fonction de rappel qui sera appelée après le démontage du composant.

- **Type :**

  ```ts
  function onUnmounted(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Détails**

  Un composant est considéré comme démonté après que :

  - Tous ses composants enfants ont été démontés.

  - Tous ses effets réactifs associés (effet de rendu et propriétés calculées / observateurs créés pendant `setup()`) ont été arrêtés.

  Utilisez ce hook pour nettoyer manuellement les effets de bord créés, tels que les minuteurs, les écouteurs d'événements du DOM ou les connexions au serveur.

  **Ce hook n'est pas appelé pendant le rendu côté serveur.**

- **Exemple**

  ```vue
  <script setup>
  import { onMounted, onUnmounted } from 'vue'

  let intervalId
  onMounted(() => {
    intervalId = setInterval(() => {
      // ...
    })
  })

  onUnmounted(() => clearInterval(intervalId))
  </script>
  ```

## onBeforeMount() {#onbeforemount}

Enregistre un hook qui sera appelé juste avant le montage du composant.

- **Type :**

  ```ts
  function onBeforeMount(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Détails**

  Lorsque ce hook est appelé, le composant a fini de configurer son état réactif, mais aucun noeud du DOM n'a encore été créé. Il est sur le point d'exécuter son effet de rendu du DOM pour la première fois.

  **Ce hook n'est pas appelé pendant le rendu côté serveur.**

## onBeforeUpdate() {#onbeforeupdate}

Enregistre un hook qui sera appelé juste avant que le composant ne soit sur le point de mettre à jour son arbre du DOM en raison d'un changement d'état réactif.

- **Type :**

  ```ts
  function onBeforeUpdate(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Détails**

  Ce hook peut être utilisé pour accéder à l'état du DOM avant que Vue ne le mette à jour. Il est également possible de modifier l'état d'un composant à l'intérieur de ce hook.

  **Ce hook n'est pas appelé pendant le rendu côté serveur.**

## onBeforeUnmount() {#onbeforeunmount}

Enregistre un hook à appeler juste avant le démontage d'une instance de composant.

- **Type :**

  ```ts
  function onBeforeUnmount(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Détails**

  Lorsque ce hook est appelé, l'instance du composant est toujours totalement fonctionnelle.

  **Ce hook n'est pas appelé pendant le rendu côté serveur.**

## onErrorCaptured() {#onerrorcaptured}

Enregistre un hook qui sera appelé lorsqu'une erreur venant d'un composant descendant a été interceptée.

- **Type :**

  ```ts
  function onErrorCaptured(callback: ErrorCapturedHook): void

  type ErrorCapturedHook = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => boolean | void
  ```

- **Détails**

  Les erreurs peuvent être capturées à partir des sources suivantes :

  - Rendu de composants
  - Gestionnaires d'événements
  - Hooks de cycle de vie
  - Fonction `setup()`
  - Observateurs
  - Hooks de directives personnalisées
  - Hooks de transition

  Ce hook reçoit trois arguments : l'erreur, l'instance du composant qui a déclenché l'erreur, et une information sous forme de chaînes de caractères spécifiant le type de source de l'erreur.

  :::tip
  En production, le troisième argument (`info`) sera un code raccourci plutôt que toute la chaîne d'information. Vous pouvez trouver le code correspondant dans la [Référence des erreurs en production](/error-reference/#runtime-errors).
  :::

  Vous pouvez modifier l'état du composant dans `onErrorCaptured()` pour afficher un état d'erreur à l'utilisateur. Cependant, il est important de ne pas rendre le contenu original à l'origine de l'erreur, sinon le composant sera bloqué dans une boucle de rendu infinie.

  Le hook peut retourner `false` pour empêcher la propagation de l'erreur. Consultez les détails sur la propagation des erreurs ci-dessous.

  **Règles concernant la propagation des erreurs**

  - Par défaut, toutes les erreurs sont envoyées à [`app.config.errorHandler`](/api/application#app-config-errorhandler) au niveau de l'application si elle est définie, afin qu'elles puissent être signalées et analysées par un seul service à un seul endroit.

  - Si plusieurs hooks `errorCaptured` existent sur la chaîne descendante ou la chaîne ascendante d'un composant, ils seront tous invoqués sur la même erreur, suivant un ordre allant de bas en haut. Cela est comparable au mécanisme de _bubbling_ des événements natifs du DOM.

  - Si le hook `errorCaptured` lui-même lance une erreur, cette erreur et l'erreur capturée originellement sont envoyées à `app.config.errorHandler`.

  - Un hook `errorCaptured` peut retourner `false` pour empêcher l'erreur de se propager plus loin. Cela revient à dire "cette erreur a été traitée et doit être ignorée". Cela empêchera tout autre hook `errorCaptured` ou `app.config.errorHandler` d'être invoqué pour cette erreur.

## onRenderTracked() <sup class="vt-badge dev-only" /> {#onrendertracked}

Enregistre un hook de débogage qui sera appelé lorsqu'une dépendance réactive a été tracée par l'effet de rendu du composant.

**Ce hook est réservé au mode développement et n'est pas appelé pendant le rendu côté serveur.**

- **Type :**

  ```ts
  function onRenderTracked(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **Voir aussi** [La réactivité en détails](/guide/extras/reactivity-in-depth)

## onRenderTriggered() <sup class="vt-badge dev-only" /> {#onrendertriggered}

Enregistre un hook de débogage qui sera appelé lorsqu'une dépendance réactive déclenche la ré-exécution de l'effet de rendu du composant.

**Ce hook est réservé au mode développement et n'est pas appelé pendant le rendu côté serveur.**

- **Type :**

  ```ts
  function onRenderTriggered(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
    key: any
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
  }
  ```

- **Voir aussi** [La réactivité en détails](/guide/extras/reactivity-in-depth)

## onActivated() {#onactivated}

Enregistre une fonction de rappel qui sera appelée après que l'instance du composant ait été insérée dans le DOM en tant que partie d'un arbre mis en cache par [`<KeepAlive>`](/api/built-in-components#keepalive).

**Ce hook n'est pas appelé pendant le rendu côté serveur.**

- **Type :**

  ```ts
  function onActivated(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Voir aussi** [Guide - Cycle de vie d'une instance mise en cache](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## onDeactivated() {#ondeactivated}

Enregistre une fonction de rappel à appeler après que l'instance du composant ait été retirée du DOM en tant que partie d'un arbre mis en cache par [`<KeepAlive>`](/api/built-in-components#keepalive).

**Ce hook n'est pas appelé pendant le rendu côté serveur.**

- **Type :**

  ```ts
  function onDeactivated(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Voir aussi** [Guide - Cycle de vie d'une instance mise en cache](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## onServerPrefetch() <sup class="vt-badge" data-text="SSR only" /> {#onserverprefetch}

Enregistre une fonction asynchrone à résoudre avant que l'instance du composant ne soit rendue sur le serveur.

- **Type :**

  ```ts
  function onServerPrefetch(callback: () => Promise<any>): void
  ```

- **Détails**

  Si la fonction de rappel renvoie une promesse, le moteur de rendu du serveur attendra qu'elle soit résolue avant de rendre le composant.

  Ce hook n'est appelé que pendant le rendu côté serveur et peut être utilisé pour effectuer une récupération de données sur le serveur uniquement.

- **Exemple**

  ```vue
  <script setup>
  import { ref, onServerPrefetch, onMounted } from 'vue'

  const data = ref(null)

  onServerPrefetch(async () => {
    // le composant est rendu dans le cadre de la requête initiale
    // les données sont pré-récupérées sur le serveur car cela est plus rapide que via le client.
    data.value = await fetchOnServer(/* ... */)
  })

  onMounted(async () => {
    if (!data.value) {
      // si les données ne sont pas définies au moment du montage, cela signifie que le composant
      // est rendu dynamiquement sur le client.
      // Effectue la récupération côté client.
      data.value = await fetchOnClient(/* ... */)
    }
  })
  </script>
  ```

- **Voir aussi** [Rendu côté serveur](/guide/scaling-up/ssr)
