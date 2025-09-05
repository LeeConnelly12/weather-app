import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        neutral: {
          900: '#02012C',
          800: '#262540',
          700: '#302F4A',
          600: '#3C3B5E',
          300: '#ACACB7',
          200: '#D4D3D9',
        },
        orange: {
          500: '#FF820A',
        },
        blue: {
          500: '#4658D9',
          700: '#2B1B9C',
        },
      },
    },
  },
}
