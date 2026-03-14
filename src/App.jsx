import './App.css'

function App() {
  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <span className="logo">THRJ<span className="logo-accent">Tech</span></span>
          <nav className="nav">
            <a href="https://thrjtech.com" className="nav-link">Home</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Online Tools,<br />Zero Hassle</h1>
          <p className="hero-subtitle">
            Free, fast, and privacy-friendly utilities that work right in your browser.
          </p>
        </div>
      </section>

      {/* Tools Section */}
      <main className="tools-section">
        <div className="container">
          <h2 className="section-heading">Available Tools</h2>

          <div className="tool-card">
            {/* Icon */}
            <div className="tool-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>

            <div className="tool-content">
              <h3 className="tool-title">PDF Compressor</h3>

              <a
                href="https://pdf-compressor.thrjtech.com"
                className="btn btn-primary"
                rel="noopener noreferrer"
              >
                Open PDF Compressor
              </a>

              <p className="tool-description">
                Shrink your PDF files without sacrificing quality. Upload a document and download
                a smaller version in seconds — no account required, no watermarks.
              </p>

              <ul className="feature-list">
                <li>
                  <span className="feature-check" aria-hidden="true">✓</span>
                  Compress PDFs up to 90% smaller
                </li>
                <li>
                  <span className="feature-check" aria-hidden="true">✓</span>
                  Adjustable compression levels (low, medium, high)
                </li>
                <li>
                  <span className="feature-check" aria-hidden="true">✓</span>
                  Works entirely in the browser — your files never leave your device
                </li>
                <li>
                  <span className="feature-check" aria-hidden="true">✓</span>
                  Supports multi-page PDFs of any size
                </li>
                <li>
                  <span className="feature-check" aria-hidden="true">✓</span>
                  100% free, no sign-up needed
                </li>
              </ul>
            </div>
          </div>

          {/* Screenshots */}
          <div className="screenshots-section">
            <h3 className="screenshots-heading">How it works</h3>
            <div className="screenshots-grid">
              <figure className="screenshot-item">
                <img
                  src="/screenshots/pdf-compressor-01.png"
                  alt="Step 1 — Drag and drop your PDF file onto the upload area"
                  className="screenshot-img"
                  loading="lazy"
                  onError={e => { e.currentTarget.classList.add('screenshot-missing') }}
                />
                <figcaption>1. Drag &amp; drop or browse for your PDF</figcaption>
              </figure>
              <figure className="screenshot-item">
                <img
                  src="/screenshots/pdf-compressor-02.png"
                  alt="Step 2 — File selected, ready to compress"
                  className="screenshot-img"
                  loading="lazy"
                  onError={e => { e.currentTarget.classList.add('screenshot-missing') }}
                />
                <figcaption>2. Review the file, then hit Compress PDF</figcaption>
              </figure>
              <figure className="screenshot-item">
                <img
                  src="/screenshots/pdf-compressor-03.png"
                  alt="Step 3 — File uploading to R2 storage with a progress bar"
                  className="screenshot-img"
                  loading="lazy"
                  onError={e => { e.currentTarget.classList.add('screenshot-missing') }}
                />
                <figcaption>3. Securely uploads &amp; compresses in seconds</figcaption>
              </figure>
              <figure className="screenshot-item">
                <img
                  src="/screenshots/pdf-compressor-04.png"
                  alt="Step 4 — Compression complete, download your file"
                  className="screenshot-img"
                  loading="lazy"
                  onError={e => { e.currentTarget.classList.add('screenshot-missing') }}
                />
                <figcaption>4. Download your compressed PDF</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} THRJTech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
