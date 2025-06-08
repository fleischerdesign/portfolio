<template>
  <div class="container max-w-screen-xl">
    <div>
      <div class="min-h-screen flex items-center 2xl:min-h-[600px]">
        <div class="flex flex-col items-start gap-4">
          <NowIndicator />
          <h1 class="text-5xl font-semibold">{{ $t("home.hero.greeting") }}</h1>
          <p class="dark:text-neutral-400 text-neutral-600 w-full lg:w-2/3">{{ $t("home.hero.summary") }}</p>
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
            <a class="flex my-auto" href="#overview">
              <Icon name="mage:arrow-down" size="30" class="animate-pulse hover:animate-none" />
            </a>
          </div>
        </div>
      </div>
      <div id="overview" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-24">
        <Card class="flex flex-col col-span-1 md:col-span-2 gap-1">
          <CardContainer class="flex-col">
            <h3 class="text-3xl font-medium">{{ $t("home.overview.github.title") }}</h3>
            <p class="dark:text-neutral-400 text-neutral-600">{{ subtitle }}</p>
            <ClientOnly>
              <ContributionChart :contributions="contributions"
                @displayedWeeksCountChanged="onDisplayedWeeksCountChanged" />
            </ClientOnly>
          </CardContainer>
        </Card>
        <Card class="!p-0 overflow-hidden min-h-60 group">
          <div :style="`background-image: url('${profilePicUrl}')`"
            class="bg-center bg-cover w-full h-full transition duration-500 group-hover:scale-110">
          </div>
        </Card>
        <Card class="flex flex-col col-span-1">
          <CardContainer class="flex-col">
            <h3 class="text-3xl font-medium">{{ $t("home.overview.techstack.title") }}</h3>
            <p class="dark:text-neutral-400 text-neutral-600">{{ $t("home.overview.techstack.subtitle") }}</p>
            <div class="flex flex-wrap gap-2">
              <Tag>
                <Icon name="lineicons:typescript" size="20" /><span>TypeScript</span>
              </Tag>
              <Tag>
                <Icon name="lineicons:react" size="20" /><span>React</span>
              </Tag>
              <Tag>
                <Icon name="lineicons:git" size="20" /><span>Git</span>
              </Tag>
              <Tag>
                <Icon name="lineicons:docker" size="20" /><span>Docker</span>
              </Tag>
              <Tag>
                <Icon name="gravity-ui:target-dart" size="20" /><span>Dart</span>
              </Tag>
              <Tag>
                <Icon name="teenyicons:rust-outline" size="20" /><span>Rust</span>
              </Tag>
              <Tag>
                <Icon name="lineicons:tailwindcss" size="20" /><span>Tailwind</span>
              </Tag>
              <Tag>
                <Icon name="flowbite:vue-solid" size="20" /><span>Vue</span>
              </Tag>
              <Tag>
                <Icon name="material-symbols:flutter" size="20" /><span>Flutter</span>
              </Tag>
            </div>
          </CardContainer>
        </Card>
        <Card class="flex flex-col col-span-1">
          <CardContainer class="flex-col">
            <h3 class="text-3xl font-medium">{{ $t("home.overview.statistics.title") }}</h3>
            <p class="dark:text-neutral-400 text-neutral-600">{{ $t("home.overview.statistics.subtitle") }}</p>
            <stats />
          </CardContainer>
        </Card>
        <Card hover class="flex flex-col col-span-1">
          <CardContainer class="flex-col">
            <h3 class="text-3xl font-medium">{{ $t("home.overview.searching.title") }}</h3>
            <p class="dark:text-neutral-400 text-neutral-600">{{ $t("home.overview.searching.subtitle") }}</p>
          </CardContainer>
        </Card>
      </div>
      <div class="mb-24">
        <HeadingSection :title="$t('home.projects.title')" :subtitle="$t('home.projects.subtitle')" link="/projects" />
        <div class="grid grid-cols-1 gap-3 mt-4">
          <Card hover class="group h-60 overflow-hidden">
            <div class="w-1/3 overflow-hidden">
              <NuxtImg sizes="800px" src="/img/profile.jpg"
                class="h-full w-full object-cover group-hover:scale-110 transition" />
            </div>
            <CardContainer class="flex-col">
              <h3 class="text-3xl font-medium">Junction</h3>
              <p class="dark:text-neutral-400 text-neutral-600">One integration, structured patient data, dedicated
                support. Minimal
                operational
                headaches for users with whatever.</p>
            </CardContainer>
          </Card>
          <Card hover class="group h-60 overflow-hidden">
            <div class="w-1/3 overflow-hidden">
              <img src="/img/profile.jpg" class="h-full w-full object-cover group-hover:scale-110 transition" />
            </div>
            <CardContainer class="flex-col">
              <h3 class="text-3xl font-medium">Junction</h3>
              <p class="dark:text-neutral-400 text-neutral-600">One integration, structured patient data, dedicated
                support. Minimal
                operational
                headaches for users with whatever.</p>
            </CardContainer>
          </Card>
          <Card hover class="group h-60 overflow-hidden">
            <div class="w-1/3 overflow-hidden">
              <img src="/img/profile.jpg" class="h-full w-full object-cover group-hover:scale-110 transition" />
            </div>
            <CardContainer class="flex-col">
              <h3 class="text-3xl font-medium">Junction</h3>
              <p class="dark:text-neutral-400 text-neutral-600">One integration, structured patient data, dedicated
                support. Minimal
                operational
                headaches for users with whatever.</p>
            </CardContainer>
          </Card>
        </div>
      </div>
      <div class="mb-24">
        <HeadingSection :title="$t('home.blog.title')" :subtitle="$t('home.blog.subtitle')" link="/blog" />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          <BlogPostCard v-for="(post, index) in data" :key="index" :post="post" />
        </div>
      </div>
      <div class="mb-24">
        <HeadingSection :title="$t('home.contact.title')" :subtitle="$t('home.contact.subtitle')" link="/contact" />
        <ContactForm class="mt-4" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { locale } = useI18n();
