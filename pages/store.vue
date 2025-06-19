<template>
    <div class="container max-w-screen-xl mx-auto py-16">
        <div class="mb-24">
            <HeadingSite :title="$t('store.title')" :subtitle="$t('store.subtitle')" />
        </div>
    </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const route = useRoute();
const { locale } = useI18n();

useSeoMeta({
  title: t("navigation.store"),
  ogTitle: t("navigation.store"),
  description: t("store.subtitle"),
  ogDescription: t("store.subtitle"),
  ogImage: 'https://example.com/image.png',
  ogUrl: route.fullPath,
  ogType: 'website', 
  ogLocale: locale.value,
  twitterTitle: t("navigation.store"),
  twitterCard: 'summary_large_image',
  twitterDescription: t("store.subtitle"),
  twitterImage: 'https://example.com/image.png',
  robots: 'index, follow',
})
</script>