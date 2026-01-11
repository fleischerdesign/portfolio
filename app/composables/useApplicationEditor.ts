import type { ApplicationUpdatePayload, ApplicationResponsePayload, ApplicationHistoryPayload } from '#shared/schemas/application.schema';
import type { CompanyResponse } from '#shared/schemas/company.schema';
import type { ContactResponse } from '#shared/schemas/contact.schema';

interface EditableApplication extends Partial<ApplicationUpdatePayload> {
  id: number;
  histories: (ApplicationHistoryPayload & { _deleted?: boolean })[];
  companyId: number;
  selectedCompany?: CompanyResponse;
  selectedContacts?: ContactResponse[];
}

export function useApplicationEditor(initialApplication: Ref<ApplicationResponsePayload | null>, refreshApplication: () => Promise<void>, slug: Ref<string>) {
  const isLoading = ref(false);
  const isEditing = ref(false);
  const editableApplication = ref<EditableApplication | null>(null);

  const allCompanies = ref<CompanyResponse[]>([]);
  const allContacts = ref<ContactResponse[]>([]);

  // Contact modal state (might be moved to useContactSelector later)
  const showContactFormModal = ref(false);
  const companyIdForNewContact = ref<number | undefined>(undefined);
  const nameForNewContact = ref<string | undefined>(undefined);

  async function startEditing() {
    if (!initialApplication.value) return;

    isLoading.value = true;
    try {
      // Fetch all companies and contacts for selection
      const companiesData = await useRequestFetch()<{ companies: CompanyResponse[] }>('/api/companies');
      allCompanies.value = companiesData.companies || [];

      const contactsData = await useRequestFetch()<{ contacts: ContactResponse[] }>('/api/contacts');
      allContacts.value = contactsData.contacts || [];

      const initialApp = initialApplication.value;
      if (!initialApp) throw new Error('Initial application data is missing.');

      editableApplication.value = {
        ...JSON.parse(JSON.stringify(toRaw(initialApp))), // Deep copy to detach reactivity
        companyId: initialApp.company.id,
        selectedCompany: allCompanies.value.find(c => c.id === initialApp.company.id),
        selectedContacts: initialApp.contacts,
      };
      isEditing.value = true;
    } catch (error) {
      console.error('Failed to start editing', error);
      showToast('Fehler beim Laden der Formulardaten.', { type: 'error' });
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

  const { showToast } = useToast();

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
      showToast('Bewerbung erfolgreich gespeichert!', { type: 'success' });
    } catch (error) {
      console.error('Failed to update application and its history', error);
      showToast('Fehler beim Speichern der Bewerbung.', { type: 'error' });
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

  function handleContactCreated(newContact: ContactResponse) {
    allContacts.value.push(newContact);
    if (editableApplication.value) {
      editableApplication.value.selectedContacts?.push(newContact);
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
      showToast('PDF erfolgreich generiert.', { type: 'success' });
    } catch (error) {
      console.error('Failed to generate PDF', error);
      showToast('Fehler bei der PDF-Generierung.', { type: 'error' });
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