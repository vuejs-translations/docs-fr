import { ref } from 'vue'

export default {
  setup() {
    const text = ref('Edite moi')
    const checked = ref(true)
    const checkedNames = ref(['Jacques'])
    const picked = ref('Un')
    const selected = ref('A')
    const multiSelected = ref(['A'])

    return {
      text,
      checked,
      checkedNames,
      picked,
      selected,
      multiSelected
    }
  }
}
