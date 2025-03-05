# Routage {#routing}

## Routage côté client vs. côté serveur {#client-side-vs-server-side-routing}

Le routage côté serveur signifie que le serveur envoie une réponse basée sur le chemin URL que l'utilisateur visite. Lorsque nous cliquons sur un lien dans une application web traditionnelle à rendu serveur, le navigateur reçoit une réponse HTML du serveur et recharge la page entière avec le nouveau HTML.

Cependant, dans une [application monopage](https://developer.mozilla.org/fr/docs/Glossary/SPA) (SPA), le JavaScript côté client peut intercepter la navigation, récupérer dynamiquement de nouvelles données, et mettre à jour la page actuelle sans la recharger entièrement. Il en résulte généralement une expérience utilisateur plus rapide, en particulier pour les cas d'utilisation qui ressemblent davantage à des "applications" réelles, où l'utilisateur est censé effectuer de nombreuses interactions sur une longue période de temps.

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

Si vous n'avez besoin que d'un routage très simple et que vous ne souhaitez pas utiliser une bibliothèque de routeurs complète, vous pouvez utiliser des [Composants dynamiques](/guide/essentials/component-basics#dynamic-components) et mettre à jour l'état actuel du composant en écoutant les [événements `hashchange`](https://developer.mozilla.org/fr/docs/Web/API/Window/hashchange_event) du navigateur ou en utilisant l'[API History](https://developer.mozilla.org/fr/docs/Web/API/History).

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

[Essayer en ligne](https://play.vuejs.org/#eNptUk1vgkAQ/SsTegAThZp4MmhikzY9mKanXkoPWxjLRpgly6JN1P/eWb5Eywlm572ZN2/m5GyKwj9U6CydsIy1LAyUaKpiHZHMC6UNnEDjbgqxyovKYAIX2GmVg8sktwe9qhzbdz+wga15TW++VWX6fB3dAt6UeVEVJT2me2hhEcWKSgOamVjCCk4RAbiBu6xbT5tI2ML8VDeI6HLlxZXWSOZdmJTJPJB3lJSoo5+pWBipyE9FmU4soU2IJHk+MGUrS4OE2nMtIk4F/aA7BW8Cq3WjYlDbP4isQu4wVp0F1Q1uFH1IPDK+c9cb1NW8B03tyJ//uvhlJmP05hM4n60TX/bb2db0CoNmpbxMDgzmRSYMcgQQCkjZhlXkPASRs7YmhoFYw/k+WXvKiNrTcQgpmuFv7ZOZFSyQ4U9a7ZFgK2lvSTXFDqmIQbCUJTMHFkQOBAwKg16kM3W6O7K3eSs+nbeK+eee1V/XKK0dY4Q3vLhR6uJxMUK8/AFKaB6k)

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

[Essayer en ligne](https://play.vuejs.org/#eNptUstO6zAQ/ZVR7iKtVJKLxCpKK3Gli1ggxIoNZmGSKbFoxpEzoUi0/87YeVBKNonHPmfOmcdndN00yXuHURblbeFMwxtFpm6sY7i1NcLW2RriJPWBB8bT8/WL7Xh6D9FPwL3lG9tROWHGiwGmqLDUMjhhYgtr+FQEEKdxFqRXfaR9YrkKAoqOnocfQaDEre523PNKzXqx7M8ADrlzNEYAReccEj9orjLYGyrtPtnZQrOxlFS6rXqgZJdPUC5s3YivMhuTDCkeDe6/dSalvognrkybnIgl7c4UuLhcwuHgS3v2/7EPvzRruRXJ7/SDU12W/98l451pGQndIvaWi0rTK8YrEPx64ymKFQOce5DOzlfs4cdlkA+NzdNpBSRgrJudZpQIINdQOdyuVfQnVdHGzydP9QYO549hXIII45qHkKUL/Ail8EUjBgX+z9k3JLgz9OZJgeInYElAkJlWmCcDUBGkAsrTyWS0isYV9bv803x1OTiWwzlrWtxZ2lDGDO90mWepV3+vZojHL3QQKQE=)

</div>
