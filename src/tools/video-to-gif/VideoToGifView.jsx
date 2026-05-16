import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const trimBarRef = useRef(null)
  const playheadRef = useRef(null)
  const rafRef = useRef(null)
  const onTrimMoveRef = useRef(null)
  const videoDurationRef = useRef(videoDuration)
  const [isDragging, setIsDragging] = useState(false)
  const [openPanel, setOpenPanel] = useState('')
  const [startTimeStr, setStartTimeStr] = useState(() => secsToTime(startTime))
  const [endTimeStr, setEndTimeStr] = useState(() => secsToTime(endTime))

  useEffect(() => { videoDurationRef.current = videoDuration }, [videoDuration])
  useEffect(() => { setStartTimeStr(secsToTime(startTime)) }, [startTime])
  useEffect(() => { setEndTimeStr(secsToTime(endTime)) }, [endTime])

  // RAF loop: keep playhead in sync with video currentTime
  useEffect(() => {
    if (!videoUrl) return
    const tick = () => {
      const video = videoRef.current
      const playhead = playheadRef.current
      const dur = videoDurationRef.current
      if (video && playhead && dur > 0) {
        playhead.style.left = `${(video.currentTime / dur) * 100}%`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [videoUrl])

  useEffect(() => {
    return () => {
      if (onTrimMoveRef.current) window.removeEventListener('pointermove', onTrimMoveRef.current)
    }
  }, [])

  const togglePanel = (panel) => setOpenPanel((prev) => (prev === panel ? '' : panel))

  function secsToTime(sec) {
    if (!sec || !isFinite(sec)) return '00:00:00'
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = Math.floor(sec % 60)
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
  }

  function timeToSecs(str) {
    const parts = str.trim().split(':').map(Number)
    if (parts.some(isNaN)) return null
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
    if (parts.length === 2) return parts[0] * 60 + parts[1]
    if (parts.length === 1 && !isNaN(parts[0])) return parts[0]
    return null
  }

  function handleStartTimeBlur() {
    const secs = timeToSecs(startTimeStr)
    if (secs === null) { setStartTimeStr(secsToTime(startTime)); return }
    clampStart(secs)
  }

  function handleEndTimeBlur() {
    const secs = timeToSecs(endTimeStr)
    if (secs === null) { setEndTimeStr(secsToTime(endTime)); return }
    clampEnd(secs)
  }

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
    const v = Math.max(0, Math.min(val, videoDuration - 0.1))
    setStartTime(parseFloat(v.toFixed(1)))
    const newEnd = Math.min(parseFloat((v + 2).toFixed(1)), videoDuration)
    setEndTime(newEnd)
  }

  function clampEnd(val) {
    const v = Math.max(startTime + 0.1, Math.min(val, videoDuration))
    setEndTime(parseFloat(v.toFixed(1)))
  }

  async function handleAddTextOnGif() {
    if (!gifUrl) return
    try {
      const response = await fetch(gifUrl)
      const blob = await response.blob()
      const baseName = (videoFile?.name || 'video')
        .replace(/\.[^/.]+$/, '')
        .trim() || 'video'
      const gifFile = new File([blob], `${baseName}.gif`, { type: 'image/gif', lastModified: Date.now() })
      navigate('/image-meme-generator', { state: { mainImage: gifFile } })
    } catch (err) {
      // If conversion to File fails, stay on page and avoid breaking primary flow.
      console.error('Failed to pass GIF to meme generator:', err)
    }
  }

  function onTrackPointerDown(e) {
    if (isEncoding) return
    // Don't steal clicks that originated on a handle
    if (e.target.closest('.vtg-trim-handle')) return
    e.preventDefault()
    const bar = trimBarRef.current
    if (!bar || !videoDuration || !videoRef.current) return
    const rect = bar.getBoundingClientRect()
    const padding = 8
    const trackLeft = rect.left + padding
    const trackWidth = rect.width - padding * 2
    const ratio = Math.max(0, Math.min(1, (e.clientX - trackLeft) / trackWidth))
    videoRef.current.currentTime = ratio * videoDuration
  }

  function onTrimPointerDown(e, handle) {
    if (isEncoding) return
    e.preventDefault()
    const moveHandler = (moveEvent) => {
      const bar = trimBarRef.current
      if (!bar || !videoDuration) return
      const rect = bar.getBoundingClientRect()
      const padding = 8
      const trackLeft = rect.left + padding
      const trackWidth = rect.width - padding * 2
      const ratio = Math.max(0, Math.min(1, (moveEvent.clientX - trackLeft) / trackWidth))
      const time = ratio * videoDuration
      if (handle === 'start') {
        const v = Math.max(0, Math.min(time, endTime - 0.1))
        setStartTime(parseFloat(v.toFixed(1)))
        if (videoRef.current) videoRef.current.currentTime = v
      } else {
        const v = Math.max(startTime + 0.1, Math.min(time, videoDuration))
        setEndTime(parseFloat(v.toFixed(1)))
        if (videoRef.current) videoRef.current.currentTime = v
      }
    }
    onTrimMoveRef.current = moveHandler
    window.addEventListener('pointermove', moveHandler)
    window.addEventListener('pointerup', () => {
      window.removeEventListener('pointermove', moveHandler)
      onTrimMoveRef.current = null
    }, { once: true })
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
          {/* Video preview */}
          <div className="vtg-video-wrap">
            <video
                ref={videoRef}
                src={videoUrl}
                className="vtg-video-preview"
                controls
                preload="metadata"
                onLoadedMetadata={handleVideoLoaded}
            />
          </div>

          {/* Hidden canvas for frame extraction */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Trim timeline — sits between video and file bar */}
          {videoDuration > 0 && (
            <div className="vtg-trim-bar" ref={trimBarRef} onPointerDown={onTrackPointerDown}>
              <div className="vtg-trim-track">
                <div
                  className="vtg-trim-range"
                  style={{
                    left: `${(startTime / videoDuration) * 100}%`,
                    width: `${((endTime - startTime) / videoDuration) * 100}%`,
                  }}
                />
                {/* Playback position cursor */}
                <div className="vtg-trim-playhead" ref={playheadRef} style={{ left: '0%' }} />
              </div>
              {/* Start handle */}
              <div
                className="vtg-trim-handle vtg-trim-handle--start"
                style={{ left: `${(startTime / videoDuration) * 100}%` }}
                onPointerDown={(e) => onTrimPointerDown(e, 'start')}
                role="slider"
                aria-label="Start time"
                aria-valuenow={startTime}
                aria-valuemin={0}
                aria-valuemax={videoDuration}
                tabIndex={0}
              >
                <span className="vtg-trim-label">{secsToTime(startTime)}</span>
              </div>
              {/* End handle */}
              <div
                className="vtg-trim-handle vtg-trim-handle--end"
                style={{ left: `${(endTime / videoDuration) * 100}%` }}
                onPointerDown={(e) => onTrimPointerDown(e, 'end')}
                role="slider"
                aria-label="End time"
                aria-valuenow={endTime}
                aria-valuemin={0}
                aria-valuemax={videoDuration}
                tabIndex={0}
              >
                <span className="vtg-trim-label">{secsToTime(endTime)}</span>
              </div>
            </div>
          )}

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

          {/* Controls */}
          <div className="vtg-controls">
            <div className="vtg-controls-grid">
              <label className="vtg-label">
                {t('controls.startTime')}
                <div className="vtg-input-row">
                  <input
                    type="text"
                    className="vtg-input"
                    value={startTimeStr}
                    onChange={(e) => setStartTimeStr(e.target.value)}
                    onBlur={handleStartTimeBlur}
                    disabled={isEncoding}
                    placeholder="hh:mm:ss"
                  />
                </div>
              </label>

              <label className="vtg-label">
                {t('controls.endTime')}
                <div className="vtg-input-row">
                  <input
                    type="text"
                    className="vtg-input"
                    value={endTimeStr}
                    onChange={(e) => setEndTimeStr(e.target.value)}
                    onBlur={handleEndTimeBlur}
                    disabled={isEncoding}
                    placeholder="hh:mm:ss"
                  />
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
                <button type="button" className="vtg-btn vtg-btn--ghost vtg-btn--push-right" onClick={handleAddTextOnGif}>
                  {t('output.addTextOnGif')}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* SEO guide section */}
      <section className="vtg-guide">
        <h2>{t('guide.mainTitle')}</h2>
        <p>{t('guide.intro1')}</p>
        <p>{t('guide.intro2')}</p>

        <hr />

        <h2>{t('guide.whyConvertTitle')}</h2>
        <p>{t('guide.whyConvertBody')}</p>

        <h3>{t('guide.commonUseCasesTitle')}</h3>
        <ul>
          <li>{t('guide.commonUseCases.item1')}</li>
          <li>{t('guide.commonUseCases.item2')}</li>
          <li>{t('guide.commonUseCases.item3')}</li>
          <li>{t('guide.commonUseCases.item4')}</li>
          <li>{t('guide.commonUseCases.item5')}</li>
          <li>{t('guide.commonUseCases.item6')}</li>
        </ul>
        
        <hr />

        <h2>{t('guide.featuresTitle')}</h2>
        <h3>{t('guide.feature1.title')}</h3>
        <p>{t('guide.feature1.body')}</p>
        <h4>{t('guide.feature1.benefitsTitle')}</h4>
        <ul>
          <li>{t('guide.feature1.benefit1')}</li>
          <li>{t('guide.feature1.benefit2')}</li>
          <li>{t('guide.feature1.benefit3')}</li>
          <li>{t('guide.feature1.benefit4')}</li>
        </ul>

        <h3>{t('guide.feature2.title')}</h3>
        <p>{t('guide.feature2.lead')}</p>
        <p>{t('guide.feature2.body')}</p>

        <h3>{t('guide.feature3.title')}</h3>
        <p>{t('guide.feature3.body')}</p>

        <h4>{t('guide.recommendedSettings.title')}</h4>
        <div className="vtg-table-wrap">
          <table className="vtg-table">
            <thead>
              <tr>
                <th>{t('guide.recommendedSettings.colUseCase')}</th>
                <th>{t('guide.recommendedSettings.colFps')}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>{t('guide.recommendedSettings.row1UseCase')}</td><td>{t('guide.recommendedSettings.row1Fps')}</td></tr>
              <tr><td>{t('guide.recommendedSettings.row2UseCase')}</td><td>{t('guide.recommendedSettings.row2Fps')}</td></tr>
              <tr><td>{t('guide.recommendedSettings.row3UseCase')}</td><td>{t('guide.recommendedSettings.row3Fps')}</td></tr>
              <tr><td>{t('guide.recommendedSettings.row4UseCase')}</td><td>{t('guide.recommendedSettings.row4Fps')}</td></tr>
            </tbody>
          </table>
        </div>

        <h3>{t('guide.feature4.title')}</h3>
        <p>{t('guide.feature4.body')}</p>

        <h4>{t('guide.widthOptionsTitle')}</h4>
        <ul>
          <li>{t('guide.widthOptions.item1')}</li>
          <li>{t('guide.widthOptions.item2')}</li>
          <li>{t('guide.widthOptions.item3')}</li>
          <li>{t('guide.widthOptions.item4')}</li>
        </ul>

        <hr />

        <h2>{t('guide.howToTitle')}</h2>
        <h3>{t('guide.howTo.step1Title')}</h3>
        <p>{t('guide.howTo.step1Body')}</p>
        <h3>{t('guide.howTo.step2Title')}</h3>
        <p>{t('guide.howTo.step2Body')}</p>
        <h3>{t('guide.howTo.step3Title')}</h3>
        <p>{t('guide.howTo.step3Body')}</p>
        <h3>{t('guide.howTo.step4Title')}</h3>
        <p>{t('guide.howTo.step4Body')}</p>

        <hr />

        <h2>{t('guide.tipsTitle')}</h2>
        <h3>{t('guide.tips.keepShortTitle')}</h3>
        <p>{t('guide.tips.keepShortBody')}</p>
        <h3>{t('guide.tips.reduceFpsTitle')}</h3>
        <p>{t('guide.tips.reduceFpsBody')}</p>
        <h3>{t('guide.tips.cropTitle')}</h3>
        <p>{t('guide.tips.cropBody')}</p>
        <h3>{t('guide.tips.useMp4Title')}</h3>
        <p>{t('guide.tips.useMp4Body1')}</p>
        <p>{t('guide.tips.useMp4Body2')}</p>

        <hr />

        <h2>{t('guide.growthTitle')}</h2>
        <p>{t('guide.growthBody1')}</p>
        <p>{t('guide.growthBody2')}</p>

        <hr />

        <h2>{t('guide.faqTitle')}</h2>
        <h3>{t('guide.faq.q1')}</h3>
        <p>{t('guide.faq.a1')}</p>
        <h3>{t('guide.faq.q2')}</h3>
        <p>{t('guide.faq.a2')}</p>
        <h3>{t('guide.faq.q3')}</h3>
        <p>{t('guide.faq.a3')}</p>
        <h3>{t('guide.faq.q4')}</h3>
        <p>{t('guide.faq.a4')}</p>

        <hr />
        
        <h2>{t('guide.finalTitle')}</h2>
        <p>{t('guide.finalBody1')}</p>
        <p>{t('guide.finalBody2')}</p>
        <p><strong>{t('guide.cta')}</strong></p>
      </section>
    </>
  )
}
