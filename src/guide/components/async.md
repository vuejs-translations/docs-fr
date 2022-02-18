# Async Components

## Basic Usage

In large applications, we may need to divide the app into smaller chunks and only load a component from the server when it's needed. To make that possible, Vue has a [`defineAsyncComponent`](/api/general.html#defineasynccomponent) function:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...load component from server
    resolve(/* loaded component */)
  })
})
// ... use `AsyncComp` like a normal component
```

As you can see, `defineAsyncComponent` accepts a loader function that returns a Promise. The Promise's `resolve` callback should be called when you have retrieved your component definition from the server. You can also call `reject(reason)` to indicate the load has failed.

[ES module dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports) also returns a Promise, so most of the time we will use it in combination with `defineAsyncComponent`. Bundlers like Vite and webpack also support the syntax, so we can use it to import Vue SFCs:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

The resulting `AsyncComp` is a wrapper component that only calls the loader function when it is actually rendered on the page. In addition, it will pass along any props to the inner component, so you can use the async wrapper to seamlessly replace the original component while achieving lazy loading.

<div class="options-api">

You can also use `defineAsyncComponent` when [registering a component locally](/guide/components/registration.html#local-registration):

```js
import { defineAsyncComponent } from 'vue'

export default {
  // ...
  components: {
    AsyncComponent: defineAsyncComponent(() =>
      import('./components/AsyncComponent.vue')
    )
  }
}
```

</div>

## Loading and Error States

Asynchronous operations inevitably involve loading and error states - `defineAsyncComponent()` supports handling these states via advanced options:

```js
const AsyncComp = defineAsyncComponent({
  // the loader function
  loader: () => import('./Foo.vue'),

  // A component to use while the async component is loading
  loadingComponent: LoadingComponent,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,

  // A component to use if the load fails
  errorComponent: ErrorComponent,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000
})
```

If a loading component is provided, it will be displayed first while the inner component is being loaded. There is a default 200ms delay before the loading component is shown - this is because on fast networks, an instant loading state may get replaced too fast and end up looking like a flicker.

If an error component is provided, it will be displayed when the Promise returned by the loader function is rejected. You can also specify a timeout to show the error component when the request is taking too long.

## Using with Suspense

Async components can be used with the `<Suspense>` built-in component. The interaction between `<Suspense>` and async components are documented in the [dedicated chapter for `<Suspense>`](/guide/built-ins/suspense.html).
