<template>
    <div class="container max-w-screen-xl mx-auto py-16">
    <HeadingSite :title="$t('home.contact.title')" :subtitle="$t('home.contact.subtitle')" />
        <h2 class="text-2xl font-semibold mb-4">My Journey</h2>
        <p class="text-lg text-neutral-400 mb-8">
        My journey in the tech world began with a fascination for how things work. From building my first website to
        developing complex applications, I have always been driven by a desire to learn and grow.
        </p>
        <h2 class="text-2xl font-semibold mb-4">Skills</h2>
        <ul class="list-disc list-inside text-lg text-neutral-400 mb-8">
        <li>Web Development</li>
        <li>UI/UX Design</li>
        <li>Problem Solving</li>
        <li>Team Collaboration</li>
        </ul>
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