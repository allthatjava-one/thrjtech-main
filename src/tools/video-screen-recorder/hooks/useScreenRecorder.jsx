import { useState, useRef, useEffect } from 'react'

export default function useScreenRecorder() {
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const audioCtxRef = useRef(null)
  const micStreamRef = useRef(null)
  const [recording, setRecording] = useState(false)
  const [videoUrl, setVideoUrl] = useState(null)
  const [error, setError] = useState(null)
  const [recordSound, setRecordSound] = useState(true)

  const isSupported = typeof navigator !== 'undefined' && !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia && window.MediaRecorder)

  const stopAudioResources = () => {
    try { if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null } } catch (e) {}
    try { if (micStreamRef.current) { micStreamRef.current.getTracks().forEach(t => t.stop()); micStreamRef.current = null } } catch (e) {}
  }

  const startRecording = async () => {
    setError(null)
    try {
      // Request display stream; also ask for system audio so Chrome can offer it in the picker
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: 'always', displaySurface: 'window' }, audio: recordSound })

      let finalStream = displayStream

      if (recordSound) {
        try {
          // Capture microphone audio — works on all browsers/OS
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          micStreamRef.current = micStream

          const audioCtx = new AudioContext()
          audioCtxRef.current = audioCtx
          const destination = audioCtx.createMediaStreamDestination()

          // Mix in system/tab audio if the browser included it
          if (displayStream.getAudioTracks().length > 0) {
            audioCtx.createMediaStreamSource(new MediaStream(displayStream.getAudioTracks())).connect(destination)
          }

          // Mix in microphone
          audioCtx.createMediaStreamSource(micStream).connect(destination)

          // Combine video track + mixed audio
          const videoTrack = displayStream.getVideoTracks()[0]
          finalStream = new MediaStream([videoTrack, ...destination.stream.getAudioTracks()])
        } catch (micErr) {
          // Mic access denied — fall back to video-only rather than blocking the whole recording
          setError('Microphone access was denied. Recording without audio.')
        }
      }

      const mimeType = (window.MediaRecorder && window.MediaRecorder.isTypeSupported && window.MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) ? 'video/webm;codecs=vp9' : 'video/webm'
      const recorder = new MediaRecorder(finalStream, { mimeType })
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
        try { displayStream.getTracks().forEach(t => t.stop()) } catch (e) {}
        stopAudioResources()
      }

      recorder.start()
      setRecording(true)
    } catch (err) {
      stopAudioResources()
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
      stopAudioResources()
    }
  }, [videoUrl])

  return { isSupported, recording, videoUrl, error, startRecording, stopRecording, recordSound, setRecordSound }
}
