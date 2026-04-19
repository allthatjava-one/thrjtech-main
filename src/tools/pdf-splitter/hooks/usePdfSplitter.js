import { useState, useRef, useCallback } from 'react'
import { PDFDocument } from 'pdf-lib'

function parseSegments(cleaned) {
  return cleaned.split(',').map((token) => {
    const trimmed = token.trim()
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(Number)
      const pages = []
      for (let p = start; p <= end; p += 1) pages.push(p - 1)
      return { label: trimmed, pages }
    }
    return { label: trimmed, pages: [Number(trimmed) - 1] }
  })
}

export function usePdfSplitter() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | splitting | done | error
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
      setStatus('splitting')
      setProgress(10)
      setErrorMsg('')

      const arrayBuffer = await file.arrayBuffer()
      const sourcePdf = await PDFDocument.load(arrayBuffer)
      setProgress(30)

      const parsed = parseSegments(cleaned)
      const totalPages = sourcePdf.getPageCount()

      // Validate all page numbers against actual page count
      for (const token of parsed) {
        for (const pageIndex of token.pages) {
          if (pageIndex < 0 || pageIndex >= totalPages) {
            const pageNum = pageIndex + 1
            throw new Error(`Page ${pageNum} does not exist. This PDF has ${totalPages} page${totalPages === 1 ? '' : 's'}.`)
          }
        }
      }

      const newResults = []

      if (outputOption === 'ONE') {
        const outPdf = await PDFDocument.create()
        for (const token of parsed) {
          const copied = await outPdf.copyPages(sourcePdf, token.pages)
          copied.forEach((page) => outPdf.addPage(page))
        }
        const bytes = await outPdf.save()
        const blob = new Blob([bytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        newResults.push({ splitKey: '0', segment: cleaned, url })
      } else {
        for (let i = 0; i < parsed.length; i += 1) {
          const token = parsed[i]
          const outPdf = await PDFDocument.create()
          const copied = await outPdf.copyPages(sourcePdf, token.pages)
          copied.forEach((page) => outPdf.addPage(page))
          const bytes = await outPdf.save()
          const blob = new Blob([bytes], { type: 'application/pdf' })
          const url = URL.createObjectURL(blob)
          newResults.push({ splitKey: String(i), segment: token.label, url })
          const splitProgress = 30 + Math.round(((i + 1) / parsed.length) * 60)
          setProgress(splitProgress)
        }
      }

      setResults(newResults)
      setProgress(100)
      setStatus('done')
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    results.forEach((r) => URL.revokeObjectURL(r.url))
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
