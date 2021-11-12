---
badges:
  - breaking
---

# Custom Elements Interop <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

- **BREAKING:** La mise en liste blanche des éléments personnalisés est maintenant effectuée pendant la compilation du modèle, et doit être configurée via les options du compilateur au lieu de la configuration du runtime.
- **BREAKING:** L'utilisation de la prop spéciale `is` est restreinte à la balise réservée `<component>` uniquement.
- **NOUVEAU :** Il y a une nouvelle directive `v-is` pour supporter les cas d'utilisation de la 2.x où `is` était utilisé sur des éléments natifs pour contourner les restrictions d'analyse du HTML natif.

## Éléments personnalisés autonomes

Si nous voulons ajouter un élément personnalisé défini en dehors de Vue (par exemple, en utilisant l'API des composants Web), nous devons "demander" à Vue de le traiter comme un élément personnalisé. Utilisons le modèle suivant à titre d'exemple.

```html
<plastic-button></plastic-button>
```

### 2.x Syntax

Dans Vue 2.x, la mise en liste blanche des balises en tant qu'éléments personnalisés se faisait via `Vue.config.ignoredElements` :

```js
// Ceci fera que Vue ignorera les éléments personnalisés définis en dehors de Vue
// (par exemple, en utilisant les API de composants Web).

Vue.config.ignoredElements = ['plastic-button']
```

### Syntaxe 3.x

**Dans Vue 3.0, cette vérification est effectuée pendant la compilation du modèle.** Pour demander au compilateur de traiter `<plastic-button>` comme un élément personnalisé :

- Si vous utilisez une étape de construction : passez l'option `isCustomElement` au compilateur de modèle Vue. Si vous utilisez `vue-loader`, ceci doit être passé via l'option `compilerOptions` de `vue-loader` :

  ```js
  // in webpack config
  rules: [
    {
      test: /\.vue$/,
      use: 'vue-loader',
      options: {
        compilerOptions: {
          isCustomElement: tag => tag === 'plastic-button'
        }
      }
    }
    // ...
  ]
  ```

- Si vous utilisez la compilation de modèles à la volée, passez-le via `app.config.isCustomElement` :

  ```js
  const app = Vue.createApp({})
  app.config.isCustomElement = tag => tag === 'plastic-button'
  ```

  Il est important de noter que la configuration d'exécution n'affecte que la compilation des modèles d'exécution - elle n'affecte pas les modèles précompilés.

## Éléments intégrés personnalisés

La spécification Custom Elements permet d'utiliser des éléments personnalisés comme [Customized Built-in Element] (https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example) en ajoutant l'attribut `is` à un élément intégré :

```html
<button is="plastic-button">Click Me!</button>
```

L'utilisation par Vue de l'accessoire spécial `is` simule ce que fait l'attribut natif avant qu'il ne soit universellement disponible dans les navigateurs. Cependant, dans la version 2.x, il a été interprété comme rendant un composant Vue avec le nom `plastic-button`. Cela bloque l'utilisation native de Customized Built-in Element mentionnée ci-dessus.

Dans la version 3.0, nous limitons le traitement spécial de Vue de la prop `is` à la seule balise `<component>`.

- Lorsqu'elle est utilisée sur la balise réservée `<component>`, elle se comportera exactement de la même manière qu'en 2.x ;
- Lorsqu'il est utilisé sur des composants normaux, il se comportera comme un accessoire normal :

  ```html
  <foo is="bar" />
  ```

- Comportement 2.x : effectue le rendu du composant `bar`.
- Comportement 3.x : Rend le composant `foo` et passe l'option `is`.

- Lorsqu'il est utilisé sur des éléments simples, il sera passé à l'appel `createElement` comme l'option `is`, et également rendu comme un attribut natif. Cela permet l'utilisation d'éléments intégrés personnalisés.

  ```html
  <button is="plastic-button">Click Me!</button>
  ```

- Comportement 2.x : Rend le composant `plastic-button`.
- Comportement 3.x : Rend un bouton natif en appelant

    ```js
    document.createElement('button', { is: 'plastic-button' })
    ```

## `v-is` pour l'analyse des templates In-DOM Workarounds

> Remarque : cette section ne concerne que les cas où les modèles Vue sont directement écrits dans le code HTML de la page.
> Lorsque vous utilisez des modèles in-DOM, le modèle est soumis aux règles d'analyse HTML natives. Certains éléments HTML, tels que `<ul>`, `<ol>`, `<table>` et `<select>` ont des restrictions sur les éléments qui peuvent apparaître à l'intérieur, et certains éléments tels que `<li>`, `<tr>` et `<option>` ne peuvent apparaître qu'à l'intérieur de certains autres éléments.

### Syntaxe 2.x

Dans Vue 2, nous avons recommandé de contourner ces restrictions en utilisant la prop `is` sur une balise native :

```html
<table>
  <tr is="blog-post-row"></tr>
</table>
```

### Syntaxe 3.x

Avec le changement de comportement de `is`, nous introduisons une nouvelle directive `v-is` pour contourner ces cas :

```html
<table>
  <tr v-is="'blog-post-row'"></tr>
</table>
```

:::warning
`v-is` fonctionne comme une liaison `:is` dynamique 2.x - ainsi pour rendre un composant par son nom enregistré, sa valeur doit être une chaîne littérale JavaScript :

```html
<!-- Incorrect, rien ne sera rendu -->
<tr v-is="blog-post-row"></tr>

<!-- Correct -->
<tr v-is="'blog-post-row'"></tr>
```

:::

## Stratégie de migration

- Remplacer `config.ignoredElements` par soit `compilerOptions` de `vue-loader` (avec l'étape de construction) ou `app.config.isCustomElement` (avec la compilation des templates à la volée)

- Changez toutes les balises non-`<component>` avec l'utilisation de `is` en `<component is="...">` (pour les modèles SFC) ou `v-is` (pour les modèles in-DOM).
