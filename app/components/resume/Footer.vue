<template>
  <footer class="flex items-center justify-between border-t pt-2 text-xs text-gray-600">
    <div>
      <span class="font-bold">Philipp Fleischer</span> | {{ contactData.website }}
    </div>

    <div class="flex items-center gap-3">
      <div class="flex items-center gap-1">
        <Icon name="heroicons:envelope" />
        <span>{{ contactData.email }}</span>
      </div>
      <div class="flex items-center gap-1">
        <Icon name="heroicons:phone" />
        <span>{{ contactData.phone }}</span>
      </div>
      <div class="flex items-center gap-1">
        <Icon name="mdi:github" />
        <span>{{ contactData.github }}</span>
      </div>
    </div>

    <div>
      Seite {{ currentPage }} von {{ totalPages }}
    </div>
  </footer>
</template>

<script setup lang="ts">
import { contactData } from "~/data/contact.data"

defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

</script>
