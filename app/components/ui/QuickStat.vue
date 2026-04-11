<script setup lang="ts">
defineProps<{
  icon?: string;
  label?: string;
  value?: string | number;
}>();
</script>

<template>
  <div class="flex items-center gap-5">
    <!-- Icon Section -->
    <div
      v-if="icon || $slots.icon"
      class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-secondary-200/50 bg-secondary-50 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400"
    >
      <slot name="icon">
        <Icon v-if="icon" :name="icon" size="28" />
      </slot>
    </div>

    <!-- Content Section -->
    <div class="min-w-0 flex-1">
      <p
        v-if="label || $slots.label"
        class="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500"
      >
        <slot name="label">{{ label }}</slot>
      </p>
      
      <div class="mt-0.5 flex flex-col">
        <div class="truncate text-xl font-bold text-neutral-900 dark:text-white">
          <slot name="value">{{ value }}</slot>
        </div>
        
        <div v-if="$slots.footer" class="mt-0.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>
