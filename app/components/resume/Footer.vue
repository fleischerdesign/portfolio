<template>
  <footer class="text-xs text-gray-600 flex justify-between items-center border-t pt-2">
    <!-- Linke Seite: Name und Portfolio -->
    <div>
      <span class="font-bold">Philipp Fleischer</span> | fleischer.design
    </div>

    <!-- Mitte: Kontakt-Icons -->
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-1">
        <Icon name="heroicons:envelope" />
        <span>philipp@fleischer.design</span>
      </div>
      <div class="flex items-center gap-1">
        <Icon name="heroicons:phone" />
        <span>+49 176 310 99 324</span>
      </div>
      <div class="flex items-center gap-1">
        <Icon name="mdi:github" />
        <span>github.com/fleischerdesign</span>
      </div>
    </div>

    <!-- Rechte Seite: Seitenzahl -->
    <div>
      Seite {{ currentPage }} von {{ totalPages }}
    </div>
  </footer>
</template>

<script setup lang="ts">
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
