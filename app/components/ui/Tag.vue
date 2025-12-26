<template>
  <span :class="tagClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'gradient' | 'fill';
  interactive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  interactive: false,
});

const tagClasses = useCva(
    props,
    'inline-flex items-center gap-1 rounded-lg border px-2 py-1 transition',
    {
        variant: {
            default: 'border-neutral-300 dark:border-neutral-700',
            gradient: 'bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 border-neutral-300 dark:border-neutral-700',
            fill: 'bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700',
        },
        interactive: {
            true: 'hover:border-neutral-400 hover:from-neutral-200 hover:to-neutral-100 hover:shadow-inner dark:hover:border-neutral-600 dark:hover:from-neutral-800 dark:hover:to-neutral-900',
            false: '',
        },
    },
);
</script>