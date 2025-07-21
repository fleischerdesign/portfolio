<template>
  <div class="mb-24">
    <HeadingSection :title="$t('home.blog.title')" :subtitle="$t('home.blog.subtitle')" link="/blog" />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
      <BlogPostCard v-for="(post, index) in posts" :key="index" :post="post" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { locale } = useI18n();
const route = useRoute();

const {data: posts} = await useAsyncData(route.path+'_posts', () => {
  return queryCollection('blog')
    .where('locale', '=', locale.value)
    .select('title', 'date', 'description', "image", "slug", "readingTime")
    .limit(3)
    .all();
});
</script>