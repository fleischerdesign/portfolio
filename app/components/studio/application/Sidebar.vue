<script setup lang="ts">
defineProps<{
  isEditing: boolean;
  isLoading: boolean;
  isPdfOutdated: boolean;
  printUrl: string;
  hasPdf: boolean;
}>();

const emit = defineEmits<{
  (e: "save" | "cancel" | "edit" | "generate-pdf"): void;
}>();
</script>

<template>
  <div class="sticky top-10 flex flex-col gap-6">
    <UiCard class="border-secondary-500/5 shadow-lg">
      <UiCardContainer class="flex h-full flex-col gap-4">
        <h3 class="text-xl font-bold text-primary-900 dark:text-white">
          {{ $t("applications.detail.preview") }}
        </h3>

        <div
          class="w-full overflow-hidden rounded-xl border border-primary-100 shadow-sm transition-all hover:shadow-md dark:border-primary-800"
          style="aspect-ratio: 1 / 1.4142"
        >
          <iframe
            :src="printUrl"
            class="h-full w-full"
            style="
              transform-origin: top left;
              transform: scale(0.5);
              width: 200%;
              height: 200%;
            "
            title="Application Preview"
          />
        </div>
      </UiCardContainer>
    </UiCard>

    <UiCard shadow="none">
      <UiCardContainer class="flex w-full flex-col gap-3">
        <template v-if="isEditing">
          <UiButton
            class="w-full"
            variant="secondary"
            :is-loading="isLoading"
            @click="emit('save')"
          >
            {{ $t("applications.detail.actions.save") }}
          </UiButton>

          <UiButton class="w-full" variant="ghost" @click="emit('cancel')">
            {{ $t("applications.detail.actions.cancel") }}
          </UiButton>
        </template>

        <template v-else>
          <UiButton class="w-full" variant="secondary" @click="emit('edit')">
            <Icon name="heroicons:pencil-square" class="mr-2" />
            {{ $t("applications.detail.actions.edit") }}
          </UiButton>
        </template>

        <hr class="my-2 border-primary-100 dark:border-primary-800" />

        <UiButton
          variant="glass"
          class="w-full"
          :to="printUrl"
          target="_blank"
        >
          <Icon name="heroicons:printer" class="mr-2" />
          {{ $t("applications.detail.actions.print") }}
        </UiButton>

        <template v-if="hasPdf">
          <UiButton
            variant="glass"
            class="w-full"
            :to="`${printUrl.replace('/print', '')}/pdf/download`"
            external
          >
            <Icon name="heroicons:document-arrow-down" class="mr-2" />
            {{ $t("applications.detail.actions.download_pdf") }}
          </UiButton>

          <UiButton
            v-if="isPdfOutdated"
            variant="ghost"
            size="sm"
            class="w-full text-xs"
            :is-loading="isLoading"
            :disabled="isLoading"
            @click="emit('generate-pdf')"
          >
            {{ $t("applications.detail.actions.update_pdf") }}
          </UiButton>
        </template>

        <template v-else>
          <UiButton
            variant="glass"
            class="w-full"
            :is-loading="isLoading"
            :disabled="isLoading"
            @click="emit('generate-pdf')"
          >
            {{ $t("applications.detail.actions.generate_pdf") }}
          </UiButton>
        </template>
      </UiCardContainer>
    </UiCard>
  </div>
</template>
