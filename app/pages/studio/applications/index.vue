<script setup lang="ts">
import { ref, computed } from 'vue';
import { applicationHistoryBaseSchema, type ApplicationResponsePayload } from '#shared/schemas/application.schema'; // For availableStatuses
import ApplicationStats from '~/components/application/Stats.vue';

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin
});

const { data, pending: _pending, error: _error } = await useFetch<{ applications: ApplicationResponsePayload[] }>('/api/applications');
const applications = ref(data.value?.applications ?? []);

const { locale, t } = useI18n();
const route = useRoute();

// Filter and search state
const searchTerm = ref('');
const statusFilter = ref('all'); // Can be 'all' for all, or a specific status
const availableStatuses = ['all', ...applicationHistoryBaseSchema.shape.status.options];

const filteredApplications = computed(() => {
  let result = [...applications.value];

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
  title: () => t("applications.index.title"),
  ogTitle: () => t("applications.index.title"),
  description: () => t("applications.index.subtitle"),
  ogDescription: () => t("applications.index.subtitle"),
  ogUrl: route.fullPath,
  ogType: 'website',
  ogLocale: locale.value,
  twitterTitle: () => t("applications.index.title"),
  twitterCard: 'summary_large_image',
  twitterDescription: () => t("applications.index.subtitle"),
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
    <div class="mb-24 space-y-8">
      <UiSectionHeader :level="1" symbol="heroicons:briefcase" :title="$t('applications.index.title')" :subtitle="$t('applications.index.subtitle')" />
      
      <ApplicationStats :applications="filteredApplications" />

      <UiCard class="mt-8">
        <UiCardContainer class="flex flex-col gap-4 md:flex-row md:items-end">
          <UiInput id="search-applications" v-model="searchTerm" :label="$t('applications.index.search')" class="w-full md:flex-grow" />
          <div class="flex flex-col gap-4 md:flex-shrink-0 md:flex-row md:items-end">
            <UiSelect id="filter-status" v-model="statusFilter" :options="availableStatuses" :label="$t('applications.index.filter_status')" class="w-full md:w-48">
              <template #display="{ option }">
                <span v-if="option === 'all'">{{ $t('applications.index.all_statuses') }}</span>
                <span v-else>{{ $t(`applications.status.${option}`) }}</span>
              </template>
              <template #option="{ option }">
                <span v-if="option === 'all'">{{ $t('applications.index.all_statuses') }}</span>
                <span v-else>{{ $t(`applications.status.${option}`) }}</span>
              </template>
            </UiSelect>
            <NuxtLink :to="$localePath('/studio/applications/new')" class="w-full md:w-auto">
              <UiButton variant="secondary" class="w-full justify-center">
                <Icon name="heroicons:plus" class="mr-2 h-5 w-5" />
                {{ $t('applications.index.new_application') }}
              </UiButton>
            </NuxtLink>
          </div>
        </UiCardContainer>
      </UiCard>

      <div v-if="filteredApplications && filteredApplications.length > 0" class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ApplicationCard
          v-for="app in filteredApplications"
          :key="app.id"
          :application="app"
          @deleted="handleApplicationDeleted"
        />
      </div>
      <div v-else class="mt-8 text-center text-neutral-500 dark:text-neutral-400">
        <p>{{ $t('applications.index.no_applications') }}</p>
      </div>
    </div>
  </div>
</template>
