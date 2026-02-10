<template>
  <footer class="flex items-center justify-between border-t pt-2 text-xs text-gray-600">
    <div>
      <span class="font-bold">{{ profile?.name }}</span> | {{ profile?.website }}
    </div>

    <div class="flex items-center gap-3">
      <div v-if="profile?.email" class="flex items-center gap-1">
        <Icon name="heroicons:envelope" />
        <span>{{ profile.email }}</span>
      </div>
      <div v-if="profile?.phone" class="flex items-center gap-1">
        <Icon name="heroicons:phone" />
        <span>{{ profile.phone }}</span>
      </div>
      <div v-if="profile?.github" class="flex items-center gap-1">
        <Icon name="mdi:github" />
        <span>{{ profile.github }}</span>
      </div>
    </div>

    <div>
      Seite {{ currentPage }} von {{ totalPages }}
    </div>
  </footer>
</template>

<script setup lang="ts">
const { profile, fetchProfile } = useProfile();

await callOnce('fetch-profile', fetchProfile);

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
