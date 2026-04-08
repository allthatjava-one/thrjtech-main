import { formatSize } from '../pdf-compressor/utils/formatSize'
import { useState } from 'react'
import CustomSelect from './CustomSelect'

export function PdfConverterView({
  file,
  status,
  progress,
  originalSize,
  downloadUrl,
  downloadName,
  errorMsg,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleConvert,
  convertType,
  setConvertType,
  handleReset,
}) {
  const [openPanel, setOpenPanel] = useState('')

  const togglePanel = (panel) => {
    setOpenPanel((prev) => (prev === panel ? '' : panel))
  }

  return (
    <>
      {status !== 'done' && (
        <>
          <div className="hero-section">
            <h1 className="hero-title">PDF Converter</h1>
            <p className="hero-tagline">Quickly convert PDF pages into high-quality JPG or PNG images. Choose the output format, preview the converted result, and download images for sharing, thumbnails, or embedding — no account required.</p>

            <div className="details-controls">
              <button
                className={`tab-btn ${openPanel === 'details' ? 'active' : ''}`}
                onClick={() => togglePanel('details')}
                aria-expanded={openPanel === 'details'}
                type="button"
              >
                Details
              </button>
              <button
                className={`tab-btn ${openPanel === 'howitworks' ? 'active' : ''}`}
                onClick={() => togglePanel('howitworks')}
                aria-expanded={openPanel === 'howitworks'}
                type="button"
              >
                How it works
              </button>
            </div>

            <div className={`shared-collapse${!openPanel ? ' panel-hidden' : ''}`}>
                <div className={openPanel !== 'details' ? 'tool-details-open panel-hidden' : 'tool-details-open'}>
                    <h3>What is PDF conversion</h3>
                    <p>
                      PDF conversion transforms pages or entire PDF documents into raster image formats (for example, JPG or PNG) or other target
                      representations. This is useful when you need fixed visual snapshots of pages for thumbnails, image embedding, or compatibility with
                      systems that do not render PDFs natively. In this application the conversion is performed server-side: your PDF is uploaded to a
                      short-lived conversion service which returns the generated images for immediate download.
                    </p>

                    <h3>When to convert</h3>
                    <p>
                      Convert PDFs when you require static images for use in documents, websites, or social media, or when recipients may not have a PDF
                      viewer. Converting is also helpful for creating thumbnails, generating previews for galleries, or extracting visual assets for
                      presentations and slide decks.
                    </p>

                    <h3>How conversion behaves</h3>
                    <p>
                      The conversion process rasterizes PDF pages at a chosen resolution and image format. Vector artwork and text are flattened into
                      pixels, so the output is a pixel-perfect representation of the page at the selected size. This ensures consistent display across
                      platforms but means that searchable text and selectable vectors are lost in the converted image.
                    </p>

                    <h3>Quality and performance</h3>
                    <ul>
                      <li>Resolution: Higher DPI produces sharper images at the cost of larger file sizes and longer processing times.</li>
                      <li>Format: PNG preserves lossless quality and alpha; JPG produces smaller files with configurable quality tradeoffs.</li>
                      <li>Processing time: Conversion speed depends on file size and backend load; expect seconds to a minute for typical documents.</li>
                    </ul>

                    <h4>Benefits of conversion</h4>
                    <ul>
                      <li>Produce standard image files for easy viewing and sharing.</li>
                      <li>Create thumbnails or previews for websites and apps.</li>
                      <li>Improve compatibility when recipients don't have a PDF viewer.</li>
                    </ul>

                    <h3>Privacy & retention</h3>
                    <p>
                      Uploaded files are stored temporarily on a conversion backend and removed according to the service's retention policy. If you are
                      handling sensitive content, prefer local conversion tools that do not transmit data off your device.
                    </p>

                    <h3>Practical tips</h3>
                    <ul>
                      <li>Use PNG for images that require lossless fidelity or transparency.</li>
                      <li>Use JPG for photographic pages when smaller file size is more important than absolute fidelity.</li>
                      <li>For multi-page documents, consider converting only the pages you need to minimize processing and download size.</li>
                    </ul>

                    <h4>Useful when</h4>
                    <ul>
                      <li>You need a quick visual snapshot of a document page.</li>
                      <li>Embedding a page as an image in presentations or blog posts.</li>
                      <li>Extracting images for design or archival purposes.</li>
                    </ul>

                    <h4>FAQ</h4>
                      <ul>
                        <li><strong>Q:</strong>Is my file private? <strong>A:</strong>Files are uploaded to a short-lived backend and stored temporarily. They are removed automatically after a short retention period.</li>

                        <li><strong>Q:</strong>What formats are supported? <strong>A:</strong>This tool supports converting PDFs to JPG and PNG formats.</li>

                        <li><strong>Q:</strong>How long does conversion take? <strong>A:</strong>Conversion typically completes within a few seconds to a minute depending on file size and backend load.</li>

                        <li><strong>Q:</strong>What about very large PDFs? <strong>A:</strong>Very large files may take longer to process. For best results, split extremely large documents before converting.</li>

                        <li><strong>Q:</strong>What other conversions are supported other than JPG and PNG? <strong>A:</strong>This tool currently supports converting PDFs to JPG and PNG formats only. Soon we will provide Searchable PDF and other formats such as Word and Text as well.</li>
                      </ul>
                  </div>

                <div className={openPanel !== 'howitworks' ? 'tool-howitworks-open panel-hidden' : 'tool-howitworks-open'}>
                    <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/screenshots/converter/PDF-converter001.png" alt="Upload PDF" className="how-img" />
                        <p>Drag & drop your PDF or click <em>Browse File</em> to choose one — quick and simple.</p>
                      </li>

                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/screenshots/converter/PDF-converter002.png" alt="Choose format" className="how-img" />
                        <p>Select the output format (JPG or PNG) using the <strong>Convert to</strong> selector.</p>
                      </li>

                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/screenshots/converter/PDF-converter003.png" alt="Start conversion" className="how-img" />
                        <p>Tap <em>Convert</em>. A progress bar shows upload and conversion status so you always know what's happening.</p>
                      </li>

                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/screenshots/converter/PDF-converter004.png" alt="Preview and download" className="how-img" />
                        <p>When ready, the converted image appears with a <em>Download</em> button — click to save it to your device.</p>
                      </li>
                    </ol>
                  </div>
            </div>

            <div className="hero-badges">
              <span className="hero-badge">⚡ Instant</span>
              <span className="hero-badge">🔒 Secure</span>
              <span className="hero-badge">🗑️ Auto-deleted</span>
            </div>
          </div>

          <div
            className={`drop-zone${isDragging ? ' dragging' : ''}${file ? ' has-file' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {!file ? (
              <label className="drop-content" htmlFor="file-input">
                <input
                  ref={fileInputRef}
                  id="file-input"
                  type="file"
                  accept="application/pdf"
                  className="file-input"
                  onChange={handleFileInput}
                />
                <div className="drop-icon">📂</div>
                <p className="drop-text">Drag &amp; drop your PDF here</p>
                <p className="drop-sub">or</p>
                <span className="btn btn-outline">Browse File</span>
              </label>
            ) : (
              <div className="file-info">
                <div className="file-icon">📄</div>
                <div className="file-details">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{formatSize(originalSize)}</span>
                </div>
                <button
                  className="remove-btn"
                  onClick={handleReset}
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="convert-controls">
            <label className="convert-label">Convert to</label>
            <div className="convert-select-wrap">
              <CustomSelect
                value={convertType}
                onChange={setConvertType}
                options={[{ value: 'jpg', label: 'JPG' }, { value: 'png', label: 'PNG' }]}
              />
            </div>
          </div>

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          {file && status === 'idle' && (
            <button className="btn btn-primary compress-btn" onClick={handleConvert}>
              Convert to {convertType.toUpperCase()}
            </button>
          )}

              {(status === 'uploading' || status === 'converting') && (
            <div className="progress-section">
              <div className="progress-label">
                {status === 'uploading' ? 'Uploading…' : 'Converting PDF…'}
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </>
      )}

      {status === 'done' && (
        <div className="result-section">
          <div className="result-icon">✅</div>
          <h2 className="result-title">Conversion Complete!</h2>

          <div className="size-comparison">
            <div className="size-row">
              <span className="size-col-label">Original</span>
              <span className="size-col-label">Size</span>
            </div>
            <div className="size-row size-row--data">
              <span className="size-col-value">{file.name}</span>
              <span className="size-col-value">{formatSize(originalSize)}</span>
            </div>
          </div>

          <a
            className="btn btn-primary"
            href={downloadUrl}
            download={downloadName}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Converted File
          </a>

          <button className="btn btn-ghost" onClick={handleReset}>
            Convert Another File
          </button>
        </div>
      )}

      <div className="note">
        <span className="note-icon">⚠️</span>
        Note: The converted file will be stored temporarily for a short time. Please download it within the available window.
      </div>
    </>
  )
}
