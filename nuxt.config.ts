// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: false,
  },
  css: ['~/assets/css/app.css'],
  compatibilityDate: '2025-07-15',
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'Weather Now',
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon-32x32.png' }],
    },
  },
})
