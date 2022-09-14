# Syntaxe de template

Vue utilise une syntaxe de template basée sur HTML pour permettre de lier de manière déclarative le DOM rendu aux données de l'instance du composant sous-jacent. Tous les templates Vue sont du HTML syntaxiquement valide qui peut être analysé par des navigateurs et des analyseurs HTML conformes aux spécifications.

Sous le capot, Vue compile les templates en code JavaScript hautement optimisé. Combiné avec le système de réactivité, Vue est capable de déterminer intelligemment le nombre minimal de composants à restituer et d'appliquer la quantité minimale de manipulations DOM lorsque l'état de l'application change.

Si vous connaissez les concepts de DOM virtuel et préférez la puissance brute de JavaScript, vous pouvez également [TODO(fr)écrire directement des fonctions de rendu](/guide/extras/render-function.html) au lieu des templates, avec en option la prise en charge de JSX. Cependant, notez qu'ils ne bénéficient pas du même niveau d'optimisation au moment de la compilation que les templates.

## Interpolation de texte

La forme la plus élémentaire de liaison de données est l'interpolation de texte à l'aide de la syntaxe "Moustache" (doubles accolades) :

```vue-html
<span>Message : {{ msg }}</span>
```

La balise moustache sera remplacée par la valeur de la propriété `msg` de l'instance de composant correspondante. Il sera également mis à jour chaque fois que la propriété `msg` changera.

## HTML brut

