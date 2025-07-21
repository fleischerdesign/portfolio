<template>
  <div class="mb-24">
    <HeadingSection :title="$t('home.projects.title')" :subtitle="$t('home.projects.subtitle')" link="/projects" />
    <div class="mt-4 grid grid-cols-1 gap-3">
      <ProjectCard v-for="(project, index) in projects" :key="index" hover class="group overflow-hidden" :project="project" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { locale } = useI18n();
const route = useRoute();

const {data: projects} = await useAsyncData(route.path+'_projects', () => {
  return queryCollection('projects')
    .where('locale', '=', locale.value)
    .select('title', 'date', 'subtitle', "image", "slug")
    .limit(3)
    .all();
});
</script>