<script setup lang="ts">
import PageHero from '@theme/components/PageHero.vue'

defineProps<{ title?: string }>()
</script>

<template>
   <PageHero>
    <template #title>{{ title || 'Vue Partners' }}</template>
    <template #lead>
      <p>
      Les partenaires Vue sont des agences approuvées par notre équipe qui fournissent des
      services de conseil et de développement de grande qualité pour Vue. Si votre entreprise
      souhaite être listée comme partenaire, veuillez
      <a class="link" href="https://airtable.com/shrCQhat57SApJI2l" target="_blank"
        >vous enregistrer ici</a
      >.
      </p>
    </template>
  </PageHero>
</template>
