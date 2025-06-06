<template>
    <div class="container mx-auto py-16 max-w-screen-xl">
        <div class="flex flex-col gap-4 mb-4">
            <h1 class="text-5xl font-semibold">{{ $t("about.title") }}</h1>
            <p class="border-l-4 border-secondary-400  pl-4 dark:text-neutral-400 text-neutral-600 w-full lg:w-2/3">{{
                $t("about.subtitle") }}</p>
        </div>
        <div
            class="grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 gap-4 mb-24 items-stretch">
            <Card class="overflow-hidden row-span-2 group relative">
                <div class="overflow-hidden w-full h-full max-h-[500px]">
                    <NuxtImg sizes="300px sm:100vw" src="/img/profile.jpg"
                        class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>

                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white opacity-100 transition-opacity">
                    <div class="text-xl font-semibold">Philipp Fleischer</div>
                    <div class="">Angehender <span class="text-secondary-400">Fachinformatiker</span> für Anwendungsentwicklung</div>
                    <div class="mt-2 text-sm flex flex-wrap gap-2">
                        <Tag class="bg-black/40 backdrop-blur-md border-0 shadow-md">
                            <Icon name="mage:map-marker" /> Neubrandenburg, DE
                        </Tag>
                        <Tag class="bg-black/40 backdrop-blur-md border-0 shadow-md">
                            <Icon name="mage:briefcase" /> Suche Praktikum
                        </Tag>
                    </div>
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
                        <p class="dark:text-neutral-400 text-neutral-600">{{ $t("about.overview.earlyLife.subtitle") }}
                        </p>
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
                        <p class="dark:text-neutral-400 text-neutral-600">{{ $t("about.overview.careerPath.subtitle") }}
                        </p>
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
                        <p class="dark:text-neutral-400 text-neutral-600">{{ $t("about.overview.personalLife.subtitle")
                            }}</p>
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
            <p class="border-l-4 border-secondary-400  pl-4 dark:text-neutral-400 text-neutral-600 w-full lg:w-2/3">{{
                $t("about.earlyLife.subtitle") }}</p>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div class="order-2 lg:order-1">
                    <div class="flex flex-col gap-6">
                        <div class="flex items-start gap-4">
                            <div>
                                <div class="flex items-center gap-2">
                                        <Icon name="mage:light-bulb" size="30" class="text-secondary-400" />
                                    <h3 class="text-xl font-semibold">{{ $t("about.earlyLife.content.title1") }}</h3>
                                </div>
                                <p class="mt-1">{{ $t("about.earlyLife.content.paragraph1") }}</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-4">
                            <div>
                                <div class="flex items-center gap-2">
                                        <Icon name="heroicons:academic-cap" size="30" class="text-secondary-400" />
                                    <h3 class="text-xl font-semibold">{{ $t("about.earlyLife.content.title2") }}</h3>
                                </div>
                                <p class="mt-1">{{ $t("about.earlyLife.content.paragraph2") }}</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-4">
                            <div>
                                <div class="flex items-center gap-2">
                                        <Icon name="mage:chip" size="30" class="text-secondary-400" />
                                    <h3 class="text-xl font-semibold">{{ $t("about.earlyLife.content.title3") }}</h3>
                                </div>
                                <p class="mt-1">{{ $t("about.earlyLife.content.paragraph3") }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="order-1 lg:order-2">
                    <div class="relative">
                        <div class="shadow-md rounded-md overflow-hidden group">
                            <NuxtImg sizes="100vw lg:600px" src="/img/child.jpg"
                                class="w-full h-auto object-cover group-hover:scale-105 transition duration-500" />
                        </div>
                        <div class="absolute right-4 bottom-4 bg-black/40 backdrop-blur-md p-3 rounded-lg shadow-md">
                            <div class="text-sm text-secondary-400 text-right">2001</div>
                            <div class="font-medium text-white">{{ $t("about.earlyLife.content.imgCaption") }}</div>
                        </div>
                    </div>
                    <div class="my-6 border-l-4 border-secondary-400 pl-4 py-2 italic text-gray-600 dark:text-gray-300">
                        <p>"{{ $t('about.earlyLife.content.quote') }}"</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-4 mb-24">
            <h1 class="text-5xl font-semibold" id="career_path">{{ $t("about.careerPath.title") }}</h1>
            <p class="border-l-4 border-secondary-400  pl-4 dark:text-neutral-400 text-neutral-600 w-full lg:w-2/3">{{
                $t("about.careerPath.subtitle") }}</p>
                        <div class="flex items-start gap-4">
                            <div>
                                <div class="flex items-center gap-2">
                                        <Icon name="mage:color-swatch" size="30" class="text-secondary-400" />
                                    <h3 class="text-xl font-semibold">{{ $t("about.careerPath.content.title1") }}</h3>
                                </div>
                                <p class="mt-1">{{ $t("about.careerPath.content.paragraph1") }}</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-4">
                            <div>
                                <div class="flex items-center gap-2">
                                        <Icon name="mage:delivery-truck" size="30" class="text-secondary-400" />
                                    <h3 class="text-xl font-semibold">{{ $t("about.careerPath.content.title2") }}</h3>
                                </div>
                                <p class="mt-1">{{ $t("about.careerPath.content.paragraph2") }}</p>
                            </div>
                        </div>
            <Timeline :items="careerTimeline" />

                        <div class="flex items-start gap-4">
                            <div>
                                <div class="flex items-center gap-2">
                                        <Icon name="mage:trophy" size="30" class="text-secondary-400" />
                                    <h3 class="text-xl font-semibold">{{ $t("about.careerPath.content.title3") }}</h3>
                                </div>
                                <p class="mt-1">{{ $t("about.careerPath.content.paragraph3") }}</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-4">
                            <div>
                                <div class="flex items-center gap-2">
                                        <Icon name="mage:link" size="30" class="text-secondary-400" />
                                    <h3 class="text-xl font-semibold">{{ $t("about.careerPath.content.title4") }}</h3>
                                </div>
                                <p class="mt-1">{{ $t("about.careerPath.content.paragraph4") }}</p>
                            </div>
                        </div>

        </div>
        <div class="flex flex-col gap-4 mb-24">
            <h1 class="text-5xl font-semibold" id="personal_life">{{ $t("about.personalLife.title") }}</h1>
            <p class="border-l-4 border-secondary-400  pl-4 dark:text-neutral-400 text-neutral-600 w-full lg:w-2/3">{{
                $t("about.personalLife.subtitle") }}
            </p>

            <p>{{ $t("about.personalLife.content.paragraph1") }}</p>

            <p>{{ $t("about.personalLife.content.paragraph2") }}</p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                    <div class="relative">
                        <div class="shadow-md rounded-md overflow-hidden group h-full">
                            <NuxtImg sizes="100vw lg:400px" src="/img/IMG-20230618-WA0007.jpg"
                                class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        </div>
                        <div class="absolute right-4 bottom-4 bg-black/40 backdrop-blur-md p-3 rounded-lg shadow-md">
                            <div class="text-sm text-secondary-400 text-right">{{ $t("about.personalLife.content.picture1.caption") }}</div>
                            <div class="font-medium text-white">{{ $t("about.personalLife.content.picture1.text") }}</div>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="shadow-md rounded-md overflow-hidden group h-full">
                            <NuxtImg sizes="100vw lg:400px" src="/img/2023-01-19.jpg"
                                class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        </div>
                        <div class="absolute right-4 bottom-4 bg-black/40 backdrop-blur-md p-3 rounded-lg shadow-md">
                            <div class="text-sm text-secondary-400 text-right">{{ $t("about.personalLife.content.picture2.caption") }}</div>
                            <div class="font-medium text-white">{{ $t("about.personalLife.content.picture2.text") }}</div>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="shadow-md rounded-md overflow-hidden group h-full">
                            <NuxtImg sizes="100vw lg:400px" src="/img/business_atire.jpg"
                                class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        </div>
                        <div class="absolute right-4 bottom-4 bg-black/40 backdrop-blur-md p-3 rounded-lg shadow-md">
                            <div class="text-sm text-secondary-400 text-right">{{ $t("about.personalLife.content.picture3.caption") }}</div>
                            <div class="font-medium text-white">{{ $t("about.personalLife.content.picture3.text") }}</div>
                        </div>
                    </div>
            </div>
            <p>{{ $t("about.personalLife.content.paragraph3") }}</p>

            <p>{{ $t("about.personalLife.content.paragraph4") }}</p>

            <p>{{ $t("about.personalLife.content.paragraph5") }}</p>
        </div>
        <div class="flex flex-col gap-4 mb-24">
            <h1 class="text-5xl font-semibold" id="resume">{{ $t("about.resume.title") }}</h1>
            <p class="border-l-4 border-secondary-400  pl-4 dark:text-neutral-400 text-neutral-600 w-full lg:w-2/3">{{
                $t("about.resume.subtitle") }}</p>
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

const careerTimeline = [
    {
        date: "2025 - 2027",
        title: t("cv.timeline.wbs.title"),
        description: t("cv.timeline.wbs.description"),
        icon: "heroicons:academic-cap",
        skills: ["TypeScript", "Vue", "Docker"]
    },
    {
        date: "2022 - 2025",
        title: t("cv.timeline.ups.title"),
        description: t("cv.timeline.ups.description"),
        icon: "heroicons:briefcase",
        skills: ["Teamleitung", "Adobe Creative Suite"]
    },
    {
        date: "2020 - 2022",
        title: t("cv.timeline.lidl.title"),
        description: t("cv.timeline.lidl.description"),
        icon: "heroicons:briefcase",
        skills: ["UI/UX Design", "Adobe Creative Suite"]
    },
    {
        date: "2017 - 2019",
        title: t("cv.timeline.timeoff.title"),
        description: t("cv.timeline.timeoff.description"),
        icon: "mage:eye-closed",
        skills: ["Print Design", "Digital Media"]
    },
    {
        date: "2015 - 2016",
        title: t("cv.timeline.medienkolleg.title"),
        description: t("cv.timeline.medienkolleg.description"),
        icon: "heroicons:academic-cap",
        skills: ["Print Design", "Digital Media"]
    },
    {
        date: "2014 - 2015",
        title: t("cv.timeline.persch.title"),
        description: t("cv.timeline.persch.description"),
        icon: "heroicons:academic-cap",
        skills: ["Print Design", "Digital Media"]
    },
    {
        date: "2012 - 2014",
        title: t("cv.timeline.putbus.title"),
        description: t("cv.timeline.putbus.description"),
        icon: "heroicons:academic-cap",
        skills: ["Print Design", "Digital Media"]
    },
    {
        date: "2007 - 2012",
        title: t("cv.timeline.secschool.title"),
        description: t("cv.timeline.secschool.description"),
        icon: "heroicons:academic-cap",
        skills: ["Print Design", "Digital Media"]
    },
    {
        date: "2003 - 2007",
        title: t("cv.timeline.elementary.title"),
        description: t("cv.timeline.elementary.description"),
        icon: "heroicons:academic-cap",
        skills: ["Print Design", "Digital Media"]
    }
]
</script>