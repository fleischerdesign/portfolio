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
    app => app.histories.some(h => h.status === 'interview') || ['interview', 'offer', 'rejected'].includes(app.currentStatus)
  ).length;
  return Math.round((interviewCount / totalApplications.value) * 100);
});

const offerRate = computed(() => {
  if (totalApplications.value === 0) return 0;
  const offerCount = props.applications.filter(app => app.currentStatus === 'offer').length;
  return Math.round((offerCount / totalApplications.value) * 100);
});

const { t } = useI18n();

const stats = computed(() => [
  { 
    key: 'total', 
    label: t('applications.index.stats.total'), 
    value: totalApplications.value,
    icon: 'heroicons:folder'
  },
  { 
    key: 'response', 
    label: t('applications.index.stats.response_rate'), 
    value: `${responseRate.value}%`,
    icon: 'heroicons:arrow-uturn-left'
  },
  { 
    key: 'interview', 
    label: t('applications.index.stats.interview_rate'), 
    value: `${interviewRate.value}%`,
    icon: 'heroicons:chat-bubble-left-right'
  },
  { 
    key: 'offer', 
    label: t('applications.index.stats.offer_rate'), 
    value: `${offerRate.value}%`,
    icon: 'heroicons:gift'
  },
]);
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
    <UiCard v-for="stat in stats" :key="stat.key" class="border-secondary-500/10 shadow-lg shadow-secondary-500/5">
      <UiCardContainer class="!flex-row items-center justify-center gap-4">
        <div class="flex-shrink-0 rounded-xl border border-secondary-200/50 bg-secondary-50 p-3 dark:border-secondary-500/10 dark:bg-secondary-900/20">
          <Icon :name="stat.icon" class="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
        </div>
        <div class="flex flex-col">
          <span class="text-2xl font-bold text-primary-900 dark:text-white">{{ stat.value }}</span>
          <span class="text-xs font-bold uppercase tracking-wider text-primary-500 dark:text-primary-400">{{ stat.label }}</span>
        </div>
      </UiCardContainer>
    </UiCard>
  </div>
</template>
