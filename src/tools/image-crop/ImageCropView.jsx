import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import '../image-resizer/ImageResizer.css';

export function ImageCropView(props) {
  const {
    imageSrc,
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
    naturalAspect,
    outputUrl,
    handleDownload,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    setPreset,
    handleReset,
  } = props;

  const navigate = useNavigate();

  const [localAspect, setLocalAspect] = useState(aspect || undefined);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [hasCropEdited, setHasCropEdited] = useState(false);
  const [openPanel, setOpenPanel] = useState('');
  const cropContainerRef = useRef(null);
  const [cropperHeight, setCropperHeight] = useState(520);

  const onCropCompleteInternal = useCallback((croppedArea, croppedAreaPixels) => {
    setHasCropEdited(true);
    onCropComplete(croppedArea, croppedAreaPixels);
  }, [onCropComplete]);

  // Mark as edited whenever any crop parameter changes so actions enable immediately
  useEffect(() => {
    if (!imageSrc) return;
    if (!hasCropEdited) setHasCropEdited(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop, zoom, rotation, flipH, flipV, localAspect]);

  const download = async () => {
    setProcessing(true);
    await handleDownload();
    setProcessing(false);
  };

  // Wait for `outputUrl` prop to become available (polling) after calling handleDownload
  const waitForOutputUrl = (timeout = 3000) => new Promise((resolve, reject) => {
    const start = Date.now();
    const iv = setInterval(() => {
      if (outputUrl) {
        clearInterval(iv);
        resolve(outputUrl);
      } else if (Date.now() - start > timeout) {
        clearInterval(iv);
        reject(new Error('timeout'));
      }
    }, 100);
  });

  // Trigger download: ensure outputUrl is generated then download
  const triggerDownload = async () => {
    setProcessing(true);
    try {
      let url = outputUrl;
      if (!url) {
        const res = await handleDownload();
        url = res && res.url ? res.url : outputUrl;
      }
      if (!url) return;
      const link = document.createElement('a');
      link.href = url;
      link.download = imageSrc ? 'cropped.png' : 'cropped.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      // ignore
    }
    setProcessing(false);
  };

  const handleSendToMeme = async () => {
    setProcessing(true);
    try {
      let url = outputUrl;
      if (!url) {
        const res = await handleDownload();
        url = res && res.url ? res.url : outputUrl;
      }
      if (!url) return;
      const resp = await fetch(url);
      const blob = await resp.blob();
      const file = new File([blob], 'cropped.png', { type: blob.type || 'image/png' });
      navigate('/image-meme-generator', { state: { mainImage: file } });
    } catch (err) {
      // ignore
    }
    setProcessing(false);
  };

  const handleWheel = (e) => {
    if (!e.altKey) return;
    e.preventDefault();
    // make wheel more responsive: scale delta and apply two-decimal rounding
    const delta = -e.deltaY / 300;
    setZoom((z) => {
      const next = z + delta;
      const rounded = Math.round(next * 100) / 100;
      return Math.min(3, Math.max(0.5, rounded));
    });
  };

  // Adjust cropper height to match the ORIGINAL image's natural ratio.
  // Uses ResizeObserver so it re-fires whenever the container width changes
  // (e.g. mobile layout reflow), not just when naturalAspect changes.
  useEffect(() => {
    const el = cropContainerRef.current;
    if (!el) return;

    function recalc() {
      const width = el.clientWidth || el.offsetWidth || 600;
      const a = naturalAspect ?? (4 / 3);
      const h = Math.max(200, Math.min(600, Math.round(width / a)));
      setCropperHeight(h);
    }

    recalc();

    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [naturalAspect]);

  // Attach a capture-phase, non-passive wheel listener so Alt+Scroll is
  // handled even when nested components (like the Cropper) stop or
  // consume the React onWheel event.
  useEffect(() => {
    const el = cropContainerRef.current;
    if (!el) return;
    const listener = (e) => {
      try {
        // forward to our handler
        handleWheel(e);
      } catch (err) {
        // ignore
      }
    };
    el.addEventListener('wheel', listener, { passive: false, capture: true });
    return () => el.removeEventListener('wheel', listener, { capture: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropContainerRef.current]);

  return (
    <div className="image-crop-view">
      <h2 className="hero-title">Image Crop</h2>
      <p className="hero-tagline">Select and crop a portion of your image. Use presets, zoom, rotate and flip tools, then preview and download.</p>

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
                <h3>What is Image Crop</h3>
                <ul>
                  <li>The Image Crop tool lets you select any rectangular region of an image, apply zoom, rotation, and flip transformations, and export only the cropped portion. All processing runs entirely in your browser — your image is never uploaded to a server.</li>
                </ul>

                <h3>How the image crop works</h3>
                <ul>
                  <li>After you load an image, an interactive crop overlay lets you drag and resize the selection area. When you click Preview or Download, the selected region is rendered onto an offscreen canvas (with rotation and flip applied) and exported as a PNG file.</li>
                </ul>

                <h3>Aspect ratio presets</h3>
                <ul>
                  <li><strong>1:1 (Profile)</strong> — Square crop for profile pictures and avatars.</li>
                  <li><strong>16:9 (YouTube)</strong> — Widescreen format for video thumbnails and banners.</li>
                  <li><strong>4:5 (Instagram)</strong> — Portrait format optimised for Instagram posts.</li>
                  <li><strong>Free</strong> — No constraint; drag the corners to any shape you like.</li>
                </ul>

                <h3>Zoom and rotation</h3>
                <ul>
                  <li>Use the Zoom slider or hold <strong>Alt&nbsp;+&nbsp;scroll</strong> to zoom the image inside the crop window. Use the rotation buttons to rotate in 90° steps, or enter a custom angle. The flip controls mirror the image horizontally or vertically before the crop is applied.</li>
                </ul>

                <h3>Useful when</h3>
                <ul>
                  <li>preparing profile pictures or social media assets to exact dimensions.</li>
                  <li>removing unwanted borders, background, or distracting elements from a photo.</li>
                  <li>cropping a screenshot to a specific region for docs or presentations.</li>
                  <li>quickly re-framing a photo without opening a desktop image editor.</li>
                </ul>

                <h3>FAQs</h3>
                <ul>
                  <li><strong>Q:</strong> Is my image uploaded anywhere? <strong>A:</strong> No — all cropping runs client-side in your browser. Your image never leaves your device.</li>
                  <li><strong>Q:</strong> What formats are supported? <strong>A:</strong> You can load any image format the browser supports (JPEG, PNG, WebP, GIF, etc.). The cropped output is always exported as PNG.</li>
                  <li><strong>Q:</strong> Can I undo a crop? <strong>A:</strong> Yes — simply adjust the crop selection and click Preview again to regenerate the output before downloading.</li>
                  <li><strong>Q:</strong> Why does the download button stay greyed out? <strong>A:</strong> Click Preview first to generate a cropped image, then the Download button becomes active.</li>
                </ul>
              </div>

            <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
                <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/crop/crop_001.png" alt="Step 1" className="how-img" />
                    <p>Load an image by dragging and dropping it onto the crop area, or click to browse your files.</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/crop/crop_002.png" alt="Step 2" className="how-img" />
                    <p>Drag and resize the crop overlay to select the region you want to keep. Choose an aspect ratio preset or use Free mode.</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/crop/crop_003.png" alt="Step 3" className="how-img" />
                    <p>Optionally adjust zoom, rotation, and flip to fine-tune the framing before cropping.</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/crop/crop_004.png" alt="Step 4" className="how-img" />
                    <p>Click Preview to generate the cropped image and inspect the result in the preview dialog.</p>
                  </li>
                  <li>
                    <p>Click Download to save the cropped PNG to your device.</p>
                  </li>
                </ol>
              </div>
          </div>
      </div>

      {/* send-to-meme box moved to bottom of main content (rendered later) */}

      <div className="crop-area">
        <div
          className="drop-zone crop-drop"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          ref={cropContainerRef}
          onWheel={handleWheel}
        >
          {imageSrc ? (
            <div
              className="cropper-wrap"
              style={{ height: cropperHeight }}
              onClick={(e) => e.stopPropagation()}
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={localAspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropCompleteInternal}
                cropShape="rect"
                showGrid
                minZoom={0.5}
                restrictPosition={false}
              />
            </div>
          ) : (
            <span>Drag & drop an image here, or click to select</span>
          )}
          <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileInput} />
        </div>

        <div className="crop-controls">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className="resize-btn">Image...</button>
          </div>
          <div className="control-row">
            <label>Zoom</label>
            <input type="range" min="0.5" max="3" step="0.01" value={zoom} onChange={e => setZoom(Number(e.target.value))} />
          </div>
          <div className="control-row">
            <label>Rotation</label>
            <button type="button" onClick={() => setRotation((r) => r - 90)} aria-label="rotate-left">⟲</button>
            <button type="button" onClick={() => setRotation((r) => r + 90)} aria-label="rotate-right">⟳</button>
            <span style={{ marginLeft: 8 }}>{rotation}°</span>
          </div>
          <div className="control-row">
            <label>Flip</label>
            <button type="button" onClick={handleFlipH} aria-pressed={flipH}>Horizontal</button>
            <button type="button" onClick={handleFlipV} aria-pressed={flipV}>Vertical</button>
          </div>
          <div className="control-row">
            <label>Aspect</label>
            <select value={localAspect ?? ''} onChange={e => {
              const val = e.target.value === '' ? undefined : Number(e.target.value);
              setLocalAspect(val);
              setAspect(val);
            }}>
              <option value={1}>1:1 (Profile)</option>
              <option value={16/9}>16:9 (Youtube)</option>
              <option value={4/5}>4:5 (Instagram)</option>
              <option value="">Free</option>
            </select>
          </div>
          <div className="control-row presets">
            <label>Presets</label>
            <button onClick={() => { setPreset('instagram'); setLocalAspect(4/5); }}>Instagram Post</button>
            <button onClick={() => { setPreset('youtube'); setLocalAspect(16/9); }}>Youtube Thumbnail</button>
            <button onClick={() => { setPreset('profile'); setLocalAspect(1); }}>Profile Picture</button>
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="resize-btn" onClick={async () => { await download(); setPreviewOpen(true); }} disabled={processing || !imageSrc}>{processing ? 'Processing...' : 'Preview'}</button>
            <button className="resize-btn reset-btn" onClick={() => { handleReset(); setPreviewOpen(false); setHasCropEdited(false); }} disabled={!imageSrc} style={{ marginLeft: 8 }}>Reset</button>
            <button
              className={`download-btn ${!outputUrl ? 'disabled' : ''}`}
              onClick={triggerDownload}
              disabled={!(outputUrl || hasCropEdited)}
            >
              Download
            </button>
          </div>

          {/* Moved below so this control spans the main content area */}

          {previewOpen && outputUrl && (
            <div className="image-popup-overlay" onClick={() => setPreviewOpen(false)}>
              <div className="image-popup-dialog" onClick={e => e.stopPropagation()}>
                <img src={outputUrl} alt="Preview" className="image-popup-img" />
                <button className="close-popup-btn" onClick={() => setPreviewOpen(false)}>&times;</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action block: appears only after a crop output is generated */}
      {(outputUrl || hasCropEdited) && (
        <div className="send-action">
          <span className="send-text">Would you like to put a text on cropped image?</span>
          <button
            className="send-btn"
            onClick={handleSendToMeme}
            disabled={!(outputUrl || hasCropEdited)}
          >
            Send to Meme Generator
          </button>
        </div>
      )}
    </div>
  );
}
