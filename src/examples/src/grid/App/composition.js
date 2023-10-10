import DemoGrid from './Grid.vue'
import { ref } from 'vue'

export default {
  components: {
    DemoGrid
  },
  setup() {
    const searchQuery = ref('')
    const gridColumns = ['nom', 'puissance']
    const gridData = [
      { nom: 'Chuck Norris', puissance: Infinity },
      { nom: 'Bruce Lee', puissance: 9000 },
      { nom: 'Jackie Chan', puissance: 7000 },
      { nom: 'Jet Li', puissance: 8000 }
    ]

    return {
      searchQuery,
      gridColumns,
      gridData
    }
  }
}
