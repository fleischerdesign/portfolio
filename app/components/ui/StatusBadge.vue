<template>
  <span :class="badgeClasses">
    <slot>{{ displayText }}</slot>
  </span>
</template>

<script setup lang="ts">
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

const statusStyles: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  draft: {
    bg: "bg-neutral-100 dark:bg-neutral-800",
    text: "text-neutral-800 dark:text-neutral-300",
    border: "border-neutral-200 dark:border-neutral-700",
  },
  published: {
    bg: "bg-emerald-100 dark:bg-emerald-900/50",
    text: "text-emerald-800 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-700",
  },
  applied: {
    bg: "bg-blue-100 dark:bg-blue-900/50",
    text: "text-blue-800 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-700",
  },
  interview: {
    bg: "bg-yellow-100 dark:bg-yellow-900/50",
    text: "text-yellow-800 dark:text-yellow-300",
    border: "border-yellow-200 dark:border-yellow-700",
  },
  offer: {
    bg: "bg-green-100 dark:bg-green-900/50",
    text: "text-green-800 dark:text-green-300",
    border: "border-green-200 dark:border-green-700",
  },
  rejected: {
    bg: "bg-red-100 dark:bg-red-900/50",
    text: "text-red-800 dark:text-red-300",
    border: "border-red-200 dark:border-red-700",
  },
  withdrawn: {
    bg: "bg-purple-100 dark:bg-purple-900/50",
    text: "text-purple-800 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-700",
  },
  archived: {
    bg: "bg-neutral-100 dark:bg-neutral-800",
    text: "text-neutral-600 dark:text-neutral-400",
    border: "border-neutral-200 dark:border-neutral-700",
  },
};

const style = computed(() => statusStyles[props.status] ?? statusStyles.draft);

const sizeClasses: Record<string, string> = {
  sm: "px-2 py-1 text-[10px] uppercase tracking-wider",
  md: "px-3 py-1.5 text-xs",
};

const badgeClasses = computed(
  () =>
    `inline-flex items-center rounded-md border font-bold shadow-sm ${sizeClasses[props.size]} ${style.value.bg} ${style.value.text} ${style.value.border}`,
);
</script>
