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
  // Set original dimensions when image loads
  React.useEffect(() => {
    if (mainImage) {
      const img = new window.Image();
      img.onload = () => {
        originalWidth.current = img.width;
        originalHeight.current = img.height;
      };
      img.src = URL.createObjectURL(mainImage);
    }
  }, [mainImage]);
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
      <p className="hero-tagline">Resize your image to any size by percentage or exact pixel dimensions. Lock the aspect ratio to prevent distortion, then download your result instantly.</p>
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
                    <p>Select percentage or explicit width/height and lock the aspect ratio if needed.</p>
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
        className={`drop-zone${isDragging ? ' dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        {mainImage ? (
          <img
            src={URL.createObjectURL(mainImage)}
            alt="Main"
            className="preview-image clickable"
            style={{ cursor: 'pointer' }}
            onClick={e => {
              e.stopPropagation();
              setPreviewOpen(true);
            }}
          />
        ) : (
          <span>Drag & drop an image here, or click to select</span>
        )}
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileInput}
        />
      </div>
      {/* Preview popup dialog */}
      {previewOpen && (mainImage || outputUrl) && (
        <div className="image-popup-overlay" onClick={() => setPreviewOpen(false)}>
          <div className="image-popup-dialog" onClick={e => e.stopPropagation()}>
            <img
              src={outputUrl ? outputUrl : URL.createObjectURL(mainImage)}
              alt="Preview"
              className="image-popup-img"
            />
            <button className="close-popup-btn" onClick={() => setPreviewOpen(false)}>&times;</button>
          </div>
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
      <button
        className="resize-btn"
        onClick={handleResize}
        disabled={status === 'processing' || !mainImage || (resizeMode === 'dimensions' && (!width || !height))}
      >
        {status === 'processing' ? 'Processing...' : 'Resize Image'}
      </button>
      {errorMsg && <div className="error-msg">{errorMsg}</div>}
      {outputUrl && (
        <div className="output-section">
          <img
            src={outputUrl}
            alt="Resized"
            className="output-image clickable"
            style={{ cursor: 'pointer' }}
            onClick={() => setPreviewOpen(true)}
          />
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
            <span style={{ fontWeight: 600, color: '#222', fontSize: '1.08rem', marginBottom: 0, textAlign: 'left', flex: 1, display: 'block', alignSelf: 'center' }}>
              Would you like to put private watermark on the resized image?
            </span>
            <button
              className="resize-btn"
              style={{ minWidth: 64, padding: '0.35rem 1.1rem', fontSize: '0.98rem', marginLeft: 12, alignSelf: 'center', marginTop: 0, marginBottom: 0 }}
              onClick={handleSendToWatermark}
              disabled={sendStatus === 'processing'}
            >
              {sendStatus === 'processing' ? 'Preparing...' : 'Yes'}
            </button>
          </div>
          {sendStatus === 'error' && (
            <div className="error-msg" style={{ marginTop: 8 }}>Failed to send image to watermark tool.</div>
          )}
          <div style={{ marginTop: '0.5rem' }}>
            <a href={outputUrl} download={outputName} className="download-btn">Download Resized Image</a>
          </div>
        </div>
      )}
    </div>
  );
}
