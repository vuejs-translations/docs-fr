import partnerData from '../partners/partners.json'

const partnerName = 'Proxify'
const partner = partnerData.find(partner => partner.name === partnerName)

const websiteLabel = 'proxify.io'
const websiteUrl = 'https://proxify.io/'
const applyUrl = 'https://career.proxify.io/apply'
const hireUrl = 'https://proxify.io/hire-vuejs'
const vueArticleUrl = 'https://proxify.io/hire-vue-developers'
const imageStorageUrl = 'https://res.cloudinary.com/proxify-io/image/upload'

const partnerConfig = {
  // Partner information
  partnerName: partner?.name,
  logo: partner?.logo,
  flipLogo: partner?.flipLogo || false,

  // Partner website
  websiteUrl: websiteUrl,
  hireUsButtonUrl: hireUrl,

  // Image storage URL
  imageStorageUrl: imageStorageUrl,

  // Hero Section
  pageHeroBanner: {
    title: 'Développeurs Vue',
    description: 'Les développeurs Vue sont des indépendants certifiés. Les paiements, la conformité et la vérification sont administrés par notre partenaire Proxify. Vous souhaitez rejoindre la liste ?',
    applyButton: {
      url: applyUrl,
      label: 'Postulez ici'
    }
  },

  // Hero Section
  pageJoinSection: {
    title: 'Devenir un développeur référencé',
    description: 'Obtenez un poste à long terme, à temps partiel ou à temps plein, dans une entreprise qui recherche un développeur Vue.js.',
    applyButton: {
      url: applyUrl,
      label: 'Poser sa candidature'
    }
  },

  // Footer Configuration
  pageFooter: {
    text: `Ce développeur hautement qualifié vous est présenté par le partenaire de Vue :`,
    email: 'vue@proxify.io',
    phone: '+44 20 4614 2667',
    websiteVueLink: vueArticleUrl,
    websiteVueLabel: websiteLabel + '/hire-vue-developers'
  },

  // Diagram sections
  profileDiagram: {
    title: 'Profil du candidat',
    prependText: 'How our developers score in the parameters that correlate best with future success in the role.'
  },

  scoreDiagram: {
    title: 'Score d\'excellence en ingénierie',
    prependText: 'Les résultats obtenus par nos développeurs dans les paramètres les mieux corrélés à leur réussite future dans le poste.',
    appendText: 'Données provenant de 3 661 développeurs Vue.js évalués et de 38 008 candidats.'
  },

  // Proficiency Section
  proficiencies: {
    skillsPerCard: 5
  }
}

export default partnerConfig
