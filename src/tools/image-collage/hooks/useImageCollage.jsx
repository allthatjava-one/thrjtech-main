import { useState } from "react";
import { normalizeImageFiles, isImageFile } from '../../../commons/normalizeImageFiles';

const DEFAULT_GAP = 10;

export function computeCanvasSize(rows, cols, cellW, cellH, gapPx = DEFAULT_GAP) {
  return {
    width: cols * cellW + (cols + 1) * gapPx,
    height: rows * cellH + (rows + 1) * gapPx,
  };
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function useImageCollage({ rows, cols, cellWidth, cellHeight, images, setImages, fileInputRef }) {
  const [downloading, setDownloading] = useState(false);

  const addFiles = async (fileList) => {
    const raw = await normalizeImageFiles(fileList);
    const files = raw.filter(isImageFile);
    if (!files.length) return;
    setImages(prev => prev.concat(files));
  };

  const handleFileChange = async e => {
    // Blur immediately so Samsung Browser releases scroll control after file picker closes.
    if (fileInputRef?.current) fileInputRef.current.blur();
    await addFiles(e.target.files);
  };

  // Returns a PNG data URL, or null if no images.
  // offsets: array of {x,y} per image; scales: array of scale multipliers per image.
  const handleCollage = async (offsets = [], scales = [], bgColor = '#ffffff', gapPx = DEFAULT_GAP) => {
    if (!images.length) return null;
    const { width: canvasW, height: canvasH } = computeCanvasSize(rows, cols, cellWidth, cellHeight, gapPx);
    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bgColor || '#ffffff';
    ctx.fillRect(0, 0, canvasW, canvasH);
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const file = images[idx] || null;
        if (!file) { idx++; continue; }
        const img = await loadImage(file);
        try {
          const cellX = gapPx + c * (cellWidth + gapPx);
          const cellY = gapPx + r * (cellHeight + gapPx);
          const imgRatio = img.width / img.height;
          const cellRatio = cellWidth / cellHeight;
          let drawW0, drawH0;
          if (imgRatio > cellRatio) {
            drawH0 = cellHeight;
            drawW0 = cellHeight * imgRatio;
          } else {
            drawW0 = cellWidth;
            drawH0 = cellWidth / imgRatio;
          }
          const scale = scales[idx] || 1;
          const drawW = Math.round(drawW0 * scale);
          const drawH = Math.round(drawH0 * scale);
          const baseOffX = cellX - (drawW - cellWidth) / 2;
          const baseOffY = cellY - (drawH - cellHeight) / 2;
          const extra = offsets[idx] || { x: 0, y: 0 };
          ctx.save();
          ctx.beginPath();
          ctx.rect(cellX, cellY, cellWidth, cellHeight);
          ctx.clip();
          ctx.drawImage(img, baseOffX + extra.x, baseOffY + extra.y, drawW, drawH);
          ctx.restore();
        } finally {
          try { if (img?.src?.startsWith('blob:')) URL.revokeObjectURL(img.src); } catch (e) {}
        }
        idx++;
      }
    }
    return canvas.toDataURL("image/png");
  };

  const handleDownload = async (offsets, scales, bgColor, gapPx) => {
    if (!images.length) return;
    setDownloading(true);
    try {
      const dataUrl = await handleCollage(offsets, scales, bgColor, gapPx);
      if (!dataUrl) return;
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "collage.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setTimeout(() => setDownloading(false), 500);
    }
  };

  return {
    addFiles,
    handleFileChange,
    handleCollage,
    handleDownload,
    downloading,
  };
}

export default useImageCollage;
