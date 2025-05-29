<template>
    <div class="container mx-auto py-16 max-w-screen-xl">
        <div class="flex flex-col gap-4 mb-4">
            <h1 class="text-5xl font-semibold">{{ $t("about.title") }}</h1>
            <p class="dark:text-neutral-400 text-neutral-600 w-full lg:w-2/3">{{ $t("about.subtitle") }}</p>
        </div>
        <div
            class="grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 gap-4 mb-24 items-stretch">
            <Card class="overflow-hidden row-span-2">
                <div class="overflow-hidden group w-full h-full max-h-[500px]">
                    <NuxtImg sizes="300px sm:100vw" src="/img/profile.jpg" class="group-hover:scale-110 transition w-full h-full object-cover" />
                </div>
            </Card>
            <Card hover class="group">
                <NuxtLink to="#early_life">
                    <CardContainer class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <div class="flex">
                                <Icon name="mage:rocket" size="30"
                                    class="opacity-100 transition group-hover:opacity-0" />
                                <Icon name="mage:rocket-fill" size="30"
                                    class="absolute opacity-0 transition group-hover:opacity-100" />
                            </div>
                            <h3 class="text-3xl font-medium">{{ $t("about.overview.earlyLife.title") }}</h3>
                        </div>
                        <p class="dark:text-neutral-400 text-neutral-600">{{ $t("about.overview.earlyLife.subtitle") }}</p>
                    </CardContainer>
                </NuxtLink>
            </Card>
            <Card hover class="group">
                <NuxtLink to="#career_path">
                    <CardContainer class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <div class="flex">
                                <Icon name="mage:cup-hot" size="30"
                                    class="opacity-100 transition group-hover:opacity-0" />
                                <Icon name="mage:cup-hot-fill" size="30"
                                    class="absolute opacity-0 transition group-hover:opacity-100" />
                            </div>
                            <h3 class="text-3xl font-medium">{{ $t("about.overview.careerPath.title") }}</h3>
                        </div>
                        <p class="dark:text-neutral-400 text-neutral-600">{{ $t("about.overview.careerPath.subtitle") }}</p>
                    </CardContainer>
                </NuxtLink>
            </Card>
            <Card hover class="group">
                <NuxtLink to="#personal_life">
                    <CardContainer class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <div class="flex">
                                <Icon name="mage:heart" size="30"
                                    class="opacity-100 transition group-hover:opacity-0" />
                                <Icon name="mage:heart-fill" size="30"
                                    class="absolute opacity-0 transition group-hover:opacity-100" />
                            </div>
                            <h3 class="text-3xl font-medium">{{ $t("about.overview.personalLife.title") }}</h3>
                        </div>
                        <p class="dark:text-neutral-400 text-neutral-600">{{ $t("about.overview.personalLife.subtitle") }}</p>
                    </CardContainer>
                </NuxtLink>
            </Card>
            <Card hover class="group">
                <NuxtLink to="#resume">
                    <CardContainer class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <div class="flex">
                                <Icon name="mage:checklist-note" size="30"
                                    class="opacity-100 transition group-hover:opacity-0" />
                                <Icon name="mage:checklist-note-fill" size="30"
                                    class="absolute opacity-0 transition group-hover:opacity-100" />
                            </div>
                            <h3 class="text-3xl font-medium">{{ $t("about.overview.resume.title") }}</h3>
                        </div>
                        <p class="dark:text-neutral-400 text-neutral-600">{{ $t("about.overview.resume.subtitle") }}</p>
                    </CardContainer>
                </NuxtLink>
            </Card>
        </div>
        <div class="flex flex-col gap-4 mb-24">
            <h1 class="text-5xl font-semibold" id="early_life">{{ $t("about.earlyLife.title") }}</h1>
            <p class="text-2xl dark:text-neutral-400 text-neutral-600 italic">{{ $t("about.earlyLife.subtitle") }}</p>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div class="rounded-lg overflow-hidden self-start group">
                    <NuxtImg sizes="100vw lg:600px" src="/img/child.jpg" class="rounded-lg group-hover:scale-110 transition" />
                </div>
                <div class="flex flex-col gap-4">

                    <p>{{ $t("about.earlyLife.content.paragraph1") }}</p>

                    <p>{{ $t("about.earlyLife.content.paragraph2") }}</p>

                    <p>{{ $t("about.earlyLife.content.paragraph3") }}</p>

                </div>
            </div>
        </div>
        <div class="flex flex-col gap-4 mb-24">
            <h1 class="text-5xl font-semibold" id="career_path">{{ $t("about.careerPath.title") }}</h1>
            <p class="text-2xl dark:text-neutral-400 text-neutral-600 italic">{{ $t("about.careerPath.subtitle") }}</p>

            <p>{{ $t("about.careerPath.content.paragraph1") }}</p>

            <p>{{ $t("about.careerPath.content.paragraph2") }}</p>

            <p>{{ $t("about.careerPath.content.paragraph3") }}</p>

            <p>{{ $t("about.careerPath.content.paragraph4") }}</p>
        </div>
        <div class="flex flex-col gap-4 mb-24">
            <h1 class="text-5xl font-semibold" id="personal_life">{{ $t("about.personalLife.title") }}</h1>
            <p class="text-2xl dark:text-neutral-400 text-neutral-600 italic">{{ $t("about.personalLife.subtitle") }}</p>

            <p>{{ $t("about.personalLife.content.paragraph1") }}</p>

            <p>{{ $t("about.personalLife.content.paragraph2") }}</p>

            <div class="grid grid-cols-3 gap-4 items-stretch">
                <div class="rounded-lg overflow-hidden group">
                    <NuxtImg sizes="400px" src="/img/IMG-20230618-WA0007.jpg"
                        class="rounded-lg group-hover:scale-110 transition h-full w-full object-cover" />
                </div>
                <div class="rounded-lg overflow-hidden group">
                    <NuxtImg sizes="400px" src="/img/2023-01-19.jpg"
                        class="rounded-lg group-hover:scale-110 transition h-full w-full object-cover" />
                </div>
                <div class="rounded-lg overflow-hidden group">
                    <NuxtImg sizes="400px" src="/img/business_atire.jpg"
                        class="rounded-lg group-hover:scale-110 transition h-full w-full object-cover" />
                </div>
            </div>
            <p>{{ $t("about.personalLife.content.paragraph3") }}</p>

            <p>{{ $t("about.personalLife.content.paragraph4") }}</p>

            <p>{{ $t("about.personalLife.content.paragraph5") }}</p>
        </div>
                <div class="flex flex-col gap-4 mb-24">
            <h1 class="text-5xl font-semibold" id="resume">{{ $t("about.resume.title") }}</h1>
            <p class="text-2xl dark:text-neutral-400 text-neutral-600 italic">{{ $t("about.resume.subtitle") }}</p>
                </div>
    </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const route = useRoute();
const { locale } = useI18n();

useSeoMeta({
  title: t("navigation.about"),
  ogTitle: t("navigation.about"),
  description: t("about.title"),
  ogDescription: t("about.subtitle"),
  ogImage: 'https://example.com/image.png',
  ogUrl: route.fullPath,
  ogType: 'website', 
  ogLocale: locale.value,
  twitterTitle: t("navigation.about"),
  twitterCard: 'summary_large_image',
  twitterDescription: t("about.subtitle"),
  twitterImage: 'https://example.com/image.png',
  robots: 'index, follow',
})
</script>