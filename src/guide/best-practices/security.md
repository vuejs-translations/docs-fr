# Sécurité {#security}

## Signalement des vulnérabilités {#reporting-vulnerabilities}

Lorsqu'une vulnérabilité est signalée, elle devient immédiatement notre principale préoccupation, et un collaborateur à temps plein se concentre pour y remédier. Pour signaler une vulnérabilité, veuillez envoyer un mail à [security@vuejs.org](mailto:security@vuejs.org).

Bien que la découverte de nouvelles vulnérabilités soit rare, nous recommandons également de toujours utiliser les dernières versions de Vue et de ses bibliothèques annexes officielles pour garantir que votre application reste aussi sûre que possible.

## Règle n°1: N'utilisez jamais de templates non fiables {#rule-no-1-never-use-non-trusted-templates}

La règle de sécurité la plus fondamentale lorsque vous utilisez Vue est de **ne jamais utiliser de contenu non fiable comme template de composant**. Cela équivaut à autoriser l'exécution arbitraire de JavaScript dans votre application - et pire encore, cela pourrait entraîner des failles dans le serveur si le code est exécuté pendant le rendu côté serveur. Un exemple d'une telle utilisation :

```js
Vue.createApp({
  template: `<div>` + userProvidedString + `</div>` // NE JAMAIS FAIRE ÇA
}).mount('#app')
```

Les templates Vue sont compilés en JavaScript, et les expressions qui y sont contenues seront exécutées dans le cadre du processus de rendu. Bien que les expressions soient évaluées par rapport à un contexte de rendu spécifique, en raison de la complexité des environnements d'exécution globaux potentiels, il n'est pas possible pour un framework comme Vue de vous protéger complètement de l'exécution potentielle de code malveillant sans risquer une dégradation critique des performances. La façon la plus simple d'éviter complètement ce genre de problèmes est de s'assurer que le contenu de vos templates Vue est toujours fiable et que vous le contrôlez totalement.

## Ce que Vue fait pour vous protéger {#what-vue-does-to-protect-you}

### Contenu HTML {#html-content}

Que vous utilisiez des templates ou des fonctions de rendu, le contenu est automatiquement échappé. Cela signifie que dans ce template :

```vue-html
<h1>{{ userProvidedString }}</h1>
```

si `userProvidedString` contient :

```js
'<script>alert("hi")</script>'
```

alors il sera échappé en l'HTML suivant :

```vue-html
&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;
```

empêchant ainsi l'injection de script. Cet échappement est effectué en utilisant les API natives du navigateur, comme `textContent`, donc une vulnérabilité ne peut exister que si le navigateur lui-même est vulnérable.

### Liaisons d'attributs {#attribute-bindings}

De même, les liaisons d'attributs dynamiques sont automatiquement échappées. Cela signifie que dans ce template :

```vue-html
<h1 :title="userProvidedString">
  hello
</h1>
```

si `userProvidedString` contient :

```js
'" onclick="alert(\'hi\')'
```

alors il sera échappé en l'HTML suivant :

```vue-html
&quot; onclick=&quot;alert('hi')
```

empêchant ainsi la fermeture de l'attribut `title` pour injecter du nouveau HTML arbitraire. Cet échappement est effectué en utilisant les API natives du navigateur, comme `setAttribute`, donc une vulnérabilité ne peut exister que si le navigateur lui-même est vulnérable.

## Dangers potentiels {#potential-dangers}

Dans toute application Web, le fait d'autoriser l'exécution de contenu non nettoyé fourni par l'utilisateur sous forme d'HTML, de CSS ou de JavaScript est potentiellement dangereux et doit donc être évité dans la mesure du possible. Il y a cependant des cas où un certain risque peut être acceptable.

Par exemple, des services tels que CodePen et JSFiddle permettent l'exécution de contenu fourni par l'utilisateur, mais dans un contexte où cela est attendu et encadré dans une certaine mesure par des iframes. Dans les cas où une fonctionnalité importante nécessite intrinsèquement un certain niveau de vulnérabilité, il appartient à votre équipe d'évaluer l'importance de cette dernière par rapport aux pires scénarios qu'elle peut apporter.

