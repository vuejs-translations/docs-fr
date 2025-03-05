# Teleport {#teleport}

 <VueSchoolLink href="https://vueschool.io/lessons/vue-3-teleport" title="Leçon gratuit sur Teleport de Vue.js"/>

`<Teleport>` est un composant natif qui nous permet de "téléporter" une partie du template d'un composant dans un nœud du DOM qui existe en dehors de la hiérarchie du DOM de ce composant.

## Utilisation basique {#basic-usage}

Parfois, nous pouvons être confrontés au scénario suivant : une partie du template d'un composant lui appartient logiquement, mais d'un point de vue visuel, elle devrait être affichée ailleurs dans le DOM, peut-être même en dehors de l'application Vue.

L'exemple le plus courant est la création d'une modale plein écran. Idéalement, nous souhaitons que le code du bouton de la modale et la modale elle-même soient écrits dans le même composant à fichier unique, puisqu'ils sont tous les deux liés à l'état d'ouverture / fermeture de la modale. Mais cela signifie que la modale sera rendue à côté du bouton, profondément imbriquée dans la hiérarchie du DOM de l'application. Cela peut causer des problèmes délicats lors du positionnement de la modale via CSS.

Considérez la structure HTML suivante.

```vue-html
<div class="outer">
  <h3>Vue Teleport Example</h3>
  <div>
    <MyModal />
  </div>
</div>
```

Et voici une implémentation de `<MyModal>`:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Open Modal</button>

  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      open: false
    }
  }
}
</script>

<template>
  <button @click="open = true">Open Modal</button>

  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>

Le composant comporte un `<button>` pour déclencher l'ouverture de la modale, ainsi qu'une `<div>` avec une classe `.modal`, qui va contenir le contenu de la modale et un bouton pour se fermer.

Lorsque nous utilisons ce composant à l'intérieur de la structure HTML initiale, il y a un certain nombre de problèmes potentiels :

- `position : fixed` ne place l'élément relativement à la fenêtre d'affichage que si aucun élément ancêtre n'a la propriété `transform`, `perspective` ou `filter` définie. Si, par exemple, nous voulons animer l'ancêtre `<div class="outer">` avec une transformation CSS, cela casserait la disposition de la modale !

- Le `z-index` de la modale est restreint par les éléments dans lesquels elle est imbriquée. S'il y a un autre élément qui chevauche `<div class="outer">` et a un `z-index` plus élevé, il couvrira notre modale.

`<Teleport>` fournit une manière propre de résoudre ces problèmes, en nous permettant de sortir de la structure imbriquée du DOM. Modifions `<MyModal>` pour utiliser `<Teleport>` :

```vue-html{3,8}
<button @click="open = true">Open Modal</button>

<Teleport to="body">
  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</Teleport>
```

La cible `to` de `<Teleport>` attend une chaîne de sélecteur CSS ou un nœud du DOM actif. Ici, nous disons essentiellement à Vue de "**téléporter** ce fragment de template **vers** la balise **`body`**".

Vous pouvez cliquer sur le bouton ci-dessous et inspecter la balise `body` via la console de votre navigateur :

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<div class="demo">
  <button @click="open = true">Open Modal</button>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="open" class="demo modal-demo">
        <p style="margin-bottom:20px">Hello from the modal!</p>
        <button @click="open = false">Close</button>
      </div>
    </Teleport>
  </ClientOnly>
</div>

<style>
.modal-demo {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  background-color: var(--vt-c-bg);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>

Vous pouvez combiner `<Teleport>` avec [`<Transition>`](./transition) pour créer des modales animées - voir l'[exemple ici](/examples/#modal).

:::tip
La cible de téléportation `to` doit être déjà présente dans le DOM lorsque le composant `<Teleport>` est monté. Idéalement, il devrait s'agir d'un élément extérieur à l'ensemble de l'application Vue. Si vous ciblez un autre élément rendu par Vue, vous devez vous assurer que cet élément est monté avant le composant `<Teleport>`.
:::

## Utilisation avec les composants {#using-with-components}

`<Teleport>` ne modifie que la structure DOM rendue - il n'affecte pas la hiérarchie logique des composants. En d'autres termes, si `<Teleport>` contient un composant, ce composant restera un enfant logique du composant parent contenant le `<Teleport>`. Le passage des props et l'émission d'événements continueront de fonctionner de la même manière.

Cela signifie également que les injections à partir d'un composant parent fonctionnent comme prévu, et que le composant enfant sera imbriqué sous le composant parent dans les Devtools Vue, au lieu d'être placé là où le contenu réel a été déplacé.

## Désactiver Teleport {#disabling-teleport}

Dans certains cas, nous pouvons vouloir désactiver `<Teleport>` de manière conditionnelle. Par exemple, nous pouvons vouloir rendre un composant en overlay sur les périphériques desktop, mais inline sur la version mobile. `<Teleport>` prend en charge l'option `disabled` qui peut être activée dynamiquement :

```vue-html
<Teleport :disabled="isMobile">
  ...
</Teleport>
```

Nous pourrions alors mettre à jour dynamiquement `isMobile`.

## Plusieurs Teleports sur la même cible {#multiple-teleports-on-the-same-target}

Un cas d'utilisation courant serait un composant `<Modal>` réutilisable, avec la possibilité que plusieurs instances soient actives en même temps. Pour ce type de scénario, plusieurs composants `<Teleport>` peuvent monter leur contenu sur le même élément cible. L'ordre sera le même qu'avec un simple ajout avec les derniers montages seront situés après les précédents, mais tous à l'intérieur de l'élément cible.

Étant donné l'utilisation suivante :

```vue-html
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

Le résultat rendu serait :

```html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

## Deferred Teleport <sup class="vt-badge" data-text="3.5+" /> {#deferred-teleport}

In Vue 3.5 and above, we can use the `defer` prop to defer the target resolving of a Teleport until other parts of the application have mounted. This allows the Teleport to target a container element that is rendered by Vue, but in a later part of the component tree:

```vue-html
<Teleport defer to="#late-div">...</Teleport>

<!-- somewhere later in the template -->
<div id="late-div"></div>
```

Note that the target element must be rendered in the same mount / update tick with the Teleport - i.e. if the `<div>` is only mounted a second later, the Teleport will still report an error. The defer works similarly to the `mounted` lifecycle hook.

---

**Référence**

- [Référence de l'API `<Teleport>`](/api/built-in-components#teleport)
- [Gérer les Teleports en SSR](/guide/scaling-up/ssr#teleports)
