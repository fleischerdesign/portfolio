<script setup lang="ts">
interface Contact {
  name: string;
  position?: string | null;
  email?: string | null;
  phone?: string | null;
  [key: string]: any;
}

defineProps<{
  contact: Contact;
}>();
</script>

<template>
  <UiCard class="border-secondary-500/5">
    <UiCardContainer class="!flex-row items-center gap-4">
      <!-- Icon/Avatar -->
      <div
        class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400"
      >
        <Icon name="heroicons:user" size="24" />
      </div>

      <!-- Details -->
      <div class="min-w-0 flex-1">
        <p class="font-bold text-primary-900 dark:text-white truncate">
          {{ contact.name }}
        </p>
        <p class="text-xs text-primary-500 dark:text-primary-400 truncate">
          {{ contact.position || $t('common.contact_person') || 'Ansprechpartner' }}
        </p>
        
        <div
          class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-secondary-600 dark:text-secondary-400"
        >
          <span v-if="contact.email" class="flex items-center gap-1">
            <Icon name="heroicons:envelope" class="flex-shrink-0" />
            <span class="truncate">{{ contact.email }}</span>
          </span>
          <span v-if="contact.phone" class="flex items-center gap-1">
            <Icon name="heroicons:phone" class="flex-shrink-0" />
            <span class="truncate">{{ contact.phone }}</span>
          </span>
        </div>
      </div>
    </UiCardContainer>
  </UiCard>
</template>
