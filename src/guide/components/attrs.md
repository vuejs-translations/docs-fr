---
outline: deep
---

# Attributs implicitement déclarés (Fallthrough Attributes) {#fallthrough-attributes}

> Cette page suppose que vous avez déjà lu les [principes fondamentaux des composants](/guide/essentials/component-basics). Lisez-les d'abord si vous débutez avec les composants.

## Héritage d'attribut {#attribute-inheritance}

Un attribut implicitement déclaré (ou "fallthrough attribute") est un attribut ou un écouteur d'événement `v-on` qui est passé à un composant, mais qui n'est pas explicitement déclaré dans les [props](./props) ou les [émissions](./events#declaring-emitted-events) du composant récepteur. Des exemples courants de ceci incluent les attributs `class`, `style` et `id`.

Lorsqu'un composant affiche un seul élément racine, les attributs implicitement déclarés sont automatiquement ajoutés aux attributs de l'élément racine. Par exemple, le composant `<MyButton>` avec le template suivant :

```vue-html
<!-- template de <MyButton> -->
<button>Cliquez-Moi</button>
```

Et un parent utilisant ce composant avec :

```vue-html
<MyButton class="large" />
```

Le DOM rendu final serait :

```html
<button class="large">Cliquez-Moi</button>
```

Ici, `<MyButton>` n'a pas déclaré `class` comme une prop acceptée. Par conséquent, `class` est traitée comme un attribut implicitement déclaré et automatiquement ajoutée à l'élément racine de `<MyButton>`.

### Fusion de `class` and `style` {#class-and-style-merging}

Si l'élément racine du composant enfant a déjà des attributs `class` ou `style` existants, il sera fusionné avec les valeurs `class` et `style` héritées du parent. Supposons que nous modifions le template de `<MyButton>` dans l'exemple précédent en :

```vue-html
<!-- template de <MyButton> -->
<button class="btn">Cliquez-Moi</button>
```

Ainsi, le DOM final rendu deviendrait :

```html
<button class="btn large">Cliquez-Moi</button>
```

### Héritage de l'écouteur "v-on" {#v-on-listener-inheritance}

La même règle s'applique aux écouteurs d'événements `v-on` :

```vue-html
<MyButton @click="onClick" />
```

L'écouteur de `click` sera ajouté à l'élément racine de `<MyButton>`, c'est-à-dire l'élément natif `<button>`. Lorsque le `<button>` natif est cliqué, il déclenchera la méthode `onClick` du composant parent. Si le `<button>` natif a déjà un écouteur de `click` lié à `v-on`, alors les deux écouteurs se déclencheront.

### Héritage des composants imbriqués {#nested-component-inheritance}

Si un composant rend un autre composant comme son nœud racine, par exemple, nous avons refactorisé `<MyButton>` pour rendre un `<BaseButton>` comme sa racine :

```vue-html
<!-- template de <MyButton/> qui affiche uniquement un autre composant -->
<BaseButton />
```

Alors, les attributs implicitement déclarés reçus par `<MyButton>` seront automatiquement transmis à `<BaseButton>`.

Notez que :

1. Les attributs transférés n'incluent aucun attribut déclaré en tant que props, ou écouteurs `v-on` d'événements déclarés par `<MyButton>` - en d'autres termes, les props et écouteurs déclarés ont été "consommés" par `<MyButton>`.

2. Les attributs transférés peuvent être acceptés comme props par `<BaseButton>`, s'ils sont déclarés par celui-ci.

## Désactivation de l'héritage d'attribut {#disabling-attribute-inheritance}

Si vous **ne souhaitez pas** qu'un composant hérite automatiquement des attributs, vous pouvez définir `inheritAttrs: false` dans les options du composant.

<div class="composition-api">

Depuis la version 3.3, vous pouvez également utiliser [`defineOptions`](/api/sfc-script-setup#defineoptions) directement dans `<script setup>`:

```vue
<script setup>
defineOptions({
  inheritAttrs: false
})
// ...setup logic
</script>
```

</div>

Le scénario courant de désactivation de l'héritage d'attribut est lorsque les attributs doivent être appliqués à des éléments autres que le nœud racine. En définissant l'option `inheritAttrs` sur `false`, vous pouvez prendre le contrôle total sur l'endroit où les attributs fallthrough doivent être appliqués.

Ces attributs sont accessibles directement dans les expressions de template en tant que `$attrs` :

```vue-html
<span>Fallthrough attributes: {{ $attrs }}</span>
```

L'objet `$attrs` inclut tous les attributs qui ne sont pas déclarés par les `props` du composant ou options `emits` (par exemple, `class`, `style`, les écouteurs `v-on`, etc.).

Quelques notes :

- Contrairement aux props, les attributs implicitement déclarés conservent leur casse d'origine en JavaScript, donc un attribut comme `foo-bar` doit être accédé en tant que `$attrs['foo-bar']`.

- Un écouteur d'événement `v-on` comme `@click` sera exposé sur l'objet en tant que fonction sous `$attrs.onClick`.

En utilisant notre composant exemple `<MyButton>` de la [section précédente](#attribute-inheritance) - nous pouvons parfois avoir besoin d'envelopper l'élément `<button>` réel avec un `<div>` supplémentaire à des fins de style :

```vue-html
<div class="btn-wrapper">
  <button class="btn">Cliquez-Moi</button>
</div>
```

Nous voulons que tous les attributs implicitement déclarés tels que `class` et les écouteurs `v-on` soient appliqués au `<button>` sous-jacent, et non au `<div>`. Nous pouvons y parvenir avec `inheritAttrs: false` et `v-bind="$attrs"`:

```vue-html{2}
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">Cliquez-Moi</button>
</div>
```

Rappelez-vous que [`v-bind` sans argument](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes) lie toutes les propriétés d'un objet en tant qu'attributs de l'élément cible.

## Héritage d'attributs sur plusieurs nœuds racine {#attribute-inheritance-on-multiple-root-nodes}

Contrairement aux composants avec un seul nœud racine, les composants avec plusieurs nœuds racine n'ont pas de comportement automatique concenant les attributs impliciitement déclarés. Si `$attrs` n'est pas lié explicitement, un avertissement lors de l'exécution sera émis.

```vue-html
<CustomLayout id="custom-layout" @click="changeValue" />
```

Si `<CustomLayout>` a le template multi-racine suivant, il y aura un avertissement car Vue ne sait pas où appliquer les attributs implicitement déclarés :

```vue-html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

L'avertissement sera supprimé si `$attrs` est explicitement lié :

```vue-html{2}
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

## Accéder aux attributs implicitement déclarés en JavaScript {#accessing-fallthrough-attributes-in-javascript}

<div class="composition-api">

Si nécessaire, vous pouvez accéder aux attributs implicitement déclarés d'un composant dans `<script setup>` à l'aide de l'API `useAttrs()` :

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

Si vous n'utilisez pas `<script setup>`, `attrs` sera exposé en tant que propriété du contexte de `setup()` :

```js
export default {
  setup(props, ctx) {
    // les attributs implicitement déclarés sont exposés en tant que ctx.attrs
    console.log(ctx.attrs)
  }
}
```

Notez que bien que l'objet `attrs` reflète toujours les derniers attributs implicitement déclarés, il n'est pas réactif (pour des raisons de performances). Vous ne pouvez pas utiliser d'observateurs pour observer ses changements. Si vous avez besoin de réactivité, utilisez une prop. De manière alternative, vous pouvez utiliser `onUpdated()` pour effectuer des tâches avec les derniers `attrs` à chaque mise à jour.

</div>

<div class="options-api">

Si nécessaire, vous pouvez accéder aux attributs implicitement déclarés d'un composant via la propriété d'instance `$attrs` :

```js
export default {
  created() {
    console.log(this.$attrs)
  }
}
```

</div>
