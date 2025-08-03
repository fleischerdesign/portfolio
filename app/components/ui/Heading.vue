<template>
  <div class="mb-10 flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <Icon v-if="symbol" :name="symbol" class="h-10 w-10 shrink-0 fill-secondary-400" mode="svg" />
      <component :is="tag" class="text-5xl font-semibold">{{ title }}</component>
    </div>
    <p class="w-full border-l-4 border-secondary-400 pl-4 text-neutral-600 lg:w-2/3 dark:text-neutral-400">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  subtitle: string
  symbol?: string
  level?: 1 | 2
}>(), {
  level: 2,
  symbol: undefined,
})

const tag = computed(() => `h${props.level}`)
</script>
