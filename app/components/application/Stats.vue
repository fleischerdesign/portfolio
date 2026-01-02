<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { ApplicationResponsePayload } from '#shared/schemas/application.schema';

const props = defineProps({
  applications: {
    type: Array as PropType<ApplicationResponsePayload[]>,
    required: true,
  },
});

const totalApplications = computed(() => props.applications.length);

const responseRate = computed(() => {
  if (totalApplications.value === 0) return 0;
  const respondedCount = props.applications.filter(
    app => app.currentStatus !== 'draft' && app.currentStatus !== 'applied'
  ).length;
  return Math.round((respondedCount / totalApplications.value) * 100);
});

const interviewRate = computed(() => {
  if (totalApplications.value === 0) return 0;
  const interviewCount = props.applications.filter(
    app => app.interviews && app.interviews.length > 0 || ['interview', 'offer', 'rejected'].includes(app.currentStatus)
  ).length;
  return Math.round((interviewCount / totalApplications.value) * 100);
});

const offerRate = computed(() => {
  if (totalApplications.value === 0) return 0;
  const offerCount = props.applications.filter(app => app.currentStatus === 'offer').length;
  return Math.round((offerCount / totalApplications.value) * 100);
});

const stats = computed(() => [
  { 
    key: 'total', 
    label: 'Gesamt', 
    value: totalApplications.value,
    icon: 'heroicons:folder'
  },
  { 
    key: 'response', 
    label: 'Antwortrate', 
    value: `${responseRate.value}%`,
    icon: 'heroicons:arrow-uturn-left'
  },
  { 
    key: 'interview', 
    label: 'Interview-Rate', 
    value: `${interviewRate.value}%`,
    icon: 'heroicons:chat-bubble-left-right'
  },
  { 
    key: 'offer', 
    label: 'Angebots-Rate', 
    value: `${offerRate.value}%`,
    icon: 'heroicons:gift'
  },
]);
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
    <UiCard v-for="stat in stats" :key="stat.key">
      <UiCardContainer class="flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-sm text-neutral-500 dark:text-neutral-400">{{ stat.label }}</span>
          <span class="text-2xl font-bold">{{ stat.value }}</span>
        </div>
        <div class="rounded-full bg-primary-100 p-3 dark:bg-primary-900/50">
          <Icon :name="stat.icon" class="h-6 w-6 text-primary-500 dark:text-primary-400" />
        </div>
      </UiCardContainer>
    </UiCard>
  </div>
</template>
