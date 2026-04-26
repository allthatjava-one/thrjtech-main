
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';
import LanguageSwitcher from './LanguageSwitcher';



export default function Navbar() {
  const { t } = useTranslation('common');
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
        <button className="hamburger" aria-label={t('nav.openMenu')} onClick={() => setMobileMenuOpen((v) => !v)}>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>
        <nav className={`nav${mobileMenuOpen ? ' nav-mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.home')}</Link>
          <div className="dropdown" ref={toolsRef}>
            <button
              className={`dropbtn${toolsOpen ? ' open' : ''}`}
              onClick={() => setToolsOpen((o) => !o)}
              aria-expanded={toolsOpen}
              aria-haspopup="true"
            >
              {t('nav.tools')} ▼
            </button>
            {toolsOpen && (
              <div className="dropdown-content dropdown-columns">
                <div className="dropdown-col">
                  <div className="dropdown-group">
                    <div className="dropdown-group-title">{t('nav.pdf')}</div>
                    <Link to="/pdf-compressor" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>{t('nav.pdfCompressor')}</Link>
                    <Link to="/pdf-merger" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>{t('nav.pdfMerger')}</Link>
                    <Link to="/pdf-converter" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>{t('nav.pdfConverter')}</Link>
                    <Link to="/pdf-splitter" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>{t('nav.pdfSplitter')}</Link>
                  </div>
                </div>
                <div className="dropdown-col">
                  <div className="dropdown-group">
                    <div className="dropdown-group-title">{t('nav.text')}</div>
                    <Link to="/json-formatter" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>{t('nav.jsonFormatter')}</Link>
                    <Link to="/regex-tester" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>{t('nav.regexTester')}</Link>
                  </div>
                </div>
                <div className="dropdown-col">
                  <div className="dropdown-group">
                    <div className="dropdown-group-title">{t('nav.image')}</div>
                    <Link to="/image-resizer" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>{t('nav.imageResize')}</Link>
                    <Link to="/image-watermarker" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>{t('nav.imageWatermark')}</Link>
                      <Link to="/image-collage" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>{t('nav.imageCollage')}</Link>
                      <Link to="/image-crop" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>{t('nav.imageCrop')}</Link>
                      <Link to="/image-meme-generator" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>{t('nav.imageMemeGenerator')}</Link>
                      <Link to="/image-converter" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>{t('nav.imageConverter')}</Link>
                      <Link to="/image-rotator" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>{t('nav.imageRotator')}</Link>
                  </div>
                </div>
                  <div className="dropdown-col">
                    <div className="dropdown-group">
                      <div className="dropdown-group-title">{t('nav.video')}</div>
                      <Link to="/screen-recorder" onClick={() => { setToolsOpen(false); setMobileMenuOpen(false); }}>{t('nav.screenRecorder')}</Link>
                    </div>
                  </div>
              </div>
            )}
          </div>
          <Link to="/blogs" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.blog')}</Link>
          <Link to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.contactUs')}</Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
