import { useState, useRef } from 'react';
import { normalizeImageFile } from '../../../commons/normalizeImageFiles';

export function useImageResizer() {
  const [mainImage, setMainImage] = useState(null);
  const [resizeMode, setResizeMode] = useState('percentage'); // 'percentage' or 'dimensions'
  const [percentage, setPercentage] = useState(100);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputName, setOutputName] = useState('resized-image.png');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = await normalizeImageFile(e.dataTransfer.files[0]);
    if (file && file.type.startsWith('image/')) {
      setMainImage(file);
      setOutputUrl(null);
      setErrorMsg('');
      // Set default width/height to original image size
      const img = new window.Image();
      img.onload = () => {
        setWidth(img.width.toString());
        setHeight(img.height.toString());
      };
      img.src = URL.createObjectURL(file);
    } else {
      setErrorMsg('Please drop a valid image file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = async (e) => {
    const file = await normalizeImageFile(e.target.files[0]);
    if (file && file.type.startsWith('image/')) {
      setMainImage(file);
      setOutputUrl(null);
      setErrorMsg('');
      // Set default width/height to original image size
      const img = new window.Image();
      img.onload = () => {
        setWidth(img.width.toString());
        setHeight(img.height.toString());
      };
      img.src = URL.createObjectURL(file);
    } else {
      setErrorMsg('Please select a valid image file.');
    }
  };

  const handleResize = () => {
    if (!mainImage) return;
    setStatus('processing');
    setErrorMsg('');
    const img = new window.Image();
    img.onload = () => {
      let newWidth, newHeight;
      if (resizeMode === 'percentage') {
        const pct = parseFloat(percentage) / 100;
        newWidth = Math.round(img.width * pct);
        newHeight = Math.round(img.height * pct);
      } else {
        newWidth = parseInt(width, 10);
        newHeight = parseInt(height, 10);
      }
      if (!newWidth || !newHeight || newWidth <= 0 || newHeight <= 0) {
        setStatus('idle');
        setErrorMsg('Invalid dimensions.');
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      canvas.toBlob((blob) => {
        if (blob) {
          setOutputUrl(URL.createObjectURL(blob));
          setOutputName(mainImage.name.replace(/\.[^.]+$/, '') + '-resized.png');
        } else {
          setErrorMsg('Failed to resize image.');
        }
        setStatus('idle');
      }, 'image/png');
    };
    img.onerror = () => {
      setStatus('idle');
      setErrorMsg('Failed to load image.');
    };
    img.src = URL.createObjectURL(mainImage);
  };

  return {
    mainImage,
    resizeMode,
    setResizeMode,
    percentage,
    setPercentage,
    width,
    setWidth,
    height,
    setHeight,
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
    handleResize,
  };
}
