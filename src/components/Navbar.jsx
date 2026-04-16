
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';



export default function Navbar() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toolsRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setToolsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          THRJ<span className="logo-accent">Tech</span>
        </Link>
        <button className="hamburger" aria-label="Open menu" onClick={() => setMobileMenuOpen((v) => !v)}>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>
        <nav className={`nav${mobileMenuOpen ? ' nav-mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <div className="dropdown" ref={toolsRef}>
            <button
              className={`dropbtn${toolsOpen ? ' open' : ''}`}
              onClick={() => setToolsOpen((o) => !o)}
              aria-expanded={toolsOpen}
              aria-haspopup="true"
            >
              Tools ▼
            </button>
            {toolsOpen && (
              <div className="dropdown-content dropdown-columns">
                <div className="dropdown-col">
                  <div className="dropdown-group">
                    <div className="dropdown-group-title">PDF</div>
                    <Link to="/pdf-compressor" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>PDF Compressor</Link>
                    <Link to="/pdf-merger" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>PDF Merger</Link>
                    <Link to="/pdf-converter" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>PDF Converter</Link>
                    <Link to="/pdf-splitter" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>PDF Splitter</Link>
                  </div>
                </div>
                <div className="dropdown-col">
                  <div className="dropdown-group">
                    <div className="dropdown-group-title">Text</div>
                    <Link to="/json-formatter" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>JSON Formatter</Link>
                    <Link to="/regex-tester" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>Regex Tester</Link>
                  </div>
                </div>
                <div className="dropdown-col">
                  <div className="dropdown-group">
                    <div className="dropdown-group-title">Image</div>
                    <Link to="/image-resizer" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>Resize</Link>
                    <Link to="/image-watermarker" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>Watermark</Link>
                      <Link to="/image-collage" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>Collage</Link>
                      <Link to="/image-crop" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>Crop</Link>
                      <Link to="/image-meme-generator" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>Meme Generator</Link>
                      <Link to="/image-converter" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>Converter</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link to="/blogs" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
          <Link to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
        </nav>
      </div>
    </header>
  );
}
