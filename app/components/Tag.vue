<template>
  <span class="border rounded-lg dark:border-neutral-700 border-neutral-300 py-1 px-2 inline-flex items-center gap-1 transition"
    :class="{
      'bg-gradient-to-br dark:from-neutral-900 from-neutral-100 dark:to-neutral-800 to-neutral-200': gradient,
      'bg-neutral-100 dark:bg-neutral-900' : fill,
      'hover:bg-gradient-to-br dark:hover:from-neutral-800 hover:from-neutral-200 dark:hover:to-neutral-900 hover:to-neutral-100 dark:hover:border-neutral-600 hover:border-neutral-400 hover:shadow-inner': gradient && hover,
    }">
    <slot />
  </span>
</template>

<script setup lang="ts">
// Definiere das 'fill'-Property
defineProps({
  gradient: {
    type: Boolean,
    default: false // Setzt den Standardwert auf false (kein Fill)
  },
  hover: {
    type: Boolean,
    default: false // Setzt den Standardwert auf false (kein Fill)
  },
  fill: {
    type: Boolean,
    default: false // Setzt den Standardwert auf false (kein Fill)
  }
});
</script>