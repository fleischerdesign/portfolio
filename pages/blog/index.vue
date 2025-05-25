<template>
    <div class="container mx-auto py-16">
        <div class="mb-24">
            <div class="flex flex-col gap-4">
                <h1 class="text-5xl font-semibold">Blog</h1>
                <p class="text-neutral-400 w-full lg:w-2/4">Discover a collection of my blog posts where I share
                    learnings,
                    experiences, and practical advice related to Coding, Hacking, UI & UX. Join me as I explore and
                    document my
                    journey in Computer Science.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                <Card v-for="(post, index) in data" :key="index" class="group overflow-hidden !flex-col">
                    <NuxtLink :to="`/blog/${post?.slug}`" class="w-full h-full">
                        <div class="h-60 w-full overflow-hidden relative">
                            <div class="absolute b-0">test</div>
                            <img :src="post?.image?.src"
                                class="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition" />
                        </div>
                        <CardContainer class="flex-col">
                            <h3 class="text-3xl font-medium">{{ post?.title }}</h3>
                            <p class="text-neutral-400">{{ post?.description }}</p>
                        </CardContainer>
                    </NuxtLink>
                </Card>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
    return queryCollection('posts')
        .select('title', 'date', 'description', "image", "slug")
        .all()
})
</script>