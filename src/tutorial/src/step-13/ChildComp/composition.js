export default {
  emits: ['response'],
  setup(props, { emit }) {
    emit('response', "hello à partir de l'enfant")
    return {}
  }
}
