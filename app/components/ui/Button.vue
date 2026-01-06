<template>
    <NuxtLink v-if="to" :to="to" :class="buttonClasses" :external="external">
        <slot name="icon-left" />
        <span v-if="isLoading" class="flex items-center justify-center">
            <Icon name="mdi:loading" class="h-5 w-5 animate-spin" />
        </span>
        <template v-else>
            <slot />
        </template>
        <slot name="icon-right" />
    </NuxtLink>
    <button v-else :type="type" :class="buttonClasses" :disabled="isDisabled || isLoading">
        <slot name="icon-left" />
        <span v-if="isLoading" class="flex items-center justify-center">
            <Icon name="mdi:loading" class="h-5 w-5 animate-spin" />
        </span>
        <template v-else>
            <slot />
        </template>
        <slot name="icon-right" />
    </button>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

interface Props {
    to?: string;
    variant?: 'default' | 'secondary' | 'danger' | 'ghost' | 'link' | 'glass';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    type?: 'button' | 'submit' | 'reset';
    external?: boolean;
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    to: undefined,
    variant: 'default',
    size: 'md',
    type: 'button',
    external: false,
    isLoading: false,
});

const attrs = useAttrs();
const isDisabled = computed(() => !!attrs.disabled);

const buttonClasses = useCva(
    props,
    'rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]',
    {
        variant: {
            default: 'shadow-sm border border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:bg-neutral-800',
            secondary: 'bg-secondary-500 text-neutral-900 font-bold hover:bg-secondary-400 hover:shadow-lg hover:shadow-secondary-500/25 active:bg-secondary-600',
            
            // IMPROVED GLASS / SOCIAL VARIANT
            glass: 'border border-neutral-200 bg-white/50 text-neutral-600 shadow-sm backdrop-blur-sm hover:border-secondary-300 hover:bg-secondary-50 hover:text-secondary-600 hover:shadow-md hover:shadow-secondary-500/10 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:border-secondary-700 dark:hover:bg-secondary-900/30 dark:hover:text-secondary-400',
            
            danger: 'bg-red-500 text-white font-medium hover:bg-red-600 active:bg-red-700',
            ghost: 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800',
            link: 'text-secondary-500 dark:text-secondary-400 hover:underline underline-offset-4',
        },
        size: {
            icon: 'p-3', // Slightly larger hit area
            sm: 'py-2 px-4 text-sm',
            md: 'py-3 px-6 text-base',
            lg: 'py-4 px-8 text-lg',
        },
    },
);
</script>
