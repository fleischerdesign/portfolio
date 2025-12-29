<script setup lang="ts">
import { applicationHistoryBaseSchema, type ApplicationResponsePayload, type ApplicationHistoryPayload, type ApplicationHistoryCreatePayload, type ApplicationHistoryUpdatePayload } from '#shared/schemas/application.schema';
const { formatDate, getStatusChipClasses, getStatusTextClasses } = useApplicationUtils();
const { renderMarkdown } = useMarkdown(); 

const availableStatuses = applicationHistoryBaseSchema.shape.status.options;

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin
});

const route = useRoute()
const { slug } = route.params as { slug: string }

const { data: application, error, refresh } = await useAuthFetch<ApplicationResponsePayload>(`/api/applications/${slug}`);

if (error.value || !application.value) {
  throw createError({ statusCode: 404, statusMessage: 'Application not found', fatal: true })
}

const printUrl = computed(() => `/application/${route.params.slug}/print`)

const formatForDateTimeLocal = (isoString: string | null | undefined): string => {
  if (!isoString) return '';
  const d = new Date(isoString);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const isLoading = ref(false)

const isEditing = ref(false)
const editableApplication = ref<Partial<ApplicationResponsePayload> & { histories: (ApplicationHistoryPayload & { _deleted?: boolean })[] } | null>(null)


const showAddHistoryModal = ref(false);
const newHistoryStatus = ref<ApplicationHistoryCreatePayload['status']>(application.value.currentStatus);
const newHistoryNotes = ref<string | null>(null);
const newHistoryCreatedAt = ref<string>(formatForDateTimeLocal(new Date().toISOString()));
const isAddingHistory = ref(false);

const showEditHistoryModal = ref(false);
const isUpdatingHistory = ref(false);
type EditableHistoryEntry = Partial<ApplicationHistoryPayload> & { createdAt: string };
const editableHistoryEntry = ref<EditableHistoryEntry | null>(null);

const showDeleteHistoryModal = ref(false);
const isDeletingHistory = ref(false);
const deletableHistoryEntry = ref<TimelineItem | null>(null);


function startEditing() {
  editableApplication.value = JSON.parse(JSON.stringify(application.value))
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
  editableApplication.value = null
}

async function updateApplication() {
  if (!editableApplication.value || !application.value) return;
  isLoading.value = true;
  try {
    const originalHistories = application.value.histories;
    const editedHistories = editableApplication.value.histories || [];

    const toDelete = editedHistories.filter(h => h._deleted && h.id! > 0);
    for (const history of toDelete) {
      await useRequestFetch()(`/api/applications/${slug}/histories/${history.id}`, { method: 'DELETE' });
    }

    const toCreate = editedHistories.filter(h => h.id! < 0);
    for (const history of toCreate) {
      const { id, _deleted, ...createData } = history;
      await useRequestFetch()(`/api/applications/${slug}/histories`, {
        method: 'POST',
        body: createData,
      });
    }

    const toUpdate = editedHistories.filter(edited => {
      if (edited.id! < 0 || edited._deleted) return false;
      const original = originalHistories.find(orig => orig.id === edited.id);
      if (!original) return false;
      return (
        original.status !== edited.status ||
        original.notes !== edited.notes ||
        new Date(original.createdAt!).getTime() !== new Date(edited.createdAt!).getTime()
      );
    });
    for (const history of toUpdate) {
      const { id, _deleted, ...updateData } = history;
      await useRequestFetch()(`/api/applications/${slug}/histories/${id}`, {
        method: 'PUT',
        body: updateData as ApplicationHistoryUpdatePayload,
      });
    }
    
    const { id, company, interviews, pdfGeneratedAt, currentStatus, histories, ...updateData } = editableApplication.value;
    await useRequestFetch()(`/api/applications/${slug}`, { method: 'PUT', body: updateData });

    await refresh();
    isEditing.value = false;
    editableApplication.value = null;
  } catch (error) {
    console.error('Failed to update application and its history', error);
  } finally {
    isLoading.value = false;
  }
}

function addHistory() {
  if (!newHistoryStatus.value || !editableApplication.value?.histories) return;
  const newEntry: ApplicationHistoryPayload & { _deleted?: boolean } = {
    id: Date.now() * -1,
    status: newHistoryStatus.value,
    notes: newHistoryNotes.value,
    createdAt: new Date(newHistoryCreatedAt.value).toISOString(),
    _deleted: false,
  };
  editableApplication.value.histories.push(newEntry);
  editableApplication.value.histories.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime() || (b.id || 0) - (a.id || 0));
  
  newHistoryNotes.value = null;
  newHistoryCreatedAt.value = formatForDateTimeLocal(new Date().toISOString());
  showAddHistoryModal.value = false;
  if(application.value) newHistoryStatus.value = application.value.currentStatus;
}

