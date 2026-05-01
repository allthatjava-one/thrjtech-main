import { useState, useRef, useEffect } from 'react'

export default function useScreenRecorder() {
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const [recording, setRecording] = useState(false)
  const [videoUrl, setVideoUrl] = useState(null)
  const [error, setError] = useState(null)

  const isSupported = typeof navigator !== 'undefined' && !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia && window.MediaRecorder)

  const startRecording = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: 'always' }, audio: true })
      const mimeType = (window.MediaRecorder && window.MediaRecorder.isTypeSupported && window.MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) ? 'video/webm;codecs=vp9' : 'video/webm'
      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        try {
          const blob = new Blob(chunksRef.current, { type: mimeType })
          const url = URL.createObjectURL(blob)
          setVideoUrl(url)
        } catch (e) {
          setError('Failed to create recording')
        }
        // stop tracks
        try { stream.getTracks().forEach(t => t.stop()) } catch (e) {}
      }

      recorder.start()
      setRecording(true)
    } catch (err) {
      setError(err && err.message ? err.message : 'Permission denied or capture failed')
    }
  }

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop()
    } catch (e) {}
    setRecording(false)
  }

  useEffect(() => {
    return () => {
      try { if (videoUrl) URL.revokeObjectURL(videoUrl) } catch (e) {}
      try { if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop() } catch (e) {}
    }
  }, [videoUrl])

  return { isSupported, recording, videoUrl, error, startRecording, stopRecording }
}
