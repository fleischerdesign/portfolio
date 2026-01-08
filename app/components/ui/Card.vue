<template>
  <div :class="computedClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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

// Base classes
const baseClasses = 'relative flex rounded-2xl border border-neutral-200/60 bg-white/80 backdrop-blur-md transition-all duration-500 dark:border-neutral-800/60 dark:bg-neutral-900/60';

// Hover effects
const hoverStyles = `
  hover:border-secondary-500/40 
  hover:shadow-[0_0_25px_rgba(16,185,129,0.15),inset_0_0_10px_rgba(16,185,129,0.1)] 
  dark:hover:border-secondary-400/30 
  dark:hover:shadow-[0_0_35px_rgba(16,185,129,0.1),inset_0_0_12px_rgba(16,185,129,0.08)]
`;

const computedClasses = computed(() => {
  const classes = [baseClasses];

  classes.push(props.direction === 'row' ? 'flex-row' : 'flex-col');

  switch (props.shadow) {
    case 'none': classes.push('shadow-none'); break;
    case 'sm': classes.push('shadow-sm'); break;
    case 'md': classes.push('shadow-md'); break;
    case 'lg': classes.push('shadow-lg'); break;
    case 'xl': classes.push('shadow-xl'); break;
  }

  if (props.interactive || props.hover) {
    if (props.interactive) classes.push('cursor-pointer');
    classes.push(hoverStyles);
  }

  return classes.join(' ');
});
</script>