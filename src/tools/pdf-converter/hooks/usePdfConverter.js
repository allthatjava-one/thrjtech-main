import { useState, useRef, useCallback } from 'react'
import { uploadToR2 } from '../../../services/r2Service'

export function usePdfConverter() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | uploading | converting | done | error
  const [progress, setProgress] = useState(0)
  const [originalSize, setOriginalSize] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [downloadName, setDownloadName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [convertType, setConvertType] = useState('jpg')
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
    setDownloadUrl('')
    setDownloadName('')
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

  const handleConvert = async () => {
    if (!file) return
    try {
      setStatus('uploading')
      setProgress(20)
      setErrorMsg('')

      const { key: objectKey, pdfConverterBackendUrl } = await uploadToR2(file, 'pdf-converter')

      setProgress(60)
      setStatus('converting')

      const backendUrl = pdfConverterBackendUrl || import.meta.env.VITE_PDF_CONVERTER_BACKEND_URL
      if (!backendUrl) {
        throw new Error('PDF converter backend URL is not configured.')
      }

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objectKey, convertType }),
      })

      if (!response.ok) {
        throw new Error(`Conversion failed: ${response.status} ${response.statusText}`)
      }

      const { presignedUrl } = await response.json()
      if (!presignedUrl) {
        throw new Error('No presigned URL returned from server.')
      }

      const downloadResponse = await fetch(presignedUrl)
      if (!downloadResponse.ok) {
        throw new Error(`Failed to fetch converted file: ${downloadResponse.status} ${downloadResponse.statusText}`)
      }

      const blob = await downloadResponse.blob()
      const blobUrl = URL.createObjectURL(blob)

      // Determine result filename (prefer Content-Disposition, then presignedUrl)
      let resultFilename = ''
      const contentDisp = downloadResponse.headers.get('Content-Disposition')
      if (contentDisp) {
        const fnStarMatch = contentDisp.match(/filename\*=(?:UTF-8'')?([^;\n\r]+)/i)
        const fnMatch = contentDisp.match(/filename=(?:"?)([^";]+)(?:"?)/i)
        if (fnStarMatch && fnStarMatch[1]) {
          try {
            resultFilename = decodeURIComponent(fnStarMatch[1])
          } catch (e) {
            resultFilename = fnStarMatch[1]
          }
        } else if (fnMatch && fnMatch[1]) {
          resultFilename = fnMatch[1]
        }
      }

      if (!resultFilename) {
        try {
          const urlPath = new URL(presignedUrl).pathname
          const lastSeg = urlPath.split('/').filter(Boolean).pop() || ''
          resultFilename = decodeURIComponent(lastSeg)
        } catch (e) {
          // ignore
        }
      }

      // Extract extension from resultFilename if present
      let ext = ''
      if (resultFilename) {
        const m = resultFilename.match(/\.([a-zA-Z0-9]{1,8})(?:\?.*)?$/)
        if (m && m[1]) ext = m[1].toLowerCase()
      }

      // Build final download name: original base + _converted + (extracted ext or fallback)
      const originalBase = file.name.replace(/\.pdf$/i, '')
      let finalName = originalBase + '_converted'
      if (ext) {
        finalName += `.${ext}`
      } else if (convertType) {
        finalName += `.${convertType}`
      }

      setDownloadUrl(blobUrl)
      setDownloadName(finalName)
      setProgress(100)
      setStatus('done')

      const a = document.createElement('a')
      a.href = blobUrl
      a.download = finalName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setOriginalSize(0)
    setDownloadUrl('')
    setDownloadName('')
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return {
    file,
    status,
    progress,
    originalSize,
    downloadUrl,
    downloadName,
    errorMsg,
    convertType,
    setConvertType,
    isDragging,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    handleConvert,
    handleReset,
  }
}
