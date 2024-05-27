[![](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https://stackblitz.com/~/github.com/vuejs-translations/docs-fr)

# Dépôt de contribution pour la traduction française de vuejs.org

Ce projet est un fork de vuejs/docs dont le but est de centraliser les efforts pour sa traduction en français.

Merci de vous référer à la partie [Contributing](#contributing) et surtout de suivre le **[document de contribution](CONTRIBUTING.md)** afin de nous prêter main forte en ayant les bons réflexes.

Il est important également de prendre connaissances des [bonnes pratiques pour la traduction de la documentation](https://github.com/vuejs-translations/guidelines).

## Contribuer à la traduction française

Rendez vous sur le document **[CONTRIBUTING.md](CONTRIBUTING.md)** pour en savoir plus.

---

# vuejs.org

## Contribution

Ce site est construit avec [VitePress](https://github.com/vuejs/vitepress) et dépend de [@vue/theme](https://github.com/vuejs/vue-theme). Le contenu du site est écrit au format Markdown situé dans `src`. Pour des modifications simples, vous pouvez modifier directement le fichier sur GitHub et générer une Pull Request.

Pour le développement local, [pnpm](https://pnpm.io/) est préférable comme gestionnaire de packages :

```bash
pnpm i
pnpm run dev
```

Ce projet nécessite la version `v18` ou plus récente de Node.js. Et il es recommandé d'activer corepack :

```bash
corepack enable
```

## Travail sur le contenu

- Voir la documentation de VitePress sur les [extensions Markdown](https://vitepress.vuejs.org/guide/markdown) prises en charge et la possibilité d'[utiliser la syntaxe Vue dans Markdown](https://vitepress.vuejs.org/guide/using-vue).

- Consultez le [Guide d'Écriture](https://vitepress.dev/guide/markdown) pour nos règles et recommandations sur la rédaction et la maintenance du contenu de la documentation, ainsi que sur la possibilité [d'utiliser la syntaxe Vue dans le markdown](https://vitepress.dev/guide/using-vue)..

## Travail sur le le thème

Si des modifications doivent être apportées au thème, consultez les [instructions pour développer le thème parallèlement à la documentation](https://github.com/vuejs/vue-theme#developing-with-real-content).
