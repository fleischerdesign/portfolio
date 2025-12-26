<template>
  <div :class="rootClasses">
    <div class="flex items-center gap-2">
      <Icon v-if="symbol" :name="symbol" class="h-10 w-10 shrink-0 fill-secondary-400" mode="svg" />
      <component :is="tag" class="text-5xl font-semibold">{{ title }}</component>
    </div>
    <p v-if="subtitle" :class="subtitleClasses">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  subtitle: string
  symbol?: string
  level?: 1 | 2,
  align?: 'left' | 'center'
}>(), {
  level: 2,
  symbol: undefined,
  align: 'left',
})

const tag = computed(() => `h${props.level}`)

const rootClasses = useCva(
  props,
  'mb-10 flex flex-col gap-4',
  {
    align: {
      left: 'items-start',
      center: 'items-center text-center',
    },
  },
);

const subtitleClasses = useCva(
  props,
  'text-neutral-600 dark:text-neutral-400',
  {
    align: {
      left: 'w-full border-l-4 border-secondary-400 pl-4 lg:w-2/3',
      center: 'w-full border-l-0 border-t-4 border-secondary-400 pt-4',
    },
  },
);
</script>
