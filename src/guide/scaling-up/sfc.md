# Composants monofichiers {#single-file-components}

## Introduction {#introduction}

Les composants monofichiers (aussi appelés Single-File Components, abrégés en **SFC** avec une extension `.vue`) est un format de fichier spécial qui permet de regrouper la structure HTML, la logique JavaScript **et** le style CSS d'un composant Vue dans un seul fichier. Voici un exemple d'un SFC :

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const greeting = ref('Hello World!')
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

Comme nous pouvons le voir, les SFC de Vue sont une extension naturelle du trio classique HTML, CSS et JavaScript. Les blocs `<template>`, `<script>` et `<style>` encapsulent et regroupent la vue, la logique et le style d'un composant dans le même fichier. La syntaxe complète est définie dans la [Spécification de la syntaxe SFC](/api/sfc-spec).

## Pourquoi les composants monofichiers (SFC) {#why-sfc}

Si les SFC nécessitent une étape de compilation, les avantages sont nombreux en contrepartie :

- Créer des composants modulaires en utilisant une syntaxe HTML, CSS et JavaScript familière.
- [Collocation de responsabilités couplées](#what-about-separation-of-concerns)
- Templates précompilés sans coût de compilation au runtime
- [CSS à portée limitée au composant](/api/sfc-css-features)
- [Syntaxe plus confortable avec la Composition API](/api/sfc-script-setup)
- Meilleures optimisations à la compilation grâce à l'analyse croisée du template et des scripts.
- [Support des environnements de développement](/guide/scaling-up/tooling#ide-support) avec autocomplétion et vérification des types pour les expressions dans le template.
- Prise en charge nativement du remplacement de modules à chaud (HMR).

SFC est une caractéristique déterminante de Vue en tant que framework, et c'est l'approche recommandée pour utiliser Vue dans les scénarios suivants :

- Applications à page unique (SPA)
- Génération de sites statiques (SSG)
- Tout front-end non trivial pour lequel une étape de construction peut être justifiée pour une meilleure expérience de développement (DX).

Cela dit, nous sommes conscients qu'il y a des scénarios où les SFC peuvent sembler exagérés. C'est pourquoi Vue peut toujours être utilisé via du JavaScript sans industrialisation. Si vous cherchez simplement à agrémenter un HTML largement statique avec des interactions légères, vous pouvez vous pencher sur [petite-vue](https://github.com/vuejs/petite-vue), un sous-ensemble de Vue de 6 kb optimisé pour l'amélioration progressive.

## Comment ça marche {#how-it-works}

Vue SFC est un format de fichier spécifique au framework et doit être précompilé par [@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) en JavaScript et CSS standard. Un SFC compilé est un module JavaScript (ES) standard, ce qui signifie qu'avec une configuration de compilation appropriée, vous pouvez importer un SFC comme un module :

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

Les balises `<style>` à l'intérieur des SFC sont généralement injectées comme des balises `<style>` natives pendant le développement pour supporter les mises à jour à chaud. Pour la production, elles peuvent être extraites et fusionnées dans un seul fichier CSS.

Vous pouvez jouer avec les SFC et explorer comment ils sont compilés dans le [Playground de Vue](https://play.vuejs.org/).

Dans les projets concrets, nous intégrons généralement le compilateur SFC à un outil de construction tel que [Vite](https://vitejs.dev/) ou [Vue CLI](http://cli.vuejs.org/) (qui est basé sur [webpack](https://webpack.js.org/)), et Vue fournit des outils de création officiels pour vous permettre de démarrer avec les SFC aussi vite que possible. Pour plus de détails, consultez la section [Outils pour SFC](/guide/scaling-up/tooling).

## Qu'en est-il de la séparation des responsabilités ? {#what-about-separation-of-concerns}

Certains utilisateurs issus d'un milieu traditionnel de développement web peuvent craindre que les SFC ne mélangent différentes responsabilités au même endroit - ce que HTML/CSS/JS étaient censés séparer !

Pour répondre à cette question, il est important d'être d'accord sur le fait que **la séparation des responsabilités ne signifie pas séparation des types de fichiers.** Le but ultime des principes d'ingénierie est d'améliorer la maintenabilité de la base de code. La séparation des responsabilités, lorsqu'elle est appliquée de manière dogmatique comme la séparation des types de fichiers, ne nous aide pas à atteindre cet objectif dans un contexte d'applications front-end qui deviennent de plus en plus complexes.

Dans le développement d'interfaces utilisateur modernes, nous avons constaté qu'au lieu de diviser la base de code en trois énormes couches qui s'entrecroisent, il est beaucoup plus logique de les diviser en composants faiblement couplés et de les composer. À l'intérieur d'un composant, son template, sa logique et ses styles sont intrinsèquement couplés, et leur regroupement rend le composant plus cohérent et plus facile à maintenir.

Même si vous n'aimez pas l'idée des composants monofichiers, vous pouvez toujours tirer parti des fonctions de rechargement à chaud (HMR) et de précompilation en séparant votre JavaScript et votre CSS dans des fichiers distincts à l'aide de [Imports Src](/api/sfc-spec#src-imports).
