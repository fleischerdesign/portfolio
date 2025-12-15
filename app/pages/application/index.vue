<script setup lang="ts">
const { data: applications } = await useAsyncData('all-applications', () =>
  queryCollection('applications').all()
)

const { t, locale } = useI18n()
const route = useRoute()
const { statusColor, formatDate } = useApplicationUtils()

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
      <UiHeading :level="1" title="Bewerbungsübersicht" subtitle="Eine Liste aller erstellten und versendeten Bewerbungen." />

      <div v-if="applications && applications.length > 0" class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="app in applications"
          :key="app._id"
          :to="`/application/${app.slug}`"
          class="group"
        >
          <UiCard hover class="h-full flex-col">
            <UiCardContainer class="flex-col">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ app.company.name }}</h2>
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="statusColor(app.status)"
                >
                  {{ app.status }}
                </span>
              </div>
              <p class="mt-2 text-neutral-600 dark:text-neutral-300">{{ app.title }}</p>
              <div class="mt-4 border-t border-neutral-200 pt-4 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                <span>Bewerbung vom: {{ formatDate(app.dates?.application) }}</span>
              </div>
            </UiCardContainer>
          </UiCard>
        </NuxtLink>
      </div>
      <div v-else class="mt-8 text-center text-neutral-500 dark:text-neutral-400">
        <p>Keine Bewerbungen gefunden.</p>
      </div>
    </div>
  </div>
</template>
