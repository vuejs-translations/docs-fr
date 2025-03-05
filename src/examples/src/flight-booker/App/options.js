function stringToDate(str) {
  const [y, m, d] = str.split('-')
  return new Date(+d, m - 1, +y)
}

function dateToString(date) {
  return (
    pad(date.getDate()) +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    date.getFullYear()
  )
}

function pad(n, s = String(n)) {
  return s.length < 2 ? `0${s}` : s
}

export default {
  data() {
    return {
      flightType: 'one-way flight',
      departureDate: dateToString(new Date()),
      returnDate: dateToString(new Date())
    }
  },
  computed: {
    isReturn() {
      return this.flightType === 'return flight'
    },
    canBook() {
      return (
        !this.isReturn ||
        stringToDate(this.returnDate) > stringToDate(this.departureDate)
      )
    }
  },
  methods: {
    book() {
      alert(
        this.isReturn
          ? `Vous avez réservé un vol aller-retour, avec un départ le ${this.departureDate} et un retour le ${this.returnDate}.`
        	: `Vous avez réservé un vol simple partant le ${this.departureDate}.`
      )
    }
  }
}
