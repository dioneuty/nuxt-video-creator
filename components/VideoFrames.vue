<template>
  <div class="mt-4">
    <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">프레임 구간</h3>
    <div class="mb-2 flex items-center">
      <label for="frameRate" class="mr-2">초당 프레임 수:</label>
      <input 
        id="frameRate" 
        v-model.number="frameRate" 
        type="number" 
        min="1" 
        max="30" 
        class="border rounded p-1 w-16"
      >
      <button @click="updateFrameRate" class="ml-2 bg-blue-500 text-white px-2 py-1 rounded">적용</button>
    </div>
    <div 
      ref="scrollContainer"
      class="relative overflow-x-auto bg-gray-100 dark:bg-gray-700 rounded"
      style="height: 150px;"
      @scroll="onScroll"
    >
      <div :style="{ width: `${totalWidth}px`, height: '100%' }" class="absolute top-0 left-0">
        <div 
          v-for="frame in visibleFrames" 
          :key="frame.index" 
          :style="{ position: 'absolute', left: `${frame.index * frameWidth}px`, width: `${frameWidth}px` }"
          class="h-full flex flex-col items-center justify-center"
        >
          <img 
            :src="frame.src" 
            alt="Frame" 
            class="w-24 h-16 object-cover rounded cursor-pointer" 
            @click="seekTo(frame.index)"
            @load="frame.loaded = true"
            v-show="frame.loaded"
          >
          <div v-show="!frame.loaded" class="w-24 h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div class="text-xs text-center mt-1">{{ formatTime(frame.index * frameInterval) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'

const props = defineProps({
  videoSrc: String,
  duration: Number,
})

const emit = defineEmits(['seek'])

const scrollContainer = ref(null)
const frameRate = ref(1)
const frameInterval = computed(() => 1 / frameRate.value)
const totalFrames = computed(() => Math.floor(props.duration * frameRate.value))
const frameWidth = 100 // 각 프레임의 너비
const totalWidth = computed(() => totalFrames.value * frameWidth)

const visibleFrames = ref([])
const scrollPosition = ref(0)
const containerWidth = ref(0)

const updateFrameRate = () => {
  scrollPosition.value = 0
  if (scrollContainer.value) {
    scrollContainer.value.scrollLeft = 0
  }
  updateVisibleFrames()
}

const updateVisibleFrames = () => {
  const startIndex = Math.floor(scrollPosition.value / frameWidth)
  const endIndex = Math.min(startIndex + Math.ceil(containerWidth.value / frameWidth) + 1, totalFrames.value)
  
  visibleFrames.value = Array.from({ length: endIndex - startIndex }, (_, i) => ({
    index: i + startIndex,
    src: '',
    loaded: false
  }))

  requestAnimationFrame(() => {
    visibleFrames.value.forEach(frame => {
      if (!frame.loaded) {
        generateFrame(frame.index * frameInterval.value).then(src => {
          frame.src = src
        })
      }
    })
  })
}

const generateFrame = async (time) => {
  const video = document.createElement('video')
  video.src = props.videoSrc
  await new Promise((resolve) => { video.onloadedmetadata = resolve })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  video.currentTime = time
  await new Promise((resolve) => { video.onseeked = resolve })
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL()
}

const onScroll = () => {
  scrollPosition.value = scrollContainer.value.scrollLeft
  updateVisibleFrames()
}

const seekTo = (index) => {
  const time = index * frameInterval.value
  emit('seek', time)
}

const formatTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  const milliseconds = Math.floor((time % 1) * 1000)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
}

let resizeObserver
onMounted(() => {
  if (scrollContainer.value) {
    containerWidth.value = scrollContainer.value.clientWidth
    updateVisibleFrames()

    resizeObserver = new ResizeObserver(() => {
      containerWidth.value = scrollContainer.value.clientWidth
      updateVisibleFrames()
    })
    resizeObserver.observe(scrollContainer.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

watch(() => props.videoSrc, updateVisibleFrames)
watch(() => props.duration, updateVisibleFrames)
watch(frameRate, updateVisibleFrames)
</script>

<style scoped>
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style>