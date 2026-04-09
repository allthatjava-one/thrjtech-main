import React, { useState, useEffect } from 'react'

export function WatermarkerView({
  mainImage,
  watermarkType,
  setWatermarkType,
  watermarkText,
  setWatermarkText,
  logoFile,
  setLogoFile,
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
  handleLogoInput,
  handleWatermark,
}) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [openPanel, setOpenPanel] = useState('')

  // Auto-open popup once the watermarked result is ready
  useEffect(() => {
    if (outputUrl) setPreviewOpen(true)
  }, [outputUrl])
  return (
    <div className="watermarker-view">
      <h2 className="hero-title">Image Watermarker</h2>
      <p className="hero-tagline">Protect your images by adding a custom text or logo watermark. Adjust the position and style to fit your needs, then download the watermarked result instantly.</p>
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
                <h3>What is Image watermarker</h3>
                <p>
                  An Image Watermarker applies a visible overlay—either text or a logo—onto an image to indicate ownership, branding, or provenance.
                  The tool supports placement, scaling, opacity adjustments, and simple styling so you can make the watermark subtle or clearly visible
                  depending on your goals. Watermarking is intended as a deterrent for casual reuse and a visual cue pointing back to the original
                  creator or source.
                </p>

                <h3>How watermarking works</h3>
                <p>
                  After selecting a source image you can choose a text watermark or upload a logo. The editor renders the watermark on an offscreen
                  canvas at the chosen position and opacity, and then exports the composite as a new image file for download. Processing is performed
                  locally in the browser by default; nothing is uploaded unless you explicitly use a sharing or cloud-save feature.
                </p>

                <h3>Choosing the right watermark</h3>
                <ul>
                  <li>Semi-transparent text is a good balance for branding without overwhelming the image.</li>
                  <li>Logos (PNG/SVG) keep transparency and provide a cleaner brand mark—use vector or high-resolution PNG logos where possible.</li>
                  <li>Consider placement: corners are less likely to be cropped, while tiled or full-frame watermarks offer stronger protection but impact aesthetics.</li>
                </ul>

                <h3>Practical tips</h3>
                <ul>
                  <li>Use lower opacity and smaller scale for a subtle brand mark; increase opacity and size for stronger visible protection.</li>
                  <li>For batch use, standardize watermark position and size to ensure consistent branding across images.</li>
                  <li>Preview at actual export size to confirm legibility and visual balance before downloading.</li>
                </ul>

                <h3>Useful when</h3>
                <ul>
                  <li>need to protect your images with a visible watermark.</li>
                  <li>want to maintain control over watermark placement, size, and opacity.</li>
                  <li>preparing images for sharing online or for branding purposes.</li>
                </ul>

                <h3>Privacy, retention and limitations</h3>
                <p>
                  Because watermarking runs in your browser, your images remain on your device unless you explicitly upload them. Note that visible
                  watermarks deter casual reuse but are not a foolproof copyright protection; determined actors can remove or crop them. Animated images
                  will be flattened to a single frame during export.
                </p>

                <h3>FAQs</h3>
                <ul>
                  <li><strong>Q:</strong> Can I use a logo? <strong>A:</strong> Yes — upload a PNG or SVG logo to apply as a watermark; transparent backgrounds are supported when the source graphic includes them.</li>
                  <li><strong>Q:</strong> Will this change my original image? <strong>A:</strong> No — the tool creates a new watermarked file and does not overwrite your original file unless you choose to replace it locally.</li>
                  <li><strong>Q:</strong> Does the image leave my browser? <strong>A:</strong> No — watermarking runs in your browser and does not upload the original image by default. If you use a share or cloud-save feature, that may transmit the file.</li>
                  <li><strong>Q:</strong> Can I control opacity, size, and position? <strong>A:</strong> Yes — use the controls to adjust the watermark's opacity, scale, and placement to suit your needs.</li>
                  <li><strong>Q:</strong> Does watermarking work with all image formats? <strong>A:</strong> Common web formats (JPEG, PNG, WebP) are supported. For formats with special features (animated GIF/PNG), results may vary and animation frames are not preserved by single-frame export.</li>
                </ul>
              </div>

            <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
                <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/watermarker/watermarker001.png" alt="Step 1" className="how-img" />
                    <p>Import an image to watermark via drag & drop or file select.</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/watermarker/watermarker002.png" alt="Step 2" className="how-img" />
                    <p>Choose text or logo watermark and adjust position, size, and opacity.</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/watermarker/watermarker003.png" alt="Step 3" className="how-img" />
                    <p>Apply the watermark preview and fine-tune placement.</p>
                  </li>
                  <li>
                    <img src="/screenshots/watermarker/watermarker004.png" alt="Step 4" className="how-img" />
                    <p>Export and download the watermarked image.</p>
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
              setPreviewOpen(true)
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
      </div>
      {/* Preview popup dialog */}
      {previewOpen && outputUrl && (
        <div className="image-popup-overlay" onClick={() => setPreviewOpen(false)}>
          <div
            className="image-popup-dialog"
            onClick={e => e.stopPropagation()}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img
              src={outputUrl}
              alt="Watermarked preview"
              className="image-popup-img"
              style={{
                position: 'static',
                top: 'unset',
                left: 'unset',
                transform: 'none',
                maxWidth: '100%',
                maxHeight: 'calc(93vh - 6rem)',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
          <button className="close-popup-btn" onClick={() => setPreviewOpen(false)}>&times;</button>
        </div>
      )}
      <div className="watermark-options">
        <label>
          <input
            type="radio"
            name="watermarkType"
            value="text"
            checked={watermarkType === 'text'}
            onChange={() => setWatermarkType('text')}
          />
          Text Watermark
        </label>
        <label>
          <input
            type="radio"
            name="watermarkType"
            value="logo"
            checked={watermarkType === 'logo'}
            onChange={() => setWatermarkType('logo')}
          />
          Logo Watermark
        </label>
      </div>
      {watermarkType === 'text' && (
        <input
          type="text"
          className="watermark-input"
          placeholder="Enter watermark text"
          value={watermarkText}
          onChange={e => setWatermarkText(e.target.value)}
        />
      )}
      {watermarkType === 'logo' && (
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoInput}
        />
      )}
      <div className="watermark-actions">
        <button
          className="watermark-btn"
          onClick={handleWatermark}
          disabled={status === 'processing' || !mainImage || (watermarkType === 'logo' && !logoFile) || (watermarkType === 'text' && !watermarkText)}
        >
          {status === 'processing' ? 'Processing...' : 'Preview'}
        </button>
        {outputUrl && (
          <a href={outputUrl} download={outputName} className="download-btn" style={{ marginLeft: '0.6rem' }}>Download</a>
        )}
      </div>
      {errorMsg && <div className="error-msg">{errorMsg}</div>}
    </div>
  )
}
