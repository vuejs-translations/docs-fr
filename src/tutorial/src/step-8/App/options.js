let id = 0

export default {
  data() {
    return {
      newTodo: '',
      hideCompleted: false,
      todos: [
        { id: id++, text: 'Apprendre le HTML', done: true },
        { id: id++, text: 'Apprendre le JavaScript', done: true },
        { id: id++, text: 'Apprendre Vue', done: false }
      ]
    }
  },
  computed: {
    // ...
  },
  methods: {
    addTodo() {
      this.todos.push({ id: id++, text: this.newTodo, done: false })
      this.newTodo = ''
    },
    removeTodo(todo) {
      this.todos = this.todos.filter((t) => t !== todo)
    }
  }
}
