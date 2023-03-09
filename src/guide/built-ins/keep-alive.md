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

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHNoYWxsb3dSZWYgfSBmcm9tICd2dWUnXG5pbXBvcnQgQ29tcEEgZnJvbSAnLi9Db21wQS52dWUnXG5pbXBvcnQgQ29tcEIgZnJvbSAnLi9Db21wQi52dWUnXG5cbmNvbnN0IGN1cnJlbnQgPSBzaGFsbG93UmVmKENvbXBBKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cImRlbW9cIj5cbiAgICA8bGFiZWw+PGlucHV0IHR5cGU9XCJyYWRpb1wiIHYtbW9kZWw9XCJjdXJyZW50XCIgOnZhbHVlPVwiQ29tcEFcIiAvPiBBPC9sYWJlbD5cbiAgICA8bGFiZWw+PGlucHV0IHR5cGU9XCJyYWRpb1wiIHYtbW9kZWw9XCJjdXJyZW50XCIgOnZhbHVlPVwiQ29tcEJcIiAvPiBCPC9sYWJlbD5cbiAgICA8S2VlcEFsaXZlPlxuICAgICAgPGNvbXBvbmVudCA6aXM9XCJjdXJyZW50XCI+PC9jb21wb25lbnQ+XG4gICAgPC9LZWVwQWxpdmU+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cbiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJDb21wQS52dWUiOiI8c2NyaXB0IHNldHVwPlxuaW1wb3J0IHsgcmVmIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBjb3VudCA9IHJlZigwKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPHA+Q3VycmVudCBjb21wb25lbnQ6IEE8L3A+XG4gIDxzcGFuPmNvdW50OiB7eyBjb3VudCB9fTwvc3Bhbj5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJjb3VudCsrXCI+KzwvYnV0dG9uPlxuPC90ZW1wbGF0ZT5cbiIsIkNvbXBCLnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5pbXBvcnQgeyByZWYgfSBmcm9tICd2dWUnXG5jb25zdCBtc2cgPSByZWYoJycpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5DdXJyZW50IGNvbXBvbmVudDogQjwvcD5cbiAgPHNwYW4+TWVzc2FnZSBpczoge3sgbXNnIH19PC9zcGFuPlxuICA8aW5wdXQgdi1tb2RlbD1cIm1zZ1wiPlxuPC90ZW1wbGF0ZT5cbiJ9)

</div>
<div class="options-api">

[Essayer en ligne](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBDb21wQSBmcm9tICcuL0NvbXBBLnZ1ZSdcbmltcG9ydCBDb21wQiBmcm9tICcuL0NvbXBCLnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHsgQ29tcEEsIENvbXBCIH0sXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnQ6ICdDb21wQSdcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJkZW1vXCI+XG4gICAgPGxhYmVsPjxpbnB1dCB0eXBlPVwicmFkaW9cIiB2LW1vZGVsPVwiY3VycmVudFwiIHZhbHVlPVwiQ29tcEFcIiAvPiBBPC9sYWJlbD5cbiAgICA8bGFiZWw+PGlucHV0IHR5cGU9XCJyYWRpb1wiIHYtbW9kZWw9XCJjdXJyZW50XCIgdmFsdWU9XCJDb21wQlwiIC8+IEI8L2xhYmVsPlxuICAgIDxLZWVwQWxpdmU+XG4gICAgICA8Y29tcG9uZW50IDppcz1cImN1cnJlbnRcIj48L2NvbXBvbmVudD5cbiAgICA8L0tlZXBBbGl2ZT5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuIiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkNvbXBBLnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvdW50OiAwXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5DdXJyZW50IGNvbXBvbmVudDogQTwvcD5cbiAgPHNwYW4+Y291bnQ6IHt7IGNvdW50IH19PC9zcGFuPlxuICA8YnV0dG9uIEBjbGljaz1cImNvdW50KytcIj4rPC9idXR0b24+XG48L3RlbXBsYXRlPlxuIiwiQ29tcEIudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbXNnOiAnJ1xuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cblxuPHRlbXBsYXRlPlxuICA8cD5DdXJyZW50IGNvbXBvbmVudDogQjwvcD5cbiAgPHNwYW4+TWVzc2FnZSBpczoge3sgbXNnIH19PC9zcGFuPlxuICA8aW5wdXQgdi1tb2RlbD1cIm1zZ1wiPlxuPC90ZW1wbGF0ZT5cbiJ9)

</div>

:::tip
Lorsqu'il est utilisé dans les [templates du DOM](/guide/essentials/component-basics#dom-template-parsing-caveats), il doit être référencé comme `<keep-alive>`.
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
