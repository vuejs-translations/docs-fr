# Options : Cycle de vie {#options-lifecycle}

:::info Voir aussi
Pour en savoir plus sur l'utilisation partagée des hooks du cycle de vie, consultez [Guide - Les hooks du cycle de vie](/guide/essentials/lifecycle)
:::

## beforeCreate {#beforecreate}

Appelé lors de l'initialisation de l'instance.

- **Type :**

  ```ts
  interface ComponentOptions {
    beforeCreate?(this: ComponentPublicInstance): void
  }
  ```

- **Détails**

  Appelé immédiatement lorsque l'instance est initialisée, après la résolution des props.
  
  Ensuite les props seront définies comme des propriétés réactives et les états comme `data()` ou `computed` seront configurés.

  Notez que le hook `setup()` de la Composition API est appelé avant tous les hooks de l'Options API, même `beforeCreate()`.

## created {#created}

Appelé après que l'instance ait terminé de traiter toutes les options liées à l'état.

- **Type :**

  ```ts
  interface ComponentOptions {
    created?(this: ComponentPublicInstance): void
  }
  ```

- **Détails**

  Lorsque ce hook est appelé, les éléments suivants ont déjà été mis en place : données réactives, propriétés calculées, méthodes et observateurs. Cependant, la phase de montage n'a pas été lancée, et la propriété `$el` n'est encore disponible.

## beforeMount {#beforemount}

Appelé juste avant que le composant soit monté.

- **Type :**

  ```ts
  interface ComponentOptions {
    beforeMount?(this: ComponentPublicInstance): void
  }
  ```

- **Détails**

  Lorsque ce hook est appelé, le composant a fini de configurer son état réactif, mais aucun noeud du DOM n'a encore été créé. Il est sur le point d'exécuter son effet de rendu du DOM pour la première fois.

  **Ce hook n'est pas appelé pendant le rendu côté serveur.**

## mounted {#mounted}

Appelé après que le composant ait été monté.

- **Type :**

  ```ts
  interface ComponentOptions {
    mounted?(this: ComponentPublicInstance): void
  }
  ```

- **Détails**

  Un composant est considéré comme monté après que :

  - Tous ses composants enfants synchrones ont été montés (n'inclut pas les composants asynchrones ou les composants à l'intérieur des arbres `<Suspense>`).

  - Son propre arbre du DOM a été créé et inséré dans le conteneur parent. Notez que cela garantit que seulement l'arbre du DOM du composant est déjà placé dans le document, même si le conteneur racine de l'application y est.

  Ce hook est généralement utilisé pour effectuer des effets de bord qui nécessitent un accès au DOM rendu du composant, ou pour limiter le code lié au DOM au client dans une [application rendue par le serveur](/guide/scaling-up/ssr).

  **Ce hook n'est pas appelé pendant le rendu côté serveur.**

## beforeUpdate {#beforeupdate}

Appelé juste avant que le composant ne soit sur le point de mettre à jour son arbre du DOM après un changement d'état réactif.

- **Type :**

  ```ts
  interface ComponentOptions {
    beforeUpdate?(this: ComponentPublicInstance): void
  }
  ```

- **Détails**

  Ce hook peut être utilisé pour accéder à l'état du DOM avant que Vue ne le mette à jour. Il est également possible de modifier l'état d'un composant à l'intérieur de ce hook.

  **Ce hook n'est pas appelé pendant le rendu côté serveur.**

## updated {#updated}

Appelé après que le composant ait mis à jour son arbre du DOM suite à un changement d'état réactif.

- **Type :**

  ```ts
  interface ComponentOptions {
    updated?(this: ComponentPublicInstance): void
  }
  ```

