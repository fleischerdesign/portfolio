<script setup>
function diffTimeValue(start, dailyValue) {
    const today = new Date()
    const diffTime = Math.abs(start - today)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) // Tage
    return diffDays * dailyValue
} 

const stats = [
  { 
    key: 'coffee', 
    label: 'Getrunkene Kaffees', 
    icon: 'mdi:coffee', 
    value: diffTimeValue(new Date('2012-12-16'), 4)
  },
  { 
    key: 'linesOfCode', 
    label: 'Codezeilen geschrieben', 
    icon: 'mdi:code-tags', 
    value: diffTimeValue(new Date('2008-12-16'), 100)
  },
  { 
    key: 'deployments', 
    label: 'Aktive Deployments', 
    icon: 'mage:box-3d',
    value: 21
  }
];
</script>

<template>
  <div class="flex flex-col gap-2">
    <Tag 
      v-for="(stat, index) in stats" 
      :key="index"
      class="flex items-center justify-between p-2 rounded-md"
    >
      <div class="flex items-center gap-2">
          <Icon :name="stat.icon" size="16" class="dark:text-white" />
        <span class="">{{ stat.label }}</span>
      </div>
      <span class="text-primary-500">
        {{ stat.value }}
      </span>
    </tag>
  </div>
</template>