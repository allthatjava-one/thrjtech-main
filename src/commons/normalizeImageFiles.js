/**
 * Normalizes HEIC/HEIF files to JPEG using heic2any (lazy loaded).
 * Other file types are returned as-is.
 *
 * Samsung Galaxy phones save HEIF images with a .jpg extension and
 * image/jpeg MIME type, so we also detect HEIF by reading the file's
 * magic bytes (ISO Base Media File Format "ftyp" box).
 */

function isHeicByTypeOrExtension(file) {
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    /\.heic$/i.test(file.name) ||
    /\.heif$/i.test(file.name)
  );
}

// HEIC/HEIF brands found in the ftyp box (bytes 8-11 of the file).
const HEIC_BRANDS = new Set([
  'heic', 'heis', 'hevc', 'hevx', 'heim', 'heix', 'hevm', 'hevs', 'mif1', 'msf1',
]);

function isHeicByMagicBytes(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arr = new Uint8Array(e.target.result);
        // ISO BMFF: bytes 4-7 are the ASCII string "ftyp"
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

export async function normalizeImageFile(file) {
  // Fast path: type or extension already identifies it as HEIC/HEIF.
  // Slow path: read first 12 bytes to catch Samsung's misidentified HEIF files
  // (stored as .jpg with image/jpeg MIME type but actual HEIF content).
  const heic = isHeicByTypeOrExtension(file) || await isHeicByMagicBytes(file);
  if (!heic) return file;
  try {
    const heic2any = await import('heic2any').then(m => m.default ?? m);
    const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
    const converted = Array.isArray(blob) ? blob[0] : blob;
    // Keep .jpg extension if the file already had it (Samsung case); otherwise swap .heic/.heif → .jpg
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
