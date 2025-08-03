<template>
  <footer class="border-t border-neutral-300 bg-gradient-to-br from-neutral-100 to-neutral-200 py-5 dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800 print:hidden">
    <div class="container max-w-screen-xl">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div class="flex flex-col gap-4">
          <h3 class="text-3xl font-medium">Philipp Fleischer</h3>
          <p class="border-l-4 border-secondary-400  pl-4 text-neutral-600 dark:text-neutral-400">{{ $t("home.hero.summary") }}</p>
          <SocialLinks />
        </div>
        <div class="md:ml-auto lg:mx-auto">
          <h3 class="pb-4 text-xl font-medium">{{ $t("footer.contact") }}</h3>
          <p class="text-neutral-600 dark:text-neutral-400">+49 176 31099324</p>
          <p class="text-neutral-600 dark:text-neutral-400">hello@fleischer.design</p>
          <p class="text-neutral-600 dark:text-neutral-400">17036 Neubrandenburg</p>
        </div>
        <div class="ml-0 lg:ml-auto">
          <h3 class="pb-4 text-xl font-medium">{{ $t("footer.sitemap") }}</h3>
          <ul class="grid grid-cols-1 gap-x-6 gap-y-2 text-neutral-600 md:grid-cols-3 lg:grid-cols-3 dark:text-neutral-400">
            <li><NuxtLink :to="$localePath('/')">{{ $t("navigation.home") }}</NuxtLink></li>
            <li><NuxtLink :to="$localePath('/store')">{{ $t("navigation.store") }}</NuxtLink></li>
            <li><NuxtLink :to="$localePath('/projects')">{{ $t("navigation.projects") }}</NuxtLink></li>
            <li><NuxtLink :to="$localePath('/blog')">{{ $t("navigation.blog") }}</NuxtLink></li>
            <li><NuxtLink :to="$localePath('/about')">{{ $t("navigation.about") }}</NuxtLink></li>
            <li><NuxtLink :to="$localePath('/resume')">{{ $t("navigation.resume") }}</NuxtLink></li>
            <li><NuxtLink :to="$localePath('/legal')">{{ $t("navigation.legal") }}</NuxtLink></li>
          </ul>
        </div>
      </div>
    </div>
    <p class="container mx-auto max-w-screen-xl pb-16 pt-4 text-sm text-neutral-400 dark:text-neutral-600">{{ $t("footer.copyright") }}</p>
  </footer>
</template>