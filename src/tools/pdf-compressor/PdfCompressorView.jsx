import { Link, useNavigate } from 'react-router-dom'
import { formatSize } from './utils/formatSize'
import { useState } from 'react'
import CustomSelect from '../../commons/CustomSelect'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('pdfCompressor')
  const [openPanel, setOpenPanel] = useState('')
  const [qualityOption, setQualityOption] = useState('BALANCED')

  const togglePanel = (panel) => {
    setOpenPanel((prev) => (prev === panel ? '' : panel))
  }

  // style for guide lists so list items align with paragraph text
  const guideListStyle = { marginLeft: 0, paddingLeft: 0, listStylePosition: 'inside' }
  const navigate = useNavigate()

  return (
    <>
          {status !== 'done' && (
            <>
              <div className="hero-section">
                <h1 className="hero-title">{t('hero.title')}</h1>
                <p className="hero-tagline">
                    {t('hero.tagline')} <Link to="/blogs/pdf-compressor-guide">{t('hero.blogLink')}</Link>
                  </p>
                  
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: '10px 16px', marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>🖼️</span>
                  <span style={{ flex: 1, fontSize: 14, color: '#7c6000' }}>{t('hint.text')}</span>
                  <Link
                    to="/pdf-splitter"
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
                      <div className={openPanel !== 'details' ? 'tool-details-open panel-hidden' : 'tool-details-open'}>
                                  <h3>{t('details.whatIsCompression.heading')}</h3>
                                  <p>{t('details.whatIsCompression.body')}</p>

                                  <h3>{t('details.howWorks.heading')}</h3>
                                  <p>{t('details.howWorks.body')}</p>

                                  <h3>{t('details.tradeoffs.heading')}</h3>
                                  <ul>
                                    <li>{t('details.tradeoffs.item1')}</li>
                                    <li>{t('details.tradeoffs.item2')}</li>
                                    <li>{t('details.tradeoffs.item3')}</li>
                                  </ul>

                                  <h3>{t('details.practical.heading')}</h3>
                                  <ul>
                                    <li>{t('details.practical.item1')}</li>
                                    <li>{t('details.practical.item2')}</li>
                                    <li>{t('details.practical.item3')}</li>
                                  </ul>

                              <h3>{t('details.whatItDoes.heading')}</h3>
                              <ul>
                                <li>{t('details.whatItDoes.item1')}</li>
                                <li>{t('details.whatItDoes.item2')}</li>
                                <li>{t('details.whatItDoes.item3')}</li>
                              </ul>

                              <h3>{t('details.usefulWhen.heading')}</h3>
                              <ul>
                                <li>{t('details.usefulWhen.item1')}</li>
                                <li>{t('details.usefulWhen.item2')}</li>
                                <li>{t('details.usefulWhen.item3')}</li>
                              </ul>

                              <h3>{t('details.comparison.heading')}</h3>
                              <ul>
                                <li>{t('details.comparison.item1')}</li>
                                <li>{t('details.comparison.item2')}</li>
                                <li>{t('details.comparison.item3')}</li>
                              </ul>

                              <h3>{t('details.privacy.heading')}</h3>
                              <p>{t('details.privacy.body')}</p>

                              <h3>{t('details.whenToUse.heading')}</h3>
                              <p>{t('details.whenToUse.body')}</p>

                                  <h3>{t('details.faq.heading')}</h3>
                                  <ul>
                                    <li><strong>{t('details.faq.q1')}</strong> {t('details.faq.a1')}</li>
                                    <li><strong>{t('details.faq.q2')}</strong> {t('details.faq.a2')}</li>
                                    <li><strong>{t('details.faq.q3')}</strong> {t('details.faq.a3')}</li>
                                    <li><strong>{t('details.faq.q4')}</strong> {t('details.faq.a4')}</li>
                                  </ul>
                            </div>

                        <div className={openPanel !== 'howitworks' ? 'tool-howitworks-open panel-hidden' : 'tool-howitworks-open'}>
                          <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                            <li style={{ marginBottom: '0.75rem' }}>
                              <img src="/screenshots/compressor/pdf-compressor-01.png" alt="Step 1" className="how-img" />
                              <p>{t('howItWorks.step1')}</p>
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                              <img src="/screenshots/compressor/pdf-compressor-02.png" alt="Step 2" className="how-img" />
                              <p>{t('howItWorks.step2')}</p>
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                              <img src="/screenshots/compressor/pdf-compressor-03.png" alt="Step 3" className="how-img" />
                              <p>{t('howItWorks.step3')}</p>
                            </li>
                            <li>
                              <img src="/screenshots/compressor/pdf-compressor-04.png" alt="Step 4" className="how-img" />
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

              <div className="quality-controls">
                <label className="quality-label">{t('quality.label')}</label>
                <div className="quality-select-wrap">
                  <CustomSelect
                    className="wide"
                    value={qualityOption}
                    onChange={setQualityOption}
                    options={[
                      { value: 'HQ', label: t('quality.hq') },
                      { value: 'BALANCED', label: t('quality.balanced') },
                      { value: 'MAX', label: t('quality.max') },
                    ]}
                  />
                </div>
              </div>

              {errorMsg && <p className="error-msg">{errorMsg}</p>}

              {file && status === 'idle' && (
                <button className="btn btn-primary compress-btn" onClick={() => handleCompress(qualityOption)}>
                  {t('compressBtn')}
                </button>
              )}

              {(status === 'uploading' || status === 'compressing') && (
                <div className="progress-section">
                  <div className="progress-label">
                    {status === 'uploading' ? t('progress.uploading') : t('progress.compressing')}
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
                <div className="size-row size-row--spacer" />
                <div className="size-row">
                  <span className="size-col-label">{t('result.compressedLabel')}</span>
                  <span className="size-col-label">{t('result.sizeLabel')}</span>
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

          {/* Guide / How-to section */}
          <section className="tool-guide" style={{ marginTop: 28 }}>
            <div style={{ maxWidth: 820, margin: '0 auto', padding: '12px 6px', color: '#222', lineHeight: 1.6 }}>
              <h2 style={{ fontSize: 22, marginBottom: 6 }}>{t('guide.title')}</h2>

              <p>{t('guide.intro')}</p>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>{t('guide.whyLarge.heading')}</h3>
              <p>{t('guide.whyLarge.body')}</p>
              <ul style={guideListStyle}>
                <li>{t('guide.whyLarge.item1')}</li>
                <li>{t('guide.whyLarge.item2')}</li>
                <li>{t('guide.whyLarge.item3')}</li>
                <li>{t('guide.whyLarge.item4')}</li>
              </ul>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>{t('guide.whatDoes.heading')}</h3>
              <p>{t('guide.whatDoes.body')}</p>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>{t('guide.whenToCompress.heading')}</h3>
              <ul style={guideListStyle}>
                <li>{t('guide.whenToCompress.item1')}</li>
                <li>{t('guide.whenToCompress.item2')}</li>
                <li>{t('guide.whenToCompress.item3')}</li>
                <li>{t('guide.whenToCompress.item4')}</li>
              </ul>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>{t('guide.bestPractices.heading')}</h3>
              <ol style={guideListStyle}>
                <li>{t('guide.bestPractices.item1')}</li>
                <li>{t('guide.bestPractices.item2')}</li>
                <li>{t('guide.bestPractices.item3')}</li>
                <li>{t('guide.bestPractices.item4')}</li>
                <li>{t('guide.bestPractices.item5')}</li>
              </ol>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>{t('guide.mistakes.heading')}</h3>
              <ul style={guideListStyle}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#b91c1c', fontWeight: 700, lineHeight: '1em' }}>✕</span>
                  {t('guide.mistakes.item1')}
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#b91c1c', fontWeight: 700, lineHeight: '1em' }}>✕</span>
                  {t('guide.mistakes.item2')}
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#b91c1c', fontWeight: 700, lineHeight: '1em' }}>✕</span>
                  {t('guide.mistakes.item3')}
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#b91c1c', fontWeight: 700, lineHeight: '1em' }}>✕</span>
                  {t('guide.mistakes.item4')}
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#b91c1c', fontWeight: 700, lineHeight: '1em' }}>✕</span>
                  {t('guide.mistakes.item5')}
                </li>
              </ul>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>{t('guide.stepByStep.heading')}</h3>
              <ol style={guideListStyle}>
                <li>{t('guide.stepByStep.step1')}</li>
                <li>{t('guide.stepByStep.step2')}</li>
                <li>{t('guide.stepByStep.step3')}</li>
                <li>{t('guide.stepByStep.step4')}</li>
                <li>{t('guide.stepByStep.step5')}</li>
              </ol>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>{t('guide.useCases.heading')}</h3>
              <ul style={guideListStyle}>
                <li>{t('guide.useCases.item1')}</li>
                <li>{t('guide.useCases.item2')}</li>
                <li>{t('guide.useCases.item3')}</li>
                <li>{t('guide.useCases.item4')}</li>
              </ul>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>{t('guide.comparison.heading')}</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e6e6e6' }}>
                    <th style={{ textAlign: 'left', padding: 6 }}>{t('guide.comparison.col1')}</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>{t('guide.comparison.col2')}</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>{t('guide.comparison.col3')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #f3f3f3' }}>{t('guide.comparison.row1col1')}</td><td style={{ padding: 6, borderBottom: '1px solid #f3f3f3' }}>{t('guide.comparison.row1col2')}</td><td style={{ padding: 6, borderBottom: '1px solid #f3f3f3' }}>{t('guide.comparison.row1col3')}</td></tr>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #f3f3f3' }}>{t('guide.comparison.row2col1')}</td><td style={{ padding: 6, borderBottom: '1px solid #f3f3f3' }}>{t('guide.comparison.row2col2')}</td><td style={{ padding: 6, borderBottom: '1px solid #f3f3f3' }}>{t('guide.comparison.row2col3')}</td></tr>
                  <tr><td style={{ padding: 6 }}>{t('guide.comparison.row3col1')}</td><td style={{ padding: 6 }}>{t('guide.comparison.row3col2')}</td><td style={{ padding: 6 }}>{t('guide.comparison.row3col3')}</td></tr>
                </tbody>
              </table>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>{t('guide.tips.heading')}</h3>
              <ul style={guideListStyle}>
                <li>{t('guide.tips.item1')}</li>
                <li>{t('guide.tips.item2')}</li>
                <li>{t('guide.tips.item3')}</li>
                <li>{t('guide.tips.item4')}</li>
              </ul>

              <br />
              <h3 style={{ fontSize: 16, marginTop: 6 }}>{t('guide.faq.heading')}</h3>
              <p><strong>{t('guide.faq.q1')}</strong><br/>{t('guide.faq.a1')}</p>
              <p><strong>{t('guide.faq.q2')}</strong><br/>{t('guide.faq.a2')}</p>
              <p><strong>{t('guide.faq.q3')}</strong><br/>{t('guide.faq.a3')}</p>

              <p style={{ marginTop: 10 }}><strong>{t('guide.conclusionTitle')}</strong><br/>
              {t('guide.conclusion')}</p>

              <p style={{ marginTop: 12 }}>
                <a
                  className="btn btn-primary"
                  href="/pdf-compressor"
                  onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/pdf-compressor') }}
                >{t('guide.ctaBtn')}</a>
              </p>
            </div>
          </section>
    </>
  )
}
