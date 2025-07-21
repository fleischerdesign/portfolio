<template>
    <div class="container mx-auto max-w-screen-xl py-16">
        <HeadingSite :title="$t('about.title')" :subtitle="$t('about.subtitle')" />
        <div
            class="mb-24 mt-4 grid grid-cols-1 grid-rows-1 items-stretch gap-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3">
            <Card class="group relative row-span-2 overflow-hidden">
                <div class="h-full max-h-[500px] w-full overflow-hidden">
                    <NuxtImg
sizes="300px sm:100vw" src="/img/profile.jpg" placeholder
                        class="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                </div>

                <div
                    class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4 text-white opacity-100 transition-opacity">
                    <div class="text-xl font-semibold">Philipp Fleischer, 29</div>
                    <div class="">Angehender <span class="text-secondary-400">Fachinformatiker</span> für Anwendungsentwicklung</div>
                    <div class="mt-2 flex flex-wrap gap-2 text-sm">
                        <Tag class="border-0 bg-black/40 shadow-md backdrop-blur-md">
                            <Icon name="mage:map-marker" /> Neubrandenburg, DE
                        </Tag>
                        <Tag class="border-0 bg-black/40 shadow-md backdrop-blur-md">
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
                                <Icon
name="mage:rocket" size="30"
                                    class="opacity-100 transition group-hover:opacity-0" />
                                <Icon
name="mage:rocket-fill" size="30"
                                    class="absolute opacity-0 transition group-hover:opacity-100" />
                            </div>
                            <h3 class="text-3xl font-medium">{{ $t("about.overview.earlyLife.title") }}</h3>
                        </div>
                        <p class="text-neutral-600 dark:text-neutral-400">{{ $t("about.overview.earlyLife.subtitle") }}
                        </p>
                    </CardContainer>
                </NuxtLink>
            </Card>
            <Card hover class="group">
                <NuxtLink to="#career_path">
                    <CardContainer class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <div class="flex">
                                <Icon
name="mage:cup-hot" size="30"
                                    class="opacity-100 transition group-hover:opacity-0" />
                                <Icon
name="mage:cup-hot-fill" size="30"
                                    class="absolute opacity-0 transition group-hover:opacity-100" />
                            </div>
                            <h3 class="text-3xl font-medium">{{ $t("about.overview.careerPath.title") }}</h3>
                        </div>
                        <p class="text-neutral-600 dark:text-neutral-400">{{ $t("about.overview.careerPath.subtitle") }}
                        </p>
                    </CardContainer>
                </NuxtLink>
            </Card>
            <Card hover class="group">
                <NuxtLink to="#personal_life">
                    <CardContainer class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <div class="flex">
                                <Icon
name="mage:heart" size="30"
                                    class="opacity-100 transition group-hover:opacity-0" />
                                <Icon
name="mage:heart-fill" size="30"
                                    class="absolute opacity-0 transition group-hover:opacity-100" />
                            </div>
                            <h3 class="text-3xl font-medium">{{ $t("about.overview.personalLife.title") }}</h3>
                        </div>
                        <p class="text-neutral-600 dark:text-neutral-400">{{ $t("about.overview.personalLife.subtitle")
                            }}</p>
                    </CardContainer>
                </NuxtLink>
            </Card>
            <Card hover class="group">
                <NuxtLink to="#resume">
                    <CardContainer class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <div class="flex">
                                <Icon
name="mage:checklist-note" size="30"
                                    class="opacity-100 transition group-hover:opacity-0" />
                                <Icon
name="mage:checklist-note-fill" size="30"
                                    class="absolute opacity-0 transition group-hover:opacity-100" />
                            </div>
                            <h3 class="text-3xl font-medium">{{ $t("about.overview.resume.title") }}</h3>
                        </div>
                        <p class="text-neutral-600 dark:text-neutral-400">{{ $t("about.overview.resume.subtitle") }}</p>
                    </CardContainer>
                </NuxtLink>
            </Card>
        </div>
        
        <div>
        <HeadingSection id="early_life" :title="$t('about.earlyLife.title')" :subtitle="$t('about.earlyLife.subtitle')" />
        <div class="mb-24 flex flex-col gap-x-4">
            <div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
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
                        <div class="group overflow-hidden rounded-md shadow-md">
                            <NuxtImg
sizes="100vw lg:600px" src="/img/child.jpg"
                                class="h-auto w-full object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        <div class="absolute bottom-4 right-4 rounded-lg bg-black/40 p-3 shadow-md backdrop-blur-md">
                            <div class="text-right text-sm text-secondary-400">2001</div>
                            <div class="font-medium text-white">{{ $t("about.earlyLife.content.imgCaption") }}</div>
                        </div>
                    </div>
                    <div class="mt-6 border-l-4 border-secondary-400 p-2 pl-4 italic text-gray-600 dark:text-gray-300">
                        <p>"{{ $t('about.earlyLife.content.quote') }}"</p>
                    </div>
                </div>
            </div>
        </div>
        </div>
        <div>
        <HeadingSection id="career_path" :title="$t('about.careerPath.title')" :subtitle="$t('about.careerPath.subtitle')"/>
        <div class="mb-24 flex flex-col gap-4">
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
        </div>
        <div>
            <HeadingSection id="personal_life" :title="$t('about.personalLife.title')" :subtitle="$t('about.personalLife.subtitle')"/>
        <div class="mb-24 flex flex-col gap-4">
            <p>{{ $t("about.personalLife.content.paragraph1") }}</p>

            <p>{{ $t("about.personalLife.content.paragraph2") }}</p>

            <div class="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
                    <div class="relative">
                        <div class="group h-full overflow-hidden rounded-md shadow-md">
                            <NuxtImg
