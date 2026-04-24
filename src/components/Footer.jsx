import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Footer.css'

export default function Footer() {
  const { t } = useTranslation('common')

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-copy">&copy; {t('footer.copyright', { year: new Date().getFullYear() })}</p>
        <nav className="footer-links" aria-label="Legal">
          <Link to="/about/us" className="footer-link-btn">{t('footer.aboutUs')}</Link>
          <span className="footer-link-sep" aria-hidden="true">·</span>
          <Link to="/about/policy" className="footer-link-btn">{t('footer.privacyPolicy')}</Link>
          <span className="footer-link-sep" aria-hidden="true">·</span>
          <Link to="/about/terms" className="footer-link-btn">{t('footer.termsOfService')}</Link>
        </nav>
      </div>
    </footer>
  )
}
