# Liaisons sur les champs de formulaire {#form-bindings}

En utilisant `v-bind` et `v-on` ensemble, nous pouvons créer des liaisons bidirectionnelles sur les éléments de saisie du formulaire :

```vue-html
<input :value="text" @input="onInput">
```

<div class="options-api">

```js
methods: {
  onInput(e) {
    // une directive v-on recoit un événement natif du DOM
    // comme argument.
    this.text = e.target.value
  }
}
```

</div>

<div class="composition-api">

```js
function onInput(e) {
  // une directive v-on recoit un événement natif du DOM
  // comme argument.
  text.value = e.target.value
}
```

</div>

Essayez de taper dans le champ de saisie - vous devriez voir le texte dans `<p>` se mettre à jour au fur et à mesure que vous tapez.

Pour simplifier une communication bidirectionnelle, Vue fournit une directive, `v-model`, qui est essentiellement du sucre syntaxique pour ce qui précède :

```vue-html
<input v-model="text">
```

`v-model` synchronise automatiquement la valeur de l'`<input>` avec le state lié, donc nous n'avons plus besoin d'utiliser un gestionnaire d'événements pour cela.

`v-model` ne fonctionne pas seulement sur les inputs de type texte, mais aussi les autres types d'input tels que les boîtes à cocher, les boutons radio et les listes d'options. Les détails sur abordés dans <a target="_blank" href="/guide/essentials/forms.html">Guide - Liaison des formulaires</a>.

Maintenant, essayez de refactoriser le code pour utiliser `v-model` à la place.
