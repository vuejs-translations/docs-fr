---
badges:
  - breaking
---

# Comportement de coercition des attributs <MigrationBadges :badges="$frontmatter.badges" />

::: info Info
Il s'agit d'un changement d'API interne de bas niveau qui n'affecte pas la plupart des développeurs.
:::

## Aperçu

Voici un résumé de haut niveau des changements :

- Abandonner le concept interne d'attributs énumérés et traiter ces attributs de la même manière que les attributs non booléens normaux.
- **BREAKING** : Ne supprime plus l'attribut si la valeur est booléenne `false`. A la place, il est défini comme attr="false". Pour supprimer l'attribut, utilisez `null` ou `undefined`.

Pour plus d'informations, lisez la suite !

## 2.x Syntax

En 2.x, nous avions les stratégies suivantes pour contraindre les valeurs `v-bind` :

- Pour certaines paires attribut/élément, Vue utilise toujours l'attribut IDL correspondant (propriété) : [comme `value` of `<input>`, `<select>`, `<progress>`, etc](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L11-L18).

- Pour "[attributs booléens](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L33-L40)" et [xlinks](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L44-L46), Vue les supprime s'ils sont "falsy". ([`undefined`, `null` or `false`](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L52-L54)) et les ajoute sinon (voir [ici])(https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/runtime/modules/attrs.js#L66-L77) et [ici](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/runtime/modules/attrs.js#L81-L85)).

