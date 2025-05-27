<template>
    <div class="flex bg-gradient-to-br from-neutral-900 to-neutral-800 border rounded-lg border-neutral-700 transition"
        :class="{
            'hover:bg-gradient-to-br hover:from-neutral-800 hover:to-neutral-900 hover:border-neutral-600 hover:shadow-inner cursor-pointer': hover,
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