---
outline: deep
---

# Mécanismes de rendu {#rendering-mechanism}

Comment Vue fait pour partir d'un template et le transformer en nœuds du DOM ? Comment Vue met-il à jour ces nœuds du DOM de manière efficace ? Nous allons tenter d'élucider ces questions en nous plongeant dans les mécanismes de rendu internes de Vue.

## DOM virtuel {#virtual-dom}

Vous avez probablement entendu parler du terme "DOM virtuel", sur lequel le système de rendu de Vue s'appuie.

Le DOM virtuel (VDOM) est un concept de programmation dans lequel une représentation idéale, ou "virtuelle", d'une interface utilisateur est conservée en mémoire et synchronisée avec le DOM "réel". Le concept a été lancé par [React](https://reactjs.org/), et a été adapté dans de nombreux autres frameworks avec différentes implémentations, y compris Vue.

Le DOM virtuel est plus un modèle qu'une technologie spécifique, il n'y a donc pas d'implémentation canonique. Nous pouvons illustrer ce concept à l'aide d'un exemple simple :

```js
const vnode = {
  type: 'div',
  props: {
    id: 'hello'
  },
  children: [
    /* d'autres vnodes */
  ]
}
```

Ici, un `vnode` est un objet JavaScript simple (un "nœud virtuel") représentant un élément `<div>`. Il contient toutes les informations dont nous avons besoin pour créer l'élément réel. Il contient également d'autres vnodes enfants, ce qui en fait la racine d'un arbre du DOM virtuel.

Un moteur d'exécution peut parcourir un arbre du DOM virtuel et construire un arbre du DOM réel à partir de celui-ci. Ce processus est appelé le **montage**.

Si nous avons deux copies d'arbres du DOM virtuel, le moteur de rendu peut également parcourir et comparer les deux arbres, en déterminant les différences, et appliquer ces changements au DOM réel. Ce processus est appelé **correction**, également connu sous le nom de "différenciation" ou "réconciliation".

Le principal avantage du DOM virtuel est qu'il donne au développeur la possibilité de créer, inspecter et composer de manière programmatique les structures d'interface utilisateur souhaitées de façon déclarative, tout en laissant la manipulation directe du DOM au moteur de rendu.

## Pipeline de rendu {#render-pipeline}

Au niveau le plus élevé, voici ce qui se passe lorsqu'un composant Vue est monté :

1. **Compilation** : Les templates Vue sont compilés en **fonctions de rendu** : fonctions qui retournent des arbres du DOM virtuel. Cette étape peut être effectuée soit à l'avance via un outil de build, soit à la volée en utilisant le compilateur d'exécution.

2. **Montage** : Le moteur d'exécution invoque les fonctions de rendu, parcourt l'arbre du DOM virtuel retourné et crée des nœuds DOM réels en fonction. Cette étape est réalisée comme un [effet réactif](./réactivité-en-profondeur), et garde donc la trace de toutes les dépendances réactives qui ont été utilisées.

3. **Correction** : Quand une dépendance utilisée pendant le montage change, l'effet est ré-exécuté. Cette fois, un nouvel arbre du DOM virtuel mis à jour est créé. Le moteur d'exécution parcourt le nouvel arbre, le compare avec l'ancien et applique les mises à jour nécessaires au DOM réel.

![render pipeline](./images/render-pipeline.png)

<!-- https://www.figma.com/file/elViLsnxGJ9lsQVsuhwqxM/Rendering-Mechanism -->

## Templates vs. Fonctions de rendu {#templates-vs-render-functions}

Les templates Vue sont compilés en fonctions de rendu du DOM virtuel. Vue fournit également des API qui nous permettent de sauter l'étape de compilation des templates et de créer directement des fonctions de rendu. Celles-ci sont plus flexibles que les templates pour incorporer des logiques très dynamiques, car vous pouvez travailler avec les vnodes en utilisant toute la puissance de JavaScript.

Dans ce cas, pourquoi Vue recommande-t-il les templates par défaut ? Il y a un plusieurs raisons :

