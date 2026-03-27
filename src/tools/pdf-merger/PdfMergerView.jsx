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
  return (
    <>
      {status !== 'done' && (
        <>
          <div className="hero-section">
            <h1 className="hero-title">Drop and Merge.</h1>
            <p className="hero-tagline">
              Combine multiple PDF files into a single document in seconds. Upload your files, drag to reorder them, then merge and download the result.
            </p>
            <details className="tool-details">
              <summary>Details</summary>
              <div>
                <h3>What it does</h3>
                <p>Merges multiple PDFs into a single document, preserving page order and basic metadata.</p>

                <h3>How it works</h3>
                <p>Uploads are combined on the backend and returned as a single merged file for download.</p>

                <h3>Use cases</h3>
                <p>Combine reports, split contracts into single files, or assemble multi-part documents for distribution.</p>

                <h3>Comparison</h3>
                <p>Simpler and faster than manual desktop merging for ad-hoc tasks; lacks advanced editing features.</p>

                <h3>FAQs</h3>
                <p>Q: Can I reorder pages? A: You can reorder whole files before merging; page-level reordering is not supported.</p>
              </div>
            </details>
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
