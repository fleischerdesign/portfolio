<template>
  <div class="min-h-screen flex items-center 2xl:min-h-[600px]">
    <div class="flex flex-col items-start gap-4">
      <NowIndicator />
      <h1 class="text-5xl font-semibold">{{ $t("home.hero.greeting") }}</h1>
      <p class="dark:text-neutral-400 text-neutral-600 w-full lg:w-2/3">{{ $t("home.hero.summary") }}</p>
      <SocialLinks>
        <a class="flex my-auto" href="#overview">
          <Icon name="mage:arrow-down" size="30" class="animate-pulse hover:animate-none" />
        </a>
      </SocialLinks>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>