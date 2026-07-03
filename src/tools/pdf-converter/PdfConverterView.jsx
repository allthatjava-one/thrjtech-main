import { Link, useNavigate } from 'react-router-dom'
import { formatSize } from '../pdf-compressor/utils/formatSize'
import { useState } from 'react'
import CustomSelect from '../../commons/CustomSelect'
import { useTranslation } from 'react-i18next'

export function PdfConverterView({
  file,
  status,
  progress,
  originalSize,
  downloadUrl,
  downloadName,
  errorMsg,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleConvert,
  convertType,
  setConvertType,
  handleReset,
}) {
  const { t } = useTranslation('pdfConverter')
  const [openPanel, setOpenPanel] = useState('')
  const navigate = useNavigate()

  const togglePanel = (panel) => {
    setOpenPanel((prev) => (prev === panel ? '' : panel))
  }

  return (
    <>
      {status !== 'done' && (
        <>
          <div className="hero-section">
            <h1 className="hero-title">{t('hero.title')}</h1>
            <p className="hero-tagline">
              {t('hero.tagline')} <Link to="/blogs/pdf-converter-guide">{t('hero.blogLink')}</Link>
            </p>

            <div className="hint-banner">
              <span className="hint-banner-icon">🖼️</span>
              <span className="hint-banner-text">{t('hint.text')}</span>
              <Link to="/image-converter" className="hint-banner-btn">{t('hint.btn')}</Link>
            </div>

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

                    <h3>{t('details.whenToConvert.heading')}</h3>
                    <p>{t('details.whenToConvert.body')}</p>

                    <h3>{t('details.howBehaves.heading')}</h3>
                    <p>{t('details.howBehaves.body')}</p>

                    <h3>{t('details.quality.heading')}</h3>
                    <ul>
                      <li>{t('details.quality.resolution')}</li>
                      <li>{t('details.quality.format')}</li>
                      <li>{t('details.quality.processing')}</li>
                    </ul>

                    <h4>{t('details.benefits.heading')}</h4>
                    <ul>
                      <li>{t('details.benefits.item1')}</li>
                      <li>{t('details.benefits.item2')}</li>
                      <li>{t('details.benefits.item3')}</li>
                    </ul>

                    <h3>{t('details.privacy.heading')}</h3>
                    <p>{t('details.privacy.body')}</p>

                    <h3>{t('details.practical.heading')}</h3>
                    <ul>
                      <li>{t('details.practical.item1')}</li>
                      <li>{t('details.practical.item2')}</li>
                      <li>{t('details.practical.item3')}</li>
                    </ul>

                    <h4>{t('details.usefulWhen.heading')}</h4>
                    <ul>
                      <li>{t('details.usefulWhen.item1')}</li>
                      <li>{t('details.usefulWhen.item2')}</li>
                      <li>{t('details.usefulWhen.item3')}</li>
                    </ul>

                    <h4>{t('details.faq.heading')}</h4>
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
                        <img src="/screenshots/converter/PDF-converter001.png" alt="Upload PDF" className="how-img" />
                        <p>{t('howItWorks.step1')}</p>
                      </li>

                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/screenshots/converter/PDF-converter002.png" alt="Choose format" className="how-img" />
                        <p>{t('howItWorks.step2')}</p>
                      </li>

                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/screenshots/converter/PDF-converter003.png" alt="Start conversion" className="how-img" />
                        <p>{t('howItWorks.step3')}</p>
                      </li>

                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/screenshots/converter/PDF-converter004.png" alt="Preview and download" className="how-img" />
                        <p>{t('howItWorks.step4')}</p>
                      </li>
                    </ol>
                  </div>
            </div>
            </div>

            <div className="hero-badges">
              <span className="hero-badge">{t('badges.instant')}</span>
              <span className="hero-badge">{t('badges.secure')}</span>
              <span className="hero-badge">{t('badges.autoDeleted')}</span>
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
                <p className="drop-text">{t('dropZone.text')}</p>
                <p className="drop-sub">{t('dropZone.or')}</p>
                <span className="btn btn-outline">{t('dropZone.browse')}</span>
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
                  title={t('dropZone.removeTitle')}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="convert-controls">
            <label className="convert-label">{t('convertTo')}</label>
            <div className="convert-select-wrap">
              <CustomSelect
                value={convertType}
                onChange={setConvertType}
                options={[{ value: 'jpg', label: 'JPG' }, { value: 'png', label: 'PNG' }]}
              />
            </div>
          </div>

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          {file && status === 'idle' && (
            <button className="btn btn-primary compress-btn" onClick={handleConvert}>
              {t('convertBtn', {type: convertType.toUpperCase()})}
            </button>
          )}

          {(status === 'uploading' || status === 'converting') && (
            <div className="progress-section">
              <div className="progress-label">
                {status === 'uploading' ? t('progress.uploading') : t('progress.converting')}
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
          <div className="result-icon">{t('result.icon')}</div>
          <h2 className="result-title">{t('result.title')}</h2>

          <div className="size-comparison">
            <div className="size-row">
              <span className="size-col-label">{t('result.originalLabel')}</span>
              <span className="size-col-label">{t('result.sizeLabel')}</span>
            </div>
            <div className="size-row size-row--data">
              <span className="size-col-value">{file.name}</span>
              <span className="size-col-value">{formatSize(originalSize)}</span>
            </div>
          </div>

          <a
            className="btn btn-primary"
            href={downloadUrl}
            download={downloadName}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('result.download')}
          </a>

          <button className="btn btn-ghost" onClick={handleReset}>
            {t('result.another')}
          </button>
        </div>
      )}

      <div className="note">
        <span className="note-icon">⚠️</span>
          {t('note')}
      </div>

      {/* Converter guide — card-grid layout, distinct from other PDF tools' single-column article */}
      <section className="converter-guide">
        <div className="converter-guide-header">
          <span className="converter-guide-header-icon">🔄</span>
          <div>
            <h2>{t('guide.title')}</h2>
            <p>{t('guide.intro')}</p>
            <p className="converter-guide-cta-line">{t('guide.cta')}</p>
          </div>
        </div>

        <div className="converter-guide-grid">
          <div className="converter-guide-card">
            <h3>{t('guide.whatIs.heading')}</h3>
            <p>{t('guide.whatIs.body')}</p>
            <ul>
              <li>{t('guide.whatIs.item1')}</li>
              <li>{t('guide.whatIs.item2')}</li>
              <li>{t('guide.whatIs.item3')}</li>
            </ul>
            <p className="converter-guide-note">{t('guide.whatIs.note')}</p>
          </div>

          <div className="converter-guide-card">
            <h3>{t('guide.whyConvert.heading')}</h3>
            <ul>
              <li>{t('guide.whyConvert.item1')}</li>
              <li>{t('guide.whyConvert.item2')}</li>
              <li>{t('guide.whyConvert.item3')}</li>
              <li>{t('guide.whyConvert.item4')}</li>
            </ul>
          </div>

          <div className="converter-guide-card">
            <h3>{t('guide.howWorks.heading')}</h3>
            <p>{t('guide.howWorks.body')}</p>
          </div>

          <div className="converter-guide-card">
            <h3>{t('guide.whyBreaks.heading')}</h3>
            <p>{t('guide.whyBreaks.body')}</p>
          </div>

          <div className="converter-guide-card">
            <h3>{t('guide.bestPractices.heading')}</h3>
            <ul>
              <li>{t('guide.bestPractices.item1')}</li>
              <li>{t('guide.bestPractices.item2')}</li>
              <li>{t('guide.bestPractices.item3')}</li>
              <li>{t('guide.bestPractices.item4')}</li>
              <li>{t('guide.bestPractices.item5')}</li>
            </ul>
          </div>

          <div className="converter-guide-card">
            <h3>{t('guide.scenarios.heading')}</h3>
            <ul>
              <li>{t('guide.scenarios.item1')}</li>
              <li>{t('guide.scenarios.item2')}</li>
              <li>{t('guide.scenarios.item3')}</li>
              <li>{t('guide.scenarios.item4')}</li>
            </ul>
          </div>

          <div className="converter-guide-card">
            <h3>{t('guide.mistakes.heading')}</h3>
            <ul>
              <li>{t('guide.mistakes.item1')}</li>
              <li>{t('guide.mistakes.item2')}</li>
              <li>{t('guide.mistakes.item3')}</li>
              <li>{t('guide.mistakes.item4')}</li>
              <li>{t('guide.mistakes.item5')}</li>
            </ul>
          </div>

          <div className="converter-guide-card">
            <h3>{t('guide.proTips.heading')}</h3>
            <ul>
              <li>{t('guide.proTips.item1')}</li>
              <li>{t('guide.proTips.item2')}</li>
              <li>{t('guide.proTips.item3')}</li>
              <li>{t('guide.proTips.item4')}</li>
            </ul>
          </div>

          <div className="converter-guide-card converter-guide-card--wide">
            <h3>{t('guide.stepByStep.heading')}</h3>
            <ol>
              <li>{t('guide.stepByStep.step1')}</li>
              <li>{t('guide.stepByStep.step2')}</li>
              <li>{t('guide.stepByStep.step3')}</li>
              <li>{t('guide.stepByStep.step4')}</li>
            </ol>
            <p className="converter-guide-note">{t('guide.stepByStep.note')}</p>
          </div>

          <div className="converter-guide-card converter-guide-card--wide">
            <h3>{t('guide.comparison.heading')}</h3>
            <table className="converter-guide-table">
              <thead>
                <tr>
                  <th>{t('guide.comparison.col1')}</th>
                  <th>{t('guide.comparison.col2')}</th>
                  <th>{t('guide.comparison.col3')}</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>{t('guide.comparison.row1col1')}</td><td>{t('guide.comparison.row1col2')}</td><td>{t('guide.comparison.row1col3')}</td></tr>
                <tr><td>{t('guide.comparison.row2col1')}</td><td>{t('guide.comparison.row2col2')}</td><td>{t('guide.comparison.row2col3')}</td></tr>
                <tr><td>{t('guide.comparison.row3col1')}</td><td>{t('guide.comparison.row3col2')}</td><td>{t('guide.comparison.row3col3')}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="converter-guide-card converter-guide-card--wide">
            <h3>{t('guide.faq.heading')}</h3>
            <div className="converter-guide-faq-grid">
              <div className="converter-guide-faq-item">
                <strong>{t('guide.faq.q1')}</strong>
                <p>{t('guide.faq.a1')}</p>
              </div>
              <div className="converter-guide-faq-item">
                <strong>{t('guide.faq.q2')}</strong>
                <p>{t('guide.faq.a2')}</p>
              </div>
              <div className="converter-guide-faq-item">
                <strong>{t('guide.faq.q3')}</strong>
                <p>{t('guide.faq.a3')}</p>
              </div>
              <div className="converter-guide-faq-item">
                <strong>{t('guide.faq.q4')}</strong>
                <p>{t('guide.faq.a4')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="converter-guide-footer">
          <p><strong>🧾 {t('guide.conclusionTitle')}</strong><br />{t('guide.conclusion')}</p>
          <a
            className="btn btn-primary"
            href="/pdf-converter"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/pdf-converter') }}
          >{t('guide.ctaBtn')}</a>
        </div>
      </section>
    </>
  )
}
