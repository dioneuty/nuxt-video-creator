<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">비디오 편집</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <VideoUpload @file-selected="onFileSelected" />
        <VideoPreview 
          :videoSrc="videoSrc" 
          :subtitles="subtitles" 
          class="mt-8"
          ref="videoPreview"
        />
      </div>
      <div>
        <SubtitleEditor v-model:subtitles="subtitles" />
        <BackgroundMusic class="mt-8" />
      </div>
    </div>
    <div class="mt-8 text-center">
      <button 
        @click="downloadEditedVideo" 
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        :disabled="!videoSrc"
      >
        편집된 비디오 다운로드
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VideoUpload from '~/components/VideoUpload.vue'
import VideoPreview from '~/components/VideoPreview.vue'
import SubtitleEditor from '~/components/SubtitleEditor.vue'
import BackgroundMusic from '~/components/BackgroundMusic.vue'

const videoSrc = ref(null)
const subtitles = ref([])
const videoPreview = ref(null)

const onFileSelected = (file) => {
  videoSrc.value = URL.createObjectURL(file)
}

const downloadEditedVideo = () => {
  if (videoPreview.value) {
    videoPreview.value.downloadVideo()
  }
}
</script>