import { Link, useNavigate } from 'react-router-dom'
import { formatSize } from './utils/formatSize'
import React, { useState } from 'react'

export function PdfSplitterView({
  file,
  status,
  progress,
  originalSize,
  segments,
  setSegments,
  outputOption,
  setOutputOption,
  results,
  errorMsg,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleSplit,
  handleReset,
}) {
  const [openPanel, setOpenPanel] = useState('')
  const navigate = useNavigate()
  const togglePanel = (panel) => setOpenPanel((prev) => (prev === panel ? '' : panel))
  return (
    <>
      {status !== 'done' && <div className="hero-section">
        <h1 className="hero-title">PDF Splitter</h1>
        <p className="hero-tagline">Just Drop and Go — Extract the pages you need from 
          any PDF by entering simple page ranges (e.g. 1, 3-5, 7-10). Get each range 
          as its own file, or merge them all into one combined PDF. 
          No software needed — upload, split, and download 
          in seconds.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: '10px 16px', marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>🖼️</span>
          <span style={{ flex: 1, fontSize: 14, color: '#7c6000' }}>Do you need to merge PDFs?</span>
          <Link
            to="/pdf-merger"
            style={{ whiteSpace: 'nowrap', background: '#faad14', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
          >Try PDF Merger</Link>
        </div>

        <div className="details-controls">
          <button
            className={`tab-btn${openPanel === 'details' ? ' active' : ''}`}
            onClick={() => togglePanel('details')}
            aria-expanded={openPanel === 'details'}
            type="button"
          >
            Details
          </button>
          <button
            className={`tab-btn${openPanel === 'howitworks' ? ' active' : ''}`}
            onClick={() => togglePanel('howitworks')}
            aria-expanded={openPanel === 'howitworks'}
            type="button"
          >
            How it works
          </button>
        </div>
        <div className={`shared-collapse${!openPanel ? ' panel-hidden' : ''}`}>
          <div className={openPanel !== 'details' ? 'tool-details-open panel-hidden' : 'tool-details-open'}>
            <h3>What is PDF splitting</h3>
            <p>
              PDF splitting is the process of extracting one or more specific pages — or contiguous page ranges — from an existing PDF document and saving those pages as new, smaller PDF files. Unlike a full edit, splitting does not modify the original content; it simply reorganises which pages end up in which output file. This is particularly valuable when a large document contains distinct sections (chapters, reports, invoices) that different recipients need independently, or when you want to share only a subset of a document without exposing the rest.
            </p>

            <h3>Output options</h3>
            <p>Two output modes are supported, letting you choose the right result for your workflow:</p>
            <ul>
              <li><strong>Multiple files:</strong> each page range you specify becomes its own downloadable PDF. For example, entering <code>1,3-5,7-10</code> produces three separate files — one for page 1, one for pages 3–5, and one for pages 7–10. Ideal when you need to distribute individual sections to different people.</li>
              <li><strong>Single combined file:</strong> all selected pages across every range are merged in order into one PDF. Use this when you want to cherry-pick non-contiguous pages and reassemble them as a coherent document — for example, pulling the executive summary from the front and the appendix from the back into a concise overview.</li>
            </ul>

            <h3>Page range format</h3>
            <p>Ranges are entered as a comma-separated list. The supported syntax is:</p>
            <ul>
              <li><strong>Single page:</strong> <code>3</code> — extracts only page 3.</li>
              <li><strong>Contiguous range:</strong> <code>3-7</code> — extracts pages 3, 4, 5, 6, and 7.</li>
              <li><strong>Mixed list:</strong> <code>1,3-5,8,10-12</code> — extracts page 1, pages 3–5, page 8, and pages 10–12.</li>
            </ul>
            <p>Spaces around commas and hyphens are ignored. Page numbers must be positive integers that exist in the uploaded document.</p>

            <h3>Design tradeoffs</h3>
            <ul>
              <li><strong>Fidelity:</strong> splitting is non-destructive — fonts, images, annotations, and metadata within each extracted page are preserved exactly as they appear in the source document.</li>
              <li><strong>Performance:</strong> processing is done server-side for consistency; for very large files the upload step may take a few seconds depending on your connection.</li>
              <li><strong>Order:</strong> in Single mode, pages are written to the output in the order the ranges appear in your input, not necessarily document order. You can reorder sections by changing the range sequence.</li>
            </ul>

            <h3>Practical recommendations</h3>
            <ul>
              <li>Always verify total page count before entering ranges — requesting a page beyond the document's length will return an error.</li>
              <li>For confidential documents, use Single output mode to produce one tightly scoped file rather than leaving multiple partial downloads in temporary storage.</li>
              <li>If you need a complete subset in a specific order, list ranges in the intended reading sequence in your input string.</li>
              <li>Download all results promptly — files are held in temporary cloud storage and are automatically deleted after a short period.</li>
            </ul>

            <h3>What it does</h3>
            <ul>
              <li>Uploads your PDF to secure R2 cloud storage via a short-lived presigned URL.</li>
              <li>Passes your page ranges and output mode to a server-side splitting engine.</li>
              <li>Returns presigned download links for each output file, valid for a limited time.</li>
              <li>Does not permanently store your document — files are cleaned up automatically.</li>
            </ul>

            <h3>Useful when</h3>
            <ul>
              <li>You need to email a specific section of a report without sharing the whole document.</li>
              <li>A form or contract spans many pages but a recipient only needs a few signature pages.</li>
              <li>You want to archive individual chapters of a scanned book as separate files.</li>
              <li>You need to reassemble non-contiguous pages into a new document without a desktop PDF editor.</li>
            </ul>

            <h3>Comparison with alternatives</h3>
            <ul>
              <li><strong>Browser-based (this tool):</strong> quick, no software to install, suitable for occasional use on files that are not highly sensitive.</li>
              <li><strong>Desktop tools (Adobe Acrobat, PDFsam):</strong> better suited for batch operations, bookmark-based splitting, or documents subject to strict data-handling policies.</li>
              <li><strong>Command-line tools (pdftk, ghostscript):</strong> scriptable and efficient for automated pipelines, but require technical setup.</li>
            </ul>

            <h3>Privacy &amp; retention</h3>
            <p>
              Files are uploaded over HTTPS to short-lived Cloudflare R2 storage and are automatically deleted according to the application's retention policy. No copies are kept after deletion. If you are handling highly sensitive, regulated, or confidential documents, consider using a local desktop tool or an on-premises solution that matches your compliance requirements.
            </p>

            <h3>FAQs</h3>
            <ul>
              <li><strong>Q:</strong> Is my file private? <strong>A:</strong> Files are uploaded over HTTPS, processed on short-lived infrastructure, and auto-deleted. They are not used for any other purpose.</li>
              <li><strong>Q:</strong> Can I split by bookmarks or headings? <strong>A:</strong> Currently only explicit page-range splitting is supported. Bookmark-based splitting is a planned enhancement.</li>
              <li><strong>Q:</strong> What if I enter an out-of-range page number? <strong>A:</strong> The backend will return an error indicating which page number is invalid. Correct the range and retry.</li>
              <li><strong>Q:</strong> Is there a file size limit? <strong>A:</strong> Very large files may time out during upload or processing. If this happens, try splitting a smaller portion first.</li>
              <li><strong>Q:</strong> Can I download the results later? <strong>A:</strong> No — download links are temporary and expire after a short period. Download all files immediately after the split completes.</li>
            </ul>
          </div>
          <div className={openPanel !== 'howitworks' ? 'tool-howitworks-open panel-hidden' : 'tool-howitworks-open'}>
            <ol style={{ margin: 0, paddingLeft: '1rem' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <img src="/screenshots/splitter/PDF-splitter-001.png" alt="Step 1" className="how-img" />
                <p>Upload a PDF using drag &amp; drop or the browse button.</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <img src="/screenshots/splitter/PDF-splitter-002.png" alt="Step 2" className="how-img" />
                <p>Enter the page ranges you want (e.g. <code>1,3-5,7-10</code>) and choose <strong>Single</strong> or <strong>Multiple</strong> output.</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <img src="/screenshots/splitter/PDF-splitter-003.png" alt="Step 3" className="how-img" />
                <p>Click <strong>Split PDF</strong> — the file is uploaded to R2 storage and the splitter processes your ranges.</p>
              </li>
              <li>
                <p>Download each segment (or the combined file) before it expires from temporary storage.</p>
              </li>
            </ol>
          </div>
        </div>
        <div className="hero-badges">
          <span className="hero-badge">⚡ Instant</span>
          <span className="hero-badge">🔒 Secure</span>
          <span className="hero-badge">🗑️ Auto-deleted</span>
        </div>
      </div>}
      {status !== 'done' && (
        <>
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
                <p className="drop-text hero-tagline">Drag &amp; drop your PDF here</p>
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
                <button className="remove-btn" onClick={handleReset} title="Remove file">✕</button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12, alignItems: 'center' }}>
            <label className="hero-tagline" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>Page Ranges:
              <input
                aria-label="Page Ranges"
                placeholder="e.g. 1,3-5,7-10"
                value={segments}
                onChange={e => setSegments(e.target.value)}
                className="segments-input"
                style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db' }}
              />
            </label>

            <div className="hero-tagline" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                Output to file(s):
              </label>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="radio" name="output" checked={outputOption === 'ONE'} onChange={() => setOutputOption('ONE')} /> Single
              </label>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="radio" name="output" checked={outputOption === 'MULTIPLE'} onChange={() => setOutputOption('MULTIPLE')} /> Multiple
              </label>
            </div>
          </div>

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary compress-btn" onClick={handleSplit} disabled={!file || !segments || status !== 'idle'}>Split PDF</button>
          </div>

          {status === 'splitting' && (
            <div className="progress-section" style={{ marginTop: 12 }}>
              <div className="progress-label">Splitting PDF…</div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            </div>
          )}
        </>
      )}

      {status === 'done' && (
        <div className="result-section">
          <div className="result-icon">✅</div>
          <h2 className="result-title">Split Complete</h2>
          <div className="split-results">
            <div className="split-row">
              <span className="split-col-label">Segment</span>
              <span className="split-col-label">Download</span>
            </div>
            <div className="split-row--spacer" />
            {results.map(r => (
              <div key={r.splitKey} className="split-row split-row--data">
                <span className="split-col-value">{r.segment}</span>
                <button
                  className="btn btn-primary split-download-btn"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    const a = document.createElement('a')
                    a.href = r.url
                    a.download = `Segments: ${r.segment}.pdf`
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                  }}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" onClick={handleReset}>Split Another File</button>
        </div>
      )}



      {/* Splitter guide - green/teal design */}
      <section className="splitter-guide" style={{ marginTop: 28 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: 18, background: 'linear-gradient(180deg,#f4fdf7,#ffffff)', borderRadius: 10, border: '1px solid #c8ebd5', color: '#111' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: '0 0 60px', fontSize: 34, lineHeight: 1 }}>✂️</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>How to Split PDF Files Efficiently (Take Control of Large Documents)</h2>
              <p style={{ marginTop: 8 }}>Big PDF files can be overwhelming — dozens of pages, mixed content you don't need, sections that should really be separate. Instead of working with the entire file, you can split it into smaller, focused documents.</p>
              <p style={{ marginTop: 6, fontWeight: 700 }}>👉 In this guide, you'll learn how to break PDFs into exactly what you need — quickly and cleanly.</p>

              <br />
              <h3 style={{ marginTop: 12 }}>📄 What Is a PDF Splitter?</h3>
              <p>A PDF splitter is a tool that lets you:</p>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>✂️ Extract specific pages</li>
                <li>📑 Separate a large file into multiple PDFs</li>
                <li>🎯 Keep only the content you need</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>🧠 Why Splitting PDFs Is Useful</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li><strong>🎯 Focus on Relevant Content</strong> — keep only the pages you need instead of scrolling through everything.</li>
                <li><strong>📤 Share Specific Sections</strong> — no need to send a 50-page document when only 3 pages matter.</li>
                <li><strong>⚡ Improve Workflow Efficiency</strong> — smaller files are faster to open, easier to manage, and quicker to upload.</li>
                <li><strong>📂 Better Organization</strong> — turn one large file into multiple categorized documents.</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>🛠 Common Use Cases</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>💼 <strong>Business Documents</strong> — extract contracts, invoices, reports</li>
                <li>🎓 <strong>Academic Work</strong> — separate chapters or submit only required pages</li>
                <li>📑 <strong>Legal or Official Files</strong> — isolate important pages, keep records organized</li>
                <li>🧾 <strong>Scanned Documents</strong> — split scanned pages into individual files</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>🔍 Ways to Split a PDF</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>📌 <strong>By Page Range</strong> — e.g. Pages 1–5 → File A, Pages 6–10 → File B</li>
                <li>📌 <strong>Extract Specific Pages</strong> — pick exact pages (Page 2, 5, 9 → new file)</li>
                <li>📌 <strong>Split Every Page</strong> — turn one PDF into multiple single-page files</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>🪜 Step-by-Step: How to Split a PDF</h3>
              <ol style={{ marginLeft: 16 }}>
                <li>📤 Upload your PDF</li>
                <li>👀 Preview pages</li>
                <li>✂️ Select pages or ranges</li>
                <li>⚙️ Choose split method</li>
                <li>📥 Download results</li>
              </ol>

              <br />
              <h3 style={{ marginTop: 10 }}>🎯 Best Practices for Splitting PDFs</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>✅ <strong>Plan before splitting</strong> — know what pages you need and how you want them grouped.</li>
                <li>✅ <strong>Keep file names clear</strong> — name files logically (e.g., "Chapter1.pdf").</li>
                <li>✅ <strong>Avoid over-splitting</strong> — too many small files can become hard to manage.</li>
                <li>✅ <strong>Check output files</strong> — verify correct pages and proper order.</li>
                <li>✅ <strong>Keep the original file</strong> — in case you need additional pages later.</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>⚠️ Common Mistakes to Avoid</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>❌ Selecting wrong page range</li>
                <li>❌ Losing important pages</li>
                <li>❌ Creating too many tiny files</li>
                <li>❌ Not reviewing final output</li>
                <li>❌ Overwriting original file</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>⚖️ PDF Splitter vs PDF Merger</h3>
              <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #c8ebd5' }}>
                    <th style={{ textAlign: 'left', padding: 6 }}>Feature</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>PDF Splitter</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>PDF Merger</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #edf7f1' }}>Purpose</td><td style={{ padding: 6, borderBottom: '1px solid #edf7f1' }}>Break file apart</td><td style={{ padding: 6, borderBottom: '1px solid #edf7f1' }}>Combine files</td></tr>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #edf7f1' }}>Output</td><td style={{ padding: 6, borderBottom: '1px solid #edf7f1' }}>Multiple PDFs</td><td style={{ padding: 6, borderBottom: '1px solid #edf7f1' }}>Single PDF</td></tr>
                  <tr><td style={{ padding: 6 }}>Use case</td><td style={{ padding: 6 }}>Extraction</td><td style={{ padding: 6 }}>Organization</td></tr>
                </tbody>
              </table>
              <p style={{ marginTop: 6 }}>Opposite tools — often used together.</p>
              </div>

              <br />
              <h3 style={{ marginTop: 10 }}>🚀 Pro Tips for Better Workflow</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>🔢 Use page numbers as reference</li>
                <li>🗂 Organize files immediately after splitting</li>
                <li>⚡ Split once instead of repeatedly</li>
                <li>📌 Combine with merging for full control</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>🔐 Is It Safe to Split PDFs Online?</h3>
              <p>Most modern tools process files temporarily and remove them after download. Still, avoid uploading sensitive documents unless you trust the tool.</p>

              <br />
              <h3 style={{ marginTop: 10 }}>❓ FAQ</h3>
              <p><strong>Can I split a PDF without losing quality?</strong> Yes — splitting does not affect content quality.</p>
              <p><strong>Can I extract just one page?</strong> Absolutely — you can extract any page individually.</p>
              <p><strong>Is there a limit to file size?</strong> Depends on the tool, but most support reasonably large files.</p>
              <p><strong>Can I undo splitting?</strong> No — but you can merge files back together if needed.</p>

              <br />
              <h3 style={{ marginTop: 10 }}>🧾 Conclusion</h3>
              <p>Splitting PDFs gives you control over your documents. Instead of dealing with large, cluttered files, you can extract only what matters, organize content efficiently, and work faster and smarter.</p>

              <p style={{ marginTop: 12 }}>
                <a
                  className="btn btn-primary"
                  href="/pdf-splitter"
                  onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/pdf-splitter') }}
                >👉 Start splitting your PDF here</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
