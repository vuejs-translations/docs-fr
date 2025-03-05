# SFC CSS Features {#sfc-css-features}

## CSS à portée limitée {#scoped-css}

Lorsqu'une balise `<style>` possède l'attribut `scoped`, son CSS s'appliquera uniquement aux éléments du composant actuel. Cela est comparable à l'encapsulation des styles que l'on trouve dans le Shadow DOM. Il y a cependant quelques mises en gardes, mais cela ne nécessite aucun polyfill. PostCSS est utilisé pour transformer les éléments suivants :

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

En ce qui suit :

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

### Éléments racines du composant enfant {#child-component-root-elements}

Avec `scoped`, les styles du composant parent ne ruisselleront pas dans les composants enfants. Toutefois, le nœud racine d'un composant enfant sera affecté à la fois par le CSS à portée limitée du parent et par le CSS à portée limitée de l'enfant. Cela a été conçu afin que le parent puisse donner un style à l'élément racine de l'enfant à des fins de mise en page.

### Sélecteurs profonds {#deep-selectors}

Si vous voulez qu'un sélecteur dans les styles `scoped` soit "profond", c'est-à-dire qu'il affecte les composants enfants, vous pouvez utiliser la pseudo-classe `:deep()` :

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

Le code ci-dessus sera compilé en :

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

:::tip
Les contenus du DOM créés avec `v-html` ne sont pas affectés par les styles à portée limitée, mais vous pouvez tout de même les styliser en utilisant des sélecteurs profonds.
:::

### Sélecteurs de slots {#slotted-selectors}

Par défaut, les styles à portée limitée n'affectent pas les contenus rendus par `<slot/>`, car ils sont considérés comme appartenant au composant parent qui les transmet. Pour cibler explicitement le contenu des slots, utilisez la pseudo-classe `:slotted` :

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### Sélecteurs globaux {#global-selectors}

Si vous voulez qu'une seule règle s'applique de manière globale, vous pouvez utiliser la pseudo-classe `:global` plutôt que de créer un autre `<style>` (voir ci-dessous) :

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

### Mélanger les styles locaux et globaux {#mixing-local-and-global-styles}

Vous pouvez également inclure des styles généraux et d'autres à portée limitée dans le même composant :

```vue
<style>
/* styles globaux */
</style>

<style scoped>
/* styles locaux */
</style>
```

### Conseils concernant les styles à portée limitée {#scoped-style-tips}

- **Les styles à portée limitée ne rendent pas les classes inutiles**. En raison de la façon dont les navigateurs rendent les différents sélecteurs CSS, `p { color : red }` sera bien plus lent lorsqu'il a une portée limitée (c'est-à-dire lorsqu'il est combiné avec un sélecteur d'attribut). Si vous utilisez des classes ou des identifiants à la place, comme dans `.example { color : red }`, vous éliminez en grande partie ce problème de performances.

- **Faites attention aux sélecteurs descendants dans les composants récursifs!** Pour une règle CSS avec le sélecteur `.a .b`, si l'élément qui correspond à `.a` contient un composant enfant récursif, alors tous les `.b` de ce composant enfant seront pris en compte par la règle.

## Modules CSS {#css-modules}

Une balise `<style module>` est compilée en tant que [modules CSS](https://github.com/css-modules/css-modules) et expose les classes CSS résultantes au composant en tant qu'objet via la clé `$style` :

```vue
<template>
  <p :class="$style.red">This should be red</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

Les classes qui en résultent sont hachées pour éviter les collisions, ce qui permet d'obtenir le même effet que de limiter la portée du CSS au seul composant actuel.

Consultez la [spécification des modules CSS](https://github.com/css-modules/css-modules) pour plus de détails, notamment les parties sur les [exceptions globales](https://github.com/css-modules/css-modules/blob/master/docs/composition.md#exceptions) et la [composition](https://github.com/css-modules/css-modules/blob/master/docs/composition.md#composition).

### Nom d'injection personnalisé {#custom-inject-name}

Vous pouvez personnaliser la clé de propriété de l'objet de classes injectées en donnant une valeur à l'attribut `module` :

```vue
<template>
  <p :class="classes.red">red</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

### Utilisation avec la Composition API {#usage-with-composition-api}

Les classes injectées sont accessibles dans `setup()` et `<script setup>` via l'API `useCssModule`. Pour les blocs `<style module>` avec des noms d'injection personnalisés, `useCssModule` accepte la valeur de l'attribut `module` correspondant comme premier argument :

```js
import { useCssModule } from 'vue'

// à l'intérieur de setup()...
// par défaut, renvoie les classes pour <style module>
useCssModule()

// nommé, renvoie les classes pour <style module="classes">
useCssModule('classes')
```

- **Exemple**

```vue
<script setup lang="ts">
import { useCssModule } from 'vue'

const classes = useCssModule()
</script>

<template>
  <p :class="classes.red">rouge</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

## `v-bind()` dans du CSS {#v-bind-in-css}

Les balises `<style>` des composants monopages permettent de lier les valeurs CSS à l'état dynamique des composants à l'aide de la fonction CSS `v-bind` :

```vue
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

La syntaxe fonctionne avec [`<script setup>`](./sfc-script-setup), et prend en charge les expressions JavaScript (qui doivent être placées entre guillemets) :

```vue
<script setup>
import { ref } from 'vue'
const theme = ref({
    color: 'red',
})
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

La valeur réelle sera compilée dans une propriété personnalisée CSS hachée, afin que le CSS reste statique. La propriété personnalisée sera appliquée à l'élément racine du composant via des styles en ligne et mise à jour de manière réactive si la valeur source change.
