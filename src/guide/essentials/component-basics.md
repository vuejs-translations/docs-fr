# Principes fondamentaux des composants {#components-basics}

<ScrimbaLink href="https://scrimba.com/links/vue-component-basics" title="Leçon gratuite sur les composants Vue.js" type="scrimba">
  Voir une leçon vidéo interactive sur Scrimba
</ScrimbaLink>

Les composants nous permettent de fractionner l'UI en morceaux indépendants et réutilisables, sur lesquels nous pouvons réfléchir de manière isolée. Il est courant pour une application d'être organisée en un arbre de composants imbriqués.

![Component Tree](./images/components.png)

<!-- https://www.figma.com/file/qa7WHDQRWuEZNRs7iZRZSI/components -->

Cette approche est très similaire à celle d'imbriquer des éléments HTML natifs, mais Vue implémente son propre modèle de composant, nous permettant d'encapsuler du contenu et de la logique au sein de chaque composant. Vue fonctionne également bien avec les Web Components natifs. Pour en savoir plus sur la relation entre les composants Vue et les Web Components natifs, [lisez ceci](/guide/extras/web-components).

## Définir un composant {#defining-a-component}

Lorsqu'on utilise des outils de build, on définit généralement chaque composant Vue dans un fichier dédié en utilisant l'extension `.vue` - aussi appelé [Composant monofichier](/guide/scaling-up/sfc) (ou Single-File Components en anglais, abrégé SFC) :

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

</div>

Sans outils de build, un composant Vue peut être défini comme un simple objet JavaScript contenant des options spécifiques à Vue :

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
}
```

</div>
<div class="composition-api">

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
  // Peut également cibler un template dans le DOM :
  // `template: '#my-template-element'`
}
```

</div>

Le template est écrit telle une chaîne de caractère JavaScript que Vue va compiler à la volée. Vous pouvez aussi utiliser un sélecteur d'ID pointant sur un élément (généralement des éléments natifs `<template>`) - Vue utilisera son contenu comme la source du template.

L'exemple ci-dessus définit un composant et l'exporte comme l'export par défaut d'un fichier `.js`, mais vous pouvez utiliser les exports nommés pour exporter plusieurs composants à partir d'un même fichier.

## Utiliser un composant {#using-a-component}

:::tip
Nous allons utiliser la syntaxe SFC dans le reste de ce guide - les concepts des composants sont les mêmes que vous utilisiez des outils de build ou non. La section [Exemples](/examples/) illustre l'utilisation des composants dans les deux scénarios.
:::

Afin d'utiliser un composant enfant, nous devons l'importer dans le composant parent. En supposant que nous ayons placé notre composant compteur dans un fichier nommé `ButtonCounter.vue`, le composant apparaîtra comme l'export par défaut du fichier :

<div class="options-api">

```vue
<script>
import ButtonCounter from './ButtonCounter.vue'

export default {
  components: {
    ButtonCounter
  }
}
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

Pour exposer le composant importé à notre template, nous devons l'[enregistrer](/guide/components/registration) via l'option `components`. Le composant sera alors utilisable grâce à une balise portant la clé utilisée lors de l'enregistrement.

</div>

<div class="composition-api">

```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

Avec `<script setup>`, les composants importés sont directement rendus accessibles au template.

</div>

Il est également possible d'enregistrer globalement un composant, le rendant alors accessible à tous les composants d'une application sans avoir à l'importer. Les pour et contre d'un enregistrement global vs. local sont abordés dans la section [Enregistrement des Composants](/guide/components/registration) dédiée.

Vous pouvez réutiliser les composants autant de fois que vous voulez :