function startEditHistory(item: TimelineItem) {
  const entry = editableApplication.value?.histories.find(h => h.id === item.id);
  if (entry) {
    editableHistoryEntry.value = { ...entry, createdAt: formatForDateTimeLocal(entry.createdAt) };
    showEditHistoryModal.value = true;
  }
}

function updateHistory() {
  if (!editableHistoryEntry.value?.id || !editableApplication.value?.histories) return;
  const index = editableApplication.value.histories.findIndex(h => h.id === editableHistoryEntry.value!.id);
  if (index !== -1) {
    editableApplication.value.histories[index] = { 
      ...editableApplication.value.histories[index],
      ...editableHistoryEntry.value,
      createdAt: new Date(editableHistoryEntry.value.createdAt).toISOString(),
    };
    editableApplication.value.histories.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime() || (b.id || 0) - (a.id || 0));
  }
  showEditHistoryModal.value = false;
  editableHistoryEntry.value = null;
}

function startDeleteHistory(item: TimelineItem) {
  const entry = editableApplication.value?.histories.find(h => h.id === item.id);
  if (entry) {
    deletableHistoryEntry.value = item;
    showDeleteHistoryModal.value = true;
  }
}

function deleteHistory() {
  if (!deletableHistoryEntry.value?.id || !editableApplication.value?.histories) return;
  const idToDelete = deletableHistoryEntry.value.id;
  const index = editableApplication.value.histories.findIndex(h => h.id === idToDelete);
  if (index !== -1) {
    if (idToDelete > 0) {
      editableApplication.value.histories[index]._deleted = true;
    } else {
      editableApplication.value.histories.splice(index, 1);
    }
  }
  showDeleteHistoryModal.value = false;
  deletableHistoryEntry.value = null;
}

function undoDeleteHistory(item: TimelineItem) {
  if (!editableApplication.value?.histories) return;
  const index = editableApplication.value.histories.findIndex(h => h.id === item.id);
  if (index !== -1) {
    editableApplication.value.histories[index]._deleted = false;
  }
}

const isPdfOutdated = computed(() => {
  if (!application.value?.pdfGeneratedAt || !application.value?.updatedAt) return true; 
  return new Date(application.value.updatedAt) > new Date(application.value.pdfGeneratedAt);
});

async function generatePdf() {
  isLoading.value = true
  try {
    await useRequestFetch()(`/api/applications/${slug}/pdf/generate`, { method: 'POST' })
    await refresh() 
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
  ogDescription: () => application.value?.subtitle || `Bewerbung bei ${application.value?.company.name || 'einem Unternehmen'} `,
  ogUrl: route.fullPath,
  ogType: 'website',
  robots: 'noindex, nofollow',
});

interface TimelineItem {
  id: number;
  type: 'history' | 'interview';
  date: string;
  title: string;
  description: string;
  icon: string;
  _deleted?: boolean;
}

const statusIconMap: Record<string, string> = {
  draft: 'heroicons:pencil-square',
  applied: 'heroicons:paper-airplane',
  interview: 'heroicons:chat-bubble-left-right',
  offer: 'heroicons:gift',
  rejected: 'heroicons:x-circle',
  withdrawn: 'heroicons:arrow-uturn-left',
};

