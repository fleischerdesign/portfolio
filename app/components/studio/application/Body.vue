<script setup lang="ts">
import type { ApplicationResponsePayload } from "#shared/schemas/application.schema";

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

const bodyStats = computed(() => {
  const text = props.isEditing ? body.value : props.application.body;
  const words = text?.trim().split(/\s+/).filter(Boolean).length || 0;
  const chars = text?.length || 0;
  return {
    words,
    chars,
    readingTime: Math.max(1, Math.ceil(words / 200)),
    isLong: chars > 2800,
  };
});

const textareaRef = ref<{ $el: HTMLElement } | null>(null);
const adjustTextareaHeight = () => {
  if (!textareaRef.value) return;
  const el = textareaRef.value?.$el?.querySelector("textarea");
  if (el) {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }
};

watch(
  () => body.value,
  () => {
    if (props.isEditing) {
      nextTick(adjustTextareaHeight);
    }
  },
);

watch(
  () => props.isEditing,
  (val) => {
    if (val) {
      nextTick(adjustTextareaHeight);
    }
  },
);

onMounted(() => {
  if (props.isEditing) {
    adjustTextareaHeight();
  }
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
        <div v-else class="space-y-8">
          <div
            class="flex items-center justify-between rounded-2xl border border-secondary-100/50 bg-secondary-50/50 p-3 px-6 dark:border-secondary-500/10 dark:bg-secondary-900/10"
          >
            <div class="flex items-center gap-8">
              <div class="flex flex-col">
                <span
                  class="text-[9px] font-black uppercase tracking-widest text-secondary-500/60"
                  >{{ $t("applications.detail.editor.words") }}</span
                >
                <span class="text-lg font-black text-secondary-600">{{
                  bodyStats.words
                }}</span>
              </div>
              <div class="flex flex-col">
                <span
                  class="text-[9px] font-black uppercase tracking-widest text-neutral-400"
                  >{{ $t("applications.detail.editor.chars") }}</span
                >
                <span
                  class="text-lg font-bold text-neutral-600 dark:text-neutral-300"
                  :class="{ 'text-amber-500': bodyStats.isLong }"
                  >{{ bodyStats.chars }}</span
                >
              </div>
              <div
                class="mx-2 hidden h-8 w-px bg-neutral-200 sm:flex dark:bg-neutral-700"
              ></div>
              <div class="hidden flex-col sm:flex">
                <span
                  class="text-[9px] font-black uppercase tracking-widest text-neutral-400"
                  >{{ $t("applications.detail.editor.reading_time") }}</span
                >
                <span
                  class="text-sm font-bold text-neutral-600 dark:text-neutral-300"
                  >~ {{ bodyStats.readingTime }} Min.</span
                >
              </div>
            </div>

            <div class="flex gap-2">
              <div
                v-if="bodyStats.isLong"
                class="hidden items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-amber-500 lg:flex dark:border-amber-800 dark:bg-amber-900/20"
              >
                <Icon name="heroicons:exclamation-triangle" size="14" />
                {{ $t("applications.detail.editor.over_page_limit") }}
              </div>
              <div
                class="hidden items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400 lg:flex"
              >
                <Icon name="mdi:markdown" size="18" />
                Markdown
              </div>
            </div>
          </div>

          <div class="group/editor relative">
            <UiInput
              id="body"
              ref="textareaRef"
              v-model="body"
              as="textarea"
              label=""
              :placeholder="$t('applications.detail.editor.placeholder')"
              class="min-h-[600px] resize-none overflow-hidden border-none !bg-transparent !p-0 text-lg leading-relaxed selection:bg-secondary-100 focus:ring-0 dark:selection:bg-secondary-900/50"
              @input="adjustTextareaHeight"
            />
          </div>
        </div>

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
