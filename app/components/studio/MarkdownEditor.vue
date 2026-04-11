<template>
  <div class="grid h-[600px] grid-cols-1 gap-4 md:grid-cols-2">
    <UiCard class="flex h-full flex-col overflow-hidden">
      <div
        class="border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50"
      >
        Markdown
      </div>
      <textarea
        :value="modelValue"
        class="w-full flex-1 resize-none border-none bg-transparent p-4 font-mono text-sm leading-relaxed focus:ring-0"
        @input="
          ($event) =>
            emit(
              'update:modelValue',
              ($event.target as HTMLTextAreaElement).value,
            )
        "
      ></textarea>
    </UiCard>
    <UiCard
      class="flex h-full flex-col overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/30"
    >
      <BaseMarkdown
        :content="modelValue"
        class="prose-sm flex-1 overflow-y-auto p-4"
      />
    </UiCard>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>
