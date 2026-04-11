<template>
  <div class="flex rounded-lg bg-neutral-100 p-1 dark:bg-neutral-900">
    <button
      v-for="lang in LOCALES"
      :key="lang"
      class="flex-1 rounded-md px-3 py-2 text-xs font-bold uppercase transition-all"
      :class="
        modelValue === lang
          ? 'bg-white dark:bg-neutral-800 shadow-sm text-secondary-600'
          : 'text-neutral-500 hover:text-neutral-900'
      "
      @click="emit('update:modelValue', lang)"
    >
      {{ lang }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { LOCALES, type AppLocale } from "#shared/utils/locales";

defineProps<{
  modelValue: AppLocale;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: AppLocale];
}>();
</script>
