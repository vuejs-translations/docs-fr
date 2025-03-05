import { ref } from 'vue'
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  },
  setup() {
    const childMsg = ref("Pas encore de message de l'enfant")

    return {
      childMsg
    }
  }
}
