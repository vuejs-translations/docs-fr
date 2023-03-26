<script setup>
import Basic from './transition-demos/Basic.vue'
import SlideFade from './transition-demos/SlideFade.vue'
import CssAnimation from './transition-demos/CssAnimation.vue'
import NestedTransitions from './transition-demos/NestedTransitions.vue'
import JsHooks from './transition-demos/JsHooks.vue'
import BetweenElements from './transition-demos/BetweenElements.vue'
import BetweenComponents from './transition-demos/BetweenComponents.vue'
</script>

# Transition {#transition}

Vue propose deux composants natifs qui peuvent aider à travailler avec des transitions et des animations en réponse à un changement d'état :

- `<Transition>`pour appliquer des animations lorsqu'un élément ou un composant entre et sort du DOM. Ceci est couvert sur cette page.

- `<TransitionGroup>` pour appliquer des animations lorsqu'un élément ou un composant est inséré, supprimé ou déplacé dans une liste `v-for`. Ceci est couvert dans [le chapitre suivant](/guide/built-ins/transition-group).

Outre ces deux composants, nous pouvons également appliquer des animations dans Vue en utilisant d'autres techniques telles que le basculement des classes CSS ou des animations basées sur l'état via des liaisons de style. Ces techniques supplémentaires sont traitées dans le chapitre [Techniques d'animation](/guide/extras/animation).

## Le composant `<Transition>` {#the-transition-component}

`<Transition>` est un composant intégré : cela signifie qu'il est disponible dans n'importe quel template de composant sans avoir à l'enregistrer. Il peut être utilisé pour appliquer des animations d'entrée et de sortie sur des éléments ou des composants qui lui sont transmis via son slot par défaut. L'entrée ou la sortie peut être déclenchée par l'une des actions suivantes :

- Rendu conditionnel via `v-if`
- Affichage conditionnel via `v-show`
- Basculement des composants dynamiques via l'élément spécial `<component>`
- Changer l'attribut spécial `key`

Voici un exemple de l'utilisation la plus basique :

```vue-html
<button @click="show = !show">Toggle</button>
<Transition>
  <p v-if="show">hello</p>
</Transition>
```

```css
/* nous vous expliquerons ensuite ce que font ces classes ! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
```

<Basic />

<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3Qgc2hvdyA9IHJlZih0cnVlKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJzaG93ID0gIXNob3dcIj5Ub2dnbGU8L2J1dHRvbj5cbiAgPFRyYW5zaXRpb24+XG4gICAgPHAgdi1pZj1cInNob3dcIj5oZWxsbzwvcD5cbiAgPC9UcmFuc2l0aW9uPlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuLnYtZW50ZXItYWN0aXZlLFxuLnYtbGVhdmUtYWN0aXZlIHtcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzIGVhc2U7XG59XG5cbi52LWVudGVyLWZyb20sXG4udi1sZWF2ZS10byB7XG4gIG9wYWNpdHk6IDA7XG59XG48L3N0eWxlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2hvdzogdHJ1ZVxuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJzaG93ID0gIXNob3dcIj5Ub2dnbGU8L2J1dHRvbj5cbiAgPFRyYW5zaXRpb24+XG4gICAgPHAgdi1pZj1cInNob3dcIj5oZWxsbzwvcD5cbiAgPC9UcmFuc2l0aW9uPlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuLnYtZW50ZXItYWN0aXZlLFxuLnYtbGVhdmUtYWN0aXZlIHtcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzIGVhc2U7XG59XG5cbi52LWVudGVyLWZyb20sXG4udi1sZWF2ZS10byB7XG4gIG9wYWNpdHk6IDA7XG59XG48L3N0eWxlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>

:::tip
`<Transition>` ne prend en charge qu'un seul élément ou composant comme contenu du slot. Si le contenu est un composant, le composant doit également avoir un seul élément racine.
:::

Lorsqu'un élément d'un composant `<Transition>` est inséré ou supprimé, voici ce qui se passe :

1. Vue détectera automatiquement si l'élément cible a des transitions CSS ou des animations appliquées. Si c'est le cas, un certain nombre de [classes de transition CSS](#transition-classes) seront ajoutées / supprimées aux moments appropriés.

2. S'il existe des écouteurs pour les [hooks JavaScript](#javascript-hooks), ces hooks seront appelés aux moments appropriés.

3. Si aucune transition / animation CSS n'est détectée et qu'aucun hook JavaScript n'est fourni, les opérations DOM d'insertion et / ou de suppression seront exécutées lors du prochain rafraîchissement d'animation du navigateur.

## Transitions basées sur le CSS {#css-based-transitions}

### Classes de transition {#transition-classes}

Six classes sont appliquées pour les transitions entrée / sortie.

![Diagramme de transition](./images/transition-classes.png)

<!-- https://www.figma.com/file/fOt2CGHzhxoBDBOv7L5omL/Transition-Classes -->

1. `v-enter-from` : état de départ pour l'entrée. Ajoutée avant l'insertion de l'élément, supprimée une frame après l'insertion de l'élément.

2. `v-enter-active` : état actif pour l'entrée. Appliquée pendant toute la phase d'entrée. Ajoutée avant l'insertion de l'élément, supprimée à la fin de la transition / animation. Cette classe peut être utilisée pour définir la durée, le retard et la courbe d'accélération de la transition entrante.

3. `v-enter-to` : état de fin pour l'entrée. Ajoutée une frame après l'insertion de l'élément (en même temps `v-enter-from` est supprimée), supprimée lorsque la transition / animation se termine.

4. `v-leave-from` : état de départ pour la sortie. Ajoutée immédiatement lorsqu'une transition de sortie est déclenchée, supprimée après une frame.

5. `v-leave-active` : état actif pour la sortie. Appliquée pendant toute la phase de sortie. Ajoutée immédiatement lorsqu'une transition de sortie est déclenchée, supprimée lorsque la transition/animation se termine. Cette classe peut être utilisée pour définir la durée, le retard et la courbe d'accélération de la transition de sortie.

6. `v-leave-to` : état de fin pour la sortie. Ajoutée une frame après le déclenchement d'une transition de sortie (en même temps `v-leave-from` est supprimée), supprimée lorsque la transition/animation se termine.

`v-enter-active` et `v-leave-active` nous donnent la possibilité de spécifier différentes courbes d'accélération pour les transitions entrée/sortie, dont nous verrons un exemple dans les sections suivantes.

### Transitions nommées {#named-transitions}

Une transition peut être nommée via la prop `name` :

```vue-html
<Transition name="fade">
  ...
</Transition>
```

Pour une transition nommée, ses classes de transition seront préfixées par son nom au lieu de `v`. Par exemple, la classe appliquée pour la transition ci-dessus sera `fade-enter-active` au lieu de `v-enter-active`. Le CSS pour la transition de fondu devrait ressembler à ceci :

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### Transitions CSS {#css-transitions}

`<Transition>` est le plus souvent utilisé en combinaison avec [les transitions CSS natives](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions), comme on le voit dans l'exemple basique ci-dessus. La propriété CSS `transition` est un raccourci qui nous permet de spécifier plusieurs aspects d'une transition, y compris les propriétés qui doivent être animées, la durée de la transition et les [courbes d'accélération](https://developer.mozilla.org/fr/docs/Web/CSS/easing-function).

Voici un exemple plus avancé qui effectue la transition de plusieurs propriétés, avec différentes durées et courbes d'accélération pour l'entrée et la sortie :

```vue-html
<Transition name="slide-fade">
  <p v-if="show">hello</p>
</Transition>
```

```css
/*
  Les animations d'entrée et de sortie peuvent utiliser différentes
  durées et fonctions de temporisation.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

<SlideFade />

<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3Qgc2hvdyA9IHJlZih0cnVlKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJzaG93ID0gIXNob3dcIj5Ub2dnbGUgU2xpZGUgKyBGYWRlPC9idXR0b24+XG4gIDxUcmFuc2l0aW9uIG5hbWU9XCJzbGlkZS1mYWRlXCI+XG4gICAgPHAgdi1pZj1cInNob3dcIj5oZWxsbzwvcD5cbiAgPC9UcmFuc2l0aW9uPlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuLnNsaWRlLWZhZGUtZW50ZXItYWN0aXZlIHtcbiAgdHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZS1vdXQ7XG59XG5cbi5zbGlkZS1mYWRlLWxlYXZlLWFjdGl2ZSB7XG4gIHRyYW5zaXRpb246IGFsbCAwLjhzIGN1YmljLWJlemllcigxLCAwLjUsIDAuOCwgMSk7XG59XG5cbi5zbGlkZS1mYWRlLWVudGVyLWZyb20sXG4uc2xpZGUtZmFkZS1sZWF2ZS10byB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgyMHB4KTtcbiAgb3BhY2l0eTogMDtcbn1cbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSJ9)

</div>
<div class="options-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2hvdzogdHJ1ZVxuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJzaG93ID0gIXNob3dcIj5Ub2dnbGUgU2xpZGUgKyBGYWRlPC9idXR0b24+XG4gIDxUcmFuc2l0aW9uIG5hbWU9XCJzbGlkZS1mYWRlXCI+XG4gICAgPHAgdi1pZj1cInNob3dcIj5oZWxsbzwvcD5cbiAgPC9UcmFuc2l0aW9uPlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuLnNsaWRlLWZhZGUtZW50ZXItYWN0aXZlIHtcbiAgdHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZS1vdXQ7XG59XG5cbi5zbGlkZS1mYWRlLWxlYXZlLWFjdGl2ZSB7XG4gIHRyYW5zaXRpb246IGFsbCAwLjhzIGN1YmljLWJlemllcigxLCAwLjUsIDAuOCwgMSk7XG59XG5cbi5zbGlkZS1mYWRlLWVudGVyLWZyb20sXG4uc2xpZGUtZmFkZS1sZWF2ZS10byB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgyMHB4KTtcbiAgb3BhY2l0eTogMDtcbn1cbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSJ9)

</div>

### Animations CSS {#css-animations}

[Les animations CSS natives](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Animations/Using_CSS_animations) sont appliquées de la même manière que les transitions CSS, à la différence que `*-enter-from` n'est pas supprimée immédiatement après l'insertion de l'élément, mais lors d'un événement `animationend`.

Pour la plupart des animations CSS, nous pouvons simplement les déclarer sous les classes `*-enter-active` et `*-leave-active`. Voici un exemple :

```vue-html
<Transition name="bounce">
  <p v-if="show" style="text-align: center;">
    Bonjour voici un texte plein d'entrain !
  </p>
</Transition>
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```

<CssAnimation />

<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eNqNkttO4zAQhl9lsLQqSOQAUm/SgNh9Bi5944ZJcEnGlj0JoKrvvuMkLNWuVK0Syafv/z0znqP66X0+jagqVccmWM8QkUf/qMkO3gWGIwRs4QRtcANsBN1o0tQ4ioK+und4SMA1hxFvNNXF4iJ6WTAOvjeMacX1fmR2BE9Nb5u3B61W9VUatXp8dl3XY10smEgA6udgKFq2IiMzoIj2bqQGBU/nQniYMtuublpB5M8+cYMJnaWMna/gvvQfO2D84Mz0tqMKGiTGsJttNKfvl6ODGwNMzjYWRppxBN+jJXjZCB+MzK7Wa4tUoTR+RygbdXGeMdVzMDLNl6iz+dbMNGwnhGMyMFJmk9QVrIxcUubbuNN0+hb2aCb8P6G8xoQh4mLw9IafbZDSxTNsNih/LCOAZEaxdWGoIDamx+vyRsQAIgfYXuDu8vvtGXpXXmL/gPJLl8yVUbdq6bJsMD4/REfSh7ODXg+iVtWXp1bSfWmt1Suzj1VRxLZJ3XuIuQtdIbM8jMR2wBzjkO2De48YxFir2zOPQjalRllAesGA4ZLnX+g/vl9JqdNvK7siSA==)

</div>
<div class="options-api">

[Essayer en ligne](https://sfc.vuejs.org/#eNqNUttO4zAQ/ZXB0mpBIheQ+pIGxO438OgXN50El8S2xpNQhPj3ndy6FUgVUhTP2OecuX6oPyGkQ4+qUGWsyAZ+1A6PwRPDHmvTtwwf2gHsDZvrm9kGIOSe3OoBxBf/VgBTj/PN53jIT74yO+mKw9iF1jCOHpe7ntk7eKpaW70+aDXKwANcjadWj8++aVossxkmFIDymYyLlq3QnOlQSDvfuwoFPocuAwyJrRc1rSDyezviOkONdQn7UMB9Ho5bYDxyYlrbuAIqdIy0PckA/PXu4HuCwdvKQu8mOEJo0TrY/xY8GbGulrBZmBPM/mcoF2V2XrErp2TETOeskylqYiq2A87tNM52ZmQXsGAkSJ5u4nZq50ps0Qz4M6JMa0CKOAs8veJ7TdK6eAabBPJf60ClMhdrT10BsTItXuc3Ql7GurmAu0vvN2fQu/wS9gSct2TqjLpVthu3L+lMSA/RO9nMSUEvD1GrYtXUSlZ39LV6YQ6xyLJYV+M+H2LqqcnESql3bDtMMXbJjvxbRBJhrW7PNDK5lB4lhG6PhHRJ8wv0m+5alPr8B7Z6JG8=)

</div>

### Classes de transition personnalisées {#custom-transition-classes}

Vous pouvez également spécifier des classes de transition personnalisées en transmettant les props suivantes à `<Transition>` :

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

Celles-ci remplaceront les noms de classes conventionnels. Ceci est particulièrement utile lorsque vous souhaitez combiner le système de transition de Vue avec une bibliothèque d'animation CSS existante, telle que [Animate.css](https://daneden.github.io/animate.css/) :

```vue-html
<!-- en supposant que Animate.css est inclus sur la page -->
<Transition
  name="custom-classes"
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounceOutRight"
>
  <p v-if="show">hello</p>
</Transition>
```

<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3Qgc2hvdyA9IHJlZih0cnVlKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJzaG93ID0gIXNob3dcIj5Ub2dnbGU8L2J1dHRvbj5cbiAgPFRyYW5zaXRpb25cbiAgICBuYW1lPVwiY3VzdG9tLWNsYXNzZXNcIlxuICAgIGVudGVyLWFjdGl2ZS1jbGFzcz1cImFuaW1hdGVfX2FuaW1hdGVkIGFuaW1hdGVfX3RhZGFcIlxuICAgIGxlYXZlLWFjdGl2ZS1jbGFzcz1cImFuaW1hdGVfX2FuaW1hdGVkIGFuaW1hdGVfX2JvdW5jZU91dFJpZ2h0XCJcbiAgPlxuICAgIDxwIHYtaWY9XCJzaG93XCI+aGVsbG88L3A+XG4gIDwvVHJhbnNpdGlvbj5cbjwvdGVtcGxhdGU+XG5cbjxzdHlsZT5cbkBpbXBvcnQgXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9hbmltYXRlLmNzcy80LjEuMS9hbmltYXRlLm1pbi5jc3NcIjtcbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSJ9)

</div>
<div class="options-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2hvdzogdHJ1ZVxuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJzaG93ID0gIXNob3dcIj5Ub2dnbGU8L2J1dHRvbj5cbiAgPFRyYW5zaXRpb25cbiAgICBuYW1lPVwiY3VzdG9tLWNsYXNzZXNcIlxuICAgIGVudGVyLWFjdGl2ZS1jbGFzcz1cImFuaW1hdGVfX2FuaW1hdGVkIGFuaW1hdGVfX3RhZGFcIlxuICAgIGxlYXZlLWFjdGl2ZS1jbGFzcz1cImFuaW1hdGVfX2FuaW1hdGVkIGFuaW1hdGVfX2JvdW5jZU91dFJpZ2h0XCJcbiAgPlxuICAgIDxwIHYtaWY9XCJzaG93XCI+aGVsbG88L3A+XG4gIDwvVHJhbnNpdGlvbj5cbjwvdGVtcGxhdGU+XG5cbjxzdHlsZT5cbkBpbXBvcnQgXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9hbmltYXRlLmNzcy80LjEuMS9hbmltYXRlLm1pbi5jc3NcIjtcbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSJ9)

</div>

### Utiliser les transitions et les animations ensemble {#using-transitions-and-animations-together}

Vue doit attacher des écouteurs d'événements afin de savoir quand une transition est terminée. Cela peut être `transitionend` ou `animationend`, selon le type de règles CSS appliquées. Si vous n'utilisez que l'un ou l'autre, Vue peut automatiquement détecter le bon type.

Cependant, dans certains cas, vous voudrez peut-être avoir les deux sur le même élément, par exemple avoir une animation CSS déclenchée par Vue, ainsi qu'un effet de transition CSS au survol. Dans ces cas, vous devrez déclarer explicitement le type dont vous voulez que Vue se soucie en passant la prop `type`, avec une valeur de `animation` ou `transition` :

```vue-html
<Transition type="animation">...</Transition>
```

### Transitions imbriquées et durées de transition explicites {#nested-transitions-and-explicit-transition-durations}

Bien que les classes de transition ne soient appliquées qu'à l'élément enfant direct dans `<Transition>`, nous pouvons effectuer la transition d'éléments imbriqués à l'aide de sélecteurs CSS imbriqués :

```vue-html
<Transition name="nested">
  <div v-if="show" class="outer">
    <div class="inner">
      Hello
    </div>
  </div>
</Transition>
```

```css
/* règles qui ciblent les éléments imbriqués */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}

/* ... autre CSS nécessaire omis */
```

Nous pouvons même ajouter un délai de transition à l'élément imbriqué lors de l'entrée, ce qui crée une séquence d'animation d'entrée décalée :

```css{3}
/* retarde l'entrée de l'élément imbriqué pour un effet décalé */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}
```

Cependant, cela crée un petit problème. Par défaut, le composant `<Transition>` tente de déterminer automatiquement quand la transition est terminée en écoutant le **premier** événement `transitionend` ou `animationend` sur l'élément de transition racine. Avec une transition imbriquée, le comportement souhaité doit attendre que les transitions de tous les éléments internes soient terminées.

Dans de tels cas, vous pouvez spécifier une durée de transition explicite (en millisecondes) à l'aide de la prop `duration` sur le composant `<Transition>`. La durée totale doit correspondre au délai plus la durée de transition de l'élément interne :

```vue-html
<Transition :duration="550">...</Transition>
```

<NestedTransitions />

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3Qgc2hvdyA9IHJlZih0cnVlKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJzaG93ID0gIXNob3dcIj5Ub2dnbGU8L2J1dHRvbj5cbiAgPFRyYW5zaXRpb24gZHVyYXRpb249XCI1NTBcIiBuYW1lPVwibmVzdGVkXCI+XG4gICAgPGRpdiB2LWlmPVwic2hvd1wiIGNsYXNzPVwib3V0ZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpbm5lclwiPlxuICAgXHRcdFx0SGVsbG9cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L1RyYW5zaXRpb24+XG48L3RlbXBsYXRlPlxuXG48c3R5bGU+XG4ub3V0ZXIsIC5pbm5lciB7XG5cdGJhY2tncm91bmQ6ICNlZWU7XG4gIHBhZGRpbmc6IDMwcHg7XG4gIG1pbi1oZWlnaHQ6IDEwMHB4O1xufVxuICBcbi5pbm5lciB7IFxuICBiYWNrZ3JvdW5kOiAjY2NjO1xufVxuICBcbi5uZXN0ZWQtZW50ZXItYWN0aXZlLCAubmVzdGVkLWxlYXZlLWFjdGl2ZSB7XG5cdHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2UtaW4tb3V0O1xufVxuLyogZGVsYXkgbGVhdmUgb2YgcGFyZW50IGVsZW1lbnQgKi9cbi5uZXN0ZWQtbGVhdmUtYWN0aXZlIHtcbiAgdHJhbnNpdGlvbi1kZWxheTogMC4yNXM7XG59XG5cbi5uZXN0ZWQtZW50ZXItZnJvbSxcbi5uZXN0ZWQtbGVhdmUtdG8ge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMzBweCk7XG4gIG9wYWNpdHk6IDA7XG59XG5cbi8qIHdlIGNhbiBhbHNvIHRyYW5zaXRpb24gbmVzdGVkIGVsZW1lbnRzIHVzaW5nIG5lc3RlZCBzZWxlY3RvcnMgKi9cbi5uZXN0ZWQtZW50ZXItYWN0aXZlIC5pbm5lcixcbi5uZXN0ZWQtbGVhdmUtYWN0aXZlIC5pbm5lciB7IFxuICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlLWluLW91dDtcbn1cbi8qIGRlbGF5IGVudGVyIG9mIG5lc3RlZCBlbGVtZW50ICovXG4ubmVzdGVkLWVudGVyLWFjdGl2ZSAuaW5uZXIge1xuXHR0cmFuc2l0aW9uLWRlbGF5OiAwLjI1cztcbn1cblxuLm5lc3RlZC1lbnRlci1mcm9tIC5pbm5lcixcbi5uZXN0ZWQtbGVhdmUtdG8gLmlubmVyIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDMwcHgpO1xuICAvKlxuICBcdEhhY2sgYXJvdW5kIGEgQ2hyb21lIDk2IGJ1ZyBpbiBoYW5kbGluZyBuZXN0ZWQgb3BhY2l0eSB0cmFuc2l0aW9ucy5cbiAgICBUaGlzIGlzIG5vdCBuZWVkZWQgaW4gb3RoZXIgYnJvd3NlcnMgb3IgQ2hyb21lIDk5KyB3aGVyZSB0aGUgYnVnXG4gICAgaGFzIGJlZW4gZml4ZWQuXG4gICovXG4gIG9wYWNpdHk6IDAuMDAxO1xufVxuPC9zdHlsZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

Si nécessaire, vous pouvez également spécifier des valeurs distinctes pour les durées d'entrée et de sortie à l'aide d'un objet :

```vue-html
<Transition :duration="{ enter: 500, leave: 800 }">...</Transition>
```

### Considérations relatives aux performances {#performance-considerations}

Vous remarquerez peut-être que les animations présentées ci-dessus utilisent principalement des propriétés telles que "transform" et "opacity". Ces propriétés sont efficaces pour animer car :

1. Elles n'affectent pas la mise en page du document pendant l'animation, elles ne déclenchent donc pas de calculs de mise en page CSS coûteux sur chaque image d'animation.

2. La plupart des navigateurs modernes peuvent tirer parti de l'accélération matérielle GPU lors de l'animation de `transform`.

En comparaison, des propriétés telles que `height` ou `margin` déclencheront la mise en page CSS, elles sont donc beaucoup plus coûteuses à animer et doivent être utilisées avec prudence. Nous pouvons consulter des ressources comme [CSS-Triggers](https://csstriggers.com/) pour voir quelles propriétés déclencheront la mise en page si nous les animons.

## Hooks JavaScript {#javascript-hooks}

Vous pouvez vous connecter au processus de transition avec JavaScript en écoutant les événements sur le composant `<Transition>` :

```html
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

<div class="composition-api">

```js
// appelée avant que l'élément ne soit inséré dans le DOM.
// utilisez ceci pour définir l'état "enter-from" de l'élément.
function onBeforeEnter(el) {}

// appelée une frame après l'insertion de l'élément.
// utilisez ceci pour démarrer l'animation d'entrée.
function onEnter(el, done) {
  // appelle la fonction de rappel done pour indiquer la fin de la transition
  // facultative si utilisée en combinaison avec CSS
  done()
}

// appelée lorsque la transition enter est terminée.
function onAfterEnter(el) {}
function onEnterCancelled(el) {}

// appelée avant le hook de congé.
// la plupart du temps, vous devez simplement utiliser le hook de sortie.
function onBeforeLeave(el) {}

// appelée lorsque la transition de sortie démarre.
// utilisez ceci pour démarrer l'animation de sortie.
function onLeave(el, done) {
  // appelle la fonction de rappel done pour indiquer la fin de la transition
  // facultative si utilisée en combinaison avec CSS
  done()
}

// appelée lorsque la transition de sortie est terminée et que
// l'élément a été supprimé du DOM.
function onAfterLeave(el) {}

// uniquement disponible avec les transitions v-show
function onLeaveCancelled(el) {}
```

</div>
<div class="options-api">

```js
export default {
  // ...
  methods: {
    // appelée avant que l'élément ne soit inséré dans le DOM.
    // utilisez ceci pour définir l'état "enter-from" de l'élément
    onBeforeEnter(el) {},

    // appelée une frame après l'insertion de l'élément.
    // utilisez ceci pour démarrer l'animation d'entrée.
    onEnter(el, done) {
      // appelle la fonction de rappel done pour indiquer la fin de la transition.
      // facultative si utilisée en combinaison avec CSS
      done()
    },

    // appelée lorsque la transition enter est terminée.
    onAfterEnter(el) {},
    onEnterCancelled(el) {},

    // appelée avant le hook de sortie.
    // la plupart du temps, vous devez simplement utiliser le hook de sortie.
    onBeforeLeave(el) {},

    // appelée lorsque la transition de sortie démarre.
    // utilisez ceci pour démarrer l'animation de sortie.
    onLeave(el, done) {
      // appelle la fonction de rappel done pour indiquer la fin de la transition
      // facultative si utilisée en combinaison avec CSS
      done()
    },

    // appelée lorsque la transition de sortie est terminée et que
    // l'élément a été supprimé du DOM.
    onAfterLeave(el) {},

    // uniquement disponible avec les transitions v-show
    onLeaveCancelled(el) {}
  }
}
```

</div>

Ces hooks peuvent être utilisés en combinaison avec des transitions / animations CSS ou seuls.

Lors de l'utilisation de transitions JavaScript uniquement, il est généralement judicieux d'ajouter la prop `:css="false"`. Cela indique explicitement à Vue d'ignorer la détection automatique des transitions CSS. En plus d'être légèrement plus performant, cela empêche également les règles CSS d'interférer accidentellement avec la transition :

```vue-html{3}
<Transition
  ...
  :css="false"
>
  ...
</Transition>
```

Avec `:css="false"`, nous sommes également entièrement responsables du contrôle de la fin de la transition. Dans ce cas, les rappels `done` sont requis pour les hooks `@enter` et `@leave`. Sinon, les hooks seront appelés de manière synchrone et la transition se terminera immédiatement.

Voici une démo utilisant la [bibliothèque GreenSock](https://greensock.com/) pour réaliser les animations. Vous pouvez bien sûr utiliser toute autre bibliothèque d'animation de votre choix, par exemple [Anime.js](https://animejs.com/) ou [Motion One](https://motion.dev/).

<JsHooks />

<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBnc2FwIGZyb20gJ2dzYXAnXG5cbmNvbnN0IHNob3cgPSByZWYodHJ1ZSlcblxuZnVuY3Rpb24gb25CZWZvcmVFbnRlcihlbCkge1xuICBnc2FwLnNldChlbCwge1xuICAgIHNjYWxlWDogMC4yNSxcbiAgICBzY2FsZVk6IDAuMjUsXG4gICAgb3BhY2l0eTogMVxuICB9KVxufVxuICBcbmZ1bmN0aW9uIG9uRW50ZXIoZWwsIGRvbmUpIHtcbiAgZ3NhcC50byhlbCwge1xuICAgIGR1cmF0aW9uOiAxLFxuICAgIHNjYWxlWDogMSxcbiAgICBzY2FsZVk6IDEsXG4gICAgb3BhY2l0eTogMSxcbiAgICBlYXNlOiAnZWxhc3RpYy5pbk91dCgyLjUsIDEpJyxcbiAgICBvbkNvbXBsZXRlOiBkb25lXG4gIH0pXG59XG5cbmZ1bmN0aW9uIG9uTGVhdmUoZWwsIGRvbmUpIHtcblx0Z3NhcC50byhlbCwge1xuICAgIGR1cmF0aW9uOiAwLjcsXG4gICAgc2NhbGVYOiAxLFxuICAgIHNjYWxlWTogMSxcbiAgICB4OiAzMDAsXG4gICAgZWFzZTogJ2VsYXN0aWMuaW5PdXQoMi41LCAxKSdcbiAgfSlcbiAgZ3NhcC50byhlbCwge1xuICAgIGR1cmF0aW9uOiAwLjIsXG4gICAgZGVsYXk6IDAuNSxcbiAgICBvcGFjaXR5OiAwLFxuICAgIG9uQ29tcGxldGU6IGRvbmVcbiAgfSlcbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxidXR0b24gQGNsaWNrPVwic2hvdyA9ICFzaG93XCI+VG9nZ2xlPC9idXR0b24+XG5cbiAgPFRyYW5zaXRpb25cbiAgICBAYmVmb3JlLWVudGVyPVwib25CZWZvcmVFbnRlclwiXG4gICAgQGVudGVyPVwib25FbnRlclwiXG4gICAgQGxlYXZlPVwib25MZWF2ZVwiXG4gICAgOmNzcz1cImZhbHNlXCJcbiAgPlxuICAgIDxkaXYgY2xhc3M9XCJnc2FwLWJveFwiIHYtaWY9XCJzaG93XCI+PC9kaXY+XG4gIDwvVHJhbnNpdGlvbj5cbjwvdGVtcGxhdGU+XG5cbjxzdHlsZT5cbi5nc2FwLWJveCB7XG4gIGJhY2tncm91bmQ6ICM0MmI4ODM7XG4gIG1hcmdpbi10b3A6IDIwcHg7XG4gIHdpZHRoOiAzMHB4O1xuICBoZWlnaHQ6IDMwcHg7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbn1cbjwvc3R5bGU+XG4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJnc2FwXCI6IFwiaHR0cHM6Ly91bnBrZy5jb20vZ3NhcD9tb2R1bGVcIixcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBnc2FwIGZyb20gJ2dzYXAnXG4gIFxuZXhwb3J0IGRlZmF1bHQge1xuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzaG93OiB0cnVlXG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG5cdFx0b25CZWZvcmVFbnRlcixcbiAgICBvbkVudGVyLFxuICAgIG9uTGVhdmVcbiAgfVxufVxuXG5mdW5jdGlvbiBvbkJlZm9yZUVudGVyKGVsKSB7XG4gIGdzYXAuc2V0KGVsLCB7XG4gICAgc2NhbGVYOiAwLjI1LFxuICAgIHNjYWxlWTogMC4yNSxcbiAgICBvcGFjaXR5OiAxXG4gIH0pXG59XG4gIFxuZnVuY3Rpb24gb25FbnRlcihlbCwgZG9uZSkge1xuICBnc2FwLnRvKGVsLCB7XG4gICAgZHVyYXRpb246IDEsXG4gICAgc2NhbGVYOiAxLFxuICAgIHNjYWxlWTogMSxcbiAgICBvcGFjaXR5OiAxLFxuICAgIGVhc2U6ICdlbGFzdGljLmluT3V0KDIuNSwgMSknLFxuICAgIG9uQ29tcGxldGU6IGRvbmVcbiAgfSlcbn1cblxuZnVuY3Rpb24gb25MZWF2ZShlbCwgZG9uZSkge1xuXHRnc2FwLnRvKGVsLCB7XG4gICAgZHVyYXRpb246IDAuNyxcbiAgICBzY2FsZVg6IDEsXG4gICAgc2NhbGVZOiAxLFxuICAgIHg6IDMwMCxcbiAgICBlYXNlOiAnZWxhc3RpYy5pbk91dCgyLjUsIDEpJ1xuICB9KVxuICBnc2FwLnRvKGVsLCB7XG4gICAgZHVyYXRpb246IDAuMixcbiAgICBkZWxheTogMC41LFxuICAgIG9wYWNpdHk6IDAsXG4gICAgb25Db21wbGV0ZTogZG9uZVxuICB9KVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJzaG93ID0gIXNob3dcIj5Ub2dnbGU8L2J1dHRvbj5cblxuICA8VHJhbnNpdGlvblxuICAgIEBiZWZvcmUtZW50ZXI9XCJvbkJlZm9yZUVudGVyXCJcbiAgICBAZW50ZXI9XCJvbkVudGVyXCJcbiAgICBAbGVhdmU9XCJvbkxlYXZlXCJcbiAgICA6Y3NzPVwiZmFsc2VcIlxuICA+XG4gICAgPGRpdiBjbGFzcz1cImdzYXAtYm94XCIgdi1pZj1cInNob3dcIj48L2Rpdj5cbiAgPC9UcmFuc2l0aW9uPlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuLmdzYXAtYm94IHtcbiAgYmFja2dyb3VuZDogIzQyYjg4MztcbiAgbWFyZ2luLXRvcDogMjBweDtcbiAgd2lkdGg6IDMwcHg7XG4gIGhlaWdodDogMzBweDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xufVxuPC9zdHlsZT5cbiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcImdzYXBcIjogXCJodHRwczovL3VucGtnLmNvbS9nc2FwP21vZHVsZVwiLFxuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSJ9)

</div>

## Réutiliser les transitions {#reusable-transitions}

Les transitions peuvent être réutilisées via le système de composants de Vue. Pour créer une transition réutilisable, nous pouvons créer un composant qui encapsule le composant `<Transition>` et transmet le contenu de l'emplacement :

```vue{5}
<!-- MyTransition.vue -->
<script>
// Logique du hook JavaScript...
</script>

<template>
  <!-- envelopper le composant de transition natif -->
  <Transition
    name="my-transition"
    @enter="onEnter"
    @leave="onLeave">
    <slot></slot> <!-- passer le contenu du slot -->
  </Transition>
</template>

<style>
/*
  CSS nécessaire...
  Remarque : évitez d'utiliser <style scoped> ici car il
  ne s'applique pas au contenu des slots.
*/
</style>
```

Désormais, `MyTransition` peut être importé et utilisé comme la version native :

```vue-html
<MyTransition>
  <div v-if="show">Hello</div>
</MyTransition>
```

## Transition à l'apparition {#transition-on-appear}

Si vous souhaitez également appliquer une transition sur le rendu initial d'un nœud, vous pouvez ajouter la prop `appear` :

```vue-html
<Transition appear>
  ...
</Transition>
```

## Transition entre élements {#transition-between-elements}

En plus de basculer un élément avec `v-if` /`v-show`, nous pouvons également faire la transition entre deux éléments en utilisant `v-if` /`v-else` /`v-else-if`, tant que nous nous assurons qu'un seul élément est affiché à tout moment :

```vue-html
<Transition>
  <button v-if="docState === 'saved'">Editer</button>
  <button v-else-if="docState === 'edited'">Enregistrer</button>
  <button v-else-if="docState === 'editing'">Annuler</button>
</Transition>
```

<BetweenElements />

[Essayer en ligne](https://sfc.vuejs.org/#eNqdlNtu1DAQhl9llJttpSYpRdyE7IoK8QRwg5QbbzLZunVs45kslGofqM/RF2Ps7KlsQYXcxIff3+8Zj/2QXXtfrEfMqqymNmjPQMijXzRWD94FhgcI2MMG+uAGmIl01tjGts4SQ+faz6wYYR5FZzNSa+xm542tywkmGOkwDt6ILPa4Jq8sEN8bnDfZoMJK2zzo1Q1XcHXpfzTZ4qPR30b8Cd6NAbwKrfx1AIMEne77p8eAlgmeHsWboBIzQQocoO70GlqjiIS9ZJvLPllpi0Gw0V38vwRlSbN2Fqwa4ibI6A7z0ScNpK9ejsyiWOe6F8Uh0PkctmE22U68+z60Rrd3z+Qww05zUi8+xVaoywn9ghUawpf89ohXG2q7So424EoTh/+2nUCv8t1lZXFt7WhOHOvykPjprEo5LGnV5XF92DqVhjSLZ+cHD3FNp0mU9xVoa2Q0XxrX3r2PM95N6EoqUVh6jWn4BqfKeoOD9DfRYBt34h1WqSU5M3JclVTFrihyqTUMuWoj8+J4wqBEvJ2YcLyPUIDGwGVx9Y4AleTXjfwndLpZab3zqtUs4V2mzSdc78JQTc2Yo69nb+WSnJ+ypt2w+wdSfoSSS5Tynl1k08XPB+WLW3JWnoaEbLYT1GTVZBLH5EGI/Sa7YfZUlSX1bXxQbqlwYVVKqwijZT1ggTTky+C+EwYBN5kkc88oZXAtuZCb3aGU69+Yv0lPuBErEW2yzS9gmqtS)

## Modes des transitions {#transition-modes}

Dans l'exemple précédent, les éléments d'entrée et de sortie sont animés en même temps, et nous avons dû les appliquer `position: absolute` pour éviter le problème de mise en page lorsque les deux éléments sont présents dans le DOM.

Cependant, dans certains cas, ce n'est pas une option, ou ce n'est tout simplement pas le comportement souhaité. Nous pouvons vouloir que l'élément sortant soit animé en premier, et que l'élément entrant ne soit inséré **qu'après** que l'animation de départ soit terminée. Orchestrer manuellement de telles animations serait très compliqué - heureusement, nous pouvons activer ce comportement en passant à `<Transition>` la prop `mode` :

```vue-html
<Transition mode="out-in">
  ...
</Transition>
```

Voici la démo précédente avec `mode="out-in"` :

<BetweenElements mode="out-in" />

`<Transition>` prend également en charge `mode="in-out"`, bien qu'il soit beaucoup moins fréquemment utilisé.

## Transition entre composants {#transition-between-components}

`<Transition>` peut également être utilisé autour des [composants dynamiques](/guide/essentials/component-basics#dynamic-components) :

```vue-html
<Transition name="fade" mode="out-in">
  <component :is="activeComponent"></component>
</Transition>
```

<BetweenComponents />

<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHNoYWxsb3dSZWYgfSBmcm9tICd2dWUnXG5pbXBvcnQgQ29tcEEgZnJvbSAnLi9Db21wQS52dWUnXG5pbXBvcnQgQ29tcEIgZnJvbSAnLi9Db21wQi52dWUnXG5cbi8vIHVzZSBzaGFsbG93UmVmIHRvIGF2b2lkIGNvbXBvbmVudCBiZWluZyBkZWVwbHkgb2JzZXJ2ZWRcbmNvbnN0IGFjdGl2ZUNvbXBvbmVudCA9IHNoYWxsb3dSZWYoQ29tcEEpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8bGFiZWw+XG4gICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIHYtbW9kZWw9XCJhY3RpdmVDb21wb25lbnRcIiA6dmFsdWU9XCJDb21wQVwiPiBBXG4gIDwvbGFiZWw+XG4gIDxsYWJlbD5cbiAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgdi1tb2RlbD1cImFjdGl2ZUNvbXBvbmVudFwiIDp2YWx1ZT1cIkNvbXBCXCI+IEJcbiAgPC9sYWJlbD5cbiAgPFRyYW5zaXRpb24gbmFtZT1cImZhZGVcIiBtb2RlPVwib3V0LWluXCI+XG4gICAgPGNvbXBvbmVudCA6aXM9XCJhY3RpdmVDb21wb25lbnRcIj48L2NvbXBvbmVudD5cbiAgPC9UcmFuc2l0aW9uPlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuLmZhZGUtZW50ZXItYWN0aXZlLFxuLmZhZGUtbGVhdmUtYWN0aXZlIHtcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzIGVhc2U7XG59XG5cbi5mYWRlLWVudGVyLWZyb20sXG4uZmFkZS1sZWF2ZS10byB7XG4gIG9wYWNpdHk6IDA7XG59XG48L3N0eWxlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJDb21wQS52dWUiOiI8dGVtcGxhdGU+XG4gIDxkaXY+XG4gICAgQ29tcG9uZW50IEFcbiAgPC9kaXY+XG48L3RlbXBsYXRlPiIsIkNvbXBCLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGRpdj5cbiAgICBDb21wb25lbnQgQlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+In0=)

</div>
<div class="options-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBDb21wQSBmcm9tICcuL0NvbXBBLnZ1ZSdcbmltcG9ydCBDb21wQiBmcm9tICcuL0NvbXBCLnZ1ZSdcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21wb25lbnRzOiB7IENvbXBBLCBDb21wQiB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY3RpdmVDb21wb25lbnQ6ICdDb21wQSdcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxsYWJlbD5cbiAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgdi1tb2RlbD1cImFjdGl2ZUNvbXBvbmVudFwiIHZhbHVlPVwiQ29tcEFcIj4gQVxuICA8L2xhYmVsPlxuICA8bGFiZWw+XG4gICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIHYtbW9kZWw9XCJhY3RpdmVDb21wb25lbnRcIiB2YWx1ZT1cIkNvbXBCXCI+IEJcbiAgPC9sYWJlbD5cbiAgPFRyYW5zaXRpb24gbmFtZT1cImZhZGVcIiBtb2RlPVwib3V0LWluXCI+XG4gICAgPGNvbXBvbmVudCA6aXM9XCJhY3RpdmVDb21wb25lbnRcIj48L2NvbXBvbmVudD5cbiAgPC9UcmFuc2l0aW9uPlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuLmZhZGUtZW50ZXItYWN0aXZlLFxuLmZhZGUtbGVhdmUtYWN0aXZlIHtcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzIGVhc2U7XG59XG5cbi5mYWRlLWVudGVyLWZyb20sXG4uZmFkZS1sZWF2ZS10byB7XG4gIG9wYWNpdHk6IDA7XG59XG48L3N0eWxlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJDb21wQS52dWUiOiI8dGVtcGxhdGU+XG4gIDxkaXY+XG4gICAgQ29tcG9uZW50IEFcbiAgPC9kaXY+XG48L3RlbXBsYXRlPiIsIkNvbXBCLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGRpdj5cbiAgICBDb21wb25lbnQgQlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+In0=)

</div>

## Transitions dynamiques {#dynamic-transitions}

Les props de `<Transition>` comme `name` peuvent aussi être dynamiques ! Il nous permet d'appliquer dynamiquement différentes transitions en fonction du changement d'état :

```vue-html
<Transition :name="transitionName">
  <!-- ... -->
</Transition>
```

Cela peut être utile lorsque vous avez défini des transitions/animations CSS à l'aide des conventions de classes de transition de Vue et que vous souhaitez basculer entre elles.

Vous pouvez également appliquer un comportement différent avec les hooks de transition JavaScript en fonction de l'état actuel de votre composant. Enfin, le moyen ultime de créer des transitions dynamiques consiste à utiliser des [composants de transition réutilisables](#reusable-transitions) qui acceptent des props pour modifier la nature de la ou des transitions à utiliser. Cela peut sembler ringard, mais la seule limite est vraiment votre imagination.

---

**Référence**

- [`<Transition>` API](/api/built-in-components#transition)
