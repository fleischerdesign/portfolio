<script setup lang="ts">
definePageMeta({
  middleware: 'authorize',
  ability: isAdmin
});



const route = useRoute()
const { slug } = route.params as { slug: string }

const { data: application, error } = await useAsyncData(`application-${slug}`, () =>
  $fetch(`/api/applications/${slug}`)
)

if (error.value || !application.value) {
  throw createError({ statusCode: 404, statusMessage: 'Application not found', fatal: true })
}

const printUrl = computed(() => `/application/${route.params.slug}/print`)

const { statusColor, formatDate } = useApplicationUtils()
const { renderMarkdown } = useMarkdown()

useSeoMeta({
  title: () => application.value!.title,
  ogTitle: () => application.value!.title,
  description: () => application.value!.subtitle,
  ogDescription: () => application.value!.subtitle,
  ogUrl: route.fullPath,
  ogType: 'article',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div v-if="application" class="container mx-auto max-w-screen-xl py-16">
    <div class="mb-12">
      <UiSectionHeader :title="application.title" :subtitle="`Bewerbung an ${application.company.name}`" />
    </div>

    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div class="space-y-8">
        <UiCard class="p-8">
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Metadaten</h3>
            <div class="flex items-center gap-2">
              <span class="w-24 font-medium text-neutral-600 dark:text-neutral-400">Status:</span>
              <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusColor(application.status)">
                {{ application.status }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-24 font-medium text-neutral-600 dark:text-neutral-400">Website:</span>
              <a :href="application.url" target="_blank" rel="noopener noreferrer" class="text-primary-500 hover:underline">
                {{ application.company.name }}
              </a>
            </div>
            <div v-if="application.applicationDate" class="flex items-center gap-2">
              <span class="w-24 font-medium text-neutral-600 dark:text-neutral-400">Beworben am:</span>
              <span>{{ formatDate(application.applicationDate) }}</span>
            </div>
            <div v-if="application.responseDate" class="flex items-center gap-2">
              <span class="w-24 font-medium text-neutral-600 dark:text-neutral-400">Antwort am:</span>
              <span>{{ formatDate(application.responseDate) }}</span>
            </div>
            <div v-if="application.interviews?.length" class="flex flex-col gap-2">
              <span class="font-medium text-neutral-600 dark:text-neutral-400">Interviews:</span>
              <ul class="list-inside list-disc pl-4">
                <li v-for="(interviewDate, index) in application.interviews" :key="index">
                  {{ formatDate(interviewDate) }}
                </li>
              </ul>
            </div>
            <div v-if="application.company.address" class="flex flex-col gap-2">
              <span class="font-medium text-neutral-600 dark:text-neutral-400">Adresse:</span>
              <div class="pl-4">
                <p>{{ application.company.address.name }}</p>
                <p>{{ application.company.address.street }} {{ application.company.address.houseNumber }}</p>
                <p>{{ application.company.address.zipcode }} {{ application.company.address.city }}</p>
              </div>
            </div>
            <div v-if="application.notes?.length" class="flex flex-col gap-2">
              <span class="font-medium text-neutral-600 dark:text-neutral-400">Notizen:</span>
              <ul class="list-inside list-disc space-y-1 pl-4">
                <li v-for="(note, index) in application.notes" :key="index">
                  {{ note }}
                </li>
              </ul>
            </div>
          </div>
        </UiCard>

        <UiCard class="p-8">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <article class="prose prose-gray max-w-none dark:prose-invert dark:text-white" v-html="renderMarkdown(application.body)" />
        </UiCard>
      </div>

      <div class="h-full min-h-[80vh]">
        <div
          class="h-full w-full overflow-hidden rounded-lg shadow-xl"
          :style="{
            // A4 aspect ratio
            aspectRatio: '1 / 1.4142',
          }"
        >
          <iframe
            :src="printUrl"
            class="h-full w-full"
            :style="{
              // Scale down to fit container, maintaining origin at top-left
              transformOrigin: 'top left',
              transform: 'scale(0.5)',
              // Since it's scaled by 0.5, we need to double the effective size
              width: '200%',
              height: '200%',
            }"
            title="Application Preview"
          />
        </div>
        <div class="mt-4 text-center">
          <a
            :href="printUrl"
            target="_blank"
            class="hover:text-primary-500 text-sm text-gray-500 dark:text-gray-400"
          >
            Vollbild-Vorschau öffnen
          </a>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container mx-auto max-w-screen-xl py-16">
    <p>Lade Bewerbungsdaten...</p>
  </div>
</template>

<style scoped>
</style>