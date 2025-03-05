# Directives natives {#built-in-directives}

## v-text {#v-text}

Met à jour le contenu texte d'un élément.

- **Attendu :** `string`

- **Détails**

  `v-text` fonctionne en définissant la propriété [textContent](https://developer.mozilla.org/fr/docs/Web/API/Node/textContent) de l'élément, de sorte qu'elle écrasera tout contenu existant dans l'élément. Si vous devez mettre à jour `textContent`, vous devez utiliser les [interpolations moustaches](/guide/essentials/template-syntax#text-interpolation) à la place.

- **Exemple**

  ```vue-html
  <span v-text="msg"></span>
  <!-- same as -->
  <span>{{msg}}</span>
  ```

- **Voir aussi** [Syntaxe de template - Interpolation de texte](/guide/essentials/template-syntax#text-interpolation)

## v-html {#v-html}

Met à jour [innerHTML](https://developer.mozilla.org/fr/docs/Web/API/Element/innerHTML) de l'élément.

- **Attendu :** `string`

- **Détails**

  Le contenu de `v-html` est inséré en tant qu'HTML simple - la syntaxe des templates de Vue ne sera pas traitée. Si vous vous retrouvez à essayer de composer des templates en utilisant `v-html`, essayez de repenser la solution en utilisant plutôt des composants.

  ::: warning Remarque sur la sécurité
  Rendre dynamiquement du HTML arbitraire sur votre site web peut être très dangereux car cela peut facilement conduire à des [attaques XSS](https://fr.wikipedia.org/wiki/Cross-site_scripting). N'utilisez `v-html` que sur du contenu de confiance et **jamais** sur du contenu fourni par l'utilisateur.
  :::

  Dans les [composants monofichiers](/guide/scaling-up/sfc), les styles `scoped` ne s'appliqueront pas au contenu de `v-html`, car ce HTML n'est pas traité par le compilateur de templates de Vue. Si vous souhaitez cibler le contenu de `v-html` avec un CSS scopé, vous pouvez utiliser des [modules CSS](./sfc-css-features#css-modules) ou un élément `<style>` global supplémentaire avec une stratégie de scoping manuelle telle que BEM.

- **Exemple**

  ```vue-html
  <div v-html="html"></div>
  ```

- **Voir aussi** [Syntaxe de template - HTML brut](/guide/essentials/template-syntax#raw-html)

## v-show {#v-show}

Fait basculer la visibilité de l'élément en fonction de la valeur évaluée à vrai ou faux de l'expression.

- **Attendu :** `any`

- **Détails**

  `v-show` fonctionne en fixant la propriété CSS `display` via des styles littéraux, et essaiera de respecter la valeur initiale `display` lorsque l'élément est visible. Elle déclenche également des transitions lorsque sa condition change.

- **Voir aussi** [Rendu conditionnel - v-show](/guide/essentials/conditional#v-show)

## v-if {#v-if}

Rend conditionnellement un élément ou un fragment de template en fonction de la valeur de l'expression, évaluée à vrai ou faux.

- **Attendu :** `any`

- **Détails**

  Lorsqu'un élément comportant `v-if` est activé / désactivé, l'élément et les directives / composants qu'il contient sont détruits et reconstruits. Si la condition initiale est fausse, le contenu interne ne sera pas rendu du tout.

  Peut être utilisée sur `<template>` pour désigner un bloc conditionnel contenant uniquement du texte ou plusieurs éléments.

  Cette directive déclenche des transitions lorsque sa condition change.

  Lorsqu'elles sont utilisées ensemble, `v-if' a une priorité plus élevée que `v-for'. Il est déconseillé d'utiliser ces deux directives ensemble sur un même élément - voir le [guide du rendu de liste](/guide/essentials/list#v-for-with-v-if) pour plus de détails.

- **Voir aussi** [Rendu conditionnel - v-if](/guide/essentials/conditional#v-if)

## v-else {#v-else}

Représente le bloc "else" pour `v-if` ou une chaîne `v-if` / `v-else-if`.

- **N'attend pas d'expression**

- **Détails**

  - Restriction : l'élément frère précédent doit posséder `v-if` ou `v-else-if`.

  - Peut être utilisée sur `<template>` pour désigner un bloc conditionnel contenant uniquement du texte ou plusieurs éléments.

- **Exemple**

  ```vue-html
  <div v-if="Math.random() > 0.5">
    Now you see me
  </div>
  <div v-else>
    Now you don't
  </div>
  ```

- **Voir aussi** [Rendu conditionnel - v-else](/guide/essentials/conditional#v-else)

## v-else-if {#v-else-if}

Désigne le bloc "else if" pour `v-if`. Peut être chaîné.

- **Attendu :** `any`

- **Détails**

  - Restriction : l'élément frère précédent doit avoir `v-if` ou `v-else-if`.

  - Peut être utilisé sur `<template>` pour désigner un bloc conditionnel contenant uniquement du texte ou plusieurs éléments.

- **Exemple**

  ```vue-html
  <div v-if="type === 'A'">
    A
  </div>
  <div v-else-if="type === 'B'">
    B
  </div>
  <div v-else-if="type === 'C'">
    C
  </div>
  <div v-else>
    Not A/B/C
  </div>
  ```

- **Voir aussi** [Rendu conditionnel - v-else-if](/guide/essentials/conditional#v-else-if)

## v-for {#v-for}

Rend l'élément ou le bloc d'un template plusieurs fois en fonction des données sources.

- **Attendu :** `Array | Object | number | string | Iterable`

- **Détails**

  La valeur de la directive doit utiliser la syntaxe spéciale `alias in expression` pour fournir un alias pour l'élément courant sur lequel on itère :

  ```vue-html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  De manière alternative, vous pouvez également spécifier un alias pour l'index (ou la clé si elle est utilisée sur un objet) :

  ```vue-html
  <div v-for="(item, index) in items"></div>
  <div v-for="(value, key) in object"></div>
  <div v-for="(value, name, index) in object"></div>
  ```

  Le comportement par défaut de `v-for` essaiera de corriger les éléments en place sans les déplacer. Pour forcer la réorganisation des éléments, vous devez fournir un indice d'ordre avec l'attribut spécial `key` :

  ```vue-html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  `v-for` peut également fonctionner sur les valeurs qui implémentent le [protocole d'itération](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol), y compris les `Map` et `Set` natifs.

- **Voir aussi**
  - [Rendu de liste](/guide/essentials/list)

## v-on {#v-on}

Attache un écouteur d'événements à l'élément.

- **Raccourci :** `@`

- **Attendu :** `Function | Inline Statement | Object (sans argument)`

- **Argument :** `event` (optionnel lors de l'utilisation de la syntaxe objet)

- **Modificateurs**

  - `.stop` - appelle `event.stopPropagation()`.
  - `.prevent` - appelle `event.preventDefault()`.
  - `.capture` - ajoute un écouteur d'événements en mode capture.
  - `.self` - ne déclenche le gestionnaire que si l'événement a été envoyé par cet élément.
  - `.{keyAlias}` - ne déclenche le gestionnaire que sur certaines clés.
  - `.once` - déclenche le gestionnaire au moins une fois.
  - `.left` - ne déclenche le gestionnaire que pour les événements liés au bouton gauche de la souris.
  - `.right` - ne déclenche le gestionnaire que pour les événements liés au bouton droit de la souris.
  - `.middle` - ne déclenche le gestionnaire que pour les événements liés au bouton du milieu de la souris.
  - `.passive` - attache un événement DOM avec `{ passive : true }`.

- **Détails**

  Le type d'événement est indiqué par l'argument. L'expression peut être un nom de méthode, une déclaration littérale, ou omise si des modificateurs sont présents.

  Lorsqu'elle est utilisée sur un élément normal, elle écoute uniquement les [**événements natifs du DOM**](https://developer.mozilla.org/fr/docs/Web/Events). Lorsqu'elle est utilisée sur un composant d'éléments personnalisés, elle écoute les **événements personnalisés** émis sur ce composant enfant.

  Lorsqu'elle écoute les événements natifs du DOM, la méthode reçoit l'événement natif comme seul argument. Si vous utilisez une déclaration en ligne, la déclaration a accès à la propriété spéciale `$event` : `v-on:click="handle('ok', $event)"`.

  `v-on` supporte également la liaison à un objet de paires événement / écouteur sans argument. Notez que lorsque vous utilisez la syntaxe objet, elle ne supporte aucun modificateur.

- **Exemple**

  ```vue-html
  <!-- méthode gestionnaire -->
  <button v-on:click="doThis"></button>

  <!-- événement dynamique -->
  <button v-on:[event]="doThis"></button>

  <!-- expression littérale -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- raccourci -->
  <button @click="doThis"></button>

  <!-- raccourci d'un événement dynamique -->
  <button @[event]="doThis"></button>

  <!-- arrête la propagation -->
  <button @click.stop="doThis"></button>

  <!-- empêche le comportement par défaut -->
  <button @click.prevent="doThis"></button>

  <!-- empêche le comportement par défaut sans expression -->
  <form @submit.prevent></form>

  <!-- modificateurs enchaînés -->
  <button @click.stop.prevent="doThis"></button>

  <!-- modificateur de clé en utilisant keyAlias -->
  <input @keyup.enter="onEnter" />

  <!-- l'événement de clic sera déclenché seulement une fois -->
  <button v-on:click.once="doThis"></button>

  <!-- syntaxe objet -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  Écoute des événements personnalisés sur un composant enfant (le gestionnaire est appelé lorsque "my-event" est émis sur l'enfant) :

  ```vue-html
  <MyComponent @my-event="handleThis" />

  <!-- expression en ligne -->
  <MyComponent @my-event="handleThis(123, $event)" />
  ```

- **Voir aussi**
  - [Gestion d'événement](/guide/essentials/event-handling)
  - [Composants - Événements personnalisés](/guide/essentials/component-basics#listening-to-events)

## v-bind {#v-bind}

Lie dynamiquement un ou plusieurs attributs, ou une prop d'un composant à une expression.

- **Raccourci :**
  - `:` ou `.` (lorsqu'on utilise le modificateur `.prop`)
  - En omettant la valeur (lorsque l'attribut et la valeur liée portent le même nom, requière 3.4+)

- **Attendu :** `any (avec argument) | Object (sans argument)`

- **Argument :** `attrOrProp (optionnel)`

- **Modificateurs**

  - `.camel` - transforme le nom de l'attribut kebab-case en camelCase.
  - `.prop` - force une liaison à être définie comme une propriété du DOM (3.2+).
  - `.attr` - force une liaison à être définie comme un attribut du DOM (3.2+).

- **Utilisation :**

  Lorsqu'elle est utilisée pour lier l'attribut `class` ou `style`, `v-bind` supporte des types de valeurs supplémentaires comme Array ou Objects. Voir la section du guide lié ci-dessous pour plus de détails.

  Lors de la mise en place d'une liaison sur un élément, Vue va vérifier par défaut si l'élément a la clé définie comme une propriété en faisant une vérification de l'opérateur `in`. Si la propriété est définie, Vue définira la valeur comme une propriété du DOM au lieu d'un attribut. Cela devrait fonctionner dans la plupart des cas, mais vous pouvez outrepasser ce comportement en utilisant explicitement les modificateurs `.prop` ou `.attr`. Cela est parfois nécessaire, notamment lorsque vous [travaillez avec des éléments personnalisés](/guide/extras/web-components#passing-dom-properties).

  Lorsqu'elle est utilisée pour lier les props du composant, la prop doit être correctement déclarée dans le composant enfant.

  Lorsqu'elle est utilisée sans argument, elle peut être utilisée pour lier un objet contenant des paires nom-valeur d'attributs.

- **Exemple**

  ```vue-html
  <!-- lie un attribut -->
  <img v-bind:src="imageSrc" />

  <!-- nom d'attribut dynamique -->
  <button v-bind:[key]="value"></button>

  <!-- raccourci -->
  <img :src="imageSrc" />

  <!-- raccourci même nom (3.4+), se transforme en :src="src" -->
  <img :src />

  <!-- raccourci d'un nom d'attribut dynamique -->
  <button :[key]="value"></button>

  <!-- avec une concaténation de chaînes de caractères en ligne -->
  <img :src="'/path/to/images/' + fileName" />

  <!-- liaison de classe -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]"></div>

  <!-- liaison de style -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- liaison d'un objet d'attributs -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- liaison de prop. "prop" doit être déclaré dans le composant enfant. -->
  <MyComponent :prop="someThing" />

  <!-- transmet les props du parent en commun avec un composant enfant -->
  <MyComponent v-bind="$props" />

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  Le modificateur `.prop` a également un raccourci dédié, `.` :

  ```vue-html
  <div :someProperty.prop="someObject"></div>

  <!-- équivalent à -->
  <div .someProperty="someObject"></div>
  ```

  Le modificateur `.camel` permet de formatter un nom d'attribut `v-bind` en camelCase lors de l'utilisation de templates à l'intérieur du DOM, par exemple l'attribut SVG `viewBox` :

  ```vue-html
  <svg :view-box.camel="viewBox"></svg>
  ```

  `.camel` n'est pas nécessaire si vous utilisez des templates en chaînes de caractères, ou si vous pré-compilez le template avec un outil de build.

- **Voir aussi**
  - [Liaison de classes et de styles](/guide/essentials/class-and-style)
  - [Composant - Détails sur le passage de props](/guide/components/props#prop-passing-details)

## v-model {#v-model}

Crée une liaison bidirectionnelle sur un élément de saisie de formulaire ou un composant.

- **Attendu :** varie en fonction de la valeur de l'élément d'entrée du formulaire ou de la sortie des composants

- **Limitée à :**

  - `<input>`
  - `<select>`
  - `<textarea>`
  - composants

- **Modificateurs**

  - [`.lazy`](/guide/essentials/forms#lazy) - écoute les événements `change` au lieu de `input`.
  - [`.number`](/guide/essentials/forms#number) - convertit une entrée valide en chaînes de caractères en nombres
  - [`.trim`](/guide/essentials/forms#trim) - élague l'entrée

- **Voir aussi**

  - [Liaisons des entrées d'un formulaire](/guide/essentials/forms)
  - [Événements du composant - Utilisation avec `v-model`](/guide/components/v-model)

## v-slot {#v-slot}

Désigne les slots nommés ou les slots scopés qui s'attendent à recevoir des props.

- **Raccourci :** `#`

- **Attendu :** Une expression JavaScript valide en tant qu'argument de fonction, y compris concernant la déstructuration. Facultatif - uniquement nécessaire si l'on s'attend à ce que des props soient passés au slot.

- **Argument :** nom du slot (facultatif, la valeur par défaut est `default`)

- **Limitée à :**

  - `<template>`
  - [composants](/guide/components/slots#scoped-slots) (pour un seul slot par défaut avec des props)

- **Exemple**

  ```vue-html
  <!-- Slots nommés -->
  <BaseLayout>
    <template v-slot:header>
      Header content
    </template>

    <template v-slot:default>
      Default slot content
    </template>

    <template v-slot:footer>
      Footer content
    </template>
  </BaseLayout>

  <!-- Slot nommé recevant des props -->
  <InfiniteScroll>
    <template v-slot:item="slotProps">
      <div class="item">
        {{ slotProps.item.text }}
      </div>
    </template>
  </InfiniteScroll>

  <!-- Slot par défaut recevant des props, via la déstructuration -->
  <Mouse v-slot="{ x, y }">
    Mouse position: {{ x }}, {{ y }}
  </Mouse>
  ```

- **Voir aussi**
  - [Composants - Slots](/guide/components/slots)

## v-pre {#v-pre}

Ignore la compilation pour cet élément et tous ses enfants.

- **N'attend pas d'expression**

- **Détails**

  À l'intérieur de l'élément contenant `v-pre`, toute la syntaxe du template Vue sera préservée et rendue telle quelle. Le cas d'utilisation le plus courant est l'affichage brut des balises moustaches.

- **Exemple**

  ```vue-html
  <span v-pre>{{ this will not be compiled }}</span>
  ```

## v-once {#v-once}

Rend l'élément et le composant une seule fois, et ignore les mises à jour futures.

- **N'attend pas d'expression**

- **Détails**

  Lors des rendus suivants, l'élément/composant et tous ses enfants seront traités comme du contenu statique et ignorés. Cela peut être utilisé pour optimiser les performances de mise à jour.

  ```vue-html
  <!-- élément simple -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- l'élément a des enfants -->
  <div v-once>
    <h1>Comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- composant -->
  <MyComponent v-once :comment="msg"></MyComponent>
  <!-- directive `v-for` -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

  Depuis la version 3.2, vous pouvez également mémoriser une partie du template avec des conditions d'invalidation en utilisant [`v-memo`](#v-memo).

- **Voir aussi**
  - [Syntaxe de la liaison bidirectionnelle - interpolations](/guide/essentials/template-syntax#text-interpolation)
  - [v-memo](#v-memo)

## v-memo {#v-memo}

- Supporté à partir de la version 3.2

- **Attendu :** `any[]`

- **Détails**

  Mémorise une sous-arborescence du template. Peut être utilisée à la fois sur les éléments et les composants. La directive attend un tableau de longueur connue composé de valeurs de dépendances à comparer pour la mémorisation. Si toutes les valeurs du tableau sont identiques à celles du dernier rendu, les mises à jour de l'ensemble du sous-arbre seront ignorées. Par exemple :

  ```vue-html
  <div v-memo="[valueA, valueB]">
    ...
  </div>
  ```

  Lors du rendu du composant, si `valueA` et `valueB` restent les mêmes, toutes les mises à jour de cette `<div>` et de ses enfants seront ignorées. En fait, même la création du VNode du DOM virtuel sera ignorée puisque la copie mémorisée de la sous-arborescence peut être réutilisée.

  Il est important de spécifier le tableau de mémorisation correctement, sinon nous pourrions sauter des mises à jour qui devraient normalement être appliquées. `v-memo` avec un tableau de dépendances vide (`v-memo="[]"`) serait fonctionnellement équivalent à `v-once`.

  **Utilisation avec `v-for`**

  `v-memo` est fourni uniquement pour des micro-optimisations dans des scénarios de performances critiques et devrait être rarement utilisée. Le cas le plus courant où cela peut s'avérer utile est lors du rendu de grandes listes `v-for` (où `length > 1000`) :

  ```vue-html
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
    <p>...more child nodes</p>
  </div>
  ```

  Lorsque l'état `selected` du composant change, une grande quantité de VNodes sera créée même si la plupart des éléments restent exactement les mêmes. L'utilisation de `v-memo` ici consiste essentiellement à dire "met à jour cet élément seulement s'il est passé de non sélectionné à sélectionné, ou vice-versa". Cela permet à chaque élément non affecté de réutiliser son précédent VNode et d'éviter de changer entièrement. Notez que nous n'avons pas besoin d'inclure `item.id` dans le tableau de dépendances des mémos ici puisque Vue le déduit automatiquement à partir de `:key`.

  :::warning
  Lorsque vous utilisez les directives `v-memo` avec `v-for`, assurez-vous qu'elles sont utilisées sur le même élément. **`v-memo` ne fonctionne pas à l'intérieur de `v-for`.**
  :::

  `v-memo` peut également être utilisée sur les composants pour empêcher manuellement les mises à jour non désirées dans certains cas limites où la vérification de la mise à jour du composant enfant n'est pas optimisée. Mais une fois de plus, il est de la responsabilité du développeur de spécifier des tableaux de dépendances corrects pour éviter d'ignorer des mises à jour nécessaires.

- **Voir aussi**
  - [v-once](#v-once)

## v-cloak {#v-cloak}

Utilisée pour cacher un template non compilé jusqu'à ce qu'il soit prêt.

- **N'attend pas d'expression**

- **Détails**

  **Cette directive n'est nécessaire que dans les configurations sans étape de build.**

  Lors de l'utilisation de templates à l'intérieur du DOM, il peut y avoir un "flash de templates non compilés" : l'utilisateur peut voir des balises moustaches brutes jusqu'à ce que le composant monté les remplace par du contenu rendu.

  `v-cloak` restera sur l'élément jusqu'à ce que l'instance du composant associé soit montée. Combiné à des règles CSS telles que `[v-cloak] { display : none }`, elle peut être utilisée pour masquer les templates bruts jusqu'à ce que le composant soit prêt.

- **Exemple**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```vue-html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  La `<div>` ne sera pas visible tant que la compilation n'est pas terminée.
