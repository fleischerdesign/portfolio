<template>
  <span
class="inline-flex items-center gap-1 rounded-lg border border-neutral-300 px-2 py-1 transition dark:border-neutral-700"
    :class="{
      'bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800': gradient,
      'bg-neutral-100 dark:bg-neutral-900' : fill,
      'hover:border-neutral-400 hover:bg-gradient-to-br hover:from-neutral-200 hover:to-neutral-100 hover:shadow-inner dark:hover:border-neutral-600 dark:hover:from-neutral-800 dark:hover:to-neutral-900': gradient && hover,
    }">
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps({
  gradient: {
    type: Boolean,
    default: false
  },
  hover: {
    type: Boolean,
    default: false
  },
  fill: {
    type: Boolean,
    default: false
  }
});
</script>