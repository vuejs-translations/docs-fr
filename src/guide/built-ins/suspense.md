---
outline: deep
---

# Suspense {#suspense}

:::warning Fonctionnalité expérimentale
`<Suspense>` est une fonctionnalité expérimentale. Il n'est pas garanti qu'elle atteigne un statut stable et l'API peut changer avant ce stade.
:::

`<Suspense>` est un composant natif pour orchestrer les dépendances asynchrones dans un arbre de composants. Il peut assurer le rendu d'un état de chargement en attendant que les multiples dépendances asynchrones imbriquées dans l'arbre de composants soient résolues.

## Dépendances asynchrones {#async-dependencies}

Pour expliquer le problème que `<Suspense>` essaie de résoudre et comment il interagit avec ces dépendances asynchrones, imaginons une hiérarchie de composants comme celle qui suit :

```
<Suspense>
└─ <Dashboard>
   ├─ <Profile>
   │  └─ <FriendStatus> (composant avec un setup() asynchrone)
   └─ <Content>
      ├─ <ActivityFeed> (composant asynchrone)
      └─ <Stats> (composant asynchrone)
```

Dans l'arbre des composants, il y a plusieurs composants imbriqués dont le rendu dépend d'une ressource asynchrone qui doit d'abord être résolue. Sans `<Suspense>`, chacun d'entre eux devra gérer son propre chargement, ses erreurs, et ses états de chargement. Dans le pire des cas, nous pourrions voir trois roues de chargement sur la page, avec un contenu qui s'affiche à des moments différents.

Le composant `<Suspense>` nous donne la possibilité d'afficher des états de chargement/erreur de haut niveau pendant que nous attendons que ces dépendances asynchrones imbriquées soient résolues.

Il existe deux types de dépendances asynchrones pour lesquelles `<Suspense>` peut attendre :

1. Les composants avec un hook `setup()` asynchrone. Cela inclut les composants utilisant `<script setup>` avec des expressions `await` de haut niveau.

2. [Les composants asynchrones](/guide/components/async).

### `async setup()` {#async-setup}

Le hook `setup()` d'un composant utilisé avec la Composition API peut être asynchrone :

```js
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
```

Si vous utilisez `<script setup>`, la présence d'expressions `await` de haut niveau fait automatiquement du composant une dépendance asynchrone :

```vue
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
```

### Composants asynchrones {#async-components}

Les composants asynchrones sont, par défaut,  **"suspensibles "**. Cela signifie que s'il a un `<Suspense>` dans la chaîne parentale, un composant asynchrone sera traité comme une dépendance asynchrone de ce `<Suspense>`. Dans ce cas, l'état de chargement sera contrôlé par le `<Suspense>`, et les options de chargement, d'erreur, de délai et de temporisation propres au composant seront ignorées.

Le composant asynchrone peut désactiver le contrôle de `Suspense` et laisser le composant contrôler son propre état de chargement en spécifiant `suspensible : false` dans ses options.

## État de chargement {#loading-state}

Le composant `<Suspense>` possède deux slots : `#default` et `#fallback`. Les deux slots n'acceptent qu'un seul nœud comme enfant direct. Le nœud dans le slot par défaut est affiché si cela est possible. Sinon, le nœud dans le slot de secours sera affiché.

```vue-html
<Suspense>
  <!-- composant avec des dépendances asynchrones imbriquées -->
  <Dashboard />

  <!-- état de chargement via le slot #fallback -->
  <template #fallback>
    Loading...
  </template>
</Suspense>
```

Lors du rendu initial, `<Suspense>` rendra le contenu de son slot par défaut en mémoire. Si des dépendances asynchrones sont rencontrées pendant le processus, il entrera dans un état d'**attente**. Pendant l'état d'attente, le contenu de secours sera affiché. Lorsque toutes les dépendances asynchrones rencontrées sont résolues, `<Suspense>` entre dans un état **résolu** et le contenu résolu du slot par défaut est affiché.

Si aucune dépendance asynchrone n'a été rencontrée lors du rendu initial, `<Suspense>` passera directement dans un état résolu.

Une fois dans un état résolu, `<Suspense>` ne reviendra à un état d'attente que si le nœud racine du slot `#default` est remplacé. Les nouvelles dépendances asynchrones imbriquées plus profondément dans l'arbre ne feront **pas** repasser le `<Suspense>` à l'état d'attente.

