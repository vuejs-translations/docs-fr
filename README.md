# Dépôt de contribution pour la traduction française de vuejs.org

Ce projet est un fork de vuejs/docs dont le but est de centraliser les efforts pour sa traduction en français.

Merci de vous référer à la partie [Contributing](#Contributing) et spécifiquement à ce dépôt la partie [Directives de contribution](#Directives-de-contribution) afin de nous prêter main forte en bonne et due forme

## Directives de contribution
### VS Code extensions

Utilisez les extensions suivantes pour éviter les fautes orthographiques:
- streetsidesoftware.code-spell-checker
- streetsidesoftware.code-spell-checker-french

### Partager le travail de traduction

Nous travaillons pour le moment avec les [issues](/issues) et le board [projects](/projects/1) pour partager le travail de traduction avec tous les membres impliqués.
Des issues chapeau feront office de tracking pour chaque sous-partie de la documentation.

- Guide
- Tutoriels
- Exemples
- Démarrage rapide
- Migration depuis V2
- API
- Écosystème
- À propos
- Autres (translation page, ...)

### Notifiez toute sous-tâche de traduction que vous ne pouvez traiter de suite

Quand vous identifiez un contenu pointé par un lien ou qui serait hors de votre champs d'action, notifier le en ajoutant `TODO(fr)` dans le label du lien ou la référence du contenu en question.

_______________
# vuejs.org

## Contribution

Ce site est construit avec [VitePress](https://github.com/vuejs/vitepress) et dépend de [@vue/theme](https://github.com/vuejs/vue-theme). Le contenu du site est écrit au format Markdown situé dans `src`. Pour des modifications simples, vous pouvez modifier directement le fichier sur GitHub et générer une Pull Request.

Pour le développement local, [pnpm](https://pnpm.io/) est préféré comme gestionnaire de packages :

```bash
pnpm i
pnpm run dev
```
## Travail sur le contenu

- Voir la documentation de VitePress sur les [extensions Markdown](https://vitepress.vuejs.org/guide/markdown.html) prises en charge et la possibilité d'[utiliser la syntaxe Vue dans Markdown](https://vitepress.vuejs.org/guide/using-vue.html).

- Consultez le [Guide d'Écriture](https://github.com/vuejs/docs/blob/main/.github/contributing/writing-guide.md) pour nos règles et recommandations sur la rédaction et la maintenance du contenu de la documentation.
## Travail sur le le thème

Si des modifications doivent être apportées au thème, consultez les [instructions pour développer le thème parallèlement à la documentation](https://github.com/vuejs/vue-theme#developing-with-real-content).
