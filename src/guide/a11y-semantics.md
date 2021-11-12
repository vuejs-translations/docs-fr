# Sémantique

## Formulaires (form)

Lorsque vous créez un formulaire, vous pouvez utiliser les éléments suivants : `<form>`, `<label>`, `<input>`, `<textarea>`, et `<button>`.

Les étiquettes sont généralement placées en haut ou à gauche des champs du formulaire :

```html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      :type="item.type"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

<common-codepen-snippet title="Simple Form" slug="YzwpPYZ" :height="368" tab="js,result" :team="false" user="mlama007" name="Maria" theme="light" :preview="false" :editable="false" />

Remarquez comment vous pouvez inclure `autocomplete='on'` sur l'élément de formulaire et cela s'appliquera à toutes les entrées de votre formulaire. Vous pouvez également définir différentes [valeurs pour l'attribut autocomplete] (https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) pour chaque entrée.

### Étiquettes (label)

Fournissez des étiquettes pour décrire l'objectif de tous les contrôles de formulaire ; en reliant `for` et `id` :

```html
<label for="name">Name</label>
<input type="text" name="name" id="name" v-model="name" />
```

<common-codepen-snippet title="Form Label" slug="wvMrGqz" :height="265" tab="js,result" :team="false" user="mlama007" name="Maria" theme="light" :preview="false" :editable="false" />

Si vous inspectez cet élément dans vos outils de développement de chrome et ouvrez l'onglet Accessibilité dans l'onglet Éléments, vous verrez comment l'entrée obtient son nom à partir de l'étiquette :

![Chrome Developer Tools montrant le nom accessible de l'entrée à partir de l'étiquette](/images/AccessibleLabelChromeDevTools.png)

:::warning Warning:
Vous avez peut-être vu des étiquettes enveloppant les champs de saisie comme ceci :


```html
<label>
  Name:
  <input type="text" name="name" id="name" v-model="name" />
</label>
```

Le fait de définir explicitement les étiquettes avec un identifiant correspondant est mieux pris en charge par les technologies d'assistance.
:::

#### aria-label

Vous pouvez aussi donner un nom accessible à l'entrée avec [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute).

```html
<label for="name">Name</label>
<input
  type="text"
  name="name"
  id="name"
  v-model="name"
  :aria-label="nameLabel"
/>
```

<common-codepen-snippet title="Form ARIA label" slug="jOWGqgz" :height="265" tab="js,result" :team="false" user="mlama007" name="Maria" theme="light" :preview="false" :editable="false" />

N'hésitez pas à inspecter cet élément dans Chrome DevTools pour voir comment le nom accessible a changé :

![Chrome Developer Tools montrant le nom accessible de l'aria-label](/images/AccessibleARIAlabelDevTools.png)

#### aria-labelledby

L'utilisation de [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute) est similaire à `aria-label` sauf qu'il est utilisé si le texte de l'étiquette est visible à l'écran. Il est associé à d'autres éléments par leur `id` et vous pouvez lier plusieurs `id` :

```html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Name:</label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

<common-codepen-snippet title="Form ARIA labelledby" slug="ZEQXOLP" :height="265" tab="js,result" :team="false" user="mlama007" name="Maria" theme="light" :preview="false" :editable="false" />

![Les outils de développement de Chrome affichent le nom accessible de la saisie dans aria-labelledby](/images/AccessibleARIAlabelledbyDevTools.png)

#### aria-describedby

[aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute) est utilisé de la même manière que `aria-labelledby` mais fournit une description avec des informations supplémentaires dont l'utilisateur pourrait avoir besoin. Cela peut être utilisé pour décrire les critères de toute entrée :

```html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Full Name:</label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
      aria-describedby="nameDescription"
    />
    <p id="nameDescription">Please provide first and last name.</p>
  </div>
  <button type="submit">Submit</button>
</form>
```

<common-codepen-snippet title="Form ARIA describedby" slug="JjGrKyY" :height="265" tab="js,result" :team="false" user="mlama007" name="Maria" theme="light" :preview="false" :editable="false" />

Vous pouvez voir la description en inspectant Chrome DevTools :

![Chrome Developer Tools showing input accessible name from aria-labelledby and description with aria-describedby](/images/AccessibleARIAdescribedby.png)

### Placeholder

Évitez d'utiliser des caractères de remplacement, car ils peuvent être source de confusion pour de nombreux utilisateurs.

L'un des problèmes que posent les caractères génériques est qu'ils ne respectent pas le [critère de contraste de couleur](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) par défaut ; en fixant le contraste de couleur, le caractère générique ressemble à des données préremplies dans les champs de saisie. Dans l'exemple suivant, vous pouvez constater que le caractère générique Nom de famille, qui répond aux critères de contraste des couleurs, ressemble à des données préremplies :

