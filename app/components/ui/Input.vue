<template>
  <div class="group flex flex-col gap-2" :class="{ 'has-error': hasError }">
    <!-- Label positioned outside for better clarity and design consistency -->
    <label
      v-if="label"
      :for="id"
      class="text-sm font-bold uppercase tracking-widest text-primary-500 transition-colors group-focus-within:text-secondary-500 dark:text-primary-400"
    >
      {{ label }} <span v-if="required" class="text-secondary-500">*</span>
    </label>

    <div class="relative flex items-center">
      <div v-if="$slots.prefix" class="absolute left-4 z-10 flex items-center justify-center text-primary-400">
        <slot name="prefix" />
      </div>

      <component
        :is="as"
        :id="id"
        v-bind="sanitizedAttrs"
        :value="model"
        :class="[
          inputClasses,
          $slots.prefix ? 'pl-11' : '',
          $slots.suffix ? 'pr-11' : '',
        ]"
        :required="required"
        :type="type"
        :rows="as === 'textarea' ? 5 : undefined"
        @input="handleInput"
      />

      <div v-if="$slots.suffix" class="absolute right-4 z-10 flex items-center justify-center text-primary-400">
        <slot name="suffix" />
      </div>
      
      <!-- Subtle internal glow/border on focus -->
      <div class="pointer-events-none absolute inset-0 rounded-xl border border-secondary-500/0 shadow-none transition-all duration-300 peer-focus:border-secondary-500/20 peer-focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"></div>
    </div>

    <p v-if="error" class="mt-1 text-xs font-medium text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
});

const model = defineModel<string | number | null>();

interface Props {
  id: string;
  label?: string;
  as?: 'input' | 'textarea';
  type?: string;
  error?: string;
  hasError?: boolean;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  as: 'input',
  type: 'text',
  required: false,
  error: '',
  hasError: false,
});

const attrs = useAttrs();
const sanitizedAttrs = computed(() => {
  const { class: _, ...rest } = attrs;
  return rest;
});

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  if (props.type === 'number') {
    const numVal = Number(value);
    model.value = isNaN(numVal) ? value : numVal;
  } else {
    model.value = value;
  }
};

const inputClasses = useCva(
  props,
  'peer w-full rounded-xl bg-white/50 dark:bg-primary-900/40 px-4 py-3 text-primary-900 dark:text-white border transition-all duration-300 backdrop-blur-md outline-none placeholder-primary-400',
  {
    hasError: {
      true: 'border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10',
      false: 'border-primary-200/60 dark:border-primary-800/60 focus:border-secondary-500/50 focus:ring-4 focus:ring-secondary-500/10 dark:focus:border-secondary-400/40',
    },
  }
);
</script>
