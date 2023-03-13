export default {
  data() {
    return {
      message: 'Hello World !'
    }
  },
  methods: {
    reverseMessage() {
      this.message = this.message.split('').reverse().join('')
    },
    notify() {
      alert('la navigation a été empêchée.')
    }
  }
}