1. Les templates se rapprochent du HTML réel. Il est donc plus facile de réutiliser des extraits HTML existants, d'appliquer les meilleures pratiques en matière d'accessibilité, de créer un style avec du CSS, et pour les concepteurs de comprendre le code et de le modifier.

2. Les templates sont plus faciles à analyser statiquement en raison de leur syntaxe plus déterministe. Cela permet au compilateur de templates de Vue d'appliquer de nombreuses optimisations au moment de la compilation afin d'améliorer les performances du DOM virtuel (que nous aborderons plus loin).

En pratique, les templates sont suffisants pour la plupart des cas d'utilisation d'une application. Les fonctions de rendu ne sont généralement utilisées que dans les composants réutilisables qui doivent gérer une logique de rendu hautement dynamique. L'utilisation des fonctions de rendu est abordée plus en détail dans [Fonctions de rendu et JSX](./render-function).

## DOM virtuel basé sur la compilation {#compiler-informed-virtual-dom}

L'implémentation du DOM virtuel dans React et la plupart de ses autres implémentations sont purement basées sur l'exécution : l'algorithme de réconciliation ne peut pas faire d'hypothèses sur l'arbre du DOM virtuel entrant, il doit donc traverser entièrement l'arbre et différencier les props de chaque vnode afin d'assurer la correction. En outre, même si une partie de l'arbre ne change jamais, de nouveaux vnodes sont toujours créés pour eux à chaque nouveau rendu, ce qui entraîne une charge mémoire inutile. C'est l'un des aspects les plus critiqués du DOM virtuel : le processus de réconciliation quelque peu brutal sacrifie l'efficacité au profit de la déclarativité et de l'exactitude.

Cependant d'autres façons de faire existent. Dans Vue, le framework a le contrôle à la fois pendant la compilation et l'exécution. Cela nous permet de mettre en œuvre de nombreuses optimisations au moment de la compilation dont seul un moteur de rendu étroitement intégré peut tirer parti. Le compilateur peut analyser statiquement le template et laisser des indications dans le code généré afin que le moteur d'exécution puisse gagner du temps lorsque cela est possible. Dans le même temps, l'utilisateur peut toujours avoir le contrôle jusqu'à la de fonction de rendu pour agir de manière plus directe lorsque cela est nécessaire. Nous appelons cette approche hybride le **DOM virtuel basé sur la compilation**.

Nous aborderons ci-dessous quelques optimisations importantes réalisées par le compilateur de templates Vue dans le but d'améliorer les performances d'exécution du DOM virtuel.

### Remontée statique {#static-hoisting}

Il arrive régulièrement que certaines parties d'un template ne contiennent pas de liaisons dynamiques :

```vue-html{2-3}
<div>
  <div>foo</div> <!-- remonté -->
  <div>bar</div> <!-- remonté -->
  <div>{{ dynamic }}</div>
</div>
```

