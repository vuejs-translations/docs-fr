---
outline: deep
---

# Utiliser Vue avec Typescript {#using-vue-with-typescript}

Un système de typage comme TypeScript peut détecter de nombreuses erreurs courantes via une analyse statique au moment du build. Cela réduit le risque d'erreurs d'exécution en production et nous permet également de refactoriser le code avec plus de confiance dans les applications à grande échelle. TypeScript améliore également l'ergonomie des développeurs via l'auto-complétion basée sur le type dans les IDE.

Vue est écrit en TypeScript lui-même et fournit un support TypeScript nativement. Tous les packages Vue officiels sont livrés avec des déclarations de types prêts à l'emploi.

## Configuration du projet {#project-setup}

[`create-vue`](https://github.com/vuejs/create-vue), l'outil officiel de création de projet, offre les options pour construire un projet propulsé par [Vite](https://vitejs.dev/) et fonctionnant avec TypeScript.

### Vue d'ensemble {#overview}

Avec une configuration basée sur Vite, le serveur de développement et le bundler ne font que transpiler et n'effectuent aucune vérification de type. Cela garantit que le serveur de développement Vite reste extrêmement rapide même lorsque vous utilisez TypeScript.

- Pendant le développement, nous vous recommandons de vous fier à une bonne [configuration de votre IDE](#ide-support) pour un feedback instantané sur les erreurs de type.

- Si vous utilisez des SFC, utilisez [`vue-tsc`](https://github.com/johnsoncodehk/volar/tree/master/vue-language-tools/vue-tsc) pour la vérification du type en ligne de commande et pour la génération de déclarations de type. `vue-tsc` fonctionne avec `tsc`, l'interface en ligne de commande officielle de TypeScript. Il fonctionne en grande partie de la même manière que `tsc` sauf qu'il prend en charge les SFC de Vue en plus des fichiers TypeScript. Vous pouvez exécuter `vue-tsc` en mode *watch* en parallèle avec le serveur de développement Vite, ou utiliser un plugin Vite comme [vite-plugin-checker](https://vite-plugin-checker.netlify.app/) qui exécute les vérifications dans un thread de travail séparé.

- Vue CLI prend également en charge TypeScript, mais n'est plus recommandé. Voir [les notes ci-dessous](#note-on-vue-cli-and-ts-loader).

### Support des IDE {#ide-support}

- [Visual Studio Code](https://code.visualstudio.com/) (VSCode) est fortement recommandé pour son excellent support prêt à l'emploi pour TypeScript.

  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) est l'extension VSCode officielle qui fournit la prise en charge de TypeScript pour les SFC de Vue, ainsi que de nombreuses autres fonctionnalités intéressantes.

    :::tip
    Volar remplace [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), notre précédente extension VSCode officielle pour Vue 2. Si Vetur est actuellement installé, assurez-vous de le désactiver dans les projets Vue 3 .
    :::

  - [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) est également nécessaire pour obtenir la prise en charge du type pour les importations `*.vue` dans les fichiers TS.

- [WebStorm](https://www.jetbrains.com/webstorm/) fournit également une prise en charge prête à l'emploi pour TypeScript et Vue. D'autres IDE JetBrains les prennent également en charge, soit prêts à l'emploi, soit via [un plugin gratuit](https://plugins.jetbrains.com/plugin/9442-vue-js).

### Configurer `tsconfig.json` {#configuring-tsconfig-json}

Les projets construits via `create-vue` incluent un `tsconfig.json` préconfiguré. La configuration de base est résumée dans le package [`@vue/tsconfig`](https://github.com/vuejs/tsconfig). Au sein du projet, nous utilisons [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) pour nous assurer que les types de code corrects s'exécutent dans différents environnements (par exemple, le code d'application et le code de test doivent avoir différentes variables globales).

Lors de la configuration manuelle de `tsconfig.json`, certaines options notables incluent :

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) est défini sur `true` car Vite utilise [esbuild](https://esbuild.github.io/) pour transpiler TypeScript et est soumis à des limitations de transpilation de fichier unique.

- Si vous utilisez l'Options API, vous devez définir [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) sur `true` (ou au moins activer [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis), qui fait partie de l'indicateur `strict`) pour tirer parti de la vérification de type de `this` dans les options de composant. Sinon, `this` sera traité comme `any`.

- Si vous avez configuré des alias de résolveur dans votre outil de construction, par exemple l'alias `@/*` configuré par défaut dans un projet `create-vue`, vous devez également le configurer pour TypeScript via [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths).

Voir aussi :

- [Documentation officielle des options du compilateur TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [Avertissements concernant la compilation TypeScript d'esbuild](https://esbuild.github.io/content-types/#typescript-caveats)

### Mode prise de contrôle de Volar {#volar-takeover-mode}

> Cette section s'applique uniquement à VSCode + Volar.

Pour que les SFC de Vue et TypeScript fonctionnent ensemble, Volar crée une instance de service de langage TS distincte avec un support spécifique à Vue et l'utilise dans les SFC. Dans le même temps, les fichiers TS simples sont toujours gérés par le service de langage TS intégré de VSCode, c'est pourquoi nous avons besoin du [plugin TypeScript Vue](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) pour prendre en charge les importations SFC dans les fichiers TS. Cette configuration par défaut fonctionne, mais pour chaque projet, nous exécutons deux instances de service de langage TS : une pour Volar, une pour le service intégré de VSCode. Ceci est un peu inefficace et peut entraîner des problèmes de performances dans les grands projets.

Volar fournit une fonctionnalité appelée "Mode prise de contrôle" (ou Takeover Mode) pour améliorer les performances. En mode prise de contrôle, Volar prend en charge les fichiers Vue et TS à l'aide d'une seule instance de service de langage TS.

Pour l'activer, vous devez désactiver le service de langage TS intégré de VSCode dans **l'espace de travail de votre projet uniquement** en suivant ces étapes :

1. Dans l'espace de travail de votre projet, affichez la palette de commandes avec `Ctrl + Shift + P` (macOS : `Cmd + Shift + P`).
2. Tapez `built` et sélectionnez "Extensions : Afficher les extensions intégrées".
3. Tapez `typescript` dans la zone de recherche d'extension (ne supprimez pas le préfixe `@builtin`).
4. Cliquez sur la petite icône d'engrenage de "Fonctionnalités du langage TypeScript et JavaScript", et sélectionnez "Désactiver (espace de travail)".
5. Rechargez l'espace de travail. Le mode Prise de contrôle sera activé lorsque vous ouvrirez un fichier Vue ou TS.

<img src="./images/takeover-mode.png" width="590" height="426" style="margin:0px auto;border-radius:8px">

### Remarque à propos de Vue CLI et `ts-loader` {#note-on-vue-cli-and-ts-loader}

Dans les configurations basées sur Webpack telles que Vue CLI, il est courant d'effectuer une vérification de type dans le cadre du pipeline de transformation de module, par exemple avec `ts-loader`. Ceci, cependant, n'est pas une solution propre car le système de type a besoin de connaître l'ensemble du graphe de module pour effectuer des vérifications de type. L'étape de transformation d'un module individuel n'est tout simplement pas le bon endroit pour la tâche. Cela conduit aux problèmes suivants :

- `ts-loader` ne peut vérifier que le type d'un code post-transformé. Cela ne correspond pas aux erreurs que nous voyons dans les IDE ou de `vue-tsc`, qui renvoient directement au code source.

- La vérification de type peut être lente. Lorsqu'elle est effectuée dans le même thread /processus avec des transformations de code, cela affecte considérablement la vitesse de construction de l'ensemble de l'application.

- Nous avons déjà une vérification de type exécutée directement dans notre IDE dans un processus séparé, donc le ralentissement du coût de l'expérience de développement n'est tout simplement pas un bon compromis.

Si vous utilisez actuellement Vue 3 + TypeScript via Vue CLI, nous vous recommandons fortement de migrer vers Vite. Nous travaillons également sur les options du CLI pour activer le support de la transpilation TS uniquement, afin que vous puissiez passer à `vue-tsc` pour la vérification de type.

## Remarques générales d'utilisation {#general-usage-notes}

### `defineComponent()` {#definecomponent}

Pour permettre à TypeScript de déduire correctement les types dans les options de composant, nous devons définir les composants avec [`defineComponent()`](/api/general.html#definecomponent) :

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // inférence de type activée
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
      count: 1
    }
  },
  mounted() {
    this.name // type: string | undefined
    this.msg // type: string
    this.count // type: number
  }
})
```

`defineComponent()` prend également en charge l'inférence des props passées à `setup()` lors de l'utilisation de la Composition API sans `<script setup>` :

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // inférence de type activée
  props: {
    message: String
  },
  setup(props) {
    props.message // type: string | undefined
  }
})
```

Voir aussi :

- [Note sur le Treeshaking de Webpack](/api/general.html#note-on-webpack-treeshaking)
- [tests sur les types de `defineComponent`](https://github.com/vuejs/core/blob/main/test-dts/defineComponent.test-d.tsx)

:::tip
`defineComponent()` permet également l'inférence de type pour les composants définis en JavaScript simple.
:::

### Utilisation dans les composants monofichiers {#usage-in-single-file-components}

Pour utiliser TypeScript dans les SFC, ajoutez l'attribut `lang="ts"` aux balises `<script>`. Lorsque `lang="ts"` est présent, toutes les expressions du template bénéficient également d'une vérification de type plus stricte.

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- vérification du type et auto-complétion disponible -->
  {{ count.toFixed(2) }}
</template>
```

`lang="ts"` peut aussi être utilisé avec `<script setup>` :

```vue
<script setup lang="ts">
// TypeScript activé
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- vérification du type et auto-complétion disponible -->
  {{ count.toFixed(2) }}
</template>
```

### TypeScript dans les templates {#typescript-in-templates}

Le `<template>` prend également en charge TypeScript dans les expressions de liaison lorsque `<script lang="ts">` ou `<script setup lang="ts">` est utilisé. Ceci est utile dans les cas où vous devez effectuer un casting de type dans les expressions du template.

Voici un exemple :

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- erreur parce que x pourrait être une string -->
  {{ x.toFixed(2) }}
</template>
```

Cela peut être contourné avec un casting litéral de type :

```vue{6}
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

:::tip
Si vous utilisez Vue CLI ou une configuration basée sur un Webpack, TypeScript dans les expressions de modèle nécessite `vue-loader@^16.8.0`.
:::

## Recettes spéciques aux APIs {#api-specific-recipes}

- [TS avec la Composition API](./composition-api)
- [TS avec l'Options API](./options-api)
