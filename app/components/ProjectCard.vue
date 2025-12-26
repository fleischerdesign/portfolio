<template>
    <NuxtLink :to="$localePath(`/projects/${project?.slug}`)" class="group">
        <UiCard interactive direction="row" class="overflow-hidden">
            <div class="relative w-1/3 overflow-hidden">
                <NuxtImg
:src="project.image?.src" :alt="project.image?.alt || project.title" sizes="600px"
                    class="aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
		  <Icon :name="'logo:'+project!.slug" class="h-24 w-24 fill-emerald-400 drop-shadow-xl [&>g]:fill-emerald-400" mode="svg" />
                </div>
            </div>
            <UiCardContainer class="flex-col">
                <h3 :class="compact ? 'text-xl font-bold' : 'text-3xl font-medium'">{{ project.title }}</h3>
                <p class="text-neutral-600 dark:text-neutral-400">{{ project.subtitle }}</p>
            </UiCardContainer>
        </UiCard >
    </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
    project: {
        title: string
        subtitle?: string
        image?: { src: string, alt?: string }
        slug: string
    },
    compact?: boolean
}>()
</script>
