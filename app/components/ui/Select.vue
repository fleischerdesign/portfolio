<script setup lang="ts" generic="T extends Record<string, any> | string">
const props = withDefaults(defineProps<{
  id: string;
  modelValue: T | T[] | null | undefined;
  options: readonly T[];
  label: string;
  by?: keyof T;
  error?: string;
  hasError?: boolean;
  creatable?: boolean;
  multiple?: boolean;
}>(), {
  by: undefined,
  error: '',
  hasError: false,
  creatable: false,
  multiple: false,
});

const emit = defineEmits(['update:modelValue', 'create']);

const rootEl = ref<HTMLElement | null>(null);
const buttonEl = ref<HTMLButtonElement | null>(null);
const hiddenInputEl = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);

const hasValue = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.length > 0;
  }
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

const selectedOption = computed(() => {
  if (props.multiple) return undefined;
  return props.options.find(opt => areEqual(opt, props.modelValue as T));
});

const selectedOptions = computed(() => {
  if (!props.multiple || !Array.isArray(props.modelValue)) return [];
  return props.modelValue.map(val => props.options.find(opt => areEqual(opt, val))).filter(Boolean) as T[];
});

function selectOption(option: T) {
  if (props.multiple) {
    const currentVal = (props.modelValue as T[] | undefined) || [];
    const index = currentVal.findIndex(item => areEqual(item, option));

    if (index > -1) {
      const newVal = [...currentVal];
      newVal.splice(index, 1);
      emit('update:modelValue', newVal);
    } else {
      emit('update:modelValue', [...currentVal, option]);
    }
  } else {
    emit('update:modelValue', option);
    isOpen.value = false;
    buttonEl.value?.focus();
  }
}

function handleCreate() {
  emit('create');
  isOpen.value = false;
  buttonEl.value?.focus();
}

function toggleOpen() {
  isOpen.value = !isOpen.value;
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
      false: 'border border-neutral-300 bg-gradient-to-br from-neutral-100 to-neutral-200 focus:ring-2 focus:ring-secondary-400 dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800',
      true: 'border border-red-500 bg-gradient-to-br from-neutral-100 to-neutral-200 focus:ring-2 focus:ring-red-500 text-red-500 dark:border-red-500 dark:from-neutral-900 dark:to-neutral-800',
    },
  },
);
</script>

<template>
  <div ref="rootEl" class="group relative" :class="{ 'has-error': hasError }">
    <input
      :id="`${id}-hidden`"
      ref="hiddenInputEl"
      type="text"
      class="peer pointer-events-none absolute inset-0 opacity-0"
      placeholder=" "
      :value="hasValue ? 'has-value' : ''"
      tabindex="-1"
      readonly
    />

    <button
      :id="id"
      ref="buttonEl"
      type="button"
      :class="selectButtonClasses"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :aria-labelledby="`${id}-label`"
      @click="toggleOpen"
      @keydown="handleKeydown"
    >
      <div class="flex min-h-[1.5rem] flex-wrap items-center gap-2">
        <template v-if="hasValue">
          <template v-if="multiple && selectedOptions.length > 0">
            <slot v-for="opt in selectedOptions" name="display" :option="opt">
              <UiTag size="sm">{{ opt }}</UiTag>
            </slot>
          </template>
          <template v-else-if="!multiple && selectedOption">
            <slot name="display" :option="selectedOption">
              <span>{{ selectedOption }}</span>
            </slot>
          </template>
        </template>
      </div>
    </button>

    <label
      :id="`${id}-label`"
      :for="id"
      class="pointer-events-none absolute -top-2.5 left-4 bg-neutral-100 px-1 text-sm text-neutral-400 transition-all group-focus-within:-top-2.5 group-focus-within:bg-neutral-100 group-focus-within:text-sm group-focus-within:text-secondary-400 group-[.has-error]:text-red-500 group-[.has-error]:group-focus-within:text-red-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 dark:bg-neutral-900 dark:group-focus-within:bg-neutral-900"
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
          <li v-if="creatable" class="cursor-pointer px-4 py-2.5 text-secondary-500 transition hover:bg-neutral-100 dark:hover:bg-neutral-700" @click="handleCreate">
            <slot name="create">
              <span class="flex items-center gap-2">
                <Icon name="heroicons:plus" />
                Neuen Eintrag erstellen
              </span>
            </slot>
          </li>
          <li
            v-for="(option, index) in options"
            :key="index"
            class="cursor-pointer px-4 py-2.5 transition hover:bg-neutral-100 dark:hover:bg-neutral-700"
            :class="{
              'bg-secondary-50 dark:bg-secondary-900/20': !multiple && selectedOption && areEqual(option, selectedOption),
              'bg-blue-50 dark:bg-blue-900/20': multiple && Array.isArray(modelValue) && modelValue.some(v => areEqual(v, option))
            }"
            role="option"
            :aria-selected="!multiple && selectedOption && areEqual(option, selectedOption)"
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