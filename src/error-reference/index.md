<script setup>
import { ref, onMounted } from 'vue'
import { data } from './errors.data.ts'
import ErrorsTable from './ErrorsTable.vue'

const highlight = ref()
onMounted(() => {
  highlight.value = location.hash.slice(1)
})
</script>

# Référence des codes d'erreur en production {#error-reference}

## Erreurs d'exécution {#runtime-errors}

Dans les versions de production, le troisième argument transmis aux API de gestion des erreurs suivantes sera un code court au lieu de la chaîne d'information complète :

- [`app.config.errorHandler`](/api/application#app-config-errorhandler)
- [`onErrorCaptured`](/api/composition-api-lifecycle#onerrorcaptured) (Composition API)
- [`errorCaptured`](/api/options-lifecycle#errorcaptured) (Options API)

Le tableau suivant établit une correspondance entre les codes et leurs chaînes d'information complètes d'origine.

<ErrorsTable kind="runtime" :errors="data.runtime" :highlight="highlight" />

## Erreurs de compilation {#compiler-errors}

Le tableau suivant fournit une correspondance entre les codes d'erreur du compilateur en production et leurs messages d'origine.

<ErrorsTable kind="compiler" :errors="data.compiler" :highlight="highlight" />
