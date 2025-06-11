<template>
    <NuxtLink :to="$localePath(`/projects/${project?.slug}`)" class="group">
    <Card>
        <div class="w-1/3 overflow-hidden">
            <NuxtImg :src="project.image?.src"
                :alt="project.image?.alt || project.title"
                sizes="600px"
                class="h-full w-full object-cover group-hover:scale-110 transition duration-500" />
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
        description?: string
        image?: { src: string, alt?: string }
        slug: string
    }
}>()
</script>