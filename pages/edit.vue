<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">비디오 편집</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <VideoUpload @file-selected="onFileSelected" />
        <VideoPreview :videoSrc="videoSrc" :subtitles="subtitles" class="mt-8" />
      </div>
      <div>
        <SubtitleEditor v-model:subtitles="subtitles" />
        <BackgroundMusic class="mt-8" />
      </div>
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

const onFileSelected = (file) => {
  videoSrc.value = URL.createObjectURL(file)
}
</script>