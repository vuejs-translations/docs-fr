# Notions de base

L'accessibilité du Web (également connue sous le nom d'a11y) désigne la pratique consistant à créer des sites Web qui peuvent être utilisés par n'importe qui, qu'il s'agisse d'une personne handicapée, d'une connexion lente, d'un matériel obsolète ou cassé ou simplement d'une personne se trouvant dans un environnement défavorable. Par exemple, l'ajout de sous-titres à une vidéo aiderait à la fois vos utilisateurs sourds et malentendants et vos utilisateurs qui se trouvent dans un environnement bruyant et ne peuvent pas entendre leur téléphone. De même, en veillant à ce que votre texte ne soit pas trop peu contrasté, vous aiderez vos utilisateurs malvoyants et ceux qui essaient d'utiliser leur téléphone en plein soleil.

Vous êtes prêt à commencer mais vous ne savez pas où aller ?

Consultez le [Guide de planification et de gestion de l'accessibilité du Web](https://www.w3.org/WAI/planning-and-managing/) fourni par le [Consortium World Wide Web (W3C)] (https://www.w3.org/).

## Sauter le lien

Vous devriez ajouter un lien en haut de chaque page qui mène directement à la zone de contenu principal afin que les utilisateurs puissent sauter le contenu qui est répété sur plusieurs pages Web.

En général, ce lien est placé en haut du fichier `App.vue`, car il s'agit du premier élément sur lequel on peut mettre l'accent sur toutes vos pages :

``` html
<ul class="skip-links">
  <li>
    <a href="#main" ref="skipLink">Skip to main content</a>
  </li>
</ul>
```

Pour masquer le lien à moins qu'il ne soit focalisé, vous pouvez ajouter le style suivant :

``` css
.skipLink {
  white-space: nowrap;
  margin: 1em auto;
  top: 0;
  position: fixed;
  left: 50%;
  margin-left: -72px;
  opacity: 0;
}
.skipLink:focus {
  opacity: 1;
  background-color: white;
  padding: .5em;
  border: 1px solid black;
}
```

Lorsqu'un utilisateur change d'itinéraire, ramenez le focus sur le lien de saut. Ceci peut être réalisé en appelant le focus sur le `ref` fourni ci-dessous :

``` vue
<script>
export default {
  watch: {
    $route() {
      this.$refs.skipLink.focus();
    }
  }
};
</script>
```

<common-codepen-snippet title="Skip to Main" slug="VwepxJa" :height="350" tab="js,result" :team="false" user="mlama007" name="Maria" theme="light" :preview="false" :editable="false" />

[Lire la documentation sur  sauter le lien vers le contenu principal](https://www.w3.org/WAI/WCAG21/Techniques/general/G1.html)


## Structurez votre contenu

L'un des éléments les plus importants de l'accessibilité est de s'assurer que la conception peut soutenir une mise en œuvre accessible. La conception doit prendre en compte non seulement le contraste des couleurs, la sélection des polices, la taille du texte et la langue, mais aussi la manière dont le contenu est structuré dans l'application.

### En-têtes

Les utilisateurs peuvent naviguer dans une application grâce aux rubriques. Le fait de disposer de titres descriptifs pour chaque section de votre application permet aux utilisateurs de prévoir plus facilement le contenu de chaque section. En ce qui concerne les titres, il existe quelques pratiques d'accessibilité recommandées :

- Placez les rubriques dans leur ordre de classement : `<h1>` - `<h6>`
- Ne sautez pas d'en-têtes dans une même section.
- Utilisez les balises d'en-tête réelles au lieu du texte de style pour donner l'apparence visuelle des en-têtes.

[En savoir plus sur les titres](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)

```html
<main role="main" aria-labelledby="main-title">
  <h1 id="main-title">Main title</h1>
  <section aria-labelledby="section-title">
    <h2 id="section-title"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- Content -->
  </section>
  <section aria-labelledby="section-title">
    <h2 id="section-title"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- Content -->
    <h3>Section Subtitle</h3>
    <!-- Content -->
  </section>
</main>
```

### Points de repère

Les points de repère fournissent un accès programmatique aux sections d'une application. Les utilisateurs qui utilisent une technologie d'assistance peuvent naviguer dans chaque section de l'application et sauter le contenu. Pour ce faire, vous pouvez utiliser les [rôles ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles).

| HTML            | ARIA Role                                                         | Landmark Purpose                                                                       |
| --------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| header          | role="banner"                                                     | Titre principal : titre de la page                                                       |
| nav             | role="navigation"                                                 | Collection de liens pouvant être utilisés pour la navigation dans le document ou dans des documents connexes. |
| main            | role="main"                                                       | Le contenu principal ou central du document.                                           |
| footer          | role="contentinfo"                                                | Informations sur le document parent : notes de bas de page/droits d'auteur/liens vers la déclaration de confidentialité |
| aside           | role="complementary"                                              | Appuie le contenu principal, tout en étant séparé et significatif par son propre contenu.            |
| _Not available_ | role="search"                                                     | Cette section contient la fonctionnalité de recherche de l'application                     |
| form            | role="form"                                                       | Collection d'éléments associés à la forme                                                 |
| section         | role="region"  | Le contenu qui est pertinent et vers lequel les utilisateurs voudront probablement naviguer. Un libellé doit être fourni pour cet élément                |

:::tip Tip:
Il est recommandé d'utiliser des éléments HTML repères avec des attributs de rôle repères redondants afin de maximiser la compatibilité avec les anciens [navigateurs qui ne prennent pas en charge les éléments sémantiques HTML5] (https://caniuse.com/#feat=html5semantic).
:::

[En savoir plus sur les points de repère](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)
