import { ref } from 'vue'

export default {
  setup() {
    const message = ref('Hello World !')

    function reverseMessage() {
      // Accède à / mute la valeur d'une ref via
      // sa propriété .value.
      message.value = message.value.split('').reverse().join('')
    }

    function notify() {
      alert('la navigation a été empêchée.')
    }

    return {
      message,
      reverseMessage,
      notify
    }
  }
}
