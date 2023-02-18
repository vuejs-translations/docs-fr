# API du rendu de fonction {#render-function-apis}

## h() {#h}

Créé des nœuds virtuels du DOM (vnodes).

- **Type :**

  ```ts
  // signature complète
  function h(
    type: string | Component,
    props?: object | null,
    children?: Children | Slot | Slots
  ): VNode

  // en omettant des props
  function h(type: string | Component, children?: Children | Slot): VNode

  type Children = string | number | boolean | VNode | null | Children[]

  type Slot = () => Children

  type Slots = { [name: string]: Slot }
  ```

  > Le type est simplifié dans un souci de lisibilité.

- **Détails :**

  Le premier argument peut être une chaîne de caractères (pour les éléments natifs) ou une définition de composant Vue. Le deuxième argument est la props à passer, et le troisième argument représente les enfants.

  Lors de la création d'un vnode de composant, les enfants doivent être passés en tant que fonctions slot. Une seule fonction slot peut être transmise si le composant n'attend que le slot par défaut. Sinon, les slots doivent être passés comme un objet de fonctions slot.

  Pour des raisons pratiques, l'argument props peut être omis lorsque les enfants ne sont pas un objet slots.

- **Exemple :**

  Création d'éléments natifs :

  ```js
  import { h } from 'vue'

  // tous les arguments, à l'exception du type, sont optionnels
  h('div')
  h('div', { id: 'foo' })

  // les attributs ainsi que les propriétés peuvent être utilisées dans les props
  // Vue choisit automatiquement la bonne façon de les assigner
  h('div', { class: 'bar', innerHTML: 'hello' })

  // pour les classes et les styles, les valeurs d'objet / tableau
  // sont prises en charges, tout comme dans les templates
  h('div', { class: [foo, { bar }], style: { color: 'red' } })

  // les écouteurs d'événements doivent être passés suivant le format onXxx
  h('div', { onClick: () => {} })

  // les enfants peuvent être des chaînes de caractères
  h('div', { id: 'foo' }, 'hello')

  // on peut omettre les props lorsqu'il n'y en a pas
  h('div', 'hello')
  h('div', [h('span', 'hello')])

  // les tableaux d'enfants peuvent contenir à la fois des vnodes et des chaînes de caractères
  h('div', ['hello', h('span', 'hello')])
  ```

  Création d'un composant :

  ```js
  import Foo from './Foo.vue'

  // passage de props
  h(Foo, {
    // équivalent à some-prop="hello"
    someProp: 'hello',
    // équivalent à @update="() => {}"
    onUpdate: () => {}
  })

  // passage d'un unique slot par défaut
  h(Foo, () => 'default slot')

  // passage de slots nommés
  // notez que `null` est nécessaire pour éviter
  // à l'objet de slots d'être traité en tant que props
  h(MyComponent, null, {
    default: () => 'default slot',
    foo: () => h('div', 'foo'),
    bar: () => [h('span', 'one'), h('span', 'two')]
  })
  ```

