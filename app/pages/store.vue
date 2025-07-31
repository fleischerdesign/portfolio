<template>
    <div class="container mx-auto max-w-screen-xl py-16">
        <div class="mb-24">
             <UiHeading :level="1" :title="$t('store.title')" :subtitle="$t('store.subtitle')" />
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
  ogUrl: route.fullPath,
  ogType: 'website', 
  ogLocale: locale.value,
  twitterTitle: t("navigation.store"),
  twitterCard: 'summary_large_image',
  twitterDescription: t("store.subtitle"),
  robots: 'index, follow',
})
</script>