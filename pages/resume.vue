<template>
    <div class="container max-w-screen-xl mx-auto py-16">
        <div class="mb-24">
            <HeadingSite :title="$t('resume.title')" :subtitle="$t('resume.subtitle')" />
        </div>
    </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const route = useRoute();
const { locale } = useI18n();

useSeoMeta({
  title: t("navigation.resume"),
  ogTitle: t("navigation.resume"),
  description: t("resume.title"),
  ogDescription: t("resume.subtitle"),
  ogUrl: route.fullPath,
  ogType: 'website', 
  ogLocale: locale.value,
  twitterTitle: t("navigation.resume"),
  twitterCard: 'summary_large_image',
  twitterDescription: t("resume.subtitle"),
  robots: 'index, follow',
})
</script>