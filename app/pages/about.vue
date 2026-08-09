<template>
  <div
    class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44"
  >
    <!-- Hero Section -->
    <section
      class="mb-32 flex flex-col items-center gap-12 lg:flex-row lg:items-start"
    >
      <div class="flex-1 space-y-8 text-center lg:text-left">
        <div>
          <h1
            class="text-5xl font-bold tracking-tight text-primary-900 sm:text-7xl dark:text-white"
          >
            {{ name }}
          </h1>
          <p
            class="mt-4 text-2xl font-medium text-secondary-500 dark:text-secondary-400"
          >
            {{ subtitle }}
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-3 lg:justify-start">
          <UiTag
            v-if="location"
            class="border-secondary-200 bg-secondary-50 px-3 py-1 text-secondary-700 dark:border-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300"
          >
            <Icon name="mage:map-marker" class="mr-1" /> {{ location }}
          </UiTag>
          <UiTag
            v-if="availabilityStatus"
            class="border-secondary-200 bg-secondary-50 px-3 py-1 text-secondary-700 dark:border-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300"
          >
            <Icon name="mage:briefcase" class="mr-1" /> {{ availabilityStatus }}
          </UiTag>
        </div>

        <p
          class="text-xl leading-relaxed text-primary-600 dark:text-primary-300"
        >
          {{ $t("about.intro_text") }}
        </p>

        <div class="flex justify-center pt-4 lg:justify-start">
          <SocialLinks />
        </div>
      </div>

      <div class="relative w-full max-w-md flex-1 lg:max-w-lg">
        <div
          class="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl transition duration-500 hover:scale-[1.02]"
        >
          <NuxtImg
            src="/img/profile.jpg"
            alt="Philipp Fleischer"
            class="h-full w-full object-cover"
            sizes="500px"
            placeholder
          />
        </div>
        <!-- Decorative element -->
        <div
          class="absolute -bottom-6 -left-6 -z-10 h-64 w-64 rounded-full bg-secondary-100/50 blur-3xl dark:bg-secondary-900/20"
        ></div>
      </div>
    </section>

    <!-- Early Life -->
    <section id="early-life" class="mb-32 scroll-mt-24">
      <UiSectionHeader
        :title="$t('about.earlyLife.title')"
        :subtitle="$t('about.earlyLife.subtitle', { location: birthLocation })"
        class="mb-16"
      />

      <div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div class="order-2 space-y-12 lg:order-1">
          <div class="flex items-start gap-6">
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/40 dark:text-secondary-400"
            >
              <Icon name="mage:light-bulb" size="28" />
            </div>
            <div>
              <h3 class="text-2xl font-bold text-primary-900 dark:text-white">
                {{ $t("about.earlyLife.content.title1") }}
              </h3>
              <p
                class="mt-3 text-lg leading-relaxed text-primary-600 dark:text-primary-300"
              >
                {{ $t("about.earlyLife.content.paragraph1") }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-6">
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/40 dark:text-secondary-400"
            >
              <Icon name="heroicons:academic-cap" size="28" />
            </div>
            <div>
              <h3 class="text-2xl font-bold text-primary-900 dark:text-white">
                {{ $t("about.earlyLife.content.title2") }}
              </h3>
              <p
                class="mt-3 text-lg leading-relaxed text-primary-600 dark:text-primary-300"
              >
                {{ $t("about.earlyLife.content.paragraph2") }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-6">
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/40 dark:text-secondary-400"
            >
              <Icon name="mage:chip" size="28" />
            </div>
            <div>
              <h3 class="text-2xl font-bold text-primary-900 dark:text-white">
                {{ $t("about.earlyLife.content.title3") }}
              </h3>
              <p
                class="mt-3 text-lg leading-relaxed text-primary-600 dark:text-primary-300"
              >
                {{ $t("about.earlyLife.content.paragraph3") }}
              </p>
            </div>
          </div>
        </div>

        <div class="relative order-1 lg:order-2">
          <div
            class="group overflow-hidden rounded-3xl shadow-xl transition duration-500 hover:shadow-2xl"
          >
            <NuxtImg
              sizes="100vw lg:600px"
              src="/img/child.jpg"
              class="h-auto w-full object-cover transition duration-700 group-hover:scale-105"
              alt="Kindheit"
            />
          </div>
          <div class="absolute -bottom-8 -right-8 hidden xl:block">
            <div
              class="max-w-xs rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-md dark:bg-primary-800/80"
            >
              <Icon
                name="fa6-solid:quote-left"
                size="32"
                class="mb-4 text-secondary-400/50"
              />
              <p
                class="text-lg italic leading-relaxed text-primary-700 dark:text-primary-300"
              >
                {{ $t("about.earlyLife.content.quote") }}
              </p>
              <div
                class="mt-6 flex items-center justify-end gap-2 text-sm font-bold uppercase tracking-wider text-secondary-500"
              >
                <span
                  class="h-px w-8 bg-secondary-200 dark:bg-secondary-800"
                ></span>
                2001
              </div>
            </div>
          </div>
          <!-- Mobile/Small Desktop Quote -->
          <div class="mt-8 border-l-4 border-secondary-400 pl-6 xl:hidden">
            <p
              class="text-xl italic leading-relaxed text-primary-700 dark:text-primary-300"
            >
              "{{ $t("about.earlyLife.content.quote") }}"
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Career Path & Timeline -->
    <section id="career" class="mb-32 scroll-mt-24">
      <UiSectionHeader
        :title="$t('about.careerPath.title')"
        :subtitle="$t('about.careerPath.subtitle')"
        class="mb-16"
      />

      <!-- Intro Grid for Career -->
      <div class="mb-20 grid gap-6 md:grid-cols-2">
        <div
          class="group rounded-2xl border border-primary-100 bg-white p-8 shadow-sm transition-all hover:border-secondary-200 hover:shadow-md dark:border-primary-800 dark:bg-primary-900 dark:hover:border-secondary-900"
        >
          <h3
            class="mb-4 flex items-center text-xl font-bold text-primary-900 dark:text-white"
          >
            <Icon
              name="mage:color-swatch"
              class="mr-3 text-secondary-500 transition-transform group-hover:scale-110"
              size="24"
            />
            {{ $t("about.careerPath.content.title1") }}
          </h3>
          <p class="leading-relaxed text-primary-600 dark:text-primary-300">
            {{ $t("about.careerPath.content.paragraph1") }}
          </p>
        </div>
        <div
          class="group rounded-2xl border border-primary-100 bg-white p-8 shadow-sm transition-all hover:border-secondary-200 hover:shadow-md dark:border-primary-800 dark:bg-primary-900 dark:hover:border-secondary-900"
        >
          <h3
            class="mb-4 flex items-center text-xl font-bold text-primary-900 dark:text-white"
          >
            <Icon
              name="mage:delivery-truck"
              class="mr-3 text-secondary-500 transition-transform group-hover:scale-110"
              size="24"
            />
            {{ $t("about.careerPath.content.title2") }}
          </h3>
          <p class="leading-relaxed text-primary-600 dark:text-primary-300">
            {{ $t("about.careerPath.content.paragraph2") }}
          </p>
        </div>
        <div
          class="group rounded-2xl border border-primary-100 bg-white p-8 shadow-sm transition-all hover:border-secondary-200 hover:shadow-md dark:border-primary-800 dark:bg-primary-900 dark:hover:border-secondary-900"
        >
          <h3
            class="mb-4 flex items-center text-xl font-bold text-primary-900 dark:text-white"
          >
            <Icon
              name="mage:trophy"
              class="mr-3 text-secondary-500 transition-transform group-hover:scale-110"
              size="24"
            />
            {{ $t("about.careerPath.content.title3") }}
          </h3>
          <p class="leading-relaxed text-primary-600 dark:text-primary-300">
            {{ $t("about.careerPath.content.paragraph3") }}
          </p>
        </div>
        <div
          class="group rounded-2xl border border-primary-100 bg-white p-8 shadow-sm transition-all hover:border-secondary-200 hover:shadow-md dark:border-primary-800 dark:bg-primary-900 dark:hover:border-secondary-900"
        >
          <h3
            class="mb-4 flex items-center text-xl font-bold text-primary-900 dark:text-white"
          >
            <Icon
              name="mage:link"
              class="mr-3 text-secondary-500 transition-transform group-hover:scale-110"
              size="24"
            />
            {{ $t("about.careerPath.content.title4") }}
          </h3>
          <p class="leading-relaxed text-primary-600 dark:text-primary-300">
            {{ $t("about.careerPath.content.paragraph4") }}
          </p>
        </div>
      </div>

      <div
        class="rounded-3xl bg-primary-50/50 p-8 md:p-12 dark:bg-primary-900/50"
      >
        <UiTimeline :items="timelineLocalized" />
      </div>
    </section>

    <!-- Interests -->
    <section id="interests" class="mb-32 scroll-mt-24">
      <UiSectionHeader
        :title="$t('interests.title')"
        :subtitle="$t('about.personalLife.subtitle')"
        class="mb-16"
      />
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <UiCard
          v-for="cat in interestCategoriesWithItems"
          :key="cat.id"
          class="flex flex-col p-8 transition-all hover:-translate-y-2 hover:shadow-xl"
        >
          <div class="mb-6 flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/40 dark:text-secondary-400"
            >
              <Icon v-if="cat.icon" :name="cat.icon" size="24" />
            </div>
            <h3
              class="text-xl font-bold capitalize text-primary-900 dark:text-white"
            >
              {{ localize(cat.name, locale) }}
            </h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <UiTag
              v-for="item in cat.items"
              :key="item.id"
              class="bg-primary-100 dark:bg-primary-800/50"
            >
              {{ localize(item.name, locale) }}
            </UiTag>
          </div>
        </UiCard>
      </div>
    </section>

    <!-- Personal Life -->
    <section id="personal-life" class="mb-32 scroll-mt-24">
      <UiSectionHeader
        :title="$t('about.personalLife.title')"
        :subtitle="$t('about.personalLife.subtitle')"
        class="mb-16"
      />

      <div class="mb-16 grid gap-12 lg:grid-cols-2">
        <div class="space-y-6">
          <p
            class="text-lg leading-relaxed text-primary-600 dark:text-primary-300"
          >
            {{ $t("about.personalLife.content.paragraph1") }}
          </p>
          <p
            class="text-lg leading-relaxed text-primary-600 dark:text-primary-300"
          >
            {{ $t("about.personalLife.content.paragraph2") }}
          </p>
        </div>
        <div class="space-y-6">
          <p
            class="text-lg leading-relaxed text-primary-600 dark:text-primary-300"
          >
            {{ $t("about.personalLife.content.paragraph3") }}
          </p>
          <p
            class="text-lg leading-relaxed text-primary-600 dark:text-primary-300"
          >
            {{ $t("about.personalLife.content.paragraph4") }}
          </p>
          <p
            class="text-lg leading-relaxed text-primary-600 dark:text-primary-300"
          >
            {{ $t("about.personalLife.content.paragraph5") }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div
          class="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg"
        >
          <NuxtImg
            src="/img/IMG-20230618-WA0007.jpg"
            class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            sizes="400px"
            alt="Galerie Bild 1"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <div class="absolute bottom-6 left-6 right-6 text-white">
              <div
                class="text-sm font-bold uppercase tracking-wider text-secondary-400"
              >
                {{ $t("about.personalLife.content.picture1.caption") }}
              </div>
              <div class="mt-1 text-xl font-bold">
                {{ $t("about.personalLife.content.picture1.text") }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg md:-mt-12"
        >
          <NuxtImg
            src="/img/2023-01-19.jpg"
            class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            sizes="400px"
            alt="Galerie Bild 2"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <div class="absolute bottom-6 left-6 right-6 text-white">
              <div
                class="text-sm font-bold uppercase tracking-wider text-secondary-400"
              >
                {{ $t("about.personalLife.content.picture2.caption") }}
              </div>
              <div class="mt-1 text-xl font-bold">
                {{ $t("about.personalLife.content.picture2.text") }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg"
        >
          <NuxtImg
            src="/img/business_atire.jpg"
            class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            sizes="400px"
            alt="Galerie Bild 3"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <div class="absolute bottom-6 left-6 right-6 text-white">
              <div
                class="text-sm font-bold uppercase tracking-wider text-secondary-400"
              >
                {{ $t("about.personalLife.content.picture3.caption") }}
              </div>
              <div class="mt-1 text-xl font-bold">
                {{ $t("about.personalLife.content.picture3.text") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type {
  DbTimelineEntry,
  DbInterestCategory,
  DbInterest,
} from "#shared/schemas/profile.schema";

const { t, locale } = useI18n();

const { profile, fetchProfile } = useProfile();

await callOnce("fetch-profile", fetchProfile);

const name = computed(() => profile.value?.name || "");
const subtitle = computed(() => localize(profile.value?.summary, locale.value));
const location = computed(() => {
  const city = profile.value?.city;
  const country = localize(profile.value?.country, locale.value);
  if (city && country) {
    return `${city}, ${country}`;
  }
  return "";
});
const availabilityStatus = computed(() =>
  localize(profile.value?.availabilityStatus, locale.value),
);

const birthLocation = computed(() => profile.value?.birthLocation || "");

useAppSeo({
  title: t("seo.about_title"),
  description: t("about.subtitle"),
  image: '/img/profile.jpg',
  type: "profile"
});

const { data: timelineData } = await useFetch<{ timeline: DbTimelineEntry[] }>(
  "/api/timeline",
);
const { data: categoriesData } = await useFetch<{
  categories: DbInterestCategory[];
}>("/api/interest-categories");
const { data: interestsData } = await useFetch<{ interests: DbInterest[] }>(
  "/api/interests",
);

const timelineLocalized = computed(() =>
  (timelineData.value?.timeline || []).map((item) => ({
    ...item,
    title: localize(item.title, locale.value),
    description: localize(item.description, locale.value),
    skills: (item.skills || []).map((s) => localize(s, locale.value)),
    icon: item.icon ?? undefined,
  })),
);

const interestCategoriesWithItems = computed(() => {
  const cats = categoriesData.value?.categories || [];
  const items = interestsData.value?.interests || [];
  return cats.map((cat) => ({
    ...cat,
    items: items.filter((i) => i.categoryId === cat.id),
  }));
});
</script>
