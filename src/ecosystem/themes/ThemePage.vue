<script setup lang="ts">
import ThemeHero from './ThemeHero.vue'
import ThemeList from './ThemeList.vue'
import ThemeContact from './ThemeContact.vue'
</script>

<template>
  <div class="ThemePage">
    <ThemeHero>
      <template #title>Thèmes</template>
      <template #lead>Découvrez les thèmes, les kits d'interface utilisateur et les plugins. Vous pouvez voir comment une application du monde réel est construite avec Vue par nos partenaires.</template>
    </ThemeHero>

    <ThemeList />

    <ThemeContact>
      Vous souhaitez présenter vos thèmes ici ? <a class="link" href="mailto:evan@vuejs.org?subject=Theme+affiliation">Contactez-nous !</a>
    </ThemeContact>
  </div>
</template>
