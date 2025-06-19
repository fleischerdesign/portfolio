export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/plausible',
    './modules/autoTranslate',
    '@nuxtjs/robots',
    '@nuxtjs/google-fonts',
    'nuxt-og-image'
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
      head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },
  autoTranslate: {
    apiProvider: 'openai', // oder 'anthropic', 'google'
    model: 'gpt-4.1-nano', // Modell je nach Provider
    paths: [
      {
        sourcePath: 'blog',
        targetPath: 'blog',
        fieldsToTranslate: ['tags', 'category', 'image:alt', 'description', 'title', 'locale'],
      },
      {
        sourcePath: 'projects',
        targetPath: 'projects',
        fieldsToTranslate: ['category', 'tags', 'image:alt', 'subtitle', 'title', 'locale', 'features', 'learned', 'challenges'],
      },
    ],
    sourceLocale: 'de',
    targetLocale: 'en',
  },
  i18n: {
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
    },
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json', language: 'en-US' },
      { code: 'de', name: 'German', file: 'de.json' , language: 'de-DE' }
    ],
    baseUrl: 'https://fleischer.design',
  },
  plausible: {
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
  icon: {
    customCollections: [{
      prefix: 'logo',
      dir: './assets/logo'
    }]
  },
  googleFonts: {
    families: {
      Roboto: true,
    }
  }
})