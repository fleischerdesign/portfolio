<template>
	<NuxtLoadingIndicator class="!bg-secondary-400" :color="false" />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<UiToastContainer ref="toastContainer" />
</template>

<script setup lang="ts">
const toastContainer = ref<{ addToast: (message: string, options?: { type?: 'success' | 'error' | 'info' | 'warning', duration?: number }) => void } | null>(null);

onMounted(() => {
	if (toastContainer.value) {
		registerToastContainer(toastContainer.value.addToast);
	}
});

const { locale } = useI18n()
const siteUrl = 'https://fleischer.design'

// Automatic Canonical and Hreflang management via @nuxtjs/i18n
const i18nHead = useLocaleHead({
  dir: true,
  seo: true,
  lang: true
})

// Global Structured Data (Person + WebSite) for Google Knowledge Graph
const globalStructuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Philipp Fleischer',
      url: siteUrl,
      jobTitle: 'Software Developer & Computer Scientist',
      gender: 'Male',
      sameAs: [
        'https://github.com/fleischerdesign',
        'https://linkedin.com/in/fleischerdesign',
        'https://instagram.com/fleischer.design'
      ],
      knowsAbout: [
        'Software Engineering',
        'Computer Science',
        'TypeScript',
        'JavaScript',
        'Nuxt.js',
        'Vue.js',
        'Fullstack Web Development',
        'Clean Code Architecture',
        'DevOps'
      ]
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Philipp Fleischer',
      description: 'Official portfolio and tech blog of Philipp Fleischer.',
      publisher: {
        '@id': `${siteUrl}/#person`
      },
      inLanguage: ['en-US', 'de-DE']
    }
  ]
}))

useHead(() => ({
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} - Philipp Fleischer` : 'Philipp Fleischer'
	},
	htmlAttrs: i18nHead.value.htmlAttrs || { lang: locale.value },
	link: [
		{ rel: 'icon', type: 'image/png', href: '/favicon.png' },
		...(i18nHead.value.link || [])
	],
	meta: [
		{ charset: 'utf-8' },
		{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		...(i18nHead.value.meta || [])
	],
	script: [
		{
			type: 'application/ld+json',
			innerHTML: JSON.stringify(globalStructuredData.value)
		}
	],
	bodyAttrs: {
		class: 'dark:bg-primary-950 dark:text-white text-primary-950 bg-primary-100 transition'
	}
}))

if (import.meta.server) {
	defineOgImageComponent('Default')
}
</script>


<style>
html {
	scroll-behavior: smooth;
}

.page-enter-active,
.page-leave-active {
	transition: all 0.05s;
}

.page-enter-from,
.page-leave-to {
	opacity: 0;
}
</style>
