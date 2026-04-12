import { useState, useRef, useCallback } from 'react'
import { uploadToR2 } from '../../../services/r2Service'

export function usePdfSplitter() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | uploading | splitting | done | error
  const [progress, setProgress] = useState(0)
  const [originalSize, setOriginalSize] = useState(0)
  const [segments, setSegments] = useState('')
  const [outputOption, setOutputOption] = useState('ONE')
  const [results, setResults] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf') {
      setErrorMsg('Please upload a valid PDF file.')
      return
    }
    setFile(f)
    setOriginalSize(f.size)
    setStatus('idle')
    setErrorMsg('')
    setResults([])
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileInput = (e) => {
    handleFile(e.target.files[0])
  }

  const validateSegments = (s) => {
    if (!s) return false
    const cleaned = s.replace(/\s+/g, '')
    return /^([0-9]+(-[0-9]+)?)(,[0-9]+(-[0-9]+)?)*$/.test(cleaned)
  }

  const handleSplit = async () => {
    if (!file) return
    const cleaned = segments.trim()
    if (!validateSegments(cleaned)) {
      setErrorMsg('Invalid page ranges. Use formats like: 1,3-5,7-10')
      return
    }

    try {
      setStatus('uploading')
      setProgress(10)
      setErrorMsg('')

      const { key: objectKey, pdfSplitterBackendUrl } = await uploadToR2(file, 'pdf-splitter')

      setProgress(40)
      setStatus('splitting')

      const backendUrl = pdfSplitterBackendUrl || import.meta.env.VITE_PDF_SPLITTER_BACKEND_URL
      if (!backendUrl) throw new Error('PDF splitter backend URL is not configured.')

      const resp = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objectKey, splitOption: cleaned, outputOption }),
      })

      if (!resp.ok) throw new Error(`Split failed: ${resp.status} ${resp.statusText}`)

      const json = await resp.json()
      if (!json || !json.success) throw new Error(json?.message || 'Splitter backend returned an error')

      setResults(json.results || [])
      setProgress(100)
      setStatus('done')
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setOriginalSize(0)
    setResults([])
    setErrorMsg('')
    setSegments('')
    setOutputOption('ONE')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return {
    file,
    status,
    progress,
    originalSize,
    segments,
    setSegments,
    outputOption,
    setOutputOption,
    results,
    errorMsg,
    isDragging,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    handleSplit,
    handleReset,
  }
}
