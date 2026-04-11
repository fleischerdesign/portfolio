<script setup lang="ts">
interface TimelineItem {
  id: number;
  status: string;
  title: string;
  description: string;
  date: string;
  createdAt: Date;
  scheduled_at?: Date | null;
  notes?: string | null;
  _deleted?: boolean;
}

defineProps<{
  items: TimelineItem[];
  isEditing: boolean;
}>();

const emit = defineEmits<{
  (e: "add"): void;
  (e: "edit", item: TimelineItem): void;
  (e: "delete", item: TimelineItem): void;
  (e: "undo", item: TimelineItem): void;
}>();
</script>

<template>
  <UiCard class="border-secondary-500/5 shadow-xl shadow-secondary-500/5">
    <UiCardContainer class="p-8 md:p-10">
      <div class="mb-10 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400"
          >
            <Icon name="heroicons:clock" size="24" />
          </div>
          <div>
            <h3 class="text-2xl font-black text-neutral-900 dark:text-white">
              {{ $t("applications.detail.history.title") }}
            </h3>
            <p class="text-xs font-medium text-neutral-500">
              {{ $t("applications.detail.history.subtitle") }}
            </p>
          </div>
        </div>
        <UiButton
          v-if="isEditing"
          size="sm"
          variant="secondary"
          @click="emit('add')"
        >
          <Icon name="heroicons:plus" class="mr-2 h-5 w-5" />
          {{ $t("applications.detail.history.add_entry") }}
        </UiButton>
      </div>

      <BaseTimeline v-if="items.length" :items="items">
        <template #default="{ item, index }">
          <div :class="{ 'md:text-right': index % 2 === 0 }">
            <span
              class="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-500"
              >{{ item.date }}</span
            >
            <h3
              class="mt-1 text-xl font-bold text-neutral-900 dark:text-white"
              :class="{ 'md:justify-end': index % 2 === 0 }"
            >
              {{ item.title }}
            </h3>
            <p class="mt-2 text-neutral-600 dark:text-neutral-400">
              {{ item.description }}
            </p>
          </div>
          <div
            v-if="isEditing"
            class="mt-4 flex gap-2"
            :class="index % 2 === 0 ? 'md:justify-end' : 'justify-start'"
          >
            <UiButton
              v-if="!item._deleted"
              size="sm"
              variant="ghost"
              class="!px-3 !py-1 text-[10px] font-bold uppercase tracking-widest"
              @click="emit('edit', item)"
            >
              {{ $t("applications.card.edit") }}
            </UiButton>
            <UiButton
              v-if="!item._deleted"
              size="sm"
              variant="ghost"
              color="danger"
              class="!px-3 !py-1 text-[10px] font-bold uppercase tracking-widest"
              @click="emit('delete', item)"
            >
              {{ $t("applications.card.delete") }}
            </UiButton>
            <UiButton
              v-else
              size="sm"
              variant="ghost"
              class="!px-3 !py-1 text-[10px] font-bold uppercase tracking-widest"
              @click="emit('undo', item)"
            >
              {{ $t("applications.detail.actions.undo") }}
            </UiButton>
          </div>
        </template>
      </BaseTimeline>

      <div
        v-else
        class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-100 py-12 text-center text-neutral-500 dark:border-neutral-800"
      >
        <Icon name="heroicons:clock" class="mb-4 h-12 w-12 opacity-20" />
        <p class="text-sm font-medium">
          {{ $t("applications.detail.history.empty_state") }}
        </p>
        <UiButton
          v-if="isEditing"
          variant="link"
          class="mt-2"
          @click="emit('add')"
        >
          {{ $t("applications.detail.history.create_first") }}
        </UiButton>
      </div>
    </UiCardContainer>
  </UiCard>
</template>
