<script setup lang="ts">
import type { ApplicationResponsePayload } from "#shared/schemas/application.schema";

const props = defineProps<{
  application: ApplicationResponsePayload;
  isEditing: boolean;
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const notes = computed({
  get: () => props.modelValue ?? "",
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <div class="pt-8">
    <UiCard
      class="border-dashed border-primary-200 bg-primary-50/20 shadow-none dark:border-primary-800 dark:bg-primary-900/20"
    >
      <UiCardContainer class="flex h-full flex-col gap-6 p-8">
        <div class="flex items-center gap-4">
          <div
            class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400"
          >
            <Icon name="heroicons:pencil-square" size="24" />
          </div>
          <div>
            <h3 class="text-xl font-black text-primary-900 dark:text-white">
              {{ $t("applications.detail.notes.title") }}
            </h3>
            <p class="text-xs font-medium text-primary-500">
              {{ $t("applications.detail.notes.subtitle") }}
            </p>
          </div>
        </div>

        <div
          v-if="!isEditing"
          class="prose prose-primary max-w-none dark:prose-invert"
        >
          <ul class="list-disc space-y-3 pl-5">
            <li
              v-for="(note, index) in application.notes"
              :key="index"
              class="text-primary-600 dark:text-primary-400"
            >
              <BaseMarkdown :content="note" unstyled />
            </li>
          </ul>
        </div>
        <div v-else class="space-y-4">
          <p
            class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
          >
            {{ $t("applications.detail.notes.placeholder") }}
          </p>
          <UiInput
            id="notes"
            v-model="notes"
            as="textarea"
            label=""
            class="border-none bg-transparent !p-0 focus:ring-0"
          />
        </div>
      </UiCardContainer>
    </UiCard>
  </div>
</template>
