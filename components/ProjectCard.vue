<template>
    <NuxtLink :to="$localePath(`/projects/${project?.slug}`)" class="group">
        <Card class="overflow-hidden">
            <div class="w-1/3 overflow-hidden relative">
                <NuxtImg :src="project.image?.src" :alt="project.image?.alt || project.title" sizes="600px"
                    class="h-full w-full object-cover group-hover:scale-110 aspect-[4/3] transition duration-500" />
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Icon :name="'logo:'+project!.slug" class="w-24 h-24 text-emerald-400 drop-shadow-emit" />
                </div>
            </div>
            <CardContainer class="flex-col">
                <h3 class="text-3xl font-medium">{{ project.title }}</h3>
                <p class="dark:text-neutral-400 text-neutral-600">{{ project.subtitle }}</p>
            </CardContainer>
        </Card>
    </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
    project: {
        title: string
        subtitle?: string
        image?: { src: string, alt?: string }
        slug: string
    }
}>()
</script>