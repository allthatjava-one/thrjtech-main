import { Link } from 'react-router-dom'
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import CustomSelect from '../../commons/CustomSelect';
import { useTranslation } from 'react-i18next';

export function ImageCropView(props) {
  const {
    imageSrc,
    crop,
    setCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    flipH,
    handleFlipH,
    flipV,
    handleFlipV,
    aspect,
    setAspect,
    onCropComplete,
    naturalAspect,
    outputUrl,
    handleDownload,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    imageFileName,
    handleClear,
    setPreset,
    handleReset,
  } = props;

  const navigate = useNavigate();
  const { t } = useTranslation('imageCrop');

  const [selectValue, setSelectValue] = useState(() => (aspect ? String(aspect) : String(4 / 3)));
  const [customW, setCustomW] = useState(4);
  const [customH, setCustomH] = useState(3);
  const normalizePositiveInt = (v) => {
    const n = Number(v);
    if (!isFinite(n) || n <= 0) return 1;
    return Math.max(1, Math.round(n));
  };

  // Ensure inputs reflect initial selection (if default is preset)
  useEffect(() => {
    try {
      const val = Number(selectValue);
      if (selectValue !== '' && isFinite(val) && val > 0) {
        // Try to map common presets to integer w/h where possible
        const map = {
          [String(1)]: [1, 1],
          [String(4 / 3)]: [4, 3],
          [String(16 / 9)]: [16, 9],
          [String(9 / 16)]: [9, 16],
          [String(4 / 5)]: [4, 5],
          [String(2 / 3)]: [2, 3],
          [String(3 / 1)]: [3, 1],
          [String(1.91)]: [191, 100],
        };
        const pair = map[String(selectValue)];
        if (pair) {
          setCustomW(pair[0]);
          setCustomH(pair[1]);
        }
      }
    } catch (err) {
      // ignore
    }
    // run on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [hasCropEdited, setHasCropEdited] = useState(false);
  const [openPanel, setOpenPanel] = useState('');
  const cropContainerRef = useRef(null);
  const [cropperHeight, setCropperHeight] = useState(520);

  const onCropCompleteInternal = useCallback((croppedArea, croppedAreaPixels) => {
    setHasCropEdited(true);
    onCropComplete(croppedArea, croppedAreaPixels);
  }, [onCropComplete]);

  // Mark as edited whenever any crop parameter changes so actions enable immediately
  useEffect(() => {
    if (!imageSrc) return;
    if (!hasCropEdited) setHasCropEdited(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop, zoom, rotation, flipH, flipV, selectValue, customW, customH]);

  // Compute the aspect used by the Cropper: if a preset is selected use that number,
  // otherwise use the custom width/height ratio.
  const isPreset = selectValue !== '';
  const cropperAspect = isPreset ? Number(selectValue) : (customH > 0 ? (customW / customH) : undefined);

  // Propagate aspect changes to parent
  useEffect(() => {
    try {
      setAspect(cropperAspect);
    } catch (err) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectValue, customW, customH]);

  const download = async () => {
    setProcessing(true);
    await handleDownload();
    setProcessing(false);
  };

  // Wait for `outputUrl` prop to become available (polling) after calling handleDownload
  const waitForOutputUrl = (timeout = 3000) => new Promise((resolve, reject) => {
    const start = Date.now();
    const iv = setInterval(() => {
      if (outputUrl) {
        clearInterval(iv);
        resolve(outputUrl);
      } else if (Date.now() - start > timeout) {
        clearInterval(iv);
        reject(new Error('timeout'));
      }
    }, 100);
  });

  // Trigger download: ensure outputUrl is generated then download
  const triggerDownload = async () => {
    setProcessing(true);
    try {
      let url = outputUrl;
      if (!url) {
        const res = await handleDownload();
        url = res && res.url ? res.url : outputUrl;
      }
      if (!url) return;
      const link = document.createElement('a');
      link.href = url;
      link.download = imageSrc ? 'cropped.png' : 'cropped.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      // ignore
    }
    setProcessing(false);
  };

  const handleSendToMeme = async () => {
    setProcessing(true);
    try {
      let url = outputUrl;
      if (!url) {
        const res = await handleDownload();
        url = res && res.url ? res.url : outputUrl;
      }
      if (!url) return;
      const resp = await fetch(url);
      const blob = await resp.blob();
      const file = new File([blob], 'cropped.png', { type: blob.type || 'image/png' });
      navigate('/image-meme-generator', { state: { mainImage: file } });
    } catch (err) {
      // ignore
    }
    setProcessing(false);
  };

  const handleWheel = (e) => {
    if (!e.altKey) return;
    e.preventDefault();
    // make wheel more responsive: scale delta and apply two-decimal rounding
    const delta = -e.deltaY / 300;
    setZoom((z) => {
      const next = z + delta;
      const rounded = Math.round(next * 100) / 100;
      return Math.min(3, Math.max(0.5, rounded));
    });
  };

  // Adjust cropper height to match the ORIGINAL image's natural ratio.
  // Uses ResizeObserver so it re-fires whenever the container width changes
  // (e.g. mobile layout reflow), not just when naturalAspect changes.
  useEffect(() => {
    const el = cropContainerRef.current;
    if (!el) return;

    function recalc() {
      const width = el.clientWidth || el.offsetWidth || 600;
      const a = naturalAspect ?? (4 / 3);
      const h = Math.max(200, Math.min(600, Math.round(width / a)));
      setCropperHeight(h);
    }

    recalc();

    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [naturalAspect]);

  // Attach a capture-phase, non-passive wheel listener so Alt+Scroll is
  // handled even when nested components (like the Cropper) stop or
  // consume the React onWheel event.
  useEffect(() => {
    const el = cropContainerRef.current;
    if (!el) return;
    const listener = (e) => {
      try {
        // forward to our handler
        handleWheel(e);
      } catch (err) {
        // ignore
      }
    };
    el.addEventListener('wheel', listener, { passive: false, capture: true });
    return () => el.removeEventListener('wheel', listener, { capture: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropContainerRef.current]);

  return (
    <div className="image-crop-view">
      <h2 className="hero-title">{t('hero.title')}</h2>
      <p className="hero-tagline">{t('hero.tagline')}{' '}
        <Link to="/blogs/image-crop-guide">{t('hero.blogLink')}</Link></p>

      <div className="ir-tip-banner">
        <span className="ir-tip-text">{t('hint.text')}</span>
        <button className="ir-tip-btn" onClick={() => navigate('/image-meme-generator')}>
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
                <h3>{t('details.whatIs.heading', { defaultValue: 'What is Image Crop' })}</h3>
                <p>{t('details.whatIs.body', { defaultValue: 'The Image Crop tool provides an interactive way to select and export a rectangular portion of an image. It offers zoom, rotation, and flip controls, aspect ratio presets for common targets (social, profile, banners), and a preview step so you can confirm the crop before downloading. All transformation and export operations are performed in your browser using an offscreen canvas; your original file does not leave your device unless you explicitly share or upload it.' })}</p>

                <h3>{t('details.howWorks.heading', { defaultValue: 'How cropping works' })}</h3>
                <p>{t('details.howWorks.body', { defaultValue: 'After loading an image the editor displays a resizable crop overlay. You can drag the overlay to reposition it, resize using handles, or pick one of the provided aspect ratios for exact output dimensions. Zooming and rotation let you refine framing; flips mirror the image horizontally or vertically. When you click Preview or Download the selected region is rendered to an offscreen canvas with any transforms applied, and the result is exported as a PNG file for immediate download.' })}</p>

                <h3>{t('details.presets.heading', { defaultValue: 'Presets and precision' })}</h3>
                <ul>
                  <li><strong>{t('details.presets.item1.title', { defaultValue: '1:1 (Profile)' })}</strong> — {t('details.presets.item1.body', { defaultValue: 'Ideal for avatars and profile photos.' })}</li>
                  <li><strong>{t('details.presets.item2.title', { defaultValue: '16:9 (Widescreen)' })}</strong> — {t('details.presets.item2.body', { defaultValue: 'Useful for video thumbnails, banners, and widescreen presentations.' })}</li>
                  <li><strong>{t('details.presets.item3.title', { defaultValue: '4:5 (Portrait)' })}</strong> — {t('details.presets.item3.body', { defaultValue: 'A common format for social feeds and portrait-oriented content.' })}</li>
                  <li><strong>{t('details.presets.item4.title', { defaultValue: 'Free' })}</strong> — {t('details.presets.item4.body', { defaultValue: 'No constraints; crop to any dimensions you need.' })}</li>
                </ul>

                <h3>{t('details.practical.heading', { defaultValue: 'Practical tips' })}</h3>
                <ul>
                  <li>{t('details.practical.item1', { defaultValue: 'Use the aspect-lock to keep exact proportions when resizing the crop area.' })}</li>
                  <li>{t('details.practical.item2', { defaultValue: 'For pixel-perfect exports, set the desired output resolution after choosing the crop area, then preview at 100% if possible.' })}</li>
                  <li>{t('details.practical.item3', { defaultValue: 'If you need to crop many images the same way, note the preset values so you can repeat the process consistently.' })}</li>
                </ul>

                <h3>{t('details.useful.heading', { defaultValue: 'Useful when' })}</h3>
                <ul>
                  <li>{t('details.useful.item1', { defaultValue: 'preparing profile pictures or social media assets to exact dimensions.' })}</li>
                  <li>{t('details.useful.item2', { defaultValue: 'removing unwanted borders, background, or distracting elements from a photo.' })}</li>
                  <li>{t('details.useful.item3', { defaultValue: 'cropping a screenshot to a specific region for docs or presentations.' })}</li>
                  <li>{t('details.useful.item4', { defaultValue: 'quickly re-framing a photo without opening a desktop image editor.' })}</li>
                </ul>
                
                <h3>{t('details.accessibility.heading', { defaultValue: 'Accessibility & privacy' })}</h3>
                <p>{t('details.accessibility.body', { defaultValue: 'Controls are keyboard accessible and sized for touch interaction; the preview dialog helps users of all devices confirm changes. Because cropping is performed locally, your images remain private unless you choose to upload them as part of a sharing workflow.' })}</p>

                <h3>{t('details.faq.heading', { defaultValue: 'FAQs' })}</h3>
                <ul>
                  <li><strong>{t('details.faq.q1', { defaultValue: 'Q: Is my image uploaded anywhere?' })}</strong> <strong>{t('details.faq.a1', { defaultValue: 'A: No — all cropping runs client-side in your browser. Your image never leaves your device.' })}</strong></li>
                  <li><strong>{t('details.faq.q2', { defaultValue: 'Q: What formats are supported?' })}</strong> <strong>{t('details.faq.a2', { defaultValue: 'A: You can load any image format the browser supports (JPEG, PNG, WebP, GIF, etc.). The cropped output is always exported as PNG.' })}</strong></li>
                  <li><strong>{t('details.faq.q3', { defaultValue: 'Q: Can I undo a crop?' })}</strong> <strong>{t('details.faq.a3', { defaultValue: 'A: Yes — simply adjust the crop selection and click Preview again to regenerate the output before downloading.' })}</strong></li>
                  <li><strong>{t('details.faq.q4', { defaultValue: 'Q: Why does the download button stay greyed out?' })}</strong> <strong>{t('details.faq.a4', { defaultValue: 'A: Click Preview first to generate a cropped image, then the Download button becomes active.' })}</strong></li>
                </ul>
              </div>

            <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
                <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/images/screenshots/crop/crop_001.png" alt={t('howItWorks.imgAlt.step1', { defaultValue: 'Step 1' })} className="how-img" />
                    <p>{t('howItWorks.step1', { defaultValue: 'Load an image by dragging and dropping it onto the crop area, or click to browse your files.' })}</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/images/screenshots/crop/crop_002.png" alt={t('howItWorks.imgAlt.step2', { defaultValue: 'Step 2' })} className="how-img" />
                    <p>{t('howItWorks.step2', { defaultValue: 'Drag and resize the crop overlay to select the region you want to keep. Choose an aspect ratio preset or use Free mode.' })}</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/images/screenshots/crop/crop_003.png" alt={t('howItWorks.imgAlt.step3', { defaultValue: 'Step 3' })} className="how-img" />
                    <p>{t('howItWorks.step3', { defaultValue: 'Optionally adjust zoom, rotation, and flip to fine-tune the framing before cropping.' })}</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/images/screenshots/crop/crop_004.png" alt={t('howItWorks.imgAlt.step4', { defaultValue: 'Step 4' })} className="how-img" />
                    <p>{t('howItWorks.step4', { defaultValue: 'Click Preview to generate the cropped image and inspect the result in the preview dialog.' })}</p>
                  </li>
                  <li>
                    <p>{t('howItWorks.step5', { defaultValue: 'Click Download to save the cropped PNG to your device.' })}</p>
                  </li>
                </ol>
              </div>
          </div>
      </div>

      {/* send-to-meme box moved to bottom of main content (rendered later) */}

      <div className="crop-area">
        <div className="crop-drop-wrapper">
        <div
          className="drop-zone crop-drop"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          ref={cropContainerRef}
          onWheel={handleWheel}
        >
          {imageSrc ? (
            <div
              className="cropper-wrap"
              style={{ height: cropperHeight }}
              onClick={(e) => e.stopPropagation()}
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={cropperAspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropCompleteInternal}
                cropShape="rect"
                showGrid
                minZoom={0.5}
                restrictPosition={false}
              />
            </div>
          ) : (
            <span className="hero-tagline">{t('dropZone.text')}</span>
          )}
          <input type="file" accept="image/*,.heic,.heif" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileInput} />
        </div>

        {/* File row: filename + Change Image + Clear */}
        {imageSrc && (
          <div className="crop-file-row">
            <span className="crop-file-name">{imageFileName || 'Image loaded'}</span>
            <button
              type="button"
              className="crop-change-btn"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              {t('fileRow.change')}
            </button>
            <button type="button" className="crop-clear-btn" onClick={handleClear}>
              {t('fileRow.clear')}
            </button>
          </div>
        )}
        </div>

      <div className="crop-controls">
          <div className="control-row">
            <label>{t('controls.zoom')}</label>
            <input type="range" min="0.5" max="3" step="0.01" value={zoom} onChange={e => setZoom(Number(e.target.value))} />
          </div>
          <div className="control-row">
            <label>{t('controls.rotation')}</label>
            <button type="button" onClick={() => setRotation((r) => r - 90)} aria-label="rotate-left">⟲</button>
            <button type="button" onClick={() => setRotation((r) => r + 90)} aria-label="rotate-right">⟳</button>
            <span style={{ marginLeft: 8 }}>{rotation}°</span>
          </div>
          <div className="control-row">
            <label>{t('controls.flip')}</label>
            <button type="button" onClick={handleFlipH} aria-pressed={flipH}>{t('controls.horizontal')}</button>
            <button type="button" onClick={handleFlipV} aria-pressed={flipV}>{t('controls.vertical')}</button>
          </div>
          <div className="control-row">
            <label>{t('controls.aspect')}</label>
            {
              (() => {
                const aspectOptions = [
                  { value: '', label: t('aspectOptions.custom'), w: 0, h: 0, id: 'custom' },
                  { value: String(1), label: t('aspectOptions.profile'), w: 1, h: 1, id: 'profile' },
                  { value: String(4 / 3), label: t('aspectOptions.standard'), w: 4, h: 3, id: 'standard' },
                  { value: String(16 / 9), label: t('aspectOptions.widescreen'), w: 16, h: 9, id: 'widescreen' },
                  { value: String(9 / 16), label: t('aspectOptions.story'), w: 9, h: 16, id: 'story' },
                  { value: String(4 / 5), label: t('aspectOptions.instagram'), w: 4, h: 5, id: 'instagram' },
                  { value: String(2 / 3), label: t('aspectOptions.pinterest'), w: 2, h: 3, id: 'pinterest' },
                  { value: String(3 / 1), label: t('aspectOptions.blog'), w: 3, h: 1, id: 'blog' },
                  { value: String(1.91), label: t('aspectOptions.facebook'), w: 191, h: 100, id: 'facebook' },
                ];

                return (
                  <CustomSelect
                    value={selectValue}
                    onChange={v => {
                      setSelectValue(v);
                      const opt = aspectOptions.find(o => o.value === v);
                      if (!opt || v === '') {
                        setPreset('custom');
                        setCustomW(4);
                        setCustomH(3);
                      } else {
                        setCustomW(opt.w || 1);
                        setCustomH(opt.h || 1);
                        setPreset(opt.id || 'preset');
                      }
                    }}
                    options={aspectOptions.map(o => ({ value: o.value, label: o.label }))}
                  />
                );
              })()
            }
          </div>

          {!isPreset && <div className="control-row aspect-inputs" style={{ alignItems: 'center', gap: 8 }}>
            <label style={{ minWidth: 90 }}>{t('controls.ratio')}</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="number"
                min={1}
                value={(() => {
                  try {
                    if (isPreset) {
                      const parts = decimalToRatio(Number(selectValue)).split(':');
                      return parts[0] || '';
                    }
                    return customW || '';
                  } catch (err) { return '' }
                })()}
                onChange={(e) => {
                  const w = e.target.value === '' ? '' : Number(e.target.value);
                  setCustomW(w === '' ? '' : w);
                }}
                onBlur={() => setCustomW(normalizePositiveInt(customW))}
                disabled={isPreset}
                style={{
                  width: 90,
                  padding: '0.4rem',
                  backgroundColor: isPreset ? '#f3f4f6' : undefined,
                  border: isPreset ? '1px solid #d1d5db' : undefined,
                  color: isPreset ? '#6b7280' : undefined,
                  cursor: isPreset ? 'not-allowed' : 'text'
                }}
              />
              <span style={{ color: '#6b7280' }}>:</span>
              <input
                type="number"
                min={1}
                value={(() => {
                  try {
                    if (isPreset) {
                      const parts = decimalToRatio(Number(selectValue)).split(':');
                      return parts[1] || '';
                    }
                    return customH || '';
                  } catch (err) { return '' }
                })()}
                onChange={(e) => {
                  const h = e.target.value === '' ? '' : Number(e.target.value);
                  setCustomH(h === '' ? '' : h);
                }}
                onBlur={() => setCustomH(normalizePositiveInt(customH))}
                disabled={isPreset}
                style={{
                  width: 90,
                  padding: '0.4rem',
                  backgroundColor: isPreset ? '#f3f4f6' : undefined,
                  border: isPreset ? '1px solid #d1d5db' : undefined,
                  color: isPreset ? '#6b7280' : undefined,
                  cursor: isPreset ? 'not-allowed' : 'text'
                }}
              />
            </div>
          </div>}

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="resize-btn" onClick={async () => { await download(); setPreviewOpen(true); }} disabled={processing || !imageSrc}>{processing ? t('actions.processing') : t('actions.preview')}</button>
            <button className="resize-btn reset-btn" onClick={() => { handleReset(); setPreviewOpen(false); setHasCropEdited(false); }} disabled={!imageSrc} style={{ marginLeft: 8 }}>{t('actions.reset')}</button>
            <button
              className={`download-btn ${!outputUrl ? 'disabled' : ''}`}
              onClick={triggerDownload}
              disabled={!(outputUrl || hasCropEdited)}
            >
              {t('actions.download')}
            </button>
          </div>

          {/* Moved below so this control spans the main content area */}

          {previewOpen && outputUrl && (
            <div className="image-popup-overlay" onClick={() => setPreviewOpen(false)}>
              <div className="image-popup-dialog" onClick={e => e.stopPropagation()}>
                <img src={outputUrl} alt="Preview" className="image-popup-img" />
                <button className="close-popup-btn" onClick={() => setPreviewOpen(false)}>&times;</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action block: appears only after a crop output is generated */}
      {(outputUrl || hasCropEdited) && (
        <div className="send-action">
          <span className="send-text">{t('sendToMeme.text')}</span>
          <button
            className="send-btn"
            onClick={handleSendToMeme}
            disabled={!(outputUrl || hasCropEdited)}
          >
            {t('sendToMeme.btn')}
          </button>
        </div>
      )}

      {/* ── Guide Article for Image Crop ── */}
      <div className="ic-guide">
        <div className="ic-guide-intro">
          <h2 className="ic-guide-title">{t('guide.title', { defaultValue: 'How to Crop Images Perfectly (Without Losing Quality or Composition)' })}</h2>
          <p className="ic-guide-lead">{t('guide.lead', { defaultValue: 'Cropping an image is one of the simplest edits you can make — but it has a huge impact on how your image looks and communicates.' })}</p>
          <div className="ic-guide-learn-box">
            <span className="ic-guide-learn-label">{t('guide.learnLabel', { defaultValue: "In this guide, you'll learn:" })}</span>
            <ul className="ic-guide-learn-list">
              <li>{t('guide.learnItems.item1', { defaultValue: 'How image cropping works' })}</li>
              <li>{t('guide.learnItems.item2', { defaultValue: 'When to use it' })}</li>
              <li>{t('guide.learnItems.item3', { defaultValue: 'How to crop properly without ruining quality' })}</li>
            </ul>
          </div>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.whatIs.heading', { defaultValue: 'What Is Image Cropping?' })}</h3>
          <p>{t('guide.whatIs.body', { defaultValue: 'Image cropping is the process of removing unwanted outer areas of an image to improve composition or adjust size. Instead of resizing the entire image, cropping lets you cut out unnecessary parts, focus on the subject, and change the aspect ratio.' })}</p>
          <p><em>{t('guide.whatIs.analogy', { defaultValue: 'Think of it as framing your image after it’s already taken.' })}</em></p>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.why.heading', { defaultValue: 'Why Cropping Matters' })}</h3>
          <div className="ic-guide-cards">
            <div className="ic-guide-card">
              <span className="ic-guide-card-num">1</span>
              <div><p>{t('guide.why.focus', { defaultValue: 'Focus on the Subject — Cropping removes distractions and highlights the most important part of the image.' })}</p></div>
            </div>
            <div className="ic-guide-card">
              <span className="ic-guide-card-num">2</span>
              <div><p>{t('guide.why.composition', { defaultValue: 'Improve Composition — Use cropping to balance the image, apply the rule of thirds, and create a cleaner layout.' })}</p></div>
            </div>
            <div className="ic-guide-card">
              <span className="ic-guide-card-num">3</span>
              <div><p>{t('guide.why.platform', { defaultValue: 'Fit Platform Requirements — Different platforms need different sizes; crop to square, vertical, or landscape to avoid distortion.' })}</p></div>
            </div>
          </div>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.croppingVsResizing.heading', { defaultValue: 'Cropping vs Resizing' })}</h3>
          <table className="ic-guide-table">
            <thead><tr><th>{t('guide.croppingVsResizing.col1', { defaultValue: 'Feature' })}</th><th>{t('guide.croppingVsResizing.col2', { defaultValue: 'Cropping' })}</th><th>{t('guide.croppingVsResizing.col3', { defaultValue: 'Resizing' })}</th></tr></thead>
            <tbody>
              <tr><td>{t('guide.croppingVsResizing.row1col1', { defaultValue: 'What it does' })}</td><td>{t('guide.croppingVsResizing.row1col2', { defaultValue: 'Removes part of image' })}</td><td>{t('guide.croppingVsResizing.row1col3', { defaultValue: 'Scales entire image' })}</td></tr>
              <tr><td>{t('guide.croppingVsResizing.row2col1', { defaultValue: 'Keeps full content' })}</td><td>{t('guide.croppingVsResizing.row2col2', { defaultValue: 'No' })}</td><td>{t('guide.croppingVsResizing.row2col3', { defaultValue: 'Yes' })}</td></tr>
              <tr><td>{t('guide.croppingVsResizing.row3col1', { defaultValue: 'Changes composition' })}</td><td>{t('guide.croppingVsResizing.row3col2', { defaultValue: 'Yes' })}</td><td>{t('guide.croppingVsResizing.row3col3', { defaultValue: 'No' })}</td></tr>
              <tr><td>{t('guide.croppingVsResizing.row4col1', { defaultValue: 'Use case' })}</td><td>{t('guide.croppingVsResizing.row4col2', { defaultValue: 'Focus / framing' })}</td><td>{t('guide.croppingVsResizing.row4col3', { defaultValue: 'File size / dimensions' })}</td></tr>
            </tbody>
          </table>
          <p>{t('guide.croppingVsResizing.tip', { defaultValue: 'Best practice: Crop first → then resize if needed.' })}</p>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.bestPractices.heading', { defaultValue: 'Best Practices for Cropping' })}</h3>
          <div className="ic-guide-best-list">
            <div className="ic-guide-best-item"><span className="ic-guide-best-icon">✅</span><p>{t('guide.bestPractices.item1', { defaultValue: 'Keep the Subject Clear — Ensure the main subject is centered or well-positioned and not cut awkwardly.' })}</p></div>
            <div className="ic-guide-best-item"><span className="ic-guide-best-icon">✅</span><p>{t('guide.bestPractices.item2', { defaultValue: 'Maintain Aspect Ratio — Use fixed ratios (1:1, 16:9, 4:5) when targeting specific platforms.' })}</p></div>
            <div className="ic-guide-best-item"><span className="ic-guide-best-icon">✅</span><p>{t('guide.bestPractices.item3', { defaultValue: "Don't Crop Too Much — Excessive cropping reduces resolution and may make images blurry." })}</p></div>
            <div className="ic-guide-best-item"><span className="ic-guide-best-icon">✅</span><p>{t('guide.bestPractices.item4', { defaultValue: 'Leave Breathing Space — Avoid tight crops—leave slight spacing around the subject for a natural look.' })}</p></div>
            <div className="ic-guide-best-item"><span className="ic-guide-best-icon">✅</span><p>{t('guide.bestPractices.item5', { defaultValue: 'Keep the Original — Always save the original image; cropped areas cannot be recovered.' })}</p></div>
          </div>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.mistakes.heading', { defaultValue: 'Common Mistakes to Avoid' })}</h3>
          <div className="ic-guide-mistakes">
            <div className="ic-guide-mistake">{t('guide.mistakes.item1', { defaultValue: '❌ Cutting off important parts (faces, edges, text)' })}</div>
            <div className="ic-guide-mistake">{t('guide.mistakes.item2', { defaultValue: '❌ Cropping without purpose' })}</div>
            <div className="ic-guide-mistake">{t('guide.mistakes.item3', { defaultValue: '❌ Ignoring aspect ratio' })}</div>
            <div className="ic-guide-mistake">{t('guide.mistakes.item4', { defaultValue: '❌ Over-cropping low-resolution images' })}</div>
            <div className="ic-guide-mistake">{t('guide.mistakes.item5', { defaultValue: '❌ Using random crop sizes across platforms' })}</div>
          </div>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.stepByStep.heading', { defaultValue: 'Step-by-Step: How to Crop an Image' })}</h3>
          <ol className="ic-guide-steps">
            <li>{t('guide.stepByStep.step1', { defaultValue: 'Upload your image' })}</li>
            <li>{t('guide.stepByStep.step2', { defaultValue: 'Select the area you want to keep' })}</li>
            <li>{t('guide.stepByStep.step3', { defaultValue: 'Adjust the crop box (drag edges)' })}</li>
            <li>{t('guide.stepByStep.step4', { defaultValue: 'Choose aspect ratio (optional)' })}</li>
            <li>{t('guide.stepByStep.step5', { defaultValue: 'Apply crop' })}</li>
            <li>{t('guide.stepByStep.step6', { defaultValue: 'Download the final image' })}</li>
          </ol>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.useCases.heading', { defaultValue: 'Real Use Cases' })}</h3>
          <div className="ic-guide-usecases">
            <div className="ic-guide-usecase"><span className="ic-guide-usecase-icon">📱</span><p>{t('guide.useCases.social', { defaultValue: '📱 Social Media Posts — Crop to square or vertical to improve engagement.' })}</p></div>
            <div className="ic-guide-usecase"><span className="ic-guide-usecase-icon">🌐</span><p>{t('guide.useCases.website', { defaultValue: '🌐 Website Images — Remove unnecessary space and make images consistent across pages.' })}</p></div>
            <div className="ic-guide-usecase"><span className="ic-guide-usecase-icon">👤</span><p>{t('guide.useCases.profile', { defaultValue: '👤 Profile Pictures — Crop tightly around the face and center for better visibility.' })}</p></div>
            <div className="ic-guide-usecase"><span className="ic-guide-usecase-icon">🛍️</span><p>{t('guide.useCases.product', { defaultValue: '🛍️ Product Images — Remove background clutter and highlight the product clearly.' })}</p></div>
          </div>
        </div>

        <div className="ic-guide-section">
          <h3 className="ic-guide-h3">{t('guide.faq.heading', { defaultValue: 'FAQ' })}</h3>
          <div className="ic-guide-faq">
            <details className="ic-guide-faq-item"><summary>{t('guide.faq.q1', { defaultValue: 'Does cropping reduce image quality?' })}</summary><p>{t('guide.faq.a1', { defaultValue: 'Yes — because pixels are removed, but if done carefully the quality loss is usually not noticeable.' })}</p></details>
            <details className="ic-guide-faq-item"><summary>{t('guide.faq.q2', { defaultValue: 'Can I undo cropping?' })}</summary><p>{t('guide.faq.a2', { defaultValue: 'Only if your tool supports non-destructive editing or you kept the original image.' })}</p></details>
            <details className="ic-guide-faq-item"><summary>{t('guide.faq.q3', { defaultValue: 'What is the best aspect ratio?' })}</summary><p>{t('guide.faq.a3', { defaultValue: 'Depends on usage: Instagram → 1:1 or 4:5; YouTube → 16:9; Websites → varies.' })}</p></details>
            <details className="ic-guide-faq-item"><summary>{t('guide.faq.q4', { defaultValue: 'Is cropping better than resizing?' })}</summary><p>{t('guide.faq.a4', { defaultValue: 'They serve different purposes: cropping changes composition, resizing changes dimensions.' })}</p></details>
          </div>
        </div>

        <div className="ic-guide-conclusion">
          <h3>{t('guide.conclusionTitle', { defaultValue: 'Conclusion' })}</h3>
          <p>{t('guide.conclusion', { defaultValue: 'Image cropping is a simple but powerful way to improve composition, highlight important content, and make images fit any platform. Use the right techniques to turn an average image into a clean, professional-looking one.' })}</p>
          <a href="/image-crop" className="ic-guide-cta" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/image-crop'); }}>{t('guide.ctaBtn', { defaultValue: 'Try the Image Crop Tool →' })}</a>
        </div>
      </div>
    </div>
  );
}