### Injection HTML {#html-injection}

Comme vous l'avez appris précédemment, Vue échappe automatiquement le contenu HTML, ce qui vous empêche d'injecter accidentellement du HTML exécutable dans votre application. Cependant, **dans les cas où vous savez que le HTML est sûr**, vous pouvez rendre le contenu HTML de manière explicite :

- En utilisant un template :

  ```vue-html
  <div v-html="userProvidedHtml"></div>
  ```

- En utilisant une fonction de rendu :

  ```js
  h('div', {
    innerHTML: this.userProvidedHtml
  })
  ```

- En utilisant une fonction de rendu avec JSX :

  ```jsx
  <div innerHTML={this.userProvidedHtml}></div>
  ```

:::warning
Le HTML fourni par l'utilisateur ne peut jamais être considéré comme 100 % sûr, sauf s'il se trouve dans une iframe protégée enveloppée dans une sandbox ou dans une partie de l'application où seul l'utilisateur qui a écrit ce HTML peut y être exposé. En outre, permettre aux utilisateurs d'écrire leurs propres templates Vue présente des dangers similaires.
:::

### Injection d'URL {#url-injection}

Dans une URL comme celle-ci :

```vue-html
<a :href="userProvidedUrl">
  click me
</a>
```

Il existe un problème de sécurité potentiel si l'URL n'a pas été "nettoyée" pour empêcher l'exécution de JavaScript en utilisant `javascript:`. Il existe des bibliothèques telles que [sanitize-url](https://www.npmjs.com/package/@braintree/sanitize-url) pour vous aider dans cette tâche, mais attention : si vous effectuez le nettoyage des URL côté front-end, vous avez déjà un problème de sécurité. **Les URL fournies par l'utilisateur doivent toujours être nettoyées par votre backend avant même d'être enregistrées dans une base de données**. Le problème est alors évité pour _tous_ les clients qui se connectent à votre API, y compris depuis les applications mobiles natives. Notez également que même avec des URL nettoyées, Vue ne peut pas vous aider à garantir qu'elles mènent à des destinations sûres.

### Injection de style {#style-injection}

Regardons cet exemple :

```vue-html
<a
  :href="sanitizedUrl"
  :style="userProvidedStyles"
>
  click me
</a>
```

Supposons que `sanitizedUrl` ait été nettoyée, de sorte qu'il s'agisse bien d'une véritable URL et non de JavaScript. Avec le `userProvidedStyles`, les utilisateurs malveillants peuvent toujours fournir du CSS pour "détourner le clic", par exemple en transformant le lien en une boîte transparente au-dessus du bouton "Se connecter". Ensuite, si `https://user-controlled-website.com/` est codé pour ressembler à la page de connexion de votre application, ils peuvent avoir capturé les véritables informations de connexion d'un utilisateur.

Vous pouvez peut-être imaginer comment le fait d'autoriser le contenu fourni par l'utilisateur pour un élément `<style>` créerait une vulnérabilité encore plus grande, en donnant à cet utilisateur un contrôle total sur la façon de styliser la page entière. C'est pourquoi Vue empêche le rendu des balises de style à l'intérieur des templates, comme :

```vue-html
<style>{{ userProvidedStyles }}</style>
```

Pour que vos utilisateurs soient totalement à l'abri du détournement de clic, nous vous recommandons de n'autoriser le contrôle total du CSS qu'à l'intérieur d'une iframe enveloppée dans une sandbox. Par ailleurs, lorsque vous offrez un contrôle à l'utilisateur via une liaison de style, nous vous recommandons d'utiliser sa [syntaxe objet](/guide/essentials/class-and-style#binding-to-objects-1) et de n'autoriser les utilisateurs à fournir des valeurs que pour des propriétés spécifiques qu'ils peuvent contrôler en toute sécurité, comme ceci :

