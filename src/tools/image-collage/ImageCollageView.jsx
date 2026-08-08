import { Link } from 'react-router-dom'
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async'
import useImageCollage from "./hooks/useImageCollage";
import ImageFileList from "./ImageFileList";
import TemplateSelector from "./TemplateSelector";
import { TEMPLATES } from "./templates";
import { computeCanvasSize } from "./hooks/useImageCollage";
import './ImageCollage.css'

const ImageCollageView = ({
  selectedTemplate,
  onTemplateChange,
  images,
  setImages,
  cellWidth,
  setCellWidth,
  cellHeight,
  setCellHeight,
}) => {
  const { t } = useTranslation('imageCollage');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ['q1','q2','q3','q4','q5','q6','q7','q8'].map(key => ({
      '@type': 'Question',
      name: t(`guide.faq.${key}`, { defaultValue: '' }),
      acceptedAnswer: { '@type': 'Answer', text: t(`guide.faq.a${key.slice(1)}`, { defaultValue: '' }) }
    }))
  }
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [sendStatus, setSendStatus] = useState('idle');

  const { rows, cols } = selectedTemplate;

  const {
    addFiles,
    handleFileChange,
    handleCollage,
    handleDownload,
    downloading,
  } = useImageCollage({ rows, cols, cellWidth, cellHeight, images, setImages, fileInputRef });

  const handleSendToWatermark = async () => {
    setSendStatus('processing');
    try {
      const dataUrl = await handleCollage(offsets, scales, bgColor, previewGap);
      if (!dataUrl) { setSendStatus('error'); return; }
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'collage.png', { type: 'image/png' });
      navigate('/image-watermarker', { state: { mainImage: file } });
    } catch (e) {
      setSendStatus('error');
    }
  };

  const handleRemove = idx => {
    setImages(prev => {
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  // preview and draggable offsets
  const [showDialog, setShowDialog] = useState(false);
  const [openPanel, setOpenPanel] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [previewMeta, setPreviewMeta] = useState([]);
  const [previewErrors, setPreviewErrors] = useState([]);
  const previewDataUrlAttempted = useRef([]);
  const [offsets, setOffsets] = useState([]);
  const [scales, setScales] = useState([]);
  const previewRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [previewContentW, setPreviewContentW] = useState(0);
  const [previewContentH, setPreviewContentH] = useState(0);
  const [previewGap, setPreviewGap] = useState(10);
  const [bgColor, setBgColor] = useState('#ffffff');

  // Drag-to-reorder state
  const dragSrcCellRef = useRef(null);
  const dragCounterRef = useRef(0);
  const [dragOverCell, setDragOverCell] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Build preview URLs and reset offsets when images change
  useEffect(() => {
    previewUrls.forEach(u => {
      try { if (u && typeof u === 'string' && u.startsWith('blob:')) URL.revokeObjectURL(u); } catch (e) {}
    });
    const urls = images.map(f => f ? URL.createObjectURL(f) : null);
    setPreviewUrls(urls);
    setPreviewErrors(images.map(() => false));
    previewDataUrlAttempted.current = images.map(() => false);
    setOffsets(prev => images.map((_, i) => prev[i] || { x: 0, y: 0 }));
    setScales(prev => images.map((_, i) => prev[i] || 1));
    // load natural sizes for exact cover calculations
    Promise.all(
      urls.map(
        u =>
          u
            ? new Promise(resolve => {
                const img = new window.Image();
            img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
            img.onerror = () => resolve({ w: 1, h: 1 });
            img.src = u;
          })
            : Promise.resolve({ w: 1, h: 1 })
      )
    ).then(meta => setPreviewMeta(meta));

    return () => urls.forEach(u => { try { if (u && typeof u === 'string' && u.startsWith('blob:')) URL.revokeObjectURL(u); } catch (e) {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const tryPreviewDataUrl = (idx, currentUrls, currentErrors) => {
    if (previewDataUrlAttempted.current[idx]) {
      const errs = currentErrors.slice(); errs[idx] = true; setPreviewErrors(errs); return;
    }
    previewDataUrlAttempted.current[idx] = true;
    const file = images[idx];
    if (!file) {
      const arr = currentErrors.slice(); arr[idx] = true; setPreviewErrors(arr); return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const arr = currentUrls.slice();
      arr[idx] = reader.result;
      setPreviewUrls(arr);
      const errs = currentErrors.slice(); errs[idx] = false; setPreviewErrors(errs);
    };
    reader.onerror = () => {
      const errs = currentErrors.slice(); errs[idx] = true; setPreviewErrors(errs);
    };
    reader.readAsDataURL(file);
  };

  // compute a scale so the preview content fits the available container (always visible)
  useEffect(() => {
    const compute = () => {
      const ref = previewRef.current;
      if (!ref) return;
      const availW = ref.offsetWidth;
      if (availW < 10) return;
      const gap = previewGap ?? 10;
      const contentW = cols * cellWidth + (cols + 1) * gap;
      const contentH = rows * cellHeight + (rows + 1) * gap;
      const scaleFit = Math.min(availW / Math.max(1, contentW), 1);
      setPreviewScale(scaleFit);
      setPreviewContentW(contentW);
      setPreviewContentH(contentH);
    };
    compute();
    let rafId = requestAnimationFrame(compute);
    let ro = null;
    if (typeof window !== 'undefined' && 'ResizeObserver' in window && previewRef.current) {
      try {
        ro = new ResizeObserver(compute);
        ro.observe(previewRef.current);
      } catch (e) { ro = null; }
    }
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('resize', compute);
      if (ro) try { ro.disconnect(); } catch (e) {}
      try { cancelAnimationFrame(rafId); } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, cols, cellWidth, cellHeight, previewGap]);

  // Unified per-cell pointer handling: 1 finger = drag, 2 fingers on same cell = pinch zoom.
  // Using React's own onPointerDown/Move/Up with setPointerCapture avoids window-listener
  // conflicts and stale-closure bugs that broke the old two-handler approach.
  const cellPointersRef = useRef(new Map()); // idx -> Map<pointerId, {x,y}>
  const cellGestureRef  = useRef(new Map()); // idx -> gesture state

  const onCellPointerDown = (e, idx, cellW, cellH, cellLeft, cellTop, meta) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cellPointersRef.current.has(idx)) cellPointersRef.current.set(idx, new Map());
    const pmap = cellPointersRef.current.get(idx);
    pmap.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}

    if (pmap.size === 1) {
      const curOff = offsets[idx] || { x: 0, y: 0 };
      cellGestureRef.current.set(idx, {
        type: 'drag',
        startX: e.clientX,
        startY: e.clientY,
        startOff: { x: curOff.x, y: curOff.y },
      });
    } else if (pmap.size === 2) {
      // Two fingers on same cell → switch to pinch
      const pts = Array.from(pmap.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y) || 1;
      const curOff = offsets[idx] || { x: 0, y: 0 };
      cellGestureRef.current.set(idx, {
        type: 'pinch',
        startDist: dist,
        startScale: scales[idx] || 1,
        startOff: { x: curOff.x, y: curOff.y },
        cellW, cellH, cellLeft, cellTop, meta,
      });
    }
  };

  const onCellPointerMove = (e, idx) => {
    const pmap = cellPointersRef.current.get(idx);
    if (!pmap || !pmap.has(e.pointerId)) return;
    pmap.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const state = cellGestureRef.current.get(idx);
    if (!state) return;

    if (state.type === 'pinch' && pmap.size >= 2) {
      const pts = Array.from(pmap.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y) || 1;
      const scaleFactor = dist / (state.startDist || 1);
      const newScale = Math.max(0.5, Math.min(4.0, state.startScale * scaleFactor));
      // Scale offset proportionally so cell-center is the pinch pivot
      const r = newScale / state.startScale;
      setOffsets(prev => { const n = prev.slice(); n[idx] = { x: Math.round(state.startOff.x * r), y: Math.round(state.startOff.y * r) }; return n; });
      setScales(prev => { const n = prev.slice(); n[idx] = newScale; return n; });
    } else if (state.type === 'drag' && pmap.size === 1) {
      const dX = e.clientX - state.startX;
      const dY = e.clientY - state.startY;
      setOffsets(prev => {
        const n = prev.slice();
        n[idx] = { x: Math.round(state.startOff.x + dX / previewScale), y: Math.round(state.startOff.y + dY / previewScale) };
        return n;
      });
    }
  };

  const onCellPointerUp = (e, idx) => {
    const pmap = cellPointersRef.current.get(idx);
    if (!pmap) return;
    pmap.delete(e.pointerId);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) {}
    if (pmap.size === 0) {
      cellPointersRef.current.delete(idx);
      cellGestureRef.current.delete(idx);
    } else if (pmap.size === 1) {
      // One finger released during pinch — fall back to drag with remaining finger
      const remaining = Array.from(pmap.values())[0];
      const curOff = offsets[idx] || { x: 0, y: 0 };
      cellGestureRef.current.set(idx, {
        type: 'drag',
        startX: remaining.x,
        startY: remaining.y,
        startOff: { x: curOff.x, y: curOff.y },
      });
    }
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const onImageWheel = (e, idx, meta, off, cellW, cellH, cellLeft, cellTop) => {
    if (!e.altKey) return; // Alt+wheel to zoom
    e.preventDefault();
    const prevScale = (scales[idx] || 1);
    const factor = e.deltaY < 0 ? 1.06 : 0.94;
    let newScale = clamp(prevScale * factor, 0.5, 4.0);
    if (Math.abs(newScale - prevScale) < 0.0001) return;

    // compute base cover sizes (without scale)
    const imgRatio = (meta && meta.w && meta.h) ? meta.w / meta.h : 1;
    const cellRatio = cellW / cellH;
    let drawW0, drawH0;
    if (imgRatio > cellRatio) {
      drawH0 = cellH;
      drawW0 = cellH * imgRatio;
    } else {
      drawW0 = cellW;
      drawH0 = cellW / imgRatio;
    }
    const drawW_old = drawW0 * prevScale;
    const drawH_old = drawH0 * prevScale;
    const drawW_new = drawW0 * newScale;
    const drawH_new = drawH0 * newScale;

    // declare offsets before use
    const offX = off ? off.x || 0 : 0;
    const offY = off ? off.y || 0 : 0;

    // event is on the cell div; convert to canvas-px position inside the image
    const cellRect = e.currentTarget.getBoundingClientRect();
    const pxInCell = (e.clientX - cellRect.left) / previewScale;
    const pyInCell = (e.clientY - cellRect.top) / previewScale;
    const px = pxInCell - offX - (cellW - drawW_old) / 2;
    const py = pyInCell - offY - (cellH - drawH_old) / 2;

    // base offsets in canvas coords
    const baseOffsetX_old = cellLeft - (drawW_old - cellW) / 2;
    const baseOffsetY_old = cellTop - (drawH_old - cellH) / 2;
    const baseOffsetX_new = cellLeft - (drawW_new - cellW) / 2;
    const baseOffsetY_new = cellTop - (drawH_new - cellH) / 2;

    const focal_canvas = baseOffsetX_old + offX + px;
    const focal_canvas_y = baseOffsetY_old + offY + py;

    const uX = drawW_old !== 0 ? px / drawW_old : 0.5;
    const uY = drawH_old !== 0 ? py / drawH_old : 0.5;
    const f_new_x = uX * drawW_new;
    const f_new_y = uY * drawH_new;

    const newOffX = Math.round(focal_canvas - baseOffsetX_new - f_new_x);
    const newOffY = Math.round(focal_canvas_y - baseOffsetY_new - f_new_y);

    const nextOffsets = offsets.slice();
    nextOffsets[idx] = { x: newOffX, y: newOffY };
    const nextScales = scales.slice();
    nextScales[idx] = newScale;
    setOffsets(nextOffsets);
    setScales(nextScales);
  };

  const handlePreviewWheel = e => {
    if (e.altKey) e.preventDefault();
  };

  // Attach a non-passive native wheel listener on the preview element so we can
  // reliably call preventDefault() (some browsers attach passive wheel listeners
  // which ignore preventDefault in React handlers).
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const handler = e => { if (e.altKey) e.preventDefault(); };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResetOffset = idx => {
    const n = offsets.slice();
    n[idx] = { x: 0, y: 0 };
    setOffsets(n);
    const s = scales.slice();
    s[idx] = 1;
    setScales(s);
  };

  const handleResetAll = () => {
    setOffsets(images.map(() => ({ x: 0, y: 0 })));
    setScales(images.map(() => 1));
    setBgColor('#ffffff');
    setPreviewGap(10);
  };

  const swapCells = (a, b) => {
    if (a === b || a < 0 || b < 0) return;
    const maxIdx = Math.max(a, b);
    setImages(prev => {
      const next = [...prev];
      while (next.length <= maxIdx) next.push(null);
      [next[a], next[b]] = [next[b], next[a]];
      // trim trailing nulls
      while (next.length > 0 && next[next.length - 1] == null) next.pop();
      return next;
    });
    setOffsets(prev => {
      const next = [...prev];
      while (next.length <= maxIdx) next.push({ x: 0, y: 0 });
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
    setScales(prev => {
      const next = [...prev];
      while (next.length <= maxIdx) next.push(1);
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
  };

  return (
    <>
      <h2 className="hero-title">{t('hero.title')}</h2>
      <p className="hero-tagline">{t('hero.tagline')}{' '}
        <Link to="/blogs/image-collage-guide">{t('hero.blogLink')}</Link>
      </p>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
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

                <h3>{t('details.design.heading')}</h3>
                <ul>
                  <li>{t('details.design.item1')}</li>
                  <li>{t('details.design.item2')}</li>
                  <li>{t('details.design.item3')}</li>
                </ul>

                <h3>{t('details.practical.heading')}</h3>
                <ul>
                  <li>{t('details.practical.item1')}</li>
                  <li>{t('details.practical.item2')}</li>
                  <li>{t('details.practical.item3')}</li>
                  <li>{t('details.practical.item4')}</li>
                </ul>

                <h3>{t('details.accessibility.heading')}</h3>
                <p>{t('details.accessibility.body')}</p>

                <h3>{t('details.whenToUse.heading')}</h3>
                <ul>
                  <li>{t('details.whenToUse.item1')}</li>
                  <li>{t('details.whenToUse.item2')}</li>
                  <li>{t('details.whenToUse.item3')}</li>
                </ul>

                <h3>{t('details.export.heading')}</h3>
                <p>{t('details.export.body')}</p>

                <h3>{t('details.privacy.heading')}</h3>
                <p>{t('details.privacy.body')}</p>

                <h3>{t('details.limitations.heading')}</h3>
                <ul>
                  <li>{t('details.limitations.item1')}</li>
                  <li>{t('details.limitations.item2')}</li>
                  <li>{t('details.limitations.item3')}</li>
                </ul>

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
                    <img src="/screenshots/collage/image-collage001.png" alt="Step 1" className="how-img" />
                    <p>{t('howItWorks.step1')}</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/collage/image-collage002.png" alt="Step 2" className="how-img" />
                    <p>{t('howItWorks.step2')}</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/collage/image-collage003.png" alt="Step 3" className="how-img" />
                    <p>{t('howItWorks.step3')}</p>
                  </li>
                  <li>
                    <img src="/screenshots/collage/image-collage004.png" alt="Step 4" className="how-img" />
                    <p>{t('howItWorks.step4')}</p>
                  </li>
                </ol>
              </div>
          </div>
      </div>

      {/* Template selector */}
      <TemplateSelector templates={TEMPLATES} selectedId={selectedTemplate.id} onSelect={onTemplateChange} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Gesture tip */}
      {images.filter(Boolean).length > 0 && (
        <p className="collage-gesture-tip">Tip: drag a cell onto another to swap images. Use Alt+scroll (or pinch) inside a cell to zoom. Drag the ⠿ handle to reorder.</p>
      )}

      {/* Live preview — doubles as drop target */}
      <div
        ref={previewRef}
        className={`collage-live-preview${isDragging ? ' collage-live-preview--drag-active' : ''}`}
        onDrop={e => {
          e.preventDefault();
          dragCounterRef.current = 0;
          setIsDragging(false);
          if (dragSrcCellRef.current !== null) { dragSrcCellRef.current = null; return; }
          addFiles(e.dataTransfer.files);
        }}
        onDragOver={e => e.preventDefault()}
        onDragEnter={() => { dragCounterRef.current++; setIsDragging(true); }}
        onDragLeave={() => { dragCounterRef.current--; if (dragCounterRef.current <= 0) { dragCounterRef.current = 0; setIsDragging(false); } }}
      >
        {previewContentW > 0 && previewContentH > 0 ? (
          <div style={{ width: Math.max(1, Math.floor(previewContentW * previewScale)), height: Math.max(1, Math.floor(previewContentH * previewScale)), overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: previewContentW, height: previewContentH, transform: `scale(${previewScale})`, transformOrigin: 'top left', position: 'absolute', left: 0, top: 0, background: bgColor }}>
              {Array.from({ length: rows * cols }).map((_, idx) => {
                const col = idx % cols;
                const row = Math.floor(idx / cols);
                const gap = typeof previewGap === 'number' ? previewGap : 10;
                const cellLeft = col * (cellWidth + gap) + gap;
                const cellTop = row * (cellHeight + gap) + gap;
                const file = images[idx] || null;
                const url = previewUrls[idx] || null;
                const meta = previewMeta[idx] || { w: 1, h: 1 };
                const off = offsets[idx] || { x: 0, y: 0 };
                const imgRatio = meta.w / meta.h;
                const cellRatio = cellWidth / cellHeight;
                let drawW0, drawH0;
                if (imgRatio > cellRatio) {
                  drawH0 = cellHeight;
                  drawW0 = cellHeight * imgRatio;
                } else {
                  drawW0 = cellWidth;
                  drawH0 = cellWidth / imgRatio;
                }
                const scale = scales[idx] || 1;
                const drawW = Math.round(drawW0 * scale);
                const drawH = Math.round(drawH0 * scale);

                return (
                  <div
                    key={idx}
                    className={`collage-cell${!file ? ' collage-cell--empty' : ''}${dragOverCell === idx ? ' collage-cell--drag-over' : ''}`}
                    style={{ position: 'absolute', left: cellLeft, top: cellTop, width: cellWidth, height: cellHeight, overflow: 'hidden', background: file ? bgColor : undefined }}
                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOverCell(idx); }}
                    onDragLeave={e => { e.stopPropagation(); setDragOverCell(prev => prev === idx ? null : prev); }}
                    onDrop={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      dragCounterRef.current = 0;
                      setIsDragging(false);
                      setDragOverCell(null);
                      if (dragSrcCellRef.current !== null) {
                        if (dragSrcCellRef.current !== idx) swapCells(dragSrcCellRef.current, idx);
                        dragSrcCellRef.current = null;
                      } else if (e.dataTransfer.files?.length > 0) {
                        addFiles(e.dataTransfer.files);
                      }
                    }}
                    onClick={() => { if (!file) fileInputRef.current?.click(); }}
                  >
                    {file ? (
                      <>
                        {/* Drag handle — triggers cell-to-cell reorder */}
                        <div
                          className="collage-cell-drag-handle"
                          draggable
                          onDragStart={e => { e.stopPropagation(); dragSrcCellRef.current = idx; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(idx)); }}
                          onDragEnd={() => { dragSrcCellRef.current = null; setDragOverCell(null); }}
                        >⠿</div>
                        {/* Remove button */}
                        <button
                          className="collage-cell-remove"
                          type="button"
                          onClick={e => { e.stopPropagation(); handleRemove(idx); }}
                          title="Remove"
                        >✕</button>
                        {/* Interactive image (pan / pinch-zoom) */}
                        <div
                          style={{ position: 'absolute', inset: 0, touchAction: 'none' }}
                          onPointerDown={e => onCellPointerDown(e, idx, cellWidth, cellHeight, cellLeft, cellTop, meta)}
                          onPointerMove={e => onCellPointerMove(e, idx)}
                          onPointerUp={e => onCellPointerUp(e, idx)}
                          onPointerCancel={e => onCellPointerUp(e, idx)}
                          onWheel={e => onImageWheel(e, idx, meta, off, cellWidth, cellHeight, cellLeft, cellTop)}
                        >
                          {!previewErrors[idx] && url ? (
                            <img
                              src={url}
                              alt={file.name}
                              draggable={false}
                              onError={() => tryPreviewDataUrl(idx, previewUrls, previewErrors)}
                              style={{ position: 'absolute', left: off.x + (cellWidth - drawW) / 2, top: off.y + (cellHeight - drawH) / 2, width: drawW, height: drawH, userSelect: 'none', pointerEvents: 'none' }}
                            />
                          ) : previewErrors[idx] ? (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 12 }}>{t('preview.noPreview')}</div>
                          ) : null}
                        </div>
                      </>
                    ) : (
                      <div className="collage-cell-empty-content">
                        <div className="collage-cell-plus">+</div>
                        <div className="collage-cell-hint">Drop here</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="collage-preview-empty-msg">
            Drop images here or{' '}
            <button type="button" className="ic-change-btn" onClick={() => fileInputRef.current?.click()}>Browse</button>
          </div>
        )}
      </div>

      {/* File row */}
      <div className="ic-file-row">
        <button
          type="button"
          className="ic-change-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          {images.length > 0 ? t('fileRow.changeMany') : 'Add Photos'}
        </button>
        {images.length > 0 && (
          <>
            <span className="ic-file-name">
              {images.length === 1 ? images[0]?.name : t('fileRow.count', { count: images.length })}
            </span>
            <button
              type="button"
              className="ic-clear-btn"
              onClick={() => setImages([])}
            >
              {t('fileRow.clear')}
            </button>
          </>
        )}
      </div>

      {/* Overflow notice */}
      {images.filter(Boolean).length > rows * cols && (
        <div style={{ fontSize: '0.88rem', color: '#c05c00', background: '#fff8f0', border: '1px solid #fcd3a1', borderRadius: 6, padding: '0.4rem 0.7rem', marginBottom: 8 }}>
          {images.filter(Boolean).length - rows * cols} image(s) won't appear in the current {rows}×{cols} layout. Switch to a larger template or remove extra images.
        </div>
      )}

      {/* Customization controls */}
      <div className="collage-options">
        <div className="collage-controls-row">
          <label className="collage-inline-label">Cell size</label>
          <div className="px-input">
            <input type="number" min={50} max={2000} value={cellWidth} onChange={e => setCellWidth(Math.max(50, Number(e.target.value)))} />
            <span className="px-suffix">px</span>
          </div>
          <span style={{ margin: '0 4px', color: '#666' }}>×</span>
          <div className="px-input">
            <input type="number" min={50} max={2000} value={cellHeight} onChange={e => setCellHeight(Math.max(50, Number(e.target.value)))} />
            <span className="px-suffix">px</span>
          </div>
        </div>
        <div className="collage-controls-row collage-controls-color-row">
          <label className="collage-inline-label">{t('preview.borderColor')}</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: 42, height: 28, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
          <div className="collage-thickness-group">
            <label className="collage-inline-label">{t('preview.borderThickness')}</label>
            <input type="range" min={0} max={100} value={previewGap} onChange={e => setPreviewGap(Number(e.target.value))} style={{ width: 90, cursor: 'pointer', accentColor: '#4f8ef7' }} />
            <span style={{ minWidth: 28, fontSize: '0.9rem', color: '#444' }}>{previewGap}px</span>
          </div>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: 4 }}>
          {(() => { const s = computeCanvasSize(rows, cols, cellWidth, cellHeight, previewGap); return `Output: ${s.width} × ${s.height}px`; })()}
        </div>
      </div>

      {/* Action buttons */}
      <div className="collage-actions">
        <button
          className="collage-reset-btn"
          onClick={handleResetAll}
          disabled={!images.filter(Boolean).length}
        >
          {t('resetBtn', { defaultValue: 'Reset' })}
        </button>
        <button
          className="download-btn"
          onClick={() => handleDownload(offsets, scales, bgColor, previewGap)}
          disabled={downloading || !images.filter(Boolean).length}
          style={{ margin: 0 }}
        >
          {downloading ? t('downloadingBtn') : t('downloadBtn')}
        </button>
      </div>

      {/* Watermark prompt */}
      {images.filter(Boolean).length > 0 && (
        <div className="collage-watermark-prompt">
          <span className="collage-watermark-prompt-text">{t('watermarkPrompt.text')}</span>
          <button
            className="collage-btn collage-watermark-prompt-btn"
            onClick={handleSendToWatermark}
            disabled={sendStatus === 'processing'}
          >
            {sendStatus === 'processing' ? t('watermarkPrompt.preparing') : t('watermarkPrompt.sendToWatermarker')}
          </button>
          {sendStatus === 'error' && <span className="error-msg">{t('watermarkPrompt.error')}</span>}
        </div>
      )}

      {/* --- Image Collage Guide --- */}
      <div className="ic-guide">
        <div className="ic-guide-header">
          <h2 className="ic-guide-title">{t('guide.title', { defaultValue: 'How to Create Stunning Image Collages That Tell a Story' })}</h2>
          <h3>{t('guide.introHeading', { defaultValue: 'Introduction' })}</h3>
          <p className="ic-guide-lead">{t('guide.lead', { defaultValue: 'Sometimes one photo isn’t enough. Whether you’re capturing a trip, showcasing products, or sharing moments on social media, a single image can feel limiting. That’s where image collages come in.' })}</p>
          <p>{t('guide.byCombining', { defaultValue: 'By combining multiple images into one, you can:' })}</p>
          <ul className="ic-list">
            <li>{t('guide.intro.items.item1', { defaultValue: 'Tell a richer story' })}</li>
            <li>{t('guide.intro.items.item2', { defaultValue: 'Show variety in a single frame' })}</li>
            <li>{t('guide.intro.items.item3', { defaultValue: 'Create eye-catching visuals' })}</li>
          </ul>
          <p>{t('guide.introConclusion', { defaultValue: 'In this guide, you’ll learn how to design effective image collages, when to use them, and how to make them look professional (not messy).' })}</p>
        </div>

        <section className="ic-section">
          <h3>{t('guide.whatIs.heading', { defaultValue: 'What Is an Image Collage?' })}</h3>
          <p>{t('guide.whatIs.body', { defaultValue: 'An image collage is a collection of multiple images arranged into one unified composition. Instead of viewing photos individually, a collage lets you present them together, create meaning through arrangement, and highlight connections between images.' })}</p>
        </section>

        <section className="ic-section">
          <h3>{t('guide.best.example', { defaultValue: 'Best examples of image collages' })}</h3>
          <img src="/images/tools/collage/collage_example.png" alt="Example collage 1" className="how-img" />
          <p>{t('guide.best.example-desc', { defaultValue: 'An image collage is a collection of multiple images arranged into one unified composition. Instead of viewing photos individually, a collage lets you present them together, create meaning through arrangement, and highlight connections between images.' })}</p>
        </section>

        <section className="ic-section">
          <h3>{t('guide.why.heading', { defaultValue: 'Why Use Image Collages?' })}</h3>
          <ol className="ic-list">
            <li>{t('guide.why.item1', { defaultValue: 'Tell a Complete Story — A single image shows one moment. A collage shows before and after, different angles, or a sequence of events.' })}</li>
            <li>{t('guide.why.item2', { defaultValue: 'Maximize Limited Space — On social media, websites, or thumbnails you often have limited space. A collage allows you to show multiple visuals in one post.' })}</li>
            <li>{t('guide.why.item3', { defaultValue: 'Create Strong Visual Impact — Collages stand out because they contain more information and naturally attract attention.' })}</li>
            <li>{t('guide.why.item4', { defaultValue: 'Showcase Variety — Perfect for product galleries, portfolio previews, and feature comparisons.' })}</li>
          </ol>
        </section>

        <section className="ic-section">
          <h3>{t('guide.types.heading', { defaultValue: 'Types of Image Collage Layouts' })}</h3>
          <div className="ic-layouts">
            <div className="ic-layout"><p>{t('guide.types.grid', { defaultValue: '🔲 Grid Layout — Clean and structured — equal-sized images, great for portfolios.' })}</p></div>
            <div className="ic-layout"><p>{t('guide.types.freeform', { defaultValue: '🧩 Freeform Layout — Different sizes and positions — more creative and dynamic.' })}</p></div>
            <div className="ic-layout"><p>{t('guide.types.themed', { defaultValue: '🎯 Themed Collage — Focused on a single concept — consistent colors or subject.' })}</p></div>
            <div className="ic-layout"><p>{t('guide.types.beforeAfter', { defaultValue: '🔍 Before & After Collage — Shows transformation — common in tutorials and comparisons.' })}</p></div>
          </div>
        </section>

        <section className="ic-section">
          <h3>{t('guide.bestPractices.heading', { defaultValue: 'Best Practices for Creating a Great Collage' })}</h3>
          <ol className="ic-best">
            <li>{t('guide.bestPractices.item1', { defaultValue: 'Start With a Clear Purpose — Ask yourself: What story am I telling?' })}</li>
            <li>{t('guide.bestPractices.item2', { defaultValue: 'Choose Related Images — Images should share a theme and similar tone or subject.' })}</li>
            <li>{t('guide.bestPractices.item3', { defaultValue: 'Keep It Simple — Too many images can overwhelm viewers — 3–6 images is often ideal.' })}</li>
            <li>{t('guide.bestPractices.item4', { defaultValue: 'Use Consistent Spacing — Spacing creates balance and readability.' })}</li>
            <li>{t('guide.bestPractices.item5', { defaultValue: 'Maintain Visual Balance — Avoid one side being too heavy.' })}</li>
            <li>{t('guide.bestPractices.item6', { defaultValue: "Pay Attention to Background — A good background supports the images and doesn't distract." })}</li>
          </ol>
        </section>

        <section className="ic-section">
          <h3>{t('guide.mistakes.heading', { defaultValue: 'Common Mistakes to Avoid' })}</h3>
          <ul className="ic-list">
            <li>{t('guide.mistakes.item1', { defaultValue: 'Mixing unrelated images' })}</li>
            <li>{t('guide.mistakes.item2', { defaultValue: 'Using too many photos' })}</li>
            <li>{t('guide.mistakes.item3', { defaultValue: 'Poor alignment' })}</li>
            <li>{t('guide.mistakes.item4', { defaultValue: 'Inconsistent image quality' })}</li>
            <li>{t('guide.mistakes.item5', { defaultValue: 'Overcomplicated layouts' })}</li>
          </ul>
        </section>

        <section className="ic-section">
          <h3>{t('guide.stepByStep.heading', { defaultValue: 'Step-by-Step: How to Create an Image Collage' })}</h3>
          <ol className="ic-steps">
            <li>{t('guide.stepByStep.step1', { defaultValue: 'Upload your images' })}</li>
            <li>{t('guide.stepByStep.step2', { defaultValue: 'Select a layout (grid or custom)' })}</li>
            <li>{t('guide.stepByStep.step3', { defaultValue: 'Arrange images in desired order' })}</li>
            <li>{t('guide.stepByStep.step4', { defaultValue: 'Adjust spacing and alignment' })}</li>
            <li>{t('guide.stepByStep.step5', { defaultValue: 'Preview the final composition' })}</li>
            <li>{t('guide.stepByStep.step6', { defaultValue: 'Download your collage' })}</li>
          </ol>
          <p>{t('guide.tryIt', { defaultValue: 'Try it here:' })}</p>
          <div className="ic-cta-wrap">
            <a href="/image-collage" className="ic-cta" onClick={(e)=>{ e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/image-collage'); }}>{t('guide.ctaBtn', { defaultValue: 'Image Collage Tool →' })}</a>
          </div>
        </section>

        <section className="ic-section">
          <h3>{t('guide.techArchitecture.heading')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('guide.techArchitecture.body') }} />
          <h4>{t('guide.techArchitecture.whyHeading')}</h4>
          <p dangerouslySetInnerHTML={{ __html: t('guide.techArchitecture.whyBody') }} />
        </section>

        <section className="ic-section">
          <h3>{t('guide.canvasDpi.heading')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('guide.canvasDpi.body') }} />
        </section>

        <section className="ic-section">
          <h3>{t('guide.aspect.heading')}</h3>
          <p>{t('guide.aspect.body')}</p>
        </section>

        <section className="ic-section">
          <h3>{t('guide.layout.heading')}</h3>
          <div className="wm-guide-table-wrap">
            <table className="wm-guide-table">
              <thead>
                <tr>
                  <th>{t('guide.layout.headers.type')}</th>
                  <th>{t('guide.layout.headers.dimensions')}</th>
                  <th>{t('guide.layout.headers.useCase')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t('guide.layout.rows.row1.type')}</td>
                  <td>{t('guide.layout.rows.row1.dim')}</td>
                  <td>{t('guide.layout.rows.row1.useCase')}</td>
                </tr>
                <tr>
                  <td>{t('guide.layout.rows.row2.type')}</td>
                  <td>{t('guide.layout.rows.row2.dim')}</td>
                  <td>{t('guide.layout.rows.row2.useCase')}</td>
                </tr>
                <tr>
                  <td>{t('guide.layout.rows.row3.type')}</td>
                  <td>{t('guide.layout.rows.row3.dim')}</td>
                  <td>{t('guide.layout.rows.row3.useCase')}</td>
                </tr>
                <tr>
                  <td>{t('guide.layout.rows.row4.type')}</td>
                  <td>{t('guide.layout.rows.row4.dim')}</td>
                  <td>{t('guide.layout.rows.row4.useCase')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="ic-section">
          <h3>{t('guide.expandedFaq.heading')}</h3>
          <div className="wm-guide-faq">
            {[5,6,7,8].map(n => (
              <details key={n} className="wm-faq-item">
                <summary>{t(`guide.faq.q${n}`)}</summary>
                <p dangerouslySetInnerHTML={{ __html: t(`guide.faq.a${n}`) }} />
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default ImageCollageView;
