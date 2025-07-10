<template>
    <div class="mb-24">
        <HeadingSite v-if="headingType === 'page'" :title="$t('home.contact.title')" :subtitle="$t('home.contact.subtitle')" />
        <HeadingSection v-else :title="$t('home.contact.title')" :subtitle="$t('home.contact.subtitle')" link="/contact" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 mt-12">
            <ContactForm />
            <AlternativeMethods />
        </div>
    </div>
</template>

<script lang="ts" setup>
import AlternativeMethods from './contact/AlternativeMethods.vue';

interface Props {
    headingType?: 'page' | 'section';
}

withDefaults(defineProps<Props>(), {
    headingType: 'section',
});
</script>
