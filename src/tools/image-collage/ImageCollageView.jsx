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
  const [previewErrors, setPreviewErrors] = useState([]);
  const [offsets, setOffsets] = useState([]);
  const [scales, setScales] = useState([]);
  const previewRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const previewWrapperRef = useRef(null);
  const previewOverlayRef = useRef(null);

  // Build preview URLs and reset offsets when images change
  useEffect(() => {
    previewUrls.forEach(u => {
      try { if (u && typeof u === 'string' && u.startsWith('blob:')) URL.revokeObjectURL(u); } catch (e) {}
    });
    const urls = images.map(f => URL.createObjectURL(f));
    setPreviewUrls(urls);
    setPreviewErrors(images.map(() => false));
    setOffsets(images.map(() => ({ x: 0, y: 0 })));
    setScales(images.map(() => 1));
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

    return () => urls.forEach(u => { try { if (u && typeof u === 'string' && u.startsWith('blob:')) URL.revokeObjectURL(u); } catch (e) {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const tryPreviewDataUrl = idx => {
    const file = images[idx];
    if (!file) {
      const arr = previewErrors.slice(); arr[idx] = true; setPreviewErrors(arr); return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const arr = previewUrls.slice();
      arr[idx] = reader.result;
      setPreviewUrls(arr);
      const errs = previewErrors.slice(); errs[idx] = false; setPreviewErrors(errs);
    };
    reader.onerror = () => {
      const errs = previewErrors.slice(); errs[idx] = true; setPreviewErrors(errs);
    };
    reader.readAsDataURL(file);
  };

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
  // Pinch state for touch two-finger zoom
  const pinchRef = useRef({ pointers: new Map(), active: false, startDist: 0, idx: -1, startScale: 1, startOffsets: { x: 0, y: 0 }, meta: null, cell: null });

  // Handle pointerdown on preview wrapper to support pinch gestures
  const handlePreviewPointerDown = e => {
    try { previewRef.current && previewRef.current.setPointerCapture?.(e.pointerId); } catch (err) {}
    const pmap = pinchRef.current.pointers;
    pmap.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pmap.size === 2 && !pinchRef.current.active) {
      // begin pinch
      const iter = pmap.values();
      const p1 = iter.next().value;
      const p2 = iter.next().value;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.hypot(dx, dy) || 1;
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      // find image element under midpoint
      const el = document.elementFromPoint(midX, midY);
      if (!el) return;
      const imgEl = el.closest && el.closest('img[data-idx]') ? el.closest('img[data-idx]') : (el.dataset && el.dataset.idx ? el : null);
      let idx = null;
      if (imgEl && imgEl.getAttribute) {
        idx = Number(imgEl.getAttribute('data-idx'));
      } else if (el && el.dataset && typeof el.dataset.idx !== 'undefined') {
        idx = Number(el.dataset.idx);
      }
      if (idx == null || Number.isNaN(idx) || !images[idx]) return;
      pinchRef.current.active = true;
      pinchRef.current.startDist = dist;
      pinchRef.current.idx = idx;
      pinchRef.current.startScale = scales[idx] || 1;
      pinchRef.current.meta = previewMeta[idx] || { w: 1, h: 1 };
      pinchRef.current.cell = {
        left: Math.floor((idx % columns) * (width + 10) + 10),
        top: Math.floor(Math.floor(idx / columns) * (height + 10) + 10),
        w: width,
        h: height,
      };
      const off = offsets[idx] || { x: 0, y: 0 };
      pinchRef.current.startOffsets = { x: off.x, y: off.y };
      window.addEventListener('pointermove', handlePreviewPointerMove);
      window.addEventListener('pointerup', handlePreviewPointerUp);
    }
  };

  const handlePreviewPointerMove = e => {
    const pmap = pinchRef.current.pointers;
    if (!pmap.has(e.pointerId)) return;
    pmap.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!pinchRef.current.active) return;
    // compute new distance between the two pointers
    const vals = Array.from(pmap.values());
    if (vals.length < 2) return;
    const p1 = vals[0];
    const p2 = vals[1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy) || 1;
    const scaleFactor = dist / (pinchRef.current.startDist || 1);
    const newScaleRaw = pinchRef.current.startScale * scaleFactor;
    const newScale = Math.max(0.5, Math.min(4.0, newScaleRaw));

    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const idx = pinchRef.current.idx;
    const meta = pinchRef.current.meta || { w: 1, h: 1 };
    const cell = pinchRef.current.cell;

    // compute base cover sizes
    const imgRatio = meta.w / meta.h;
    const cellRatio = cell.w / cell.h;
    let drawW0, drawH0;
    if (imgRatio > cellRatio) {
      drawH0 = cell.h;
      drawW0 = cell.h * imgRatio;
    } else {
      drawW0 = cell.w;
      drawH0 = cell.w / imgRatio;
    }

    const prevScale = pinchRef.current.startScale;
    const drawW_old = drawW0 * prevScale;
    const drawH_old = drawH0 * prevScale;
    const drawW_new = drawW0 * newScale;
    const drawH_new = drawH0 * newScale;

    // convert midpoint to canvas-space relative to image
    const imgEl = document.elementFromPoint(midX, midY)?.closest?.call(document.elementFromPoint(midX, midY), 'img[data-idx]') || null;
    const imgRect = imgEl ? imgEl.getBoundingClientRect() : { left: midX, top: midY };
    const px = (midX - imgRect.left) / previewScale;
    const py = (midY - imgRect.top) / previewScale;

    const baseOffsetX_old = cell.left - (drawW_old - cell.w) / 2;
    const baseOffsetY_old = cell.top - (drawH_old - cell.h) / 2;
    const baseOffsetX_new = cell.left - (drawW_new - cell.w) / 2;
    const baseOffsetY_new = cell.top - (drawH_new - cell.h) / 2;

    const off = pinchRef.current.startOffsets || { x: 0, y: 0 };
    const focal_canvas_x = baseOffsetX_old + off.x + px;
    const focal_canvas_y = baseOffsetY_old + off.y + py;

    const uX = drawW_old !== 0 ? px / drawW_old : 0.5;
    const uY = drawH_old !== 0 ? py / drawH_old : 0.5;
    const f_new_x = uX * drawW_new;
    const f_new_y = uY * drawH_new;

    const newOffX = Math.round(focal_canvas_x - baseOffsetX_new - f_new_x);
    const newOffY = Math.round(focal_canvas_y - baseOffsetY_new - f_new_y);

    const nextOffsets = offsets.slice();
    nextOffsets[idx] = { x: newOffX, y: newOffY };
    const nextScales = scales.slice();
    nextScales[idx] = newScale;
    setOffsets(nextOffsets);
    setScales(nextScales);
  };

  const handlePreviewPointerUp = e => {
    const pmap = pinchRef.current.pointers;
    pmap.delete(e.pointerId);
    if (pmap.size < 2 && pinchRef.current.active) {
      pinchRef.current.active = false;
      pinchRef.current.idx = -1;
      window.removeEventListener('pointermove', handlePreviewPointerMove);
      window.removeEventListener('pointerup', handlePreviewPointerUp);
    }
  };

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

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const onImageWheel = (e, idx, meta, off, cellW, cellH, cellLeft, cellTop) => {
    if (!e.altKey) return; // Alt+wheel to zoom
    e.preventDefault();
    const prevScale = (scales[idx] || 1);
    const factor = e.deltaY < 0 ? 1.06 : 0.94;
    let newScale = clamp(prevScale * factor, 0.5, 4.0);
    if (Math.abs(newScale - prevScale) < 0.0001) return;

    // compute base cover sizes (without scale)
    const imgRatio = (meta && meta.w && meta.h) ? meta.w / meta.h : 1;
    const cellRatio = cellW / cellH;
    let drawW0, drawH0;
    if (imgRatio > cellRatio) {
      drawH0 = cellH;
      drawW0 = cellH * imgRatio;
    } else {
      drawW0 = cellW;
      drawH0 = cellW / imgRatio;
    }
    const drawW_old = drawW0 * prevScale;
    const drawH_old = drawH0 * prevScale;
    const drawW_new = drawW0 * newScale;
    const drawH_new = drawH0 * newScale;

    // image element rect and pointer position relative to image
    const imgEl = e.currentTarget;
    const imgRect = imgEl.getBoundingClientRect();
    const px = (e.clientX - imgRect.left) / previewScale; // canvas pixels
    const py = (e.clientY - imgRect.top) / previewScale;

    // base offsets in canvas coords
    const baseOffsetX_old = cellLeft - (drawW_old - cellW) / 2;
    const baseOffsetY_old = cellTop - (drawH_old - cellH) / 2;
    const baseOffsetX_new = cellLeft - (drawW_new - cellW) / 2;
    const baseOffsetY_new = cellTop - (drawH_new - cellH) / 2;

    const offX = off ? off.x || 0 : 0;
    const offY = off ? off.y || 0 : 0;

    const focal_canvas = baseOffsetX_old + offX + px;
    const focal_canvas_y = baseOffsetY_old + offY + py;

    const uX = drawW_old !== 0 ? px / drawW_old : 0.5;
    const uY = drawH_old !== 0 ? py / drawH_old : 0.5;
    const f_new_x = uX * drawW_new;
    const f_new_y = uY * drawH_new;

    const newOffX = Math.round(focal_canvas - baseOffsetX_new - f_new_x);
    const newOffY = Math.round(focal_canvas_y - baseOffsetY_new - f_new_y);

    const nextOffsets = offsets.slice();
    nextOffsets[idx] = { x: newOffX, y: newOffY };
    const nextScales = scales.slice();
    nextScales[idx] = newScale;
    setOffsets(nextOffsets);
    setScales(nextScales);
  };

  const handlePreviewWheel = e => {
    // When Alt is pressed for image zoom, prevent the preview container from scrolling
    if (e.altKey || (pinchRef.current && pinchRef.current.active)) {
      e.preventDefault();
    }
  };

  // Attach a non-passive native wheel listener on the preview element so we can
  // reliably call preventDefault() (some browsers attach passive wheel listeners
  // which ignore preventDefault in React handlers).
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const handler = e => {
      if (e.altKey || (pinchRef.current && pinchRef.current.active)) {
        e.preventDefault();
      }
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
    // previewRef intentionally not in deps to avoid reattaching frequently
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Also attach a capture-phase listener on the overlay so we reliably
  // intercept wheel events before the browser scrolls the container (Chrome)
  useEffect(() => {
    const el = previewOverlayRef.current;
    if (!el) return;
    const handler = e => {
      if (e.altKey || (pinchRef.current && pinchRef.current.active)) {
        e.preventDefault();
      }
    };
    el.addEventListener('wheel', handler, { passive: false, capture: true });
    return () => el.removeEventListener('wheel', handler, { capture: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fallback: listen on the document at capture phase to ensure we can
  // prevent wheel-driven scrolling in Chrome even if other listeners intervene.
  useEffect(() => {
    const docHandler = e => {
      if (!showPreview) return;
      if (e.altKey || (pinchRef.current && pinchRef.current.active)) {
        e.preventDefault();
      }
    };
    document.addEventListener('wheel', docHandler, { passive: false, capture: true });
    return () => document.removeEventListener('wheel', docHandler, { capture: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPreview]);

  const handleResetOffset = idx => {
    const n = offsets.slice();
    n[idx] = { x: 0, y: 0 };
    setOffsets(n);
    const s = scales.slice();
    s[idx] = 1;
    setScales(s);
  };

  const onCollageAndPreview = async () => {
    if (!canCollage) return;
    if (!showPreview) {
      setShowPreview(true);
      return;
    }
    // finalize using offsets
    await handleCollage(totalWidth, totalHeight, offsets, scales);
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
            ref={previewOverlayRef}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ color: '#222', fontWeight: 600 }}>Preview</div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button onClick={() => { setOffsets(images.map(()=>({x:0,y:0}))); setScales(images.map(()=>1)); }} className="collage-btn">Reset Positions</button>
                <button onClick={async () => { await handleCollage(totalWidth, totalHeight, offsets, scales); setShowPreview(false); }} className="collage-btn">Finalize Collage</button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="collage-btn"
                  style={{ marginLeft: 8, background: '#ff6b6b', borderColor: '#ff6b6b', color: '#fff' }}
                >
                  Close
                </button>
              </div>
            </div>
            <div style={{ color: '#444', fontSize: '0.95rem', lineHeight: '1.35', marginBottom: 8 }}>
              <div>- Drag images to reposition</div>
              <div>- Hold Alt + scroll to zoom (desktop). Use two-finger pinch to zoom on touch.</div>
            </div>

            <div
              ref={previewRef}
              onPointerDown={handlePreviewPointerDown}
              onWheel={handlePreviewWheel}
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
                let drawW0, drawH0;
                if (imgRatio > cellRatio) {
                  drawH0 = cellH;
                  drawW0 = cellH * imgRatio;
                } else {
                  drawW0 = cellW;
                  drawH0 = cellW / imgRatio;
                }
                const scale = (scales && scales[idx]) || 1;
                const drawW = Math.round(drawW0 * scale);
                const drawH = Math.round(drawH0 * scale);

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
                        {file && url && !previewErrors[idx] && (
                          <img
                            src={url}
                            data-idx={idx}
                            alt={file.name}
                            draggable={false}
                            onPointerDown={e => onPointerDown(e, idx, previewScale)}
                            onWheel={e => onImageWheel(e, idx, meta, off, cellW, cellH, left, top)}
                            onError={() => tryPreviewDataUrl(idx)}
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
                        {file && (!url || previewErrors[idx]) && (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#666',
                              fontSize: 12,
                              padding: 6,
                              textAlign: 'center',
                            }}
                          >
                            Preview not available for this image
                          </div>
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
