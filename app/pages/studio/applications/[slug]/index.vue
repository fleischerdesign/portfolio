<script setup lang="ts">
import type { ApplicationResponsePayload } from '#shared/schemas/application.schema';
import type { CompanyResponse } from '#shared/schemas/company.schema';


const { getStatusChipClasses, getStatusTextClasses, getFormattedLastActivityDate, getDisplayDate } = useApplicationUtils();
const { render } = useMarkdown(); 
const { getSalutation } = useSalutation();
const { t } = useI18n();

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin
});

const route = useRoute();
const { slug } = route.params as { slug: string };

const { data: fetchedApplication, error, refresh } = await useFetch<ApplicationResponsePayload>(`/api/applications/${slug}`);

if (error.value || !fetchedApplication.value) {
  throw createError({ statusCode: 404, statusMessage: 'Application not found', fatal: true });
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
} = useApplicationEditor(application, refresh, toRef(route.params as { slug: string }, 'slug'));

const salutation = computed(() => {
  const contacts = isEditing.value ? editableApplication.value?.selectedContacts : application.value?.contacts;
  return getSalutation(contacts, { format: 'lastname', multiple: 'individual' });
});

const displayDate = computed(() => {
  const app = isEditing.value ? editableApplication.value : application.value;
  return getDisplayDate(app);
});

const bodyStats = computed(() => {
  const text = isEditing.value ? editableApplication.value?.body : application.value?.body;
  const words = text?.trim().split(/\s+/).filter(Boolean).length || 0;
  const chars = text?.length || 0;
  return { 
    words,
    chars,
    readingTime: Math.max(1, Math.ceil(words / 200)),
    isLong: chars > 2800 
  };
});

