
<template>
  <div class="mb-24">
      <UiSectionHeader :title="$t('home.projects.title')" :subtitle="$t('home.projects.subtitle')" variant="glow" symbol="heroicons:code-bracket" />
    <div class="mt-4 grid grid-cols-1 gap-3">
      <ProjectCard v-for="project in projects" :key="project.id" hover class="group overflow-hidden" :project="project" />
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

const { data } = await useFetch('/api/projects', {
  query: { locale: locale.value, limit: 3 }
});

const projects = computed(() => (data.value?.projects as any[]) || []);
</script>
