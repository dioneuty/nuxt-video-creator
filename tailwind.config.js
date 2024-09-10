   /** @type {import('tailwindcss').Config} */
   module.exports = {
    content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./nuxt.config.{js,ts}",
      "./app.vue",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
    darkMode: 'class', // 이 줄을 추가합니다
  }