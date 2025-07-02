<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>
<style>
.lambdatest {
  background-color: var(--vt-c-bg-soft);
  border-radius: 8px;
  padding: 12px 16px 12px 12px;
  font-size: 13px;
  a {
    display: flex;
    color: var(--vt-c-text-2);
  }
  img {
    background-color: #fff;
    padding: 12px 16px;
    border-radius: 6px;
    margin-right: 24px;
  }
  .testing-partner {
    color: var(--vt-c-text-1);
    font-size: 15px;
    font-weight: 600;
  }
}
</style>

# Tester {#testing}

## Pourquoi tester ? {#why-test}

Les tests automatisés vous aident ainsi que votre équipe à construire des applications Vue complexes rapidement et avec confiance en prévenant les régressions et en vous encourageant à décomposer votre application en fonctions, modules, classes et composants testables. Comme toute autre application, votre nouvelle application Vue peut dysfonctionner de différentes manières, et il est important que vous puissiez détecter ces problèmes avant de livrer.

Dans ce guide, nous allons couvrir la terminologie basique et donner des recommandations d'outils à choisir pour votre application Vue 3.

Une section dédiée à Vue couvre les composables. Voir [Tester les composables](#testing-composables) ci-dessous pour plus de détails.

## Quand tester ? {#when-to-test}

Commencez tôt ! Nous recommandons de commencer à écrire des tests dès que vous le pouvez. Plus vous attendrez avant d'ajouter des tests à votre application, plus votre application aura des dépendances, et il sera plus difficile de commencer.

## Types de tests {#testing-types}

Quand vous concevez la stratégie de test de votre application Vue, vous devriez mettre en place les types de tests suivants :

- **Unitaire** : Vérifie que les entrées d'une fonction, classe, ou composable donné produisent les sorties ou effets de bord attendus.
- **Composant** : Vérifie que le montage, le rendu, les interactions et le comportement d'un composant ont lieu comme prévu. Ces tests exercent plus de code que des tests unitaires, sont plus complexes et requièrent plus de temps pour s'exécuter.
- **End-to-end** : Vérifie des fonctionnalités qui traversent plusieurs pages et émettent des vraies requêtes réseau sur votre application Vue construite pour la production. Ces tests impliquent souvent la mise en place d'une base de données ou d'un autre backend.

Chaque type de test joue un rôle dans la stratégie de test de votre application, et vous protégera de différents problèmes.

## Aperçu {#overview}

Nous allons brièvement discuter de ce que chacun de ces tests sont, de comment ils peuvent être implémentés pour des applications Vue et donner quelques recommendations générales.

## Tester unitairement {#unit-testing}

Les tests unitaires sont écrits pour vérifier que des petites unités de code isolées fonctionnent comme prévu. Un test unitaire couvre généralement une seule fonction, classe, composable ou module. Les tests unitaires se concentrent sur l'exactitude logique et ne concernent qu'une petite partie des fonctionnalités globales de l'application. Ils peuvent simuler de grandes parties de l'environnement de votre application (par exemple, l'état initial, les classes complexes, les modules tierce partie et les requêtes réseau).

En général, les tests unitaires vont détecter des problèmes concernant la logique métier d'une fonction et son exactitude logique.

Prenons par exemple cette fonction `increment` :

```js [helpers.js]
export function increment(current, max = 10) {
  if (current < max) {
    return current + 1
  }
  return current
}
```

Comme cette fonction est très autonome, il sera facile de l'appeler et de vérifier qu'elle retourne ce qu'elle est supposée faire, nous allons donc écrire un test unitaire.

Si l'une de ces assertions échoue, il est clair que le problème est contenu dans la fonction `increment`.

```js{4-16} [helpers.spec.js]
import { increment } from './helpers'

describe('increment', () => {
  test('increments the current number by 1', () => {
    expect(increment(0, 10)).toBe(1)
  })

  test('does not increment the current number over the max', () => {
    expect(increment(10, 10)).toBe(10)
  })

  test('has a default max of 10', () => {
    expect(increment(10)).toBe(10)
  })
})
```

Comme mentionné précédemment, les tests unitaires sont généralement exercés sur de la logique métier, des composants, classes, modules, ou fonctions qui ne nécessitent pas de rendu visuel, de requêtes réseau, ou d'autres problématiques d'environnement.

Il s'agit généralement de modules écrits en JavaScript / TypeScript simple sans rapport avec Vue. En général, écrire des tests unitaires pour de la logique métier dans des applications Vue ne diffère pas de manière significative des applications utilisant d'autres frameworks.

Il existe deux cas où vous testez unitairement des fonctionnalités spécifiques à Vue :

1. Composables
2. Composants

### Composables {#composables}

[Les composables](/guide/reusability/composables) sont une catégorie de fonctions spécifiques aux applications Vue qui peut nécessiter un traitement spécial pendant les tests.
Voir la section [Tester les composables](#testing-composables) ci-dessous pour plus de détails.

### Tester unitairement des composants {#unit-testing-components}

Un composant peut être testé de deux façons :

1. Boîte blanche : Test unitaire

   Les tests "Boîte blanche" ont "conscience" des détails d'implémentation et des dépendances d'un composant. Ils se concentrent sur l'**isolation** du composant testé. Ces tests impliquent en général de simuler certains sinon tous les enfants de votre composant ainsi que d'initialiser l'état de plugins et dépendances (ex. Pinia).

2. Boîte noire : Test de composant

   Les tests "Boîte noire" n'ont pas "conscience" des détails d'implémentation d'un composant. Ces tests simulent le moins possible afin de tester l'intégration de vos composants et le système entier. Ils font généralement le rendu HTML de l'ensemble des sous-composants et sont considérés plus comme un "test d'intégration". Voir les [recommendations de test de composant](#component-testing) ci-dessous.

### Recommandation {#recommendation-1}

- [Vitest](https://vitest.dev/)

  Étant donné que la configuration officielle créée par `create-vue` est basée sur [Vite](https://vitejs.dev/), nous vous recommandons d'utiliser un framework de test unitaire pour tirer parti de la même configuration et pipeline de transformation directement à partir de Vite. [Vitest](https://vitest.dev/) est un framework de test unitaire conçu spécifiquement à cet effet, créé et maintenu par les membres de l'équipe Vue / Vite. Il s'intègre aux projets basés sur Vite avec un minimum d'effort et est ultrarapide.

### Autres options {#other-options}

- [Jest](https://jestjs.io/) est un framework de test unitaire populaire. Cependant, nous ne recommandons Jest que si vous avez une suite de tests Jest existante qui doit être migrée vers un projet basé sur Vite, car Vitest offre une intégration plus transparente et de meilleures performances.

## Test de composant {#component-testing}

Dans les applications Vue, les composants sont les principaux blocs de construction de l'interface utilisateur. Les composants sont donc l'unité naturelle d'isolement lorsqu'il s'agit de valider le comportement de votre application. Du point de vue de la granularité, les tests de composants se situent quelque part au-dessus des tests unitaires et peuvent être considérés comme une forme de test d'intégration. Une grande partie de votre application Vue doit être couverte par un test de composant et nous vous recommandons que chaque composant Vue ait son propre fichier de spécifications.

Les tests de composant doivent détecter les problèmes liés aux props, aux événements, aux slots qu'un composant fournit, aux styles, aux classes, aux hooks de cycle de vie de votre composant, etc.

Les tests de composant ne doivent pas simuler des composants enfants, mais plutôt tester les interactions entre votre composant et ses enfants en interagissant avec les composants comme le ferait un utilisateur. Par exemple, un test de composant doit cliquer sur un élément comme le ferait un utilisateur au lieu d'interagir programmatiquement avec le composant.

Les tests de composant doivent se concentrer sur les interfaces publiques du composant plutôt que sur les détails internes d'implémentation. Pour la plupart des composants, l'interface publique est limitée aux événements émis, aux props et aux slots. Lors du test, n'oubliez pas de **tester ce que fait un composant, pas comment il le fait**.

**FAITES**

- Pour la logique **visuelle** : vérifiez que le rendu en sortie est correct en fonction des props et des slots saisis.
- Pour la logique **comportementale** : vérifiez que les mises à jour de rendu ou les événements émis en réponse aux événements d'entrée de l'utilisateur sont corrects.

  Dans l'exemple ci-dessous, nous démontrons un composant Stepper qui a un élément DOM intitulé "increment" et sur lequel vous pouvez cliquer. Nous passons une prop appelée `max` qui empêche le Stepper d'être incrémenté au-delà de `2`, donc si nous cliquons sur le bouton 3 fois, l'interface utilisateur devrait toujours dire `2`.

  Nous ne savons rien de l'implémentation de Stepper, seulement que l'"entrée" est la prop `max` et que la "sortie" est l'état du DOM tel que l'utilisateur le verra.

::: code-group

```js [Vue Test Utils]
const valueSelector = '[data-testid=stepper-value]'
const buttonSelector = '[data-testid=increment]'

const wrapper = mount(Stepper, {
  props: {
    max: 1
  }
})

expect(wrapper.find(valueSelector).text()).toContain('0')

await wrapper.find(buttonSelector).trigger('click')

expect(wrapper.find(valueSelector).text()).toContain('1')
```

```js [Cypress]
const valueSelector = '[data-testid=stepper-value]'
const buttonSelector = '[data-testid=increment]'

mount(Stepper, {
  props: {
    max: 1
  }
})

cy.get(valueSelector)
  .should('be.visible')
  .and('contain.text', '0')
  .get(buttonSelector)
  .click()
  .get(valueSelector)
  .should('contain.text', '1')
```

```js [Testing Library]
const { getByText } = render(Stepper, {
  props: {
    max: 1
  }
})

getByText('0') // Vérification implicite que "0" se trouve dans le composant

const button = getByRole('button', { name: /increment/i })

// Envoi d'un événement click sur notre bouton d'incrémentation.
await fireEvent.click(button)

getByText('1')

await fireEvent.click(button)
```

:::

**NE FAITES PAS**

- Ne vérifiez pas l'état privé d'une instance de composant et ne testez pas les méthodes privées d'un composant. Tester les détails de l'implémentation rend les tests fragiles, car ils sont plus susceptibles de se rompre et nécessitent des mises à jour lorsque l'implémentation change.

  Le travail ultime du composant est un rendu DOM en sortie correct, de sorte que les tests axés sur la sortie DOM fournissent le même niveau d'assurance d'exactitude (sinon plus) tout en étant plus robustes et résilients au changement.

  Ne vous fiez pas exclusivement aux tests snapshots. Vérifier des chaînes HTML ne décrit pas l'exactitude. Rédigez des tests avec intention.

  Si une méthode doit être testée de manière approfondie, envisagez de l'extraire dans une fonction utilitaire autonome et d'écrire un test unitaire dédié à celle-ci. S'il ne peut pas être extrait proprement, il peut être testé dans le cadre d'un test de composant, d'intégration ou bout-en-bout qui le couvre.

### Recommendation {#recommandation}

- [Vitest](https://vitest.dev/) pour les composants ou composables qui ont un rendu headless (ex. la fonction [`useFavicon`](https://vueuse.org/core/useFavicon/#usefavicon) dans VueUse). Les composants et le DOM peuvent être testés à l'aide de [`@vue/test-utils`](https://github.com/vuejs/test-utils).

- [Les tests de composants Cypress](https://on.cypress.io/component) pour les composants dont le comportement attendu dépend du rendu correct des styles ou du déclenchement d'événements DOM natifs. Peut être utilisé avec Testing Library via [`@testing-library/cypress`](https://testing-library.com/docs/cypress-testing-library/intro).

Les principales différences entre Vitest et les runners basés sur un navigateur sont la rapidité et le contexte d'exécution. En bref, les runners basés sur un navigateur, comme Cypress, peuvent détecter des problèmes que les runners basés sur node, comme Vitest, ne peuvent pas détecter (par exemple, les problèmes de style, les événements DOM natifs réels, les cookies, le local storage et les défaillances réseau), mais les runners basés sur un navigateur sont _bien plus lents que Vitest_ parce qu'ils ouvrent un navigateur, compilent vos feuilles de style, etc. Cypress est un runner basé sur un navigateur qui prend en charge les tests de composants. Veuillez lire [la page de comparaison de Vitest](https://vitest.dev/guide/comparisons.html#cypress) pour obtenir les dernières informations comparant Vitest et Cypress.

### Bibliothèques de montage {#mounting-libraries}

Le test de composant implique souvent le montage du composant testé isolément, le déclenchement d'événements d'entrée utilisateur simulés et la vérification du rendu DOM en sortie. Il existe des bibliothèques d'utilitaires dédiées qui simplifient ces tâches.

- [`@vue/test-utils`](https://github.com/vuejs/test-utils) est la bibliothèque officielle de test de composants de bas niveau qui a été écrite pour permettre aux utilisateurs d'accéder à des API spécifiques à Vue. C'est aussi la bibliothèque de bas niveau sur laquelle `@testing-library/vue` est construite.

- [`@testing-library/vue`](https://github.com/testing-library/vue-testing-library) est une bibliothèque de test Vue axée sur le test de composants sans s'appuyer sur les détails de l'implémentation. Construit avec l'accessibilité à l'esprit, son approche rend également la refactorisation un jeu d'enfant. Son principe directeur est que plus les tests ressemblent à la façon dont les logiciels sont utilisés, plus on peut leur faire confiance.

Nous vous recommandons d'utiliser `@vue/test-utils` pour tester les composants dans les applications. `@testing-library/vue` a des problèmes avec le test du composant asynchrone avec Suspense, il doit donc être utilisé avec prudence.

- [Nightwatch](https://nightwatchjs.org/) est un testeur E2E avec prise en charge de Vue Component Testing. ([Projet d'exemple](https://github.com/nightwatchjs-community/todo-vue))

- [WebdriverIO](https://webdriver.io/docs/component-testing/vue) pour les tests de composants inter-navigateurs qui reposent sur une interaction utilisateur native basée sur une automatisation standardisée. Peut également être utilisé avec la bibliothèque de tests.

## Tests E2E {#e2e-testing}

Alors que les tests unitaires offrent aux développeurs un certain degré de confiance, les tests unitaires et les tests de composants sont limités dans leur capacité à fournir une couverture holistique d'une application lorsqu'ils sont déployés en production. En conséquence, les tests End-to-end (E2E) offrent une couverture sur ce qui est sans doute l'aspect le plus important d'une application : ce qui se passe lorsque les utilisateurs utilisent réellement vos applications.

Les tests End-to-end se concentrent sur le comportement des applications multipages qui effectuent des requêtes réseau par rapport à votre application Vue de production. Ils impliquent souvent la mise en place d'une base de données ou d'un autre backend et peuvent même être exécutés dans un environnement de staging déployé.

Les tests End-to-end détectent souvent des problèmes avec votre routeur, votre bibliothèque de gestion d'état, vos composants de niveau supérieur (par exemple, une application ou une mise en page), vos ressources publiques ou toute autre gestion de requêtes. Comme indiqué ci-dessus, ils détectent des problèmes critiques qui peuvent être impossibles à détecter avec des tests unitaires ou des tests de composants.

Les tests End-to-end n'importent pas le code de votre application Vue, mais reposent entièrement sur le test de votre application en naviguant dans des pages entières dans un navigateur réel.

Les tests End-to-end valident de nombreuses couches de votre application. Ils peuvent soit cibler votre application localement soit même un environnement de staging déployé. Les tests exercés sur votre environnement de staging incluent non seulement votre code frontend et votre serveur statique mais également tous les services et infrastructures backend associés.

> Plus vos tests ressemblent à la manière dont votre application est utilisée, plus ils vous donneront confiance. [Kent C. Dodds](https://twitter.com/kentcdodds/status/977018512689455106), auteur de la bibliothèque de tests

En testant l'impact des actions des utilisateurs sur votre application, les tests E2E sont souvent la clé d'une plus grande confiance dans le bon fonctionnement ou non d'une application.

### Choisir une solution de test E2E {#choosing-an-e2e-testing-solution}

Alors que les tests End-to-end (E2E) sur le Web ont acquis une réputation négative pour les tests peu fiables ("flaky") et le ralentissement des processus de développement, les outils E2E modernes ont fait des progrès pour créer des tests plus fiables, interactifs et utiles. Lorsque vous choisissez une infrastructure de test E2E, les sections suivantes fournissent des conseils sur les éléments à garder à l'esprit lors du choix d'une infrastructure de test pour votre application.

#### Tester avec plusieurs navigateurs {#cross-browser-testing}

L'un des principaux avantages pour lesquels les tests End-to-end (E2E) sont connus est sa capacité à tester votre application sur plusieurs navigateurs. Bien qu'il puisse sembler souhaitable d'avoir une couverture inter-navigateurs à 100%, il est important de noter que les tests inter-navigateurs ont des rendements décroissants sur les ressources d'une équipe en raison du temps supplémentaire et de la puissance de la machine nécessaire pour les exécuter de manière cohérente. Par conséquent, il est important d'être conscient de ce compromis lorsque vous choisissez la quantité de tests inter-navigateurs dont votre application a besoin.

#### Des boucles de feedback plus rapides {#faster-feedback-loops}

L'un des principaux problèmes liés aux tests et au développement End-to-end (E2E) est que l'exécution de l'ensemble de la suite prend beaucoup de temps. En règle générale, cela n'est fait que dans les pipelines d'intégration et de déploiement continus (CI/CD). Les frameworks de test E2E modernes ont aidé à résoudre ce problème en ajoutant des fonctionnalités telles que la parallélisation, ce qui permet aux pipelines CI / CD d'exécuter souvent des magnitudes plus rapidement qu'auparavant. En outre, lors du développement local, la possibilité d'exécuter de manière sélective un seul test pour la page sur laquelle vous travaillez tout en fournissant un rechargement à chaud des tests peut aider à améliorer le flux de travail et la productivité d'un développeur.

#### First-class debugging experience {#first-class-debugging-experience}

Alors que les développeurs s'appuyaient traditionnellement sur l'analyse des logs dans une fenêtre de terminal pour aider à déterminer ce qui n'allait pas dans un test, les frameworks de test modernes End-to-end (E2E) permettent aux développeurs de tirer parti d'outils qu'ils connaissent déjà, par exemple les outils de développement de navigateur.

#### Visibilité en mode headless {#visibility-in-headless-mode}

Lorsque les tests End-to-end (E2E) sont exécutés dans des pipelines d'intégration/déploiement continus, ils sont souvent exécutés dans des navigateurs headless (c'est-à-dire qu'aucun navigateur visible n'est ouvert pour que l'utilisateur puisse le regarder). Une caractéristique essentielle des frameworks de test E2E modernes est la possibilité de voir des snapshots et / ou des vidéos de l'application pendant les tests, fournissant un aperçu des raisons pour lesquelles des erreurs se produisent. Historiquement, il était fastidieux de maintenir ces intégrations.

### Recommandation {#recommentation-2}

- [Playwright](https://playwright.dev/) est une excellente solution de test E2E qui prend en charge Chromium, WebKit et Firefox. Testez sur Windows, Linux et macOS, localement ou sur CI, headless ou non avec l'émulation mobile native de Google Chrome pour Android et Mobile Safari. Il dispose d'une interface utilisateur informative, d'une excellente débogabilité, d'assertions intégrées, d'une parallélisation, de traces et est conçu pour éliminer les tests défectueux. La prise en charge des [tests de composants](https://playwright.dev/docs/test-components) est disponible, mais est considérée comme expérimentale. Playwright est open source et maintenu par Microsoft.

- [Cypress](https://www.cypress.io/) dispose d'une interface graphique informative, une excellente déboguabilité, des assertions et des stubs intégrés, une résistance à la "flakiness" des tests, une parallélisation et des instantanés. Comme mentionné ci-dessus, il offre également un support pour [les tests de composants](https://docs.cypress.io/guides/component-testing/introduction). Il prend en charge les navigateurs basés sur Chromium, Firefox et Electron. Le support de WebKit est disponible, mais marqué comme expérimental. Cypress est sous licence MIT, mais certaines fonctionnalités comme la parallélisation nécessitent un abonnement à Cypress Cloud.

<div class="lambdatest">
  <a href="https://lambdatest.com" target="_blank">
    <img src="/images/lambdatest.svg">
    <div>
      <div class="testing-partner">Outil de tests sponsorisé</div>
      <div>Lambdatest est une plateforme cloud permettant d'exécuter des tests de régression E2E, d'accessibilité et visuels sur tous les principaux navigateurs et appareils réels, avec une génération de tests assistée par l'IA !</div>
    </div>
  </a>
</div>

### Autres options {#other-options-2}

- [Nightwatch](https://nightwatchjs.org/) est une solution de test E2E basée sur [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver). Cela lui permet de prendre en charge le plus grand nombre de navigateurs, y compris les tests mobiles natifs. Les solutions basées sur Selenium seront plus lentes que Playwright ou Cypress.

- [WebdriverIO](https://webdriver.io/) est un framework d'automatisation des tests pour les tests Web et mobiles basé sur le protocole WebDriver.

## Recettes {#recipes}

### Ajouter Vitest a un projet {#adding-vitest-to-a-project}

Dans un projet Vue basé sur Vite, lancez :

```sh
> npm install -D vitest happy-dom @testing-library/vue
```

Ensuite, modifiez la configuration Vite pour ajouter le bloc d'option `test` :

```js{6-12} [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
  test: {
    // active les API compatibles avec jest globalement
    globals: true,
    // simule le DOM avec happy-dom
    // (requiert l'installation de happy-dom en dépendance additionnelle)
    environment: 'happy-dom'
  }
})
```

:::tip
Si vous utilisez TypeScript, ajoutez, add `vitest/globals` dans le champ `types` de votre `tsconfig.json`.

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

:::

Créez ensuite un fichier se terminant par `*.test.js` dans votre projet. Vous pouvez placer tous les fichiers de test dans un répertoire de test à la racine du projet ou dans des répertoires de test à côté de vos fichiers sources. Vitest les recherchera automatiquement à l'aide de la convention de nommage.

```js [MyComponent.test.js]
import { render } from '@testing-library/vue'
import MyComponent from './MyComponent.vue'

test('it should work', () => {
  const { getByText } = render(MyComponent, {
    props: {
      /* ... */
    }
  })

  // assert output
  getByText('...')
})
```

Enfin, mettez à jour `package.json` pour ajouter le script de test et lancez-le :

```json{4} [package.json]
{
  // ...
  "scripts": {
    "test": "vitest"
  }
}
```

```sh
> npm test
```

### Tester les Composables {#testing-composables}

> Cette section suppose que vous avez lu la section [Composables](/guide/reusability/composables).

Lorsqu'il est question de tester des composables, nous pouvons diviser en deux catégories : les composables qui ne dépendent pas d'une instance de composant hôte et ceux qui en dépendent.

Un composable dépend d'une instance de composant hôte quand il utilise une des API suivantes :

- Hooks du cycle de vie
- Provide / Inject

Si un composable utilise uniquement les API de réactivité, alors il peut être testé directement en l'invoquant et en vérifiant l'état et les méthodes qu'il retourne :

```js [counter.js]
import { ref } from 'vue'

export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++

  return {
    count,
    increment
  }
}
```

```js [counter.test.js]
import { useCounter } from './counter.js'

test('useCounter', () => {
  const { count, increment } = useCounter()
  expect(count.value).toBe(0)

  increment()
  expect(count.value).toBe(1)
})
```

Un composable qui s'appuie sur des hooks de cycle de vie ou Provide / Inject doit être contenu dans un composant enveloppe pour être testé. Nous pouvons créer une fonction utilitaire comme ci-dessous :

```js [test-utils.js]
import { createApp } from 'vue'

export function withSetup(composable) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      // supprime l'avertissement du template manquant
      return () => {}
    }
  })
  app.mount(document.createElement('div'))
  // renvoie le résultat et l'instance de l'application
  // pour les tests, provide/unmount
  return [result, app]
}
```

```js
import { withSetup } from './test-utils'
import { useFoo } from './foo'

test('useFoo', () => {
  const [result, app] = withSetup(() => useFoo(123))
  // simule provide pour tester les injections
  app.provide(...)
  // exécute les assertions
  expect(result.foo.value).toBe(1)
  // déclenche le hook onUnmounted si nécessaire
  app.unmount()
})
```

Il peut également être plus facile de tester des composables plus complexes en écrivant des tests contre le composant enveloppe en utilisant les techniques de [Test de Composant](#component-testing).

<!--
TODO more testing recipes can be added in the future e.g.
- How to set up CI via GitHub actions
- How to do mocking in component testing
-->
