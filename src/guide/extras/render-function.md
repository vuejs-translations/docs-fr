---
outline: deep
---

# Fonctions de rendu et JSX {#render-functions-jsx}

Vue recommande d'utiliser des templates pour construire des applications dans la plupart des cas. Cependant, il existe des situations où nous avons besoin de toute la puissance programmatique de JavaScript. C'est alors que nous pouvons utiliser la fonction **render**.

> Si les concepts de DOM virtuel et de fonctions de rendu vous sont inconnus, lisez d'abord le chapitre [Mécanismes de rendu](/guide/extras/rendering-mechanism).

## Utilisation basique {#basic-usage}

### Créer des vnodes {#creating-vnodes}

Vue fournit une fonction `h()` afin de créer des nœuds virtuels, également appelés vnodes :

```js
import { h } from 'vue'

const vnode = h(
  'div', // type
  { id: 'foo', class: 'bar' }, // props
  [
    /* enfants */
  ]
)
```

`h()` est l'abréviation de **hyperscript** - ce qui signifie "JavaScript produisant du HTML (langage de balises pour l'hypertexte)". Ce nom est hérité de conventions partagées par de nombreuses implémentations du DOM virtuel. Un nom plus descriptif serait `createVNode()`, mais un nom plus court aide lorsque vous devez appeler cette fonction plusieurs fois dans une fonction de rendu.

La fonction `h()` est conçue pour être très flexible :

```js
// tous les arguments, sauf le type, sont facultatifs
h('div')
h('div', { id: 'foo' })

// les attributs et les propriétés peuvent être utilisés dans les props
// Vue choisit automatiquement la bonne façon de les assigner
h('div', { class: 'bar', innerHTML: 'hello' })

// des modificateurs de props tels que .prop et .attr peuvent être ajoutés
// via les préfixes '.' et `^' respectivement
h('div', { '.name': 'some-name', '^width': '100' })

// la classe et le style ont la même prise en charge pour la valeur d'objet / tableau
// qu'ils ont dans les templates
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// les écouteurs d'événements doivent être passés suivant le format onXxx
h('div', { onClick: () => {} })

// les enfants peuvent être une chaîne de caractères
h('div', { id: 'foo' }, 'hello')

// les props peuvent être omises lorsqu'il n'y en a pas
h('div', 'hello')
h('div', [h('span', 'hello')])

// le tableau représentant les enfants peut contenir un mélange de vnodes et de chaînes de caractères.
h('div', ['hello', h('span', 'hello')])
```

Le vnode résultant a la forme suivante :

```js
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

:::warning Remarque
L'interface complète `VNode` contient de nombreuses autres propriétés internes, mais il est fortement recommandé d'éviter de s'appuyer sur d'autres propriétés que celles listées ici. Cela permet d'éviter les ruptures involontaires en cas de modification des propriétés internes.
:::

### Déclarer des fonctions de rendu {#declaring-render-functions}

<div class="composition-api">

Lorsque vous utilisez des templates avec la Composition API, la valeur retournée par le hook `setup()` est utilisée pour exposer les données au template. Cependant, lors de l'utilisation de fonctions de rendu, nous pouvons retourner directement la fonction de rendu à la place :

```js
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // retourne la fonction de rendu
    return () => h('div', props.msg + count.value)
  }
}
```

La fonction de rendu est déclarée à l'intérieur de `setup()`, elle a donc naturellement accès aux props et à tout état réactif déclaré dans la même portée.

En plus de retourner un seul vnode, vous pouvez également retourner des chaînes de caractères ou des tableaux :

```js
export default {
  setup() {
    return () => 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  setup() {
    // utiliser un tableau pour retourner plusieurs nœuds racines
    return () => [h('div'), h('div'), h('div')]
  }
}
```

:::tip
Assurez-vous de retourner une fonction au lieu de retourner directement des valeurs ! La fonction `setup()` n'est appelée qu'une seule fois par composant, alors que la fonction de rendu retournée sera appelée plusieurs fois.
:::

</div>
<div class="options-api">

Nous pouvons déclarer des fonctions de rendu en utilisant l'option `render` :

