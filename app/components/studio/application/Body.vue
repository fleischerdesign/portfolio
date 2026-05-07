<script setup lang="ts">
import type { ApplicationResponsePayload } from "#shared/schemas/application.schema";
import type { EditableApplication } from "~/composables/useApplicationEditor";

const props = defineProps<{
  application: ApplicationResponsePayload | EditableApplication;
  isEditing: boolean;
  modelValue?: string;
  salutation: string;
  displayDate: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const body = computed({
  get: () => props.modelValue ?? "",
  set: (val) => emit("update:modelValue", val),
});

type AppView = ApplicationResponsePayload;
type AppEdit = EditableApplication;

const companyName = computed(() => {
  if (props.isEditing) {
    const app = props.application as AppEdit;
    return app.selectedCompany?.name || (props.application as AppView).company.name;
  }
  return (props.application as AppView).company.name;
});

const companyAddress = computed(() => {
  if (props.isEditing) {
    const app = props.application as AppEdit;
    return app.selectedCompany?.address || (props.application as AppView).company.address;
  }
  return (props.application as AppView).company.address;
});

const selectedAddress = computed(() => {
  if (props.isEditing) {
    return (props.application as AppEdit).selectedCompany?.address;
  }
  return null;
});

const defaultAddress = computed(() => {
  return (props.application as AppView).company.address;
});
</script>

<template>
  <div class="group relative">
    <div
      class="pointer-events-none absolute -left-20 -top-20 -z-10 h-80 w-80 rounded-full bg-secondary-500/10 opacity-40 blur-[100px] dark:bg-secondary-500/5"
    ></div>

    <UiCard
      class="relative overflow-hidden bg-white/90 shadow-2xl dark:bg-primary-900/80"
    >
      <UiCardContainer class="p-8 md:p-16 lg:p-24">
        <!-- Document Header (unchanged) -->
        <div
          class="mb-16 flex items-start gap-5 border-b border-primary-100 pb-10 dark:border-primary-800"
        >
          <div
            class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400"
          >
            <Icon name="heroicons:document-text" size="24" />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h3 class="text-3xl font-black text-primary-900 dark:text-white">
                {{ $t("applications.detail.document.title") }}
              </h3>
              <div class="hidden text-right sm:block">
                <p
                  class="text-sm font-black uppercase tracking-widest text-primary-900 dark:text-white"
                >
                  {{ displayDate }}
                </p>
                <p
                  class="text-[10px] uppercase tracking-widest text-primary-400"
                >
                  {{ $t("applications.detail.document.date_label") }}
                </p>
              </div>
            </div>
            <p
              class="mt-1 text-lg font-medium text-primary-500 dark:text-primary-400"
            >
              {{ $t("applications.detail.document.subtitle") }}
            </p>
          </div>
        </div>

        <!-- Recipient -->
        <div class="mb-12">
          <p
            class="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
          >
            {{ $t("applications.detail.document.recipient_label") }}
          </p>
          <p class="text-xl font-bold text-primary-900 dark:text-white">
            {{ companyName }}
          </p>
          <div
            v-if="companyAddress"
            class="mt-1 text-sm text-primary-600 dark:text-primary-400"
          >
            <template v-if="selectedAddress">
              <p>
                {{ selectedAddress.street }}
                {{ selectedAddress.houseNumber }}
              </p>
              <p>
                {{ selectedAddress.zipcode }}
                {{ selectedAddress.city }}
              </p>
            </template>
            <template v-else-if="defaultAddress">
              <p>
                {{ defaultAddress.street }}
                {{ defaultAddress.houseNumber }}
              </p>
              <p>
                {{ defaultAddress.zipcode }}
                {{ defaultAddress.city }}
              </p>
            </template>
          </div>
        </div>

        <!-- Document Title & Subtitle -->
        <div class="mb-12">
          <h3 class="text-3xl font-black text-primary-900 dark:text-white">
            {{ application.title }}
          </h3>
          <p
            v-if="application.subtitle"
            class="mt-2 text-xl font-medium text-primary-500 dark:text-primary-400"
          >
            {{ application.subtitle }}
          </p>
        </div>

        <p class="mb-8 text-lg font-bold text-primary-900 dark:text-white">
          {{ salutation }},
        </p>

        <!-- Markdown / Editor -->
        <BaseMarkdown v-if="!isEditing" :content="application.body || ''" />
        <UiContentEditor
          v-else
          v-model="body"
          :show-preview="false"
          :placeholder="$t('applications.detail.editor.placeholder')"
        />

        <!-- Closing -->
        <div
          class="mt-20 border-t border-primary-50 pt-10 dark:border-primary-800/50"
        >
          <p class="text-lg font-medium text-primary-900 dark:text-white">
            {{ $t("applications.detail.document.closing") }}
          </p>
          <div class="mt-8">
            <p class="text-xl font-black text-primary-900 dark:text-white">
              Philipp Fleischer
            </p>
            <NuxtImg
              src="/img/signature.png"
              alt="Unterschrift"
              height="70"
              class="mt-4 opacity-90 transition-opacity hover:opacity-100 dark:invert"
            />
          </div>
        </div>
      </UiCardContainer>
    </UiCard>
  </div>
</template>
