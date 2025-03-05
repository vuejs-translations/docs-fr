---
outline: deep
---

<script setup>
import { ref, onMounted } from 'vue'

const version = ref()

onMounted(async () => {
  const res = await fetch('https://api.github.com/repos/vuejs/core/releases/latest')
  version.value = (await res.json()).name
})
</script>

# Releases {#releases}

<p v-if="version">
La dernière version stable de Vue est la <strong>{{ version }}</strong>.
</p>
<p v-else>
Vérification de la dernière version...
</p>

Un journal complet des précédentes releases est disponible sur [GitHub](https://github.com/vuejs/core/blob/main/CHANGELOG.md).

## Cycle des releases {#release-cycle}

Vue n'a pas de cycle fixe pour les releases.

- Les correctifs sont publiés selon les besoins.

- Les releases mineures contiennent toujours de nouvelles fonctionnalités, avec un intervalle de temps typique allant de 3 à 6 mois. Les releases mineures passent toujours par une phase de pré-release bêta.

- Les releases majeures seront annoncées à l'avance, et passeront assez tôt par une phase de discussion et des phases de pré-release alpha/bêta.

## Versionnement sémantique - Cas limites {#semantic-versioning-edge-cases}

Les releases de Vue suivent le [versionnement sémantique](https://semver.org/) avec quelques cas limites.

### Définitions TypeScript {#typescript-definitions}

Il se peut que nous sortions des modifications incompatibles avec les définitions TypeScript entre chaque versions **mineure**. Cela est dû au fait que :

1. Parfois, TypeScript lui-même apporte des modifications incompatibles entre les versions mineures, et nous pouvons être amenés à ajuster les types pour prendre en charge les nouvelles versions de TypeScript.

2. Parfois, il peut arriver que nous devions sortir des fonctionnalités qui ne sont disponibles que dans une version récente de TypeScript, ce qui augmente la version minimale requise de TypeScript.

Si vous utilisez TypeScript, vous pouvez utiliser un gestionnaire sémantique de version qui verrouille la version mineure actuelle et effectuer une mise à niveau manuelle lorsqu'une nouvelle version mineure de Vue est publiée.

### Compatibilité du code compilé avec d'anciens moteurs {#compiled-code-compatibility-with-older-runtime}

Une version **mineur** plus récente du compilateur Vue peut générer du code qui n'est pas compatible avec le moteur Vue d'une version mineure plus ancienne. Par exemple, le code généré par le compilateur Vue 3.2 peut ne pas être totalement compatible s'il est consommé par le moteur de Vue 3.1.

Ce problème ne concerne que les auteurs de bibliothèques, car dans les applications, la version du compilateur et la version d'exécution sont toujours les mêmes. Un décalage de version ne peut se produire que si vous envoyez du code de composant Vue précompilé sous forme de package et qu'un développeur l'utilise dans un projet utilisant une version antérieure de Vue. Par conséquent, votre paquet peut avoir besoin de déclarer explicitement une version mineure minimale requise de Vue.

## Pré-releases {#pre-releases}

Les releases mineures passent généralement par un nombre variable de versions bêta. Les releases majeures passent par une phase alpha et une phase bêta.

De plus, nous publions chaque semaine des versions canary des branches « main » et « minor » sur GitHub. Ils sont publiés sous forme de packages différents pour éviter de polluer les métadonnées npm du canal stable. Vous pouvez les installer via `npx install-vue@canary` ou `npx install-vue@canary-minor`, ​​respectivement.

Les pré-releases sont destinées aux tests d'intégration et de stabilité, ainsi qu'aux utilisateurs précoces qui peuvent fournir des retours sur les fonctionnalités instables. N'utilisez pas les pré-releases en production. Elles sont considérées comme instables et peuvent contenir des modifications importante de l'une à l'autre, il faut donc toujours se référer aux versions exactes lorsque vous utilisez des pré-releases.

## Dépréciations {#deprecations}

Nous pouvons périodiquement déprécier des fonctionnalités qui sont remplacées dans les releases mineures. Les fonctionnalités dépréciées continueront à fonctionner, et seront supprimées lors de la prochaine release majeure après avoir atteint le statut de fonctionnalité dépréciée.

## RFC {#rfcs}

Les nouvelles fonctionnalités avec un potentiel d'API et des changements majeurs à Vue passeront par le processus de **demande de commentaires, ou _Request for Comments_** (RFC). Le processus RFC a pour but de fournir une voie cohérente et contrôlée pour l'introduction de nouvelles fonctionnalités dans le framework, et de donner aux utilisateurs l'opportunité de participer et d'offrir des retours dans le processus de conception.

Le processus RFC est mené dans le repo [vuejs/rfcs](https://github.com/vuejs/rfcs) sur GitHub.

## Fonctionnalités expérimentales {#experimental-features}

Certaines fonctionnalités sont livrées et documentées dans une version stable de Vue, mais marquées comme expérimentales. Les fonctionnalités expérimentales sont typiquement des fonctionnalités qui ont une discussion RFC associée avec la plupart des problèmes de conception résolus sur le papier, mais qui manquent encore de retour de cas d'utilisation réelle.

L'objectif des fonctionnalités expérimentales est de permettre aux utilisateurs de fournir un retour en les testant dans un environnement de production, sans avoir à utiliser une version instable de Vue. Les fonctionnalités expérimentales sont elles-mêmes considérées comme instables, et ne doivent être utilisées que de manière contrôlée, en sachant que la fonctionnalité peut changer entre deux versions.
