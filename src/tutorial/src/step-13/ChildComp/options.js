export default {
  emits: ['response'],
  created() {
    this.$emit('response', "hello à partir de l'enfant")
  }
}
