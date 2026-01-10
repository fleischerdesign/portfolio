export default defineNuxtConfig({
  nitro: {
    storage: {
      data: {
        driver: 'fs',
        base: './.data'
      }
    }
  },
  runtimeConfig: {
    dbUrl: '',
    github: {
      token: '',
      username: '',
      applicationsRepoToken: ''
    },
    smtp: {
      host: '',
      port: '',
      secure: '',
      user: '',
      pass: '',
      from: ''
    },
    contact: {
      email: ''
    },
    now: {
      apiToken: ''
    },
    openai: {
      apiKey: ''
    },
    anthropic: {
      apiKey: ''
    },
    google: {
      apiKey: ''
    },
    masterApiKey: '',
    session: {
      password: ''
    },
    public: {}
  },
  site: {
    url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://fleischer.design'
  },
  sitemap: {
    sources: [
      '/api/__sitemap__/urls'
    ]
  },
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  modules: [
    'nuxt-og-image',
    '@nuxtjs/sitemap',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/plausible',
    './modules/autoTranslate',
    '@nuxtjs/robots',
    '@nuxtjs/google-fonts',
    '@nuxt/eslint',
    'nuxt-auth-utils',
    'nuxt-authorization'
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

    apiProvider: 'openai', // or 'anthropic', 'google'
    apiBaseUrl: 'https://openrouter.ai/api/v1',
    model: 'deepseek/deepseek-v3.2',
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
      { code: 'de', name: 'German', file: 'de.json', language: 'de-DE' }
    ],
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://fleischer.design',
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
    preload: true,
    display: 'swap',
    families: {
      Roboto: true,
    }
  }
})