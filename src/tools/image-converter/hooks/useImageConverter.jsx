import { useState, useRef } from 'react';

const FORMAT_MIME = {
  JPG:  'image/jpeg',
  PNG:  'image/png',
  WebP: 'image/webp',
  AVIF: 'image/avif',
  BMP:  'image/bmp',
  GIF:  'image/gif',
  ICO:  'image/x-icon',
};

const EXT = {
  'image/jpeg':   'jpg',
  'image/png':    'png',
  'image/webp':   'webp',
  'image/avif':   'avif',
  'image/bmp':    'bmp',
  'image/gif':    'gif',
  'image/x-icon': 'ico',
};

// Formats that don't support transparency — flatten to white before encoding
const OPAQUE_FORMATS = new Set(['image/jpeg', 'image/bmp', 'image/gif']);

function resolveMime(file) {
  // Normalize alternate ICO MIME type
  if (file.type === 'image/vnd.microsoft.icon' || file.type === 'image/ico') return 'image/x-icon';
  if (file.type) return file.type;
  if (/\.tiff?$/i.test(file.name)) return 'image/tiff';
  if (/\.svg$/i.test(file.name)) return 'image/svg+xml';
  if (/\.ico$/i.test(file.name)) return 'image/x-icon';
  return '';
}

function isTiff(file) {
  return file.type === 'image/tiff' || /\.tiff?$/i.test(file.name);
}

function getAvailableFormats(inputMime) {
  const all = Object.keys(FORMAT_MIME);
  const inputKey = Object.entries(FORMAT_MIME).find(([, v]) => v === inputMime)?.[0];
  return inputKey ? all.filter((f) => f !== inputKey) : all;
}

function getDefaultOutputFormat(inputMime) {
  const map = {
    'image/jpeg':    'PNG',
    'image/png':     'JPG',
    'image/webp':    'JPG',
    'image/avif':    'JPG',
    'image/bmp':     'PNG',
    'image/gif':     'PNG',
    'image/tiff':    'PNG',
    'image/svg+xml':  'PNG',
    'image/x-icon':   'PNG',
  };
  return map[inputMime] ?? 'JPG';
}

// ── ICO encoder — multi-size PNG-in-ICO container ────────────────────────────
async function buildIcoBlob(sourceCanvas, sizes) {
  const pngArrays = await Promise.all(
    sizes.map(async (sz) => {
      const c = document.createElement('canvas');
      c.width = sz;
      c.height = sz;
      c.getContext('2d').drawImage(sourceCanvas, 0, 0, sz, sz);
      const blob = await new Promise((res) => c.toBlob(res, 'image/png'));
      return new Uint8Array(await blob.arrayBuffer());
    })
  );
  const count = sizes.length;
  const dataOffset = 6 + 16 * count;
  let totalSize = dataOffset;
  for (const p of pngArrays) totalSize += p.length;
  const buf = new ArrayBuffer(totalSize);
  const dv = new DataView(buf);
  dv.setUint16(0, 0, true);     // reserved
  dv.setUint16(2, 1, true);     // type: 1 = ICO
  dv.setUint16(4, count, true); // image count
  let imgOffset = dataOffset;
  for (let i = 0; i < count; i++) {
    const sz = sizes[i];
    const png = pngArrays[i];
    const de = 6 + i * 16;
    dv.setUint8(de + 0, sz >= 256 ? 0 : sz); // width (0 = 256)
    dv.setUint8(de + 1, sz >= 256 ? 0 : sz); // height
    dv.setUint8(de + 2, 0);                   // color count
    dv.setUint8(de + 3, 0);                   // reserved
    dv.setUint16(de + 4, 1, true);            // color planes
    dv.setUint16(de + 6, 32, true);           // bits per pixel
    dv.setUint32(de + 8, png.length, true);   // data size
    dv.setUint32(de + 12, imgOffset, true);   // data offset
    new Uint8Array(buf, imgOffset, png.length).set(png);
    imgOffset += png.length;
  }
  return new Blob([buf], { type: 'image/x-icon' });
}

// ── BMP encoder — 24-bit, no compression ─────────────────────────────────────
function buildBmpBlob(canvas) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelBytes = rowSize * height;
  const fileSize = 54 + pixelBytes;
  const buf = new ArrayBuffer(fileSize);
  const v = new DataView(buf);
  v.setUint8(0, 0x42); v.setUint8(1, 0x4d);
  v.setUint32(2, fileSize, true);
  v.setUint32(6, 0, true);
  v.setUint32(10, 54, true);
  v.setUint32(14, 40, true);
  v.setInt32(18, width, true);
  v.setInt32(22, height, true);   // positive = bottom-up
  v.setUint16(26, 1, true);
  v.setUint16(28, 24, true);
  v.setUint32(30, 0, true);       // BI_RGB
  v.setUint32(34, pixelBytes, true);
  v.setInt32(38, 2835, true); v.setInt32(42, 2835, true);
  v.setUint32(46, 0, true); v.setUint32(50, 0, true);
  for (let y = 0; y < height; y++) {
    const rowOff = 54 + (height - 1 - y) * rowSize;
    for (let x = 0; x < width; x++) {
      const si = (y * width + x) * 4;
      const di = rowOff + x * 3;
      v.setUint8(di,     data[si + 2]); // B
      v.setUint8(di + 1, data[si + 1]); // G
      v.setUint8(di + 2, data[si + 0]); // R
    }
  }
  return new Blob([buf], { type: 'image/bmp' });
}

