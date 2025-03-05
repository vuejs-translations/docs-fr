# Créer une application Vue {#creating-a-vue-application}

## L'instance de l'application {#the-application-instance}

Chaque application Vue commence par créer une nouvelle **instance d'application** avec la fonction [`createApp`](/api/application#createapp) :

```js
import { createApp } from 'vue'

const app = createApp({
  /* options du composant racine */
})
```

## Le composant racine {#the-root-component}

L'objet que nous passons dans `createApp` est en fait un composant. Chaque application nécessite un "composant racine" qui peut contenir d'autres composants en tant qu'enfants.

Si vous utilisez des composants monofichiers, nous importons généralement le composant racine à partir d'un autre fichier :

```js
import { createApp } from 'vue'
// import du composant racine App à partir d'un composant monofichier.
import App from './App.vue'

const app = createApp(App)
```

Bien que de nombreux exemples de ce guide ne nécessitent qu'un seul composant, la plupart des applications réelles sont organisées en une arborescence de composants imbriqués et réutilisables. Par exemple, l'arborescence des composants d'une application Todo pourrait ressembler à ceci :

```
App (composant racine)
├─ TodoList
│  └─ TodoItem
│     ├─ TodoDeleteButton
│     └─ TodoEditButton
└─ TodoFooter
   ├─ TodoClearButton
   └─ TodoStatistics
```

Nous discuterons de la façon de définir et de composer plusieurs composants ensemble dans les sections ultérieures du guide. Avant cela, nous allons nous concentrer sur ce qui se passe à l'intérieur d'un seul composant.

## Montage de l'application {#mounting-the-app}

Une instance d'application n'affichera rien tant que sa méthode `.mount()` ne sera pas appelée. Elle attend un argument "conteneur", qui peut être soit un élément du DOM réel, soit une chaîne de sélection :

```html
<div id="app"></div>
```

```js
app.mount('#app')
```

Le contenu du composant racine de l'application sera rendu à l'intérieur de l'élément conteneur. Ce dernier n'est pas considéré comme faisant partie de l'application.

La méthode `.mount()` doit toujours être appelée après les différentes configurations (de l'application et des ressources). Notez également que sa valeur de retour, contrairement aux méthodes d'enregistrement des ressources, est l'instance du composant racine au lieu de l'instance de l'application.

### Template de composant racine depuis le DOM {#in-dom-root-component-template}

Le template du composant racine fait généralement partie du composant lui-même, mais il est également possible de fournir le template séparément en l'écrivant directement dans le conteneur monté :

```html
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

app.mount('#app')
```

Vue utilisera automatiquement le contenu HTML du conteneur comme template si le composant racine n'a pas déjà une option `template`.

Les templates dans le DOM sont souvent utilisés dans les applications qui [utilisent Vue sans outils de build](/guide/quick-start.html#using-vue-from-cdn). Ils peuvent également être utilisés conjointement avec des frameworks côté serveur, où le template racine peut être généré dynamiquement par le serveur.

## Configurations d'application {#app-configurations}

L'instance d'application expose un objet `.config` qui nous permet de configurer quelques options au niveau de l'application, par exemple en définissant un gestionnaire d'erreurs au niveau de l'application qui capture les erreurs de tous les composants descendants :

```js
app.config.errorHandler = (err) => {
  /* gérer l'erreur */
}
```

L'instance d'application fournit également quelques méthodes pour enregistrer les ressources propres à l'application. Par exemple, enregistrer un composant :

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

Cela rend `TodoDeleteButton` disponible pour une utilisation n'importe où dans notre application. Nous discuterons de l'enregistrement des composants et d'autres types de ressources dans les sections ultérieures du guide. Vous pouvez également parcourir la liste complète des API concernant l'instance d'application dans sa [référence API](/api/application).

Assurez-vous d'appliquer toutes les configurations d'application avant de monter l'application !

## Instances multiples d'une application {#multiple-application-instances}

Rien ne vous limite à n'avoir qu'une seule instance d'application sur la même page. L'API `createApp` permet à plusieurs applications Vue de coexister sur la même page, chacune avec son propre scope pour la configuration et les ressources globales :

```js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```

Si vous utilisez Vue pour améliorer l'HTML rendu par le serveur et que vous n'avez besoin de Vue que pour contrôler des parties spécifiques d'une grande page, évitez de monter une seule instance d'application Vue sur la page entière. Au lieu de cela, créez plusieurs petites instances d'application et montez-les sur les éléments dont elles sont responsables.
