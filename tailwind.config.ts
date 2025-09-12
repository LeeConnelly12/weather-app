import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  content: ['nuxt.config.ts'],
  theme: {
    extend: {
      backgroundImage: {
        'today-small': "url('/images/bg-today-small.svg')",
        'today-large': "url('/images/bg-today-large.svg')",
      },
      fontFamily: {
        'sans': ['DM Sans', ...defaultTheme.fontFamily.sans],
        'bricolage-grotesque': ['Bricolage Grotesque', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        'sm': [
          '0.875rem',
          {
            lineHeight: '1.2',
          },
        ],
        'lg': [
          '1.125rem',
          {
            lineHeight: '1.2',
          },
        ],
        'xl': [
          '1.25rem',
          {
            lineHeight: '1.2',
          },
        ],
        '3xl': '1.75rem',
        '4xl': [
          '2rem',
          {
            lineHeight: '1',
          },
        ],
        '6xl': [
          '3.25rem',
          {
            lineHeight: '1.2',
          },
        ],
        '8xl': [
          '6rem',
          {
            lineHeight: '1',
          },
        ],
      },
      lineHeight: {
        '5': '1.2',
      },
      maxWidth: {
        '2xl': '41rem',
        '7xl': '76rem',
      },
      spacing: {
        '1.5': '0.375rem',
        '2.5': '0.625rem',
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
