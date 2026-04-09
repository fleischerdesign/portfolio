<script setup lang="ts">
import type { DocumentPayload } from "~~/shared/schemas/document.schema";

definePageMeta({
  middleware: "authorize",
  ability: isAdmin,
});

const { t } = useI18n();
const {
  data: documents,
  refresh,
  pending,
} = await useFetch<DocumentPayload[]>("/api/documents");

const isUploading = ref(false);
const isUpdating = ref(false);
const showUploadModal = ref(false);
const showEditModal = ref(false);

const uploadForm = ref({
  name: "",
  file: null as File | null,
  isDefault: false,
});

const editForm = ref<DocumentPayload | null>(null);

function startEdit(doc: DocumentPayload) {
  editForm.value = { ...doc };
  showEditModal.value = true;
}

async function updateDocument() {
  if (!editForm.value || !editForm.value.id) return;

  isUpdating.value = true;
  try {
    await $fetch(`/api/documents/${editForm.value.id}`, {
      method: "PATCH",
      body: {
        name: editForm.value.name,
        isDefault: editForm.value.isDefault,
      },
    });
    showEditModal.value = false;
    await refresh();
  } catch (error) {
    console.error("Update failed", error);
  } finally {
    isUpdating.value = false;
  }
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    uploadForm.value.file = file;
    if (!uploadForm.value.name) {
      uploadForm.value.name = file.name.replace(/\.[^/.]+$/, "");
    }
  }
}

async function uploadDocument() {
  if (!uploadForm.value.file || !uploadForm.value.name) return;

  isUploading.value = true;
  const formData = new FormData();
  formData.append("file", uploadForm.value.file);
  formData.append("name", uploadForm.value.name);
  formData.append("isDefault", String(uploadForm.value.isDefault));

  try {
    await $fetch("/api/documents", {
      method: "POST",
      body: formData,
    });
    showUploadModal.value = false;
    uploadForm.value = { name: "", file: null, isDefault: false };
    await refresh();
  } catch (error) {
    console.error("Upload failed", error);
  } finally {
    isUploading.value = false;
  }
}

async function toggleDefault(doc: DocumentPayload) {
  try {
    await $fetch(`/api/documents/${doc.id}`, {
      method: "PATCH",
      body: { isDefault: !doc.isDefault },
    });
    await refresh();
  } catch (error) {
    console.error("Update failed", error);
  }
}

async function deleteDocument(id: number) {
  if (!confirm(t("common.confirm_delete"))) return;

  try {
    await $fetch(`/api/documents/${id}`, {
      method: "DELETE",
    });
    await refresh();
  } catch (error) {
    console.error("Deletion failed", error);
  }
}

async function move(index: number, direction: "up" | "down") {
  if (!documents.value) return;

  const newIndex = direction === "up" ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= documents.value.length) return;

  const docs = [...documents.value];
  const temp = docs[index]!;
  docs[index] = docs[newIndex]!;
  docs[newIndex] = temp;

  try {
    await $fetch("/api/documents/reorder", {
      method: "PATCH",
      body: { documentIds: docs.map((d) => d.id) },
    });
    await refresh();
  } catch (error) {
    console.error("Reorder failed", error);
  }
}

const formatSize = (bytes?: number | null) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
</script>

