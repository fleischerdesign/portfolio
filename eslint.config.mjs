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
    rules: {
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/classnames-order': 'warn',
    },
  },
)