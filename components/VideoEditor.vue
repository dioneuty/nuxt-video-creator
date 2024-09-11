<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mt-4">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">비디오 편집</h3>
    
    <!-- 구간 자르기 -->
    <div class="mb-4">
      <h4 class="text-md font-medium mb-2 text-gray-900 dark:text-gray-100">구간 자르기</h4>
      <div class="flex items-center space-x-2">
        <input v-model="startTime" type="number" min="0" :max="duration" step="0.1" class="border p-2 rounded w-24 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100">
        <span class="text-gray-900 dark:text-gray-100">~</span>
        <input v-model="endTime" type="number" :min="startTime" :max="duration" step="0.1" class="border p-2 rounded w-24 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100">
        <button @click="setTrimRange" class="bg-blue-500 text-white p-2 rounded">설정</button>
      </div>
    </div>
    
    <!-- 재생 속도 -->
    <div class="mb-4">
      <h4 class="text-md font-medium mb-2 text-gray-900 dark:text-gray-100">재생 속도</h4>
      <input v-model="playbackRate" type="range" min="0.5" max="2" step="0.1" class="w-full">
      <span class="text-sm text-gray-900 dark:text-gray-100">{{ playbackRate }}x</span>
    </div>
    
    <button @click="applyChanges" class="bg-green-500 text-white p-2 rounded">변경 사항 적용</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  duration: Number,
  currentTime: Number
})

const emit = defineEmits(['update:trimRange', 'update:playbackRate'])

const startTime = ref(0)
const endTime = ref(props.duration)
const playbackRate = ref(1)

const setTrimRange = () => {
  emit('update:trimRange', { start: startTime.value, end: endTime.value })
}

watch(playbackRate, (newRate) => {
  emit('update:playbackRate', newRate)
})

const applyChanges = () => {
  setTrimRange()
  emit('update:playbackRate', playbackRate.value)
}

watch(() => props.currentTime, (newTime) => {
  if (newTime < startTime.value || newTime > endTime.value) {
    startTime.value = newTime
    endTime.value = Math.min(newTime + 10, props.duration)
  }
})
</script>