<script setup lang="ts">
import type { ContactResponse } from "#shared/schemas/contact.schema";

defineProps<{
  contacts: ContactResponse[];
}>();
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <UiCard
      v-for="contact in contacts"
      :key="contact.id"
      class="border-secondary-500/5"
    >
      <UiCardContainer class="!flex-row items-center gap-4">
        <div
          class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400"
        >
          <Icon name="heroicons:user" size="24" />
        </div>
        <div>
          <p class="font-bold text-neutral-900 dark:text-white">
            {{ contact.name }}
          </p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            {{ contact.position || "Ansprechpartner" }}
          </p>
          <div
            class="mt-1 flex gap-3 text-xs text-secondary-600 dark:text-secondary-400"
          >
            <span v-if="contact.email" class="flex items-center gap-1"
              ><Icon name="heroicons:envelope" />
              {{ contact.email }}</span
            >
            <span v-if="contact.phone" class="flex items-center gap-1"
              ><Icon name="heroicons:phone" /> {{ contact.phone }}</span
            >
          </div>
        </div>
      </UiCardContainer>
    </UiCard>
  </div>
</template>
