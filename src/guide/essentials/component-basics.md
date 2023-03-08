# Principes fondamentaux des composants {#components-basics}

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
  // ou `template: '#my-template-element'`
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

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBCdXR0b25Db3VudGVyIGZyb20gJy4vQnV0dG9uQ291bnRlci52dWUnXG4gIFxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21wb25lbnRzOiB7XG4gICAgQnV0dG9uQ291bnRlclxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8aDE+SGVyZSBhcmUgbWFueSBjaGlsZCBjb21wb25lbnRzITwvaDE+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJCdXR0b25Db3VudGVyLnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvdW50OiAwXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImNvdW50KytcIj5cbiAgICBZb3UgY2xpY2tlZCBtZSB7eyBjb3VudCB9fSB0aW1lcy5cbiAgPC9idXR0b24+XG48L3RlbXBsYXRlPiJ9)

</div>
<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBCdXR0b25Db3VudGVyIGZyb20gJy4vQnV0dG9uQ291bnRlci52dWUnXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8aDE+SGVyZSBhcmUgbWFueSBjaGlsZCBjb21wb25lbnRzITwvaDE+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJCdXR0b25Db3VudGVyLnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5pbXBvcnQgeyByZWYgfSBmcm9tICd2dWUnXG5cbmNvbnN0IGNvdW50ID0gcmVmKDApXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImNvdW50KytcIj5cbiAgICBZb3UgY2xpY2tlZCBtZSB7eyBjb3VudCB9fSB0aW1lcy5cbiAgPC9idXR0b24+XG48L3RlbXBsYXRlPiJ9)

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

Voir les [mises en garde concernant l'analyse du template DOM](#dom-template-parsing-caveats) pour plus de détails.

## Passer des props {#passing-props}

Si nous construisons un blog, il est probable que nous ayons besoin d'un composant pour représenter un article du blog. Nous voulons que tous les articles partagent la même mise en page, mais avec un contenu différent. Un tel composant ne sera utile que si vous pouvez lui passer des données, comme le titre et le contenu d'un article spécifique que l'on voudrait afficher. C'est là que les props entrent en jeu.

Les props sont des attributs personnalisés que l'on peut enregistrer sur un composant. Pour passer un titre au composant article de notre blog, nous devons le déclarer dans la liste des props que ce composant accepte, en utilisant <span class="options-api">l'option [`props`](/api/options-state.html#props).</span><span class="composition-api">[`defineProps`](/api/sfc-script-setup#defineprops-defineemits)une macro</span> :

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

Si vous n'utilisez pas `<script setup>`, les propriétés doivent être déclarées via l'option `props`, et l'objet props sera passée à `setup()` en premier argument :

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

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHtcbiAgICBCbG9nUG9zdFxuICB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwb3N0czogW1xuICAgICAgICB7IGlkOiAxLCB0aXRsZTogJ015IGpvdXJuZXkgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDIsIHRpdGxlOiAnQmxvZ2dpbmcgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDMsIHRpdGxlOiAnV2h5IFZ1ZSBpcyBzbyBmdW4nIH1cbiAgICAgIF1cbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxCbG9nUG9zdFxuICBcdHYtZm9yPVwicG9zdCBpbiBwb3N0c1wiXG5cdCAgOmtleT1cInBvc3QuaWRcIlxuICBcdDp0aXRsZT1cInBvc3QudGl0bGVcIlxuXHQ+PC9CbG9nUG9zdD5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkJsb2dQb3N0LnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIHByb3BzOiBbJ3RpdGxlJ11cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxoND57eyB0aXRsZSB9fTwvaDQ+XG48L3RlbXBsYXRlPiJ9)

</div>
<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5jb25zdCBwb3N0cyA9IHJlZihbXG4gIHsgaWQ6IDEsIHRpdGxlOiAnTXkgam91cm5leSB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMiwgdGl0bGU6ICdCbG9nZ2luZyB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMywgdGl0bGU6ICdXaHkgVnVlIGlzIHNvIGZ1bicgfVxuXSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxCbG9nUG9zdFxuICBcdHYtZm9yPVwicG9zdCBpbiBwb3N0c1wiXG5cdCAgOmtleT1cInBvc3QuaWRcIlxuICBcdDp0aXRsZT1cInBvc3QudGl0bGVcIlxuXHQ+PC9CbG9nUG9zdD5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkJsb2dQb3N0LnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5kZWZpbmVQcm9wcyhbJ3RpdGxlJ10pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8aDQ+e3sgdGl0bGUgfX08L2g0PlxuPC90ZW1wbGF0ZT4ifQ==)

</div>

