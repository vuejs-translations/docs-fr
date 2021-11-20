---
badges:
  - breaking
---

# API de la fonction de rendu <MigrationBadges :badges="$frontmatter.badges" />

## Vue d'ensemble

Ce changement n'affectera pas les utilisateurs de `<template>`.

Voici un résumé rapide de ce qui a changé :

- `h` est maintenant importé globalement au lieu d'être passé comme argument aux fonctions de rendu.
- Les arguments des fonctions de rendu ont été modifiés afin d'être plus cohérents entre les composants à état et fonctionnels.
- Les VNodes ont maintenant une structure de props plate.

Pour plus d'informations, lisez la suite !

## Argument de la fonction de rendu

### Syntaxe 2.x

En 2.x, la fonction `render` recevait automatiquement la fonction `h` (qui est un alias conventionnel pour `createElement`) comme argument :

```js
// Vue 2 Render Function Example
export default {
  render(h) {
    return h('div')
  }
}
```

### Syntaxe 3.x

En 3.x, `h` est maintenant importé globalement au lieu d'être passé automatiquement comme argument.

```js
// Exemple de fonction de rendu de Vue 3
import { h } from 'vue'

export default {
  render() {
    return h('div')
  }
}
```

### Modification de la signature de la fonction de rendu

### Syntaxe 2.x

En 2.x, la fonction `render` recevait automatiquement des arguments tels que `h`.

```js
// Exemple de fonction de rendu de Vue 2
export default {
  render(h) {
    return h('div')
  }
}
```

### Syntaxe 3.x

En 3.x, puisque la fonction `render` ne reçoit plus d'arguments, elle sera principalement utilisée à l'intérieur de la fonction `setup()`. Cela présente l'avantage supplémentaire d'avoir accès à l'état réactif et aux fonctions déclarées dans la portée, ainsi qu'aux arguments passés à `setup()`.

```js
import { h, reactive } from 'vue'

export default {
  setup(props, { slots, attrs, emit }) {
    const state = reactive({
      count: 0
    })

    function increment() {
      state.count++
    }

    // retour de la fonction de rendu
    return () =>
      h(
        'div',
        {
          onClick: increment
        },
        state.count
      )
  }
}
```

Pour plus d'informations sur le fonctionnement de `setup()`, consultez notre [Guide de l'API de composition](/guide/composition-api-introduction.html).

## Format des props VNode

### Syntaxe 2.x

En 2.x, `domProps` contenait une liste imbriquée dans les props VNode :

```js
// 2.x
{
  staticClass: 'button',
  class: {'is-outlined': isOutlined },
  staticStyle: { color: '#34495E' },
  style: { backgroundColor: buttonColor },
  attrs: { id: 'submit' },
  domProps: { innerHTML: '' },
  on: { click: submitForm },
  key: 'submit-button'
}
```

### Syntaxe 3.x

Dans la version 3.x, la structure entière des props VNode est aplatie. En utilisant l'exemple ci-dessus, voici à quoi cela ressemblerait maintenant.

```js
// 3.x Syntax
{
  class: ['button', { 'is-outlined': isOutlined }],
  style: [{ color: '#34495E' }, { backgroundColor: buttonColor }],
  id: 'submit',
  innerHTML: '',
  onClick: submitForm,
  key: 'submit-button'
}
```

### Composant enregistré

### Syntaxe 2.x

En 2.x, lorsqu'un composant a été enregistré, la fonction de rendu fonctionne bien lorsqu'on passe le nom du composant comme chaîne de caractères au premier argument :

```js
// 2.x
Vue.component('button-counter', {
  data() {
    return {
      count: 0
    }
  }
  template: `
    <button @click="count++">
      Clicked {{ count }} times.
    </button>
  `
})

export default {
  render(h) {
    return h('button-counter')
  }
}
```

### Syntaxe 3.x

En 3.x, les VNodes étant sans contexte, nous ne pouvons plus utiliser une chaîne d'ID pour rechercher implicitement les composants enregistrés. A la place, nous devons utiliser une méthode importée `resolveComponent` :

```js
// 3.x
import { h, resolveComponent } from 'vue'

export default {
  setup() {
    const ButtonCounter = resolveComponent('button-counter')
    return () => h(ButtonCounter)
  }
}
```

Pour plus d'informations, voir [Modification du RFC de l'Api Render Function](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0008-render-function-api-change.md#context-free-vnodes).

## Stratégie de migration

### Auteurs de la bibliothèque

L'importation globale de `h` signifie que toute bibliothèque contenant des composants Vue devra inclure `import { h } from 'vue'` quelque part. Par conséquent, cela crée un peu de surcharge car les auteurs de bibliothèques doivent configurer correctement l'externalisation de Vue dans leur configuration de construction :

- Vue ne doit pas être intégré à la bibliothèque.
- Pour les modules, l'importation doit être laissée de côté et être gérée par le bundler de l'utilisateur final.
- Pour les constructions UMD / navigateur, l'importation doit d'abord essayer le fichier global Vue.h et se rabattre sur les appels require.

## Prochaines étapes

Voir le [Guide de la fonction de rendu](/guide/render-function) pour une documentation plus détaillée !
