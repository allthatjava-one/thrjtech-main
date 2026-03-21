import { formatSize } from './utils/formatSize'

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
  return (
    <>
          {status !== 'done' && (
            <>
              <div className="hero-section">
                <h1 className="hero-title">Drop and Go.</h1>
                <p className="hero-tagline">
                  Your PDF will be compressed in no time — privately and securely.
                </p>
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