Remarquez comment `v-bind` est utilisé pour passer des valeurs de props dynamiques. Cela est particulièrement utile lorsque vous ne connaissez pas le contenu exact que vous allez rendre au fur et à mesure du temps.

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

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHtcbiAgICBCbG9nUG9zdFxuICB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwb3N0czogW1xuICAgICAgICB7IGlkOiAxLCB0aXRsZTogJ015IGpvdXJuZXkgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDIsIHRpdGxlOiAnQmxvZ2dpbmcgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDMsIHRpdGxlOiAnV2h5IFZ1ZSBpcyBzbyBmdW4nIH1cbiAgICAgIF0sXG4gICAgICBwb3N0Rm9udFNpemU6IDFcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXYgOnN0eWxlPVwieyBmb250U2l6ZTogcG9zdEZvbnRTaXplICsgJ2VtJyB9XCI+XG4gICAgPEJsb2dQb3N0XG4gICAgICB2LWZvcj1cInBvc3QgaW4gcG9zdHNcIlxuICAgICAgOmtleT1cInBvc3QuaWRcIlxuICAgICAgOnRpdGxlPVwicG9zdC50aXRsZVwiXG4gICAgICBAZW5sYXJnZS10ZXh0PVwicG9zdEZvbnRTaXplICs9IDAuMVwiXG4gICAgPjwvQmxvZ1Bvc3Q+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQmxvZ1Bvc3QudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcHJvcHM6IFsndGl0bGUnXSxcbiAgZW1pdHM6IFsnZW5sYXJnZS10ZXh0J11cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJibG9nLXBvc3RcIj5cblx0ICA8aDQ+e3sgdGl0bGUgfX08L2g0PlxuXHQgIDxidXR0b24gQGNsaWNrPVwiJGVtaXQoJ2VubGFyZ2UtdGV4dCcpXCI+RW5sYXJnZSB0ZXh0PC9idXR0b24+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4ifQ==)

</div>
<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5jb25zdCBwb3N0cyA9IHJlZihbXG4gIHsgaWQ6IDEsIHRpdGxlOiAnTXkgam91cm5leSB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMiwgdGl0bGU6ICdCbG9nZ2luZyB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMywgdGl0bGU6ICdXaHkgVnVlIGlzIHNvIGZ1bicgfVxuXSlcblxuY29uc3QgcG9zdEZvbnRTaXplID0gcmVmKDEpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8ZGl2IDpzdHlsZT1cInsgZm9udFNpemU6IHBvc3RGb250U2l6ZSArICdlbScgfVwiPlxuICAgIDxCbG9nUG9zdFxuICAgICAgdi1mb3I9XCJwb3N0IGluIHBvc3RzXCJcbiAgICAgIDprZXk9XCJwb3N0LmlkXCJcbiAgICAgIDp0aXRsZT1cInBvc3QudGl0bGVcIlxuICAgICAgQGVubGFyZ2UtdGV4dD1cInBvc3RGb250U2l6ZSArPSAwLjFcIlxuICAgID48L0Jsb2dQb3N0PlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkJsb2dQb3N0LnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5kZWZpbmVQcm9wcyhbJ3RpdGxlJ10pXG5kZWZpbmVFbWl0cyhbJ2VubGFyZ2UtdGV4dCddKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cImJsb2ctcG9zdFwiPlxuICAgIDxoND57eyB0aXRsZSB9fTwvaDQ+XG4gICAgPGJ1dHRvbiBAY2xpY2s9XCIkZW1pdCgnZW5sYXJnZS10ZXh0JylcIj5FbmxhcmdlIHRleHQ8L2J1dHRvbj5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPiJ9)

</div>

Nous pouvons, de manière facultative, déclarer les événements émis en utilisant <span class="options-api">l'option [`emits`](/api/options-state.html#emits)</span><span class="composition-api">[`defineEmits`](/api/sfc-script-setup#defineprops-defineemits)une macro</span> :

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

That's all you need to know about custom component events for now, but once you've finished reading this page and feel comfortable with its content, we recommend coming back later to read the full guide on [Custom Events](/guide/components/events).

## Distribution de contenu avec les slots {#content-distribution-with-slots}

Comme pour les éléments HTML, il est souvent utile de pouvoir passer du contenu à un composant, de cette manière :

```vue-html
<AlertBox>
  Something bad happened.
</AlertBox>
```

Ce qui devrait rendre :

:::danger This is an Error for Demo Purposes
Something bad happened.
:::

Cela peut être réalisé en utilisant l'élément personnalisé de Vue `<slot>` :

