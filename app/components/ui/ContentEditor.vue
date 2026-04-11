<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string;
  placeholder?: string;
  showStats?: boolean;
  showPreview?: boolean;
  minHeight?: string;
}>(), {
  placeholder: '',
  showStats: true,
  showPreview: true,
  minHeight: '600px'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const content = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const stats = computed(() => {
  const text = content.value || '';
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  return {
    words,
    chars,
    readingTime: Math.max(1, Math.ceil(words / 200)),
    isLong: chars > 2800,
  };
});

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const adjustHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
};

watch(() => content.value, () => {
  nextTick(adjustHeight);
});

onMounted(() => {
  adjustHeight();
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Stats Bar -->
    <div
      v-if="showStats"
      class="flex items-center justify-between rounded-2xl border border-secondary-100/50 bg-secondary-50/50 p-3 px-6 dark:border-secondary-500/10 dark:bg-secondary-900/10"
    >
      <div class="flex items-center gap-8">
        <div class="flex flex-col">
          <span class="text-[9px] font-black uppercase tracking-widest text-secondary-500/60">
            {{ $t('applications.detail.editor.words') || 'Wörter' }}
          </span>
          <span class="text-lg font-black text-secondary-600">{{ stats.words }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[9px] font-black uppercase tracking-widest text-neutral-400">
            {{ $t('applications.detail.editor.chars') || 'Zeichen' }}
          </span>
          <span
            class="text-lg font-bold text-neutral-600 dark:text-neutral-300"
            :class="{ 'text-amber-500': stats.isLong }"
          >
            {{ stats.chars }}
          </span>
        </div>
        <div class="mx-2 hidden h-8 w-px bg-neutral-200 sm:flex dark:bg-neutral-700"></div>
        <div class="hidden flex-col sm:flex">
          <span class="text-[9px] font-black uppercase tracking-widest text-neutral-400">
            {{ $t('applications.detail.editor.reading_time') || 'Lesezeit' }}
          </span>
          <span class="text-sm font-bold text-neutral-600 dark:text-neutral-300">
            ~ {{ stats.readingTime }} Min.
          </span>
        </div>
      </div>

      <div class="flex gap-2">
        <div
          v-if="stats.isLong"
          class="hidden items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-amber-500 lg:flex dark:border-amber-800 dark:bg-amber-900/20"
        >
          <Icon name="heroicons:exclamation-triangle" size="14" />
          {{ $t('applications.detail.editor.over_page_limit') || 'Über eine Seite' }}
        </div>
        <div class="hidden items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400 lg:flex">
          <Icon name="mdi:markdown" size="18" />
          Markdown
        </div>
      </div>
    </div>

    <!-- Editor Layout -->
    <div :class="[showPreview ? 'grid grid-cols-1 gap-6 lg:grid-cols-2' : 'block']">
      <!-- Edit Area -->
      <div class="relative group">
        <textarea
          ref="textareaRef"
          v-model="content"
          :placeholder="placeholder"
          :style="{ minHeight }"
          class="w-full resize-none overflow-hidden border-none bg-transparent p-0 text-lg leading-relaxed selection:bg-secondary-100 focus:ring-0 dark:selection:bg-secondary-900/50 dark:text-neutral-200"
          @input="adjustHeight"
        ></textarea>
      </div>

      <!-- Preview Area (DIN-A4 Style for Content) -->
      <div v-if="showPreview" class="hidden lg:block">
        <UiCard class="h-full border-neutral-100 bg-neutral-50/30 dark:border-neutral-800 dark:bg-neutral-900/30">
          <UiCardContainer class="p-8">
            <BaseMarkdown :content="content" />
          </UiCardContainer>
        </UiCard>
      </div>
    </div>
  </div>
</template>
