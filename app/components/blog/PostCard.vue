<template>
    <UiCard hover class="group !flex-col overflow-hidden">
        <NuxtLink :to="$localePath(`/blog/${post?.slug}`)" class="h-full w-full">
            <div class="relative h-60 w-full overflow-hidden">
                <div
                    class="absolute bottom-0 z-10">
                    <div class="flex gap-2 px-5 py-2 text-neutral-950 transition dark:text-neutral-400">
                        <span class="flex items-center gap-1 rounded-lg bg-neutral-100/40 px-2 py-1 backdrop-blur-md dark:bg-neutral-900/40"><Icon name="mage:calendar-2" size="20" />{{ formattedDate }}</span>
                        <span class="flex items-center gap-1 rounded-lg bg-neutral-100/40 px-2 py-1 backdrop-blur-md dark:bg-neutral-900/40"><Icon name="mage:clock" size="20" />{{ post.readingTime }}</span>
                    </div>
                </div>
                <NuxtImg
sizes="600px" :src="post?.image?.src"
                    class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    :alt="post?.image?.alt" />
            </div>
            <UiCardContainer class="flex-col">
                <h3 class="text-3xl font-medium">{{ post?.title }}</h3>
                <p class="text-neutral-600 dark:text-neutral-400">{{ post?.description }}</p>
            </UiCardContainer>
        </NuxtLink>
    </UiCard >
</template>

<script setup lang="ts">
const props = defineProps<{
    post: {
        title: string
        description?: string
        date: Date
        image?: { src: string, alt: string }
        slug: string
        readingTime?: number
    }
}>()

const formattedDate = computed(() => formatDate(props.post.date))
</script>