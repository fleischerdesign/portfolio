<template>
  <div class="grid grid-cols-1 gap-3">
    <div v-for="skill in skills" :key="skill.name" class="flex flex-col gap-1">
      <div class="flex items-center justify-between">
        <span
          class="text-sm font-bold text-primary-800 dark:text-primary-200"
          >{{ skill.name }}</span
        >
        <span
          v-if="skill.level"
          class="text-[10px] font-black uppercase tracking-wider text-secondary-600 dark:text-secondary-400"
          >{{ skill.level }}</span
        >
      </div>
      <div
        v-if="skill.score != null"
        class="h-1.5 w-full overflow-hidden rounded-full bg-primary-100 dark:bg-primary-800"
      >
        <div
          class="h-full rounded-full bg-secondary-400 dark:bg-secondary-500"
          :style="{ width: skill.score + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Skill {
  name: string;
  level?: string;
  score?: number;
}

defineProps<{
  skills: Skill[];
}>();
</script>