sizes="100vw lg:400px" src="/img/IMG-20230618-WA0007.jpg"
                                class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        <div class="absolute bottom-4 right-4 rounded-lg bg-black/40 p-3 shadow-md backdrop-blur-md">
                            <div class="text-right text-sm text-secondary-400">{{ $t("about.personalLife.content.picture1.caption") }}</div>
                            <div class="font-medium text-white">{{ $t("about.personalLife.content.picture1.text") }}</div>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="group h-full overflow-hidden rounded-md shadow-md">
                            <NuxtImg
sizes="100vw lg:400px" src="/img/2023-01-19.jpg"
                                class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        <div class="absolute bottom-4 right-4 rounded-lg bg-black/40 p-3 shadow-md backdrop-blur-md">
                            <div class="text-right text-sm text-secondary-400">{{ $t("about.personalLife.content.picture2.caption") }}</div>
                            <div class="font-medium text-white">{{ $t("about.personalLife.content.picture2.text") }}</div>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="group h-full overflow-hidden rounded-md shadow-md">
                            <NuxtImg
sizes="100vw lg:400px" src="/img/business_atire.jpg"
                                class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        <div class="absolute bottom-4 right-4 rounded-lg bg-black/40 p-3 shadow-md backdrop-blur-md">
                            <div class="text-right text-sm text-secondary-400">{{ $t("about.personalLife.content.picture3.caption") }}</div>
                            <div class="font-medium text-white">{{ $t("about.personalLife.content.picture3.text") }}</div>
                        </div>
                    </div>
            </div>
            <p>{{ $t("about.personalLife.content.paragraph3") }}</p>

            <p>{{ $t("about.personalLife.content.paragraph4") }}</p>

            <p>{{ $t("about.personalLife.content.paragraph5") }}</p>
        </div>
        </div>
        <div class="mb-24 flex flex-col gap-4">
            <HeadingSection id="resume" :title="$t('about.resume.title')" :subtitle="$t('about.resume.subtitle')"/>
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
    description: t("about.subtitle"),
    ogDescription: t("about.subtitle"),
    ogUrl: route.fullPath,
    ogType: 'website',
    ogLocale: locale.value,
    twitterTitle: t("navigation.about"),
    twitterCard: 'summary_large_image',
    twitterDescription: t("about.subtitle"),
    robots: 'index, follow',
})

const careerTimeline = [
    {
        date: "2025 - 2027",
        title: t("cv.timeline.wbs.title"),
        description: t("cv.timeline.wbs.description"),
        icon: "heroicons:academic-cap",
        skills: ["Java", "Python", "C#", t("common.webdev"), "DevOps", t("common.databases")]
    },
    {
        date: "2022 - 2025",
        title: t("cv.timeline.ups.title"),
        description: t("cv.timeline.ups.description"),
        icon: "heroicons:briefcase",
        skills: [t("common.teamleading"), t("common.process_optimization"), t("common.project_management"), t("common.warehouse_operations"), t("common.troubleshooting")]
    },
    {
        date: "2020 - 2022",
        title: t("cv.timeline.lidl.title"),
        description: t("cv.timeline.lidl.description"),
        icon: "heroicons:briefcase",
        skills: [t("common.data_maintenance"), t("common.inventory_management"), t("common.retail_logistics"), t("common.customer_service"), t("common.process_optimization")]
    },
    {
        date: "2017 - 2019",
        title: t("cv.timeline.timeoff.title"),
        description: t("cv.timeline.timeoff.description"),
        icon: "mage:eye-closed",
        skills: [t("common.self_improvement"), t("common.education"), t("common.analyze")]
    },
    {
        date: "2015 - 2017",
        title: t("cv.timeline.medienkolleg.title"),
        description: t("cv.timeline.medienkolleg.description"),
        icon: "heroicons:academic-cap",
        skills: [t("common.audio_production"), t("common.video_production"), t("common.sound_design"), t("common.motion_graphics"), "Adobe Creative Cloud"]
    },
    {
        date: "2014 - 2015",
        title: t("cv.timeline.persch.title"),
        description: t("cv.timeline.persch.description"),
        icon: "heroicons:briefcase",
        skills: ["Printdesign", t("common.digital_media"), t("common.graphic_design"), "Layoutdesign", "Brand Identity", "Typography", "Webdesign"]
    },
    {
        date: "2012 - 2014",
        title: t("cv.timeline.putbus.title"),
        description: t("cv.timeline.putbus.description"),
        icon: "heroicons:academic-cap",
        skills: ["Printdesign", t("common.digital_media"), "Layoutdesign", "Typography", "Webdesign"]
    },
    {
        date: "2007 - 2012",
        title: t("cv.timeline.secschool.title"),
        description: t("cv.timeline.secschool.description"),
        icon: "heroicons:academic-cap",
        skills: []
    },
    {
        date: "2003 - 2007",
        title: t("cv.timeline.elementary.title"),
        description: t("cv.timeline.elementary.description"),
        icon: "heroicons:academic-cap",
        skills: []
    }
]
</script>