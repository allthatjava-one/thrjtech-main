/**
 * Normalizes image files before they reach image tools.
 *
 * Root cause of Chrome Android 'Unsupported' issue:
 *   Chrome's content provider sometimes delivers files with file.type = ''
 *   (no MIME type declared). A blob URL created from a typeless File cannot
 *   be rendered by <img> — Chrome has no codec to pick. The FileReader
 *   data-URL fallback also fails (produces data:;base64,... with no image type).
 *
 *   We therefore sniff the first 12 bytes for every file with an empty or
 *   potentially wrong type, assign the correct MIME type, then decide whether
 *   HEIC conversion is needed.
 */

const HEIC_BRANDS = new Set([
  'heic', 'heis', 'hevc', 'hevx', 'heim', 'heix', 'hevm', 'hevs', 'mif1', 'msf1',
]);

/** Read first 12 bytes from a File/Blob. */
async function readHeader(file) {
  try {
    const buf = await file.slice(0, 12).arrayBuffer();
    return new Uint8Array(buf);
  } catch {
    return new Uint8Array(0);
  }
}

/** Detect image MIME type from magic bytes. Returns MIME string or null. */
async function sniffMime(file) {
  const b = await readHeader(file);

  // JPEG: FF D8 FF
  if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return 'image/jpeg';
  // PNG: 89 50 4E 47
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return 'image/png';
  // GIF: 47 49 46 38
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return 'image/gif';
  // WebP: RIFF????WEBP
  if (b.length >= 12 &&
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
  // HEIC/HEIF: ISO BMFF 'ftyp' box at bytes 4-7
  if (b.length >= 12 &&
    b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) {
    const brand = String.fromCharCode(b[8], b[9], b[10], b[11]).toLowerCase();
    if (HEIC_BRANDS.has(brand)) return 'image/heic';
    if (brand === 'avif' || brand === 'avis') return 'image/avif';
  }
  // BMP: 42 4D
  if (b[0] === 0x42 && b[1] === 0x4D) return 'image/bmp';

  return null;
}

function outputName(file) {
  return /\.(heic|heif)$/i.test(file.name)
    ? file.name.replace(/\.(heic|heif)$/i, '.jpg')
    : file.name;
}

function mimeToExt(mime) {
  if (!mime) return '';
  const m = mime.split('/')[1];
  if (!m) return '';
  if (m.startsWith('jpeg')) return 'jpg';
  if (m.startsWith('tiff')) return 'tif';
  return m.replace(/[^a-z0-9]+/g, '').toLowerCase();
}

function ensureExtension(name, mime) {
  const ext = mimeToExt(mime);
  if (!ext) return name;
  if (/\.[a-z0-9]+$/i.test(name)) {
    return name.replace(/\.[a-z0-9]+$/i, `.${ext}`);
  }
  return `${name}.${ext}`;
}

// Small dev logger. Enable by setting `globalThis.DEBUG_NORMALIZE_IMAGE = true`.
const DEBUG_FLAG_NAME = 'DEBUG_NORMALIZE_IMAGE';
function log(...args) {
  try {
    if (globalThis && globalThis[DEBUG_FLAG_NAME]) {
      console.debug('[normalizeImageFiles]', ...args);
      // also emit to remote endpoint when configured
      if (globalThis.DEBUG_NORMALIZE_IMAGE_REMOTE_URL) {
        try { emitRemoteLog(args); } catch (e) { /* swallow */ }
      }
      // also push into an in-page UI panel when requested
      if (globalThis.DEBUG_NORMALIZE_IMAGE_UI) try { emitToPanel(args); } catch (e) {}
    }
  } catch (e) {
    // ignore on environments without globalThis
  }
}

function sanitizeArg(a) {
  if (!a) return a;
  // File-like objects: include only name/type/size
  if (typeof File !== 'undefined' && a instanceof File) {
    return { __file: true, name: a.name, type: a.type, size: a.size };
  }
  if (a && typeof a === 'object') {
    try { JSON.stringify(a); return a; } catch { return String(a); }
  }
  return a;
}

async function emitRemoteLog(args) {
  const url = globalThis.DEBUG_NORMALIZE_IMAGE_REMOTE_URL;
  if (!url) return;
  const payload = {
    ts: new Date().toISOString(),
    origin: 'normalizeImageFiles',
    payload: args.map(sanitizeArg),
  };
  const body = JSON.stringify(payload);
  try {
    // Prefer sendBeacon for minimal impact
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
      return;
    }
    // Fallback to fetch with keepalive
    if (typeof fetch === 'function') {
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
    }
  } catch (e) {
    // ignore network errors in logger
  }
}

