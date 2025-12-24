<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md', // 'sm' | 'md'
  },
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1 text-xs';
    case 'md':
    default:
      return 'px-4 py-2 text-base';
  }
});
</script>

<template>
  <span :class="[
    'flex justify-center items-center rounded-full border border-neutral-300 dark:border-neutral-700 shadow-sm',
    sizeClasses,
  ]">
    <slot />
  </span>
</template>