```js
import { h } from 'vue'

export default {
  data() {
    return {
      msg: 'hello'
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

La fonction `render()` a accès à l'instance du composant via `this`.

En plus de retourner un seul vnode, vous pouvez également retourner des chaînes de caractères ou des tableaux :

```js
export default {
  render() {
    return 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  render() {
    // utiliser un tableau pour retourner plusieurs nœuds racines
    return [h('div'), h('div'), h('div')]
  }
}
```

</div>

Si un composant d'une fonction de rendu n'a pas besoin d'état d'instance, il peut également être déclaré directement comme une fonction pour des raisons de simplicité :

```js
function Hello() {
  return 'hello world!'
}
```

C'est exact, c'est un composant Vue valide ! Voir [les composants fonctionnels](#functional-components) pour plus de détails sur cette syntaxe.

### Les vnodes doivent être uniques {#vnodes-must-be-unique}

Tous les vnodes présents dans l'arbre des composants doivent être uniques. Cela signifie que la fonction de rendu suivante n'est pas valide :

```js
function render() {
  const p = h('p', 'hi')
  return h('div', [
    // Oups - duplication de vnodes!
    p,
    p
  ])
}
```

Si vous voulez vraiment dupliquer le même élément/composant, vous pouvez le faire via une fonction _factory_. Par exemple, la fonction de rendu suivante est un moyen parfaitement valable de rendre 20 paragraphes identiques :

```js
function render() {
  return h(
    'div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'hi')
    })
  )
}
```

## JSX / TSX {#jsx-tsx}

Le [JSX](https://facebook.github.io/jsx/) est une extension de JavaScript semblable au XML qui permet d'écrire du code de cette manière :

```jsx
const vnode = <div>hello</div>
```

Dans les expressions JSX, utilisez des accolades pour intégrer des valeurs dynamiques :

```jsx
const vnode = <div id={dynamicId}>hello, {userName}</div>
```

`create-vue` et Vue CLI possède tous deux des options pour élaborer des projets avec un support du JSX préconfiguré. Si vous configurez le JSX manuellement, veuillez consulter la documentation de [`@vue/babel-plugin-jsx`](https://github.com/vuejs/jsx-next) pour plus de détails.

Bien qu'il ait été introduit par React, le JSX n'a pas de sémantique d'exécution définie et peut être compilé en différents résultats. Si vous avez déjà travaillé avec le JSX, notez que **la transformation du JSX de Vue est différente de la transformation du JSX de React**, vous ne pouvez donc pas utiliser la transformation du JSX de React dans les applications Vue. Voici quelques différences notables par rapport au JSX de React :

- Vous pouvez utiliser des attributs HTML tels que `class` et `for` comme props - il n'est pas nécessaire d'utiliser `className` ou `htmlFor`.
- Passer des enfants à des composants (c'est-à-dire des slots) [fonctionne différemment](#passing-slots).

La définition de type de Vue fournit également une inférence de type pour l'utilisation de TSX. Lorsque vous utilisez TSX, assurez-vous de spécifier `"jsx": "preserve"` dans `tsconfig.json` afin que TypeScript laisse la syntaxe du JSX intacte pour le bon fonctionnement de la transformation du JSX par Vue.

### Inférence de type JSX {#jsx-type-inference}

De la même manière que pour la transformation, le JSX de Vue nécessite également des définitions de types différentes.

À partir de Vue 3.4, Vue n'inscrit plus implicitement `JSX` dans l'espace de noms global. Pour demander à TypeScript d'utiliser les définitions de type JSX de Vue, assurez-vous d'inclure ce qui suit dans votre `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
    // ...
  }
}
```

Vous pouvez également le définir dans un fichier en ajoutant un commentaire `/* @jsxImportSource vue */` en haut du fichier.

Si vous avez du code qui dépend de la présence de l'espace de noms global `JSX`, vous pouvez conserver le comportement global exact d'avant la version 3.4 en référençant explicitement `vue/jsx`, ce qui enregistre l'espace de noms global `JSX`.

## Exemples de fonctions de rendu {#render-function-recipes}

Nous vous proposons ci-dessous quelques exemples courants pour mettre en œuvre les fonctionnalités des templates via leur équivalent en fonctions de rendu / JSX.

### `v-if` {#v-if}

Template :

```vue-html
<div>
  <div v-if="ok">yes</div>
  <span v-else>no</span>
