<script setup lang="ts">
import type { ApplicationApiPayload } from '~/shared/schemas/application.schema';
const { formatDate, getStatusChipClasses, getStatusTextClasses } = useApplicationUtils();
const { renderMarkdown } = useMarkdown(); // Keep this, as useMarkdown is not part of useApplicationUtils

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin
});

const route = useRoute()
const { slug } = route.params as { slug: string }

const { data: application, error, refresh } = await useAuthFetch<ApplicationApiPayload>(`/api/applications/${slug}`);

if (error.value || !application.value) {
  throw createError({ statusCode: 404, statusMessage: 'Application not found', fatal: true })
}

const printUrl = computed(() => `/application/${route.params.slug}/print`)

const isLoading = ref(false)

const isPdfOutdated = computed(() => {
  if (!application.value?.pdfGeneratedAt || !application.value?.updatedAt) {
    return true; // If no PDF or updated timestamp, it's "outdated"
  }
  return new Date(application.value.updatedAt) > new Date(application.value.pdfGeneratedAt);
});

async function generatePdf() {
  isLoading.value = true
  try {
    await useRequestFetch()(`/api/applications/${slug}/pdf/generate`, {
      method: 'POST',
    })
    await refresh() // Refresh data to get the new pdfGeneratedAt timestamp
  } catch (error) {
    console.error('Failed to generate PDF', error)
  } finally {
    isLoading.value = false
  }
}

useSeoMeta({
  title: () => application.value?.title || 'Bewerbung',
  ogTitle: () => application.value?.title || 'Bewerbung',
  description: () => application.value?.subtitle || `Bewerbung bei ${application.value?.company.name || 'einem Unternehmen'}`,
  ogDescription: () => application.value?.subtitle || `Bewerbung bei ${application.value?.company.name || 'einem Unternehmen'}`,
  ogUrl: route.fullPath,
  ogType: 'website',
  robots: 'noindex, nofollow',
});

interface TimelineItem {
  date: string
  title: string
  description: string
  icon: string
}




