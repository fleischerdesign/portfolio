<template>
    <div
class="flex rounded-lg border border-neutral-300 bg-gradient-to-br from-neutral-100 to-neutral-200 shadow-sm transition dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800"
        :class="{
            'cursor-pointer hover:border-neutral-400 hover:from-neutral-200 hover:to-neutral-100 hover:shadow-inner dark:hover:border-neutral-600 dark:hover:from-neutral-800 dark:hover:to-neutral-900': hover,
        }">
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps({
    hover: {
        type: Boolean,
        default: false
    }
});
</script>