</div>
```

Équivalent en fonction de rendu / JSX :

<div class="composition-api">

```js
h('div', [ok.value ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{ok.value ? <div>yes</div> : <span>no</span>}</div>
```

</div>
<div class="options-api">

```js
h('div', [this.ok ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{this.ok ? <div>yes</div> : <span>no</span>}</div>
```

</div>

### `v-for` {#v-for}

Template :

```vue-html
<ul>
  <li v-for="{ id, text } in items" :key="id">
    {{ text }}
  </li>
</ul>
```

Équivalent en fonction de rendu / JSX :

<div class="composition-api">

```js
h(
  'ul',
  // en supposant que `items` est une ref avec une valeur de tableau
  items.value.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {items.value.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>
<div class="options-api">

```js
h(
  'ul',
  this.items.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {this.items.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>

### `v-on` {#v-on}

Les props dont le nom commence par `on` suivi d'une lettre majuscule sont traitées comme des écouteurs d'événements. Par exemple, `onClick` est l'équivalent de `@click` dans les templates.

```js
h(
  'button',
  {
    onClick(event) {
      /* ... */
    }
  },
  'Cliquez-moi'
)
```

```jsx
<button
  onClick={(event) => {
    /* ... */
  }}
>
  Cliquez-moi
</button>
```

#### Modificateurs d'événement {#event-modifiers}

Les modificateurs d'événements `.passive`, `.capture`, et `.once` peuvent être concaténés après le nom de l'événement en utilisant camelCase.

Par exemple :

```js
h('input', {
  onClickCapture() {
    /* écouteur d'événement en mode capture */
  },
  onKeyupOnce() {
    /* ne se déclenche qu'une seule fois */
  },
  onMouseoverOnceCapture() {
    /* once + capture */
  }
})
```

```jsx
<input
  onClickCapture={() => {}}
  onKeyupOnce={() => {}}
  onMouseoverOnceCapture={() => {}}
/>
```

Pour les autres modificateurs d'événements et de clés, l'utilitaire [`withModifiers`](/api/render-function#withmodifiers) peut être utilisé :

```js
import { withModifiers } from 'vue'

h('div', {
  onClick: withModifiers(() => {}, ['self'])
})
```

```jsx
<div onClick={withModifiers(() => {}, ['self'])} />
```

### Composants {#components}

Pour créer un vnode pour un composant, le premier argument passé à `h()` doit être la définition du composant. Cela signifie que lorsque vous utilisez les fonctions de rendu, il n'est pas nécessaire d'enregistrer les composants - vous pouvez utiliser directement les composants importés :

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
```

```jsx
function render() {
  return (
    <div>
      <Foo />
      <Bar />
    </div>
  )
}
```

Comme nous pouvons le constater, `h` peut fonctionner avec des composants importés depuis n'importe quel format de fichier tant qu'il s'agit d'un composant Vue valide.

Les composants dynamiques sont simples à utiliser avec les fonctions de rendu :

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return ok.value ? h(Foo) : h(Bar)
}
```

```jsx
function render() {
  return ok.value ? <Foo /> : <Bar />
}
```

Si un composant est enregistré via son nom et ne peut pas être importé directement (par exemple, s'il est enregistré globalement par une bibliothèque), il peut être l'être en utilisant l'utilitaire [`resolveComponent()`](/api/render-function#resolvecomponent).

### Rendu de slots {#rendering-slots}

<div class="composition-api">

Dans les fonctions de rendu, les slots sont accessibles via le contexte `setup()`. Chaque slot de l'objet `slots` est une **fonction qui retourne un tableau de vnodes** :

```js
export default {
  props: ['message'],
  setup(props, { slots }) {
    return () => [
      // slot par défaut :
      // <div><slot /></div>
      h('div', slots.default()),

      // slot nommé :
      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        slots.footer({
          text: props.message
        })
      )
    ]
  }
}
```

Équivalent en JSX :

```jsx
// par défaut
<div>{slots.default()}</div>

// nommé
<div>{slots.footer({ text: props.message })}</div>
```

</div>
<div class="options-api">

Dans les fonctions de rendu, les slots sont accessibles via [`this.$slots`](/api/component-instance#slots) :

```js
export default {
  props: ['message'],
  render() {
    return [
      // <div><slot /></div>
      h('div', this.$slots.default()),

      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        this.$slots.footer({
          text: this.message
        })
      )
    ]
  }
}
```

Équivalent en JSX :

```jsx
// <div><slot /></div>
<div>{this.$slots.default()}</div>

// <div><slot name="footer" :text="message" /></div>
<div>{this.$slots.footer({ text: this.message })}</div>
```

</div>

### Passer des slots {#passing-slots}

Passer des enfants à des composants et passer des enfants à des éléments ne fonctionnent pas de la même manière. Au lieu d'un tableau, nous devons passer soit une fonction slot, soit un objet de fonctions slot. Les fonctions slot peuvent retourner tout ce qu'une fonction de rendu normale peut renvoyer - ce qui est retourné sera toujours normalisé en tableaux de vnodes lors de leur appel dans le composant enfant.

```js
// simple slot par défaut
h(MyComponent, () => 'hello')

// slots nommés
// remarquez que `null` est requis afin d'éviter que
// l'objet de slots soit traité comme une prop
h(MyComponent, null, {
  default: () => 'default slot',
  foo: () => h('div', 'foo'),
  bar: () => [h('span', 'one'), h('span', 'two')]
})
```

Équivalent en JSX :

```jsx
// par défaut
<MyComponent>{() => 'hello'}</MyComponent>

// nommé
<MyComponent>{{
  default: () => 'default slot',
  foo: () => <div>foo</div>,
  bar: () => [<span>one</span>, <span>two</span>]
}}</MyComponent>
```

Passer des slots en tant que fonctions leur permet d'être invoqués à la volée par le composant enfant. Ainsi, les dépendances du slot sont traquées par l'enfant plutôt que par le parent, ce qui permet des mises à jour plus précises et plus efficaces.

### Slots Scopés {#scoped-slots}

Pour rendre un slot scopé dans le composant parent, un slot est passé au composant enfant. Remarquez que le slot a maintenant un paramètre `text`. Le slot sera appelé dans le composant enfant et les données du composant enfant seront transmises au composant parent.

```js
// parent component
export default {
  setup() {
    return () =>
      h(MyComp, null, {
        default: ({ text }) => h('p', text)
      })
  }
}
```

N'oubliez pas de passer `null` pour que les slots ne soient pas traités comme des props.

```js
// child component
export default {
  setup(props, { slots }) {
    const text = ref('hi')
    return () => h('div', null, slots.default({ text: text.value }))
  }
}
```

Équivalent JSX :

```jsx
<MyComponent>
  {{
    default: ({ text }) => <p>{text}</p>
  }}
</MyComponent>
```

### Composants natifs {#built-in-components}

[Les composants natifs](/api/built-in-components) tels que `<KeepAlive>`, `<Transition>`, `<TransitionGroup>`, `<Teleport>` et `<Suspense>` doivent être importés pour être utilisés dans les fonctions de rendu :

<div class="composition-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  setup() {
    return () => h(Transition, { mode: 'out-in' } /* ... */)
  }
}
```

</div>
<div class="options-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  render() {
    return h(Transition, { mode: 'out-in' } /* ... */)
  }
}
```

</div>

### `v-model` {#v-model}

La directive `v-model` est enrichie par les props `modelValue` et `onUpdate:modelValue` lors de la compilation du template - nous devons fournir ces props nous-mêmes :

<div class="composition-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(SomeComponent, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value)
      })
  }
}
```

</div>
<div class="options-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  render() {
    return h(SomeComponent, {
      modelValue: this.modelValue,
      'onUpdate:modelValue': (value) =>
        this.$emit('update:modelValue', value)
    })
  }
}
```

</div>

### Directives personnalisées {#custom-directives}

Les directives personnalisées peuvent être appliquées à un vnode en utilisant [`withDirectives`](/api/render-function#withdirectives) :

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

Si la directive est enregistrée par son nom et ne peut être importée directement, elle peut l'être en utilisant l'utilitaire [`resolveDirective`](/api/render-function#resolvedirective).

### Template Refs {#template-refs}

<div class="composition-api">

Avec la Composition API, les refs de template sont créées en transmettant le `ref()` lui-même en tant que props au vnode :

Avec la Composition API, lors de l'utilisation de [`useTemplateRef()`](/api/composition-api-helpers#usetemplateref) <sup class="vt-badge" data-text="3.5+" /> les références des templates sont créées en passant la valeur de la chaîne en tant que prop au vnode :

```js
import { h, useTemplateRef } from 'vue'

