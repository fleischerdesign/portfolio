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
import type { BlogPostResponse } from '~~/shared/schemas/blog.schema';

const { locale, t } = useI18n()

const { data } = await useFetch<{ posts: BlogPostResponse[] }>('/api/blog', {
    query: { locale: locale.value }
})

const posts = computed(() => data.value?.posts || [])

useAppSeo({
  title: t("seo.blog_title"),
  description: t("blog.subtitle"),
  type: 'website'
})
</script>