<script setup>
import ElasticHeader from './demos/ElasticHeader.vue'
import DisabledButton from './demos/DisabledButton.vue'
import Colors from './demos/Colors.vue'
import AnimateWatcher from './demos/AnimateWatcher.vue'
</script>

# Techniques d'animation {#animation-techniques}

Vue fournit les composants [`<Transition>`](/guide/built-ins/transition) et [`<TransitionGroup>`](/guide/built-ins/transition-group) pour gérer les transitions d'entrée / sortie et de liste. Cependant, il existe de nombreuses autres manières d'utiliser des animations sur le web, même dans une application Vue. Ici, nous allons discuter de quelques techniques supplémentaires. 

## Animations basées sur des classes {#class-based-animations}

Pour les éléments qui n'entrent pas / ne quittent pas le DOM, nous pouvons déclencher des animations en ajoutant dynamiquement une classe CSS :

<div class="composition-api">

```js
const disabled = ref(false)

function warnDisabled() {
  disabled.value = true
  setTimeout(() => {
    disabled.value = false
  }, 1500)
}
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      disabled: false
    }
  },
  methods: {
    warnDisabled() {
      this.disabled = true
      setTimeout(() => {
        this.disabled = false
      }, 1500)
    }
  }
}
```

</div>

```vue-html
<div :class="{ shake: disabled }">
  <button @click="warnDisabled">Click me</button>
  <span v-if="disabled">This feature is disabled!</span>
</div>
```

```css
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
```

<DisabledButton />

## Animations pilotées par l'état {#state-driven-animations}

Certaines transitions peuvent être appliquées en interpolant des valeurs, par exemple en liant un style à un élément pendant qu'une interaction se produit. Prenons cet exemple :

<div class="composition-api">

```js
const x = ref(0)

function onMousemove(e) {
  x.value = e.clientX
}
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      x: 0
    }
  },
  methods: {
    onMousemove(e) {
      this.x = e.clientX
    }
  }
}
```

</div>

```vue-html
<div
  @mousemove="onMousemove"
  :style="{ backgroundColor: `hsl(${x}, 80%, 50%)` }"
  class="movearea"
>
  <p>Move your mouse across this div...</p>
  <p>x: {{ x }}</p>
</div>
```

```css
.movearea {
  transition: 0.3s background-color ease;
}
```

<Colors />

En plus de la couleur, vous pouvez également utiliser des liaisons de style pour animer la transformation, la largeur ou la hauteur. Vous pouvez même animer des chemins SVG en utilisant la physique de ressort - après tout, ce sont toutes des liaisons de données d'attributs :

<ElasticHeader />

## Animer avec des observateurs {#animating-with-watchers}

Avec un peu de créativité, nous pouvons utiliser des observateurs pour animer n'importe quoi en fonction d'un état numérique. Par exemple, nous pouvons animer le nombre lui-même :

<div class="composition-api">

```js
import { ref, reactive, watch } from 'vue'
import gsap from 'gsap'

const number = ref(0)
const tweened = reactive({
  number: 0
})

watch(number, (n) => {
  gsap.to(tweened, { duration: 0.5, number: Number(n) || 0 })
})
```

```vue-html
Type a number: <input v-model.number="number" />
<p>{{ tweened.number.toFixed(0) }}</p>
```

</div>
<div class="options-api">

```js
import gsap from 'gsap'

export default {
  data() {
    return {
      number: 0,
      tweened: 0
    }
  },
  watch: {
    number(n) {
      gsap.to(this, { duration: 0.5, tweened: Number(n) || 0 })
    }
  }
}
```

```vue-html
Type a number: <input v-model.number="number" />
<p>{{ tweened.toFixed(0) }}</p>
```

</div>

<AnimateWatcher />

<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgcmVhY3RpdmUsIHdhdGNoIH0gZnJvbSAndnVlJ1xuaW1wb3J0IGdzYXAgZnJvbSAnZ3NhcCdcblxuY29uc3QgbnVtYmVyID0gcmVmKDApXG5jb25zdCB0d2VlbmVkID0gcmVhY3RpdmUoe1xuICBudW1iZXI6IDBcbn0pXG5cbndhdGNoKFxuICBudW1iZXIsXG4gIChuKSA9PiB7XG4gICAgZ3NhcC50byh0d2VlbmVkLCB7IGR1cmF0aW9uOiAwLjUsIG51bWJlcjogTnVtYmVyKG4pIHx8IDAgfSlcbiAgfVxuKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cImRlbW9cIj5cbiAgICBUeXBlIGEgbnVtYmVyOiA8aW5wdXQgdi1tb2RlbC5udW1iZXI9XCJudW1iZXJcIiAvPlxuICAgIDxwIGNsYXNzPVwiYmlnLW51bWJlclwiPnt7IHR3ZWVuZWQubnVtYmVyLnRvRml4ZWQoMCkgfX08L3A+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuLmJpZy1udW1iZXIge1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zaXplOiAyZW07XG59XG48L3N0eWxlPlxuIiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwiZ3NhcFwiOiBcImh0dHBzOi8vdW5wa2cuY29tL2dzYXA/bW9kdWxlXCIsXG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>
<div class="options-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBnc2FwIGZyb20gJ2dzYXAnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbnVtYmVyOiAwLFxuICAgICAgdHdlZW5lZDogMFxuICAgIH1cbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICBudW1iZXIobikge1xuICAgICAgZ3NhcC50byh0aGlzLCB7IGR1cmF0aW9uOiAwLjUsIHR3ZWVuZWQ6IE51bWJlcihuKSB8fCAwIH0pXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHRUeXBlIGEgbnVtYmVyOiA8aW5wdXQgdi1tb2RlbC5udW1iZXI9XCJudW1iZXJcIiAvPlxuXHQ8cCBjbGFzcz1cImJpZy1udW1iZXJcIj57eyB0d2VlbmVkLnRvRml4ZWQoMCkgfX08L3A+XG48L3RlbXBsYXRlPlxuXG48c3R5bGU+XG4uYmlnLW51bWJlciB7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXNpemU6IDJlbTtcbn1cbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwiZ3NhcFwiOiBcImh0dHBzOi8vdW5wa2cuY29tL2dzYXA/bW9kdWxlXCIsXG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>
