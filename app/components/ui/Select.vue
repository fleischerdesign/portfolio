<template>
  <div ref="rootEl" class="group relative flex flex-col gap-2" :class="{ 'has-error': hasError }">
    <!-- Label (Outside) -->
    <label
      v-if="label"
      :id="`${id}-label`"
      :for="id"
      class="text-sm font-bold uppercase tracking-widest text-primary-500 transition-colors group-focus-within:text-secondary-500 dark:text-primary-400"
    >
      {{ label }} <span v-if="required" class="text-secondary-500">*</span>
    </label>

    <!-- Hidden Input for Logic -->
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

    <!-- Custom Select Button -->
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
      <div class="flex min-h-[1.5rem] flex-wrap items-center gap-2 text-left">
        <template v-if="hasValue">
          <template v-if="multiple && selectedOptions.length > 0">
            <slot v-for="opt in selectedOptions" name="display" :option="opt">
              <UiTag size="sm" variant="glow" interactive>{{ opt }}</UiTag>
            </slot>
          </template>
          <template v-else-if="!multiple && selectedOption">
            <slot name="display" :option="selectedOption">
              <span class="text-primary-900 dark:text-white">{{ selectedOption }}</span>
            </slot>
          </template>
        </template>
        <span v-else class="text-primary-400">Select an option...</span>
      </div>

      <!-- Arrow Icon -->
      <Icon 
        name="heroicons:chevron-down" 
        class="ml-auto h-5 w-5 text-primary-400 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }" 
      />
    </button>

    <!-- Dropdown Menu (Teleported to body to avoid clipping/z-index issues) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0 translate-y-2"
        enter-to-class="transform scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100 translate-y-0"
        leave-to-class="transform scale-95 opacity-0 translate-y-2"
      >
        <div
          v-if="isOpen"
          ref="dropdownEl"
          class="fixed z-[9999] mt-2 overflow-hidden rounded-xl border border-primary-200/60 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-primary-800/60 dark:bg-primary-900/80"
          :style="dropdownStyle"
          role="listbox"
          :aria-labelledby="`${id}-label`"
        >
          <ul class="max-h-60 overflow-auto py-1">
            <li 
              v-if="creatable" 
              class="cursor-pointer px-4 py-2.5 text-secondary-500 transition hover:bg-secondary-50 dark:hover:bg-secondary-900/30" 
              @click="handleCreate"
            >
              <slot name="create">
                <span class="flex items-center gap-2 font-medium">
                  <Icon name="heroicons:plus" />
                  Neuen Eintrag erstellen
                </span>
              </slot>
            </li>
            <li
              v-for="(option, index) in options"
              :key="index"
              class="cursor-pointer px-4 py-2.5 transition-colors hover:bg-primary-100 dark:text-primary-200 dark:hover:bg-primary-800"
              :class="{
                'bg-secondary-50 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-400': !multiple && selectedOption && areEqual(option, selectedOption),
                'bg-secondary-50/50 text-secondary-700 dark:bg-secondary-900/10 dark:text-secondary-400': multiple && Array.isArray(modelValue) && modelValue.some(v => areEqual(v, option))
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
    </Teleport>
    
    <p v-if="error" class="mt-1 text-xs font-medium text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any> | string">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';

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
  required?: boolean;
}>(), {
  by: undefined,
  error: '',
  hasError: false,
  creatable: false,
  multiple: false,
  required: false,
});

const emit = defineEmits(['update:modelValue', 'create']);

const rootEl = ref<HTMLElement | null>(null);
const buttonEl = ref<HTMLButtonElement | null>(null);
const dropdownEl = ref<HTMLElement | null>(null);
const hiddenInputEl = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const dropdownStyle = ref({});

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

function updateDropdownPosition() {
  if (!buttonEl.value || !isOpen.value) return;
  const rect = buttonEl.value.getBoundingClientRect();
  dropdownStyle.value = {
    top: `${rect.bottom}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`
  };
}

// Update position on scroll/resize to keep it attached
function handleScrollResize() {
  if (isOpen.value) updateDropdownPosition();
}

watch(isOpen, async (val) => {
  if (val) {
    await nextTick();
    updateDropdownPosition();
    window.addEventListener('scroll', handleScrollResize, true);
    window.addEventListener('resize', handleScrollResize);
  } else {
    window.removeEventListener('scroll', handleScrollResize, true);
    window.removeEventListener('resize', handleScrollResize);
  }
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
  // Check if click is outside BOTH the button AND the teleported dropdown
  const isClickInButton = rootEl.value && rootEl.value.contains(event.target as Node);
  const isClickInDropdown = dropdownEl.value && dropdownEl.value.contains(event.target as Node);
  
  if (!isClickInButton && !isClickInDropdown) {
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
  window.removeEventListener('scroll', handleScrollResize, true);
  window.removeEventListener('resize', handleScrollResize);
});

const selectButtonClasses = useCva(
  props,
  'relative flex w-full items-center justify-between rounded-xl px-4 py-3 text-left shadow-sm transition-all duration-300 outline-none backdrop-blur-md',
  {
    hasError: {
      false: 'border border-primary-200/60 bg-white/50 focus:border-secondary-500/50 focus:ring-4 focus:ring-secondary-500/10 dark:border-primary-800/60 dark:bg-primary-900/40 dark:focus:border-secondary-400/40',
      true: 'border border-red-500/50 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-500 dark:bg-red-900/10',
    },
  },
);
</script>