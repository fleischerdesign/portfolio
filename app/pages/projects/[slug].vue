<template>
  <div class="relative overflow-hidden">
    
    <!-- BACKGROUND ATMOSPHERE -->
    <div class="absolute inset-0 pointer-events-none -z-10">
        <div class="absolute -right-[10%] top-0 h-[700px] w-[700px] rounded-full bg-secondary-500/10 blur-[150px] dark:bg-secondary-500/10"></div>
        <div class="absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-secondary-400/5 blur-[120px]"></div>
        <div class="absolute inset-0 opacity-[0.05] mix-blend-overlay" 
             style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.99%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E'); background-size: 150px 150px;">
        </div>
    </div>

    <div class="container mx-auto max-w-screen-xl px-4 py-16 md:px-8">
      
      <article v-if="project" class="flex flex-col items-start">
        
        <!-- 1. HEADER (Streamlined) -->
        <header class="mb-12 flex w-full flex-col gap-8">
            <!-- Breadcrumb -->
            <NuxtLink :to="$localePath('/projects')" class="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:text-secondary-500">
                <Icon name="heroicons:arrow-left" class="transition-transform group-hover:-translate-x-1" />
                Back to Projects
            </NuxtLink>

            <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div class="flex flex-col gap-4">
                    <h1 class="max-w-4xl text-5xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-6xl lg:text-7xl">
                        {{ project.title }}
                    </h1>
                    <p class="max-w-2xl text-2xl leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {{ project.subtitle }}
                    </p>
                </div>

                <!-- Actions -->
                <div class="flex gap-4">
                    <UiButton variant="secondary" size="lg" class="shadow-lg shadow-secondary-500/20">
                        Besuchen
                        <template #icon-right><Icon name="heroicons:arrow-top-right-on-square" /></template>
                    </UiButton>
                    <UiButton variant="glass" size="lg">
                        GitHub
                        <template #icon-right><Icon name="mdi:github" /></template>
                    </UiButton>
                </div>
            </div>
        </header>


        <!-- 2. HERO IMAGE (With Integrated Icon Badge) -->
        <div class="group relative mb-20 w-full overflow-hidden rounded-[2.5rem] border border-neutral-200/50 bg-neutral-900 shadow-2xl dark:border-neutral-800/50">
            <!-- Ambient Glow -->
            <div class="pointer-events-none absolute -right-20 -top-20 z-10 h-96 w-96 rounded-full bg-secondary-500/10 blur-[100px] transition-all duration-700 group-hover:bg-secondary-500/20"></div>
            
            <NuxtImg
                :src="project.image?.src"
                :alt="project.title"
                sizes="100vw lg:1400px"
                class="aspect-video w-full object-cover transition duration-1000 group-hover:scale-105"
                placeholder
            />
            
            <!-- Bottom Gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent"></div>

            <!-- FLOATING GLASS INFO BADGE -->
            <div class="absolute bottom-8 left-8 z-20 flex items-center gap-6 md:bottom-12 md:left-12 transition-transform duration-500 group-hover:-translate-y-2">
                <!-- Icon Box -->
                <div v-if="project.icon" class="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl transition-all duration-500 group-hover:border-secondary-500/40 group-hover:bg-secondary-500/10">
                     <Icon 
                        :name="project.icon" 
                        mode="svg"
                        class="h-12 w-12 fill-white text-white drop-shadow-lg transition-colors duration-500 [&>g]:fill-white group-hover:fill-secondary-400 group-hover:text-secondary-400 group-hover:[&>g]:fill-secondary-400" 
                     />
                </div>
                
                <!-- Project Context Info -->
                <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                        <span class="flex h-6 px-2 items-center justify-center rounded-md border border-white/20 bg-black/30 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                            {{ new Date(project.date).getFullYear() }}
                        </span>
                        <span v-if="project.published" class="flex h-6 px-2 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/20 text-xs font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
                            Live
                        </span>
                    </div>
                    <span class="text-2xl font-bold text-white">{{ project.category }}</span>
                </div>
            </div>
        </div>


        <!-- 3. MAIN CONTENT GRID -->
        <div class="grid w-full grid-cols-1 gap-16 lg:grid-cols-[1fr_350px]">
            
            <!-- LEFT COLUMN -->
            <div class="flex flex-col gap-16">
                <!-- Case Study Content -->
                <section>
                    <UiSectionHeader title="Case Study" class="!mb-8" />
                    <div class="prose prose-lg prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-secondary-500 prose-a:no-underline hover:prose-a:underline prose-img:rounded-3xl prose-img:shadow-2xl">
                        <ContentRenderer :value="project" />
                    </div>
                </section>

                <!-- Tech Stack -->
                <section>
                    <UiSectionHeader title="Technologies Used" class="!mb-8" />
                    <TechstackList :items="project.techstack || []" :rows="2" />
                </section>
            </div>


            <!-- RIGHT COLUMN: Sidebar (Sticky) -->
            <aside class="flex flex-col gap-8">
                <div class="sticky top-24 flex flex-col gap-8">
                    
                    <!-- Key Facts -->
                    <UiCard class="p-8">
                        <h3 class="mb-6 text-xs font-bold uppercase tracking-widest text-secondary-500">Project Details</h3>
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
                            <Icon name="mage:exclamation-circle" class="text-amber-500" size="16" /> Challenges
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
                            <Icon name="heroicons:check-circle" class="text-secondary-500" size="16" /> Key Features
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
const { data: project } = await useAsyncData(() => {
    return queryCollection("projects")
        .where('locale', '=', locale.value)
        .where("slug", "=", route.params.slug).first()
})
const formattedDate = computed(() => project.value ? formatDate(project.value.date) : '')

useSeoMeta({
    title: project.value?.title || 'Project Post',
    ogTitle: project.value?.title || 'Blog Post',
    description: project.value?.subtitle || 'Blog Post Description',
    ogDescription: project.value?.subtitle || 'Blog Post Description',
    ogUrl: route.fullPath,
    ogType: 'website',
    ogLocale: locale.value,
    twitterTitle: project.value?.title || 'Blog Post',
    twitterCard: 'summary_large_image',
    twitterDescription: project.value?.subtitle || 'Blog Post Description',
    robots: 'index, follow',
})

if (!project.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Project Not Found'
    })
}

const details = [
  { label: t('project.category'), value: project?.value.category },
  { label: t('project.date'), value: formattedDate },
  { 
    label: t('project.state.title'), 
    value: project?.value.published ? t('project.state.published') : t('project.state.unpublished')
  }
]
</script>