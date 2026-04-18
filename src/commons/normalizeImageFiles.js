/**
 * Normalizes HEIC/HEIF files to JPEG before they reach image tools.
 *
 * Detection order:
 *  1. MIME type / file extension (iPhone, standard HEIC)
 *  2. ISO BMFF magic bytes — catches Samsung Galaxy phones that label
 *     HEIF camera photos as image/jpeg with a .jpg extension.
 *
 * Conversion order (first success wins):
 *  1. <img> + canvas with explicit image/heic MIME type — triggers Android's
 *     system MediaCodec HEIF decoder in Chrome for Android 12+ and Safari iOS 17+.
 *     NOTE: createImageBitmap() does NOT use the Android HEIF decoder (known
 *     Chromium limitation), so we use an <img> element instead.
 *  2. heic2any (libheif WASM) — fallback for browsers without native HEIF support.
 *  3. Return the original file unchanged as a last resort.
 */

function isHeicByTypeOrExtension(file) {
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    /\.heic$/i.test(file.name) ||
    /\.heif$/i.test(file.name)
  );
}

// HEIC/HEIF brands in the ISO BMFF ftyp box (bytes 8-11).
const HEIC_BRANDS = new Set([
  'heic', 'heis', 'hevc', 'hevx', 'heim', 'heix', 'hevm', 'hevs', 'mif1', 'msf1',
]);

function isHeicByMagicBytes(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arr = new Uint8Array(e.target.result);
        // ISO BMFF: bytes 4-7 must be ASCII "ftyp"
        if (
          arr.length >= 12 &&
          arr[4] === 0x66 && arr[5] === 0x74 && arr[6] === 0x79 && arr[7] === 0x70
        ) {
          const brand = String.fromCharCode(arr[8], arr[9], arr[10], arr[11]).toLowerCase();
          resolve(HEIC_BRANDS.has(brand));
        } else {
          resolve(false);
        }
      } catch {
        resolve(false);
      }
    };
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 12));
  });
}

function outputName(file) {
  return /\.(heic|heif)$/i.test(file.name)
    ? file.name.replace(/\.(heic|heif)$/i, '.jpg')
    : file.name;
}

/**
 * Convert HEIF to JPEG using an <img> element loaded with an explicit
 * image/heic blob URL.  Chrome for Android routes this through Android's
 * system MediaCodec HEIF decoder (Android 12+), and Safari iOS 17+ handles
 * it natively.  createImageBitmap() does NOT trigger the same path in
 * Chrome for Android, so we use <img> + drawImage() + toBlob() instead.
 */
async function convertViaImg(file) {
  let url = null;
  try {
    const ab = await file.arrayBuffer();
    // Re-wrap with the correct MIME type so the browser's HEIF decoder kicks in.
    // Samsung files arrive labeled image/jpeg but contain HEIF bytes.
    const heicBlob = new Blob([ab], { type: 'image/heic' });
    url = URL.createObjectURL(heicBlob);
    return await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvas.getContext('2d').drawImage(img, 0, 0);
          canvas.toBlob(
            blob => resolve(blob ? new File([blob], outputName(file), { type: 'image/jpeg' }) : null),
            'image/jpeg',
            0.92,
          );
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  } catch {
    return null;
  } finally {
    if (url) try { URL.revokeObjectURL(url); } catch { /* ignore */ }
  }
}

export async function normalizeImageFile(file) {
  const heic = isHeicByTypeOrExtension(file) || await isHeicByMagicBytes(file);
  if (!heic) return file;

  // Path 1: <img> + canvas with explicit image/heic MIME type.
  // Uses Android MediaCodec in Chrome for Android 12+, and native HEIF
  // in Safari iOS 17+.
  const imgResult = await convertViaImg(file);
  if (imgResult) return imgResult;

  // Path 2: heic2any WASM (libheif) — works in browsers without native HEIF.
  try {
    const heic2any = await import('heic2any').then(m => m.default ?? m);
    const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
    const converted = Array.isArray(blob) ? blob[0] : blob;
    return new File([converted], outputName(file), { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

export async function normalizeImageFiles(files) {
  return Promise.all(Array.from(files).map(normalizeImageFile));
}
