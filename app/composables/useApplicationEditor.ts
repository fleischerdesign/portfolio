import type { ApplicationUpdatePayload, ApplicationResponsePayload, ApplicationHistoryPayload } from '#shared/schemas/application.schema';
import type { CompanyResponse } from '#shared/schemas/company.schema';
import type { ContactResponse } from '#shared/schemas/contact.schema';
import { useEditor } from './useEditor';
import { editorHelpers } from './useLocalizedEditor';

interface EditableHistoryEntry extends Omit<ApplicationHistoryPayload, 'scheduled_at' | 'createdAt'> {
  scheduled_at: string | null;
  createdAt: string | null;
  _deleted?: boolean;
}

interface EditableApplication extends Partial<ApplicationUpdatePayload> {
  id: number;
  histories: EditableHistoryEntry[];
  companyId: number;
  selectedCompany?: CompanyResponse;
  selectedContacts?: ContactResponse[];
}

/**
 * @composable useApplicationEditor
 * @description Composable for managing application editing in the studio.
 */
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
      companyId: app.company?.id || 0,
      selectedCompany: allCompanies.value.find(c => c.id === app.company?.id),
      selectedContacts: app.contacts,
      // Ensure dates are formatted for input
      histories: (app.histories || []).map(h => ({
        ...h,
        scheduled_at: editorHelpers.formatDate(h.scheduled_at),
        createdAt: editorHelpers.formatDate(h.createdAt)
      } as EditableHistoryEntry))
    }),
    toPayload: (editable) => {
      const cleanHistories = editable.histories
        .filter(h => !h._deleted)
        .map(h => {
          const { _deleted, ...rest } = h;
          // Format dates back for payload
          const formatted = {
            ...rest,
            scheduled_at: rest.scheduled_at ? new Date(rest.scheduled_at) : null,
            createdAt: rest.createdAt ? new Date(rest.createdAt) : undefined
          };
          if (h.id && h.id < 0) {
            const { id, ...newRest } = formatted;
            return newRest;
          }
          return formatted;
        });

      return {
        title: editable.title || '',
        subtitle: editable.subtitle,
        slug: editable.slug || '',
        url: editable.url,
        body: editable.body,
        notes: editable.notes,
        companyId: editable.selectedCompany?.id,
        contactIds: editable.selectedContacts?.map(c => c.id) || [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        histories: cleanHistories as any, // Drizzle type for JSON arrays can be complex
      };
    },
    onSave: async (payload) => {
      await useRequestFetch()(`/api/applications/${slug.value}`, { method: 'PUT', body: payload as Record<string, unknown> });
    }
  });

  async function startEditing() {
    if (!initialApplication.value) return;
    editor.isLoading.value = true;
    try {
      const [companiesData, contactsData] = await Promise.all([
        useRequestFetch()<{ companies: CompanyResponse[] }>('/api/companies'),
        useRequestFetch()<{ contacts: ContactResponse[] }>('/api/contacts')
      ]);
      allCompanies.value = companiesResToResponse(companiesData);
      allContacts.value = contactsResToResponse(contactsData);
      editor.startEditing();
    } catch (error) {
      console.error('Failed to start editing', error);
      showToast('Fehler beim Laden der Formulardaten.', { type: 'error' });
    } finally {
      editor.isLoading.value = false;
    }
  }

  // Helper to ensure type safety for fetch results
  function companiesResToResponse(data: unknown): CompanyResponse[] {
    return (data as { companies: CompanyResponse[] }).companies || [];
  }
  function contactsResToResponse(data: unknown): ContactResponse[] {
    return (data as { contacts: ContactResponse[] }).contacts || [];
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
    handleCancelContactForm: () => (showContactFormModal.value = false),
  };
}
