## Test

## Introduction

Lorsqu'il s'agit de construire des applications fiables, les tests peuvent jouer un rôle critique dans la capacité d'un individu ou d'une équipe à construire de nouvelles fonctionnalités, à remanier le code, à corriger les bogues, etc. Bien qu'il existe de nombreuses écoles de pensée en matière de tests, il y a trois catégories souvent discutées dans le contexte des applications web :

- Les tests unitaires
- Test des composants
- Tests de bout en bout (E2E)

Cette section vise à fournir des conseils pour naviguer dans l'écosystème des tests et choisir les bons outils pour votre application Vue ou votre bibliothèque de composants.

## Test unitaire

### Introduction

Les tests unitaires vous permettent de tester des unités individuelles de code de manière isolée. L'objectif des tests unitaires est de donner aux développeurs la confiance dans leur code. En écrivant des tests complets et significatifs, vous obtenez la certitude qu'à mesure que de nouvelles fonctionnalités sont construites ou que votre code est remanié, votre application restera fonctionnelle et stable.

Le test unitaire d'une application Vue n'est pas très différent du test d'autres types d'applications.

### Choisir son framework

Étant donné que les conseils en matière de tests unitaires sont souvent indépendants du framework, voici quelques directives de base à garder à l'esprit lors de l'évaluation de l'outil de test unitaire le mieux adapté à votre application.

#### Rapport d'erreur de première classe

Lorsque les tests échouent, il est essentiel que votre cadre de test unitaire fournisse des erreurs utiles. C'est le rôle de la bibliothèque d'affirmations. Une affirmation avec des messages d'erreur de haute qualité permet de minimiser le temps nécessaire au débogage du problème. En plus de vous dire simplement quel test échoue, les bibliothèques d'affirmations fournissent un contexte pour expliquer pourquoi un test échoue, par exemple, ce qui est attendu par rapport à ce qui a été reçu.

Certains cadres de tests unitaires, comme Jest, incluent des bibliothèques d'affirmations. D'autres, comme Mocha, vous obligent à installer des bibliothèques d'affirmation séparément (généralement Chai).

#### Communauté et équipe actives

Comme la majorité des frameworks de tests unitaires sont open-source, avoir une communauté active peut être critique pour certaines équipes qui maintiendront leurs tests pendant une longue période et doivent s'assurer qu'un projet sera activement maintenu. En outre, le fait de disposer d'une communauté active présente l'avantage de fournir davantage de soutien lorsque vous rencontrez des problèmes.

### Frameworks

Bien qu'il existe de nombreux outils dans l'écosystème, voici quelques outils de test unitaire courants qui sont utilisés dans l'écosystème Vue.js.

#### Jest

Jest est un cadre de test JavaScript axé sur la simplicité. L'une de ses caractéristiques uniques est la possibilité de prendre des instantanés de tests afin de fournir un moyen alternatif de vérifier les unités de votre application. 

**Resources:**

