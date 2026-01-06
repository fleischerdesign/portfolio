<template>
  <div :class="toastClasses" role="alert" aria-live="assertive" aria-atomic="true">
    <!-- Icon Container with Glow -->
    <div :class="iconContainerClasses">
      <Icon v-if="showIcon" :name="iconName" class="h-6 w-6" />
    </div>

    <div class="ml-4 flex-grow text-sm font-medium">
      {{ message }}
    </div>

    <button v-if="dismissible" @click="$emit('dismiss')" :class="buttonClasses">
      <span class="sr-only">Close</span>
      <Icon name="heroicons:x-mark-20-solid" class="h-5 w-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  showIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: true,
  showIcon: true,
});

defineEmits(['dismiss']);

const toastClasses = useCva(
  props,
  'flex items-center w-full max-w-sm p-2 pr-4 rounded-2xl shadow-xl backdrop-blur-xl border transition-all duration-500 animate-slide-in-right',
  {
    type: {
      info: 'bg-blue-50/80 border-blue-200/50 text-blue-900 dark:bg-blue-900/60 dark:border-blue-700/50 dark:text-blue-100',
      success: 'bg-emerald-50/80 border-emerald-200/50 text-emerald-900 dark:bg-emerald-900/60 dark:border-emerald-700/50 dark:text-emerald-100 shadow-emerald-500/10',
      warning: 'bg-amber-50/80 border-amber-200/50 text-amber-900 dark:bg-amber-900/60 dark:border-amber-700/50 dark:text-amber-100',
      error: 'bg-red-50/80 border-red-200/50 text-red-900 dark:bg-red-900/60 dark:border-red-700/50 dark:text-red-100 shadow-red-500/10',
    },
  },
);

const iconContainerClasses = useCva(
  props,
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm',
  {
    type: {
      info: 'bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-200',
      success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-800/50 dark:text-emerald-200',
      warning: 'bg-amber-100 text-amber-600 dark:bg-amber-800/50 dark:text-amber-200',
      error: 'bg-red-100 text-red-600 dark:bg-red-800/50 dark:text-red-200',
    },
  },
);

const buttonClasses = useCva(
  props,
  'ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus:ring-2 focus:outline-none',
  {
    type: {
      info: 'text-blue-500 hover:bg-blue-100 focus:ring-blue-400 dark:text-blue-300 dark:hover:bg-blue-800',
      success: 'text-emerald-500 hover:bg-emerald-100 focus:ring-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-800',
      warning: 'text-amber-500 hover:bg-amber-100 focus:ring-amber-400 dark:text-amber-300 dark:hover:bg-amber-800',
      error: 'text-red-500 hover:bg-red-100 focus:ring-red-400 dark:text-red-300 dark:hover:bg-red-800',
    },
  },
);

const iconName = computed(() => {
  switch (props.type) {
    case 'success': return 'mdi:check-circle';
    case 'warning': return 'mdi:alert';
    case 'error': return 'mdi:alert-circle';
    case 'info':
    default: return 'mdi:information';
  }
});
</script>

<style scoped>
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-slide-in-right {
  animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>