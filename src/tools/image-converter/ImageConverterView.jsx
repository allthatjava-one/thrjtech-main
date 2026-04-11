import { useState, useRef, useCallback } from 'react';

// ── Draggable image viewport ───────────────────────────────────────────────────
function DraggablePreview({ src, alt }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef(null);
  const imgRef = useRef(null);

  // Reset pan when src changes
  const prevSrc = useRef(null);
  if (prevSrc.current !== src) {
    prevSrc.current = src;
    // schedule reset outside render
    Promise.resolve().then(() => setOffset({ x: 0, y: 0 }));
  }

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
    startRef.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  }, [offset]);

  const onMouseMove = useCallback((e) => {
    if (!dragging || !startRef.current) return;
    const dx = e.clientX - startRef.current.mx;
    const dy = e.clientY - startRef.current.my;
    setOffset({ x: startRef.current.ox + dx, y: startRef.current.oy + dy });
  }, [dragging]);

  const onMouseUp = useCallback(() => setDragging(false), []);

  const onTouchStart = useCallback((e) => {
    const t = e.touches[0];
    setDragging(true);
    startRef.current = { mx: t.clientX, my: t.clientY, ox: offset.x, oy: offset.y };
  }, [offset]);

  const onTouchMove = useCallback((e) => {
    if (!dragging || !startRef.current) return;
    e.preventDefault();
    const t = e.touches[0];
    const dx = t.clientX - startRef.current.mx;
    const dy = t.clientY - startRef.current.my;
    setOffset({ x: startRef.current.ox + dx, y: startRef.current.oy + dy });
  }, [dragging]);

  const onTouchEnd = useCallback(() => setDragging(false), []);

  return (
    <div
      className={`ic-drag-viewport${dragging ? ' dragging' : ''}`}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="ic-drag-image"
        style={{ transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))` }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        draggable={false}
      />
      <span className="ic-drag-hint">Drag to pan</span>
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
  mainImage,
  inputMime,
  outputFormat,
  setOutputFormat,
  availableFormats,
  outputUrl,
  outputName,
  convertedFormat,
  status,
  errorMsg,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleConvert,
  handleClear,
  icoSize,
  setIcoSize,
}) {
  const [openPanel, setOpenPanel] = useState('');

  return (
    <div className="ic-view">
      <h2 className="hero-title">Image Converter</h2>
      <p className="hero-tagline">
        Convert images between JPG, PNG, WebP, AVIF, BMP, GIF, ICO, TIFF, and SVG entirely in your browser — no uploads, no account required.
      </p>

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
                <p>Drag &amp; drop an image onto the upload area, or click it to browse for a file.</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <p>Select your desired output format from the format buttons. The tool auto-selects a sensible default based on your input.</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <p>Click <strong>Convert</strong> to process the image instantly in your browser.</p>
              </li>
              <li>
                <p>Download your converted image with the <strong>Download</strong> button.</p>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* ── Drop zone ── */}
      <div
        className={`ic-drop-zone${isDragging ? ' dragging' : ''}${mainImage ? ' has-image' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !mainImage && fileInputRef.current && fileInputRef.current.click()}
      >
        {mainImage ? (
          inputMime === 'image/tiff' ? (
            <div className="ic-tiff-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="8" y1="13" x2="16" y2="13"/>
                <line x1="8" y1="17" x2="16" y2="17"/>
              </svg>
              <span className="ic-drop-text">{mainImage.name}</span>
              <span className="ic-drop-hint">TIFF loaded — ready to convert</span>
            </div>
          ) : (
            <img
              src={URL.createObjectURL(mainImage)}
              alt="Preview"
              className="ic-preview-image"
            />
          )
        ) : (
          <div className="ic-drop-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span className="ic-drop-text">Drag &amp; drop an image here, or click to select</span>
            <span className="ic-drop-hint">Supports JPG, PNG, WebP, AVIF, GIF, BMP, ICO, TIFF, SVG</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileInput}
        />
      </div>

      {/* ── File row ── */}
      {mainImage && (
        <div className="ic-file-row">
          <span className="ic-file-name">{mainImage.name}</span>
          <button
            type="button"
            className="ic-change-btn"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            Change image
          </button>
          <button type="button" className="ic-clear-btn" onClick={handleClear}>
            Clear
          </button>
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
          onClick={handleConvert}
          disabled={!mainImage || status === 'processing'}
        >
          {status === 'processing' ? 'Converting…' : 'Convert'}
        </button>
        <button
          className="ic-btn ic-btn-download"
          disabled={!outputUrl}
          onClick={() => {
            if (!outputUrl) return;
            const link = document.createElement('a');
            link.href = outputUrl;
            link.download = outputName || 'converted-image';
            document.body.appendChild(link);
            link.click();
            link.remove();
          }}
        >
          Download
        </button>
      </div>

      {/* ── Error ── */}
      {errorMsg && (
        <div className="ic-error" role="alert">{errorMsg}</div>
      )}

      {/* ── Output preview ── */}
      {outputUrl && (
        <div className="ic-output-section">
          <p className="ic-output-label">&#10003; Converted to {convertedFormat}</p>
          <DraggablePreview src={outputUrl} alt="Converted output" />
        </div>
      )}
    </div>
  );
}
