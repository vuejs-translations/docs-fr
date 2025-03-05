---
pageClass: api
---

# Composants natifs {#built-in-components}

:::info Enregistrement et utilisation
Les composants natifs peuvent être utilisés directement dans les templates sans avoir besoin d'être enregistrés. Ils ne sont inclus dans le build que lorsqu'ils sont utilisés.

Lorsqu'on les utilise dans les [fonctions de rendu](/guide/extras/render-function), il faut les importer explicitement. Par exemple :

```js
import { h, Transition } from 'vue'

h(Transition, {
  /* props */
})
```

:::

## `<Transition>` {#transition}

Fournit des effets de transition animés à **un seul** élément ou composant.

- **Props :**

  ```ts
  interface TransitionProps {
    /**
     * Utilisé pour générer automatiquement des noms de classe pour les transitions CSS
     * par exemple `name: 'fade'` s'étendra automatiquement à `.fade-enter`,
     * `.fade-enter-active`, etc.
     */
    name?: string
    /**
     * S'il faut appliquer les classes de transition CSS ou non
     * Par défaut: true
     */
    css?: boolean
    /**
     * Spécifie le type d'événements de transition à attendre pour
     * déterminer le moment de la fin de la transition.
     * Le comportement par défaut consiste à détecter automatiquement le type qui a
     * la plus longue durée.
     */
    type?: 'transition' | 'animation'
    /**
     * Spécifie les durées explicites de la transition.
     * Le comportement par défaut consiste à attendre le premier événement `transitionend`.
     * ou `animationend` sur l'élément de transition racine.
     */
    duration?: number | { enter: number; leave: number }
    /**
     * Contrôle la séquence temporelle des transitions de sortie/entrée.
     * Simultané par défaut.
     */
    mode?: 'in-out' | 'out-in' | 'default'
    /**
     * Si la transition doit être appliquée au rendu initial ou non.
     * Par défaut: false
     */
    appear?: boolean

    /**
     * Props pour la personnaliser les classes de transition.
     * Utilisez kebab-case dans les templates, par exemple enter-from-class="xxx"
     */
    enterFromClass?: string
    enterActiveClass?: string
    enterToClass?: string
    appearFromClass?: string
    appearActiveClass?: string
    appearToClass?: string
    leaveFromClass?: string
    leaveActiveClass?: string
    leaveToClass?: string
  }
  ```

- **Événements :**

  - `@before-enter`
  - `@before-leave`
  - `@enter`
  - `@leave`
  - `@appear`
  - `@after-enter`
  - `@after-leave`
  - `@after-appear`
  - `@enter-cancelled`
  - `@leave-cancelled` (`v-show` only)
  - `@appear-cancelled`

- **Exemple**

  Élément simple :

  ```vue-html
  <Transition>
    <div v-if="ok">toggled content</div>
  </Transition>
  ```

  Transition forcée en modifiant l'attribut `key` :

  ```vue-html
  <Transition>
    <div :key="text">{{ text }}</div>
  </Transition>
  ```

  Composant dynamique, avec mode de transition + animation à l'apparition :

  ```vue-html
  <Transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </Transition>
  ```

  Écoute des événements de transition :

  ```vue-html
  <Transition @after-enter="onTransitionComplete">
    <div v-show="ok">toggled content</div>
  </Transition>
  ```

- **Voir aussi** [Guide sur `<Transition>`](/guide/built-ins/transition)

## `<TransitionGroup>` {#transitiongroup}

Fournit des effets de transition pour de **multiples** éléments ou composants dans une liste.

- **Props :**

  `<TransitionGroup>` accepte les mêmes props que `<Transition>` à l'exception de `mode`, plus deux props additionnelles :

  ```ts
  interface TransitionGroupProps extends Omit<TransitionProps, 'mode'> {
    /**
     * S'il n'est pas défini, le rendu sera un fragment.
     */
    tag?: string
    /**
     * Pour personnaliser la classe CSS appliquée lors des transitions de mouvement.
     * Utilisez kebab-case dans les templates, par exemple move-class="xxx"
     */
    moveClass?: string
  }
  ```

- **Événements :**

  `<TransitionGroup>` émet les mêmes événements que `<Transition>`.

