import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme, type HeadConfig, type Plugin } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import llmstxt from 'vitepress-plugin-llms'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
// import { textAdPlugin } from './textAdMdPlugin'
import { groupIconMdPlugin,groupIconVitePlugin } from 'vitepress-plugin-group-icons'

const nav: ThemeConfig['nav'] = [
  {
    text: 'Docs',
    activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
    items: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Tutoriel', link: '/tutorial/' },
      { text: 'Exemples', link: '/examples/' },
      { text: 'Commencer', link: '/guide/quick-start' },
      // { text: 'Bonnes pratiques', link: '/style-guide/' },
      { text: 'Glossaire', link: '/glossary/' },
      { text: 'Référence des erreurs', link: '/error-reference/' },
      {
        text: 'Vue 2 Docs',
        link: 'https://v2.fr.vuejs.org'
      },
      {
        text: 'Migration depuis Vue 2',
        link: 'https://v3-migration.vuejs.org/'
      }
    ]
  },
  {
    text: 'API',
    activeMatch: `^/api/`,
    link: '/api/'
  },
  {
    text: 'Playground',
    link: 'https://play.vuejs.org'
  },
  {
    text: 'Écosystème',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: 'Ressources',
        items: [
          { text: 'Partenaires', link: '/partners/' },
          { text: 'Développeurs', link: '/developers/' },
          { text: 'Thèmes', link: '/ecosystem/themes' },
          { text: 'Composants UI', link: 'https://ui-libs.vercel.app/' },
          {
            text: 'Certification',
            link: 'https://certificates.dev/vuejs/?ref=vuejs-nav'
          },
          {
            text: 'Offres d’emploi',
            link: 'https://vuejobs.com/?ref=vuejs'
          },
          { text: 'Boutique t-shirt', link: 'https://vue.threadless.com/' }
        ]
      },
      {
        text: 'Librairies Officielles',
        items: [
          { text: 'Vue Router', link: 'https://router.vuejs.org/' },
          { text: 'Pinia', link: 'https://pinia.vuejs.org/' },
          {
            text: 'Guide des outils',
            link: '/guide/scaling-up/tooling'
          }
        ]
      },
      {
        text: 'Cours au format vidéo',
        items: [
          {
            text: 'Vue Mastery (EN)',
            link: 'https://www.vuemastery.com/courses/'
          },
          {
            text: 'Vue School (EN)',
            link: 'https://vueschool.io/?friend=vuejs&utm_source=Vuejs.org&utm_medium=Link&utm_content=Navbar%20Dropdown'
          }
        ]
      },
      {
        text: 'Aide',
        items: [
          {
            text: 'Serveur Discord',
            link: 'https://discord.com/invite/HBherRA'
          },
          {
            text: 'Discussions GitHub',
            link: 'https://github.com/vuejs/core/discussions'
          },
          { text: 'Communauté DEV', link: 'https://dev.to/t/vue' }
        ]
      },
      {
        text: 'Actualités',
        items: [
          { text: 'Blog', link: 'https://blog.vuejs.org/' },
          { text: 'Twitter', link: 'https://twitter.com/vuejs' },
          { text: 'Événements', link: 'https://events.vuejs.org/' },
          { text: 'Newsletter', link: '/ecosystem/newsletters' }
        ]
      }
    ]
  },
  {
    text: 'À propos',
    activeMatch: `^/about/`,
    items: [
      { text: 'FAQ', link: '/about/faq' },
      { text: 'L’équipe', link: '/about/team' },
      { text: 'Releases', link: '/about/releases' },
      {
        text: 'Guide de la communauté',
        link: '/about/community-guide'
      },
      { text: 'Code de bonne conduite', link: '/about/coc' },
      { text: 'Politique de confidentialité', link: '/about/privacy' },
      {
        text: 'Le documentaire',
        link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI'
      }
    ]
  },
  {
    text: 'Sponsor',
    link: '/sponsor/'
  },
  {
    text: 'Experts',
    badge: { text: 'NEW' },
    activeMatch: `^/(partners|developers)/`,
    items: [
      { text: 'Partenaires', link: '/partners/' },
      { text: 'Développeurs', link: '/developers/', badge: { text: 'NEW' } }
    ]
  }
]

