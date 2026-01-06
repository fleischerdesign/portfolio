<template>
  <span :class="chipClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'secondary' | 'danger' | 'success' | 'warning' | 'gradient';
  interactive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'glass', // Set glass as default
  interactive: false,
});

const chipClasses = useCva(
  props,
  'inline-flex items-center rounded-full font-medium transition-all duration-300 border',
  {
    size: {
      sm: 'px-2.5 py-0.5 text-xs gap-1.5',
      md: 'px-3.5 py-1 text-sm gap-2',
      lg: 'px-5 py-2 text-base gap-2.5',
    },
    variant: {
      glass: 'bg-white/50 backdrop-blur-md border-neutral-200/60 text-neutral-700 dark:bg-neutral-900/50 dark:border-neutral-800/60 dark:text-neutral-300 shadow-sm',
      secondary: 'bg-secondary-50 border-secondary-200/50 text-secondary-700 dark:bg-secondary-900/20 dark:border-secondary-500/20 dark:text-secondary-400',
      gradient: 'bg-gradient-to-br from-secondary-500 to-secondary-600 text-white border-transparent shadow-lg shadow-secondary-500/20',
      danger: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-500/20 dark:text-red-400',
      success: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-500/20 dark:text-emerald-400',
      warning: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-500/20 dark:text-amber-400',
      default: 'bg-neutral-100 border-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200',
    },
    interactive: {
      true: 'cursor-pointer hover:scale-105 active:scale-95 hover:shadow-md',
      false: '',
    },
  },
);
</script>