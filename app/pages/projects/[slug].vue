
<template>
  <div class="relative overflow-hidden flex-1 w-full">
    
    <!-- BACKGROUND ATMOSPHERE -->
    <div class="absolute inset-0 pointer-events-none -z-10">
        <div class="absolute -right-[10%] top-0 h-[700px] w-[700px] rounded-full bg-secondary-500/10 blur-[150px] dark:bg-secondary-500/10"></div>
        <div class="absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-secondary-400/5 blur-[120px]"></div>
        <div class="absolute inset-0 opacity-[0.05] mix-blend-overlay" 
             style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.99%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E'); background-size: 150px 150px;">
        </div>
    </div>

    <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
      
      <article v-if="project" class="flex flex-col items-start">
        
        <!-- 1. HEADER -->
        <header class="mb-16 flex w-full flex-col gap-10">
            <UiBackButton :to="$localePath('/projects')" />

            <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <UiSectionHeader 
                    :level="1" 
                    :title="project.title" 
                    :subtitle="project.subtitle" 
                    variant="glow"
                    class="!mb-0 flex-1"
                >
                    <template #prefix>
                        <div v-if="project.icon" class="relative group">
                            <div class="absolute -inset-2 rounded-3xl bg-secondary-500/20 blur-xl transition duration-500 group-hover:bg-secondary-500/30"></div>
                            
                            <div class="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/50 bg-gradient-to-br from-white/80 to-white/40 shadow-xl backdrop-blur-xl transition-all duration-500 group-hover:scale-105 dark:border-white/10 dark:from-white/10 dark:to-white/5">
                                <Icon 
                                    :name="project.icon" 
                                    size="32" 
                                    mode="svg"
                                    class="text-secondary-600 transition-colors duration-500 group-hover:text-secondary-500 dark:text-secondary-400 dark:group-hover:text-secondary-300 [&_*]:!fill-current" 
                                />
                            </div>
                        </div>
                    </template>
                </UiSectionHeader>

                <!-- Actions -->
                <div class="flex gap-4">
                    <UiButton 
                        v-if="project.projectUrl"
                        :to="project.projectUrl"
                        :external="true"
                        target="_blank"
                        variant="secondary" 
                        size="lg" 
                        class="shadow-lg shadow-secondary-500/20"
                    >
                        {{ $t("project.visit_live") }}
                        <template #icon-right><Icon name="heroicons:arrow-top-right-on-square" /></template>
                    </UiButton>
                    <UiButton 
                        v-if="project.repoUrl"
                        :to="project.repoUrl"
                        :external="true"
                        target="_blank"
                        variant="glass" 
                        size="lg"
                    >
                        {{ $t("project.github") }}
                        <template #icon-right><Icon name="mdi:github" /></template>
                    </UiButton>
                </div>
            </div>
        </header>


        <!-- 2. HERO IMAGE -->
        <div class="group relative mb-20 w-full overflow-hidden rounded-[2.5rem] border border-neutral-200/50 bg-neutral-900 shadow-2xl dark:border-neutral-800/50">
            <div class="pointer-events-none absolute -right-20 -top-20 z-10 h-96 w-96 rounded-full bg-secondary-500/10 blur-[100px] transition-all duration-700 group-hover:bg-secondary-500/20"></div>
            
            <NuxtImg
                v-if="project.coverImage"
                :src="project.coverImage"
                :alt="project.coverImageAlt || project.title"
                sizes="100vw lg:1400px"
                class="aspect-video w-full object-cover transition duration-1000 group-hover:scale-105"
                placeholder
            />
            
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent"></div>

            <div class="absolute bottom-8 left-8 z-20 flex items-center gap-6 md:bottom-12 md:left-12 transition-transform duration-500 group-hover:-translate-y-2">
                <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                        <span v-if="project.publishedAt" class="flex h-6 px-2 items-center justify-center rounded-md border border-white/20 bg-black/30 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                            {{ new Date(project.publishedAt).getFullYear() }}
                        </span>
                        <span v-if="project.status === 'published'" class="flex h-6 px-2 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/20 text-xs font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
                            Live
                        </span>
                    </div>
                    <span v-if="project.category" class="text-2xl font-bold text-white">{{ project.category.name }}</span>
                </div>
            </div>
        </div>


        <!-- 3. MAIN CONTENT GRID -->
        <div class="grid w-full grid-cols-1 gap-16 lg:grid-cols-[1fr_350px]">
            
            <!-- LEFT COLUMN -->
            <div class="flex flex-col gap-16">
                <section>
                    <UiSectionHeader :title="$t('project.case_study')" class="!mb-8" />
                    <div 
                      class="prose prose-lg prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-secondary-500 prose-a:no-underline hover:prose-a:underline prose-img:rounded-3xl prose-img:shadow-2xl"
                      v-html="renderedBody"
                    >
                    </div>
                </section>

                <section v-if="project.techstack?.length">
                    <UiSectionHeader :title="$t('project.technologies')" class="!mb-8" />
                    <TechstackList :items="project.techstack.map(t => t.name)" :rows="2" />
                </section>
            </div>


            <!-- RIGHT COLUMN: Sidebar (Sticky) -->
            <aside class="flex flex-col gap-8">
                <div class="sticky top-24 flex flex-col gap-8">
                    
                    <!-- Key Facts -->
                    <UiCard class="p-8">
                        <h3 class="mb-6 text-xs font-bold uppercase tracking-widest text-secondary-500">{{ $t("project.details") }}</h3>
                        <div class="flex flex-col gap-6">
                            <div v-for="item in details" :key="item.label" class="flex flex-col gap-1">
                                <span class="text-sm font-medium text-neutral-500 dark:text-neutral-400">{{ item.label }}</span>
                                <span class="text-lg font-bold text-neutral-900 dark:text-white">{{ item.value }}</span>
                            </div>
                        </div>
                    </UiCard>

                    <!-- Challenges -->
                    <UiCard v-if="project.challenges?.length" class="p-8">
                        <h3 class="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
                            <Icon name="mage:exclamation-circle" class="text-amber-500" size="16" /> {{ $t("project.challenges") }}
                        </h3>
                        <ul class="flex flex-col gap-4">
                            <li v-for="challenge in project.challenges" :key="challenge" class="flex gap-3 text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-300">
                                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"></span>
                                {{ challenge }}
                            </li>
                        </ul>
                    </UiCard>

                    <!-- Features -->
                    <UiCard v-if="project.features?.length" class="p-8">
                        <h3 class="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary-500">
                            <Icon name="heroicons:check-circle" class="text-secondary-500" size="16" /> {{ $t("project.key_features") }}
                        </h3>
                        <ul class="flex flex-col gap-4">
                            <li v-for="feature in project.features" :key="feature" class="flex gap-3 text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-300">
                                <Icon name="heroicons:check" class="mt-0.5 shrink-0 text-secondary-500" size="16" />
                                {{ feature }}
                            </li>
                        </ul>
                    </UiCard>

                </div>
            </aside>

        </div>

      </article>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t, locale } = useI18n()
const route = useRoute()
const { render } = useMarkdown()

const { data } = await useFetch(`/api/projects/${route.params.slug}`, {
    query: { locale: locale.value }
})

const project = computed(() => data.value?.project)

if (!project.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Project Not Found'
    })
}

const renderedBody = computed(() => project.value ? render(project.value.body) : '')
const formattedDate = computed(() => project.value?.publishedAt ? formatDate(project.value.publishedAt) : '')

useSeoMeta({
    title: project.value?.title || 'Project',
    ogTitle: project.value?.title || 'Project',
    description: project.value?.subtitle || '',
    ogDescription: project.value?.subtitle || '',
    ogUrl: route.fullPath,
    ogType: 'website',
    ogLocale: locale.value,
    twitterTitle: project.value?.title || 'Project',
    twitterCard: 'summary_large_image',
    twitterDescription: project.value?.subtitle || '',
    robots: 'index, follow',
})

const details = computed(() => [
  { label: t('project.category'), value: project.value?.category?.name },
  { label: t('project.date'), value: formattedDate.value },
  { 
    label: t('project.state.title'), 
    value: project.value?.status === 'published' ? t('project.state.published') : t('project.state.unpublished')
  }
])
</script>
