<template>
    <div class="mb-24">
          <UiSectionHeader v-if="headingType === 'page'" :level="1" :title="$t('home.contact.title')" :subtitle="$t('home.contact.subtitle')" variant="glow" symbol="mage:message-round" />
  <UiSectionHeader v-else :title="$t('home.contact.title')" :subtitle="$t('home.contact.subtitle')" variant="glow" symbol="mage:message-round" />

        <div class="mt-12 grid grid-cols-1 gap-16 md:grid-cols-2">
            <ContactForm />
            <ContactAlternativeMethods />
        </div>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    headingType?: 'page' | 'section';
}

withDefaults(defineProps<Props>(), {
    headingType: 'section',
});
</script>