```vue-html
<h1>Here are many child components!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

<div class="options-api">

[Essayer en ligne](https://play.vuejs.org/#eNqVUE1LxDAQ/StjLqusNHotcfHj4l8QcontLBtsJiGdiFL6301SdrEqyEJyeG9m3ps3k3gIoXlPKFqhxi7awDtN1gUfGR4Ts6cnn4gxwj56B5tGrtgyutEEoAk/6lCPe5MGhqmwnc9KhMRjuxCwFi3UrCk/JU/uGTC6MBjGglgdbnfPGBFM/s7QJ3QHO/TfxC+UzD21d72zPItU8uQrrsWvnKsT/ZW2N2wur45BI3KKdETlFlmphZsF58j/RgdQr3UJuO8G273daVFFtlstahngxSeoNezBIUzTYgPzDGwdjk1VkYvMj4jzF0nwsyQ=)

</div>
<div class="composition-api">

[Essayer en ligne](https://play.vuejs.org/#eNqVj91KAzEQhV/lmJsqlY3eSlr8ufEVhNys6ZQGNz8kE0GWfXez2SJUsdCLuZiZM9+ZM4qnGLvPQuJBqGySjYxMXOJWe+tiSIznwhz8SyieKWGfgsOqkyfTGbDSXsmFUG9rw+Ti0DPNHavD/faVEqGv5Xr/BXOwww4mVBNPnvOVklXTtKeO8qKhkj++4lb8+fL/mCMS7TEdAy6BtDfBZ65fVgA2s+L67uZMUEC9N0s8msGaj40W7Xa91qKtgbdQ0Ha0gyOM45E+TWDrKHeNIhfMr0DTN4U0me8=)

</div>

Notez que lorsque vous cliquez sur les boutons, chacun d'entre eux maintient son propre `count` individuel. Cela s'explique par le fait que chaque fois que vous utilisez un composant, une nouvelle **instance** de ce dernier est créée.

Dans les SFC, il est recommandé d'utiliser des noms de balise en casse Pascal (`PascalCase`) pour les composants enfants afin de les différencier des éléments HTML natifs. Bien que les noms des balises HTML natifs soient insensibles à la casse, les SFC de Vue sont un format compilé, donc nous pouvons y utiliser des noms de balise sensibles à la casse. Nous pouvons également utiliser `/>` pour fermer une balise.

Si vous éditez vos templates directement dans un DOM (par exemple comme le contenu d'un élément natif `<template>`), le template sera soumis au parsing HTML par défaut du navigateur. Dans ces cas de figure, vous aurez besoin d'utiliser la casse kebab (`kebab-case`) et de fermer explicitement les balises pour vos composants :

```vue-html
<!-- Si le template est écrit dans le DOM -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

