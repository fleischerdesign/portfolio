<template>
  <div :class="containerClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  padding?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
});

const containerClasses = useCva(
  props,
  'flex w-full flex-col gap-3',
  {
    padding: {
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    },
  },
);
</script>
