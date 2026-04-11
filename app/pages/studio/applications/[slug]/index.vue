<script setup lang="ts">
import type { ApplicationResponsePayload } from "#shared/schemas/application.schema";
import type { CompanyResponse } from "#shared/schemas/company.schema";

const { getSalutation } = useSalutation();
const { t } = useI18n();
const { getDisplayDate } = useApplicationUtils();

definePageMeta({
  middleware: "authorize",
  ability: isAdmin,
});

const route = useRoute();
const { slug } = route.params as { slug: string };

const {
  data: fetchedApplication,
  error,
  refresh,
} = await useFetch<ApplicationResponsePayload>(`/api/applications/${slug}`);

if (error.value || !fetchedApplication.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Application not found",
    fatal: true,
  });
}

const application = computed(() => fetchedApplication.value!);

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
} = useApplicationEditor(
  application,
  refresh,
  toRef(route.params as { slug: string }, "slug"),
);

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
} = useHistoryManager(
  computed(() =>
    isEditing.value ? editableApplication.value : application.value,
  ),
  isEditing,
);

const salutation = computed(() => {
  const contacts = isEditing.value
    ? editableApplication.value?.selectedContacts
    : application.value?.contacts;
  return getSalutation(contacts, {
    format: "lastname",
    multiple: "individual",
  });
});

const displayDate = computed(() => {
  const app = isEditing.value ? editableApplication.value : application.value;
  return getDisplayDate(app);
});

const bodyForEditing = computed({
  get: () => editableApplication.value?.body ?? "",
  set: (value: string) => {
    if (editableApplication.value) {
      editableApplication.value.body = value;
    }
  },
});

const notesAsText = computed({
  get: () => editableApplication.value?.notes?.join("\n") ?? "",
  set: (value: string) => {
    if (editableApplication.value) {
      editableApplication.value.notes = value
        .split("\n")
        .filter((note) => note.trim() !== "");
    }
  },
});

const printUrl = computed(
  () => `/studio/applications/${route.params.slug}/print`,
);

const showCompanyAddressModal = ref(false);

async function handleAddressUpdateSuccess(updatedCompany: CompanyResponse) {
  showCompanyAddressModal.value = false;
  if (editableApplication.value) {
    editableApplication.value.selectedCompany = updatedCompany;
  }
}

useSeoMeta({
  title: () =>
    application.value?.title || t("applications.detail.document.title"),
  ogTitle: () =>
    application.value?.title || t("applications.detail.document.title"),
  description: () =>
    application.value?.subtitle ||
    t("applications.detail.document.document_type"),
  ogDescription: () =>
    application.value?.subtitle ||
    t("applications.detail.document.document_type"),
  ogUrl: route.fullPath,
  ogType: "website",
  robots: "noindex, nofollow",
});

onMounted(() => {
  if (route.query.edit === "true") {
    startEditing();
  }
});
</script>

<template>
  <div
    v-if="application"
    class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44"
  >
    <div class="mb-12">
      <UiSectionHeader
        symbol="heroicons:briefcase"
        :title="application.title"
        :subtitle="
          $t('applications.detail.document.applied_to', {
            company: application.company.name,
          })
        "
      />
    </div>

    <!-- Quick Stats -->
    <StudioApplicationQuickStats v-if="!isEditing" :application="application" />

    <div class="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-4 lg:items-start">
      <div class="space-y-12 lg:col-span-3">
        <!-- Configuration (Edit Mode) -->
        <StudioApplicationConfig
          v-if="isEditing && editableApplication"
          v-model="editableApplication"
          :all-companies="allCompanies"
          :all-contacts="allContacts"
          @create-contact="handleCreateContactRequest"
          @edit-address="showCompanyAddressModal = true"
        />

        <!-- Contacts (View Mode) -->
        <StudioApplicationContacts
          v-if="
            !isEditing &&
            application.contacts &&
            application.contacts.length > 0
          "
          :contacts="application.contacts"
        />

        <!-- Document Body -->
        <StudioApplicationBody
          v-model="bodyForEditing"
          :application="isEditing && editableApplication ? (editableApplication as any) : application"
          :is-editing="isEditing"
          :salutation="salutation"
          :display-date="displayDate"
        />

        <!-- Notes -->
        <StudioApplicationNotes
          v-if="
            (!isEditing && application.notes && application.notes.length > 0) ||
            isEditing
          "
          v-model="notesAsText"
          :application="application"
          :is-editing="isEditing"
        />

        <!-- Attachments -->
        <UiCard class="border-secondary-500/5 shadow-xl shadow-secondary-500/5">
          <UiCardContainer class="p-8 md:p-10">
            <StudioApplicationAttachments
              v-if="application"
              :application-id="application.id!"
              :slug="slug"
              :initial-documents="application.documents"
              :is-editing="isEditing"
            />
          </UiCardContainer>
        </UiCard>

        <!-- History -->
        <StudioApplicationHistory
          :items="timelineItems"
          :is-editing="isEditing"
          @add="showAddHistoryModal = true"
          @edit="startEditHistory"
          @delete="startDeleteHistory"
          @undo="undoDeleteHistory"
        />
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <StudioApplicationSidebar
          :is-editing="isEditing"
          :is-loading="isLoading"
          :is-pdf-outdated="isPdfOutdated"
          :print-url="printUrl"
          :has-pdf="!!application.pdfGeneratedAt"
          @save="saveApplication"
          @cancel="cancelEditing"
          @edit="startEditing"
          @generate-pdf="generatePdf"
        />
      </div>
    </div>

    <!-- Modals -->
    <StudioApplicationModals
      v-model:show-add-history="showAddHistoryModal"
      v-model:new-history-status="newHistoryStatus"
      v-model:new-history-notes="newHistoryNotes"
      v-model:new-history-scheduled-at="newHistoryScheduledAt"
      v-model:new-history-created-at="newHistoryCreatedAt"
      :available-statuses="availableStatuses"
      v-model:show-edit-history="showEditHistoryModal"
      :editable-history-entry="editableHistoryEntry"
      v-model:show-delete-history="showDeleteHistoryModal"
      :deletable-history-entry="deletableHistoryEntry"
      v-model:show-contact-form="showContactFormModal"
      :company-id-for-new-contact="companyIdForNewContact"
      :name-for-new-contact="nameForNewContact"
      v-model:show-company-address="showCompanyAddressModal"
      :selected-company="editableApplication?.selectedCompany"
      @add-history="addHistory"
      @update-history="updateHistory"
      @delete-history="deleteHistory"
      @contact-created="handleContactCreated"
      @contact-cancel="handleCancelContactForm"
      @address-success="handleAddressUpdateSuccess"
    />
  </div>
  <div
    v-else
    class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44"
  >
    <p>{{ $t("applications.detail.loading") }}</p>
  </div>
</template>
