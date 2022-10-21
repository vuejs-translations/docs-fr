# Déploiement de production {#production-deployment}

## Développement vs. Production {#development-vs-production}

Durant le développement, Vue fournit un certain nombre de fonctionnalités pour améliorer l'expérience de développement :

- Avertissement pour les erreurs et les pièges communs
- Validation des props / événements
- Hooks de débogage de la réactivité
- Intégration de Devtools

Cependant, ces fonctionnalités deviennent inutiles en production. Certains warnings peuvent également entraîner une petite baisse de performances générales. Lors du déploiement en production, nous devrions supprimer toutes les branches de code de développement inutilisées pour profiter d'une charge moins élevée et de meilleures performances.

## Sans outils de build {#without-build-tools}

Si vous utilisez Vue sans outil de build, en le chargeant à partir d'un CDN ou d'un script local, assurez-vous d'utiliser le build de production (fichiers `dist` d'extension `.prod.js`) en déployant en production. Les builds de production sont pré-minifiés et toutes les branches de développement y sont supprimées.

- Si vous utilisez un build global (accédé via le `Vue` global) : utilisez `vue.global.prod.js`.
- Si vous utilisez un build ESM (accédé via les imports ESM natifs) : utilisez `vue.esm-browser.prod.js`.

Consultez le [guide des fichiers dist](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use) pour plus de précisions.

## Avec des outils de build {#with-build-tools}

Les projets crées par `create-vue` (basés sur Vite) ou Vue CLI (basés sur webpack) sont préconfigurés pour les builds de production.

Si vous utilisez une configuration personnalisée, assurez-vous que:

1. `vue` soit résolu par `vue.runtime.esm-bundler.js`.
2. Les [flags de temps de compilation](https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags) sont configurés correctement.
3. <code>process.env<wbr>.NODE_ENV</code> est remplacé par `"production"` dans le build.

Références supplémentaires:

- [Guide de build de production Vite](https://vitejs.dev/guide/build.html)
- [Guide déploiement Vite](https://vitejs.dev/guide/static-deploy.html)
- [Guide de déploiement Vue CLI](https://cli.vuejs.org/guide/deployment.html)

## Suivi des erreurs d'exécution {#tracking-runtime-errors}

Le [gestionnaire d'erreur au niveau applicatif](/api/application.html#app-config-errorhandler) peut être utilisé pour signaler les erreurs aux services de suivi :

```js
import { createApp } from 'vue'

const app = createApp(...)

app.config.errorHandler = (err, instance, info) => {
  // signale l'erreur aux services de suivi
}
```

Des services comme [Sentry](https://docs.sentry.io/platforms/javascript/guides/vue/) et [Bugsnag](https://docs.bugsnag.com/platforms/javascript/vue/) fournissent également des intégrations officielles de Vue.