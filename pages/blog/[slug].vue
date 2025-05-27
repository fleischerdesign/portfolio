<template>
  <article>
    <div>
      <div class="min-h-screen relative flex items-center 2xl:min-h-[600px]">
        <img :src="post?.image?.src" class="w-full h-full absolute z-0 object-cover opacity-40"
          :alt="post?.title || 'Post Background'" />
        <div class="container flex flex-col items-start gap-4 relative z-1">
          <div class="flex items-center gap-2 drop-shadow-md">
            <chip>
              <NuxtLink class="flex gap-2"><img :src="post?.author.avatar" class="w-6 h-6 rounded-full" />Philipp
                Fleischer</NuxtLink>
            </chip>
            <span>{{ $t("blogPost.date.on") }} {{ formattedDate }}</span>
          </div>
          <h1 class="text-5xl font-semibold drop-shadow-md">{{ post?.title }}</h1>
          <p class="text-lg text-neutral-400 drop-shadow-md">{{ post?.description }}</p>
          <div class="flex gap-2">
            <tag class="drop-shadow-md" fill hover v-for="(tag, index) in post?.tags" :key="index">
              {{ tag }}
            </tag>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
    <div class="my-8 prose prose-neutral prose-invert max-w-none">
      <ContentRenderer v-if="post" :value="post" />
    </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
const route = useRoute()
const { data: post } = await useAsyncData(() => {
  return queryCollection("posts").where("slug", "=", route.params.slug).first()
})
const formattedDate = computed(() => formatDate(post.value?.date))
</script>