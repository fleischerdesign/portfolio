<template>
  <div :class="toastClasses" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="flex items-center">
      <Icon v-if="showIcon" :name="iconName" class="h-5 w-5 flex-shrink-0" />
      <div class="ml-3 text-sm font-medium flex-grow">
        {{ message }}
      </div>
      <button v-if="dismissible" @click="$emit('dismiss')" :class="buttonClasses">
        <span class="sr-only">Close</span>
        <Icon name="heroicons:x-mark-20-solid" class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  'flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg',
  {
    type: {
      info: 'bg-blue-100 border border-blue-300 text-blue-800 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-200',
      success: 'bg-green-100 border border-green-300 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200',
      warning: 'bg-yellow-100 border border-yellow-300 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-200',
      error: 'bg-red-100 border border-red-300 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-200',
    },
  },
);

const buttonClasses = useCva(
  props,
  '-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg p-1.5 focus:ring-2',
  {
    type: {
      info: 'text-blue-500 hover:bg-blue-200 focus:ring-blue-400 dark:hover:bg-blue-800',
      success: 'text-green-500 hover:bg-green-200 focus:ring-green-400 dark:hover:bg-green-800',
      warning: 'text-yellow-500 hover:bg-yellow-200 focus:ring-yellow-400 dark:hover:bg-yellow-800',
      error: 'text-red-500 hover:bg-red-200 focus:ring-red-400 dark:hover:bg-red-800',
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
