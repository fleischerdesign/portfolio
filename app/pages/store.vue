<template>
    <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
        <div class="mb-24">
             <UiSectionHeader :level="1" :title="$t('store.title')" :subtitle="$t('store.subtitle')" symbol="mage:shop" />
        </div>
    </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

useAppSeo({
  title: t("seo.store_title"),
  description: t("store.subtitle"),
  type: 'website'
});
</script>