Lorsqu'il y a un retour en arrière, le contenu de secours ne sera pas immédiatement affiché. À la place, `<Suspense>` affichera le contenu `#default` précédent en attendant que le nouveau contenu et ses dépendances asynchrones soient résolus. Ce comportement peut être configuré avec la prop `timeout` : `<Suspense>` basculera vers un contenu de secours si le rendu du nouveau contenu par défaut prend plus de temps que la valeur de `timeout`. Une valeur de `timeout` de `0` fera que le contenu de secours sera affiché immédiatement lorsque le contenu par défaut sera remplacé.

## Événements {#events}

Le composant `<Suspense>` émet trois événements : `pending`, `resolve` et `fallback`. L'événement `pending` est émis lorsqu'on entre dans un état d'attente. L'événement `resolve` est émis lorsqu'un nouveau contenu a fini d'être résolu dans le slot `default`. L'événement `fallback` est émis lorsque le contenu du slot `fallback` est affiché.

Les événements peuvent être utilisés, par exemple, pour afficher un indicateur de chargement au niveau de l'ancien DOM pendant le chargement des nouveaux composants.

## Gestion des erreurs {#error-handling}

Il n'y a actuellement pas de gestion des erreurs fournie par `<Suspense>` lui même - cependant, vous pouvez utiliser l'option [`errorCaptured`](/api/options-lifecycle#errorcaptured) ou le hook [`onErrorCaptured()`](/api/composition-api-lifecycle#onerrorcaptured) pour intercepter et gérer les erreurs asynchrones dans le composant parent de `<Suspense>`.

## Combinaison avec d'autres composants {#combining-with-other-components}

Il est courant de vouloir utiliser `<Suspense>` en combinaison avec les composants [`<Transition>`](./transition) et [`<KeepAlive>`](./keep-alive). L'ordre d'imbrication de ces composants est important pour qu'ils fonctionnent tous correctement.

De plus, ces composants sont souvent utilisés en association avec le composant `<RouterView>` de [Vue Router](https://router.vuejs.org/).

L'exemple suivant montre comment imbriquer ces composants afin qu'ils se comportent tous comme prévu. Pour des combinaisons plus simples, vous pouvez supprimer les composants dont vous n'avez pas besoin :

```vue-html
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- contenu principal -->
          <component :is="Component"></component>

          <!-- état de chargement -->
          <template #fallback>
            Loading...
          </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
```

Vue Router supporte nativement les [composants chargés de manière paresseuse](https://router.vuejs.org/guide/advanced/lazy-loading.html) via l'utilisation des importations dynamiques. Ceux-ci sont distincts des composants asynchrones et, actuellement, ils ne déclenchent pas `<Suspense>`. Cependant, ils peuvent toujours avoir des composants asynchrones comme descendants et ceux-ci peuvent déclencher `<Suspense>` normalement.

## Suspense imbriqué {#nested-suspense}

- Supporté à partir de la version 3.3

Lorsque nous avons plusieurs composants asynchrones (ce qui est courant pour les routes imbriquées ou basées sur la mise en page) comme ceci :

```vue-html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <component :is="DynamicAsyncInner" />
  </component>
</Suspense>
```

`<Suspense>` crée une frontière qui résoudra tous les composants asynchrones en bas de l'arbre, comme prévu. Cependant, lorsque nous modifions `DynamicAsyncOuter`, `<Suspense>` l'attend correctement, mais lorsque nous modifions `DynamicAsyncInner`, `DynamicAsyncInner` imbriqué rend un noeud vide jusqu'à ce qu'il soit résolu (au lieu du noeud précédent ou du slot de repli).

Pour résoudre ce problème, nous pourrions avoir un suspense imbriqué pour gérer le correctif pour le composant imbriqué, comme par exemple :

```vue-html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <Suspense suspensible> <!-- this -->
      <component :is="DynamicAsyncInner" />
    </Suspense>
  </component>
</Suspense>
```

Si vous ne définissez pas la prop `suspensible`, le `<Suspense>` interne sera traité comme un composant sync par le parent `<Suspense>`. Cela signifie qu'il a son propre slot de repli et que si les deux composants `Dynamic` changent en même temps, il pourrait y avoir des noeuds vides et de multiples cycles de correction pendant que l'enfant `<Suspense>` charge son propre arbre de dépendance, ce qui n'est pas forcément souhaitable. Quand il est défini, toute la gestion asynchrone des dépendances est donnée au parent `<Suspense>` (y compris les événements émis) et le `<Suspense>` intérieur sert uniquement de frontière pour la résolution des dépendances et le patching.

---

**Référence**

- [Référence de l'API `<Suspense>`](/api/built-in-components#suspense)
