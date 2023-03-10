import { ref } from 'vue'
import TodoItem from './TodoItem.vue'

export default {
  components: {
    TodoItem
  },
  setup() {
    const groceryList = ref([
      { id: 0, text: 'Légumes' },
      { id: 1, text: 'Fromage' },
      { id: 2, text: 'Toute autre chose comestible pour les humains' }
    ])

    return {
      groceryList
    }
  }
}
