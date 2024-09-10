<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <header class="bg-white dark:bg-gray-800 shadow">
      <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold text-gray-800 dark:text-white">YouTube 쇼츠 제작기</NuxtLink>
        <button @click="toggleDarkMode" class="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
          <span v-if="isDarkMode">🌞</span>
          <span v-else>🌙</span>
        </button>
      </nav>
    </header>
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <footer class="bg-white dark:bg-gray-800 shadow mt-8">
      <div class="container mx-auto px-4 py-4 text-center text-gray-600 dark:text-gray-400">
        © 2024 YouTube 쇼츠 제작기. 모든 권리 보유.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  localStorage.setItem('darkMode', isDarkMode.value)
}

onMounted(() => {
  if (localStorage.getItem('darkMode') === 'true' ||
      (!('darkMode' in localStorage) && 
       window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>