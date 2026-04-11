<script setup lang="ts">
const props = defineProps<{
  application: any; // Can be ApplicationResponsePayload or EditableApplication
  isEditing: boolean;
  modelValue?: string; // body for editing
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
</script>

<template>
  <div class="group relative">
    <div
      class="pointer-events-none absolute -left-20 -top-20 -z-10 h-80 w-80 rounded-full bg-secondary-500/10 opacity-40 blur-[100px] dark:bg-secondary-500/5"
    ></div>

    <UiCard
      class="relative overflow-hidden bg-white/90 shadow-2xl dark:bg-neutral-900/80"
    >
      <UiCardContainer class="p-8 md:p-16 lg:p-24">
        <!-- Document Header (unchanged) -->
        <div
          class="mb-16 flex items-start gap-5 border-b border-neutral-100 pb-10 dark:border-neutral-800"
        >
          <div
            class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400"
          >
            <Icon name="heroicons:document-text" size="24" />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h3 class="text-3xl font-black text-neutral-900 dark:text-white">
                {{ $t("applications.detail.document.title") }}
              </h3>
              <div class="hidden text-right sm:block">
                <p
                  class="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-white"
                >
                  {{ displayDate }}
                </p>
                <p
                  class="text-[10px] uppercase tracking-widest text-neutral-400"
                >
                  {{ $t("applications.detail.document.date_label") }}
                </p>
              </div>
            </div>
            <p
              class="mt-1 text-lg font-medium text-neutral-500 dark:text-neutral-400"
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
          <p class="text-xl font-bold text-neutral-900 dark:text-white">
            {{
              isEditing
                ? application.selectedCompany?.name || application.company.name
                : application.company.name
            }}
          </p>
          <div
            v-if="
              isEditing
                ? application.selectedCompany?.address ||
                  application.company.address
                : application.company.address
            "
            class="mt-1 text-sm text-neutral-600 dark:text-neutral-400"
          >
            <template
              v-if="isEditing && application.selectedCompany?.address"
            >
              <p>
                {{ application.selectedCompany.address.street }}
                {{ application.selectedCompany.address.houseNumber }}
              </p>
              <p>
                {{ application.selectedCompany.address.zipcode }}
                {{ application.selectedCompany.address.city }}
              </p>
            </template>
            <template v-else-if="application.company.address">
              <p>
                {{ application.company.address.street }}
                {{ application.company.address.houseNumber }}
              </p>
              <p>
                {{ application.company.address.zipcode }}
                {{ application.company.address.city }}
              </p>
            </template>
          </div>
        </div>

        <!-- Document Title & Subtitle -->
        <div class="mb-12">
          <h3 class="text-3xl font-black text-neutral-900 dark:text-white">
            {{ isEditing ? application.title : application.title }}
          </h3>
          <p
            v-if="isEditing ? application.subtitle : application.subtitle"
            class="mt-2 text-xl font-medium text-neutral-500 dark:text-neutral-400"
          >
            {{ isEditing ? application.subtitle : application.subtitle }}
          </p>
        </div>

        <p class="mb-8 text-lg font-bold text-neutral-900 dark:text-white">
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
          class="mt-20 border-t border-neutral-50 pt-10 dark:border-neutral-800/50"
        >
          <p class="text-lg font-medium text-neutral-900 dark:text-white">
            {{ $t("applications.detail.document.closing") }}
          </p>
          <div class="mt-8">
            <p class="text-xl font-black text-neutral-900 dark:text-white">
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
