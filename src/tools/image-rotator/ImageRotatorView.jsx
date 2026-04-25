import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function ImageRotatorView({
  items,
  selectedIdx,
  setSelectedIdx,
  isDragging,
  fileInputRef,
  status,
  applyAll,
  setApplyAll,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  rotate,
  removeItem,
  handleClear,
  downloadOne,
  downloadAll,
}) {
  const { t } = useTranslation('imageRotator');
  const [openPanel, setOpenPanel] = useState('');
  const selected = items[selectedIdx];
  const isDownloading = status === 'downloading';

  return (
    <div className="ir2-view">
      {/* Hero */}
      <h1 className="hero-title">{t('hero.title')}</h1>
      <p className="hero-tagline">{t('hero.tagline')}</p>

      {/* Info hint */}
      <div className="ir2-tip-banner">
        <span className="ir2-tip-text">{t('hint.text')}</span>
        <Link to="/image-resizer" className="ir2-tip-btn">{t('hint.btn')}</Link>
      </div>

      {/* Details section */}
      <div className="details-row" data-open={openPanel}>
        <div className="details-controls">
          <button
            className={`tab-btn${openPanel === 'details' ? ' active' : ''}`}
            onClick={() => setOpenPanel((prev) => (prev === 'details' ? '' : 'details'))}
            aria-expanded={openPanel === 'details'}
            type="button"
          >
            {t('tabs.details')}
          </button>
          <button
            className={`tab-btn${openPanel === 'howitworks' ? ' active' : ''}`}
            onClick={() => setOpenPanel((prev) => (prev === 'howitworks' ? '' : 'howitworks'))}
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
            <h3>{t('details.faq.heading')}</h3>
            <ul>
              <li><strong>{t('details.faq.q1')}</strong> {t('details.faq.a1')}</li>
              <li><strong>{t('details.faq.q2')}</strong> {t('details.faq.a2')}</li>
              <li><strong>{t('details.faq.q3')}</strong> {t('details.faq.a3')}</li>
            </ul>
          </div>

          <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
            <ol style={{ margin: 0, paddingLeft: '1rem' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <img src="/screenshots/rotator/image-rotator-001.png" alt="Step 1" className="how-img" />
                <p>{t('howItWorks.step1')}</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <img src="/screenshots/rotator/image-rotator-002.png" alt="Step 2" className="how-img" />
                <p>{t('howItWorks.step2')}</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <img src="/screenshots/rotator/image-rotator-003.png" alt="Step 3" className="how-img" />
                <p>{t('howItWorks.step3')}</p>
              </li>
              <li>
                <img src="/screenshots/rotator/image-rotator-004.png" alt="Step 4" className="how-img" />
                <p>{t('howItWorks.step4')}</p>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      {items.length === 0 && (
        <div
          className={`ir2-dropzone${isDragging ? ' ir2-dropzone--active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="ir2-dropzone-icon">🔄</div>
          <p className="ir2-dropzone-text">{t('dropzone.text')}</p>
          <p className="ir2-dropzone-sub">{t('dropzone.sub')}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
        </div>
      )}

      {/* Main editor area */}
      {items.length > 0 && (
        <div className="ir2-editor">
          <div className="ir2-workspace">
            {/* Thumbnail strip */}
            <div className="ir2-strip">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className={`ir2-thumb${idx === selectedIdx ? ' ir2-thumb--active' : ''}`}
                  onClick={() => setSelectedIdx(idx)}
                >
                  <div className="ir2-thumb-img-wrap">
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="ir2-thumb-img"
                      style={{ transform: `rotate(${item.rotation}deg)` }}
                    />
                  </div>
                  <div className="ir2-thumb-controls">
                    <button
                      className="ir2-icon-btn"
                      title={t('actions.rotateLeft')}
                      onClick={(e) => { e.stopPropagation(); rotate(idx, 'left'); }}
                    >↺</button>
                    <button
                      className="ir2-icon-btn"
                      title={t('actions.rotateRight')}
                      onClick={(e) => { e.stopPropagation(); rotate(idx, 'right'); }}
                    >↻</button>
                    <button
                      className="ir2-icon-btn ir2-icon-btn--remove"
                      title={t('actions.remove')}
                      onClick={(e) => { e.stopPropagation(); removeItem(idx); }}
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview panel */}
            {selected && (
              <div className="ir2-preview-panel">
                <div className="ir2-preview-frame">
                  <div className="ir2-preview-img-wrap">
                    <img
                      src={selected.previewUrl}
                      alt={selected.file.name}
                      className="ir2-preview-img"
                      style={{ transform: `rotate(${selected.rotation}deg)` }}
                    />
                  </div>
                </div>

                {/* Rotate controls for selected */}
                <div className="ir2-rotate-controls">
                  {items.length > 1 && (
                    <label className="ir2-apply-all-label">
                      <input
                        type="checkbox"
                        checked={applyAll}
                        onChange={(e) => setApplyAll(e.target.checked)}
                      />
                      {t('actions.applyAll')}
                    </label>
                  )}
                  <div className="ir2-rotate-btns">
                    <button
                      className="ir2-btn ir2-btn--rotate"
                      onClick={() => rotate(selectedIdx, 'left')}
                    >
                      <span className="ir2-rotate-icon">↺</span>
                      {t('actions.rotateLeft')}
                    </button>
                    <div className="ir2-rotation-badge">
                      {selected.rotation}°
                    </div>
                    <button
                      className="ir2-btn ir2-btn--rotate"
                      onClick={() => rotate(selectedIdx, 'right')}
                    >
                      {t('actions.rotateRight')}
                      <span className="ir2-rotate-icon">↻</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action bar: left = file actions, right = download actions */}
          <div className="ir2-action-bar">
            <div className="ir2-action-bar-left">
              <button
                className="ir2-btn ir2-btn--secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                {t('actions.addMore')}
              </button>
              <button
                className="ir2-btn ir2-btn--ghost"
                onClick={handleClear}
              >
                {t('actions.clearAll')}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileInput}
              />
            </div>
            <div className="ir2-action-bar-right">
              <button
                className="ir2-btn ir2-btn--primary"
                disabled={isDownloading}
                onClick={() => downloadOne(selectedIdx)}
              >
                {isDownloading ? t('actions.downloading') : t('actions.download')}
              </button>
              {items.length > 1 && (
                <button
                  className="ir2-btn ir2-btn--secondary"
                  disabled={isDownloading}
                  onClick={downloadAll}
                >
                  {isDownloading ? t('actions.downloading') : t('actions.downloadAll')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEO Guide Section */}
      <div className="ic-guide">
        <div className="ic-guide-intro">
          <h2 className="ic-guide-title">{t('guide.title')}</h2>
          <p className="ic-guide-lead">{t('guide.lead')}</p>
          <p>{t('guide.intro2')}</p>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.why.heading')}</h3>
          <p>{t('guide.why.body')}</p>
          <p>{t('guide.why.reasons')}</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>{t('guide.why.item1')}</li>
            <li>{t('guide.why.item2')}</li>
            <li>{t('guide.why.item3')}</li>
            <li>{t('guide.why.item4')}</li>
            <li>{t('guide.why.item5')}</li>
          </ul>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.how.heading')}</h3>
          <p>{t('guide.how.intro')}</p>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li>{t('guide.how.step1')}</li>
            <li>{t('guide.how.step2')}</li>
            <li>{t('guide.how.step3')}</li>
            <li>{t('guide.how.step4')}</li>
          </ol>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.formats.heading')}</h3>
          <p>{t('guide.formats.intro')}</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>{t('guide.formats.item1')}</li>
            <li>{t('guide.formats.item2')}</li>
            <li>{t('guide.formats.item3')}</li>
            <li>{t('guide.formats.item4')}</li>
            <li>{t('guide.formats.item5')}</li>
            <li>{t('guide.formats.item6')}</li>
            <li>{t('guide.formats.item7')}</li>
          </ul>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.benefits.heading')}</h3>
          <div className="ic-guide-cards">
            <div className="ic-guide-card">
              <span className="ic-guide-card-num">💻</span>
              <p><strong>{t('guide.benefits.card1title')}</strong> — {t('guide.benefits.card1desc')}</p>
            </div>
            <div className="ic-guide-card">
              <span className="ic-guide-card-num">⚡</span>
              <p><strong>{t('guide.benefits.card2title')}</strong> — {t('guide.benefits.card2desc')}</p>
            </div>
            <div className="ic-guide-card">
              <span className="ic-guide-card-num">🔒</span>
              <p><strong>{t('guide.benefits.card3title')}</strong> — {t('guide.benefits.card3desc')}</p>
            </div>
            <div className="ic-guide-card">
              <span className="ic-guide-card-num">📱</span>
              <p><strong>{t('guide.benefits.card4title')}</strong> — {t('guide.benefits.card4desc')}</p>
            </div>
            <div className="ic-guide-card">
              <span className="ic-guide-card-num">👤</span>
              <p><strong>{t('guide.benefits.card5title')}</strong> — {t('guide.benefits.card5desc')}</p>
            </div>
          </div>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.useCases.heading')}</h3>
          <p>{t('guide.useCases.intro')}</p>
          <div className="ic-guide-usecases">
            <div className="ic-guide-usecase"><span className="ic-guide-usecase-icon">🧳</span><p>{t('guide.useCases.item1')}</p></div>
            <div className="ic-guide-usecase"><span className="ic-guide-usecase-icon">📸</span><p>{t('guide.useCases.item2')}</p></div>
            <div className="ic-guide-usecase"><span className="ic-guide-usecase-icon">📑</span><p>{t('guide.useCases.item3')}</p></div>
            <div className="ic-guide-usecase"><span className="ic-guide-usecase-icon">🛒</span><p>{t('guide.useCases.item4')}</p></div>
            <div className="ic-guide-usecase"><span className="ic-guide-usecase-icon">📈</span><p>{t('guide.useCases.item5')}</p></div>
            <div className="ic-guide-usecase"><span className="ic-guide-usecase-icon">📲</span><p>{t('guide.useCases.item6')}</p></div>
          </div>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.faq.heading')}</h3>
          <div className="ic-guide-faq">
            <details className="ic-guide-faq-item">
              <summary>{t('guide.faq.q1')}</summary>
              <p>{t('guide.faq.a1')}</p>
            </details>
            <details className="ic-guide-faq-item">
              <summary>{t('guide.faq.q2')}</summary>
              <p>{t('guide.faq.a2')}</p>
            </details>
            <details className="ic-guide-faq-item">
              <summary>{t('guide.faq.q3')}</summary>
              <p>{t('guide.faq.a3')}</p>
            </details>
            <details className="ic-guide-faq-item">
              <summary>{t('guide.faq.q4')}</summary>
              <p>{t('guide.faq.a4')}</p>
            </details>
          </div>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.whyUs.heading')}</h3>
          <p>{t('guide.whyUs.body')}</p>
          <p>{t('guide.whyUs.greatFor')}</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>{t('guide.whyUs.item1')}</li>
            <li>{t('guide.whyUs.item2')}</li>
            <li>{t('guide.whyUs.item3')}</li>
            <li>{t('guide.whyUs.item4')}</li>
          </ul>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.relatedTools.heading')}</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li><a href="/image-resizer" onClick={(e) => { e.preventDefault(); window.location.href = '/image-resizer'; }}>{t('guide.relatedTools.tool1')}</a></li>
            <li><a href="/image-crop" onClick={(e) => { e.preventDefault(); window.location.href = '/image-crop'; }}>{t('guide.relatedTools.tool2')}</a></li>
            <li><a href="/image-compressor" onClick={(e) => { e.preventDefault(); window.location.href = '/image-compressor'; }}>{t('guide.relatedTools.tool3')}</a></li>
            <li><a href="/pdf-compressor" onClick={(e) => { e.preventDefault(); window.location.href = '/pdf-compressor'; }}>{t('guide.relatedTools.tool4')}</a></li>
          </ul>
        </div>

        <div className="ic-guide-conclusion">
          <h3>{t('guide.conclusion.heading')}</h3>
          <p>{t('guide.conclusion.body')}</p>
          <a
            href="/image-rotator"
            className="ic-guide-cta"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            {t('guide.conclusion.ctaBtn')}
          </a>
        </div>
      </div>

    </div>
  );
}