// ── TIFF → canvas (lazy: utif loaded only on demand) ──────────────────────────
async function tiffToCanvas(file) {
  const mod = await import('utif');
  const UTIF = mod.default ?? mod;
  const buffer = await file.arrayBuffer();
  const ifds = UTIF.decode(buffer);
  UTIF.decodeImage(buffer, ifds[0]);
  const rgba = UTIF.toRGBA8(ifds[0]);
  const { width, height } = ifds[0];
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').putImageData(
    new ImageData(new Uint8ClampedArray(rgba), width, height),
    0, 0
  );
  return canvas;
}

// ── Generic image file → canvas ───────────────────────────────────────────────
async function fileToCanvas(file, fillOpaque) {
  const canvas = document.createElement('canvas');
  await new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (fillOpaque) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
  return canvas;
}

// ── Canvas → GIF blob (lazy: gifenc loaded only on demand) ────────────────────
async function canvasToGifBlob(canvas) {
  const { GIFEncoder, quantize, applyPalette } = await import('gifenc');
  const { width, height } = canvas;
  const data = canvas.getContext('2d').getImageData(0, 0, width, height).data;
  const palette = quantize(data, 256);
  const index = applyPalette(data, palette);
  const gif = GIFEncoder();
  gif.writeFrame(index, width, height, { palette });
  gif.finish();
  return new Blob([gif.bytes()], { type: 'image/gif' });
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useImageConverter() {
  const [mainImage, setMainImage] = useState(null);
  const [inputMime, setInputMime] = useState(null);
  const [outputFormat, setOutputFormat] = useState('JPG');
  const [availableFormats, setAvailableFormats] = useState(Object.keys(FORMAT_MIME));
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputName, setOutputName] = useState('');
  const [convertedFormat, setConvertedFormat] = useState(null);
  const [icoSize, setIcoSize] = useState(256);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();

  const processFile = (file) => {
    if (!file) return;
    const mime = resolveMime(file);
    if (!mime.startsWith('image/')) {
      setErrorMsg('Please select a valid image file.');
      return;
    }
    setMainImage(file);
    setOutputUrl(null);
    setErrorMsg('');
    setInputMime(mime);
    setAvailableFormats(getAvailableFormats(mime));
    setOutputFormat(getDefaultOutputFormat(mime));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleFileInput = (e) => processFile(e.target.files[0]);



  const handleConvert = async () => {
    if (!mainImage) return;
    setStatus('processing');
    setErrorMsg('');
    try {
      const targetMime = FORMAT_MIME[outputFormat];
      const fillOpaque = OPAQUE_FORMATS.has(targetMime);

      let canvas;
      if (isTiff(mainImage)) {
        canvas = await tiffToCanvas(mainImage);
        if (fillOpaque) {
          const tmp = document.createElement('canvas');
          tmp.width = canvas.width;
          tmp.height = canvas.height;
          const ctx = tmp.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, tmp.width, tmp.height);
          ctx.drawImage(canvas, 0, 0);
          canvas = tmp;
        }
      } else {
        canvas = await fileToCanvas(mainImage, fillOpaque);
      }

      let blob;
      if (targetMime === 'image/bmp') {
        blob = buildBmpBlob(canvas);
      } else if (targetMime === 'image/gif') {
        blob = await canvasToGifBlob(canvas);
      } else if (targetMime === 'image/x-icon') {
        blob = await buildIcoBlob(canvas, [icoSize]);
      } else {
        blob = await new Promise((resolve) => {
          canvas.toBlob(
            resolve,
            targetMime,
            targetMime === 'image/jpeg' ? 0.92 : undefined
          );
        });
      }

      if (!blob) {
        setErrorMsg(
          `Conversion to ${outputFormat} failed. Your browser may not support encoding to this format.`
        );
        setStatus('idle');
        return;
      }

      const baseName = mainImage.name.replace(/\.[^.]+$/, '');
      const ext = EXT[targetMime] || outputFormat.toLowerCase();
      setOutputUrl(URL.createObjectURL(blob));
      setOutputName(`${baseName}-converted.${ext}`);
      setConvertedFormat(outputFormat);
    } catch (err) {
      setErrorMsg('Conversion failed: ' + (err?.message ?? 'Unknown error'));
    }
    setStatus('idle');
  };

  const handleClear = () => {
    setMainImage(null);
    setInputMime(null);
    setOutputUrl(null);
    setOutputName('');
    setConvertedFormat(null);
    setErrorMsg('');
    setStatus('idle');
    setAvailableFormats(Object.keys(FORMAT_MIME));
    setOutputFormat('JPG');
    setIcoSize(256);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return {
    mainImage,
    inputMime,
    outputFormat,
    setOutputFormat,
    availableFormats,
    outputUrl,
    outputName,
    convertedFormat,
    icoSize,
    setIcoSize,
    status,
    errorMsg,
    isDragging,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    handleConvert,
    handleClear,
  };
}
