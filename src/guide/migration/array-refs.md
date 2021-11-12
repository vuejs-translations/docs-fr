---
title: v-for Array Refs
badges:
- breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

Dans Vue 2, l'utilisation de l'attribut `ref` à l'intérieur de `v-for` va remplir la propriété `$refs` correspondante avec un tableau de refs. Ce comportement devient ambigu et inefficace lorsqu'il y a des `v-for` imbriqués.

Dans Vue 3, une telle utilisation ne créera plus automatiquement un tableau dans `$refs`. Pour récupérer plusieurs refs à partir d'une seule liaison, liez `ref` à une fonction qui offre plus de flexibilité (c'est une nouvelle fonctionnalité) :

```html
<div v-for="item in list" :ref="setItemRef"></div>
```

Avec les options API :
```js
export default {
  data() {
    return {
      itemRefs: []
    }
  },
  methods: {
    setItemRef(el) {
      if (el) {
        this.itemRefs.push(el)
      }
    }
  },
  beforeUpdate() {
    this.itemRefs = []
  },
  updated() {
    console.log(this.itemRefs)
  }
}
```

Avec Composition API:

```js
import { onBeforeUpdate, onUpdated } from 'vue'

export default {
  setup() {
    let itemRefs = []
    const setItemRef = el => {
      if (el) {
        itemRefs.push(el)
      }
    }
    onBeforeUpdate(() => {
      itemRefs = []
    })
    onUpdated(() => {
      console.log(itemRefs)
    })
    return {
      setItemRef
    }
  }
}
```

Notez que :

- `itemRefs` n'a pas besoin d'être un tableau : il peut aussi être un objet où les refs sont définis par leurs clés d'itération.

- Cela permet également de rendre `itemRefs` réactif et de le surveiller, si nécessaire.
