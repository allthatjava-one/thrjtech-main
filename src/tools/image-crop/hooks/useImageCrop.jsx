import { useState, useRef, useEffect } from 'react';
import getCroppedImg from '../utils/cropImage';

function applyFlipToSrc(src, flipH, flipV) {
  if (!flipH && !flipV) return Promise.resolve(src);
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.save();
      if (flipH) { ctx.translate(img.width, 0); ctx.scale(-1, 1); }
      if (flipV) { ctx.translate(0, img.height); ctx.scale(1, -1); }
      ctx.drawImage(img, 0, 0);
      ctx.restore();
      resolve(canvas.toDataURL());
    };
    img.src = src;
  });
}

export function useImageCrop() {
  const [mainImage, setMainImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [originalSrc, setOriginalSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [aspect, setAspect] = useState(1);
  const [naturalAspect, setNaturalAspect] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [outputUrl, setOutputUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileInput = async (e) => {
    const file = e.target.files ? e.target.files[0] : e;
    if (!file) return;
    setMainImage(file);
    const url = URL.createObjectURL(file);
    setOriginalSrc(url);
    setImageSrc(url);
    setFlipH(false);
    setFlipV(false);
    setOutputUrl(null);
  };

  // When a NEW file is loaded, reset zoom/crop and detect aspect ratio.
  // Watching originalSrc (not imageSrc) so flips don't trigger a reset.
  useEffect(() => {
    if (!originalSrc) return;
    const img = new window.Image();
    img.onload = () => {
      if (img.width && img.height) {
        const ratio = img.width / img.height;
        setNaturalAspect(ratio);
        setAspect(ratio);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      }
    };
    img.src = originalSrc;
  }, [originalSrc]);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleFileInput(file);
  };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDragLeave = (e) => { e.preventDefault(); };

  const onCropComplete = (_croppedArea, pixels) => {
    setCroppedAreaPixels(pixels);
  };

  const handleFlipH = async () => {
    const newFlipH = !flipH;
    setFlipH(newFlipH);
    if (!originalSrc) return;
    const src = await applyFlipToSrc(originalSrc, newFlipH, flipV);
    setImageSrc(src);
    setOutputUrl(null);
  };

  const handleFlipV = async () => {
    const newFlipV = !flipV;
    setFlipV(newFlipV);
    if (!originalSrc) return;
    const src = await applyFlipToSrc(originalSrc, flipH, newFlipV);
    setImageSrc(src);
    setOutputUrl(null);
  };

  const handleDownload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const { blob, url } = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      setOutputUrl(url);
      return { blob, url };
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleReset = () => {
    if (!originalSrc) return;
    setImageSrc(originalSrc);
    setFlipH(false);
    setFlipV(false);
    setRotation(0);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setOutputUrl(null);
  };

  const setPreset = (preset) => {
    if (preset === 'instagram') setAspect(4/5);
    else if (preset === 'youtube') setAspect(16/9);
    else if (preset === 'profile') setAspect(1);
    // reset zoom/crop for preset
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  return {
    mainImage,
    imageSrc,
    naturalAspect,
    crop,
    setCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    flipH,
    handleFlipH,
    flipV,
    handleFlipV,
    aspect,
    setAspect,
    onCropComplete,
    outputUrl,
    handleDownload,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    setPreset,
    handleReset,
  };
}
