<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const closeModal = () => {
  emit("update:modelValue", false);
};
</script>

<template>
  <Transition name="modal">
    <div v-if="modelValue" class="fixed inset-0 z-[9998] flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300" @click.self="closeModal">
      <div class="flex w-full max-w-md flex-col overflow-hidden rounded-lg border border-neutral-300/40 bg-gradient-to-br from-neutral-100/40 to-neutral-200/40 text-neutral-950 shadow-lg backdrop-blur-md transition-all duration-300 dark:border-neutral-700/40 dark:from-neutral-900/40 dark:to-neutral-800/40 dark:text-white">
        <div class="flex items-center justify-between border-b border-neutral-300/40 p-4 dark:border-neutral-700/40">
          <h3 v-if="title" class="text-lg font-semibold">
            {{ title }}
          </h3>
          <button class="text-2xl font-bold text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200" @click="closeModal">
            &times;
          </button>
        </div>

        <div class="flex-grow p-6">
          <slot name="body">
            default body
          </slot>
        </div>

        <div class="flex justify-end gap-3 rounded-b-lg bg-neutral-50/20 p-4 dark:bg-neutral-900/20">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(1.1);
}
</style>
