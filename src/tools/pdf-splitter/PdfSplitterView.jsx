import { Link, useNavigate } from 'react-router-dom'
import { formatSize } from './utils/formatSize'
import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'

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
  const { t } = useTranslation('pdfSplitter')
  const [openPanel, setOpenPanel] = useState('')
  const navigate = useNavigate()
  const togglePanel = (panel) => setOpenPanel((prev) => (prev === panel ? '' : panel))

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ['q1', 'q2', 'q3', 'q4'].map((key) => ({
      '@type': 'Question',
      name: t(`guide.faq.${key}`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`guide.faq.a${key.slice(1)}`),
      },
    })),
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      {status !== 'done' && <div className="hero-section">
        <h1 className="hero-title">{t('hero.title')}</h1>
        <p className="hero-tagline">{t('hero.tagline')}&nbsp;
                      <Link to="/blogs/pdf-splitter-guide">{t('hero.blogLink')}</Link></p>

        <div className="hint-banner">
          <span className="hint-banner-icon">🖼️</span>
          <span className="hint-banner-text">{t('hint.text')}</span>
          <Link to="/pdf-merger" className="hint-banner-btn">{t('hint.btn')}</Link>
        </div>
        <div className="details-row" data-open={openPanel}>
        <div className="details-controls">
          <button
            className={`tab-btn${openPanel === 'details' ? ' active' : ''}`}
            onClick={() => togglePanel('details')}
            aria-expanded={openPanel === 'details'}
            type="button"
          >
            {t('tabs.details')}
          </button>
          <button
            className={`tab-btn${openPanel === 'howitworks' ? ' active' : ''}`}
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

            <h3>{t('details.outputOptions.heading')}</h3>
            <p>{t('details.outputOptions.intro')}</p>
            <ul>
              <li>{t('details.outputOptions.multiple')}</li>
              <li>{t('details.outputOptions.single')}</li>
            </ul>

            <h3>{t('details.pageRangeFormat.heading')}</h3>
            <p>{t('details.pageRangeFormat.intro')}</p>
            <ul>
              <li>{t('details.pageRangeFormat.single')}</li>
              <li>{t('details.pageRangeFormat.contiguous')}</li>
              <li>{t('details.pageRangeFormat.mixed')}</li>
            </ul>
            <p>{t('details.pageRangeFormat.note')}</p>

            <h3>{t('details.tradeoffs.heading')}</h3>
            <ul>
              <li>{t('details.tradeoffs.fidelity')}</li>
              <li>{t('details.tradeoffs.performance')}</li>
              <li>{t('details.tradeoffs.order')}</li>
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
              <li>{t('details.whatItDoes.item4')}</li>
            </ul>

            <h3>{t('details.usefulWhen.heading')}</h3>
            <ul>
              <li>{t('details.usefulWhen.item1')}</li>
              <li>{t('details.usefulWhen.item2')}</li>
              <li>{t('details.usefulWhen.item3')}</li>
              <li>{t('details.usefulWhen.item4')}</li>
            </ul>

            <h3>{t('details.comparison.heading')}</h3>
            <ul>
              <li>{t('details.comparison.browser')}</li>
              <li>{t('details.comparison.desktop')}</li>
              <li>{t('details.comparison.commandLine')}</li>
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
                <img src="/screenshots/splitter/PDF-splitter-001.png" alt="Step 1" className="how-img" />
                <p>{t('howItWorks.step1')}</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <img src="/screenshots/splitter/PDF-splitter-002.png" alt="Step 2" className="how-img" />
                <p>{t('howItWorks.step2')}</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <img src="/screenshots/splitter/PDF-splitter-003.png" alt="Step 3" className="how-img" />
                <p>{t('howItWorks.step3')}</p>
              </li>
              <li>
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
      </div>}
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
                <p className="drop-text hero-tagline">{t('dropZone.text')}</p>
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
                <button className="remove-btn" onClick={handleReset} title={t('dropZone.removeTitle')}>✕</button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <label className="hero-tagline" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{t('pageRangesLabel')}
                <input
                  aria-label={t('pageRangesLabel').replace(':', '')}
                  placeholder={t('pageRangesPlaceholder')}
                  value={segments}
                  onChange={e => setSegments(e.target.value)}
                  className="segments-input"
                  style={{ padding: '6px 8px', borderRadius: 6, border: `1px solid ${segments && !/^(\d+\s*(-\s*\d+)?)(,\s*(\d+\s*(-\s*\d+)?))*$/.test(segments.trim()) ? '#ef4444' : '#d1d5db'}` }}
                />
              </label>

              <div className="hero-tagline" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {t('outputLabel')}
                </label>
                <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="radio" name="output" checked={outputOption === 'ONE'} onChange={() => setOutputOption('ONE')} /> {t('outputSingle')}
                </label>
                <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="radio" name="output" checked={outputOption === 'MULTIPLE'} onChange={() => setOutputOption('MULTIPLE')} /> {t('outputMultiple')}
                </label>
              </div>
            </div>

            {errorMsg && <p className="error-msg">{errorMsg}</p> }

            {file && (status === 'idle' || status === 'error') && (
              <button className="btn btn-primary compress-btn" onClick={handleSplit} disabled={!segments}>{t('splitBtn')}</button>
            )}
          </div>

          {status === 'splitting' && (
            <div className="progress-section" style={{ marginTop: 12 }}>
              <div className="progress-label">{t('progress.splitting')}</div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            </div>
          )}
        </>
      )}

      {status === 'done' && (
        <div className="result-section">
          <div className="result-icon">{t('result.icon')}</div>
          <h2 className="result-title">{t('result.title')}</h2>
          <div className="split-results">
            <div className="split-row">
              <span className="split-col-label">{t('result.segmentLabel')}</span>
              <span className="split-col-label">{t('result.downloadLabel')}</span>
            </div>
            <div className="split-row--spacer" />
            {results.map(r => (
              <div key={r.splitKey} className="split-row split-row--data">
                <span className="split-col-value">{r.segment}</span>
                <button
                  className="btn btn-primary split-download-btn"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    const a = document.createElement('a')
                    a.href = r.url
                    a.download = `Segments: ${r.segment}.pdf`
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                  }}
                >{t('result.downloadBtn')}
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" onClick={handleReset}>{t('result.another')}</button>
        </div>
      )}



      {/* Splitter guide — unique card-grid (green accent) */}
      <section className="splitter-guide">
        <div className="splitter-guide-header">
          <span className="splitter-guide-icon">✂️</span>
          <div>
            <h2>{t('guide.title')}</h2>
            <p>{t('guide.intro')}</p>
            <p className="splitter-guide-cta">{t('guide.cta')}</p>
          </div>
        </div>

        <div className="splitter-guide-grid">
          <div className="splitter-guide-card">
            <h3>{t('guide.whatIs.heading')}</h3>
            <p>{t('guide.whatIs.body')}</p>
            <ul>
              <li>{t('guide.whatIs.item1')}</li>
              <li>{t('guide.whatIs.item2')}</li>
              <li>{t('guide.whatIs.item3')}</li>
            </ul>
          </div>

          <div className="splitter-guide-card">
            <h3>{t('guide.whyUseful.heading')}</h3>
            <ul>
              <li>{t('guide.whyUseful.item1')}</li>
              <li>{t('guide.whyUseful.item2')}</li>
              <li>{t('guide.whyUseful.item3')}</li>
              <li>{t('guide.whyUseful.item4')}</li>
            </ul>
          </div>

          <div className="splitter-guide-card">
            <h3>{t('guide.useCases.heading')}</h3>
            <ul>
              <li>{t('guide.useCases.item1')}</li>
              <li>{t('guide.useCases.item2')}</li>
              <li>{t('guide.useCases.item3')}</li>
              <li>{t('guide.useCases.item4')}</li>
            </ul>
          </div>

          <div className="splitter-guide-card splitter-guide-card--wide">
            <h3>{t('guide.stepByStep.heading')}</h3>
            <ol>
              <li>{t('guide.stepByStep.step1')}</li>
              <li>{t('guide.stepByStep.step2')}</li>
              <li>{t('guide.stepByStep.step3')}</li>
              <li>{t('guide.stepByStep.step4')}</li>
              <li>{t('guide.stepByStep.step5')}</li>
            </ol>
          </div>

          <div className="splitter-guide-card">
            <h3>{t('guide.bestPractices.heading')}</h3>
            <ul>
              <li>{t('guide.bestPractices.item1')}</li>
              <li>{t('guide.bestPractices.item2')}</li>
              <li>{t('guide.bestPractices.item3')}</li>
              <li>{t('guide.bestPractices.item4')}</li>
              <li>{t('guide.bestPractices.item5')}</li>
            </ul>
          </div>

          <div className="splitter-guide-card splitter-guide-card--wide">
            <h3>{t('guide.comparison.heading')}</h3>
            <table className="splitter-guide-table">
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

          <div className="splitter-guide-card">
            <h3>{t('guide.mistakes.heading')}</h3>
            <ul>
              <li>{t('guide.mistakes.item1')}</li>
              <li>{t('guide.mistakes.item2')}</li>
              <li>{t('guide.mistakes.item3')}</li>
              <li>{t('guide.mistakes.item4')}</li>
              <li>{t('guide.mistakes.item5')}</li>
            </ul>
          </div>

          <div className="splitter-guide-card splitter-guide-card--wide">
            <h3>{t('guide.faq.heading')}</h3>
            <div className="splitter-guide-faq">
              <p><strong>{t('guide.faq.q1')}</strong> {t('guide.faq.a1')}</p>
              <p><strong>{t('guide.faq.q2')}</strong> {t('guide.faq.a2')}</p>
              <p><strong>{t('guide.faq.q3')}</strong> {t('guide.faq.a3')}</p>
              <p><strong>{t('guide.faq.q4')}</strong> {t('guide.faq.a4')}</p>
            </div>
          </div>
        </div>

        <div className="splitter-guide-footer">
          <p><strong>{t('guide.conclusionTitle')}</strong><br/>{t('guide.conclusion')}</p>
          <a className="btn btn-primary" href="/pdf-splitter" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/pdf-splitter') }}>{t('guide.ctaBtn')}</a>
        </div>
      </section>
    </>
  )
}
