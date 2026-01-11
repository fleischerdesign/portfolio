<template>
  <div class="group flex flex-col gap-2" :class="{ 'has-error': hasError }">
    <!-- Label positioned outside for better clarity and design consistency -->
    <label
      v-if="label"
      :for="id"
      class="text-sm font-bold uppercase tracking-widest text-neutral-500 transition-colors group-focus-within:text-secondary-500 dark:text-neutral-400"
    >
      {{ label }} <span v-if="required" class="text-secondary-500">*</span>
    </label>

    <div class="relative">
      <component
        :is="as"
        :id="id"
        v-bind="$attrs"
        :value="model"
        :class="inputClasses"
        :required="required"
        :type="type"
        :rows="as === 'textarea' ? 5 : undefined"
        @input="handleInput"
      />
      
      <!-- Subtle internal glow/border on focus (Optional decorative element) -->
      <div class="pointer-events-none absolute inset-0 rounded-xl border border-secondary-500/0 shadow-none transition-all duration-300 peer-focus:border-secondary-500/20 peer-focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"></div>
    </div>

    <p v-if="error" class="mt-1 text-xs font-medium text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  inheritAttrs: false
});

const model = defineModel<string | number>();

interface Props {
  id: string;
  label: string;
  as?: 'input' | 'textarea';
  type?: string;
  error?: string;
  hasError?: boolean;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'input',
  type: 'text',
  required: false,
  error: '',
  hasError: false,
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

const inputClasses = computed(() => {
  const base = 'peer w-full rounded-xl bg-white/50 dark:bg-neutral-900/40 px-4 py-3 text-neutral-900 dark:text-white border transition-all duration-300 backdrop-blur-md outline-none placeholder-neutral-400';
  
  const state = props.hasError 
    ? 'border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
    : 'border-neutral-200/60 dark:border-neutral-800/60 focus:border-secondary-500/50 focus:ring-4 focus:ring-secondary-500/10 dark:focus:border-secondary-400/40';
  
  return `${base} ${state}`;
});
</script>
