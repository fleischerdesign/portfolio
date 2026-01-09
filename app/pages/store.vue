<template>
    <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
        <div class="mb-24">
             <UiSectionHeader :level="1" :title="$t('store.title')" :subtitle="$t('store.subtitle')" symbol="mage:shop" />
        </div>
    </div>
</template>

<script lang="ts" setup>
const { t, locale } = useI18n();
const route = useRoute();

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