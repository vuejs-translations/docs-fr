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
    title: 'Trouvez les meilleurs développeurs Vue.js pour votre équipe',
    description1: 'Accédez à des développeurs Vue.js certifiés disponibles pour votre prochain projet.',
    description2: 'Proxify prend en charge le processus de sélection afin de garantir une qualité et une fiabilité de premier ordre..',
    hireButton: {
      url: hireUrl,
      label: 'Trouver des développeurs Vue.js maintenant'
    },
    footer: "Vous serez mis en relation avec un développeur Vue.js de haut niveau en moins de 48 heures",
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
