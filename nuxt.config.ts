// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/test-utils', '@pinia/nuxt',],
  css: [
    './assets/style/main.scss'  // Пути к твоим глобальным стилям
  ],

})