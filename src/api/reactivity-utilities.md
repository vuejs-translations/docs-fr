# API de la réactivité : Utilitaires {#reactivity-api-utilities}

## isRef() {#isref}

Vérifie si une valeur est un objet ref.

- **Type :**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  Notez que le type retourné est un [prédicat de type](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates), ce qui signifie que `isRef` peut être utilisée comme un garde de type :

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // le type de foo est déduit à Ref<unknown>
    foo.value
  }
  ```

## unref() {#unref}

Retourne la valeur interne si l'argument est une ref, sinon retourne l'argument lui-même. C'est une fonction de sucre synthétique équivalente à `val = isRef(val) ? val.value : val`.

- **Type :**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **Exemple :**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // unwrapped sera désormais un nombre
  }
  ```

## toRef() {#toref}

Peut être utilisée pour créer une ref pour une propriété sur un objet source réactif. La ref créée est synchronisée avec sa propriété source : la mutation de la propriété source mettra à jour la ref, et vice-versa.

- **Type :**

  ```ts
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **Exemple :**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const fooRef = toRef(state, 'foo')

  // muter la ref met à jour l'original
  fooRef.value++
  console.log(state.foo) // 2

  // muter l'original met également à jour la ref
  state.foo++
  console.log(fooRef.value) // 3
  ```

  Notez que cela est différent de :

  ```js
  const fooRef = ref(state.foo)
  ```

  La ref ci-dessus n'est **pas** synchronisée avec `state.foo`, car la fonction `ref()` reçoit une simple valeur numérique.

  `toRef()` est utile quand vous voulez passer la ref d'une prop à une fonction composable :

  ```vue
  <script setup>
  import { toRef } from 'vue'

  const props = defineProps(/* ... */)

  // convertit `props.foo` en une ref, puis la passe
  // à un composable
  useSomeFeature(toRef(props, 'foo'))
  </script>
  ```

  Lorsque `toRef` est utilisée avec des props de composant, les restrictions classiques concernant la modification des props s'appliquent. Tenter d'assigner une nouvelle valeur à la ref équivaut à essayer de modifier directement la prop et n'est pas autorisé. Dans ce cas, vous pouvez envisager d'utiliser [`computed`](./reactivity-core.html#computed) avec `get` et `set` à la place. Consultez le guide expliquant comment [utiliser `v-model` avec les composants](/guide/components/v-model) pour plus d'informations.

  `toRef()` retournera une ref utilisable même si la propriété source n'existe pas actuellement. Cela permet de travailler avec des propriétés optionnelles, qui ne seraient pas prises en compte par [`toRefs`](#torefs).

## toRefs() {#torefs}

Convertit un objet réactif en un objet simple où chaque propriété de l'objet résultant est une ref pointant vers la propriété correspondante de l'objet original. Chaque ref individuelle est créée en utilisant [`toRef()`](#toref).

- **Type :**

  ```ts
  function toRefs<T extends object>(
    object: T
  ): {
    [K in keyof T]: ToRef<T[K]>
  }

  type ToRef = T extends Ref ? T : Ref<T>
  ```

- **Exemple :**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const stateAsRefs = toRefs(state)
  /*
  Type de stateAsRefs: {
    foo: Ref<number>,
    bar: Ref<number>
  }
  */

  // La ref et la propriété originale sont "liée"
  state.foo++
  console.log(stateAsRefs.foo.value) // 2

  stateAsRefs.foo.value++
  console.log(state.foo) // 3
  ```

  `toRefs` est utile pour retourner un objet réactif à partir d'une fonction composable afin que le composant consommateur puisse déstructurer / répartir l'objet renvoyé sans perdre sa réactivité :

  ```js
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })

    // ...opération logique sur l'état

    // conversion en refs lors du retour
    return toRefs(state)
  }

  // destructuration possible sans perte de réactivité
  const { foo, bar } = useFeatureX()
  ```

  `toRefs` ne générera des refs que pour les propriétés qui sont énumérables sur l'objet source au moment de l'appel. Pour créer une ref pour une propriété qui n'existe peut-être pas encore, utilisez plutôt [`toRef`](#toref).

## isProxy() {#isproxy}

Vérifie si un objet est un proxy créé par [`reactive()`](./reactivity-core.html#reactive), [`readonly()`](./reactivity-core.html#readonly), [`shallowReactive()`](./reactivity-advanced.html#shallowreactive) ou [`shallowReadonly()`](./reactivity-advanced.html#shallowreadonly).

- **Type :**

  ```ts
  function isProxy(value: unknown): boolean
  ```

## isReactive() {#isreactive}

Vérifie si un objet est un proxy créé par [`reactive()`](./reactivity-core.html#reactive) ou [`shallowReactive()`](./reactivity-advanced.html#shallowreactive).

- **Type :**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly() {#isreadonly}

Vérifie si la valeur passée est un objet en lecture seule. Les propriétés d'un objet en lecture seule peuvent varier, mais elles ne peuvent pas être assignées directement via l'objet passé.

Les proxys créés par [`readonly()`](./reactivity-core.html#readonly) et [`shallowReadonly()`(./reactivity-advanced.html#shallowreadonly) sont tous deux considérés comme en lecture seule, tout comme une ref [`computed()`](./reactivity-core.html#computed) sans fonction `set`.

- **Type :**

  ```ts
  function isReadonly(value: unknown): boolean
  ```
