import tailwindcss from '@tailwindcss/vite'

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
    public: {
    }
  },
  site: {
    url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://fleischer.design'
  },
  sitemap: {
    sources: [
      '/api/__sitemap__/urls'
    ]
  },
  css: [
    '~/assets/css/main.css'
  ],
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
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/robots',
    '@nuxtjs/google-fonts',
    '@nuxt/eslint',
    'nuxt-auth-utils',
    'nuxt-authorization',
    '@nuxt/test-utils/module',
    '@nuxt/fonts'
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
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

  image: {
    domains: ['localhost', '127.0.0.1', 'fleischer.design'],
    alias: {
      media: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/media'
        : 'https://fleischer.design/media'
    },
    ipx: {
      modifiers: {
        format: "webp",
        quality: 80
      },
    },
  },
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  colorMode: {
    classSuffix: ''
  },
  icon: {
    customCollections: [{
      prefix: 'logo',
      dir: 'app/assets/logo'
    }]
  },
  googleFonts: {
    download: false,
    preload: false,
    display: 'swap',
    families: {
      Roboto: true,
    },
    useStylesheet: true
  }
})