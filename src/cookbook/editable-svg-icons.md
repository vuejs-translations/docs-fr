# Systèmes d'icônes SVG modifiables

## Exemple de base

Il existe de nombreuses façons de créer un système d'icônes SVG, mais une méthode qui tire parti des capacités de Vue consiste à créer des icônes en ligne modifiables en tant que composants. Certains des avantages de cette façon de travailler sont :

- Ils sont faciles à modifier à la volée
- Ils sont animables
- Vous pouvez utiliser des accessoires standard et des valeurs par défaut pour les maintenir à une taille typique ou les modifier si nécessaire.
- Ils sont en ligne, donc aucune requête HTTP n'est nécessaire.
- Ils peuvent être rendus accessibles de manière dynamique

Tout d'abord, nous allons créer un dossier pour toutes les icônes, et les nommer de manière standardisée pour faciliter la recherche :

- `components/icons/IconBox.vue`
- `components/icons/IconCalendar.vue`
- `components/icons/IconEnvelope.vue`

Voici un repo d'exemple pour vous aider, où vous pouvez voir la configuration complète : [https://github.com/sdras/vue-sample-svg-icons/](https://github.com/sdras/vue-sample-svg-icons/)

![Site de documentation](https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/screendocs.jpg 'Docs demo')

Nous allons créer un composant d'icône de base (`IconBase.vue`) qui utilise un slot.

```html
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 18 18"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <title :id="iconName" lang="en">{{ iconName }} icon</title>
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>
```

Vous pouvez utiliser cette icône de base telle quelle - la seule chose que vous devrez peut-être mettre à jour est le `viewBox` en fonction du `viewBox` de vos icônes. Dans la base, nous faisons de la `width`, de la `height`, de la `iconColor`, et du nom de l'icône des props afin qu'elle puisse être dynamiquement mise à jour avec des props. Le nom sera utilisé à la fois pour le contenu du `<title>` et son `id` pour l'accessibilité.

Notre script ressemblera à ceci, nous aurons quelques valeurs par défaut afin que notre icône soit rendue de manière cohérente, sauf si nous indiquons le contraire :

```js
export default {
  props: {
    iconName: {
      type: String,
      default: 'box'
    },
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    },
    iconColor: {
      type: String,
      default: 'currentColor'
    }
  }
}
```

La propriété `currentColor`, qui est la propriété par défaut du remplissage, fera en sorte que l'icône hérite de la couleur du texte qui l'entoure. Nous pouvons aussi passer une couleur différente comme propriété si nous le souhaitons.

Nous pouvons l'utiliser comme ceci, avec le seul contenu de `IconWrite.vue` contenant les chemins à l'intérieur de l'icône :

```html
<icon-base icon-name="write"><icon-write /></icon-base>
```

Maintenant, si nous voulons créer plusieurs tailles pour l'icône, nous pouvons le faire très facilement :

```html
<p>
  <!-- vous pouvez passer dans une plus petite `width` et `height` comme props -->
  <icon-base width="12" height="12" icon-name="write"><icon-write /></icon-base>
  <!-- ou vous pouvez utiliser la valeur par défaut, qui est 18 -->
  <icon-base icon-name="write"><icon-write /></icon-base>
  <!-- ou le rendre un peu plus grand aussi :) -->
  <icon-base width="30" height="30" icon-name="write"><icon-write /></icon-base>
</p>
```

<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/Screen%20Shot%202018-01-01%20at%204.51.40%20PM.png" width="450" />

## Icônes animables

Garder les icônes dans les composants est très pratique lorsque vous souhaitez les animer, notamment lors d'une interaction. Les SVG en ligne ont le meilleur support pour l'interaction de toutes les méthodes. Voici un exemple très basique d'une icône qui s'anime au clic :

```html
<template>
  <svg
    @click="startScissors"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="100"
    height="100"
    aria-labelledby="scissors"
    role="presentation"
  >
    <title id="scissors" lang="en">Scissors Animated Icon</title>
    <path id="bk" fill="#fff" d="M0 0h100v100H0z" />
    <g ref="leftscissor">
      <path d="M..." />
      ...
    </g>
    <g ref="rightscissor">
      <path d="M..." />
      ...
    </g>
  </svg>
</template>
```

```js
import { TweenMax, Sine } from 'gsap'

export default {
  methods: {
    startScissors() {
      this.scissorAnim(this.$refs.rightscissor, 30)
      this.scissorAnim(this.$refs.leftscissor, -30)
    },
    scissorAnim(el, rot) {
      TweenMax.to(el, 0.25, {
        rotation: rot,
        repeat: 3,
        yoyo: true,
        svgOrigin: '50 45',
        ease: Sine.easeInOut
      })
    }
  }
}
```

Nous appliquons des `refs` aux groupes de chemins que nous devons déplacer, et comme les deux côtés des ciseaux doivent se déplacer en tandem, nous allons créer une fonction que nous pourrons réutiliser et dans laquelle nous passerons les `refs`. L'utilisation de GreenSock permet de résoudre les problèmes de support d'animation et de `transform-origin` dans tous les navigateurs.

<common-codepen-snippet title="Editable SVG Icon System: Animated icon" slug="dJRpgY" :preview="false" :editable="false" version="2" theme="0" />

<p style="margin-top:-30px">Pretty easily accomplished! And easy to update on the fly.</p>

Vous pouvez voir d'autres exemples animés dans le dépôt [ici](https://github.com/sdras/vue-sample-svg-icons/)

## Additional Notes

Designers may change their minds. Product requirements change. Keeping the logic for the entire icon system in one base component means you can quickly update all of your icons and have it propagate through the whole system. Even with the use of an icon loader, some situations require you to recreate or edit every SVG to make global changes. This method can save you that time and pain.

## Quand éviter ce modèle

Ce type de système d'icônes SVG est vraiment utile lorsque vous avez un certain nombre d'icônes qui sont utilisées de différentes manières sur votre site. Si vous répétez la même icône plusieurs fois sur une page (par exemple, un tableau géant avec une icône de suppression dans chaque ligne), il peut être plus judicieux de compiler tous les sprites dans une feuille de sprites et d'utiliser les balises `<use>` pour les charger.

## Patrons alternatifs

D'autres outils pour aider à gérer les icônes SVG incluent :

- [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader)
- [svgo-loader](https://github.com/rpominov/svgo-loader)

Ces outils regroupent les SVG au moment de la compilation, mais les rendent un peu plus difficiles à modifier au moment de l'exécution, car les balises `<use>` peuvent avoir d'étranges problèmes entre navigateurs lorsqu'on fait quelque chose de plus complexe. Ils vous laissent également avec deux propriétés `viewBox` imbriquées et donc deux systèmes de coordonnées. Cela rend l'implémentation un peu plus complexe.
