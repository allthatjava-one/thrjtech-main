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
  const [qualityOption, setQualityOption] = useState('BALANCED')

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
                                  <p>
                                    PDF compression is the process of reducing the storage footprint of a PDF file by optimizing and re-encoding its internal
                                    resources — principally images, embedded fonts, and stream objects — while aiming to preserve the document's visible appearance.
                                    Compression helps when you need faster transfers, lower storage costs, or to meet attachment limits without having to manually edit
                                    or recreate the document in external applications.
                                  </p>

                                  <h3>How compression works</h3>
                                  <p>
                                    Under the hood, a compressor inspects the PDF's object tree, identifies large embedded binaries (for example, raster images and
                                    redundant font subsets), and rewrites those resources with more efficient encodings. There are two broad strategies: lossless
                                    optimizations (which repackage streams and remove unused objects without altering pixel data) and lossy image recompression
                                    (which reduces image fidelity in exchange for significant size savings). Good compressors select the least-destructive option based on
                                    the content type and configured quality targets.
                                  </p>

                                  <h3>Design tradeoffs</h3>
                                  <ul>
                                    <li>
                                      Quality vs. Size: Aggressive, lossy recompression reduces bytes but can visibly affect photographs and scanned documents. For
                                      archival or print-ready assets prefer conservative, lossless steps; for web delivery, more aggressive settings often make sense.
                                    </li>
                                    <li>
                                      Speed and Resource Use: Compression of large, image-heavy PDFs is CPU- and memory-intensive — server-side processing can provide
                                      more consistent performance for very large files than client-only approaches.
                                    </li>
                                    <li>
                                      Predictability: Different PDF producers embed resources differently; results vary depending on how the original was generated.
                                    </li>
                                  </ul>

                                  <h3>Practical recommendations</h3>
                                  <ul>
                                    <li>Prefer lossless steps when exact visual fidelity is required (legal, regulated, or archival content).</li>
                                    <li>For scanned or photographic PDFs, try a mild lossy recompression first and review the output visually before further reductions.</li>
                                    <li>Keep a copy of the original file until you confirm the compressed output meets your needs.</li>
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

                              <h3>Privacy & retention</h3>
                              <p>
                                Uploaded files are processed on short-lived infrastructure and removed according to the app's retention policy. If you are handling
                                highly sensitive documents, prefer local desktop tools or an on-prem solution that matches your compliance requirements.
                              </p>

                              <h3>When to use PDF compression</h3>
                              <p>
                                Use compression when you want to optimize documents for email, website publishing, or to save storage. Compression is particularly
                                valuable for scanned documents, photo-heavy reports, or any content where embedded images dominate file size.
                              </p>

                                  <h3>FAQs</h3>
                                  <ul>
                                    <li><strong>Q:</strong> Is my file private? <strong>A:</strong> Files are processed temporarily and auto-deleted according to the app's policy.</li>
                                    <li><strong>Q:</strong> Will compression change layout or searchable text? <strong>A:</strong> No — compression focuses on images and streams while
                                      preserving textual content and layout in most cases.</li>
                                    <li><strong>Q:</strong> Can I control compression level? <strong>A:</strong> This interface applies automatic heuristics; advanced presets are available
                                      in pro or expert modes in other tools.</li>
                                    <li><strong>Q:</strong> What if the result looks worse? <strong>A:</strong> Keep the original and retry with milder settings or use lossless-only options.</li>
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

              <div className="quality-select" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label htmlFor="quality-option" className="hero-tagline" style={{ fontWeight: 700, margin: 0 }}>Quality</label>
                <select
                  id="quality-option"
                  value={qualityOption}
                  onChange={(e) => setQualityOption(e.target.value)}
                  aria-label="Compression quality option"
                  style={{ padding: '6px 8px', borderRadius: 6 }}
                >
                  <option value="HQ">High Quality — minimal visual loss, modest size reduction.</option>
                  <option value="BALANCED">Balanced — good quality with significant size savings.</option>
                  <option value="MAX">Maximum Compression — largest size reduction, some visual loss possible.</option>
                </select>
              </div>

              {errorMsg && <p className="error-msg">{errorMsg}</p>}

              {file && status === 'idle' && (
                <button className="btn btn-primary compress-btn" onClick={() => handleCompress(qualityOption)}>
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
