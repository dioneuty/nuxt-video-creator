import { createFFmpeg } from '@ffmpeg/ffmpeg'

const ffmpeg = createFFmpeg({ log: true })

export const loadFFmpeg = async () => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }
  return ffmpeg
}

export default ffmpeg