import { formatSize } from './utils/formatSize'
import { useState } from 'react'

export function PdfCompressorView({
  file,
  status,
  progress,
  originalSize,
  compressedSize,
  downloadUrl,
  downloadName,
  errorMsg,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleCompress,
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
                <h1 className="hero-title">Drop and Go.</h1>
                <p className="hero-tagline">
                    Reduce your PDF file size without losing quality. Upload your file, compress it in seconds, and download the smaller result.
                  </p>
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
                  {openPanel && (
                    <div className="shared-collapse">
                      {openPanel === 'details' && (
                        <div className="tool-details-open">
                          <h3>What it does</h3>
                          <ul>
                            <li>Compresses PDFs by optimizing embedded images and streams.</li>
                            <li>Reduces file size while preserving text and structural metadata when possible.</li>
                            <li>Produces a smaller, downloadable PDF suitable for sharing and storage.</li>
                          </ul>

                          <h3>Use cases</h3>
                          <ul>
                            <li>Make large reports faster to upload and download.</li>
                            <li>Reduce archive size for backups.</li>
                            <li>Prepare documents for email or web publishing.</li>
                          </ul>

                          <h3>Comparison</h3>
                          <ul>
                            <li>Quick and easy — no local software required.</li>
                            <li>Server-side processing may be more consistent for large or complex PDFs.</li>
                            <li>Not a full editor — for advanced edits use desktop tools.</li>
                          </ul>

                          <h3>FAQs</h3>
                          <ul>
                            <li><strong>Q:</strong> Is my file private? <strong>A:</strong> Files are processed temporarily and auto-deleted per the app policy.</li>
                          </ul>
                        </div>
                      )}

                      {openPanel === 'howitworks' && (
                        <div className="tool-howitworks-open">
                          <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                            <li style={{ marginBottom: '0.75rem' }}>
                              <img src="/screenshots/compressor/pdf-compressor-01.png" alt="Step 1" className="how-img" />
                              <p>Upload a PDF using drag & drop or the browse button.</p>
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                              <img src="/screenshots/compressor/pdf-compressor-02.png" alt="Step 2" className="how-img" />
                              <p>The file is sent to the serverless compressor which optimizes embedded images and streams.</p>
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                              <img src="/screenshots/compressor/pdf-compressor-03.png" alt="Step 3" className="how-img" />
                              <p>Compression progress is shown and the compressed file becomes available for download.</p>
                            </li>
                            <li>
                              <img src="/screenshots/compressor/pdf-compressor-04.png" alt="Step 4" className="how-img" />
                              <p>Download the compressed PDF before it is removed from temporary storage.</p>
                            </li>
                          </ol>
                        </div>
                      )}
                    </div>
                  )}
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

              {errorMsg && <p className="error-msg">{errorMsg}</p>}

              {file && status === 'idle' && (
                <button className="btn btn-primary compress-btn" onClick={handleCompress}>
                  Compress PDF
                </button>
              )}

              {(status === 'uploading' || status === 'compressing') && (
                <div className="progress-section">
                  <div className="progress-label">
                    {status === 'uploading' ? 'Uploading to R2 storage…' : 'Compressing PDF…'}
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
              <h2 className="result-title">Compression Complete!</h2>

              <div className="size-comparison">
                <div className="size-row">
                  <span className="size-col-label">Original</span>
                  <span className="size-col-label">Size</span>
                </div>
                <div className="size-row size-row--data">
                  <span className="size-col-value">{file.name}</span>
                  <span className="size-col-value">{formatSize(originalSize)}</span>
                </div>
                <div className="size-row size-row--spacer" />
                <div className="size-row">
                  <span className="size-col-label">Compressed</span>
                  <span className="size-col-label">Size</span>
                </div>
                <div className="size-row size-row--data">
                  <span className="size-col-value size-col-value--compressed">{downloadName}</span>
                  <span className="size-col-value size-col-value--compressed">{formatSize(compressedSize)}</span>
                </div>
              </div>

              <a
                className="btn btn-primary"
                href={downloadUrl}
                download={downloadName}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Compressed PDF
              </a>

              <button className="btn btn-ghost" onClick={handleReset}>
                Compress Another File
              </button>
            </div>
          )}

          <div className="note">
            <span className="note-icon">⚠️</span>
            Note: The compressed file will be stored in Cloudflare R2 storage for 30 min. Please
            download it within this period. After 30 min, the file will be automatically deleted.
          </div>
    </>
  )
}
