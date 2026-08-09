import { defineVitestConfig } from '@nuxt/test-utils/config'
import { resolve } from 'node:path'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    env: {
      NUXT_DB_URL: `file:${resolve(process.cwd(), 'test.sqlite')}`
    },
    include: ['test/**/*.spec.ts'],
    exclude: ['**/.direnv/**', '**/node_modules/**', '**/.output/**'],
    setupFiles: ['./test/setup.ts'],
    fileParallelism: false,
  },
})