const { t } = useI18n();
const route = useRoute();
const { contributions, fetchContributions } = useGitHubContributions()

onMounted(async () => {
  if (contributions.value.length === 0) {
    await fetchContributions();
  }
});

useSeoMeta({
  title: t("navigation.home"),
  ogTitle: t("navigation.home"),
  description: t("home.hero.summary"),
  ogDescription: t("home.hero.summary"),
  ogImage: 'https://example.com/image.png',
  ogUrl: route.fullPath,
  ogType: 'website',
  ogLocale: locale.value,
  twitterTitle: t("navigation.home"),
  twitterCard: 'summary_large_image',
  twitterDescription: t("home.hero.summary"),
  twitterImage: 'https://example.com/image.png',
  robots: 'index, follow',
})

const $img = useImage()
const profilePicUrl = $img('/img/profile.jpg', { width: 800, quality: 100 })

const { data } = await useAsyncData(route.path, () => {
  return queryCollection('posts')
    .where('locale', '=', locale.value)
    .select('title', 'date', 'description', "image", "slug", "readingTime")
    .limit(3)
    .all();
});

const displayedWeeks = ref(0);

const subtitle = computed(() => {
  if (displayedWeeks.value === 52) {
    return t("home.overview.github.subtitle.year");
  } else if (displayedWeeks.value > 4 && displayedWeeks.value < 52) {
    const months = Math.round(displayedWeeks.value / 4);
    return t("home.overview.github.subtitle.months", { count: months });
  } else if (displayedWeeks.value <= 4 && displayedWeeks.value > 1) {
    return t("home.overview.github.subtitle.weeks", { count: displayedWeeks.value });
  } else if (displayedWeeks.value === 1) {
    return t("home.overview.github.subtitle.week");
  } else {
    return t("home.overview.github.subtitle.overview");
  }
});

function onDisplayedWeeksCountChanged(count: number) {
  displayedWeeks.value = count;
}
</script>