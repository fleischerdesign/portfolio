<template>
    <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
        <div class="mb-24">
              <UiSectionHeader :level="1" :title="$t('blog.title')" :subtitle="$t('blog.subtitle')" symbol="heroicons:pencil-square" />
            <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <BlogPostCard v-for="post in posts" :key="post.id" :post="post" />
            </div>
            <div v-if="!posts?.length" class="mt-12 text-center text-primary-500">
                {{ $t('blog.no_posts') }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { locale, t } = useI18n()
const route = useRoute()

const { data } = await useFetch('/api/blog', {
    query: { locale: locale.value }
})

const posts = computed(() => data.value?.posts || [])

useSeoMeta({
  title: t("navigation.blog"),
  ogTitle: t("navigation.blog"),
  description: t("blog.subtitle"),
  ogDescription: t("blog.subtitle"),
  ogUrl: route.fullPath,
  ogType: 'website', 
  ogLocale: locale.value,
  twitterTitle: t("navigation.blog"),
  twitterCard: 'summary_large_image',
  twitterDescription: t("blog.subtitle"),
  robots: 'index, follow',
})
</script>