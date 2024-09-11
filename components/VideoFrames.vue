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
      class="flex overflow-x-auto space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded"
      @scroll="onScroll"
    >
      <div :style="{ width: `${totalWidth}px` }" class="relative h-96">
        <Transition name="fade" mode="out-in">
          <div :key="firstVisibleIndex" class="frames-container">
            <div 
              v-for="frame in visibleFrames" 
              :key="frame.index" 
              :style="{ position: 'absolute', left: `${frame.index * 100}px` }"
              class="w-24"
            >
              <img :src="frame.src" alt="Frame" class="w-24 h-16 object-cover rounded cursor-pointer" @click="seekTo(frame.index)">
              <div class="text-xs text-center mt-1">{{ formatTime(frame.index * frameInterval) }}</div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
  {{ tot }}
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  videoSrc: String,
  duration: Number,
})

const emit = defineEmits(['seek'])

const scrollContainer = ref(null)
const frameRate = ref(1) // 기본값 1 fps
const frameInterval = computed(() => 1 / frameRate.value)
const totalFrames = computed(() => Math.floor(props.duration * frameRate.value))
const totalWidth = computed(() => totalFrames.value * 100) // 각 프레임의 너비를 100px로 가정

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

const updateVisibleFrames = async () => {
  const startIndex = Math.floor(scrollPosition.value / 100)
  const endIndex = Math.min(startIndex + Math.ceil(containerWidth.value / 100) + 1, totalFrames.value)
  
  visibleFrames.value = await Promise.all(
    Array.from({ length: endIndex - startIndex }, (_, i) => i + startIndex)
      .map(async (index) => ({
        index,
        src: await generateFrame(index * frameInterval.value)
      }))
  )
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

watch(() => props.videoSrc, updateVisibleFrames)
watch(() => props.duration, updateVisibleFrames)

onMounted(() => {
  if (scrollContainer.value) {
    containerWidth.value = scrollContainer.value.clientWidth
    updateVisibleFrames()
  }
})

const handleScroll = (event) => {
  scrollTop.value = event.target.scrollTop;
};
</script>

<style scoped>
.virtual-scroll-container {
  overflow-y: auto;
}

.virtual-scroll-content {
  position: relative;
}

.virtual-scroll-content > div {
  position: absolute;
  left: 0;
  right: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.frames-container {
  position: relative;
}
</style>