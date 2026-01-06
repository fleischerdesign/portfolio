<template>
  <span :class="computedClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'default' | 'glow' | 'outline' | 'fill';
  interactive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'glow', // Now 'glow' is the new standard
  interactive: false,
});

const baseClasses = 'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-all duration-300';

const computedClasses = computed(() => {
  const classes = [baseClasses];

  switch (props.variant) {
    case 'glow':
      classes.push('bg-secondary-50 text-secondary-700 border border-secondary-200/50 shadow-sm dark:bg-secondary-900/20 dark:text-secondary-400 dark:border-secondary-500/20');
      if (props.interactive) {
          classes.push('hover:bg-secondary-100 hover:border-secondary-300 dark:hover:bg-secondary-900/40 dark:hover:border-secondary-400/40 hover:shadow-secondary-500/10 hover:shadow-md cursor-pointer');
      }
      break;
    case 'outline':
      classes.push('border border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400');
      if (props.interactive) {
          classes.push('hover:border-neutral-400 hover:bg-neutral-50 dark:hover:border-neutral-600 dark:hover:bg-neutral-800 cursor-pointer');
      }
      break;
    case 'fill':
      classes.push('bg-neutral-100 text-neutral-800 border border-transparent dark:bg-neutral-800 dark:text-neutral-200');
      if (props.interactive) {
          classes.push('hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer');
      }
      break;
    case 'default':
    default:
      classes.push('bg-white/50 backdrop-blur-sm border border-neutral-200 text-neutral-700 dark:bg-neutral-900/50 dark:border-neutral-800 dark:text-neutral-300');
      if (props.interactive) {
          classes.push('hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer');
      }
      break;
  }

  return classes.join(' ');
});
</script>
