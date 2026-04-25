import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { formatSize } from './utils/formatSize'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('pdfMerger')
  const [openPanel, setOpenPanel] = useState('')
  const navigate = useNavigate()
  return (
    <>
      {status !== 'done' && (
        <>
          <div className="hero-section">
            <h1 className="hero-title">{t('hero.title')}</h1>
            <p className="hero-tagline">
              {t('hero.tagline')} <Link to="/blogs/pdf-merger-guide">{t('hero.blogLink')}</Link>
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: '10px 16px', marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>🖼️</span>
              <span style={{ flex: 1, fontSize: 14, color: '#7c6000' }}>{t('hint.text')}</span>
              <Link
                to="/pdf-splitter"
                style={{ whiteSpace: 'nowrap', background: '#faad14', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
              >{t('hint.btn')}</Link>
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
                      <h3>{t('details.howMergeWorks.heading')}</h3>
                      <p>{t('details.howMergeWorks.body')}</p>

                      <h3>{t('details.howSizeDetermined.heading')}</h3>
                      <p>{t('details.howSizeDetermined.body')}</p>

                      <h3>{t('details.whyUseOnline.heading')}</h3>
                      <p>{t('details.whyUseOnline.body')}</p>

                      <h3>{t('details.bestPractices.heading')}</h3>
                      <ul>
                        <li>{t('details.bestPractices.item1')}</li>
                        <li>{t('details.bestPractices.item2')}</li>
                        <li>{t('details.bestPractices.item3')}</li>
                      </ul>

                      <h3>{t('details.whatItDoes.heading')}</h3>
                      <ul>
                        <li>{t('details.whatItDoes.item1')}</li>
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
                          <img src="/images/screenshots/merger/merger-001.png" alt="Step 1" className="how-img" />
                          <p>{t('howItWorks.step1')}</p>
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                          <img src="/images/screenshots/merger/merger-002.png" alt="Step 2" className="how-img" />
                          <p>{t('howItWorks.step2')}</p>
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                          <img src="/images/screenshots/merger/merger-003.png" alt="Step 3" className="how-img" />
                          <p>{t('howItWorks.step3')}</p>
                        </li>
                        <li>
                          <img src="/images/screenshots/merger/merger-004.png" alt="Step 4" className="how-img" />
                          <p>{t('howItWorks.step4')}</p>
                        </li>
                      </ol>
                  </div>
                </div>
            </div>
            <div className="hero-badges">
              <span className="hero-badge">{t('badges.fast')}</span>
              <span className="hero-badge">{t('badges.secure')}</span>
              <span className="hero-badge">{t('badges.autoDeleted')}</span>
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
                <p className="drop-text">{t('dropZone.text')}</p>
                <p className="drop-sub">{t('dropZone.or')}</p>
                <span className="btn btn-outline">{t('dropZone.browse')}</span>
              </label>
            ) : (
              <div className="file-list-wrap">
                <div className="file-list-header">
                  <div>
                    <span className="file-list-title">{t('fileList.title', {count: files.length})}</span>
                    <p className="file-list-sub">{t('fileList.reorderHint')}</p>
                  </div>
                  <button className="btn btn-outline file-list-add" onClick={openFilePicker} type="button">
                    {t('fileList.addMore')}
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
                          title={t('fileList.moveUp')}
                        >
                          ↑
                        </button>
                        <button
                          className="reorder-btn"
                          type="button"
                          onClick={() => moveFileDown(index)}
                          disabled={index === files.length - 1}
                          title={t('fileList.moveDown')}
                        >
                          ↓
                        </button>
                        <button
                          className="remove-btn"
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          title={t('fileList.remove')}
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
            {t('compress')}
          </label>

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          {files.length > 0 && status === 'idle' && (
            <button className="btn btn-primary compress-btn" onClick={handleMerge} type="button">
                {t('mergeBtn')}
              </button>
          )}

          {(status === 'merging' || status === 'uploading' || status === 'compressing') && (
            <div className="progress-section">
              <div className="progress-label">
                {status === 'merging' && t('progress.merging')}
                {status === 'uploading' && t('progress.uploading')}
                {status === 'compressing' && t('progress.compressing')}
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
              <span className="size-col-label">{t('result.inputLabel')}</span>
              <span className="size-col-label">{t('result.totalSizeLabel')}</span>
            </div>
            <div className="size-row size-row--data">
              <span className="size-col-value">{t('result.filesCount', {count: files.length})}</span>
              <span className="size-col-value">{formatSize(originalSize)}</span>
            </div>
            <div className="size-row size-row--spacer" />
            <div className="size-row">
              <span className="size-col-label">{t('result.mergedLabel')}</span>
              <span className="size-col-label">{t('result.sizeLabel')}</span>
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
            {t('result.download')}
          </a>

          <button className="btn btn-ghost" onClick={handleReset} type="button">
            {t('result.another')}
          </button>
        </div>
      )}

      {compress && status === 'done' && (
        <div className="note">
          <span className="note-icon">⚠️</span>
          {t('note')}
        </div>
      )}
      

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: '10px 16px', marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>🖼️</span>
        <span style={{ flex: 1, fontSize: 14, color: '#7c6000' }}>{t('lowerHint.text')}</span>
        <Link
          to="/pdf-compressor"
          style={{ whiteSpace: 'nowrap', background: '#faad14', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
        >{t('lowerHint.btn')}</Link>
      </div>

      {/* Merger guide - different visual vibe */}
      <section className="merger-guide" style={{ marginTop: 28 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: 18, background: 'linear-gradient(180deg,#f7fbff,#ffffff)', borderRadius: 10, border: '1px solid #e6f0ff', color: '#111' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: '0 0 60px', fontSize: 34, lineHeight: 1 }}>
              🧩
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>{t('guide.title')}</h2>
              <p style={{ marginTop: 8 }}>{t('guide.intro')}</p>
              <p style={{ marginTop: 6, fontWeight: 700 }}>{t('guide.cta')}</p>

              <br />
              <h3 style={{ marginTop: 12 }}>{t('guide.whatIs.heading')}</h3>
              <p>{t('guide.whatIs.body')}</p>
              <ul style={{ marginLeft: 16 }}>
                <li>{t('guide.whatIs.item1')}</li>
                <li>{t('guide.whatIs.item2')}</li>
                <li>{t('guide.whatIs.item3')}</li>
                <li>{t('guide.whatIs.item4')}</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.whyMatters.heading')}</h3>
              <ul style={{ marginLeft: 16 }}>
                <li>{t('guide.whyMatters.item1')}</li>
                <li>{t('guide.whyMatters.item2')}</li>
                <li>{t('guide.whyMatters.item3')}</li>
                <li>{t('guide.whyMatters.item4')}</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.useCases.heading')}</h3>
              <ul style={{ marginLeft: 16 }}>
                <li>{t('guide.useCases.item1')}</li>
                <li>{t('guide.useCases.item2')}</li>
                <li>{t('guide.useCases.item3')}</li>
                <li>{t('guide.useCases.item4')}</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.howWorks.heading')}</h3>
              <p>{t('guide.howWorks.body')}</p>

              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.stepByStep.heading')}</h3>
              <ol style={{ marginLeft: 16 }}>
                <li>{t('guide.stepByStep.step1')}</li>
                <li>{t('guide.stepByStep.step2')}</li>
                <li>{t('guide.stepByStep.step3')}</li>
                <li>{t('guide.stepByStep.step4')}</li>
                <li>{t('guide.stepByStep.step5')}</li>
              </ol>

              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.tips.heading')}</h3>
              <ul style={{ marginLeft: 16 }}>
                <li>{t('guide.tips.item1')}</li>
                <li>{t('guide.tips.item2')}</li>
                <li>{t('guide.tips.item3')}</li>
                <li>{t('guide.tips.item4')}</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.mistakes.heading')}</h3>
              <ul style={{ marginLeft: 16 }}>
                <li>{t('guide.mistakes.item1')}</li>
                <li>{t('guide.mistakes.item2')}</li>
                <li>{t('guide.mistakes.item3')}</li>
                <li>{t('guide.mistakes.item4')}</li>
                <li>{t('guide.mistakes.item5')}</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.comparison.heading')}</h3>
              <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e6f0ff' }}>
                    <th style={{ textAlign: 'left', padding: 6 }}>{t('guide.comparison.col1')}</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>{t('guide.comparison.col2')}</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>{t('guide.comparison.col3')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #f3f7ff' }}>{t('guide.comparison.row1col1')}</td><td style={{ padding: 6, borderBottom: '1px solid #f3f7ff' }}>{t('guide.comparison.row1col2')}</td><td style={{ padding: 6, borderBottom: '1px solid #f3f7ff' }}>{t('guide.comparison.row1col3')}</td></tr>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #f3f7ff' }}>{t('guide.comparison.row2col1')}</td><td style={{ padding: 6, borderBottom: '1px solid #f3f7ff' }}>{t('guide.comparison.row2col2')}</td><td style={{ padding: 6, borderBottom: '1px solid #f3f7ff' }}>{t('guide.comparison.row2col3')}</td></tr>
                  <tr><td style={{ padding: 6 }}>{t('guide.comparison.row3col1')}</td><td style={{ padding: 6 }}>{t('guide.comparison.row3col2')}</td><td style={{ padding: 6 }}>{t('guide.comparison.row3col3')}</td></tr>
                </tbody>
              </table>
              </div>

              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.proTips.heading')}</h3>
              <ul style={{ marginLeft: 16 }}>
                <li>{t('guide.proTips.item1')}</li>
                <li>{t('guide.proTips.item2')}</li>
                <li>{t('guide.proTips.item3')}</li>
                <li>{t('guide.proTips.item4')}</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.safety.heading')}</h3>
              <p>{t('guide.safety.body')}</p>

              <br />
              <h3 style={{ marginTop: 10 }}>{t('guide.faq.heading')}</h3>
              <p><strong>{t('guide.faq.q1')}</strong> {t('guide.faq.a1')}</p>
              <p><strong>{t('guide.faq.q2')}</strong> {t('guide.faq.a2')}</p>
              <p><strong>{t('guide.faq.q3')}</strong> {t('guide.faq.a3')}</p>
              <p><strong>{t('guide.faq.q4')}</strong> {t('guide.faq.a4')}</p>

              <br />
              <p style={{ marginTop: 12 }}><strong>{t('guide.conclusion.heading')}</strong>
              <br/>{t('guide.conclusion.body')}</p>

              <p style={{ marginTop: 12 }}>
                <a
                  className="btn btn-primary"
                  href="/pdf-merger"
                  onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/pdf-merger') }}
                >{t('guide.ctaBtn')}</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
