import { ref } from 'vue'

export default {
  setup() {
    // donne à chaque todo un id unique
    let id = 0

    const newTodo = ref('')
    const todos = ref([
      { id: id++, text: 'Apprendre le HTML' },
      { id: id++, text: 'Apprendre le JavaScript' },
      { id: id++, text: 'Apprendre Vue' }
    ])

    function addTodo() {
      todos.value.push({ id: id++, text: newTodo.value })
      newTodo.value = ''
    }

    function removeTodo(todo) {
      todos.value = todos.value.filter((t) => t !== todo)
    }

    return {
      newTodo,
      todos,
      addTodo,
      removeTodo
    }
  }
}