<template>
  <div
    class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44"
  >
    <div
      class="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center"
    >
      <UiSectionHeader
        symbol="heroicons:document-duplicate"
        title="Dokumenten-Pool"
        subtitle="Verwalte deine zentralen Anhänge wie Zeugnisse und Zertifikate."
      />
      <UiButton variant="secondary" @click="showUploadModal = true">
        <Icon name="heroicons:plus" class="mr-2 h-5 w-5" />
        Dokument hochladen
      </UiButton>
    </div>

    <UiCard class="border-secondary-500/5 shadow-xl shadow-secondary-500/5">
      <UiCardContainer class="p-0">
        <div
          v-if="pending && !documents"
          class="p-12 text-center text-neutral-500"
        >
          <Icon name="svg-spinners:ring-resize" class="mb-4 h-8 w-8" />
          <p>Lade Dokumente...</p>
        </div>

        <div
          v-else-if="documents && documents.length > 0"
          class="overflow-x-auto"
        >
          <table class="w-full text-left">
            <thead>
              <tr
                class="border-b border-neutral-100 bg-neutral-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/50"
              >
                <th class="w-10 px-4 py-4"></th>
                <th class="px-8 py-4">Name</th>
                <th class="px-8 py-4">Typ / Größe</th>
                <th class="px-8 py-4 text-center">Standard</th>
                <th class="px-8 py-4 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800">
              <tr
                v-for="(doc, index) in documents"
                :key="doc.id"
                class="group hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30"
              >
                <td class="px-4 py-5">
                  <div
                    class="flex flex-col items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <button
                      v-if="index > 0"
                      class="text-neutral-300 hover:text-secondary-500"
                      @click="move(index, 'up')"
                    >
                      <Icon name="heroicons:chevron-up" size="14" />
                    </button>
                    <button
                      v-if="index < documents.length - 1"
                      class="text-neutral-300 hover:text-secondary-500"
                      @click="move(index, 'down')"
                    >
                      <Icon name="heroicons:chevron-down" size="14" />
                    </button>
                  </div>
                </td>
                <td class="px-8 py-5">
                  <div class="flex items-center gap-4">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400"
                    >
                      <Icon
                        :name="
                          doc.fileType.includes('pdf')
                            ? 'heroicons:document-text'
                            : 'heroicons:photo'
                        "
                        size="20"
                      />
                    </div>
                    <div>
                      <p class="font-bold text-neutral-900 dark:text-white">
                        {{ doc.name }}
                      </p>
                      <p class="text-xs text-neutral-400">{{ doc.filename }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-5 text-sm text-neutral-500">
                  <span
                    class="rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    {{ doc.fileType.split("/")[1]?.toUpperCase() || "FILE" }}
                  </span>
                  <span class="ml-2">{{ formatSize(doc.fileSize) }}</span>
                </td>
                <td class="px-8 py-5 text-center">
                  <button
                    class="transition-colors"
                    :class="
                      doc.isDefault
                        ? 'text-secondary-500'
                        : 'text-neutral-300 hover:text-neutral-400'
                    "
                    @click="toggleDefault(doc)"
                  >
                    <Icon
                      :name="
                        doc.isDefault
                          ? 'heroicons:check-circle-solid'
                          : 'heroicons:no-symbol'
                      "
                      size="24"
                    />
                  </button>
                </td>
                <td class="px-8 py-5 text-right">
                  <div
                    class="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <UiButton
                      size="sm"
                      variant="ghost"
                      :to="`/media/documents/${doc.filename}`"
                      target="_blank"
                    >
                      <Icon name="heroicons:eye" class="h-4 w-4" />
                    </UiButton>
                    <UiButton size="sm" variant="ghost" @click="startEdit(doc)">
                      <Icon name="heroicons:pencil" class="h-4 w-4" />
                    </UiButton>
                    <UiButton
                      size="sm"
                      variant="ghost"
                      color="danger"
                      @click="deleteDocument(doc.id!)"
                    >
                      <Icon name="heroicons:trash" class="h-4 w-4" />
                    </UiButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="p-20 text-center">
          <div
            class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-50 text-neutral-200 dark:bg-neutral-900"
          >
            <Icon name="heroicons:document-plus" size="40" />
          </div>
          <h3 class="text-xl font-bold text-neutral-900 dark:text-white">
            Keine Dokumente gefunden
          </h3>
          <p class="mt-2 text-neutral-500">
            Lade dein erstes Zertifikat oder Zeugnis hoch.
          </p>
          <UiButton variant="link" class="mt-4" @click="showUploadModal = true"
            >Dokument jetzt hochladen</UiButton
          >
        </div>
      </UiCardContainer>
    </UiCard>

    <!-- Upload Modal -->
    <UiModal v-model="showUploadModal">
      <template #header
        ><h3 class="text-2xl font-black">Neues Dokument hochladen</h3></template
      >
      <template #body>
        <div class="flex flex-col gap-6">
          <UiInput
            id="doc-name"
            v-model="uploadForm.name"
            label="Bezeichnung"
            placeholder="z.B. Master-Zeugnis"
            required
          />

          <div class="space-y-2">
            <label
              class="text-sm font-bold text-neutral-700 dark:text-neutral-300"
              >Datei (PDF)</label
            >
            <div
              class="relative flex min-h-[100px] cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-6 transition-colors hover:border-secondary-500/50 hover:bg-white dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900"
            >
              <input
                type="file"
                class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                accept=".pdf,image/*"
                @change="handleFileUpload"
              />
              <div
                v-if="uploadForm.file"
                class="flex items-center gap-3 text-secondary-600"
              >
                <Icon name="heroicons:check-badge" size="24" />
                <span class="font-bold">{{ uploadForm.file.name }}</span>
              </div>
              <div v-else class="text-center text-neutral-400">
                <Icon name="heroicons:cloud-arrow-up" size="32" class="mb-2" />
                <p class="text-xs font-medium">
                  Klicke zum Auswählen oder Drag & Drop
                </p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <input
              id="is-default"
              v-model="uploadForm.isDefault"
              type="checkbox"
              class="h-5 w-5 rounded border-neutral-300 text-secondary-600 focus:ring-secondary-500"
            />
            <label
              for="is-default"
              class="text-sm font-medium text-neutral-600 dark:text-neutral-400"
            >
              Als Standard-Anhang für alle Bewerbungen verwenden
            </label>
          </div>
        </div>
      </template>
      <template #footer>
        <UiButton variant="ghost" @click="showUploadModal = false"
          >Abbrechen</UiButton
        >
        <UiButton
          :is-loading="isUploading"
          :disabled="!uploadForm.file || !uploadForm.name"
          @click="uploadDocument"
        >
          Hochladen
        </UiButton>
      </template>
    </UiModal>

    <!-- Edit Modal -->
    <UiModal v-if="editForm" v-model="showEditModal">
      <template #header
        ><h3 class="text-2xl font-black">Dokument bearbeiten</h3></template
      >
      <template #body>
        <div class="flex flex-col gap-6">
          <UiInput
            id="edit-doc-name"
            v-model="editForm.name"
            label="Bezeichnung"
            required
          />

          <div class="flex items-center gap-3">
            <input
              id="edit-is-default"
              v-model="editForm.isDefault"
              type="checkbox"
              class="h-5 w-5 rounded border-neutral-300 text-secondary-600 focus:ring-secondary-500"
            />
            <label
              for="edit-is-default"
              class="text-sm font-medium text-neutral-600 dark:text-neutral-400"
            >
              Als Standard-Anhang für alle Bewerbungen verwenden
            </label>
          </div>

          <div
            class="rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <p
              class="mb-1 text-[10px] font-black uppercase tracking-widest text-neutral-400"
            >
              Datei-Info
            </p>
            <p
              class="truncate text-sm font-bold text-neutral-700 dark:text-neutral-300"
            >
              {{ editForm.filename }}
            </p>
            <p class="text-xs text-neutral-400">
              {{ formatSize(editForm.fileSize) }} • {{ editForm.fileType }}
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <UiButton variant="ghost" @click="showEditModal = false"
          >Abbrechen</UiButton
        >
        <UiButton :is-loading="isUpdating" @click="updateDocument">
          Speichern
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
