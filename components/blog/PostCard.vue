<template>
    <Card hover class="group overflow-hidden !flex-col">
        <NuxtLink :to="$localePath(`/blog/${post?.slug}`)" class="w-full h-full">
            <div class="h-60 w-full overflow-hidden relative">
                <div
                    class="absolute bottom-0 z-10">
                    <div class="px-5 py-2 flex gap-2 dark:text-neutral-400 text-neutral-950 transition">
                        <span class="flex items-center gap-1 py-1 px-2 backdrop-blur-md dark:bg-neutral-900/40 bg-neutral-100/40 rounded-lg"><Icon name="mage:calendar-2" size="20" />{{ formattedDate }}</span>
                        <span class="flex items-center gap-1 py-1 px-2 backdrop-blur-md dark:bg-neutral-900/40 bg-neutral-100/40 rounded-lg"><Icon name="mage:clock" size="20" />{{ post.readingTime }}</span>
                    </div>
                </div>
                <NuxtImg sizes="600px" :src="post?.image?.src"
                    class="h-full w-full object-cover group-hover:scale-110 transition duration-500" />
            </div>
            <CardContainer class="flex-col">
                <h3 class="text-3xl font-medium">{{ post?.title }}</h3>
                <p class="dark:text-neutral-400 text-neutral-600">{{ post?.description }}</p>
            </CardContainer>
        </NuxtLink>
    </Card>
</template>

<script setup lang="ts">
const props = defineProps<{
    post: {
        title: string
        description?: string
        date: Date
        image?: { src: string }
        slug: string
        readingTime?: number
    }
}>()

const formattedDate = computed(() => formatDate(props.post.date))
</script>