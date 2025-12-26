<script setup lang="ts">

interface Props {
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    closable?: boolean;
    showIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'info',
    title: undefined,
    closable: false,
    showIcon: true,
});

const show = ref(true);

const alertClasses = useCva(
    props,
    'p-4 rounded-lg shadow-md flex items-start space-x-4 border',
    {
        variant: {
            info: 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200',
            success: 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-600 dark:text-green-200',
            warning: 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-200',
            error: 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-200',
        },
    },
);

const iconName = computed(() => {
    switch (props.variant) {
        case 'success':
            return 'mdi:check-circle';
        case 'warning':
            return 'mdi:alert';
        case 'error':
            return 'mdi:alert-circle';
        case 'info':
        default:
            return 'mdi:information';
    }
});

const closeAlert = () => {
    show.value = false;
};
</script>

<template>
    <div v-if="show" :class="alertClasses">
        <Icon v-if="showIcon" :name="iconName" class="h-5 w-5 flex-shrink-0" />
        <div class="flex-1">
            <h3 v-if="title" class="mb-1 text-lg font-semibold">{{ title }}</h3>
            <div class="text-sm">
                <slot />
            </div>
        </div>
        <button v-if="closable" class="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg p-1.5 focus:ring-2 focus:ring-current" @click="closeAlert">
            <span class="sr-only">Close</span>
            <Icon name="mdi:close" class="h-5 w-5" />
        </button>
    </div>
</template>

<style scoped>
</style>