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

  > Les types sont simplifiés dans un souci de lisibilité.

- **Détails**

  Le premier argument peut être une chaîne de caractères (pour les éléments natifs) ou une définition de composant Vue. Le deuxième argument est les props à passer, et le troisième argument représente les enfants.

  Lors de la création d'un vnode de composant, les enfants doivent être passés en tant que fonctions slot. Une seule fonction slot peut être transmise si le composant n'attend que le slot par défaut. Sinon, les slots doivent être passés comme un objet de fonctions slot.

  Pour des raisons pratiques, l'argument props peut être omis lorsque les enfants ne sont pas un objet slots.

- **Exemple**

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

- **Voir aussi** [Guide - Fonctions de rendu - Créer des Vnodes](/guide/extras/render-function#creating-vnodes)

## mergeProps() {#mergeprops}

Fusionne plusieurs objets de props avec une gestion spéciale pour certaines props.

- **Type :**

  ```ts
  function mergeProps(...args: object[]): object
  ```

- **Détails**

  `mergeProps()` permet de fusionner plusieurs objets de props avec une gestion spéciale pour les props suivantes :

  - `class`
  - `style`
  - Écouteurs d'événements `onXxx` - plusieurs écouteurs avec le même nom seront fusionnés dans un tableau.

  Si vous n'avez pas besoin de la fusion et que vous voulez simplement écraser, la propagation d'objet natif peut être utilisée à la place.

- **Exemple**

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

Clone un vnode.

- **Type :**

  ```ts
  function cloneVNode(vnode: VNode, extraProps?: object): VNode
  ```

- **Détails**

  Renvoie un vnode cloné, avec éventuellement des props supplémentaires à fusionner avec l'original.

  Les vnodes doivent être considérés comme immuables une fois créés, et vous ne devez pas modifier les propriétés d'un vnode existant. Au lieu de cela, clonez-le avec des props différentes / supplémentaires.

  Les vnodes ont des propriétés internes spéciales, donc les cloner n'est pas aussi simple qu'une copie d'objet. `cloneVNode()` gère la plupart de la logique interne.

- **Exemple**

  ```js
  import { h, cloneVNode } from 'vue'

  const original = h('div')
  const cloned = cloneVNode(original, { id: 'foo' })
  ```

## isVNode() {#isvnode}

Vérifie si une valeur est un vnode ou non.

- **Type :**

  ```ts
  function isVNode(value: unknown): boolean
  ```

## resolveComponent() {#resolvecomponent}

Utilisée pour résoudre manuellement un composant enregistré via son nom.

- **Type :**

  ```ts
  function resolveComponent(name: string): Component | string
  ```

- **Détails**

  **Remarque : cette fonction n'est pas nécessaire si vous pouvez directement importer le composant.**

  `resolveComponent()` doit être appelée à l'intérieur<span class="composition-api">de `setup()` ou</span> de la fonction de rendu afin de résoudre à partir du bon contexte de composant.

  Si le composant n'est pas trouvé, un avertissement exécution est émis lors de l'exécution et le nom est retourné sous forme de chaîne de caractères. 

- **Exemple**

  <div class="composition-api">

  ```js
  import { h, resolveComponent } from 'vue'

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
  import { h, resolveComponent } from 'vue'

  export default {
    render() {
      const ButtonCounter = resolveComponent('ButtonCounter')
      return h(ButtonCounter)
    }
  }
  ```

  </div>

- **Voir aussi** [Guide - Fonctions de rendu - Composants](/guide/extras/render-function#components)

## resolveDirective() {#resolvedirective}

Utilisée pour résoudre manuellement une directive enregistrée via son nom.

- **Type :**

  ```ts
  function resolveDirective(name: string): Directive | undefined
  ```

- **Détails**

  **Remarque : cette fonction n'est pas nécessaire si vous pouvez directement importer la directive.**

  `resolveDirective()` doit être appelée à l'intérieur de<span class="composition-api">la fonction `setup()` ou</span> la fonction de rendu afin de résoudre à partir du bon contexte de composant.

  Si la directive n'est pas trouvée, un avertissement sera émis lors de l'exécution et la fonction retournera `undefined`.

- **Voir aussi** [Guide - Fonctions de rendu - Directives personnalisées](/guide/extras/render-function#custom-directives)

## withDirectives() {#withdirectives}

Utilisée pour ajouter des directives personnalisées aux vnodes.

- **Type :**

  ```ts
  function withDirectives(
    vnode: VNode,
    directives: DirectiveArguments
  ): VNode

  // [Directive, valeur, argument, modificateurs]
  type DirectiveArguments = Array<
    | [Directive]
    | [Directive, any]
    | [Directive, any, string]
    | [Directive, any, string, DirectiveModifiers]
  >
  ```

- **Détails**

  Enveloppe un vnode existant avec des directives personnalisées. Le second argument est un tableau de directives personnalisées. Chaque directive personnalisée est également représentée par un tableau sous la forme `[Directive, valeur, argument, modificateurs]`. Les éléments finaux du tableau peuvent être omis s'ils ne sont pas nécessaires.

- **Exemple**

  ```js
  import { h, withDirectives } from 'vue'

  // une directive personnalisée
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

- **Voir aussi** [Guide - Fonction de rendu - Directives personnalisées](/guide/extras/render-function#custom-directives)

## withModifiers() {#withmodifiers}

Utilisée pour ajouter des modificateurs natifs [`v-on`](/guide/essentials/event-handling#event-modifiers) à une fonction de gestion d'événements.

- **Type :**

  ```ts
  function withModifiers(fn: Function, modifiers: ModifierGuardsKeys[]): Function
  ```

- **Exemple**

  ```js
  import { h, withModifiers } from 'vue'

  const vnode = h('button', {
    // équivalent à v-on:click.stop.prevent
    onClick: withModifiers(() => {
      // ...
    }, ['stop', 'prevent'])
  })
  ```

- **Voir aussi** [Guide - Fonctions de rendu - Modificateurs d'événement](/guide/extras/render-function#event-modifiers)
