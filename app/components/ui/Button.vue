<template>
    <NuxtLink v-if="to" :to="to" :class="buttonClasses" :external="external">
        <slot />
    </NuxtLink>
    <button v-else :type="type" :class="buttonClasses" :disabled="isDisabled">
        <slot />
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    to?: string;
    variant?: 'default' | 'secondary';
    type?: 'button' | 'submit' | 'reset';
    external?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    to: undefined,
    variant: 'default',
    type: 'button',
    external: false,
});

const attrs = useAttrs();

const isDisabled = computed(() => !!attrs.disabled);

const baseClasses = 'shadow-sm rounded-lg py-3 px-5 flex justify-center gap-3 hover:shadow-inner transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed';

const variantClasses = {
    default: 'bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 dark:border-neutral-700 border border-neutral-300 hover:bg-gradient-to-br dark:hover:from-neutral-800 hover:from-neutral-200 dark:hover:to-neutral-900 hover:to-neutral-100 dark:hover:border-neutral-600 hover:border-neutral-400',
    secondary: 'bg-secondary-400 text-neutral-900 font-medium hover:bg-secondary-300 hover:drop-shadow-glow active:bg-secondary-500 active:drop-shadow-none',
};

const buttonClasses = computed(() => {
    return `${baseClasses} ${variantClasses[props.variant]}`;
});
</script>
