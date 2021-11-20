---
badges:
  - breaking
---

## API d'événements <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

Les méthodes d'instance `$on`, `$off` et `$once` sont supprimées. Les instances d'application n'implémentent plus l'interface d'émetteur d'événements.

## Syntaxe 2.x

En 2.x, l'instance Vue pouvait être utilisée pour déclencher des handlers attachés impérativement via l'API de l'émetteur d'événements (`$on`, `$off` et `$once`). Ceci était utilisé pour créer des _centres d'événements_ afin de créer des écouteurs d'événements globaux utilisés dans toute l'application :

```js
// eventHub.js

const eventHub = new Vue()

export default eventHub
```

```js
// ChildComponent.vue
import eventHub from './eventHub'

export default {
  mounted() {
    // ajout d'un écouteur eventHub
    eventHub.$on('custom-event', () => {
      console.log('Custom event triggered!')
    })
  },
  beforeDestroy() {
    // suppression de l'écouteur d'eventHub
    eventHub.$off('custom-event')
  }
}
```

```js
// ParentComponent.vue
import eventHub from './eventHub'

export default {
  methods: {
    callGlobalCustomEvent() {
      eventHub.$emit('custom-event') // si le ChildComponent est monté, nous aurons un message dans la console
    }
  }
}
```

## Mise à jour 3.x

Nous avons supprimé complètement les méthodes `$on`, `$off` et `$once` de l'instance. `$emit` fait toujours partie de l'API existante car elle est utilisée pour déclencher des gestionnaires d'événements attachés de manière déclarative par un composant parent.

## Stratégie de migration

Les concentrateurs d'événements existants peuvent être remplacés en utilisant une bibliothèque externe implémentant l'interface d'émetteur d'événements, par exemple [mitt](https://github.com/developit/mitt) ou [tiny-emitter](https://github.com/scottcorgan/tiny-emitter).

Ces méthodes peuvent également être prises en charge dans les versions de compatibilité.