- Pour "[enumerated attributes](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L20)" (actuellement `contenteditable`, `draggable` et `spellcheck`), Vue essaie de [contraindre](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L24-L31) en chaîne (avec un traitement spécial pour `contenteditable` pour l'instant, afin de corriger [vuejs/vue#9397].(https://github.com/vuejs/vue/issues/9397)).

- Pour les autres attributs, nous supprimons les valeurs "fausses" (`undefined`, `null`, ou `false`) et définissons les autres valeurs telles quelles (voir [ici]).(https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/runtime/modules/attrs.js#L92-L113)).

Le tableau suivant décrit comment Vue coerce les "attributs énumérés" différemment des attributs non booléens normaux :

| Binding expression  | `foo` <sup>normal</sup> | `draggable` <sup>enumerated</sup> |
| ------------------- | ----------------------- | --------------------------------- |
| `:attr="null"`      | /                       | `draggable="false"`               |
| `:attr="undefined"` | /                       | /                                 |
| `:attr="true"`      | `foo="true"`            | `draggable="true"`                |
| `:attr="false"`     | /                       | `draggable="false"`               |
| `:attr="0"`         | `foo="0"`               | `draggable="true"`                |
| `attr=""`           | `foo=""`                | `draggable="true"`                |
| `attr="foo"`        | `foo="foo"`             | `draggable="true"`                |
| `attr`              | `foo=""`                | `draggable="true"`                |

Nous pouvons voir dans le tableau ci-dessus que l'implémentation actuelle convertit `true` en `'true'` mais supprime l'attribut s'il est `false`. Cela entraîne également des incohérences et oblige les utilisateurs à convertir manuellement les valeurs booléennes en chaînes de caractères dans des cas d'utilisation très courants comme les attributs `aria-*` tels que `aria-selected`, `aria-hidden`, etc.

## 3.x Syntax

Nous avons l'intention d'abandonner ce concept interne d'"attributs énumérés" et de les traiter comme des attributs HTML non booléens normaux.

- Cela résout l'incohérence entre les attributs non booléens normaux et les "attributs énumérés".
- Cela permet également d'utiliser des valeurs autres que ``true'`` et ``false'``, ou même des mots-clés à venir, pour des attributs comme ``contentable``.

Pour les attributs non booléens, Vue arrêtera de les supprimer s'ils sont `false` et les contraindra à `'false'` à la place.

- Cela résout l'incohérence entre `true` et `false` et facilite la sortie des attributs `aria-*`.

Le tableau suivant décrit le nouveau comportement :

| Binding expression  | `foo` <sup>normal</sup>    | `draggable` <sup>enumerated</sup> |
| ------------------- | -------------------------- | --------------------------------- |
| `:attr="null"`      | /                          | / <sup>†</sup>                    |
| `:attr="undefined"` | /                          | /                                 |
| `:attr="true"`      | `foo="true"`               | `draggable="true"`                |
| `:attr="false"`     | `foo="false"` <sup>†</sup> | `draggable="false"`               |
| `:attr="0"`         | `foo="0"`                  | `draggable="0"` <sup>†</sup>      |
| `attr=""`           | `foo=""`                   | `draggable=""` <sup>†</sup>       |
| `attr="foo"`        | `foo="foo"`                | `draggable="foo"` <sup>†</sup>    |
| `attr`              | `foo=""`                   | `draggable=""` <sup>†</sup>       |

<small>† : changé</small>

La coercition pour les attributs booléens n'a pas été modifiée.

### Stratégie de migration

### Attributs énumérés

L'absence d'un attribut énuméré et `attr="false"` peut produire des valeurs d'attribut IDL différentes (qui reflèteront l'état réel), décrites comme suit :

| Absent enumerated attr | IDL attr & value                     |
| ---------------------- | ------------------------------------ |
| `contenteditable`      | `contentEditable` &rarr; `'inherit'` |
| `draggable`            | `draggable` &rarr; `false`           |
| `spellcheck`           | `spellcheck` &rarr; `true`           |

Pour conserver l'ancien comportement, et comme nous allons contraindre `false` à `'false'`, les développeurs de Vue 3.x doivent faire en sorte que l'expression `v-bind` soit résolue par `false` ou `'false'` pour `contenteditable` et `spellcheck`.

Dans la version 2.x, les valeurs non valides étaient converties en `'true'` pour les attributs énumérés. C'était généralement involontaire et il était peu probable que l'on s'en serve à grande échelle. En 3.x, `true` ou `'true'` doivent être explicitement spécifiés.

### Coercition `false` en `'false'` au lieu de supprimer l'attribut

En 3.x, `null` ou `undefined` doivent être utilisés pour supprimer explicitement un attribut.


### Comparaison entre les comportements 2.x et 3.x

<table>
  <thead>
    <tr>
      <th>Attribute</th>
      <th><code>v-bind</code> value <sup>2.x</sup></th>
      <th><code>v-bind</code> value <sup>3.x</sup></th>
      <th>HTML output</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3">2.x “Enumerated attrs”<br><small>i.e. <code>contenteditable</code>, <code>draggable</code> and <code>spellcheck</code>.</small></td>
      <td><code>undefined</code>, <code>false</code></td>
      <td><code>undefined</code>, <code>null</code></td>
      <td><i>removed</i></td>
    </tr>
    <tr>
      <td>
        <code>true</code>, <code>'true'</code>, <code>''</code>, <code>1</code>,
        <code>'foo'</code>
      </td>
      <td><code>true</code>, <code>'true'</code></td>
      <td><code>"true"</code></td>
    </tr>
    <tr>
      <td><code>null</code>, <code>'false'</code></td>
      <td><code>false</code>, <code>'false'</code></td>
      <td><code>"false"</code></td>
    </tr>
    <tr>
      <td rowspan="2">Other non-boolean attrs<br><small>eg. <code>aria-checked</code>, <code>tabindex</code>, <code>alt</code>, etc.</small></td>
      <td><code>undefined</code>, <code>null</code>, <code>false</code></td>
      <td><code>undefined</code>, <code>null</code></td>
      <td><i>removed</i></td>
    </tr>
    <tr>
      <td><code>'false'</code></td>
      <td><code>false</code>, <code>'false'</code></td>
      <td><code>"false"</code></td>
    </tr>
  </tbody>
</table>
