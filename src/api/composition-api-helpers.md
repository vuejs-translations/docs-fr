# Composition API: Helpers {#composition-api-helpers}

## useAttrs() {#useattrs}

Retourne l'objet `attrs` du [contexte de la fonction setup](/api/composition-api-setup#setup-context), qui inclut les [attributs implicitement déclarés (Fallthrough Attributes)](/guide/components/attrs#fallthrough-attributes) du composant courant. Il est destiné à être utilisé dans `<script setup>` lorsque l'objet setup context n'est pas disponible.

- **Type**

  ```ts
  function useAttrs(): Record<string, unknown>
  ```

## useSlots() {#useslots}

Retourne l'objet `slots` du [contexte de la fonction setup](/api/composition-api-setup#setup-context), qui inclut les slots passés par les parents comme des fonctions appelables qui retournent des noeuds virtuels du DOM. Il est destiné à être utilisé dans `<script setup>` lorsque l'objet setup context n'est pas disponible.

Si vous utilisez TypeScript, [`defineSlots()`](/api/sfc-script-setup#defineslots) devrait être préféré.

- **Type**

  ```ts
  function useSlots(): Record<string, (...args: any[]) => VNode[]>
  ```

## useModel() {#usemodel}

C'est le helper sous-jacent qui alimente [`defineModel()`](/api/sfc-script-setup#definemodel). Si vous utilisez `<script setup>`, `defineModel()` devrait être préféré.

- Disponible à partir de la version 3.4

- **Type**

  ```ts
  function useModel(
    props: Record<string, any>,
    key: string,
    options?: DefineModelOptions
  ): ModelRef

  type DefineModelOptions<T = any> = {
    get?: (v: T) => any
    set?: (v: T) => any
  }

  type ModelRef<T, M extends PropertyKey = string, G = T, S = T> = Ref<G, S> & [
    ModelRef<T, M, G, S>,
    Record<M, true | undefined>
  ]
  ```

- **Exemple**

  ```js
  export default {
    props: ['count'],
    emits: ['update:count'],
    setup(props) {
      const msg = useModel(props, 'count')
      msg.value = 1
    }
  }
  ```

- **Détails**

  `useModel()` peut être utilisé dans les composants non-SFC, par exemple lors de l'utilisation de la fonction raw `setup()`. Elle attend l'objet `props` comme premier argument, et le nom du modèle comme second argument. Le troisième argument optionnel peut être utilisé pour déclarer des getter et setter personnalisés pour le modèle ref résultant. Notez que contrairement à `defineModel()`, vous êtes responsable de la déclaration des objets props et emits vous-même.

## useTemplateRef() <sup class="vt-badge" data-text="3.5+" /> {#usetemplateref}

Renvoie une ref peu profonde dont la valeur sera synchronisée avec l'élément ou le composant du template ayant un attribut ref correspondant.

- **Type**

  ```ts
  function useTemplateRef<T>(key: string): Readonly<ShallowRef<T | null>>
  ```

- **Exemple**

  ```vue
  <script setup>
  import { useTemplateRef, onMounted } from 'vue'

  const inputRef = useTemplateRef('input')

  onMounted(() => {
    inputRef.value.focus()
  })
  </script>

  <template>
    <input ref="input" />
  </template>
  ```

- **Voir aussi**
  - [Guide - Les refs du template](/guide/essentials/template-refs)
  - [Guide - Typer les refs de template](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [Guide - Typer les refs de template d'un composant](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

Utilisé pour générer des identifiants uniques par application pour les attributs d'accessibilité ou les éléments de formulaire.

- **Type**

  ```ts
  function useId(): string
  ```

- **Exemple**

  ```vue
  <script setup>
  import { useId } from 'vue'

  const id = useId()
  </script>

  <template>
    <form>
      <label :for="id">Name:</label>
      <input :id="id" type="text" />
    </form>
  </template>
  ```

- **Détails**

  Les identifiants générés par `useId()` sont uniques pour chaque application. Il peut être utilisé pour générer des identifiants pour les éléments de formulaire et les attributs d'accessibilité. Plusieurs appels dans le même composant génèreront des ID différents ; plusieurs instances du même composant appelant `useId()` auront également des ID différents.

  Les identifiants générés par `useId()` sont également garantis stables entre les rendus du serveur et du client, de sorte qu'ils peuvent être utilisés dans des applications SSR sans entraîner de disparités d'hydratation.

  Si vous avez plus d'une instance d'application Vue sur la même page, vous pouvez éviter les conflits d'ID en donnant à chaque application un préfixe d'ID via [`app.config.idPrefix`](/api/application#app-config-idprefix).
