// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/plausible',
    './modules/autoTranslate'
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  autoTranslate: {
    apiProvider: 'openai', // oder 'anthropic', 'google'
    model: 'gpt-4.1-nano', // Modell je nach Provider
    paths: [
      {
        sourcePath: 'posts', // Übersetzt content/de/posts/*.md → content/en/posts/*.md
        targetPath: 'posts'
      },
    ],
    sourceLocale: 'de',
    targetLocale: 'en',
    fieldsToTranslate: ['tags', 'category', 'image:alt', 'description', 'slug', 'title', 'locale'],
  },
  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    },
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'de', name: 'German', file: 'de.json' }
    ],
    baseUrl: 'https://fleischer.design',
  },
  plausible: {
    // Prevent tracking on localhost
    ignoredHostnames: ['localhost'],
    apiHost: 'https://plausible.igy.ancoris.ovh',
    autoOutboundTracking: true,
    proxy: true,
  },
  image: {
    ipx: {
      modifiers: {
        format: "webp",
      },
    },
  },
  tailwindcss: {
    exposeConfig: true,
  },
})