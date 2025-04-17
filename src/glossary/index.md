# Glossaire {#glossary}

Ce glossaire est destiné à fournir la signification des termes techniques couramment utilisés lorsque l'on parle de Vue. Il est destiné à être *descriptif* sur la façon dont les termes sont couramment utilisés, et non une spécification *prescriptive* de la façon dont ils doivent être utilisés. Certains termes peuvent avoir des significations ou des nuances légèrement différentes selon le contexte environnant.

[[TOC]]

## composant asynchrone {#async-component}

Un *composant asynchrone* est une enveloppe autour d'un autre composant qui permet au composant enveloppé d'être chargé de manière paresseuse. Il est généralement utilisé pour réduire la taille des fichiers .js construits, en leur permettant d'être divisés en morceaux plus petits qui ne sont chargés qu'en cas de besoin.

Vue Router dispose d'une fonctionnalité similaire pour le [chargement paresseux du composant route](https://router.vuejs.org/guide/advanced/lazy-loading.html), bien que cela n'utilise pas la fonctionnalité de composants asynchrones de Vue.

Pour plus de détails, voir :
- [Guide - Composants asynchrones](/guide/components/async.html)

## macro de compilateur {#compiler-macro}

Une *macro de compilateur* est un code spécial qui est traité par un compilateur et converti en quelque chose d'autre. Ils sont en fait une forme astucieuse de remplacement de chaînes de caractères.

