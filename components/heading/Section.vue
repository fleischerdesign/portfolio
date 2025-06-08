<template>
  <div class="flex flex-col gap-4">
    <NuxtLinkLocale v-if="link" :to="link" class="self-start">
      <h1 class="text-5xl font-semibold">{{ title }}</h1>
    </NuxtLinkLocale>
    <h1 v-else class="text-5xl font-semibold">{{ title }}</h1>
    <p class="border-l-4 border-secondary-400 pl-4 dark:text-neutral-400 text-neutral-600 w-full lg:w-2/3">
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