import type { ApplicationUpdatePayload, ApplicationResponsePayload, ApplicationHistoryPayload } from '#shared/schemas/application.schema';
import type { CompanyResponse } from '#shared/schemas/company.schema';
import type { ContactResponse } from '#shared/schemas/contact.schema';
import { useEditor } from './useEditor';

interface EditableApplication extends Partial<ApplicationUpdatePayload> {
  id: number;
  histories: (ApplicationHistoryPayload & { _deleted?: boolean })[];
  companyId: number;
  selectedCompany?: CompanyResponse;
  selectedContacts?: ContactResponse[];
}

export function useApplicationEditor(initialApplication: Ref<ApplicationResponsePayload | null | undefined>, refreshApplication: () => Promise<void>, slug: Ref<string>) {
  const { showToast } = useToast();
  
  const allCompanies = ref<CompanyResponse[]>([]);
  const allContacts = ref<ContactResponse[]>([]);

  const showContactFormModal = ref(false);
  const companyIdForNewContact = ref<number | undefined>(undefined);
  const nameForNewContact = ref<string | undefined>(undefined);

  const editor = useEditor<ApplicationResponsePayload, EditableApplication, ApplicationUpdatePayload>({
    initialData: initialApplication,
    refresh: refreshApplication,
    successMessage: 'Bewerbung erfolgreich gespeichert!',
    errorMessage: 'Fehler beim Speichern der Bewerbung.',
    toState: (app) => ({
      ...JSON.parse(JSON.stringify(app)),
      companyId: app.company.id,
      selectedCompany: allCompanies.value.find(c => c.id === app.company.id),
      selectedContacts: app.contacts,
    }),
    toPayload: (editable) => {
      const cleanHistories = editable.histories
        .filter(h => !h._deleted)
        .map(h => {
          const { _deleted, ...rest } = h;
          if (h.id && h.id < 0) {
            const { id, ...newRest } = rest;
            return newRest;
          }
          return rest;
        });

      return {
        title: editable.title,
        subtitle: editable.subtitle,
        slug: editable.slug,
        url: editable.url,
        body: editable.body,
        notes: editable.notes,
        companyId: editable.selectedCompany?.id,
        contactIds: editable.selectedContacts?.map(c => c.id) || [],
        histories: cleanHistories,
      };
    },
    onSave: async (payload) => {
      await useRequestFetch()(`/api/applications/${slug.value}`, { method: 'PUT', body: payload });
    }
  });

  async function startEditing() {
    if (!initialApplication.value) return;
    editor.isLoading.value = true;
    try {
      const companiesData = await useRequestFetch()<{ companies: CompanyResponse[] }>('/api/companies');
      allCompanies.value = companiesData.companies || [];

      const contactsData = await useRequestFetch()<{ contacts: ContactResponse[] }>('/api/contacts');
      allContacts.value = contactsData.contacts || [];

      editor.startEditing();
    } catch (error) {
      console.error('Failed to start editing', error);
      showToast('Fehler beim Laden der Formulardaten.', { type: 'error' });
    } finally {
      editor.isLoading.value = false;
    }
  }

  function cancelEditing() {
    editor.cancelEditing();
    allCompanies.value = [];
    allContacts.value = [];
  }

  function handleCreateContactRequest(name?: string) {
    companyIdForNewContact.value = editor.editableData.value?.selectedCompany?.id;
    nameForNewContact.value = name;
    showContactFormModal.value = true;
  }

  function handleContactCreated(newContact: ContactResponse) {
    allContacts.value.push(newContact);
    if (editor.editableData.value) {
      if (!editor.editableData.value.selectedContacts) editor.editableData.value.selectedContacts = [];
      editor.editableData.value.selectedContacts.push(newContact);
    }
    showContactFormModal.value = false;
  }

  function handleCancelContactForm() {
    showContactFormModal.value = false;
  }

  const isPdfOutdated = computed(() => {
    if (!initialApplication.value?.pdfGeneratedAt || !initialApplication.value?.updatedAt) return true;
    return new Date(initialApplication.value.updatedAt) > new Date(initialApplication.value.pdfGeneratedAt);
  });

  async function generatePdf() {
    editor.isLoading.value = true;
    try {
      await useRequestFetch()(`/api/applications/${slug.value}/pdf/generate`, { method: 'POST' });
      await refreshApplication();
      showToast('PDF erfolgreich generiert.', { type: 'success' });
    } catch (error) {
      console.error('Failed to generate PDF', error);
      showToast('Fehler bei der PDF-Generierung.', { type: 'error' });
    } finally {
      editor.isLoading.value = false;
    }
  }

  return {
    isEditing: editor.isEditing,
    isLoading: editor.isLoading,
    editableApplication: editor.editableData,
    saveApplication: editor.save,
    allCompanies,
    allContacts,
    startEditing,
    cancelEditing,
    isPdfOutdated,
    generatePdf,
    showContactFormModal,
    companyIdForNewContact,
    nameForNewContact,
    handleCreateContactRequest,
    handleContactCreated,
    handleCancelContactForm,
  };
}