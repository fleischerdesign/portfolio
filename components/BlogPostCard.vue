<template>
    <Card hover class="group overflow-hidden !flex-col">
        <NuxtLink :to="$localePath(`/blog/${post?.slug}`)" class="w-full h-full">
            <div class="h-60 w-full overflow-hidden relative">
                <div
                    class="absolute bottom-0 z-10 w-full backdrop-blur-md bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition">
                    <div class="px-5 py-2 flex w-full justify-between">
                        <span class="flex items-center gap-1"><Icon name="mage:calendar-2" size="20" />{{ formattedDate }}</span>
                        <span class="flex items-center gap-1"><Icon name="mage:clock" size="20" />{{ post.readingTime }}</span>
                    </div>
                </div>
                <img :src="post?.image?.src"
                    class="h-full w-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-110 transition" />
            </div>
            <CardContainer class="flex-col">
                <h3 class="text-3xl font-medium">{{ post?.title }}</h3>
                <p class="text-neutral-400">{{ post?.description }}</p>
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