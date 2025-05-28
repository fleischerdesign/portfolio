<template>
    <div class="container max-w-screen-xl mx-auto py-16">
        <div class="mb-24">
            <div class="flex flex-col gap-4">
                <h1 class="text-5xl font-semibold">{{ $t("blog.title") }}</h1>
                <p class="text-neutral-400 w-full lg:w-2/3">{{ $t("blog.subtitle") }}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                <BlogPostCard v-for="(post, index) in data" :key="index" :post="post" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { locale } = useI18n()
const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
    return queryCollection('posts')
        .where('locale', '=', locale.value)
        .select('title', 'date', 'description', "image", "slug", "readingTime")
        .all()
})

const { t } = useI18n()

useSeoMeta({
  title: t("navigation.blog"),
  ogTitle: t("navigation.blog"),
  description: t("blog.subtitle"),
  ogDescription: t("blog.subtitle"),
  ogImage: 'https://example.com/image.png',
  ogUrl: route.fullPath,
  ogType: 'website', 
  ogLocale: locale.value,
  twitterTitle: t("navigation.blog"),
  twitterCard: 'summary_large_image',
  twitterDescription: t("blog.subtitle"),
  twitterImage: 'https://example.com/image.png',
  robots: 'index, follow',
})
</script>