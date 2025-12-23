import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme';

const primary = colors.neutral
const secondary = colors.emerald

export default <Partial<Config>>{
  plugins: [typography],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        md: "3rem",
        lg: "6rem"
      }
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
      grayscale: {
        50: '50%',
      },
      dropShadow: {
        'emit': '0px 0px 5px ' + secondary['500'],
        'emit-lg': '0px 0px 10px ' + secondary['500'],
        glow: '0px 0px 10px ' + secondary['400'],
      },
      colors: {
        neutral: primary,
        secondary: secondary,
      },
    },
  }
}
