import { useState, useRef, useCallback } from 'react'

export function useWatermarker(initialImage) {
  const [mainImage, setMainImage] = useState(initialImage || null)
  const [watermarkType, setWatermarkType] = useState('text') // 'text' or 'logo'
  const [watermarkText, setWatermarkText] = useState('')
  const [logoFile, setLogoFile] = useState(null)
  const [outputUrl, setOutputUrl] = useState('')
  const [outputName, setOutputName] = useState('')
  const [status, setStatus] = useState('idle') // idle | processing | done | error
  const [errorMsg, setErrorMsg] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleMainImage = (f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file.')
      return
    }
    setMainImage(f)
    setStatus('idle')
    setErrorMsg('')
    setOutputUrl('')
    setOutputName('')
  }

  const handleLogoFile = (f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid logo image file.')
      return
    }
    setLogoFile(f)
    setErrorMsg('')
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    handleMainImage(e.dataTransfer.files[0])
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileInput = (e) => {
    handleMainImage(e.target.files[0])
  }

  const handleLogoInput = (e) => {
    handleLogoFile(e.target.files[0])
  }

  const handleWatermark = async () => {
    if (!mainImage) return
    setStatus('processing')
    setErrorMsg('')
    try {
      const img = await loadImage(mainImage)
      let watermarkedCanvas
      if (watermarkType === 'text') {
        watermarkedCanvas = addTextWatermark(img, watermarkText)
      } else if (watermarkType === 'logo' && logoFile) {
        const logoImg = await loadImage(logoFile)
        watermarkedCanvas = addLogoWatermark(img, logoImg)
      } else {
        setErrorMsg('Please provide watermark text or logo.')
        setStatus('idle')
        return
      }
      watermarkedCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          setOutputUrl(url)
          setOutputName('watermarked-' + mainImage.name)
          setStatus('done')
        } else {
          setErrorMsg('Failed to create output image.')
          setStatus('error')
        }
      }, mainImage.type)
    } catch (err) {
      setErrorMsg('Failed to process image.')
      setStatus('error')
    }
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

  function addTextWatermark(img, text) {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    // Make the font size larger for a single, centered watermark
    const fontSize = Math.floor(img.width / 7)
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.22)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.save()
    // Optionally rotate for style
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(-Math.PI / 12)
    ctx.fillText(text, 0, 0)
    ctx.restore()
    return canvas
  }

  function addLogoWatermark(img, logoImg) {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    // Make the logo larger and place it in the center
    const logoWidth = img.width * 0.4
    const logoHeight = logoImg.height * (logoWidth / logoImg.width)
    ctx.globalAlpha = 0.22
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

  return {
    mainImage,
    watermarkType,
    setWatermarkType,
    watermarkText,
    setWatermarkText,
    logoFile,
    setLogoFile,
    outputUrl,
    outputName,
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
  }
}
