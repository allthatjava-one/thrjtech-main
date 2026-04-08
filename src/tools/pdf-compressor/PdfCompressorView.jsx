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
                <h1 className="hero-title">PDF Compressor</h1>
                <p className="hero-tagline">
                    Just Drop and Go - 
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
                  <div className={`shared-collapse${!openPanel ? ' panel-hidden' : ''}`}>
                      <div className={openPanel !== 'details' ? 'tool-details-open panel-hidden' : 'tool-details-open'}>
                              <h3>What is PDF compression</h3>
                              <ul>
                                <li>PDF compression reduces the file size of a PDF by optimizing and re-encoding its contents — primarily images, embedded fonts, and stream objects — without changing the document's visible pages.</li>
                              </ul>

                              <h3>How does compression work</h3>
                              <ul>
                                <li>Compression tools analyze the PDF structure and apply techniques such as re-encoding images at a lower quality or using more efficient encodings, removing unused objects, and optimizing internal streams. Some approaches perform lossless optimizations (no visual change), while others apply lossy image recompression to shrink size further.</li>
                              </ul>

                              <h3>When to compress PDFs</h3>
                              <ul>
                                <li>Compress when you need faster uploads/downloads, to save storage or to share documents by email or web where smaller files improve delivery. Avoid recompressing files that require exact archival fidelity or where every visual pixel must be preserved.</li>
                              </ul>

                              <h3>Trade-Off (quality vs size)</h3>
                              <ul>
                                <li>Higher compression typically reduces image quality or discards some non-critical data; choose settings based on your tolerance for quality loss. Lossless compression preserves visual fidelity but offers smaller size reductions than lossy approaches.</li>
                              </ul>

                              <h3>What it does</h3>
                              <ul>
                                <li>Compresses PDFs by optimizing embedded images and streams.</li>
                                <li>Reduces file size while preserving text and structural metadata when possible.</li>
                                <li>Produces a smaller, downloadable PDF suitable for sharing and storage.</li>
                              </ul>

                              <h3>Useful when</h3>
                              <ul>
                                <li>need to send PDF file but the file size is over email attachment limits.</li>
                                <li>save disk space.</li>
                                <li>prepare documents for email or web publishing.</li>
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
                                <li><strong>Q:</strong> Will compression change my text or layout? <strong>A:</strong> Text and vector content are generally preserved; compression focuses on images and streams, so layout and searchable text should remain intact.</li>
                                <li><strong>Q:</strong> Can I control the compression level? <strong>A:</strong> This tool applies automatic optimizations. Some services offer selectable quality/size presets in advanced modes.</li>
                                <li><strong>Q:</strong> What file types are supported? <strong>A:</strong> This tool accepts PDF files only — other document formats should be converted to PDF first.</li>
                                <li><strong>Q:</strong> How does compression affect scanned PDFs or OCR? <strong>A:</strong> Scanned PDFs are image-heavy; compression reduces image fidelity to save space. OCRed text embedded as text is preserved, but image-based text may lose clarity if heavily compressed.</li>
                              </ul>
                        </div>

                        <div className={openPanel !== 'howitworks' ? 'tool-howitworks-open panel-hidden' : 'tool-howitworks-open'}>
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
