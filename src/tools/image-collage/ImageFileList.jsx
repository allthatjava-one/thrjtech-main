
import React, { useEffect, useState } from "react";

export default function ImageFileList({ images, onMove, onRemove, onReset }) {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    // Clean up previous URLs
    urls.forEach(url => URL.revokeObjectURL(url));
    const newUrls = images.map(file => URL.createObjectURL(file));
    setUrls(newUrls);
    return () => {
      newUrls.forEach(url => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

    return (
    <div className="image-file-list">
      {images.map((file, idx) => (
        <div className="image-file-item" key={file.name + file.size}>
          <img
            src={urls[idx]}
            alt={file.name}
            className="image-thumb"
            draggable={false}
          />
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
