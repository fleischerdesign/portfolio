<template>
    <div class="container max-w-screen-xl mx-auto py-16">
        <div class="mb-24">
            <HeadingSite :title="$t('projects.title')" :subtitle="$t('projects.subtitle')" />
            <div class="grid grid-cols-1 gap-3 mt-4">
            <ProjectCard
                v-for="(project, index) in data"
                :key="index"
                :project="project"
            />
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
const { locale } = useI18n()
const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
    return queryCollection('projects')
        .where('locale', '=', locale.value)
        .select('title', 'subtitle', "image", "slug")
        .all()
})

const { t } = useI18n()

useSeoMeta({
  title: t("navigation.projects"),
  ogTitle: t("navigation.projects"),
  description: t("projects.title"),
  ogDescription: t("projects.subtitle"),
  ogImage: 'https://example.com/image.png',
  ogUrl: route.fullPath,
  ogType: 'website', 
  ogLocale: locale.value,
  twitterTitle: t("navigation.projects"),
  twitterCard: 'summary_large_image',
  twitterDescription: t("projects.subtitle"),
  twitterImage: 'https://example.com/image.png',
  robots: 'index, follow',
})
</script>