- [Official Jest Website](https://jestjs.io)
- [Official Vue 2 CLI Plugin - Jest](https://cli.vuejs.org/core-plugins/unit-jest.html)

#### Mocha

Mocha est un cadre de test JavaScript qui vise à être flexible. En raison de cette flexibilité, il vous permet de choisir différentes bibliothèques pour remplir d'autres fonctionnalités communes telles que l'espionnage (par exemple Sinon) et les affirmations (par exemple Chai). Une autre caractéristique unique de Mocha est qu'il peut également exécuter des tests dans le navigateur en plus de Node.js.

**Resources:**

- [Official Mocha Website](https://mochajs.org)
- [Official Vue CLI Plugin - Mocha](https://cli.vuejs.org/core-plugins/unit-mocha.html)

### Test des composants

### Introduction

Pour tester la plupart des composants Vue, ils doivent être montés sur le DOM (virtuel ou réel) afin d'affirmer pleinement qu'ils fonctionnent. Il s'agit d'un autre concept agnostique du framework. Par conséquent, les frameworks de test de composants ont été créés pour donner aux utilisateurs la possibilité de le faire de manière fiable tout en offrant des commodités spécifiques à Vue telles que des intégrations pour Vuex, Vue Router et d'autres plugins Vue.

### Choisir son framework

La section suivante fournit des directives sur les éléments à garder à l'esprit lors de l'évaluation du framework de test de composants le mieux adapté à votre application.

#### Compatibilité optimale avec l'écosystème Vue

Il n'est pas surprenant que l'un des premiers critères que doit avoir une bibliothèque de test de composants soit d'être aussi compatible que possible avec l'écosystème Vue. Bien que cela puisse sembler exhaustif, certains domaines d'intégration clés à garder à l'esprit incluent les composants à fichier unique (SFC), Vuex, Vue Router, et tout autre plugin spécifique à Vue sur lequel votre application repose. 

#### Rapport d'erreur de première classe

Lorsque les tests échouent, il est essentiel que votre cadre de test de composants fournisse des journaux d'erreurs utiles qui permettent de minimiser le temps nécessaire au débogage du problème. En plus de vous dire simplement quel test a échoué, ils devraient également fournir le contexte pour lequel un test échoue, par exemple, ce qui est attendu par rapport à ce qui a été reçu.

### Recommandations

#### Bibliothèque de test Vue (@testing-library/vue)

Vue Testing Library est un ensemble d'outils axés sur le test des composants sans s'appuyer sur les détails de mise en œuvre. Construit avec l'accessibilité à l'esprit, son approche rend également la refactorisation un jeu d'enfant.

Son principe directeur est le suivant : plus les tests ressemblent à la façon dont le logiciel est utilisé, plus ils peuvent inspirer confiance.

**Resources:**

- [Official Vue Testing Library Website](https://testing-library.com/docs/vue-testing-library/intro)

#### Vue Test Utils

Vue Test Utils est la bibliothèque officielle de test de composants de bas niveau qui a été écrite pour permettre aux utilisateurs d'accéder aux API spécifiques de Vue. Si vous n'avez jamais testé d'applications Vue, nous vous recommandons d'utiliser Vue Testing Library, qui est une abstraction par rapport à Vue Test Utils. 

**Resources:**

- [Official Vue Test Utils Documentation](https://vue-test-utils.vuejs.org)
- [Vue Testing Handbook](https://lmiller1990.github.io/vue-testing-handbook/v3/#what-is-this-guide) by Lachlan Miller

### Tests de bout en bout (E2E)

### Introduction

Alors que les tests unitaires offrent aux développeurs un certain degré de confiance, les tests unitaires et de composants sont limités dans leur capacité à fournir une couverture holistique d'une application lorsqu'elle est déployée en production. Par conséquent, les tests de bout en bout (E2E) fournissent une couverture de ce qui est sans doute l'aspect le plus important d'une application : ce qui se passe lorsque les utilisateurs utilisent réellement vos applications.

En d'autres termes, les tests E2E valident toutes les couches de votre application. Il ne s'agit pas seulement de votre code frontal, mais aussi de tous les services et infrastructures dorsaux associés qui sont plus représentatifs de l'environnement dans lequel vos utilisateurs se trouveront. En testant l'impact des actions des utilisateurs sur votre application, les tests E2E sont souvent la clé d'une plus grande confiance dans le bon fonctionnement de l'application.

### Choisir son framework

Alors que les tests de bout en bout (E2E) sur le Web ont acquis une réputation négative en raison du manque de fiabilité des tests et du ralentissement des processus de développement, les outils E2E modernes ont fait des progrès pour créer des tests plus fiables, interactifs et utiles. Lors du choix d'un cadre de test E2E, les sections suivantes fournissent des conseils sur les éléments à garder à l'esprit lors du choix d'un cadre de test pour votre application.

#### Tests inter-navigateurs

L'un des principaux avantages des tests de bout en bout (E2E) est leur capacité à tester votre application sur plusieurs navigateurs. Bien qu'il puisse sembler souhaitable d'avoir une couverture inter-navigateurs de 100%, il est important de noter que les tests inter-navigateurs ont un rendement décroissant sur les ressources d'une équipe en raison du temps et de la puissance machine supplémentaires nécessaires pour les exécuter de manière cohérente. Par conséquent, il est important d'être conscient de ce compromis lorsque vous choisissez la quantité de tests inter-navigateurs dont votre application a besoin. 

::: tip
Une évolution récente dans la détection des problèmes spécifiques aux navigateurs consiste à utiliser des outils de surveillance des applications et de signalement des erreurs (par exemple, Sentry, LogRocket, etc.) pour les navigateurs qui ne sont pas aussi couramment utilisés (par exemple, < IE11, les anciennes versions de Safari, etc.)
:::

#### Boucles de rétroaction plus rapides

L'un des principaux problèmes des tests et du développement de bout en bout (E2E) est que l'exécution de la suite complète prend beaucoup de temps. Généralement, cette opération n'est effectuée que dans les pipelines d'intégration et de déploiement continus (CI/CD). Les frameworks de test E2E modernes ont contribué à résoudre ce problème en ajoutant des fonctionnalités telles que la parallélisation, qui permet aux pipelines CI/CD de fonctionner souvent plus rapidement qu'auparavant. En outre, lors d'un développement local, la possibilité d'exécuter sélectivement un seul test pour la page sur laquelle vous travaillez, tout en permettant le rechargement à chaud des tests, peut contribuer à améliorer le flux de travail et la productivité d'un développeur.

#### Une expérience de débogage de premier ordre

Alors que les développeurs s'appuient traditionnellement sur l'analyse des journaux dans une fenêtre de terminal pour déterminer ce qui n'a pas fonctionné dans un test, les cadres de test modernes de bout en bout (E2E) permettent aux développeurs d'exploiter des outils qu'ils connaissent déjà, par exemple les outils de développement des navigateurs. 

#### Visibilité en mode sans tête

Lorsque des tests de bout en bout (E2E) sont exécutés dans des pipelines d'intégration/déploiement continus, ils sont souvent exécutés dans des navigateurs sans tête (c'est-à-dire qu'aucun navigateur visible n'est ouvert pour que l'utilisateur puisse le regarder). Par conséquent, lorsque des erreurs se produisent, une fonctionnalité essentielle que les cadres de test E2E modernes prennent en charge de première classe est la possibilité de voir des instantanés et/ou des vidéos de vos applications au cours des différentes étapes de test afin de fournir un aperçu de la raison des erreurs. Historiquement, il était fastidieux de maintenir ces intégrations.

### Recommandations

Bien qu'il existe de nombreux outils dans l'écosystème, voici quelques cadres de test de bout en bout (E2E) courants qui sont utilisés dans l'écosystème Vue.js.

#### Cypress.io

Cypress.io est un cadre de test qui vise à améliorer la productivité des développeurs en leur permettant de tester leurs applications de manière fiable tout en leur offrant une expérience de premier ordre.

**Resources:**

- [Cypress' Official Website](https://www.cypress.io)
- [Official Vue CLI Cypress Plugin](https://cli.vuejs.org/core-plugins/e2e-cypress.html)
- [Cypress Testing Library](https://github.com/testing-library/cypress-testing-library)

#### Nightwatch.js

Nightwatch.js est un cadre de test de bout en bout qui peut être utilisé pour tester les applications web et les sites Web, ainsi que les tests unitaires et d'intégration de Node.js.

**Resources:**

- [Nightwatch's Official Website](https://nightwatchjs.org)
- [Official Vue CLI Nightwatch Plugin](https://cli.vuejs.org/core-plugins/e2e-nightwatch.html)

#### Puppeteer

Puppeteer est une bibliothèque Node qui fournit une API de haut niveau pour contrôler le navigateur et peut s'associer à d'autres exécutants de test (par exemple, Jest) pour tester votre application.

**Resources:**

- [Puppeteer's Official Website](https://pptr.dev)

#### TestCafe

TestCafe est un cadre de bout en bout basé sur Node.js qui vise à fournir une configuration facile afin que les développeurs puissent se concentrer sur la création de tests faciles à écrire et fiables.

**Resources:**

- [TestCafe's Official Website](https://devexpress.github.io/testcafe/)
