
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './RotatingCards.css';

const cards = [
  // PDF Compressor
  {
    key: 'compressor',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width: 26, height: 26}}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="18" x2="12" y2="12"/>
        <line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    ),
    title: 'PDF Compressor',
    link: '/pdf-compressor',
    btn: 'Open PDF Compressor',
    description: 'Shrink your PDF files without sacrificing quality. Upload a document and download a smaller version in seconds — no account required, no watermarks.',
    features: [
      'Compress PDFs up to 90% smaller',
      'Adjustable compression levels (low, medium, high)',
      'Supports multi-page PDFs of any size',
      '100% free, no sign-up needed',
    ],
    screenshots: [
      {
        src: '/screenshots/compressor/pdf-compressor-01.png',
        alt: 'Step 1 — Drag and drop your PDF file onto the upload area',
        caption: '1. Drag & drop or browse for your PDF',
      },
      {
        src: '/screenshots/compressor/pdf-compressor-02.png',
        alt: 'Step 2 — File selected, ready to compress',
        caption: '2. Review the file, then hit Compress PDF',
      },
      {
        src: '/screenshots/compressor/pdf-compressor-03.png',
        alt: 'Step 3 — File uploading to R2 storage with a progress bar',
        caption: '3. Securely uploads & compresses in seconds',
      },
      {
        src: '/screenshots/compressor/pdf-compressor-04.png',
        alt: 'Step 4 — Compression complete, download your file',
        caption: '4. Download your compressed PDF',
      },
    ],
  },
  // PDF Merger
  {
    key: 'merger',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width: 26, height: 26}}>
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        <path d="M7.5 7.5L16.5 16.5"/>
      </svg>
    ),
    title: 'PDF Merger',
    link: '/pdf-merger',
    btn: 'Open PDF Merger',
    description: 'Combine multiple PDF files into a single document in seconds. Drag, drop, and merge — no account required, no watermarks.',
    features: [
      'Merge unlimited PDFs for free',
      'Reorder files before merging',
      'No watermarks, no sign-up needed',
      'Fast, secure, and privacy-friendly',
      'Automatically compresses merged file to reduce size (Optional)',
    ],
    screenshots: [
      {
        src: '/screenshots/merger/merger-001.png',
        alt: 'Step 1 — Drag and drop your PDF files onto the upload area',
        caption: '1. Drag & drop or browse for your PDFs',
      },
      {
        src: '/screenshots/merger/merger-002.png',
        alt: 'Step 2 — Arrange the order of your files',
        caption: '2. Arrange the order of your files',
      },
      {
        src: '/screenshots/merger/merger-003.png',
        alt: 'Step 3 — Click Merge PDF to combine files',
        caption: '3. Click Merge PDF to combine files',
      },
      {
        src: '/screenshots/merger/merger-004.png',
        alt: 'Step 4 — Download your merged PDF',
        caption: '4. Download your merged PDF',
      },
    ],
  },
  // PDF Converter
  {
    key: 'converter',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width: 26, height: 26}}>
        <path d="M12 2v6" />
        <path d="M12 22v-6" />
        <path d="M4 12h16" />
        <path d="M7 7l-3 3 3 3" />
        <path d="M17 7l3 3-3 3" />
      </svg>
    ),
    title: 'PDF Converter',
    link: '/pdf-converter',
    btn: 'Open PDF Converter',
    description: 'Convert PDF pages into JPG or PNG images quickly — upload, choose format, and download the results without signing up.',
    features: [
      'Convert PDF to JPG or PNG',
      'Fast, single-click conversions',
      'Preview and download converted images',
      'Temporary storage with automatic cleanup',
      'No account or watermarks',
    ],
    screenshots: [
      {
        src: '/screenshots/converter/PDF-converter001.png',
        alt: 'Step 1 — Drag and drop your PDF file onto the upload area',
        caption: '1. Drag & drop or browse for your PDF',
      },
      {
        src: '/screenshots/converter/PDF-converter002.png',
        alt: 'Step 2 — Select output format',
        caption: '2. Choose JPG or PNG',
      },
      {
        src: '/screenshots/converter/PDF-converter003.png',
        alt: 'Step 3 — Conversion progress and preview',
        caption: '3. Start conversion and watch progress',
      },
      {
        src: '/screenshots/converter/PDF-converter004.png',
        alt: 'Step 4 — Download your converted images',
        caption: '4. Download converted images to your device',
      },
    ],
  },
  // JSON Formatter
  {
    key: 'json-formatter',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width: 26, height: 26}}>
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        <path d="M8 8h8M8 16h8"/>
      </svg>
    ),
    title: 'JSON Formatter',
    link: '/json-formatter',
    btn: 'Open JSON Formatter',
    description: 'Quickly validate, format, and beautify your JSON data. Instantly see errors, get readable output, and copy or download the result.',
    features: [
      'Validate and format JSON instantly',
      'Paste, upload, or drag & drop JSON files',
      'Highlights errors with line numbers',
      'Download or copy formatted output',
    ],
    screenshots: [
      {
        src: '/screenshots/json-formatter/JSON_formatter001.png',
        alt: 'Step 1 — Paste or upload your JSON data',
        caption: '1. Paste or upload your JSON data',
      },
      {
        src: '/screenshots/json-formatter/JSON_formatter002.png',
        alt: 'Step 2 — Click Validate and Format JSON',
        caption: '2. Click Validate and Format JSON',
      },
      {
        src: '/screenshots/json-formatter/JSON_formatter003.png',
        alt: 'Step 3 — Instantly see errors with line numbers if your JSON is invalid',
        caption: '3. Instantly see errors with line numbers if your JSON is invalid',
      },
      {
        src: '/screenshots/json-formatter/JSON_formatter004.png',
        alt: 'Step 4 — Download or copy the beautified JSON',
        caption: '4. Download or copy the beautified JSON',
      },
    ],
  },
  // Image Watermarker
  {
    key: 'image-watermarker',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width: 26, height: 26}}>
        <rect x="3" y="3" width="18" height="18" rx="4"/>
        <path d="M8 12h8M12 8v8"/>
      </svg>
    ),
    title: 'Image Watermarker',
    link: '/image-watermarker',
    btn: 'Open Image Watermarker',
    description: 'Add a text or logo watermark to your images in seconds. Drag, drop, and download — all in your browser, no account required.',
    features: [
      'Add text or logo as watermark',
      'Preview before downloading',
      'Drag & drop image upload',
      'No watermarks or sign-up needed',
      'Works with PNG, JPG, and more',
    ],
    screenshots: [
      {
        src: '/screenshots/watermarker/watermarker001.png',
        alt: 'Step 1 — Drag and drop your image onto the upload area',
        caption: '1. Drag & drop or browse for your image',
      },
      {
        src: '/screenshots/watermarker/watermarker002.png',
        alt: 'Step 2 — Enter watermark text or upload logo',
        caption: '2. Enter watermark text or upload logo',
      },
      {
        src: '/screenshots/watermarker/watermarker003.png',
        alt: 'Step 3 — Preview the watermarked image',
        caption: '3. Preview the watermarked image',
      },
      {
        src: '/screenshots/watermarker/watermarker004.png',
        alt: 'Step 4 — Download your watermarked image',
        caption: '4. Download your watermarked image',
      },
    ],
  },

  // Image Resizer (new last card)
  {
    key: 'image-resizer',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width: 26, height: 26}}>
        <rect x="3" y="3" width="18" height="18" rx="4"/>
        <path d="M8 8h8M8 16h8M8 12h8"/>
      </svg>
    ),
    title: 'Image Resizer',
    link: '/image-resizer',
    btn: 'Open Image Resizer',
    description: 'Resize your images by percentage or by custom dimensions. Fast, privacy-friendly, and works entirely in your browser — no uploads, no accounts, no watermarks.',
    features: [
      'Resize by percentage or dimensions',
      'Maintains aspect ratio (optional)',
      'Works with PNG, JPG, and more',
      'No watermarks, no sign-up needed',
      'Preview before downloading',
    ],
    screenshots: [
      {
        src: '/screenshots/resizer/Image-resizer001.png',
        alt: 'Step 1 — Drag and drop your image onto the upload area',
        caption: '1. Drag & drop or browse for your image',
      },
      {
        src: '/screenshots/resizer/Image-resizer002.png',
        alt: 'Step 2 — Choose resize mode and set dimensions',
        caption: '2. Choose resize mode and set dimensions',
      },
      {
        src: '/screenshots/resizer/Image-resizer003.png',
        alt: 'Step 3 — Preview the resized image',
        caption: '3. Preview the resized image',
      },
      {
        src: '/screenshots/resizer/Image-resizer004.png',
        alt: 'Step 4 — Download your resized image',
        caption: '4. Download your resized image',
      },
    ],
  },

  // Image Collage
  {
    key: 'image-collage',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width: 26, height: 26}}>
        <rect x="3" y="3" width="8" height="8" rx="1.5"/>
        <rect x="13" y="3" width="8" height="8" rx="1.5"/>
        <rect x="3" y="13" width="8" height="8" rx="1.5"/>
        <rect x="13" y="13" width="8" height="8" rx="1.5"/>
      </svg>
    ),
    title: 'Image Collage',
    link: '/image-collage',
    btn: 'Open Image Collage',
    description: 'Arrange multiple images into a clean grid collage instantly. Drag, drop, reorder, and download — all in your browser, no account required, no watermarks.',
    features: [
      'Combine multiple images into a grid collage',
      'Drag & drop to upload and reorder images',
      'Auto-expands grid to fit all your images',
      'Set custom output width and height',
      'No watermarks, no sign-up needed',
    ],
    screenshots: [
      {
        src: '/screenshots/collage/image-collage001.png',
        alt: 'Step 1 — Drag and drop your images onto the upload area',
        caption: '1. Drag & drop or browse for your images',
      },
      {
        src: '/screenshots/collage/image-collage002.png',
        alt: 'Step 2 — Reorder images and set grid columns and rows',
        caption: '2. Arrange images and set the grid layout',
      },
      {
        src: '/screenshots/collage/image-collage003.png',
        alt: 'Step 3 — Preview the collage',
        caption: '3. Preview your collage instantly',
      },
      {
        src: '/screenshots/collage/image-collage004.png',
        alt: 'Step 4 — Download your finished collage',
        caption: '4. Download your finished collage',
      },
    ],
  },
  {
    key: 'image-converter',
    icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width: 26, height: 26}}><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>),
    title: 'Image Converter',
    link: '/image-converter',
    btn: 'Open Image Converter',
    description: 'Convert images between JPG, PNG, and WebP instantly in your browser. Drop your image, choose a format, and download — no uploads, no account required.',
    features: ['Convert between JPG, PNG, and WebP', 'Auto-detects input format', 'Transparent PNGs get white background on JPG export', '100% local — files never leave your browser'],
    screenshots: [
      {
        src: '/screenshots/image-converter/image-converter-001.png',
        alt: 'Step 1 — Drag and drop your images onto the upload area',
        caption: '1. Drag & drop or browse for your images',
      },
      {
        src: '/screenshots/image-converter/image-converter-002.png',
        alt: 'Step 2 — Choose output format',
        caption: '2. Choose output format (JPG, PNG, or WebP)',
      },
      {
        src: '/screenshots/image-converter/image-converter-003.png',
        alt: 'Step 3 — Preview the converted image',
        caption: '3. Preview your converted image',
      },
    ],
  },
];

