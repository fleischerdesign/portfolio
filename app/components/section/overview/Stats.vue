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
    <UiQuickStat
      v-for="(stat, index) in stats"
      :key="index"
      layout="inline"
      :icon="stat.icon"
      :label="stat.label"
      :value="stat.value"
    />
  </div>
</template>
