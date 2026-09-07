import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Footer.css'

export default function Footer() {
  const { t } = useTranslation('common')

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              THRJ<span className="logo-accent">Tech</span>
            </Link>
            <p className="footer-tagline">
              Free, fast, and privacy-friendly utilities that run 100% locally in your browser.
            </p>
          </div>

          <div className="footer-grid">
            <div className="footer-col">
              <h4 className="footer-heading">
                <Link to="/pdf-tools">{t('nav.pdf')}</Link>
              </h4>
              <ul className="footer-list">
                <li><Link to="/pdf-compressor">{t('nav.pdfCompressor')}</Link></li>
                <li><Link to="/pdf-merger">{t('nav.pdfMerger')}</Link></li>
                <li><Link to="/pdf-converter">{t('nav.pdfConverter')}</Link></li>
                <li><Link to="/pdf-splitter">{t('nav.pdfSplitter')}</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">
                <Link to="/image-tools">{t('nav.image')}</Link>
              </h4>
              <ul className="footer-list">
                <li><Link to="/image-resizer">{t('nav.imageResize')}</Link></li>
                <li><Link to="/image-crop">{t('nav.imageCrop')}</Link></li>
                <li><Link to="/image-converter">{t('nav.imageConverter')}</Link></li>
                <li><Link to="/image-watermarker">{t('nav.imageWatermark')}</Link></li>
                <li><Link to="/image-collage">{t('nav.imageCollage')}</Link></li>
                <li><Link to="/image-rotator">{t('nav.imageRotator')}</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">
                <Link to="/developer-tools">{t('nav.developer')} &amp; {t('nav.video')}</Link>
              </h4>
              <ul className="footer-list">
                <li><Link to="/json-formatter">{t('nav.jsonFormatter')}</Link></li>
                <li><Link to="/regex-tester">{t('nav.regexTester')}</Link></li>
                <li><Link to="/screen-recorder">{t('nav.screenRecorder')}</Link></li>
                <li><Link to="/video-to-gif">{t('nav.videoToGif')}</Link></li>
                <li><Link to="/image-meme-generator">{t('nav.imageMemeGenerator')}</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">{t('nav.blog')}</h4>
              <ul className="footer-list">
                <li><Link to="/blogs">{t('nav.blog')}</Link></li>
                <li><Link to="/contact">{t('nav.contactUs')}</Link></li>
                <li><Link to="/about/us">{t('footer.aboutUs')}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <nav className="footer-links" aria-label="Legal">
            <Link to="/about/us" className="footer-link-btn">{t('footer.aboutUs')}</Link>
            <span className="footer-link-sep" aria-hidden="true">·</span>
            <Link to="/about/policy" className="footer-link-btn">{t('footer.privacyPolicy')}</Link>
            <span className="footer-link-sep" aria-hidden="true">·</span>
            <Link to="/about/terms" className="footer-link-btn">{t('footer.termsOfService')}</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
