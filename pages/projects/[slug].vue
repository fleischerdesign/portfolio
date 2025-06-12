<template>
    <div class="container max-w-screen-xl mx-auto py-16">
        <div class="mb-24">
            <HeadingSite :title="project!.title" :subtitle="project!.subtitle" />
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-3 gap-3">
                <Card class="rounded-md overflow-hidden min-h-96 col-span-1 md:col-span-2 row-span-2">
                    <NuxtImg sizes="100vw sm:100vw" :placeholder="[50, 25, 75, 5]" :src="project?.image?.src"
                        class="w-full h-full object-cover" :alt="project?.title || 'Project Background'" />
                </Card>
<Card> <!-- Deine bestehende Card-Komponente -->
  <CardContainer class="flex flex-col h-full gap-2">
    <h3 class="text-3xl font-medium">Details</h3>
    <div class="flex gap-2 flex-col">
      <div 
        v-for="(value, key) in {
          'Kategorie': project?.category,
          'Datum': formattedDate,
          'Status': project?.published ? 'Veröffentlicht' : 'In Entwicklung'
        }" 
        :key="key"
        class="flex justify-between items-center py-2 px-3 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700"
      >
        <span class="text-neutral-600 dark:text-neutral-300">{{ key }}:</span>
        <span class="font-medium text-neutral-800 dark:text-white">{{ value }}</span>
      </div>
    </div>
  </CardContainer>
</Card>
                <Card>
                    <CardContainer class="flex flex-col gap-2">
                        <h3 class="text-3xl font-medium">{{ $t("home.overview.techstack.title") }}</h3>
                        <TechstackList :items="project?.techstack" />
                    </CardContainer>
                </Card>
                <Card>
                    <CardContainer class="flex flex-col h-full gap-2">
                        <h3 class="text-3xl font-medium">Herausforderungen</h3>
                        <ul class="space-y-2">
                            <li v-for="challenge in project?.challenges?.slice(0, 2)" :key="challenge"
                                class="flex items-start gap-2">
                                <Icon name="mage:exclamation-circle"
                                    class="w-4 h-4 text-secondary-400 mt-0.5 flex-shrink-0" />
                                <span>{{ challenge }}</span>
                            </li>
                        </ul>
                    </CardContainer>
                </Card>
                <Card>
                    <CardContainer class="flex flex-col h-full gap-2">
                        <h3 class="text-3xl font-medium">Features</h3>
                        <ul class="space-y-2">
                            <li v-for="feature in project?.features?.slice(0, 3)" :key="feature"
                                class="flex items-start gap-2">
                                <Icon name="heroicons:check-circle"
                                    class="w-4 h-4 text-secondary-400 mt-0.5 flex-shrink-0" />
                                <span>{{ feature }}</span>
                            </li>
                        </ul>
                    </CardContainer>
                </Card>
                <Card>
                    <CardContainer class="flex flex-col h-full gap-2">
                        <h3 class="text-3xl font-medium">Gelernt</h3>
                        <ul class="space-y-2">
                            <li v-for="learning in project?.learned?.slice(0, 2)" :key="learning"
                                class="flex items-start gap-2">
                                <Icon name="mage:information-circle"
                                    class="w-4 h-4 text-secondary-400 mt-0.5 flex-shrink-0" />
                                <span>{{ learning }}</span>
                            </li>
                        </ul>
                    </CardContainer>
                </Card>
            </div>
            <div
                class="my-8 prose prose-neutral dark:prose-invert max-w-none prose-a:prose-headings:no-underline prose-h1:text-4xl prose-h2:text-3xl prose-h2:border-l-4 prose-h2:border-secondary-400 prose-h2:pl-4 prose-h3:text-2xl prose-h4:text-xl">
                <ContentRenderer v-if="project" :value="project" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { locale } = useI18n()
const route = useRoute()
const { data: project } = await useAsyncData(() => {
    return queryCollection("projects")
        .where('locale', '=', locale.value)
        .where("slug", "=", route.params.slug).first()
})
const formattedDate = computed(() => project.value ? formatDate(project.value.date) : '')

useSeoMeta({
    title: project.value?.title || 'Blog Post',
    ogTitle: project.value?.title || 'Blog Post',
    description: project.value?.description || 'Blog Post Description',
    ogDescription: project.value?.description || 'Blog Post Description',
    ogImage: project.value?.image || 'https://example.com/image.png',
    ogUrl: route.fullPath,
    ogType: 'website',
    ogLocale: locale.value,
    twitterTitle: project.value?.title || 'Blog Post',
    twitterCard: 'summary_large_image',
    twitterDescription: project.value?.description || 'Blog Post Description',
    twitterImage: 'https://example.com/image.png',
    robots: 'index, follow',
})

if (!project.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Project Not Found'
    })
}
</script>