```vue-html
<a
  :href="sanitizedUrl"
  :style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  click me
</a>
```

### Injection JavaScript {#javascript-injection}

Nous déconseillons fortement de rendre un élément `<script>` avec Vue, car les templates et les fonctions de rendu ne devraient jamais avoir d'effets de bord. Cependant, ce n'est pas la seule façon d'inclure des chaînes de caractères qui peuvent être évaluées comme du JavaScript au moment de l'exécution.

Chaque élément HTML possède des attributs dont les valeurs acceptent des chaînes de caractères JavaScript, comme `onclick`, `onfocus` et `onmouseenter`. Lier du JavaScript fourni par l'utilisateur à l'un de ces attributs d'événement constitue un risque potentiel pour la sécurité et doit donc être évité.

:::warning
Le JavaScript fourni par l'utilisateur ne peut jamais être considéré comme 100 % sûr, sauf s'il se trouve dans une iframe protégée enveloppée dans une sandbox ou dans une partie de l'application où seul l'utilisateur qui a écrit ce JavaScript peut y être exposé.
:::

Nous recevons parfois des rapports de vulnérabilité sur la façon dont il est possible de faire du cross-site scripting (XSS) dans les templates Vue. En général, nous ne considérons pas ces cas comme de véritables vulnérabilités car il n'existe aucun moyen pratique de protéger les développeurs contre les deux scénarios qui permettraient le XSS :

1. Le développeur demande explicitement à Vue de rendre le contenu fourni par l'utilisateur, non nettoyé, sous forme de templates Vue. Ceci est intrinsèquement dangereux, et Vue n'a aucun moyen de connaître la source.

2. Le développeur monte Vue sur une page HTML entière qui contient du contenu rendu par le serveur et fourni par l'utilisateur. Il s'agit fondamentalement du même problème que le point \#1, mais les développeurs peuvent parfois le faire sans s'en rendre compte. Cela peut conduire à des vulnérabilités où l'attaquant fournit du HTML qui est sûr en tant que HTML ordinaire mais qui ne l'est pas en tant que template Vue. La meilleure pratique est de **ne jamais monter Vue sur des nœuds qui peuvent contenir du contenu rendu par le serveur et fourni par l'utilisateur**.

## Bonne pratiques {#best-practices}

La règle générale est que si vous autorisez l'exécution d'un contenu non nettoyé fourni par l'utilisateur (HTML, JavaScript ou même CSS), vous vous exposez à des attaques. Ce conseil est valable que vous utilisiez Vue, un autre framework ou même aucun framework.

Outre les recommandations formulées ci-dessus concernant les [dangers potentiels](#potential-dangers), nous vous recommandons également de vous familiariser avec ces ressources :

- [Aide-mémoire sur la sécurité HTML5](https://html5sec.org/)
- [Aide-mémoire de l'OWASP sur la prévention du Cross Site Scripting (XSS)](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

Profitez ensuite de ce que vous avez appris pour examiner le code source de vos dépendances afin d'y déceler des modèles potentiellement dangereux, si l'un d'entre eux inclut des composants tiers ou influence de quelque manière que ce soit le rendu dans le DOM.

## Coordination avec le backend {#backend-coordination}

Les vulnérabilités de sécurité HTTP, telles que la falsification des requêtes inter-sites (CSRF/XSRF) et l'inclusion de scripts inter-sites (XSSI), sont principalement traitées au niveau du backend, et ne sont donc pas une préoccupation de Vue. Cependant, il est toujours bon de communiquer avec votre équipe backend pour apprendre comment interagir au mieux avec leur API, par exemple en soumettant des jetons CSRF pour les soumissions de formulaires.

## Rendu côté serveur (SSR) {#server-side-rendering-ssr}

L'utilisation de SSR pose quelques problèmes de sécurité supplémentaires. Veillez donc à suivre les meilleures pratiques décrites dans [notre documentation SSR](/guide/scaling-up/ssr) pour éviter les vulnérabilités.
