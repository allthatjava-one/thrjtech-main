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
  const togglePanel = (panel) => setOpenPanel((prev) => (prev === panel ? '' : panel))
  return (
    <>
      <div className="hero-section">
        <h1 className="hero-title">PDF Splitter</h1>
        <p className="hero-tagline">Just Drop and Go — Extract the pages you need from any PDF by entering simple page ranges (e.g. 1, 3-5, 7-10). Get each range as its own file, or merge them all into one combined PDF. No software needed — upload, split, and download in seconds.</p>
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
                <p>Upload a PDF using drag &amp; drop or the browse button.</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <p>Enter the page ranges you want (e.g. <code>1,3-5,7-10</code>) and choose <strong>Single</strong> or <strong>Multiple</strong> output.</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
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
      </div>
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

          <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }}>
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

          {(status === 'uploading' || status === 'splitting') && (
            <div className="progress-section" style={{ marginTop: 12 }}>
              <div className="progress-label">{status === 'uploading' ? 'Uploading to R2 storage…' : 'Splitting PDF…'}</div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            </div>
          )}
        </>
      )}

      {status === 'done' && (
        <div className="result-section">
          <div className="result-icon">✅</div>
          <h2 className="result-title hero-tagline">Split Complete</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            {results.map(r => (
              <div key={r.splitKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9ff', padding: 8, borderRadius: 8 }}>
                <div style={{ fontWeight: 600, color: '#6b7280' }}>File: {r.segment}</div>
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault()
                    try {
                      const resp = await fetch(r.url)
                      if (!resp.ok) throw new Error('Download failed')
                      const blob = await resp.blob()
                      const objectUrl = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = objectUrl
                      a.download = `Segments: ${r.segment}.pdf`
                      document.body.appendChild(a)
                      a.click()
                      a.remove()
                      URL.revokeObjectURL(objectUrl)
                    } catch (err) {
                      // fallback: open in new tab
                      window.open(r.url, '_blank', 'noopener')
                    }
                  }}
                >
                  Download
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="btn btn-ghost" onClick={handleReset}>Split Another File</button>
          </div>
        </div>
      )}

      <div className="note" style={{ marginTop: 12 }}>
        <span className="note-icon">⚠️</span>
        Files are available for a short time. Please download before they expire.
      </div>
    </>
  )
}
