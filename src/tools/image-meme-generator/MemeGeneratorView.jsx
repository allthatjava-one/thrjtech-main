import React, { useRef, useState, useEffect } from "react";
import "./MemeGenerator.css";

export default function MemeGeneratorView({ initialFile }) {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  // Layers: multiple text layers with position, size and color
  const initialLayers = (() => {
    const defaultFont = (typeof window !== 'undefined' && window.innerWidth <= 480) ? 28 : 48;
    return [
      { id: 'layer-1', text: '', placeholder: 'Top Text', x: 0.05, y: 0.08, fontSize: defaultFont, color: '#ffffff' },
      { id: 'layer-2', text: '', placeholder: 'Bottom Text', x: 0.05, y: 0.92, fontSize: defaultFont, color: '#ffffff' }
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
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Keep refs in sync with state
  useEffect(() => { imageObjRef.current = imageObj; }, [imageObj]);
  useEffect(() => { imgTransformRef.current = imgTransform; }, [imgTransform]);
  useEffect(() => { selectedLayerIdRef.current = selectedLayerId; }, [selectedLayerId]);

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
      return { ...curr, x: orig.x ?? curr.x, y: orig.y ?? curr.y, fontSize: orig.fontSize ?? curr.fontSize };
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

  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target.result);
    reader.readAsDataURL(file);
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

  function handleDrop(e) {
    e.preventDefault();
    setIsFileDragging(false);
    const file = (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) || null;
    if (!file) return;
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

  // Draw text onto the canvas (used for export). Keeps preview overlays as the primary UI.
  function drawTextToCanvas(ctx, w, h) {
    if (!ctx) return;
    layers.forEach((layer) => {
      const font = `${layer.fontSize}px Impact, Arial, sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.lineWidth = Math.max(2, Math.floor(layer.fontSize / 12));
      ctx.fillStyle = layer.color;
      ctx.strokeStyle = "black";
      ctx.font = font;
      const lineHeight = Math.round((layer.fontSize + 6) * 0.82);
      if (layer.text) {
        const x = Math.round(layer.x * w);
        const y = Math.round(layer.y * h);
        // Overlay elements use `transform: translateY(-50%)` to vertically center
        // the text block at `top: layer.y`. To match preview positions, offset
        // the canvas start Y by half the total text block height so drawing aligns.
        const lines = layer.text.split('\n').length || 1;
        const totalHeight = lines * lineHeight;
        const startY = Math.round(y - totalHeight / 2);
        drawWrappedText(ctx, layer.text.toUpperCase(), x, startY, w - 20, lineHeight);
      }
    });
  }

  // Draw text onto canvas respecting only explicit \n breaks — no auto word-wrap
  function drawWrappedText(ctx, text, x, y, _maxWidth, lineHeight) {
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const textY = y + i * lineHeight;
      ctx.strokeText(lines[i], x, textY);
      ctx.fillText(lines[i], x, textY);
    }
  }

  function handlePreview() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawCanvas();
    const ctx = canvas.getContext('2d');
    const rect = previewRef.current.getBoundingClientRect();
    drawTextToCanvas(ctx, rect.width, rect.height);
    const url = canvas.toDataURL('image/png');
    setPreviewUrl(url);
    setPreviewOpen(true);
    drawCanvas();
  }

  function handleDownload() {
    // Draw text onto canvas for export, then restore image-only preview
    const canvas = canvasRef.current;
    if (!canvas) return;
    // ensure image-only is drawn (sized to preview)
    drawCanvas();
    const ctx = canvas.getContext("2d");
    // draw text using CSS pixel dimensions (preview width/height)
    const rect = previewRef.current.getBoundingClientRect();
    drawTextToCanvas(ctx, rect.width, rect.height);
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "meme.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    // redraw image-only to remove the temporary text we drew
    drawCanvas();
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
    const defaultFont = (typeof window !== 'undefined' && window.innerWidth <= 480) ? 28 : 48;
    const newLayer = { id, text: '', placeholder: 'New Text', x: 0.05, y: 0.5, fontSize: defaultFont, color: '#ffffff' };
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

  return (
    <>
      <h2 className="hero-title">Meme Generator</h2>
      <p className="hero-tagline">Create fun memes by adding custom text to any image. Drag text anywhere on the canvas, adjust font size and color, then download your finished meme with one click.</p>
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
                <h3>What is a Meme Generator</h3>
                <p>
                  A meme generator is a lightweight creative editor that lets you place text overlays on images to produce humorous, informative, or
                  expressive graphics quickly. It supports multiple text layers, free positioning, font sizing, color selection, and simple export
                  controls so you can craft a share-ready image in seconds. All composition happens within your browser—no external upload is required
                  unless you explicitly share or save to a remote service.
                </p>

                <h3>How the generator works</h3>
                <p>
                  Upload or drop an image into the canvas area, then add one or more text layers using the controls. Each layer can be positioned by
                  dragging, resized via the advanced controls, and styled with a color picker. The preview area reflects changes in real time. When you
                  export, the app merges the text onto the image on an offscreen canvas and creates a downloadable PNG that preserves your layout and
                  styling choices.
                </p>

                <h3>Why use a browser-based tool</h3>
                <p>
                  Browser-based meme editors are instant and accessible: they don't require installations, run offline once loaded, and keep your images
                  local to your device. This makes them convenient for casual creation on phones, tablets, and desktops alike.
                </p>

                <h3>Tips for better memes</h3>
                <ul>
                  <li>Use short, punchy captions and capitalize text for classic meme styles.</li>
                  <li>Keep good contrast between text and background; add stroke or shadow if needed for readability.</li>
                  <li>Use multiple layers for complex layouts—title, subtitle, or small annotations all work well.</li>
                </ul>

                <h3>Accessibility & privacy</h3>
                <p>
                  Controls are designed with accessibility in mind (large targets, keyboard support). Since composition occurs locally, your images are
                  not transmitted off your device by default — they only leave the browser if you choose to upload or share them.
                </p>

                <h3>FAQs</h3>
                <ul>
                  <li><strong>Q:</strong> Will my image be uploaded anywhere? <strong>A:</strong> No — everything runs client-side in your browser.</li>
                  <li><strong>Q:</strong> Can I add more than two text lines? <strong>A:</strong> Yes — use the ＋ button to add as many text layers as you need.</li>
                  <li><strong>Q:</strong> What image formats are supported? <strong>A:</strong> Any image format your browser supports (JPEG, PNG, WebP, GIF, etc.).</li>
                </ul>
              </div>

            <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
                <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/meme-generator/meme-generator001.png" alt="Step 1" className="how-img" />
                    <p>Upload an image by clicking the canvas area or dragging and dropping a file onto it.</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/meme-generator/meme-generator002.png" alt="Step 2" className="how-img" />
                    <p>Click the ＋ button to add a text layer and type your caption in the text box on the left panel.</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/meme-generator/meme-generator003.png" alt="Step 3" className="how-img" />
                    <p>Drag the text overlay on the canvas to position it. Use the Advanced section to adjust font size and color.</p>
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <img src="/screenshots/meme-generator/meme-generator004.png" alt="Step 4" className="how-img" />
                    <p>Add more text layers as needed, then click Download to save your meme as a PNG.</p>
                  </li>
                </ol>
              </div>
          </div>
      </div>
    <div className="meme-generator">
      <div className="meme-controls">
        {/* Image upload handled by the Upload button below — remove top file input */}
        <div className="control-row layers-header">
          <label>Text Layers</label>
          <div style={{display: 'flex', gap: 8}}>
            <button className="btn" onClick={addLayer} aria-label="Add layer">＋</button>
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
              <button className="btn" onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }} aria-label="Remove layer">✕</button>
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
          <span className="advanced-text">Advance...</span>
        </div>
        {advancedOpen && (
          <div className="advanced-section">
            <div className="control-row">
              <label>Font Size</label>
              <input
                type="range"
                min="18"
                max="120"
                value={(layers.find((l) => l.id === selectedLayerId) || {}).fontSize || 48}
                onChange={(e) => updateSelectedLayer({ fontSize: Number(e.target.value) })}
              />
              <label>{(layers.find((l) => l.id === selectedLayerId) || {}).fontSize || 48}px</label>
            </div>
            <div className="control-row">
              <label>Text Color</label>
              <input
                type="color"
                value={(layers.find((l) => l.id === selectedLayerId) || {}).color || '#ffffff'}
                onChange={(e) => updateSelectedLayer({ color: e.target.value })}
              />
            </div>
          </div>
        )}
        <div className="control-row buttons">
          {imageObj && (
            <button className="btn" onClick={() => fileInputRef.current?.click()}>Image...</button>
          )}
          {hasChanges() && (
            <button className="btn" onClick={handleReset}>Reset</button>
          )}
          {imageObj && (
            <button className="btn" onClick={handlePreview}>Preview</button>
          )}
          <button className="btn primary" onClick={handleDownload}>Download</button>
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
          <div className="preview-placeholder">Click or drop image here to upload</div>
        )}
        {/* moved preview hint below the preview container so it doesn't overlap the image */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />

        {/* Draggable overlay previews (HTML) to allow interactive positioning */}
        {layers.map((layer) => (
          <div
            key={layer.id}
            data-layer-id={layer.id}
            className={`draggable-text layer-overlay ${layer.id === selectedLayerId ? 'selected' : ''}`}
            style={{ left: `${layer.x * 100}%`, top: `${layer.y * 100}%`, fontSize: `${layer.fontSize}px`, lineHeight: `${Math.round((layer.fontSize + 6) * 0.82)}px`, color: layer.color, whiteSpace: 'pre' }}
            onPointerDown={(e) => startDrag(e, layer.id)}
          >
            {layer.text || (layer.placeholder || '').toUpperCase()}
          </div>
        ))}
      </div>
      {imageObj && (
        <div className="preview-hint-below">Drag to pan · Alt+Scroll to zoom · Pinch on mobile</div>
      )}
    </div>
    {previewOpen && previewUrl && (
      <div className="meme-popup-overlay" onClick={() => setPreviewOpen(false)}>
        <div className="meme-popup-dialog" onClick={e => e.stopPropagation()}>
          <img src={previewUrl} alt="Meme preview" className="meme-popup-img" />
          <button className="meme-popup-close" onClick={() => setPreviewOpen(false)}>&times;</button>
        </div>
      </div>
    )}
    </>
  );
}