[Inspection dans l'explorateur de template](https://vue-next-template-explorer.netlify.app/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2PmZvbzwvZGl2PlxuICA8ZGl2PmJhcjwvZGl2PlxuICA8ZGl2Pnt7IGR5bmFtaWMgfX08L2Rpdj5cbjwvZGl2PiIsInNzciI6ZmFsc2UsIm9wdGlvbnMiOnsiaG9pc3RTdGF0aWMiOnRydWV9fQ==)

Les divs `foo` et `bar` sont statiques - recréer des vnodes et les différencier à chaque rendu est inutile. Le compilateur Vue extrait automatiquement les appels de création de vnodes de la fonction de rendu, et réutilise les mêmes vnodes à chaque rendu. Le moteur de rendu est également capable de ne pas les différencier quand il remarque que l'ancien et le nouveau vnode sont les mêmes.

En outre, lorsqu'il y a suffisamment d'éléments statiques consécutifs, ils seront condensés en un seul "vnode statique" qui contient une simple chaîne de caractères HTML pour tous ces nœuds ([Exemple](https://vue-next-template-explorer.netlify. app/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImZvb1wiPmZvbzwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdj57eyBkeW5hbWljIH19PC9kaXY+XG48L2Rpdj4iLCJzc3IiOmZhbHNlLCJvcHRpb25zIjp7ImhvaXN0U3RhdGljIjp0cnVlfX0=)). Ces vnodes statiques sont montés en modifiant directement `innerHTML`. Ils mettent également en cache les nœuds du DOM correspondants lors du montage initial - si le même élément de contenu est réutilisé ailleurs dans l'application, de nouveaux noeuds du DOM sont créés en utilisant la méthode native `cloneNode()`, ce qui est extrêmement efficace.

### Options de correction {#patch-flags}

For a single element with dynamic bindings, we can also infer a lot of information from it at compile time:

```vue-html
<!-- class binding only -->
<div :class="{ active }"></div>

<!-- id and value bindings only -->
<input :id="id" :value="value">

<!-- text children only -->
<div>{{ dynamic }}</div>
```

[Inspect in Template Explorer](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2IDpjbGFzcz1cInsgYWN0aXZlIH1cIj48L2Rpdj5cblxuPGlucHV0IDppZD1cImlkXCIgOnZhbHVlPVwidmFsdWVcIj5cblxuPGRpdj57eyBkeW5hbWljIH19PC9kaXY+Iiwib3B0aW9ucyI6e319)

When generating the render function code for these elements, Vue encodes the type of update each of them needs directly in the vnode creation call:

```js{3}
createElementVNode("div", {
  class: _normalizeClass({ active: _ctx.active })
}, null, 2 /* CLASS */)
```

The last argument, `2`, is a [patch flag](https://github.com/vuejs/core/blob/main/packages/shared/src/patchFlags.ts). An element can have multiple patch flags, which will be merged into a single number. The runtime renderer can then check against the flags using [bitwise operations](https://en.wikipedia.org/wiki/Bitwise_operation) to determine whether it needs to do certain work:

```js
if (vnode.patchFlag & PatchFlags.CLASS /* 2 */) {
  // update the element's class
}
```

Bitwise checks are extremely fast. With the patch flags, Vue is able to do the least amount of work necessary when updating elements with dynamic bindings.

Vue also encodes the type of children a vnode has. For example, a template that has multiple root nodes is represented as a fragment. In most cases, we know for sure that the order of these root nodes will never change, so this information can also be provided to the runtime as a patch flag:

```js{4}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* children */
  ], 64 /* STABLE_FRAGMENT */))
}
```

The runtime can thus completely skip child-order reconciliation for the root fragment.

### Tree Flattening {#tree-flattening}

Taking another look at the generated code from the previous example, you'll notice the root of the returned virtual DOM tree is created using a special `createElementBlock()` call:

```js{2}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* children */
  ], 64 /* STABLE_FRAGMENT */))
}
```

Conceptually, a "block" is a part of the template that has stable inner structure. In this case, the entire template has a single block because it does not contain any structural directives like `v-if` and `v-for`.

Each block tracks any descendant nodes (not just direct children) that have patch flags. For example:

```vue-html{3,5}
<div> <!-- root block -->
  <div>...</div>         <!-- not tracked -->
  <div :id="id"></div>   <!-- tracked -->
  <div>                  <!-- not tracked -->
    <div>{{ bar }}</div> <!-- tracked -->
  </div>
</div>
```

The result is a flattened array that contains only the dynamic descendant nodes:

```
div (block root)
- div with :id binding
- div with {{ bar }} binding
```

When this component needs to re-render, it only needs to traverse the flattened tree instead of the full tree. This is called **Tree Flattening**, and it greatly reduces the number of nodes that need to be traversed during virtual DOM reconciliation. Any static parts of the template are effectively skipped.

`v-if` and `v-for` directives will create new block nodes:

```vue-html
<div> <!-- root block -->
  <div>
    <div v-if> <!-- if block -->
      ...
    <div>
  </div>
</div>
```

A child block is tracked inside the parent block's array of dynamic descendants. This retains a stable structure for the parent block.

### Impact on SSR Hydration {#impact-on-ssr-hydration}

Both patch flags and tree flattening also greatly improve Vue's [SSR Hydration](/guide/scaling-up/ssr.html#client-hydration) performance:

- Single element hydration can take fast paths based on the corresponding vnode's patch flag.

- Only block nodes and their dynamic descendants need to be traversed during hydration, effectively achieving partial hydration at the template level.
