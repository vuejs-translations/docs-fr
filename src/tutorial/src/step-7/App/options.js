// donne à chaque todo un id unique
let id = 0

export default {
  data() {
    return {
      newTodo: '',
      todos: [
        { id: id++, text: 'Apprendre le HTML' },
        { id: id++, text: 'Apprendre le JavaScript' },
        { id: id++, text: 'Apprendre Vue' }
      ]
    }
  },
  methods: {
    addTodo() {
      // ...
      this.newTodo = ''
    },
    removeTodo(todo) {
      // ...
    }
  }
}
