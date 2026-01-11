import { ref, computed, type Ref } from 'vue';
import { applicationHistoryBaseSchema, type ApplicationHistoryPayload, type ApplicationHistoryCreatePayload } from '#shared/schemas/application.schema';
import { useApplicationUtils } from './useApplicationUtils';

interface TimelineItem {
  id: number;
  type: 'history' | 'interview';
  date: string;
  title: string;
  description: string;
  icon: string;
  _deleted?: boolean;
}

const statusIconMap: Record<string, string> = {
  draft: 'heroicons:pencil-square',
  applied: 'heroicons:paper-airplane',
  interview: 'heroicons:chat-bubble-left-right',
  offer: 'heroicons:gift',
  rejected: 'heroicons:x-circle',
  withdrawn: 'heroicons:arrow-uturn-left',
};

// Define a type for the source object to avoid 'any'
interface HistorySource {
  histories: (ApplicationHistoryPayload & { _deleted?: boolean })[];
}

export function useHistoryManager(source: Ref<HistorySource | null>, isEditing: Ref<boolean>) {
  const { formatForDateTimeLocal, formatDate, getStatusTextClasses } = useApplicationUtils();
  const availableStatuses = applicationHistoryBaseSchema.shape.status.options;

  const showAddHistoryModal = ref(false);
  const newHistoryStatus = ref<ApplicationHistoryCreatePayload['status']>('draft');
  const newHistoryNotes = ref<string | null>(null);
  const newHistoryScheduledAt = ref<string | null>(null);
  const newHistoryCreatedAt = ref<string>(formatForDateTimeLocal(new Date().toISOString()));

  const showEditHistoryModal = ref(false);
  type EditableHistoryEntry = Partial<ApplicationHistoryPayload> & { createdAt: string };
  const editableHistoryEntry = ref<EditableHistoryEntry | null>(null);

  const showDeleteHistoryModal = ref(false);
  const deletableHistoryEntry = ref<TimelineItem | null>(null);
  
  function addHistory() {
    if (!newHistoryStatus.value || !source.value?.histories) return;
    const newEntry: ApplicationHistoryPayload & { _deleted?: boolean } = {
      id: Date.now() * -1,
      status: newHistoryStatus.value,
      notes: newHistoryNotes.value,
      scheduled_at: newHistoryStatus.value === 'interview' && newHistoryScheduledAt.value ? new Date(newHistoryScheduledAt.value).toISOString() : undefined,
      createdAt: new Date(newHistoryCreatedAt.value).toISOString(),
      _deleted: false,
    };
    source.value.histories.push(newEntry);
    source.value.histories.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime() || (b.id || 0) - (a.id || 0));
    
    newHistoryNotes.value = null;
    newHistoryScheduledAt.value = null;
    newHistoryCreatedAt.value = formatForDateTimeLocal(new Date().toISOString());
    newHistoryStatus.value = 'draft';
    showAddHistoryModal.value = false;
  }

  function startEditHistory(item: TimelineItem) {
    const entry = source.value?.histories.find(h => h.id === item.id);
    if (entry) {
      editableHistoryEntry.value = {
        ...entry,
        createdAt: formatForDateTimeLocal(entry.createdAt),
        scheduled_at: entry.scheduled_at ? formatForDateTimeLocal(entry.scheduled_at) : null,
      };
      showEditHistoryModal.value = true;
    }
  }

  function updateHistory() {
    if (!editableHistoryEntry.value?.id || !source.value?.histories) return;
    const index = source.value.histories.findIndex(h => h.id === editableHistoryEntry.value!.id);
    if (index !== -1) {
      const isInterview = editableHistoryEntry.value.status === 'interview';
      const existing = source.value.histories[index];
      source.value.histories[index] = {
        ...existing,
        ...editableHistoryEntry.value,
        status: editableHistoryEntry.value.status!, // Ensure status is present or handle undefined
        createdAt: new Date(editableHistoryEntry.value.createdAt).toISOString(),
        scheduled_at: isInterview && editableHistoryEntry.value.scheduled_at
          ? new Date(editableHistoryEntry.value.scheduled_at).toISOString()
          : undefined,
      };
      source.value.histories.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime() || (b.id || 0) - (a.id || 0));
    }
    showEditHistoryModal.value = false;
    editableHistoryEntry.value = null;
  }

  function startDeleteHistory(item: TimelineItem) {
    const entry = source.value?.histories.find(h => h.id === item.id);
    if (entry) {
      deletableHistoryEntry.value = item;
      showDeleteHistoryModal.value = true;
    }
  }

  function deleteHistory() {
    if (!deletableHistoryEntry.value?.id || !source.value?.histories) return;
    const idToDelete = deletableHistoryEntry.value.id;
    const index = source.value.histories.findIndex(h => h.id === idToDelete);
    if (index !== -1) {
      if (idToDelete > 0) {
        source.value.histories[index]._deleted = true;
      } else {
        source.value.histories.splice(index, 1);
      }
    }
    showDeleteHistoryModal.value = false;
    deletableHistoryEntry.value = null;
  }

  function undoDeleteHistory(item: TimelineItem) {
    if (!source.value?.histories) return;
    const index = source.value.histories.findIndex(h => h.id === item.id);
    if (index !== -1) {
      source.value.histories[index]._deleted = false;
    }
  }

  const timelineItems = computed((): TimelineItem[] => {
    if (!source.value) return [];
    
    const items: TimelineItem[] = [];
    const historiesSource = source.value.histories || [];
    
    // filter out deleted items in view mode
    const currentHistories = isEditing.value 
      ? historiesSource 
      : historiesSource.filter(h => !h._deleted);

    currentHistories.forEach(history => {
      if (!history.id) return;

      if (history.status === 'interview') {
        items.push({
          id: history.id,
          type: 'interview',
          date: formatDate(history.scheduled_at!),
          title: 'Interview',
          description: history.notes || 'Geplantes Gespräch.',
          icon: 'heroicons:calendar-days',
          _deleted: history._deleted,
        });
      } else if (history.createdAt) {
        items.push({
          id: history.id,
          type: 'history',
          date: formatDate(history.createdAt),
          title: history.status.charAt(0).toUpperCase() + history.status.slice(1),
          description: history.notes || `Status wurde auf '${history.status}' geändert.`,
          icon: statusIconMap[history.status] || 'heroicons:question-mark-circle',
          _deleted: history._deleted,
        });
      }
    });

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  return {
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
    getStatusTextClasses,
  };
}