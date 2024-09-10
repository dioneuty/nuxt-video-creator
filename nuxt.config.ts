// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-09-10',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  css: ['~/assets/css/tailwind.css'],  // 이 부분을 수정했습니다
  build: {
    transpile: process.client ? ['@ffmpeg/ffmpeg', '@ffmpeg/util'] : [],
  },
  nitro: {
    routeRules: {
      '/**': { cors: true }
    }
  },
})