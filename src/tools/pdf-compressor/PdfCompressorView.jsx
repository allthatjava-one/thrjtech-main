import { Link, useNavigate } from 'react-router-dom'
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

  // style for guide lists so list items align with paragraph text
  const guideListStyle = { marginLeft: 0, paddingLeft: 0, listStylePosition: 'inside' }
  const navigate = useNavigate()

  return (
    <>
          {status !== 'done' && (
            <>
              <div className="hero-section">
                <h1 className="hero-title">PDF Compressor</h1>
                <p className="hero-tagline">
                    Just Drop and Go - 
                    Reduce your PDF file size without losing quality. Upload your file, compress it in seconds, 
                    and download the smaller result. <Link to="/blogs/pdf-compressor-guide">Learn how to compress PDF →</Link>
                  </p>
                  
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: '10px 16px', marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>🖼️</span>
                  <span style={{ flex: 1, fontSize: 14, color: '#7c6000' }}>Do you need to split the PDFs before compress?</span>
                  <Link
                    to="/pdf-splitter"
                    style={{ whiteSpace: 'nowrap', background: '#faad14', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
                  >Try PDF Splitter</Link>
                </div>

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

          {/* Guide / How-to section */}
          <section className="tool-guide" style={{ marginTop: 28 }}>
            <div style={{ maxWidth: 820, margin: '0 auto', padding: '12px 6px', color: '#222', lineHeight: 1.6 }}>
              <h2 style={{ fontSize: 22, marginBottom: 6 }}>How to Reduce PDF File Size Without Losing Quality (Fast &amp; Simple Guide)</h2>

              <p>
                You’ve probably run into this problem: <em>“File size exceeds limit”</em>, email won’t send your PDF, or an upload fails.
                Large PDFs are frustrating — but you don’t need to recreate your file. This short guide explains why PDFs get large, how
                compression works, and how to reduce file size without ruining quality.
              </p>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>Why Are PDF Files So Large?</h3>
              <p>A PDF can contain much more than just text. Common reasons for large files:</p>
              <ul style={guideListStyle}>
                <li><strong>High-Resolution Images</strong> — images often use full resolution and are not optimized.</li>
                <li><strong>Embedded Fonts</strong> — PDFs may include multiple full font sets.</li>
                <li><strong>Scanned Documents</strong> — scanned PDFs are images saved as pages and can be very large.</li>
                <li><strong>Uncompressed Elements</strong> — files created without optimization contain extra data.</li>
              </ul>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>What Does PDF Compression Do?</h3>
              <p>Compression reduces file size by lowering image resolution, removing unnecessary data, and optimizing internal structure —
                 aiming for a smaller file while keeping acceptable visual quality.</p>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>When Should You Compress a PDF?</h3>
              <ul style={guideListStyle}>
                <li><strong>Sending via email</strong> — avoid 20–25MB attachment limits.</li>
                <li><strong>Uploading to websites</strong> — job portals, forms, and submissions often limit file size.</li>
                <li><strong>Saving storage</strong> — smaller files save disk space and speed backups.</li>
                <li><strong>Improving performance</strong> — smaller PDFs open and load faster on all devices.</li>
              </ul>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>Best Practices for PDF Compression</h3>
              <ol style={guideListStyle}>
                <li><strong>Choose the right compression level</strong> — low compression keeps quality, high compression reduces size more.</li>
                <li><strong>Optimize images first</strong> — resize/compress images before creating the PDF when possible.</li>
                <li><strong>Avoid repeated compression</strong> — always keep an original copy; repeated recompression degrades quality.</li>
                <li><strong>Know your purpose</strong> — printing needs higher quality; sharing can be smaller.</li>
                <li><strong>Use a reliable tool</strong> — balance size and quality; try this compressor for fast results.</li>
              </ol>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>Common Mistakes to Avoid</h3>
              <ul style={guideListStyle}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#b91c1c', fontWeight: 700, lineHeight: '1em' }}>✕</span>
                  Over-compressing important documents
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#b91c1c', fontWeight: 700, lineHeight: '1em' }}>✕</span>
                  Compressing already optimized PDFs
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#b91c1c', fontWeight: 700, lineHeight: '1em' }}>✕</span>
                  Ignoring readability after compression
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#b91c1c', fontWeight: 700, lineHeight: '1em' }}>✕</span>
                  Using low-quality scans as input
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#b91c1c', fontWeight: 700, lineHeight: '1em' }}>✕</span>
                  Not checking the final output
                </li>
              </ul>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>Step-by-Step: How to Compress a PDF</h3>
              <ol style={guideListStyle}>
                <li>Upload your PDF file</li>
                <li>Choose compression level</li>
                <li>Start compression</li>
                <li>Preview the result</li>
                <li>Download the optimized file</li>
              </ol>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>Real-World Use Cases</h3>
              <ul style={guideListStyle}>
                <li>Job applications — upload resumes within limits</li>
                <li>Business documents — share reports efficiently</li>
                <li>Student assignments — submit without upload errors</li>
                <li>Mobile sharing — avoid long download times</li>
              </ul>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>PDF Compression vs File Splitting</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e6e6e6' }}>
                    <th style={{ textAlign: 'left', padding: 6 }}>Feature</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>Compression</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>Splitting</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #f3f3f3' }}>Goal</td><td style={{ padding: 6, borderBottom: '1px solid #f3f3f3' }}>Reduce size</td><td style={{ padding: 6, borderBottom: '1px solid #f3f3f3' }}>Break into parts</td></tr>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #f3f3f3' }}>Keeps file intact</td><td style={{ padding: 6, borderBottom: '1px solid #f3f3f3' }}>✅ Yes</td><td style={{ padding: 6, borderBottom: '1px solid #f3f3f3' }}>❌ No</td></tr>
                  <tr><td style={{ padding: 6 }}>Best for</td><td style={{ padding: 6 }}>Email, uploads</td><td style={{ padding: 6 }}>Large document sharing</td></tr>
                </tbody>
              </table>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>Tips for Better Results</h3>
              <ul style={guideListStyle}>
                <li>Use clear, high-quality originals</li>
                <li>Avoid unnecessary images</li>
                <li>Keep formatting simple</li>
                <li>Test different compression levels</li>
              </ul>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>FAQ</h3>
              <p><strong>Does PDF compression reduce quality?</strong><br/>Yes — but good tools minimize noticeable loss.</p>
              <p><strong>How much can I reduce file size?</strong><br/>It depends on content: image-heavy PDFs see large reductions; text-only PDFs see smaller changes.</p>
              <p><strong>Can I reverse compression?</strong><br/>No — compression is usually permanent. Keep originals.</p>

              <p style={{ marginTop: 10 }}><strong>Conclusion</strong><br/>Large PDFs don’t have to slow you down. Use proper compression techniques to share files, meet upload limits, and improve performance without sacrificing usability.</p>

              <p style={{ marginTop: 12 }}>
                <a
                  className="btn btn-primary"
                  href="/pdf-compressor"
                  onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/pdf-compressor') }}
                >👉 Compress your PDF here: PDF Compressor Tool</a>
              </p>
            </div>
          </section>
    </>
  )
}
