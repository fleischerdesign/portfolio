<template>
  <article>
    <div>
      <div class="min-h-screen relative flex items-center 2xl:min-h-[600px] dark:bg-transparent bg-neutral-100">
        <NuxtImg sizes="100vw sm:100vw" :placeholder="[50, 25, 75, 5]" :src="post?.image?.src" class="w-full h-full absolute z-0 object-cover opacity-40"
          :alt="post?.title || 'Post Background'" />
        <div class="container max-w-screen-xl flex flex-col items-start gap-4 relative z-1">
          <div class="flex items-center gap-2 drop-shadow-md">
            <chip>
              <NuxtLink class="flex gap-2"><NuxtImg :src="post?.author.avatar" class="w-6 h-6 rounded-full" alt="Avatar" />Philipp
                Fleischer</NuxtLink>
            </chip>
            <span>{{ $t("blogPost.date.on") }} {{ formattedDate }}</span>
          </div>
<HeadingSite :title="post!.title" :subtitle="post!.description!" class="!mb-0"/>
          <div class="flex gap-2">
            <tag class="drop-shadow-md" gradient hover v-for="(tag, index) in post?.tags" :key="index">
              {{ tag }}
            </tag>
          </div>
        </div>
      </div>
    </div>
    <div class="container max-w-screen-xl">
    <div class="my-8 prose prose-neutral dark:prose-invert max-w-none prose-a:prose-headings:no-underline prose-h1:text-4xl prose-h2:text-3xl prose-h2:border-l-4 prose-h2:border-secondary-400 prose-h2:pl-4 prose-h3:text-2xl prose-h4:text-xl">
      <ContentRenderer v-if="post" :value="post" />
    </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
const { locale } = useI18n()
const route = useRoute()

const { data: post } = await useAsyncData(() => {
  return queryCollection("blog")
  .where('locale', '=', locale.value)
  .where("slug", "=", route.params.slug).first()
})
const formattedDate = computed(() => formatDate(post.value?.date))

useSeoMeta({
  title: post.value?.title || 'Blog Post',
  ogTitle: post.value?.title || 'Blog Post',
  description: post.value?.description || 'Blog Post Description',
  ogDescription: post.value?.description || 'Blog Post Description',
  ogUrl: route.fullPath,
  ogType: 'website', 
  ogLocale: locale.value,
  twitterTitle: post.value?.title || 'Blog Post',
  twitterCard: 'summary_large_image',
  twitterDescription: post.value?.description || 'Blog Post Description',
  robots: 'index, follow',
})

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Blogpost Not Found'
  })
}
</script>