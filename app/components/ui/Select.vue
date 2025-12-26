<script setup lang="ts" generic="T extends Record<string, any> | string">
const props = withDefaults(defineProps<{
  id: string;
  modelValue: T | null | undefined;
  options: readonly T[];
  label: string;
  by?: keyof T;
  error?: string;
  hasError?: boolean;
}>(), {
  by: undefined,
  error: '',
  hasError: false,
});

const emit = defineEmits(['update:modelValue']);

const rootEl = ref<HTMLElement | null>(null);
const buttonEl = ref<HTMLButtonElement | null>(null);
const hiddenInputEl = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);

const hasValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return false;
  if (typeof props.modelValue === 'string') return props.modelValue !== '';
  if (typeof props.modelValue === 'object') return Object.keys(props.modelValue).length > 0;
  return false;
});

function areEqual(a: T, b: T) {
  if (!props.by) {
    if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return a === b;
  }
  return a?.[props.by] === b?.[props.by];
}

const selectedOption = computed(() =>
  props.options.find(opt => areEqual(opt, props.modelValue as T))
);

function selectOption(option: T) {
  emit('update:modelValue', option);
  isOpen.value = false;

  buttonEl.value?.focus();
}

function toggleOpen() {
  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    hiddenInputEl.value?.focus();
  }
}

function handleClickOutside(event: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    isOpen.value = false;
    buttonEl.value?.focus();
  } else if (event.key === 'ArrowDown' && !isOpen.value) {
    event.preventDefault();
    isOpen.value = true;
  } else if (event.key === 'ArrowDown' && isOpen.value) {
    event.preventDefault();

  } else if (event.key === 'ArrowUp' && isOpen.value) {
    event.preventDefault();

  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const selectButtonClasses = useCva(
  props,
  'relative w-full rounded-lg px-4 py-3 text-left shadow-sm transition outline-none',
  {
    hasError: {
      false: 'border border-neutral-300 bg-gradient-to-br from-neutral-100 to-neutral-200 peer-focus:ring-2 peer-focus:ring-secondary-400 dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800',
      true: 'border border-red-500 bg-gradient-to-br from-neutral-100 to-neutral-200 peer-focus:ring-2 peer-focus:ring-red-500 text-red-500 dark:border-red-500 dark:from-neutral-900 dark:to-neutral-800',
    },
  },
);
</script>

<template>
  <div ref="rootEl" class="relative group" :class="{ 'has-error': hasError }">

    <input
      ref="hiddenInputEl"
      :id="`${id}-hidden`"
      type="text"
      class="peer pointer-events-none absolute inset-0 opacity-0"
      placeholder=" "
      :value="hasValue ? 'has-value' : ''"
      tabindex="-1"
      aria-hidden="true"
      readonly
    />


    <button
      ref="buttonEl"
      :id="id"
      type="button"
      :class="selectButtonClasses"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :aria-labelledby="`${id}-label`"
      @click="toggleOpen" @keydown="handleKeydown" @focus="hiddenInputEl?.focus()"
      @blur="hiddenInputEl?.blur()"
    >
      <div class="min-h-[1.5rem]">
        <slot
          v-if="hasValue && selectedOption"
          name="display"
          :option="selectedOption"
        >
          <span>{{ selectedOption }}</span>
        </slot>
      </div>
    </button>


    <label
      :id="`${id}-label`"
      :for="id"
      class="pointer-events-none absolute left-4 px-1 transition-all -top-2.5 text-sm bg-neutral-100 dark:bg-neutral-900 text-neutral-400 peer-focus:text-secondary-400 group-[.has-error]:text-red-500 group-[.has-error]:peer-focus:text-red-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-neutral-100 dark:peer-focus:bg-neutral-900"
    >
      {{ label }}
    </label>


    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute z-10 mt-2 w-full rounded-lg border border-neutral-300 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
        role="listbox"
        :aria-labelledby="`${id}-label`"
      >
        <ul class="max-h-60 overflow-auto py-1">
          <li
            v-for="(option, index) in options"
            :key="index"
            class="cursor-pointer px-4 py-2.5 transition hover:bg-neutral-100 dark:hover:bg-neutral-700"
            :class="{
              'bg-secondary-50 dark:bg-secondary-900/20': selectedOption && areEqual(option, selectedOption)
            }"
            role="option"
            :aria-selected="selectedOption && areEqual(option, selectedOption)"
            @click="selectOption(option)"
          >
            <slot name="option" :option="option">
              <span>{{ option }}</span>
            </slot>
          </li>
        </ul>
      </div>
    </Transition>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>