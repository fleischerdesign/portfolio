<template>
  <div id="overview" class="mb-32 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    
    <!-- 1. GITHUB ACTIVITY (Wide) -->
    <UiCard class="col-span-1 border-neutral-200/50 bg-white/50 p-0 dark:border-neutral-800/50 dark:bg-neutral-900/50 md:col-span-2">
      <UiCardContainer class="h-full flex-col justify-between p-8">
        <div class="flex items-start justify-between">
            <div class="flex flex-col gap-2">
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white">
                        <Icon name="mdi:github" size="24" />
                    </div>
                    <h3 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{{ $t("home.overview.github.title") }}</h3>
                </div>
                <p class="max-w-md text-lg text-neutral-500 dark:text-neutral-400">{{ subtitle }}</p>
            </div>
            <UiButton variant="glass" size="icon" to="https://github.com/fleischerdesign" target="_blank" external>
                <Icon name="heroicons:arrow-top-right-on-square" />
            </UiButton>
        </div>
        
        <div class="mt-8 overflow-hidden rounded-xl border border-neutral-200/50 bg-white/50 p-4 backdrop-blur-sm dark:border-neutral-800/50 dark:bg-black/20">
            <ClientOnly>
              <GithubChart :contributions="contributions" @displayed-weeks-count-changed="onDisplayedWeeksCountChanged" />
            </ClientOnly>
        </div>
      </UiCardContainer>
    </UiCard >

    <!-- 2. PROFILE PICTURE (Portrait Highlight) -->
    <UiCard class="group relative col-span-1 min-h-[340px] overflow-hidden border-0 bg-neutral-900 p-0 md:row-span-2">
      <NuxtImg
        src="/img/profile.jpg"
        class="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-110 group-hover:rotate-1"
        sizes="600px"
        placeholder
        alt="Profile Picture"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      
      <div class="absolute bottom-6 left-6 right-6">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Available for work
          </div>
      </div>
    </UiCard >

    <!-- 3. TECH STACK -->
    <UiCard class="col-span-1 overflow-hidden border-neutral-200/50 bg-white/50 dark:border-neutral-800/50 dark:bg-neutral-900/50">
      <UiCardContainer class="flex-col gap-6 p-8">
        <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                <Icon name="heroicons:square-3-stack-3d" size="24" />
            </div>
            <h3 class="text-xl font-bold text-neutral-900 dark:text-white">{{ $t("home.overview.techstack.title") }}</h3>
        </div>
        
        <TechstackList scroll :rows="3" :items="['Typescript', 'React', 'Git', 'Docker', 'Dart', 'Rust', 'Tailwind', 'Vue', 'Flutter', 'Node.js', 'Deno', 'Python', 'PostgreSQL', 'MongoDB', 'REST', 'GraphQL']" />
      </UiCardContainer>
    </UiCard >

    <!-- 4. STATISTICS -->
    <UiCard class="col-span-1 border-neutral-200/50 bg-white/50 dark:border-neutral-800/50 dark:bg-neutral-900/50">
      <UiCardContainer class="flex-col gap-6 p-8">
        <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                <Icon name="heroicons:presentation-chart-line" size="24" />
            </div>
            <h3 class="text-xl font-bold text-neutral-900 dark:text-white">{{ $t("home.overview.statistics.title") }}</h3>
        </div>
        <BaseStats />
      </UiCardContainer>
    </UiCard >

    <!-- 5. JOB SEARCH (Call to Action) -->
    <UiCard 
        interactive 
        class="group relative col-span-1 overflow-hidden border-secondary-500/20 bg-secondary-50/50 dark:border-secondary-500/20 dark:bg-secondary-900/20 md:col-span-2 lg:col-span-2"
    >
      <!-- Animated Background Mesh -->
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:20px_20px] opacity-50 transition-opacity group-hover:opacity-100"></div>
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-secondary-500/10 blur-[80px] transition-all duration-500 group-hover:bg-secondary-500/20"></div>

      <UiCardContainer class="flex-col items-start gap-4 p-10 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
                <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-500 text-white shadow-lg shadow-secondary-500/30">
                    <Icon name="mage:briefcase" size="20" />
                </span>
                <h3 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{{ $t("home.overview.searching.title") }}</h3>
            </div>
            <p class="max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">{{ $t("home.overview.searching.subtitle") }}</p>
        </div>
        
        <div class="flex shrink-0 items-center gap-4">
            <NuxtLink :to="$localePath('/contact')">
                <UiButton variant="secondary" size="lg" class="shadow-xl shadow-secondary-500/20 transition-all hover:scale-105 hover:shadow-secondary-500/30">
                    Get in touch
                    <template #icon-right><Icon name="mage:message-round" /></template>
                </UiButton>
            </NuxtLink>
        </div>
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