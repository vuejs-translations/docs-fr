# Dépôt de contribution pour la traduction française de vuejs.org

Ce projet est un fork de vuejs/docs dont le but est de centraliser sa traduction en français.

Merci de vous référer à la partie [Contributing](#Contributing) et spécifiquement à ce dépôt la partie [Contribution guidelines](#Contribution-guidelines) afin de nous prêter main forte en bonne et due forme

## Contribution guidelines
### VS Code extensions

Use following VS Code extensions to avoid spell mistake:
- streetsidesoftware.code-spell-checker
- streetsidesoftware.code-spell-checker-french

### Share translations work

We will work using [issues](/issues) and [projects](/projects/1) to share translations work to all involved team member.
It will have main topic for each part of Vue website.

- Guide
- Tutorials
- Examples
- Quick Start
- Migration from V2
- API
- Eco system
- About
- Misc (translation page, ...)

### Notice any todo you won't do directly

When you notice content which need translation but is too heavy to be achieved, mark the link or the section by `TODO(fr)`.

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
