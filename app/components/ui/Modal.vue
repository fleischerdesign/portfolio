<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

interface Props {
  modelValue: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  persistent?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  persistent: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const closeModal = () => {
  if (!props.persistent) {
    emit("update:modelValue", false);
  }
};

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});

const modalContentClasses = useCva(
  props,
  'flex flex-col overflow-hidden rounded-lg border border-neutral-300/40 bg-gradient-to-br from-neutral-100/40 to-neutral-200/40 text-neutral-950 shadow-lg backdrop-blur-md transition ease-out duration-200 dark:border-neutral-700/40 dark:from-neutral-900/40 dark:to-neutral-800/40 dark:text-white',
  {
    size: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full',
    },
  },
);
</script>

<template>
  <Transition
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="modelValue" class="fixed inset-0 z-[9998] flex items-center justify-center bg-black bg-opacity-50 transition ease-out duration-200" @click.self="closeModal">
      <Transition
        enter-from-class="scale-90 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-90 opacity-0"
        enter-active-class="transition ease-out duration-200"
        leave-active-class="transition ease-in duration-200"
      >
        <div v-if="modelValue" :class="modalContentClasses">
          <div v-if="$slots.header" class="flex items-center justify-between border-b border-neutral-300/40 p-4 dark:border-neutral-700/40">
            <slot name="header" />
            <button class="text-2xl font-bold text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200" @click="closeModal">
              &times;
            </button>
          </div>
          <div v-else class="flex justify-end p-4">
              <button class="text-2xl font-bold text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200" @click="closeModal">
                  &times;
              </button>
          </div>

          <div class="flex-grow p-6">
            <slot name="body" />
          </div>

          <div v-if="$slots.footer" class="flex justify-end gap-3 rounded-b-lg bg-neutral-50/20 p-4 dark:bg-neutral-900/20">
            <slot name="footer" />
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
