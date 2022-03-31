# Dépôt de contribution pour la traduction française de vuejs.org

Ce projet est un fork de vuejs/docs dont le but est de centraliser les efforts pour sa traduction en français.

Merci de vous référer à la partie [Contributing](#Contributing) et spécifiquement à ce dépôt la partie [Directives de contribution](#Directives-de-contribution) afin de nous prêter main forte en bonne et due forme

## Directives de contribution

Merci de prendre connaissance du [Guide d'écriture](https://github.com/edimitchel/docs-fr/blob/main/.github/contributing/writing-guide.md) pour bien appréhender la manière de formuler les phrases pour que la lecture soit la plus simple et la plus fluide.

### VS Code extensions

Utilisez les extentions suivantes pour éviter les fautes orthographiques:
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

### Notifiez tout sous-tâche de traduction que vous ne pouvez traiter de suite

Quand vous identifiez un contenu pointé par un lien ou qui serait hors de votre champs d'action, notifier le en ajoutant `TODO(fr)` dans le label du lien ou la référence du contenu en question.

_______________
# vuejs.org

## Contributing

This site is built with [VitePress](https://github.com/vuejs/vitepress) and depends on [@vue/theme](https://github.com/vuejs/vue-theme). Site content is written in Markdown format located in `src`. For simple edits, you can directly edit the file on GitHub and generate a Pull Request.

For local development, [pnpm](https://pnpm.io/) is preferred as package manager:

```bash
pnpm i
pnpm run dev
```
## Working on the content

- See VitePress docs on supported [Markdown Extensions](https://vitepress.vuejs.org/guide/markdown.html) and the ability to [use Vue syntax inside markdown](https://vitepress.vuejs.org/guide/using-vue.html).

- See the [Writing Guide](https://github.com/vuejs/docs/blob/main/.github/contributing/writing-guide.md) for our rules and recommendations on writing and maintaining documentation content.

## Working on the theme

If changes need to made for the theme, check out the [instructions for developing the theme alongside the docs](https://github.com/vuejs/vue-theme#developing-with-real-content).
