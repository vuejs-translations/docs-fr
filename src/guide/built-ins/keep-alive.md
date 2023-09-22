<script setup>
import SwitchComponent from './keep-alive-demos/SwitchComponent.vue'
</script>

# KeepAlive {#keepalive}

`<KeepAlive>` est un composant natif qui nous permet de garder en cache des instances d'un composant de manière conditionnelle tout en switchant entre plusieurs composants de manière dynamique.

## Utilisation basique {#basic-usage}

Dans le chapitre sur les principes fondamentaux des composants, nous avons présenté la syntaxe pour les [Composants Dynamiques](/guide/essentials/component-basics#dynamic-components), en utilisant l'élément spécial `<component>` :

```vue-html
<component :is="activeComponent" />
```

Par défaut, une instance du composant actif est démontée lorsqu'on le change. Cela entraîne la perte de tout état modifié qu'elle comporte. Lorsque ce composant est affiché à nouveau, une nouvelle instance sera créée avec uniquement l'état initial.

Dans l'exemple ci-dessous, nous avons deux composants ayant un état - A contient un compteur, tandis que B contient un message synchronisé avec une entrée via `v-model`. Essayez de mettre à jour l'état de l'un d'entre eux, changez de page, puis revenez :

<SwitchComponent />

Vous remarquerez qu'au retour, l'état modifié précédent a été réinitialisé.

La création d'une nouvelle instance de composant lors du changement est normalement un comportement utile, mais dans ce cas, nous aimerions vraiment que les deux instances de composant soient préservées même lorsqu'elles sont inactives. Pour résoudre ce problème, nous pouvons envelopper notre composant dynamique avec le composant natif `<KeepAlive>` :

```vue-html
<!-- Les composants inactifs seront mis en cache ! -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

Maintenant, l'état sera persistant à travers les changements de composants :

<SwitchComponent use-KeepAlive />

<div class="composition-api">

[Essayer en ligne](https://play.vuejs.org/#eNqtUsFOwzAM/RWrl4IGC+cqq2h3RFw495K12YhIk6hJi1DVf8dJSllBaAJxi+2XZz8/j0lhzHboeZIl1NadMA4sd73JKyVaozsHI9hnJqV+feJHmODY6RZS/JEuiL1uTTEXtiREnnINKFeAcgZUqtbKOqj7ruPKwe6s2VVguq4UJXEynAkDx1sjmeMYAdBGDFBLZu2uShre6ioJeaxIduAyp0KZ3oF7MxwRHWsEQmC4bXXDJWbmxpjLBiZ7DwptMUFyKCiJNP/BWUbO8gvnA+emkGKIgkKqRrRWfh+Z8MIWwpySpfbxn6wJKMGV4IuSs0UlN1HVJae7bxYvBuk+2IOIq7sLnph8P9u5DJv5VfpWWLaGqTzwZTCOM/M0IaMvBMihd04ruK+lqF/8Ajxms8EFbCiJxR8khsP6ncQosLWnWV6a/kUf2nqu75Fby04chA0iPftaYryhz6NBRLjdtajpHZTWPio=)

</div>
<div class="options-api">

[Essayer en ligne](https://play.vuejs.org/#eNqtU8tugzAQ/JUVl7RKWveMXFTIseofcHHAiawasPxArRD/3rVNSEhbpVUrIWB3x7PM7jAkuVL3veNJmlBTaaFsVraiUZ22sO0alcNedw2s7kmIPHS1ABQLQDEBAMqWvwVQzffMSQuDz1aI6VreWpPCEBtsJppx4wE1s+zmNoIBNLdOt8cIjzut8XAKq3A0NAIY/QNveFEyi8DA8kZJZjlGALQWPVSSGfNYJjVvujIJeaxItuMyo6JVzoJ9VxwRmtUCIdDfNV3NJWam5j7HpPOY8BEYkwxySiLLP1AWkbK4oHzmXOVS9FFOSM3jhFR4WTNfRslcO54nSwJKcCD4RsnZmJJNFPXJEl8t88quOuc39fCrHalsGyWcnJL62apYNoq12UQ8DLEFjCMy+kKA7Jy1XQtPlRTVqx+Jx6zXOJI1JbH4jejg3T+KbswBzXnFlz9Tjes/V/3CjWEHDsL/OYNvdCE8Wu3kLUQEhy+ljh+brFFu)

</div>

:::tip
Lorsqu'il est utilisé dans les [templates du DOM](/guide/essentials/component-basics#in-dom-template-parsing-caveats), il doit être référencé comme `<keep-alive>`.
:::

## Include / Exclude {#include-exclude}

Par défaut, `<KeepAlive>` va mettre en cache toute instance de composant qu'il contient. Nous pouvons personnaliser ce comportement via les props `include` et `exclude`. Ces deux options peuvent être une chaîne de caractères délimitée par des virgules, une `RegExp`, ou un tableau contenant l'un ou l'autre type :

```vue-html
<!-- chaîne de caractères délimitée par des virgules -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- regex (utilisez `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- Tableau (utilisez `v-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

La correspondance se fait par rapport à l'option [`name`](/api/options-misc#name) du composant, de sorte que les composants qui doivent être mis en cache de manière conditionnelle par `KeepAlive` doivent déclarer explicitement une option `name`.

:::tip
Depuis la version 3.2.34, un composant monofichier utilisant `<script setup>` déduira automatiquement son option `name` en fonction du nom du fichier, supprimant ainsi le besoin de déclarer manuellement le nom.
:::

## Maximum d'instances mises en cache {#max-cached-instances}

Nous pouvons limiter le nombre maximum d'instances de composants qui peuvent être mises en cache via la prop `max`. Lorsque `max` est spécifié, `<KeepAlive>` se comporte comme un [cache LRU](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)>) : si le nombre d'instances mises en cache est sur le point de dépasser le nombre maximum spécifié, l'instance mise en cache la moins récemment activée sera détruite pour faire place à la nouvelle.

```vue-html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## Cycle de vie des instances mises en cache {#lifecycle-of-cached-instance}

Lorsqu'une instance de composant est supprimée du DOM mais fait partie d'un arbre de composants mis en cache par `<KeepAlive>`, elle passe dans un état **désactivé** au lieu d'être démontée. Lorsqu'une instance de composant est insérée dans le DOM en tant que partie d'un arbre mis en cache, elle est **activée**.

<div class="composition-api">

Un composant maintenu en vie peut enregistrer des hooks de cycle de vie pour ces deux états en utilisant [`onActivated()`](/api/composition-api-lifecycle#onactivated) et [`onDeactivated()`](/api/composition-api-lifecycle#ondeactivated) :

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // appelé au premier montage
  // et à chaque fois qu'il est réinséré depuis le cache
})

onDeactivated(() => {
  // appelé lorsqu'il est retiré du DOM et mis en cache
  // et également lorsqu'il est démonté
})
</script>
```

</div>
<div class="options-api">

Un composant maintenu en vie peut enregistrer des hooks de cycle de vie pour ces deux états en utilisant les hooks [`activated`](/api/options-lifecycle#activated) et [`deactivated`](/api/options-lifecycle#deactivated) :

```js
export default {
  activated() {
    // appelé au premier montage
    // et à chaque fois qu'il est réinséré depuis le cache
  },
  deactivated() {
    // appelé lorsqu'il est retiré du DOM et mis en cache
    // et également lorsqu'il est démonté
  }
}
```

</div>

Notez que :

- <span class="composition-api">`onActivated`</span><span class="options-api">`activated`</span> est également appelé au montage, et <span class="composition-api">`onDeactivated`</span><span class="options-api">`deactivated`</span> au démontage.

- Les deux hooks fonctionnent non seulement pour le composant racine mis en cache par `<KeepAlive>`, mais aussi pour les composants enfants dans l'arbre mis en cache.

---

**Référence**

- [Référence de l'API `<KeepAlive>`](/api/built-in-components#keepalive)
