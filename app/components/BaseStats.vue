<script setup>
const { t } = useI18n();

function diffTimeValue(start, dailyValue) {
    const today = new Date()
    const diffTime = Math.abs(start - today)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays * dailyValue
} 

const stats = [
  { 
    key: 'coffee', 
    label: t("home.overview.statistics.coffee"), 
    icon: 'mdi:coffee', 
    value: diffTimeValue(new Date('2012-12-16'), 4)
  },
  { 
    key: 'linesOfCode', 
    label: t("home.overview.statistics.lines"), 
    icon: 'mdi:code-tags', 
    value: diffTimeValue(new Date('2008-12-16'), 100)
  },
  { 
    key: 'deployments', 
    label: t("home.overview.statistics.deployments"), 
    icon: 'mage:box-3d',
    value: 21
  }
];
</script>

<template>
  <div class="flex flex-col gap-3 py-2">
    <div
      v-for="(stat, index) in stats"
      :key="index" 
      class="group relative flex items-center justify-between rounded-2xl border border-neutral-200/50 bg-white/50 p-4 shadow-sm backdrop-blur-sm transition-all duration-500 hover:border-secondary-500/30 hover:bg-secondary-50/50 dark:border-neutral-800/50 dark:bg-neutral-900/40 dark:hover:border-secondary-400/30 dark:hover:bg-secondary-900/20"
    >
      <div class="flex items-center gap-4">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 transition-transform group-hover:scale-110 dark:bg-secondary-900/40 dark:text-secondary-400">
              <Icon :name="stat.icon" size="20" />
          </div>
          <span class="font-medium text-neutral-700 dark:text-neutral-300">{{ stat.label }}</span>
      </div>
      <span class="text-xl font-bold text-secondary-600 dark:text-secondary-400">
        {{ stat.value.toLocaleString() }}
      </span>
    </div>
  </div>
</template>