# Options : Divers {#options-misc}

## name {#name}

Déclare explicitement un nom d'affichage pour le composant.

- **Type :**

  ```ts
  interface ComponentOptions {
    name?: string
  }
  ```

- **Détails**

  Le nom d'un composant est utilisé dans les cas suivants :

  - L'auto-référence récursive dans le template du composant
  - Affichage dans l'outil d'inspection de l'arbre des composants de Vue DevTools
  - Affichage dans les avertissements concernant les composants

  Lorsque vous utilisez des composants monofichiers, le composant déduit déjà son propre nom à partir du nom du fichier. Par exemple, un fichier nommé `MyComponent.vue` aura le nom d'affichage déduit "MyComponent".

  Par ailleurs, lorsqu'un composant est enregistré de manière globale via [`app.component`](/api/application#app-component), l'ID global est automatiquement défini comme son nom.

  L'option `name` vous permet de remplacer le nom déduit, ou de fournir explicitement un nom quand aucun nom ne peut être déduit (par exemple quand on n'utilise pas d'outil de build, ou lors de l'utilisation d'un composant en ligne divisé en plusieurs fichiers).

  Il y a un cas où `name` est nécessaire : lors de la recherche d'un composant pouvant être mis en cache dans [`<KeepAlive>`](/guide/built-ins/keep-alive) via ses props `include / exclude`.

  :::tip
  Depuis la version 3.2.34, un composant monofichier utilisant `<script setup>` déduira automatiquement son option `name` en fonction du nom du fichier, supprimant ainsi la nécessité de déclarer manuellement le nom, même lorsqu'il est utilisé avec `<KeepAlive>`.
  :::

## inheritAttrs {#inheritattrs}

Vérifie si le comportement par défaut de l'attribut du composant doit être activé ou non.

- **Type :**

  ```ts
  interface ComponentOptions {
    inheritAttrs?: boolean // default: true
  }
  ```

- **Détails**

  Par défaut, les liaisons d'attributs qui sont situées dans la portée du composant parent et qui ne sont pas reconnues comme des props seront "répercutées". Cela signifie que lorsque nous avons un composant racine unique, ces liaisons seront appliquées à l'élément racine du composant enfant comme des attributs HTML normaux. Lorsque vous créez un composant qui enveloppe un élément cible ou un autre composant, ce n'est pas toujours le comportement souhaité. En donnant à `inheritAttrs` la valeur `false`, ce comportement par défaut peut être désactivé. Les attributs sont disponibles via la propriété d'instance `$attrs` et peuvent être explicitement liés à un élément non racine en utilisant `v-bind`.

- **Exemple**

  <div class="options-api">

  ```vue
  <script>
  export default {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input']
  }
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>
  <div class="composition-api">

  Lorsque vous déclarez cette option dans un composant qui utilise `<script setup>`, vous pouvez utiliser la macro [`defineOptions`](/api/sfc-script-setup#defineoptions) :

  ```vue
  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  defineOptions({
    inheritAttrs: false
  })
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>

- **Voir aussi**

  - [Attributs implicitement déclarés](/guide/components/attrs)
  <div class="composition-api">

  - [Utiliser `inheritAttrs` dans un `<script>` normal](/api/sfc-script-setup.html#usage-alongside-normal-script)
  </div>

## components {#components}

Un objet qui enregistre les composants devant être accessibles par l'instance actuelle du composant.

- **Type :**

  ```ts
  interface ComponentOptions {
    components?: { [key: string]: Component }
  }
  ```

- **Exemple**

  ```js
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: {
      // raccourci
      Foo,
      // enregistrement sous un nom différent
      RenamedBar: Bar
    }
  }
  ```

- **Voir aussi** [Enregistrement de composants](/guide/components/registration)

## directives {#directives}

Un objet qui enregistre les directives devant être accessibles par l'instance actuelle du composant.

- **Type :**

  ```ts
  interface ComponentOptions {
    directives?: { [key: string]: Directive }
  }
  ```

- **Exemple**

  ```js
  export default {
    directives: {
      // permet l'utilisation de v-focus dans le template
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    }
  }
  ```

  ```vue-html
  <input v-focus>
  ```

- **Voir aussi** [Directives personnalisées](/guide/reusability/custom-directives)
