<template>
    <UiChip size="md" class="gap-2 border-neutral-300 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800">
        <div class="relative w-6 h-6 flex items-center justify-center overflow-visible drop-shadow-emit-lg">
            <Icon :name="now?.icon || 'mage:clock'" size="24" class="absolute inset-0 text-secondary-400" />
            <Icon
:name="now?.icon || 'mage:clock'" size="24"
                class="absolute inset-0 origin-center animate-ping text-secondary-400" />
        </div><span v-if="now?.status">{{ now?.status }}</span>
    </UiChip>
</template>

<script lang="ts" setup>
const { locale } = useI18n();
const now = await useFetch('/api/now', { query: { lang: locale.value } }).data
</script>