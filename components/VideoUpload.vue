<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
      비디오<br>업로드
    </h2>
    <div 
      v-if="!selectedFile"
      class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition duration-300"
      @dragover.prevent
      @drop.prevent="onDrop"
      @click="$refs.fileInput.click()"
    >
      <input 
        type="file" 
        ref="fileInput" 
        @change="onFileSelected" 
        accept="video/*" 
        class="hidden"
      >
      <p class="text-gray-600 dark:text-gray-400 mb-2">
        클릭하거나 비디오 파일을 여기에 드래그하세요
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-500">
        지원 형식: MP4, WebM, OGG (최대 100MB)
      </p>
    </div>
    <div v-else class="mt-4">
      <div class="flex items-start mb-2">
        <div v-if="thumbnail" class="mr-4 w-32 h-32 flex-shrink-0">
          <img :src="thumbnail" alt="Video Thumbnail" class="w-full h-full object-cover rounded-lg shadow-sm">
        </div>
        <div class="flex-grow">
          <p class="text-gray-700 dark:text-gray-300 mb-1 break-words">
            {{ selectedFile.name }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-500">
            크기: {{ formatFileSize(selectedFile.size) }}
          </p>
          <button 
            @click="deleteFile" 
            class="mt-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition duration-300"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
    <video ref="videoElement" class="hidden"></video>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { defineEmits } from 'vue'

const selectedFile = ref(null)
const fileInput = ref(null)
const videoElement = ref(null)
const thumbnail = ref(null)
const emit = defineEmits(['file-selected'])

const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('video/')) {
    selectedFile.value = file
    generateThumbnail(file)
    emit('file-selected', file)
  } else {
    alert('비디오 파일만 업로드 가능합니다.')
  }
}

const onDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('video/')) {
    selectedFile.value = file
    generateThumbnail(file)
    emit('file-selected', file)
  } else {
    alert('비디오 파일만 업로드 가능합니다.')
  }
}

const deleteFile = () => {
  selectedFile.value = null
  thumbnail.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('file-selected', null)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const generateThumbnail = (file) => {
  const video = videoElement.value
  video.src = URL.createObjectURL(file)
  video.onloadeddata = () => {
    video.currentTime = 1 // 1초 지점의 프레임을 썸네일로 사용
  }
  video.onseeked = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    thumbnail.value = canvas.toDataURL()
    URL.revokeObjectURL(video.src) // 메모리 해제
  }
}

// 파일이 변경될 때마다 썸네일 생성
watch(selectedFile, (newFile) => {
  if (newFile) {
    generateThumbnail(newFile)
  } else {
    thumbnail.value = null
  }
})
</script>