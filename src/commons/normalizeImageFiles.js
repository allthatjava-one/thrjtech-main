/**
 * Normalizes HEIC/HEIF files to JPEG before they reach image tools.
 *
 * Detection order:
 *  1. MIME type / file extension (iPhone, standard HEIC)
 *  2. ISO BMFF magic bytes — catches Samsung Galaxy phones that label
 *     HEIF camera photos as image/jpeg with a .jpg extension.
 *
 * Conversion order (first success wins):
 *  1. createImageBitmap + canvas — uses the browser's native decoder.
 *     Works on Chrome for Android 12+ and Safari iOS 17+ without any
 *     extra library. Fast, no WASM overhead.
 *  2. heic2any (libheif WASM) — fallback for older browsers that can't
 *     natively decode HEIF.
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

/**
 * Decode the file using the browser's native image decoder (createImageBitmap),
 * draw it onto a canvas, and export as JPEG.
 * This is the preferred path on Chrome Android 12+ and Safari iOS 17+.
 */
async function convertViaCanvas(file) {
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext('2d').drawImage(bitmap, 0, 0);
    bitmap.close();
    const newName = /\.(heic|heif)$/i.test(file.name)
      ? file.name.replace(/\.(heic|heif)$/i, '.jpg')
      : file.name;
    return await new Promise((resolve) => {
      canvas.toBlob(
        blob => resolve(blob ? new File([blob], newName, { type: 'image/jpeg' }) : null),
        'image/jpeg',
        0.92,
      );
    });
  } catch {
    return null;
  }
}

export async function normalizeImageFile(file) {
  const heic = isHeicByTypeOrExtension(file) || await isHeicByMagicBytes(file);
  if (!heic) return file;

  // Path 1: native browser decode (Chrome Android 12+, Safari iOS 17+)
  const canvasResult = await convertViaCanvas(file);
  if (canvasResult) return canvasResult;

  // Path 2: heic2any WASM fallback (older browsers)
  try {
    const heic2any = await import('heic2any').then(m => m.default ?? m);
    const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
    const converted = Array.isArray(blob) ? blob[0] : blob;
    const newName = /\.(heic|heif)$/i.test(file.name)
      ? file.name.replace(/\.(heic|heif)$/i, '.jpg')
      : file.name;
    return new File([converted], newName, { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

export async function normalizeImageFiles(files) {
  return Promise.all(Array.from(files).map(normalizeImageFile));
}
