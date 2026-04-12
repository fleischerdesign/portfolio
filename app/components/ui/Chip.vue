<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'secondary' | 'danger' | 'success' | 'warning' | 'gradient';
  interactive?: boolean;
  closable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'glass',
  interactive: false,
  closable: false,
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const chipClasses = useCva(
  props,
  'inline-flex items-center rounded-full font-medium transition-all duration-300 border shadow-sm',
  {
    size: {
      sm: 'px-2.5 py-0.5 text-xs gap-1.5',
      md: 'px-3.5 py-1 text-sm gap-2',
      lg: 'px-5 py-2 text-base gap-2.5',
    },
    variant: {
      glass: 'bg-white/50 backdrop-blur-md border-primary-200/60 text-primary-700 dark:bg-primary-900/50 dark:border-primary-800/60 dark:text-primary-300',
      secondary: 'bg-secondary-50 border-secondary-200/50 text-secondary-700 dark:bg-secondary-900/20 dark:border-secondary-500/20 dark:text-secondary-400',
      gradient: 'bg-gradient-to-br from-secondary-500 to-secondary-600 text-white border-transparent shadow-lg shadow-secondary-500/20',
      danger: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-500/20 dark:text-red-400',
      success: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-500/20 dark:text-emerald-400',
      warning: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-500/20 dark:text-amber-400',
      default: 'bg-primary-100 border-primary-200 text-primary-800 dark:bg-primary-800 dark:border-primary-700 dark:text-primary-200',
    },
    interactive: {
      true: 'cursor-pointer hover:scale-105 active:scale-95 hover:shadow-md',
      false: '',
    },
  },
);
</script>

<template>
  <span :class="chipClasses">
    <slot />
    <button
      v-if="closable"
      type="button"
      class="flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      @click.stop="emit('close')"
    >
      <Icon name="heroicons:x-mark" size="14" />
    </button>
  </span>
</template>
