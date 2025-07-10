<template>
    <div class="container max-w-screen-xl mx-auto py-16">
    <HeadingSite :title="$t('home.contact.title')" :subtitle="$t('home.contact.subtitle')" />
        <div class="mt-8">
            <ContactForm />
        </div>
    </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const route = useRoute();
const { locale } = useI18n();

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