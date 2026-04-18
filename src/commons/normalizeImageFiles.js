/**
 * Normalizes HEIC/HEIF files to JPEG before they reach image tools.
 * All other file formats are returned completely unchanged.
 *
 * Detection:
 *  1. MIME type / file extension — catches iPhone HEIC files.
 *  2. ISO BMFF magic bytes — catches Samsung Galaxy phones that save HEIF
 *     camera photos with a .jpg extension and image/jpeg MIME type.
 *
 * Conversion (first success wins):
 *  1. <img> onload + canvas — triggers Android's MediaCodec HEIF decoder
 *     in Chrome for Android 12+. NOTE: img.decode() is intentionally NOT
 *     used because it does not route through Android's MediaCodec and will
 *     reject for HEIF even when Chrome can render it via the normal <img> path.
 *  2. heic2any (libheif WASM) — fallback for browsers without native HEIF.
 *  3. Return the original file unchanged as a last resort.
 */

const HEIC_BRANDS = new Set([
  'heic', 'heis', 'hevc', 'hevx', 'heim', 'heix', 'hevm', 'hevs', 'mif1', 'msf1',
]);

async function isHeicFile(file) {
  // Fast path: MIME type or file extension
  if (
    file.type === 'image/heic' || file.type === 'image/heif' ||
    /\.heic$/i.test(file.name) || /\.heif$/i.test(file.name)
  ) return true;

  // Slow path: read first 12 bytes to detect Samsung's mislabeled HEIF files
  // (type='image/jpeg', name='*.jpg' but bytes are actually HEIF)
  try {
    const buf = await file.slice(0, 12).arrayBuffer();
    const b = new Uint8Array(buf);
    if (
      b.length >= 12 &&
      b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70
    ) {
      const brand = String.fromCharCode(b[8], b[9], b[10], b[11]).toLowerCase();
      return HEIC_BRANDS.has(brand);
    }
  } catch { /* fall through */ }
  return false;
}

function outputName(file) {
  return /\.(heic|heif)$/i.test(file.name)
    ? file.name.replace(/\.(heic|heif)$/i, '.jpg')
    : file.name;
}

/**
 * Convert HEIF to JPEG using a hidden <img> element loaded via a blob URL.
 *
 * Key points:
 * - The blob is re-wrapped with an explicit image/heic MIME type. This tells
 *   Chrome for Android to route decoding through Android's system MediaCodec.
 * - img.decode() is NOT used — it does not go through MediaCodec in Chrome
 *   and will reject HEIF even on Android 12+ with Chrome 114+.
 * - img.onload / img.onerror are used instead.
 * - Lazy Blob wrapping (new Blob([file])) avoids loading the full file into
 *   memory until the browser actually needs to render it.
 */
async function convertViaImg(file) {
  for (const mime of ['image/heic', 'image/heif']) {
    let url = null;
    try {
      // Lazy wrap — bytes are not copied into memory here
      url = URL.createObjectURL(new Blob([file], { type: mime }));
      const result = await new Promise((resolve) => {
        const img = new Image();
        // 15-second timeout — large Samsung photos can be slow to decode
        const timer = setTimeout(() => { img.src = ''; resolve(null); }, 15000);
        img.onload = () => {
          clearTimeout(timer);
          if (!img.naturalWidth || !img.naturalHeight) return resolve(null);
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext('2d').drawImage(img, 0, 0);
            canvas.toBlob(
              b => resolve(b ? new File([b], outputName(file), { type: 'image/jpeg' }) : null),
              'image/jpeg', 0.92,
            );
          } catch { resolve(null); }
        };
        img.onerror = () => { clearTimeout(timer); resolve(null); };
        img.src = url;
      });
      if (result) return result;
    } catch { /* try next mime */ }
    finally { if (url) try { URL.revokeObjectURL(url); } catch {} }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function normalizeImageFile(file) {
  // Only do work if the file is HEIC/HEIF — all other formats pass through unchanged.
  if (!(await isHeicFile(file))) return file;

  // Ensure the file is typed as image/heic before passing to converters.
  // Samsung files arrive as image/jpeg but contain HEIF bytes.
  const heicFile = (file.type === 'image/heic' || file.type === 'image/heif')
    ? file
    : new File([file], file.name, { type: 'image/heic' });

  // Path 1: native <img> + canvas (Chrome for Android 12+ via MediaCodec)
  const imgResult = await convertViaImg(heicFile);
  if (imgResult) return imgResult;

  // Path 2: heic2any WASM (libheif) — works on desktop and older mobile browsers
  try {
    const heic2any = await import('heic2any').then(m => m.default ?? m);
    const blob = await heic2any({ blob: heicFile, toType: 'image/jpeg', quality: 0.92 });
    const converted = Array.isArray(blob) ? blob[0] : blob;
    return new File([converted], outputName(file), { type: 'image/jpeg' });
  } catch { /* fall through */ }

  return file; // last resort — return original
}

export async function normalizeImageFiles(files) {
  return Promise.all(Array.from(files).map(normalizeImageFile));
}

/**
 * Returns true if the file looks like a supported image.
 * Accepts files with an empty type (common from Android's content provider)
 * since normalizeImageFile / the browser will handle them correctly.
 */
export function isImageFile(file) {
  if (!file) return false;
  if (file.type && file.type.startsWith('image/')) return true;
  return !file.type || /\.(jpe?g|png|webp|gif|avif|bmp|tiff?|heic|heif)$/i.test(file.name);
}

