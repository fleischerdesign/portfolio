<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  direction?: 'row' | 'col';
}

const props = withDefaults(defineProps<Props>(), {
  shadow: 'sm',
  interactive: false,
  direction: 'col',
});

const cardClasses = useCva(
  props,
  'flex rounded-lg border border-neutral-300 bg-gradient-to-br from-neutral-100 to-neutral-200 transition dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800',
  {
    shadow: {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    },
    interactive: {
      true: 'cursor-pointer hover:border-neutral-400 hover:from-neutral-200 hover:to-neutral-100 hover:shadow-inner dark:hover:border-neutral-600 dark:hover:from-neutral-800 dark:hover:to-neutral-900',
      false: '',
    },
    direction: {
      row: 'flex-row',
      col: 'flex-col',
    },
  },
);
</script>