const textareaRef = ref<{ $el: HTMLElement } | null>(null);
const adjustTextareaHeight = () => {
  if (!textareaRef.value) return;
  const el = textareaRef.value?.$el?.querySelector('textarea');
  if (el) {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
};

watch(() => editableApplication.value?.body, () => {
  if (isEditing.value) {
    nextTick(adjustTextareaHeight);
  }
});

watch(isEditing, (val) => {
  if (val) {
    nextTick(adjustTextareaHeight);
  }
});

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

const printUrl = computed(() => `/studio/applications/${route.params.slug}/print`);

const showCompanyAddressModal = ref(false);

async function handleAddressUpdateSuccess(updatedCompany: CompanyResponse) {
  showCompanyAddressModal.value = false;
  if (editableApplication.value) {
    editableApplication.value.selectedCompany = updatedCompany;
  }
}
useSeoMeta({
  title: () => application.value?.title || t('applications.detail.document.title'),
  ogTitle: () => application.value?.title || t('applications.detail.document.title'),
  description: () => application.value?.subtitle || t('applications.detail.document.document_type'),
  ogDescription: () => application.value?.subtitle || t('applications.detail.document.document_type'),
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
  <div v-if="application" class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
    <div class="mb-12">
      <UiSectionHeader symbol="heroicons:briefcase" :title="application.title" :subtitle="$t('applications.detail.document.applied_to', { company: application.company.name })" />
    </div>

    <UiCard v-if="application && !isEditing" class="mb-12 border-secondary-500/10 shadow-xl shadow-secondary-500/5">
        <UiCardContainer class="flex flex-col justify-between gap-6 px-8 py-6 lg:flex-row lg:items-center lg:gap-8">
            <div class="flex w-full items-center gap-5 lg:w-auto">
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl border border-secondary-200/50 bg-secondary-50 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400">
                    <Icon name="heroicons:signal" size="28" />
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">{{ $t('applications.detail.document.current_status') }}</p>
                    <div class="mt-1">
                        <UiChip unstyled size="sm" :class="[getStatusChipClasses(application.currentStatus), getStatusTextClasses(application.currentStatus), 'rounded-lg border px-3 py-0.5 text-xs font-bold shadow-sm']">
                            {{ $t(`applications.status.${application.currentStatus}`) }}
                        </UiChip>
                    </div>
                </div>
            </div>

            <div class="flex w-full items-center gap-5 border-t border-neutral-100 pt-6 lg:min-w-0 lg:flex-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 dark:border-neutral-800">
                <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-secondary-200/50 bg-secondary-50 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400">
                    <Icon name="heroicons:building-office" size="28" />
                </div>
                <div class="min-w-0 flex-1">
                    <p class="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">{{ $t('applications.detail.config.company') }}</p>
                    <p class="mt-0.5 truncate text-xl font-bold text-neutral-900 dark:text-white" :title="application.company.name">{{ application.company.name }}</p>
                    <p v-if="application.company.address" class="truncate text-xs font-medium text-neutral-500 dark:text-neutral-400">{{ application.company.address.city }}</p>
                </div>
            </div>

            <div class="flex w-full items-center gap-5 border-t border-neutral-100 pt-6 lg:w-auto lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 dark:border-neutral-800">
                <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-secondary-200/50 bg-secondary-50 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400">
                    <Icon name="heroicons:clock" size="28" />
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">{{ $t('applications.detail.document.activity') }}</p>
                    <p class="mt-0.5 text-xl font-bold text-neutral-900 dark:text-white">{{ getFormattedLastActivityDate(application) }}</p>
                    <p class="whitespace-nowrap text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        {{ application.currentStatus === 'draft' ? $t('applications.detail.document.created_at') : $t('applications.detail.document.applied_at') }} {{ getDisplayDate(application) }}
                    </p>
                </div>
            </div>

            <div v-if="application.url" class="w-full border-t border-neutral-100 pt-6 lg:ml-auto lg:w-auto lg:border-t-0 lg:pt-0 dark:border-neutral-800">
                <a :href="application.url" target="_blank" rel="noopener noreferrer">
                    <UiButton variant="glass" size="lg" class="group w-full !rounded-2xl border-secondary-200/50 transition-all duration-500 hover:bg-secondary-500 hover:text-white lg:w-auto">
                        <span class="inline lg:hidden xl:inline">{{ $t('applications.detail.document.listing') }}</span>
                        <Icon name="heroicons:arrow-top-right-on-square" class="ml-3 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 lg:ml-0 xl:ml-3" />
                    </UiButton>
                </a>
            </div>
        </UiCardContainer>
    </UiCard>

    <div class="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-4 lg:items-start">
      
      <div class="space-y-12 lg:col-span-3">
        
        <UiCard v-if="isEditing && editableApplication" class="border-secondary-500/10 shadow-xl shadow-secondary-500/5">
            <UiCardContainer class="p-8 md:p-10">
                <div class="mb-10 flex items-center gap-4">
                    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400">
                        <Icon name="heroicons:adjustments-horizontal" size="24" />
                    </div>
                    <div>
                        <h3 class="text-2xl font-black text-neutral-900 dark:text-white">{{ $t('applications.detail.config.title') }}</h3>
                        <p class="text-xs font-medium text-neutral-500">{{ $t('applications.detail.config.subtitle') }}</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                    <div class="space-y-8">
                         <div class="flex items-center gap-2">
                             <div class="h-1 w-4 rounded-full bg-secondary-500"></div>
                             <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">{{ $t('applications.detail.config.general') }}</p>
                         </div>
                         <div class="space-y-6">
                             <UiInput id="edit-title" v-model="editableApplication.title" :label="$t('applications.detail.config.title_label')" required class="dashboard-input" />
                             <UiInput id="edit-subtitle" v-model="editableApplication.subtitle" :label="$t('applications.detail.config.subtitle_label')" class="dashboard-input" />
                             <UiInput id="edit-url" v-model="editableApplication.url" :label="$t('applications.detail.config.url_label')" class="dashboard-input" />
                         </div>
                    </div>
                    
                    <div class="space-y-8 border-neutral-100 md:border-l md:pl-10 dark:border-neutral-800">
                         <div class="flex items-center gap-2">
                             <div class="h-1 w-4 rounded-full bg-secondary-500"></div>
                             <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">{{ $t('applications.detail.config.company') }}</p>
                         </div>
                         <div class="space-y-6">
                             <UiSelect 
                                id="company-select" 
                                v-model="editableApplication.selectedCompany" 
                                :options="allCompanies" 
                                :label="$t('applications.detail.config.select_company')" 
                                by="id" 
                             >
                                <template #display="{ option }">{{ option.name }}</template>
                                <template #option="{ option }">{{ option.name }}</template>
                             </UiSelect>
                             
                             <div v-if="editableApplication.selectedCompany?.address" class="group/addr relative rounded-2xl border border-neutral-100 bg-neutral-50/50 p-5 transition-colors hover:bg-white dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900">
                                 <div class="flex items-start justify-between">
                                     <div class="text-sm">
                                         <p class="font-bold text-neutral-900 dark:text-white">{{ editableApplication.selectedCompany.name }}</p>
                                         <p class="mt-1 text-neutral-500">{{ editableApplication.selectedCompany.address.street }} {{ editableApplication.selectedCompany.address.houseNumber }}</p>
                                         <p class="text-neutral-500">{{ editableApplication.selectedCompany.address.zipcode }} {{ editableApplication.selectedCompany.address.city }}</p>
                                     </div>
                                     <UiButton size="sm" variant="ghost" class="h-8 w-8 rounded-xl !p-1 opacity-0 transition-opacity group-hover/addr:opacity-100" @click="showCompanyAddressModal = true">
                                         <Icon name="mdi:pencil" class="h-4 w-4" />
                                     </UiButton>
                                 </div>
                             </div>
                             <UiButton v-else variant="ghost" size="sm" class="w-full border-dashed border-neutral-200" @click="showCompanyAddressModal = true">
                                 <Icon name="heroicons:map-pin" class="mr-2 h-4 w-4" />
                                 {{ $t('applications.detail.config.address_add') }}
                             </UiButton>
                         </div>
                    </div>
                    
                    <div class="space-y-8 border-neutral-100 lg:border-l lg:pl-10 dark:border-neutral-800">
                         <div class="flex items-center gap-2">
                             <div class="h-1 w-4 rounded-full bg-secondary-500"></div>
                             <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">{{ $t('applications.detail.config.contacts') }}</p>
                         </div>
                         <UiSelect 
                            id="contact-select" 
                            v-model="editableApplication.selectedContacts" 
                            :options="allContacts" 
                            :label="$t('applications.detail.config.link_contacts')" 
                            by="id" 
                            multiple 
                            creatable 
                            @create="handleCreateContactRequest" 
                         >
                            <template #display="{ option }">
                                {{ option.name }}
                                <span v-if="option.companyId" class="ml-1 opacity-50">({{ allCompanies.find(c => c.id === option.companyId)?.name }})</span>
                            </template>
                            <template #option="{ option }">
                                {{ option.name }}
                                <span v-if="option.companyId" class="ml-1 text-xs opacity-50">({{ allCompanies.find(c => c.id === option.companyId)?.name }})</span>
                            </template>
                         </UiSelect>
                    </div>
                </div>
            </UiCardContainer>
        </UiCard>

        <div v-if="!isEditing && application.contacts && application.contacts.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <UiCard v-for="contact in application.contacts" :key="contact.id" class="border-secondary-500/5">
                <UiCardContainer class="!flex-row items-center gap-4">
                    <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400">
                        <Icon name="heroicons:user" size="24" />
                    </div>
                    <div>
                        <p class="font-bold text-neutral-900 dark:text-white">{{ contact.name }}</p>
                        <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ contact.position || 'Ansprechpartner' }}</p>
                        <div class="mt-1 flex gap-3 text-xs text-secondary-600 dark:text-secondary-400">
                            <span v-if="contact.email" class="flex items-center gap-1"><Icon name="heroicons:envelope" /> {{ contact.email }}</span>
                            <span v-if="contact.phone" class="flex items-center gap-1"><Icon name="heroicons:phone" /> {{ contact.phone }}</span>
                        </div>
                    </div>
                </UiCardContainer>
            </UiCard>
        </div>

        <div v-if="(!isEditing && application.body) || (isEditing && editableApplication)" class="group relative">
            <div class="pointer-events-none absolute -left-20 -top-20 -z-10 h-80 w-80 rounded-full bg-secondary-500/10 opacity-40 blur-[100px] dark:bg-secondary-500/5"></div>
            
            <UiCard class="relative overflow-hidden bg-white/90 shadow-2xl dark:bg-neutral-900/80">
                <UiCardContainer class="p-8 md:p-16 lg:p-24">
                    <div class="mb-16 flex items-start gap-5 border-b border-neutral-100 pb-10 dark:border-neutral-800">
                        <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400">
                            <Icon name="heroicons:document-text" size="24" />
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <h3 class="text-3xl font-black text-neutral-900 dark:text-white">{{ $t('applications.detail.document.title') }}</h3>
                                <div class="hidden text-right sm:block">
                                     <p class="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-white">{{ displayDate }}</p>
                                     <p class="text-[10px] uppercase tracking-widest text-neutral-400">{{ $t('applications.detail.document.date_label') }}</p>
                                </div>
                            </div>
                            <p class="mt-1 text-lg font-medium text-neutral-500 dark:text-neutral-400">{{ $t('applications.detail.document.subtitle') }}</p>
                        </div>
                    </div>

                    <div class="mb-12">
                        <p class="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">{{ $t('applications.detail.document.recipient_label') }}</p>
                        <p class="text-xl font-bold text-neutral-900 dark:text-white">
                            {{ isEditing ? editableApplication?.selectedCompany?.name : application.company.name }}
                        </p>
                        <div v-if="(isEditing ? editableApplication?.selectedCompany?.address : application.company.address)" class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            <template v-if="isEditing && editableApplication?.selectedCompany?.address">
                                <p>{{ editableApplication.selectedCompany.address.street }} {{ editableApplication.selectedCompany.address.houseNumber }}</p>
                                <p>{{ editableApplication.selectedCompany.address.zipcode }} {{ editableApplication.selectedCompany.address.city }}</p>
                            </template>
                            <template v-else-if="application.company.address">
                                <p>{{ application.company.address.street }} {{ application.company.address.houseNumber }}</p>
                                <p>{{ application.company.address.zipcode }} {{ application.company.address.city }}</p>
                            </template>
                        </div>
                    </div>

                    <div class="mb-12">
                        <h3 class="text-3xl font-black text-neutral-900 dark:text-white">
                            {{ isEditing ? editableApplication?.title : application.title }}
                        </h3>
                        <p v-if="(isEditing ? editableApplication?.subtitle : application.subtitle)" class="mt-2 text-xl font-medium text-neutral-500 dark:text-neutral-400">
                            {{ isEditing ? editableApplication?.subtitle : application.subtitle }}
                        </p>
                    </div>
                    
                    <p class="mb-8 text-lg font-bold text-neutral-900 dark:text-white">
                        {{ salutation }},
                    </p>

                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div v-if="!isEditing" class="prose prose-lg prose-neutral max-w-none dark:prose-invert" v-html="render(application.body || '')"></div>
                    <div v-else-if="editableApplication" class="space-y-8">
                        <div class="flex items-center justify-between rounded-2xl border border-secondary-100/50 bg-secondary-50/50 p-3 px-6 dark:border-secondary-500/10 dark:bg-secondary-900/10">
                            <div class="flex items-center gap-8">
                                <div class="flex flex-col">
                                    <span class="text-[9px] font-black uppercase tracking-widest text-secondary-500/60">{{ $t('applications.detail.editor.words') }}</span>
                                    <span class="text-lg font-black text-secondary-600">{{ bodyStats.words }}</span>
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-[9px] font-black uppercase tracking-widest text-neutral-400">{{ $t('applications.detail.editor.chars') }}</span>
                                    <span class="text-lg font-bold text-neutral-600 dark:text-neutral-300" :class="{ 'text-amber-500': bodyStats.isLong }">{{ bodyStats.chars }}</span>
                                </div>
                                <div class="mx-2 hidden h-8 w-px bg-neutral-200 sm:flex dark:bg-neutral-700"></div>
                                <div class="hidden flex-col sm:flex">
                                    <span class="text-[9px] font-black uppercase tracking-widest text-neutral-400">{{ $t('applications.detail.editor.reading_time') }}</span>
                                    <span class="text-sm font-bold text-neutral-600 dark:text-neutral-300">~ {{ bodyStats.readingTime }} Min.</span>
                                </div>
                            </div>
                            
                            <div class="flex gap-2">
                                <div v-if="bodyStats.isLong" class="hidden items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-amber-500 lg:flex dark:border-amber-800 dark:bg-amber-900/20">
                                    <Icon name="heroicons:exclamation-triangle" size="14" />
                                    {{ $t('applications.detail.editor.over_page_limit') }}
                                </div>
                                <div class="hidden items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400 lg:flex">
                                    <Icon name="mdi:markdown" size="18" />
                                    Markdown
                                </div>
                            </div>
                        </div>

                        <div class="group/editor relative">
                            <UiInput
                                id="body"
                                ref="textareaRef"
                                v-model="editableApplication.body"
                                as="textarea"
                                label=""
                                :placeholder="$t('applications.detail.editor.placeholder')"
                                class="min-h-[600px] resize-none overflow-hidden border-none !bg-transparent !p-0 text-lg leading-relaxed selection:bg-secondary-100 focus:ring-0 dark:selection:bg-secondary-900/50"
                                @input="adjustTextareaHeight"
                            />
                        </div>
                    </div>

                    <div class="mt-20 border-t border-neutral-50 pt-10 dark:border-neutral-800/50">
                        <p class="text-lg font-medium text-neutral-900 dark:text-white">{{ $t('applications.detail.document.closing') }}</p>
                        <div class="mt-8">
                            <p class="text-xl font-black text-neutral-900 dark:text-white">Philipp Fleischer</p>
                            <NuxtImg src="/img/signature.png" alt="Unterschrift" height="70" class="mt-4 opacity-90 transition-opacity hover:opacity-100 dark:invert" />
                        </div>
                    </div>
                </UiCardContainer>
            </UiCard>
        </div>

        <div v-if="(!isEditing && application.notes && application.notes.length > 0) || (isEditing && editableApplication)" class="pt-8">
            <UiCard class="border-dashed border-neutral-200 bg-neutral-50/20 shadow-none dark:border-neutral-800 dark:bg-neutral-900/20">
                <UiCardContainer class="flex h-full flex-col gap-6 p-8">
                    <div class="flex items-center gap-4">
                        <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400">
                            <Icon name="heroicons:pencil-square" size="24" />
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-neutral-900 dark:text-white">{{ $t('applications.detail.notes.title') }}</h3>
                            <p class="text-xs font-medium text-neutral-500">{{ $t('applications.detail.notes.subtitle') }}</p>
                        </div>
                    </div>
                    
                    <div v-if="!isEditing" class="prose prose-neutral max-w-none dark:prose-invert" >
                        <ul class="list-disc space-y-3 pl-5">
                            <!-- eslint-disable-next-line vue/no-v-html -->
                            <li v-for="(note, index) in application.notes" :key="index" class="text-neutral-600 dark:text-neutral-400" v-html="render(note)"></li>
                        </ul>
                    </div>
                    <div v-else class="space-y-4">
                        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">{{ $t('applications.detail.notes.placeholder') }}</p>
                        <UiInput 
                            id="notes"
                            v-model="notesAsText"
                            as="textarea"
                            label=""
                            class="border-none bg-transparent !p-0 focus:ring-0"
                        />
                    </div>
                </UiCardContainer>
            </UiCard>
        </div>

        <UiCard class="border-secondary-500/5 shadow-xl shadow-secondary-500/5">
            <UiCardContainer class="p-8 md:p-10">
                <StudioApplicationAttachments 
                    v-if="application" 
                    :application-id="application.id!" 
                    :slug="slug" 
                    :initial-documents="application.documents" 
                />
            </UiCardContainer>
        </UiCard>

        <UiCard class="border-secondary-500/5 shadow-xl shadow-secondary-500/5">
            <UiCardContainer class="p-8 md:p-10">
                <div class="mb-10 flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400">
                            <Icon name="heroicons:clock" size="24" />
                        </div>
                        <div>
                            <h3 class="text-2xl font-black text-neutral-900 dark:text-white">{{ $t('applications.detail.history.title') }}</h3>
                            <p class="text-xs font-medium text-neutral-500">{{ $t('applications.detail.history.subtitle') }}</p>
                        </div>
                    </div>
                    <UiButton v-if="isEditing" size="sm" variant="secondary" @click="showAddHistoryModal = true">
                        <Icon name="heroicons:plus" class="mr-2 h-5 w-5" />
                        {{ $t('applications.detail.history.add_entry') }}
                    </UiButton>
                </div>

                <BaseTimeline v-if="timelineItems.length" :items="timelineItems">
                    <template #default="{ item, index }">
                      <div :class="{ 'md:text-right': index % 2 === 0 }">
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-500">{{ item.date }}</span>
                        <h3
                          class="mt-1 text-xl font-bold text-neutral-900 dark:text-white"
                          :class="{ 'md:justify-end': index % 2 === 0 }"
                        >
                          {{ item.title }}
                        </h3>
                        <p class="mt-2 text-neutral-600 dark:text-neutral-400">{{ item.description }}</p>
                      </div>
                      <div
                        v-if="isEditing"
                        class="mt-4 flex gap-2"
                        :class="index % 2 === 0 ? 'md:justify-end' : 'justify-start'"
                      >
                        <UiButton v-if="!item._deleted" size="sm" variant="ghost" class="!px-3 !py-1 text-[10px] font-bold uppercase tracking-widest" @click="startEditHistory(item)">
                          {{ $t('applications.card.edit') }}
                        </UiButton>
                        <UiButton v-if="!item._deleted" size="sm" variant="ghost" color="danger" class="!px-3 !py-1 text-[10px] font-bold uppercase tracking-widest" @click="startDeleteHistory(item)">
                          {{ $t('applications.card.delete') }}
                        </UiButton>
                        <UiButton v-else size="sm" variant="ghost" class="!px-3 !py-1 text-[10px] font-bold uppercase tracking-widest" @click="undoDeleteHistory(item)">
                          {{ $t('applications.detail.actions.undo') }}
                        </UiButton>
                      </div>
                    </template>
                </BaseTimeline>
                
                <div v-else class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-100 py-12 text-center text-neutral-500 dark:border-neutral-800">
                    <Icon name="heroicons:clock" class="mb-4 h-12 w-12 opacity-20" />
                    <p class="text-sm font-medium">{{ $t('applications.detail.history.empty_state') }}</p>
                    <UiButton v-if="isEditing" variant="link" class="mt-2" @click="showAddHistoryModal = true">
                        {{ $t('applications.detail.history.create_first') }}
                    </UiButton>
                </div>
            </UiCardContainer>
        </UiCard>
      </div>

              <div class="sticky top-10 flex flex-col gap-6 lg:col-span-1">

                <UiCard class="border-secondary-500/5 shadow-lg">

                    <UiCardContainer class="flex h-full flex-col gap-4">

                        <h3 class="text-xl font-bold text-neutral-900 dark:text-white">Vorschau</h3>

                        <div

                            class="w-full overflow-hidden rounded-xl border border-neutral-100 shadow-sm transition-all hover:shadow-md dark:border-neutral-800"

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
        
                                <UiCard shadow="none">
        
                                  <UiCardContainer class="flex w-full flex-col gap-3">

                      <template v-if="isEditing">

                        <UiButton class="w-full" variant="secondary" :is-loading="isLoading" @click="saveApplication">

                          {{ $t('applications.detail.actions.save') }}

                        </UiButton>

                        <UiButton class="w-full" variant="ghost" @click="cancelEditing">

                          {{ $t('applications.detail.actions.cancel') }}

                        </UiButton>

                      </template>

                      <template v-else>

                        <UiButton class="w-full" variant="secondary" @click="startEditing">

                          <Icon name="heroicons:pencil-square" class="mr-2" />

                          {{ $t('applications.detail.actions.edit') }}

                        </UiButton>

                      </template>

                      <hr class="my-2 border-neutral-100 dark:border-neutral-800">

                      <UiButton variant="glass" class="w-full" :to="printUrl" target="_blank">

                          <Icon name="heroicons:printer" class="mr-2" />

                          {{ $t('applications.detail.actions.print') }}

                      </UiButton>

                      <template v-if="application.pdfGeneratedAt">

                          <UiButton variant="glass" class="w-full" :to="`/api/applications/${slug}/pdf/download`" external>

                              <Icon name="heroicons:document-arrow-down" class="mr-2" />

                              {{ $t('applications.detail.actions.download_pdf') }}

                          </UiButton>

                          <UiButton v-if="isPdfOutdated" variant="ghost" size="sm" class="w-full text-xs" :is-loading="isLoading" :disabled="isLoading" @click="generatePdf">

                              {{ $t('applications.detail.actions.update_pdf') }}

                          </UiButton>

                      </template>

                      <template v-else>

                          <UiButton variant="glass" class="w-full" :is-loading="isLoading" :disabled="isLoading" @click="generatePdf">

                              {{ $t('applications.detail.actions.generate_pdf') }}

                          </UiButton>

                      </template>

                  </UiCardContainer>

                </UiCard>

              </div>
    </div>

    <!-- Modals -->
    <UiModal v-model="showAddHistoryModal">
      <template #header><h3 class="text-2xl font-black">{{ $t('applications.modals.new_history') }}</h3></template>
      <template #body>
        <form class="flex flex-col gap-4" @submit.prevent="addHistory">
          <UiSelect id="add-history-status" v-model="newHistoryStatus" :options="availableStatuses" :label="$t('applications.modals.status')">
            <template #display="{ option }">
              <span class="flex items-center gap-3">
                <Icon name="mdi:circle" class="h-4 w-4" :class="getStatusTextClasses(option)" />
                <span class="font-medium">{{ $t(`applications.status.${option}`) }}</span>
              </span>
            </template>
            <template #option="{ option }">
              <span class="flex items-center gap-3">
                <Icon name="mdi:circle" class="h-4 w-4" :class="getStatusTextClasses(option)" />
                <span class="font-medium">{{ $t(`applications.status.${option}`) }}</span>
              </span>
            </template>
          </UiSelect>
          <UiInput v-if="newHistoryStatus === 'interview'" id="add-history-scheduled-at" v-model="newHistoryScheduledAt" type="datetime-local" :label="$t('applications.modals.interview_date')" />
          <UiInput id="add-history-notes" v-model="newHistoryNotes" as="textarea" :label="`${$t('applications.modals.notes')} (${$t('applications.modals.optional')})`" />
          <UiInput id="add-history-date" v-model="newHistoryCreatedAt" type="datetime-local" :label="$t('applications.modals.date')" />
        </form>
      </template>
      <template #footer>
        <UiButton variant="secondary" @click="showAddHistoryModal = false">{{ $t('applications.detail.actions.cancel') }}</UiButton>
        <UiButton @click="addHistory">{{ $t('applications.detail.actions.save') }}</UiButton>
      </template>
    </UiModal>

    <UiModal v-if="editableHistoryEntry" v-model="showEditHistoryModal">
      <template #header><h3 class="text-2xl font-black">{{ $t('applications.modals.edit_history') }}</h3></template>
      <template #body>
        <form class="flex flex-col gap-4" @submit.prevent="updateHistory">
          <UiSelect id="edit-history-status" v-model="editableHistoryEntry.status" :options="availableStatuses" :label="$t('applications.modals.status')">
            <template #display="{ option }">
              <span class="flex items-center gap-3">
                <Icon name="mdi:circle" class="h-4 w-4" :class="getStatusTextClasses(option)" />
                <span class="font-medium">{{ $t(`applications.status.${option}`) }}</span>
              </span>
            </template>
            <template #option="{ option }">
              <span class="flex items-center gap-3">
                <Icon name="mdi:circle" class="h-4 w-4" :class="getStatusTextClasses(option)" />
                <span class="font-medium">{{ $t(`applications.status.${option}`) }}</span>
              </span>
            </template>
          </UiSelect>
          <UiInput v-if="editableHistoryEntry.status === 'interview'" id="edit-history-scheduled-at" v-model="editableHistoryEntry.scheduled_at" type="datetime-local" :label="$t('applications.modals.interview_date')" />
          <UiInput id="edit-history-notes" v-model="editableHistoryEntry.notes" as="textarea" :label="$t('applications.modals.notes')" />
          <UiInput id="edit-history-date" v-model="editableHistoryEntry.createdAt" type="datetime-local" :label="$t('applications.modals.date')" />
        </form>
      </template>
      <template #footer>
        <UiButton variant="secondary" @click="showEditHistoryModal = false">{{ $t('applications.detail.actions.cancel') }}</UiButton>
        <UiButton @click="updateHistory">{{ $t('applications.detail.actions.save') }}</UiButton>
      </template>
    </UiModal>

    <UiModal v-if="deletableHistoryEntry" v-model="showDeleteHistoryModal">
      <template #header><h3 class="text-2xl font-black">{{ $t('applications.modals.delete_history') }}</h3></template>
      <template #body>
        <p>{{ $t('applications.modals.delete_history_confirm') }}</p>
        <p class="mt-2 rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800">
          <strong>{{ deletableHistoryEntry.title }}:</strong> {{ deletableHistoryEntry.description }}
        </p>
      </template>
      <template #footer>
        <UiButton variant="secondary" @click="showDeleteHistoryModal = false">{{ $t('applications.detail.actions.cancel') }}</UiButton>
        <UiButton color="danger" @click="deleteHistory">{{ $t('applications.card.delete') }}</UiButton>
      </template>
    </UiModal>

    <UiModal v-model="showContactFormModal">
      <template #header><h3 class="text-2xl font-black">{{ $t('applications.modals.new_contact') }}</h3></template>
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
      <template #header><h3 class="text-2xl font-black">{{ $t('applications.modals.company_address') }}</h3></template>
      <template #body>
        <CompanyAddressForm
          :company="editableApplication.selectedCompany"
          @success="handleAddressUpdateSuccess"
          @cancel="showCompanyAddressModal = false"
        />
      </template>
    </UiModal>
  </div>
  <div v-else class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
    <p>{{ $t('applications.detail.loading') }}</p>
  </div>
</template>

<style scoped>
</style>