- **Détails**

  Par défaut, `<TransitionGroup>` ne rend pas d'élément du DOM en enveloppant d'autres, mais on peut en définir un via la prop `tag`.

  Notez que chaque enfant d'un `<transition-group>` doit avoir une [**clé unique**](/guide/essentials/list#maintaining-state-with-key) pour que les animations fonctionnent correctement.

  `<TransitionGroup>` prend en charge les transitions de mouvement via une transformation CSS. Lorsque la position d'un enfant à l'écran a changé après une mise à jour, il se verra appliquer une classe CSS de mouvement (générée automatiquement à partir de l'attribut `name` ou configurée avec la prop `move-class`). Si la propriété CSS `transform` est "transition-able" lorsque la classe de mouvement est appliquée, l'élément sera animé en douceur vers sa destination en utilisant la [technique FLIP](https://aerotwist.com/blog/flip-your-animations/).

- **Exemple**

  ```vue-html
  <TransitionGroup tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>
  ```

- **Voir aussi** [Guide - TransitionGroup](/guide/built-ins/transition-group)

## `<KeepAlive>` {#keepalive}

Met en cache les composants activés dynamiquement qui y sont imbriqués.

- **Props :**

  ```ts
  interface KeepAliveProps {
    /**
     * Si spécifié, seuls les composants dont les noms correspondent à
     * `include` seront mis en cache.
     */
    include?: MatchPattern
    /**
     * Un composant avec un nom ne correspondant pas à  `exclude` ne sera
     * pas mis en cache.
     */
    exclude?: MatchPattern
    /**
     * Le nombre maximum d'instances de composant à mettre en cache.
     */
    max?: number | string
  }

  type MatchPattern = string | RegExp | (string | RegExp)[]
  ```

- **Détails**

  Lorsqu'il enveloppe un composant dynamique, `<KeepAlive>` met en cache les instances inactives du composant sans les détruire.

  Il ne peut y avoir qu'une seule instance de composant active comme enfant direct de `<KeepAlive>` à un moment donné.

Lorsqu'un composant est activé/désactivé à l'intérieur de `<KeepAlive>`, ses hooks de cycle de vie `activated` et `deactivated` seront invoqués en conséquence, fournissant une alternative à `mounted` et `unmounted`, qui ne sont pas appelés. Ceci s'applique à l'enfant direct de `<KeepAlive>` ainsi qu'à tous ses descendants.

- **Exemple**

  Utilisation basique :

  ```vue-html
  <KeepAlive>
    <component :is="view"></component>
  </KeepAlive>
  ```

  Lorsqu'il est utilisé avec les branches `v-if` / `v-else`, il ne doit y avoir qu'un seul composant rendu à la fois :

  ```vue-html
  <KeepAlive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </KeepAlive>
  ```

  Utilisé en combinaison avec `<Transition>` :

  ```vue-html
  <Transition>
    <KeepAlive>
      <component :is="view"></component>
    </KeepAlive>
  </Transition>
  ```

  En utilisant `include` / `exclude` :

  ```vue-html
  <!-- chaîne de caractères délimitée par des virgules -->
  <KeepAlive include="a,b">
    <component :is="view"></component>
  </KeepAlive>

  <!-- regex (utilisez `v-bind`) -->
  <KeepAlive :include="/a|b/">
    <component :is="view"></component>
  </KeepAlive>

  <!-- Tableau (utilisez `v-bind`) -->
  <KeepAlive :include="['a', 'b']">
    <component :is="view"></component>
  </KeepAlive>
  ```

  Utilisation avec `max` :

  ```vue-html
  <KeepAlive :max="10">
    <component :is="view"></component>
  </KeepAlive>
  ```

- **Voir aussi** [Guide - KeepAlive](/guide/built-ins/keep-alive)

## `<Teleport>` {#teleport}

Rend le contenu de son slot à une autre partie du DOM.

- **Props :**

  ```ts
  interface TeleportProps {
    /**
     * Requis. Spécifie le conteneur cible.
     * Peut être un sélecteur ou un élément.
     */
    to: string | HTMLElement
    /**
     * S'il vaut `true`, le contenu restera à son emplacement
     * original au lieu d'être déplacé dans le conteneur cible.
     * Peut être changé de manière dynamique.
     */
    disabled?: boolean
    /**
     * Lorsque la valeur est `true`, le traitement de Teleport sera reporté jusqu'à ce que d'autres
     * parties de l'application aient été montées avant
     * de résoudre sa cible. (A partir de la version 3.5)
     */
    defer?: boolean
  }
  ```

- **Exemple**

  En spécifiant le conteneur cible :

  ```vue-html
  <Teleport to="#some-id" />
  <Teleport to=".some-class" />
  <Teleport to="[data-teleport]" />
  ```

  En le désactivant de manière conditionnelle :

  ```vue-html
  <Teleport to="#popup" :disabled="displayVideoInline">
    <video src="./my-movie.mp4">
  </Teleport>
  ```

  Différer la résolution du conteneur cible <sup class="vt-badge" data-text="3.5+" /> :

  ```vue-html
  <Teleport defer to="#late-div">...</Teleport>

  <!-- plus loins dans le template -->
  <div id="late-div"></div>
  ```

- **Voir aussi** [Guide - Teleport](/guide/built-ins/teleport)

## `<Suspense>` <sup class="vt-badge experimental" /> {#suspense}

Utilisé pour orchestrer des dépendances asynchrones imbriquées dans un arbre de composants.

- **Props :**

  ```ts
  interface SuspenseProps {
    timeout?: string | number
    suspensible?: boolean
  }
  ```

- **Événements :**

  - `@resolve`
  - `@pending`
  - `@fallback`

- **Détails**

  `<Suspense>` accepte deux slots : le slot `#default` et le slot `#fallback`. Il affichera le contenu du slot de secours tout en rendant le slot par défaut en mémoire.

  S'il rencontre des dépendances asynchrones ([Composants asynchrones](/guide/components/async) et des composants avec [`async setup()`](/guide/built-ins/suspense#async-setup)) lors du rendu du slot par défaut, il attendra qu'elles soient toutes résolues avant d'afficher le slot par défaut.

  En définissant Suspense comme `suspensible`, toutes les dépendances asynchrones seront gérées par le Suspense parent. Voir [les détails d'implémentation](https://github.com/vuejs/core/pull/6736)

- **Voir aussi** [Guide - Suspense](/guide/built-ins/suspense)