- **Voir aussi :** [Guide - Fonctions de rendu - Créer des Vnodes](/guide/extras/render-function.html#creating-vnodes)

## mergeProps() {#mergeprops}

Fusionne plusieurs objets de props avec un traitement spécial pour certaines props.

- **Type :**

  ```ts
  function mergeProps(...args: object[]): object
  ```

- **Details**

  `mergeProps()` supports merging multiple props objects with special handling for the following props:

  - `class`
  - `style`
  - `onXxx` event listeners - multiple listeners with the same name will be merged into an array.

  If you do not need the merge behavior and want simple overwrites, native object spread can be used instead.

- **Example**

  ```js
  import { mergeProps } from 'vue'

  const one = {
    class: 'foo',
    onClick: handlerA
  }

  const two = {
    class: { bar: true },
    onClick: handlerB
  }

  const merged = mergeProps(one, two)
  /**
   {
     class: 'foo bar',
     onClick: [handlerA, handlerB]
   }
   */
  ```

## cloneVNode() {#clonevnode}

Clones a vnode.

- **Type**

  ```ts
  function cloneVNode(vnode: VNode, extraProps?: object): VNode
  ```

- **Details**

  Returns a cloned vnode, optionally with extra props to merge with the original.

  Vnodes should be considered immutable once created, and you should not mutate the props of an existing vnode. Instead, clone it with different / extra props.

  Vnodes have special internal properties, so cloning them is not as simple as an object spread. `cloneVNode()` handles most of the internal logic.

- **Example**

  ```js
  import { h, cloneVNode } from 'vue'

  const original = h('div')
  const cloned = cloneVNode(original, { id: 'foo' })
  ```

## isVNode() {#isvnode}

Checks if a value is a vnode.

- **Type**

  ```ts
  function isVNode(value: unknown): boolean
  ```

## resolveComponent() {#resolvecomponent}

For manually resolving a registered component by name.

- **Type**

  ```ts
  function resolveComponent(name: string): Component | string
  ```

- **Details**

  **Note: you do not need this if you can import the component directly.**

  `resolveComponent()` must be called inside<span class="composition-api"> either `setup()` or</span> the render function in order to resolve from the correct component context.

  If the component is not found, a runtime warning will be emitted, and the name string is returned.

- **Example**

  <div class="composition-api">

  ```js
  const { h, resolveComponent } = Vue

  export default {
    setup() {
      const ButtonCounter = resolveComponent('ButtonCounter')

      return () => {
        return h(ButtonCounter)
      }
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  const { h, resolveComponent } = Vue

  export default {
    render() {
      const ButtonCounter = resolveComponent('ButtonCounter')
      return h(ButtonCounter)
    }
  }
  ```

  </div>

- **See also:** [Guide - Fonctions de rendu - Composants](/guide/extras/render-function.html#components)

## resolveDirective() {#resolvedirective}

For manually resolving a registered directive by name.

- **Type**

  ```ts
  function resolveDirective(name: string): Directive | undefined
  ```

- **Details**

  **Note: you do not need this if you can import the component directly.**

  `resolveDirective()` must be called inside<span class="composition-api"> either `setup()` or</span> the render function in order to resolve from the correct component context.

  If the directive is not found, a runtime warning will be emitted, and the function returns `undefined`.

- **See also:** [Guide - Fonctions de rendu - Directives personnalisées](/guide/extras/render-function.html#custom-directives)

## withDirectives() {#withdirectives}

For adding custom directives to vnodes.

- **Type**

  ```ts
  function withDirectives(
    vnode: VNode,
    directives: DirectiveArguments
  ): VNode

  // [Directive, value, argument, modifiers]
  type DirectiveArguments = Array<
    | [Directive]
    | [Directive, any]
    | [Directive, any, string]
    | [Directive, any, string, DirectiveModifiers]
  >
  ```

- **Details**

  Wraps an existing vnode with custom directives. The second argument is an array of custom directives. Each custom directive is also represented as an array in the form of `[Directive, value, argument, modifiers]`. Tailing elements of the array can be omitted if not needed.

- **Example**

  ```js
  import { h, withDirectives } from 'vue'

  // a custom directive
  const pin = {
    mounted() {
      /* ... */
    },
    updated() {
      /* ... */
    }
  }

  // <div v-pin:top.animate="200"></div>
  const vnode = withDirectives(h('div'), [
    [pin, 200, 'top', { animate: true }]
  ])
  ```

- **See also:** [Guide - Fonction de rendu - Directives personnalisées](/guide/extras/render-function.html#custom-directives)

## withModifiers() {#withmodifiers}

For adding built-in [`v-on` modifiers](/guide/essentials/event-handling.html#event-modifiers) to an event handler function.

- **Type**

  ```ts
  function withModifiers(fn: Function, modifiers: string[]): Function
  ```

- **Example**

  ```js
  import { h, withModifiers } from 'vue'

  const vnode = h('button', {
    // equivalent of v-on.stop.prevent
    onClick: withModifiers(() => {
      // ...
    }, ['stop', 'prevent'])
  })
  ```

- **See also:** [Guide - Fonctions de rendu - Modificateurs d'événement](/guide/extras/render-function.html#event-modifiers)
