import { useState, useRef } from 'react';
import JSZip from 'jszip';
import { normalizeImageFiles, isImageFile } from '../../../commons/normalizeImageFiles';

async function renderRotated(file, rotation) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const swapped = rotation === 90 || rotation === 270;
      const w = swapped ? img.naturalHeight : img.naturalWidth;
      const h = swapped ? img.naturalWidth : img.naturalHeight;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.translate(w / 2, h / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      const mime = file.type && file.type !== 'image/heic' && file.type !== 'image/heif'
        ? file.type
        : 'image/png';
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')), mime);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function getOutputName(file, rotation) {
  if (rotation === 0) return file.name;
  const dot = file.name.lastIndexOf('.');
  const base = dot >= 0 ? file.name.slice(0, dot) : file.name;
  const ext = dot >= 0 ? file.name.slice(dot) : '';
  return `${base}-rotated${ext}`;
}

export function useImageRotator() {
  const [items, setItems] = useState([]); // [{ file, rotation, previewUrl }]
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'downloading'
  const [applyAll, setApplyAll] = useState(false);
  const fileInputRef = useRef();

  const addFiles = async (rawFiles) => {
    const normalized = await normalizeImageFiles(Array.from(rawFiles));
    const valid = normalized.filter(isImageFile);
    if (!valid.length) return;
    const newItems = valid.map((file) => ({
      file,
      rotation: 0,
      previewUrl: URL.createObjectURL(file),
    }));
    setItems((prev) => {
      // Revoke old URLs when replacing
      if (prev.length === 0) {
        setSelectedIdx(0);
        return newItems;
      }
      setSelectedIdx(prev.length);
      return [...prev, ...newItems];
    });
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    await addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

  const handleFileInput = async (e) => {
    if (e.target.files?.length) {
      await addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const rotate = (idx, direction) => {
    const delta = direction === 'right' ? 90 : -90;
    setItems((prev) => prev.map((item, i) => {
      if (!applyAll && i !== idx) return item;
      const next = ((item.rotation + delta) % 360 + 360) % 360;
      return { ...item, rotation: next };
    }));
  };

  const removeItem = (idx) => {
    setItems((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl);
      const next = prev.filter((_, i) => i !== idx);
      return next;
    });
    setSelectedIdx((prev) => Math.max(0, Math.min(prev, items.length - 2)));
  };

  const handleClear = () => {
    setItems((prev) => { prev.forEach((it) => URL.revokeObjectURL(it.previewUrl)); return []; });
    setSelectedIdx(0);
  };

  const downloadOne = async (idx) => {
    const item = items[idx];
    if (!item) return;
    setStatus('downloading');
    try {
      const blob = await renderRotated(item.file, item.rotation);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = getOutputName(item.file, item.rotation);
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setStatus('idle');
    }
  };

  const downloadAll = async () => {
    setStatus('downloading');
    try {
      const zip = new JSZip();
      await Promise.all(items.map(async (item) => {
        const blob = await renderRotated(item.file, item.rotation);
        zip.file(getOutputName(item.file, item.rotation), blob);
      }));
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rotated-images.zip';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setStatus('idle');
    }
  };

  return {
    items,
    selectedIdx,
    setSelectedIdx,
    isDragging,
    fileInputRef,
    status,
    applyAll,
    setApplyAll,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    rotate,
    removeItem,
    handleClear,
    downloadOne,
    downloadAll,
  };
}
