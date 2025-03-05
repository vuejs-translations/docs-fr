# Cycle de vie et refs de template {#lifecycle-and-template-refs}

Jusqu'à présent, Vue a géré toutes les mises à jour du DOM pour nous, grâce à la réactivité et au render déclaratif. Cependant, il y aura inévitablement des cas où nous devrons travailler manuellement avec le DOM.

Nous pouvons demander une **ref de template** - c'est-à-dire une référence à un élément du template - en utilisant l'attribut <a target="_blank" href="/api/built-in-special-attributes.html#ref">spécial `ref`</a> :

```vue-html
<p ref="pElementRef">hello</p>
```

<div class="composition-api">

Pour accéder à la ref, nous devons déclarer<span class="html"> et exposer</span> une référence avec le nom correspondant :

<div class="sfc">

```js
const pElementRef = ref(null)
```

</div>
<div class="html">

```js
setup() {
  const pElementRef = ref(null)

  return {
    pElementRef
  }
}
```

</div>

Remarquez que la ref est initialisée avec la valeur `null`. C'est parce que l'élément n'existe pas encore lorsque <span class="sfc">`<script setup>`</span><span class="html">`setup()`</span> est exécuté. La ref du template n'est accessible qu'après le **mounted** de l'élément.

Pour exécuter du code après le montage, nous pouvons utiliser la fonction `onMounted()` :

<div class="sfc">

```js
import { onMounted } from 'vue'

onMounted(() => {
  // le composant est maintenant monté.
})
```

</div>
<div class="html">

```js
import { onMounted } from 'vue'

createApp({
  setup() {
    onMounted(() => {
      // le composant est maintenant monté.
    })
  }
})
```

</div>
</div>

<div class="options-api">

L'élément sera exposé sur `this.$refs` avec `this.$refs.pElementRef`. Cependant, vous ne pourrez y accéder qu'une fois le composant **monté**.

Pour exécuter le code après le montage, nous pouvons utiliser l'option `mounted` :

<div class="sfc">

```js
export default {
  mounted() {
    // le composant est maintenant monté.
  }
}
```

</div>
<div class="html">

```js
createApp({
  mounted() {
    // le composant est maintenant monté.
  }
})
```

</div>
</div>

Ceci est appelé un **cycle de vie** - cela permet d'enregistrer un callback qui sera appelé à certains moments du cycle de vie du composant. Il y a d'autres cycles tels que <span class="options-api">`created` et `updated`</span><span class="composition-api">`onUpdated` et `onUnmounted`</span>. Consultez <a target="_blank" href="/guide/essentials/lifecycle.html#lifecycle-diagram">Le diagramme du cycle de vie</a> pour davantage de détails.

Maintenant, essayez d'ajouter un cycle de vie <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>, d'accéder au `<p>` via <span class="options-api">`this.$refs.pElementRef`</span><span class="composition-api">`pElementRef.value`</span>, et d'effectuer quelques opérations directes sur le DOM (ex. changer le `textContent`).
