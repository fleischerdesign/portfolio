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
                <BlogPostCard v-for="(post, index) in data" :key="index" :post="post" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
    return queryCollection('posts')
        .select('title', 'date', 'description', "image", "slug", "readingTime")
        .all()
})
</script>