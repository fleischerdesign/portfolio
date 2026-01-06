<script setup lang="ts">
import type { ApplicationCreatePayload } from '#shared/schemas/application.schema';
import type { CompanyResponse, Address } from '#shared/schemas/company.schema';
import type { Contact } from '#shared/schemas/contact.schema';

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin
});

const router = useRouter();
const localePath = useLocalePath();
const isLoading = ref(false);

// Refs for Companies and Contacts
const allCompanies = ref<CompanyResponse[]>([]);
const allContacts = ref<Contact[]>([]);

const selectedCompany = ref<CompanyResponse | undefined>(undefined);
const selectedContacts = ref<Contact[]>([]);

// Refs for new company/address fields
const newCompanyName = ref('');
const newCompanyStreet = ref('');
const newCompanyHouseNumber = ref('');
const newCompanyZipcode = ref<number | undefined>(undefined);
const constNewCompanyCity = ref(''); // Renamed to avoid conflict
const showNewCompanyForm = ref(false);

const showContactFormModal = ref(false);
const companyIdForNewContact = ref<number | undefined>(undefined);

onMounted(async () => {
  allCompanies.value = await $fetch<CompanyResponse[]>('/api/companies');
  allContacts.value = await $fetch<Contact[]>('/api/contacts');
});

const form = ref<Omit<ApplicationCreatePayload, 'companyName' | 'companyAddress' | 'contactIds' | 'companyId'> & { companyId?: number, contactIds?: number[] }>({
  title: '',
  subtitle: '',
  slug: '',
  url: '',
  body: '',
  notes: [],
  interviews: [],
  companyId: undefined, // Will be set by selection or new company creation
  contactIds: [],
});

const slugSource = computed(() => {
  const companyPart = showNewCompanyForm.value ? newCompanyName.value : (selectedCompany.value?.name || '');
  return `${companyPart} ${form.value.title}`;
});

const autoSlug = ref(true);
watch(slugSource, (newSource) => {
  if (autoSlug.value) {
    form.value.slug = slugify(newSource);
  }
});

function manualSlugInput() {
  autoSlug.value = false;
}

async function createApplication() {
  isLoading.value = true;
  try {
    const payload: ApplicationCreatePayload = {
      ...form.value,
      contactIds: selectedContacts.value.map(c => c.id),
      companyId: selectedCompany.value?.id,
    };

    if (showNewCompanyForm.value) {
      payload.companyName = newCompanyName.value;
      payload.companyId = undefined; // Ensure new company is created
      if(newCompanyStreet.value && constNewCompanyCity.value && newCompanyZipcode.value)
      {
        payload.companyAddress = {
          street: newCompanyStreet.value,
          houseNumber: newCompanyHouseNumber.value,
          zipcode: newCompanyZipcode.value,
          city: constNewCompanyCity.value,
        };
      }
    } else if (!selectedCompany.value) {
      // Handle error: no company selected or created
      console.error("No company selected or created.");
      isLoading.value = false;
      return;
    }

    const result = await useRequestFetch()('/api/applications', {
      method: 'POST',
      body: payload,
    });
    
    const newSlug = result?.result?.slug;
    if (newSlug) {
      router.push(localePath(`/application/${newSlug}`));
    } else {
      // TODO: Fallback or error handling
      router.push(localePath('/application'));
    }
  } catch (error) {
    console.error('Failed to create application', error);
    // TODO: Add user-facing error handling
  } finally {
    isLoading.value = false;
  }
}

function handleCreateContactRequest() {
  companyIdForNewContact.value = selectedCompany.value?.id;
  showContactFormModal.value = true;
}

function handleContactCreated(newContact: Contact) {
  allContacts.value.push(newContact);
  selectedContacts.value.push(newContact);
  showContactFormModal.value = false;
}

function handleCancelContactForm() {
  showContactFormModal.value = false;
}
</script>

