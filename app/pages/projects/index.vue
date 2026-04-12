
<template>
    <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
        <div class="mb-24">
              <UiSectionHeader :level="1" :title="$t('projects.title')" :subtitle="$t('projects.subtitle')" symbol="heroicons:code-bracket" />
            <div class="mt-4 grid grid-cols-1 gap-3">
            <ProjectCard
                v-for="project in projects"
                :key="project.id"
                :project="project"
            />
            </div>
            <div v-if="!projects?.length" class="mt-12 text-center text-primary-500">
                {{ $t('projects.no_projects') }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { ProjectResponse } from '~~/shared/schemas/project.schema';

const { locale, t } = useI18n()
const route = useRoute()

const { data } = await useFetch<{ projects: ProjectResponse[] }>('/api/projects', {
    query: { locale: locale.value }
})

const projects = computed(() => data.value?.projects || [])


useSeoMeta({
  title: t("navigation.projects"),
  ogTitle: t("navigation.projects"),
  description: t("projects.subtitle"),
  ogDescription: t("projects.subtitle"),
  ogUrl: route.fullPath,
  ogType: 'website', 
  ogLocale: locale.value,
  twitterTitle: t("navigation.projects"),
  twitterCard: 'summary_large_image',
  twitterDescription: t("projects.subtitle"),
  robots: 'index, follow',
})
</script>
