<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">비디오 미리보기</h2>
    <div v-if="videoSrc" class="relative">
      <video
        ref="videoPlayer"
        :src="videoSrc"
        class="w-full max-w-2xl mx-auto rounded-lg"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onVideoLoaded"
      >
        <track
          kind="subtitles"
          label="한국어"
          :src="subtitlesSrc"
          srclang="ko"
          default
        >
      </video>
      <div 
        v-if="currentSubtitle" 
        :class="{
          'absolute left-0 right-0 text-center bg-black bg-opacity-50 text-white p-2': true,
          'bottom-16': currentSubtitle.position === 'bottom',
          'top-16': currentSubtitle.position === 'top',
          'top-1/2 transform -translate-y-1/2': currentSubtitle.position === 'middle'
        }"
      >
        {{ currentSubtitle.text }}
      </div>
      <div class="mt-2 flex items-center">
        <button @click="togglePlay" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          {{ isPlaying ? '일시정지' : '재생' }}
        </button>
        <input 
          type="range" 
          min="0" 
          :max="duration" 
          :value="currentTime" 
          @input="onSeek" 
          @click="onSeekBarClick"
          class="w-full"
        >
        <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </span>
      </div>
    </div>
    <div v-else class="text-gray-600 dark:text-gray-400 text-center py-8">
      비디오를 업로드하면 여기에 미리보기가 표시됩니다.
    </div>
    <div v-if="backgroundMusicSrc" class="mt-4">
      <audio ref="audioPlayer" :src="backgroundMusicSrc" loop></audio>
      <button 
        @click="toggleBackgroundMusic" 
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {{ isBackgroundMusicPlaying ? '배경음악 중지' : '배경음악 재생' }}
      </button>
    </div>
    <VideoFrames 
      :videoSrc="videoSrc" 
      :duration="duration" 
      @seek="onSeek"
    />
    <VideoEditor 
      :duration="duration"
      :currentTime="currentTime"
      @update:trimRange="updateTrimRange"
      @update:playbackRate="updatePlaybackRate"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import VideoEditor from './VideoEditor.vue'
import VideoFrames from './VideoFrames.vue'

const props = defineProps({
  videoSrc: String,
  subtitles: Array,
  backgroundMusicSrc: String
})

const videoPlayer = ref(null)
const audioPlayer = ref(null)
const currentSubtitle = ref(null)
const isBackgroundMusicPlaying = ref(false)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const subtitlesSrc = computed(() => {
  if (!props.subtitles || props.subtitles.length === 0) return null
  
  const vttContent = `WEBVTT

${props.subtitles.map((subtitle, index) => `
${index + 1}
${formatVTTTime(subtitle.startTime)} --> ${formatVTTTime(subtitle.endTime)}
${subtitle.text}
`).join('\n')}
`
  return URL.createObjectURL(new Blob([vttContent], { type: 'text/vtt' }))
})

const formatVTTTime = (seconds) => {
  const date = new Date(seconds * 1000)
  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  const secs = date.getUTCSeconds().toString().padStart(2, '0')
  const ms = date.getUTCMilliseconds().toString().padStart(3, '0')
  return `${hours}:${minutes}:${secs}.${ms}`
}

const onVideoLoaded = () => {
  duration.value = videoPlayer.value.duration
}

const onTimeUpdate = () => {
  currentTime.value = videoPlayer.value.currentTime
  if (props.subtitles) {
    currentSubtitle.value = props.subtitles.find(subtitle => 
      currentTime.value >= subtitle.startTime && currentTime.value <= subtitle.endTime
    )
  }
}

const togglePlay = () => {
  if (videoPlayer.value.paused) {
    videoPlayer.value.play()
    isPlaying.value = true
  } else {
    videoPlayer.value.pause()
    isPlaying.value = false
  }
}

const onSeek = (time) => {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime = time
  }
}

const onSeekBarClick = (event) => {
  const seekBar = event.target;
  const rect = seekBar.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const newTime = (offsetX / rect.width) * duration.value;
  onSeek(newTime);
}

const toggleBackgroundMusic = () => {
  if (isBackgroundMusicPlaying.value) {
    audioPlayer.value.pause()
  } else {
    audioPlayer.value.play()
  }
  isBackgroundMusicPlaying.value = !isBackgroundMusicPlaying.value
}

const formatTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const trimRange = ref({ start: 0, end: 0 })
const playbackRate = ref(1)

const updateTrimRange = (range) => {
  trimRange.value = range
  videoPlayer.value.currentTime = range.start
}

const updatePlaybackRate = (rate) => {
  playbackRate.value = rate
  videoPlayer.value.playbackRate = rate
}

watch(videoPlayer, (newPlayer) => {
  if (newPlayer) {
    newPlayer.playbackRate = playbackRate.value
  }
})

watch(() => props.videoSrc, (newSrc) => {
  if (newSrc) {
    isPlaying.value = false
    currentTime.value = 0
    if (audioPlayer.value) {
      audioPlayer.value.pause()
      isBackgroundMusicPlaying.value = false
    }
  }
})

watch(() => props.backgroundMusicSrc, (newSrc) => {
  if (newSrc && audioPlayer.value) {
    audioPlayer.value.load()
  }
})

watch(() => props.subtitles, () => {
  if (videoPlayer.value) {
    // 자막이 변경되면 트랙을 업데이트합니다
    const trackElement = videoPlayer.value.querySelector('track')
    if (trackElement) {
      trackElement.src = subtitlesSrc.value
    }
  }
}, { deep: true })

// 새로운 downloadVideo 메서드 추가
const downloadVideo = () => {
  if (videoPlayer.value && videoPlayer.value.src) {
    const a = document.createElement('a')
    a.href = videoPlayer.value.src
    a.download = 'edited_video.mp4'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

// defineExpose를 사용하여 메서드를 외부에 노출
defineExpose({
  downloadVideo
})

</script>