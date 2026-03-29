import { useMemo, useRef, useState, useCallback } from 'react'
import { uploadToR2 } from '../../../services/r2Service'

function makeFileEntry(file) {
  const randomPart = Math.random().toString(36).slice(2, 8)
  return {
    id: `${Date.now()}-${randomPart}-${file.name}`,
    file,
  }
}

function moveItem(list, fromIndex, toIndex) {
  const clone = [...list]
  const [item] = clone.splice(fromIndex, 1)
  clone.splice(toIndex, 0, item)
  return clone
}

export function usePdfMerger() {
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState('idle') // idle | uploading | merging | done | error
  const [progress, setProgress] = useState(0)
  const [mergedSize, setMergedSize] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [downloadName, setDownloadName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [draggedId, setDraggedId] = useState('')
  const [compress, setCompress] = useState(false)
  const fileInputRef = useRef(null)

  const originalSize = useMemo(
    () => files.reduce((total, item) => total + item.file.size, 0),
    [files],
  )

  const addFiles = useCallback((fileList) => {
    const incoming = Array.from(fileList || [])
    if (!incoming.length) return

    const invalid = incoming.find((f) => f.type !== 'application/pdf')
    if (invalid) {
      setErrorMsg('Only PDF files are allowed.')
      return
    }

    setFiles((current) => [...current, ...incoming.map(makeFileEntry)])
    setStatus('idle')
    setErrorMsg('')
    setProgress(0)
    setMergedSize(0)
    setDownloadName('')
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl('')
    }
  }, [downloadUrl])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }, [addFiles])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileInput = (e) => {
    addFiles(e.target.files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleRemove = (id) => {
    setFiles((current) => current.filter((item) => item.id !== id))
    setStatus('idle')
    setErrorMsg('')
  }

  const moveFileUp = (index) => {
    if (index <= 0) return
    setFiles((current) => moveItem(current, index, index - 1))
  }

  const moveFileDown = (index) => {
    setFiles((current) => {
      if (index >= current.length - 1) return current
      return moveItem(current, index, index + 1)
    })
  }

  const handleItemDragStart = (id) => {
    setDraggedId(id)
  }

  const handleItemDragOver = (e, targetId) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) return

    setFiles((current) => {
      const fromIndex = current.findIndex((item) => item.id === draggedId)
      const toIndex = current.findIndex((item) => item.id === targetId)
      if (fromIndex < 0 || toIndex < 0) return current
      return moveItem(current, fromIndex, toIndex)
    })
    setDraggedId(targetId)
  }

  const handleItemDragEnd = () => {
    setDraggedId('')
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setErrorMsg('Please add at least 2 PDF files to merge.')
      return
    }

    try {
      setErrorMsg('')
      setStatus('uploading')
      setProgress(5)

      const objectKeys = []
      let backendUrlFromUpload = ''

      for (let index = 0; index < files.length; index += 1) {
        const currentFile = files[index].file
        const { key, pdfMergerBackendUrl } = await uploadToR2(currentFile, 'pdf-merger')
        objectKeys.push(key)

        if (!backendUrlFromUpload && pdfMergerBackendUrl) {
          backendUrlFromUpload = pdfMergerBackendUrl
        }

        const uploadProgress = 10 + Math.round(((index + 1) / files.length) * 60)
        setProgress(uploadProgress)
      }

      setStatus('merging')
      const backendUrl = backendUrlFromUpload || import.meta.env.VITE_PDF_MERGER_BACKEND_URL
      if (!backendUrl) {
        throw new Error('PDF merger backend URL is not configured.')
      }

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objectKeys, compress }),
      })

      if (!response.ok) {
        throw new Error(`Merge failed: ${response.status} ${response.statusText}`)
      }

      setProgress(85)

      const { presignedUrl } = await response.json()
      if (!presignedUrl) {
        throw new Error('No presigned URL returned from server.')
      }

      const downloadResponse = await fetch(presignedUrl)
      if (!downloadResponse.ok) {
        throw new Error(`Failed to fetch merged file: ${downloadResponse.status} ${downloadResponse.statusText}`)
      }

      const blob = await downloadResponse.blob()
      const blobUrl = URL.createObjectURL(blob)
      const mergedFileName = 'merged.pdf'

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl)
      }

      setDownloadUrl(blobUrl)
      setDownloadName(mergedFileName)
      setMergedSize(blob.size)
      setProgress(100)
      setStatus('done')

      const anchor = document.createElement('a')
      anchor.href = blobUrl
      anchor.download = mergedFileName
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    setFiles([])
    setStatus('idle')
    setProgress(0)
    setMergedSize(0)
    setDownloadUrl('')
    setDownloadName('')
    setErrorMsg('')
    setIsDragging(false)
    setDraggedId('')
    setCompress(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return {
    files,
    status,
    progress,
    originalSize,
    mergedSize,
    downloadUrl,
    downloadName,
    errorMsg,
    isDragging,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    handleMerge,
    handleReset,
    handleRemove,
    moveFileUp,
    moveFileDown,
    handleItemDragStart,
    handleItemDragOver,
    handleItemDragEnd,
    openFilePicker,
    compress,
    setCompress,
  }
}
