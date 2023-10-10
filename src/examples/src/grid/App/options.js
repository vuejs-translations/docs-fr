import DemoGrid from './Grid.vue'

export default {
  components: {
    DemoGrid
  },
  data: () => ({
    searchQuery: '',
    gridColumns: ['nom', 'puissance'],
    gridData: [
      { nom: 'Chuck Norris', puissance: Infinity },
      { nom: 'Bruce Lee', puissance: 9000 },
      { nom: 'Jackie Chan', puissance: 7000 },
      { nom: 'Jet Li', puissance: 8000 }
    ]
  })
}
