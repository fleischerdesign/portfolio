<script setup lang="ts">

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin
});

const { data, pending: _pending, error: _error } = await useAuthFetch('/api/applications');
const applications = computed(() => data.value?.applications ?? [])

const { locale } = useI18n()
const route = useRoute()

useSeoMeta({
  title: "Bewerbungsübersicht",
  ogTitle: "Bewerbungsübersicht",
  description: "Eine Liste aller erstellten und versendeten Bewerbungen.",
  ogDescription: "Eine Liste aller erstellten und versendeten Bewerbungen.",
  ogUrl: route.fullPath,
  ogType: 'website',
  ogLocale: locale.value,
  twitterTitle: "Bewerbungsübersicht",
  twitterCard: 'summary_large_image',
  twitterDescription: "Eine Liste aller erstellten und versendeten Bewerbungen.",
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="container mx-auto max-w-screen-xl py-16">
    <div class="mb-24">
      <UiSectionHeader :level="1" title="Bewerbungsübersicht" subtitle="Eine Liste aller erstellten und versendeten Bewerbungen." />

      <div v-if="applications && applications.length > 0" class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ApplicationCard
          v-for="app in applications"
          :key="app.id"
          :application="app"
        />
      </div>
      <div v-else class="mt-8 text-center text-neutral-500 dark:text-neutral-400">
        <p>Keine Bewerbungen gefunden.</p>
      </div>
    </div>
  </div>
</template>
