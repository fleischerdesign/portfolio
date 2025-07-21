<template>
  <div class="mb-10 flex flex-col gap-4">
    <NuxtLinkLocale v-if="link" :to="link" class="self-start">
      <h2 class="text-5xl font-semibold">{{ title }}</h2>
    </NuxtLinkLocale>
    <h2 v-else class="text-5xl font-semibold">{{ title }}</h2>
    <p class="w-full border-l-4 border-secondary-400 pl-4 text-neutral-600 lg:w-2/3 dark:text-neutral-400">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  link?: string
}

defineProps<Props>()
</script>