<script setup lang="ts">
import type { DocumentPayload, ApplicationDocumentPayload } from '~~/shared/schemas/document.schema';

const props = defineProps<{
  applicationId: number;
  slug: string;
  initialDocuments: ApplicationDocumentPayload[];
}>();

const { t } = useI18n();
const { data: allDocuments } = await useFetch<DocumentPayload[]>('/api/documents');

// State for active documents in this application
const activeDocuments = ref<ApplicationDocumentPayload[]>([...props.initialDocuments]);
const isSaving = ref(false);

const availableDocuments = computed(() => {
  if (!allDocuments.value) return [];
  return allDocuments.value.filter(doc => 
    !activeDocuments.value.some(ad => ad.documentId === doc.id)
  );
});

async function addDocument(doc: DocumentPayload) {
  activeDocuments.value.push({
    applicationId: props.applicationId,
    documentId: doc.id!,
    sortOrder: activeDocuments.value.length,
    document: doc
  });
  await save();
}

async function removeDocument(docId: number) {
  activeDocuments.value = activeDocuments.value.filter(ad => ad.documentId !== docId);
  await save();
}

async function move(index: number, direction: 'up' | 'down') {
  const newIndex = direction === 'up' ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= activeDocuments.value.length) return;
  
  const temp = activeDocuments.value[index];
  activeDocuments.value[index] = activeDocuments.value[newIndex];
  activeDocuments.value[newIndex] = temp;
  
  await save();
}

async function save() {
  isSaving.value = true;
  try {
    await $fetch(`/api/applications/${props.slug}/attachments`, {
      method: 'PATCH',
      body: {
        documentIds: activeDocuments.value.map(ad => ad.documentId)
      }
    });
  } catch (error) {
    console.error('Failed to sync attachments', error);
  } finally {
    isSaving.value = false;
  }
}

const isUsingDefaults = computed(() => {
    // If props.initialDocuments was empty, it means the server fell back to defaults
    // If the user hasn't made any manual changes yet (activeDocuments matches initial),
    // and those initial were actually just standard defaults (not stored in DB for this app),
    // then we are in "Default Mode".
    // For simplicity, we can just look at if activeDocuments has items.
    return activeDocuments.value.length === 0;
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400">
          <Icon name="heroicons:paper-clip" size="24" />
        </div>
        <div>
          <h3 class="text-xl font-black text-neutral-900 dark:text-white">Anhänge</h3>
          <p class="text-xs font-medium text-neutral-500">Wähle aus, welche Dokumente an das PDF angehängt werden.</p>
        </div>
      </div>
      <div v-if="isSaving" class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary-500">
        <Icon name="svg-spinners:ring-resize" />
        Speichere...
      </div>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Active Attachments -->
      <div class="space-y-4">
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Aktive Anhänge</p>
        
        <div v-if="activeDocuments.length > 0" class="space-y-2">
           <div v-for="(ad, index) in activeDocuments" :key="ad.documentId" class="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition-colors hover:border-secondary-500/30 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div class="flex flex-col gap-1">
                 <button :disabled="index === 0" class="text-neutral-300 hover:text-secondary-500 disabled:opacity-0" @click="move(index, 'up')">
                    <Icon name="heroicons:chevron-up" />
                 </button>
                 <button :disabled="index === activeDocuments.length - 1" class="text-neutral-300 hover:text-secondary-500 disabled:opacity-0" @click="move(index, 'down')">
                    <Icon name="heroicons:chevron-down" />
                 </button>
              </div>
              
              <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 dark:bg-neutral-800">
                 <Icon :name="ad.document.fileType.includes('pdf') ? 'heroicons:document-text' : 'heroicons:photo'" size="20" />
              </div>
              
              <div class="min-w-0 flex-1">
                 <p class="truncate font-bold text-neutral-900 dark:text-white">{{ ad.document.name }}</p>
                 <p class="text-[10px] font-medium text-neutral-400">{{ index + 1 }}. Dokument im PDF</p>
              </div>

              <div class="flex items-center gap-1">
                <UiButton size="sm" variant="ghost" :to="`/media/documents/${ad.document.filename}`" target="_blank" class="text-neutral-400 hover:text-secondary-500">
                   <Icon name="heroicons:eye" class="h-4 w-4" />
                </UiButton>
                <UiButton size="sm" variant="ghost" class="text-neutral-400 hover:text-danger-500" @click="removeDocument(ad.documentId)">
                   <Icon name="heroicons:x-mark" />
                </UiButton>
              </div>
           </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-100 py-10 text-center dark:border-neutral-800">
           <p class="text-sm font-medium text-neutral-400">Keine spezifischen Anhänge ausgewählt.</p>
           <p class="mt-1 text-xs text-secondary-500/70 font-bold uppercase tracking-widest">Es werden die Standard-Anhänge verwendet.</p>
        </div>
      </div>

      <!-- Pool / Available -->
      <div class="space-y-4">
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Verfügbare Dokumente</p>
        
        <div v-if="availableDocuments.length > 0" class="grid grid-cols-1 gap-2">
           <div v-for="doc in availableDocuments" :key="doc.id" class="flex items-center gap-3 rounded-xl border border-dashed border-neutral-200 p-3 transition-colors hover:border-secondary-500/50 hover:bg-secondary-50/30 dark:border-neutral-800 dark:hover:bg-secondary-900/10">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
                 <Icon name="heroicons:plus" size="16" />
              </div>
              <p class="flex-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ doc.name }}</p>
              <UiButton size="sm" variant="ghost" class="text-[10px] font-black uppercase tracking-widest" @click="addDocument(doc)">
                 Hinzufügen
              </UiButton>
           </div>
        </div>
        <div v-else class="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-6 text-center text-xs text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/20">
           Alle Dokumente aus dem Pool sind bereits aktiv oder der Pool ist leer.
           <NuxtLink to="/studio/documents" class="mt-2 block font-bold text-secondary-500 hover:underline">Zum Dokumenten-Pool</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
