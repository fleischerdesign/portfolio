<script setup lang="ts">
import type { ApplicationResponsePayload } from '#shared/schemas/application.schema';
import type { CompanyResponse } from '#shared/schemas/company.schema';


const { getStatusChipClasses, getStatusTextClasses, getApplicationDate, getResponseDate, getLastActivityDate, getFormattedApplicationDate, getFormattedResponseDate, getFormattedLastActivityDate } = useApplicationUtils();
const { renderMarkdown } = useMarkdown(); 

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin
});

const route = useRoute();
const { slug } = route.params as { slug: string };

const { data: application, error, refresh } = await useFetch<ApplicationResponsePayload>(`/api/applications/${slug}`);

if (error.value || !application.value) {
  throw createError({ statusCode: 404, statusMessage: 'Application not found', fatal: true });
}

// Initialize Application Editor Composable
const {
  isEditing,
  isLoading,
  editableApplication,
  allCompanies,
  allContacts,
  startEditing,
  cancelEditing,
  saveApplication,
  isPdfOutdated,
  generatePdf,
  showContactFormModal,
  companyIdForNewContact,
  nameForNewContact,
  handleCreateContactRequest,
  handleContactCreated,
  handleCancelContactForm,
} = useApplicationEditor(application, refresh, toRef(route.params as { slug: string }, 'slug')); // Pass application ref, refresh function, and slug ref

// Initialize History Manager Composable
const {
  showAddHistoryModal,
  newHistoryStatus,
  newHistoryNotes,
  newHistoryScheduledAt,
  newHistoryCreatedAt,
  addHistory,
  showEditHistoryModal,
  editableHistoryEntry,
  startEditHistory,
  updateHistory,
  showDeleteHistoryModal,
  deletableHistoryEntry,
  startDeleteHistory,
  deleteHistory,
  undoDeleteHistory,
  timelineItems,
  availableStatuses,
  getStatusTextClasses: getHistoryStatusTextClasses, // Alias to avoid conflict with useApplicationUtils
} = useHistoryManager(
  computed(() => isEditing.value ? editableApplication.value : application.value),
  isEditing
);

const notesAsText = computed({
  get: () => editableApplication.value?.notes?.join('\n') ?? '',
  set: (value: string) => {
    if (editableApplication.value) {
      editableApplication.value.notes = value.split('\n').filter(note => note.trim() !== '');
    }
  },
});

const printUrl = computed(() => `/application/${route.params.slug}/print`);

const showCompanyAddressModal = ref(false);

async function handleAddressUpdateSuccess(updatedCompany: CompanyResponse) {
  showCompanyAddressModal.value = false;
  if (editableApplication.value) {
    editableApplication.value.selectedCompany = updatedCompany;
  }
}
useSeoMeta({
  title: () => application.value?.title || 'Bewerbung',
  ogTitle: () => application.value?.title || 'Bewerbung',
  description: () => application.value?.subtitle || `Bewerbung bei ${application.value?.company.name || 'einem Unternehmen'}`,
  ogDescription: () => application.value?.subtitle || `Bewerbung bei ${application.value?.company.name || 'einem Unternehmen'} `,
  ogUrl: route.fullPath,
  ogType: 'website',
  robots: 'noindex, nofollow',
});

onMounted(() => {
  if (route.query.edit === 'true') {
    startEditing();
  }
});
</script>

