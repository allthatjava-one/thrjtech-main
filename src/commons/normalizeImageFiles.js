/**
 * Normalizes HEIC/HEIF files to JPEG using heic2any (lazy loaded).
 * Other file types are returned as-is.
 */
function isHeicFile(file) {
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    /\.heic$/i.test(file.name) ||
    /\.heif$/i.test(file.name)
  );
}

export async function normalizeImageFile(file) {
  if (!isHeicFile(file)) return file;
  try {
    const heic2any = await import('heic2any').then(m => m.default ?? m);
    const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
    const converted = Array.isArray(blob) ? blob[0] : blob;
    const newName = file.name
      .replace(/\.heic$/i, '.jpg')
      .replace(/\.heif$/i, '.jpg');
    return new File([converted], newName, { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

export async function normalizeImageFiles(files) {
  return Promise.all(Array.from(files).map(normalizeImageFile));
}