const timelineItems = computed((): TimelineItem[] => {
  if (!application.value) return [];
  const items: TimelineItem[] = [];

  if (application.value.applicationDate) {
    items.push({
      date: formatDate(application.value.applicationDate),
      title: 'Bewerbung gesendet',
      description: `Bewerbung für die Position als ${application.value.title}.`,
      icon: 'heroicons:paper-airplane'
    });
  }

  if (application.value.interviews) {
    application.value.interviews.forEach((interview, index) => {
      items.push({
        date: formatDate(interview.date),
        title: `Interview #${index + 1}`,
        description: interview.notes || 'Geplantes Gespräch.',
        icon: 'heroicons:chat-bubble-left-right'
      });
    });
  }

  if (application.value.responseDate) {
     items.push({
      date: formatDate(application.value.responseDate),
      title: 'Rückmeldung erhalten',
      description: `Status: ${application.value.status}`,
      icon: statusIconMap[application.value.status] || 'heroicons:question-mark-circle'
    });
  }

  return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

</script>

<template>
  <div v-if="application" class="container mx-auto max-w-screen-xl py-16">
    <div class="mb-12">
      <UiSectionHeader :title="application.title" :subtitle="`Bewerbung an ${application.company.name}`" />
    </div>

    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4 lg:items-start">
      
      <!-- Main Content -->
      <div class="space-y-8 lg:col-span-3">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <!-- Details Card -->
          <UiCard class="md:col-span-1">
            <UiCardContainer class="flex h-full flex-col gap-4">
              <h3 class="text-2xl font-medium">Details</h3>
              <div class="flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-300">Status:</span>
                  <UiChip size="sm" :class="[getStatusChipClasses(application.status), getStatusTextClasses(application.status)]">
                    {{ application.status }}
                  </UiChip>
                </div>
                <div v-if="application.applicationDate" class="flex items-center justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-300">Beworben:</span>
                  <span class="font-medium">{{ formatDate(application.applicationDate) }}</span>
                </div>
                <div v-if="application.responseDate" class="flex items-center justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-300">Rückmeldung:</span>
                  <span class="font-medium">{{ formatDate(application.responseDate) }}</span>
                </div>
              </div>
              <div v-if="application.url" class="mt-auto">
                <a :href="application.url" target="_blank" rel="noopener noreferrer">
                  <UiButton class="w-full">
                    Zur Ausschreibung
                    <Icon name="heroicons:arrow-top-right-on-square" class="ml-2" />
                  </UiButton>
                </a>
              </div>
            </UiCardContainer>
          </UiCard>

          <!-- Company Card -->
          <UiCard class="md:col-span-2">
            <UiCardContainer class="flex h-full flex-col gap-4">
              <h3 class="text-2xl font-medium">Unternehmen</h3>
              <div v-if="application.company.address">
                  <p class="font-bold">{{ application.company.name }}</p>
                  <p>{{ application.company.address.street }} {{ application.company.address.houseNumber }}</p>
                  <p>{{ application.company.address.zipcode }} {{ application.company.address.city }}</p>

                  <div v-if="application.company.address.contactName" class="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                      <p class="font-bold">Ansprechpartner</p>
                      <p>{{ application.company.address.contactName }} <span v-if="application.company.address.contactPosition">({{ application.company.address.contactPosition }})</span></p>
                      <p v-if="application.company.address.contactEmail">{{ application.company.address.contactEmail }}</p>
                      <p v-if="application.company.address.contactPhone">{{ application.company.address.contactPhone }}</p>
                  </div>
              </div>
              <div v-else>
                  <p class="font-bold">{{ application.company.name }}</p>
                  <p class="text-neutral-500">Keine weiteren Firmendetails vorhanden.</p>
              </div>
            </UiCardContainer>
          </UiCard>
        </div>

        <!-- Timeline Card -->
        <UiCard>
            <UiCardContainer class="flex h-full flex-col gap-4">
                <h3 class="text-2xl font-medium">Verlauf</h3>
                <BaseTimeline v-if="timelineItems.length" :items="timelineItems" />
                <p v-else class="text-neutral-500">Keine Verlaufsdaten vorhanden.</p>
            </UiCardContainer>
        </UiCard>

        <!-- Notes Card -->
        <UiCard v-if="application.notes && application.notes.length > 0">
            <UiCardContainer class="flex h-full flex-col gap-4">
                <h3 class="text-2xl font-medium">Notizen</h3>
                <div class="prose prose-neutral max-w-none dark:prose-invert" >
                    <ul class="list-disc space-y-2 pl-5">
                        <li v-for="(note, index) in application.notes" :key="index" v-html="renderMarkdown(note)"></li>
                    </ul>
                </div>
            </UiCardContainer>
        </UiCard>

        <!-- Body Content -->
        <UiCard v-if="application.body">
            <UiCardContainer>
                <h3 class="mb-4 text-2xl font-medium">Inhalt</h3>
                <div class="prose prose-neutral max-w-none dark:prose-invert" v-html="renderMarkdown(application.body)"></div>
            </UiCardContainer>
        </UiCard>
      </div>

      <!-- PDF Preview Sidebar -->
      <div class="sticky top-10 flex flex-col gap-2 lg:col-span-1">
        <UiCard>
            <UiCardContainer class="flex h-full flex-col gap-4">
                <h3 class="text-2xl font-medium">Vorschau</h3>
                <div
                    class="w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700"
                    style="aspect-ratio: 1 / 1.4142"
                >
                    <iframe
                        :src="printUrl"
                        class="h-full w-full"
                        style="transform-origin: top left; transform: scale(0.5); width: 200%; height: 200%;"
                        title="Application Preview"
                    />
                </div>
            </UiCardContainer>
        </UiCard>
        <div class="rounded-lg bg-white shadow dark:bg-neutral-900">
          <div class="flex w-full flex-col gap-2">
              <UiButton class="w-full" :to="printUrl" target="_blank">
                  Vollbild-Vorschau
              </UiButton>
              <template v-if="application.pdfGeneratedAt">
                  <UiButton class="w-full" :to="`/api/applications/${slug}/pdf/download`" external>
                      Download PDF
                  </UiButton>
                  <UiButton v-if="isPdfOutdated" class="w-full" :is-loading="isLoading" :disabled="isLoading" @click="generatePdf">
                      PDF neu generieren
                  </UiButton>
              </template>
              <template v-else>
                  <UiButton class="w-full" :is-loading="isLoading" :disabled="isLoading" @click="generatePdf">
                      PDF generieren
                  </UiButton>
              </template>
          </div>
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