- **Détails**

  Le hook _updated_ d'un composant parent est appelé après celui de ses composants enfants.

  Ce hook est appelé après toute mise à jour du DOM du composant, laquelle peut être causée par différents changements d'état. Si vous devez accéder au DOM mis à jour après un changement d'état spécifique, utilisez plutôt [nextTick()](/api/general#nexttick).

  **Ce hook n'est pas appelé pendant le rendu côté serveur.**

  :::warning
  Ne modifiez pas l'état du composant dans le hook _updated_ - cela conduirait à une boucle de mises à jour infinie !
  :::

## beforeUnmount {#beforeunmount}

Appelé juste avant que l'instance d'un composant ne soit démontée.

- **Type :**

  ```ts
  interface ComponentOptions {
    beforeUnmount?(this: ComponentPublicInstance): void
  }
  ```

- **Détails**

  Lorsque ce hook est appelé, l'instance du composant est toujours totalement fonctionnelle.

  **Ce hook n'est pas appelé pendant le rendu côté serveur.**

## unmounted {#unmounted}

Appelé après que le composant ait été démonté.

- **Type :**

  ```ts
  interface ComponentOptions {
    unmounted?(this: ComponentPublicInstance): void
  }
  ```

- **Détails**

  Un composant est considéré comme démonté après que :

  - Tous ses composants enfants ont été démontés.

  - Tous ses effets réactifs associés (effet de rendu et propriétés calculées / observateurs créés pendant `setup()`) ont été arrêtés.

  Utilisez ce hook pour nettoyer manuellement les effets de bord créés, tels que les minuteurs, les écouteurs d'événements du DOM ou les connexions au serveur.

  **Ce hook n'est pas appelé pendant le rendu côté serveur.**

## errorCaptured {#errorcaptured}

Appelé lorsqu'une erreur venant d'un composant descendant a été capturée.

- **Type :**

  ```ts
  interface ComponentOptions {
    errorCaptured?(
      this: ComponentPublicInstance,
      err: unknown,
      instance: ComponentPublicInstance | null,
      info: string
    ): boolean | void
  }
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

  Vous pouvez modifier l'état du composant dans `errorCaptured()` pour afficher un état d'erreur à l'utilisateur. Cependant, il est important de ne pas rendre le contenu original à l'origine de l'erreur, sinon le composant sera bloqué dans une boucle de rendu infinie.

  Le hook peut retourner `false` pour empêcher la propagation de l'erreur. Consultez les détails sur la propagation des erreurs ci-dessous.

  **Règles concernant la propagation des erreurs**

  - Par défaut, toutes les erreurs sont envoyées à [`app.config.errorHandler`](/api/application#app-config-errorhandler) au niveau de l'application si elle est définie, afin qu'elles puissent être signalées et analysées par un seul service à un seul endroit.

  - Si plusieurs hooks `errorCaptured` existent sur la chaîne descendante ou la chaîne ascendante d'un composant, ils seront tous invoqués sur la même erreur, suivant un ordre allant de bas en haut. Cela est comparable au mécanisme de _bubbling_ des événements natifs du DOM.

  - Si le hook `errorCaptured` lui-même lance une erreur, cette erreur et l'erreur capturée originellement sont envoyées à `app.config.errorHandler`.

  - Un hook `errorCaptured` peut retourner `false` pour empêcher l'erreur de se propager plus loin. Cela revient à dire "cette erreur a été traitée et doit être ignorée". Cela empêchera tout autre hook `errorCaptured` ou `app.config.errorHandler` d'être invoqué pour cette erreur.

  **Mises en garde concernant la capture d'erreurs**
  
    - Dans les composants avec la fonction asynchrone `setup()` (avec le *top-level* `await`) Vue **essayera toujours** de rendre le template du composant, même si `setup()` a lancé une erreur. Cela causera probablement plus d'erreurs parce que pendant le rendu, le template du composant peut essayer d'accéder à des propriétés inexistantes du contexte `setup()` qui a échoué. Lorsque vous capturez des erreurs dans de tels composants, soyez prêt à gérer les erreurs provenant à la fois de l'échec de la fonction asynchrone `setup()` (elles arriveront toujours en premier) et de l'échec du processus de rendu.

  - <sup class="vt-badge" data-text="SSR only"></sup> Remplacer le composant enfant erroné par le composant parent à l'intérieur de `<Suspense>` causera des erreurs d'hydratation dans SSR. Au lieu de cela, essayez de séparer la logique qui peut éventuellement être lancée depuis le `setup()` de l'enfant dans une fonction séparée et exécutez-la dans le `setup()` du composant parent, où vous pouvez en toute sécurité  capturer avec `try/catch` le processus d'exécution et faire le remplacement si nécessaire avant de rendre le composant enfant actuel.

## renderTracked <sup class="vt-badge dev-only" /> {#rendertracked}

Appelé lorsqu'une dépendance réactive a été traquée par l'effet de rendu du composant.

**Ce hook est réservé au mode développement et n'est pas appelé pendant le rendu côté serveur.**

- **Type :**

  ```ts
  interface ComponentOptions {
    renderTracked?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **Voir aussi** [La réactivité en détails](/guide/extras/reactivity-in-depth)

## renderTriggered <sup class="vt-badge dev-only" /> {#rendertriggered}

Appelé lorsqu'une dépendance réactive déclenche la ré-exécution de l'effet de rendu du composant.

**Ce hook est réservé au mode développement et n'est pas appelé pendant le rendu côté serveur.**

- **Type :**

  ```ts
  interface ComponentOptions {
    renderTriggered?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

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

## activated {#activated}

Appelé après l'insertion de l'instance du composant dans le DOM en tant que partie d'un arbre mis en cache par [`<KeepAlive>`](/api/built-in-components#keepalive).

**Ce hook n'est pas appelé pendant le rendu côté serveur.**

- **Type :**

  ```ts
  interface ComponentOptions {
    activated?(this: ComponentPublicInstance): void
  }
  ```

- **Voir aussi** [Guide - Cycle de vie d'une instance mise en cache](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## deactivated {#deactivated}

Appelé après que l'instance du composant ait été retirée du DOM en tant que partie d'un arbre mis en cache par [`<KeepAlive>`](/api/built-in-components#keepalive).

**Ce hook n'est pas appelé pendant le rendu côté serveur.**

- **Type :**

  ```ts
  interface ComponentOptions {
    deactivated?(this: ComponentPublicInstance): void
  }
  ```

- **Voir aussi** [Guide - Cycle de vie d'une instance mise en cache](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## serverPrefetch <sup class="vt-badge" data-text="SSR only" /> {#serverprefetch}

Fonction asynchrone qui doit être résolue avant que l'instance du composant ne soit rendue sur le serveur.

- **Type :**

  ```ts
  interface ComponentOptions {
    serverPrefetch?(this: ComponentPublicInstance): Promise<any>
  }
  ```

- **Détails**

  Si le hook renvoie une promesse, le moteur de rendu du serveur attendra qu'elle soit résolue avant d'effectuer le rendu du composant.

  Ce hook n'est appelé que pendant le rendu côté serveur et peut être utilisé pour effectuer une récupération de données sur le serveur uniquement.

- **Exemple**

  ```js
  export default {
    data() {
      return {
        data: null
      }
    },
    async serverPrefetch() {
      // le composant est rendu dans le cadre de la requête initiale.
      // les données sont pré-récupérées sur le serveur car cela est plus rapide que via le client.
      this.data = await fetchOnServer(/* ... */)
    },
    async mounted() {
      if (!this.data) {
        // si les données ne sont pas définies au moment du montage, cela signifie que le composant
        // est rendu dynamiquement sur le client.
        // Effectue la récupération côté client.
        this.data = await fetchOnClient(/* ... */)
      }
    }
  }
  ```

- **Voir aussi** [Rendu côté serveur](/guide/scaling-up/ssr)
