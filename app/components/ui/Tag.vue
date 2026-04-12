<script setup lang="ts">
interface Props {
  variant?: 'default' | 'glow' | 'outline' | 'fill' | 'status';
  color?: 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'xs' | 'sm' | 'md';
  shape?: 'rounded' | 'pill';
  interactive?: boolean;
  status?: string; // Optional: maps status string to color
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'glow',
  size: 'sm',
  shape: 'pill',
  interactive: false,
});

// Mapping for status strings to colors (from former StatusBadge)
const statusColorMap: Record<string, Props['color']> = {
  draft: 'neutral',
  published: 'success',
  applied: 'info',
  interview: 'warning',
  offer: 'success',
  rejected: 'danger',
  withdrawn: 'purple',
  archived: 'neutral',
};

const resolvedColor = computed(() => {
  if (props.color) return props.color;
  if (props.status) return statusColorMap[props.status] || 'neutral';
  return 'secondary';
});

const tagClasses = useCva(
  { 
    variant: props.variant, 
    size: props.size, 
    shape: props.shape, 
    interactive: props.interactive, 
    color: resolvedColor.value 
  },
  'inline-flex items-center font-bold transition-all duration-300 border shadow-sm',
  {
    variant: {
      glow: 'bg-secondary-50 text-secondary-700 border-secondary-200/50 dark:bg-secondary-900/20 dark:text-secondary-400 dark:border-secondary-500/20',
      outline: 'bg-transparent border-primary-300 text-primary-600 dark:border-primary-700 dark:text-primary-400',
      fill: 'border-transparent',
      status: '', // Base classes for status style
      default: 'bg-white/50 backdrop-blur-sm border-primary-200 text-primary-700 dark:bg-primary-900/50 dark:border-primary-800 dark:text-primary-300',
    },
    size: {
      xs: 'px-1.5 py-0.5 text-[9px] uppercase tracking-tighter',
      sm: 'px-2 py-1 text-[10px] uppercase tracking-wider',
      md: 'px-3 py-1.5 text-xs',
    },
    shape: {
      rounded: 'rounded-md',
      pill: 'rounded-full',
    },
    color: {
      neutral: 'bg-primary-100 text-primary-800 border-primary-200 dark:bg-primary-800 dark:text-primary-300 dark:border-primary-700',
      primary: 'bg-primary-100 text-primary-800 border-primary-200 dark:bg-primary-900/50 dark:text-primary-300 dark:border-primary-700',
      secondary: 'bg-secondary-100 text-secondary-800 border-secondary-200 dark:bg-secondary-900/50 dark:text-secondary-300 dark:border-secondary-700',
      success: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700',
      info: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
      danger: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700',
      purple: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700',
    },
    interactive: {
      true: 'cursor-pointer hover:scale-105 active:scale-95 hover:shadow-md',
      false: '',
    }
  }
);
</script>

<template>
  <span :class="tagClasses">
    <slot />
  </span>
</template>
