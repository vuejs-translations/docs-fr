# Gestion d'événement {#event-handling}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/user-events-in-vue-3" title="Free Vue.js Events Lesson"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-user-events-in-vue-3" title="Free Vue.js Events Lesson"/>
</div>

## Écouter des événements {#listening-to-events}

Nous pouvons utiliser la directive `v-on`, que nous raccourcissons généralement par le symbole `@`, pour écouter les événements DOM et exécuter du JavaScript lorsqu'ils sont déclenchés. L'utilisation serait alors `v-on:click="handler"` ou avec le raccourci, `@click="handler"`.

La valeur du gestionnaire peut alors prendre l'une des formes suivantes :

1. **Gestionnaires en ligne:** Du JavaScript inline qui sera exécuté lorsque l'événement sera déclenché (similaire à l'attribut natif `onclick`).

2. **Méthodes gestionnaires:** Un nom ou un chemin de propriété qui pointe vers une méthode définie sur le composant.

## Gestionnaires en ligne {#inline-handlers}

Les gestionnaires inline sont généralement utilisés dans des cas simples, par exemple :

<div class="composition-api">

```js
const count = ref(0)
```

</div>
<div class="options-api">

```js
data() {
  return {
    count: 0
  }
}
```

</div>

```vue-html
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```

<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgY291bnRlciA9IHJlZigwKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJjb3VudGVyKytcIj5BZGQgMTwvYnV0dG9uPlxuXHQ8cD5UaGUgYnV0dG9uIGFib3ZlIGhhcyBiZWVuIGNsaWNrZWQge3sgY291bnRlciB9fSB0aW1lcy48L3A+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcblx0ICByZXR1cm4ge1xuICAgIFx0Y291bnRlcjogMFxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJjb3VudGVyKytcIj5BZGQgMTwvYnV0dG9uPlxuXHQ8cD5UaGUgYnV0dG9uIGFib3ZlIGhhcyBiZWVuIGNsaWNrZWQge3sgY291bnRlciB9fSB0aW1lcy48L3A+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>

## Méthodes gestionnaires {#method-handlers}

Cependant, pour de nombreux gestionnaires d'événements, la logique sera plus complexe et ne sera probablement pas réalisable avec des gestionnaires en ligne. C'est pourquoi `v-on` peut également accepter le nom ou le chemin d'une méthode de composant que vous souhaitez appeler.

Par exemple :

<div class="composition-api">

```js
const name = ref('Vue.js')

function greet(event) {
  alert(`Hello ${name.value}!`)
  // `event` est l'événement natif du DOM
  if (event) {
    alert(event.target.tagName)
  }
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    name: 'Vue.js'
  }
},
methods: {
  greet(event) {
    // `this` à l'intérieur des méthodes pointe sur l'instance actuellement active
    alert(`Hello ${this.name}!`)
    // `event` est l'événement natif du DOM
    if (event) {
      alert(event.target.tagName)
    }
  }
}
```

</div>

```vue-html
<!-- `greet` est le nom de la méthode définie plus haut -->
<button @click="greet">Greet</button>
```

<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgbmFtZSA9IHJlZignVnVlLmpzJylcblxuZnVuY3Rpb24gZ3JlZXQoZXZlbnQpIHtcbiAgYWxlcnQoYEhlbGxvICR7bmFtZS52YWx1ZX0hYClcbiAgLy8gYGV2ZW50YCBpcyB0aGUgbmF0aXZlIERPTSBldmVudFxuICBpZiAoZXZlbnQpIHtcbiAgICBhbGVydChldmVudC50YXJnZXQudGFnTmFtZSlcbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJncmVldFwiPkdyZWV0PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1Z1ZS5qcydcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBncmVldChldmVudCkge1xuICAgICAgLy8gYHRoaXNgIGluc2lkZSBtZXRob2RzIHBvaW50cyB0byB0aGUgY3VycmVudCBhY3RpdmUgaW5zdGFuY2VcbiAgICAgIGFsZXJ0KGBIZWxsbyAke3RoaXMubmFtZX0hYClcbiAgICAgIC8vIGBldmVudGAgaXMgdGhlIG5hdGl2ZSBET00gZXZlbnRcbiAgICAgIGlmIChldmVudCkge1xuICAgICAgICBhbGVydChldmVudC50YXJnZXQudGFnTmFtZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxidXR0b24gQGNsaWNrPVwiZ3JlZXRcIj5HcmVldDwvYnV0dG9uPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

