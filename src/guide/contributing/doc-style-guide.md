# Guide de style de la documentation

Ce guide donne un aperçu des différents éléments de conception disponibles pour la création de la documentation.

## Alerts

VuePress fournit un plugin de conteneur personnalisé pour créer des boîtes d'alerte. Il en existe quatre types :

- **Info**: Fournir des informations qui sont neutres
- **Tip**: Fournir des informations positives et encourageantes
- **Warning**: Fournir des informations que les utilisateurs doivent connaître car il y a un risque faible à modéré
- **Danger**: Fournir des informations négatives et à haut risque pour l'utilisateur.

**Exemples de Markdown**

```
::: info
Vous pouvez trouver plus d'informations sur ce site.
:::

::: tip
C'est un bon conseil à retenir !
:::

::: warning
Il faut s'en méfier.
:::

::: danger DANGER
C'est quelque chose que nous ne recommandons pas. Utilisez-le à vos risques et périls.
:::
```

**Rendu Markdown**

::: info
Vous trouverez de plus amples informations sur ce site.
:::

::: tip
C'est un bon conseil à retenir !
:::

::: warning
Il faut s'en méfier.
:::

::: danger DANGER
C'est quelque chose que nous ne recommandons pas. Utilisez-le à vos risques et périls.
:::

## Blocs de code

VuePress utilise Prism pour fournir une coloration syntaxique de la langue en ajoutant la langue au début des backticks d'un bloc de code :

**Exemple de Markdown**

````
```js
export default {
  name: 'MyComponent'
}
```
````

**Rendered Output**
```js
export default {
  name: 'MyComponent'
}
```

### Mise en évidence des lignes

Pour ajouter la mise en évidence des lignes à vos blocs de code, vous devez ajouter le numéro de ligne entre accolades.

#### Ligne unique

**Exemple Markdown**

````
```js{2}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```
````

**Rendu Markdown**

```js{2}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```

#### Groupe de lignes

````
```js{4-5}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```
````

```js{4-5}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```

#### Sections multiples

````
```js{2,4-5}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```
````

```js{2,4-5}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```