<template>
  <div v-if="application" class="container mx-auto max-w-screen-xl py-16">
    <!-- Header -->
    <div class="mb-12">
      <UiSectionHeader symbol="heroicons:briefcase" :title="application.title" :subtitle="`Bewerbung an ${application.company.name}`" />
    </div>

    <!-- Main Grid -->
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
                  <UiChip unstyled size="sm" :class="[getStatusChipClasses(application.currentStatus), getStatusTextClasses(application.currentStatus)]">
                    {{ application.currentStatus }}
                  </UiChip>
                </div>
                <div v-if="getApplicationDate(application)" class="flex items-center justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-300">Beworben:</span>
                  <span class="font-medium">{{ getFormattedApplicationDate(application) }}</span>
                </div>
                <div v-if="getResponseDate(application)" class="flex items-center justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-300">Rückmeldung:</span>
                  <span class="font-medium">{{ getFormattedResponseDate(application) }}</span>
                </div>
                <div v-if="getLastActivityDate(application)" class="flex items-center justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-300">Letzte Aktivität:</span>
                  <span class="font-medium">{{ getFormattedLastActivityDate(application) }}</span>
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
          <UiCard class="md:col-span-1">
            <UiCardContainer class="flex h-full flex-col gap-4">
              <h3 class="text-2xl font-medium">Unternehmen</h3>
              <div v-if="!isEditing">
                <p class="font-bold">{{ application.company.name }}</p>
                <div v-if="application.company.address">
                  <p>{{ application.company.address.street }} {{ application.company.address.houseNumber }}</p>
                  <p>{{ application.company.address.zipcode }} {{ application.company.address.city }}</p>
                </div>
                <div v-else>
                  <p class="text-neutral-500">Keine Adresse vorhanden.</p>
                </div>
              </div>
              <div v-else-if="editableApplication">
                <UiSelect
                  id="company-select"
                  v-model="editableApplication.selectedCompany"
                  :options="allCompanies"
                  label="Firma"
                  by="id"
                >
                  <template #display="{ option }">
                    {{ option.name }}
                  </template>
                  <template #option="{ option }">
                    {{ option.name }}
                  </template>
                </UiSelect>
                <div v-if="editableApplication.selectedCompany?.address" class="mt-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <p>{{ editableApplication.selectedCompany.address.street }} {{ editableApplication.selectedCompany.address.houseNumber }}</p>
                      <p>{{ editableApplication.selectedCompany.address.zipcode }} {{ editableApplication.selectedCompany.address.city }}</p>
                    </div>
                    <UiButton size="sm" variant="ghost" class="!p-1 h-7 w-7" @click="showCompanyAddressModal = true">
                      <Icon name="mdi:pencil" class="h-4 w-4" />
                    </UiButton>
                  </div>
                </div>
                 <div v-else class="mt-2">
                    <UiButton size="sm" variant="ghost" @click="showCompanyAddressModal = true">
                        Adresse hinzufügen
                    </UiButton>
                 </div>
              </div>
            </UiCardContainer>
          </UiCard>

          <!-- Contacts Card -->
          <UiCard class="md:col-span-1">
            <UiCardContainer class="flex h-full flex-col gap-4">
              <h3 class="text-2xl font-medium">Ansprechpartner</h3>
              
              <div v-if="!isEditing && application.contacts && application.contacts.length > 0" class="grid grid-cols-1 gap-4">
                <div v-for="contact in application.contacts" :key="contact.id">
                  <p class="font-bold">{{ contact.name }}</p>
                  <p v-if="contact.position" class="text-sm text-neutral-500">{{ contact.position }}</p>
                  <p v-if="contact.email" class="mt-2">{{ contact.email }}</p>
                  <p v-if="contact.phone">{{ contact.phone }}</p>
                </div>
              </div>
              <div v-else-if="isEditing && editableApplication" class="grid grid-cols-1 gap-4">
                <UiSelect
                  id="contact-select"
                  v-model="editableApplication.selectedContacts"
                  :options="allContacts"
                  label="Kontakte auswählen"
                  by="id"
                  multiple
                  creatable
                  @create="handleCreateContactRequest"
                >
                  <template #display="{ option }">
                    {{ option.name }}
                    <span v-if="option.company && option.company.name">({{ option.company.name }})</span>
                  </template>
                  <template #option="{ option }">
                    {{ option.name }}
                    <span v-if="option.company && option.company.name" class="text-sm text-neutral-500">({{ option.company.name }})</span>
                  </template>
                </UiSelect>
              </div>
              <p v-else class="text-neutral-500">Keine Ansprechpartner vorhanden.</p>
            </UiCardContainer>
          </UiCard>
        </div>

        <!-- Timeline Card -->
        <UiCard>
            <UiCardContainer class="flex h-full flex-col gap-4">
              <div class="flex items-center justify-between">
                <h3 class="text-2xl font-medium">Verlauf</h3>
                <UiButton v-if="isEditing" size="sm" variant="ghost" @click="showAddHistoryModal = true">
                  <Icon name="heroicons:plus" class="h-5 w-5" />
                  Hinzufügen
                </UiButton>
              </div>
              <BaseTimeline v-if="timelineItems.length" :items="timelineItems">
                <template #default="{ item, index }">
                  <div :class="{ 'md:text-right': index % 2 === 0 }">
                    <span class="text-sm font-semibold text-secondary-400">{{ item.date }}</span>
                    <h3
                      class="mt-1 flex gap-2 text-xl font-bold"
                      :class="{ 'md:justify-end': index % 2 === 0 }"
                    >
                      {{ item.title }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300">{{ item.description }}</p>
                  </div>
                  <div
                    v-if="isEditing"
                    class="mt-2 flex gap-2"
                    :class="index % 2 === 0 ? 'md:justify-end' : 'justify-start'"
                  >
                    <UiButton v-if="!item._deleted" size="sm" variant="ghost" @click="startEditHistory(item)">
                      Bearbeiten
                    </UiButton>
                    <UiButton v-if="!item._deleted" size="sm" variant="ghost" color="danger" @click="startDeleteHistory(item)">
                      Löschen
                    </UiButton>
                    <UiButton v-else size="sm" variant="ghost" @click="undoDeleteHistory(item)">
                      Rückgängig
                    </UiButton>
                  </div>
                </template>
              </BaseTimeline>
              <p v-else class="text-neutral-500">Keine Verlaufsdaten vorhanden.</p>
            </UiCardContainer>
        </UiCard>

        <!-- Notes Card -->
        <UiCard v-if="(!isEditing && application.notes && application.notes.length > 0) || isEditing">
            <UiCardContainer class="flex h-full flex-col gap-4">
                <h3 class="text-2xl font-medium">Notizen</h3>
                <div v-if="!isEditing" class="prose prose-neutral max-w-none dark:prose-invert" >
                    <ul class="list-disc space-y-2 pl-5">
                        <!-- eslint-disable-next-line vue/no-v-html -->
                        <li v-for="(note, index) in application.notes" :key="index" v-html="renderMarkdown(note)"></li>
                    </ul>
                </div>
                <div v-else>
                    <UiInput 
                        id="notes"
                        v-model="notesAsText"
                        as="textarea"
                        label="Notizen (eine pro Zeile)"
                    />
                </div>
            </UiCardContainer>
        </UiCard>

        <!-- Body Content -->
        <UiCard v-if="(!isEditing && application.body) || isEditing">
            <UiCardContainer>
                <h3 class="mb-4 text-2xl font-medium">Inhalt</h3>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div v-if="!isEditing" class="prose prose-neutral max-w-none dark:prose-invert" v-html="renderMarkdown(application.body || '')"></div>
                <div v-else-if="editableApplication">
                    <UiInput
                        id="body"
                        v-model="editableApplication.body"
                        as="textarea"
                        label="Inhalt (Markdown)"
                    />
                </div>
            </UiCardContainer>
        </UiCard>
      </div>

      <!-- Sidebar -->
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
              <template v-if="isEditing">
                <UiButton class="w-full" :is-loading="isLoading" @click="saveApplication">
                  Speichern
                </UiButton>
                <UiButton class="w-full" variant="secondary" @click="cancelEditing">
                  Abbrechen
                </UiButton>
              </template>
              <template v-else>
                <UiButton class="w-full" @click="startEditing">
                  Bearbeiten
                </UiButton>
              </template>
              <hr class="my-2 border-neutral-200 dark:border-neutral-700">
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

    <!-- Modals -->
    <UiModal v-model="showAddHistoryModal">
      <template #header><h3 class="text-xl font-semibold">Neuen Verlaufseintrag hinzufügen</h3></template>
      <template #body>
        <form class="flex flex-col gap-4" @submit.prevent="addHistory">
          <UiSelect id="add-history-status" v-model="newHistoryStatus" :options="availableStatuses" label="Status">
            <template #display="{ option }">
              <span class="flex items-center gap-3">
                <Icon name="mdi:circle" class="h-4 w-4" :class="getStatusTextClasses(option)" />
                <span class="font-medium">{{ option }}</span>
              </span>
            </template>
            <template #option="{ option }">
              <span class="flex items-center gap-3">
                <Icon name="mdi:circle" class="h-4 w-4" :class="getStatusTextClasses(option)" />
                <span class="font-medium">{{ option }}</span>
              </span>
            </template>
          </UiSelect>
          <UiInput v-if="newHistoryStatus === 'interview'" id="add-history-scheduled-at" v-model="newHistoryScheduledAt" type="datetime-local" label="Interview Datum" />
          <UiInput id="add-history-notes" v-model="newHistoryNotes" as="textarea" label="Notizen (optional)" />
          <UiInput id="add-history-date" v-model="newHistoryCreatedAt" type="datetime-local" label="Datum" />
        </form>
      </template>
      <template #footer>
        <UiButton variant="secondary" @click="showAddHistoryModal = false">Abbrechen</UiButton>
        <UiButton @click="addHistory">Speichern</UiButton>
      </template>
    </UiModal>

    <UiModal v-if="editableHistoryEntry" v-model="showEditHistoryModal">
      <template #header><h3 class="text-xl font-semibold">Verlaufseintrag bearbeiten</h3></template>
      <template #body>
        <form class="flex flex-col gap-4" @submit.prevent="updateHistory">
          <UiSelect id="edit-history-status" v-model="editableHistoryEntry.status" :options="availableStatuses" label="Status">
            <template #display="{ option }">
              <span class="flex items-center gap-3">
                <Icon name="mdi:circle" class="h-4 w-4" :class="getStatusTextClasses(option)" />
                <span class="font-medium">{{ option }}</span>
              </span>
            </template>
            <template #option="{ option }">
              <span class="flex items-center gap-3">
                <Icon name="mdi:circle" class="h-4 w-4" :class="getStatusTextClasses(option)" />
                <span class="font-medium">{{ option }}</span>
              </span>
            </template>
          </UiSelect>
          <UiInput v-if="editableHistoryEntry.status === 'interview'" id="edit-history-scheduled-at" v-model="editableHistoryEntry.scheduled_at" type="datetime-local" label="Interview Datum" />
          <UiInput id="edit-history-notes" v-model="editableHistoryEntry.notes" as="textarea" label="Notizen" />
          <UiInput id="edit-history-date" v-model="editableHistoryEntry.createdAt" type="datetime-local" label="Datum" />
        </form>
      </template>
      <template #footer>
        <UiButton variant="secondary" @click="showEditHistoryModal = false">Abbrechen</UiButton>
        <UiButton @click="updateHistory">Speichern</UiButton>
      </template>
    </UiModal>

    <UiModal v-if="deletableHistoryEntry" v-model="showDeleteHistoryModal">
      <template #header><h3 class="text-xl font-semibold">Verlaufseintrag löschen</h3></template>
      <template #body>
        <p>Möchten Sie diesen Verlaufseintrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
        <p class="mt-2 rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800">
          <strong>{{ deletableHistoryEntry.title }}:</strong> {{ deletableHistoryEntry.description }}
        </p>
      </template>
      <template #footer>
        <UiButton variant="secondary" @click="showDeleteHistoryModal = false">Abbrechen</UiButton>
        <UiButton color="danger" @click="deleteHistory">Löschen</UiButton>
      </template>
    </UiModal>

    <UiModal v-model="showContactFormModal">
      <template #header><h3 class="text-xl font-semibold">Neuen Kontakt erstellen</h3></template>
      <template #body>
        <ApplicationContactForm
          :company-id="companyIdForNewContact"
          :name="nameForNewContact"
          @success="handleContactCreated"
          @cancel="handleCancelContactForm"
        />
      </template>
    </UiModal>

    <UiModal v-if="editableApplication?.selectedCompany" v-model="showCompanyAddressModal">
      <template #header><h3 class="text-xl font-semibold">Firmenadresse bearbeiten</h3></template>
      <template #body>
        <CompanyAddressForm
          :company="editableApplication.selectedCompany"
          @success="handleAddressUpdateSuccess"
          @cancel="showCompanyAddressModal = false"
        />
      </template>
    </UiModal>
  </div>
  <div v-else class="container mx-auto max-w-screen-xl py-16">
    <p>Lade Bewerbungsdaten...</p>
  </div>
</template>

<style scoped>
</style>
