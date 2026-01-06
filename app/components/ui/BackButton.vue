<template>
  <NuxtLink 
    :to="to" 
    class="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:text-secondary-500"
  >
    <Icon 
      name="heroicons:arrow-left" 
      class="transition-transform group-hover:-translate-x-1" 
    />
    <slot>{{ $t('common.back_overview') }}</slot>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  to: string
}>()
</script>
