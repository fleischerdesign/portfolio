
<template>
  <div class="mb-24">
      <UiSectionHeader :title="$t('home.blog.title')" :subtitle="$t('home.blog.subtitle')" variant="glow" symbol="heroicons:pencil-square" />
    <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      <BlogPostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
    <div class="mt-8 text-center">
      <NuxtLinkLocale to="/blog" class="block w-full md:inline-block md:w-auto">
        <UiButton variant="secondary" class="w-full">
          {{ $t('home.blog.view_all') }}
        </UiButton>
      </NuxtLinkLocale>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BlogPostResponse } from '~~/shared/schemas/blog.schema';

const { locale } = useI18n();

const { data } = await useFetch<{ posts: BlogPostResponse[] }>('/api/blog', {
  query: { locale: locale.value, limit: 3 }
});

const posts = computed(() => data.value?.posts || []);
</script>
