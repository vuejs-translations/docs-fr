# API du rendu côté serveur {#server-side-rendering-api}

## renderToString() {#rendertostring}

- **Exporté depuis `vue/server-renderer`**

- **Type :**

  ```ts
  function renderToString(
    input: App | VNode,
    context?: SSRContext
  ): Promise<string>
  ```

- **Exemple**

  ```js
  import { createSSRApp } from 'vue'
  import { renderToString } from 'vue/server-renderer'

  const app = createSSRApp({
    data: () => ({ msg: 'hello' }),
    template: `<div>{{ msg }}</div>`
  })

  ;(async () => {
    const html = await renderToString(app)
    console.log(html)
  })()
  ```

  ### Contexte SSR {#ssr-context}

  Vous pouvez passer un objet facultatif représentant le contexte, et pouvant être utilisé pour enregistrer des données supplémentaires pendant le rendu, par exemple pour [accéder au contenu des Teleports](/guide/scaling-up/ssr#teleports) :

  ```js
  const ctx = {}
  const html = await renderToString(app, ctx)

  console.log(ctx.teleports) // { '#teleported': 'teleported content' }
  ```

  La plupart des autres API de SSR présentées sur cette page acceptent également de manière facultative un objet de contexte. L'objet de contexte est accessible dans le code du composant via l'utilitaire [useSSRContext](#usessrcontext).

- **Voir aussi** [Guide - Rendu côté serveur](/guide/scaling-up/ssr)

## renderToNodeStream() {#rendertonodestream}

Effectue le rendu de l'entrée comme un [_Readable Stream_ de Node.js](https://nodejs.org/api/stream.html#stream_class_stream_readable).

- **Exporté depuis `vue/server-renderer`**

- **Type :**

  ```ts
  function renderToNodeStream(
    input: App | VNode,
    context?: SSRContext
  ): Readable
  ```

- **Exemple**

  ```js
  // à l'intérieur d'un gestionnaire http Node.js
  renderToNodeStream(app).pipe(res)
  ```

  :::tip Remarque
  Cette méthode n'est pas supportée dans le build ESM de `vue/server-renderer`, qui est n'est pas couplé aux environnements Node.js. Utilisez plutôt [`pipeToNodeWritable`](#pipetonodewritable).
  :::

## pipeToNodeWritable() {#pipetonodewritable}

Effectue le rendu et le transfert vers une instance existante d'un [_Writable Stream_ de Node.js](https://nodejs.org/api/stream.html#stream_writable_streams).

- **Exporté depuis `vue/server-renderer`**

- **Type :**

  ```ts
  function pipeToNodeWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: Writable
  ): void
  ```

- **Exemple**

  ```js
  // à l'intérieur d'un gestionnaire http Node.js
  pipeToNodeWritable(app, {}, res)
  ```

## renderToWebStream() {#rendertowebstream}

Effectue le rendu de l'entrée sous forme d'un [_Readable Stream_ web](https://developer.mozilla.org/fr/docs/Web/API/Streams_API).

- **Exporté depuis `vue/server-renderer`**

- **Type :**

  ```ts
  function renderToWebStream(
    input: App | VNode,
    context?: SSRContext
  ): ReadableStream
  ```

- **Exemple**

  ```js
  // dans un environnement prenant en charge _ReadableStream_
  return new Response(renderToWebStream(app))
  ```

  :::tip Remarque
  Dans les environnements n'exposant pas le constructeur `ReadableStream` dans la portée globale, [`pipeToWebWritable()`](#pipetowebwritable) doit être utilisée à la place.
  :::

## pipeToWebWritable() {#pipetowebwritable}

Effectue le rendu et le transfert à une instance existante d'un [_Writable Stream_ web](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream).

- **Exporté depuis `vue/server-renderer`**

- **Type :**

  ```ts
  function pipeToWebWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: WritableStream
  ): void
  ```

- **Exemple**

  Cette fonction est généralement utilisée en combinaison avec [`TransformStream`](https://developer.mozilla.org/fr/docs/Web/API/TransformStream) :

  ```js
  // TransformStream est disponible dans des environnements tels que les espaces de travail de CloudFlare.
  // dans Node.js, TransformStream doit être explicitement importé à partir de 'stream/web'
  const { readable, writable } = new TransformStream()
  pipeToWebWritable(app, {}, writable)

  return new Response(readable)
  ```

## renderToSimpleStream() {#rendertosimplestream}

Effectue le rendu de l'entrée en mode streaming en utilisant une simple interface lisible.

- **Exporté depuis `vue/server-renderer`**

- **Type :**

  ```ts
  function renderToSimpleStream(
    input: App | VNode,
    context: SSRContext,
    options: SimpleReadable
  ): SimpleReadable

  interface SimpleReadable {
    push(content: string | null): void
    destroy(err: any): void
  }
  ```

- **Exemple**

  ```js
  let res = ''

  renderToSimpleStream(
    app,
    {},
    {
      push(chunk) {
        if (chunk === null) {
          // terminé
          console(`render complete: ${res}`)
        } else {
          res += chunk
        }
      },
      destroy(err) {
        // erreur rencontrée
      }
    }
  )
  ```

## useSSRContext() {#usessrcontext}

Une API d'exécution utilisée pour récupérer l'objet de contexte transmis à `renderToString()` ou à d'autres API de rendu serveur.

- **Type :**

  ```ts
  function useSSRContext<T = Record<string, any>>(): T | undefined
  ```

- **Exemple**

  Le contexte récupéré peut être utilisé pour joindre les informations nécessaires au rendu du HTML final (par exemple, les métadonnées de l'en-tête).

  ```vue
  <script setup>
  import { useSSRContext } from 'vue'

  // ne l'appelez que lors du rendu côté serveur
  // https://vitejs.dev/guide/ssr.html#conditional-logic
  if (import.meta.env.SSR) {
    const ctx = useSSRContext()
    // ...attache des propriétés au contexte
  }
  </script>
  ```

## data-allow-mismatch <sup class="vt-badge" data-text="3.5+" /> {#data-allow-mismatch}

A special attribute that can be used to suppress [hydration mismatch](/guide/scaling-up/ssr#hydration-mismatch) warnings.

- **Example**

  ```html
  <div data-allow-mismatch="text">{{ data.toLocaleString() }}</div>
  ```

  The value can limit the allowed mismatch to a specific type. Allowed values are:

  - `text`
  - `children` (only allows mismatch for direct children)
  - `class`
  - `style`
  - `attribute`

  If no value is provided, all types of mismatches will be allowed.
