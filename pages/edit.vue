<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">동영상 편집</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <VideoUpload />
      <SubtitleEditor />
      <BackgroundMusic />
      <VideoPreview />
    </div>
  </div>
</template>

<script setup>
import VideoUpload from '~/components/VideoUpload.vue'
import SubtitleEditor from '~/components/SubtitleEditor.vue'
import BackgroundMusic from '~/components/BackgroundMusic.vue'
import VideoPreview from '~/components/VideoPreview.vue'
</script>