<script setup lang="ts">
import { ref, computed } from 'vue';

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
    'relative overflow-hidden p-4 rounded-2xl shadow-sm flex items-start space-x-4 border backdrop-blur-md transition-all',
    {
        variant: {
            info: 'bg-blue-50/60 border-blue-200/50 text-blue-900 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-100',
            success: 'bg-emerald-50/60 border-emerald-200/50 text-emerald-900 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-100',
            warning: 'bg-amber-50/60 border-amber-200/50 text-amber-900 dark:bg-amber-900/30 dark:border-amber-800/50 dark:text-amber-100',
            error: 'bg-red-50/60 border-red-200/50 text-red-900 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-100',
        },
    },
);

const iconContainerClasses = useCva(
    props,
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/50 shadow-sm dark:bg-white/10',
    {
        variant: {
            info: 'text-blue-600 dark:text-blue-300',
            success: 'text-emerald-600 dark:text-emerald-300',
            warning: 'text-amber-600 dark:text-amber-300',
            error: 'text-red-600 dark:text-red-300',
        }
    }
);

const iconName = computed(() => {
    switch (props.variant) {
        case 'success': return 'mdi:check-circle';
        case 'warning': return 'mdi:alert';
        case 'error': return 'mdi:alert-circle';
        case 'info':
        default: return 'mdi:information';
    }
});

const closeAlert = () => {
    show.value = false;
};
</script>

<template>
    <div v-if="show" :class="alertClasses">
        <!-- Ambient Glow Background -->
        <div class="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-current opacity-10 blur-3xl"></div>

        <div v-if="showIcon" :class="iconContainerClasses">
            <Icon :name="iconName" class="h-6 w-6" />
        </div>
        
        <div class="flex-1 pt-1">
            <h3 v-if="title" class="mb-1 text-base font-bold">{{ title }}</h3>
            <div class="text-sm leading-relaxed opacity-90">
                <slot />
            </div>
        </div>
        
        <button v-if="closable" class="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 transition-colors hover:bg-black/5 focus:ring-2 focus:ring-current dark:hover:bg-white/10" @click="closeAlert">
            <span class="sr-only">Close</span>
            <Icon name="mdi:close" class="h-5 w-5 opacity-70" />
        </button>
    </div>
</template>
