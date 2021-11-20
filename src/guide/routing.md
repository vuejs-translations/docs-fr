## Routage

## Routeur officiel

Pour la plupart des applications à page unique, il est recommandé d'utiliser la [bibliothèque vue-router](https://github.com/vuejs/vue-router) officiellement supportée. Pour plus de détails, consultez la [documentation](https://next.router.vuejs.org/) de vue-router.

## Routage simple à partir de zéro

Si vous n'avez besoin que d'un routage très simple et que vous ne souhaitez pas utiliser une bibliothèque de routeurs complète, vous pouvez le faire en rendant dynamiquement un composant de niveau page comme ceci :

```js
const { createApp, h } = Vue

const NotFoundComponent = { template: '<p>Page not found</p>' }
const HomeComponent = { template: '<p>Home page</p>' }
const AboutComponent = { template: '<p>About page</p>' }

const routes = {
  '/': HomeComponent,
  '/about': AboutComponent
}

const SimpleRouter = {
  data: () => ({
    currentRoute: window.location.pathname
  }),

  computed: {
    CurrentComponent() {
      return routes[this.currentRoute] || NotFoundComponent
    }
  },

  render() {
    return h(this.CurrentComponent)
  }
}

createApp(SimpleRouter).mount('#app')
```

Combiné à l'[API d'historique](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API), vous pouvez construire un routeur côté client très basique mais entièrement fonctionnel. Pour voir cela en pratique, consultez [cette application d'exemple](https://github.com/phanan/vue-3.0-simple-routing-example).

## Intégration de routeurs tiers

Si vous préférez utiliser un routeur tiers, tel que [Page.js](https://github.com/visionmedia/page.js) ou [Director](https://github.com/flatiron/director), l'intégration est [tout aussi simple](https://github.com/phanan/vue-3.0-simple-routing-example/compare/master...pagejs). Voici un [exemple complet](https://github.com/phanan/vue-3.0-simple-routing-example/tree/pagejs) utilisant Page.js.