Le compilateur [SFC](#single-file-component) de Vue prend en charge diverses macros, telles que `defineProps()`, `defineEmits()` et `defineExpose()`. Ces macros sont intentionnellement conçues pour ressembler à des fonctions JavaScript normales afin qu'elles puissent tirer parti du même analyseur et des mêmes outils d'inférence de type autour de JavaScript / TypeScript. Cependant, elles ne sont pas des fonctions réelles exécutées dans le navigateur. Ce sont des chaînes de caractères spéciales que le compilateur détecte et remplace par le vrai code JavaScript qui sera réellement exécuté.

Les macros ont des limites d'utilisation qui ne s'appliquent pas au code JavaScript normal. Par exemple, vous pourriez penser que `const dp = defineProps` vous permettrait de créer un alias pour `defineProps`, mais cela entraînera en fait une erreur. Il existe également des limitations sur les valeurs pouvant être transmises à `defineProps()`, car les 'arguments' doivent être traités par le compilateur et non au moment de l'exécution.

Pour plus de détails, voir :
- [`<script setup>` - `defineProps()` & `defineEmits()`](/api/sfc-script-setup.html#defineprops-defineemits)
- [`<script setup>` - `defineExpose()`](/api/sfc-script-setup.html#defineexpose)

## composant {#component}

Le terme *composant* n'est pas propre à Vue. Il est commun à de nombreux frameworks d'interface utilisateur. Il décrit une partie de l'interface utilisateur, comme un bouton ou une case à cocher. Les composants peuvent également être combinés pour former des composants plus grands.

Les composants sont le principal mécanisme fourni par Vue pour diviser une interface utilisateur en plus petits éléments, à la fois pour améliorer la maintenabilité et pour permettre la réutilisation du code.

Un composant Vue est un objet. Toutes les propriétés sont facultatives, mais un template ou une fonction de rendu est requis pour que le composant soit rendu. Par exemple, l'objet suivant serait un composant valide :

```js
const HelloWorldComponent = {
  render() {
    return 'Hello world!'
  }
}
```

En pratique, la plupart des applications Vue sont écrites en utilisant des [composants monofichiers](#single-file-component) (fichiers `.vue`). Bien que ces composants puissent ne pas sembler être des objets à première vue, le compilateur SFC les convertira en un objet, qui sera utilisé comme exportation par défaut pour le fichier. D'un point de vue externe, un fichier `.vue` n'est qu'un module ES qui exporte un objet composant.

Les propriétés d'un objet composant sont généralement appelées *options*. C'est là que l'[Options API](#options-api) tire son nom.

Les options d'un composant définissent comment les instances de ce composant doivent être créées. Les composants sont conceptuellement similaires aux classes, bien que Vue n'utilise pas de classes JavaScript réelles pour les définir.

Le terme composant peut également être utilisé plus librement pour désigner des instances de composant.

Pour plus de détails, voir :
- [Guide - Principes fondamentaux des composants](/guide/essentials/component-basics.html)

Le mot « composant » apparaît également dans plusieurs autres termes :
- [composant async](#async-component)
- [composant dynamique](#dynamic-component)
- [component fonctionnel](#functional-component)
- [Web Component](#web-component)

## composable {#composable}

Le terme *composable* décrit un modèle d'utilisation courant dans Vue. Il ne s'agit pas d'une fonctionnalité distincte de Vue, mais simplement d'un moyen d'utiliser la [Composition API](#composition-api) du framework.

* Un composable est une fonction.
* Les composables sont utilisés pour encapsuler et réutiliser la logique avec état.
* Le nom de la fonction commence généralement par `use`, afin que les autres développeurs sachent qu'il s'agit d'une fonction composable.
* La fonction est typiquement censée être appelée pendant l'exécution synchrone de la fonction `setup()` d'un composant (ou, de manière équivalente, pendant l'exécution d'un bloc `<script setup>`). Cela lie l'invocation du composable au contexte actuel du composant, par exemple via des appels à `provide()`, `inject()` ou `onMounted()`.
* Les composables renvoient généralement un objet simple, et non un objet réactif. Cet objet contient généralement des références et des fonctions et est censé être déstructuré dans le code appelant.

Comme pour de nombreux modèles, il peut y avoir des désaccords sur la question de savoir si un code spécifique peut prétendre au label. Toutes les fonctions utilitaires JavaScript ne sont pas composables. Si une fonction n'utilise pas la Composition API, elle n'est probablement pas composable. Si elle ne s'attend pas à être appelée pendant l'exécution synchrone de `setup()` alors elle n'est probablement pas composable. Les composables sont spécifiquement utilisés pour encapsuler la logique avec état, ils ne sont pas simplement une convention d'appellation pour les fonctions.

Voir le [Guide - Composables](/guide/reusability/composables.html) pour plus de détails sur l'écriture des composables.

## Composition API {#composition-api}

La *Composition API* est une collection de fonctions utilisées pour écrire des composants et des composables dans Vue.

Le terme est également utilisé pour décrire l'un des deux styles principaux utilisés pour écrire des composants, l'autre étant l'[Options API](#options-api). Les composants écrits à l'aide de la Composition API utilisent soit `<script setup>`, soit une fonction explicite `setup()`.

Voir la [FAQ de la Composition API](/guide/extras/composition-api-faq) pour plus de détails.

## élément personnalisé {#custom-element}

Un *élément personnalisé* est une fonctionnalité de la norme des [Web Components](#web-component), qui est mise en œuvre dans les navigateurs web modernes. Il s'agit de la possibilité d'utiliser un élément HTML personnalisé dans votre balisage HTML pour inclure un Web Component à cet endroit de la page.

Vue prend en charge nativement le rendu des éléments personnalisés et permet de les utiliser directement dans les templates de composants Vue.

Les éléments personnalisés ne doivent pas être confondus avec la possibilité d'inclure des composants Vue en tant que balises dans le template d'un autre composant Vue. Les éléments personnalisés sont utilisés pour créer des Web Components, et non des composants Vue.

Pour plus de détails, voir :
- [Vue et les Web Components](/guide/extras/web-components.html)

## directive {#directive}

Le terme *directive* fait référence aux attributs de template commençant par le préfixe `v-`, ou à leurs abréviations équivalentes.

Les directives intégrées comprennent `v-if`, `v-for`, `v-bind`, `v-on` et `v-slot`.

Vue permet également de créer des directives personnalisées, bien qu'elles ne soient généralement utilisées comme une 'trappe d'accès' pour manipuler directement les nœuds du DOM. Les directives personnalisées ne peuvent généralement pas être utilisées pour recréer la fonctionnalité des directives intégrées.

Pour plus de détails, voir :
- [Guide - Syntaxe de template - Directives](/guide/essentials/template-syntax.html#directives)
- [Guide - Directives personnalisées](/guide/reusability/custom-directives.html)

## composant dynamique {#dynamic-component}

Le terme *composant dynamique* est utilisé pour décrire les cas où le choix du composant enfant à rendre doit être fait dynamiquement. Typiquement, ceci est réalisé en utilisant `<component :is="type">`.

Un composant dynamique n'est pas un type particulier de composant. N'importe quel composant peut être utilisé comme composant dynamique. C'est le choix du composant qui est dynamique, plutôt que le composant lui-même.

Pour plus de détails, voir :
- [Guide - Principes fondamentaux des composants - Composants dynamiques](/guide/essentials/component-basics.html#dynamic-components)

## effect {#effect}

Voir [reactive effect](#reactive-effect) et [side effect](#side-effect).

## event {#event}

L'utilisation des événements pour communiquer entre différentes parties d'un programme est commune à de nombreux domaines de programmation différents. Dans Vue, le terme est généralement appliqué à la fois aux événements d'éléments HTML natifs et aux événements de composants Vue. La directive `v-on` est utilisée dans les templates pour écouter les deux types d'événements.

Pour plus de détails, voir :
- [Guide - Gestion d'événement](/guide/essentials/event-handling.html)
- [Guide - Gestion des évènements](/guide/components/events.html)

## fragment {#fragment}

Le terme *fragment* se réfère à un type special de [VNode](#vnode) qui est utilisé comme parent pour les autres VNodes, mais qui ne rend aucun élément lui-même.

Le nom provient d'un concept similaire au [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) dans le DOM API natif.

Les fragments sont utilisés pour supporter les composants avec de multiples noeuds parent. Bien que ces composant peuvent donner l'impression d'avoir plusieurs noeuds parent, dans les coulisses ils utilisent un noeud fragment comme unique parent, comme parent des noeuds 'racine'.

Les fragments sont aussi utilisées par le compilateur de template comme un moyen d'envelopper plusieurs noeuds dynamiques, par exemple ceux créés avec `v-for` ou `v-if`. Cela permet de passer des informations supplémentaires à l'algorithme de correction du [VDOM](#virtual-dom). La majorité est gérée en interne, mais un endroit où vous pourriez rencontrer cela directement est en utilisant `key` sur un élément `<template>` avec `v-for`. Dans ce scénario, `key` est ajouté comme une [prop](#prop) au fragment VNode.

Les noeuds fragment sont actuellement rendus dans le DOM en tant que noeuds de texte vides, cependant ceci est un détails d'implémentation. Vous pourriez rencontrer ces noeuds texte si vous utilisez `$el` ou essayez de parcourir le DOM avec des API intégrées à votre navigateur.

## composant fonctionnel {#functional-component}

Une définition de composant est généralement un objet contenant des options. Cela peut sembler différent si vous utilisez `<script setup>`, mais le composant exporté depuis le fichier `.vue` sera toujours un objet.

Un *composant fonctionnel* est une autre forme de composant déclaré à l'aide d'une fonction. Cette fonction fait office de [fonction de rendu](#render-function) pour le composant.

Un composant fonctionnel ne peut pas avoir d'état propre. Il ne passe pas non plus par le cycle de vie habituel des composants, de sorte que les hooks de cycle de vie ne peuvent pas être utilisés. Ils sont donc légèrement plus légers que les composants habituels avec état.

Pour plus de détails, voir :
- [Guide - Fonctions de rendu et JSX - Composants fonctionnels](/guide/extras/render-function.html#functional-components)

## hissage (ou _hoisting_) {#hoisting}

Le terme *hissage* est utilisé pour décrire l'exécution d'une section de code avant qu'elle ne soit atteinte, avant d'autres codes. L'exécution est 'tirée vers le haut' à un point antérieur.

JavaScript utilise le hissage pour certaines constructions, telles que `var`, `import` et les déclarations de fonctions.

Dans un contexte Vue, le compilateur applique le *hissage statique* pour améliorer les performances. Lors de la compilation d'un composant, les valeurs statiques sont déplacées hors de la portée du composant. Ces valeurs statiques sont qualifiées de hissées parce qu'elles sont créées en dehors du composant.

## cache statique {#cache-static}

Le terme *cache* est utilisé pour décrire le stockage temporaire de données fréquemment consultées afin d'améliorer les performances.

Le compilateur de template Vue identifie ces VNodes statiques, les met en cache lors du rendu initial et réutilise les mêmes VNodes pour chaque nouveau rendu.

Pour plus de détails, voir :
- [Guide - Mécanismes de rendu - Cache Statique](/guide/extras/rendering-mechanism.html#cache-static)

## template depuis le DOM {#in-dom-template}

Il existe plusieurs façons de spécifier un template pour un composant. Dans la plupart des cas, le template est fourni sous la forme d'une chaîne de caractères.

Le terme *template depuis le DOM* fait référence au scénario dans lequel le template est fourni sous la forme de nœuds DOM, au lieu d'une chaîne de caractères. Vue convertit ensuite les nœuds du DOM en une chaîne de caractères à l'aide de `innerHTML`.

Typiquement, un template depuis le DOM commence par un balisage HTML écrit directement dans le HTML de la page. Le navigateur l'analyse ensuite en nœuds DOM, que Vue utilise ensuite pour lire le `innerHTML`.

Pour plus de détails, voir :
- [Guide - Créer une application - Template de composant racine depuis le DOM](/guide/essentials/application.html#in-dom-root-component-template)
- [Guide - Principes fondamentaux des composants - Mises en garde concernant l'analyse du template DOM](/guide/essentials/component-basics.html#in-dom-template-parsing-caveats)
- [Options: Rendu - template](/api/options-rendering.html#template)

## inject {#inject}

Voir [provide / inject](#provide-inject).

## hooks du cycle de vie {#lifecycle-hooks}

Une instance de composant Vue suit un cycle de vie. Par exemple, elle est créée, montée, mise à jour et démontée.

Les *hooks du cycle de vie* sont un moyen d'écouter ces événements du cycle de vie.

Avec l'Option API, chaque hook est fourni comme une option séparée, par exemple `mounted`. La Composition API utilise des fonctions à la place, comme `onMounted()`.

Pour plus de détails, voir :
- [Guide - Les hooks du cycle de vie](/guide/essentials/lifecycle.html)

## macro {#macro}

Voir [macro de compilateur](#compiler-macro).

## slot nommé {#named-slot}

Un composant peut avoir plusieurs slots, différenciés par leur nom. Les autres slots que le slot par défaut sont appelés *slots nommés*.

Pour plus de détails, voir :
- [Guide - Slots - Slots nommés](/guide/components/slots.html#named-slots)

## Options API {#options-api}

Les composants Vue sont définis à l'aide d'objets. Les propriétés de ces objets composants sont appelées *options*.

Les composants peuvent être écrits dans deux styles. Un style utilise la [Composition API](#composition-api) en conjonction avec `setup` (soit via une option `setup()` ou `<script setup>`). L'autre style utilise plus ou moins directement la Composition API, utilisant plutôt diverses options de composants pour obtenir un résultat similaire. Les options de composants utilisées de cette manière représentent ce qu'on appelle l'*Options API*.

L'Options API inclut des options telles que `data()`, `computed`, `methods` et `created()`.

Certaines options, telles que `props`, `emits` et `inheritAttrs`, peuvent être utilisées lors de la création de composants avec l'une ou l'autre API. Comme il s’agit d’options de composants, elles pourraient être considérées comme faisant partie de l’Options API. Cependant, comme ces options sont également utilisées conjointement avec `setup()`, il est généralement plus utile de les considérer comme partagées entre les deux styles de composants.

La fonction `setup()` elle-même est une option de composant, elle *pourrait* donc être décrite comme faisant partie de l'Options API. Cependant, ce n’est pas ainsi que le terme « Options API » est normalement utilisé. Au lieu de cela, la fonction `setup()` est considérée comme faisant partie de la Composition API.

## plugin {#plugin}

Même si le terme *plugin* peut être utilisé dans une grande variété de contextes, Vue a un concept spécifique de plugin comme moyen d'ajouter des fonctionnalités à une application.

Les plugins sont ajoutés à une application en appelant `app.use(plugin)`. Le plugin lui-même est soit une fonction, soit un objet avec une fonction `install`. Cette fonction recevra l'instance d'application et pourra alors faire tout ce qu'elle doit faire.

Pour plus de détails, voir :
- [Guide - Plugins](/guide/reusability/plugins.html)

## prop {#prop}

Il existe trois utilisations courantes du terme *prop* dans Vue :

* Props de composant
* Props de VNode
* Props de Slot

*Les props de composants* sont ce que la plupart des gens considèrent comme des props. Ils sont explicitement définis par un composant en utilisant soit `defineProps()` soit l'option `props`.

Le terme *props de VNode* fait référence aux propriétés de l'objet transmis en tant que second argument de `h()`. Il peut s'agir de props de composants, mais aussi d'événements de composants, d'événements DOM, d'attributs DOM et de propriétés DOM. Vous ne rencontrerez généralement les props VNode que si vous travaillez avec des fonctions de rendu pour manipuler directement les VNodes.

Les *props de slot* sont les propriétés transmises à un scoped slot.

Dans tous les cas, les props sont des propriétés qui sont transmises depuis l'extérieur.

Bien que le mot props soit dérivé du mot *propriétés*, le terme props a une signification beaucoup plus spécifique dans le contexte de Vue. Vous devriez éviter de l'utiliser comme abréviation de propriétés.

Pour plus de détails, voir :
- [Guide - Props](/guide/components/props.html)
- [Guide - Fonctions de rendu et JSX](/guide/extras/render-function.html)
- [Guide - Slots - Scoped Slots](/guide/components/slots.html#scoped-slots)

## provide / inject {#provide-inject}

`provide` et `inject` sont une forme de communication inter-composants.

Lorsqu'un composant *fournit* une valeur, tous les descendants de ce composant peuvent alors choisir de récupérer cette valeur, en utilisant `inject`. Contrairement à ce qui se passe avec les props, le composant qui fournit la valeur ne sait pas précisément quel composant la reçoit.

`provide` et `inject` sont un moyen parfois utilisé pour éviter le *prop drilling* ou également de manière implicite pour un composant de communiquer avec le contenu de son slot.

`provide` peut également être utilisée au niveau de l'application, en rendant une valeur disponible pour tous les composants de cette application.

Pour plus de détails, voir :
- [Guide - provide / inject](/guide/components/provide-inject.html)

## effet réactif {#reactive-effect}

Un *effet réactif* fait partie du système de réactivité de Vue. Il fait référence au processus de suivi des dépendances d'une fonction et à la ré-exécution de cette fonction lorsque les valeurs de ces dépendances changent.

`watchEffect()` est la façon la plus directe de créer un effet. Plusieurs autres parties de Vue utilisent les effets en interne, par exemple les mises à jour du rendu des composants, `computed()` et `watch()`.

Vue ne peut suivre les dépendances réactives qu'à l'intérieur d'un effet réactif. Si la valeur d'une propriété est lue en dehors d'un effet réactif, elle 'perdra' sa réactivité, dans le sens où Vue ne saura pas quoi faire si cette propriété change par la suite.

Le terme est dérivé de 'effet de bord'. L'appel à la fonction d'effet est un effet de bord de la modification de la valeur de la propriété.

Pour plus de détails, voir :
- [Guide - La réactivité en détails](/guide/extras/reactivity-in-depth.html)

## réactivité {#reactivity}

En général, la *réactivité* fait référence à la capacité d'effectuer automatiquement des actions en réponse à des changements de données. Par exemple, mettre à jour le DOM ou faire une requête réseau lorsqu'une valeur de données change.

Dans le contexte de Vue, la réactivité est utilisée pour décrire un ensemble de fonctionnalités. Ces fonctionnalités se combinent pour former un *système de réactivité*, qui est exposé via l'[API de réactivité](#reactivity-api).

Un système de réactivité peut être mis en œuvre de différentes manières. Par exemple, il pourrait être réalisé par une analyse statique du code pour déterminer ses dépendances. Cependant, Vue n'utilise pas cette forme de système de réactivité.

Au lieu de cela, le système de réactivité de Vue suit l'accès aux propriétés au moment de l'exécution. Pour ce faire, il utilise à la fois des wrappers Proxy et des fonctions [accesseur](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Functions/get#description)/[mutateur](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Functions/set#description) pour les propriétés.

Pour plus de détails, voir :
- [Guide - Fondamentaux de la réactivité](/guide/essentials/reactivity-fundamentals.html)
- [Guide - La réactivité en détails](/guide/extras/reactivity-in-depth.html)

## API de réactivité {#reactivity-api}

L'*API de réactivité* est une collection de fonctions de base de Vue liées à la [réactivité](#reactivity). Ils peuvent être utilisés indépendamment des composants. Elle comprend des fonctions telles que `ref()`, `reactive()`, `computed()`, `watch()` et `watchEffect()`.

L'API de réactivité est un sous-ensemble de la Composition API.

Pour plus de détails, voir :
- [API de la réactivité : Essentiel](/api/reactivity-core.html)
- [API de la réactivité : Utilitaires](/api/reactivity-utilities.html)
- [API de la réactivité : Avancé](/api/reactivity-advanced.html)

## ref {#ref}

> Nous parlons ici de l'utilisation de `ref` pour la réactivité. Pour l'attribut `ref` utilisé dans les templates, voir plutôt [ref de template](#template-ref).

Une `ref` fait partie du système de réactivité de Vue. C'est un objet avec une seule propriété réactive, appelée `value`.

Il existe différents types de ref. Par exemple, les refs peuvent être créées en utilisant `ref()`, `shallowRef()`, `computed()`, et `customRef()`. La fonction `isRef()` peut être utilisée pour vérifier si un objet est une ref, et `isReadonly()` peut être utilisée pour vérifier si la ref permet la réaffectation directe de sa valeur.

Pour plus de détails, voir :
- [Guide - Fondamentaux de la réactivité](/guide/essentials/reactivity-fundamentals.html)
- [API de la réactivité : Essentiel](/api/reactivity-core.html)
- [API de la réactivité : Utilitaires](/api/reactivity-utilities.html)
- [API de la réactivité : Avancé](/api/reactivity-advanced.html)

## fonction de rendu {#render-function}

Une *fonction de rendu* est la partie d'un composant qui génère les VNodes utilisés lors du rendu. Les templates sont compilés en fonctions de rendu.

Pour plus de détails, voir :
- [Guide - Fonctions de rendu et JSX](/guide/extras/render-function.html)

## programmateur {#scheduler}

Le *programmateur* est la partie des rouages internes de Vue qui contrôle le moment où les [effets réactifs](#reactive-effect) sont exécutés.

Lorsque l'état réactif change, Vue ne déclenche pas immédiatement les mises à jour du rendu. Au lieu de cela, il les regroupe à l'aide d'une file d'attente. Cela permet de s'assurer qu'un composant n'effectue qu'un seul nouveau rendu, même si plusieurs changements sont apportés aux données sous-jacentes.

Les [Observateurs](/guide/essentials/watchers.html) sont également mis en lots en utilisant la file d'attente du programmateur. Les observateurs avec `flush: 'pre'` (par défaut) seront exécutés avant le rendu du composant, tandis que ceux avec `flush: 'post'` seront exécutés après le rendu du composant.

Les tâches du programmateur sont également utilisées pour effectuer diverses autres tâches internes, telles que le déclenchement de certains [hooks du cycle de vie](#lifecycle-hooks) et la mise à jour des [refs de template](#template-ref).

## scoped slot {#scoped-slot}

Le terme *scoped slot* est utilisé pour désigner un [slot](#slot) qui reçoit des [props](#prop).

Historiquement, Vue faisait une plus grande distinction entre les slots scoped et non scoped. Dans une certaine mesure, ils pourraient être considérés comme deux fonctionnalités distinctes, unifiées derrière une syntaxe de template commune.

Dans Vue 3, les API des slots ont été simplifiées pour que tous les slots se comportent comme des scoped slots. Cependant, les cas d'utilisation des scoped slots et non scoped diffèrent souvent, de sorte que le terme s'avère toujours utile pour désigner les slots avec des props.

Les props transmis à un slot ne peuvent être utilisés que dans une région spécifique du template parent, responsable de la définition du contenu du slot. Cette région du template se comporte comme une variable de scope pour les props, d'où le nom de 'scoped slot'.

Pour plus de détails, voir :
- [Guide - Slots - Scoped Slots](/guide/components/slots.html#scoped-slots)

## SFC {#sfc}

Voir [Composant monofichier](#single-file-component).

## effet de bord {#side-effect}

Le terme *effet de bord* n'est pas spécifique à Vue. Il est utilisé pour décrire les opérations ou les fonctions qui font quelque chose au-delà de leur portée locale.

Par exemple, lors de l'affectation d'une propriété comme `user.name = null`, on s'attend à ce que cela change la valeur de `user.name`. Si cela fait aussi quelque chose d'autre, comme déclencher le système de réactivité de Vue, alors cela sera décrit comme un effet de bord. C'est l'origine du terme [effet réactif](#reactive-effect) dans Vue.

Lorsqu'une fonction est décrite comme ayant des effets de bord, cela signifie qu'elle effectue une sorte d'action observable en dehors de la fonction, en plus de renvoyer une valeur. Cela peut signifier qu'elle met à jour une valeur dans l'état ou qu'elle déclenche une requête réseau.

Ce terme est souvent utilisé pour décrire le rendu ou les propriétés calculées. On considère que la meilleure pratique pour le rendu est de ne pas avoir d'effets de bord. De même, la fonction accesseur d'une propriété calculée ne doit pas avoir d'effets de bord.

## Composant monofichier (ou _Single-File Component_) {#single-file-component}

Le terme *Single-File Component*, ou SFC, fait référence au format de fichier `.vue` couramment utilisé pour les composants Vue.

Voir aussi :
- [Guide - Composants monofichiers](/guide/scaling-up/sfc.html)
- [Spécifications liées à la syntaxe des composants monofichiers](/api/sfc-spec.html)

## slot {#slot}

Les slots sont utilisés pour transmettre du contenu aux composants enfants. Alors que les props sont utilisés pour transmettre des données, les slots sont utilisés pour transmettre un contenu plus riche composé d'éléments HTML et d'autres composants Vue.

Pour plus de détails, voir :
- [Guide - Slots](/guide/components/slots.html)

## ref de template {#template-ref}

Le terme *ref de template* fait référence à l'utilisation d'un attribut `ref` sur un élément à l'intérieur d'un template. Après le rendu du composant, cet attribut est utilisé pour remplir une propriété correspondante avec l'élément HTML ou l'instance de composant qui correspond à l'élément dans le template.

Si vous utilisez l'Options API, les refs sont exposés via les propriétés de l'objet `$refs`.

Avec la Composition API, les refs de template alimentent une [ref](#ref) réactive portant le même nom.

Il ne faut pas confondre les refs de templates avec les refs réactives du système de réactivité de Vue.

Pour plus de détails, voir :
- [Guide - Les refs du template](/guide/essentials/template-refs.html)

## VDOM {#vdom}

Voir [DOM virtuel](#virtual-dom).

## DOM virtuel {#virtual-dom}

Le terme *DOM virtuel* (VDOM) n'est pas propre à Vue. Il s'agit d'une approche commune utilisée par plusieurs frameworks web pour gérer les mises à jour de l'interface utilisateur.

Les navigateurs utilisent un arbre de nœuds pour représenter l'état actuel de la page. Cet arbre, et les API JavaScript utilisées pour interagir avec celui-ci, représentent le *document object model*, ou *DOM*.

La manipulation du DOM est un goulot d'étranglement majeur pour les performances. Le DOM virtuel fournit une stratégie pour gérer cela.

Plutôt que de créer directement des nœuds DOM, les composants Vue génèrent une description des nœuds DOM qu'ils souhaitent. Ces descripteurs sont des objets JavaScript simples, connus sous le nom de VNodes (nœud virtuel du DOM). La création de VNodes est relativement peu coûteuse.

Chaque fois qu'un composant est rerendu, le nouvel arbre de VNodes est comparé à l'arbre de VNodes précédent et toutes les différences sont alors appliquées au DOM réel. Si rien n'a changé, le DOM n'a pas besoin d'être modifié.

Vue utilise une approche hybride que nous appelons [DOM virtuel basé sur la compilation](/guide/extras/rendering-mechanism.html#compiler-informed-virtual-dom). Le compilateur de template de Vue est capable d'appliquer des optimisations de performance basées sur l'analyse statique du template. Plutôt que d'effectuer une comparaison complète des anciens et nouveaux arbres VNode d'un composant au moment de l'exécution, Vue peut utiliser les informations extraites par le compilateur pour réduire la comparaison aux seules parties de l'arbre qui peuvent réellement changer.

Pour plus de détails, voir :
- [Guide - Mécanismes de rendu](/guide/extras/rendering-mechanism.html)
- [Guide - Fonctions de rendu et JSX](/guide/extras/render-function.html)

## VNode {#vnode}

Un *VNode* est un *nœud virtuel du DOM*. Ils peuvent être créés à l'aide de la fonction [`h()`](/api/render-function.html#h).

Voir [virtual DOM](#virtual-dom) pour plus d'informations.

## Web Component {#web-component}

La norme *Web Components* est un ensemble de fonctionnalités mises en œuvre dans les navigateurs web modernes.

Les composants Vue ne sont pas des Web Components, mais `defineCustomElement()` peut être utilisé pour créer un [élément personnalisé](#custom-element) à partir d'un composant Vue. Vue prend également en charge l'utilisation d'éléments personnalisés à l'intérieur des composants Vue.

Pour plus de détails, voir :
- [Guide - Vue et les Web Components](/guide/extras/web-components.html)
