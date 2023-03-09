# Gestion d'état {#state-management}

## Qu'est-ce que la gestion d'état ? {#what-is-state-management}

Techniquement, chaque instance de composant Vue "gère" déjà son propre état réactif. Prenons l'exemple d'un simple composant compteur :

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

// état
const count = ref(0)

// actions
function increment() {
  count.value++
}
</script>

<!-- vue -->
<template>{{ count }}</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  // état
  data() {
    return {
      count: 0
    }
  },
  // actions
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<!-- vue -->
<template>{{ count }}</template>
```

</div>

Il s'agit d'une unité autonome composée de la manière suivante :

- L'**état**, la source de vérité qui dirige notre application;
- La **vue**, une cartographie déclarative de l'**état**;
- Les **actions**, les différentes manières dont l'état pourrait changer, en réaction aux entrées de l'utilisateur dans la **vue**.

C'est une représentation simple du concept de "flux de données à sens unique" :

<p style="text-align: center">
  <img alt="state flow diagram" src="./images/state-flow.png" width="252px" style="margin: 40px auto">
</p>

Toutefois, la simplicité commence à disparaître lorsque nous avons **plusieurs composants qui partagent un état commun** :

1. Plusieurs vues peuvent dépendre de la même partie d'un état.
2. Les actions de différentes vues peuvent avoir besoin de muter la même partie d'un état.

Dans le premier cas, une solution possible consiste à "élever" l'état partagé jusqu'à un composant ancêtre commun, puis à le transmettre en tant que props. Cependant, cela devient rapidement fastidieux dans les arbres de composants avec des hiérarchies profondes, conduisant à un autre problème connu sous le nom de [Prop Drilling](/guide/components/provide-inject#prop-drilling).

Dans le deuxième cas, nous nous retrouvons souvent à utiliser des solutions telles que l'atteinte d'instances directes parent/enfant par le biais des refs de template, ou à essayer de modifier et de synchroniser plusieurs copies de l'état par le biais d'événements émis. Ces deux modèles sont fragiles et conduisent rapidement à un code non maintenable.

Une solution plus simple et plus directe consiste à extraire l'état partagé des composants, et à le gérer dans un singleton global. Ainsi, notre arbre de composants devient une grande "vue", et n'importe quel composant peut accéder à l'état ou déclencher des actions, peut importe où il se trouve dans l'arbre !

## Gestion d'état simple avec l'API de réactivité {#simple-state-management-with-reactivity-api}

<div class="options-api">

Dans l'Options API, les données réactives sont déclarées via l'option `data()`. En interne, l'objet renvoyé par `data()` est rendu réactif via la fonction [`reactive()`](/api/reactivity-core#reactive), qui est également disponible en tant qu'API publique.

</div>

If you have a piece of state that should be shared by multiple instances, you can use [`reactive()`](/api/reactivity-core#reactive) to create a reactive object, and then import it into multiple components :

```js
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0
})
```

<div class="composition-api">

```vue
<!-- ComponentA.vue -->
<script setup>
import { store } from './store.js'
</script>

<template>From A: {{ store.count }}</template>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { store } from './store.js'
</script>

<template>From B: {{ store.count }}</template>
```

</div>
<div class="options-api">

```vue
<!-- ComponentA.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From A: {{ store.count }}</template>
```

```vue
<!-- ComponentB.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From B: {{ store.count }}</template>
```

</div>

Maintenant, chaque fois que l'objet `store` est modifié, `<ComposantA>` et `<ComposantB>` mettront à jour leurs vues automatiquement - nous avons désormais une seule source de vérité maintenant.

Cependant, cela signifie également que n'importe quel composant important `store` peut le modifier comme il le souhaite :

```vue-html{2}
<template>
  <button @click="store.count++">
    From B: {{ store.count }}
  </button>
</template>
```

Bien que cela fonctionne dans des cas simples, un état global qui peut être arbitrairement modifié par n'importe quel composant ne sera pas très facile à maintenir à long terme. Pour s'assurer que la logique de modification de l'état soit centralisée comme l'état lui-même, il est recommandé de définir des méthodes sur le store avec des noms qui expriment l'intention des actions :

```js{6-8}
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
```

```vue-html{2}
<template>
  <button @click="store.increment()">
    From B: {{ store.count }}
  </button>