export default {
  setup() {
    const divEl = useTemplateRef('my-div')

    // <div ref="my-div">
    return () => h('div', { ref: 'my-div' })
  }
}
```

<details>
<summary>UUtilisation avant 3.5</summary>

Dans les versions antérieures à la 3.5 où useTemplateRef() n'a pas été introduite, les refs de templates sont créés en passant le ref() lui-même en tant que prop au vnode :

```js
import { h, ref } from 'vue'

export default {
  setup() {
    const divEl = ref()

    // <div ref="divEl">
    return () => h('div', { ref: divEl })
  }
}
```
</details>
</div>
<div class="options-api">

Avec l'Options API, les ref de template sont créées en transmettant le nom de la référence sous forme de chaîne dans les props vnode :

```js
export default {
  render() {
    // <div ref="divEl">
    return h('div', { ref: 'divEl' })
  }
}
```

</div>

## Composants fonctionnels {#functional-components}

Les composants fonctionnels sont une autre forme de composants qui n'ont pas d'état propre. Ils agissent comme de pures fonctions : props en entrée, vnodes en sortie. Ils sont rendus sans créer d'instance de composant (c'est-à-dire sans `this`), et sans les hooks habituels du cycle de vie des composants.

Pour créer un composant fonctionnel, nous utilisons une simple fonction, plutôt qu'un objet d'options. La fonction est effectivement la fonction `render` du composant.

<div class="composition-api">

La signature d'un composant fonctionnel est la même que celle du hook `setup()` :

```js
function MyComponent(props, { slots, emit, attrs }) {
  // ...
}
```

</div>
<div class="options-api">

Comme il n'y a pas de référence `this` pour un composant fonctionnel, Vue passera les `props` comme premier argument :

```js
function MyComponent(props, context) {
  // ...
}
```

Le deuxième argument, `context`, contient trois propriétés : `attrs`, `emit`, et `slots`. Elles sont équivalentes aux propriétés d'instance [`$attrs`](/api/component-instance#attrs), [`$emit`](/api/component-instance#emit), et [`$slots`](/api/component-instance#slots) respectivement.

</div>

La plupart des options de configuration habituelles des composants ne sont pas disponibles pour les composants fonctionnels. Cependant, il est possible de définir [`props`](/api/options-state#props) et [`emits`](/api/options-state#emits) en les ajoutant comme propriétés :

```js
MyComponent.props = ['value']
MyComponent.emits = ['click']
```

Si l'option `props` n'est pas spécifiée, alors l'objet `props` passé à la fonction contiendra tous les attributs, de la même manière que `attrs`. Les noms de prop ne seront pas formatés en camelCase, sauf si l'option `props` est spécifiée.

Pour les composants fonctionnels avec des `props` explicites, [la traversée des attributs](/guide/components/attrs) fonctionne à peu près comme pour les composants normaux. Cependant, pour les composants fonctionnels qui ne spécifient pas explicitement leurs `props`, seuls les écouteurs d'événements `class`, `style`, et `onXxx` seront hérités des `attrs` par défaut. Dans les deux cas, `inheritAttrs` peut être mis à `false` pour désactiver l'héritage des attributs :

```js
MyComponent.inheritAttrs = false
```

Les composants fonctionnels peuvent être enregistrés et consommés tout comme les composants normaux. Si vous passez une fonction comme premier argument à `h()`, elle sera traitée comme un composant fonctionnel.

### Typer des composants fonctionnels<sup class="vt-badge ts" /> {#typing-functional-components}

Les composants fonctionnels peuvent être typés selon qu'ils sont nommés ou anonymes. [L'extension Vue - Official](https://github.com/vuejs/language-tools) prend également en charge la vérification de type des composants fonctionnels correctement typés lors de leur utilisation dans des templates SFC.

**Composants fonctionnels nommés**

```tsx
import type { SetupContext } from 'vue'
type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

function FComponent(
  props: FComponentProps,
  context: SetupContext<Events>
) {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
      {props.message}{' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value: unknown) => typeof value === 'string'
}
```

**Composants fonctionnels anonymes**

```tsx
import type { FunctionalComponent } from 'vue'

type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

const FComponent: FunctionalComponent<FComponentProps, Events> = (
  props,
  context
) => {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value) => typeof value === 'string'
}
```
