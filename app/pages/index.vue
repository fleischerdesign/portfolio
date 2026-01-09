<template>
  <div>
    <!-- Hero Section (Full Width) -->
    <SectionHero />

    <!-- Main Content (Contained) -->
    <div class="container mx-auto max-w-screen-xl px-4 pb-16 md:px-8">
      <SectionOverview />
      <SectionProjects />
      <SectionBlog />
      <SectionContact />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { locale, t } = useI18n();
const route = useRoute();

useSeoMeta({
  title: t("navigation.home"),
  ogTitle: t("navigation.home"),
  description: t("home.hero.summary"),
  ogDescription: t("home.hero.summary"),
  ogUrl: route.fullPath,
  ogType: 'website',
  ogLocale: locale.value,
  twitterTitle: t("navigation.home"),
  twitterCard: 'summary_large_image',
  twitterDescription: t("home.hero.summary"),
  robots: 'index, follow',
})
</script>
