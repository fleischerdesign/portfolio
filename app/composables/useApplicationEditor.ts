// app/composables/useApplicationEditor.ts
import { ref, computed, toRaw, type Ref } from 'vue';
import { applicationHistoryBaseSchema, type ApplicationUpdatePayload, type ApplicationResponsePayload, type ApplicationHistoryPayload, type ApplicationHistoryUpdatePayload } from '#shared/schemas/application.schema';
import type { CompanyResponse } from '#shared/schemas/company.schema';
import type { Contact } from '#shared/schemas/contact.schema';

interface EditableApplication extends Partial<ApplicationUpdatePayload> {
  id: number;
  histories: (ApplicationHistoryPayload & { _deleted?: boolean })[];
  companyId: number;
  selectedCompany?: CompanyResponse;
  selectedContacts?: Contact[];
}

export function useApplicationEditor(initialApplication: Ref<ApplicationResponsePayload | null>, refreshApplication: () => Promise<void>, slug: Ref<string>) {
  const isLoading = ref(false);
  const isEditing = ref(false);
  const editableApplication = ref<EditableApplication | null>(null);

  const allCompanies = ref<CompanyResponse[]>([]);
  const allContacts = ref<Contact[]>([]);

  // Contact modal state (might be moved to useContactSelector later)
  const showContactFormModal = ref(false);
  const companyIdForNewContact = ref<number | undefined>(undefined);
  const nameForNewContact = ref<string | undefined>(undefined);

  async function startEditing() {
    if (!initialApplication.value) return;

    isLoading.value = true;
    try {
      // Fetch all companies and contacts for selection
      const companiesData = await useRequestFetch()<CompanyResponse[]>('/api/companies');
      allCompanies.value = companiesData || [];

      const contactsData = await useRequestFetch()<Contact[]>('/api/contacts');
      allContacts.value = contactsData || [];

      editableApplication.value = {
        ...JSON.parse(JSON.stringify(toRaw(initialApplication.value))), // Deep copy to detach reactivity
        companyId: initialApplication.value.company.id,
        selectedCompany: allCompanies.value.find(c => c.id === initialApplication.value.company.id),
        selectedContacts: initialApplication.value.contacts,
      };
      isEditing.value = true;
    } catch (error) {
      console.error('Failed to start editing', error);
      // TODO: Handle error feedback to user
    } finally {
      isLoading.value = false;
    }
  }

  function cancelEditing() {
    isEditing.value = false;
    editableApplication.value = null;
    allCompanies.value = [];
    allContacts.value = [];
  }

  async function saveApplication() {
    if (!editableApplication.value || !initialApplication.value) return;
    isLoading.value = true;
    try {
      // Clean up the histories array for submission.
      const cleanHistories = editableApplication.value.histories
        .filter(h => !h._deleted) // Remove items marked for deletion
        .map(h => {
          const { _deleted, ...rest } = h; // always remove the client-side _deleted flag
          if (h.id && h.id < 0) { // New item, remove temporary negative ID
            const { id, ...newRest } = rest;
            return newRest;
          }
          return rest;
        });

      // --- Main Application Payload ---
      const payload: ApplicationUpdatePayload = {
        title: editableApplication.value.title,
        subtitle: editableApplication.value.subtitle,
        slug: editableApplication.value.slug,
        url: editableApplication.value.url,
        body: editableApplication.value.body,
        notes: editableApplication.value.notes,
        companyId: editableApplication.value.selectedCompany?.id,
        contactIds: editableApplication.value.selectedContacts?.map(c => c.id) || [],
        histories: cleanHistories, // Send the full, clean array
      };

      await useRequestFetch()(`/api/applications/${slug.value}`, { method: 'PUT', body: payload });

      await refreshApplication(); // Refresh the main application data
      isEditing.value = false;
      editableApplication.value = null;
      allCompanies.value = [];
      allContacts.value = [];
    } catch (error) {
      console.error('Failed to update application and its history', error);
      // TODO: Handle error feedback to user
    } finally {
      isLoading.value = false;
    }
  }

  // Contact related functions, will be refactored to useContactSelector
  function handleCreateContactRequest(name?: string) {
    companyIdForNewContact.value = editableApplication.value?.selectedCompany?.id;
    nameForNewContact.value = name;
    showContactFormModal.value = true;
  }

  function handleContactCreated(newContact: Contact) {
    const company = allCompanies.value.find(c => c.id === newContact.companyId);
    const enrichedContact = {
      ...newContact,
      company: company || null,
    };
    allContacts.value.push(enrichedContact);
    if (editableApplication.value) {
      editableApplication.value.selectedContacts?.push(enrichedContact);
    }
    showContactFormModal.value = false;
  }

  function handleCancelContactForm() {
    showContactFormModal.value = false;
  }

  // PDF generation logic
  const isPdfOutdated = computed(() => {
    if (!initialApplication.value?.pdfGeneratedAt || !initialApplication.value?.updatedAt) return true;
    return new Date(initialApplication.value.updatedAt) > new Date(initialApplication.value.pdfGeneratedAt);
  });

  async function generatePdf() {
    isLoading.value = true;
    try {
      await useRequestFetch()(`/api/applications/${slug.value}/pdf/generate`, { method: 'POST' });
      await refreshApplication();
    } catch (error) {
      console.error('Failed to generate PDF', error);
    } finally {
      isLoading.value = false;
    }
  }


  return {
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
    // Contact related, will be delegated
    showContactFormModal,
    companyIdForNewContact,
    nameForNewContact,
    handleCreateContactRequest,
    handleContactCreated,
    handleCancelContactForm,
  };
}