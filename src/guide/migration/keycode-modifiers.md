---
badges:
  - breaking
---

# Modificateurs de code clé <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

Voici un résumé rapide de ce qui a changé :

- **BREAKING** : L'utilisation de chiffres, c'est-à-dire de keyCodes, comme modificateurs `v-on` n'est plus supportée.
- **BREAKING** : `config.keyCodes` n'est plus supporté.

## Syntaxe 2.x

Dans Vue 2, les `keyCodes` étaient supportés comme moyen de modifier une méthode `v-on`.

```html
<!-- keyCode version -->
<input v-on:keyup.13="submit" />

<!-- alias version -->
<input v-on:keyup.enter="submit" />
```

En outre, vous pouvez définir vos propres alias via l'option globale `config.keyCodes`.

```js
Vue.config.keyCodes = {
  f1: 112
}
```

```html
<!-- keyCode version -->
<input v-on:keyup.112="showHelpText" />

<!-- custom alias version -->
<input v-on:keyup.f1="showHelpText" />
```

## Syntaxe 3.x

Depuis que [`KeyboardEvent.keyCode` a été déprécié](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode), il n'est plus utile pour Vue 3 de continuer à le prendre en charge. Par conséquent, il est désormais recommandé d'utiliser le nom en casse kebab pour toute touche que vous souhaitez utiliser comme modificateur.

```html
<!-- Vue 3 Key Modifier on v-on -->
<input v-on:keyup.delete="confirmDelete" />
```

En conséquence, cela signifie que `config.keyCodes` est maintenant aussi déprécié et ne sera plus supporté.

## Stratégie de migration

Pour ceux qui utilisent `keyCode` dans leur base de code, nous recommandons de les convertir en leurs équivalents nommés avec une casse kebab.
