# Props {#props}

Un composant enfant peut accepter des données venant du parent via des **props**. Tout d'abord, il doit déclarer les props qu'il accepte :

<div class="composition-api">
<div class="sfc">

```vue
<!-- ChildComp.vue -->
<script setup>
const props = defineProps({
  msg: String
})
</script>
```

Notez que `defineProps()` est une macro de compilation et n'a pas besoin d'être importée. Une fois déclarée, la prop `msg` peut être utilisée dans le template du composant enfant. Il est également possible d'y accéder en JavaScript via l'objet retourné par `defineProps()`.

</div>

<div class="html">

```js
// dans le composant enfant
export default {
  props: {
    msg: String
  },
  setup(props) {
    // accès via props.msg
  }
}
```

Une fois déclarée, la prop `msg` est exposée sur `this` et peut être utilisée dans le template du composant enfant. Les props reçues sont passées à `setup()` comme premier argument.

</div>

</div>

<div class="options-api">

```js
// dans le composant enfant
export default {
  props: {
    msg: String
  }
}
```

Une fois déclarée, la prop `msg` est exposée sur `this` et peut être utilisée dans le template du composant enfant.

</div>

Le parent peut passer la prop à l'enfant tout comme les attributs. Pour passer une valeur dynamique, on peut aussi utiliser la syntaxe `v-bind` :

<div class="sfc">

```vue-html
<ChildComp :msg="greeting" />
```

</div>
<div class="html">

```vue-html
<child-comp :msg="greeting"></child-comp>
```

</div>

Essayez maintenant de le faire vous-même dans l'éditeur.
