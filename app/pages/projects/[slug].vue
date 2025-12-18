<template>
    <div class="container mx-auto max-w-screen-xl py-16">
        <div class="mb-24">
              <UiSectionHeader :level="1" :title="project!.title" :subtitle="project!.subtitle" />
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <UiCard class="relative col-span-1 row-span-2 overflow-hidden md:col-span-2">
                    <NuxtImg
sizes="100vw sm:100vw" :placeholder="[50, 25, 75, 5]" :src="project?.image?.src"
                        class="aspect-[4/3] h-full w-full object-cover" :alt="project?.title || 'Project Background'" />
                <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
		  <Icon :name="'logo:'+project!.slug" class="h-40 w-40 fill-emerald-400 [&>g]:fill-emerald-400 drop-shadow-xl" mode="svg" />
                </div>
                </UiCard >
                <UiCard >
                    <UiCardContainer class="flex h-full flex-col gap-2">
                        <h3 class="text-3xl font-medium">Details</h3>
                        <div class="flex flex-col gap-2">
                            <div v-for="item in details" :key="item.label" class="flex items-center justify-between rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900">
                                <span class="text-neutral-600 dark:text-neutral-300">{{ item.label }}:</span>
                                <span class="font-medium text-neutral-800 dark:text-white">{{ item.value }}</span>
                            </div>
                        </div>
                    </UiCardContainer>
                </UiCard >
                <UiCard >
                    <UiCardContainer class="flex flex-col gap-2">
                        <h3 class="text-3xl font-medium">{{ $t("home.overview.techstack.title") }}</h3>
                        <TechstackList :items="project?.techstack" />
                    </UiCardContainer>
                </UiCard >
                <UiCard >
                    <UiCardContainer class="flex h-full flex-col gap-2">
                        <h3 class="text-3xl font-medium">{{ $t("project.challenges") }}</h3>
                        <ul class="space-y-2">
                            <li
v-for="challenge in project?.challenges?.slice(0, 2)" :key="challenge"
                                class="flex items-start gap-2">
                                <Icon
name="mage:exclamation-circle"
                                    class="mt-0.5 flex-shrink-0 text-secondary-400" size="18"/>
                                <span>{{ challenge }}</span>
                            </li>
                        </ul>
                    </UiCardContainer>
                </UiCard >
                <UiCard >
                    <UiCardContainer class="flex h-full flex-col gap-2">
                        <h3 class="text-3xl font-medium">Features</h3>
                        <ul class="space-y-2">
                            <li
v-for="feature in project?.features?.slice(0, 3)" :key="feature"
                                class="flex items-start gap-2">
                                <Icon
name="heroicons:check-circle"
                                    class="mt-0.5 flex-shrink-0 text-secondary-400" size="18"/>
                                <span>{{ feature }}</span>
                            </li>
                        </ul>
                    </UiCardContainer>
                </UiCard >
                <UiCard >
                    <UiCardContainer class="flex h-full flex-col gap-2">
                        <h3 class="text-3xl font-medium">{{ $t("project.learned") }}</h3>
                        <ul class="space-y-2">
                            <li
v-for="learning in project?.learned?.slice(0, 2)" :key="learning"
                                class="flex items-start gap-2">
                                <Icon
name="mage:information-circle"
                                    class="mt-0.5 flex-shrink-0 text-secondary-400" size="18"/>
                                <span>{{ learning }}</span>
                            </li>
                        </ul>
                    </UiCardContainer>
                </UiCard >
            </div>
            <div
                class="prose prose-neutral my-8 max-w-none dark:prose-invert prose-h1:text-4xl prose-h2:border-l-4 prose-h2:border-secondary-400 prose-h2:pl-4 prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-a:prose-headings:no-underline">
                <ContentRenderer v-if="project" :value="project" />
            </div>
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
