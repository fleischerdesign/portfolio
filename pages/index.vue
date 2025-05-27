<template>
  <div class="container">
    <div>
      <div class="min-h-screen flex items-center 2xl:min-h-[600px]">
        <div class="flex flex-col items-start gap-4">
          <Chip>
            <svg class="inline overflow-visible m-auto" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
              <circle class="drop-shadow-emit fill-green-400" r="8" cx="8" cy="8" />
              <circle class="drop-shadow-emit animate-ping origin-center fill-green-400" r="8" cx="8" cy="8" />
            </svg><span>{{ $t("home.hero.status.programming") }}</span>
          </Chip>
          <h1 class="text-5xl font-semibold">{{ $t("home.hero.greeting") }}</h1>
          <p class="text-neutral-400 w-full lg:w-2/3">{{ $t("home.hero.summary") }}</p>
          <div class="flex gap-3 w-full">
            <Button href="https://linkedin.com/" target="_blank">
              <Icon name="mdi:linkedin" size="30" />
            </Button>
            <Button href="https://github.com/fleischerdesign" target="_blank">
              <Icon name="mdi:github" size="30" />
            </Button>
            <Button href="https://instagram.com/fleischer.design/" target="_blank">
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
            <p class="text-neutral-400">{{ subtitle }}</p>
            <ContributionChart :contributions="contributions"
              @displayedWeeksCountChanged="onDisplayedWeeksCountChanged" />
          </CardContainer>
        </Card>
        <Card class="!p-0 overflow-hidden min-h-60 group">
          <div
            class="!bg-[url(/img/profile.jpg)] bg-center bg-cover w-full h-full opacity-80 hover:opacity-100 transition group-hover:scale-110">
          </div>
        </Card>
        <Card class="flex flex-col col-span-1">
          <CardContainer class="flex-col">
            <h3 class="text-3xl font-medium">{{ $t("home.overview.techstack.title") }}</h3>
            <p class="text-neutral-400">{{ $t("home.overview.techstack.subtitle") }}</p>
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
            <p class="text-neutral-400">{{ $t("home.overview.statistics.subtitle") }}</p>
          </CardContainer>
        </Card>
        <Card class="flex flex-col col-span-1">
          <CardContainer class="flex-col">
            <h3 class="text-3xl font-medium">{{ $t("home.overview.searching.title") }}</h3>
            <p class="text-neutral-400">{{ $t("home.overview.searching.subtitle") }}</p>
          </CardContainer>
        </Card>
      </div>
      <div class="mb-24">
        <div class="flex flex-col gap-4">
          <NuxtLink to="/projects" class="self-start"><h1 class="text-5xl font-semibold">{{ $t("home.projects.title") }}</h1></NuxtLink>
          <p class="text-neutral-400 w-full lg:w-2/3">{{ $t("home.projects.subtitle") }}</p>
        </div>
        <div class="grid grid-cols-1 gap-3 mt-4">
          <Card class="group h-60 overflow-hidden">
            <div class="w-1/3 overflow-hidden">
              <img src="/img/profile.jpg"
                class="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition" />
            </div>
            <CardContainer class="flex-col">
              <h3 class="text-3xl font-medium">Junction</h3>
              <p class="text-neutral-400">One integration, structured patient data, dedicated support. Minimal
                operational
                headaches for users with whatever.</p>
            </CardContainer>
          </Card>
          <Card class="group h-60 overflow-hidden">
            <div class="w-1/3 overflow-hidden">
              <img src="/img/profile.jpg"
                class="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition" />
            </div>
            <CardContainer class="flex-col">
              <h3 class="text-3xl font-medium">Junction</h3>
              <p class="text-neutral-400">One integration, structured patient data, dedicated support. Minimal
                operational
                headaches for users with whatever.</p>
            </CardContainer>
          </Card>
          <Card class="group h-60 overflow-hidden">
            <div class="w-1/3 overflow-hidden">
              <img src="/img/profile.jpg"
                class="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition" />
            </div>
            <CardContainer class="flex-col">
              <h3 class="text-3xl font-medium">Junction</h3>
              <p class="text-neutral-400">One integration, structured patient data, dedicated support. Minimal
                operational
                headaches for users with whatever.</p>
            </CardContainer>
          </Card>
        </div>
      </div>
      <div class="mb-24">
        <div class="flex flex-col gap-4">
          <NuxtLink :to="$localePath('/blog')" class="self-start"><h1 class="text-5xl font-semibold">{{ $t("home.blog.title") }}</h1></NuxtLink>
          <p class="text-neutral-400 w-full lg:w-2/3">{{ $t("home.blog.subtitle") }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          <BlogPostCard v-for="(post, index) in data" :key="index" :post="post" />
        </div>
      </div>
      <div class="mb-24">
        <div class="flex flex-col gap-4">
          <NuxtLink :to="$localePath('/contact')" class="self-start"><h1 class="text-5xl font-semibold">{{ $t("home.contact.title") }}</h1></NuxtLink>
          <p class="text-neutral-400 w-full lg:w-2/3">{{ $t("home.contact.subtitle") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('posts')
    .select('title', 'date', 'description', "image", "slug", "readingTime")
    .limit(3)
    .all();
});


const contributions = ref(generateDemoContributions());
const displayedWeeks = ref(0);

const { t } = useI18n();
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

function generateDemoContributions() {
  const demoContributions = [];
  const today = new Date();

  for (let i = 360; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    demoContributions.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 15),
    });
  }
  return demoContributions;
}

function onDisplayedWeeksCountChanged(count: number) {
  displayedWeeks.value = count;
}
</script>