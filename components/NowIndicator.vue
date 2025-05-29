<template>
    <Chip class="flex flex-row gap-7">
        <div class="flex overflow-visible relative items-center justify-center drop-shadow-emit">
            <Icon :name="now?.icon || 'mage:clock'" size="24" class="text-green-400 inset-0 absolute" />
            <Icon :name="now?.icon || 'mage:clock'" size="24"
                class="text-green-400 animate-ping origin-center inset-0 absolute" />
        </div><span v-if="now?.status">{{ now?.status }}</span>
    </Chip>
</template>

<script lang="ts" setup>
const { locale } = useI18n();
const now = await useFetch('/api/now', { query: { lang: locale.value } }).data
</script>