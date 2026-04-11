<script setup lang="ts">
import type { CompanyResponse } from "#shared/schemas/company.schema";
import type { ContactResponse } from "#shared/schemas/contact.schema";

interface HistoryEntry {
  status: string;
  notes?: string | null;
  scheduled_at?: Date | null;
  createdAt: Date;
  title?: string;
  description?: string;
}

const props = defineProps<{
  // History Add
  showAddHistory: boolean;
  newHistoryStatus: string;
  newHistoryNotes: string;
  newHistoryScheduledAt: string;
  newHistoryCreatedAt: string;
  availableStatuses: string[];

  // History Edit
  showEditHistory: boolean;
  editableHistoryEntry: HistoryEntry | null;

  // History Delete
  showDeleteHistory: boolean;
  deletableHistoryEntry: HistoryEntry | null;

  // Contact
  showContactForm: boolean;
  companyIdForNewContact?: number | null;
  nameForNewContact?: string;

  // Address
  showCompanyAddress: boolean;
  selectedCompany?: CompanyResponse | null;
}>();

const emit = defineEmits<{
  (e: "update:showAddHistory", val: boolean): void;
  (e: "update:newHistoryStatus", val: string): void;
  (e: "update:newHistoryNotes", val: string): void;
  (e: "update:newHistoryScheduledAt", val: string): void;
  (e: "update:newHistoryCreatedAt", val: string): void;
  (e: "add-history"): void;

  (e: "update:showEditHistory", val: boolean): void;
  (e: "update-history"): void;

  (e: "update:showDeleteHistory", val: boolean): void;
  (e: "delete-history"): void;

  (e: "update:showContactForm", val: boolean): void;
  (e: "contact-created", contact: ContactResponse): void;
  (e: "contact-cancel"): void;

  (e: "update:showCompanyAddress", val: boolean): void;
  (e: "address-success", company: CompanyResponse): void;
}>();

const { getStatusTextClasses } = useApplicationUtils();

// Helper for proxying v-models
const vShowAddHistory = computed({
  get: () => props.showAddHistory,
  set: (val) => emit("update:showAddHistory", val),
});
const vNewHistoryStatus = computed({
  get: () => props.newHistoryStatus,
  set: (val) => emit("update:newHistoryStatus", val),
});
const vNewHistoryNotes = computed({
  get: () => props.newHistoryNotes,
  set: (val) => emit("update:newHistoryNotes", val),
});
const vNewHistoryScheduledAt = computed({
  get: () => props.newHistoryScheduledAt,
  set: (val) => emit("update:newHistoryScheduledAt", val),
});
const vNewHistoryCreatedAt = computed({
  get: () => props.newHistoryCreatedAt,
  set: (val) => emit("update:newHistoryCreatedAt", val),
});

const vShowEditHistory = computed({
  get: () => props.showEditHistory,
  set: (val) => emit("update:showEditHistory", val),
});
const vShowDeleteHistory = computed({
  get: () => props.showDeleteHistory,
  set: (val) => emit("update:showDeleteHistory", val),
});
const vShowContactForm = computed({
  get: () => props.showContactForm,
  set: (val) => emit("update:showContactForm", val),
});
const vShowCompanyAddress = computed({
  get: () => props.showCompanyAddress,
  set: (val) => emit("update:showCompanyAddress", val),
});
</script>

