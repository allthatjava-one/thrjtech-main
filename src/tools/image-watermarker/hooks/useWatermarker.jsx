import { useState, useRef, useCallback } from 'react'
import { normalizeImageFiles, normalizeImageFile } from '../../../commons/normalizeImageFiles'

export function useWatermarker(initialImage) {
  const [mainImages, setMainImages] = useState(initialImage ? [initialImage] : [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [watermarkType, setWatermarkType] = useState('text') // 'text' or 'logo'
  const [watermarkText, setWatermarkText] = useState('')
  const [logoFile, setLogoFile] = useState(null)
  const [outputUrls, setOutputUrls] = useState([])
  const [outputNames, setOutputNames] = useState([])
  const [status, setStatus] = useState('idle') // idle | processing | done | error
  const [errorMsg, setErrorMsg] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [repeated, setRepeated] = useState(false)
  const [position, setPosition] = useState('default') // 'default'|'center'|'top-left'|'top-right'|'bottom-left'|'bottom-right'
  const [opacity, setOpacity] = useState(0.25) // 0.0 – 1.0
  const fileInputRef = useRef(null)

  const handleMainImage = async (files) => {
    if (!files) return
    // normalize to array (converts HEIC/HEIF to JPEG)
    const normalized = await normalizeImageFiles(files instanceof FileList ? files : Array.from(files))
    const arr = normalized
      .filter(f => f && f.type && f.type.startsWith('image/'))
    if (!arr.length) {
      setErrorMsg('Please upload valid image files.')
      return
    }
    setMainImages(arr)
    setCurrentIndex(0)
    setStatus('idle')
    setErrorMsg('')
    // clear previous outputs
    if (outputUrls && outputUrls.length) {
      outputUrls.forEach(u => u && URL.revokeObjectURL(u))
    }
    setOutputUrls([])
    setOutputNames([])
  }

  const handleLogoFile = async (f) => {
    if (!f) return
    const normalized = await normalizeImageFile(f)
    if (!normalized.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid logo image file.')
      return
    }
    setLogoFile(normalized)
    setErrorMsg('')
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    handleMainImage(e.dataTransfer.files)
  }, [outputUrls])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileInput = (e) => {
    handleMainImage(e.target.files)
  }

  const handleLogoInput = (e) => {
    handleLogoFile(e.target.files[0])
  }

  const handleWatermark = async () => {
    const imgFile = mainImages[currentIndex]
    if (!imgFile) return
    setStatus('processing')
    setErrorMsg('')
    try {
      const img = await loadImage(imgFile)
      let watermarkedCanvas
      const useRepeated = repeated && position === 'default'
      if (watermarkType === 'text') {
        watermarkedCanvas = useRepeated
          ? addTextWatermarkRepeated(img, watermarkText)
          : addTextWatermark(img, watermarkText)
      } else if (watermarkType === 'logo' && logoFile) {
        const logoImg = await loadImage(logoFile)
        watermarkedCanvas = useRepeated
          ? addLogoWatermarkRepeated(img, logoImg)
          : addLogoWatermark(img, logoImg)
      } else {
        setErrorMsg('Please provide watermark text or logo.')
        setStatus('idle')
        return
      }
      watermarkedCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          // revoke previous for this index
          if (outputUrls[currentIndex]) URL.revokeObjectURL(outputUrls[currentIndex])
          const nextUrls = outputUrls.slice()
          const nextNames = outputNames.slice()
          nextUrls[currentIndex] = url
          nextNames[currentIndex] = 'watermarked-' + imgFile.name
          setOutputUrls(nextUrls)
          setOutputNames(nextNames)
          setStatus('done')
        } else {
          setErrorMsg('Failed to create output image.')
          setStatus('error')
        }
      }, imgFile.type)
    } catch (err) {
      setErrorMsg('Failed to process image.')
      setStatus('error')
    }
  }

  const handleWatermarkAll = async () => {
    if (!mainImages || !mainImages.length) return
    setStatus('processing')
    setErrorMsg('')
    const urls = outputUrls.slice()
    const names = outputNames.slice()
    try {
      for (let i = 0; i < mainImages.length; i++) {
        const imgFile = mainImages[i]
        const img = await loadImage(imgFile)
        let canvas
        const useRepeated = repeated && position === 'default'
        if (watermarkType === 'text') {
          canvas = useRepeated ? addTextWatermarkRepeated(img, watermarkText) : addTextWatermark(img, watermarkText)
        } else if (watermarkType === 'logo' && logoFile) {
          const logoImg = await loadImage(logoFile)
          canvas = useRepeated ? addLogoWatermarkRepeated(img, logoImg) : addLogoWatermark(img, logoImg)
        } else {
          setErrorMsg('Please provide watermark text or logo.')
          setStatus('idle')
          return
        }
        // create blob and URL synchronously
        // eslint-disable-next-line no-await-in-loop
        const blob = await new Promise(resolve => canvas.toBlob(resolve, imgFile.type))
        if (blob) {
          if (urls[i]) URL.revokeObjectURL(urls[i])
          urls[i] = URL.createObjectURL(blob)
          names[i] = 'watermarked-' + imgFile.name
          setOutputUrls(urls.slice())
          setOutputNames(names.slice())
        }
      }
      setStatus('done')
    } catch (err) {
      setErrorMsg('Failed to process images.')
      setStatus('error')
    }
  }

  const handleClear = () => {
    outputUrls.forEach(u => u && URL.revokeObjectURL(u))
    setMainImages([])
    setCurrentIndex(0)
    setOutputUrls([])
    setOutputNames([])
    setStatus('idle')
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Helpers
  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new window.Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = e.target.result
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // compute margin and anchor helpers
  function anchorCoords(canvas, widthPx, heightPx, pos) {
    const margin = Math.max(16, Math.floor(Math.min(canvas.width, canvas.height) * 0.04))
    switch (pos) {
      case 'top-left':
        return { x: margin, y: margin + heightPx / 2, align: 'left' }
      case 'top-right':
        return { x: canvas.width - margin, y: margin + heightPx / 2, align: 'right' }
      case 'bottom-left':
        return { x: margin, y: canvas.height - margin - heightPx / 2, align: 'left' }
      case 'bottom-right':
        return { x: canvas.width - margin, y: canvas.height - margin - heightPx / 2, align: 'right' }
      case 'center':
        return { x: canvas.width / 2, y: canvas.height / 2, align: 'center' }
      default:
        return { x: canvas.width / 2, y: canvas.height / 2, align: 'center' }
    }
  }

  function addTextWatermark(img, text) {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    if (position === 'default') {
      const fontSize = Math.floor(img.width / 7)
      ctx.font = `bold ${fontSize}px sans-serif`
      ctx.fillStyle = `rgba(255,255,255,${opacity})`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(-Math.PI / 12)
      ctx.fillText(text, 0, 0)
      ctx.restore()
      return canvas
    }

    // Non-default: place single watermark at chosen corner/center with no rotation
    const fontSize = Math.max(14, Math.floor(img.width / 14))
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.fillStyle = `rgba(255,255,255,${opacity})`
    const metricsHeight = fontSize
    const anchor = anchorCoords(canvas, ctx.measureText(text).width, metricsHeight, position)
    ctx.textAlign = anchor.align
    ctx.textBaseline = 'middle'
    ctx.fillText(text, anchor.x, anchor.y)
    return canvas
  }

  function addLogoWatermark(img, logoImg) {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    if (position === 'default') {
      const logoWidth = img.width * 0.4
      const logoHeight = logoImg.height * (logoWidth / logoImg.width)
      ctx.globalAlpha = opacity
      ctx.drawImage(
        logoImg,
        (canvas.width - logoWidth) / 2,
        (canvas.height - logoHeight) / 2,
        logoWidth,
        logoHeight
      )
      ctx.globalAlpha = 1.0
      return canvas
    }

    // Non-default: smaller logo placed at chosen anchor without rotation
    const logoWidth = Math.max(32, Math.floor(img.width * 0.18))
    const logoHeight = Math.floor(logoImg.height * (logoWidth / logoImg.width))
    const anchor = anchorCoords(canvas, logoWidth, logoHeight, position)
    ctx.globalAlpha = opacity
    let drawX = anchor.x
    if (anchor.align === 'center') drawX = anchor.x - logoWidth / 2
    if (anchor.align === 'left') drawX = anchor.x
    if (anchor.align === 'right') drawX = anchor.x - logoWidth
    const drawY = anchor.y - logoHeight / 2
    ctx.drawImage(logoImg, drawX, drawY, logoWidth, logoHeight)
    ctx.globalAlpha = 1.0
    return canvas
  }

  function addTextWatermarkRepeated(img, text) {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const fontSize = Math.max(14, Math.floor(img.width / 18))
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.fillStyle = `rgba(255,255,255,${opacity})`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const textWidth = ctx.measureText(text).width
    const gapX = textWidth + fontSize * 2.5
    const gapY = fontSize * 3.5
    const diagonal = Math.ceil(Math.sqrt(img.width ** 2 + img.height ** 2))
    ctx.save()
    ctx.translate(img.width / 2, img.height / 2)
    ctx.rotate(-Math.PI / 6)
    for (let y = -diagonal; y <= diagonal; y += gapY) {
      for (let x = -diagonal; x <= diagonal; x += gapX) {
        ctx.fillText(text, x, y)
      }
    }
    ctx.restore()
    return canvas
  }

  function addLogoWatermarkRepeated(img, logoImg) {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const logoWidth = Math.max(32, Math.floor(img.width / 6))
    const logoHeight = Math.floor(logoImg.height * (logoWidth / logoImg.width))
    const gapX = logoWidth * 2.2
    const gapY = logoHeight * 2.5
    const diagonal = Math.ceil(Math.sqrt(img.width ** 2 + img.height ** 2))
    ctx.globalAlpha = opacity
    ctx.save()
    ctx.translate(img.width / 2, img.height / 2)
    ctx.rotate(-Math.PI / 6)
    for (let y = -diagonal; y <= diagonal; y += gapY) {
      for (let x = -diagonal; x <= diagonal; x += gapX) {
        ctx.drawImage(logoImg, x - logoWidth / 2, y - logoHeight / 2, logoWidth, logoHeight)
      }
    }
    ctx.restore()
    ctx.globalAlpha = 1.0
    return canvas
  }
  return {
    mainImages,
    currentIndex,
    setCurrentIndex,
    watermarkType,
    setWatermarkType,
    watermarkText,
    setWatermarkText,
    logoFile,
    setLogoFile,
    repeated,
    setRepeated,
    position,
    setPosition,
    opacity,
    setOpacity,
    outputUrls,
    outputNames,
    status,
    errorMsg,
    isDragging,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    handleLogoInput,
    handleWatermark,
    handleWatermarkAll,
    handleClear,
  }
}