<common-codepen-snippet title="Form Placeholder" slug="PoZJzeQ" :height="265" tab="js,result" :team="false" user="mlama007" name="Maria" theme="light" :preview="false" :editable="false" />

Il est préférable de fournir toutes les informations dont l'utilisateur a besoin pour remplir les formulaires en dehors de toute saisie.

### Instructions

Lorsque vous ajoutez des instructions pour vos champs de saisie, veillez à les lier correctement à la saisie.
Vous pouvez fournir des instructions supplémentaires et lier plusieurs identifiants à l'intérieur d'un [`aria-labelledby`] (https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute). Cela permet une conception plus souple.

```html
<fieldset>
  <legend>Using aria-labelledby</legend>
  <label id="date-label" for="date">Current Date:</label>
  <input
    type="date"
    name="date"
    id="date"
    aria-labelledby="date-label date-instructions"
  />
  <p id="date-instructions">MM/DD/YYYY</p>
</fieldset>
```

Sinon, vous pouvez joindre les instructions à l'entrée avec [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute) :

```html
<fieldset>
  <legend>Using aria-describedby</legend>
  <label id="dob" for="dob">Date of Birth:</label>
  <input type="date" name="dob" id="dob" aria-describedby="dob-instructions" />
  <p id="dob-instructions">MM/DD/YYYY</p>
</fieldset>
```

<common-codepen-snippet title="Form Instructions" slug="GRoMqYy" :height="265" tab="js,result" :team="false" user="mlama007" name="Maria" theme="light" :preview="false" :editable="false" />

### Masquage du contenu

En général, il n'est pas recommandé de masquer visuellement les étiquettes, même si l'entrée a un nom accessible. Toutefois, si la fonctionnalité de l'entrée peut être comprise avec le contenu environnant, nous pouvons alors masquer l'étiquette visuelle.

Examinons ce champ de recherche :

```html
<form role="search">
  <label for="search" class="hidden-visually">Search: </label>
  <input type="text" name="search" id="search" v-model="search" />
  <button type="submit">Search</button>
</form>
```

Nous pouvons le faire parce que le bouton de recherche aidera les utilisateurs visuels à identifier l'objectif du champ de saisie.

Nous pouvons utiliser les feuilles de style en cascade pour masquer visuellement des éléments tout en les laissant disponibles pour les technologies d'assistance :

```css
.hidden-visually {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  height: 1px;
  width: 1px;
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
}
```

<common-codepen-snippet title="Form Search" slug="qBbpQwB" :height="265" tab="js,result" :team="false" user="mlama007" name="Maria" theme="light" :preview="false" :editable="false" />

#### aria-hidden="true"

L'ajout de `aria-hidden="true"` masquera l'élément pour les technologies d'assistance mais le laissera visuellement disponible pour les autres utilisateurs. Ne l'utilisez pas sur des éléments focalisables, mais uniquement sur du contenu décoratif, dupliqué ou hors écran.

```html
<p>This is not hidden from screen readers.</p>
<p aria-hidden="true">This is hidden from screen readers.</p>
```

### Buttons

Lorsque vous utilisez des boutons à l'intérieur d'un formulaire, vous devez définir le type pour empêcher l'envoi du formulaire.
Vous pouvez également utiliser une entrée pour créer des boutons :

```html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <!-- Buttons -->
  <button type="button">Cancel</button>
  <button type="submit">Submit</button>

  <!-- Input buttons -->
  <input type="button" value="Cancel" />
  <input type="submit" value="Submit" />
</form>
```

<common-codepen-snippet title="Form Buttons" slug="PoZEXoj" :height="467" tab="js,result" :team="false" user="mlama007" name="Maria" theme="light" :preview="false" :editable="false" />

#### Images fonctionnelles

Vous pouvez utiliser cette technique pour créer des images fonctionnelles.

- Champs de saisie

  - Ces images feront office de bouton d'envoi dans les formulaires.

  ```html
  <form role="search">
    <label for="search" class="hidden-visually">Search: </label>
    <input type="text" name="search" id="search" v-model="search" />
    <input
      type="image"
      class="btnImg"
      src="https://img.icons8.com/search"
      alt="Search"
    />
  </form>
  ```

- Icônes

```html
<form role="search">
  <label for="searchIcon" class="hidden-visually">Search: </label>
  <input type="text" name="searchIcon" id="searchIcon" v-model="searchIcon" />
  <button type="submit">
    <i class="fas fa-search" aria-hidden="true"></i>
    <span class="hidden-visually">Search</span>
  </button>
</form>
```

<common-codepen-snippet title="Functional Images" slug="NWxXeqY" :height="265" tab="js,result" :team="false" user="mlama007" name="Maria" theme="light" :preview="false" :editable="false" />
