<script lang="ts">
const shuffleMembers = (
  members: Member[],
  pinTheFirstMember = false
): void => {
  let offset = pinTheFirstMember ? 1 : 0
  // `i` is between `1` and `length - offset`
  // `j` is between `0` and `length - offset - 1`
  // `offset + i - 1` is between `offset` and `length - 1`
  // `offset + j` is between `offset` and `length - 1`
  let i = members.length - offset
  while (i > 0) {
    const j = Math.floor(Math.random() * i)
    ;[members[offset + i - 1], members[offset + j]] = [
      members[offset + j],
      members[offset + i - 1]
    ]
    i--
  }
}
</script>

<script setup lang="ts">
import { VTLink } from '@vue/theme'
import membersCoreData from './members-core.json'
import membersEmeritiData from './members-emeriti.json'
import membersPartnerData from './members-partner.json'
import TeamHero from './TeamHero.vue'
import TeamList from './TeamList.vue'
import type { Member } from './Member'
shuffleMembers(membersCoreData as Member[], true)
shuffleMembers(membersEmeritiData as Member[])
shuffleMembers(membersPartnerData as Member[])
</script>

<template>
  <div class="TeamPage">
    <TeamHero>
      <template #title>Rencontrer l’équipe</template>
      <template #lead>
        Le développement de Vue et de son écosystème est assuré par une
        équipe internationale, dont certains membres ont choisi
        <span class="nowrap">d’apparaître ci-dessous.</span>
      </template>

      <template #action>
        <VTLink
          href="https://github.com/vuejs/governance/blob/master/Team-Charter.md"
          >
          En savoir plus sur les équipes
        </VTLink>
      </template>
    </TeamHero>

    <TeamList :members="(membersCoreData as Member[])">
      <template #title>Membres de l’équipe principale</template>
      <template #lead>
        Les membres de l’équipe principale sont ceux qui participent activement à la
        maintenance d’un ou de plusieurs projets principaux. Ils ont apporté des contributions
        significatives à l’écosystème Vue, avec un engagement à long terme pour
        le succès du projet et de ses utilisateurs.
      </template>
    </TeamList>

    <TeamList :members="(membersEmeritiData as Member[])">
      <template #title>Membres émérites de l’équipe principale</template>
      <template #lead>
        Ici, nous rendons hommage à certains membres de l’équipe principale qui ne sont plus actifs et qui ont apporté
        de précieuses contributions dans le passé.
      </template>
    </TeamList>

    <TeamList :members="(membersPartnerData as Member[])">
      <template #title>Partenaires de la communauté</template>
      <template #lead>
        Certains membres de la communauté Vue l’ont tellement enrichi
        qu’ils méritent une mention spéciale. Nous avons développé une
        relation plus intime avec ces partenaires clés, en coordonnant
        souvent avec eux les fonctionnalités et les nouveautés.
      </template>
    </TeamList>
  </div>
</template>

<style scoped>
.TeamPage {
  padding-bottom: 16px;
}

@media (min-width: 768px) {
  .TeamPage {
    padding-bottom: 96px;
  }
}

.TeamList + .TeamList {
  padding-top: 64px;
}
</style>
