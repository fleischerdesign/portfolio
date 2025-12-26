<template>
  <div class="group relative" :class="{ 'has-error': hasError }">
    <component
      :is="as"
      :id="id"
      :value="model"
      :class="inputClasses"
      :required="required"
      placeholder=" "
      :type="type"
      :rows="as === 'textarea' ? 5 : undefined"
      @input="model = ($event.target as HTMLInputElement).value"
    />
    <label
      :for="id"
      class="absolute -top-2.5 left-4 bg-neutral-100 px-1 text-sm text-neutral-400 transition-all group-[.has-error]:text-red-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:bg-neutral-100 peer-focus:text-sm peer-focus:text-secondary-400 group-[.has-error]:peer-focus:text-red-500 dark:bg-neutral-900 dark:peer-focus:bg-neutral-900"
    >
      {{ label }}
    </label>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>();

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

const inputClasses = useCva(
    props,
    'peer w-full rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 px-4 py-3 placeholder-transparent placeholder-opacity-0 shadow-sm transition focus:placeholder-neutral-400 focus:outline-none focus:ring-2 peer-focus:placeholder-opacity-100 dark:from-neutral-900 dark:to-neutral-800 dark:focus:placeholder-neutral-600',
    {
        hasError: {
            false: 'border border-neutral-300 dark:border-neutral-700 focus:ring-secondary-400',
            true: 'border border-red-500 focus:ring-red-500 text-red-500',
        },
    },
);
</script>