```vue{4}
<template>
  <div class="alert-box">
    <strong>This is an Error for Demo Purposes</strong>
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

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBBbGVydEJveCBmcm9tICcuL0FsZXJ0Qm94LnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHsgQWxlcnRCb3ggfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PEFsZXJ0Qm94PlxuICBcdFNvbWV0aGluZyBiYWQgaGFwcGVuZWQuXG5cdDwvQWxlcnRCb3g+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJBbGVydEJveC52dWUiOiI8dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJhbGVydC1ib3hcIj5cbiAgICA8c3Ryb25nPkVycm9yITwvc3Ryb25nPlxuICAgIDxici8+XG4gICAgPHNsb3QgLz5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c3R5bGUgc2NvcGVkPlxuLmFsZXJ0LWJveCB7XG4gIGNvbG9yOiAjNjY2O1xuICBib3JkZXI6IDFweCBzb2xpZCByZWQ7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgcGFkZGluZzogMjBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjhmODtcbn1cbiAgXG5zdHJvbmcge1xuXHRjb2xvcjogcmVkOyAgICBcbn1cbjwvc3R5bGU+In0=)

</div>
<div class="composition-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBBbGVydEJveCBmcm9tICcuL0FsZXJ0Qm94LnZ1ZSdcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxBbGVydEJveD5cbiAgXHRTb21ldGhpbmcgYmFkIGhhcHBlbmVkLlxuXHQ8L0FsZXJ0Qm94PlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQWxlcnRCb3gudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiYWxlcnQtYm94XCI+XG4gICAgPHN0cm9uZz5FcnJvciE8L3N0cm9uZz5cbiAgICA8YnIvPlxuICAgIDxzbG90IC8+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlIHNjb3BlZD5cbi5hbGVydC1ib3gge1xuICBjb2xvcjogIzY2NjtcbiAgYm9yZGVyOiAxcHggc29saWQgcmVkO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHBhZGRpbmc6IDIwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmOGY4Zjg7XG59XG4gIFxuc3Ryb25nIHtcblx0Y29sb3I6IHJlZDsgICAgXG59XG48L3N0eWxlPiJ9)

</div>

C'est tout ce dont vous avez besoin concernant les slots pour le moment, mais une fois que vous aurez terminé de lire cette page et vous sentirez à l'aise avec son contenu, nous vous recommandons de revenir afin de lire le guide complet sur les [Slots](/guide/components/slots).

## Composants dynamiques {#dynamic-components}

Parfois, il peut être utile d'alterner dynamiquement entre des composants, comme dans une interface avec des onglets :

<div class="options-api">

[Ouvrir l'exemple dans le Playground](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBIb21lIGZyb20gJy4vSG9tZS52dWUnXG5pbXBvcnQgUG9zdHMgZnJvbSAnLi9Qb3N0cy52dWUnXG5pbXBvcnQgQXJjaGl2ZSBmcm9tICcuL0FyY2hpdmUudnVlJ1xuICBcbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tcG9uZW50czoge1xuICAgIEhvbWUsXG4gICAgUG9zdHMsXG4gICAgQXJjaGl2ZVxuICB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50VGFiOiAnSG9tZScsXG4gICAgICB0YWJzOiBbJ0hvbWUnLCAnUG9zdHMnLCAnQXJjaGl2ZSddXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiZGVtb1wiPlxuICAgIDxidXR0b25cbiAgICAgICB2LWZvcj1cInRhYiBpbiB0YWJzXCJcbiAgICAgICA6a2V5PVwidGFiXCJcbiAgICAgICA6Y2xhc3M9XCJbJ3RhYi1idXR0b24nLCB7IGFjdGl2ZTogY3VycmVudFRhYiA9PT0gdGFiIH1dXCJcbiAgICAgICBAY2xpY2s9XCJjdXJyZW50VGFiID0gdGFiXCJcbiAgICAgPlxuICAgICAge3sgdGFiIH19XG4gICAgPC9idXR0b24+XG5cdCAgPGNvbXBvbmVudCA6aXM9XCJjdXJyZW50VGFiXCIgY2xhc3M9XCJ0YWJcIj48L2NvbXBvbmVudD5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c3R5bGU+XG4uZGVtbyB7XG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZWVlO1xuICBib3JkZXItcmFkaXVzOiAycHg7XG4gIHBhZGRpbmc6IDIwcHggMzBweDtcbiAgbWFyZ2luLXRvcDogMWVtO1xuICBtYXJnaW4tYm90dG9tOiA0MHB4O1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgb3ZlcmZsb3cteDogYXV0bztcbn1cblxuLnRhYi1idXR0b24ge1xuICBwYWRkaW5nOiA2cHggMTBweDtcbiAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogM3B4O1xuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogM3B4O1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJhY2tncm91bmQ6ICNmMGYwZjA7XG4gIG1hcmdpbi1ib3R0b206IC0xcHg7XG4gIG1hcmdpbi1yaWdodDogLTFweDtcbn1cbi50YWItYnV0dG9uOmhvdmVyIHtcbiAgYmFja2dyb3VuZDogI2UwZTBlMDtcbn1cbi50YWItYnV0dG9uLmFjdGl2ZSB7XG4gIGJhY2tncm91bmQ6ICNlMGUwZTA7XG59XG4udGFiIHtcbiAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcbiAgcGFkZGluZzogMTBweDtcbn1cbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkhvbWUudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwidGFiXCI+XG4gICAgSG9tZSBjb21wb25lbnRcbiAgPC9kaXY+XG48L3RlbXBsYXRlPiIsIlBvc3RzLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cInRhYlwiPlxuICAgIFBvc3RzIGNvbXBvbmVudFxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiQXJjaGl2ZS52dWUiOiI8dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJ0YWJcIj5cbiAgICBBcmNoaXZlIGNvbXBvbmVudFxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+In0=)

</div>
<div class="composition-api">

[Ouvrir l'exemple dans le Playground](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBIb21lIGZyb20gJy4vSG9tZS52dWUnXG5pbXBvcnQgUG9zdHMgZnJvbSAnLi9Qb3N0cy52dWUnXG5pbXBvcnQgQXJjaGl2ZSBmcm9tICcuL0FyY2hpdmUudnVlJ1xuaW1wb3J0IHsgcmVmIH0gZnJvbSAndnVlJ1xuIFxuY29uc3QgY3VycmVudFRhYiA9IHJlZignSG9tZScpXG5cbmNvbnN0IHRhYnMgPSB7XG4gIEhvbWUsXG4gIFBvc3RzLFxuICBBcmNoaXZlXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiZGVtb1wiPlxuICAgIDxidXR0b25cbiAgICAgICB2LWZvcj1cIihfLCB0YWIpIGluIHRhYnNcIlxuICAgICAgIDprZXk9XCJ0YWJcIlxuICAgICAgIDpjbGFzcz1cIlsndGFiLWJ1dHRvbicsIHsgYWN0aXZlOiBjdXJyZW50VGFiID09PSB0YWIgfV1cIlxuICAgICAgIEBjbGljaz1cImN1cnJlbnRUYWIgPSB0YWJcIlxuICAgICA+XG4gICAgICB7eyB0YWIgfX1cbiAgICA8L2J1dHRvbj5cblx0ICA8Y29tcG9uZW50IDppcz1cInRhYnNbY3VycmVudFRhYl1cIiBjbGFzcz1cInRhYlwiPjwvY29tcG9uZW50PlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+XG5cbjxzdHlsZT5cbi5kZW1vIHtcbiAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlZWU7XG4gIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgcGFkZGluZzogMjBweCAzMHB4O1xuICBtYXJnaW4tdG9wOiAxZW07XG4gIG1hcmdpbi1ib3R0b206IDQwcHg7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuICBvdmVyZmxvdy14OiBhdXRvO1xufVxuXG4udGFiLWJ1dHRvbiB7XG4gIHBhZGRpbmc6IDZweCAxMHB4O1xuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAzcHg7XG4gIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAzcHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgYmFja2dyb3VuZDogI2YwZjBmMDtcbiAgbWFyZ2luLWJvdHRvbTogLTFweDtcbiAgbWFyZ2luLXJpZ2h0OiAtMXB4O1xufVxuLnRhYi1idXR0b246aG92ZXIge1xuICBiYWNrZ3JvdW5kOiAjZTBlMGUwO1xufVxuLnRhYi1idXR0b24uYWN0aXZlIHtcbiAgYmFja2dyb3VuZDogI2UwZTBlMDtcbn1cbi50YWIge1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICBwYWRkaW5nOiAxMHB4O1xufVxuPC9zdHlsZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiSG9tZS52dWUiOiI8dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJ0YWJcIj5cbiAgICBIb21lIGNvbXBvbmVudFxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiUG9zdHMudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwidGFiXCI+XG4gICAgUG9zdHMgY29tcG9uZW50XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4iLCJBcmNoaXZlLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cInRhYlwiPlxuICAgIEFyY2hpdmUgY29tcG9uZW50XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4ifQ==)

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

## Mises en garde concernant l'analyse du template DOM {#dom-template-parsing-caveats}

Si vous écrivez vos templates Vue directement dans le DOM, Vue va devoir extraire du DOM la chaîne de caractère représentant le template. Cela entraîne quelques avertissements à cause du comportement d'analyse du HTML natif des navigateurs.

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

Dès que vous vous sentez à l'aide avec le savoir que vous venez de digérer, avancez dans le guide pour découvrir les composants en profondeur.
