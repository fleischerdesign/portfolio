<template>
  <div class="relative overflow-hidden">
    
    <!-- BACKGROUND ATMOSPHERE (Global for Post) -->
    <div class="absolute inset-0 pointer-events-none -z-10">
        <!-- 1. Ambient Glows -->
        <div class="absolute -right-[10%] top-0 h-[600px] w-[600px] rounded-full bg-secondary-500/10 blur-[120px] dark:bg-secondary-500/10"></div>
        <div class="absolute left-[10%] top-40 h-[400px] w-[400px] rounded-full bg-secondary-400/5 blur-[100px]"></div>
        
        <!-- 2. Ultra-Fine Noise Texture -->
        <div class="absolute inset-0 opacity-[0.05] mix-blend-overlay" 
             style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.99%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E'); background-size: 150px 150px;">
        </div>
    </div>

    <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
      
      <article v-if="post" class="flex flex-col items-start">
        <!-- 1. ARTICLE HEADER (Left-Aligned Editorial Style) -->
        <header class="mb-16 flex w-full max-w-5xl flex-col items-start gap-8">
          <!-- Breadcrumb -->
          <UiBackButton :to="$localePath('/blog')" />
          
          <!-- Meta Row (Visible & Clean) -->
          <div class="flex flex-wrap items-center gap-4">
             <!-- Date & Time -->
             <div class="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                <span class="flex items-center gap-2">
                    <Icon name="heroicons:calendar" size="16" class="text-secondary-500" />
                    {{ formattedDate }}
                </span>
                <span class="h-1 w-1 rounded-full bg-secondary-500"></span>
                              <span class="flex items-center gap-2">
                                  <Icon name="heroicons:clock" size="16" class="text-secondary-500" />
                                  {{ post.readingTime }} {{ $t("blog.min_read") }}
                              </span>             </div>

             <!-- Tags -->
             <div class="flex gap-2">
                <UiTag v-for="tag in post.tags" :key="tag" variant="glow" size="sm" interactive>
                   {{ tag }}
                </UiTag>
             </div>
          </div>

          <!-- Title -->
          <h1 class="text-5xl font-black tracking-tight text-neutral-950 dark:text-white sm:text-6xl lg:text-7xl leading-[1.1]">
            {{ post.title }}
          </h1>

          <!-- Aesthetic Accent Line -->
          <div class="h-2 w-24 rounded-full bg-gradient-to-r from-secondary-500 to-transparent"></div>

          <!-- Description / Lead -->
          <p class="max-w-3xl text-2xl leading-relaxed text-neutral-600 dark:text-neutral-400">
            {{ post.description }}
          </p>

          <!-- Author -->
          <div class="flex items-center gap-4 pt-4">
              <NuxtImg :src="post.author.avatar" width="48" height="48" class="h-12 w-12 rounded-2xl border border-neutral-200 dark:border-neutral-700" alt="Author" />
                          <div class="flex flex-col">
                              <span class="text-base font-bold text-neutral-900 dark:text-white">Philipp Fleischer</span>
                              <span class="text-xs font-medium uppercase tracking-wider text-secondary-500">{{ $t("blog.author") }}</span>
                          </div>          </div>
        </header>


        <!-- 2. FEATURED IMAGE (The Stage) -->
        <div class="group relative mb-20 w-full aspect-[21/9] overflow-hidden rounded-[2.5rem] border border-neutral-200/50 bg-neutral-100 shadow-2xl dark:border-neutral-800/50 dark:bg-neutral-900">
            <!-- Ambient Glow effects behind image (Local) -->
            <div class="pointer-events-none absolute -right-20 -top-20 z-10 h-96 w-96 rounded-full bg-secondary-500/10 blur-[100px]"></div>
            
            <NuxtImg
              :src="post.image?.src"
              :alt="post.image?.alt || post.title"
              sizes="100vw lg:1280px"
              class="aspect-[21/9] h-full max-h-[700px] w-full object-cover transition duration-1000 group-hover:scale-105"
              placeholder
              preload
            />
            
            <!-- Image Overlay Gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-900/20 to-transparent opacity-60"></div>
        </div>


        <!-- 3. CONTENT AREA -->
        <div class="w-full max-w-4xl">
            <div class="prose prose-lg prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-secondary-500 prose-a:no-underline hover:prose-a:underline prose-img:rounded-3xl prose-img:shadow-2xl prose-blockquote:border-secondary-500 prose-blockquote:bg-secondary-500/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl">
              <ContentRenderer :value="post" />
            </div>

            <!-- Footer Actions -->
            <footer class="mt-20 flex flex-col items-start gap-10 border-t border-neutral-200/30 pt-16 dark:border-neutral-800/30">
                <div class="flex flex-col gap-4">
                    <h3 class="text-xl font-bold text-neutral-900 dark:text-white">{{ $t("blog.enjoyed_post") }}</h3>
                    <p class="text-neutral-500">{{ $t("blog.share_connect") }}</p>
                </div>
                <div class="flex gap-4">
                    <SocialLinks />
                </div>
                <UiBackButton :to="$localePath('/blog')" />
            </footer>
        </div>

      </article>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { locale, t } = useI18n()
const route = useRoute()

const { data: post } = await useAsyncData(route.path, () => {
  return queryCollection("blog")
  .where('locale', '=', locale.value)
  .where("slug", "=", route.params.slug).first()
})

const formattedDate = computed(() => post.value ? formatDate(post.value.date) : '')

useSeoMeta({
  title: post.value?.title || 'Blog Post',
  ogTitle: post.value?.title || 'Blog Post',
  description: post.value?.description || 'Blog Post Description',
  ogDescription: post.value?.description || 'Blog Post Description',
  ogUrl: route.fullPath,
  ogType: 'article', 
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