Les doubles moustaches interprètent les données comme du texte brut et non comme du HTML. Afin de produire du vrai HTML, vous devrez utiliser la directive [TODO(fr)`v-html`](/api/built-in-directives.html#v-html):

```vue-html
<p>Utilisation de l'interpolation de texte : {{ htmlBrut }}</p>
<p>Utilisation de la directive v-html : <span v-html="htmlBrut"></span></p>
```
<script setup>
  const htmlBrut = '<span style="color: red">Ceci doit être rouge.</span>'
</script>

<div class="demo">
  <p>Utilisation de l'interpolation de texte : {{ htmlBrut }}</p>
  <p>Utilisation de la directive v-html : <span v-html="htmlBrut"></span></p>
</div>

Ici, nous rencontrons quelque chose de nouveau. L'attribut `v-html` que vous voyez s'appelle une **directive**. Les directives sont préfixées par `v-` pour indiquer qu'il s'agit d'attributs spéciaux fournis par Vue et, comme vous l'avez peut-être deviné, elles appliquent un comportement réactif spécial au DOM rendu. Ici, nous disons essentiellement "maintenir à jour le code HTML interne de cet élément avec la propriété `htmlBrut` sur l'instance active actuelle".

Le contenu de `span` sera remplacé par la valeur de la propriété `htmlBrut`, interprétée comme du HTML simple - les liaisons de données sont ignorées. Notez que vous ne pouvez pas utiliser `v-html` pour composer des templates partiels, car Vue n'est pas un moteur de template basé sur des chaînes de caractères. Au lieu de cela, les composants sont préférés comme unité fondamentale pour la réutilisation et la composition de l'interface utilisateur.

:::warning Avertissement de sécurité
L'affichage dynamique de code HTML arbitraire sur votre site Web peut être très dangereux, car il peut facilement entraîner des [TODO(fr)vulnérabilités XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). N'utilisez `v-html` que sur le contenu de confiance et **jamais** sur le contenu fourni par l'utilisateur.
:::

## Liaisons d'attributs

Les moustaches ne peuvent pas être utilisées dans les attributs HTML. À la place, utilisez une directive [TODO(fr)`v-bind`](/api/built-in-directives.html#v-bind) :

```vue-html
<div v-bind:id="idDynamique"></div>
```

La directive `v-bind` demande à Vue de garder l'attribut `id` de l'élément synchronisé avec la propriété `idDynamique` du composant. Si la valeur liée est `null` ou `undefined`, alors l'attribut sera supprimé de l'élément rendu.

### Raccourci

Parce que `v-bind` est si couramment utilisé, il a une syntaxe raccourcie :

```vue-html
<div :id="idDynamique"></div>
```

Les attributs commençant par `:` peuvent sembler un peu différents du HTML normal, mais il s'agit en fait d'un caractère valide pour les noms d'attributs et tous les navigateurs pris en charge par Vue peuvent l'analyser correctement. De plus, ils n'apparaissent pas dans le rendu final. La syntaxe abrégée est facultative, mais vous l'apprécierez probablement lorsque vous en apprendrez plus sur son utilisation plus tard.

> Pour le reste du guide, nous utiliserons la syntaxe abrégée dans les exemples de code, car c'est l'utilisation la plus courante pour les développeurs Vue.
### Attributs booleans

[Les attributs booléens](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes) sont des attributs qui peuvent indiquer des valeurs vrai/faux par sa présence sur un élément. Par exemple, [`disabled`](https://developer.mozilla.org/fr/docs/Web/HTML/Attributes/disabled) est l'un des attributs booléens les plus couramment utilisés.

`v-bind` fonctionne un peu différemment dans ce cas :

```vue-html
<button :disabled="boutonDésactivé">Bouton</button>
```

L'attribut `disabled` sera inclus si `boutonDésactivé` a une [valeur évaluée à vrai](https://developer.mozilla.org/fr/docs/Glossary/Truthy). Il sera également inclus si la valeur est une chaîne vide, en maintenant la cohérence avec `<button disabled="">`. Pour les [valeurs évaluées à faux](https://developer.mozilla.org/fr/docs/Glossary/Falsy), l'attribut sera omis.

### Liaison dynamique de plusieurs attributs

Si vous avez un objet JavaScript représentant plusieurs attributs qui ressemble à ceci :

<div class="composition-api">

```js
const objetDAttributs = {
  id: 'conteneur',
  class: 'wrapper'
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    objetDAttributs: {
      id: 'conteneur',
      class: 'wrapper'
    }
  }
}
```

</div>

Vous pouvez les lier à un seul élément en utilisant `v-bind` sans argument :

```vue-html
<div v-bind="objetDAttributs"></div>
```

## Utilisation d'expressions JavaScript

Jusqu'à présent, nous n'avons lié que des clés de propriété simples dans nos modèles. Mais Vue prend en charge toute la puissance des expressions JavaScript dans toutes les liaisons de données :

```vue-html
{{ nombre + 1 }}

{{ ok ? 'OUI' : 'NON' }}

{{ message.split('').reverse().join('') }}

<div :id="`liste-${id}`"></div>
```

Ces expressions seront évaluées comme du JavaScript dans la portée des données de l'instance de composant actuelle.

Dans les templates Vue, les expressions JavaScript peuvent être utilisées dans les positions suivantes :

- Dans une Interpolation de texte (moustaches)
- Dans la valeur d'attribut de toutes les directives Vue (attributs spéciaux qui commencent par `v-`)

### Expressions uniquement

Chaque liaison ne peut contenir qu'**une seule expression**. Une expression est un morceau de code qui peut donner une valeur. Une simple vérification est de savoir si elle peut être utilisée après un `return`.

Par conséquent, ce qui suit ne fonctionnera **PAS** :

```vue-html
<!-- ceci est une déclaration, pas une expression : -->
{{ var a = 1 }}

<!-- le contrôle de flux ne fonctionnera pas non plus, utiliser des expressions ternaires -->
{{ if (ok) { return message } }}
```

### Appel de fonctions

Il est possible d'appeler une méthode exposée au composant dans une expression de liaison :

```vue-html
<span :title="convertirEnTitre(date)">
  {{ formatterDate(date) }}
</span>
```

:::tip
Les fonctions appelées à l'intérieur des expressions de liaison seront appelées à chaque mise à jour du composant, elles ne doivent donc **pas**avoir d'effets de bord, tels que la modification de données ou le déclenchement d'opérations asynchrones.
:::

### Accès global restreint

Les expressions de template sont en bac à sable et n'ont accès qu'à une [TODO(fr)liste restreinte de variables globales](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsWhitelist.ts#L3). La liste expose les variables globales intégrées couramment utilisées telles que "Math" et "Date".

Les variables globales non explicitement incluses dans la liste, par exemple les propriétés jointes par l'utilisateur sur `window`, ne seront pas accessibles dans les expressions du template. Vous pouvez cependant définir explicitement des variables globales supplémentaires pour toutes les expressions Vue en les ajoutant à [TODO(fr)`app.config.globalProperties`](/api/application.html#app-config-globalproperties).

## Directives

Directives are special attributes with the `v-` prefix. Vue provides a number of [built-in directives](/api/built-in-directives.html), including `v-html` and `v-bind` which we have introduced above.

Directive attribute values are expected to be single JavaScript expressions (with the exception of `v-for`, `v-on` and `v-slot`, which will be discussed in their respective sections later). A directive's job is to reactively apply updates to the DOM when the value of its expression changes. Take [`v-if`](/api/built-in-directives.html#v-if) as an example:

```vue-html
<p v-if="seen">Now you see me</p>
```

Here, the `v-if` directive would remove / insert the `<p>` element based on the truthiness of the value of the expression `seen`.

### Arguments

Some directives can take an "argument", denoted by a colon after the directive name. For example, the `v-bind` directive is used to reactively update an HTML attribute:

```vue-html
<a v-bind:href="url"> ... </a>

<!-- shorthand -->
<a :href="url"> ... </a>
```

Here `href` is the argument, which tells the `v-bind` directive to bind the element's `href` attribute to the value of the expression `url`. In the shorthand, everything before the argument (i.e. `v-bind:`) is condensed into a single character, `:`.

Another example is the `v-on` directive, which listens to DOM events:

```vue-html
<a v-on:click="doSomething"> ... </a>

<!-- shorthand -->
<a @click="doSomething"> ... </a>
```

Here the argument is the event name to listen to: `click`. `v-on` has a corresponding shorthand, namely the `@` character. We will talk about event handling in more detail too.

### Dynamic Arguments

It is also possible to use a JavaScript expression in a directive argument by wrapping it with square brackets:

```vue-html
<!--
Note that there are some constraints to the argument expression,
as explained in the "Dynamic Argument Value Constraints" and "Dynamic Argument Syntax Constraints" sections below.
-->
<a v-bind:[attributeName]="url"> ... </a>

<!-- shorthand -->
<a :[attributeName]="url"> ... </a>
```

Here `attributeName` will be dynamically evaluated as a JavaScript expression, and its evaluated value will be used as the final value for the argument. For example, if your component instance has a data property, `attributeName`, whose value is `"href"`, then this binding will be equivalent to `v-bind:href`.

Similarly, you can use dynamic arguments to bind a handler to a dynamic event name:

```vue-html
<a v-on:[eventName]="doSomething"> ... </a>

<!-- shorthand -->
<a @[eventName]="doSomething">
```

In this example, when `eventName`'s value is `"focus"`, `v-on:[eventName]` will be equivalent to `v-on:focus`.

#### Dynamic Argument Value Constraints

Dynamic arguments are expected to evaluate to a string, with the exception of `null`. The special value `null` can be used to explicitly remove the binding. Any other non-string value will trigger a warning.

#### Dynamic Argument Syntax Constraints

Dynamic argument expressions have some syntax constraints because certain characters, such as spaces and quotes, are invalid inside HTML attribute names. For example, the following is invalid:

```vue-html
<!-- This will trigger a compiler warning. -->
<a :['foo' + bar]="value"> ... </a>
```

If you need to pass a complex dynamic argument, it's probably better to use a [computed property](./computed.html), which we will cover shortly.

When using in-DOM templates (templates directly written in an HTML file), you should also avoid naming keys with uppercase characters, as browsers will coerce attribute names into lowercase:

```vue-html
<a :[someAttr]="value"> ... </a>
```

The above will be converted to `:[someattr]` in in-DOM templates. If your component has a `someAttr` property instead of `someattr`, your code won't work. Templates inside Single-File Components are **not** subject to this constraint.

### Modifiers

Modifiers are special postfixes denoted by a dot, which indicate that a directive should be bound in some special way. For example, the `.prevent` modifier tells the `v-on` directive to call `event.preventDefault()` on the triggered event:

```vue-html
<form @submit.prevent="onSubmit">...</form>
```

You'll see other examples of modifiers later, [for `v-on`](./event-handling.html#event-modifiers) and [for `v-model`](./forms.html#modifiers), when we explore those features.

And finally, here's the full directive syntax visualized:

![directive syntax graph](./images/directive.png)

<!-- https://www.figma.com/file/BGWUknIrtY9HOmbmad0vFr/Directive -->
