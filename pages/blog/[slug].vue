<template>
  <article>
    <div>
      <div class="min-h-screen relative flex items-center 2xl:min-h-[600px]">
        <img :src="post?.image?.src" class="w-full h-full absolute z-0 object-cover grayscale-50 opacity-50"
          :alt="post?.title || 'Post Background'" />
        <div class="container flex flex-col items-start gap-4 relative z-1">
          <div class="flex items-center gap-2 drop-shadow-md">
            <chip>
              <NuxtLink class="flex gap-2"><img :src="post?.author.avatar" class="w-6 h-6 rounded-full" />Philipp
                Fleischer</NuxtLink>
            </chip>
            <span>on {{ formattedDate }}</span>
          </div>
          <h1 class="text-4xl font-bold drop-shadow-md">{{ post?.title }}</h1>
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

const formattedDate = computed(() => {
  if (!post.value?.date) {
    return '' // Fallback, falls kein Datum vorhanden ist
  }

  const date = new Date(post.value.date)

  // Wähle deine bevorzugten Optionen
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long', // 'long' (Mai), 'short' (Mai), 'numeric' (5)
    day: 'numeric' // 'numeric' (22), '2-digit' (22)
  };

  return new Intl.DateTimeFormat('de-DE', options).format(date)
})
</script>