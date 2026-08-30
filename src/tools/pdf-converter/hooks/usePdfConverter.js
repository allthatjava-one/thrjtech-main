import { useState, useRef, useCallback } from 'react'
import JSZip from 'jszip'

let pdfjsLibPromise = null
async function getPdfJs() {
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = (async () => {
      const pdfjs = await import('pdfjs-dist')
      const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
      return pdfjs
    })()
  }
  return pdfjsLibPromise
}

export function usePdfConverter() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | converting | done | error
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
    if (f.type !== 'application/pdf' && !f.name?.toLowerCase().endsWith('.pdf')) {
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
      setStatus('converting')
      setProgress(5)
      setErrorMsg('')

      const pdfjsLib = await getPdfJs()
      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      })
      const pdf = await loadingTask.promise
      const totalPages = pdf.numPages

      if (totalPages === 0) {
        throw new Error('This PDF file has no pages.')
      }

      const mimeType = convertType === 'png' ? 'image/png' : 'image/jpeg'
      const quality = convertType === 'png' ? undefined : 0.92
      const originalBase = file.name.replace(/\.pdf$/i, '') || 'document'

      if (totalPages === 1) {
        // Single-page PDF conversion
        const page = await pdf.getPage(1)
        const scale = 2.0 // Render at 2x scale for crisp quality
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)

        if (convertType === 'jpg') {
          context.fillStyle = '#ffffff'
          context.fillRect(0, 0, canvas.width, canvas.height)
        }

        await page.render({
          canvasContext: context,
          viewport,
        }).promise

        setProgress(85)

        const blob = await new Promise((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('Failed to convert canvas to image'))),
            mimeType,
            quality
          )
        })

        const blobUrl = URL.createObjectURL(blob)
        const finalName = `${originalBase}_converted.${convertType}`

        setDownloadUrl(blobUrl)
        setDownloadName(finalName)
        setProgress(100)
        setStatus('done')

        // Auto trigger download
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = finalName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        // Multi-page PDF conversion: bundle pages into a zip archive
        const zip = new JSZip()
        const padLength = String(totalPages).length

        for (let i = 1; i <= totalPages; i += 1) {
          const page = await pdf.getPage(i)
          const scale = 2.0
          const viewport = page.getViewport({ scale })

          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          canvas.width = Math.floor(viewport.width)
          canvas.height = Math.floor(viewport.height)

          if (convertType === 'jpg') {
            context.fillStyle = '#ffffff'
            context.fillRect(0, 0, canvas.width, canvas.height)
          }

          await page.render({
            canvasContext: context,
            viewport,
          }).promise

          const pageBlob = await new Promise((resolve, reject) => {
            canvas.toBlob(
              (b) => (b ? resolve(b) : reject(new Error(`Failed to convert page ${i} to image`))),
              mimeType,
              quality
            )
          })

          const pageNumberStr = String(i).padStart(padLength, '0')
          const pageFileName = `${originalBase}_page_${pageNumberStr}.${convertType}`
          zip.file(pageFileName, pageBlob)

          const pageProgress = 5 + Math.round((i / totalPages) * 75)
          setProgress(pageProgress)
        }

        setProgress(85)

        const zipBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
          const zipProgress = 85 + Math.round((metadata.percent / 100) * 15)
          setProgress(Math.min(zipProgress, 99))
        })

        const blobUrl = URL.createObjectURL(zipBlob)
        const finalName = `${originalBase}_converted.zip`

        setDownloadUrl(blobUrl)
        setDownloadName(finalName)
        setProgress(100)
        setStatus('done')

        // Auto trigger download
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = finalName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred during conversion.')
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