Une méthode gestionnaire reçoit automatiquement l'objet événement natif du DOM qui la déclenche - dans l'exemple ci-dessus, nous pouvons accéder à l'élément qui envoie l'événement via `event.target.tagName`.

<div class="composition-api">

Voir aussi : [Typer les gestionnaires d'événements](/guide/typescript/composition-api.html#typing-event-handlers) <sup class="vt-badge ts" />

</div>
<div class="options-api">

Voir aussi : [Typing Event Handlers](/guide/typescript/options-api.html#typing-event-handlers) <sup class="vt-badge ts" />

</div>

### Méthodes vs. Détection en ligne {#method-vs-inline-detection}

Le compilateur de templates détecte les méthodes gestionnaires en vérifiant si la valeur en chaîne de caractères `v-on` est un identifiant JavaScript ou un chemin d'accès de propriété valide. Par exemple, `foo`, `foo.bar` et `foo['bar']` sont traités comme des méthodes gestionnaires, tandis que `foo()` et `count++` sont traités comme des gestionnaires en ligne.

## Appeler des méthodes dans les gestionnaires en ligne {#calling-methods-in-inline-handlers}

Au lieu de se lier directement à un nom de méthode, nous pouvons également appeler des méthodes dans un gestionnaire en ligne. Cela nous permet de passer à la méthode des arguments personnalisés au lieu de l'événement natif :

<div class="composition-api">

```js
function say(message) {
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  say(message) {
    alert(message)
  }
}
```

</div>

```vue-html
<button @click="say('hello')">Say hello</button>
<button @click="say('bye')">Say bye</button>
```

<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eNp9kN1uwjAMhV8l8g1Dos191aHtGXabm7QzUNb8yHaYKtR3X0KnCoHEnY/j88XHV/iMsb4khAZa7mmIohglxb3xh+R7GYJXbKc3h8z2iFt1NV4pOyLJ2jN+Nr7Viz0bsxB0cbSCRUnbJZHM+ejHof95N1CAmxOOY9hsDey/7KRuqtXL5AtXN+HqyfWdo9Xrp7CDwcVAUjkb6zMHn+PdFjf/D2ygWaKUXs5ftIGTSORGaz705ShnrgMdda5qSl4GhzWyqzoKv4yUwQZ2dwydmxekitB/IyG9Yj6MPnELNl91hvkPugmTrw==)

</div>
<div class="options-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbWV0aG9kczoge1xuXHQgIHNheShtZXNzYWdlKSB7XG4gICAgXHRhbGVydChtZXNzYWdlKVxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJzYXkoJ2hpJylcIj5TYXkgaGk8L2J1dHRvbj5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJzYXkoJ3doYXQnKVwiPlNheSB3aGF0PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>

## Accéder à l'argument de l'événement dans les gestionnaires en ligne {#accessing-event-argument-in-inline-handlers}

Parfois, nous avons aussi besoin d'accéder à l'événement original du DOM dans un gestionnaire en ligne. Vous pouvez le passer dans une méthode en utilisant la variable spéciale `$event`, ou utiliser une fonction fléchée en ligne :

```vue-html
<!-- en utilisant la variable spéciale $event  -->
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- en utilisant une fonction fléchée en ligne -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

<div class="composition-api">

```js
function warn(message, event) {
  // nous avons maintenant accès à l'événement natif
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  warn(message, event) {
    // nous avons maintenant accès à l'événement natif
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

</div>

## Modificateurs d'événements {#event-modifiers}

Il est courant d'avoir besoin d'appeler `event.preventDefault()` ou `event.stopPropagation()` à l'intérieur des gestionnaires d'événements. Bien que nous puissions le faire facilement à l'intérieur des méthodes, il serait préférable que les méthodes puissent se focaliser exclusivement sur la logique des données plutôt qu'avoir à gérer les détails des événements du DOM.

Pour résoudre ce problème, Vue fournit des **modificateurs d'événements** pour `v-on`. Rappelons que les modificateurs sont des postfixes de directives désignés par un point.

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```vue-html
<!-- la propagation de l'événement clic va être arrêtée -->
<a @click.stop="doThis"></a>

<!-- l'événement submit ne va plus rafraîchir la page -->
<form @submit.prevent="onSubmit"></form>

<!-- les modificateurs peuvent être chaînés -->
<a @click.stop.prevent="doThat"></a>

<!-- seulement le modificateur -->
<form @submit.prevent></form>

<!-- ne déclenche le gestionnaire que si event.target est l'élément lui-même. -->
<!-- par exemple pas depuis un élément enfant -->
<div @click.self="doThat">...</div>
```

::: tip
L'ordre est important lorsqu'on utilise des modificateurs car le code correspondant est généré dans le même ordre. De ce fait, utiliser `@click.prevent.self` empêchera **l'action par défaut du clic sur l'élément lui-même et ses enfants**, alors que `@click.self.prevent` empêchera seulement l'action par défaut de click sur l'élément lui-même.
:::

Les modificateurs `.capture`, `.once`, et `.passive` imitent les [options de la méthode native `addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options):

```vue-html
<!-- utiliser le mode capture lorsque vous ajoutez l'écouteur d'événements -->
<!-- par exemple un événement visant un élément intérieur est traité ici avant d'être traité par cet élément -->
<div @click.capture="doThis">...</div>

<!-- l'événement clic sera déclenché au maximum une fois -->
<a @click.once="doThis"></a>

<!-- le comportement par défaut de l'élément de défilement (scrolling) aura lieu -->
<!-- immédiatement, au lieu d'attendre la fin de `onScroll`  -->
<!-- s'il contient `event.preventDefault()`                -->
<div @scroll.passive="onScroll">...</div>
```

Le modificateur `.passive` est généralement utilisé avec les écouteurs d'événements de touche pour [améliorer les performances sur les périphériques mobiles](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners).

::: tip
N'utilisez pas `.passive` et `.prevent` ensemble, car `.passive` indique déjà au navigateur que vous n'avez _pas_ l'intention d'empêcher le comportement par défaut de l'événement, et vous aurez probablement un avertissement du navigateur si vous le faites.
:::

## Modificateurs de touche {#key-modifiers}

Lorsque nous écoutons des événements du clavier, nous avons souvent besoin de vérifier des touches spécifiques. Vue permet d'ajouter des modificateurs de touches pour `v-on` ou `@` lors de l'écoute d'événements du clavier :

```vue-html
<!-- appelle `submit` seulement lorsque `key` est `Enter` -->
<input @keyup.enter="submit" />
```

Vous pouvez utiliser directement n'importe quel nom de touche exposé via [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) comme des modificateurs en les convertissant en kebab-case.

```vue-html
<input @keyup.page-down="onPageDown" />
```

Dans l'exemple ci-dessus, le gestionnaire ne sera appelé que si `$event.key` est égal à `'PageDown'`.

### Alias de touche {#key-aliases}

Vue fournit des alias pour les touches les plus couramment utilisées :

- `.enter`
- `.tab`
- `.delete` (capture à la fois les touches "Delete" et "Backspace")
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### Touches de modification du système {#system-modifier-keys}

Vous pouvez utiliser les modificateurs suivant pour déclencher des écouteurs d'événements de la souris ou du clavier seulement lorsque la touche modificatrice correspondante est pressée :

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

::: tip Note
Sur les claviers Macintosh, meta est la touche commande (⌘). Sur les claviers Windows, meta est la touche Windows (⊞). Sur les claviers Sun Microsystems, meta est marqué d'un diamant solide (◆). Sur certains claviers, en particulier les claviers MIT et ceux des machines Lisp et leurs successeurs, tels que le clavier Knight, le clavier space-cadet, meta est étiqueté "META". Sur les claviers Symbolics, meta est étiqueté "META" ou "Meta".
:::

Par exemple :

```vue-html
<!-- Alt + Entrée -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Clic -->
<div @click.ctrl="doSomething">Do something</div>
```

::: tip
Notez que les touches modificatrices sont différentes des touches normales et que lorsqu'elles sont utilisées avec des événements `keyup`, elles doivent être appuyées lorsque l'événement est émis. En d'autres termes, `keyup.ctrl` ne se déclenchera que si vous relâchez une touche tout en maintenant la touche `ctrl` enfoncée. Il ne se déclenchera pas si vous relâchez la touche `ctrl` seulement.
:::

### Modificateur `.exact` {#exact-modifier}

Le modificateur `.exact` permet le contrôle de la combinaison exacte de touches de modification du système requise pour déclencher un événement.

```vue-html
<!-- l'événement sera déclenché même si Alt ou Maj est également pressée -->
<button @click.ctrl="onClick">A</button>

<!-- l'événement ne sera déclenché que quand Ctrl est enfoncé sans autres touches -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- l'événement ne sera déclenché que lorsqu'aucune touche de modification du système n'est pressée -->
<button @click.exact="onClick">A</button>
```

## Modificateurs des boutons de la souris {#mouse-button-modifiers}

- `.left`
- `.right`
- `.middle`

Ces modificateurs limitent le gestionnaire aux événements déclenchés par un bouton spécifique de la souris.
