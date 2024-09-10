import { FFmpeg } from '@ffmpeg/ffmpeg'

let ffmpeg = null

export const loadFFmpeg = async () => {
  if (typeof window === 'undefined') {
    console.warn('FFmpeg는 브라우저 환경에서만 로드됩니다.')
    return null
  }

  if (!ffmpeg) {
    ffmpeg = new FFmpeg()
    try {
      await ffmpeg.load({
        coreURL: '/ffmpeg/ffmpeg-core.js',
        wasmURL: '/ffmpeg/ffmpeg-core.wasm',
        workerURL: '/ffmpeg/ffmpeg-core.worker.js'  // 필요한 경우
      })
    } catch (error) {
      console.error('FFmpeg 로딩 실패:', error)
      throw error
    }
  }
  return ffmpeg
}

export default loadFFmpeg