<template>
  <span class="border rounded-lg border-neutral-700 py-1 px-2 inline-flex items-center gap-1 transition"
    :class="{
      'bg-gradient-to-br from-neutral-900 to-neutral-800': fill,
      'hover:bg-gradient-to-br hover:from-neutral-800 hover:to-neutral-900 hover:border-neutral-600 hover:shadow-inner': fill && hover,
    }">
    <slot />
  </span>
</template>

<script setup lang="ts">
// Definiere das 'fill'-Property
defineProps({
  fill: {
    type: Boolean,
    default: false // Setzt den Standardwert auf false (kein Fill)
  },
  hover: {
    type: Boolean,
    default: false // Setzt den Standardwert auf false (kein Fill)
  }
});
</script>