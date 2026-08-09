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
const { t } = useI18n();

useAppSeo({
  title: t("seo.home_title"),
  description: t("seo.home_desc"),
  type: 'website'
});
</script>
