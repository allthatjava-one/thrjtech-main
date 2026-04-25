import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import CustomSelect from '../../commons/CustomSelect'
import JSZip from 'jszip'
import './Watermarker.css'
import { useTranslation } from 'react-i18next'

export function WatermarkerView({
  mainImages,
  currentIndex,
  setCurrentIndex,
  watermarkType,
  setWatermarkType,
  watermarkText,
  setWatermarkText,
  logoFile,
  setLogoFile,
  repeated,
  setRepeated,
  position,
  setPosition,
  opacity,
  setOpacity,
  outputUrls,
  outputNames,
  status,
  errorMsg,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleLogoInput,
  handleWatermark,
  handleWatermarkAll,
  handleClear,
}) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [openPanel, setOpenPanel] = useState('')
  const logoInputRef = useRef(null)
  const navigate = useNavigate();
  const { t } = useTranslation('imageWatermarker')

  // Auto-open popup once the watermarked result is ready for the current index
  useEffect(() => {
    if (outputUrls && outputUrls[currentIndex]) setPreviewOpen(true)
  }, [outputUrls, currentIndex])
  return (
    <div className="watermarker-view">
      <h2 className="hero-title">{t('hero.title')}</h2>
      <p className="hero-tagline">{t('hero.tagline')} <Link to="/blogs/image-watermark-guide">{t('hero.blogLink')}</Link></p>
      
      <div className="ir-tip-banner">
        <span className="ir-tip-text">{t('hint.text')}</span>
        <button className="ir-tip-btn" onClick={() => navigate('/image-resizer')}>
          {t('hint.btn')}
        </button>
      </div>


      <div className="details-row" data-open={openPanel}>
        <div className="details-controls">
          <button
            className={`tab-btn ${openPanel === 'details' ? 'active' : ''}`}
            onClick={() => setOpenPanel(prev => (prev === 'details' ? '' : 'details'))}
            aria-expanded={openPanel === 'details'}
            type="button"
          >
            {t('tabs.details')}
          </button>
          <button
            className={`tab-btn ${openPanel === 'howitworks' ? 'active' : ''}`}
            onClick={() => setOpenPanel(prev => (prev === 'howitworks' ? '' : 'howitworks'))}
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

                <h3>{t('details.howWorks.heading')}</h3>
                <p>{t('details.howWorks.body')}</p>

                <h3>{t('details.choosing.heading')}</h3>
                <ul>
                  <li>{t('details.choosing.item1')}</li>
                  <li>{t('details.choosing.item2')}</li>
                  <li>{t('details.choosing.item3')}</li>
                </ul>

                <h3>{t('details.practical.heading')}</h3>
                <ul>
                  <li>{t('details.practical.item1')}</li>
                  <li>{t('details.practical.item2')}</li>
                  <li>{t('details.practical.item3')}</li>
                </ul>

                <h3>{t('details.usefulWhen.heading')}</h3>
                <ul>
                  <li>{t('details.usefulWhen.item1')}</li>
                  <li>{t('details.usefulWhen.item2')}</li>
                  <li>{t('details.usefulWhen.item3')}</li>
                </ul>

                <h3>{t('details.privacy.heading')}</h3>
                <p>{t('details.privacy.body')}</p>

                <h3>{t('details.faq.heading')}</h3>
                <ul>
                  <li><strong>{t('details.faq.q1')}</strong> {t('details.faq.a1')}</li>
                  <li><strong>{t('details.faq.q2')}</strong> {t('details.faq.a2')}</li>
                  <li><strong>{t('details.faq.q3')}</strong> {t('details.faq.a3')}</li>
                  <li><strong>{t('details.faq.q4')}</strong> {t('details.faq.a4')}</li>
                  <li><strong>{t('details.faq.q5')}</strong> {t('details.faq.a5')}</li>
                </ul>
              </div>

            <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
                <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/watermarker/watermarker001.png" alt="Step 1" className="how-img" />
                        <p>{t('howItWorks.step1')}</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/watermarker/watermarker002.png" alt="Step 2" className="how-img" />
                        <p>{t('howItWorks.step2')}</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/watermarker/watermarker003.png" alt="Step 3" className="how-img" />
                        <p>{t('howItWorks.step3')}</p>
                  </li>
                  <li>
                    <img src="/screenshots/watermarker/watermarker004.png" alt="Step 4" className="how-img" />
                        <p>{t('howItWorks.step4')}</p>
                  </li>
                  <li>
                    <img src="/screenshots/watermarker/watermarker005.png" alt="Step 5" className="how-img" />
                        <p>{t('howItWorks.step5')}</p>
                  </li>
                </ol>
              </div>
          </div>
      </div>
      <div
        className={`drop-zone${isDragging ? ' dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        {mainImages && mainImages.length ? (
          (() => {
            const displayCount = Math.min(8, mainImages.length)
            const spacing = 22
            const thumbW = 200
            const containerW = (displayCount - 1) * spacing + thumbW + 8
            return (
              <div className="overlap-stack" onClick={e => { e.stopPropagation(); setPreviewOpen(true) }} style={{ width: containerW }}>
                {mainImages.slice(0, displayCount).map((f, i) => {
                  const left = i * spacing - ((displayCount - 1) * spacing) / 2 + (containerW / 2 - thumbW / 2)
                  return (
                    <img
                      key={i}
                      src={URL.createObjectURL(f)}
                      alt={`upload-${i}`}
                      className="stacked-thumb clickable"
                      style={{ left: `${left}px`, zIndex: 1 + i }}
                      onClick={(ev) => { ev.stopPropagation(); setCurrentIndex(i); setPreviewOpen(true) }}
                    />
                  )
                })}
                {mainImages.length > 8 && (
                  <div className="stack-more" style={{ left: `${(displayCount * spacing - ((displayCount - 1) * spacing) / 2 + (containerW / 2 - thumbW / 2))}px` }}>+{mainImages.length - 8}</div>
                )}
              </div>
            )
          })()
        ) : (
          <span className="hero-tagline">{t('dropZone.text')}</span>
        )}
        <input
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileInput}
        />
      </div>

      {/* File row */}
      {mainImages && mainImages.length > 0 && (
        <div className="wm-file-row">
          <span className="wm-file-name">
            {mainImages.length === 1 ? mainImages[0].name : t('fileRow.count', {count: mainImages.length})}
          </span>
          <button
            type="button"
            className="wm-change-btn"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            {mainImages.length === 1 ? t('fileRow.changeOne') : t('fileRow.changeMany')}
          </button>
          <button type="button" className="wm-clear-btn" onClick={handleClear}>
            {t('fileRow.clear')}
          </button>
        </div>
      )}

      {/* Preview popup dialog */}
      {previewOpen && (outputUrls && outputUrls.length > 0 && outputUrls[currentIndex]) && (
        <div className="image-popup-overlay" onClick={() => setPreviewOpen(false)}>
          <div
            className="image-popup-dialog"
            onClick={e => e.stopPropagation()}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img
              src={outputUrls[currentIndex]}
              alt={`Watermarked preview ${currentIndex + 1}`}
              className="image-popup-img"
              style={{
                position: 'static',
                top: 'unset',
                left: 'unset',
                transform: 'none',
                maxWidth: '100%',
                maxHeight: 'calc(93vh - 6rem)',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
            <button
              className="watermark-btn popup-nav-btn popup-nav-prev"
              onClick={() => setCurrentIndex(idx => Math.max(0, idx - 1))}
              disabled={currentIndex === 0}
            >
              {t('popup.prev')}
            </button>
            <button
              className="watermark-btn popup-nav-btn popup-nav-next"
              onClick={() => setCurrentIndex(idx => Math.min((mainImages.length || 1) - 1, idx + 1))}
              disabled={currentIndex >= ((mainImages.length || 1) - 1)}
            >
              {t('popup.next')}
            </button>
          </div>
          <button className="close-popup-btn" onClick={() => setPreviewOpen(false)}>{t('popup.close')}</button>
        </div>
      )}
      <div className="watermark-options">
        <label>{t('type.label')}</label>
        <label>
          <input
            type="radio"
            name="watermarkType"
            value="text"
            checked={watermarkType === 'text'}
            onChange={() => setWatermarkType('text')}
          />
          {t('type.text')}
        </label>
        <label>
          <input
            type="radio"
            name="watermarkType"
            value="logo"
            checked={watermarkType === 'logo'}
            onChange={() => setWatermarkType('logo')}
          />
          {t('type.logo')}
        </label>
      </div>
      {watermarkType === 'text' && (
        <input
          type="text"
          className="watermark-input"
          placeholder={t('textInput.placeholder')}
          value={watermarkText}
          onChange={e => setWatermarkText(e.target.value)}
          style={!watermarkText ? { borderColor: '#ef4444' } : undefined}
        />
      )}
      {watermarkType === 'logo' && (
        <div className="watermark-input" style={{ display: 'flex', alignItems: 'center', gap: 12, ...(!logoFile ? { borderColor: '#ef4444' } : {}) }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => logoInputRef.current && logoInputRef.current.click()}
          >
            {t('logoBtn')}
          </button>
          <input
            id="logo-input"
            ref={logoInputRef}
            type="file"
            accept="image/*,.heic,.heif"
            style={{ display: 'none' }}
            onChange={handleLogoInput}
          />
          {logoFile && (
            <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>{logoFile.name}</span>
          )}
        </div>
      )}

      <div className="watermark-options">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ marginRight: 6, fontSize: '0.95rem' }}>{t('position.label')} </span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CustomSelect
              value={position}
              onChange={(v) => {
                setPosition(v)
                if (v !== 'default' && repeated) {
                  setRepeated(false)
                }
              }}
              options={[
                { value: 'default', label: t('position.default') },
                { value: 'center', label: t('position.center') },
                { value: 'top-left', label: t('position.topLeft') },
                { value: 'top-right', label: t('position.topRight') },
                { value: 'bottom-left', label: t('position.bottomLeft') },
                { value: 'bottom-right', label: t('position.bottomRight') },
              ]}
            />
          </div>
        </label>

        <label className="repeated-label" style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: 6, cursor: position === 'default' ? 'pointer' : 'not-allowed' }}>
          <input
            type="checkbox"
            checked={repeated}
            onChange={e => setRepeated(e.target.checked)}
            disabled={position !== 'default'}
          />
          {t('repeated')}
        </label>
      </div>

      <div className="opacity-row">
        <label htmlFor="watermark-opacity" style={{ fontSize: '0.95rem', whiteSpace: 'nowrap' }}>{t('opacity')}</label>
        <input
          id="watermark-opacity"
          type="range"
          min="0.05"
          max="1"
          step="0.05"
          value={opacity}
          onChange={e => setOpacity(parseFloat(e.target.value))}
          className="opacity-slider"
          style={{ background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${opacity * 100}%, #e2e6f0 ${opacity * 100}%, #e2e6f0 100%)` }}
          aria-label="Watermark opacity"
        />
        <span className="opacity-value">{Math.round(opacity * 100)}%</span>
      </div>

      <div className="watermark-actions">
        <button
          className="watermark-btn"
          onClick={handleWatermarkAll}
          disabled={status === 'processing' || !mainImages.length || (watermarkType === 'logo' && !logoFile) || (watermarkType === 'text' && !watermarkText)}
          style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)' }}
        >
          {status === 'processing' ? t('processingBtn') : t('applyBtn', {count: mainImages.length || 0})}
        </button>
        {mainImages.length <= 1 && (outputUrls && outputUrls[currentIndex]) && (
          <button
            className="watermark-btn watermark-btn--download"
            onClick={() => {
              const a = document.createElement('a')
              a.href = outputUrls[currentIndex]
              a.download = outputNames[currentIndex] || `watermarked-${currentIndex + 1}.jpg`
              a.click()
            }}
          >
            {t('downloadBtn')}
          </button>
        )}
        {mainImages.length > 1 && (outputUrls && outputUrls.some(Boolean)) && (
            <button
              className="watermark-btn watermark-btn--download"
              onClick={async () => {
                try {
                  const zip = new JSZip()
                  const entries = outputUrls.map((u, i) => ({ url: u, name: outputNames[i] || `watermarked-${i + 1}.jpg` }))
                    .filter(e => e.url)

                  const fetchBlobs = entries.map(async (e) => {
                    // support both object URLs and network URLs
                    const res = await fetch(e.url)
                    const blob = await res.blob()
                    zip.file(e.name, blob)
                  })

                  await Promise.all(fetchBlobs)
                  const zipBlob = await zip.generateAsync({ type: 'blob' })
                  const a = document.createElement('a')
                  const zurl = URL.createObjectURL(zipBlob)
                  a.href = zurl
                  a.download = 'watermarked-images.zip'
                  a.click()
                  setTimeout(() => URL.revokeObjectURL(zurl), 5000)
                } catch (err) {
                  console.error('Failed to create zip:', err)
                }
              }}
              style={{ marginLeft: 8 }}
            >
            {t('downloadAllBtn')}
            </button>
          )}
      </div>
      {errorMsg && <div className="error-msg">{errorMsg}</div>}

      {/* ── Watermarker Guide Section ── */}
      <div className="wm-guide">
        <div className="wm-guide-intro">
          <h2 className="wm-guide-title">{t('guide.title')}</h2>
          <p className="wm-guide-lead">{t('guide.lead')}</p>
        </div>

        <div className="wm-guide-section">
          <h3 className="wm-guide-h3">{t('guide.whatIs.heading')}</h3>
          <p>{t('guide.whatIs.body')}</p>
        </div>

        <div className="wm-guide-section wm-guide-why">
          <h3 className="wm-guide-h3">{t('guide.why.heading')}</h3>
          <ol className="wm-guide-list">
            <li>{t('guide.why.item1')}</li>
            <li>{t('guide.why.item2')}</li>
            <li>{t('guide.why.item3')}</li>
            <li>{t('guide.why.item4')}</li>
          </ol>
        </div>

        <div className="wm-guide-section">
          <h3 className="wm-guide-h3">{t('guide.types.heading')}</h3>
          <div className="wm-guide-types">
            <div className="wm-type">
              🔤
              <div className="wm-type-body">
                <p>{t('guide.types.text').replace(/^🔤\s*/, '')}</p>
              </div>
            </div>
            <div className="wm-type">
              🖼
              <div className="wm-type-body">
                <p>{t('guide.types.logo').replace(/^🖼\s*/, '')}</p>
              </div>
            </div>
            <div className="wm-type">
              🔁
              <div className="wm-type-body">
                <p>{t('guide.types.repeated').replace(/^🔁\s*/, '')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="wm-guide-section">
          <h3 className="wm-guide-h3">{t('guide.bestPractices.heading')}</h3>
          <ul className="wm-guide-best">
            <li>{t('guide.bestPractices.item1')}</li>
            <li>{t('guide.bestPractices.item2')}</li>
            <li>{t('guide.bestPractices.item3')}</li>
            <li>{t('guide.bestPractices.item4')}</li>
            <li>{t('guide.bestPractices.item5')}</li>
          </ul>
        </div>

        <div className="wm-guide-section">
          <h3 className="wm-guide-h3">{t('guide.stepByStep.heading')}</h3>
          <ol className="wm-guide-steps">
            <li>{t('guide.stepByStep.step1')}</li>
            <li>{t('guide.stepByStep.step2')}</li>
            <li>{t('guide.stepByStep.step3')}</li>
            <li>{t('guide.stepByStep.step4')}</li>
            <li>{t('guide.stepByStep.step5')}</li>
          </ol>
        </div>

        <div className="wm-guide-section wm-guide-faq">
          <h3 className="wm-guide-h3">{t('guide.faq.heading')}</h3>
          <details className="wm-faq-item"><summary>{t('guide.faq.q1')}</summary><p>{t('guide.faq.a1')}</p></details>
          <details className="wm-faq-item"><summary>{t('guide.faq.q2')}</summary><p>{t('guide.faq.a2')}</p></details>
          <details className="wm-faq-item"><summary>{t('guide.faq.q3')}</summary><p>{t('guide.faq.a3')}</p></details>
          <details className="wm-faq-item"><summary>{t('guide.faq.q4')}</summary><p>{t('guide.faq.a4')}</p></details>
        </div>

        <div className="wm-guide-conclusion">
          <h3>{t('guide.conclusionTitle', { defaultValue: 'Conclusion' })}</h3>
          <p>{t('guide.conclusion')}</p>
          <a href="/image-watermarker" className="wm-guide-cta" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/image-watermarker'); }}>{t('guide.ctaBtn')}</a>
        </div>
      </div>
    </div>
  )
}
