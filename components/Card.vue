<template>
    <div class="flex bg-gradient-to-br dark:from-neutral-900 from-neutral-100 dark:to-neutral-800 to-neutral-200 border rounded-lg dark:border-neutral-700 border-neutral-300 transition"
        :class="{
            ' dark:hover:from-neutral-800 hover:from-neutral-200 dark:hover:to-neutral-900 hover:to-neutral-100 dark:hover:border-neutral-600 hover:border-neutral-400 hover:shadow-inner cursor-pointer': hover,
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