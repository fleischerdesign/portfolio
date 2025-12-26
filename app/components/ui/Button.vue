<template>
    <NuxtLink v-if="to" :to="to" :class="buttonClasses" :external="external">
        <slot name="icon-left" />
        <span v-if="isLoading" class="flex items-center gap-2">
            <Icon name="mdi:loading" class="h-5 w-5 animate-spin" />
            Loading...
        </span>
        <template v-else>
            <slot />
        </template>
        <slot name="icon-right" />
    </NuxtLink>
    <button v-else :type="type" :class="buttonClasses" :disabled="isDisabled || isLoading">
        <slot name="icon-left" />
        <span v-if="isLoading" class="flex items-center gap-2">
            <Icon name="mdi:loading" class="h-5 w-5 animate-spin" />
            Loading...
        </span>
        <template v-else>
            <slot />
        </template>
        <slot name="icon-right" />
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCva } from '~/composables/useCva';

interface Props {
    to?: string;
    variant?: 'default' | 'secondary' | 'danger' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg';
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
    'rounded-lg flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed',
    {
        variant: {
            default: 'shadow-sm hover:shadow-inner bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 dark:border-neutral-700 border border-neutral-300 hover:bg-gradient-to-br dark:hover:from-neutral-800 hover:from-neutral-200 dark:hover:to-neutral-900 hover:to-neutral-100 dark:hover:border-neutral-600 hover:border-neutral-400 active:brightness-95',
            secondary: 'shadow-sm hover:shadow-inner bg-secondary-400 text-neutral-900 font-medium hover:bg-secondary-300 hover:drop-shadow-glow active:bg-secondary-500 active:drop-shadow-none',
            danger: 'shadow-sm hover:shadow-inner bg-red-500 text-white font-medium hover:bg-red-600 active:bg-red-700',
            ghost: 'text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 active:bg-neutral-300 dark:active:bg-neutral-700',
            link: 'text-secondary-500 dark:text-secondary-400 hover:underline underline-offset-4 active:brightness-90',
        },
        size: {
            sm: 'py-2 px-3 text-sm',
            md: 'py-3 px-5 text-base',
            lg: 'py-4 px-6 text-lg',
        },
    },
);
</script>
