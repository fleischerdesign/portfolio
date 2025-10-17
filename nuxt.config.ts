export default defineNuxtConfig({
  nitro: {
    storage: {
      data: {
        driver: 'fs',
        base: './data'
      }
    }
  },
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
    'nuxt-og-image',
    '@nuxt/eslint'
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
      head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },
  hooks: {
    'content:file:afterParse'(ctx) {
      const { file, content } = ctx;

      const wordsPerMinute = 180;
      const text = typeof file.body === 'string' ? file.body : '';
      const wordCount = text.split(/\s+/).length;

      content.readingTime = Math.ceil(wordCount / wordsPerMinute);
    }
  },
  autoTranslate: {
    apiProvider: 'openai', // or 'anthropic', 'google'
    apiBaseUrl: 'https://openrouter.ai/api/v1',
    model: 'deepseek/deepseek-v3.2-exp',
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
    bundle: {
      optimizeTranslationDirective: false
    },
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
        quality: 80
      },
    },
  },
  tailwindcss: {
    exposeConfig: true,
  },
  icon: {
    customCollections: [{
      prefix: 'logo',
      dir: 'app/assets/logo'
    }]
  },
  googleFonts: {
    download: true,
    families: {
      Roboto: true,
    }
  }
})