function RotatingCards() {
  const [active, setActive] = useState(0);
  const [next, setNext] = useState(null); // index of next card for animation
  const [direction, setDirection] = useState(1); // 1 for left, -1 for right
  const [isSliding, setIsSliding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [modalImg, setModalImg] = useState(null);
  const timeoutRef = useRef();

  // Auto-rotate every 5 seconds, but pause when hovered
  useEffect(() => {
    if (isHovered) return;
    timeoutRef.current = setTimeout(() => {
      slideTo((active + 1) % cards.length, 1);
    }, 7000);
    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line
  }, [active, isHovered]);

  function slideTo(idx, dir) {
    if (idx === active || isSliding) return;
    setDirection(dir);
    setNext(idx);
    setIsSliding(true);
    setTimeout(() => {
      setActive(idx);
      setNext(null);
      setIsSliding(false);
    }, 700); // match CSS (0.7s)
  }

  const handleDotClick = (i) => {
    if (i !== active) {
      slideTo(i, i > active ? 1 : -1);
    }
  };

  // Modal dialog for screenshot
  const handleScreenshotClick = (src, alt) => {
    setModalImg({ src, alt });
  };
  const handleModalClose = () => {
    setModalImg(null);
  };

  // Render a card (no fade)
  const renderCard = (idx) => {
    const card = cards[idx];
    return (
      <div className="rotator-card" key={card.key}>
        <div className="tool-card">
          <div className="tool-icon" aria-hidden="true">{card.icon}</div>
          <div className="tool-content">
            <h3 className="tool-title"><Link to={card.link}>{card.title}</Link></h3>
            {/* <Link to={card.link} className="btn btn-primary">{card.btn}</Link> */}
            <p className="tool-description">{card.description}</p>
            <ul className="feature-list">
              {card.features.map((f, i) => (
                <li key={i}><span className="feature-check" aria-hidden="true">✓</span>{f}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="screenshots-section">
          <h3 className="screenshots-heading">How it works</h3>
          <div className="screenshots-grid">
            {card.screenshots.map((s, i) => (
              <figure className="screenshot-item" key={i}>
                <img
                  src={s.src}
                  alt={s.alt}
                  className="screenshot-img"
                  loading="lazy"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleScreenshotClick(s.src, s.alt)}
                  onError={e => { e.currentTarget.classList.add('screenshot-missing') }}
                />
                <figcaption>{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Flex row sliding track for both cards
  let cardsToShow = [active];
  let slideIndex = 0;
  let fadeTypes = [null];
  if (next !== null) {
    if (direction === 1) {
      cardsToShow = [active, next];
      fadeTypes = [isSliding ? 'out' : null, isSliding ? 'in' : null];
      slideIndex = isSliding ? -1 : 0;
    } else {
      cardsToShow = [next, active];
      fadeTypes = [isSliding ? 'in' : null, isSliding ? 'out' : null];
      slideIndex = isSliding ? 0 : -1;
    }
  }

  return (
    <div className="rotator"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="rotator-controls">
        {cards.map((c, i) => (
          <button
            key={c.key}
            className={i === active ? 'rotator-dot active' : 'rotator-dot'}
            aria-label={c.title}
            onClick={() => handleDotClick(i)}
          />
        ))}
      </div>
      <div className="rotator-slider true-slide">
        <div
          className="rotator-slide-track"
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: `${cardsToShow.length * 100}%`,
              height: '100%',
              transform: `translateX(${slideIndex * 100}%)`,
              transition: isSliding ? 'transform 0.7s cubic-bezier(0.4,0,0.2,1)' : 'none',
            }}
          >
            {cardsToShow.map((idx, i) => (
              <div key={i + '-' + idx} style={{ width: '100%', flexShrink: 0, height: '100%' }}>
                {renderCard(idx)}
              </div>
            ))}
          </div>
        </div>
        {/* Modal dialog for screenshot */}
        {modalImg && (
          <div className="screenshot-modal-overlay" onClick={handleModalClose}>
            <div className="screenshot-modal-content" onClick={e => e.stopPropagation()}>
              <button className="screenshot-modal-close" onClick={handleModalClose} aria-label="Close screenshot">&#10005;</button>
              <img src={modalImg.src} alt={modalImg.alt} className="screenshot-modal-img" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RotatingCards;
 
