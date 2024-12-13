# Règles de priorité B : Fortement recommandées {#priority-b-rules-strongly-recommended}

::: warning Note
Ce guide de style Vue.js est obsolète et doit être revu. Si vous avez des questions ou des suggestions, veuillez [ouvrir une issue](https://github.com/vuejs/docs/issues/new).
:::

Ces règles améliorent la lisibilité et/ou l'expérience des développeurs dans la plupart des projets. Votre code fonctionnera toujours si vous les enfreignez, mais les violations doivent être rares et bien justifiées.

## Fichiers de composants {#component-files}

**Chaque fois qu'un système de build est disponible pour concaténer des fichiers, chaque composant doit être dans son propre fichier.**

Cela vous aide à trouver plus rapidement un composant lorsque vous devez le modifier ou revoir comment l'utiliser.

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```js
app.component('TodoList', {
  // ...
})

app.component('TodoItem', {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```

</div>

## La casse des noms de composants {#single-file-component-filename-casing}

**Le nom des [composants monofichiers](/guide/scaling-up/sfc) doit toujours être soit en PascalCase soit en kebab-case.**

PascalCase fonctionne mieux avec l'auto-complétion dans les éditeurs de code, car elle est cohérente avec la façon dont nous référençons les composants en JS(X) et les templates, dans la mesure du possible. Cependant, le nom des fichiers à casse mixte peut parfois créer des problèmes sur les systèmes de fichiers insensibles à la casse, c'est pourquoi kebab-case est également parfaitement acceptable.

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```

</div>

## Nom des composants de base {#base-component-names}

**Les composants de base (a.k.a. présentation, muet, ou composant pure) qui appliquent un style et des conventions spécifiques à l'application doivent tous commencer par un préfixe spécifique, tel que `Base`, `App`, ou `V`.**

::: details Explications détaillées
Ces composants jettent les bases d'un style et d'un comportement cohérents dans votre application. Ils peuvent **seulement** contenir :

- Des éléments HTML,
- D'autres composants de base, et
- Un composant UI tiers.

Mais ils ne contiendront **jamais** des états globaux (par exemple, provenant de Pinia ou Vuex).

Leurs noms incluent souvent le nom d'un élément qu'ils encapsulent (par exemple, `BaseButton`, `BaseTable`), à moins qu'aucun élément n'existe pour leur usage spécifique (par exemple `BaseIcon`). Si vous créez des composants similaires pour un contexte plus spécifique, ils utiliseront presque toujours ces composants (par exemple, `BaseButton` peut être utilisé dans `ButtonSubmit`).

Quelques avantages de cette convention :

- Lorsqu'ils sont classés par ordre alphabétique dans les éditeurs, les composants de base de votre application sont tous répertoriés ensemble, ce qui facilite leur identification.

- Puisque les noms des composants doivent toujours être des mots composés, cette convention vous fait éviter d'avoir à choisir des préfixes arbitraires pour des composants simples (e.g. MyButton, VueButton).

- Étant donné que ces composants sont fréquemment utilisés, vous pouvez simplement les rendre globaux au lieu de les importer partout. Un préfixe rend cela possible avec Webpack :

  ```js
  const requireComponent = require.context(
    './src',
    true,
    /Base[A-Z]\w+\.(vue|js)$/
  )
  requireComponent.keys().forEach(function (fileName) {
    let baseComponentConfig = requireComponent(fileName)
    baseComponentConfig =
      baseComponentConfig.default || baseComponentConfig
    const baseComponentName =
      baseComponentConfig.name ||
      fileName.replace(/^.+\//, '').replace(/\.\w+$/, '')
    app.component(baseComponentName, baseComponentConfig)
  })
  ```

  :::

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```

</div>

## Noms des composants étroitement liés {#tightly-coupled-component-names}

**Les composants enfants étroitement couplés à leur parent doivent inclure le nom du composant parent comme préfixe.**

Si un composant n'a de sens que dans le contexte d'un seul composant parent, cette relation doit être évidente dans son nom. Étant donné que les éditeurs organisent généralement les fichiers par ordre alphabétique, cela permet également de conserver ces fichiers associés les uns à côté des autres.

::: details Explications détaillées
Vous pourriez être tenté de résoudre ce problème en imbriquant les composants enfants dans des répertoires nommés d'après leur parent. Par exemple :

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

ou :

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

Ceci n'est pas recommandé, car pourrait entraîner :

- De nombreux fichiers avec des noms similaires, ce qui rend le changement rapide de fichier dans les éditeurs de code plus difficile.
- De nombreux sous-répertoires imbriqués, ce qui augmente le temps nécessaire pour parcourir les composants dans la barre latérale d'un éditeur.
  :::

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```

</div>

## Ordre des mots dans les noms des composants {#order-of-words-in-component-names}

**Les noms des composants doivent commencer par les mots de plus haut niveau (souvent les plus généraux) et se terminer par des mots de modification descriptifs.**

::: details Explications détaillées
Vous vous demandez peut-être :

> "Pourquoi forcerions-nous les noms de composants à utiliser un langage moins naturel ?"

En anglais naturel, les adjectifs et autres descripteurs apparaissent généralement avant les noms, tandis que les exceptions nécessitent des mots connecteurs. Par exemple :

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

Vous pouvez certainement inclure ces connecteurs dans les noms de composants si vous le souhaitez, mais l'ordre est toujours important.

Notez également que **ce qui est considéré comme "de plus haut niveau" sera contextuel à votre application**. Par exemple, imaginez une application avec un formulaire de recherche. Il peut inclure des composants comme celui-ci :

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

Comme vous le remarquerez peut-être, il est assez difficile de voir quels composants sont spécifiques à la recherche. Renommons maintenant les composants selon la règle :

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

Étant donné que les éditeurs organisent généralement les fichiers par ordre alphabétique, toutes les relations importantes entre les composants sont désormais évidentes en un coup d'œil.

Vous pourriez être tenté de résoudre ce problème différemment, en imbriquant tous les composants de recherche dans un répertoire "recherche", puis tous les composants de paramètres dans un répertoire "paramètres". Nous vous recommandons de ne considérer cette approche que dans les très grandes applications (par exemple, plus de 100 composants), pour les raisons suivantes :

- Il faut généralement plus de temps pour naviguer dans les sous-répertoires imbriqués que pour parcourir un seul répertoire `components`.
- Les conflits de nom (par exemple, plusieurs composants ButtonDelete.vue) rendent plus difficile la navigation rapide vers un composant spécifique dans un éditeur de code.
- Le refactoring devient plus difficile, car la recherche et le remplacement ne sont souvent pas suffisants pour mettre à jour les références relatives à un composant déplacé.
  :::

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```

</div>

## Composants auto-fermants {#self-closing-components}

**Les composants sans contenu doivent être auto-fermants dans les [composants monofichiers](/guide/scaling-up/sfc), dans les templates, et dans [JSX](/guide/extras/render-function#jsx-tsx) - mais jamais dans les templates du DOM.**

Les composants auto-fermants n'indiquent pas seulement qu'ils n'ont pas de contenu, mais aussi qu'ils ne sont pas censés en avoir. C'est la différence entre une page blanche dans un livre et une autre intitulée «Cette page est laissée vierge intentionnellement». Votre code est également plus propre sans la balise de fermeture inutile.

Malheureusement, HTML n'autorise pas que les éléments personnalisés soient auto-fermants - seulement les [éléments officiels "void"](https://www.w3.org/TR/html/syntax.html#void-elements). C'est pourquoi la stratégie n'est possible que lorsque le compilateur de templates de Vue peut atteindre le template avant le DOM, puis servir le HTML conforme aux spécifications.

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```vue-html
<!-- Dans les composants monofichiers, string templates, et JSX -->
<MyComponent></MyComponent>
```

```vue-html
<!-- Dans les templates du DOM -->
<my-component/>
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```vue-html
<!-- Dans les composants monofichiers, string templates, et JSX -->
<MyComponent/>
```

```vue-html
<!-- Dans les templates du DOM -->
<my-component></my-component>
```

</div>

## La casse des noms de composants dans les templates {#component-name-casing-in-templates}

**Dans la plupart des projets, les noms de composants doivent toujours être en PascalCase dans les [composants monofichiers](/guide/scaling-up/sfc) et dans les string templates - mais en kebab-case dans les templates du DOM.**

PascalCase a quelques avantages par rapport au kebab-case :

- Les éditeurs peuvent compléter automatiquement les noms de composants dans les templates, car le PascalCase est également utilisé en JavaScript.
- `<MyComponent>` est visuellement plus distinct d'un élément HTML que `<my-component>`, car il y a deux différences de caractères (les deux majuscules), plutôt qu'une seule (un trait d'union).
- Si vous utilisez des éléments personnalisés non-Vue dans vos templates, tels qu'un Web Component, le PascalCase garantit que vos composants Vue restent clairement visibles.

Malheureusement, en raison de l'insensibilité à la casse de HTML, les templates du DOM doivent toujours utiliser le kebab-case.

Notez également que si vous êtes déjà beaucoup investi dans l'usage du kebab-case, la cohérence avec les conventions HTML et la possibilité d'utiliser la même casse dans tous vos projets peuvent être plus importantes que les avantages énumérés ci-dessus. Dans ces cas, **l'utilisation de kebab-case partout est également acceptable**.

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```vue-html
<!-- Dans les composants monofichiers, string templates, et JSX -->
<mycomponent/>
```

```vue-html
<!-- Dans les composants monofichiers, string templates, et JSX -->
<myComponent/>
```

```vue-html
<!-- Dans les templates du DOM -->
<MyComponent></MyComponent>
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```vue-html
<!-- Dans les composants monofichiers, string templates, et JSX -->
<MyComponent/>
```

```vue-html
<!-- Dans les templates du DOM -->
<my-component></my-component>
```

OU

```vue-html
<!-- Partout -->
<my-component></my-component>
```

</div>

## La casse des noms de composants en JS/JSX {#component-name-casing-in-js-jsx}

**Les noms de composants en JS/[JSX](/guide/extras/render-function#jsx-tsx) devraient toujours être en PascalCase, quoiqu'ils puissent être en kebab-case dans des strings pour des applications plus simples qui n'utilisent que l'enregistrement global des composants via `app.component`.**

::: details Explications détaillées
En JavaScript, le PascalCase est la convention pour les classes et les constructeurs de prototypes - essentiellement, tout ce qui peut avoir des instances distinctes. Les composants Vue ont également des instances, il est donc logique d'utiliser également PascalCase. Comme avantage supplémentaire, l'utilisation de PascalCase dans JSX (et les templates) permet aux gens qui lisent le code de distinguer plus facilement les composants et les éléments HTML.

Cependant, pour les applications qui utilisent **uniquement** les définitions de composants globales via `app.component`, nous recommandons plutôt le kebab-case. Les raisons sont :

- Il est rare que des composants globaux soient référencés en JavaScript, donc suivre une convention pour JavaScript a peu de sens.
- Ces applications incluent toujours de nombreux templates du DOM, où [kebab-case **doit** être utilisée](#component-name-casing-in-templates).
  :::

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```js
app.component('myComponent', {
  // ...
})
```

```js
import myComponent from './MyComponent.vue'
```

```js
export default {
  name: 'myComponent'
  // ...
}
```

```js
export default {
  name: 'my-component'
  // ...
}
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```js
app.component('MyComponent', {
  // ...
})
```

```js
app.component('my-component', {
  // ...
})
```

```js
import MyComponent from './MyComponent.vue'
```

```js
export default {
  name: 'MyComponent'
  // ...
}
```

</div>

## Nom des composants en mot entier {#full-word-component-names}

**Les noms des composants devraient être écrit avec des mots entiers plutôt ques des abréviations.**

L'auto-complétion dans les éditeurs de code fait gagner énormément de temps, tandis que la clarté qu'ils fournissent est inestimable. Les abréviations peu courantes, en particulier, doivent toujours être évitées.

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

</div>

## La casse des noms de prop {#prop-name-casing}

**Les noms de prop doivent toujours utiliser camelCase lors des déclarations. Lorsqu'elles sont utilisées dans des template du DOM, les props doivent être écrites en kebab-case. Les templates des composants monofichiers et [JSX](/guide/extras/render-function#jsx-tsx) peuvent utiliser des props en kebab-case ou en camelCase. La casse doit être cohérente - si vous choisissez d'utiliser des props en camelCase, assurez-vous de ne pas utiliser la casse kebab-case ailleurs dans votre application.**

<div class="style-example style-example-bad">
<h3>À éviter</h3>

<div class="options-api">

```js
props: {
  'greeting-text': String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  'greeting-text': String
})
```

</div>

```vue-html
// for in-DOM templates
<welcome-message greetingText="hi"></welcome-message>
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

<div class="options-api">

```js
props: {
  greetingText: String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  greetingText: String
})
```

</div>

```vue-html
// pour les SFC - assurez-vous que la casse est cohérente tout au long du projet
// vous pouvez utiliser l'une ou l'autre des conventions, mais nous vous déconseillons de mélanger deux styles de casse différents
<WelcomeMessage greeting-text="hi"/>
// ou
<WelcomeMessage greetingText="hi"/>
```

```vue-html
// pour les template du DOM
<welcome-message greeting-text="hi"></welcome-message>
```

</div>

## Éléments à attributs multiples {#multi-attribute-elements}

**Les éléments avec plusieurs attributs doivent s'étendre sur plusieurs lignes, avec un attribut par ligne.**

En JavaScript, étendre des objets avec plusieurs propriétés sur plusieurs lignes est largement considéré comme une bonne convention, car ils sont beaucoup plus faciles à lire. Les templates et [JSX](/guide/extras/render-function#jsx-tsx) méritent la même considération.

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```vue-html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

```vue-html
<MyComponent foo="a" bar="b" baz="c"/>
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```vue-html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

```vue-html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

</div>

## Expressions simples dans les templates {#simple-expressions-in-templates}

Les templates de composants ne doivent inclure que des expressions simples, avec des expressions plus complexes refactorisées en propriétés calculées ou en méthodes.

Les expressions complexes dans vos templates les rendent moins déclaratifs. Nous devons nous efforcer de décrire _ce qui_ devrait apparaître, et non _comment_ nous calculons cette valeur. Les propriétés calculées et les méthodes permettent également de réutiliser le code.

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```vue-html
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```vue-html
<!-- Dans un template -->
{{ normalizedFullName }}
```

<div class="options-api">

```js
// L'expression complexe a été déplacée vers une propriété calculée
computed: {
  normalizedFullName() {
    return this.fullName.split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }
}
```

</div>

<div class="composition-api">

```js
// L'expression complexe a été déplacée vers une propriété calculée
const normalizedFullName = computed(() =>
  fullName.value
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
)
```

</div>

</div>

## Propriétés calculées simples {#simple-computed-properties}

**Les propriétés calculées complexes doivent être divisées en propriétés plus simples.**

::: details Explications détaillées
Les propriétés calculées plus simples et bien nommées sont :

- **Plus faciles à tester**

  Lorsque chaque propriété calculée ne contient qu'une expression très simple, avec très peu de dépendances, il est beaucoup plus facile d'écrire des tests qui vérifient leur bon fonctionnement.

- **Plus faciles à lire**

  Simplifier les propriétés calculées vous oblige à donner à chaque valeur un nom descriptif, même si elle n'est pas réutilisée. Cela permet aux autres développeurs (et à vous-même) de se concentrer beaucoup plus facilement sur le code qui leur tient à cœur et de comprendre ce qui se passe.

- **Plus adaptables à l'évolution des besoins**

  Toute valeur pouvant être nommée peut être utile pour la vue. Par exemple, nous pourrions décider d'afficher un message indiquant à l'utilisateur combien d'argent il a économisé. Nous pourrions également décider de calculer la taxe de vente, mais peut-être l'afficher séparément, plutôt que dans le cadre du prix final.

  Les propriétés calculées simples et ciblées font réduire le nombre d'hypothèses sur la façon dont les informations seront utilisées, elles nécessitent donc moins de refactoring à mesure que les exigences changent.
  :::

<div class="style-example style-example-bad">
<h3>À éviter</h3>

<div class="options-api">

```js
computed: {
  price() {
    const basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```

</div>

<div class="composition-api">

```js
const price = computed(() => {
  const basePrice = manufactureCost.value / (1 - profitMargin.value)
  return basePrice - basePrice * (discountPercent.value || 0)
})
```

</div>

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

<div class="options-api">

```js
computed: {
  basePrice() {
    return this.manufactureCost / (1 - this.profitMargin)
  },

  discount() {
    return this.basePrice * (this.discountPercent || 0)
  },

  finalPrice() {
    return this.basePrice - this.discount
  }
}
```

</div>

<div class="composition-api">

```js
const basePrice = computed(
  () => manufactureCost.value / (1 - profitMargin.value)
)

const discount = computed(
  () => basePrice.value * (discountPercent.value || 0)
)

const finalPrice = computed(() => basePrice.value - discount.value)
```

</div>

</div>

## Les valeurs des attributs entres guillemets {#quoted-attribute-values}

**Les valeurs des attributs HTML non-vide doivent toujours être entre des guillemets (simple (' ') ou double (" "), celui qui n'est pas utilisé dans votre JS).**

Bien que les valeurs d'attribut sans espace ne soient pas obligées d'avoir des guillemets en HTML, cette pratique conduit souvent à _éviter_ les espaces, ce qui rend les valeurs d'attribut moins lisibles.

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```vue-html
<input type=text>
```

```vue-html
<AppSidebar :style={width:sidebarWidth+'px'}>
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```vue-html
<input type="text">
```

```vue-html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```

</div>

## Les raccourcis de directives {#directive-shorthands}

**Les raccourcis de directives (`:` pour `v-bind:`, `@` pour `v-on:` et `#` pour `v-slot`) doivent toujours être utilisés ou ne jamais l'être.**

<div class="style-example style-example-bad">
<h3>À éviter</h3>

```vue-html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Ceci est le titre de la page</h1>
</template>

<template #footer>
  <p>Ici quelques infos contacts</p>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>OK</h3>

```vue-html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

```vue-html
<input
  @input="onInput"
  @focus="onFocus"
>
```

```vue-html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>

<template v-slot:footer>
  <p>Here's some contact info</p>
</template>
```

```vue-html
<template #header>
  <h1>Here might be a page title</h1>
</template>

<template #footer>
  <p>Here's some contact info</p>
</template>
```

</div>
