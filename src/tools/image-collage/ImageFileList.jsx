
import React, { useEffect, useRef, useState } from "react";

export default function ImageFileList({ images, onMove, onRemove, onReset }) {
  const [urls, setUrls] = useState([]);
  const [errors, setErrors] = useState([]);
  // Track which indices have already attempted the data-URL fallback so we
  // don't enter an infinite onError loop when the data URL is also unrenderable
  // (e.g. HEIC bytes that Chrome cannot display).
  const dataUrlAttempted = useRef([]);

  useEffect(() => {
    // Clean up previous URLs
    urls.forEach(url => { try { if (url && typeof url === 'string' && url.startsWith('blob:')) URL.revokeObjectURL(url); } catch (e) {} });
    const newUrls = images.map(file => URL.createObjectURL(file));
    setUrls(newUrls);
    setErrors(images.map(() => false));
    dataUrlAttempted.current = images.map(() => false);
    return () => {
      newUrls.forEach(url => { try { if (url && typeof url === 'string' && url.startsWith('blob:')) URL.revokeObjectURL(url); } catch (e) {} });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const tryDataUrl = (idx, currentUrls, currentErrors) => {
    // If we already tried the data-URL fallback and the image still errors,
    // mark it as unsupported rather than looping forever.
    if (dataUrlAttempted.current[idx]) {
      const a = currentErrors.slice(); a[idx] = true; setErrors(a); return;
    }
    dataUrlAttempted.current[idx] = true;
    const file = images[idx];
    if (!file) {
      const a = currentErrors.slice(); a[idx] = true; setErrors(a); return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const newUrls = currentUrls.slice();
      newUrls[idx] = reader.result;
      setUrls(newUrls);
      const a = currentErrors.slice(); a[idx] = false; setErrors(a);
    };
    reader.onerror = () => {
      const a = currentErrors.slice(); a[idx] = true; setErrors(a);
    };
    reader.readAsDataURL(file);
  };

    return (
    <div className="image-file-list">
      {images.map((file, idx) => (
        <div className="image-file-item" key={file.name + file.size}>
          {errors[idx] ? (
            <div className="image-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6f8', color: '#666', fontSize: 12, padding: 6 }}>
              Unsupported
            </div>
          ) : (
            <img
              src={urls[idx]}
              alt={file.name}
              className="image-thumb"
              draggable={false}
              onError={() => tryDataUrl(idx, urls, errors)}
            />
          )}
          <div className="image-file-actions">
            <button
              type="button"
              disabled={idx === 0}
              onClick={e => { e.stopPropagation(); onMove(idx, idx - 1); }}
              title="Move Left"
            >
              ◀
            </button>
            <button
              type="button"
              disabled={idx === images.length - 1}
              onClick={e => { e.stopPropagation(); onMove(idx, idx + 1); }}
              title="Move Right"
            >
              ▶
            </button>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onReset && onReset(idx); }}
              title="Reset Position"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onRemove(idx); }}
              title="Remove"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
