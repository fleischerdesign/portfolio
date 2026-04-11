<template>
  <span :class="badgeClasses">
    <slot>{{ displayText }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  status: string;
  size?: "sm" | "md";
  capitalize?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "sm",
  capitalize: true,
});

const displayText = computed(() =>
  props.capitalize
    ? props.status.charAt(0).toUpperCase() + props.status.slice(1)
    : props.status,
);

const badgeClasses = useCva(
  props,
  'inline-flex items-center rounded-md border font-bold shadow-sm',
  {
    size: {
      sm: "px-2 py-1 text-[10px] uppercase tracking-wider",
      md: "px-3 py-1.5 text-xs",
    },
    status: {
      draft: "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700",
      published: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
      applied: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700",
      interview: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700",
      offer: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700",
      rejected: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700",
      withdrawn: "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700",
      archived: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700",
    }
  }
);
</script>
