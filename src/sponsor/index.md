---
sidebar: false
ads: false
editLink: false
sponsors: false
---

<script setup>
import SponsorsGroup from '@theme/components/SponsorsGroup.vue'
import { load, data } from '@theme/components/sponsors'
import { onMounted } from 'vue'

onMounted(load)
</script>

# Devenez un sponsor de Vue.js {#become-a-vue-js-sponsor}

Vue.js est un projet open source sous licence MIT et entièrement libre d'utilisation.
L'énorme quantité d'efforts nécessaires pour maintenir un écosystème aussi vaste et développer de nouvelles fonctionnalités pour le projet n'est rendue durable que grâce au généreux soutien financier de nos sponsors.

## Comment devenir un sponsor {#how-to-sponsor}

Les soutiens financiers peuvent être effectués via les [Sponsors GitHub](https://github.com/sponsors/yyx990803) ou [OpenCollective](https://opencollective.com/vuejs). Les factures peuvent être obtenues via le système de paiement de GitHub. Les dons mensuels récurrents et les dons ponctuels sont acceptés. Les dons récurrents ont droit à des emplacements de logo comme spécifié dans les [avantages par niveau](#tier-benefits).

Si vous avez des questions concernant les paliers, la logistique des paiements ou les données relatives à l'exposition des sponsors, veuillez contacter [sponsor@vuejs.org](mailto:sponsor@vuejs.org?subject=Vue.js%20sponsorship%20inquiry).

## Sponsoriser Vue en tant qu'entreprise {#sponsoring-vue-as-a-business}

Sponsoriser Vue vous offre une grande visibilité auprès de plus de **2 million** de développeurs Vue dans le monde via notre site Web et les fichiers README du projet GitHub. Cela permet non seulement de générer directement des leads, mais aussi d'améliorer la reconnaissance de votre marque en tant qu'entreprise qui se préoccupe de l'Open Source. Il s'agit là d'un atout intangible mais extrêmement important pour les entreprises qui conçoivent des produits destinés aux développeurs, car il permet d'améliorer le taux de conversion.

Si vous utilisez Vue pour créer un produit générateur de revenus, il est logique sur le plan commercial de sponsoriser le développement de Vue : **cela garantit que le projet sur lequel repose votre produit reste en bonne santé et activement maintenu.** L'exposition et l'image de marque positive dans Vue permet également d'attirer et de recruter plus facilement des développeurs Vue.

Si vous construisez un produit où vos clients cibles sont des développeurs, vous obtiendrez un trafic de haute qualité grâce à l'exposition de votre soutien financier, puisque tous nos visiteurs sont des développeurs. Le soutien financier renforce également la reconnaissance de la marque et améliore la conversion.

## Sponsoriser Vue en tant que particulier {#sponsoring-vue-as-an-individual}

Si vous êtes un utilisateur individuel et que vous avez apprécié la productivité de l'utilisation de Vue, envisagez de faire un don en signe d'appréciation - comme nous acheter du café de temps en temps. De nombreux membres de notre équipe acceptent les sponsors et les dons via les sponsors GitHub. Recherchez le bouton "Sponsor" sur le profil de chaque membre de l'équipe sur notre [page d'équipe](/about/team).

Vous pouvez également essayer de convaincre votre employeur de sponsoriser Vue en tant qu'entreprise. Ce n'est peut-être pas facile, mais les sponsors d'entreprises ont généralement un impact beaucoup plus important sur la durabilité des projets OSS que les dons individuels, donc vous nous aiderez beaucoup plus si vous réussissez.

## Avantages par niveau {#tier-benefits}

- **Spécial Mondial** :
  - Limité à un sponsor mondial <span v-if="!data?.special">Actuellement vacant. [Prendre contact](mailto:sponsor@vuejs.org?subject=Vue.js%20special%20sponsor%20inquiry)!</span><span v-else>(actuellement pourvu).</span>
  - (Exclusif) Emplacement exclusif du logo sur la première page de [vuejs.org](/).
  - (Exclusif) Mise en avant spéciale et retweets réguliers des principaux lancements de produits via [le compte X officiel de Vue](https://twitter.com/vuejs) (320k followers).
- **Platine (USD$2,000/mois)** :
  - Emplacement imposant pour votre logo sur la première page de [vuejs.org](/).
  - Emplacement imposant pour votre logo dans la barre latérale de chacunes des pages.
  - Emplacement imposant pour votre logo dans le fichier README de [`vuejs/core`](https://github.com/vuejs/core) et [`vuejs/vue`](https://github.com/vuejs/core).
- **Or (USD$500/mois)** :
  - Grand emplacement pour votre logo sur la première page de [vuejs.org](/).
  - Grand emplacement pour votre logo dans le fichier README de `vuejs/core` et `vuejs/vue`.
- **Argent (USD$250/mois)** :
  - Emplacement moyen pour votre logo dans le fichier `BACKERS.md` de `vuejs/core` et `vuejs/vue`.
- **Bronze (USD$100/mois)** :
  - Petit emplacement pour votre logo dans le fichier `BACKERS.md` de `vuejs/core` et `vuejs/vue`.
- **Soutien généreux (USD$50/mois)** :
  - Votre nom listé dans le fichier `BACKERS.md` de `vuejs/core` et `vuejs/vue`, au-dessus des autres soutiens de particuliers.
- **Soutien en tant que particulier (USD$5/mois)** :
  - Votre nom listé dans le fichier `BACKERS.md` de `vuejs/core` et `vuejs/vue`.

## Sponsors actuels {#current-sponsors}

### Sponsor Mondial Spécial {#special-global-sponsor}

<SponsorsGroup tier="special" placement="page" />

### Platine {#platinum}

<SponsorsGroup tier="platinum" placement="page" />

### Platine (Chine) {#platinum-china}

<SponsorsGroup tier="platinum_china" placement="page" />

### Or {#gold}

<SponsorsGroup tier="gold" placement="page" />

### Argent {#silver}

<SponsorsGroup tier="silver" placement="page" />
