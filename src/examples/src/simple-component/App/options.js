import TodoItem from './TodoItem.vue'

export default {
  components: {
    TodoItem
  },
  data() {
    return {
      groceryList: [
        { id: 0, text: 'Légumes' },
        { id: 1, text: 'Fromage' },
        { id: 2, text: 'Toute autre chose comestible pour les humains' }
      ]
    }
  }
}
