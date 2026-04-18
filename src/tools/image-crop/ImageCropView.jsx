import { Link } from 'react-router-dom'
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';

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

  const [selectValue, setSelectValue] = useState(() => (aspect ? String(aspect) : String(4 / 3)));
  const [customW, setCustomW] = useState(4);
  const [customH, setCustomH] = useState(3);
  const normalizePositiveInt = (v) => {
    const n = Number(v);
    if (!isFinite(n) || n <= 0) return 1;
    return Math.max(1, Math.round(n));
  };

  // Ensure inputs reflect initial selection (if default is preset)
  useEffect(() => {
    try {
      const val = Number(selectValue);
      if (selectValue !== '' && isFinite(val) && val > 0) {
        // Try to map common presets to integer w/h where possible
        const map = {
          [String(1)]: [1, 1],
          [String(4 / 3)]: [4, 3],
          [String(16 / 9)]: [16, 9],
          [String(9 / 16)]: [9, 16],
          [String(4 / 5)]: [4, 5],
          [String(2 / 3)]: [2, 3],
          [String(3 / 1)]: [3, 1],
          [String(1.91)]: [191, 100],
        };
        const pair = map[String(selectValue)];
        if (pair) {
          setCustomW(pair[0]);
          setCustomH(pair[1]);
        }
      }
    } catch (err) {
      // ignore
    }
    // run on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
  }, [crop, zoom, rotation, flipH, flipV, selectValue, customW, customH]);

  // Compute the aspect used by the Cropper: if a preset is selected use that number,
  // otherwise use the custom width/height ratio.
  const isPreset = selectValue !== '';
  const cropperAspect = isPreset ? Number(selectValue) : (customH > 0 ? (customW / customH) : undefined);

  // Propagate aspect changes to parent
  useEffect(() => {
    try {
      setAspect(cropperAspect);
    } catch (err) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectValue, customW, customH]);

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
      <p className="hero-tagline">Select and crop a portion of your image. 
        Use presets, zoom, rotate and flip tools, then preview and download. <Link to="/blogs/image-crop-guide">Learn how to crop your image →</Link></p>

      <div className="ir-tip-banner">
        <span className="ir-tip-text">Would you like to put words on your image before cropping it?</span>
        <button className="ir-tip-btn" onClick={() => navigate('/image-meme-generator')}>
          Try Meme Generator
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
                <h3>What is Image Crop</h3>
                <p>
                  The Image Crop tool provides an interactive way to select and export a rectangular portion of an image. It offers zoom, rotation,
                  and flip controls, aspect ratio presets for common targets (social, profile, banners), and a preview step so you can confirm the crop
                  before downloading. All transformation and export operations are performed in your browser using an offscreen canvas; your original file
                  does not leave your device unless you explicitly share or upload it.
                </p>

                <h3>How cropping works</h3>
                <p>
                  After loading an image the editor displays a resizable crop overlay. You can drag the overlay to reposition it, resize using handles,
                  or pick one of the provided aspect ratios for exact output dimensions. Zooming and rotation let you refine framing; flips mirror the
                  image horizontally or vertically. When you click Preview or Download the selected region is rendered to an offscreen canvas with any
                  transforms applied, and the result is exported as a PNG file for immediate download.
                </p>

                <h3>Presets and precision</h3>
                <ul>
                  <li><strong>1:1 (Profile)</strong> — Ideal for avatars and profile photos.</li>
                  <li><strong>16:9 (Widescreen)</strong> — Useful for video thumbnails, banners, and widescreen presentations.</li>
                  <li><strong>4:5 (Portrait)</strong> — A common format for social feeds and portrait-oriented content.</li>
                  <li><strong>Free</strong> — No constraints; crop to any dimensions you need.</li>
                </ul>

                <h3>Practical tips</h3>
                <ul>
                  <li>Use the aspect-lock to keep exact proportions when resizing the crop area.</li>
                  <li>For pixel-perfect exports, set the desired output resolution after choosing the crop area, then preview at 100% if possible.</li>
                  <li>If you need to crop many images the same way, note the preset values so you can repeat the process consistently.</li>
                </ul>

                <h3>Useful when</h3>
                <ul>
                  <li>preparing profile pictures or social media assets to exact dimensions.</li>
                  <li>removing unwanted borders, background, or distracting elements from a photo.</li>
                  <li>cropping a screenshot to a specific region for docs or presentations.</li>
                  <li>quickly re-framing a photo without opening a desktop image editor.</li>
                </ul>
                
                <h3>Accessibility & privacy</h3>
                <p>
                  Controls are keyboard accessible and sized for touch interaction; the preview dialog helps users of all devices confirm changes. Because
                  cropping is performed locally, your images remain private unless you choose to upload them as part of a sharing workflow.
                </p>

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
                aspect={cropperAspect}
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
            <span className="hero-tagline">Drag & drop an image here, or click to select</span>
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
            {
              (() => {
                const aspectOptions = [
                  { value: '', label: 'Use Custom Aspect Ratio', w: 0, h: 0, id: 'custom' },
                  { value: String(1), label: '1:1 (Profile)', w: 1, h: 1, id: 'profile' },
                  { value: String(4 / 3), label: '4:3 (Standard)', w: 4, h: 3, id: 'standard' },
                  { value: String(16 / 9), label: '16:9 (Widescreen / YouTube)', w: 16, h: 9, id: 'widescreen' },
                  { value: String(9 / 16), label: '9:16 (Story / Reels)', w: 9, h: 16, id: 'story' },
                  { value: String(4 / 5), label: '4:5 (Instagram Post)', w: 4, h: 5, id: 'instagram' },
                  { value: String(2 / 3), label: '2:3 (Pinterest Pin)', w: 2, h: 3, id: 'pinterest' },
                  { value: String(3 / 1), label: '3:1 (Blog Featured)', w: 3, h: 1, id: 'blog' },
                  { value: String(1.91), label: '1.91:1 (Facebook Post)', w: 191, h: 100, id: 'facebook' },
                ];

                return (
                  <select value={selectValue} onChange={e => {
                    const v = e.target.value;
                    setSelectValue(v);
                    const opt = aspectOptions.find(o => o.value === v);
                    if (!opt || v === '') {
                      setPreset('custom');
                      setCustomW(4);
                      setCustomH(3);
                    } else {
                      setCustomW(opt.w || 1);
                      setCustomH(opt.h || 1);
                      setPreset(opt.id || 'preset');
                    }
                  }}>
                    {aspectOptions.map(o => (
                      <option key={o.label} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                );
              })()
            }
          </div>

          {!isPreset && <div className="control-row aspect-inputs" style={{ alignItems: 'center', gap: 8 }}>
            <label style={{ minWidth: 90 }}>Ratio</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="number"
                min={1}
                value={(() => {
                  try {
                    if (isPreset) {
                      const parts = decimalToRatio(Number(selectValue)).split(':');
                      return parts[0] || '';
                    }
                    return customW || '';
                  } catch (err) { return '' }
                })()}
                onChange={(e) => {
                  const w = e.target.value === '' ? '' : Number(e.target.value);
                  setCustomW(w === '' ? '' : w);
                }}
                onBlur={() => setCustomW(normalizePositiveInt(customW))}
                disabled={isPreset}
                style={{
                  width: 90,
                  padding: '0.4rem',
                  backgroundColor: isPreset ? '#f3f4f6' : undefined,
                  border: isPreset ? '1px solid #d1d5db' : undefined,
                  color: isPreset ? '#6b7280' : undefined,
                  cursor: isPreset ? 'not-allowed' : 'text'
                }}
              />
              <span style={{ color: '#6b7280' }}>:</span>
              <input
                type="number"
                min={1}
                value={(() => {
                  try {
                    if (isPreset) {
                      const parts = decimalToRatio(Number(selectValue)).split(':');
                      return parts[1] || '';
                    }
                    return customH || '';
                  } catch (err) { return '' }
                })()}
                onChange={(e) => {
                  const h = e.target.value === '' ? '' : Number(e.target.value);
                  setCustomH(h === '' ? '' : h);
                }}
                onBlur={() => setCustomH(normalizePositiveInt(customH))}
                disabled={isPreset}
                style={{
                  width: 90,
                  padding: '0.4rem',
                  backgroundColor: isPreset ? '#f3f4f6' : undefined,
                  border: isPreset ? '1px solid #d1d5db' : undefined,
                  color: isPreset ? '#6b7280' : undefined,
                  cursor: isPreset ? 'not-allowed' : 'text'
                }}
              />
            </div>
          </div>}

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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

      {/* ── Guide Article for Image Crop ── */}
      <div className="ic-guide">
        <div className="ic-guide-intro">
          <h2 className="ic-guide-title">How to Crop Images Perfectly (Without Losing Quality or Composition)</h2>
          <p className="ic-guide-lead">Cropping an image is one of the simplest edits you can make — but it has a huge impact on how your image looks and communicates. Whether you're preparing images for websites, social media, or documents, cropping helps you focus on what matters, remove distractions, and fit images into required sizes.</p>
          <div className="ic-guide-learn-box">
            <span className="ic-guide-learn-label">In this guide, you'll learn:</span>
            <ul className="ic-guide-learn-list">
              <li>How image cropping works</li>
              <li>When to use it</li>
              <li>How to crop properly without ruining quality</li>
            </ul>
          </div>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">What Is Image Cropping?</h3>
          <p>Image cropping is the process of removing unwanted outer areas of an image to improve composition or adjust size. Instead of resizing the entire image, cropping lets you cut out unnecessary parts, focus on the subject, and change the aspect ratio.</p>
          <p><em>Think of it as framing your image after it’s already taken.</em></p>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">Why Cropping Matters</h3>
          <div className="ic-guide-cards">
            <div className="ic-guide-card">
              <span className="ic-guide-card-num">1</span>
              <div>
                <strong>Focus on the Subject</strong>
                <p>Cropping removes distractions and highlights the most important part of the image so the subject becomes the main focus.</p>
              </div>
            </div>
            <div className="ic-guide-card">
              <span className="ic-guide-card-num">2</span>
              <div>
                <strong>Improve Composition</strong>
                <p>Use cropping to balance the image, apply the rule of thirds, and create a cleaner layout.</p>
              </div>
            </div>
            <div className="ic-guide-card">
              <span className="ic-guide-card-num">3</span>
              <div>
                <strong>Fit Platform Requirements</strong>
                <p>Different platforms need different sizes; crop to square, vertical, or landscape to avoid distortion and cropping issues on upload.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">Cropping vs Resizing</h3>
          <table className="ic-guide-table">
            <thead><tr><th>Feature</th><th>Cropping</th><th>Resizing</th></tr></thead>
            <tbody>
              <tr><td>What it does</td><td>Removes part of image</td><td>Scales entire image</td></tr>
              <tr><td>Keeps full content</td><td>No</td><td>Yes</td></tr>
              <tr><td>Changes composition</td><td>Yes</td><td>No</td></tr>
              <tr><td>Use case</td><td>Focus / framing</td><td>File size / dimensions</td></tr>
            </tbody>
          </table>
          <p><strong>Best practice:</strong> Crop first → then resize if needed.</p>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">Best Practices for Cropping</h3>
          <div className="ic-guide-best-list">
            <div className="ic-guide-best-item"><span className="ic-guide-best-icon">✅</span><div><strong>Keep the Subject Clear</strong><p>Ensure the main subject is centered or well-positioned and not cut awkwardly.</p></div></div>
            <div className="ic-guide-best-item"><span className="ic-guide-best-icon">✅</span><div><strong>Maintain Aspect Ratio</strong><p>Use fixed ratios (1:1, 16:9, 4:5) when targeting specific platforms.</p></div></div>
            <div className="ic-guide-best-item"><span className="ic-guide-best-icon">✅</span><div><strong>Don't Crop Too Much</strong><p>Excessive cropping reduces resolution and may make images blurry when enlarged.</p></div></div>
            <div className="ic-guide-best-item"><span className="ic-guide-best-icon">✅</span><div><strong>Leave Breathing Space</strong><p>Avoid tight crops—leave slight spacing around the subject for a natural look.</p></div></div>
            <div className="ic-guide-best-item"><span className="ic-guide-best-icon">✅</span><div><strong>Keep the Original</strong><p>Always save the original image; cropped areas cannot be recovered.</p></div></div>
          </div>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">Common Mistakes to Avoid</h3>
          <div className="ic-guide-mistakes">
            <div className="ic-guide-mistake">❌ Cutting off important parts (faces, edges, text)</div>
            <div className="ic-guide-mistake">❌ Cropping without purpose</div>
            <div className="ic-guide-mistake">❌ Ignoring aspect ratio</div>
            <div className="ic-guide-mistake">❌ Over-cropping low-resolution images</div>
            <div className="ic-guide-mistake">❌ Using random crop sizes across platforms</div>
          </div>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">Step-by-Step: How to Crop an Image</h3>
          <ol className="ic-guide-steps">
            <li>Upload your image</li>
            <li>Select the area you want to keep</li>
            <li>Adjust the crop box (drag edges)</li>
            <li>Choose aspect ratio (optional)</li>
            <li>Apply crop</li>
            <li>Download the final image</li>
          </ol>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">Real Use Cases</h3>
          <div className="ic-guide-usecases">
            <div className="ic-guide-usecase"><span className="ic-guide-usecase-icon">📱</span><strong>Social Media Posts</strong><p>Crop to square or vertical to improve engagement.</p></div>
            <div className="ic-guide-usecase"><span className="ic-guide-usecase-icon">🌐</span><strong>Website Images</strong><p>Remove unnecessary space and make images consistent across pages.</p></div>
            <div className="ic-guide-usecase"><span className="ic-guide-usecase-icon">👤</span><strong>Profile Pictures</strong><p>Crop tightly around the face and center for better visibility.</p></div>
            <div className="ic-guide-usecase"><span className="ic-guide-usecase-icon">🛍️</span><strong>Product Images</strong><p>Remove background clutter and highlight the product clearly.</p></div>
          </div>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">FAQ</h3>
          <div className="ic-guide-faq">
            <details className="ic-guide-faq-item"><summary>Does cropping reduce image quality?</summary><p>Yes — because pixels are removed, but if done carefully the quality loss is usually not noticeable.</p></details>
            <details className="ic-guide-faq-item"><summary>Can I undo cropping?</summary><p>Only if your tool supports non-destructive editing or you kept the original image.</p></details>
            <details className="ic-guide-faq-item"><summary>What is the best aspect ratio?</summary><p>Depends on usage: Instagram → 1:1 or 4:5; YouTube → 16:9; Websites → varies.</p></details>
            <details className="ic-guide-faq-item"><summary>Is cropping better than resizing?</summary><p>They serve different purposes: cropping changes composition, resizing changes dimensions.</p></details>
          </div>
        </div>

        <div className="ic-guide-conclusion">
          <h3>Conclusion</h3>
          <p>Image cropping is a simple but powerful way to improve composition, highlight important content, and make images fit any platform. Use the right techniques to turn an average image into a clean, professional-looking one.</p>
          <a href="/image-crop" className="ic-guide-cta" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/image-crop'); }}>Try the Image Crop Tool →</a>
        </div>
      </div>
    </div>
  );
}
