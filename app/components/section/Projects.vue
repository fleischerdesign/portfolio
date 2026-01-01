<template>
  <div class="mb-24">
      <UiSectionHeader :title="$t('home.projects.title')" :subtitle="$t('home.projects.subtitle')" />
    <div class="mt-4 grid grid-cols-1 gap-3">
      <ProjectCard v-for="(project, index) in projects" :key="index" hover class="group overflow-hidden" :project="project" />
    </div>
    <div class="mt-8 text-center">
      <NuxtLinkLocale to="/projects" class="block w-full md:inline-block md:w-auto">
        <UiButton variant="secondary" class="w-full">
          {{ $t('home.projects.view_all') }}
        </UiButton>
      </NuxtLinkLocale>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { locale } = useI18n();
const route = useRoute();

const {data: projects} = await useAsyncData(route.path+'_projects', () => {
  return queryCollection('projects')
    .where('locale', '=', locale.value)
    .select('title', 'date', 'subtitle', "image", "slug", "icon")
    .limit(3)
    .all();
});
</script>