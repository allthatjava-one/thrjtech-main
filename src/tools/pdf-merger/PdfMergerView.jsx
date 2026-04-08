import { formatSize } from './utils/formatSize'
import { useState } from 'react'

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
  return (
    <>
      {status !== 'done' && (
        <>
          <div className="hero-section">
            <h1 className="hero-title">PDF Merger</h1>
            <p className="hero-tagline">
              Drop and Merge - Combine multiple PDF files into a single document in seconds. Upload your files, drag to reorder them, then merge and download the result.
            </p>
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

          {(status === 'uploading' || status === 'merging') && (
            <div className="progress-section">
              <div className="progress-label">
                {status === 'uploading' ? 'Uploading files to R2 storage...' : 'Merging PDFs...'}
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

      <div className="note">
        <span className="note-icon">⚠️</span>
        Note: The merged file will be stored in Cloudflare R2 storage for 30 min. Please
        download it within this period. After 30 min, the file will be automatically deleted.
      </div>
    </>
  )
}
