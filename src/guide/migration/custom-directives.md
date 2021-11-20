---
badges:
  - breaking
---

# Custom Directives <MigrationBadges :badges="$frontmatter.badges" />

## Aperçu

Les fonctions de hook pour les directives ont été renommées pour mieux s'aligner sur le cycle de vie des composants.

## Syntaxe 2.x

Dans Vue 2, les directives personnalisées étaient créées en utilisant les hooks listés ci-dessous pour cibler le cycle de vie d'un élément, tous étant optionnels :

- **bind** - Se produit une fois que la directive est liée à l'élément. Ne se produit qu'une fois.
- **inserted** - Se produit une fois que l'élément est inséré dans le DOM parent.
- **update** - Ce hook est appelé lorsque l'élément est mis à jour, mais que les enfants n'ont pas encore été mis à jour.
- **componentUpdated** - Ce crochet est appelé une fois que le composant et les enfants ont été mis à jour.
- **unbind** - Ce hook est appelé une fois que la directive est retirée. Il n'est également appelé qu'une seule fois.

En voici un exemple :

```html
<p v-highlight="'yellow'">Highlight this text bright yellow</p>
```

```js
Vue.directive('highlight', {
  bind(el, binding, vnode) {
    el.style.background = binding.value
  }
})
```

Ici, dans la configuration initiale de cet élément, la directive lie un style en passant une valeur, qui peut être mise à jour à différentes valeurs par l'application.

## Syntaxe 3.x

Dans Vue 3, cependant, nous avons créé une API plus cohérente pour les directives personnalisées. Comme vous pouvez le constater, elles sont très différentes des méthodes de cycle de vie de nos composants, même si nous nous connectons à des événements similaires. Nous les avons maintenant unifiées comme suit :

- **created** - nouveau ! Ceci est appelé avant que les attributs de l'élément ou les écouteurs d'événements soient appliqués.
- bind → **beforeMount**
- inserted → **mounted**
- **beforeUpdate** : nouveau ! Ceci est appelé avant que l'élément lui-même soit mis à jour, un peu comme les crochets de cycle de vie des composants.
- update → supprimé ! Il y avait trop de similitudes avec updated, donc c'est redondant. Veuillez utiliser updated à la place.
- componentUpdated → **updated**
- **beforeUnmount** : nouveau ! Similaire aux crochets de cycle de vie des composants, ceci sera appelé juste avant qu'un élément soit démonté.
- unbind -> **unmounted**

L'API finale est la suivante :

```js
const MyDirective = {
  beforeMount(el, binding, vnode, prevVnode) {},
  mounted() {},
  beforeUpdate() {}, // new
  updated() {},
  beforeUnmount() {}, // new
  unmounted() {}
}
```

L'API qui en résulte peut être utilisée comme suit, en reprenant l'exemple précédent :

```html
<p v-highlight="'yellow'">Highlight this text bright yellow</p>
```

```js
const app = Vue.createApp({})

app.directive('highlight', {
  beforeMount(el, binding, vnode) {
    el.style.background = binding.value
  }
})
```

Maintenant que les crochets du cycle de vie des directives personnalisées reflètent ceux des composants eux-mêmes, il est plus facile de raisonner et de se souvenir d'eux !

### Cas limite : Accès à l'instance du composant

Il est généralement recommandé de garder les directives indépendantes de l'instance du composant dans lequel elles sont utilisées. L'accès à l'instance à partir d'une directive personnalisée est souvent un signe que la directive devrait plutôt être un composant lui-même. Cependant, il existe des situations où cela a du sens.

Dans Vue 2, l'instance du composant devait être accessible via l'argument `vnode` :

```javascript
bind(el, binding, vnode) {
  const vm = vnode.context
}
```

Dans Vue 3, l'instance fait maintenant partie du `binding` :

```javascript
mounted(el, binding, vnode) {
  const vm = binding.instance
}
```

:::warning
Avec la prise en charge de [fragments](/guide/migration/fragments.html#overview), les composants peuvent potentiellement avoir plus d'un noeud racine. Lorsqu'elle est appliquée à un composant à racines multiples, une directive sera ignorée et un avertissement sera enregistré.
:::
