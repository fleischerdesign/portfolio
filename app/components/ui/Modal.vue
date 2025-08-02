<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
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
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg transition-all duration-300 flex flex-col">
        <div class="flex justify-end">
          <button class="text-2xl font-bold text-gray-600 hover:text-gray-800" @click="closeModal">
            &times;
          </button>
        </div>

        <div class="my-4 flex-grow">
          <slot name="body">
            default body
          </slot>
        </div>

        <div class="flex justify-end">
          <slot name="footer">
            <!-- default footer -->
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Transitions for the modal */
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