// In-page UI collector for environments where console is not visible (mobile).
function ensureLogPanel() {
  try {
    if (!globalThis.DEBUG_NORMALIZE_IMAGE_UI) return null;
    if (typeof document === 'undefined') return null;
    let panel = document.getElementById('normalize-log-panel');
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'normalize-log-panel';
    Object.assign(panel.style, {
      position: 'fixed', right: '8px', bottom: '8px', width: '320px', maxHeight: '40vh',
      overflow: 'auto', background: 'rgba(0,0,0,0.85)', color: 'white', fontSize: '12px',
      zIndex: 999999, padding: '8px', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
    });
    const header = document.createElement('div');
    header.style.display = 'flex'; header.style.justifyContent = 'space-between'; header.style.marginBottom = '6px';
    const title = document.createElement('div'); title.textContent = 'normalize logs'; title.style.fontWeight = '600';
    const controls = document.createElement('div');
    const clearBtn = document.createElement('button'); clearBtn.textContent = 'Clear';
    clearBtn.style.marginRight = '6px'; clearBtn.onclick = () => { window.__normalizeImageLogs = []; body.innerHTML = ''; };
    const closeBtn = document.createElement('button'); closeBtn.textContent = 'Hide'; closeBtn.onclick = () => { panel.style.display = 'none'; };
    controls.appendChild(clearBtn); controls.appendChild(closeBtn);
    header.appendChild(title); header.appendChild(controls);
    const body = document.createElement('div'); body.id = 'normalize-log-body';
    panel.appendChild(header); panel.appendChild(body);
    document.body.appendChild(panel);
    if (!window.__normalizeImageLogs) window.__normalizeImageLogs = [];
    return panel;
  } catch (e) {
    return null;
  }
}

function emitToPanel(args) {
  try {
    const panel = ensureLogPanel();
    if (!panel) return;
    const body = panel.querySelector('#normalize-log-body');
    const entry = { ts: new Date().toISOString(), payload: args.map(sanitizeArg) };
    window.__normalizeImageLogs = window.__normalizeImageLogs || [];
    window.__normalizeImageLogs.push(entry);
    const row = document.createElement('div');
    row.style.borderTop = '1px solid rgba(255,255,255,0.06)'; row.style.paddingTop = '6px'; row.style.marginTop = '6px';
    row.textContent = `${entry.ts} — ${JSON.stringify(entry.payload)}`;
    body.appendChild(row);
    // keep panel scrolled to bottom
    body.scrollTop = body.scrollHeight;
  } catch (e) { /* ignore */ }
}

/**
 * Convert HEIF to JPEG via a hidden <img> + canvas.
 * Uses img.onload (NOT img.decode — decode() skips Android MediaCodec).
 * canvas.getContext('2d') is null-checked: mobile Chrome returns null under
 * memory pressure, causing an uncaught TypeError otherwise.
 */
