# Composants monofichiers

## Introduction

Les composants monofichiers (aussi connus sous Single-File Components ou sous la forme de fichiers `.vue`, abrévié **SFC**) est un format de fichier spécial qui permet de regrouper la structure HTML, la logique JavaScript **et** le style CSS d'un composant Vue dans un seul fichier. Voici un exemple d'un SFC :

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Bonjour tout le monde!'
    }
  }
}
</script>

<template>
  <p class="bonjour">{{ greeting }}</p>
</template>

<style>
.bonjour {
  color: red;
  font-weight: bold;
}
</style>
```

Comme nous pouvons le voir, les SFC de Vue est une extension naturelle du trio classique HTML, CSS et JavaScript. Les blocs `<template>`, `<script>` et `<style>` encapsulent et regroupent la vue, la logique et le style d'un composant dans le même fichier. La syntaxe complète est définie dans la [TODO(fr)Spécification de syntaxe SFC](/api/sfc-spec).

## Pourquoi les SFC

Si les SFC nécessitent une étape de compilation, les avantages sont nombreux en contrepartie :

- Créer des composants modulaires en utilisant une syntaxe HTML, CSS et JavaScript familière.
- [TODO(fr)Collocation de responsabilités couplées](#qu-en-est-il-de-la-separation-des-responsabilites)
- Templates précompilés
- [TODO(fr)CSS à portée limitée au composant](/api/sfc-css-features)
- [Syntaxe plus confortable avec l'API de Composition](/api/sfc-script-setup)
- Meilleures optimisations à la compilation grâce à l'analyse croisée du template et des scripts.
- [Support IDE](/guide/scaling-up/tooling.html#ide-support) avec autocomplétion et vérification des types pour les expressions dans le template.
- Prise en charge immédiate du remplacement de modules à chaud (HMR).

SFC est une caractéristique déterminante de Vue en tant que framework, et c'est l'approche recommandée pour utiliser Vue dans les scénarios suivants :

- Applications à page unique (SPA)
- Génération de sites statiques (SSG)
- Tout front-end non trivial pour lequel une étape de construction peut être justifiée pour une meilleure expérience de développement (DX).

Cela dit, nous sommes conscients qu'il y a des scénarios où les SFC peuvent sembler exagérés. C'est pourquoi Vue peut toujours être utilisé via JavaScript sans étape de construction. Si vous cherchez simplement à agrémenter un HTML largement statique avec des interactions légères, vous pouvez vous pencher sur [petite-vue](https://github.com/vuejs/petite-vue), un sous-ensemble de Vue de 5 kb optimisé pour l'amélioration progressive.

## Comment ça marche

Vue SFC est un format de fichier spécifique au framework et doit être précompilé par [@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) en JavaScript et CSS standard. Un SFC compilé est un module JavaScript (ES) standard, ce qui signifie qu'avec une configuration de compilation appropriée, vous pouvez importer un SFC comme un module :

```js
import MonComponent from './MonComponent.vue'

export default {
  components: {
    MonComponent
  }
}
```

Les balises `<style>` à l'intérieur des SFC sont généralement injectées comme des balises `<style>` natives pendant le développement pour supporter les mises à jour à chaud. Pour la production, elles peuvent être extraites et fusionnées dans un seul fichier CSS.

Vous pouvez jouer avec les SFC et explorer comment ils sont compilés dans le [Laboratoire SFC de Vue](https://sfc.vuejs.org/).

Dans les projets réels, nous intégrons généralement le compilateur SFC à un outil de construction tel que [Vite](https://vitejs.dev/) ou [Vue CLI](http://cli.vuejs.org/) (qui est basé sur [webpack](https://webpack.js.org/)), et Vue fournit des outils de création officiels pour vous permettre de démarrer avec les SFC aussi vite que possible. Pour plus de détails, consultez la section [TODO(fr)Outillages pour SFC](/guide/scaling-up/tooling).

## Qu'en est-il de la séparation des responsabilités ?

Certains utilisateurs issus d'un milieu traditionnel de développement web peuvent craindre que les SFC ne mélangent différentes responsabilités au même endroit - ce que HTML/CSS/JS étaient censés séparer !

Pour répondre à cette question, il est important que nous soyons d'accord sur le fait que **la séparation des responsabilités ne signifie pas séparation des types de fichiers.** Le but ultime des principes d'ingénierie est d'améliorer la maintenabilité des bases de code. La séparation des responsabilités, lorsqu'elle est appliquée de manière dogmatique comme la séparation des types de fichiers, ne nous aide pas à atteindre cet objectif dans le contexte d'applications front-end de plus en plus complexes.

Dans le développement d'interfaces utilisateur modernes, nous avons constaté qu'au lieu de diviser la base de code en trois énormes couches qui s'entrecroisent, il est beaucoup plus logique de les diviser en composants faiblement couplés et de les composer. À l'intérieur d'un composant, son template, sa logique et ses styles sont intrinsèquement couplés, et leur regroupement rend le composant plus cohérent et plus facile à maintenir.

:::info Remarque
Même si vous n'aimez pas l'idée des composants monofichiers, vous pouvez toujours tirer parti des fonctions de rechargement à chaud (HMR) et de précompilation en séparant votre JavaScript et votre CSS dans des fichiers distincts à l'aide de [TODO(fr)Imports Src](/api/sfc-spec.html#src-imports).
:::