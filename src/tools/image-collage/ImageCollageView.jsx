import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useImageCollage from "./hooks/useImageCollage";
import ImageFileList from "./ImageFileList";

const ImageCollageView = ({
  columns,
  setColumns,
  rows,
  setRows,
  width,
  setWidth,
  height,
  setHeight,
  images,
  setImages,
  collageUrl,
  setCollageUrl,
}) => {
  const fileInputRef = useRef(null);
  const [totalWidth, setTotalWidth] = useState(1200);
  const [totalHeight, setTotalHeight] = useState(1200);
  const [lockRatio, setLockRatio] = useState(false);
  const ratioRef = useRef(1);
  const navigate = useNavigate();
  const [sendStatus, setSendStatus] = useState('idle');

  const handleSendToWatermark = async () => {
    setSendStatus('processing');
    try {
      const response = await fetch(collageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'collage.png', { type: 'image/png' });
      navigate('/image-watermarker', { state: { mainImage: file } });
    } catch (e) {
      setSendStatus('error');
    }
  };

  const {
    handleDrop,
    handleFileChange,
    handleCollage,
    isDragging,
    expectedWidth,
    expectedHeight,
    canCollage,
    downloading,
    handleDownload,
  } = useImageCollage({
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
  });

  // Sync totalWidth/totalHeight to the computed collage size whenever it changes
  useEffect(() => {
    if (images.length > 0) {
      setTotalWidth(expectedWidth);
      setTotalHeight(expectedHeight);
      if (expectedHeight > 0) ratioRef.current = expectedWidth / expectedHeight;
    }
  }, [expectedWidth, expectedHeight]);

  const handleTotalWidthChange = val => {
    if (!Number.isFinite(val) || val <= 0) return;
    if (lockRatio && ratioRef.current > 0) {
      setTotalWidth(val);
      setTotalHeight(Math.max(1, Math.round(val / ratioRef.current)));
    } else {
      setTotalWidth(val);
    }
  };

  const handleTotalHeightChange = val => {
    if (!Number.isFinite(val) || val <= 0) return;
    if (lockRatio && ratioRef.current > 0) {
      setTotalHeight(val);
      setTotalWidth(Math.max(1, Math.round(val * ratioRef.current)));
    } else {
      setTotalHeight(val);
    }
  };

  const handleMove = (from, to) => {
    if (to < 0 || to >= images.length) return;
    const newImages = images.slice();
    const [moved] = newImages.splice(from, 1);
    newImages.splice(to, 0, moved);
    setImages(newImages);
  };

  const handleRemove = idx => {
    const newImages = images.slice();
    newImages.splice(idx, 1);
    setImages(newImages);
  };

  // preview and draggable offsets
  const [showDialog, setShowDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [previewMeta, setPreviewMeta] = useState([]);
  const [offsets, setOffsets] = useState([]);
  const previewRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const previewWrapperRef = useRef(null);

  // Build preview URLs and reset offsets when images change
  useEffect(() => {
    previewUrls.forEach(u => URL.revokeObjectURL(u));
    const urls = images.map(f => URL.createObjectURL(f));
    setPreviewUrls(urls);
    setOffsets(images.map(() => ({ x: 0, y: 0 })));
    // load natural sizes for exact cover calculations
    Promise.all(
      urls.map(
        u =>
          new Promise(resolve => {
            const img = new window.Image();
            img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
            img.onerror = () => resolve({ w: 1, h: 1 });
            img.src = u;
          })
      )
    ).then(meta => setPreviewMeta(meta));

    return () => urls.forEach(u => URL.revokeObjectURL(u));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // compute a scale so the preview content fits the available wrapper (or 1)
  useEffect(() => {
    if (!showPreview) return;
    const compute = () => {
      const wrap = previewWrapperRef.current;
      if (!wrap) return setPreviewScale(1);
      const rect = wrap.getBoundingClientRect();
      const availW = rect.width;
      const availH = rect.height;
      const scale = Math.min(availW / Math.max(1, expectedWidth), availH / Math.max(1, expectedHeight), 1);
      setPreviewScale(scale);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPreview, expectedWidth, expectedHeight]);

  // Drag state
  const dragRef = useRef({ active: -1, startX: 0, startY: 0, startOffset: { x: 0, y: 0 } });

  const onPointerDown = (e, idx, imgDisplayScale = 1) => {
    e.preventDefault();
    const p = offsets[idx] || { x: 0, y: 0 };
    dragRef.current = {
      active: idx,
      startX: e.clientX,
      startY: e.clientY,
      startOffset: { x: p.x, y: p.y },
      scale: imgDisplayScale || 1,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);

    const onMove = ev => {
      const dX = ev.clientX - dragRef.current.startX;
      const dY = ev.clientY - dragRef.current.startY;
      // convert pointer delta to canvas pixels (preview scale = 1 unless scaled)
      const newOffsets = offsets.slice();
      newOffsets[dragRef.current.active] = {
        x: Math.round(dragRef.current.startOffset.x + dX / dragRef.current.scale),
        y: Math.round(dragRef.current.startOffset.y + dY / dragRef.current.scale),
      };
      setOffsets(newOffsets);
    };

    const onUp = ev => {
      try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch (err) {}
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      dragRef.current.active = -1;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const handleResetOffset = idx => {
    const n = offsets.slice();
    n[idx] = { x: 0, y: 0 };
    setOffsets(n);
  };

  const onCollageAndPreview = async () => {
    if (!canCollage) return;
    if (!showPreview) {
      setShowPreview(true);
      return;
    }
    // finalize using offsets
    await handleCollage(totalWidth, totalHeight, offsets);
    setShowPreview(false);
  };

  return (
    <>
      <h2 className="hero-title">Image Collage</h2>
      <p className="hero-tagline">Combine multiple images into a beautiful grid collage.</p>
      <div
        className={`drop-zone${isDragging ? " dragging" : ""}`}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onDragEnter={e => e.preventDefault()}
        onDragLeave={e => e.preventDefault()}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <span>
          Drag &amp; drop images here, or click to add. The grid will expand as needed.
        </span>
        {images.length > 0 && (
          <ImageFileList images={images} onMove={handleMove} onRemove={handleRemove} onReset={handleResetOffset} />
        )}
      </div>
      <div className="collage-options">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <label>
            Columns:
            <input
              type="number"
              min={1}
              max={10}
              value={columns}
              onChange={e => setColumns(Number(e.target.value))}
            />
          </label>
          <label>
            Rows:
            <input
              type="number"
              min={1}
              max={10}
              value={rows}
              onChange={e => setRows(Number(e.target.value))}
            />
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ display: 'flex', flexDirection: 'column' }}>
            Width:
            <input
              type="number"
              min={50}
              value={totalWidth}
              onChange={e => handleTotalWidthChange(Number(e.target.value))}
            />
          </label>

          <button
            type="button"
            aria-label={lockRatio ? 'Unlink width and height' : 'Link width and height'}
            onClick={() => {
              const newLock = !lockRatio;
              setLockRatio(newLock);
              if (newLock && totalHeight > 0) ratioRef.current = totalWidth / totalHeight;
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0 0.3rem',
              fontSize: '1.3rem',
              color: lockRatio ? '#3182ce' : '#a0aec0',
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'center',
            }}
          >
            {lockRatio ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 1 7 0l1 1a5 5 0 0 1 0 7 5 5 0 0 1-7 0l-1-1"/>
                <path d="M14 11a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 0 7 5 5 0 0 0 7 0l1-1"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 7a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 0 7 5 5 0 0 0 7 0l1-1"/>
                <line x1="2" y1="2" x2="22" y2="22"/>
              </svg>
            )}
          </button>

          <label style={{ display: 'flex', flexDirection: 'column' }}>
            Height:
            <input
              type="number"
              min={50}
              value={totalHeight}
              onChange={e => handleTotalHeightChange(Number(e.target.value))}
            />
          </label>
        </div>
      </div>
      <button
        className="collage-btn"
        onClick={onCollageAndPreview}
        disabled={!canCollage}
      >
        Collage and Preview
      </button>
      {collageUrl && (
        <>
          <div className="collage-preview-outer">
            <div className="collage-preview">
              <img
                src={collageUrl}
                alt="Collage Preview"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowDialog(true)}
              />
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '1rem', color: '#444' }}>
            Final Collage Size: {totalWidth} x {totalHeight} px
          </div>
          <button
            className="download-btn"
            onClick={handleDownload}
            disabled={downloading}
            style={{ margin: '1.2rem auto 0 auto', display: 'block' }}
          >
            {downloading ? "Downloading..." : "Download"}
          </button>
          <div
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              border: '1.5px solid #e2e6f0',
              borderRadius: 10,
              background: '#f7f8fa',
              padding: '1rem 1.2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              minHeight: 64,
            }}
          >
            <span style={{ fontWeight: 600, color: '#222', fontSize: '1.08rem', flex: 1, display: 'block', alignSelf: 'center' }}>
              Would you like to put a private watermark on the collaged image?
            </span>
            <button
              className="collage-btn"
              style={{ minWidth: 64, padding: '0.35rem 1.1rem', fontSize: '0.98rem', marginLeft: 12, alignSelf: 'center' }}
              onClick={handleSendToWatermark}
              disabled={sendStatus === 'processing'}
            >
              {sendStatus === 'processing' ? 'Preparing...' : 'Yes'}
            </button>
          </div>
          {sendStatus === 'error' && (
            <div className="error-msg" style={{ marginTop: 8 }}>Failed to send image to watermark tool.</div>
          )}
          {showDialog && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
              onClick={() => setShowDialog(false)}
            >
              <img
                src={collageUrl}
                alt="Collage Full Preview"
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  boxShadow: '0 0 24px #000',
                  background: '#fff',
                  borderRadius: '8px',
                }}
                onClick={e => e.stopPropagation()}
              />
              <button
                style={{
                  position: 'fixed',
                  top: 24,
                  right: 32,
                  fontSize: '2rem',
                  background: 'none',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 1001,
                }}
                onClick={() => setShowDialog(false)}
                aria-label="Close preview"
              >
                ×
              </button>
            </div>
          )}
        </>
      )}

      {showPreview && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setShowPreview(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 8,
              padding: 12,
              maxWidth: '95vw',
              maxHeight: '95vh',
              overflow: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <strong style={{ color: '#222' }}>Preview (drag images to reposition)</strong>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button onClick={() => { setOffsets(images.map(()=>({x:0,y:0}))); }} className="collage-btn">Reset Positions</button>
                <button onClick={async () => { await handleCollage(totalWidth, totalHeight, offsets); setShowPreview(false); }} className="collage-btn">Finalize Collage</button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="collage-btn"
                  style={{ marginLeft: 8, background: '#ff6b6b', borderColor: '#ff6b6b', color: '#fff' }}
                >
                  Close
                </button>
              </div>
            </div>

            <div
              ref={previewRef}
              style={{
                width: expectedWidth,
                height: expectedHeight,
                maxWidth: '86vw',
                maxHeight: '70vh',
                overflow: 'auto',
                position: 'relative',
                background: '#f6f7fb',
                border: '1px solid #e6e9f2',
              }}
            >
              {/* Render grid cells */}
              {Array.from({ length: rows * columns }).map((_, idx) => {
                const col = idx % columns;
                const row = Math.floor(idx / columns);
                const cellW = width;
                const cellH = height;
                const left = col * (cellW + 10) + 10; // matches PADDING logic in hook (10)
                const top = row * (cellH + 10) + 10;
                const file = images[idx];
                const url = previewUrls[idx];
                const meta = previewMeta[idx] || { w: 1, h: 1 };
                const off = offsets[idx] || { x: 0, y: 0 };

                // compute exact cover sizing based on natural size
                const imgRatio = meta.w / meta.h;
                const cellRatio = cellW / cellH;
                let drawW, drawH;
                if (imgRatio > cellRatio) {
                  drawH = cellH;
                  drawW = cellH * imgRatio;
                } else {
                  drawW = cellW;
                  drawH = cellW / imgRatio;
                }

                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left,
                      top,
                      width: cellW,
                      height: cellH,
                      overflow: 'hidden',
                      background: '#fff',
                      border: '1px solid #ddd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {file && url && (
                      <img
                        src={url}
                        data-idx={idx}
                        alt={file.name}
                        draggable={false}
                        onPointerDown={e => onPointerDown(e, idx, previewScale)}
                        style={{
                          position: 'absolute',
                          left: off.x + (cellW - drawW) / 2,
                          top: off.y + (cellH - drawH) / 2,
                          width: drawW,
                          height: drawH,
                          cursor: 'grab',
                          userSelect: 'none',
                          touchAction: 'none',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default ImageCollageView;
