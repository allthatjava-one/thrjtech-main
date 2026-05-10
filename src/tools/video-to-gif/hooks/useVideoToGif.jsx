import { useState, useRef, useEffect } from 'react'

export default function useVideoToGif() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const cancelRef = useRef(false)

  const [videoFile, setVideoFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [videoDuration, setVideoDuration] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [fps, setFps] = useState(10)
  const [maxWidth, setMaxWidth] = useState(720)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('idle') // idle | encoding | done | error
  const [gifUrl, setGifUrl] = useState(null)
  const [gifSize, setGifSize] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
      if (gifUrl) URL.revokeObjectURL(gifUrl)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleFile(file) {
    if (!file) return
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file (MP4, WebM, MOV, AVI).')
      return
    }
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    if (gifUrl) URL.revokeObjectURL(gifUrl)
    const url = URL.createObjectURL(file)
    setVideoFile(file)
    setVideoUrl(url)
    setGifUrl(null)
    setGifSize(null)
    setProgress(0)
    setStatus('idle')
    setError(null)
    setVideoDuration(0)
    setStartTime(0)
    setEndTime(0)
  }

  function handleVideoLoaded() {
    const video = videoRef.current
    if (!video) return
    const dur = isFinite(video.duration) ? video.duration : 0
    setVideoDuration(dur)
    setStartTime(0)
    setEndTime(Math.min(dur, 10))
  }

  function seekTo(video, time) {
    return new Promise((resolve) => {
      if (Math.abs(video.currentTime - time) < 0.001) { resolve(); return }
      const onSeeked = () => {
        video.removeEventListener('seeked', onSeeked)
        resolve()
      }
      video.addEventListener('seeked', onSeeked, { once: true })
      // Fallback in case seeked never fires
      const fallback = setTimeout(() => {
        video.removeEventListener('seeked', onSeeked)
        resolve()
      }, 3000)
      onSeeked._fallback = fallback
      video.currentTime = time
    })
  }

  async function convert() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !videoUrl) return

    cancelRef.current = false
    setStatus('encoding')
    setProgress(0)
    setError(null)

    let GIFEncoder, quantize, applyPalette
    try {
      const gifenc = await import('gifenc')
      GIFEncoder = gifenc.GIFEncoder
      quantize = gifenc.quantize
      applyPalette = gifenc.applyPalette
    } catch (err) {
      setError('Failed to load GIF encoder.')
      setStatus('error')
      return
    }

    const vw = video.videoWidth || 640
    const vh = video.videoHeight || 480
    const outW = Math.min(vw, maxWidth)
    const outH = Math.round(vh * (outW / vw))

    canvas.width = outW
    canvas.height = outH
    const ctx = canvas.getContext('2d')

    const start = Math.max(0, startTime)
    const end = Math.min(videoDuration || video.duration || 0, endTime)
    const clipDuration = Math.max(0.1, end - start)
    const totalFrames = Math.max(1, Math.floor(clipDuration * fps))
    const delay = Math.round(1000 / fps)

    const encoder = GIFEncoder()

    try {
      for (let i = 0; i < totalFrames; i++) {
        if (cancelRef.current) break
        const t = start + i / fps
        await seekTo(video, t)
        if (cancelRef.current) break
        ctx.drawImage(video, 0, 0, outW, outH)
        const imageData = ctx.getImageData(0, 0, outW, outH)
        const palette = quantize(imageData.data, 256)
        const index = applyPalette(imageData.data, palette)
        encoder.writeFrame(index, outW, outH, { palette, delay, repeat: 0 })
        setProgress(Math.round(((i + 1) / totalFrames) * 100))
      }

      if (!cancelRef.current) {
        encoder.finish()
        const bytes = encoder.bytes()
        const blob = new Blob([bytes], { type: 'image/gif' })
        if (gifUrl) URL.revokeObjectURL(gifUrl)
        const url = URL.createObjectURL(blob)
        setGifUrl(url)
        setGifSize(blob.size)
        setStatus('done')
        setProgress(100)
      } else {
        setStatus('idle')
      }
    } catch (err) {
      setError(err?.message || 'Conversion failed.')
      setStatus('error')
    }
  }

  function handleCancel() {
    cancelRef.current = true
    setStatus('idle')
    setProgress(0)
  }

  function handleClear() {
    cancelRef.current = true
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    if (gifUrl) URL.revokeObjectURL(gifUrl)
    setVideoFile(null)
    setVideoUrl(null)
    setGifUrl(null)
    setGifSize(null)
    setProgress(0)
    setStatus('idle')
    setError(null)
    setVideoDuration(0)
    setStartTime(0)
    setEndTime(0)
  }

  function download() {
    if (!gifUrl) return
    const a = document.createElement('a')
    a.href = gifUrl
    a.download = videoFile ? videoFile.name.replace(/\.[^.]+$/, '') + '.gif' : 'output.gif'
    a.click()
  }

  const estimatedFrames = Math.floor(Math.max(0, endTime - startTime) * fps)

  return {
    videoRef,
    canvasRef,
    videoFile,
    videoUrl,
    videoDuration,
    startTime, setStartTime,
    endTime, setEndTime,
    fps, setFps,
    maxWidth, setMaxWidth,
    progress,
    status,
    gifUrl,
    gifSize,
    error,
    estimatedFrames,
    handleFile,
    handleVideoLoaded,
    convert,
    handleCancel,
    handleClear,
    download,
  }
}
