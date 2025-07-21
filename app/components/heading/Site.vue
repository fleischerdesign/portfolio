<template>
  <div class="mb-10 flex flex-col gap-4">
    <NuxtLinkLocale v-if="link" :to="link" class="self-start">
      <h1 class="text-5xl font-semibold">{{ title }}</h1>
    </NuxtLinkLocale>
    <div class="flex gap-2">
    <icon v-if="symbol" :name="symbol" class="h-10 w-10 fill-secondary-400" mode="svg" />
    <h1 v-if="!link" class="text-5xl font-semibold">{{ title }}</h1>
    </div>
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
  symbol?: string
}

const props = defineProps<Props>()
</script>