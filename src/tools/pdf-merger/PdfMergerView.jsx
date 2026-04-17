import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { formatSize } from './utils/formatSize'

export function PdfMergerView({
  files,
  status,
  progress,
  originalSize,
  mergedSize,
  downloadUrl,
  downloadName,
  errorMsg,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleMerge,
  handleReset,
  handleRemove,
  moveFileUp,
  moveFileDown,
  handleItemDragStart,
  handleItemDragOver,
  handleItemDragEnd,
  openFilePicker,
  compress,
  setCompress,
}) {
  const [openPanel, setOpenPanel] = useState('')
  const navigate = useNavigate()
  return (
    <>
      {status !== 'done' && (
        <>
          <div className="hero-section">
            <h1 className="hero-title">PDF Merger</h1>
            <p className="hero-tagline">
              Drop and Merge - Combine multiple PDF files into a single document in seconds. 
              Upload your files, drag to reorder them, then merge and download the result. <Link to="/blogs/pdf-merger-guide">Learn how to merge PDF →</Link>
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: '10px 16px', marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>🖼️</span>
              <span style={{ flex: 1, fontSize: 14, color: '#7c6000' }}>Do you need to split them before re-merge?</span>
              <Link
                to="/pdf-splitter"
                style={{ whiteSpace: 'nowrap', background: '#faad14', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
              >Try PDF Splitter</Link>
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
                      <h3>How PDF merge works</h3>
                      <p>
                        PDF merging concatenates the pages from multiple source files into a single target document. The merger assembles page streams in the
                        specified order and rebuilds the document cross-reference tables and indices so the resulting PDF behaves as one continuous file when
                        opened in viewers. Merging typically preserves page content, annotations, and basic metadata but does not perform deep content edits.
                      </p>

                      <h3>How merged size is determined</h3>
                      <p>
                        The final size is influenced primarily by the input files' contents: image-heavy PDFs contribute most bytes, while text-only files
                        add comparatively little. Some merge implementations deduplicate identical embedded resources (for example, repeated fonts or images),
                        which can reduce the overall size relative to a naïve concatenation. However, deduplication is not guaranteed across all tools.
                      </p>

                      <h3>Why use an online merger</h3>
                      <p>
                        Online merging offloads CPU- and memory-intensive operations to server-side environments, enabling reliable processing of larger
                        batches than many client devices can handle. It also centralizes consistent PDF libraries so behavior is predictable across platforms.
                      </p>

                      <h3>Best practices</h3>
                      <ul>
                        <li>Order your files before merging; the sequence determines the page order in the final document.</li>
                        <li>Remove or replace password protection before merging, as encrypted files cannot be concatenated without unlocking.</li>
                        <li>For print-ready output, review the merged PDF for consistent page sizes and color spaces before distributing to printers.</li>
                      </ul>

                      <h3>What it does</h3>
                      <ul>
                        <li>Merges multiple PDFs into a single document, preserving page order and basic metadata.</li>
                      </ul>

                      <h3>Useful when</h3>
                      <ul>
                        <li>need to send multiple PDF files as a single document.</li>
                        <li>want to simplify document management by combining related files.</li>
                        <li>preparing documents for printing or archiving.</li>
                      </ul>

                      <h3>Comparison</h3>
                      <ul>
                        <li>Simpler and faster than manual desktop merging for ad-hoc tasks; lacks advanced editing features.</li>
                      </ul>

                      <h3>Privacy & retention</h3>
                      <p>
                        Uploaded files are handled temporarily and removed according to the service's retention policy. Avoid uploading highly sensitive
                        documents unless your organization’s policy allows external processing.
                      </p>

                      <h3>FAQs</h3>
                      <ul>
                        <li><strong>Q:</strong> Can I reorder pages? <strong>A:</strong> You can reorder whole files before merging; page-level reordering is not supported.</li>
                        <li><strong>Q:</strong> Are my files private? <strong>A:</strong> Files are processed temporarily and removed according to the app's retention policy; avoid uploading highly sensitive documents if you require stricter controls.</li>
                        <li><strong>Q:</strong> What are the file limits? <strong>A:</strong> Upload and processing limits depend on the service; very large files or very large batches may be truncated or rejected — split them beforehand if needed.</li>
                        <li><strong>Q:</strong> Will merging change content? <strong>A:</strong> Merging preserves page content and order; it does not alter page pixels or text unless a separate optimization step runs afterwards.</li>
                        <li><strong>Q:</strong> Can I merge password-protected PDFs? <strong>A:</strong> Password-protected files cannot be processed unless unlocked first — provide an unlocked copy or remove protection locally before uploading.</li>
                      </ul>
                  </div>

                  <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
                      <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                        <li style={{ marginBottom: '0.75rem' }}>
                          <img src="/screenshots/merger/merger-001.png" alt="Step 1" className="how-img" />
                          <p>Upload the PDF files you want to merge.</p>
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                          <img src="/screenshots/merger/merger-002.png" alt="Step 2" className="how-img" />
                          <p>Drag to reorder files to set the merge order.</p>
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                          <img src="/screenshots/merger/merger-003.png" alt="Step 3" className="how-img" />
                          <p>Click Merge to send files to the backend merging process.</p>
                        </li>
                        <li>
                          <img src="/screenshots/merger/merger-004.png" alt="Step 4" className="how-img" />
                          <p>Download the merged PDF when processing completes.</p>
                        </li>
                      </ol>
                  </div>
                </div>
            </div>
            <div className="hero-badges">
              <span className="hero-badge">⚡ Fast</span>
              <span className="hero-badge">🔒 Secure</span>
              <span className="hero-badge">🗑️ Auto-deleted</span>
            </div>
          </div>

          <div
            className={`drop-zone${isDragging ? ' dragging' : ''}${files.length ? ' has-file' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              id="file-input"
              type="file"
              accept="application/pdf"
              multiple
              className="file-input"
              onChange={handleFileInput}
            />

            {!files.length ? (
              <label className="drop-content" htmlFor="file-input">
                <div className="drop-icon">📚</div>
                <p className="drop-text">Drag and drop your PDF files here</p>
                <p className="drop-sub">or</p>
                <span className="btn btn-outline">Browse Files</span>
              </label>
            ) : (
              <div className="file-list-wrap">
                <div className="file-list-header">
                  <div>
                    <span className="file-list-title">PDF files ({files.length})</span>
                    <p className="file-list-sub">Drag files to reorder merge order.</p>
                  </div>
                  <button className="btn btn-outline file-list-add" onClick={openFilePicker} type="button">
                    Add More Files
                  </button>
                </div>

                <ul className="file-list">
                  {files.map((item, index) => (
                    <li
                      key={item.id}
                      className="file-row"
                      draggable
                      onDragStart={() => handleItemDragStart(item.id)}
                      onDragOver={(e) => handleItemDragOver(e, item.id)}
                      onDragEnd={handleItemDragEnd}
                    >
                      <span className="file-row-order">{index + 1}</span>
                      <div className="file-row-main">
                        <span className="file-name">{item.file.name}</span>
                        <span className="file-size">{formatSize(item.file.size)}</span>
                      </div>
                      <div className="file-row-actions">
                        <button
                          className="reorder-btn"
                          type="button"
                          onClick={() => moveFileUp(index)}
                          disabled={index === 0}
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          className="reorder-btn"
                          type="button"
                          onClick={() => moveFileDown(index)}
                          disabled={index === files.length - 1}
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          className="remove-btn"
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          title="Remove file"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <label className="compress-option">
            <input
              type="checkbox"
              checked={compress}
              onChange={(e) => setCompress(e.target.checked)}
            />
            Compress merged PDF
          </label>

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          {files.length > 0 && status === 'idle' && (
            <button className="btn btn-primary compress-btn" onClick={handleMerge} type="button">
              Merge PDFs
            </button>
          )}

          {(status === 'merging' || status === 'uploading' || status === 'compressing') && (
            <div className="progress-section">
              <div className="progress-label">
                {status === 'merging' && 'Merging PDFs...'}
                {status === 'uploading' && 'Uploading merged PDF...'}
                {status === 'compressing' && 'Compressing merged PDF...'}
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
          <h2 className="result-title">Merge Complete!</h2>

          <div className="size-comparison">
            <div className="size-row">
              <span className="size-col-label">Input</span>
              <span className="size-col-label">Total Size</span>
            </div>
            <div className="size-row size-row--data">
              <span className="size-col-value">{files.length} PDF files</span>
              <span className="size-col-value">{formatSize(originalSize)}</span>
            </div>
            <div className="size-row size-row--spacer" />
            <div className="size-row">
              <span className="size-col-label">Merged</span>
              <span className="size-col-label">Size</span>
            </div>
            <div className="size-row size-row--data">
              <span className="size-col-value size-col-value--compressed">{downloadName}</span>
              <span className="size-col-value size-col-value--compressed">{formatSize(mergedSize)}</span>
            </div>
          </div>

          <a
            className="btn btn-primary"
            href={downloadUrl}
            download={downloadName}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Merged PDF
          </a>

          <button className="btn btn-ghost" onClick={handleReset} type="button">
            Merge Another Set
          </button>
        </div>
      )}

      {compress && status === 'done' && (
        <div className="note">
          <span className="note-icon">⚠️</span>
          Note: The compressed file will be stored in Cloudflare R2 storage for 30 min. Please
          download it within this period. After 30 min, the file will be automatically deleted.
        </div>
      )}
      

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: '10px 16px', marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>🖼️</span>
        <span style={{ flex: 1, fontSize: 14, color: '#7c6000' }}>Trouble merging because the files are too large?</span>
        <Link
          to="/pdf-compressor"
          style={{ whiteSpace: 'nowrap', background: '#faad14', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
        >Try PDF Compressor</Link>
      </div>

      {/* Merger guide - different visual vibe */}
      <section className="merger-guide" style={{ marginTop: 28 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: 18, background: 'linear-gradient(180deg,#f7fbff,#ffffff)', borderRadius: 10, border: '1px solid #e6f0ff', color: '#111' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: '0 0 60px', fontSize: 34, lineHeight: 1 }}>
              🧩
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>Combine Multiple PDFs Into One (Clean, Organized &amp; Stress-Free Guide)</h2>
              <p style={{ marginTop: 8 }}>Working with multiple PDF files can get messy fast. Instead of sending or managing them one by one, you can merge everything into a single, clean document.</p>
              <p style={{ marginTop: 6, fontWeight: 700 }}>👉 This guide shows you how to merge PDFs efficiently, organize them properly, and avoid common mistakes.</p>

              <br />
              <h3 style={{ marginTop: 12 }}>📌 What Is a PDF Merger?</h3>
              <p>A PDF merger is a tool that lets you:</p>
              <ul style={{ marginLeft: 16 }}>
                <li>📄 Combine multiple PDF files</li>
                <li>🔀 Rearrange page order</li>
                <li>➕ Add or remove pages</li>
                <li>📥 Export as a single document</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>🎯 Why Merging PDFs Matters</h3>
              <ul style={{ marginLeft: 16 }}>
                <li><strong>Better Organization</strong> — turn several files into one structured document.</li>
                <li><strong>Easier Sharing</strong> — one file is faster, cleaner, and less confusing.</li>
                <li><strong>Professional Presentation</strong> — a single merged PDF looks polished.</li>
                <li><strong>Improved Workflow</strong> — reduces clutter and repetitive tasks.</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>🛠 Common Use Cases</h3>
              <ul style={{ marginLeft: 16 }}>
                <li>💼 Business Documents — combine reports, invoices, contracts</li>
                <li>🎓 Student Assignments — merge multiple sections into one submission</li>
                <li>🧾 Scanned Files — combine scanned pages into a single file</li>
                <li>📑 Application Submissions — resume + cover letter + certificates</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>🧠 How PDF Merging Works (Simple Explanation)</h3>
              <p>Files are loaded, pages are extracted and arranged, and a new PDF is generated. The original files remain unchanged.</p>

              <br />
              <h3 style={{ marginTop: 10 }}>🧭 Step-by-Step: Merge PDFs Easily</h3>
              <ol style={{ marginLeft: 16 }}>
                <li>📤 Upload your PDF files</li>
                <li>👀 Preview all pages</li>
                <li>🔀 Drag to reorder</li>
                <li>➕ Add or remove files</li>
                <li>📥 Download merged PDF</li>
              </ol>

              <br />
              <h3 style={{ marginTop: 10 }}>🎨 Tips to Make Your Merged PDF Look Clean</h3>
              <ul style={{ marginLeft: 16 }}>
                <li>✅ Keep logical order (Cover → Content → Appendix)</li>
                <li>✅ Use clear file naming (rename files in correct order)</li>
                <li>✅ Remove unnecessary pages (blank pages, duplicates)</li>
                <li>✅ Check final output (page order, orientation, formatting)</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>⚠️ Common Mistakes to Avoid</h3>
              <ul style={{ marginLeft: 16 }}>
                <li>❌ Wrong page order</li>
                <li>❌ Mixing portrait &amp; landscape awkwardly</li>
                <li>❌ Forgetting to remove duplicates</li>
                <li>❌ Merging low-quality scans</li>
                <li>❌ Not reviewing final file</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>🔍 PDF Merger vs PDF Splitter</h3>
              <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e6f0ff' }}>
                    <th style={{ textAlign: 'left', padding: 6 }}>Feature</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>PDF Merger</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>PDF Splitter</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #f3f7ff' }}>Purpose</td><td style={{ padding: 6, borderBottom: '1px solid #f3f7ff' }}>Combine files</td><td style={{ padding: 6, borderBottom: '1px solid #f3f7ff' }}>Break files apart</td></tr>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #f3f7ff' }}>Output</td><td style={{ padding: 6, borderBottom: '1px solid #f3f7ff' }}>Single document</td><td style={{ padding: 6, borderBottom: '1px solid #f3f7ff' }}>Multiple documents</td></tr>
                  <tr><td style={{ padding: 6 }}>Use case</td><td style={{ padding: 6 }}>Organization</td><td style={{ padding: 6 }}>Extraction</td></tr>
                </tbody>
              </table>
              </div>

              <br />
              <h3 style={{ marginTop: 10 }}>🚀 Pro Tips for Faster Workflow</h3>
              <ul style={{ marginLeft: 16 }}>
                <li>🗂 Prepare files in advance</li>
                <li>🔢 Name files in order (01, 02, 03…)</li>
                <li>⚡ Merge once instead of repeatedly</li>
                <li>🔒 Use tools that respect privacy</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>🔐 Is It Safe to Merge PDFs Online?</h3>
              <p>Most tools process files temporarily and delete them after completion. Still, avoid uploading sensitive documents unless you trust the tool.</p>

              <br />
              <h3 style={{ marginTop: 10 }}>❓ FAQ</h3>
              <p><strong>Can I change page order after merging?</strong> Yes — most tools allow reordering before final export.</p>
              <p><strong>Will merging affect quality?</strong> No — good tools preserve layout and formatting.</p>
              <p><strong>Can I merge images into PDFs?</strong> Yes — many tools support combining images and PDFs.</p>
              <p><strong>Is there a limit on number of files?</strong> Depends on the tool, but many support multiple files easily.</p>

              <br />
              <p style={{ marginTop: 12 }}><strong>🧾 Conclusion</strong>
              <br/>Merging PDFs helps you stay organized and present information professionally. With the right approach you can turn scattered files into a clean document in seconds.</p>

              <p style={{ marginTop: 12 }}>
                <a
                  className="btn btn-primary"
                  href="/pdf-merger"
                  onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/pdf-merger') }}
                >👉 Try it here: PDF Merger Tool</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
