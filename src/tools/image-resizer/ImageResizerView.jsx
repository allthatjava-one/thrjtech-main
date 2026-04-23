import { Link } from 'react-router-dom'
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function ImageResizerView({
  mainImage,
  resizeMode,
  setResizeMode,
  percentage,
  setPercentage,
  width,
  setWidth,
  height,
  setHeight,
  outputUrl,
  outputName,
  status,
  errorMsg,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleResize,
  handleClear,
}) {
  const { t } = useTranslation('imageResizer');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState('');
  const [linked, setLinked] = useState(true);
  const originalWidth = useRef(null);
  const originalHeight = useRef(null);
  const [previewZoom, setPreviewZoomState] = useState(1);
  const previewZoomRef = useRef(1);
  const dropZoneRef = useRef(null);
  const [popupPan, setPopupPan] = useState({ x: 0, y: 0 });
  const [popupDragging, setPopupDragging] = useState(false);
  const popupPanRef = useRef({ x: 0, y: 0 });
  const popupDragRef = useRef({ active: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0 });
  const popupDialogRef = useRef(null);
  const [popupImgSize, setPopupImgSize] = useState({ w: null, h: null });
  // Set original dimensions when image loads; populate inputs and reset zoom
  React.useEffect(() => {
    if (mainImage) {
      const img = new window.Image();
      img.onload = () => {
        originalWidth.current = img.width;
        originalHeight.current = img.height;
        setWidth(img.width.toString());
        setHeight(img.height.toString());
        previewZoomRef.current = 1;
        setPreviewZoomState(1);
        setResizeMode('dimensions');
      };
      img.src = URL.createObjectURL(mainImage);
    }
  }, [mainImage]);

  // Alt+Scroll and pinch-zoom on the drop zone preview
  React.useEffect(() => {
    const el = dropZoneRef.current;
    if (!el) return;
    let lastDist = null;

    const applyZoom = (next) => {
      previewZoomRef.current = next;
      setPreviewZoomState(next);
      if (originalWidth.current && originalHeight.current) {
        setWidth(Math.round(originalWidth.current * next).toString());
        setHeight(Math.round(originalHeight.current * next).toString());
      }
    };

    const onWheel = (e) => {
      if (!e.altKey) return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      applyZoom(Math.max(0.1, Math.min(10, previewZoomRef.current * factor)));
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        lastDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 2 && lastDist !== null) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        applyZoom(Math.max(0.1, Math.min(10, previewZoomRef.current * (dist / lastDist))));
        lastDist = dist;
      }
    };

    const onTouchEnd = () => { lastDist = null; };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [setWidth, setHeight]);

  // Auto-open popup when a resized output is ready
  React.useEffect(() => {
    if (outputUrl) {
      setPopupImgSize({ w: null, h: null });
      setPreviewOpen(true);
    }
  }, [outputUrl]);

  // Reset pan and attach mouse+touch drag listeners while popup is open
  React.useEffect(() => {
    if (!previewOpen) return;
    setPopupPan({ x: 0, y: 0 });
    popupPanRef.current = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      if (!popupDragRef.current.active) return;
      const newPan = {
        x: popupDragRef.current.startPanX + (e.clientX - popupDragRef.current.startX),
        y: popupDragRef.current.startPanY + (e.clientY - popupDragRef.current.startY),
      };
      popupPanRef.current = newPan;
      setPopupPan(newPan);
    };
    const onMouseUp = () => {
      if (popupDragRef.current.active) {
        popupDragRef.current.active = false;
        setPopupDragging(false);
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const el = popupDialogRef.current;
    let touchStartX = 0, touchStartY = 0, touchStartPanX = 0, touchStartPanY = 0;
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartPanX = popupPanRef.current.x;
        touchStartPanY = popupPanRef.current.y;
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      const newPan = {
        x: touchStartPanX + (e.touches[0].clientX - touchStartX),
        y: touchStartPanY + (e.touches[0].clientY - touchStartY),
      };
      popupPanRef.current = newPan;
      setPopupPan(newPan);
    };
    const onTouchEnd = () => {};
    if (el) {
      el.addEventListener('touchstart', onTouchStart, { passive: true });
      el.addEventListener('touchmove', onTouchMove, { passive: false });
      el.addEventListener('touchend', onTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (el) {
        el.removeEventListener('touchstart', onTouchStart);
        el.removeEventListener('touchmove', onTouchMove);
        el.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, [previewOpen]);

  const navigate = useNavigate();
  const [sendStatus, setSendStatus] = useState('idle');
  const handleSendToWatermark = async () => {
    setSendStatus('processing');
    try {
      const response = await fetch(outputUrl);
      const blob = await response.blob();
      const file = new File([blob], outputName, { type: blob.type });
      navigate('/image-watermarker', { state: { mainImage: file } });
    } catch (e) {
      setSendStatus('error');
    }
  };
  return (
    <div className="image-resizer-view">
      <h2 className="hero-title">{t('hero.title')}</h2>
      <p className="hero-tagline">{t('hero.tagline')}{' '}
        <Link to="/blogs/image-resizer-guide">{t('hero.blogLink')}</Link></p>

      <div className="ir-tip-banner">
        <span className="ir-tip-text">{t('hint.text')}</span>
        <button className="ir-tip-btn" onClick={() => navigate('/image-crop')}>
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

                <h3>{t('details.quality.heading')}</h3>
                <ul>
                  <li>{t('details.quality.item1')}</li>
                  <li>{t('details.quality.item2')}</li>
                  <li>{t('details.quality.item3')}</li>
                </ul>

                <h3>{t('details.practical.heading')}</h3>
                <ul>
                  <li>{t('details.practical.item1')}</li>
                  <li>{t('details.practical.item2')}</li>
                  <li>{t('details.practical.item3')}</li>
                </ul>

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

            <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
                <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/resizer/Image-resizer001.png" alt="Step 1" className="how-img" />
                    <p>{t('howItWorks.step1')}</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/resizer/Image-resizer002.png" alt="Step 2" className="how-img" />
                    <p>{t('howItWorks.step2')}</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/resizer/Image-resizer003.png" alt="Step 3" className="how-img" />
                    <p>{t('howItWorks.step3')}</p>
                  </li>
                  <li>
                    <img src="/screenshots/resizer/Image-resizer004.png" alt="Step 4" className="how-img" />
                    <p>{t('howItWorks.step4')}</p>
                  </li>
                </ol>
              </div>
          </div>
      </div>
      <div
        ref={dropZoneRef}
        className={`drop-zone${isDragging ? ' dragging' : ''}${mainImage ? ' has-image' : ''}`}
        style={{ overflow: 'hidden', position: 'relative' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !mainImage && fileInputRef.current && fileInputRef.current.click()}
      >
        {mainImage ? (
          <img
            src={URL.createObjectURL(mainImage)}
            alt="Main"
            className="preview-image clickable"
            style={{
              cursor: 'pointer',
              transform: `scale(${previewZoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.08s ease',
            }}
            onClick={e => {
              e.stopPropagation();
              setPreviewOpen(true);
            }}
          />
        ) : (
          <span className="hero-tagline">{t('dropZone.text')}</span>
        )}
        <input
          type="file"
          accept="image/*,.heic,.heif"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileInput}
        />
        {mainImage && (
          <div className="drop-zone-hint">{t('dropZone.hint', { percent: Math.round(previewZoom * 100) })}</div>
        )}
      </div>

      {/* File row: filename + Change Image + Clear */}
      {mainImage && (
        <div className="ir-file-row">
          <span className="ir-file-name">{mainImage.name}</span>
          <button
            type="button"
            className="ir-change-btn"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            {t('fileRow.name')}
          </button>
          <button type="button" className="ir-clear-btn" onClick={handleClear}>
            {t('fileRow.clear')}
          </button>
        </div>
      )}

      {/* Preview popup dialog */}
      {previewOpen && (mainImage || outputUrl) && (
        <div className="image-popup-overlay" onClick={() => setPreviewOpen(false)}>
          <div
            ref={popupDialogRef}
            className="image-popup-dialog"
            onClick={e => e.stopPropagation()}
            onMouseDown={e => {
              e.stopPropagation();
              popupDragRef.current = {
                active: true,
                startX: e.clientX,
                startY: e.clientY,
                startPanX: popupPanRef.current.x,
                startPanY: popupPanRef.current.y,
              };
              setPopupDragging(true);
            }}
            style={{
              cursor: popupDragging ? 'grabbing' : 'grab',
              position: 'relative',
              overflow: 'hidden',
              display: 'block',
            }}
          >
            <img
              src={outputUrl ? outputUrl : URL.createObjectURL(mainImage)}
              alt="Preview"
              className="image-popup-img"
              onLoad={e => setPopupImgSize({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: popupImgSize.w != null ? `${popupImgSize.w}px` : 'auto',
                height: popupImgSize.h != null ? `${popupImgSize.h}px` : 'auto',
                maxWidth: 'none',
                maxHeight: 'none',
                flexShrink: 0,
                transform: `translate(calc(-50% + ${popupPan.x}px), calc(-50% + ${popupPan.y}px))`,
                pointerEvents: 'none',
                userSelect: 'none',
                display: 'block',
              }}
              draggable={false}
            />
          </div>
          <button className="close-popup-btn" onClick={() => setPreviewOpen(false)}>&times;</button>
        </div>
      )}
      <div className="resize-options">
        <label>
          <input
            type="radio"
            name="resizeMode"
            value="percentage"
            checked={resizeMode === 'percentage'}
            onChange={() => setResizeMode('percentage')}
          />
          {t('resizeMode.percentage')}
        </label>
        <label>
          <input
            type="radio"
            name="resizeMode"
            value="dimensions"
            checked={resizeMode === 'dimensions'}
            onChange={() => setResizeMode('dimensions')}
          />
          {t('resizeMode.dimensions')}
        </label>
      </div>
      {resizeMode === 'percentage' && (
        <label className="resize-input-percent">
        <input
          type="number"
          className="resize-input"
          placeholder={t('percentInput.placeholder')}
          value={percentage}
          min={1}
          max={500}
          onChange={e => setPercentage(e.target.value)}
        />
        %
        </label>
      )}
      {resizeMode === 'dimensions' && (
        <div className="dimension-inputs" style={{ display: 'flex', alignItems: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
          <input
            type="number"
            className="resize-input"
            placeholder={t('dimensionInputs.width')}
            value={width}
            min={1}
            style={{ alignSelf: 'center' }}
            onChange={e => {
              const newWidth = e.target.value;
              if (linked && originalWidth.current && originalHeight.current && width && height) {
                // Maintain aspect ratio
                const ratio = originalHeight.current / originalWidth.current;
                setWidth(newWidth);
                setHeight(newWidth ? Math.round(Number(newWidth) * ratio).toString() : '');
              } else {
                setWidth(newWidth);
              }
            }}
          />
          <button
            type="button"
            aria-label={linked ? t('dimensionInputs.unlinkAria') : t('dimensionInputs.linkAria')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0 0.3rem',
              fontSize: '1.3rem',
              color: linked ? '#3182ce' : '#a0aec0',
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'center',
            }}
            onClick={() => setLinked(l => !l)}
          >
            {linked ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 1 7 0l1 1a5 5 0 0 1 0 7 5 5 0 0 1-7 0l-1-1"/><path d="M14 11a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 0 7 5 5 0 0 0 7 0l1-1"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 7a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 0 7 5 5 0 0 0 7 0l1-1"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
            )}
          </button>
          <input
            type="number"
            className="resize-input"
            placeholder={t('dimensionInputs.height')}
            value={height}
            min={1}
            style={{ alignSelf: 'center' }}
            onChange={e => {
              const newHeight = e.target.value;
              if (linked && originalWidth.current && originalHeight.current && width && height) {
                // Maintain aspect ratio
                const ratio = originalWidth.current / originalHeight.current;
                setHeight(newHeight);
                setWidth(newHeight ? Math.round(Number(newHeight) * ratio).toString() : '');
              } else {
                setHeight(newHeight);
              }
            }}
          />
        </div>
      )}
      <div className="action-row">
        <button
          className="resize-btn"
          onClick={handleResize}
          disabled={status === 'processing' || !mainImage || (resizeMode === 'dimensions' && (!width || !height))}
        >
          {status === 'processing' ? t('processingBtn') : t('previewBtn')}
        </button>

        <button
          type="button"
          className={`download-btn${!outputUrl ? ' disabled' : ''}`}
          disabled={!outputUrl}
          onClick={() => {
            if (!outputUrl) return;
            try {
              const link = document.createElement('a');
              link.href = outputUrl;
              link.download = outputName || '';
              document.body.appendChild(link);
              link.click();
              link.remove();
            } catch (e) {
              window.open(outputUrl, '_blank', 'noopener');
            }
          }}
        >
          {t('downloadBtn')}
        </button>
      </div>

      {errorMsg && <div className="error-msg">{errorMsg}</div>}
      {outputUrl && (
        <div className="output-section">
          <div
            style={{
              marginTop: '1.5rem',
              width: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              border: '1.5px solid #e2e6f0',
              borderRadius: 10,
              background: '#f7f8fa',
              padding: '1rem 1.2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              minHeight: 64,
            }}
          >
            <span style={{ fontWeight: 600, color: '#222', fontSize: '1.08rem', marginBottom: 0, textAlign: 'left', flex: 1, display: 'block', alignSelf: 'center' }}>
            {t('watermarkPrompt.text')}
            </span>
            <button
              className="resize-btn"
              onClick={handleSendToWatermark}
              disabled={sendStatus === 'processing'}
            >
              {sendStatus === 'processing' ? t('watermarkPrompt.preparing') : t('watermarkPrompt.yes')}
            </button>
          </div>
          {sendStatus === 'error' && (
            <div className="error-msg" style={{ marginTop: 8 }}>{t('watermarkPrompt.error')}</div>
          )}
        </div>
      )}

      {/* ── Guide Article ── */}
      <div className="ir-guide">
        <div className="ir-guide-intro">
          <h2 className="ir-guide-title">{t('guide.title')}</h2>
          <p className="ir-guide-lead">{t('guide.lead')}</p>
          <div className="ir-guide-learn-box">
            <span className="ir-guide-learn-label">{t('guide.learn')}</span>
            <ul className="ir-guide-learn-list">
              <li>{t('guide.learnItems.item1')}</li>
              <li>{t('guide.learnItems.item2')}</li>
              <li>{t('guide.learnItems.item3')}</li>
              <li>{t('guide.learnItems.item4')}</li>
            </ul>
          </div>
        </div>

        <div className="ir-guide-section">
          <h3 className="ir-guide-h3">{t('guide.whatMeans.heading')}</h3>
          <p>{t('guide.whatMeans.body')}</p>
          <div className="ir-guide-example-box">
            <div className="ir-guide-example-row">
              <span className="ir-guide-example-label">Original</span>
              <span className="ir-guide-example-val">4000 × 3000 px</span>
            </div>
            <div className="ir-guide-example-arrow">↓</div>
            <div className="ir-guide-example-row">
              <span className="ir-guide-example-label">Resized</span>
              <span className="ir-guide-example-val ir-guide-example-val--accent">800 × 600 px</span>
            </div>
          </div>
          <p>{t('guide.whatMeans.resampling')}</p>
        </div>

        <div className="ir-guide-section">
          <h3 className="ir-guide-h3">{t('guide.whyLoseQuality.heading')}</h3>
          <div className="ir-guide-cards">
            <div className="ir-guide-card">
              <span className="ir-guide-card-num">1</span>
              <div><p>{t('guide.whyLoseQuality.pixel')}</p></div>
            </div>
            <div className="ir-guide-card">
              <span className="ir-guide-card-num">2</span>
              <div><p>{t('guide.whyLoseQuality.resampling')}</p></div>
            </div>
            <div className="ir-guide-card">
              <span className="ir-guide-card-num">3</span>
              <div><p>{t('guide.whyLoseQuality.repeated')}</p></div>
            </div>
          </div>
        </div>

        <div className="ir-guide-section">
          <h3 className="ir-guide-h3">{t('guide.bestPractices.heading')}</h3>
          <div className="ir-guide-best-list">
            <div className="ir-guide-best-item">
              <span className="ir-guide-best-icon">✅</span>
              <div><p>{t('guide.bestPractices.aspectRatio')}</p></div>
            </div>
            <div className="ir-guide-best-item">
              <span className="ir-guide-best-icon">✅</span>
              <div><p>{t('guide.bestPractices.resizeOnce')}</p></div>
            </div>
            <div className="ir-guide-best-item">
              <span className="ir-guide-best-icon">✅</span>
              <div><p>{t('guide.bestPractices.format')}</p></div>
            </div>
            <div className="ir-guide-best-item">
              <span className="ir-guide-best-icon">✅</span>
              <div><p>{t('guide.bestPractices.compression')}</p></div>
            </div>
          </div>
        </div>

        <div className="ir-guide-section">
          <h3 className="ir-guide-h3">{t('guide.useCases.heading')}</h3>
          <div className="ir-guide-usecases">
            <div className="ir-guide-usecase">
              <span className="ir-guide-usecase-icon">🌐</span>
              <p>{t('guide.useCases.website')}</p>
            </div>
            <div className="ir-guide-usecase">
              <span className="ir-guide-usecase-icon">📱</span>
              <p>{t('guide.useCases.social')}</p>
            </div>
            <div className="ir-guide-usecase">
              <span className="ir-guide-usecase-icon">📧</span>
              <p>{t('guide.useCases.email')}</p>
            </div>
          </div>
        </div>

        <div className="ir-guide-section">
          <h3 className="ir-guide-h3">{t('guide.mistakes.heading')}</h3>
          <div className="ir-guide-mistakes">
            <div className="ir-guide-mistake">{t('guide.mistakes.item1')}</div>
            <div className="ir-guide-mistake">{t('guide.mistakes.item2')}</div>
            <div className="ir-guide-mistake">{t('guide.mistakes.item3')}</div>
            <div className="ir-guide-mistake">{t('guide.mistakes.item4')}</div>
          </div>
        </div>

        <div className="ir-guide-section">
          <h3 className="ir-guide-h3">{t('guide.stepByStep.heading')}</h3>
          <ol className="ir-guide-steps">
            <li>{t('guide.stepByStep.step1')}</li>
            <li>{t('guide.stepByStep.step2')}</li>
            <li>{t('guide.stepByStep.step3')}</li>
            <li>{t('guide.stepByStep.step4')}</li>
            <li>{t('guide.stepByStep.step5')}</li>
          </ol>
        </div>

        <div className="ir-guide-section">
          <h3 className="ir-guide-h3">{t('guide.faq.heading')}</h3>
          <div className="ir-guide-faq">
            <details className="ir-guide-faq-item">
              <summary>{t('guide.faq.q1')}</summary>
              <p>{t('guide.faq.a1')}</p>
            </details>
            <details className="ir-guide-faq-item">
              <summary>{t('guide.faq.q2')}</summary>
              <p>{t('guide.faq.a2')}</p>
            </details>
            <details className="ir-guide-faq-item">
              <summary>{t('guide.faq.q3')}</summary>
              <p>{t('guide.faq.a3')}</p>
            </details>
            <details className="ir-guide-faq-item">
              <summary>{t('guide.faq.q4')}</summary>
              <p>{t('guide.faq.a4')}</p>
            </details>
          </div>
        </div>

        <div className="ir-guide-conclusion">
          <h3>{t('guide.conclusionTitle')}</h3>
          <p>{t('guide.conclusion')}</p>
          <a
            href="/image-resizer"
            className="ir-guide-cta"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              navigate('/image-resizer');
            }}
          >
            {t('guide.ctaBtn')}
          </a>
        </div>
      </div>
    </div>
  );
}