const timelineItems = computed((): TimelineItem[] => {
  const source = isEditing.value ? editableApplication.value : application.value;
  if (!source) return [];

  const items: TimelineItem[] = [];
  const histories = (isEditing.value ? source.histories : source.histories?.filter(h => !(h as any)._deleted)) || [];

  histories.forEach(history => {
    if (history.createdAt && history.id) {
      items.push({
        id: history.id,
        type: 'history',
        date: formatDate(history.createdAt),
        title: history.status.charAt(0).toUpperCase() + history.status.slice(1),
        description: history.notes || `Status wurde auf '${history.status}' geändert.`,
        icon: statusIconMap[history.status] || 'heroicons:question-mark-circle',
        _deleted: (history as any)._deleted,
      });
    }
  });

  if (source.interviews) {
    source.interviews.forEach((interview) => {
      if(interview.id) {
        items.push({
          id: interview.id,
          type: 'interview',
          date: formatDate(interview.date),
          title: `Interview`,
          description: interview.notes || 'Geplantes Gespräch.',
          icon: 'heroicons:calendar-days'
        });
      }
    });
  }
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const derivedApplicationDate = computed(() => {
  if (!application.value) return null;
  const sourceHistories = isEditing.value ? editableApplication.value?.histories : application.value.histories;
  const appliedEntry = [...(sourceHistories || [])]
    .filter(h => !(h as any)._deleted)
    .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime())
    .find(h => h.status === 'applied');
  return appliedEntry?.createdAt;
});

const derivedResponseDate = computed(() => {
  if (!application.value) return null;
  const sourceHistories = isEditing.value ? editableApplication.value?.histories : application.value.histories;
  const responseEntry = [...(sourceHistories || [])]
    .filter(h => !(h as any)._deleted)
    .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime())
    .find(h => h.status !== 'draft' && h.status !== 'applied');
  return responseEntry?.createdAt;
});

const notesAsText = computed({
  get: () => editableApplication.value?.notes?.join('\n') ?? '',
  set: (value: string) => {
    if (editableApplication.value) {
      editableApplication.value.notes = value.split('\n').filter(note => note.trim() !== '');
    }
  },
});
</script>

<template>
  <div v-if="application" class="container mx-auto max-w-screen-xl py-16">
    <!-- Header -->
    <div class="mb-12">
      <UiSectionHeader :title="application.title" :subtitle="`Bewerbung an ${application.company.name}`" />
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
                <div v-if="derivedApplicationDate" class="flex items-center justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-300">Beworben:</span>
                  <span class="font-medium">{{ formatDate(derivedApplicationDate) }}</span>
                </div>
                <div v-if="derivedResponseDate" class="flex items-center justify-between">
                  <span class="text-sm text-neutral-600 dark:text-neutral-300">Rückmeldung:</span>
                  <span class="font-medium">{{ formatDate(derivedResponseDate) }}</span>
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
                    v-if="isEditing && item.type === 'history'"
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
                <UiButton class="w-full" :is-loading="isLoading" @click="updateApplication">
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
          <UiInput id="add-history-notes" v-model="newHistoryNotes" as="textarea" label="Notizen (optional)" />
          <UiInput id="add-history-date" v-model="newHistoryCreatedAt" type="datetime-local" label="Datum" />
        </form>
      </template>
      <template #footer>
        <UiButton variant="secondary" @click="showAddHistoryModal = false">Abbrechen</UiButton>
        <UiButton :is-loading="isAddingHistory" @click="addHistory">Speichern</UiButton>
      </template>
    </UiModal>

    <UiModal v-model="showEditHistoryModal" v-if="editableHistoryEntry">
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
          <UiInput id="edit-history-notes" v-model="editableHistoryEntry.notes" as="textarea" label="Notizen" />
          <UiInput id="edit-history-date" v-model="editableHistoryEntry.createdAt" type="datetime-local" label="Datum" />
        </form>
      </template>
      <template #footer>
        <UiButton variant="secondary" @click="showEditHistoryModal = false">Abbrechen</UiButton>
        <UiButton :is-loading="isUpdatingHistory" @click="updateHistory">Speichern</UiButton>
      </template>
    </UiModal>

    <UiModal v-model="showDeleteHistoryModal" v-if="deletableHistoryEntry">
      <template #header><h3 class="text-xl font-semibold">Verlaufseintrag löschen</h3></template>
      <template #body>
        <p>Möchten Sie diesen Verlaufseintrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
        <p class="mt-2 rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800">
          <strong>{{ deletableHistoryEntry.title }}:</strong> {{ deletableHistoryEntry.description }}
        </p>
      </template>
      <template #footer>
        <UiButton variant="secondary" @click="showDeleteHistoryModal = false">Abbrechen</UiButton>
        <UiButton color="danger" :is-loading="isDeletingHistory" @click="deleteHistory">Löschen</UiButton>
      </template>
    </UiModal>

  </div>
  <div v-else class="container mx-auto max-w-screen-xl py-16">
    <p>Lade Bewerbungsdaten...</p>
  </div>
</template>

<style scoped>
</style>