async function convertViaImg(file) {
  for (const mime of ['image/heic', 'image/heif']) {
    let url = null;
    log('convertViaImg: trying mime', mime, 'file', file.name);
    try {
      url = URL.createObjectURL(new Blob([file], { type: mime }));
      const result = await new Promise((resolve) => {
        const img = new Image();
        const timer = setTimeout(() => { img.src = ''; resolve(null); }, 20000);
        img.onload = () => {
          clearTimeout(timer);
          if (!img.naturalWidth || !img.naturalHeight) return resolve(null);
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d'); // can be null under memory pressure
            if (!ctx) return resolve(null);
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              b => resolve(b ? new File([b], outputName(file), { type: 'image/jpeg' }) : null),
              'image/jpeg', 0.92,
            );
          } catch { resolve(null); }
        };
        img.onerror = () => { clearTimeout(timer); resolve(null); };
        img.src = url;
      });
      if (result) {
        log('convertViaImg: success', mime, '->', result.type, result.name);
        return result;
      }
    } catch { /* try next mime */ }
    finally { if (url) try { URL.revokeObjectURL(url); } catch {} }
  }
  return null;
}

/** Read a File fully into memory, returning a plain in-memory File. */
async function materializeFile(file) {
  try {
    const buf = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
    return new File([buf], file.name, { type: file.type });
  } catch (e) {
    log('materializeFile failed — keeping original', e && e.message ? e.message : e);
    return file; // caller handles unreadable files
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function normalizeImageFile(file) {
  let f = file;
  log('normalizeImageFile start', { name: file && file.name, type: file && file.type, size: file && file.size });

  // Step 0: Ensure the file is in-memory before any sniffing/slicing.
  // If the caller (normalizeImageFiles) already materialized it this is a no-op
  // because f === file and the read will just re-wrap the same ArrayBuffer.
  // For single-file callers on Android the read happens here.
  if (typeof FileReader !== 'undefined') {
    f = await materializeFile(file);
    log('normalizeImageFile materialized in-memory', { name: f.name, type: f.type, size: f.size });
  }

  // Step 1: Detect and fix the MIME type (all operations now on in-memory f).
  // Sniff bytes when type is missing, non-image, or possibly wrong.
  // Always sniff for Android content-provider uploads which often omit types
  // or mislabel HEIC as image/jpeg.
  const shouldSniff = !f.type || !f.type.startsWith('image/') || f.type === 'image/jpeg';
  if (shouldSniff) {
    const sniffed = await sniffMime(f);
    log('sniffMime result', sniffed);
    if (sniffed && sniffed !== f.type) {
      const name = ensureExtension(f.name || 'unnamed', sniffed);
      f = new File([f], name, { type: sniffed });
      log('normalizeImageFile created corrected File', { name: f.name, type: f.type });
    }
  } else {
    // If there's an image type but the file extension is missing and type is known,
    // ensure the filename has a reasonable extension so downstream code can use it.
    if ((!f.name || !/\.[a-z0-9]+$/i.test(f.name)) && f.type && f.type.startsWith('image/')) {
      const name = ensureExtension(f.name || 'unnamed', f.type);
      f = new File([f], name, { type: f.type });
      log('normalizeImageFile ensured extension', { name: f.name, type: f.type });
    }
  }

  // Catch HEIC/HEIF by extension as a final safety net.
  if (f.type !== 'image/heic' && f.type !== 'image/heif') {
    if (/\.(heic|heif)$/i.test(f.name)) {
      f = new File([f], f.name, { type: 'image/heic' });
    }
  }

  // Step 2: Non-HEIC files return here with the corrected type.
  if (f.type !== 'image/heic' && f.type !== 'image/heif') {
    log('normalizeImageFile non-HEIC candidate', { name: f.name, type: f.type });
    // Verify that the file bytes actually match the declared MIME. Some Android
    // uploads claim `image/jpeg` while containing HEIC bytes — converting the
    // metadata alone is insufficient. If the sniff shows a mismatch, attempt a
    // conversion flow (HEIC -> JPEG) before returning.
    try {
      const actual = await sniffMime(f);
      log('post-sniff check', { declared: f.type, actual });
      if (actual && actual !== f.type) {
        log('type/data mismatch detected — attempting conversion', { name: f.name, declared: f.type, actual });
        // If actual is HEIC-like, try image-based conversion which can handle
        // HEIC content even when the File.type was wrong.
        if (actual === 'image/heic' || actual === 'image/heif') {
          const converted = await convertViaImg(f);
          if (converted) {
            log('conversion after mismatch succeeded', { name: converted.name, type: converted.type });
            return converted;
          }
          // try WASM fallback
          try {
            const heic2any = await import('heic2any').then(m => m.default ?? m);
            const blob = await heic2any({ blob: f, toType: 'image/jpeg', quality: 0.92 });
            const converted = Array.isArray(blob) ? blob[0] : blob;
            const out = new File([converted], outputName(f), { type: 'image/jpeg' });
            log('heic2any conversion after mismatch succeeded', { name: out.name, type: out.type });
            return out;
          } catch (e) {
            log('heic2any conversion after mismatch failed', e && e.message ? e.message : e);
          }
        }
      }
    } catch (e) {
      log('post-sniff verification failed', e && e.message ? e.message : e);
    }
    log('normalizeImageFile returning non-HEIC', { name: f.name, type: f.type });
    return f;
  }

  // Step 3: Convert HEIF -> JPEG.

  // Path 1: <img> + canvas — Android MediaCodec via Chrome for Android 12+
  const imgResult = await convertViaImg(f);
  if (imgResult) {
    log('normalizeImageFile converted via <img>', { name: imgResult.name, type: imgResult.type });
    return imgResult;
  }

  // Path 2: heic2any (libheif WASM) — desktop and older mobile browsers
  try {
    const heic2any = await import('heic2any').then(m => m.default ?? m);
    const blob = await heic2any({ blob: f, toType: 'image/jpeg', quality: 0.92 });
    const converted = Array.isArray(blob) ? blob[0] : blob;
    const out = new File([converted], outputName(file), { type: 'image/jpeg' });
    log('normalizeImageFile converted via heic2any', { name: out.name, type: out.type });
    return out;
  } catch { /* fall through */ }

  // Last resort: return with image/heic type so Chrome 112+ on Android 12+
  // can attempt native HEIF rendering via <img>.
  return f;
}

export async function normalizeImageFiles(files) {
  const arr = Array.from(files);
  // Phase 1: materialize ALL files into memory in parallel while their
  // content:// URIs are still fresh.  This must happen before any slow
  // normalization work (HEIC detection, canvas conversion, heic2any WASM)
  // which can take seconds and let later URIs expire on Android.
  log('normalizeImageFiles phase-1 materialize', arr.length, 'files');
  const materialized = await Promise.all(arr.map(f => materializeFile(f)));

  // Phase 2: run normalization sequentially on the in-memory copies.
  // Sequential avoids overwhelming the canvas/WASM pipeline on mobile.
  log('normalizeImageFiles phase-2 normalize', materialized.length, 'files');
  const results = [];
  for (const f of materialized) {
    results.push(await normalizeImageFile(f));
  }
  return results;
}

/**
 * Returns true if the file looks like a supported image.
 * Empty-type files are accepted — normalizeImageFile assigns the correct type.
 */
export function isImageFile(file) {
  if (!file) return false;
  if (file.type && file.type.startsWith('image/')) return true;
  return !file.type || /\.(jpe?g|png|webp|gif|avif|bmp|tiff?|heic|heif)$/i.test(file.name);
}

// DEV: expose APIs to global so test UI can call them directly from page.
try {
  if (typeof globalThis !== 'undefined') {
    globalThis.normalizeImageFile = normalizeImageFile;
    globalThis.normalizeImageFiles = normalizeImageFiles;
    globalThis.isImageFile = isImageFile;
  }
} catch (e) {
  // ignore
}
