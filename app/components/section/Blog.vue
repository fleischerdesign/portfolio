<template>
  <div class="mb-24">
      <UiHeading :title="$t('home.blog.title')" :subtitle="$t('home.blog.subtitle')" link="/blog" />
    <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
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