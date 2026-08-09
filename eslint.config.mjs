import { resolve } from 'node:path'
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'
import tailwindcss from 'eslint-plugin-tailwindcss'

export default withNuxt(
  prettier,
  {
    files: ['**/*.vue', '**/*.ts', '**/*.js'],
    plugins: {
      tailwindcss,
    },
    settings: {
      tailwindcss: {
        cssConfigPath: resolve(import.meta.dirname, 'app/assets/css/main.css'),
        config: resolve(import.meta.dirname, 'app/assets/css/main.css'),
      },
    },
    rules: {
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/classnames-order': 'warn',
    },
  },
)