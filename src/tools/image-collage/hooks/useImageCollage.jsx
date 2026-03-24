import { useState } from "react";

const PADDING = 10;

function useImageCollage({
  columns,
  setColumns,
  rows,
  setRows,
  width,
  height,
  images,
  setImages,
  setCollageUrl,
  fileInputRef,
  collageUrl,
  targetWidth,
  targetHeight,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Always use 10px for both outer and between-image padding
  const OUTER_PADDING_X = PADDING;
  const OUTER_PADDING_Y = PADDING;
  const expectedWidth = columns * width + (columns - 1) * PADDING + 2 * OUTER_PADDING_X;
  const expectedHeight = rows * height + (rows - 1) * PADDING + 2 * OUTER_PADDING_Y;
  // Allow collage if at least one image
  const canCollage = images.length > 0;

  const handleDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (!files.length) return;
    let newImages = images.concat(files);
    // Auto-expand grid if needed
    let total = newImages.length;
    let newCols = columns;
    let newRows = rows;
    while (newCols * newRows < total) {
      if (newCols <= newRows) newCols++;
      else newRows++;
    }
    setImages(newImages);
    if (setColumns && newCols !== columns) setColumns(newCols);
    if (setRows && newRows !== rows) setRows(newRows);
  };

  const handleFileChange = e => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
    if (!files.length) return;
    let newImages = images.concat(files);
    // Auto-expand grid if needed
    let total = newImages.length;
    let newCols = columns;
    let newRows = rows;
    while (newCols * newRows < total) {
      if (newCols <= newRows) newCols++;
      else newRows++;
    }
    setImages(newImages);
    if (setColumns && newCols !== columns) setColumns(newCols);
    if (setRows && newRows !== rows) setRows(newRows);
  };

  // offsets: optional array of {x,y} per image to shift the drawn image inside its cell
  const handleCollage = async (targetWidth, targetHeight, offsets = []) => {
    if (!canCollage) return;
    const canvas = document.createElement("canvas");
    canvas.width = expectedWidth;
    canvas.height = expectedHeight;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        if (idx >= images.length) { idx++; continue; } // leave blank
        const file = images[idx];
        const img = await loadImage(file);
        try {
          const cellX = OUTER_PADDING_X + c * (width + PADDING);
          const cellY = OUTER_PADDING_Y + r * (height + PADDING);
          const cellW = width;
          const cellH = height;
          const imgRatio = img.width / img.height;
          const cellRatio = cellW / cellH;
          let drawW, drawH;
          // Use cover mode: scale to fill cell, clip overflow
          if (imgRatio > cellRatio) {
            drawH = cellH;
            drawW = cellH * imgRatio;
          } else {
            drawW = cellW;
            drawH = cellW / imgRatio;
          }
          const baseOffsetX = cellX - (drawW - cellW) / 2;
          const baseOffsetY = cellY - (drawH - cellH) / 2;
          const extra = offsets[idx] || { x: 0, y: 0 };
          const offsetX = baseOffsetX + extra.x;
          const offsetY = baseOffsetY + extra.y;
          ctx.save();
          ctx.beginPath();
          ctx.rect(cellX, cellY, cellW, cellH);
          ctx.clip();
          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
          ctx.restore();
        } finally {
          try {
            if (img && typeof img.src === "string" && img.src.startsWith("blob:")) {
              URL.revokeObjectURL(img.src);
            }
          } catch (e) {}
        }
        idx++;
      }
    }
    // If a target total size is provided and differs from the base expected size, scale the result
    const baseDataUrl = canvas.toDataURL("image/png");
    if (targetWidth && targetHeight && (targetWidth !== canvas.width || targetHeight !== canvas.height)) {
      const out = document.createElement("canvas");
      out.width = targetWidth;
      out.height = targetHeight;
      const outCtx = out.getContext("2d");
      outCtx.fillStyle = "#fff";
      outCtx.fillRect(0, 0, out.width, out.height);
      // Scale to fit while preserving aspect ratio, center the result
      const scale = Math.min(targetWidth / canvas.width, targetHeight / canvas.height);
      const newW = Math.round(canvas.width * scale);
      const newH = Math.round(canvas.height * scale);
      const offsetXOut = Math.round((targetWidth - newW) / 2);
      const offsetYOut = Math.round((targetHeight - newH) / 2);
      outCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, offsetXOut, offsetYOut, newW, newH);
      setCollageUrl(out.toDataURL("image/png"));
    } else {
      setCollageUrl(baseDataUrl);
    }
  };

  const handleDownload = () => {
    if (!collageUrl) return;
    setDownloading(true);
    const a = document.createElement("a");
    a.href = collageUrl;
    a.download = "collage.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(false), 500);
  };

  return {
    handleDrop,
    handleFileChange,
    handleCollage,
    isDragging,
    expectedWidth,
    expectedHeight,
    canCollage,
    downloading,
    handleDownload,
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

export default useImageCollage;
