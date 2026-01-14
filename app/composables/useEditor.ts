export interface EditorOptions<TRaw, TState, TPayload> {
  initialData: Ref<TRaw | null | undefined>;
  refresh: () => Promise<void>;
  toState: (data: TRaw) => TState;
  toPayload: (state: TState) => TPayload | Promise<TPayload>;
  onSave: (payload: TPayload) => Promise<any>;
  successMessage?: string;
  errorMessage?: string;
}

export function useEditor<TRaw, TState, TPayload>(options: EditorOptions<TRaw, TState, TPayload>) {
  const { showToast } = useToast();
  const isLoading = ref(false);
  const isEditing = ref(false);
  const editableData = ref<TState | null>(null);

  function startEditing() {
    if (!options.initialData.value) return;
    try {
      editableData.value = options.toState(toRaw(options.initialData.value));
      isEditing.value = true;
    } catch (e) {
      console.error('Failed to parse initial data for editor', e);
      showToast('Error initializing editor', { type: 'error' });
    }
  }

  function cancelEditing() {
    isEditing.value = false;
    editableData.value = null;
  }

  async function save() {
    if (!editableData.value) return;
    isLoading.value = true;

    try {
      const payload = await options.toPayload(editableData.value);
      await options.onSave(payload);
      await options.refresh();
      
      isEditing.value = false;
      showToast(options.successMessage || 'Saved successfully', { type: 'success' });
    } catch (e) {
      console.error(e);
      showToast(options.errorMessage || 'Failed to save', { type: 'error' });
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isEditing,
    isLoading,
    editableData,
    startEditing,
    cancelEditing,
    save
  };
}
