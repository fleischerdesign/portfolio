<template>
  <div :class="computedClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  hover?: boolean; 
  direction?: 'row' | 'col';
}

const props = withDefaults(defineProps<Props>(), {
  shadow: 'sm',
  interactive: false,
  hover: false,
  direction: 'col',
});

const computedClasses = useCva(
  props,
  'relative flex overflow-hidden rounded-2xl border border-primary-200/60 bg-white/80 transition-all duration-500 dark:border-primary-800/60 dark:bg-primary-900/60',
  {
    direction: {
      row: 'flex-row',
      col: 'flex-col',
    },
    shadow: {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    },
    interactive: {
      true: 'cursor-pointer hover:border-secondary-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.15),inset_0_0_10px_rgba(16,185,129,0.1)] dark:hover:border-secondary-400/30 dark:hover:shadow-[0_0_35px_rgba(16,185,129,0.1),inset_0_0_12px_rgba(16,185,129,0.08)]',
    },
    hover: {
      true: 'hover:border-secondary-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.15),inset_0_0_10px_rgba(16,185,129,0.1)] dark:hover:border-secondary-400/30 dark:hover:shadow-[0_0_35px_rgba(16,185,129,0.1),inset_0_0_12px_rgba(16,185,129,0.08)]',
    }
  }
);
</script>