import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default <Partial<Config>>{
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
      dropShadow: {
        'emit': '0px 0px 10px #38812E',
      },
      colors: {
        primary: {
            700: "#2B2B2B",
            800: "#1A1A1A",
            900: "#121212",
        },
        secondary: "rgba(64, 64, 64, 0.60)",
      },
    }
  }
}