<template>
  <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
    <div class="mb-12">
      <UiSectionHeader symbol="heroicons:briefcase" :title="$t('applications.new.title')" :subtitle="$t('applications.new.subtitle')" />
    </div>
    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4 lg:items-start">
      <div class="space-y-8 lg:col-span-3">
        <UiCard>
          <UiCardContainer class="flex h-full flex-col gap-4">
            <h3 class="text-2xl font-medium">{{ $t('applications.new.base_info') }}</h3>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UiInput id="title" v-model="form.title" :label="$t('applications.detail.config.title_label')" required />
              <UiInput id="subtitle" v-model="form.subtitle" :label="$t('applications.detail.config.subtitle_label')" />
              <UiInput id="slug" v-model="form.slug" label="URL-Slug" required @input="manualSlugInput" />
              <UiInput id="url" v-model="form.url" :label="$t('applications.detail.config.url_label')" />
            </div>
          </UiCardContainer>
        </UiCard>

        <UiCard>
          <UiCardContainer class="flex h-full flex-col gap-4">
            <h3 class="text-2xl font-medium">{{ $t('applications.detail.config.company') }}</h3>
            <div class="flex items-center gap-2">
              <UiSelect
                id="company-select"
                v-model="selectedCompany"
                :options="allCompanies"
                :label="$t('applications.new.select_existing_company')"
                by="id"
                class="w-full"
                :disabled="showNewCompanyForm"
              >
                <template #display="{ option }">
                  {{ option.name }}
                </template>
                <template #option="{ option }">
                  {{ option.name }}
                </template>
              </UiSelect>
              <UiButton variant="outline" @click="showNewCompanyForm = !showNewCompanyForm">
                {{ showNewCompanyForm ? $t('applications.new.existing_company') : $t('applications.new.new_company') }}
              </UiButton>
            </div>

            <div v-if="showNewCompanyForm" class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UiInput id="new-company-name" v-model="newCompanyName" :label="$t('applications.new.company_name')" required />
              <div />
              <UiInput id="new-company-street" v-model="newCompanyStreet" :label="$t('applications.new.street')" />
              <UiInput id="new-company-housenumber" v-model="newCompanyHouseNumber" :label="$t('applications.new.house_number')" />
              <UiInput id="new-company-zipcode" v-model="newCompanyZipcode" type="number" :label="$t('applications.new.zipcode')" />
              <UiInput id="new-company-city" v-model="constNewCompanyCity" :label="$t('applications.new.city')" />
            </div>
            <p v-else-if="selectedCompany" class="text-neutral-500">
              {{ $t('applications.new.selected_company', { name: selectedCompany.name }) }}
            </p>
            <p v-else class="text-neutral-500">{{ $t('applications.new.please_select_company') }}</p>
          </UiCardContainer>
        </UiCard>

        <UiCard>
          <UiCardContainer class="flex h-full flex-col gap-4">
            <UiSelect
              id="contact-select"
              v-model="selectedContacts"
              :options="allContacts"
              :label="$t('applications.new.select_existing_contacts')"
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
          </UiCardContainer>
        </UiCard>

        <UiCard>
            <UiCardContainer>
                <h3 class="mb-4 text-2xl font-medium">{{ $t('applications.detail.document.title') }}</h3>
                <UiInput
                    id="body"
                    v-model="form.body"
                    as="textarea"
                    :label="$t('applications.new.body_label')"
                    class="min-h-64"
                />
            </UiCardContainer>
        </UiCard>
      </div>

      <div class="sticky top-10 flex flex-col gap-2 lg:col-span-1">
        <div class="rounded-lg bg-white shadow dark:bg-neutral-900">
          <div class="flex w-full flex-col gap-2">
            <UiButton class="w-full" :is-loading="isLoading" @click="createApplication">
              {{ $t('applications.new.save_create') }}
            </UiButton>
            <NuxtLink :to="$localePath('/application')">
              <UiButton class="w-full" variant="secondary">
                {{ $t('applications.detail.actions.cancel') }}
              </UiButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <UiModal v-model="showContactFormModal">
      <template #header><h3 class="text-xl font-semibold">{{ $t('applications.modals.new_contact') }}</h3></template>
      <template #body>
        <ApplicationContactForm
          :company-id="companyIdForNewContact"
          @success="handleContactCreated"
          @cancel="handleCancelContactForm"
        />
      </template>
    </UiModal>
  </div>
</template>
