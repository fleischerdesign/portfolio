<template>
    <UiChip class="flex flex-row gap-9">
        <div class="relative flex items-center justify-center overflow-visible drop-shadow-emit-lg">
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