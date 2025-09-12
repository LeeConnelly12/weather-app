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
      bodyAttrs: {
        class: 'min-h-screen bg-neutral-900 px-4 pb-12 leading-5 font-sans text-white md:px-6 xl:px-0 xl:pb-20',
      },
    },
  },
})
