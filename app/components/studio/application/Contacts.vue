<script setup lang="ts">
import type { ContactResponse } from "#shared/schemas/contact.schema";

defineProps<{
  contacts: ContactResponse[];
}>();
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <UiContactCard
      v-for="contact in contacts"
      :key="contact.id"
      :contact="contact"
    />
  </div>
</template>