</template>
```

<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBDb21wb25lbnRBIGZyb20gJy4vQ29tcG9uZW50QS52dWUnXG5pbXBvcnQgQ29tcG9uZW50QiBmcm9tICcuL0NvbXBvbmVudEIudnVlJ1xuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPENvbXBvbmVudEEgLz5cbiAgPENvbXBvbmVudEIgLz5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkNvbXBvbmVudEEudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi9zdG9yZS5qcydcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXY+XG4gICAgPGJ1dHRvbiBAY2xpY2s9XCJzdG9yZS5pbmNyZW1lbnQoKVwiPlxuICAgICAgRnJvbSBBOiB7eyBzdG9yZS5jb3VudCB9fVxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiQ29tcG9uZW50Qi52dWUiOiI8c2NyaXB0IHNldHVwPlxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuL3N0b3JlLmpzJ1xuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdj5cbiAgICA8YnV0dG9uIEBjbGljaz1cInN0b3JlLmluY3JlbWVudCgpXCI+XG4gICAgICBGcm9tIEI6IHt7IHN0b3JlLmNvdW50IH19XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4iLCJzdG9yZS5qcyI6ImltcG9ydCB7IHJlYWN0aXZlIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgY29uc3Qgc3RvcmUgPSByZWFjdGl2ZSh7XG4gIGNvdW50OiAwLFxuICBpbmNyZW1lbnQoKSB7XG4gICAgdGhpcy5jb3VudCsrXG4gIH1cbn0pIn0=)

</div>
<div class="options-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBDb21wb25lbnRBIGZyb20gJy4vQ29tcG9uZW50QS52dWUnXG5pbXBvcnQgQ29tcG9uZW50QiBmcm9tICcuL0NvbXBvbmVudEIudnVlJ1xuICBcbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tcG9uZW50czoge1xuICAgIENvbXBvbmVudEEsXG4gICAgQ29tcG9uZW50QlxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8Q29tcG9uZW50QSAvPlxuICA8Q29tcG9uZW50QiAvPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQ29tcG9uZW50QS52dWUiOiI8c2NyaXB0PlxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuL3N0b3JlLmpzJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0b3JlXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2PlxuICAgIDxidXR0b24gQGNsaWNrPVwic3RvcmUuaW5jcmVtZW50KClcIj5cbiAgICAgIEZyb20gQToge3sgc3RvcmUuY291bnQgfX1cbiAgICA8L2J1dHRvbj5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPiIsIkNvbXBvbmVudEIudnVlIjoiPHNjcmlwdD5cbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi9zdG9yZS5qcydcblxuZXhwb3J0IGRlZmF1bHQge1xuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzdG9yZVxuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdj5cbiAgICA8YnV0dG9uIEBjbGljaz1cInN0b3JlLmluY3JlbWVudCgpXCI+XG4gICAgICBGcm9tIEI6IHt7IHN0b3JlLmNvdW50IH19XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4iLCJzdG9yZS5qcyI6ImltcG9ydCB7IHJlYWN0aXZlIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgY29uc3Qgc3RvcmUgPSByZWFjdGl2ZSh7XG4gIGNvdW50OiAwLFxuICBpbmNyZW1lbnQoKSB7XG4gICAgdGhpcy5jb3VudCsrXG4gIH1cbn0pIn0=)

</div>

:::tip
Notez que le gestionnaire de clic utilise `store.increment()` avec des parenthèses - cela est nécessaire pour appeler la méthode avec le contexte `this` adapté puisqu'il ne s'agit pas d'une méthode de composant.
:::

Bien que nous utilisions ici un seul objet réactif en guise de store, vous pouvez également partager un état réactif créé à l'aide d'autres [API de réactivité](/api/reactivity-core) telles que `ref()` ou `computed()`, ou même renvoyer un état global à partir d'un [Composable](/guide/reusability/composables) :

```js
import { ref } from 'vue'

// état global, créé dans la portée du module
const globalCount = ref(1)

export function useCount() {
  // état local, créé composant par composant
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```

Le fait que le système de réactivité de Vue soit découplé du modèle de composants le rend extrêmement flexible.

## Considérations relatives au SSR {#ssr-considerations}

Si vous construisez une application qui utilise le [Server-Side Rendering (SSR)](./ssr), le modèle ci-dessus peut entraîner des problèmes car le store est un singleton partagé entre plusieurs requêtes. Ce problème est abordé avec [plus de détails](./ssr#cross-request-state-pollution) dans le guide SSR.

## Pinia {#pinia}

Si notre solution de gestion d'état à la main suffit dans les scénarios simples, il y a beaucoup plus d'éléments à prendre en compte dans les applications de production à grande échelle :

- Des conventions plus solides pour la collaboration en équipe
- L'intégration avec les Vue DevTools, y compris la timeline, l'inspection des composants et le débogage par voyage dans le temps.
- Remplacement de module à chaud
- Prise en charge du rendu côté serveur

[Pinia](https://pinia.vuejs.org) est une bibliothèque de gestion d'état qui implémente tout ce qui précède. Elle est maintenue par l'équipe principale de Vue, et fonctionne à la fois avec Vue 2 et Vue 3.

Les utilisateurs actuels connaissent peut-être [Vuex](https://vuex.vuejs.org/), l'ancienne bibliothèque officielle de gestion d'état pour Vue. Pinia jouant le même rôle dans l'écosystème, Vuex est désormais en mode maintenance. Elle fonctionne toujours, mais ne proposera plus de nouvelles fonctionnalités. Il est recommandé d'utiliser Pinia pour les nouvelles applications.

Pinia a commencé comme une exploration de ce à quoi pourrait ressembler la prochaine itération de Vuex, incorporant de nombreuses idées issues des discussions de l'équipe centrale pour Vuex 5. Finalement, nous avons réalisé que Pinia implémentait déjà la plupart de ce que nous voulions dans Vuex 5, et donc nous avons finalement décidé d'en faire la nouvelle recommandation.

Par rapport à Vuex, Pinia offre une API plus simple avec moins de fioritures, propose des API de type Composition-API et, surtout, dispose d'une solide prise en charge de l'inférence de type lorsqu'elle est utilisée avec TypeScript.
