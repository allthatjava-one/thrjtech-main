import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import './ImageConverter.css';
import { useTranslation } from 'react-i18next';

// ── Draggable + zoomable image viewport ─────────────────────────────────────
function DraggablePreview({ src, alt }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef(null);
  const startRef = useRef(null);
  const pinchRef = useRef(null); // { startDist, startScale }
  const scaleRef = useRef(1);
  scaleRef.current = scale;

  // Reset pan + zoom when src changes
  const prevSrc = useRef(null);
  if (prevSrc.current !== src) {
    prevSrc.current = src;
    Promise.resolve().then(() => { setOffset({ x: 0, y: 0 }); setScale(1); });
  }

  // Non-passive listeners for Alt+Scroll zoom and pinch zoom
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const pinchDist = (touches) =>
      Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

    const onWheel = (e) => {
      if (!e.altKey) return;
      e.preventDefault();
      setScale((s) => Math.min(8, Math.max(0.25, s * (e.deltaY < 0 ? 1.1 : 0.9))));
    };

    const onTouchMovePinch = (e) => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault();
        const ratio = pinchDist(e.touches) / pinchRef.current.startDist;
        setScale(Math.min(8, Math.max(0.25, pinchRef.current.startScale * ratio)));
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchmove', onTouchMovePinch, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchmove', onTouchMovePinch);
    };
  }, []);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
    startRef.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  }, [offset]);

  const onMouseMove = useCallback((e) => {
    if (!dragging || !startRef.current) return;
    setOffset({ x: startRef.current.ox + (e.clientX - startRef.current.mx), y: startRef.current.oy + (e.clientY - startRef.current.my) });
  }, [dragging]);

  const onMouseUp = useCallback(() => setDragging(false), []);

  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      pinchRef.current = {
        startDist: Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY),
        startScale: scaleRef.current,
      };
      setDragging(false);
    } else {
      const t = e.touches[0];
      setDragging(true);
      startRef.current = { mx: t.clientX, my: t.clientY, ox: offset.x, oy: offset.y };
    }
  }, [offset]);

  const onTouchMove = useCallback((e) => {
    if (e.touches.length !== 1 || !dragging || !startRef.current) return;
    e.preventDefault();
    const t = e.touches[0];
    setOffset({ x: startRef.current.ox + (t.clientX - startRef.current.mx), y: startRef.current.oy + (t.clientY - startRef.current.my) });
  }, [dragging]);

  const onTouchEnd = useCallback((e) => {
    if (e.touches.length < 2) pinchRef.current = null;
    if (e.touches.length === 0) setDragging(false);
  }, []);

  return (
    <div
      ref={viewportRef}
      className={`ic-drag-viewport${dragging ? ' dragging' : ''}`}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <img
        src={src}
        alt={alt}
        className="ic-drag-image"
        style={{ transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})` }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        draggable={false}
      />
      <span className="ic-drag-hint">Alt+Scroll to zoom · Drag to pan</span>
    </div>
  );
}

// Format labels/descriptions are resolved via i18n at render time

export function ImageConverterView({
  mainImages,
  currentIndex,
  setCurrentIndex,
  inputMime,
  outputFormat,
  setOutputFormat,
  availableFormats,
  outputUrls,
  outputNames,
  convertedFormat,
  status,
  errorMsg,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleConvertAll,
  handleClear,
  icoSize,
  setIcoSize,
}) {
  const [openPanel, setOpenPanel] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation('imageConverter');

  // Provide defaults for keys so UI stays readable even if translations are missing
  const formatDefaultLabels = {
    JPG: 'JPG', PNG: 'PNG', WebP: 'WebP', AVIF: 'AVIF', BMP: 'BMP', GIF: 'GIF', ICO: 'ICO',
  };
  const formatDefaultDesc = {
    JPG: 'Best for photos. Smaller file, lossy compression.',
    PNG: 'Best for graphics with transparency. Lossless quality.',
    WebP: 'Modern format. Smaller than JPG & PNG with great quality.',
    AVIF: 'Next-gen format. Best compression. Chrome & Firefox recommended.',
    BMP: 'Uncompressed bitmap. Lossless, large file. Max compatibility.',
    GIF: '256-color format. Best for simple graphics, not photos.',
    ICO: 'Windows icon format. Choose which sizes to include.',
  };

  const fmtLabel = (fmt) => t(`formats.${fmt.toLowerCase()}`, { defaultValue: formatDefaultLabels[fmt] || fmt });
  const fmtDesc = (fmt) => t(`formats.${fmt.toLowerCase()}Desc`, { defaultValue: formatDefaultDesc[fmt] || '' });

  useEffect(() => {
    if (outputUrls && outputUrls[currentIndex]) setPreviewOpen(true);
  }, [outputUrls, currentIndex]);

  return (
    <div className="ic-view">
      <h2 className="hero-title">{t('hero.title')}</h2>
      <p className="hero-tagline">
        {t('hero.tagline')}{' '}<Link to="/blogs/image-converter-guide">{t('hero.blogLink')}</Link>
      </p>
              
      <div className="ir-tip-banner">
        <span className="ir-tip-text">{t('hint.text')}</span>
        <button className="ir-tip-btn" onClick={() => navigate('/image-resizer')}>
          {t('hint.btn')}
        </button>
      </div>

      {/* ── Details / How it works ── */}
      <div className="details-row" data-open={openPanel}>
        <div className="details-controls">
          <button
            className={`tab-btn ${openPanel === 'details' ? 'active' : ''}`}
            onClick={() => setOpenPanel((p) => (p === 'details' ? '' : 'details'))}
            aria-expanded={openPanel === 'details'}
            type="button"
          >
            {t('tabs.details')}
          </button>
          <button
            className={`tab-btn ${openPanel === 'howitworks' ? 'active' : ''}`}
            onClick={() => setOpenPanel((p) => (p === 'howitworks' ? '' : 'howitworks'))}
            aria-expanded={openPanel === 'howitworks'}
            type="button"
          >
            {t('tabs.howItWorks')}
          </button>
        </div>

        <div className={`shared-collapse${!openPanel ? ' panel-hidden' : ''}`}>
          <div className={openPanel !== 'details' ? 'details-content panel-hidden' : 'details-content'}>
            <h3>{t('guide.toolTitle', { defaultValue: 'What is Image Converter' })}</h3>
            <p>{t('guide.toolLead', { defaultValue: 'The Image Converter lets you convert images between common web formats — JPG, PNG, and WebP — directly in your browser. No file is ever sent to a server.' })}</p>

            <h3>{t('guide.outputFormatsTitle', { defaultValue: 'Supported Output Formats' })}</h3>
            <ul>
              <li><strong>{t('formats.jpg', { defaultValue: 'JPG' })}</strong> — {t('formats.jpgDesc', { defaultValue: 'Lossy compression ideal for photographs. Produces smaller files at the cost of some quality.' })}</li>
              <li><strong>{t('formats.png', { defaultValue: 'PNG' })}</strong> — {t('formats.pngDesc', { defaultValue: 'Lossless format that preserves every pixel. Supports transparency. Best for logos, screenshots, and graphics.' })}</li>
              <li><strong>{t('formats.webp', { defaultValue: 'WebP' })}</strong> — {t('formats.webpDesc', { defaultValue: 'Modern format by Google. Smaller files than JPG & PNG with great quality.' })}</li>
              <li><strong>{t('formats.avif', { defaultValue: 'AVIF' })}</strong> — {t('formats.avifDesc', { defaultValue: 'Next-gen format with superior compression. Supported in modern browsers.' })}</li>
              <li><strong>{t('formats.bmp', { defaultValue: 'BMP' })}</strong> — {t('formats.bmpDesc', { defaultValue: 'Uncompressed bitmap. Lossless, large file. Max compatibility.' })}</li>
              <li><strong>{t('formats.gif', { defaultValue: 'GIF' })}</strong> — {t('formats.gifDesc', { defaultValue: '256-color format. Best for simple graphics, not photos.' })}</li>
              <li><strong>{t('formats.ico', { defaultValue: 'ICO' })}</strong> — {t('formats.icoDesc', { defaultValue: 'Windows icon format. Automatically generates multiple sizes for favicons.' })}</li>
            </ul>

            <h3>{t('guide.inputFormatsTitle', { defaultValue: 'Supported Input Formats' })}</h3>
            <p>{t('guide.inputFormatsBody', { defaultValue: 'You can upload JPG, PNG, WebP, AVIF, GIF, BMP, ICO, SVG, and TIFF files. Animated GIFs are converted using the first frame only.' })}</p>

            <h3>{t('guide.howItWorksTitle', { defaultValue: 'How conversion works' })}</h3>
            <p>{t('guide.howItWorksBody', { defaultValue: "Your image is decoded in the browser, drawn onto an offscreen canvas, and exported to the target format. TIFF files are decoded using a lightweight JS library. For formats that don’t support transparency (JPG, BMP, GIF), transparent areas are filled with white." })}</p>

            <h3>{t('guide.faqTitle', { defaultValue: 'FAQs' })}</h3>
            <ul>
              <li><strong>{t('guide.faq.q1', { defaultValue: 'Does my image leave my browser?' })}</strong> {t('guide.faq.a1', { defaultValue: 'No. All processing is done locally; nothing is uploaded.' })}</li>
              <li><strong>{t('guide.faq.q2', { defaultValue: 'Why is AVIF not working?' })}</strong> {t('guide.faq.a2', { defaultValue: 'AVIF encoding requires a modern browser; older browsers may not support it.' })}</li>
              <li><strong>{t('guide.faq.q3', { defaultValue: 'What happens to transparency when converting to JPG, BMP, or GIF?' })}</strong> {t('guide.faq.a3', { defaultValue: 'Transparent areas are filled with white.' })}</li>
              <li><strong>{t('guide.faq.q4', { defaultValue: 'Why does GIF look bad for photos?' })}</strong> {t('guide.faq.a4', { defaultValue: 'GIF supports only 256 colors; use PNG or WebP for photos.' })}</li>
            </ul>
          </div>

          <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
            <ol style={{ margin: 0, paddingLeft: '1rem' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <img src="/images/screenshots/image-converter/image-converter-001.png" alt={t('howItWorks.imgAlt.step1', { defaultValue: 'Step 1' })} className="how-img" />
                <p>{t('howItWorks.step1', { defaultValue: 'Drag & drop an image onto the upload area, or click it to browse for a file.' })}</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <img src="/images/screenshots/image-converter/image-converter-002.png" alt={t('howItWorks.imgAlt.step2', { defaultValue: 'Step 2' })} className="how-img" />
                <p>{t('howItWorks.step2', { defaultValue: 'Select your desired output format from the format buttons. The tool auto-selects a sensible default based on your input.' })}</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <img src="/images/screenshots/image-converter/image-converter-003.png" alt={t('howItWorks.imgAlt.step3', { defaultValue: 'Step 3' })} className="how-img" />
                <p dangerouslySetInnerHTML={{ __html: t('howItWorks.step3a', { defaultValue: 'Click <strong>Convert</strong> to process the image instantly in your browser.' }) }} />
                <p dangerouslySetInnerHTML={{ __html: t('howItWorks.step3b', { defaultValue: 'Download your converted image with the <strong>Download</strong> button.' }) }} />
              </li>
              <li>
                <img src="/images/screenshots/image-converter/image-converter-004.png" alt={t('howItWorks.imgAlt.step4', { defaultValue: 'Step 4' })} className="how-img" />
                <p>{t('howItWorks.step4', { defaultValue: 'You can also convert multiple images at once by selecting more than one file.' })}</p>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* ── Drop zone ── */}
      <div
        className={`ic-drop-zone${isDragging ? ' dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        {mainImages && mainImages.length ? (
          (() => {
            const displayCount = Math.min(8, mainImages.length);
            const spacing = 22;
            const thumbW = 200;
            const containerW = (displayCount - 1) * spacing + thumbW + 8;
            return (
              <div
                className="ic-overlap-stack"
                onClick={(e) => { e.stopPropagation(); }}
                style={{ width: containerW }}
              >
                {mainImages.slice(0, displayCount).map((f, i) => {
                  const left = i * spacing - ((displayCount - 1) * spacing) / 2 + (containerW / 2 - thumbW / 2);
                  return (
                    <img
                      key={i}
                      src={URL.createObjectURL(f)}
                      alt={`upload-${i}`}
                      className="ic-stacked-thumb"
                      style={{ left: `${left}px`, zIndex: 1 + i }}
                      onClick={(ev) => { ev.stopPropagation(); setCurrentIndex(i); }}
                    />
                  );
                })}
                {mainImages.length > 8 && (
                  <div
                    className="ic-stack-more"
                    style={{ left: `${displayCount * spacing - ((displayCount - 1) * spacing) / 2 + (containerW / 2 - thumbW / 2)}px` }}
                  >
                    +{mainImages.length - 8}
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          <div className="ic-drop-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span className="ic-drop-text">{t('dropZone.text')}</span>
            <span className="ic-drop-hint">{t('dropZone.hint')}</span>
          </div>
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

      {/* ── File row ── */}
      {mainImages && mainImages.length > 0 && (
        <div className="ic-file-row">
          <span className="ic-file-name">
            {mainImages.length === 1 ? mainImages[0].name : t('fileRow.count', { count: mainImages.length })}
          </span>
          <button
            type="button"
            className="ic-change-btn"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            {mainImages.length === 1 ? t('fileRow.changeOne') : t('fileRow.changeMany')}
          </button>
          <button type="button" className="ic-clear-btn" onClick={handleClear}>
            {t('fileRow.clear')}
          </button>
        </div>
      )}

      {/* ── Preview popup ── */}
      {previewOpen && outputUrls && outputUrls.length > 0 && outputUrls[currentIndex] && (
        <div className="ic-popup-overlay" onClick={() => setPreviewOpen(false)}>
          <div className="ic-popup-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="ic-popup-close-btn" onClick={() => setPreviewOpen(false)}>&times;</button>
            <p className="ic-output-label" style={{ margin: '0 0 0.5rem' }}>
              &#10003; Converted to {convertedFormat}
              {outputUrls.length > 1 && ` (${currentIndex + 1} / ${outputUrls.length})`}
            </p>
            <DraggablePreview src={outputUrls[currentIndex]} alt={`Converted output ${currentIndex + 1}`} />
            {outputUrls.length > 1 && (
              <>
                <button
                  className="ic-btn ic-popup-nav-btn ic-popup-nav-prev"
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                >
              {t('popup.prev')}
                </button>
                <button
                  className="ic-btn ic-popup-nav-btn ic-popup-nav-next"
                  onClick={() => setCurrentIndex((i) => Math.min(outputUrls.length - 1, i + 1))}
                  disabled={currentIndex >= outputUrls.length - 1}
                >
              {t('popup.next')}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Format selector ── */}
      <div className="ic-format-section">
        <p className="ic-format-label">{t('format.label')}</p>
        <div className="ic-format-buttons">
          {availableFormats.map((fmt) => (
            <button
              key={fmt}
              type="button"
              className={`ic-format-btn${outputFormat === fmt ? ' active' : ''}`}
              onClick={() => setOutputFormat(fmt)}
            >
              <span className="ic-fmt-name">{fmtLabel(fmt)}</span>
              <span className="ic-fmt-desc">{fmtDesc(fmt)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── ICO size picker ── */}
      {outputFormat === 'ICO' && (
        <div className="ic-ico-sizes">
          <p className="ic-ico-sizes-label">{t('icoSize.label')}</p>
          <div className="ic-ico-sizes-options">
            {[16, 32, 48, 256].map((sz) => (
              <label key={sz} className="ic-ico-size-check">
                <input
                  type="radio"
                  name="ico-size"
                  checked={icoSize === sz}
                  onChange={() => setIcoSize(sz)}
                />
                {sz}×{sz}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="ic-actions">
        <button
          className="ic-btn ic-btn-primary"
          onClick={handleConvertAll}
          disabled={!mainImages.length || status === 'processing'}
        >
          {status === 'processing'
            ? t('actions.converting')
            : mainImages.length > 1
              ? t('actions.convertAll', { count: mainImages.length })
              : t('actions.convert')}
        </button>
        {mainImages.length <= 1 && outputUrls && outputUrls[0] && (
          <button
            className="ic-btn ic-btn-download"
            onClick={() => {
              const link = document.createElement('a');
              link.href = outputUrls[0];
              link.download = outputNames[0] || 'converted-image';
              document.body.appendChild(link);
              link.click();
              link.remove();
            }}
          >
            {t('actions.download')}
          </button>
        )}
        {mainImages.length > 1 && outputUrls && outputUrls.some(Boolean) && (
          <button
            className="ic-btn ic-btn-download"
            onClick={async () => {
              const zip = new JSZip();
              const fetches = outputUrls.map((url, i) => {
                if (!url) return null;
                return fetch(url).then((r) => r.blob()).then((blob) => {
                  zip.file(outputNames[i] || `converted-${i + 1}`, blob);
                });
              });
              await Promise.all(fetches.filter(Boolean));
              const blob = await zip.generateAsync({ type: 'blob' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'converted-images.zip';
              document.body.appendChild(link);
              link.click();
              link.remove();
            }}
          >
            {t('actions.downloadAll')}
          </button>
        )}
      </div>

      {/* ── Error ── */}
      {errorMsg && (
        <div className="ic-error" role="alert">{errorMsg}</div>
      )}

      {/* ── Guide: Why Image Formats Matter ── */}
      <section className="ic-guide ic-guide-convert">
        <div className="ic-guide-article">
          <h3 className="ic-guide-title">{t('guide.title', { defaultValue: 'Why Image Formats Matter (And How to Convert Images the Right Way)' })}</h3>

          <p className="ic-lead">{t('guide.introLead', { defaultValue: 'You try to upload an image… and suddenly:' })}</p>
          <ul className="ic-bullet-list">
            <li>{t('guide.introBullet1', { defaultValue: '"File format not supported"' })}</li>
            <li>{t('guide.introBullet2', { defaultValue: "Image won’t open on another device" })}</li>
            <li>{t('guide.introBullet3', { defaultValue: 'File size is too large' })}</li>
          </ul>

          <p>{t('guide.introConclusion', { defaultValue: "These issues usually come down to one thing: image format. In this guide you’ll learn why formats exist, when to convert them, which format to choose, and how to convert without losing quality." })}</p>


          <section className='ic-section'>
          <h4>{t('guide.why.heading', { defaultValue: 'Why Do Image Formats Even Exist?' })}</h4>
          <p>{t('guide.why.body', { defaultValue: 'Different formats exist because they serve different purposes: performance (smaller file size), quality (more detail), and compatibility (works everywhere). One format rarely fits all situations.' })}</p>
          </section>

          <section className='ic-section'>
          <h4>{t('guide.whatIs.heading', { defaultValue: 'What Is Image Conversion?' })}</h4>
          <p>{t('guide.whatIs.body', { defaultValue: 'Image conversion means changing an image from one format to another (for example PNG → JPG or HEIC → JPG). The image content stays the same, but file size, quality, and compatibility can change.' })}</p>
          </section>

          <section className='ic-section'>
          <h4>{t('guide.whenToConvert.heading', { defaultValue: 'When Do You Need to Convert Images?' })}</h4>
          <ol className="ic-quick-steps">
            <li>{t('guide.whenToConvert.item1', { defaultValue: 'Upload Errors: Some platforms accept only specific formats.' })}</li>
            <li>{t('guide.whenToConvert.item2', { defaultValue: 'File Size Too Large: Convert heavy formats like PNG to JPG/WebP to reduce size.' })}</li>
            <li>{t('guide.whenToConvert.item3', { defaultValue: 'Device Compatibility: Convert HEIC from iPhones to JPG for wider support.' })}</li>
            <li>{t('guide.whenToConvert.item4', { defaultValue: 'Web Optimization: Modern sites prefer WebP for smaller files and faster loading.' })}</li>
          </ol>
          </section>

          <section className='ic-section'>
          <h4>{t('guide.formats.heading', { defaultValue: 'Most Common Image Formats (Quick Guide)' })}</h4>
          <div className="ic-format-grid">
            <div className="ic-format-pill ic-pill-jpg">{t('guide.formats.jpg', { defaultValue: 'JPEG (JPG) — Best for photos — small files, no transparency' })}</div>
            <div className="ic-format-pill ic-pill-png">{t('guide.formats.png', { defaultValue: 'PNG — High quality, supports transparency' })}</div>
            <div className="ic-format-pill ic-pill-webp">{t('guide.formats.webp', { defaultValue: 'WebP — Modern — smaller size with good quality' })}</div>
            <div className="ic-format-pill ic-pill-heic">{t('guide.formats.heic', { defaultValue: 'HEIC — Used by iPhones — efficient but limited support' })}</div>
          </div>
          </section>

          <section className='ic-section'>
          <h4>{t('guide.bestPractices.heading', { defaultValue: 'Best Practices for Converting Images' })}</h4>
          <ul className="ic-checklist">
            <li>{t('guide.bestPractices.item1', { defaultValue: 'Choose format by use case — WebP for web, JPG for photos, PNG for graphics.' })}</li>
            <li>{t('guide.bestPractices.item2', { defaultValue: 'Avoid repeated conversions — always convert from the original.' })}</li>
            <li>{t('guide.bestPractices.item3', { defaultValue: 'Understand lossy vs lossless: JPG is lossy, PNG is lossless.' })}</li>
            <li>{t('guide.bestPractices.item4', { defaultValue: 'Balance quality and size — pick a middle ground.' })}</li>
            <li>{t('guide.bestPractices.item5', { defaultValue: 'Use a reliable tool that preserves quality and supports many formats.' })}</li>
          </ul>
          </section>

          <section className='ic-section'>
          <h4>{t('guide.mistakes.heading', { defaultValue: 'Common Mistakes to Avoid' })}</h4>
          <ul className="ic-xlist">
            <li>{t('guide.mistakes.item1', { defaultValue: 'Converting PNG → JPG (losing transparency)' })}</li>
            <li>{t('guide.mistakes.item2', { defaultValue: 'Repeatedly converting the same file' })}</li>
            <li>{t('guide.mistakes.item3', { defaultValue: 'Using the wrong format for the use case' })}</li>
            <li>{t('guide.mistakes.item4', { defaultValue: 'Ignoring quality settings' })}</li>
            <li>{t('guide.mistakes.item5', { defaultValue: 'Uploading huge images without optimization' })}</li>
          </ul>
          </section>

          <section className='ic-section'>
          <h4>{t('guide.stepByStep.heading', { defaultValue: 'Step-by-Step: How to Convert an Image' })}</h4>
          <ol className="ic-steps-compact">
            <li>{t('guide.stepByStep.step1', { defaultValue: 'Upload your image' })}</li>
            <li>{t('guide.stepByStep.step2', { defaultValue: 'Select output format' })}</li>
            <li>{t('guide.stepByStep.step3', { defaultValue: 'Adjust quality settings (if available)' })}</li>
            <li>{t('guide.stepByStep.step4', { defaultValue: 'Convert the image' })}</li>
            <li>{t('guide.stepByStep.step5', { defaultValue: 'Download the result' })}</li>
          </ol>
          </section>

          <p className="ic-conclusion">{t('guide.conclusion', { defaultValue: "Image conversion isn’t just technical — it’s essential for compatibility, performance, and usability. By picking the right format you can avoid upload errors, improve speed, and keep good quality." })}</p>
        </div>

        <aside className="ic-guide-aside">
          <div className="ic-aside-card">
            <h5>{t('guide.asideTitle', { defaultValue: 'Quick Actions' })}</h5>
            <p className="muted">{t('guide.asideDesc', { defaultValue: 'Ready to convert? Jump straight to the tool.' })}</p>
            <button
              type="button"
              className="ic-guide-cta"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {t('guide.ctaBtn', { defaultValue: 'Use the Image Converter Tool' })}
            </button>

            <h6>{t('guide.useCases.heading', { defaultValue: 'Real-World Use Cases' })}</h6>
            <ul className="ic-mini-list">
              <li>{t('guide.useCases.item1', { defaultValue: 'Website optimization — PNG → WebP' })}</li>
              <li>{t('guide.useCases.item2', { defaultValue: 'Social uploads — convert to supported formats' })}</li>
              <li>{t('guide.useCases.item3', { defaultValue: 'Business docs — ensure cross-system compatibility' })}</li>
              <li>{t('guide.useCases.item4', { defaultValue: 'iPhone photos — HEIC → JPG for sharing' })}</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
