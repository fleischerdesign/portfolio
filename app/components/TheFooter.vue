<template>
  <footer class="relative border-t border-neutral-200/50 bg-white/50 py-16 backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-950/50 print:hidden">
    <!-- Ambient Glow at Footer Top -->
    <div class="pointer-events-none absolute left-1/2 top-0 -z-10 h-32 w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary-500/5 blur-[80px]"></div>

    <div class="container mx-auto max-w-screen-xl px-4 md:px-8">
      <div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        <!-- Brand & Summary -->
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <h3 class="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">Philipp Fleischer</h3>
            <div class="h-1 w-12 rounded-full bg-secondary-500"></div>
          </div>
          <p class="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            {{ $t("home.hero.summary") }}
          </p>
          <div class="pt-2">
            <SocialLinks />
          </div>
        </div>

        <!-- Contact Info -->
        <div class="md:ml-auto lg:mx-auto">
          <h3 class="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-secondary-500">{{ $t("footer.contact") }}</h3>
          <div class="space-y-4">
            <a :href="`tel:${contactData.phone.replace(/\s/g, '')}`" class="group flex items-center gap-3 text-neutral-600 transition-colors hover:text-secondary-600 dark:text-neutral-400 dark:hover:text-secondary-400">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 transition-colors group-hover:bg-secondary-50 dark:bg-neutral-900 dark:group-hover:bg-secondary-900/30">
                    <Icon name="mage:phone" size="20" />
                </div>
                <span class="text-lg font-medium">{{ contactData.phone }}</span>
            </a>
            <a :href="`mailto:${contactData.email}`" class="group flex items-center gap-3 text-neutral-600 transition-colors hover:text-secondary-600 dark:text-neutral-400 dark:hover:text-secondary-400">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 transition-colors group-hover:bg-secondary-50 dark:bg-neutral-900 dark:group-hover:bg-secondary-900/30">
                    <Icon name="mage:email" size="20" />
                </div>
                <span class="text-lg font-medium">{{ contactData.email }}</span>
            </a>
            <div class="group flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-900">
                    <Icon name="mage:map-marker" size="20" />
                </div>
                <span class="text-lg font-medium">{{ personal.address.postalCode }} {{ personal.address.city }}</span>
            </div>
          </div>
        </div>

        <!-- Sitemap / Links -->
        <div class="ml-0 lg:ml-auto">
          <h3 class="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-secondary-500">{{ $t("footer.sitemap") }}</h3>
          <ul class="grid grid-cols-2 gap-4 text-neutral-600 dark:text-neutral-400">
            <li
v-for="link in [
                { path: '/', label: 'navigation.home' },
                { path: '/store', label: 'navigation.store' },
                { path: '/projects', label: 'navigation.projects' },
                { path: '/blog', label: 'navigation.blog' },
                { path: '/about', label: 'navigation.about' },
                { path: '/legal', label: 'navigation.legal' }
            ]" :key="link.path">
                <NuxtLink 
                    :to="$localePath(link.path)" 
                    class="text-lg font-medium transition-colors hover:text-secondary-600 dark:hover:text-secondary-400"
                >
                    {{ $t(link.label) }}
                </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright Bar -->
      <div class="mt-20 flex flex-col items-center justify-between border-t border-neutral-200/30 pt-8 md:flex-row dark:border-neutral-800/30">
        <p class="text-sm font-medium text-neutral-500 dark:text-neutral-500">
            {{ $t("footer.copyright", { year: new Date().getFullYear() }) }}
        </p>
        <div class="mt-4 flex gap-6 text-sm md:mt-0">
            <NuxtLink :to="$localePath('/legal')" class="hover:text-secondary-500">{{ $t("legal.title") }}</NuxtLink>
            <NuxtLink :to="$localePath('/legal')" class="hover:text-secondary-500">{{ $t("legal.privacy") }}</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { contactData } from '~/data/contact.data';
import { personalData } from '~/data/personal.data';

const { t } = useI18n();
const personal = personalData(t);
</script>

