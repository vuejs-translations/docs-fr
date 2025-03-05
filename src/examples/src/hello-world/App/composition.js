import { ref } from 'vue'

export default {
  setup() {
    // Une "ref" est une source de données réactive qui stocke une valeur.
    // Techniquement, nous n'avons pas besoin d'envelopper la chaîne de caractères avec une ref()
    // pour l'afficher, mais nous verrons dans l'exemple suivant
    // pourquoi cela est nécessaire si nous avons l'intention de modifier
    // la valeur.
    const message = ref('Hello World!')

    return {
      message
    }
  }
}
