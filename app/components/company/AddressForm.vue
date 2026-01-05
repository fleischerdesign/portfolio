<template>
  <form class="flex flex-col gap-4" @submit.prevent="saveAddress">
    <UiInput id="street" v-model="editableAddress.street" label="Straße" />
    <UiInput id="houseNumber" v-model="editableAddress.houseNumber" label="Hausnummer" />
    <UiInput id="zipcode" v-model="editableAddress.zipcode" type="number" label="PLZ" />
    <UiInput id="city" v-model="editableAddress.city" label="Stadt" />
    <div class="mt-4 flex justify-end gap-2">
      <UiButton type="button" variant="secondary" @click="$emit('cancel')">Abbrechen</UiButton>
      <UiButton type="submit" :is-loading="isLoading">Speichern</UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Address, CompanyResponse } from '#shared/schemas/company.schema';

const props = defineProps({
  company: {
    type: Object as () => CompanyResponse,
    required: true,
  },
});

const emit = defineEmits(['success', 'cancel']);

const { showToast } = useToast();
const isLoading = ref(false);

const editableAddress = ref<Partial<Address>>({
  street: '',
  houseNumber: '',
  zipcode: null,
  city: '',
  ...props.company.address
});

async function saveAddress() {
  isLoading.value = true;
  try {
    const payload = { ...editableAddress.value };
    // Drizzle/zod doesn't like null for number fields, so convert to undefined
    if (payload.zipcode === null) {
      payload.zipcode = undefined;
    }
    
    const updatedCompany = await useRequestFetch()(`/api/companies/${props.company.id}/address`, {
      method: 'PUT',
      body: payload,
    });
    
    showToast('Adresse erfolgreich gespeichert!', { type: 'success' });
    emit('success', updatedCompany);
  } catch (error) {
    console.error('Failed to save address', error);
    showToast('Fehler beim Speichern der Adresse.', { type: 'error' });
  } finally {
    isLoading.value = false;
  }
}
</script>
