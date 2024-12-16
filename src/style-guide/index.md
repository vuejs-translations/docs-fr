---
outline: deep
---

# Bonnes pratiques {#style-guide}

::: warning Note
Ce guide de style Vue.js est obsolète et doit être revu. Si vous avez des questions ou des suggestions, veuillez [ouvrir une issue](https://github.com/vuejs/docs/issues/new).

:::

Voici le guide de style officiel pour du code spécifique à Vue. Si vous travaillez sur un projet Vue, c'est une super référence pour éviter les erreurs, les pertes de temps, et les anti-patterns. Toutefois, nous ne pensons pas que des bonnes pratiques puisse être idéales pour n'importe quelle équipe ou projet, donc les écarts faits en pleine conscience en fonction de votre expérience, la pile technique environnante, et vos valeurs personnelles sont encouragés.

La plupart du temps, nous évitons également les suggestions à propos du JavaScript ou de l'HTML en général. Que vous utilisiez des points-virgules ou des virgules ne nous dérange pas. Cela ne nous dérange pas non plus que vous utilisiez des simples ou doubles guillemets pour les valeurs des attributs. Il y a cependant des exceptions pour lesquelles nous pensons qu'un pattern particulier peut aider dans le contexte de Vue.

Pour finir, nous avons divisé les règles en quatre catégories :

## Catégories des règles {#rule-categories}

### Priorité A : Essentielle (Prévention des erreurs) {#priority-a-essential-error-prevention}

Ces règles aident à prévenir les erreurs, donc apprenez les et tenez-y vous coûte que coûte. Il peut y avoir des exceptions, mais elles sont rares et devraient être faites par ceux ayant une expertise à la fois dans JavaScript et dans Vue.

- [Voir toutes les règles de priorité A](./rules-essential)

### Priorité B: Fortement recommandée {#priority-b-strongly-recommended}

Ces règles ont été pensées pour améliorer la lisibilité et/ou l'expérience des développeurs dans la plupart des projets. Votre code fonctionnera toujours sans elles, mais les digressions doivent être rares et bien justifiées.

- [Voir toutes les règles de priorité B](./rules-strongly-recommended)

### Priorité C: Recommandée {#priority-c-recommended}

Lorsqu'il existe plusieurs options correctes, un choix arbitraire peut être fait pour assurer une certaine cohérence. Dans ces règles, nous décrivons chaque option acceptable et suggérons un choix par défaut. Cela signifie que vous être libres de faire un choix différent dans votre code, tant que vous restez cohérent et avez une bonne raison. Vous avez certainement une bonne raison ! En adaptant les standards de la communauté, vous allez :

1. Entraîner votre cerveau à analyser plus facilement la plupart du code que vous rencontrerez
2. Serez capable de copier et coller la plupart du code de la communauté sans modification
3. Réaliserez souvent que les nouvelles recrues sont habituées à votre style de code favori, du moins en ce qui concerne Vue

- [Voir toutes les règles de priorité C](./rules-recommended)

### Priorité D: À utiliser avec précaution {#priority-d-use-with-caution}

Certaines fonctionnalités de Vue existent pour prévoir de rares cas particuliers ou des migrations plus douces depuis une base de code héritée. Toutefois, lorsqu'elles sont surexploitées, elles peuvent rendre le code plus difficile à maintenir ou même devenir une source de bugs. Ces règles mettent en lumière ces fonctionnalités potentiellement risquées, en décrivant quand et pourquoi elles devraient être évitées.

- [Voir toutes les règles de priorité D](./rules-use-with-caution)
