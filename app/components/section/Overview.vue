<template>
  <div id="overview" class="mb-24 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
    <UiCard class="col-span-1 flex flex-col gap-1 md:col-span-2">
      <UiCardContainer class="flex-col">
        <h3 class="text-3xl font-medium">{{ $t("home.overview.github.title") }}</h3>
        <p class="text-neutral-600 dark:text-neutral-400">{{ subtitle }}</p>
        <ClientOnly>
          <GithubChart :contributions="contributions" @displayed-weeks-count-changed="onDisplayedWeeksCountChanged" />
        </ClientOnly>
      </UiCardContainer>
    </UiCard >
    <UiCard class="group min-h-60 overflow-hidden !p-0">
      <div
:style="`background-image: url('${profilePicUrl}')`"
        class="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-110">
      </div>
    </UiCard >
    <UiCard class="col-span-1 flex flex-col">
      <UiCardContainer class="flex-col">
        <h3 class="text-3xl font-medium">{{ $t("home.overview.techstack.title") }}</h3>
        <p class="text-neutral-600 dark:text-neutral-400">{{ $t("home.overview.techstack.subtitle") }}</p>
        <TechstackList scroll :rows="3" :items="['Typescript', 'React', 'Git', 'Docker', 'Dart', 'Rust', 'Tailwind', 'Vue', 'Flutter', 'Node.js', 'Deno', 'Python', 'PostgreSQL', 'MongoDB', 'REST', 'GraphQL']" />
      </UiCardContainer>
    </UiCard >
    <UiCard class="col-span-1 flex flex-col">
      <UiCardContainer class="flex-col">
        <h3 class="text-3xl font-medium">{{ $t("home.overview.statistics.title") }}</h3>
        <p class="text-neutral-600 dark:text-neutral-400">{{ $t("home.overview.statistics.subtitle") }}</p>
        <stats />
      </UiCardContainer>
    </UiCard >
    <UiCard hover class="col-span-1 flex flex-col">
      <UiCardContainer class="flex-col">
        <h3 class="text-3xl font-medium">{{ $t("home.overview.searching.title") }}</h3>
        <p class="text-neutral-600 dark:text-neutral-400">{{ $t("home.overview.searching.subtitle") }}</p>
      </UiCardContainer>
    </UiCard >
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { contributions, fetchContributions } = useGitHubContributions()

onMounted(async () => {
  if (contributions.value.length === 0) {
    await fetchContributions();
  }
});

const $img = useImage()
const profilePicUrl = $img('/img/profile.jpg', { width: 800, quality: 100 })

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