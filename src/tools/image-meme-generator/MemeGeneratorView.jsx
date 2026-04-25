import { Link, useNavigate } from 'react-router-dom'
import React, { useRef, useState, useEffect } from "react";
import "./MemeGenerator.css";
import { normalizeImageFile } from '../../commons/normalizeImageFiles';
import { useTranslation } from 'react-i18next';

export default function MemeGeneratorView({ initialFile }) {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation('imageMemeGenerator');
  const [imageSrc, setImageSrc] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  // Layers: multiple text layers with position, size and color
  const initialLayers = (() => {
    const defaultFont = 30;
    // fontRatio is fraction of original image height (e.g. 0.08 => 8% of image height)
    const defaultRatio = defaultFont / 600; // choose 600px as a sensible reference height
    return [
      { id: 'layer-1', text: '', placeholder: 'Top Text', x: 0.05, y: 0.08, fontSize: defaultFont, fontRatio: defaultRatio, color: '#ffffff' },
      { id: 'layer-2', text: '', placeholder: 'Bottom Text', x: 0.05, y: 0.92, fontSize: defaultFont, fontRatio: defaultRatio, color: '#ffffff' }
    ];
  })();
  const [layers, setLayers] = useState(initialLayers);
  // start with no selected layer so image zoom (Alt+Scroll / pinch) works immediately
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const initialStateRef = useRef({ layers: initialLayers, imgTransform: { offsetX: 0, offsetY: 0, scale: 1 }, imageSrc: null, selectedLayerId: null });
  const selectedLayerIdRef = useRef(selectedLayerId);

  // Image pan / zoom
  const [imgTransform, setImgTransform] = useState({ offsetX: 0, offsetY: 0, scale: 1 });
  const imgTransformRef = useRef({ offsetX: 0, offsetY: 0, scale: 1 });
  const imageObjRef = useRef(null); // for native event handler closures
  const imgPanning = useRef(null);

  const dragging = useRef(null);
  const wasDraggingRef = useRef(false);
  const [isFileDragging, setIsFileDragging] = useState(false);
  const [imageFileName, setImageFileName] = useState(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Keep refs in sync with state
  useEffect(() => { imageObjRef.current = imageObj; }, [imageObj]);
  useEffect(() => { imgTransformRef.current = imgTransform; }, [imgTransform]);
  useEffect(() => { selectedLayerIdRef.current = selectedLayerId; }, [selectedLayerId]);

  // Auto-open Advanced section when a text layer is selected on the preview
  useEffect(() => {
    if (selectedLayerId) {
      setAdvancedOpen(true);
    }
  }, [selectedLayerId]);

  // helper to check if user made changes compared to initial snapshot
  const hasChanges = () => {
    try {
      const curr = JSON.stringify({ layers, imgTransform, imageSrc, selectedLayerId });
      const initial = JSON.stringify(initialStateRef.current);
      return curr !== initial;
    } catch (err) {
      return false;
    }
  };

  function handleReset() {
    const init = initialStateRef.current;
    // Reset only position and fontSize for existing layers; keep user text and colors
    setLayers((prev) => prev.map(curr => {
      const orig = (init.layers || []).find(l => l.id === curr.id);
      if (!orig) return curr;
      return { ...curr, x: orig.x ?? curr.x, y: orig.y ?? curr.y, fontSize: orig.fontSize ?? curr.fontSize, fontRatio: orig.fontRatio ?? curr.fontRatio };
    }));
    // Reset image transform (pan/zoom) to initial
    setImgTransform({ ...init.imgTransform });
    imgTransformRef.current = { ...init.imgTransform };
    // Keep imageSrc and imageObj unchanged (do not reset uploaded image)
    // Keep selectedLayerId as-is so user focus remains
  }

  // Prevent touch scrolling while dragging/panning
  function preventTouchScroll(e) {
    e.preventDefault();
  }

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      setImageObj(img);
      const reset = { offsetX: 0, offsetY: 0, scale: 1 };
      setImgTransform(reset);
      imgTransformRef.current = reset;
      // When a new image loads, compute a fontRatio relative to the actual image height
      // so the default font looks closer to the intended `defaultFont` (30px) on the preview.
      requestAnimationFrame(() => {
        try {
          const desiredCss = 30; // target on-screen CSS px for new layers
          let actualRatio = img.height ? (desiredCss / img.height) : (desiredCss / 600);
          // If preview element is available, account for the preview draw scale so displayed px ~= desiredCss
          try {
            const previewRect = previewRef.current && previewRef.current.getBoundingClientRect && previewRef.current.getBoundingClientRect();
            if (previewRect && img.width && img.height) {
              const baseScale = Math.min(previewRect.width / img.width, previewRect.height / img.height) || 1;
              const drawH = Math.max(1, Math.round(img.height * baseScale));
              actualRatio = desiredCss / drawH;
            }
          } catch (err) {}

          setLayers(prev => prev.map(l => {
            // Only replace the placeholder initial ratio (30/600) so we don't override user edits
            const placeholderRatio = 30 / 600;
            if (Math.abs((l.fontRatio || 0) - placeholderRatio) < 1e-9) {
              return { ...l, fontRatio: actualRatio };
            }
            return l;
          }));
          // Also update the stored initial snapshot so Reset preserves this baseline
          initialStateRef.current.layers = (initialStateRef.current.layers || []).map(l => {
            const placeholderRatio = 30 / 600;
            if (Math.abs((l.fontRatio || 0) - placeholderRatio) < 1e-9) {
              return { ...l, fontRatio: actualRatio };
            }
            return l;
          });
        } catch (err) {}
      });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // If a File was passed via router state, load it as dataURL
  useEffect(() => {
    if (!initialFile) return;
    try {
      const reader = new FileReader();
      reader.onload = (ev) => setImageSrc(ev.target.result);
      reader.readAsDataURL(initialFile);
    } catch (err) {
      // ignore
    }
  }, [initialFile]);

  // If the user clicks/taps outside the preview area, ensure touch scrolling is re-enabled
  useEffect(() => {
    const onGlobalPointerDown = (ev) => {
      try {
        const tgt = ev.target;
        if (!previewRef.current) return;
        if (!previewRef.current.contains(tgt)) {
          // remove any lingering touchmove blocker so page can scroll
          window.removeEventListener('touchmove', preventTouchScroll, { passive: false });
        }
      } catch (err) {}
    };
    window.addEventListener('pointerdown', onGlobalPointerDown);
    return () => window.removeEventListener('pointerdown', onGlobalPointerDown);
  }, []);

  useEffect(() => {
    drawCanvas();
  }, [imageObj, layers, imgTransform]);

  // Helpers to compute image draw metrics and effective font sizes
  function getImageDrawMetrics() {
    const preview = previewRef.current;
    if (!preview || !imageObj) return null;
    const rect = preview.getBoundingClientRect();
    const imgW = imageObj.width;
    const imgH = imageObj.height;
    const baseScale = Math.min(rect.width / imgW, rect.height / imgH);
    const totalScale = Math.max(0.01, baseScale * imgTransformRef.current.scale);
    const drawW = Math.round(imgW * totalScale);
    const drawH = Math.round(imgH * totalScale);
    return { rect, imgW, imgH, baseScale, totalScale, drawW, drawH };
  }

  function computeFontSizes(layer) {
    // returns { cssPx, canvasPx, lineHeightCss }
    if (!layer) return { cssPx: 0, canvasPx: 0, lineHeightCss: 0 };
    const metrics = getImageDrawMetrics();
    // If we have an image, derive font from fontRatio (relative to original image height)
    if (metrics && layer.fontRatio && metrics.imgH) {
      const canvasPx = Math.max(10, Math.min(240, Math.round(layer.fontRatio * metrics.imgH)));
      const cssPx = Math.max(10, Math.round(layer.fontRatio * metrics.drawH));
      const lineHeightCss = Math.round((cssPx + 6) * 0.82);
      const lineHeightCanvas = Math.round((canvasPx + 6) * 0.82);
      return { cssPx, canvasPx, lineHeightCss, lineHeightCanvas };
    }
    // Fallback to legacy fontSize (plain pixels)
    const cssPx = layer.fontSize || 30;
    const lineHeightCss = Math.round((cssPx + 6) * 0.82);
    const lineHeightCanvas = lineHeightCss;
    return { cssPx, canvasPx: cssPx, lineHeightCss, lineHeightCanvas };
  }

  // Native wheel + touch listeners (passive:false so we can preventDefault)
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const isOverDraggable = (x, y) => {
      try {
        const el = document.elementFromPoint(x, y);
        return el && el.closest && el.closest('.draggable-text');
      } catch (err) { return false; }
    };

    const onWheel = (e) => {
      if (!e.altKey) return;
      e.preventDefault();
      const fontFactor = e.deltaY < 0 ? 1.05 : 0.95;
      const imgFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const overDraggable = isOverDraggable(e.clientX, e.clientY);
      if (overDraggable) {
        // adjust font size of the layer under the pointer if present
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const layerEl = el && el.closest ? el.closest('.draggable-text') : null;
        const selId = layerEl ? (layerEl.dataset && layerEl.dataset.layerId) || selectedLayerIdRef.current : selectedLayerIdRef.current;
        // if no specific layer id available, fall back to selectedLayerIdRef
        const targetId = selId || selectedLayerIdRef.current;
        if (targetId) {
          setLayers(prev => prev.map(l => {
            if (l.id !== targetId) return l;
            // if there's an image, adjust fontRatio so sizes remain relative to original image height
            if (imageObjRef.current && l.fontRatio && imageObjRef.current.height) {
              const imgH = imageObjRef.current.height;
              const currentCanvasPx = Math.max(10, Math.min(240, Math.round(l.fontRatio * imgH)));
              const targetCanvasPx = Math.round(Math.max(10, Math.min(240, currentCanvasPx * fontFactor)));
              const nextRatio = targetCanvasPx / imgH;
              return { ...l, fontRatio: nextRatio };
            }
            const nextSize = Math.round(Math.max(10, Math.min(240, l.fontSize * fontFactor)));
            return { ...l, fontSize: nextSize };
          }));
          return;
        }
      }
      // Otherwise, zoom the image
      if (!imageObjRef.current) return;
      setImgTransform(prev => {
        const next = { ...prev, scale: Math.max(0.1, Math.min(10, prev.scale * imgFactor)) };
        imgTransformRef.current = next;
        return next;
      });
    };

    let lastDist = null;
    const pinchModeRef = { current: null };
    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        lastDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        // decide based on midpoint whether pinch is over a draggable text overlay
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        pinchModeRef.current = isOverDraggable(midX, midY) ? 'font' : 'image';
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 2 && lastDist !== null) {
        e.preventDefault();
        const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        const ratio = dist / lastDist;
        if (pinchModeRef.current === 'font') {
          // try to find a layer under the midpoint
          const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          const el = document.elementFromPoint(midX, midY);
          const layerEl = el && el.closest ? el.closest('.draggable-text') : null;
          const targetId = layerEl ? (layerEl.dataset && layerEl.dataset.layerId) || selectedLayerIdRef.current : selectedLayerIdRef.current;
          if (targetId) {
            setLayers(prev => prev.map(l => {
              if (l.id !== targetId) return l;
              if (imageObjRef.current && l.fontRatio && imageObjRef.current.height) {
                const imgH = imageObjRef.current.height;
                const currentCanvasPx = Math.max(10, Math.min(240, Math.round(l.fontRatio * imgH)));
                const targetCanvasPx = Math.round(Math.max(10, Math.min(240, currentCanvasPx * ratio)));
                const nextRatio = targetCanvasPx / imgH;
                return { ...l, fontRatio: nextRatio };
              }
              const nextSize = Math.round(Math.max(10, Math.min(240, l.fontSize * ratio)));
              return { ...l, fontSize: nextSize };
            }));
          }
        } else {
          // image zoom
          setImgTransform(prev => {
            const next = { ...prev, scale: Math.max(0.1, Math.min(10, prev.scale * ratio)) };
            imgTransformRef.current = next;
            return next;
          });
        }
        lastDist = dist;
      }
    };
    const onTouchEnd = (e) => { if (e.touches.length < 2) { lastDist = null; pinchModeRef.current = null; } };
    preview.addEventListener('wheel', onWheel, { passive: false });
    preview.addEventListener('touchstart', onTouchStart, { passive: false });
    preview.addEventListener('touchmove', onTouchMove, { passive: false });
    preview.addEventListener('touchend', onTouchEnd);
    return () => {
      preview.removeEventListener('wheel', onWheel);
      preview.removeEventListener('touchstart', onTouchStart);
      preview.removeEventListener('touchmove', onTouchMove);
      preview.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  async function handleFile(e) {
    const raw = e.target.files && e.target.files[0];
    if (!raw) return;
    const file = await normalizeImageFile(raw);
    setImageFileName(file.name || null);
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleClearImage() {
    setImageSrc(null);
    setImageObj(null);
    setImageFileName(null);
    setImgTransform({ offsetX: 0, offsetY: 0, scale: 1 });
    imgTransformRef.current = { offsetX: 0, offsetY: 0, scale: 1 };
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handlePreviewClick() {
    if (wasDraggingRef.current) return;
    if (imageObj) return; // when image loaded, click pans; use Change Image button
    if (fileInputRef.current) fileInputRef.current.click();
  }

  // Image pan: pointerDown on preview (text overlays stopPropagation so only bare canvas reaches here)
  function handlePreviewPointerDown(e) {
    if (!imageObj) return;
    // ignore pointerdown when it originates from a text overlay (lets selection/drag on text work)
    try {
      if (e.target && e.target.closest && e.target.closest('.draggable-text')) return;
    } catch (err) {}
    if (e.button !== 0) return;
    e.preventDefault();
    // prevent page scroll while panning with touch
    window.addEventListener('touchmove', preventTouchScroll, { passive: false });
    imgPanning.current = {
      startX: e.clientX,
      startY: e.clientY,
      origOffsetX: imgTransformRef.current.offsetX,
      origOffsetY: imgTransformRef.current.offsetY,
    };
    window.addEventListener('pointermove', onImgPanMove);
    window.addEventListener('pointerup', onImgPanUp, { once: true });
  }

  function onImgPanMove(ev) {
    if (!imgPanning.current) return;
    const dx = ev.clientX - imgPanning.current.startX;
    const dy = ev.clientY - imgPanning.current.startY;
    const next = { ...imgTransformRef.current, offsetX: imgPanning.current.origOffsetX + dx, offsetY: imgPanning.current.origOffsetY + dy };
    imgTransformRef.current = next;
    setImgTransform({ ...next });
  }

  function onImgPanUp(ev) {
    if (!imgPanning.current) return;
    const moved = Math.abs(ev.clientX - imgPanning.current.startX) > 3 || Math.abs(ev.clientY - imgPanning.current.startY) > 3;
    if (moved) { wasDraggingRef.current = true; setTimeout(() => { wasDraggingRef.current = false; }, 0); }
    imgPanning.current = null;
    window.removeEventListener('pointermove', onImgPanMove);
    window.removeEventListener('touchmove', preventTouchScroll, { passive: false });
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsFileDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsFileDragging(false);
  }

  async function handleDrop(e) {
    e.preventDefault();
    setIsFileDragging(false);
    const raw = (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) || null;
    if (!raw) return;
    const file = await normalizeImageFile(raw);
    setImageFileName(file.name || null);
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target.result);
    reader.readAsDataURL(file);
  }

  function drawCanvas() {
    const canvas = canvasRef.current;
    const preview = previewRef.current;
    if (!canvas || !preview) return;
    // If we have an image, size the preview element to match the image's aspect ratio
    if (imageObj) {
      const availableWidth = Math.max(1, preview.clientWidth);
      const aspect = imageObj.height / imageObj.width || 1;
      const desiredHeight = Math.max(1, Math.round(availableWidth * aspect));
      preview.style.height = desiredHeight + 'px';
    } else {
      // reset to CSS min-height when no image
      preview.style.height = '';
    }

    const rect = preview.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // size canvas to preview element (CSS pixels), but set internal pixels for DPR
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));

    const ctx = canvas.getContext('2d');
    // map drawing units to CSS pixels so we can draw using rect.width/height
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!imageObj) {
      // blank canvas — use preview background so it blends seamlessly
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = getComputedStyle(preview).backgroundColor || '#18181b';
      ctx.fillRect(0, 0, rect.width, rect.height);
      return;
    }

    // Fit image into the preview area while preserving aspect ratio
    const imgW = imageObj.width;
    const imgH = imageObj.height;
    const baseScale = Math.min(rect.width / imgW, rect.height / imgH);
    const totalScale = Math.max(0.01, baseScale * imgTransform.scale);
    const drawW = Math.round(imgW * totalScale);
    const drawH = Math.round(imgH * totalScale);

    const centerX = rect.width / 2 + imgTransform.offsetX;
    const centerY = rect.height / 2 + imgTransform.offsetY;

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = getComputedStyle(preview).backgroundColor || '#18181b';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.drawImage(imageObj, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH);
  }

  // Render the meme onto an offscreen canvas at the ORIGINAL image resolution.
  // Font sizes are fontRatio × original image height, positions are fractional × original dimensions.
  // This ensures the downloaded file and popup preview match the relative proportions seen on-page.
  function renderFullResCanvas() {
    if (!imageObj) return null;
    const w = imageObj.width;
    const h = imageObj.height;
    const offscreen = document.createElement('canvas');
    offscreen.width = w;
    offscreen.height = h;
    const ctx = offscreen.getContext('2d');
    ctx.drawImage(imageObj, 0, 0, w, h);
    layers.forEach((layer) => {
      if (!layer.text) return;
      // font size = fontRatio × original image height (keeps text proportional to the actual image)
      const fontPx = layer.fontRatio
        ? Math.max(10, Math.min(2400, Math.round(layer.fontRatio * h)))
        : (layer.fontSize || 30);
      const lineHeight = Math.round((fontPx + 6) * 0.82);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = `${fontPx}px Impact, Arial, sans-serif`;
      ctx.lineWidth = Math.max(2, Math.floor(fontPx / 12));
      ctx.fillStyle = layer.color;
      ctx.strokeStyle = 'black';
      const x = Math.round(layer.x * w);
      const y = Math.round(layer.y * h);
      const lines = layer.text.toUpperCase().split('\n');
      const totalHeight = lines.length * lineHeight;
      const startY = Math.round(y - totalHeight / 2);
      lines.forEach((line, i) => {
        ctx.strokeText(line, x, startY + i * lineHeight);
        ctx.fillText(line, x, startY + i * lineHeight);
      });
    });
    return offscreen;
  }

  function handlePreview() {
    const offscreen = renderFullResCanvas();
    if (!offscreen) return;
    setPreviewUrl(offscreen.toDataURL('image/png'));
    setPreviewOpen(true);
  }

  function handleDownload() {
    const offscreen = renderFullResCanvas();
    if (!offscreen) return;
    const url = offscreen.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meme.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }


  // Drag handlers for overlay text elements (layer id stored in dragging.current)
  function startDrag(e, layerId) {
    // Allow text selection by delaying activation of drag until pointer moves
    e.stopPropagation();
    setSelectedLayerId(layerId);
    const rect = previewRef.current.getBoundingClientRect();
    // Capture the layer's current normalized position so we can move by delta, not jump to cursor
    const layer = layers.find(l => l.id === layerId);
    const origX = layer ? layer.x : 0;
    const origY = layer ? layer.y : 0;
    dragging.current = { layerId, rect, startX: e.clientX, startY: e.clientY, origX, origY, active: false };
    // attach move/up listeners; we'll only update position after threshold is exceeded
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
    // prevent page scrolling on touch while dragging an overlay
    window.addEventListener('touchmove', preventTouchScroll, { passive: false });
  }

  function onPointerMove(ev) {
    if (!dragging.current) return;
    const d = dragging.current;
    const dx = ev.clientX - d.startX;
    const dy = ev.clientY - d.startY;
    // only begin dragging after small movement threshold to allow text selection
    if (!d.active) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      d.active = true;
      // mark that a drag actually happened to suppress click
      wasDraggingRef.current = true;
    }
    const { layerId, rect, origX, origY } = d;
    // Move by delta from the drag start so the text doesn't jump to the cursor
    const x = origX + dx / rect.width;
    const y = origY + dy / rect.height;
    const clamp = (v) => Math.max(0, Math.min(1, v));
    setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, x: clamp(x), y: clamp(y) } : l)));
  }

  function onPointerUp() {
    // if drag did not become active, don't treat this as a drag (allows clicks/selections)
    const didDrag = dragging.current && dragging.current.active;
    dragging.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener('touchmove', preventTouchScroll, { passive: false });
    // defer clearing so the click event that fires right after pointerup still sees wasDraggingRef.current = true
    if (didDrag) {
      setTimeout(() => { wasDraggingRef.current = false; }, 0);
    } else {
      // ensure selection/clicks behave normally
      wasDraggingRef.current = false;
    }
  }

  function addLayer() {
    const id = `layer-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const defaultFont = 30;
    const defaultRatio = defaultFont / 600;
    const newLayer = { id, text: '', placeholder: 'New Text', x: 0.05, y: 0.5, fontSize: defaultFont, fontRatio: defaultRatio, color: '#ffffff' };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(id);
  }

  function removeLayer(id) {
    setLayers((prev) => {
      const next = prev.filter((l) => l.id !== id);
      if (selectedLayerId === id) {
        setSelectedLayerId(next[0] ? next[0].id : null);
      }
      return next;
    });
  }

  function updateSelectedLayer(changes) {
    if (!selectedLayerId) return;
    setLayers((prev) => prev.map((l) => (l.id === selectedLayerId ? { ...l, ...changes } : l)));
  }

  function updateLayer(id, changes) {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...changes } : l)));
  }

  function handleFontSliderChange(e) {
    const value = Number(e.target.value || 0);
    const sel = layers.find(l => l.id === selectedLayerId);
    if (!sel) return;
    const metrics = getImageDrawMetrics();
    if (metrics && metrics.drawH) {
      // convert slider px to ratio of displayed image height -> store as fontRatio relative to original image
      // slider value is CSS px relative to preview; map to original image ratio
      const ratio = value / metrics.drawH;
      updateSelectedLayer({ fontRatio: ratio });
    } else {
      updateSelectedLayer({ fontSize: value });
    }
  }

  return (
    <>
      <h2 className="hero-title">{t('hero.title')}</h2>
      <p className="hero-tagline">{t('hero.tagline')}{' '}
        <Link to="/blogs/meme-generator-guide">{t('hero.blogLink')}</Link></p>
        
      <div className="ir-tip-banner">
        <span className="ir-tip-text">{t('hint.text')}</span>
        <button className="ir-tip-btn" onClick={() => navigate('/image-resizer')}>
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
                <h3>{t('details.whatIs.heading', { defaultValue: 'What is a Meme Generator' })}</h3>
                <p>{t('details.whatIs.body', { defaultValue: 'A meme generator is a lightweight creative editor that lets you place text overlays on images to produce humorous, informative, or expressive graphics quickly. It supports multiple text layers, free positioning, font sizing, color selection, and simple export controls so you can craft a share-ready image in seconds.' })}</p>

                <h3>{t('details.howWorks.heading', { defaultValue: 'How the generator works' })}</h3>
                <p>{t('details.howWorks.body', { defaultValue: 'Upload or drop an image into the canvas area, then add one or more text layers using the controls. Each layer can be positioned by dragging, resized via the advanced controls, and styled with a color picker. The preview area reflects changes in real time.' })}</p>

                <h3>{t('details.whyBrowser.heading', { defaultValue: 'Why use a browser-based tool' })}</h3>
                <p>{t('details.whyBrowser.body', { defaultValue: "Browser-based meme editors are instant and accessible: they don't require installations, run offline once loaded, and keep your images local to your device." })}</p>

                <h3>{t('details.tips.heading', { defaultValue: 'Tips for better memes' })}</h3>
                <ul>
                  <li>{t('details.tips.item1', { defaultValue: 'Use short, punchy captions and capitalize text for classic meme styles.' })}</li>
                  <li>{t('details.tips.item2', { defaultValue: 'Keep good contrast between text and background; add stroke or shadow if needed for readability.' })}</li>
                  <li>{t('details.tips.item3', { defaultValue: 'Use multiple layers for complex layouts—title, subtitle, or small annotations all work well.' })}</li>
                </ul>

                <h3>{t('details.accessibility.heading', { defaultValue: 'Accessibility & privacy' })}</h3>
                <p>{t('details.accessibility.body', { defaultValue: 'Controls are designed with accessibility in mind (large targets, keyboard support). Since composition occurs locally, your images are not transmitted off your device by default — they only leave the browser if you choose to upload or share them.' })}</p>

                <h3>{t('details.faq.heading', { defaultValue: 'FAQs' })}</h3>
                <ul>
                  <li><strong>{t('details.faq.q1', { defaultValue: 'Q: Will my image be uploaded anywhere?' })}</strong> <strong>{t('details.faq.a1', { defaultValue: 'A: No — everything runs client-side in your browser.' })}</strong></li>
                  <li><strong>{t('details.faq.q2', { defaultValue: 'Q: Can I add more than two text lines?' })}</strong> <strong>{t('details.faq.a2', { defaultValue: 'A: Yes — use the ＋ button to add as many text layers as you need.' })}</strong></li>
                  <li><strong>{t('details.faq.q3', { defaultValue: 'Q: What image formats are supported?' })}</strong> <strong>{t('details.faq.a3', { defaultValue: 'A: Any image format your browser supports (JPEG, PNG, WebP, GIF, etc.).' })}</strong></li>
                </ul>
              </div>

            <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
                <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/images/screenshots/meme-generator/meme-generator001.png" alt="Step 1" className="how-img" />
                    <p>{t('howItWorks.step1')}</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/images/screenshots/meme-generator/meme-generator002.png" alt="Step 2" className="how-img" />
                    <p>{t('howItWorks.step2')}</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/images/screenshots/meme-generator/meme-generator003.png" alt="Step 3" className="how-img" />
                    <p>{t('howItWorks.step3')}</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/images/screenshots/meme-generator/meme-generator004.png" alt="Step 4" className="how-img" />
                    <p>{t('howItWorks.step4')}</p>
                  </li>
                </ol>
              </div>
            </div>
        </div>
      <div
        className={`meme-preview${isFileDragging ? ' dragging drop-zone' : ''}${!imageObj ? ' drop-zone-empty' : ''}${imageObj ? ' has-image' : ''}`}
        ref={previewRef}
        onClick={handlePreviewClick}
        onPointerDown={handlePreviewPointerDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <canvas ref={canvasRef} className="meme-canvas" />
        {!imageObj && (
          <div className="preview-placeholder">{t('canvas.placeholder')}</div>
        )}
        {/* moved preview hint below the preview container so it doesn't overlap the image */}
        <input ref={fileInputRef} type="file" accept="image/*,.heic,.heif" onChange={handleFile} style={{ display: 'none' }} />

        {/* Draggable overlay previews (HTML) to allow interactive positioning */}
        {layers.map((layer) => {
          const { cssPx, lineHeightCss } = computeFontSizes(layer);
          return (
          <div
            key={layer.id}
            data-layer-id={layer.id}
            className={`draggable-text layer-overlay ${layer.id === selectedLayerId ? 'selected' : ''}`}
            style={{ left: `${layer.x * 100}%`, top: `${layer.y * 100}%`, fontSize: `${cssPx}px`, lineHeight: `${lineHeightCss}px`, color: layer.color, whiteSpace: 'pre' }}
            onPointerDown={(e) => startDrag(e, layer.id)}
          >
            {layer.text || (layer.placeholder || '').toUpperCase()}
          </div>
          );
        })}
      </div>
      {imageObj && (
        <div className="preview-hint-below">{t('canvas.previewHint')}</div>
      )}

      {/* File row: filename + Change Image + Clear */}
      {imageObj && (
        <div className="mg-file-row">
          <span className="mg-file-name">{imageFileName || 'Image loaded'}</span>
          <button
            type="button"
            className="mg-change-btn"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            {t('fileRow.change')}
          </button>
          <button type="button" className="mg-clear-btn" onClick={handleClearImage}>
            {t('fileRow.clear')}
          </button>
        </div>
      )}

        
      <div className="meme-generator">
      <div className="meme-controls">
        {/* Image upload handled by the Upload button below — remove top file input */}
        <div className="control-row layers-header">
          <label>{t('layers.label')}</label>
          <div style={{display: 'flex', gap: 8}}>
            <button className="btn" onClick={addLayer} aria-label={t('layers.addAria')}>＋</button>
          </div>
        </div>
        <div className="layers-list">
          {layers.map((layer) => (
            <div key={layer.id} className={`layer-item${layer.id === selectedLayerId ? ' selected' : ''}`} onClick={() => setSelectedLayerId(layer.id)}>
              <textarea
                className="layer-textarea"
                value={layer.text}
                placeholder={layer.placeholder || ''}
                onFocus={(e) => {
                  // if the layer value matches the placeholder (from older data), clear it on first focus
                  const ph = layer.placeholder || '';
                  if (layer.text && (layer.text === ph || layer.text === ph.toUpperCase() || layer.text === ph.toLowerCase())) {
                    updateLayer(layer.id, { text: '' });
                  }
                }}
                onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const el = e.target;
                    const start = el.selectionStart;
                    const end = el.selectionEnd;
                    const newText = layer.text.substring(0, start) + '\n' + layer.text.substring(end);
                    updateLayer(layer.id, { text: newText });
                    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 1; });
                  }
                }}
                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
              />
              <button className="btn" onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }} aria-label={t('layers.removeAria')}>✕</button>
            </div>
          ))}
        </div>
        <div
          className="advanced-toggle"
          role="button"
          tabIndex={0}
          onClick={() => setAdvancedOpen((s) => !s)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setAdvancedOpen((s) => !s); }}
          aria-expanded={advancedOpen}
        >
          <span className={`arrow ${advancedOpen ? 'open' : ''}`}>{advancedOpen ? '▾' : '▸'}</span>
          <span className="advanced-text">{t('advanced.label')}</span>
        </div>
        {advancedOpen && (
          <div className="advanced-section">
            <div className={`control-row${selectedLayerId ? ' font-size-selected' : ''}`}>
              <label>{t('advanced.fontSize')}</label>
              <input
                type="range"
                min="18"
                max="120"
                value={(() => {
                  const sel = layers.find((l) => l.id === selectedLayerId) || {};
                  const { cssPx } = computeFontSizes(sel);
                  return cssPx || sel.fontSize || 30;
                })()}
                onChange={handleFontSliderChange}
              />
              <label>{(() => { const sel = layers.find((l) => l.id === selectedLayerId) || {}; const { cssPx } = computeFontSizes(sel); return (cssPx || sel.fontSize || 30) + 'px'; })()}</label>
            </div>
            <div className="control-row">
              <label>{t('advanced.textColor')}</label>
              <input
                type="color"
                value={(layers.find((l) => l.id === selectedLayerId) || {}).color || '#ffffff'}
                onChange={(e) => updateSelectedLayer({ color: e.target.value })}
              />
            </div>
          </div>
        )}
        <div className="control-row buttons">
          {hasChanges() && (
            <button className="btn" onClick={handleReset}>{t('actions.reset')}</button>
          )}
          {imageObj && (
            <button className="btn" onClick={handlePreview}>{t('actions.preview')}</button>
          )}
          <button className="btn primary" onClick={handleDownload}>{t('actions.download')}</button>
        </div>
      </div>
    </div>
    {previewOpen && previewUrl && (
      <div className="meme-popup-overlay" onClick={() => setPreviewOpen(false)}>
        <div className="meme-popup-dialog" onClick={e => e.stopPropagation()}>
          <img src={previewUrl} alt="Meme preview" className="meme-popup-img" />
          <button className="meme-popup-close" onClick={() => setPreviewOpen(false)}>&times;</button>
        </div>
      </div>
    )}
      {/* --- Meme Guide --- */}
      <div className="mg-guide">
        <h2 className="mg-title">{t('guide.title', { defaultValue: 'How to Create Memes That Actually Go Viral (Simple Guide for Beginners)' })}</h2>
        <p>{t('guide.intro', { defaultValue: 'Memes are everywhere. From social media feeds to group chats, memes have become one of the fastest ways to communicate ideas, humor, and opinions.' })}</p>
        <p>{t('guide.lead2', { defaultValue: "But creating a meme that people actually share? That’s a different story." })}</p>
        <p>{t('guide.learnIntro', { defaultValue: "In this guide, you’ll learn:" })}</p>
        <ul className="mg-list">
          <li>{t('guide.learnItems.item1', { defaultValue: 'What makes a meme work' })}</li>
          <li>{t('guide.learnItems.item2', { defaultValue: 'How to create one from scratch' })}</li>
          <li>{t('guide.learnItems.item3', { defaultValue: 'Common mistakes to avoid' })}</li>
          <li>{t('guide.learnItems.item4', { defaultValue: 'Tips to make your memes more engaging' })}</li>
        </ul>

        <section className='mg-section'>
          <h3>{t('guide.whatIs.heading', { defaultValue: 'What Is a Meme (Really)?' })}</h3>
          <p>{t('guide.whatIs.body', { defaultValue: 'A meme is a piece of content — usually an image with text — designed to be shared and adapted by others. Unlike regular images, memes are relatable, quick to understand, and easy to share.' })}</p>
        </section>

        <section className='mg-section'>
          <h3>{t('guide.why.heading', { defaultValue: 'Why Memes Are So Popular' })}</h3>
          <ol className="mg-list">
            <li>{t('guide.why.item1', { defaultValue: 'Instant Communication — Memes compress ideas into one image and a few words, faster than paragraphs.' })}</li>
            <li>{t('guide.why.item2', { defaultValue: "Relatability \u2014 The best memes make people think \"That's exactly me.\"" })}</li>
            <li>{t('guide.why.item3', { defaultValue: 'Shareability — Memes are designed to be reposted and modified.' })}</li>
            <li>{t('guide.why.item4', { defaultValue: "Low Effort, High Impact — You don't need design skills or expensive tools; just a good idea." })}</li>
          </ol>
        </section>

        <section className='mg-section'>
          <h3>{t('guide.anatomy.heading', { defaultValue: 'Anatomy of a Good Meme' })}</h3>
          <ul className="mg-list">
            <li>{t('guide.anatomy.image', { defaultValue: 'Image: Recognizable or expressive, supports the message.' })}</li>
            <li>{t('guide.anatomy.text', { defaultValue: 'Text: Short and clear, easy to read.' })}</li>
            <li>{t('guide.anatomy.punchline', { defaultValue: 'Punchline: The twist or humor that makes people share.' })}</li>
          </ul>
        </section>

        <section className='mg-section'>
          <h3>{t('guide.types.heading', { defaultValue: 'Types of Memes You Can Create' })}</h3>
          <ul className="mg-list">
            <li>{t('guide.types.item1', { defaultValue: '😂 Relatable Memes — everyday situations' })}</li>
            <li>{t('guide.types.item2', { defaultValue: '🔥 Trend-Based Memes — use current formats' })}</li>
            <li>{t('guide.types.item3', { defaultValue: '💼 Niche Memes — target specific audiences' })}</li>
            <li>{t('guide.types.item4', { defaultValue: '🧠 Informational Memes — mix humor with useful info' })}</li>
          </ul>
        </section>

        <section className='mg-section'>
          <h3>{t('guide.bestPractices.heading', { defaultValue: 'Best Practices' })}</h3>
          <ol className="mg-list">
            <li>{t('guide.bestPractices.item1', { defaultValue: 'Keep text short — 2–3 seconds to read.' })}</li>
            <li>{t('guide.bestPractices.item2', { defaultValue: 'Use clear, bold fonts with high contrast.' })}</li>
            <li>{t('guide.bestPractices.item3', { defaultValue: 'Match text to image so it reinforces the message.' })}</li>
            <li>{t('guide.bestPractices.item4', { defaultValue: 'Stay relevant — trending formats perform better.' })}</li>
            <li>{t('guide.bestPractices.item5', { defaultValue: 'Know your audience and tailor the humor.' })}</li>
          </ol>
        </section>

        <section className='mg-section'>
          <h3>{t('guide.mistakes.heading', { defaultValue: 'Common Mistakes to Avoid' })}</h3>
          <ul className="mg-list">
            <li>{t('guide.mistakes.item1', { defaultValue: 'Too much text' })}</li>
            <li>{t('guide.mistakes.item2', { defaultValue: 'Unclear message' })}</li>
            <li>{t('guide.mistakes.item3', { defaultValue: 'Using outdated formats' })}</li>
            <li>{t('guide.mistakes.item4', { defaultValue: 'Low-quality images' })}</li>
            <li>{t('guide.mistakes.item5', { defaultValue: 'Trying too hard to be funny' })}</li>
          </ul>
        </section>

        <section className='mg-section'>
          <h3>{t('guide.stepByStep.heading', { defaultValue: 'Step-by-Step: How to Create a Meme' })}</h3>
          <ol className="mg-list">
            <li>{t('guide.stepByStep.step1', { defaultValue: 'Upload or choose an image' })}</li>
            <li>{t('guide.stepByStep.step2', { defaultValue: 'Add top and/or bottom text' })}</li>
            <li>{t('guide.stepByStep.step3', { defaultValue: 'Adjust font size and position' })}</li>
            <li>{t('guide.stepByStep.step4', { defaultValue: 'Preview your meme' })}</li>
            <li>{t('guide.stepByStep.step5', { defaultValue: 'Download and share' })}</li>
          </ol>
        </section>

        <section className='mg-section'>
          <h3>{t('guide.useCases.heading', { defaultValue: 'Real-World Use Cases' })}</h3>
          <ul className="mg-list">
            <li>{t('guide.useCases.item1', { defaultValue: '📱 Social Media Content — boost engagement' })}</li>
            <li>{t('guide.useCases.item2', { defaultValue: '💼 Marketing — make brands feel human' })}</li>
            <li>{t('guide.useCases.item3', { defaultValue: '🧑‍💻 Developer Humor — build community' })}</li>
            <li>{t('guide.useCases.item4', { defaultValue: '👥 Group Chats — react faster than typing' })}</li>
          </ul>
        </section>

        <section className='mg-section'>
          <h3>{t('guide.tips.heading', { defaultValue: 'Tips to Make Your Memes Stand Out' })}</h3>
          <ul className="mg-list">
            <li>{t('guide.tips.item1', { defaultValue: 'Use unexpected twists' })}</li>
            <li>{t('guide.tips.item2', { defaultValue: 'Combine two ideas creatively' })}</li>
            <li>{t('guide.tips.item3', { defaultValue: 'Keep it simple but clever' })}</li>
            <li>{t('guide.tips.item4', { defaultValue: 'Test different variations' })}</li>
          </ul>
        </section>

        <section className='mg-section'>
          <h3>{t('guide.comparison.heading', { defaultValue: 'Meme Generator vs Image Editor' })}</h3>
          <table className="mg-table">
            <thead><tr><th>{t('guide.comparison.col1', { defaultValue: 'Feature' })}</th><th>{t('guide.comparison.col2', { defaultValue: 'Meme Generator' })}</th><th>{t('guide.comparison.col3', { defaultValue: 'Image Editor' })}</th></tr></thead>
            <tbody>
              <tr><td>{t('guide.comparison.row1col1', { defaultValue: 'Purpose' })}</td><td>{t('guide.comparison.row1col2', { defaultValue: 'Quick meme creation' })}</td><td>{t('guide.comparison.row1col3', { defaultValue: 'General editing' })}</td></tr>
              <tr><td>{t('guide.comparison.row2col1', { defaultValue: 'Speed' })}</td><td>{t('guide.comparison.row2col2', { defaultValue: 'Fast' })}</td><td>{t('guide.comparison.row2col3', { defaultValue: 'Slower' })}</td></tr>
              <tr><td>{t('guide.comparison.row3col1', { defaultValue: 'Ease of use' })}</td><td>{t('guide.comparison.row3col2', { defaultValue: 'Very easy' })}</td><td>{t('guide.comparison.row3col3', { defaultValue: 'Moderate' })}</td></tr>
              <tr><td>{t('guide.comparison.row4col1', { defaultValue: 'Focus' })}</td><td>{t('guide.comparison.row4col2', { defaultValue: 'Text + image' })}</td><td>{t('guide.comparison.row4col3', { defaultValue: 'Full customization' })}</td></tr>
            </tbody>
          </table>
        </section>

        <section className='mg-section'>
          <h3>{t('guide.faq.heading', { defaultValue: 'FAQ' })}</h3>
          <p><strong>{t('guide.faq.q1', { defaultValue: 'Do I need design skills?' })}</strong> {t('guide.faq.a1', { defaultValue: 'No — just a good idea and clear message.' })}</p>
          <p><strong>{t('guide.faq.q2', { defaultValue: 'Can I use any image?' })}</strong> {t('guide.faq.a2', { defaultValue: 'You can, but be mindful of copyright and prefer common meme formats when possible.' })}</p>
          <p><strong>{t('guide.faq.q3', { defaultValue: 'Why are my memes not getting engagement?' })}</strong> {t('guide.faq.a3', { defaultValue: 'Possible reasons: too much text, not relatable, outdated format.' })}</p>
        </section>

        <section className='mg-section'>
          <h3>{t('guide.conclusionTitle', { defaultValue: 'Conclusion' })}</h3>
          <p>{t('guide.conclusion', { defaultValue: "Creating memes isn’t about complex design — it’s about communication and timing. Focus on clear ideas, simple text, and relatability." })}</p>
          <p>{t('guide.tryIt', { defaultValue: 'Try making your own here:' })}</p>
          <div className="mg-cta-wrap">
            <a href="/image-meme-generator" className="mg-cta" onClick={(e)=>{ e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/image-meme-generator'); }}>{t('guide.ctaBtn', { defaultValue: 'Image Meme Generator →' })}</a>
          </div>
        </section>
      </div>
    </>
  );
}
