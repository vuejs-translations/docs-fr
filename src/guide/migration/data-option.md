---
title: Option de données
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## Aperçu

- **BREAKING** : La déclaration de l'option du composant `data` n'accepte plus un simple `objet` JavaScript et attend une déclaration de `fonction`.

- **BREAKING** : lors de la fusion de plusieurs valeurs de retour `data` provenant de mixins ou extends, la fusion est maintenant peu profonde au lieu d'être profonde (seules les propriétés de niveau racine sont fusionnées).

## 2.x Syntax

En 2.x, les développeurs pouvaient définir l'option `data` avec un `objet` ou une `fonction`.

Par exemple :

```html
<!-- Object Declaration -->
<script>
  const app = new Vue({
    data: {
      apiKey: 'a1b2c3'
    }
  })
</script>

<!-- Déclaration de fonction -->
<script>
  const app = new Vue({
    data() {
      return {
        apiKey: 'a1b2c3'
      }
    }
  })
</script>
```

Bien que cela ait apporté une certaine commodité en termes d'instances racines ayant un état partagé, cela a conduit à une confusion due au fait que cela n'est possible que sur l'instance racine.

## 3.x Update

En 3.x, l'option `data` a été standardisée pour n'accepter qu'une `fonction` qui retourne un `objet`.

En utilisant l'exemple ci-dessus, il n'y aurait qu'une seule implémentation possible du code :

```html
<script>
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        apiKey: 'a1b2c3'
      }
    }
  }).mount('#app')
</script>
```

## Changement de comportement pour la fusion des mixins

De plus, lorsque `data()` d'un composant et de ses mixins ou extends base sont fusionnés, la fusion est maintenant effectuée *shallowly* :

```js
const Mixin = {
  data() {
    return {
      user: {
        name: 'Jack',
        id: 1
      }
    }
  }
}

const CompA = {
  mixins: [Mixin],
  data() {
    return {
      user: {
        id: 2
      }
    }
  }
}
```

Dans Vue 2.x, le résultat de `$data` est :

```json
{
  user: {
    id: 2,
    name: 'Jack'
  }
}
```

En 3.0, le résultat sera :

```json
{
  user: {
    id: 2
  }
}
```

## Stratégie de migration

Pour les utilisateurs s'appuyant sur la déclaration d'objet, nous recommandons :

- D'extraire les données partagées dans un objet externe et de les utiliser comme propriété dans `data`.
- Réécrire les références aux données partagées pour pointer vers un nouvel objet partagé.

Pour les utilisateurs qui s'appuient sur le comportement de fusion profonde des mixins, nous recommandons de remanier votre code pour éviter complètement cette dépendance, car les fusions profondes des mixins sont très implicites et peuvent rendre la logique du code plus difficile à comprendre et à déboguer.
