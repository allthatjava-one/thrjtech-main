import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import './ImageConverter.css';

// ── Draggable + zoomable image viewport ─────────────────────────────────────
function DraggablePreview({ src, alt }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef(null);
  const startRef = useRef(null);
  const pinchRef = useRef(null); // { startDist, startScale }
  const scaleRef = useRef(1);
  scaleRef.current = scale;

  // Reset pan + zoom when src changes
  const prevSrc = useRef(null);
  if (prevSrc.current !== src) {
    prevSrc.current = src;
    Promise.resolve().then(() => { setOffset({ x: 0, y: 0 }); setScale(1); });
  }

  // Non-passive listeners for Alt+Scroll zoom and pinch zoom
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const pinchDist = (touches) =>
      Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

    const onWheel = (e) => {
      if (!e.altKey) return;
      e.preventDefault();
      setScale((s) => Math.min(8, Math.max(0.25, s * (e.deltaY < 0 ? 1.1 : 0.9))));
    };

    const onTouchMovePinch = (e) => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault();
        const ratio = pinchDist(e.touches) / pinchRef.current.startDist;
        setScale(Math.min(8, Math.max(0.25, pinchRef.current.startScale * ratio)));
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchmove', onTouchMovePinch, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchmove', onTouchMovePinch);
    };
  }, []);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
    startRef.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  }, [offset]);

  const onMouseMove = useCallback((e) => {
    if (!dragging || !startRef.current) return;
    setOffset({ x: startRef.current.ox + (e.clientX - startRef.current.mx), y: startRef.current.oy + (e.clientY - startRef.current.my) });
  }, [dragging]);

  const onMouseUp = useCallback(() => setDragging(false), []);

  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      pinchRef.current = {
        startDist: Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY),
        startScale: scaleRef.current,
      };
      setDragging(false);
    } else {
      const t = e.touches[0];
      setDragging(true);
      startRef.current = { mx: t.clientX, my: t.clientY, ox: offset.x, oy: offset.y };
    }
  }, [offset]);

  const onTouchMove = useCallback((e) => {
    if (e.touches.length !== 1 || !dragging || !startRef.current) return;
    e.preventDefault();
    const t = e.touches[0];
    setOffset({ x: startRef.current.ox + (t.clientX - startRef.current.mx), y: startRef.current.oy + (t.clientY - startRef.current.my) });
  }, [dragging]);

  const onTouchEnd = useCallback((e) => {
    if (e.touches.length < 2) pinchRef.current = null;
    if (e.touches.length === 0) setDragging(false);
  }, []);

  return (
    <div
      ref={viewportRef}
      className={`ic-drag-viewport${dragging ? ' dragging' : ''}`}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <img
        src={src}
        alt={alt}
        className="ic-drag-image"
        style={{ transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})` }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        draggable={false}
      />
      <span className="ic-drag-hint">Alt+Scroll to zoom · Drag to pan</span>
    </div>
  );
}

const FORMAT_LABEL = {
  JPG:  'JPG',
  PNG:  'PNG',
  WebP: 'WebP',
  AVIF: 'AVIF',
  BMP:  'BMP',
  GIF:  'GIF',
  ICO:  'ICO',
};

const FORMAT_DESC = {
  JPG:  'Best for photos. Smaller file, lossy compression.',
  PNG:  'Best for graphics with transparency. Lossless quality.',
  WebP: 'Modern format. Smaller than JPG & PNG with great quality.',
  AVIF: 'Next-gen format. Best compression. Chrome & Firefox recommended.',
  BMP:  'Uncompressed bitmap. Lossless, large file. Max compatibility.',
  GIF:  '256-color format. Best for simple graphics, not photos.',
  ICO:  'Windows icon format. Choose which sizes to include.',
};

export function ImageConverterView({
  mainImages,
  currentIndex,
  setCurrentIndex,
  inputMime,
  outputFormat,
  setOutputFormat,
  availableFormats,
  outputUrls,
  outputNames,
  convertedFormat,
  status,
  errorMsg,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleConvertAll,
  handleClear,
  icoSize,
  setIcoSize,
}) {
  const [openPanel, setOpenPanel] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (outputUrls && outputUrls[currentIndex]) setPreviewOpen(true);
  }, [outputUrls, currentIndex]);

  return (
    <div className="ic-view">
      <h2 className="hero-title">Image Converter</h2>
      <p className="hero-tagline">
        Convert image(s) between JPG, PNG, WebP, AVIF, BMP, GIF, and ICO entirely 
        in your browser — no uploads, no account required. <Link to="/blogs/image-converter-guide">Learn how to use the Image Converter →</Link>
      </p>
              
      <div className="ir-tip-banner">
        <span className="ir-tip-text">Would you like to <b>crop</b> your image before converting your image?</span>
        <button className="ir-tip-btn" onClick={() => navigate('/image-resizer')}>
          Try Image Crop
        </button>
      </div>

      {/* ── Details / How it works ── */}
      <div className="details-row" data-open={openPanel}>
        <div className="details-controls">
          <button
            className={`tab-btn ${openPanel === 'details' ? 'active' : ''}`}
            onClick={() => setOpenPanel((p) => (p === 'details' ? '' : 'details'))}
            aria-expanded={openPanel === 'details'}
            type="button"
          >
            Details
          </button>
          <button
            className={`tab-btn ${openPanel === 'howitworks' ? 'active' : ''}`}
            onClick={() => setOpenPanel((p) => (p === 'howitworks' ? '' : 'howitworks'))}
            aria-expanded={openPanel === 'howitworks'}
            type="button"
          >
            How it works
          </button>
        </div>

        <div className={`shared-collapse${!openPanel ? ' panel-hidden' : ''}`}>
          <div className={openPanel !== 'details' ? 'details-content panel-hidden' : 'details-content'}>
            <h3>What is Image Converter</h3>
            <p>The Image Converter lets you convert images between common web formats — JPG, PNG, and WebP — directly in your browser. No file is ever sent to a server.</p>

            <h3>Supported Output Formats</h3>
            <ul>
              <li><strong>JPG</strong> — Lossy compression ideal for photographs. Produces smaller files at the cost of some quality.</li>
              <li><strong>PNG</strong> — Lossless format that preserves every pixel. Supports transparency. Best for logos, screenshots, and graphics.</li>
              <li><strong>WebP</strong> — Modern format by Google. Smaller files than JPG & PNG with great quality.</li>
              <li><strong>AVIF</strong> — Next-gen format with superior compression. Supported in Chrome 93+, Firefox 93+, and Safari 16+.</li>
              <li><strong>BMP</strong> — Uncompressed 24-bit bitmap. No quality loss, large file size. Best for compatibility with legacy software.</li>
              <li><strong>GIF</strong> — Limited to 256 colors. Best for simple graphics and icons; not recommended for photographs.</li>
              <li><strong>ICO</strong> — Windows icon format. Automatically generates 16×16, 32×32, 48×48, and 256×256 sizes in a single file. Ideal for favicons.</li>
            </ul>

            <h3>Supported Input Formats</h3>
            <p>You can upload JPG, PNG, WebP, AVIF, GIF, BMP, ICO, SVG, and TIFF files. Animated GIFs are converted using the first frame only.</p>

            <h3>How conversion works</h3>
            <p>Your image is decoded in the browser, drawn onto an offscreen canvas, and exported to the target format. TIFF files are decoded using a lightweight JS library. For formats that don't support transparency (JPG, BMP, GIF), transparent areas are filled with white.</p>

            <h3>FAQs</h3>
            <ul>
              <li><strong>Q:</strong> Does my image leave my browser? <strong>A:</strong> No. All processing is done locally; nothing is uploaded.</li>
              <li><strong>Q:</strong> Why is AVIF not working? <strong>A:</strong> AVIF encoding requires Chrome 93+, Firefox 93+, or Safari 16+. Other browsers will show an error.</li>
              <li><strong>Q:</strong> What happens to transparency when converting to JPG, BMP, or GIF? <strong>A:</strong> Transparent areas are filled with white.</li>
              <li><strong>Q:</strong> Why does GIF look bad for photos? <strong>A:</strong> GIF supports only 256 colors, so photos with many colors will appear degraded. Use PNG or WebP for photos.</li>
            </ul>
          </div>

          <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
            <ol style={{ margin: 0, paddingLeft: '1rem' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <img src="/screenshots/image-converter/image-converter-001.png" alt="Step 1" className="how-img" />
                <p>Drag &amp; drop an image onto the upload area, or click it to browse for a file.</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <img src="/screenshots/image-converter/image-converter-002.png" alt="Step 2" className="how-img" />
                <p>Select your desired output format from the format buttons. The tool auto-selects a sensible default based on your input.</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <img src="/screenshots/image-converter/image-converter-003.png" alt="Step 3" className="how-img" />
                <p>Click <strong>Convert</strong> to process the image instantly in your browser.</p>
                <p>Download your converted image with the <strong>Download</strong> button.</p>
              </li>
              <li>
                <img src="/screenshots/image-converter/image-converter-004.png" alt="Step 4" className="how-img" />
                <p>You can also convert multiple images at once by selecting more than one file.</p>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* ── Drop zone ── */}
      <div
        className={`ic-drop-zone${isDragging ? ' dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        {mainImages && mainImages.length ? (
          (() => {
            const displayCount = Math.min(8, mainImages.length);
            const spacing = 22;
            const thumbW = 200;
            const containerW = (displayCount - 1) * spacing + thumbW + 8;
            return (
              <div
                className="ic-overlap-stack"
                onClick={(e) => { e.stopPropagation(); }}
                style={{ width: containerW }}
              >
                {mainImages.slice(0, displayCount).map((f, i) => {
                  const left = i * spacing - ((displayCount - 1) * spacing) / 2 + (containerW / 2 - thumbW / 2);
                  return (
                    <img
                      key={i}
                      src={URL.createObjectURL(f)}
                      alt={`upload-${i}`}
                      className="ic-stacked-thumb"
                      style={{ left: `${left}px`, zIndex: 1 + i }}
                      onClick={(ev) => { ev.stopPropagation(); setCurrentIndex(i); }}
                    />
                  );
                })}
                {mainImages.length > 8 && (
                  <div
                    className="ic-stack-more"
                    style={{ left: `${displayCount * spacing - ((displayCount - 1) * spacing) / 2 + (containerW / 2 - thumbW / 2)}px` }}
                  >
                    +{mainImages.length - 8}
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          <div className="ic-drop-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span className="ic-drop-text">Drag &amp; drop images here, or click to select</span>
            <span className="ic-drop-hint">Supports JPG, PNG, WebP, AVIF, GIF, BMP, and more</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileInput}
        />
      </div>

      {/* ── File row ── */}
      {mainImages && mainImages.length > 0 && (
        <div className="ic-file-row">
          <span className="ic-file-name">
            {mainImages.length === 1 ? mainImages[0].name : `${mainImages.length} images selected`}
          </span>
          <button
            type="button"
            className="ic-change-btn"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            {mainImages.length === 1 ? 'Change image' : 'Change images'}
          </button>
          <button type="button" className="ic-clear-btn" onClick={handleClear}>
            Clear
          </button>
        </div>
      )}

      {/* ── Preview popup ── */}
      {previewOpen && outputUrls && outputUrls.length > 0 && outputUrls[currentIndex] && (
        <div className="ic-popup-overlay" onClick={() => setPreviewOpen(false)}>
          <div className="ic-popup-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="ic-popup-close-btn" onClick={() => setPreviewOpen(false)}>&times;</button>
            <p className="ic-output-label" style={{ margin: '0 0 0.5rem' }}>
              &#10003; Converted to {convertedFormat}
              {outputUrls.length > 1 && ` (${currentIndex + 1} / ${outputUrls.length})`}
            </p>
            <DraggablePreview src={outputUrls[currentIndex]} alt={`Converted output ${currentIndex + 1}`} />
            {outputUrls.length > 1 && (
              <>
                <button
                  className="ic-btn ic-popup-nav-btn ic-popup-nav-prev"
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                >
                  Prev
                </button>
                <button
                  className="ic-btn ic-popup-nav-btn ic-popup-nav-next"
                  onClick={() => setCurrentIndex((i) => Math.min(outputUrls.length - 1, i + 1))}
                  disabled={currentIndex >= outputUrls.length - 1}
                >
                  Next
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Format selector ── */}
      <div className="ic-format-section">
        <p className="ic-format-label">Convert to:</p>
        <div className="ic-format-buttons">
          {availableFormats.map((fmt) => (
            <button
              key={fmt}
              type="button"
              className={`ic-format-btn${outputFormat === fmt ? ' active' : ''}`}
              onClick={() => setOutputFormat(fmt)}
            >
              <span className="ic-fmt-name">{FORMAT_LABEL[fmt]}</span>
              <span className="ic-fmt-desc">{FORMAT_DESC[fmt]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── ICO size picker ── */}
      {outputFormat === 'ICO' && (
        <div className="ic-ico-sizes">
          <p className="ic-ico-sizes-label">Output size:</p>
          <div className="ic-ico-sizes-options">
            {[16, 32, 48, 256].map((sz) => (
              <label key={sz} className="ic-ico-size-check">
                <input
                  type="radio"
                  name="ico-size"
                  checked={icoSize === sz}
                  onChange={() => setIcoSize(sz)}
                />
                {sz}×{sz}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="ic-actions">
        <button
          className="ic-btn ic-btn-primary"
          onClick={handleConvertAll}
          disabled={!mainImages.length || status === 'processing'}
        >
          {status === 'processing'
            ? 'Converting…'
            : mainImages.length > 1
              ? `Convert All (${mainImages.length})`
              : 'Convert'}
        </button>
        {mainImages.length <= 1 && outputUrls && outputUrls[0] && (
          <button
            className="ic-btn ic-btn-download"
            onClick={() => {
              const link = document.createElement('a');
              link.href = outputUrls[0];
              link.download = outputNames[0] || 'converted-image';
              document.body.appendChild(link);
              link.click();
              link.remove();
            }}
          >
            Download
          </button>
        )}
        {mainImages.length > 1 && outputUrls && outputUrls.some(Boolean) && (
          <button
            className="ic-btn ic-btn-download"
            onClick={async () => {
              const zip = new JSZip();
              const fetches = outputUrls.map((url, i) => {
                if (!url) return null;
                return fetch(url).then((r) => r.blob()).then((blob) => {
                  zip.file(outputNames[i] || `converted-${i + 1}`, blob);
                });
              });
              await Promise.all(fetches.filter(Boolean));
              const blob = await zip.generateAsync({ type: 'blob' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'converted-images.zip';
              document.body.appendChild(link);
              link.click();
              link.remove();
            }}
          >
            Download All
          </button>
        )}
      </div>

      {/* ── Error ── */}
      {errorMsg && (
        <div className="ic-error" role="alert">{errorMsg}</div>
      )}

      {/* ── Guide: Why Image Formats Matter ── */}
      <section className="ic-guide ic-guide-convert">
        <div className="ic-guide-article">
          <h3 className="ic-guide-title">Why Image Formats Matter (And How to Convert Images the Right Way)</h3>

          <p className="ic-lead">You try to upload an image… and suddenly:</p>
          <ul className="ic-bullet-list">
            <li>“File format not supported”</li>
            <li>Image won’t open on another device</li>
            <li>File size is too large</li>
          </ul>

          <p>These issues usually come down to one thing: <strong>image format</strong>. In this guide you'll learn why formats exist, when to convert them, which format to choose, and how to convert without losing quality.</p>


          <section className='ic-section'>
          <h4>Why Do Image Formats Even Exist?</h4>
          <p>Different formats exist because they serve different purposes: performance (smaller file size), quality (more detail), and compatibility (works everywhere). One format rarely fits all situations.</p>
          </section>

          <section className='ic-section'>
          <h4>What Is Image Conversion?</h4>
          <p>Image conversion means changing an image from one format to another (for example <em>PNG → JPG</em> or <em>HEIC → JPG</em>). The image content stays the same, but file size, quality, and compatibility can change.</p>
          </section>

          <section className='ic-section'>
          <h4>When Do You Need to Convert Images?</h4>
          <ol className="ic-quick-steps">
            <li><strong>Upload Errors:</strong> Some platforms accept only specific formats.</li>
            <li><strong>File Size Too Large:</strong> Convert heavy formats like PNG to JPG/WebP to reduce size.</li>
            <li><strong>Device Compatibility:</strong> Convert HEIC from iPhones to JPG for wider support.</li>
            <li><strong>Web Optimization:</strong> Modern sites prefer WebP for smaller files and faster loading.</li>
          </ol>
          </section>

          <section className='ic-section'>
          <h4>Most Common Image Formats (Quick Guide)</h4>
          <div className="ic-format-grid">
            <div className="ic-format-pill ic-pill-jpg">JPEG (JPG)<span>Best for photos — small files, no transparency</span></div>
            <div className="ic-format-pill ic-pill-png">PNG<span>High quality, supports transparency</span></div>
            <div className="ic-format-pill ic-pill-webp">WebP<span>Modern — smaller size with good quality</span></div>
            <div className="ic-format-pill ic-pill-heic">HEIC<span>Used by iPhones — efficient but limited support</span></div>
          </div>
          </section>

          <section className='ic-section'>
          <h4>Best Practices for Converting Images</h4>
          <ul className="ic-checklist">
            <li>Choose format by use case — WebP for web, JPG for photos, PNG for graphics.</li>
            <li>Avoid repeated conversions — always convert from the original.</li>
            <li>Understand lossy vs lossless: JPG is lossy, PNG is lossless.</li>
            <li>Balance quality and size — pick a middle ground.</li>
            <li>Use a reliable tool that preserves quality and supports many formats.</li>
          </ul>
          </section>

          <section className='ic-section'>
          <h4>Common Mistakes to Avoid</h4>
          <ul className="ic-xlist">
            <li>Converting PNG → JPG (losing transparency)</li>
            <li>Repeatedly converting the same file</li>
            <li>Using the wrong format for the use case</li>
            <li>Ignoring quality settings</li>
            <li>Uploading huge images without optimization</li>
          </ul>
          </section>

          <section className='ic-section'>
          <h4>Step-by-Step: How to Convert an Image</h4>
          <ol className="ic-steps-compact">
            <li>Upload your image</li>
            <li>Select output format</li>
            <li>Adjust quality settings (if available)</li>
            <li>Convert the image</li>
            <li>Download the result</li>
          </ol>
          </section>

          <p className="ic-conclusion">Image conversion isn't just technical — it's essential for compatibility, performance, and usability. By picking the right format you can avoid upload errors, improve speed, and keep good quality.</p>
        </div>

        <aside className="ic-guide-aside">
          <div className="ic-aside-card">
            <h5>Quick Actions</h5>
            <p className="muted">Ready to convert? Jump straight to the tool.</p>
            <button
              type="button"
              className="ic-guide-cta"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Use the Image Converter Tool
            </button>

            <h6>Real-World Use Cases</h6>
            <ul className="ic-mini-list">
              <li>Website optimization — PNG → WebP</li>
              <li>Social uploads — convert to supported formats</li>
              <li>Business docs — ensure cross-system compatibility</li>
              <li>iPhone photos — HEIC → JPG for sharing</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
