<template>
  <div class="flex flex-col gap-4 mb-10">
    <NuxtLinkLocale v-if="link" :to="link" class="self-start">
      <h1 class="text-5xl font-semibold">{{ title }}</h1>
    </NuxtLinkLocale>
    <div class="flex gap-2">
    <icon v-if="symbol" :name="symbol" class="w-10 h-10 fill-secondary-400" mode="svg" />
    <h1 v-if="!link" class="text-5xl font-semibold">{{ title }}</h1>
    </div>
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
  symbol?: string
}

const props = defineProps<Props>()
</script>