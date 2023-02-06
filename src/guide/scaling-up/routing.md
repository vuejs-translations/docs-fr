# Routing {#routing}

## Routage côté client vs. côté serveur {#client-side-vs-server-side-routing}

Le routage côté serveur signifie que le serveur envoie une réponse basée sur le chemin URL que l'utilisateur visite. Lorsque nous cliquons sur un lien dans une application web traditionnelle à rendu serveur, le navigateur reçoit une réponse HTML du serveur et recharge la page entière avec le nouveau HTML.

Cependant, dans une [application à page unique](https://developer.mozilla.org/fr/docs/Glossary/SPA) (SPA), le JavaScript côté client peut intercepter la navigation, récupérer dynamiquement de nouvelles données, et mettre à jour la page actuelle sans la recharger entièrement. Il en résulte généralement une expérience utilisateur plus rapide, en particulier pour les cas d'utilisation qui ressemblent davantage à des "applications" réelles, où l'utilisateur est censé effectuer de nombreuses interactions sur une longue période de temps.

Dans ces SPA, le "routage" est effectué côté client, dans le navigateur. Un routeur côté client est chargé de gérer la vue rendue de l'application à l'aide d'API de navigateur telles que [l'API History](https://developer.mozilla.org/fr/docs/Web/API/History) ou [l'événement `hashchange`](https://developer.mozilla.org/fr/docs/Web/API/Window/hashchange_event).

## Router officiel {#official-router}

<!-- TODO update links -->
<div>
  <VueSchoolLink href="https://vueschool.io/courses/vue-router-4-for-everyone" title="Leçon gratuite sur le router de Vue">
    Regarder un cours vidéo gratuit sur Vue School
  </VueSchoolLink>
</div>

Vue est bien adapté à la création de SPA. Pour la plupart des SPA, il est recommandé d'utiliser la [bibliothèque Vue Router](https://github.com/vuejs/router) officiellement supportée. Pour plus de détails, consultez la [documentation de Vue Router](https://router.vuejs.org/).

## Routage simple à partir de zéro {#simple-routing-from-scratch}

Si vous n'avez besoin que d'un routage très simple et que vous ne souhaitez pas utiliser une bibliothèque de routeurs complète, vous pouvez utiliser des [Composants dynamiques](/guide/essentials/component-basics.html#dynamic-components) et mettre à jour l'état actuel du composant en écoutant les [événements `hashchange`](https://developer.mozilla.org/fr/docs/Web/API/Window/hashchange_event) du navigateur ou en utilisant l'[API History](https://developer.mozilla.org/fr/docs/Web/API/History).

Voici un exemple concret :

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <a href="#/">Home</a> |
  <a href="#/about">About</a> |
  <a href="#/non-existent-path">Broken Link</a>
  <component :is="currentView" />
</template>
```

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgY29tcHV0ZWQgfSBmcm9tICd2dWUnXG5pbXBvcnQgSG9tZSBmcm9tICcuL0hvbWUudnVlJ1xuaW1wb3J0IEFib3V0IGZyb20gJy4vQWJvdXQudnVlJ1xuaW1wb3J0IE5vdEZvdW5kIGZyb20gJy4vTm90Rm91bmQudnVlJ1xuXG5jb25zdCByb3V0ZXMgPSB7XG4gICcvJzogSG9tZSxcbiAgJy9hYm91dCc6IEFib3V0XG59XG5cbmNvbnN0IGN1cnJlbnRQYXRoID0gcmVmKHdpbmRvdy5sb2NhdGlvbi5oYXNoKVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsICgpID0+IHtcbiAgY3VycmVudFBhdGgudmFsdWUgPSB3aW5kb3cubG9jYXRpb24uaGFzaFxufSlcblxuY29uc3QgY3VycmVudFZpZXcgPSBjb21wdXRlZCgoKSA9PiB7XG4gIHJldHVybiByb3V0ZXNbY3VycmVudFBhdGgudmFsdWUuc2xpY2UoMSkgfHwgJy8nXSB8fCBOb3RGb3VuZFxufSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxhIGhyZWY9XCIjL1wiPkhvbWU8L2E+IHxcbiAgPGEgaHJlZj1cIiMvYWJvdXRcIj5BYm91dDwvYT4gfFxuICA8YSBocmVmPVwiIy9ub24tZXhpc3RlbnQtcGF0aFwiPkJyb2tlbiBMaW5rPC9hPlxuICA8Y29tcG9uZW50IDppcz1cImN1cnJlbnRWaWV3XCIgLz5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkhvbWUudnVlIjoiPHRlbXBsYXRlPlxuICA8aDE+SG9tZTwvaDE+XG48L3RlbXBsYXRlPiIsIkFib3V0LnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGgxPkFib3V0PC9oMT5cbjwvdGVtcGxhdGU+IiwiTm90Rm91bmQudnVlIjoiPHRlbXBsYXRlPlxuICA8aDE+NDA0PC9oMT5cbjwvdGVtcGxhdGU+In0=)

</div>

<div class="options-api">

```vue
<script>
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

export default {
  data() {
    return {
      currentPath: window.location.hash
    }
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || '/'] || NotFound
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
		  this.currentPath = window.location.hash
		})
  }
}
</script>

<template>
  <a href="#/">Home</a> |
  <a href="#/about">About</a> |
  <a href="#/non-existent-path">Broken Link</a>
  <component :is="currentView" />
</template>
```

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBIb21lIGZyb20gJy4vSG9tZS52dWUnXG5pbXBvcnQgQWJvdXQgZnJvbSAnLi9BYm91dC52dWUnXG5pbXBvcnQgTm90Rm91bmQgZnJvbSAnLi9Ob3RGb3VuZC52dWUnXG5cbmNvbnN0IHJvdXRlcyA9IHtcbiAgJy8nOiBIb21lLFxuICAnL2Fib3V0JzogQWJvdXRcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50UGF0aDogd2luZG93LmxvY2F0aW9uLmhhc2hcbiAgICB9XG4gIH0sXG4gIGNvbXB1dGVkOiB7XG4gICAgY3VycmVudFZpZXcoKSB7XG4gICAgICByZXR1cm4gcm91dGVzW3RoaXMuY3VycmVudFBhdGguc2xpY2UoMSkgfHwgJy8nXSB8fCBOb3RGb3VuZFxuICAgIH1cbiAgfSxcbiAgbW91bnRlZCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsICgpID0+IHtcblx0XHQgIHRoaXMuY3VycmVudFBhdGggPSB3aW5kb3cubG9jYXRpb24uaGFzaFxuXHRcdH0pXG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxhIGhyZWY9XCIjL1wiPkhvbWU8L2E+IHxcbiAgPGEgaHJlZj1cIiMvYWJvdXRcIj5BYm91dDwvYT4gfFxuICA8YSBocmVmPVwiIy9ub24tZXhpc3RlbnQtcGF0aFwiPkJyb2tlbiBMaW5rPC9hPlxuICA8Y29tcG9uZW50IDppcz1cImN1cnJlbnRWaWV3XCIgLz5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkhvbWUudnVlIjoiPHRlbXBsYXRlPlxuICA8aDE+SG9tZTwvaDE+XG48L3RlbXBsYXRlPiIsIkFib3V0LnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGgxPkFib3V0PC9oMT5cbjwvdGVtcGxhdGU+IiwiTm90Rm91bmQudnVlIjoiPHRlbXBsYXRlPlxuICA8aDE+NDA0PC9oMT5cbjwvdGVtcGxhdGU+In0=)

</div>
