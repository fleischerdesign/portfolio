<template>
  <NuxtLoadingIndicator class="!bg-secondary-400" :color="false" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { locale } = useI18n() // Importiere die aktuelle Sprache aus dem i18n Plugin

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Philipp Fleischer` : 'Philipp Fleischer'
  },
  htmlAttrs: {
    lang: locale // Das setzt das lang-Attribut auf den aktuellen Sprachcode
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  bodyAttrs: {
    class: 'dark:bg-neutral-900 dark:text-white text-neutral-950 bg-neutral-100 transition'
  }
})

defineOgImageComponent('Default')
</script>


<style>
html {
  scroll-behavior: smooth;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.05s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
