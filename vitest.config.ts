import { defineVitestConfig } from '@nuxt/test-utils/config'
import { resolve } from 'node:path'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    env: {
      NUXT_DB_URL: `file:${resolve(process.cwd(), 'test.sqlite')}`
    },
    setupFiles: ['./test/setup.ts'],
    fileParallelism: false,
  },
})