<template>
  <div>
    <!-- Add History Modal -->
    <UiModal v-model="vShowAddHistory">
      <template #header>
        <h3 class="text-2xl font-black">
          {{ $t("applications.modals.new_history") }}
        </h3>
      </template>
      <template #body>
        <form class="flex flex-col gap-4" @submit.prevent="emit('add-history')">
          <UiSelect
            id="add-history-status"
            v-model="vNewHistoryStatus"
            :options="availableStatuses"
            :label="$t('applications.modals.status')"
          >
            <template #display="{ option }">
              <span class="flex items-center gap-3">
                <Icon
                  name="mdi:circle"
                  class="h-4 w-4"
                  :class="getStatusTextClasses(option)"
                />
                <span class="font-medium">{{
                  $t(`applications.status.${option}`)
                }}</span>
              </span>
            </template>
            <template #option="{ option }">
              <span class="flex items-center gap-3">
                <Icon
                  name="mdi:circle"
                  class="h-4 w-4"
                  :class="getStatusTextClasses(option)"
                />
                <span class="font-medium">{{
                  $t(`applications.status.${option}`)
                }}</span>
              </span>
            </template>
          </UiSelect>
          <UiInput
            v-if="vNewHistoryStatus === 'interview'"
            id="add-history-scheduled-at"
            v-model="vNewHistoryScheduledAt"
            type="datetime-local"
            :label="$t('applications.modals.interview_date')"
          />
          <UiInput
            id="add-history-notes"
            v-model="vNewHistoryNotes"
            as="textarea"
            :label="`${$t('applications.modals.notes')} (${$t('applications.modals.optional')})`"
          />
          <UiInput
            id="add-history-date"
            v-model="vNewHistoryCreatedAt"
            type="datetime-local"
            :label="$t('applications.modals.date')"
          />
        </form>
      </template>
      <template #footer>
        <UiButton variant="secondary" @click="vShowAddHistory = false">
          {{ $t("applications.detail.actions.cancel") }}
        </UiButton>
        <UiButton @click="emit('add-history')">
          {{ $t("applications.detail.actions.save") }}
        </UiButton>
      </template>
    </UiModal>

    <!-- Edit History Modal -->
    <UiModal v-if="editableHistoryEntry" v-model="vShowEditHistory">
      <template #header>
        <h3 class="text-2xl font-black">
          {{ $t("applications.modals.edit_history") }}
        </h3>
      </template>
      <template #body>
        <form
          class="flex flex-col gap-4"
          @submit.prevent="emit('update-history')"
        >
          <UiSelect
            id="edit-history-status"
            v-model="editableHistoryEntry.status"
            :options="availableStatuses"
            :label="$t('applications.modals.status')"
          >
            <template #display="{ option }">
              <span class="flex items-center gap-3">
                <Icon
                  name="mdi:circle"
                  class="h-4 w-4"
                  :class="getStatusTextClasses(option)"
                />
                <span class="font-medium">{{
                  $t(`applications.status.${option}`)
                }}</span>
              </span>
            </template>
            <template #option="{ option }">
              <span class="flex items-center gap-3">
                <Icon
                  name="mdi:circle"
                  class="h-4 w-4"
                  :class="getStatusTextClasses(option)"
                />
                <span class="font-medium">{{
                  $t(`applications.status.${option}`)
                }}</span>
              </span>
            </template>
          </UiSelect>
          <UiInput
            v-if="editableHistoryEntry.status === 'interview'"
            id="edit-history-scheduled-at"
            :model-value="
              editableHistoryEntry?.scheduled_at?.toISOString().slice(0, 16)
            "
            type="datetime-local"
            :label="$t('applications.modals.interview_date')"
            @update:model-value="
              (val) =>
                editableHistoryEntry &&
                (editableHistoryEntry.scheduled_at = val ? new Date(val) : null)
            "
          />
          <UiInput
            id="edit-history-notes"
            v-model="editableHistoryEntry.notes"
            as="textarea"
            :label="$t('applications.modals.notes')"
          />
          <UiInput
            id="edit-history-date"
            :model-value="
              editableHistoryEntry?.createdAt?.toISOString().slice(0, 16)
            "
            type="datetime-local"
            :label="$t('applications.modals.date')"
            @update:model-value="
              (val) =>
                editableHistoryEntry &&
                (editableHistoryEntry.createdAt = val
                  ? new Date(val)
                  : new Date())
            "
          />
        </form>
      </template>
      <template #footer>
        <UiButton variant="secondary" @click="vShowEditHistory = false">
          {{ $t("applications.detail.actions.cancel") }}
        </UiButton>
        <UiButton @click="emit('update-history')">
          {{ $t("applications.detail.actions.save") }}
        </UiButton>
      </template>
    </UiModal>

    <!-- Delete History Modal -->
    <UiModal v-if="deletableHistoryEntry" v-model="vShowDeleteHistory">
      <template #header>
        <h3 class="text-2xl font-black">
          {{ $t("applications.modals.delete_history") }}
        </h3>
      </template>
      <template #body>
        <p>{{ $t("applications.modals.delete_history_confirm") }}</p>
        <p class="mt-2 rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800">
          <strong>{{ deletableHistoryEntry.title }}:</strong>
          {{ deletableHistoryEntry.description }}
        </p>
      </template>
      <template #footer>
        <UiButton variant="secondary" @click="vShowDeleteHistory = false">
          {{ $t("applications.detail.actions.cancel") }}
        </UiButton>
        <UiButton color="danger" @click="emit('delete-history')">
          {{ $t("applications.card.delete") }}
        </UiButton>
      </template>
    </UiModal>

    <!-- Contact Form Modal -->
    <UiModal v-model="vShowContactForm">
      <template #header>
        <h3 class="text-2xl font-black">
          {{ $t("applications.modals.new_contact") }}
        </h3>
      </template>
      <template #body>
        <ApplicationContactForm
          :company-id="companyIdForNewContact"
          :name="nameForNewContact"
          @success="(c) => emit('contact-created', c)"
          @cancel="emit('contact-cancel')"
        />
      </template>
    </UiModal>

    <!-- Company Address Modal -->
    <UiModal v-if="selectedCompany" v-model="vShowCompanyAddress">
      <template #header>
        <h3 class="text-2xl font-black">
          {{ $t("applications.modals.company_address") }}
        </h3>
      </template>
      <template #body>
        <CompanyAddressForm
          :company="selectedCompany"
          @success="(c) => emit('address-success', c)"
          @cancel="vShowCompanyAddress = false"
        />
      </template>
    </UiModal>
  </div>
</template>
