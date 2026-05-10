import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function VideoToGifView({
  videoRef,
  canvasRef,
  videoFile,
  videoUrl,
  videoDuration,
  startTime, setStartTime,
  endTime, setEndTime,
  fps, setFps,
  maxWidth, setMaxWidth,
  progress,
  status,
  gifUrl,
  gifSize,
  error,
  estimatedFrames,
  handleFile,
  handleVideoLoaded,
  convert,
  handleCancel,
  handleClear,
  download,
}) {
  const { t } = useTranslation('videoToGif')
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [openPanel, setOpenPanel] = useState('')

  const togglePanel = (panel) => setOpenPanel((prev) => (prev === panel ? '' : panel))

  function formatSize(bytes) {
    if (bytes == null) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  function formatDuration(sec) {
    if (!sec || !isFinite(sec)) return '0:00'
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleInputChange(e) {
    const file = e.target.files[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function clampStart(val) {
    const v = Math.max(0, Math.min(val, endTime - 0.1))
    setStartTime(parseFloat(v.toFixed(1)))
  }

  function clampEnd(val) {
    const v = Math.max(startTime + 0.1, Math.min(val, videoDuration))
    setEndTime(parseFloat(v.toFixed(1)))
  }

  const highFrameCount = estimatedFrames > 150
  const isEncoding = status === 'encoding'
  const isDone = status === 'done'

  return (
    <>
      {/* Hero */}
      <div className="hero-section">
        <h1 className="hero-title">{t('hero.title')}</h1>
        <p className="hero-tagline">{t('hero.tagline')}</p>

        <div className="details-row" data-open={openPanel}>
          <div className="details-controls">
            <button
              className={`tab-btn ${openPanel === 'details' ? 'active' : ''}`}
              onClick={() => togglePanel('details')}
              aria-expanded={openPanel === 'details'}
              type="button"
            >
              {t('tabs.details')}
            </button>
            <button
              className={`tab-btn ${openPanel === 'howitworks' ? 'active' : ''}`}
              onClick={() => togglePanel('howitworks')}
              aria-expanded={openPanel === 'howitworks'}
              type="button"
            >
              {t('tabs.howItWorks')}
            </button>
          </div>

          <div className={`shared-collapse${!openPanel ? ' panel-hidden' : ''}`}>
            <div className={openPanel !== 'details' ? 'details-content panel-hidden' : 'details-content'}>
              <h3>{t('details.whatIs.heading')}</h3>
              <p>{t('details.whatIs.body')}</p>
              <h3>{t('details.privacy.heading')}</h3>
              <p>{t('details.privacy.body')}</p>
              <h3>{t('details.limitations.heading')}</h3>
              <p>{t('details.limitations.body')}</p>
            </div>
            <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
              <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                <li style={{ marginBottom: '0.75rem' }}><p>{t('howItWorks.step1')}</p></li>
                <li style={{ marginBottom: '0.75rem' }}><p>{t('howItWorks.step2')}</p></li>
                <li style={{ marginBottom: '0.75rem' }}><p>{t('howItWorks.step3')}</p></li>
                <li><p>{t('howItWorks.step4')}</p></li>
              </ol>
            </div>
          </div>
        </div>

        <div className="hero-badges">
          <span className="hero-badge">{t('badges.clientSide')}</span>
          <span className="hero-badge">{t('badges.noUpload')}</span>
          <span className="hero-badge">{t('badges.free')}</span>
        </div>
      </div>

      {/* Drop zone (visible when no video loaded) */}
      {!videoUrl && (
        <div
          className={`vtg-dropzone${isDragging ? ' vtg-dropzone--active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <svg className="vtg-dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          <p className="vtg-dropzone-text">{t('dropzone.prompt')}</p>
          <p className="vtg-dropzone-hint">{t('dropzone.hint')}</p>
          <button type="button" className="vtg-btn vtg-btn--primary vtg-btn--sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
            {t('dropzone.browse')}
          </button>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="video/*" onChange={handleInputChange} style={{ display: 'none' }} />

      {/* Video loaded state */}
      {videoUrl && (
        <>
          {/* Video preview + file bar grouped with no gap between them */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <video
                ref={videoRef}
                src={videoUrl}
                className="vtg-video-preview"
                controls
                preload="metadata"
                onLoadedMetadata={handleVideoLoaded}
            />

            {/* Hidden canvas for frame extraction */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            {/* File info bar */}
            <div className="vtg-file-bar">
                <span className="vtg-file-name">{videoFile?.name || 'Video loaded'}</span>
                <button type="button" className="vtg-btn vtg-btn--ghost vtg-btn--sm" onClick={() => fileInputRef.current?.click()} disabled={isEncoding}>
                {t('actions.changeVideo')}
                </button>
                <button type="button" className="vtg-btn vtg-btn--ghost vtg-btn--sm vtg-btn--danger" onClick={handleClear} disabled={isEncoding}>
                {t('actions.clear')}
                </button>
            </div>
          </div>

          {/* Controls */}
          <div className="vtg-controls">
            <div className="vtg-controls-grid">
              <label className="vtg-label">
                {t('controls.startTime')}
                <div className="vtg-input-row">
                  <input
                    type="number"
                    className="vtg-input"
                    value={startTime}
                    min={0}
                    max={Math.max(0, endTime - 0.1)}
                    step={0.1}
                    onChange={(e) => clampStart(parseFloat(e.target.value) || 0)}
                    disabled={isEncoding}
                  />
                  <span className="vtg-input-suffix">s</span>
                </div>
              </label>

              <label className="vtg-label">
                {t('controls.endTime')}
                <div className="vtg-input-row">
                  <input
                    type="number"
                    className="vtg-input"
                    value={endTime}
                    min={Math.min(videoDuration, startTime + 0.1)}
                    max={videoDuration}
                    step={0.1}
                    onChange={(e) => clampEnd(parseFloat(e.target.value) || 0)}
                    disabled={isEncoding}
                  />
                  <span className="vtg-input-suffix">s</span>
                </div>
              </label>

              <label className="vtg-label">
                {t('controls.fps')}
                <select
                  className="vtg-select"
                  value={fps}
                  onChange={(e) => setFps(parseInt(e.target.value))}
                  disabled={isEncoding}
                >
                  <option value={5}>5 fps</option>
                  <option value={10}>10 fps</option>
                  <option value={15}>15 fps</option>
                  <option value={20}>20 fps</option>
                </select>
              </label>

              <label className="vtg-label">
                {t('controls.maxWidth')}
                <select
                  className="vtg-select"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                  disabled={isEncoding}
                >
                  <option value={240}>240 px</option>
                  <option value={480}>480 px</option>
                  <option value={640}>640 px</option>
                  <option value={720}>720 px</option>
                  <option value={9999}>{t('controls.original')}</option>
                </select>
              </label>
            </div>

            {/* Frame count estimate */}
            <p className={`vtg-estimate${highFrameCount ? ' vtg-estimate--warn' : ''}`}>
              {t('controls.estimatedFrames', { count: estimatedFrames })}
              {highFrameCount && ` — ${t('controls.largeWarning')}`}
            </p>
          </div>

          {error && (
            <div className="vtg-error" role="alert">{error}</div>
          )}

          {/* Convert / Cancel button */}
          {!isEncoding && !isDone && (
            <button
              type="button"
              className="vtg-btn vtg-btn--primary vtg-btn--full"
              onClick={convert}
              disabled={!videoUrl || estimatedFrames === 0}
            >
              {t('actions.convert')}
            </button>
          )}

          {isEncoding && (
            <div className="vtg-progress-wrap">
              <div className="vtg-progress-bar">
                <div className="vtg-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="vtg-progress-label">
                {t('actions.encoding', { progress })}
                <button type="button" className="vtg-btn vtg-btn--ghost vtg-btn--sm" onClick={handleCancel} style={{ marginLeft: '1rem' }}>
                  {t('actions.cancel')}
                </button>
              </div>
            </div>
          )}

          {isDone && gifUrl && (
            <div className="vtg-output">
              <div className="vtg-output-header">
                <span className="vtg-output-title">{t('output.title')}</span>
                {gifSize != null && <span className="vtg-output-size">{formatSize(gifSize)}</span>}
              </div>
              <img src={gifUrl} alt="Generated GIF" className="vtg-gif-preview" />
              <div className="vtg-output-actions">
                <button type="button" className="vtg-btn vtg-btn--primary" onClick={download}>
                  {t('output.download')}
                </button>
                <button type="button" className="vtg-btn vtg-btn--ghost" onClick={() => { setStartTime(startTime); convert() }}>
                  {t('output.reconvert')}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
