import { Link } from 'react-router-dom'
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useImageCollage from "./hooks/useImageCollage";
import ImageFileList from "./ImageFileList";
import './ImageCollage.css'

const ImageCollageView = ({
  columns,
  setColumns,
  rows,
  setRows,
  width,
  setWidth,
  height,
  setHeight,
  images,
  setImages,
  collageUrl,
  setCollageUrl,
}) => {
  const fileInputRef = useRef(null);
  const [totalWidth, setTotalWidth] = useState(1200);
  const [totalHeight, setTotalHeight] = useState(1200);
  const [lockRatio, setLockRatio] = useState(false);
  const ratioRef = useRef(1);
  const navigate = useNavigate();
  const [sendStatus, setSendStatus] = useState('idle');

  const handleSendToWatermark = async () => {
    setSendStatus('processing');
    try {
      const response = await fetch(collageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'collage.png', { type: 'image/png' });
      navigate('/image-watermarker', { state: { mainImage: file } });
    } catch (e) {
      setSendStatus('error');
    }
  };

  const {
    handleDrop,
    handleFileChange,
    handleCollage,
    isDragging,
    expectedWidth,
    expectedHeight,
    canCollage,
    downloading,
    handleDownload,
  } = useImageCollage({
    columns,
    setColumns,
    rows,
    setRows,
    width,
    height,
    images,
    setImages,
    setCollageUrl,
    fileInputRef,
    collageUrl,
  });

  // Sync totalWidth/totalHeight to the computed collage size whenever it changes
  useEffect(() => {
    if (images.length > 0) {
      setTotalWidth(expectedWidth);
      setTotalHeight(expectedHeight);
      if (expectedHeight > 0) ratioRef.current = expectedWidth / expectedHeight;
    }
  }, [expectedWidth, expectedHeight]);

  const handleTotalWidthChange = val => {
    if (!Number.isFinite(val) || val <= 0) return;
    if (lockRatio && ratioRef.current > 0) {
      setTotalWidth(val);
      setTotalHeight(Math.max(1, Math.round(val / ratioRef.current)));
    } else {
      setTotalWidth(val);
    }
  };

  const handleTotalHeightChange = val => {
    if (!Number.isFinite(val) || val <= 0) return;
    if (lockRatio && ratioRef.current > 0) {
      setTotalHeight(val);
      setTotalWidth(Math.max(1, Math.round(val * ratioRef.current)));
    } else {
      setTotalHeight(val);
    }
  };

  const handleMove = (from, to) => {
    if (to < 0 || to >= images.length) return;
    const newImages = images.slice();
    const [moved] = newImages.splice(from, 1);
    newImages.splice(to, 0, moved);
    setImages(newImages);
  };

  const handleRemove = idx => {
    const newImages = images.slice();
    newImages.splice(idx, 1);
    setImages(newImages);
  };

  // preview and draggable offsets
  const [showDialog, setShowDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [openPanel, setOpenPanel] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [previewMeta, setPreviewMeta] = useState([]);
  const [previewErrors, setPreviewErrors] = useState([]);
  const [offsets, setOffsets] = useState([]);
  const [scales, setScales] = useState([]);
  const previewRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [previewScaledSize, setPreviewScaledSize] = useState({ w: 0, h: 0 });
  const [previewContentSize, setPreviewContentSize] = useState({ w: 0, h: 0 });
  const [previewGap, setPreviewGap] = useState(10);
  const previewWrapperRef = useRef(null);
  const previewOverlayRef = useRef(null);
  const [previewBtnStyle, setPreviewBtnStyle] = useState({ padding: '0.55rem 0.9rem', fontSize: '1rem', minWidth: 64 });
  const previewHeaderRef = useRef(null);
  const previewInfoRef = useRef(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  // (reverted) no background color picker — keep default white preview frame

  // Build preview URLs and reset offsets when images change
  useEffect(() => {
    previewUrls.forEach(u => {
      try { if (u && typeof u === 'string' && u.startsWith('blob:')) URL.revokeObjectURL(u); } catch (e) {}
    });
    const urls = images.map(f => URL.createObjectURL(f));
    setPreviewUrls(urls);
    setPreviewErrors(images.map(() => false));
    setOffsets(images.map(() => ({ x: 0, y: 0 })));
    setScales(images.map(() => 1));
    // load natural sizes for exact cover calculations
    Promise.all(
      urls.map(
        u =>
          new Promise(resolve => {
            const img = new window.Image();
            img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
            img.onerror = () => resolve({ w: 1, h: 1 });
            img.src = u;
          })
      )
    ).then(meta => setPreviewMeta(meta));

    return () => urls.forEach(u => { try { if (u && typeof u === 'string' && u.startsWith('blob:')) URL.revokeObjectURL(u); } catch (e) {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const tryPreviewDataUrl = idx => {
    const file = images[idx];
    if (!file) {
      const arr = previewErrors.slice(); arr[idx] = true; setPreviewErrors(arr); return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const arr = previewUrls.slice();
      arr[idx] = reader.result;
      setPreviewUrls(arr);
      const errs = previewErrors.slice(); errs[idx] = false; setPreviewErrors(errs);
    };
    reader.onerror = () => {
      const errs = previewErrors.slice(); errs[idx] = true; setPreviewErrors(errs);
    };
    reader.readAsDataURL(file);
  };

  // compute a scale so the preview content fits the available wrapper (or 1)
  useEffect(() => {
    if (!showPreview) return;
    const compute = () => {
      // Measure from the preview pane directly — it fills remaining flex space
      const ref = previewRef.current;
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return; // not painted yet
      const availW = Math.max(1, rect.width - 2);
      const availH = Math.max(1, rect.height - 2);
      // Simpler, fixed-gap preview: match earlier behavior using a
      // consistent inner gap (previewGap) and a fixed outer border.
      const borderPx = 6;
      const gap = previewGap ?? 10;
      const contentW = columns * width + (columns + 1) * gap;
      const contentH = rows * height + (rows + 1) * gap;
      const scaleFit = Math.min(availW / Math.max(1, contentW), availH / Math.max(1, contentH), 1);
      setPreviewScale(scaleFit);
      setPreviewContentSize({ w: contentW, h: contentH });
      // keep fractional scaled sizes
      setPreviewScaledSize({ w: Math.max(1, contentW * scaleFit), h: Math.max(1, contentH * scaleFit) });
      // responsive button sizing based on wrapper width
      const wrapEl = previewWrapperRef.current;
      const wrapW = wrapEl ? wrapEl.getBoundingClientRect().width : availW;
      if (wrapW < 360) {
        setPreviewBtnStyle({ padding: '0.3rem 0.45rem', fontSize: '0.78rem', minWidth: 44 });
      } else if (wrapW < 500) {
        setPreviewBtnStyle({ padding: '0.4rem 0.6rem', fontSize: '0.88rem', minWidth: 54 });
      } else {
        setPreviewBtnStyle({ padding: '0.55rem 0.9rem', fontSize: '1rem', minWidth: 64 });
      }
    };
    // run immediately then once more after layout paint
    compute();
    let rafId = requestAnimationFrame(compute);
    // watch for size changes (orientation change, resize)
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
  }, [showPreview, expectedWidth, expectedHeight, rows, columns, width, height, previewGap]);

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

  // Also attach a capture-phase listener on the overlay so we reliably
  // intercept wheel events before the browser scrolls the container (Chrome)
  useEffect(() => {
    const el = previewOverlayRef.current;
    if (!el) return;
    const handler = e => { if (e.altKey) e.preventDefault(); };
    el.addEventListener('wheel', handler, { passive: false, capture: true });
    return () => el.removeEventListener('wheel', handler, { capture: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fallback: listen on the document at capture phase to ensure we can
  // prevent wheel-driven scrolling in Chrome even if other listeners intervene.
  useEffect(() => {
    const docHandler = e => {
      if (!showPreview || !e.altKey) return;
      e.preventDefault();
    };
    document.addEventListener('wheel', docHandler, { passive: false, capture: true });
    return () => document.removeEventListener('wheel', docHandler, { capture: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPreview]);

  const handleResetOffset = idx => {
    const n = offsets.slice();
    n[idx] = { x: 0, y: 0 };
    setOffsets(n);
    const s = scales.slice();
    s[idx] = 1;
    setScales(s);
  };

  const onCollageAndPreview = async () => {
    if (!canCollage) return;
    if (!showPreview) {
      setShowPreview(true);
      return;
    }
    // finalize using offsets
    await handleCollage(totalWidth, totalHeight, offsets, scales);
    setShowPreview(false);
  };

  return (
    <>
      <h2 className="hero-title">Image Collage</h2>
      <p className="hero-tagline">Combine multiple images into a beautiful grid collage.
         Arrange your photos in custom rows and columns, adjust the canvas size, 
         and download the final image with one click. <Link to="/blogs/image-collage-guide">Learn how to use the Image Collage →</Link>
      </p>
      <div className="details-row" data-open={openPanel}>
        <div className="details-controls">
          <button
            className={`tab-btn ${openPanel === 'details' ? 'active' : ''}`}
            onClick={() => setOpenPanel(prev => (prev === 'details' ? '' : 'details'))}
            aria-expanded={openPanel === 'details'}
            type="button"
          >
            Details
          </button>
          <button
            className={`tab-btn ${openPanel === 'howitworks' ? 'active' : ''}`}
            onClick={() => setOpenPanel(prev => (prev === 'howitworks' ? '' : 'howitworks'))}
            aria-expanded={openPanel === 'howitworks'}
            type="button"
          >
            How it works
          </button>
        </div>

        <div className={`shared-collapse${!openPanel ? ' panel-hidden' : ''}`}>
            <div className={openPanel !== 'details' ? 'details-content panel-hidden' : 'details-content'}>
                <h3>What is Collage</h3>
                <p>
                  A collage combines multiple images into a single tiled layout on a shared canvas. You control rows, columns, spacing, and final canvas
                  dimensions to create social posts, montages, product previews, or portfolio images. Assembly happens locally in the browser, producing a
                  single raster image you can download or share. This keeps your originals private unless you explicitly upload or use a sharing workflow.
                </p>

                <h3>How the collage works</h3>
                <p>
                  The tool computes each cell's placement by dividing the canvas into a uniform grid based on the selected rows and columns. For every cell
                  it calculates a "cover" rectangle so the image fills the slot without leaving gaps; users can then pan and scale each image within its
                  cell to adjust framing and composition. When you finalize the collage the images are drawn onto an offscreen HTML canvas at the chosen
                  export resolution and exported as a PNG (or optionally JPEG) for download. This approach avoids server roundtrips and gives immediate
                  visual feedback in the browser.
                </p>

                <h3>Design choices and tradeoffs</h3>
                <ul>
                  <li>
                    Quality vs. Size: Higher canvas sizes preserve detail but increase memory usage and final file size. For most social media scenarios,
                    1200–2048px on the long edge balances clarity and performance.
                  </li>
                  <li>
                    Performance: All decoding and compositing are performed client-side. Very large canvases or many high-resolution images can slow the UI
                    or exhaust browser memory—reduce export size or source resolutions for better responsiveness.
                  </li>
                  <li>
                    Consistency: Fixed cell sizes ensure a predictable layout; tweak spacing and border color to alter the visual rhythm of the collage.
                  </li>
                </ul>

                <h3>Practical tips</h3>
                <ul>
                  <li>Start with lower-resolution images while composing and previewing, then use originals for the final export if necessary.</li>
                  <li>Use the "lock ratio" option to keep proportional scaling when changing canvas dimensions so your layout doesn't distort.</li>
                  <li>Adjust border gap to create breathing room or tight tiles depending on your design goal.</li>
                  <li>If an image looks soft at export, either increase the canvas resolution or supply a higher-resolution source image.</li>
                </ul>

                <h3>Accessibility & UX</h3>
                <p>
                  Controls are labeled and keyboard accessible, and preview mode scales to smaller screens so users can accurately inspect and adjust images
                  before exporting. Large hit targets and clear visual focus help when using touch devices or screen magnification.
                </p>

                <h3>When to use a collage</h3>
                <ul>
                  <li>Creating social media posts that combine multiple shots into a single, shareable image.</li>
                  <li>Building product grids or marketing montages for newsletters, landing pages, or ads.</li>
                  <li>Quickly assembling family photo montages or event highlights to share with friends and family.</li>
                </ul>

                <h3>Export options</h3>
                <p>
                  By default the final canvas is exported as a PNG to preserve quality. If you need smaller web-friendly files you can convert the PNG to
                  a JPEG at a chosen quality level using an external image editor or additional client-side encoding step. Filenames include a timestamp to
                  keep exports unique and easily traceable.
                </p>

                <h3>Privacy & sharing</h3>
                <p>
                  Collage generation occurs entirely on your device—the images do not leave your browser unless you explicitly upload or share them via the
                  app's sharing/watermarking workflow. If you choose to use the watermark or sharing features those steps will present clear prompts and
                  require confirmation before any upload occurs.
                </p>

                <h3>Limitations</h3>
                <ul>
                  <li>Very large canvases (for example, &gt;10000px) may be limited by browser memory or implementation limits.</li>
                  <li>Animated sources (GIF/WebP) are flattened to a single frame during export.</li>
                  <li>Embedded color profiles may be handled differently by different browsers and can affect exported color fidelity.</li>
                </ul>

                <h3>FAQs</h3>
                <ul>
                  <li><strong>Q:</strong> How many images can I use? <strong>A:</strong> Best for small to medium batches (roughly 4–25 images); very large sets
                    can degrade performance depending on client resources.</li>
                  <li><strong>Q:</strong> Will image quality be preserved? <strong>A:</strong> Quality depends on chosen canvas export size and the source
                    resolutions—use higher-resolution originals for larger exports.</li>
                  <li><strong>Q:</strong> Can I reorder or remove images? <strong>A:</strong> Yes — use the file list controls to move or delete items before
                    generating the final collage.</li>
                  <li><strong>Q:</strong> Does this run in my browser? <strong>A:</strong> Yes — collage assembly is client-side; nothing is uploaded unless you
                    explicitly use a sharing feature.</li>
                </ul>
              </div>

            <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
                <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/collage/image-collage001.png" alt="Step 1" className="how-img" />
                    <p>Add images via drag & drop or the file browser.</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/collage/image-collage002.png" alt="Step 2" className="how-img" />
                    <p>Adjust rows, columns, and spacing to arrange the grid.</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/collage/image-collage003.png" alt="Step 3" className="how-img" />
                    <p>Preview the collage and reposition images if needed.</p>
                  </li>
                  <li>
                    <img src="/screenshots/collage/image-collage004.png" alt="Step 4" className="how-img" />
                    <p>Finalize collaged image and download it.</p>
                  </li>
                </ol>
              </div>
          </div>
      </div>

      <div
        className={`drop-zone${isDragging ? " dragging" : ""}`}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onDragEnter={e => e.preventDefault()}
        onDragLeave={e => e.preventDefault()}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <span className="hero-tagline">Drag &amp; drop images here, or click to add. The grid will expand as needed.</span>
        {images.length > 0 && (
          <ImageFileList images={images} onMove={handleMove} onRemove={handleRemove} onReset={handleResetOffset} />
        )}
      </div>

      <div className="collage-options">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <label>
            Columns:
            <input type="number" min={1} max={10} value={columns} onChange={e => setColumns(Number(e.target.value))} />
          </label>
          <label>
            Rows:
            <input type="number" min={1} max={10} value={rows} onChange={e => setRows(Number(e.target.value))} />
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ display: 'flex', flexDirection: 'column' }}>
            Width:
            <input type="number" min={50} value={totalWidth} onChange={e => handleTotalWidthChange(Number(e.target.value))} />
          </label>

          <button
            type="button"
            aria-label={lockRatio ? 'Unlink width and height' : 'Link width and height'}
            onClick={() => {
              const newLock = !lockRatio;
              setLockRatio(newLock);
              if (newLock && totalHeight > 0) ratioRef.current = totalWidth / totalHeight;
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0.3rem', fontSize: '1.3rem', color: lockRatio ? '#3182ce' : '#a0aec0', display: 'flex', alignItems: 'center', alignSelf: 'center' }}
          >
            {lockRatio ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 1 7 0l1 1a5 5 0 0 1 0 7 5 5 0 0 1-7 0l-1-1"/><path d="M14 11a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 0 7 5 5 0 0 0 7 0l1-1"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 7a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 0 7 5 5 0 0 0 7 0l1-1"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
            )}
          </button>

          <label style={{ display: 'flex', flexDirection: 'column' }}>
            Height:
            <input type="number" min={50} value={totalHeight} onChange={e => handleTotalHeightChange(Number(e.target.value))} />
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#eef4ff', border: '1px solid #b8d0f7', borderRadius: 8, padding: '0.55rem 0.85rem', marginBottom: 8, fontSize: '0.92rem', color: '#2d5fa6' }}>
        <span style={{ fontSize: '1rem', flexShrink: 0 }}>ℹ️</span>
        <span>You can change the collage border color and thickness in the preview screen.</span>
      </div>
      <button className="collage-btn" onClick={onCollageAndPreview} disabled={!canCollage}>Collage and Preview</button>

      {collageUrl && (
        <>
          <div className="collage-preview-outer"><div className="collage-preview"><img src={collageUrl} alt="Collage Preview" style={{ cursor: 'pointer' }} onClick={() => setShowDialog(true)} /></div></div>
          <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '1rem', color: '#444' }}>Final Collage Size: {totalWidth} x {totalHeight} px</div>
          <button className="download-btn" onClick={handleDownload} disabled={downloading} style={{ margin: '1.2rem auto 0 auto', display: 'block' }}>{downloading ? "Downloading..." : "Download"}</button>
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, border: '1.5px solid #e2e6f0', borderRadius: 10, background: '#f7f8fa', padding: '1rem 1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minHeight: 64 }}>
            <span style={{ fontWeight: 600, color: '#222', fontSize: '1.08rem', flex: 1, display: 'block', alignSelf: 'center' }}>Would you like to put a private watermark on the collaged image?</span>
            <button className="collage-btn" style={{ minWidth: 64, padding: '0.35rem 1.1rem', fontSize: '0.98rem', marginLeft: 12, alignSelf: 'center' }} onClick={handleSendToWatermark} disabled={sendStatus === 'processing'}>{sendStatus === 'processing' ? 'Preparing...' : 'Yes'}</button>
          </div>
          {sendStatus === 'error' && (<div className="error-msg" style={{ marginTop: 8 }}>Failed to send image to watermark tool.</div>)}
          {showDialog && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowDialog(false)}>
              <img src={collageUrl} alt="Collage Full Preview" style={{ maxWidth: '90vw', maxHeight: '90vh', boxShadow: '0 0 24px #000', background: '#fff', borderRadius: '8px' }} onClick={e => e.stopPropagation()} />
              <button style={{ position: 'fixed', top: 24, right: 32, fontSize: '2rem', background: 'none', color: '#fff', border: 'none', cursor: 'pointer', zIndex: 1001 }} onClick={() => setShowDialog(false)} aria-label="Close preview">×</button>
            </div>
          )}
        </>
      )}
      

      {/* --- Image Collage Guide (user-provided text) --- */}
      <div className="ic-guide">
        <div className="ic-guide-header">
          <h2 className="ic-guide-title">How to Create Stunning Image Collages That Tell a Story</h2>
          <h3>Introduction</h3>
          <p className="ic-guide-lead">Sometimes one photo isn’t enough.</p>
          <p>Whether you're capturing a trip, showcasing products, or sharing moments on social media, a single image can feel limiting. That’s where image collages come in.</p>
          <p>By combining multiple images into one, you can:</p>
          <ul className="ic-list">
            <li>Tell a richer story</li>
            <li>Show variety in a single frame</li>
            <li>Create eye-catching visuals</li>
          </ul>
          <p>In this guide, you’ll learn how to design effective image collages, when to use them, and how to make them look professional (not messy).</p>
        </div>

        <section className="ic-section">
          <h3>What Is an Image Collage?</h3>
          <p>An image collage is a collection of multiple images arranged into one unified composition.</p>
          <p>Instead of viewing photos individually, a collage lets you:</p>
          <ul className="ic-list">
            <li>Present them together</li>
            <li>Create meaning through arrangement</li>
            <li>Highlight connections between images</li>
          </ul>
          <p>👉 Think of it as visual storytelling using multiple moments at once.</p>
        </section>

        <section className="ic-section">
          <h3>Why Use Image Collages?</h3>
          <ol className="ic-list">
            <li><strong>Tell a Complete Story</strong><br/>A single image shows one moment. A collage shows before and after, different angles, or a sequence of events. 👉 This makes it perfect for storytelling and memory sharing.</li>
            <li><strong>Maximize Limited Space</strong><br/>On platforms like social media, websites, or thumbnails you often have limited space. A collage allows you to show multiple visuals in one post and avoid cluttering your layout.</li>
            <li><strong>Create Strong Visual Impact</strong><br/>Collages stand out because they contain more information, create contrast and variation, and naturally attract attention. 👉 This makes them great for engagement.</li>
            <li><strong>Showcase Variety</strong><br/>Perfect for product galleries, portfolio previews, and feature comparisons.</li>
          </ol>
        </section>

        <section className="ic-section">
          <h3>Types of Image Collage Layouts</h3>
          <div className="ic-layouts">
            <div className="ic-layout">🔲 <div><strong>Grid Layout</strong><p>Clean and structured — equal-sized images, great for portfolios.</p></div></div>
            <div className="ic-layout">🧩 <div><strong>Freeform Layout</strong><p>Different sizes and positions — more creative and dynamic.</p></div></div>
            <div className="ic-layout">🎯 <div><strong>Themed Collage</strong><p>Focused on a single concept — consistent colors or subject.</p></div></div>
            <div className="ic-layout">🔍 <div><strong>Before &amp; After Collage</strong><p>Shows transformation — common in tutorials and comparisons.</p></div></div>
          </div>
        </section>

        <section className="ic-section">
          <h3>Best Practices for Creating a Great Collage</h3>
          <ol className="ic-best">
            <li><strong>Start With a Clear Purpose</strong><br/>Ask yourself: What story am I telling? What should viewers notice first? 👉 Without a purpose, collages look random.</li>
            <li><strong>Choose Related Images</strong><br/>Images should share a theme and similar tone or subject.</li>
            <li><strong>Keep It Simple</strong><br/>Too many images can overwhelm viewers — 3–6 images is often ideal.</li>
            <li><strong>Use Consistent Spacing</strong><br/>Spacing creates balance and readability; uneven spacing looks unprofessional.</li>
            <li><strong>Maintain Visual Balance</strong><br/>Avoid one side being too heavy; consider symmetry or intentional asymmetry.</li>
            <li><strong>Pay Attention to Background</strong><br/>A good background supports the images and doesn’t distract.</li>
          </ol>
        </section>

        <section className="ic-section">
          <h3>Common Mistakes to Avoid</h3>
          <ul className="ic-list">
            <li>Mixing unrelated images</li>
            <li>Using too many photos</li>
            <li>Poor alignment</li>
            <li>Inconsistent image quality</li>
            <li>Overcomplicated layouts</li>
          </ul>
        </section>

        <section className="ic-section">
          <h3>Step-by-Step: How to Create an Image Collage</h3>
          <ol className="ic-steps">
            <li>Upload your images</li>
            <li>Select a layout (grid or custom)</li>
            <li>Arrange images in desired order</li>
            <li>Adjust spacing and alignment</li>
            <li>Preview the final composition</li>
            <li>Download your collage</li>
          </ol>
          <p>👉 Try it here:</p>
          <div className="ic-cta-wrap">
            <a href="/image-collage" className="ic-cta" onClick={(e)=>{ e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/image-collage'); }}>Use the Image Collage Tool →</a>
          </div>
        </section>

        <section className="ic-section">
          <h3>Real-World Use Cases</h3>
          <ul className="ic-list">
            <li>📱 Social Media Posts — combine highlights into one post and increase engagement</li>
            <li>🛍 Product Showcases — display multiple angles and highlight features</li>
            <li>✈️ Travel Memories — show an entire trip in one frame</li>
            <li>💼 Portfolio Presentation — show variety of work quickly</li>
          </ul>
        </section>

        <section className="ic-section">
          <h3>Image Collage vs Gallery (Important Difference)</h3>
          <p><strong>Collage:</strong> Single image, strong storytelling, efficient space usage, high visual impact.</p>
          <p><strong>Gallery:</strong> Multiple images, moderate storytelling, requires scrolling.</p>
        </section>

        <section className="ic-section">
          <h3>Tips to Make Your Collage Stand Out</h3>
          <ul className="ic-list">
            <li>Use contrast (light vs dark images)</li>
            <li>Mix close-up and wide shots</li>
            <li>Add subtle borders</li>
            <li>Keep a consistent color tone</li>
          </ul>
        </section>

        <section className="ic-section">
          <h3>FAQ</h3>
          <p><strong>How many images should I use in a collage?</strong><br/>Usually 3–6 images works best for clarity and balance.</p>
          <p><strong>Can I use different image sizes?</strong><br/>Yes — but keep alignment clean to avoid a messy look.</p>
          <p><strong>Are collages good for SEO or websites?</strong><br/>Yes — they save space, improve visual engagement, and reduce page clutter.</p>
          <p><strong>Do collages reduce image quality?</strong><br/>Not if created properly — ensure source images are high quality.</p>
        </section>

        <section className="ic-section">
          <h3>Conclusion</h3>
          <p>Image collages are more than just combining photos — they’re a powerful way to tell stories, present information, and capture attention. With the right layout and purpose, a simple set of images can become a compelling visual experience.</p>
          <p>👉 Create your own collage here:</p>
          <div className="ic-cta-wrap">
            <a href="/image-collage" className="ic-cta" onClick={(e)=>{ e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/image-collage'); }}>Image Collage Tool →</a>
          </div>
        </section>
      </div>

      {showPreview && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={() => setShowPreview(false)} ref={previewOverlayRef}>
          <div ref={previewWrapperRef} style={{ background: '#fff', borderRadius: 8, padding: 12, width: 'min(95vw, 880px)', maxWidth: '95vw', height: '90vh', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }} onClick={e => e.stopPropagation()}>
            <div ref={previewHeaderRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, zIndex: 2 }}>
              <div style={{ color: '#222', fontWeight: 600 }}>Preview</div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={() => { setOffsets(images.map(()=>({x:0,y:0}))); setScales(images.map(()=>1)); setBgColor('#ffffff'); setPreviewGap(10); }} className="collage-btn" style={{ ...previewBtnStyle }}>Reset</button>
                <button onClick={async () => { await handleCollage(totalWidth, totalHeight, offsets, scales, bgColor); setShowPreview(false); }} className="collage-btn" style={{ ...previewBtnStyle }}>Finalize Collage</button>
                <button onClick={() => setShowPreview(false)} className="collage-btn" style={{ ...previewBtnStyle, marginLeft: 8, background: '#ff6b6b', borderColor: '#ff6b6b', color: '#fff' }}>Close</button>
              </div>
            </div>

            <div ref={previewInfoRef} style={{ color: '#444', fontSize: '0.95rem', lineHeight: '1.35', marginBottom: 8 }}>
              <div>- Drag images to reposition, click on Border color to change it</div>
              <div>- Hold Alt + scroll to zoom (desktop). Use two-finger pinch to zoom on touch.</div>
              
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#333', fontWeight: 500 }}>
                  Border color:
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: 42, height: 28, padding: 0, border: 'none', background: 'none' }} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#333', fontWeight: 500 }}>
                  Border thickness:
                  <input type="range" min={0} max={100} value={previewGap} onChange={e => setPreviewGap(Number(e.target.value))} style={{ width: 90, cursor: 'pointer', accentColor: '#4f8ef7' }} />
                  <span style={{ minWidth: 24, textAlign: 'right', fontSize: '0.9rem' }}>{previewGap}</span>
                </label>
            </div>

            <div ref={previewRef} onWheel={handlePreviewWheel} style={{ flex: 1, minHeight: 0, width: '100%', overflow: 'auto', position: 'relative', background: '#e8eaf2', border: '1px solid #d8dbe8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* CSS padding on frame-wrapper creates equal border on ALL 4 sides without
                  any transform / subpixel issues. Overflow clip sits on a separate wrapper. */}
              <div style={{ padding: 6, flexShrink: 0, lineHeight: 0 }}>
                <div style={{ width: Math.floor(previewScaledSize.w), height: Math.floor(previewScaledSize.h), overflow: 'hidden', position: 'relative' }}>
                  <div style={{ width: previewContentSize.w || expectedWidth, height: previewContentSize.h || expectedHeight, transform: `scale(${previewScale})`, transformOrigin: 'top left', position: 'absolute', left: 0, top: 0, boxSizing: 'border-box', background: bgColor }}>
                    {/* Render grid cells */}
                    {Array.from({ length: rows * columns }).map((_, idx) => {
                      const col = idx % columns;
                      const row = Math.floor(idx / columns);
                      const cellW = width;
                      const cellH = height;
                      const gap = typeof previewGap === 'number' ? previewGap : 10;
                      const left = col * (cellW + gap) + gap;
                      const top = row * (cellH + gap) + gap;
                      const file = images[idx];
                      const url = previewUrls[idx];
                      const meta = previewMeta[idx] || { w: 1, h: 1 };
                      const off = offsets[idx] || { x: 0, y: 0 };

                      const imgRatio = meta.w / meta.h;
                      const cellRatio = cellW / cellH;
                      let drawW0, drawH0;
                      if (imgRatio > cellRatio) {
                        drawH0 = cellH;
                        drawW0 = cellH * imgRatio;
                      } else {
                        drawW0 = cellW;
                        drawH0 = cellW / imgRatio;
                      }
                      const scale = (scales && scales[idx]) || 1;
                      const drawW = Math.round(drawW0 * scale);
                      const drawH = Math.round(drawH0 * scale);

                      return (
                        <div key={idx} style={{ position: 'absolute', left, top, width: cellW, height: cellH, overflow: 'hidden', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none' }} onPointerDown={e => onCellPointerDown(e, idx, cellW, cellH, left, top, meta)} onPointerMove={e => onCellPointerMove(e, idx)} onPointerUp={e => onCellPointerUp(e, idx)} onPointerCancel={e => onCellPointerUp(e, idx)} onWheel={e => onImageWheel(e, idx, meta, off, cellW, cellH, left, top)}>
                          {file && url && !previewErrors[idx] ? (
                            <img src={url} data-idx={idx} alt={file.name} draggable={false} onError={() => tryPreviewDataUrl(idx)} style={{ position: 'absolute', left: off.x + (cellW - drawW) / 2, top: off.y + (cellH - drawH) / 2, width: drawW, height: drawH, userSelect: 'none', pointerEvents: 'none' }} />
                          ) : file ? (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 12, padding: 6, textAlign: 'center' }}>Preview not available for this image</div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCollageView;
