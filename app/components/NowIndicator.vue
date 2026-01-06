<template>
    <UiChip size="lg" variant="secondary" class="group relative overflow-hidden">
        <!-- Background Aura -->
        <div class="absolute inset-0 bg-secondary-400/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        
        <!-- Status Icon with Pulse -->
        <div class="relative flex h-6 w-6 items-center justify-center">
            <!-- Central Icon -->
            <Icon :name="now?.icon || 'mage:clock'" size="24" class="relative z-10 text-secondary-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            
            <!-- Animated Ping/Glow Rings -->
            <div class="absolute inset-0 animate-ping rounded-full bg-secondary-400/40 blur-sm"></div>
            <div class="absolute inset-0 animate-pulse rounded-full bg-secondary-400/20 blur-md"></div>
        </div>

        <!-- Status Text -->
        <span v-if="now?.status" class="relative z-10 font-bold tracking-wide text-neutral-700 dark:text-neutral-200">
            {{ now?.status }}
        </span>
    </UiChip>
</template>

<script lang="ts" setup>
const { locale } = useI18n();
const { data: now } = await useFetch('/api/now', { query: { lang: locale.value } })
</script>
