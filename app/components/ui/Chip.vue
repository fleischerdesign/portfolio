<template>
  <span :class="chipClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'secondary' | 'danger' | 'info' | 'success' | 'warning';
  interactive?: boolean;
  unstyled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default',
  interactive: false,
  unstyled: false,
});

const { unstyled, ...cvaProps } = props;

const chipClasses = useCva(
  unstyled ? { size: props.size } : cvaProps,
  'flex items-center rounded-full shadow-sm transition border border-neutral-300 dark:border-neutral-700',
  {
    size: {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base',
    },
    variant: {
      default: 'bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200',
      gradient: 'bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800',
      secondary: 'bg-secondary-400 text-neutral-900',
      danger: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white',
      success: 'bg-green-500 text-white',
      warning: 'bg-yellow-500 text-white',
    },
    interactive: {
      true: 'cursor-pointer hover:opacity-75 active:scale-95',
      false: '',
    },
  },
);
</script>
