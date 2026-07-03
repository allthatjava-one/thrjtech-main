import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'
import Footer from './Footer'
import Seo from '../services/Seo'
import './NotFound.css'

export default function NotFoundPage() {
  const { t } = useTranslation('notFound')
  return (
    <div className="not-found-page">
      <Seo noindex title="404 — Page Not Found — THRJ" description="The page you requested could not be found." />
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <h2>{t('title')}</h2>
            <p>{t('message')}</p>
            <p>
              <Link to="/">{t('homeLink')}</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
