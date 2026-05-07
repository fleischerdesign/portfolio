import { ref, computed, type Ref } from "vue";
import {
  applicationHistoryBaseSchema,
  type ApplicationHistoryCreatePayload,
} from "#shared/schemas/application.schema";
import { useApplicationUtils } from "./useApplicationUtils";

export interface ApplicationTimelineItem {
  id?: number | string;
  type?: string;
  date: string;
  title: string;
  description: string;
  icon?: string;
  _deleted?: boolean;
  [key: string]: unknown;
}

const statusIconMap: Record<string, string> = {
  draft: "heroicons:pencil-square",
  applied: "heroicons:paper-airplane",
  interview: "heroicons:chat-bubble-left-right",
  offer: "heroicons:gift",
  rejected: "heroicons:x-circle",
  withdrawn: "heroicons:arrow-uturn-left",
};

interface HistoryEntry {
  id?: number;
  status?: string;
  notes?: string | null;
  scheduled_at?: Date | string | null;
  createdAt?: Date | string | null;
  _deleted?: boolean;
  [key: string]: unknown;
}

interface HistorySource {
  histories: HistoryEntry[];
}

export function useHistoryManager(
  source: Ref<HistorySource | null>,
  isEditing: Ref<boolean>,
) {
  const { formatForDateTimeLocal, formatDate, getStatusTextClasses } =
    useApplicationUtils();
  const availableStatuses = applicationHistoryBaseSchema.shape.status.options;

  const showAddHistoryModal = ref(false);
  const newHistoryStatus =
    ref<NonNullable<ApplicationHistoryCreatePayload["status"]>>("draft");
  const newHistoryNotes = ref<string | null>(null);
  const newHistoryScheduledAt = ref<string | null>(null);
  const newHistoryCreatedAt = ref<string>(
    formatForDateTimeLocal(new Date().toISOString()),
  );

  const showEditHistoryModal = ref(false);
  const editableHistoryEntry = ref<HistoryEntry | null>(null);

  const showDeleteHistoryModal = ref(false);
  const deletableHistoryEntry = ref<ApplicationTimelineItem | null>(null);

  function addHistory() {
    if (!newHistoryStatus.value || !source.value?.histories) return;
    const newEntry: HistoryEntry = {
      id: Date.now() * -1,
      status: newHistoryStatus.value,
      notes: newHistoryNotes.value,
      scheduled_at:
        newHistoryStatus.value === "interview" && newHistoryScheduledAt.value
          ? new Date(newHistoryScheduledAt.value)
          : null,
      createdAt: new Date(newHistoryCreatedAt.value),
      _deleted: false,
    };
    source.value.histories.push(newEntry);
    source.value.histories.sort(
      (a, b) =>
        (toTime(b.createdAt) ?? 0) - (toTime(a.createdAt) ?? 0) ||
        (b.id || 0) - (a.id || 0),
    );

    newHistoryNotes.value = null;
    newHistoryScheduledAt.value = null;
    newHistoryCreatedAt.value = formatForDateTimeLocal(
      new Date().toISOString(),
    );
    newHistoryStatus.value = "draft";
    showAddHistoryModal.value = false;
  }

  function startEditHistory(item: ApplicationTimelineItem) {
    if (typeof item.id !== "number") return;
    const entry = source.value?.histories.find((h) => h.id === item.id);
    if (entry) {
      editableHistoryEntry.value = {
        ...entry,
        createdAt: entry.createdAt
          ? (formatForDateTimeLocal(
              isDate(entry.createdAt) ? entry.createdAt.toISOString() : entry.createdAt,
            ) as unknown as Date)
          : (null as unknown as Date),
        scheduled_at: entry.scheduled_at
          ? (formatForDateTimeLocal(
              isDate(entry.scheduled_at) ? entry.scheduled_at.toISOString() : entry.scheduled_at,
            ) as unknown as Date | null)
          : null,
      };
      showEditHistoryModal.value = true;
    }
  }

  function updateHistory(entry?: HistoryEntry) {
    const sourceEntry = entry || editableHistoryEntry.value;
    if (!sourceEntry?.id || !source.value?.histories) return;
    const index = source.value.histories.findIndex(
      (h) => h.id === sourceEntry!.id,
    );
    if (index !== -1) {
      const isInterview = sourceEntry.status === "interview";
      const existing = source.value.histories[index];
      source.value.histories[index] = {
        ...existing,
        ...sourceEntry,
        status: sourceEntry.status!,
        createdAt: new Date(sourceEntry.createdAt!),
        scheduled_at:
          isInterview && sourceEntry.scheduled_at
            ? new Date(sourceEntry.scheduled_at)
            : null,
      };
      source.value.histories.sort(
        (a, b) =>
          (toTime(b.createdAt) ?? 0) - (toTime(a.createdAt) ?? 0) ||
          (b.id || 0) - (a.id || 0),
      );
    }
    showEditHistoryModal.value = false;
    editableHistoryEntry.value = null;
  }

  function startDeleteHistory(item: ApplicationTimelineItem) {
    if (typeof item.id !== "number") return;
    const entry = source.value?.histories.find((h) => h.id === item.id);
    if (entry) {
      deletableHistoryEntry.value = item;
      showDeleteHistoryModal.value = true;
    }
  }

  function deleteHistory() {
    if (
      typeof deletableHistoryEntry.value?.id !== "number" ||
      !source.value?.histories
    )
      return;
    const idToDelete = deletableHistoryEntry.value.id;
    const index = source.value.histories.findIndex((h) => h.id === idToDelete);
    if (index !== -1) {
      if (idToDelete > 0) {
        source.value!.histories[index]!._deleted = true;
      } else {
        source.value!.histories.splice(index, 1);
      }
    }
    showDeleteHistoryModal.value = false;
    deletableHistoryEntry.value = null;
  }

  function undoDeleteHistory(item: ApplicationTimelineItem) {
    if (typeof item.id !== "number" || !source.value?.histories) return;
    const index = source.value.histories.findIndex((h) => h.id === item.id);
    if (index !== -1) {
      source.value!.histories[index]!._deleted = false;
    }
  }

  const timelineItems = computed((): ApplicationTimelineItem[] => {
    if (!source.value) return [];

    const items: ApplicationTimelineItem[] = [];
    const historiesSource = source.value.histories || [];

    const currentHistories = isEditing.value
      ? historiesSource
      : historiesSource.filter((h) => !h._deleted);

    currentHistories.forEach((history) => {
      if (!history.id) return;

      if (history.status === "interview") {
        items.push({
          id: history.id,
          type: "interview",
          date: formatDate(history.scheduled_at!),
          title: "Interview",
          description: (history.notes as string) || "Geplantes Gespräch.",
          icon: "heroicons:calendar-days",
          _deleted: history._deleted,
        });
      } else if (history.createdAt) {
        items.push({
          id: history.id,
          type: "history",
          date: formatDate(history.createdAt),
          title:
            (history.status as string).charAt(0).toUpperCase() + (history.status as string).slice(1),
          description:
            (history.notes as string) || `Status wurde auf '${history.status as string}' geändert.`,
          icon:
            statusIconMap[history.status as string] || "heroicons:question-mark-circle",
          _deleted: history._deleted,
        });
      }
    });

    return items.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
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

function isDate(val: Date | string): val is Date {
  return val instanceof Date;
}

function toTime(val?: Date | string | null): number | null {
  if (!val) return null;
  if (isDate(val)) return val.getTime();
  return new Date(val).getTime();
}
