---
title: Props Default Function this Access
badges:
  - breaking
---

# Props Fonction par défaut `this` Accès <MigrationBadges :badges="$frontmatter.badges" />

Les fonctions de fabrique de valeurs par défaut de Props n'ont plus accès à `this`.

A la place :

- Les props bruts reçus par le composant sont passés en argument à la fonction par défaut ;

- L'API [inject](../composition-api-provide-inject.md) peut être utilisée à l'intérieur des fonctions par défaut.

```js
import { inject } from 'vue'

export default {
  props: {
    theme: {
      default (props) {
        // Les `props` sont les valeurs brutes passées au composant,
        // avant tout type / coercition par défaut
        // peut également utiliser `inject` pour accéder aux propriétés injectées.
        return inject('theme', 'default-theme')
      }
    }
  }
}
```
