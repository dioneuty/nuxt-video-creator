<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">배경 음악</h2>
    <input 
      type="file" 
      @change="onMusicSelected" 
      accept="audio/*" 
      class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    >
    <p v-if="selectedMusic" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
      선택된 음악: {{ selectedMusic.name }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['music-selected'])
const selectedMusic = ref(null)

const onMusicSelected = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('audio/')) {
    selectedMusic.value = file
    emit('music-selected', file)
  } else {
    alert('오디오 파일만 선택 가능합니다.')
  }
}
</script>