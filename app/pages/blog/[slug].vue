
<template>
  <div class="relative overflow-hidden">
    
    <!-- BACKGROUND ATMOSPHERE -->
    <div class="pointer-events-none absolute inset-0 -z-10">
        <div class="absolute -right-[10%] top-0 h-[600px] w-[600px] rounded-full bg-secondary-500/10 blur-[120px] dark:bg-secondary-500/10"></div>
        <div class="absolute left-[10%] top-40 h-[400px] w-[400px] rounded-full bg-secondary-400/5 blur-[100px]"></div>
        
        <div
class="absolute inset-0 opacity-[0.05] mix-blend-overlay" 
             style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.99%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E'); background-size: 150px 150px;">
        </div>
    </div>

    <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
      
      <article v-if="post" class="flex flex-col items-start">
        <header class="mb-16 flex w-full max-w-5xl flex-col items-start gap-8">
          <UiBackButton :to="$localePath('/blog')" />
          
          <div class="flex flex-wrap items-center gap-4">
             <div class="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-primary-500 dark:text-primary-400">
                <span v-if="post.publishedAt" class="flex items-center gap-2">
                    <Icon name="heroicons:calendar" size="16" class="text-secondary-500" />
                    {{ formattedDate }}
                </span>
                <span v-if="post.publishedAt && post.readingTime" class="h-1 w-1 rounded-full bg-secondary-500"></span>
                <span v-if="post.readingTime" class="flex items-center gap-2">
                    <Icon name="heroicons:clock" size="16" class="text-secondary-500" />
                    {{ post.readingTime }} {{ $t("blog.min_read") }}
                </span>
             </div>

             <div class="flex gap-2">
                <UiTag v-for="tag in post.tags" :key="tag.id" variant="glow" size="sm" interactive>
                   {{ tag.name }}
                </UiTag>
             </div>
          </div>

          <h1 class="text-5xl font-black leading-[1.1] tracking-tight text-primary-950 sm:text-6xl lg:text-7xl dark:text-white">
            {{ post.title }}
          </h1>

          <div class="h-2 w-24 rounded-full bg-gradient-to-r from-secondary-500 to-transparent"></div>

          <p class="max-w-3xl text-2xl leading-relaxed text-primary-600 dark:text-primary-400">
            {{ post.excerpt }}
          </p>

          <div v-if="post.author" class="flex items-center gap-4 pt-4">
              <!-- Avatar removed as not available in schema -->
              <div class="flex flex-col">
                  <span class="text-base font-bold text-primary-900 dark:text-white">{{ post.author.name }}</span>
                  <span class="text-xs font-medium uppercase tracking-wider text-secondary-500">{{ $t("blog.author") }}</span>
              </div>
          </div>
        </header>

        <div v-if="post.coverImage" class="group relative mb-20 aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] border border-primary-200/50 bg-primary-100 shadow-2xl dark:border-primary-800/50 dark:bg-primary-900">
            <div class="pointer-events-none absolute -right-20 -top-20 z-10 h-96 w-96 rounded-full bg-secondary-500/10 blur-[100px]"></div>
            
            <NuxtImg
              :src="post.coverImage"
              :alt="post.coverImageAlt || post.title"
              sizes="100vw lg:1280px"
              class="aspect-[21/9] h-full max-h-[700px] w-full object-cover transition duration-1000 group-hover:scale-105"
              placeholder
              preload
            />
            
            <div class="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent opacity-60"></div>
        </div>

        <div class="w-full max-w-4xl">
            <BaseMarkdown :content="post.body" />
        </div>

            <footer class="mt-20 flex flex-col items-start gap-10 border-t border-primary-200/30 pt-16 dark:border-primary-800/30">
                <div class="flex flex-col gap-4">
                    <h3 class="text-xl font-bold text-primary-900 dark:text-white">{{ $t("blog.enjoyed_post") }}</h3>
                    <p class="text-primary-500">{{ $t("blog.share_connect") }}</p>
                </div>
                <div class="flex gap-4">
                    <SocialLinks />
                </div>
                <UiBackButton :to="$localePath('/blog')" />
            </footer>

      </article>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { locale } = useI18n()
const route = useRoute()

const { data } = await useFetch(`/api/blog/${route.params.slug}`, {
    query: { locale: locale.value }
})

const post = computed(() => data.value?.post)

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Blogpost Not Found'
  })
}

const formattedDate = computed(() => post.value?.publishedAt ? formatDate(post.value.publishedAt) : '')

const siteUrl = 'https://fleischer.design';

const blogSchema = computed(() => {
  if (!post.value) return undefined;
  const url = `${siteUrl}${route.fullPath}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    isPartOf: {
      '@type': 'Blog',
      '@id': `${siteUrl}/${locale.value}/blog`,
      name: 'Philipp Fleischer Tech Blog'
    },
    headline: post.value.title,
    description: post.value.excerpt,
    url,
    inLanguage: locale.value === 'de' ? 'de-DE' : 'en-US',
    datePublished: post.value.publishedAt ? new Date(post.value.publishedAt).toISOString() : undefined,
    dateModified: post.value.updatedAt ? new Date(post.value.updatedAt).toISOString() : (post.value.publishedAt ? new Date(post.value.publishedAt).toISOString() : undefined),
    image: post.value.coverImage ? (post.value.coverImage.startsWith('http') ? post.value.coverImage : `${siteUrl}${post.value.coverImage}`) : undefined,
    author: {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: post.value.author?.name || 'Philipp Fleischer',
      url: siteUrl
    },
    publisher: {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Philipp Fleischer',
      url: siteUrl
    },
    keywords: post.value.tags?.map((t: { name: string }) => t.name).join(', ')
  };
});

useAppSeo(computed(() => ({
  title: post.value?.title || 'Blog Post',
  description: post.value?.excerpt || '',
  image: post.value?.coverImage,
  type: 'article',
  publishedTime: post.value?.publishedAt ? new Date(post.value.publishedAt) : undefined,
  modifiedTime: post.value?.updatedAt ? new Date(post.value.updatedAt) : undefined,
  author: post.value?.author?.name || 'Philipp Fleischer',
  schemaOrg: blogSchema.value
})));
</script>
