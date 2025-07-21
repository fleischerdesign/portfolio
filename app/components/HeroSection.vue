<template>
  <div class="flex min-h-screen items-center 2xl:min-h-[600px]">
    <div class="flex flex-col items-start gap-4">
      <NowIndicator />
      <h1 class="text-5xl font-semibold">{{ $t("home.hero.greeting") }}</h1>
      <p class="w-full text-neutral-600 lg:w-2/3 dark:text-neutral-400">{{ $t("home.hero.summary") }}</p>
      <SocialLinks>
        <a class="my-auto flex" href="#overview">
          <Icon name="mage:arrow-down" size="30" class="animate-pulse hover:animate-none" />
        </a>
      </SocialLinks>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>