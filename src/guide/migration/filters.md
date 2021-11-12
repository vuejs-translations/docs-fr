---
badges:
  - removed
---

# Filtres <MigrationBadges :badges="$frontmatter.badges" />

## Vue

Les filtres sont supprimés de Vue 3.0 et ne sont plus pris en charge.

## Syntaxe 2.x

Dans la version 2.x, les développeurs pouvaient utiliser des filtres afin d'appliquer une mise en forme commune du texte.

Par exemple :

```html
<template>
  <h1>Bank Account Balance</h1>
  <p>{{ accountBalance | currencyUSD }}</p>
</template>

<script>
  export default {
    props: {
      accountBalance: {
        type: Number,
        required: true
      }
    },
    filters: {
      currencyUSD(value) {
        return '$' + value
      }
    }
  }
</script>
```

Bien que cela semble pratique, cela nécessite une syntaxe personnalisée qui rompt avec l'hypothèse selon laquelle les expressions à l'intérieur des accolades sont "simplement JavaScript", ce qui entraîne des coûts d'apprentissage et de mise en œuvre.

## Mise à jour 3.x

Dans la version 3.x, les filtres sont supprimés et ne sont plus pris en charge. Nous recommandons plutôt de les remplacer par des appels de méthode ou des propriétés calculées.

En utilisant l'exemple ci-dessus, voici un exemple de la façon dont cela pourrait être mis en œuvre.

```html
<template>
  <h1>Bank Account Balance</h1>
  <p>{{ accountInUSD }}</p>
</template>

<script>
  export default {
    props: {
      accountBalance: {
        type: Number,
        required: true
      }
    },
    computed: {
      accountInUSD() {
        return '$' + this.accountBalance
      }
    }
  }
</script>
```

## Stratégie de migration

Au lieu d'utiliser des filtres, nous recommandons de les remplacer par des propriétés ou des méthodes calculées.

### Filtres globaux

Si vous utilisez des filtres qui ont été enregistrés globalement et qui sont ensuite utilisés dans toute votre application, il n'est probablement pas pratique de les remplacer par des propriétés ou des méthodes calculées dans chaque composant individuel.

Au lieu de cela, vous pouvez mettre vos filtres globaux à la disposition de tous les composants via [globalProperties](../../api/application-config.html#globalproperties) :

```javascript
// main.js
const app = createApp(App)

app.config.globalProperties.$filters = {
  currencyUSD(value) {
    return '$' + value
  }
}
```

Ensuite, vous pouvez fixer tous les modèles en utilisant cet objet `$filters` comme ceci :

```html
<template>
  <h1>Bank Account Balance</h1>
  <p>{{ $filters.currencyUSD(accountBalance) }}</p>
</template>
```

Notez qu'avec cette approche, vous ne pouvez utiliser que des méthodes, et non des propriétés calculées, car ces dernières n'ont de sens que lorsqu'elles sont définies dans le contexte d'un composant individuel.
