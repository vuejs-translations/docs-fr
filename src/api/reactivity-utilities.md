# Reactivity API: Utilities

## isRef()

Checks if a value is a ref object.

- **Type**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  Note the return type is a [type predicate](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards), which means `isRef` can be used as a type guard:

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // foo's type is narrowed to Ref<unknown>
    foo.value
  }
  ```

## unref()

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

## toRef()

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

  The above ref is **not** synced with `state.foo`, because the `ref()` receives a plain string value.

  `toRef()` is useful when you want to pass the ref of a prop to a composable function:

  ```vue
  <script setup>
  const props = defineProps(/* ... */)

  // convert `props.foo` into a ref, then pass into
  // a composable
  useSomeFeature(toRef(props, 'foo'))
  </script>
  ```

  `toRef()` will return a usable ref even if the source property doesn't currently exist. This makes it especially useful when working with optional props, which wouldn't be picked up by [`toRefs`](#torefs).

## toRefs()

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

## isProxy()

Checks if an object is a proxy created by [`reactive()`](./reactivity-core.html#reactive), [`readonly()`](./reactivity-core.html#readonly), [`shallowReactive()`](./reactivity-advanced.html#shallowreactive) or [`shallowReadonly()`](./reactivity-advanced.html#shallowreadonly).

- **Type**

  ```ts
  function isProxy(value: unknown): boolean
  ```

## isReactive()

Checks if an object is a proxy created by [`reactive()`](./reactivity-core.html#reactive) or [`shallowReactive()`](./reactivity-advanced.html#shallowreactive).

- **Type**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly()

Checks if an object is a proxy created by [`readonly()`](./reactivity-core.html#readonly) or [`shallowReadonly()`](./reactivity-advanced.html#shallowreadonly).

- **Type**

  ```ts
  function isReadonly(value: unknown): boolean
  ```
