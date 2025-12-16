export default defineNuxtConfig({
  nitro: {
    storage: {
      data: {
        driver: 'fs',
        base: './data'
      }
    }
  },
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    github: {
      token: process.env.GITHUB_TOKEN,
      username: process.env.GITHUB_USERNAME,
      applicationsRepoToken: process.env.GITHUB_APPLICATIONS_REPO_TOKEN
    },
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.SMTP_FROM
    },
    contact: {
      email: process.env.CONTACT_EMAIL
    },
    now: {
      apiToken: process.env.NOW_API_TOKEN
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY
    },
    google: {
      apiKey: process.env.GOOGLE_API_KEY
    },
    authentik: {
      clientId: process.env.AUTHENTIK_ID,
      clientSecret: process.env.AUTHENTIK_SECRET,
      issuer: process.env.AUTHENTIK_ISSUER
    },
    public: {}
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
    '@nuxt/eslint',
    '@sidebase/nuxt-auth'
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },
  auth: {
    isEnabled: true,
    disableServerSideAuth: false,
    originEnvKey: 'AUTH_ORIGIN',
    baseURL: 'http://localhost:3000/api/auth',
    provider: { /* your provider config */ },
    sessionRefresh: {
      enablePeriodically: true,
      enableOnWindowFocus: true,
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
      { code: 'de', name: 'German', file: 'de.json', language: 'de-DE' }
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