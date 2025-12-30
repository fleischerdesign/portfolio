<script setup lang="ts">
import { ref, computed } from 'vue';
import { applicationHistoryBaseSchema } from '#shared/schemas/application.schema'; // For availableStatuses

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin
});

const { data, pending: _pending, error: _error, refresh } = await useAuthFetch('/api/applications');
const applications = ref(data.value?.applications ?? []);

const { locale } = useI18n();
const route = useRoute();

// Filter and search state
const searchTerm = ref('');
const statusFilter = ref('all'); // Can be 'all' for all, or a specific status
const availableStatuses = ['all', ...applicationHistoryBaseSchema.shape.status.options];

const filteredApplications = computed(() => {
  let result = applications.value;

  // Apply search term
  if (searchTerm.value) {
    const searchLower = searchTerm.value.toLowerCase();
    result = result.filter(app => 
      app.company.name.toLowerCase().includes(searchLower) ||
      app.title.toLowerCase().includes(searchLower)
    );
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    result = result.filter(app => app.currentStatus === statusFilter.value);
  }

  // Sort by creation date descending
  return result.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
});

function handleApplicationDeleted(deletedId: number) {
  applications.value = applications.value.filter(app => app.id !== deletedId);
}

watch(data, (newData) => {
  applications.value = newData?.applications ?? [];
});


useSeoMeta({
  title: "Bewerbungsübersicht",
  ogTitle: "Bewerbungsübersicht",
  description: "Eine Liste aller erstellten und versendeten Bewerbungen.",
  ogDescription: "Eine Liste aller erstellten und versendeten Bewerbungen.",
  ogUrl: route.fullPath,
  ogType: 'website',
  ogLocale: locale.value,
  twitterTitle: "Bewerbungsübersicht",
  twitterCard: 'summary_large_image',
  twitterDescription: "Eine Liste aller erstellten und versendeten Bewerbungen.",
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="container mx-auto max-w-screen-xl py-16">
    <div class="mb-24">
      <UiSectionHeader :level="1" title="Bewerbungsübersicht" subtitle="Eine Liste aller erstellten und versendeten Bewerbungen." />
      
      <div class="mt-4 flex flex-col gap-4 md:flex-row md:items-center">
        <UiInput id="search-applications" v-model="searchTerm" label="Suchen" class="w-full md:flex-grow" />
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:flex-shrink-0">
          <UiSelect id="filter-status" v-model="statusFilter" :options="availableStatuses" label="Status filtern" class="md:w-auto">
            <template #display="{ option }">
              <span v-if="option === 'all'">Alle Status</span>
              <span v-else>{{ option.charAt(0).toUpperCase() + option.slice(1) }}</span>
            </template>
            <template #option="{ option }">
              <span v-if="option === 'all'">Alle Status</span>
              <span v-else>{{ option.charAt(0).toUpperCase() + option.slice(1) }}</span>
            </template>
          </UiSelect>
          <NuxtLink :to="$localePath('/application/new')">
            <UiButton>
              <Icon name="heroicons:plus" class="mr-2 h-5 w-5" />
              Neue Bewerbung
            </UiButton>
          </NuxtLink>
        </div>
      </div>

      <div v-if="filteredApplications && filteredApplications.length > 0" class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ApplicationCard
          v-for="app in filteredApplications"
          :key="app.id"
          :application="app"
          @deleted="handleApplicationDeleted"
        />
      </div>
      <div v-else class="mt-8 text-center text-neutral-500 dark:text-neutral-400">
        <p>Keine Bewerbungen gefunden.</p>
      </div>
    </div>
  </div>
</template>
