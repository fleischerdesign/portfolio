<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { contactCreateSchema, type ContactCreate } from '#shared/schemas/contact.schema';
import type { Contact } from '#shared/schemas/contact.schema';
import type { CompanyResponse } from '#shared/schemas/company.schema';

const props = defineProps<{
  companyId?: number;
  name?: string;
}>();

const emit = defineEmits<{
  (e: 'success', contact: Contact): void;
  (e: 'cancel'): void;
}>();

const { data: companiesData } = await useFetch<{ companies: CompanyResponse[] }>('/api/companies');
const companies = computed(() => companiesData.value?.companies || []);

const form = ref<ContactCreate>({
  name: props.name || '',
  salutation: 'neutral',
  position: '',
  email: '',
  phone: '',
  companyId: props.companyId,
});

const selectedCompany = computed({
  get() {
    if (!companies.value || !form.value.companyId) return undefined;
    return companies.value.find(c => c.id === form.value.companyId);
  },
  set(company) {
    form.value.companyId = company?.id;
  }
});

watch(() => props.companyId, (newId) => {
  form.value.companyId = newId;
});

watch(() => props.name, (newName) => {
  form.value.name = newName || '';
});

const isLoading = ref(false);
const error = ref<string | null>(null);

async function createContact() {
  isLoading.value = true;
  error.value = null;

  const validation = contactCreateSchema.safeParse(form.value);
  if (!validation.success) {
    error.value = "Bitte überprüfen Sie die Formularfelder.";
    console.error(validation.error.flatten());
    isLoading.value = false;
    return;
  }

  try {
    const newContact = await $fetch<Contact>('/api/contacts', {
      method: 'POST',
      body: validation.data,
    });
    emit('success', newContact);
  } catch (e: any) {
    error.value = e.data?.message || 'Ein Fehler ist aufgetreten.';
    console.error(e);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="createContact">
    <UiSelect
      v-if="companies"
      id="contact-company"
      v-model="selectedCompany"
      label="Unternehmen"
      :options="companies"
      by="id"
    >
      <template #display="{ option }">
        {{ option.name }}
      </template>
      <template #option="{ option }">
        {{ option.name }}
      </template>
    </UiSelect>
    <UiInput id="contact-name" v-model="form.name" label="Name" required />
    <UiSelect
      id="contact-salutation"
      v-model="form.salutation"
      label="Anrede"
      :options="['male', 'female', 'diverse', 'neutral']"
    >
      <template #display="{ option }">
        <span v-if="option === 'male'">Herr</span>
        <span v-if="option === 'female'">Frau</span>
        <span v-if="option === 'diverse'">Divers</span>
        <span v-if="option === 'neutral'">Keine Angabe</span>
      </template>
      <template #option="{ option }">
        <span v-if="option === 'male'">Herr</span>
        <span v-if="option === 'female'">Frau</span>
        <span v-if="option === 'diverse'">Divers</span>
        <span v-if="option === 'neutral'">Keine Angabe</span>
      </template>
    </UiSelect>
    <UiInput id="contact-position" v-model="form.position" label="Position" />
    <UiInput id="contact-email" v-model="form.email" type="email" label="E-Mail" />
    <UiInput id="contact-phone" v-model="form.phone" label="Telefon" />
    
    <div class="flex justify-end gap-2">
      <UiButton type="button" variant="secondary" @click="emit('cancel')">
        Abbrechen
      </UiButton>
      <UiButton type="submit" :is-loading="isLoading">
        Kontakt erstellen
      </UiButton>
    </div>
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </form>
</template>
