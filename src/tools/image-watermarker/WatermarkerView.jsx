import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import './Watermarker.css'

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
  const logoInputRef = useRef(null)
  const navigate = useNavigate();

  // Auto-open popup once the watermarked result is ready
  useEffect(() => {
    if (outputUrl) setPreviewOpen(true)
  }, [outputUrl])
  return (
    <div className="watermarker-view">
      <h2 className="hero-title">Image Watermarker</h2>
      <p className="hero-tagline">Protect your images by adding a custom text or logo watermark. 
        Adjust the position and style to fit your needs, then download the watermarked 
        result instantly. <Link to="/blogs/image-watermark-guide">Learn how to put a watermark on your image →</Link></p>
      
      <div className="ir-tip-banner">
        <span className="ir-tip-text">Would you like to <b>resize</b> your image before put watermark?</span>
        <button className="ir-tip-btn" onClick={() => navigate('/image-resizer')}>
          Try Image Resizer
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
        <div className="watermark-input" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => logoInputRef.current && logoInputRef.current.click()}
          >
            Choose logo
          </button>
          <input
            id="logo-input"
            ref={logoInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleLogoInput}
          />
          {logoFile && (
            <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>{logoFile.name}</span>
          )}
        </div>
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

      {/* ── Watermarker Guide Section ── */}
      <div className="wm-guide">
        <div className="wm-guide-intro">
          <h2 className="wm-guide-title">How to Add Watermarks to Images (Protect Your Work and Build Your Brand)</h2>
          <p className="wm-guide-lead">If you share images online — whether photos, designs, or screenshots — you’ve probably worried about others using them without permission. That’s where watermarking comes in. Adding a watermark allows you to protect ownership, promote your brand, and prevent unauthorized reuse.</p>
        </div>

        <div className="wm-guide-section">
          <h3 className="wm-guide-h3">What Is a Watermark?</h3>
          <p>A watermark is a visible overlay (text or logo) placed on an image to indicate ownership or origin. Common types include text watermarks (name, website), logo watermarks (brand identity), and pattern watermarks (repeated across image).</p>
        </div>

        <div className="wm-guide-section wm-guide-why">
          <h3 className="wm-guide-h3">Why You Should Use Watermarks</h3>
          <ol className="wm-guide-list">
            <li><strong>Protect Your Content:</strong> Watermarks discourage casual reuse by clearly showing ownership.</li>
            <li><strong>Build Brand Recognition:</strong> Every shared image carries your name or logo with it.</li>
            <li><strong>Prevent Content Theft:</strong> Makes removal harder and reduces casual copying.</li>
            <li><strong>Add Professional Identity:</strong> Watermarked images look intentional and authoritative.</li>
          </ol>
        </div>

        <div className="wm-guide-section">
          <h3 className="wm-guide-h3">Types of Watermarks</h3>
          <div className="wm-guide-types">
            <div className="wm-type">🔤<div className="wm-type-body"><strong>Text Watermark</strong><p>Simple and fast — good for blogs and tools (e.g., "thrjtech.com").</p></div></div>
            <div className="wm-type">🖼<div className="wm-type-body"><strong>Logo Watermark</strong><p>Strong branding — ideal for businesses; use PNG/SVG for transparency.</p></div></div>
            <div className="wm-type">🔁<div className="wm-type-body"><strong>Repeated Watermark</strong><p>Tiled across the image — best for high-value content, but less clean visually.</p></div></div>
          </div>
        </div>

        <div className="wm-guide-section">
          <h3 className="wm-guide-h3">Best Practices</h3>
          <ul className="wm-guide-best">
            <li>Keep it visible but not distracting (opacity ~30–60%).</li>
            <li>Choose the right position: corner for subtle, center for strong protection.</li>
            <li>Use consistent branding (font, logo, placement).</li>
            <li>Avoid overpowering the image — balance is key.</li>
            <li>Match watermark color to image brightness for legibility.</li>
          </ul>
        </div>

        <div className="wm-guide-section">
          <h3 className="wm-guide-h3">Step-by-Step</h3>
          <ol className="wm-guide-steps">
            <li>Upload your image</li>
            <li>Enter text or upload a logo</li>
            <li>Adjust size, position, and opacity</li>
            <li>Preview the watermark</li>
            <li>Download the final image</li>
          </ol>
        </div>

        <div className="wm-guide-section wm-guide-faq">
          <h3 className="wm-guide-h3">FAQ</h3>
          <details className="wm-faq-item"><summary>Can watermarks be removed?</summary><p>Yes — advanced tools may remove watermarks, but well-placed marks make removal harder.</p></details>
          <details className="wm-faq-item"><summary>What opacity should I use?</summary><p>Usually between 30% and 60% depending on the background.</p></details>
          <details className="wm-faq-item"><summary>Should I place watermark in the center?</summary><p>Center placement offers stronger protection; corners are subtler — choose based on your goal.</p></details>
        </div>

        <div className="wm-guide-conclusion">
          <h3>Conclusion</h3>
          <p>Watermarking is a simple way to protect images, promote your brand, and maintain ownership visibility. When done right it enhances your content without distracting from it.</p>
          <a href="/image-watermarker" className="wm-guide-cta" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/image-watermarker'); }}>Try the Image Watermarker →</a>
        </div>
      </div>
    </div>
  )
}
