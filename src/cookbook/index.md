# Introduction

## Le livre de cuisine vs le guide

En quoi le livre de recettes est-il différent du guide ? Pourquoi cela est-il nécessaire ?

- **Plus grande attention** : Dans le guide, nous racontons essentiellement une histoire. Chaque section s'appuie sur les connaissances acquises dans les sections précédentes et les présume. Dans le livre de recettes, chaque recette peut et doit être autonome. Cela signifie que les recettes peuvent se concentrer sur un aspect spécifique de Vue, plutôt que de devoir donner un aperçu général.

- **Plus grande profondeur** : Pour éviter de rendre le guide trop long, nous essayons de n'inclure que les exemples les plus simples possibles pour vous aider à comprendre chaque fonctionnalité. Ensuite, nous passons à autre chose. Dans le livre de recettes, nous pouvons inclure des exemples plus complexes, combinant des fonctionnalités de manière intéressante. Chaque recette peut également être aussi longue et détaillée que nécessaire, afin d'explorer pleinement sa niche.

- **Teaching JavaScript** : Dans ce guide, nous supposons que vous avez au moins une connaissance intermédiaire du JavaScript ES5. Par exemple, nous n'expliquerons pas comment `Array.prototype.filter` fonctionne dans une propriété calculée qui filtre une liste. Dans le livre de cuisine, cependant, les fonctionnalités JavaScript essentielles (y compris ES6/2015+) peuvent être explorées et expliquées dans le contexte de la façon dont elles nous aident à construire de meilleures applications Vue.

- **Exploration de l'écosystème** : Pour les fonctionnalités avancées, nous supposons une certaine connaissance de l'écosystème. Par exemple, si vous souhaitez utiliser des composants à fichier unique dans Webpack, nous n'expliquons pas comment configurer les parties non Vue de la configuration de Webpack. Dans le livre de recettes, nous avons l'espace pour explorer ces bibliothèques de l'écosystème plus en profondeur - au moins dans la mesure où cela est universellement utile pour les développeurs Vue.

::: tip
Malgré toutes ces différences, veuillez noter que le livre de recettes n'est toujours pas un manuel étape par étape. Pour la plupart de son contenu, vous êtes censé avoir une compréhension de base de concepts tels que HTML, CSS, JavaScript, npm/yarn, etc.
:::

### Contributions au livre de cuisine

### Ce que nous recherchons

Le livre de recettes donne aux développeurs des exemples à partir desquels ils peuvent travailler, qui couvrent des cas d'utilisation courants ou intéressants, et qui expliquent progressivement des détails plus complexes. Notre objectif est d'aller au-delà d'un simple exemple d'introduction, et de démontrer des concepts qui sont plus largement applicables, ainsi que certaines mises en garde concernant l'approche.

Si vous souhaitez contribuer, veuillez initier une collaboration en déposant un problème sous l'étiquette **idée de livre de cuisine** avec votre concept afin que nous puissions vous guider vers une demande d'extraction réussie. Une fois que votre idée a été approuvée, veuillez suivre le modèle ci-dessous autant que possible. Certaines sections sont obligatoires, d'autres sont facultatives. Le respect de l'ordre numérique est fortement suggéré, mais pas obligatoire.

Les recettes doivent généralement :

- Résoudre un problème spécifique et courant
- Commencer par l'exemple le plus simple possible
- Introduire les complexités une par une
- Etablir des liens vers d'autres documents, plutôt que de réexpliquer des concepts
- Décrire le problème, plutôt que de supposer qu'il est connu.
- Expliquez le processus, plutôt que le résultat final.
- Expliquez les avantages et les inconvénients de votre stratégie, y compris quand elle est appropriée et quand elle ne l'est pas.
- Mentionnez les solutions alternatives, le cas échéant, mais laissez les explorations approfondies à une recette séparée.

Nous vous demandons de suivre le modèle ci-dessous. Nous comprenons toutefois qu'il est parfois nécessaire de s'en écarter pour des raisons de clarté ou de fluidité. Quoi qu'il en soit, toutes les recettes doivent, à un moment donné, discuter de la nuance du choix effectué à l'aide de ce modèle, de préférence sous la forme d'une section consacrée aux modèles alternatifs.

### Exemple de base <Badge text="required" type="error" />

1.  Articulez le problème en une ou deux phrases.
2.  Expliquez la solution la plus simple possible en une ou deux phrases.
3.  Montrez un petit échantillon de code.
4.  Expliquez ce que cela accomplit en une phrase.

### Détails sur la valeur <Badge text="required" type="error" />

1.  Répondez aux questions courantes que l'on peut se poser en regardant l'exemple. (Les guillemets sont parfaits pour cela)
2.  Montrez des exemples de faux pas courants et comment les éviter.
3.  Montrez des exemples de code très simples de bons et de mauvais modèles.
4.  Discutez des raisons pour lesquelles ce modèle peut être convaincant. Les liens de référence ne sont pas obligatoires mais sont encouragés.

### Exemple du monde réel <Badge text="required" type="error" />

Démontrez le code qui alimenterait un cas d'utilisation commun ou intéressant, soit en :

1.  Marchant à travers quelques exemples laconiques de configuration, ou.
2.  Intégrant un exemple de codepen/jsfiddle.

Si vous choisissez cette dernière option, vous devez quand même expliquer ce qu'il est et ce qu'il fait.

### Contexte supplémentaire <Badge text="optional" />

Il est extrêmement utile d'écrire un peu sur ce modèle, où il pourrait s'appliquer, pourquoi il fonctionne bien, et d'exécuter un peu de code en le faisant ou de donner aux gens d'autres documents à lire ici.

### Quand éviter ce modèle <Badge text="optional" />

Cette section n'est pas obligatoire, mais fortement recommandée. Cela n'aura pas de sens de l'écrire pour quelque chose de très simple comme basculer des classes en fonction du changement d'état, mais pour des patterns plus avancés comme les mixins, c'est vital. La réponse à la plupart des questions sur le développement est ["Cela dépend !"](https://codepen.io/rachsmith/pen/YweZbG), cette section en tient compte. Ici, nous jetterons un regard honnête sur les cas où le pattern est utile et ceux où il doit être évité, ou encore ceux où quelque chose d'autre a plus de sens.

### Alternative Patterns <Badge text="required with avoidance section" type="warning" />

Cette section est requise lorsque vous avez fourni la section ci-dessus sur l'évitement. Il est important d'explorer d'autres méthodes afin que les personnes à qui l'on dit que quelque chose est un anti-modèle dans certaines situations ne se posent pas de questions. Ce faisant, tenez compte du fait que le Web est une grande tente et que de nombreuses personnes ont des structures de base de code différentes et poursuivent des objectifs différents. L'application est-elle petite ou grande ? Intègrent-ils Vue dans un projet existant ou construisent-ils à partir de zéro ? Les utilisateurs essaient-ils d'atteindre un seul objectif ou plusieurs ? Y a-t-il beaucoup de données asynchrones ? Toutes ces préoccupations auront un impact sur les implémentations alternatives. Une bonne recette de livre de cuisine donne aux développeurs ce contexte.

## Merci

Il faut du temps pour contribuer à la documentation, et si vous prenez le temps de soumettre un PR à cette section de notre documentation, vous le faites avec notre gratitude.
