# Observateurs {#watchers}

Parfois, nous pouvons avoir besoin d'exécuter des "effets de bord" de manière réactive - par exemple, afficher un nombre dans la console lorsqu'il change. Nous pouvons réaliser cela avec des observateurs :

<div class="composition-api">

```js
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newCount) => {
  // oui, console.log() est un effet de bord
  console.log(`new count is: ${newCount}`)
})
```

`watch()` peut directement observer une ref, et le callback sera appelé dès que la valeur de `count` change. `watch()` peut aussi observer d'autres types de sources de données - davantage de détails sont disponibles dans <a target="_blank" href="/guide/essentials/watchers.html">Guide - Observateurs</a>.

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  watch: {
    count(newCount) {
      // oui, console.log est un effet de bord
      console.log(`new count is: ${newCount}`)
    }
  }
}
```

Ici, nous utilisons l'option `watch` pour surveiller les changements de la propriété `count`. Le callback de l'observateur est appelé quand `count` change, et reçoit la nouvelle valeur en tant qu'argument. Davantage de détails sont disponibles dans <a target="_blank" href="/guide/essentials/watchers.html">Guide - Observateurs</a>.

</div>

Un exemple plus pratique que l'affichage vers la console serait de récupérer de nouvelles données lorsqu'un ID change. Le code que nous avons récupère les données des listes de tâches à partir d'une API fictive lors du montage du composant. Il y a également un bouton qui incrémente l'ID du de la liste de tâches qui doit être récupéré. Essayez d'implémenter un observateur qui récupère une nouvelle liste de tâches lorsque le bouton est cliqué.
