# Reactivity API: Utilities {#reactivity-api-utilities}

## isRef() {#isref}

Checks if a value is a ref object.

- **Type**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  Note the return type is a [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates), which means `isRef` can be used as a type guard:

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // foo's type is narrowed to Ref<unknown>
    foo.value
  }
  ```

## unref() {#unref}

Returns the inner value if the argument is a ref, otherwise return the argument itself. This is a sugar function for `val = isRef(val) ? val.value : val`.

- **Type**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **Example**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // unwrapped is guaranteed to be number now
  }
  ```

## toRef() {#toref}

Can be used to create a ref for a property on a source reactive object. The created ref is synced with its source property: mutating the source property will update the ref, and vice-versa.

- **Type**

  ```ts
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **Example**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const fooRef = toRef(state, 'foo')

  // mutating the ref updates the original
  fooRef.value++
  console.log(state.foo) // 2

  // mutating the original also updates the ref
  state.foo++
  console.log(fooRef.value) // 3
  ```

  Note this is different from:

  ```js
  const fooRef = ref(state.foo)
  ```

  The above ref is **not** synced with `state.foo`, because the `ref()` receives a plain number value.

  `toRef()` is useful when you want to pass the ref of a prop to a composable function:

  ```vue
  <script setup>
  import { toRef } from 'vue'
  
  const props = defineProps(/* ... */)

  // convert `props.foo` into a ref, then pass into
  // a composable
  useSomeFeature(toRef(props, 'foo'))
  </script>
  ```

  When `toRef` is used with component props, the usual restrictions around mutating the props still apply. Attempting to assign a new value to the ref is equivalent to trying to modify the prop directly and is not allowed. In that scenario you may want to consider using [`computed`](./reactivity-core.html#computed) with `get` and `set` instead. See the guide to [using `v-model` with components](/guide/components/events.html#usage-with-v-model) for more information.

  `toRef()` will return a usable ref even if the source property doesn't currently exist. This makes it possible to work with optional properties, which wouldn't be picked up by [`toRefs`](#torefs).

## toRefs() {#torefs}

Converts a reactive object to a plain object where each property of the resulting object is a ref pointing to the corresponding property of the original object. Each individual ref is created using [`toRef()`](#toref).

- **Type**

  ```ts
  function toRefs<T extends object>(
    object: T
  ): {
    [K in keyof T]: ToRef<T[K]>
  }

  type ToRef = T extends Ref ? T : Ref<T>
  ```

- **Example**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const stateAsRefs = toRefs(state)
  /*
  Type of stateAsRefs: {
    foo: Ref<number>,
    bar: Ref<number>
  }
  */

  // The ref and the original property is "linked"
  state.foo++
  console.log(stateAsRefs.foo.value) // 2

  stateAsRefs.foo.value++
  console.log(state.foo) // 3
  ```

  `toRefs` is useful when returning a reactive object from a composable function so that the consuming component can destructure/spread the returned object without losing reactivity:

  ```js
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })

    // ...logic operating on state

    // convert to refs when returning
    return toRefs(state)
  }

  // can destructure without losing reactivity
  const { foo, bar } = useFeatureX()
  ```

  `toRefs` will only generate refs for properties that are enumerable on the source object at call time. To create a ref for a property that may not exist yet, use [`toRef`](#toref) instead.

## isProxy() {#isproxy}

Checks if an object is a proxy created by [`reactive()`](./reactivity-core.html#reactive), [`readonly()`](./reactivity-core.html#readonly), [`shallowReactive()`](./reactivity-advanced.html#shallowreactive) or [`shallowReadonly()`](./reactivity-advanced.html#shallowreadonly).

- **Type**

  ```ts
  function isProxy(value: unknown): boolean
  ```

## isReactive() {#isreactive}

Checks if an object is a proxy created by [`reactive()`](./reactivity-core.html#reactive) or [`shallowReactive()`](./reactivity-advanced.html#shallowreactive).

- **Type**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly() {#isreadonly}

Checks whether the passed value is a readonly object. The properties of a readonly object can change, but they can't be assigned directly via the passed object.

The proxies created by [`readonly()`](./reactivity-core.html#readonly) and [`shallowReadonly()`](./reactivity-advanced.html#shallowreadonly) are both considered readonly, as is a [`computed()`](./reactivity-core.html#computed) ref without a `set` function.

- **Type**

  ```ts
  function isReadonly(value: unknown): boolean
  ```
