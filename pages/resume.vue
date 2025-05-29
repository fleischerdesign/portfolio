<template>
    <div class="container max-w-screen-xl mx-auto py-16">
        <h1 class="text-4xl font-bold mb-4">Resume</h1>
        <p class="text-lg dark:text-neutral-400 text-neutral-600 mb-8">
        Welcome to my blog! Here, I share my thoughts, experiences, and insights on various topics related to technology,
        design, and more.
        </p>
        <h2 class="text-2xl font-semibold mb-4">Latest Posts</h2>
        <ul class="list-disc list-inside text-lg text-neutral-400 mb-8">
        <li><a href="#">Understanding Vue.js: A Beginner's Guide</a></li>
        <li><a href="#">The Importance of UI/UX Design in Modern Applications</a></li>
        <li><a href="#">Exploring the Latest Trends in Web Development</a></li>
        </ul>
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