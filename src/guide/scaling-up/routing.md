# Routing

## Official Router

<!-- TODO update links -->

For most Single Page Applications, it's recommended to use the officially-supported [vue-router library](https://github.com/vuejs/vue-router-next). For more details, see vue-router's [documentation](https://router.vuejs.org/).

## Simple Routing from Scratch

If you only need very simple routing and do not wish to involve a full-featured router library, you can do so with [Dynamic Components](/guide/essentials/component-basics.html#dynamic-components) and update the current component state by listening to browser [`hashchange` events](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) or using the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History).

Here's a bare-bone example:

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

[Try it in the Playground](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgY29tcHV0ZWQgfSBmcm9tICd2dWUnXG5pbXBvcnQgSG9tZSBmcm9tICcuL0hvbWUudnVlJ1xuaW1wb3J0IEFib3V0IGZyb20gJy4vQWJvdXQudnVlJ1xuaW1wb3J0IE5vdEZvdW5kIGZyb20gJy4vTm90Rm91bmQudnVlJ1xuXG5jb25zdCByb3V0ZXMgPSB7XG4gICcvJzogSG9tZSxcbiAgJy9hYm91dCc6IEFib3V0XG59XG5cbmNvbnN0IGN1cnJlbnRQYXRoID0gcmVmKHdpbmRvdy5sb2NhdGlvbi5oYXNoKVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsICgpID0+IHtcbiAgY3VycmVudFBhdGgudmFsdWUgPSB3aW5kb3cubG9jYXRpb24uaGFzaFxufSlcblxuY29uc3QgY3VycmVudFZpZXcgPSBjb21wdXRlZCgoKSA9PiB7XG4gIHJldHVybiByb3V0ZXNbY3VycmVudFBhdGgudmFsdWUuc2xpY2UoMSkgfHwgJy8nXSB8fCBOb3RGb3VuZFxufSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxhIGhyZWY9XCIjL1wiPkhvbWU8L2E+IHxcbiAgPGEgaHJlZj1cIiMvYWJvdXRcIj5BYm91dDwvYT4gfFxuICA8YSBocmVmPVwiIy9ub24tZXhpc3RlbnQtcGF0aFwiPkJyb2tlbiBMaW5rPC9hPlxuICA8Y29tcG9uZW50IDppcz1cImN1cnJlbnRWaWV3XCIgLz5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkhvbWUudnVlIjoiPHRlbXBsYXRlPlxuICA8aDE+SG9tZTwvaDE+XG48L3RlbXBsYXRlPiIsIkFib3V0LnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGgxPkFib3V0PC9oMT5cbjwvdGVtcGxhdGU+IiwiTm90Rm91bmQudnVlIjoiPHRlbXBsYXRlPlxuICA8aDE+NDA0PC9oMT5cbjwvdGVtcGxhdGU+In0=)

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

[Try it in the Playground](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBIb21lIGZyb20gJy4vSG9tZS52dWUnXG5pbXBvcnQgQWJvdXQgZnJvbSAnLi9BYm91dC52dWUnXG5pbXBvcnQgTm90Rm91bmQgZnJvbSAnLi9Ob3RGb3VuZC52dWUnXG5cbmNvbnN0IHJvdXRlcyA9IHtcbiAgJy8nOiBIb21lLFxuICAnL2Fib3V0JzogQWJvdXRcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50UGF0aDogd2luZG93LmxvY2F0aW9uLmhhc2hcbiAgICB9XG4gIH0sXG4gIGNvbXB1dGVkOiB7XG4gICAgY3VycmVudFZpZXcoKSB7XG4gICAgICByZXR1cm4gcm91dGVzW3RoaXMuY3VycmVudFBhdGguc2xpY2UoMSkgfHwgJy8nXSB8fCBOb3RGb3VuZFxuICAgIH1cbiAgfSxcbiAgbW91bnRlZCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsICgpID0+IHtcblx0XHQgIHRoaXMuY3VycmVudFBhdGggPSB3aW5kb3cubG9jYXRpb24uaGFzaFxuXHRcdH0pXG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxhIGhyZWY9XCIjL1wiPkhvbWU8L2E+IHxcbiAgPGEgaHJlZj1cIiMvYWJvdXRcIj5BYm91dDwvYT4gfFxuICA8YSBocmVmPVwiIy9ub24tZXhpc3RlbnQtcGF0aFwiPkJyb2tlbiBMaW5rPC9hPlxuICA8Y29tcG9uZW50IDppcz1cImN1cnJlbnRWaWV3XCIgLz5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkhvbWUudnVlIjoiPHRlbXBsYXRlPlxuICA8aDE+SG9tZTwvaDE+XG48L3RlbXBsYXRlPiIsIkFib3V0LnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGgxPkFib3V0PC9oMT5cbjwvdGVtcGxhdGU+IiwiTm90Rm91bmQudnVlIjoiPHRlbXBsYXRlPlxuICA8aDE+NDA0PC9oMT5cbjwvdGVtcGxhdGU+In0=)

</div>
