import { Link } from 'react-router-dom'
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function ImageResizerView({
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
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState('');
  const [linked, setLinked] = useState(true);
  const originalWidth = useRef(null);
  const originalHeight = useRef(null);
  const [previewZoom, setPreviewZoomState] = useState(1);
  const previewZoomRef = useRef(1);
  const dropZoneRef = useRef(null);
  const [popupPan, setPopupPan] = useState({ x: 0, y: 0 });
  const [popupDragging, setPopupDragging] = useState(false);
  const popupPanRef = useRef({ x: 0, y: 0 });
  const popupDragRef = useRef({ active: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0 });
  const popupDialogRef = useRef(null);
  const [popupImgSize, setPopupImgSize] = useState({ w: null, h: null });
  // Set original dimensions when image loads; populate inputs and reset zoom
  React.useEffect(() => {
    if (mainImage) {
      const img = new window.Image();
      img.onload = () => {
        originalWidth.current = img.width;
        originalHeight.current = img.height;
        setWidth(img.width.toString());
        setHeight(img.height.toString());
        previewZoomRef.current = 1;
        setPreviewZoomState(1);
        setResizeMode('dimensions');
      };
      img.src = URL.createObjectURL(mainImage);
    }
  }, [mainImage]);

  // Alt+Scroll and pinch-zoom on the drop zone preview
  React.useEffect(() => {
    const el = dropZoneRef.current;
    if (!el) return;
    let lastDist = null;

    const applyZoom = (next) => {
      previewZoomRef.current = next;
      setPreviewZoomState(next);
      if (originalWidth.current && originalHeight.current) {
        setWidth(Math.round(originalWidth.current * next).toString());
        setHeight(Math.round(originalHeight.current * next).toString());
      }
    };

    const onWheel = (e) => {
      if (!e.altKey) return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      applyZoom(Math.max(0.1, Math.min(10, previewZoomRef.current * factor)));
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        lastDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 2 && lastDist !== null) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        applyZoom(Math.max(0.1, Math.min(10, previewZoomRef.current * (dist / lastDist))));
        lastDist = dist;
      }
    };

    const onTouchEnd = () => { lastDist = null; };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [setWidth, setHeight]);

  // Auto-open popup when a resized output is ready
  React.useEffect(() => {
    if (outputUrl) {
      setPopupImgSize({ w: null, h: null });
      setPreviewOpen(true);
    }
  }, [outputUrl]);

  // Reset pan and attach mouse+touch drag listeners while popup is open
  React.useEffect(() => {
    if (!previewOpen) return;
    setPopupPan({ x: 0, y: 0 });
    popupPanRef.current = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      if (!popupDragRef.current.active) return;
      const newPan = {
        x: popupDragRef.current.startPanX + (e.clientX - popupDragRef.current.startX),
        y: popupDragRef.current.startPanY + (e.clientY - popupDragRef.current.startY),
      };
      popupPanRef.current = newPan;
      setPopupPan(newPan);
    };
    const onMouseUp = () => {
      if (popupDragRef.current.active) {
        popupDragRef.current.active = false;
        setPopupDragging(false);
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const el = popupDialogRef.current;
    let touchStartX = 0, touchStartY = 0, touchStartPanX = 0, touchStartPanY = 0;
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartPanX = popupPanRef.current.x;
        touchStartPanY = popupPanRef.current.y;
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      const newPan = {
        x: touchStartPanX + (e.touches[0].clientX - touchStartX),
        y: touchStartPanY + (e.touches[0].clientY - touchStartY),
      };
      popupPanRef.current = newPan;
      setPopupPan(newPan);
    };
    const onTouchEnd = () => {};
    if (el) {
      el.addEventListener('touchstart', onTouchStart, { passive: true });
      el.addEventListener('touchmove', onTouchMove, { passive: false });
      el.addEventListener('touchend', onTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (el) {
        el.removeEventListener('touchstart', onTouchStart);
        el.removeEventListener('touchmove', onTouchMove);
        el.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, [previewOpen]);

  const navigate = useNavigate();
  const [sendStatus, setSendStatus] = useState('idle');
  const handleSendToWatermark = async () => {
    setSendStatus('processing');
    try {
      const response = await fetch(outputUrl);
      const blob = await response.blob();
      const file = new File([blob], outputName, { type: blob.type });
      navigate('/image-watermarker', { state: { mainImage: file } });
    } catch (e) {
      setSendStatus('error');
    }
  };
  return (
    <div className="image-resizer-view">
      <h2 className="hero-title">Image Resizer</h2>
      <p className="hero-tagline">Resize your image to any size by percentage 
        or exact pixel dimensions. Lock the aspect ratio to prevent distortion, 
        then download your result instantly. <Link to="/blogs/image-resizer-guide">Learn how to resize your image →</Link></p>

      <div className="ir-tip-banner">
        <span className="ir-tip-text">Do you want your picture to fit on YouTube Thumbnail or Instagram?</span>
        <button className="ir-tip-btn" onClick={() => navigate('/image-crop')}>
          Try Image Crop
        </button>
      </div>

      <div className="details-row" data-open={openPanel}>
        <div className="details-controls">
          <button
            className={`tab-btn ${openPanel === 'details' ? 'active' : ''}`}
            onClick={() => setOpenPanel(prev => (prev === 'details' ? '' : 'details'))}
            aria-expanded={openPanel === 'details'}
            type="button"
          >
            Details
          </button>
          <button
            className={`tab-btn ${openPanel === 'howitworks' ? 'active' : ''}`}
            onClick={() => setOpenPanel(prev => (prev === 'howitworks' ? '' : 'howitworks'))}
            aria-expanded={openPanel === 'howitworks'}
            type="button"
          >
            How it works
          </button>
        </div>

            <div className={`shared-collapse${!openPanel ? ' panel-hidden' : ''}`}>
            <div className={openPanel !== 'details' ? 'details-content panel-hidden' : 'details-content'}>
                <h3>What is Image Resizer</h3>
                <p>
                  The Image Resizer lets you change an image's pixel dimensions by a percentage scale or by specifying exact width and height. It
                  performs client-side scaling using an offscreen canvas so the original image remains on your device and the resized output is produced
                  instantly for download. This tool is ideal for preparing images for web, email, or printing where specific pixel dimensions or file
                  size targets are required.
                </p>

                <h3>How resizing works</h3>
                <p>
                  Resizing decodes the source image in the browser, draws it to a canvas at the target dimensions, and then exports the canvas content
                  as a new image file. Downsizing reduces file size while preserving visual fidelity in most cases; upscaling cannot add real
                  detail and will often produce softer results depending on the original resolution and browser interpolation algorithms.
                </p>

                <h3>Quality, interpolation and tradeoffs</h3>
                <ul>
                  <li>Downscaling: preserves perceived quality and reduces bytes; suitable for thumbnails and web delivery.</li>
                  <li>Upscaling: limited by source resolution—avoid excessive upscaling (e.g., &gt;2x) to prevent pixelation.</li>
                  <li>Interpolation: browsers use built-in resampling; results vary by engine—specialized algorithms often produce better upscaling quality.</li>
                </ul>

                <h3>Practical tips</h3>
                <ul>
                  <li>For web, aim for moderate dimensions (e.g., 1200–2048px on the long edge) to balance quality and performance.</li>
                  <li>Use percentage mode for quick proportional scaling; use exact dimensions when a precise pixel size is required.</li>
                  <li>Keep a copy of the original file if you expect to re-edit or export at larger sizes later.</li>
                </ul>

                <h3>When to use</h3>
                <p>
                  Use the resizer when you need to prepare images for specific display contexts (web pages, email, thumbnails), reduce file weight for
                  faster uploads, or adjust images to meet platform requirements. For batch processing or professional-grade upscaling, consider
                  specialized desktop tools or server-side services.
                </p>

                <h3>FAQs</h3>
                <ul>
                  <li><strong>Q:</strong> Can I preserve aspect ratio? <strong>A:</strong> Yes — enable the aspect lock to maintain proportions while changing one dimension.</li>
                  <li><strong>Q:</strong> Is resizing local? <strong>A:</strong> Yes — resizing occurs in your browser via an offscreen canvas; files are not uploaded unless you choose to share them.</li>
                  <li><strong>Q:</strong> Will file size always decrease? <strong>A:</strong> Usually when downscaling, but file size also depends on format and compression settings.</li>
                  <li><strong>Q:</strong> Can I batch resize? <strong>A:</strong> This UI focuses on single-image operations; for many images use a batch tool or script.
                  </li>
                </ul>
              </div>

            <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
                <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/resizer/Image-resizer001.png" alt="Step 1" className="how-img" />
                    <p>Choose a source image by drag & drop or browsing.</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/resizer/Image-resizer002.png" alt="Step 2" className="how-img" />
                    <p>Select percentage or explicit width/height and lock the aspect ratio if needed. 
                      You can use Alt+Scroll or Pinch to zoom on mobile in the preview. Actual size will show up on width and height fields.</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/resizer/Image-resizer003.png" alt="Step 3" className="how-img" />
                    <p>Click Resize to run client-side scaling and produce the output file.</p>
                  </li>
                  <li>
                    <img src="/screenshots/resizer/Image-resizer004.png" alt="Step 4" className="how-img" />
                    <p>Preview and download the resized image.</p>
                  </li>
                </ol>
              </div>
          </div>
      </div>
      <div
        ref={dropZoneRef}
        className={`drop-zone${isDragging ? ' dragging' : ''}${mainImage ? ' has-image' : ''}`}
        style={{ overflow: 'hidden', position: 'relative' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !mainImage && fileInputRef.current && fileInputRef.current.click()}
      >
        {mainImage ? (
          <img
            src={URL.createObjectURL(mainImage)}
            alt="Main"
            className="preview-image clickable"
            style={{
              cursor: 'pointer',
              transform: `scale(${previewZoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.08s ease',
            }}
            onClick={e => {
              e.stopPropagation();
              setPreviewOpen(true);
            }}
          />
        ) : (
          <span className="hero-tagline">Drag & drop an image here, or click to select</span>
        )}
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileInput}
        />
        {mainImage && (
          <div className="drop-zone-hint">Alt+Scroll to zoom · Pinch on mobile · {Math.round(previewZoom * 100)}%</div>
        )}
      </div>
      {/* Preview popup dialog */}
      {previewOpen && (mainImage || outputUrl) && (
        <div className="image-popup-overlay" onClick={() => setPreviewOpen(false)}>
          <div
            ref={popupDialogRef}
            className="image-popup-dialog"
            onClick={e => e.stopPropagation()}
            onMouseDown={e => {
              e.stopPropagation();
              popupDragRef.current = {
                active: true,
                startX: e.clientX,
                startY: e.clientY,
                startPanX: popupPanRef.current.x,
                startPanY: popupPanRef.current.y,
              };
              setPopupDragging(true);
            }}
            style={{
              cursor: popupDragging ? 'grabbing' : 'grab',
              position: 'relative',
              overflow: 'hidden',
              display: 'block',
            }}
          >
            <img
              src={outputUrl ? outputUrl : URL.createObjectURL(mainImage)}
              alt="Preview"
              className="image-popup-img"
              onLoad={e => setPopupImgSize({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: popupImgSize.w != null ? `${popupImgSize.w}px` : 'auto',
                height: popupImgSize.h != null ? `${popupImgSize.h}px` : 'auto',
                maxWidth: 'none',
                maxHeight: 'none',
                flexShrink: 0,
                transform: `translate(calc(-50% + ${popupPan.x}px), calc(-50% + ${popupPan.y}px))`,
                pointerEvents: 'none',
                userSelect: 'none',
                display: 'block',
              }}
              draggable={false}
            />
          </div>
          <button className="close-popup-btn" onClick={() => setPreviewOpen(false)}>&times;</button>
        </div>
      )}
      <div className="resize-options">
        <label>
          <input
            type="radio"
            name="resizeMode"
            value="percentage"
            checked={resizeMode === 'percentage'}
            onChange={() => setResizeMode('percentage')}
          />
          Resize by Percentage
        </label>
        <label>
          <input
            type="radio"
            name="resizeMode"
            value="dimensions"
            checked={resizeMode === 'dimensions'}
            onChange={() => setResizeMode('dimensions')}
          />
          Resize by Width & Height
        </label>
      </div>
      {resizeMode === 'percentage' && (
        <label className="resize-input-percent">
        <input
          type="number"
          className="resize-input"
          placeholder="Enter percentage (e.g. 50)"
          value={percentage}
          min={1}
          max={500}
          onChange={e => setPercentage(e.target.value)}
        />
        %
        </label>
      )}
      {resizeMode === 'dimensions' && (
        <div className="dimension-inputs" style={{ display: 'flex', alignItems: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
          <input
            type="number"
            className="resize-input"
            placeholder="Width (px)"
            value={width}
            min={1}
            style={{ alignSelf: 'center' }}
            onChange={e => {
              const newWidth = e.target.value;
              if (linked && originalWidth.current && originalHeight.current && width && height) {
                // Maintain aspect ratio
                const ratio = originalHeight.current / originalWidth.current;
                setWidth(newWidth);
                setHeight(newWidth ? Math.round(Number(newWidth) * ratio).toString() : '');
              } else {
                setWidth(newWidth);
              }
            }}
          />
          <button
            type="button"
            aria-label={linked ? 'Unlink width and height' : 'Link width and height'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0 0.3rem',
              fontSize: '1.3rem',
              color: linked ? '#3182ce' : '#a0aec0',
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'center',
            }}
            onClick={() => setLinked(l => !l)}
          >
            {linked ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 1 7 0l1 1a5 5 0 0 1 0 7 5 5 0 0 1-7 0l-1-1"/><path d="M14 11a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 0 7 5 5 0 0 0 7 0l1-1"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 7a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 0 7 5 5 0 0 0 7 0l1-1"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
            )}
          </button>
          <input
            type="number"
            className="resize-input"
            placeholder="Height (px)"
            value={height}
            min={1}
            style={{ alignSelf: 'center' }}
            onChange={e => {
              const newHeight = e.target.value;
              if (linked && originalWidth.current && originalHeight.current && width && height) {
                // Maintain aspect ratio
                const ratio = originalWidth.current / originalHeight.current;
                setHeight(newHeight);
                setWidth(newHeight ? Math.round(Number(newHeight) * ratio).toString() : '');
              } else {
                setHeight(newHeight);
              }
            }}
          />
        </div>
      )}
      <div className="action-row">
        <button
          className="resize-btn"
          onClick={handleResize}
          disabled={status === 'processing' || !mainImage || (resizeMode === 'dimensions' && (!width || !height))}
        >
          {status === 'processing' ? 'Processing...' : 'Preview'}
        </button>

        <button
          type="button"
          className={`download-btn${!outputUrl ? ' disabled' : ''}`}
          disabled={!outputUrl}
          onClick={() => {
            if (!outputUrl) return;
            try {
              const link = document.createElement('a');
              link.href = outputUrl;
              link.download = outputName || '';
              document.body.appendChild(link);
              link.click();
              link.remove();
            } catch (e) {
              window.open(outputUrl, '_blank', 'noopener');
            }
          }}
        >
          Download
        </button>
      </div>

      {errorMsg && <div className="error-msg">{errorMsg}</div>}
      {outputUrl && (
        <div className="output-section">
          <div
            style={{
              marginTop: '1.5rem',
              width: '100%',
              boxSizing: 'border-box',
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
            <span style={{ fontWeight: 600, color: '#222', fontSize: '1.08rem', marginBottom: 0, textAlign: 'left', flex: 1, display: 'block', alignSelf: 'center' }}>
              Would you like to put private watermark on the resized image?
            </span>
            <button
              className="resize-btn"
              onClick={handleSendToWatermark}
              disabled={sendStatus === 'processing'}
            >
              {sendStatus === 'processing' ? 'Preparing...' : 'Yes'}
            </button>
          </div>
          {sendStatus === 'error' && (
            <div className="error-msg" style={{ marginTop: 8 }}>Failed to send image to watermark tool.</div>
          )}
        </div>
      )}
    </div>
  );
}