export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [
    {
      text: 'Commencer',
      items: [
        { text: 'Introduction', link: '/guide/introduction' },
        {
          text: 'Démarrage rapide',
          link: '/guide/quick-start'
        }
      ]
    },
    {
      text: 'Les essentiels',
      items: [
        {
          text: 'Créer une application',
          link: '/guide/essentials/application'
        },
        {
          text: 'Syntaxe de template',
          link: '/guide/essentials/template-syntax'
        },
        {
          text: 'Fondamentaux de la réactivité',
          link: '/guide/essentials/reactivity-fundamentals'
        },
        {
          text: 'Propriétés calculées',
          link: '/guide/essentials/computed'
        },
        {
          text: 'Liaison de classes et de styles',
          link: '/guide/essentials/class-and-style'
        },
        {
          text: 'Rendu conditionnel',
          link: '/guide/essentials/conditional'
        },
        { text: 'Rendu de liste', link: '/guide/essentials/list' },
        {
          text: "Gestion d'événement",
          link: '/guide/essentials/event-handling'
        },
        {
          text: "Liaisons des entrées d'un formulaire",
          link: '/guide/essentials/forms'
        },
        { text: 'Observateurs', link: '/guide/essentials/watchers' },
        {
          text: 'Les refs du template',
          link: '/guide/essentials/template-refs'
        },
        {
          text: 'Principes fondamentaux des Composants',
          link: '/guide/essentials/component-basics'
        },
        {
          text: 'Les hooks du cycle de vie',
          link: '/guide/essentials/lifecycle'
        }
      ]
    },
    {
      text: 'Composants en détails',
      items: [
        {
          text: 'Enregistrement',
          link: '/guide/components/registration'
        },
        { text: 'Props', link: '/guide/components/props' },
        {
          text: 'Les événements de composant',
          link: '/guide/components/events'
        },
        {
          text: 'v-model du composant',
          link: '/guide/components/v-model'
        },
        {
          text: 'Attributs implicitement déclarés',
          link: '/guide/components/attrs'
        },
        { text: 'Slots', link: '/guide/components/slots' },
        {
          text: 'Provide / inject',
          link: '/guide/components/provide-inject'
        },
        {
          text: 'Composants asynchrones',
          link: '/guide/components/async'
        }
      ]
    },
    {
      text: 'Réutilisabilité',
      items: [
        {
          text: 'Composables',
          link: '/guide/reusability/composables'
        },
        {
          text: 'Directives personnalisées',
          link: '/guide/reusability/custom-directives'
        },
        { text: 'Plugins', link: '/guide/reusability/plugins' }
      ]
    },
    {
      text: 'Composants natifs',
      items: [
        { text: 'Transition', link: '/guide/built-ins/transition' },
        {
          text: 'TransitionGroup',
          link: '/guide/built-ins/transition-group'
        },
        { text: 'KeepAlive', link: '/guide/built-ins/keep-alive' },
        { text: 'Teleport', link: '/guide/built-ins/teleport' },
        { text: 'Suspense', link: '/guide/built-ins/suspense' }
      ]
    },
    {
      text: 'Approfondir',
      items: [
        { text: 'Composants monofichiers', link: '/guide/scaling-up/sfc' },
        { text: 'Outils', link: '/guide/scaling-up/tooling' },
        { text: 'Routage', link: '/guide/scaling-up/routing' },
        {
          text: "Gestion d'état",
          link: '/guide/scaling-up/state-management'
        },
        { text: 'Testing', link: '/guide/scaling-up/testing' },
        {
          text: 'Rendu côté serveur (SSR)',
          link: '/guide/scaling-up/ssr'
        }
      ]
    },
    {
      text: 'Bonnes Pratiques',
      items: [
        {
          text: 'Déploiement en production',
          link: '/guide/best-practices/production-deployment'
        },
        {
          text: 'Performance',
          link: '/guide/best-practices/performance'
        },
        {
          text: 'Accessibilité',
          link: '/guide/best-practices/accessibility'
        },
        {
          text: 'Sécurité',
          link: '/guide/best-practices/security'
        }
      ]
    },
    {
      text: 'TypeScript',
      items: [
        { text: "Vue d'ensemble", link: '/guide/typescript/overview' },
        {
          text: 'TS avec la Composition API',
          link: '/guide/typescript/composition-api'
        },
        {
          text: "TS avec l'Options API",
          link: '/guide/typescript/options-api'
        }
      ]
    },
    {
      text: 'Sujets additionnels',
      items: [
        {
          text: "Manières d'utiliser Vue",
          link: '/guide/extras/ways-of-using-vue'
        },
        {
          text: 'FAQ sur la Composition API',
          link: '/guide/extras/composition-api-faq'
        },
        {
          text: 'La réactivité en détails',
          link: '/guide/extras/reactivity-in-depth'
        },
        {
          text: 'Mécanismes de rendu',
          link: '/guide/extras/rendering-mechanism'
        },
        {
          text: 'Fonctions de rendu et JSX',
          link: '/guide/extras/render-function'
        },
        {
          text: 'Vue et les Web Components',
          link: '/guide/extras/web-components'
        },
        {
          text: "Techniques d'animation",
          link: '/guide/extras/animation'
        }
        // {
        //   text: 'Building a Library for Vue',
        //   link: '/guide/extras/building-a-library'
        // },
        // {
        //   text: 'Vue for React Devs',
        //   link: '/guide/extras/vue-for-react-devs'
        // }
      ]
    }
  ],
  '/api/': [
    {
      text: 'API globale',
      items: [
        { text: 'Application', link: '/api/application' },
        {
          text: 'Générale',
          link: '/api/general'
        }
      ]
    },
    {
      text: 'Composition API',
      items: [
        { text: 'setup()', link: '/api/composition-api-setup' },
        {
          text: 'Réactivité : Essentiel',
          link: '/api/reactivity-core'
        },
        {
          text: 'Réactivité : Utilitaires',
          link: '/api/reactivity-utilities'
        },
        {
          text: 'Réactivité : Avancé',
          link: '/api/reactivity-advanced'
        },
        {
          text: 'Les hooks du cycle de vie',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: 'Injection de dépendances',
          link: '/api/composition-api-dependency-injection'
        },
        {
          text: 'Helpers',
          link: '/api/composition-api-helpers'
        }
      ]
    },
    {
      text: 'Options API',
      items: [
        { text: 'Options : État', link: '/api/options-state' },
        { text: 'Options : Rendu', link: '/api/options-rendering' },
        {
          text: 'Options : Cycle de vie',
          link: '/api/options-lifecycle'
        },
        {
          text: 'Options : Composition',
          link: '/api/options-composition'
        },
        { text: 'Options : Divers', link: '/api/options-misc' },
        {
          text: "L'instance de composant",
          link: '/api/component-instance'
        }
      ]
    },
    {
      text: 'Built-ins',
      items: [
        { text: 'Directives', link: '/api/built-in-directives' },
        { text: 'Composants', link: '/api/built-in-components' },
        {
          text: 'Éléments spéciaux',
          link: '/api/built-in-special-elements'
        },
        {
          text: 'Attributs spéciaux',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: 'Composants monofichiers',
      items: [
        {
          text: 'Spécifications liées à la syntaxe',
          link: '/api/sfc-spec'
        },
        { text: '<script setup>', link: '/api/sfc-script-setup' },
        { text: 'Fonctionnalités CSS', link: '/api/sfc-css-features' }
      ]
    },
    {
      text: 'API avancées',
      items: [
        { text: 'Web Components', link: '/api/custom-elements' },
        { text: 'Fonctions de rendu', link: '/api/render-function' },
        { text: 'Rendu côté serveur', link: '/api/ssr' },
        {
          text: 'Types utilitaires TypeScript',
          link: '/api/utility-types'
        },
        { text: 'Rendu personnalisé', link: '/api/custom-renderer' },
        { text: 'Indicateurs à la compilation', link: '/api/compile-time-flags' }
      ]
    }
  ],
  '/examples/': [
    {
      text: 'Basiques',
      items: [
        {
          text: 'Hello World',
          link: '/examples/#hello-world'
        },
        {
          text: 'Gestion des entrées utilisateur',
          link: '/examples/#handling-input'
        },
        {
          text: "Liaisons d'attributs",
          link: '/examples/#attribute-bindings'
        },
        {
          text: 'Conditions et boucles',
          link: '/examples/#conditionals-and-loops'
        },
        {
          text: 'Liaisons dans les formulaires',
          link: '/examples/#form-bindings'
        },
        {
          text: 'Composant basique',
          link: '/examples/#simple-component'
        }
      ]
    },
    {
      text: 'Pratiques',
      items: [
        {
          text: 'Éditeur markdown',
          link: '/examples/#markdown'
        },
        {
          text: 'Récupération de données',
          link: '/examples/#fetching-data'
        },
        {
          text: 'Grille avec tri et filtres',
          link: '/examples/#grid'
        },
        {
          text: 'Arborescence',
          link: '/examples/#tree'
        },
        {
          text: 'Graphique SVG',
          link: '/examples/#svg'
        },
        {
          text: 'Modale avec transitions',
          link: '/examples/#modal'
        },
        {
          text: 'Liste avec des transitions',
          link: '/examples/#list-transition'
        }
      ]
    },
    {
      // https://eugenkiss.github.io/7guis/
      text: '7 GUIs',
      items: [
        {
          text: 'Compteur',
          link: '/examples/#counter'
        },
        {
          text: 'Convertisseur de température',
          link: '/examples/#temperature-converter'
        },
        {
          text: 'Réservation de vols',
          link: '/examples/#flight-booker'
        },
        {
          text: 'Chronomètre',
          link: '/examples/#timer'
        },
        {
          text: 'CRUD',
          link: '/examples/#crud'
        },
        {
          text: 'Dessinateur de cercles',
          link: '/examples/#circle-drawer'
        },
        {
          text: 'Cellules',
          link: '/examples/#cells'
        }
      ]
    }
  ],
  '/style-guide/': [
    {
      text: 'Bonnes pratiques',
      items: [
        {
          text: "Vue d'ensemble",
          link: '/style-guide/'
        },
        {
          text: 'A - Essentielles',
          link: '/style-guide/rules-essential'
        },
        {
          text: 'B - Fortement recommandées',
          link: '/style-guide/rules-strongly-recommended'
        },
        {
          text: 'C - Recommandées',
          link: '/style-guide/rules-recommended'
        },
        {
          text: 'D - À utiliser avec précaution',
          link: '/style-guide/rules-use-with-caution'
        }
      ]
    }
  ]
}

const i18n: ThemeConfig['i18n'] = {
  search: 'Recherche',
  menu: 'Menu',
  toc: 'Sur cette page',
  returnToTop: 'Retour en haut',
  appearance: 'Apparence',
  previous: 'Précédent',
  next: 'Suivant',
  pageNotFound: 'Page non trouvée',
  deadLink: {
    before: 'Vous avez trouvé un lien mort : ',
    after: ''
  },
  deadLinkReport: {
    before: 'Merci de ',
    link: 'nous le faire savoir',
    after: ' pour nous permettre de le résoudre.'
  },
  footerLicense: {
    before: '',
    after: ''
  },

  // aria labels
  // typo issue https://github.com/vuejs/theme/issues/75
  ariaAnnouncer: {
    before: '',
    after: 'a chargé'
  },
  ariaDarkMode: 'Mode sombre',
  ariaSkipToContent: 'Passer au contenu',
  ariaMainNav: 'Navigation principale',
  ariaMobileNav: 'Navigation mobile',
  ariaSidebarNav: 'Barre de navigation latérale'
}

function inlineScript(file: string): HeadConfig {
  return [
    'script',
    {},
    fs.readFileSync(
      path.resolve(__dirname, `./inlined-scripts/${file}`),
      'utf-8'
    )
  ]
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  sitemap: {
    hostname: 'https://fr.vuejs.org'
  },

  lang: 'fr-FR',
  title: 'Vue.js',
  description: 'Vue.js - Le Framework JavaScript Évolutif',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],

  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:url', content: 'https://fr.vuejs.org/' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vue.js' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Vue.js - Le Framework JavaScript Évolutif'
      }
    ],
    ['meta', { name: 'twitter:site', content: '@vuejs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://fr.vuejs.org/images/logo.png'
      }
    ],
    ['meta', { name: 'twitter:site', content: '@vuejs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://automation.vuejs.org'
      }
    ],
    inlineScript('restorePreference.js'),
    inlineScript('uwu.js'),
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'XNOLWPLB',
        'data-spa': 'auto',
        defer: ''
      }
    ],
    [
      'script',
      {
        src: 'https://vueschool.io/banner.js?affiliate=vuejs&type=top',
        async: 'true'
      }
    ],
    inlineScript('perfops.js')
  ],

  themeConfig: {
    nav,
    sidebar,
    i18n,

    localeLinks: [
      {
        link: 'https://vuejs.org',
        text: 'English',
        repo: 'https://github.com/vuejs/docs'
      },
      {
        link: 'https://cn.vuejs.org',
        text: '简体中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-cn'
      },
      {
        link: 'https://ja.vuejs.org',
        text: '日本語',
        repo: 'https://github.com/vuejs-translations/docs-ja'
      },
      {
        link: 'https://ua.vuejs.org',
        text: 'Українська',
        repo: 'https://github.com/vuejs-translations/docs-uk'
      },
      {
        link: 'https://ko.vuejs.org',
        text: '한국어',
        repo: 'https://github.com/vuejs-translations/docs-ko'
      },
      {
        link: 'https://pt.vuejs.org',
        text: 'Português',
        repo: 'https://github.com/vuejs-translations/docs-pt'
      },
      {
        link: 'https://bn.vuejs.org',
        text: 'বাংলা',
        repo: 'https://github.com/vuejs-translations/docs-bn'
      },
      {
        link: 'https://it.vuejs.org',
        text: 'Italiano',
        repo: 'https://github.com/vuejs-translations/docs-it'
      },
      {
        link: 'https://fa.vuejs.org',
        text: 'فارسی',
        repo: 'https://github.com/vuejs-translations/docs-fa'
      },
      {
        link: 'https://ru.vuejs.org',
        text: 'Русский',
        repo: 'https://github.com/vuejs-translations/docs-ru'
      },
      {
        link: 'https://cs.vuejs.org',
        text: 'Čeština',
        repo: 'https://github.com/vuejs-translations/docs-cs'
      },
      {
        link: 'https://zh-hk.vuejs.org',
        text: '繁體中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-hk'
      },
      {
        link: 'https://pl.vuejs.org',
        text: 'Polski',
        repo: 'https://github.com/vuejs-translations/docs-pl',
      },
      {
        link: '/translations/',
        text: 'Aidez-nous à traduire !',
        isTranslationsDesc: true
      }
    ],

    algolia: {
      indexName: 'fr-vuejs',
      appId: 'HH5AXEOM9U',
      apiKey: 'b33b47187a1497e2a75b99d8a4deee38',
    },

    carbonAds: {
      code: 'CEBDT27Y',
      placement: 'vuejsorg'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://twitter.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/vue' }
    ],

    editLink: {
      repo: 'vuejs-translations/docs-fr',
      text: 'Éditer cette page sur GitHub'
    },

    footer: {
      license: {
        text: 'Licence MIT',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `Copyright © 2014-${new Date().getFullYear()} Evan You`
    }
  },

  markdown: {
    theme: 'github-dark',
    config(md) {
      md.use(headerPlugin)
        .use(groupIconMdPlugin)
      // .use(textAdPlugin)
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    },
    plugins: [
      llmstxt({
        ignoreFiles: [
          'about/team/**/*',
          'about/team.md',
          'about/privacy.md',
          'about/coc.md',
          'developers/**/*',
          'ecosystem/themes.md',
          'examples/**/*',
          'partners/**/*',
          'sponsor/**/*',
          'index.md'
        ],
        customLLMsTxtTemplate: `\
# Vue.js

Vue.js - Le Framework JavaScript Évolutif

## Table des matières

{toc}`
      }) as Plugin,
      groupIconVitePlugin({
        customIcon: {
          cypress: 'vscode-icons:file-type-cypress',
          'testing library': 'logos:testing-library'
        }
      }) as Plugin
    ]
  }
})