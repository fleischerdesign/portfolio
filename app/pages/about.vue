<template>
  <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
    
    <!-- Hero Section -->
    <section class="mb-32 flex flex-col items-center gap-12 lg:flex-row lg:items-start">
      <div class="flex-1 space-y-8 text-center lg:text-left">
        <div>
          <h1 class="text-5xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-7xl">
            {{ personal.name }}
          </h1>
          <p class="mt-4 text-2xl font-medium text-secondary-500 dark:text-secondary-400">
             {{ $t('about.subtitle') }}
          </p>
        </div>
        
        <div class="flex flex-wrap justify-center gap-3 lg:justify-start">
           <UiTag class="border-secondary-200 bg-secondary-50 px-3 py-1 text-secondary-700 dark:border-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300">
              <Icon name="mage:map-marker" class="mr-1" /> {{ personal.location }}
           </UiTag>
           <UiTag class="border-secondary-200 bg-secondary-50 px-3 py-1 text-secondary-700 dark:border-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300">
              <Icon name="mage:briefcase" class="mr-1" /> {{ personal.internshipStatus }}
           </UiTag>
        </div>

        <p class="text-xl leading-relaxed text-neutral-600 dark:text-neutral-300">
           {{ $t('about.intro_text') }}
        </p>

        <div class="flex justify-center pt-4 lg:justify-start">
          <SocialLinks />
        </div>
      </div>

      <div class="relative w-full max-w-md flex-1 lg:max-w-lg">
        <div class="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl transition duration-500 hover:scale-[1.02]">
           <NuxtImg
              src="/img/profile.jpg"
              alt="Philipp Fleischer"
              class="h-full w-full object-cover"
              sizes="500px"
              placeholder
           />
        </div>
        <!-- Decorative element -->
        <div class="absolute -bottom-6 -left-6 -z-10 h-64 w-64 rounded-full bg-secondary-100/50 blur-3xl dark:bg-secondary-900/20"></div>
      </div>
    </section>

    <!-- Early Life -->
    <section class="mb-32 scroll-mt-24" id="early-life">
      <UiSectionHeader :title="$t('about.earlyLife.title')" :subtitle="$t('about.earlyLife.subtitle')" class="mb-16"/>
      
      <div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div class="order-2 space-y-12 lg:order-1">
             <div class="flex items-start gap-6">
                  <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/40 dark:text-secondary-400">
                      <Icon name="mage:light-bulb" size="28" />
                  </div>
                  <div>
                      <h3 class="text-2xl font-bold text-neutral-900 dark:text-white">{{ $t("about.earlyLife.content.title1") }}</h3>
                      <p class="mt-3 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">{{ $t("about.earlyLife.content.paragraph1") }}</p>
                  </div>
              </div>

              <div class="flex items-start gap-6">
                   <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/40 dark:text-secondary-400">
                      <Icon name="heroicons:academic-cap" size="28" />
                  </div>
                  <div>
                      <h3 class="text-2xl font-bold text-neutral-900 dark:text-white">{{ $t("about.earlyLife.content.title2") }}</h3>
                      <p class="mt-3 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">{{ $t("about.earlyLife.content.paragraph2") }}</p>
                  </div>
              </div>

              <div class="flex items-start gap-6">
                   <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/40 dark:text-secondary-400">
                      <Icon name="mage:chip" size="28" />
                  </div>
                  <div>
                      <h3 class="text-2xl font-bold text-neutral-900 dark:text-white">{{ $t("about.earlyLife.content.title3") }}</h3>
                      <p class="mt-3 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">{{ $t("about.earlyLife.content.paragraph3") }}</p>
                  </div>
              </div>
          </div>

          <div class="relative order-1 lg:order-2">
              <div class="group overflow-hidden rounded-3xl shadow-xl transition duration-500 hover:shadow-2xl">
                  <NuxtImg
                    sizes="100vw lg:600px"
                    src="/img/child.jpg"
                    class="h-auto w-full object-cover transition duration-700 group-hover:scale-105"
                    alt="Kindheit"
                  />
              </div>
              <div class="absolute -bottom-8 -right-8 hidden xl:block">
                  <div class="max-w-xs rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-md dark:bg-neutral-800/80">
                       <Icon name="fa6-solid:quote-left" size="32" class="mb-4 text-secondary-400/50" />
                       <p class="text-lg italic leading-relaxed text-neutral-700 dark:text-neutral-300">
                          {{ $t('about.earlyLife.content.quote') }}
                       </p>
                       <div class="mt-6 flex items-center justify-end gap-2 text-sm font-bold uppercase tracking-wider text-secondary-500">
                           <span class="h-px w-8 bg-secondary-200 dark:bg-secondary-800"></span>
                           2001
                       </div>
                  </div>
              </div>
              <!-- Mobile/Small Desktop Quote -->
               <div class="mt-8 border-l-4 border-secondary-400 pl-6 xl:hidden">
                    <p class="text-xl italic leading-relaxed text-neutral-700 dark:text-neutral-300">
                        "{{ $t('about.earlyLife.content.quote') }}"
                    </p>
               </div>
          </div>
      </div>
    </section>

    <!-- Career Path & Timeline -->
     <section class="mb-32 scroll-mt-24" id="career">
      <UiSectionHeader :title="$t('about.careerPath.title')" :subtitle="$t('about.careerPath.subtitle')" class="mb-16"/>
      
      <!-- Intro Grid for Career -->
      <div class="mb-20 grid gap-6 md:grid-cols-2">
         <div class="group rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm transition-all hover:border-secondary-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-secondary-900">
            <h3 class="mb-4 flex items-center text-xl font-bold text-neutral-900 dark:text-white">
                <Icon name="mage:color-swatch" class="mr-3 text-secondary-500 transition-transform group-hover:scale-110" size="24" />
                {{ $t("about.careerPath.content.title1") }}
            </h3>
            <p class="leading-relaxed text-neutral-600 dark:text-neutral-300">{{ $t("about.careerPath.content.paragraph1") }}</p>
         </div>
         <div class="group rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm transition-all hover:border-secondary-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-secondary-900">
             <h3 class="mb-4 flex items-center text-xl font-bold text-neutral-900 dark:text-white">
                <Icon name="mage:delivery-truck" class="mr-3 text-secondary-500 transition-transform group-hover:scale-110" size="24" />
                {{ $t("about.careerPath.content.title2") }}
            </h3>
            <p class="leading-relaxed text-neutral-600 dark:text-neutral-300">{{ $t("about.careerPath.content.paragraph2") }}</p>
         </div>
         <div class="group rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm transition-all hover:border-secondary-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-secondary-900">
             <h3 class="mb-4 flex items-center text-xl font-bold text-neutral-900 dark:text-white">
                <Icon name="mage:trophy" class="mr-3 text-secondary-500 transition-transform group-hover:scale-110" size="24" />
                {{ $t("about.careerPath.content.title3") }}
            </h3>
            <p class="leading-relaxed text-neutral-600 dark:text-neutral-300">{{ $t("about.careerPath.content.paragraph3") }}</p>
         </div>
         <div class="group rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm transition-all hover:border-secondary-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-secondary-900">
             <h3 class="mb-4 flex items-center text-xl font-bold text-neutral-900 dark:text-white">
                <Icon name="mage:link" class="mr-3 text-secondary-500 transition-transform group-hover:scale-110" size="24" />
                {{ $t("about.careerPath.content.title4") }}
            </h3>
            <p class="leading-relaxed text-neutral-600 dark:text-neutral-300">{{ $t("about.careerPath.content.paragraph4") }}</p>
         </div>
      </div>

      <div class="rounded-3xl bg-neutral-50/50 p-8 dark:bg-neutral-900/50 md:p-12">
          <BaseTimeline :items="timeline" />
      </div>
    </section>

    <!-- Interests -->
     <section class="mb-32 scroll-mt-24" id="interests">
        <UiSectionHeader :title="$t('interests.title')" :subtitle="$t('about.personalLife.subtitle')" class="mb-16"/>
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
             <UiCard v-for="(items, category) in interests" :key="category" class="flex flex-col p-8 transition-all hover:-translate-y-2 hover:shadow-xl">
                <div class="mb-6 flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/40 dark:text-secondary-400">
                        <Icon v-if="category === 'technology'" name="heroicons:code-bracket" size="24" />
                        <Icon v-else-if="category === 'culture'" name="heroicons:musical-note" size="24" />
                        <Icon v-else-if="category === 'health'" name="heroicons:heart" size="24" />
                        <Icon v-else-if="category === 'education'" name="heroicons:book-open" size="24" />
                    </div>
                    <h3 class="text-xl font-bold capitalize text-neutral-900 dark:text-white">{{ $t(`interests.${category}.title`) }}</h3>
                </div>
                <div class="flex flex-wrap gap-2">
                    <UiTag v-for="item in items" :key="item" class="bg-neutral-100 dark:bg-neutral-800/50">
                        {{ item }}
                    </UiTag>
                </div>
             </UiCard>
        </div>
     </section>

     <!-- Personal Life -->
     <section class="mb-32 scroll-mt-24" id="personal-life">
        <UiSectionHeader :title="$t('about.personalLife.title')" :subtitle="$t('about.personalLife.subtitle')" class="mb-16"/>
        
        <div class="mb-16 grid gap-12 lg:grid-cols-2">
            <div class="space-y-6">
                <p class="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">{{ $t("about.personalLife.content.paragraph1") }}</p>
                <p class="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">{{ $t("about.personalLife.content.paragraph2") }}</p>
            </div>
            <div class="space-y-6">
                <p class="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">{{ $t("about.personalLife.content.paragraph3") }}</p>
                <p class="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">{{ $t("about.personalLife.content.paragraph4") }}</p>
                <p class="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">{{ $t("about.personalLife.content.paragraph5") }}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
             <div class="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                 <NuxtImg
                    src="/img/IMG-20230618-WA0007.jpg"
                    class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    sizes="400px"
                    alt="Galerie Bild 1"
                 />
                 <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                     <div class="absolute bottom-6 left-6 right-6 text-white">
                         <div class="text-sm font-bold uppercase tracking-wider text-secondary-400">{{ $t("about.personalLife.content.picture1.caption") }}</div>
                         <div class="mt-1 text-xl font-bold">{{ $t("about.personalLife.content.picture1.text") }}</div>
                     </div>
                 </div>
             </div>

             <div class="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg md:-mt-12">
                  <NuxtImg
                    src="/img/2023-01-19.jpg"
                    class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    sizes="400px"
                    alt="Galerie Bild 2"
                 />
                 <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                     <div class="absolute bottom-6 left-6 right-6 text-white">
                         <div class="text-sm font-bold uppercase tracking-wider text-secondary-400">{{ $t("about.personalLife.content.picture2.caption") }}</div>
                         <div class="mt-1 text-xl font-bold">{{ $t("about.personalLife.content.picture2.text") }}</div>
                     </div>
                 </div>
             </div>

             <div class="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                  <NuxtImg
                    src="/img/business_atire.jpg"
                    class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    sizes="400px"
                    alt="Galerie Bild 3"
                 />
                 <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                     <div class="absolute bottom-6 left-6 right-6 text-white">
                         <div class="text-sm font-bold uppercase tracking-wider text-secondary-400">{{ $t("about.personalLife.content.picture3.caption") }}</div>
                         <div class="mt-1 text-xl font-bold">{{ $t("about.personalLife.content.picture3.text") }}</div>
                     </div>
                 </div>
             </div>
        </div>
     </section>

  </div>
</template>

<script lang="ts" setup>
import { timelineData } from '~/data/timeline.data';
import { personalData } from '~/data/personal.data';
import { interestsData } from '~/data/interests.data';

const { t, locale } = useI18n();
const route = useRoute();

useSeoMeta({
    title: t("navigation.about"),
    ogTitle: t("navigation.about"),
    description: t("about.subtitle"),
    ogDescription: t("about.subtitle"),
    ogUrl: route.fullPath,
    ogType: 'website',
    ogLocale: locale.value,
    twitterTitle: t("navigation.about"),
    twitterCard: 'summary_large_image',
    twitterDescription: t("about.subtitle"),
    robots: 'index, follow',
})

const timeline = timelineData(t)
const personal = personalData(t)
const interests = interestsData(t)
</script>