<template>
    <div class="container max-w-screen-xl mx-auto py-16">
        <div class="mb-24">
            <HeadingSection :title="$t('resume.title')" :subtitle="$t('resume.subtitle')" />
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
  ogImage: 'https://example.com/image.png',
  ogUrl: route.fullPath,
  ogType: 'website', 
  ogLocale: locale.value,
  twitterTitle: t("navigation.resume"),
  twitterCard: 'summary_large_image',
  twitterDescription: t("resume.subtitle"),
  twitterImage: 'https://example.com/image.png',
  robots: 'index, follow',
})
</script>