<template>
  <footer class="py-5 bg-gradient-to-br dark:from-neutral-900 from-neutral-100 dark:to-neutral-800 to-neutral-200 border-t dark:border-neutral-700 border-neutral-300">
    <div class="container max-w-screen-xl">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="flex flex-col gap-4">
          <h3 class="text-3xl font-medium">Philipp Fleischer</h3>
          <p class="border-l-4 border-secondary-400  pl-4 dark:text-neutral-400 text-neutral-600">{{ $t("home.hero.summary") }}</p>
          <div class="flex gap-3 w-full">
            <Button to="https://www.linkedin.com/in/philipp-fleischer-95ba23369/" target="_blank">
              <Icon name="mdi:linkedin" size="30" />
            </Button>
            <Button to="https://github.com/fleischerdesign" target="_blank">
              <Icon name="mdi:github" size="30" />
            </Button>
            <Button to="https://instagram.com/fleischer.design/" target="_blank">
              <Icon name="mdi:instagram" size="30" />
            </Button>
          </div>
        </div>
        <div class="md:ml-auto lg:mx-auto">
          <h3 class="text-xl font-medium pb-4">{{ $t("footer.contact") }}</h3>
          <p class="dark:text-neutral-400 text-neutral-600">+49 123 456789</p>
          <p class="dark:text-neutral-400 text-neutral-600">hello@fleischer.design</p>
          <p class="dark:text-neutral-400 text-neutral-600">17036 Neubrandenburg</p>
        </div>
        <div class="ml-0 lg:ml-auto">
          <h3 class="text-xl font-medium pb-4">{{ $t("footer.sitemap") }}</h3>
          <ul class="dark:text-neutral-400 text-neutral-600 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-y-2 gap-x-6">
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
    <p class="dark:text-neutral-600 text-neutral-400 text-sm container max-w-screen-xl mx-auto pt-4 pb-16">{{ $t("footer.copyright") }}</p>
  </footer>
</template>