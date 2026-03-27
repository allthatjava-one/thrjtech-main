import React, { useState } from 'react'

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
  return (
    <div className="watermarker-view">
      <h2 className="hero-title">Image Watermarker</h2>
      <p className="hero-tagline">Protect your images by adding a custom text or logo watermark. Adjust the position and style to fit your needs, then download the watermarked result instantly.</p>
      <details className="tool-details">
        <summary>Details</summary>
        <div>
          <h3>What it does</h3>
          <p>Applies text or logo watermarks to images with placement and style options.</p>

          <h3>How it works</h3>
          <p>Draws the watermark onto an offscreen canvas and exports the result as a new image file.</p>

          <h3>Use cases</h3>
          <p>Add branding, copyright notices, or subtle stamps before sharing or publishing images.</p>

          <h3>Comparison</h3>
          <p>Faster for single-image watermarking than heavy desktop tools; no persistent uploads required.</p>

          <h3>FAQs</h3>
          <p>Q: Can I use a logo? A: Yes — upload a PNG/SVG logo file to apply as a watermark.</p>
        </div>
      </details>
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
      <button
        className="watermark-btn"
        onClick={handleWatermark}
        disabled={status === 'processing' || !mainImage || (watermarkType === 'logo' && !logoFile) || (watermarkType === 'text' && !watermarkText)}
      >
        {status === 'processing' ? 'Processing...' : 'Add Watermark'}
      </button>
      {errorMsg && <div className="error-msg">{errorMsg}</div>}
      {outputUrl && (
        <div className="output-section">
          <img
            src={outputUrl}
            alt="Watermarked"
            className="output-image clickable"
            style={{ cursor: 'pointer' }}
            onClick={() => setPreviewOpen(true)}
          />
          <div style={{ marginTop: '0.5rem' }}>
            <a href={outputUrl} download={outputName} className="download-btn">Download Watermarked Image</a>
          </div>
        </div>
      )}
    </div>
  )
}
