<template>
  <div class="container max-w-screen-xl">
    <div>
      <HeroSection />
      <OverviewSection />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
    </div>
  </div>
</template>

<script lang="ts" setup>


const { locale } = useI18n();
const { t } = useI18n();
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