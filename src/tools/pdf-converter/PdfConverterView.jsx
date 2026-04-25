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

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: '10px 16px', marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>🖼️</span>
              <span style={{ flex: 1, fontSize: 14, color: '#7c6000' }}>{t('hint.text')}</span>
              <Link
                to="/image-converter"
                style={{ whiteSpace: 'nowrap', background: '#faad14', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
              >{t('hint.btn')}</Link>
            </div>

            <div className="details-controls">
              <button
                className={`tab-btn ${openPanel === 'details' ? 'active' : ''}`}
                onClick={() => togglePanel('details')}
                aria-expanded={openPanel === 'details'}
                type="button"
              >
                {t('tabs.details')}              </button>
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
                <div className={openPanel !== 'details' ? 'tool-details-open panel-hidden' : 'tool-details-open'}>
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

                <div className={openPanel !== 'howitworks' ? 'tool-howitworks-open panel-hidden' : 'tool-howitworks-open'}>
                    <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/images/screenshots/converter/PDF-converter001.png" alt="Upload PDF" className="how-img" />
                        <p>{t('howItWorks.step1')}</p>
                      </li>

                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/images/screenshots/converter/PDF-converter002.png" alt="Choose format" className="how-img" />
                        <p>{t('howItWorks.step2')}</p>
                      </li>

                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/images/screenshots/converter/PDF-converter003.png" alt="Start conversion" className="how-img" />
                        <p>{t('howItWorks.step3')}</p>
                      </li>

                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/images/screenshots/converter/PDF-converter004.png" alt="Preview and download" className="how-img" />
                        <p>{t('howItWorks.step4')}</p>
                      </li>
                    </ol>
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

      {/* Converter guide */}
      <section className="converter-guide" style={{ marginTop: 28 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: 18, background: 'linear-gradient(180deg,#fffdf7,#ffffff)', borderRadius: 10, border: '1px solid #f0e8cc', color: '#111' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: '0 0 60px', fontSize: 34, lineHeight: 1 }}>🔄</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>{t('guide.title')}</h2>
              <p style={{ marginTop: 8 }}>{t('guide.intro')}</p>
              <p style={{ marginTop: 6, fontWeight: 700 }}>{t('guide.cta')}</p>

              <br />
              <h3 style={{ marginTop: 12 }}>{t('guide.whatIs.heading')}</h3>
              <p>{t('guide.whatIs.body')}</p>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li style={{color: '#AAA'}}>{t('guide.whatIs.item1')}</li>
                <li>{t('guide.whatIs.item2')}</li>
                <li style={{color: '#AAA'}}>{t('guide.whatIs.item3')}</li>
              </ul>
              <p style={{ marginTop: 6 }}>{t('guide.whatIs.note')}</p>
              
              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.whyConvert.heading')}</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>{t('guide.whyConvert.item1')}</li>
                <li>{t('guide.whyConvert.item2')}</li>
                <li>{t('guide.whyConvert.item3')}</li>
                <li>{t('guide.whyConvert.item4')}</li>
              </ul>
              
              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.howWorks.heading')}</h3>
              <p>{t('guide.howWorks.body')}</p>
              
              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.whyBreaks.heading')}</h3>
              <p>{t('guide.whyBreaks.body')}</p>
              
              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.bestPractices.heading')}</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>{t('guide.bestPractices.item1')}</li>
                <li>{t('guide.bestPractices.item2')}</li>
                <li>{t('guide.bestPractices.item3')}</li>
                <li>{t('guide.bestPractices.item4')}</li>
                <li>{t('guide.bestPractices.item5')}</li>
              </ul>
              
              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.stepByStep.heading')}</h3>
              <ol style={{ marginLeft: 16 }}>
                <li>{t('guide.stepByStep.step1')}</li>
                <li>{t('guide.stepByStep.step2')}</li>
                <li>{t('guide.stepByStep.step3')}</li>
                <li>{t('guide.stepByStep.step4')}</li>
              </ol>
              <p style={{ marginTop: 6 }}>{t('guide.stepByStep.note')}</p>
              
              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.scenarios.heading')}</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>{t('guide.scenarios.item1')}</li>
                <li>{t('guide.scenarios.item2')}</li>
                <li>{t('guide.scenarios.item3')}</li>
                <li>{t('guide.scenarios.item4')}</li>
              </ul>
              
              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.mistakes.heading')}</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>{t('guide.mistakes.item1')}</li>
                <li>{t('guide.mistakes.item2')}</li>
                <li>{t('guide.mistakes.item3')}</li>
                <li>{t('guide.mistakes.item4')}</li>
                <li>{t('guide.mistakes.item5')}</li>
              </ul>
              
              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.comparison.heading')}</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f0e8cc' }}>
                    <th style={{ textAlign: 'left', padding: 6 }}>{t('guide.comparison.col1')}</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>{t('guide.comparison.col2')}</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>{t('guide.comparison.col3')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #faf5e4' }}>{t('guide.comparison.row1col1')}</td><td style={{ padding: 6, borderBottom: '1px solid #faf5e4' }}>{t('guide.comparison.row1col2')}</td><td style={{ padding: 6, borderBottom: '1px solid #faf5e4' }}>{t('guide.comparison.row1col3')}</td></tr>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #faf5e4' }}>{t('guide.comparison.row2col1')}</td><td style={{ padding: 6, borderBottom: '1px solid #faf5e4' }}>{t('guide.comparison.row2col2')}</td><td style={{ padding: 6, borderBottom: '1px solid #faf5e4' }}>{t('guide.comparison.row2col3')}</td></tr>
                  <tr><td style={{ padding: 6 }}>{t('guide.comparison.row3col1')}</td><td style={{ padding: 6 }}>{t('guide.comparison.row3col2')}</td><td style={{ padding: 6 }}>{t('guide.comparison.row3col3')}</td></tr>
                </tbody>
              </table>
              
              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.proTips.heading')}</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>{t('guide.proTips.item1')}</li>
                <li>{t('guide.proTips.item2')}</li>
                <li>{t('guide.proTips.item3')}</li>
                <li>{t('guide.proTips.item4')}</li>
              </ul>
              
              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.faq.heading')}</h3>
              <p><strong>{t('guide.faq.q1')}</strong> {t('guide.faq.a1')}</p>
              <p><strong>{t('guide.faq.q2')}</strong> {t('guide.faq.a2')}</p>
              <p><strong>{t('guide.faq.q3')}</strong> {t('guide.faq.a3')}</p>
              <p><strong>{t('guide.faq.q4')}</strong> {t('guide.faq.a4')}</p>
              
              <br />
              <p style={{ marginTop: 12 }}><strong>🧾 {t('guide.conclusionTitle')}</strong><br/>
              {t('guide.conclusion')}</p>

              <p style={{ marginTop: 12 }}>
                <a
                  className="btn btn-primary"
                  href="/pdf-converter"
                  onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/pdf-converter') }}
                >{t('guide.ctaBtn')}</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
