# Composition API: <br>Injection de dépendances {#composition-api-dependency-injection}

## provide() {#provide}

Fournit une valeur qui peut être injectée par les composants descendants.

- **Type :**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **Détails**

  `provide()` prend deux arguments : la clé, qui peut être une chaîne de caractères ou un symbole, et la valeur à injecter.

  En utilisant TypeScript, la clé peut être un symbole casté en tant que `InjectionKey` - un type utilitaire fourni par Vue qui étend `Symbol`, qui peut être utilisé pour synchroniser le type de valeur entre `provide()` et `inject()`.

  Comme pour les API d'enregistrement des hooks de cycle de vie, `provide()` doit être appelée de manière synchrone pendant la phase `setup()` d'un composant.

- **Exemple**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // fournit une valeur statique
  provide('path', '/project/')

  // fournit une valeur réactive
  const count = ref(0)
  provide('count', count)

  // fournit des clés de symboles
  provide(countSymbol, count)
  </script>
  ```

- **Voir aussi**
  - [Guide - Provide / Inject](/guide/components/provide-inject)
  - [Guide - Typer Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## inject() {#inject}

Injecte une valeur fournie par un composant ancêtre ou par l'application (via `app.provide()`).

- **Type :**

  ```ts
  // sans valeur par défaut
  function inject<T>(key: InjectionKey<T> | string): T | undefined

  // avec valeur par défaut
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

  // en utilisant une fonction factory
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

- **Détails**

  Le premier argument est la clé d'injection. Vue remontera la chaîne des parents pour localiser une valeur fournie avec une clé correspondante. Si plusieurs composants de la chaîne des parents fournissent la même clé, celui qui est le plus proche du composant qui injecte la valeur l'emportera sur ceux qui sont plus haut dans la chaîne. Si aucune valeur avec la clé correspondante n'a été trouvée, `inject()` renvoie `undefined` sauf si une valeur par défaut est fournie.

  Le second argument est optionnel et représente la valeur par défaut à utiliser si aucune valeur correspondante n'a été trouvée.

  Il peut aussi être une fonction _factory_ pour retourner des valeurs qui sont coûteuses à créer. Dans ce cas, la valeur `true` doit être passée comme troisième argument pour indiquer que la fonction doit être utilisée comme une _factory_ au lieu de la valeur elle-même.

  Comme pour les API d'enregistrement des hooks de cycle de vie, `inject()` doit être appelée de manière synchrone pendant la phase `setup()` d'un composant.

  En utilisant TypeScript, la clé peut être de type `InjectionKey` - un type utilitaire fourni par Vue qui étend `Symbol`, qui peut être utilisé pour synchroniser le type de valeur entre `provide()` et `inject()`.

- **Exemple**

  En supposant qu'un composant parent a fourni des valeurs comme indiqué dans l'exemple précédent concernant `provide()` :

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // injecte une valeur statique par défaut
  const path = inject('path')

  // injecte une valeur réactive
  const count = inject('count')

  // injection avec des clés de symboles
  const count2 = inject(countSymbol)

  // injection avec une valeur par défaut
  const bar = inject('path', '/default-path')

  // injection avec une valeur par défaut via une fonction factory
  const baz = inject('foo', () => new Map())

  // injection avec la valeur par défaut de la fonction, en passant le 3ème argument
  const fn = inject('function', () => {}, false)
  </script>
  ```

- **Voir aussi**
  - [Guide - Provide / Inject](/guide/components/provide-inject)
  - [Guide - Typer Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## hasInjectionContext() {#has-injection-context}

- Supporté à partir de la version 3.3

Retourne vraie si [inject()](#inject) peut être utilisé sans avertissement sur le fait d'être appelée au mauvais endroit (par exemple en dehors de `setup()`). Cette méthode est conçue pour être utilisée par les bibliothèques qui veulent utiliser `inject()` en interne sans déclencher d'avertissement pour l'utilisateur final.

- **Type**

  ```ts
  function hasInjectionContext(): boolean
  ```
