<template>
  <div class="relative">
    <component
      :is="as"
      :id="id"
      :value="model"
      class="peer w-full rounded-lg border border-neutral-300 bg-gradient-to-br from-neutral-100 to-neutral-200 px-4 py-3 placeholder-transparent placeholder-opacity-0 shadow-sm transition focus:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-secondary-400 peer-focus:placeholder-opacity-100 dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800 dark:focus:placeholder-neutral-600"
      :required="required"
      :placeholder="label"
      :class="{ 'border-red-500': error }"
      :type="type"
      :rows="as === 'textarea' ? 5 : undefined"
      @input="model = ($event.target as HTMLInputElement).value"
    />
    <label
      :for="id"
      class="absolute -top-2.5 left-4 px-1 text-sm text-neutral-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:bg-neutral-100 peer-focus:text-sm peer-focus:text-secondary-400 dark:peer-focus:bg-neutral-900"
    >
      {{ label }}
    </label>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>();

withDefaults(defineProps<{
  id: string;
  label: string;
  as?: 'input' | 'textarea';
  type?: string;
  error?: string;
  required?: boolean;
}>(), {
  as: 'input',
  type: 'text',
  required: false,
});
</script>