Voir les [mises en garde concernant l'analyse du template DOM](#in-dom-template-parsing-caveats) pour plus de détails.

## Passer des props {#passing-props}

Si nous construisons un blog, il est probable que nous ayons besoin d'un composant pour représenter un article du blog. Nous voulons que tous les articles partagent la même mise en page, mais avec un contenu différent. Un tel composant ne sera utile que si vous pouvez lui passer des données, comme le titre et le contenu d'un article spécifique que l'on voudrait afficher. C'est là que les props entrent en jeu.

Les props sont des attributs personnalisés que l'on peut enregistrer sur un composant. Pour passer un titre au composant article de notre blog, nous devons le déclarer dans la liste des props que ce composant accepte, en utilisant <span class="options-api">l'option [`props`](/api/options-state#props)</span><span class="composition-api">la macro [`defineProps`](/api/sfc-script-setup#defineprops-defineemits)</span> :

<div class="options-api">

```vue
<!-- BlogPost.vue -->
<script>
export default {
  props: ['title']
}
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

Lorsqu'une valeur est passée à un attribut prop, il devient une propriété de l'instance du composant. La valeur de cette propriété est accessible à l'intérieur du template et dans le contexte `this` du composant, tout comme n'importe quelle autre de ses propriétés.

</div>
<div class="composition-api">

```vue
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

`defineProps` est une macro de compilation qui est seulement accessible à l'intérieur de `<script setup>` et ne nécessite pas d'être explicitement importée. Les props déclarées sont automatiquement exposées au template. `defineProps` retourne également un objet contenant toutes les propriétés passées au composant, de manière à ce que l'on puisse y accéder en JavaScript si nécessaire :

```js
const props = defineProps(['title'])
console.log(props.title)
```

Voir aussi : [Typer les props d'un composant](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

Si vous n'utilisez pas `<script setup>`, les propriétés doivent être déclarées via l'option `props`, et l'objet props sera passé à `setup()` en premier argument :

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

</div>

Un composant peut avoir autant de props que vous voulez, et par défaut, n'importe quelle valeur peut être passée à une prop.

Une fois qu'une prop est enregistrée, vous pouvez lui passer des données via un attribut personnalisé, de cette manière :

```vue-html
<BlogPost title="My journey with Vue" />
<BlogPost title="Blogging with Vue" />
<BlogPost title="Why Vue is so fun" />
```

Toutefois, dans une application classique, vous auriez sûrement un tableau d'article dans votre composant parent :

<div class="options-api">

```js
export default {
  // ...
  data() {
    return {
      posts: [
        { id: 1, title: 'My journey with Vue' },
        { id: 2, title: 'Blogging with Vue' },
        { id: 3, title: 'Why Vue is so fun' }
      ]
    }
  }
}
```

</div>
<div class="composition-api">

```js
const posts = ref([
  { id: 1, title: 'My journey with Vue' },
  { id: 2, title: 'Blogging with Vue' },
  { id: 3, title: 'Why Vue is so fun' }
])
```

</div>

Puis vous voudriez rendre un composant pour chacun d'entre eux, grâce à `v-for` :

```vue-html
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />
```

<div class="options-api">

[Essayer en ligne](https://play.vuejs.org/#eNp9UU1rhDAU/CtDLrawVfpxklRo74We2kPtQdaoaTUJ8bmtiP+9ia6uC2VBgjOZeXnz3sCejAkPnWAx4+3eSkNJqmRjtCU817p81S2hsLpBEEYL4Q1BqoBUid9Jmosi62rC4Nm9dn4lFLXxTGAt5dG482eeUXZ1vdxbQZ1VCwKM0zr3x4KBATKPcbsDSapFjOClx5d2JtHjR1KFN9fTsfbWcXdy+CZKqcqL+vuT/r3qvQqyRatRdMrpF/nn/DNhd7iPR+v8HCDRmDoj4RHxbfyUDjeFto8p8yEh1Rw2ZV4JxN+iP96FMvest8RTTws/gdmQ8HUr7ikere+yHduu62y//y3NWG38xIOpeODyXcoE8OohGYZ5VhhHHjl83sD4B3XgyGI=)

</div>
<div class="composition-api">

[Essayer en ligne](https://play.vuejs.org/#eNp9kU9PhDAUxL/KpBfWBCH+OZEuid5N9qSHrQezFKhC27RlDSF8d1tYQBP1+N78OpN5HciD1sm54yQj1J6M0A6Wu07nTIpWK+MwwPASI0qjWkQejVbpsVHVQVl30ZJ0WQRHjwFMnpT0gPZLi32w2h2DMEAUGW5iOOEaniF66vGuOiN5j0/hajx7B4zxxt5ubIiphKz+IO828qXugw5hYRXKTnqSydcrJmk61/VF/eB4q5s3x8Pk6FJjauDO16Uye0ZCBwg5d2EkkED2wfuLlogibMOTbMpf9tMwP8jpeiMfRdM1l8Tk+/F++Y6Cl0Lyg1Ha7o7R5Bn9WwSg9X0+DPMxMI409fPP1PELlVmwdQ==)

</div>

Remarquez que la [syntaxe `v-bind`](/api/built-in-directives#v-bind) (`:title="post.title"`) est utilisée pour passer des valeurs de props dynamiques. Cela est particulièrement utile lorsque vous ne connaissez pas le contenu exact que vous allez rendre au fur et à mesure du temps.

Pour le moment, c'est tout ce dont vous avez besoin concernant les props, mais une fois que vous aurez terminé de lire cette page et vous sentirez à l'aise avec son contenu, nous vous recommandons de revenir afin de lire le guide complet sur les [Props](/guide/components/props).

## Écouter des événements {#listening-to-events}

Au fur et à mesure que nous développons notre composant `<BlogPost>`, certaines fonctionnalités peuvent nécessiter de communiquer avec le parent. Par exemple, on peut décider d'inclure une fonctionnalité d'accessibilité permettant d'agrandir le texte des articles du blog, tout en laissant la taille par défaut sur le reste de la page.

Dans le parent, nous pouvons développer cette fonctionnalité en ajoutant une <span class="options-api">propriété de données</span><span class="composition-api">ref</span> `postFontSize` :

<div class="options-api">

```js{6}
data() {
  return {
    posts: [
      /* ... */
    ],
    postFontSize: 1
  }
}
```

</div>
<div class="composition-api">

```js{5}
const posts = ref([
  /* ... */
])

const postFontSize = ref(1)
```

</div>

Qui pourra être utilisée dans le template afin de contrôler la taille de police de tous les articles du blog :

```vue-html{1,7}
<div :style="{ fontSize: postFontSize + 'em' }">
  <BlogPost
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
   />
</div>
```

Maintenant ajoutons un bouton dans le template du composant `<BlogPost>` :

```vue{5}
<!-- BlogPost.vue, omitting <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button>Enlarge text</button>
  </div>
</template>
```

Pour le moment le bouton ne fait rien - nous voulons que le clique communique au parent qu'il doit agrandir le texte de tous les articles. Pour résoudre ce problème, les composants fournissent un système personnalisé d'événements. Le parent peut choisir d'écouter n'importe quel événement de l'instance du composant enfant grâce à `v-on` ou `@`, comme nous le ferions avec un événement natif du DOM :

```vue-html{3}
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
```

Ensuite le composant enfant peut émettre lui-même un événement en appelant la méthode intégrée [**`$emit`**](/api/component-instance#emit), et en lui passant le nom de l'événement :

```vue{5}
<!-- BlogPost.vue, en omettant <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>
```

Grâce à l'écouteur `@enlarge-text="postFontSize += 0.1"`, le parent va recevoir l'événement et mettre à jour la valeur de `postFontSize`.

<div class="options-api">

[Essayer en ligne](https://play.vuejs.org/#eNqNUsFOg0AQ/ZUJMaGNbbHqidCmmujNxMRED9IDhYWuhV0CQy0S/t1ZYIEmaiRkw8y8N/vmMZVxl6aLY8EM23ByP+Mprl3Bk1RmCPexjJ5ljhBmMgFzYemEIpiuAHAFOzXQgIVeESNUKutL4gsmMLfbBPStVFTP1Bl46E2mup4xLDKhI4CUsMR+1zFABTywYTkD5BgzG8ynEj4kkVgJnxz38Eqaut5jxvXAUCIiLqI/8TcD/m1fKhTwHHIJYSEIr+HbnqikPkqBL/yLSMs23eDooNexel8pQJaksYeMIgAn4EewcyxjtnKNCsK+zbgpXILJEnW30bCIN7ZTPcd5KDNqoWjARWufa+iyfWBlV13wYJRvJtWVJhiKGyZiL4vYHNkJO8wgaQVXi6UGr51+Ndq5LBqMvhyrH9eYGePtOVu3n3YozWSqFsBsVJmt3SzhzVaYY2nm9l82+7GX5zTGjlTM1SyNmy5SeX+7rqr2r0NdOxbFXWVXIEoBGz/m/oHIF0rB5Pz6KTV6aBOgEo7Vsn51ov4GgAAf2A==)

</div>
<div class="composition-api">

[Essayer en ligne](https://play.vuejs.org/#eNp1Uk1PwkAQ/SuTxqQYgYp6ahaiJngzITHRA/UAZQor7W7TnaK16X93th8UEuHEvPdm5s3bls5Tmo4POTq+I0yYyZTAIOXpLFAySXVGUEKGEVQQZToBl6XukXqO9XahDbXc2OsAO5FlAIEKtWJByqCBqR01WFqiBLnxYTIEkhSjD+5rAV86zxQW8C1pB+88Aaphr73rtXbNVqrtBeV9r/zYFZYHacBoiHLFykB9Xgfq1NmLVvQmf7E1OGFaeE0anAMXhEkarwhtRWIjD+AbKmKcBk4JUdvtn8+6ARcTu87hLuCf6NJpSoDDKNIZj7BtIFUTUuB0tL/HomXHcnOC18d1TF305COqeJVtcUT4Q62mtzSF2/GkE8/E8b1qh8Ljw/if8I7nOkPn9En/+Ug2GEmFi0ynZrB0azOujbfB54kki5+aqumL8bING28Yr4xh+2vePrI39CnuHmZl2TwwVJXwuG6ZdU6kFTyGsQz33HyFvH5wvvyaB80bACwgvKbrYgLVH979DQc=)

</div>

Nous pouvons, de manière facultative, déclarer les événements émis en utilisant <span class="options-api">l'option [`emits`](/api/options-state#emits)</span><span class="composition-api">[`defineEmits`](/api/sfc-script-setup#defineprops-defineemits)une macro</span> :

<div class="options-api">

```vue{5}
<!-- BlogPost.vue -->
<script>
export default {
  props: ['title'],
  emits: ['enlarge-text']
}
</script>
```

</div>
<div class="composition-api">

```vue{4}
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
```

</div>

Cela documente tous les événements qu'un composant émet et peut éventuellement les [valider](/guide/components/events#events-validation). Cela permet également à Vue d'éviter de les appliquer implicitement en tant qu'écouteurs natifs à l'élément racine du composant enfant.

<div class="composition-api">

Comme c'est le cas pour `defineProps`, `defineEmits` n'est utilisable que dans `<script setup>` et ne nécessite pas d'être importé. Une fonction `emit` est retournée, similaire à la méthode `$emit`. Cela peut être utilisé pour émettre des événements dans la section `<script setup>` d'un composant, où `$emit` n'est pas directement accessible :

```vue
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

Voir aussi : [Typer les emits d'un composant](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

Dans le cas où vous n'utilisez pas `<script setup>`, vous pouvez déclarer les événements émis en utilisant l'option `emits`. Vous pouvez accéder à la fonction `emit` via une propriété du contexte du setup (passé à `setup()` en deuxième argument) :

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

</div>

Pour le moment, c'est tout ce dont vous avez besoin concernant les événements personnalisés de composants, mais une fois que vous aurez terminé de lire cette page et vous sentirez à l'aise avec son contenu, nous vous recommandons de revenir afin de lire le guide complet sur la [Gestion des événements](/guide/components/events).

## Distribution de contenu avec les slots {#content-distribution-with-slots}

Comme pour les éléments HTML, il est souvent utile de pouvoir passer du contenu à un composant, de cette manière :

```vue-html
<AlertBox>
  Quelque chose de grave s'est produit.
</AlertBox>
```

Ce qui devrait rendre :

:::danger Il s'agit d'une Erreur à des fins de Démonstration
Quelque chose de grave s'est produit.
:::

Cela peut être réalisé en utilisant l'élément personnalisé de Vue `<slot>` :

```vue{5}
<!-- AlertBox.vue -->
<template>
  <div class="alert-box">
    <strong>Il s'agit d'une Erreur à des fins de Démonstration</strong>
    <slot />
  </div>
</template>

<style scoped>
.alert-box {
  /* ... */
}
</style>
```

Comme vous le verrez, nous utilisons `<slot>` comme un espace réservé où nous voulons que le contenu aille – et c'est tout. Nous avons terminé !

<div class="options-api">

[Essayer en ligne](https://play.vuejs.org/#eNpVUcFOwzAM/RUTDruwFhCaUCmThsQXcO0lbbKtIo0jx52Kpv07TreWouTynl+en52z2oWQnXqrClXGhtrA28q3XUBi2DlL/IED7Ak7WGX5RKQHq8oDVN4Oo9TYve4dwzmxDcp7bz3HAs5/LpfKyy3zuY0Atl1wmm1CXE5SQeLNX9hZPrb+ALU2cNQhWG9NNkrnLKIt89lGPahlyDTVogVAadoTNE7H+F4pnZTrGodKjUUpRyb0h+0nEdKdRL3CW7GmfNY5ZLiiMhfP/ynG0SL/OAuxwWCNMNncbVqSQyrgfrPZvCVcIxkrxFMYIKJrDZA1i8qatGl72ehLGEY6aGNkNwU8P96YWjffB8Lem/Xkvn9NR6qy+fRd14FSgopvmtQmzTT9Toq9VZdfIpa5jQ==)

</div>
<div class="composition-api">

[Essayer en ligne](https://play.vuejs.org/#eNpVUEtOwzAQvcpgFt3QBBCqUAiRisQJ2GbjxG4a4Xis8aQKqnp37PyUyqv3mZn3fBVH55JLr0Umcl9T6xi85t4VpW07h8RwNJr4Cwc4EXawS9KFiGO70ubpNBcmAmDdOSNZR8T5Yg0IoOQf7DSfW9tAJRWcpXPaapWM1nVt8ObpukY8ie29GHNzAiBX7QVqI73/LIWMzn2FQylGMcieCW1TfBMhPYSoE5zFitLVZ5BhQnkadt6nGKt5/jMafI1Oq8Ak6zW4xrEaDVIGj4fD4SPiCknpQLy4ATyaVgFptVH2JFXb+wze3DDSTioV/iaD1+eZqWT92xD2Vu2X7af3+IJ6G7/UToVigpJnTzwTO42eWDnELsTtH/wUqH4=)

</div>

Pour le moment, c'est tout ce dont vous avez besoin concernant les slots, mais une fois que vous aurez terminé de lire cette page et vous sentirez à l'aise avec son contenu, nous vous recommandons de revenir afin de lire le guide complet sur les [Slots](/guide/components/slots).

## Composants dynamiques {#dynamic-components}

Parfois, il peut être utile d'alterner dynamiquement entre des composants, comme dans une interface avec des onglets :

<div class="options-api">

[Essayer en ligne](https://play.vuejs.org/#eNqNVE2PmzAQ/Ssj9kArLSHbrXpwk1X31mMPvS17cIxJrICNbJMmivLfO/7AEG2jRiDkefP85sNmztlr3y8OA89ItjJMi96+VFJ0vdIWfqqOQ6NVB/midIYj5sn9Sxlrkt9b14RXzXbiMElEO5IAKsmPnljzhg6thbNDmcLdkktrSADAJ/IYlj5MXEc9Z1w8VFNLP30ed2luBy1HC4UHrVH2N90QyJ1kHnUALN1gtLeIQu6juEUMkb8H5sXHqiS+qzK1Cw3Lu76llqMFsKrFAVhLjVlXWc07VWUeR89msFbhhhAWDkWjNJIwPgjp06iy5CV7fgrOOTgKv+XoKIIgpnoGyiymSmZ1wnq9dqJweZ8p/GCtYHtUmBMdLXFitgDnc9ju68b0yxDO1WzRTEcFRLiUJsEqSw3wwi+rMpFDj0psEq5W5ax1aBp7at1y4foWzq5R0hYN7UR7ImCoNIXhWjTfnW+jdM01gaf+CEa1ooYHzvnMVWhaiwEP90t/9HBP61rILQJL3POMHw93VG+FLKzqUYx3c2yjsOaOwNeRO2B8zKHlzBKQWJNH1YHrplV/iiMBOliFILYNK5mOKdSTMviGCTyNojFdTKBoeWNT3s8f/Vpsd7cIV61gjHkXnotR6OqVkJbrQKdsv9VqkDWBh2bpnn8VXaDcHPexE4wFzsojO9eDUOSVPF+65wN/EW7sHRsi5XaFqaexn+EH9Xcpe8zG2eWG3O0/NVzUaeJMk+jGhUXlNPXulw5j8w7t2bi8X32cuf/Vv/wF/SL98A==)

</div>
<div class="composition-api">

[Essayer en ligne](https://play.vuejs.org/#eNqNVMGOmzAQ/ZURe2BXCiHbrXpwk1X31mMPvS1V5RiTWAEb2SZNhPLvHdvggLZRE6TIM/P8/N5gpk/e2nZ57HhCkrVhWrQWDLdd+1pI0bRKW/iuGg6VVg2ky9wFDp7G8g9lrIl1H80Bb5rtxfFKMcRzUA+aV3AZQKEEhWRKGgus05pL+5NuYeNwj6mTkT4VckRYujVY63GT17twC6/Fr4YjC3kp5DoPNtEgBpY3bU0txwhgXYojsJoasymSkjeqSHweK9vOWoUbXIC/Y1YpjaDH3wt39hMI6TUUSYSQAz8jArPT5Mj+nmIhC6zpAu1TZlEhmXndbBwpXH5NGL6xWrADMsyaMj1lkAzQ92E7mvYe8nCcM24xZApbL5ECiHCSnP73KyseGnvh6V/XedwS2pVjv3C1ziddxNDYc+2WS9fC8E4qJW1W0UbUZwKGSpMZrkX11dW2SpdcE3huT2BULUp44JxPSpmmpegMgU/tyadbWpZC7jCxwj0v+OfTDdU7ITOrWiTjzTS3Vei8IfB5xHZ4PmqoObMEJHryWXXkuqrVn+xEgHZWYRKbh06uLyv4iQq+oIDnkXSQiwKymlc26n75WNdit78FmLWCMeZL+GKMwlKrhLRcBzhlh51WnSwJPFQr9/zLdIZ007w/O6bR4MQe2bseBJMzer5yzwf8MtzbOzYMkNsOY0+HfoZv1d+lZJGMg8fNqdsfbbio4b77uRVv7I0Li8xxZN1PHWbeHdyTWXc/+zgw/8t/+QsROe9h)

</div>

Cela est rendu possible par l'élément `<component>` de Vue avec l'attribut spécial `is` :

<div class="options-api">

```vue-html
<!-- Le composant change lorsque currentTab change -->
<component :is="currentTab"></component>
```

</div>
<div class="composition-api">

```vue-html
<!-- Le composant change lorsque currentTab change -->
<component :is="tabs[currentTab]"></component>
```

</div>

Dans l'exemple ci-dessus, la valeur passée à `:is` peut contenir au choix :

- une chaîne de caractères représentant le nom d'un composant enregistré, OU
- le véritable objet composant importé

Vous pouvez également utiliser l'attribut `is` pour créer des éléments HTML classiques.

Lorsqu'on alterne entre plusieurs composants avec `<component :is="...">`, seul celui sélectionné par `:is` reste monté. On peut forcer les composants inactifs à rester "en vie" grâce au [composant intégré `<KeepAlive>`](/guide/built-ins/keep-alive).

## Mises en garde concernant l'analyse du template DOM {#in-dom-template-parsing-caveats}

Si vous écrivez vos templates Vue directement dans le DOM, Vue va devoir extraire du DOM la chaîne de caractères représentant le template. Cela entraîne quelques avertissements à cause du comportement d'analyse du HTML natif des navigateurs.

:::tip
Il est important de rappeler que les limitations que nous allons aborder ne s'appliquent que lorsque vous écrivez vos templates directement dans le DOM. Elles ne s'appliquent PAS si vous utilisez des templates en chaîne de caractères à partir des sources suivantes :

- Composants Monofichiers
- Chaînes de caractères représentant le template écrites en ligne (par exemple `template: '...'`)
- `<script type="text/x-template">`
  :::

### Insensibilité de la casse {#case-insensitivity}

Les balises HTML et les noms des attributs sont insensibles à la casse, donc les navigateurs interpréteront une lettre majuscule comme une lettre minuscule. Cela signifie que lorsque vous utilisez des templates dans le DOM, les noms des composants en casse Pascal et les noms des propriétés en casse Camel ou encore les noms des événements `v-on` doivent tous utiliser leurs équivalent en casse Kebab (séparation par un trait d'union) :

```js
// casse Camel en JavaScript
const BlogPost = {
  props: ['postTitle'],
  emits: ['updatePost'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
}
```

```vue-html
<!-- casse Camel en HTML -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```

### Balises auto-fermantes {#self-closing-tags}

Nous avons utilisé des balises auto-fermantes pour les composants dans les exemples de code précédents :

```vue-html
<MyComponent />
```

Ceci s'explique par le fait que l'outil d'analyse d'un template Vue respecte `/>` comme une indication de fin de balise, peu importe son type.

Dans les templates du DOM, cependant, nous devons toujours inclure des fermetures de balise explicites :

```vue-html
<my-component></my-component>
```

Cela est dû aux spécifications du HTML qui n'autorisent que [quelques éléments spécifiques](https://html.spec.whatwg.org/multipage/syntax.html#void-elements) à omettre la fermeture des balises, les plus communs étant `<input>` et `<img>`. Pour tous les autres éléments, si vous omettez de fermer les balises, l'outil d'analyse du HTML natif pensera que vous n'avez jamais terminé leur ouverture. Par exemple, le bout de code suivant :

```vue-html
<my-component /> <!-- nous voulons fermer la balise ici... -->
<span>hello</span>
```

Sera analysé comme :

```vue-html
<my-component>
  <span>hello</span>
</my-component> <!-- mais le navigateur le fermera ici -->
```

### Restrictions pour le placement des éléments {#element-placement-restrictions}

Certains éléments HTML, comme `<ul>`, `<ol>`, `<table>` et `<select>` ont des restrictions concernant quels éléments ils peuvent contenir, et certains éléments comme `<li>`, `<tr>`, et `<option>` ne peuvent apparaître qu'à l'intérieur de certains éléments.

Cela va entraîner des problèmes lorsque nous allons utiliser des composants avec des éléments qui ont ce genre de restrictions. Par exemple :

```vue-html
<table>
  <blog-post-row></blog-post-row>
</table>
```

Le composant personnalisé `<blog-post-row>` sera relevé comme contenu invalide, ce qui peut causer des erreurs dans le résultat rendu final. Nous pouvons utiliser [l'attribut spécial `is`](/api/built-in-special-attributes#is) comme solution :

```vue-html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip
Lorsqu'il est utilisé sur des éléments HTML natifs, la valeur de `is` doit être préfixée de `vue:` afin d'être interprétée comme un composant Vue. Cela est nécessaire afin d'éviter les confusions avec les [éléments personnalisés intégrés](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example).
:::

C'est tout ce que vous avez besoin de savoir à propos des mises en garde concernant l'analyse du template DOM pour le moment - et d'ailleurs, la fin des _Essentiels_ de Vue. Félicitations ! Il y a encore à apprendre, mais d'abord, nous vous recommandons de prendre une pause afin d'expérimenter Vue par vous-même - construisez quelque chose d'amusant, ou découvrez certains des [Exemples](/examples/) si ça n'est pas déjà fait.

Dès que vous vous sentez à l'aise avec le savoir que vous venez de digérer, avancez dans le guide pour découvrir les composants en profondeur.
