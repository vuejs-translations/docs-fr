<script setup>
import { ref, onMounted } from 'vue'
import { data } from './errors.data.ts'
import ErrorsTable from './ErrorsTable.vue'

const highlight = ref()
onMounted(() => {
  highlight.value = location.hash.slice(1)
})
</script>

# Référence des codes d'erreur de production {#error-reference}

## Erreurs d'exécution {#runtime-errors}

Dans les versions de production, le troisième argument transmis aux API de gestion des erreurs suivantes sera un code court au lieu de la chaîne d'information complète :

- [`app.config.errorHandler`](/api/application#app-config-errorhandler)
- [`onErrorCaptured`](/api/composition-api-lifecycle#onerrorcaptured) (Composition API)
- [`errorCaptured`](/api/options-lifecycle#errorcaptured) (Options API)

The following table maps the codes to their original full information strings.

<ErrorsTable kind="runtime" :errors="data.runtime" :highlight="highlight" />

## Compiler Errors {#compiler-errors}

The following table provides a mapping of the production compiler error codes to their original messages.

<ErrorsTable kind="compiler" :errors="data.compiler" :highlight="highlight" />
