<template>
    <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
        <SectionContact heading-type="page" />
    </div>
</template>

<script lang="ts" setup>
const { t, locale } = useI18n();
const route = useRoute();

useSeoMeta({
  title: t("home.contact.title"),
  ogTitle: t("navigation.contact"),
  description: t("home.contact.title"),
  ogDescription: t("home.contact.subtitle"),
  ogUrl: route.fullPath,
  ogType: 'website', 
  ogLocale: locale.value,
  twitterTitle: t("home.contact.title"),
  twitterCard: 'summary_large_image',
  twitterDescription: t("home.contact.subtitle"),
  robots: 'index, follow',
})
</script>