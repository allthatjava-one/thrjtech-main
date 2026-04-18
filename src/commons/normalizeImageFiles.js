/**
 * Normalizes image files before they reach image tools.
 *
 * Problems this solves:
 *  - Samsung Galaxy's content provider sometimes delivers files with file.type = ""
 *    even for valid JPEG/PNG images. The magic-byte sniffer fixes this.
 *  - Samsung Galaxy camera saves HEIF photos with .jpg extension and image/jpeg
 *    MIME type. Magic-byte detection catches them as HEIF.
 *  - iPhone HEIC files are caught by the MIME type / extension check.
 *  - Chrome for Android does NOT decode image/heic blobs via createImageBitmap()
 *    (known Chromium limitation). We use an <img> + img.decode() path instead,
 *    which routes through Android's system MediaCodec HEIF decoder.
 *  - heic2any (libheif WASM) is kept as a fallback for non-Android browsers.
 */

// ---------------------------------------------------------------------------
// Magic byte signatures
// ---------------------------------------------------------------------------
const HEIC_BRANDS = new Set([
  'heic', 'heis', 'hevc', 'hevx', 'heim', 'heix', 'hevm', 'hevs', 'mif1', 'msf1',
]);

/** Read the first 16 bytes of a file/blob using the modern arrayBuffer() API. */
async function readHeader(file) {
  try {
    const buf = await file.slice(0, 16).arrayBuffer();
    return new Uint8Array(buf);
  } catch {
    return new Uint8Array(0);
  }
}

/**
 * Detect the real MIME type from magic bytes.
 * Returns a MIME string, 'image/heic' for all HEIF variants, or null.
 */
async function detectMime(file) {
  const b = await readHeader(file);
  if (!b.length) return null;

  // JPEG: FF D8 FF
  if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return 'image/jpeg';

  // PNG: 89 50 4E 47
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return 'image/png';

  // GIF: 47 49 46 38
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return 'image/gif';

  // WebP: RIFF????WEBP
  if (
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  ) return 'image/webp';

  // AVIF/HEIC/HEIF: ISO BMFF — "ftyp" box at bytes 4-7
  if (
    b.length >= 12 &&
    b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70
  ) {
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

/**
 * Try to decode the file as HEIC using a hidden <img> + img.decode().
 * We re-wrap the bytes with an explicit image/heic MIME type so Chrome
 * for Android routes decoding through Android's system MediaCodec.
 * img.decode() is the correct async API — it guarantees naturalWidth/Height
 * are valid when it resolves, unlike the onload event.
 */
async function convertViaImg(file) {
  let url = null;
  try {
    const bytes = await file.arrayBuffer();
    // Try both heic and heif MIME types — Samsung uses different subtypes
    for (const mime of ['image/heic', 'image/heif']) {
      let typeUrl = null;
      try {
        const blob = new Blob([bytes], { type: mime });
        typeUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.src = typeUrl;
        await img.decode(); // throws if browser can't decode
        if (!img.naturalWidth || !img.naturalHeight) throw new Error('zero dimensions');
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d').drawImage(img, 0, 0);
        const result = await new Promise(resolve =>
          canvas.toBlob(
            blob => resolve(blob ? new File([blob], outputName(file), { type: 'image/jpeg' }) : null),
            'image/jpeg', 0.92,
          )
        );
        if (result) return result;
      } catch { /* try next mime or fall through */ }
      finally { if (typeUrl) try { URL.revokeObjectURL(typeUrl); } catch {} }
    }
    return null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function normalizeImageFile(file) {
  // Step 1: Detect the real MIME type from magic bytes.
  // This fixes two cases:
  //  a) file.type === "" — Android content provider didn't report a MIME type
  //  b) file.type === "image/jpeg" but bytes are actually HEIF (Samsung camera)
  const detectedMime = await detectMime(file);

  let f = file;
  // If the reported type is wrong or missing, create a corrected File object.
  // We always correct on empty type, and also correct jpeg→heic when bytes say HEIF.
  if (detectedMime && (!file.type || (file.type !== detectedMime && detectedMime === 'image/heic'))) {
    f = new File([file], file.name, { type: detectedMime });
  }

  // Step 2: If the file is HEIC/HEIF, convert to JPEG.
  if (f.type !== 'image/heic' && f.type !== 'image/heif') return f;

  // Path 1: <img> + img.decode() — uses Android MediaCodec on Chrome for Android
  const imgResult = await convertViaImg(f);
  if (imgResult) return imgResult;

  // Path 2: heic2any (libheif WASM) — works on desktop and older mobile browsers
  try {
    const heic2any = await import('heic2any').then(m => m.default ?? m);
    const blob = await heic2any({ blob: f, toType: 'image/jpeg', quality: 0.92 });
    const converted = Array.isArray(blob) ? blob[0] : blob;
    return new File([converted], outputName(f), { type: 'image/jpeg' });
  } catch {
    return f; // last resort: return whatever we have
  }
}

export async function normalizeImageFiles(files) {
  return Promise.all(Array.from(files).map(normalizeImageFile));
}

/** Returns true if the file looks like a supported image (by type or extension). */
export function isImageFile(file) {
  if (!file) return false;
  if (file.type && file.type.startsWith('image/')) return true;
  // Accept files with no reported type — normalizeImageFile will fix the type.
  // Also accept files with known image extensions in case type is empty.
  return !file.type || /\.(jpe?g|png|webp|gif|avif|bmp|tiff?|heic|heif)$/i.test(file.name);
}

