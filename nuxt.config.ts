// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  css: ['~/assets/css/tailwind.css'],  // 이 부분을 수정했습니다
  build: {
    transpile: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
  },
  vite: {
    define: {
      'process.env.FFMPEG_CORE_URL': JSON.stringify('/ffmpeg-core.js'),
    },
  },
})
