<script setup>
import ListBasic from './transition-demos/ListBasic.vue'
import ListMove from './transition-demos/ListMove.vue'
import ListStagger from './transition-demos/ListStagger.vue'
</script>

# TransitionGroup {#transitiongroup}

`<TransitionGroup>` est un composant natif conçu pour animer l'insertion, la suppression et le changement d'ordre des éléments ou des composants qui sont rendus dans une liste.

## Différences avec `<Transition>` {#differences-from-transition}

`<TransitionGroup>` prend en charge les mêmes props, classes de transition CSS et écouteurs de hooks JavaScript que `<Transition>`, avec les différences suivantes :

- Par défaut, il ne rend pas d'élément en contenant d'autres. Mais vous pouvez spécifier un élément à rendre avec la prop `tag`.

- [Les modes de transition](./transition#transition-modes) ne sont pas disponibles, car nous n'alternons plus entre des éléments qui s'excluent mutuellement.

- Les éléments à l'intérieur sont **contraints de toujours** avoir un attribut unique `key`.

- Les classes de transition CSS seront appliquées aux éléments individuels de la liste, **pas** au groupe/conteneur lui-même.

:::tip
Lorsqu'il est utilisé dans les [templates du DOM](/guide/essentials/component-basics#in-dom-template-parsing-caveats), il doit être référencé comme `<transition-group>`.
:::

## Transitions d'Entrée / Sortie {#enter-leave-transitions}

Voici un exemple d'application des transitions d'entrée / sortie dans une liste `v-for` en utilisant `<TransitionGroup>` :

```vue-html
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>
```

```css
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
```

<ListBasic />

## Transitions de mouvements {#move-transitions}

La démonstration ci-dessus présente des défauts évidents : lorsqu'un élément est inséré ou retiré, les éléments qui l'entourent "sautent" instantanément au lieu de se déplacer en douceur. Nous pouvons corriger ce problème en ajoutant quelques règles CSS supplémentaires :

```css{1,13-17}
.list-move, /* appliquer la transition aux éléments mobiles */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* s'assure que les éléments sortants sont retirés du flux de la mise en page afin que le déplacement
   des animations soit calculé correctement. */
.list-leave-active {
  position: absolute;
}
```

Maintenant, c'est beaucoup mieux - elle s'anime même en douceur lorsque la liste entière est mélangée :

<ListMove />

[Exemple complet](/examples/#list-transition)

### Classes de TransitionGroup personnalisées {#custom-transitiongroup-classes}

Vous pouvez également spécifier des classes de transition personnalisées pour l'élément mobile en passant la propriété `moveClass` à `<TransitionGroup>`, comme dans l'exemple suivant [Classes de transition personnalisées](/guide/built-ins/transition.html#custom-transition-classes).

## Échelonner des transitions de liste {#staggering-list-transitions}

En communiquant avec les transitions JavaScript par le biais d'attributs de données, il est également possible d'échelonner les transitions dans une liste. Tout d'abord, nous rendons l'index d'un élément comme un attribut de données sur l'élément du DOM :

```vue-html{11}
<TransitionGroup
  tag="ul"
  :css="false"
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @leave="onLeave"
>
  <li
    v-for="(item, index) in computedList"
    :key="item.msg"
    :data-index="index"
  >
    {{ item.msg }}
  </li>
</TransitionGroup>
```

Ensuite, dans les hooks JavaScript, nous animons l'élément avec un délai basé sur l'attribut de données. Cet exemple utilise la [bibliothèque GSAP](https://gsap.com/) pour réaliser l'animation :

```js{5}
function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}
```

<ListStagger />

<div class="composition-api">

[Essayez l'exemple complet en ligne](https://play.vuejs.org/#eNqlVMuu0zAQ/ZVRNklRm7QLWETtBW4FSFCxYkdYmGSSmjp28KNQVfl3xk7SFyvEponPGc+cOTPNOXrbdenRYZRHa1Nq3lkwaF33VEjedkpbOIPGeg6lajtnsYIeaq1aiOlSfAlqDOtG3L8SUchSSWNBcPrZwNdCAqVqTZND/KxdibBDjKGf3xIfWXngCNs9k4/Udu/KA3xWWnPz1zW0sOOP6CcnG3jv9ImIQn67SvrpUJ9IE/WVxPHsSkw97gbN0zFJZrB5grNPrskcLUNXac2FRZ0k3GIbIvxLSsVTq3bqF+otM5jMUi5L4So0SSicHplwOKOyfShdO1lariQo+Yy10vhO+qwoZkNFFKmxJ4Gp6ljJrRe+vMP3yJu910swNXqXcco1h0pJHDP6CZHEAAcAYMydwypYCDAkJRdX6Sts4xGtUDAKotIVs9Scpd4q/A0vYJmuXo5BSm7JOIEW81DVo77VR207ZEf8F23LB23T+X9VrbNh82nn6UAz7ASzSCeANZe0AnBctIqqbIoojLCIIBvoL5pJw31DH7Ry3VDKsoYinSii4ZyXxhBQM2Fwwt58D7NeoB8QkXfDvwRd2XtceOsCHkwc8KCINAk+vADJppQUFjZ0DsGVGT3uFn1KSjoPeKLoaYtvCO/rIlz3vH9O5FiU/nXny/pDT6YGKZngg0/Zg1GErrMbp6N5NHxJFi3N/4dRkj5IYf5ULxCmiPJpI4rIr4kHimhvbWfyLHOyOzQpNZZ57jXNy4nRGFLTR/0fWBqe7w==)

</div>
<div class="options-api">

[Essayez l'exemple complet en ligne](https://play.vuejs.org/#eNqtVE2P0zAQ/SujXNqgNmkPcIjaBbYCJKg4cSMcTDJNTB07+KNsVfW/M3aabNpyQltViT1vPPP8Zian6H3bJgeHURatTKF5ax9yyZtWaQuVYS3stGpg4peTXOayUNJYEJwea/ieS4ATNKbKYPKoXYGwRZzAeTYGPrNizxE2NZO30KZ2xR6+Kq25uTuGFrb81vrFyQo+On0kIJc/PCV8CmxL3DEnLJy8e8ksm8bdGkCjdVr2O4DfDvWRgtGN/JYC0SOkKVTTOotl1jv3hi3d+DngENILkey4sKinU26xiWH9AH6REN/Eqq36g3rDDE7jhMtCuBLN1NbcJIFEHN9RaNDWqjQDAyUfcac0fpA+CYoRCRSJsUeBiWpZwe2RSrK4w2rkVe2rdYG6LD5uH3EGpZI4iuurTdwDNBjpRJclg+UlhP914UnMZfIGm8kIKVEwciYivhoGLQlQ4hO8gkWyfD1yVHJDKgu0mAUmPXLuxRkYb5Ed8H8YL/7BeGx7Oa6hkLmk/yodBoo21BKtYBZpB7DikroKDvNGUeZ1HoVmyCNIO/ibZtJwy5X8pJVru9CWVeTpRB51+6wwhgw7Jgz2tnc/Q6/M0ZeWwKvmGZye0Wu78PIGexC6swdGxEnw/q6HOYUkt9DwMwhKxfS6GpY+KPHc45G8+6EYAV7reTjucf/uwUtSmvvTME1wDuISlVTwTqf0RiiyrtKR0tEs6r5l84b645dRkr5zoT8oXwBMHg2Tlke+jbwhj2prW5OlqZPtvkroYqnH3lK9nLgI46scnf8Cn22kBA==)

</div>

---

**Référence**

- [Référence de l'API `<TransitionGroup>`](/api/built-in-components#transitiongroup)
