---
badges:
  - breaking
---

# `v-model` <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

En termes de ce qui a changé, à un niveau élevé :

- **BREAKING:** Lorsqu'ils sont utilisés sur des composants personnalisés, les noms par défaut des prop et des événements de `v-model` sont modifiés :
  - prop : `value` -> `modelValue` ;
  - événement : `input` -> `update:modelValue` ;
- **BREAKING:** Le modificateur `.sync` de `v-bind` et l'option `model` du composant sont supprimés et remplacés par un argument sur `v-model` ;
- **NEW:** Il est maintenant possible d'avoir plusieurs liaisons `v-model` sur le même composant ;
- **NEW : ** Ajout de la possibilité de créer des modificateurs `v-model` personnalisés.

Pour plus d'informations, lisez la suite !

## Introduction

Lorsque Vue 2.0 est sorti, la directive `v-model` demandait aux développeurs de toujours utiliser la prop `value`. Et si les développeurs avaient besoin d'accessoires différents à des fins différentes, ils devaient recourir à `v-bind.sync`. De plus, cette relation codée en dur entre `v-model` et `value` entraînait des problèmes de gestion des éléments natifs et des éléments personnalisés.

En 2.2, nous avons introduit l'option de composant `model` qui permet au composant de personnaliser la prop et l'événement à utiliser pour `v-model`. Cependant, cela ne permettait qu'un seul `v-model` d'être utilisé sur le composant.

Avec Vue 3, l'API pour la liaison de données bidirectionnelle est normalisée afin de réduire la confusion et de permettre aux développeurs une plus grande flexibilité avec la directive `v-model`.

## Syntaxe 2.x

En 2.x, utiliser un `v-model` sur un composant était équivalent à passer une `value` à la prop et à émettre un événement `input` :

```html
<ChildComponent v-model="pageTitle" />

<!-- serait un raccourci pour : -->

<ChildComponent :value="pageTitle" @input="pageTitle = $event" />
```

Si nous voulions changer les noms de prop ou d'événement en quelque chose de différent, nous devrions ajouter une option `model` au composant `ChildComponent` :

```html
<!-- ParentComponent.vue -->

<ChildComponent v-model="pageTitle" />
```

```js
// ChildComponent.vue

export default {
  model: {
    prop: 'title',
    event: 'change'
  },
  props: {
    // cela permet d'utiliser l'accessoire `value` dans un autre but.
    value: String,
    // utiliser `title` comme prop qui prend la place de `value`.
    title: {
      type: String,
      default: 'Default title'
    }
  }
}
```

Donc, `v-model` dans ce cas serait un raccourci pour

```html
<ChildComponent :title="pageTitle" @change="pageTitle = $event" />
```

### Utiliser `v-bind.sync`

Dans certains cas, nous pouvons avoir besoin d'une "liaison bidirectionnelle" pour une prop (parfois en plus du `v-model` existant pour la prop différente). Pour ce faire, nous avons recommandé d'émettre des événements dans le modèle de `update:myPropName`. Par exemple, pour le `ChildComponent` de l'exemple précédent avec la prop `title`, nous pourrions communiquer l'intention d'assigner une nouvelle valeur avec :

```js
this.$emit('update:title', newValue)
```

Le parent peut alors écouter cet événement et mettre à jour une propriété de données locales, s'il le souhaite. Par exemple :

```html
<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
```

Pour des raisons de commodité, nous avions un raccourci pour ce modèle avec le modificateur .sync :

```html
<ChildComponent :title.sync="pageTitle" />
```

## Syntaxe 3.x

En 3.x, `v-model` sur le composant personnalisé est équivalent à passer une prop `modelValue` et à émettre un événement `update:modelValue` :

```html
<ChildComponent v-model="pageTitle" />

<!-- serait un raccourci pour : -->

<ChildComponent
  :modelValue="pageTitle"
  @update:modelValue="pageTitle = $event"
/>
```

### Les arguments de `v-model`

Pour changer le nom d'un modèle, au lieu d'une option du composant `model`, nous pouvons maintenant passer un _argument_ à `v-model` :

```html
<ChildComponent v-model:title="pageTitle" />

<!-- serait un raccourci pour : -->

<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
```

![v-bind anatomy](/images/v-bind-instead-of-sync.png)

Cela sert également à remplacer le modificateur `.sync` et nous permet d'avoir plusieurs `v-model`s sur le composant personnalisé.

```html
<ChildComponent v-model:title="pageTitle" v-model:content="pageContent" />

<!-- serait un raccourci pour : -->

<ChildComponent
  :title="pageTitle"
  @update:title="pageTitle = $event"
  :content="pageContent"
  @update:content="pageContent = $event"
/>
```

### Les modificateurs de `v-model`.

En plus des modificateurs `v-model` codés en dur dans la version 2.x comme `.trim`, la version 3.x supporte maintenant les modificateurs personnalisés :

```html
<ChildComponent v-model.capitalize="pageTitle" />
```

Pour en savoir plus sur les modificateurs de `v-model` personnalisés, consultez la section [Événements personnalisés](../component-custom-events.html#gestion-des-modificateurs-de-v-model).

## Stratégie de migration

Nous vous recommandons :

- de vérifier dans votre codebase l'utilisation de `.sync` et de le remplacer par `v-model` :

  ```html
  <ChildComponent :title.sync="pageTitle" />

  <!-- à remplacer par -->

  <ChildComponent v-model:title="pageTitle" />
  ```

- pour tous les `v-model` sans arguments, assurez-vous de changer le nom des props et des événements en `modelValue` et `update:modelValue` respectivement

  ```html
  <ChildComponent v-model="pageTitle" />
  ```

  ```js
  // ChildComponent.vue

  export default {
    props: {
      modelValue: String // était auparavant `value : Chaîne ".
    },
    emits: ['update:modelValue'],
    methods: {
      changePageTitle(title) {
        this.$emit('update:modelValue', title) // était auparavant `this.$emit('input', title)`.
      }
    }
  }
  ```

## Prochaines étapes

Pour plus d'informations sur la nouvelle syntaxe `v-model`, voir :

- [Utilisation de `v-model` sur les composants](../component-basics.html#utilisation-de-v-model-sur-les-composants)
- [Arguments de `v-model`](../component-custom-events.html#arguments-de-v-model)
- [Manipulation des modificateurs de `v-model`](../component-custom-events.html#arguments-de-v-model)
