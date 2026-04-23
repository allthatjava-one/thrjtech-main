import { useTranslation } from 'react-i18next'
import Navbar from '../Navbar'
import Footer from '../Footer'
import Seo from '../../services/Seo'
import './About.css'

export default function TermsOfServicePage() {
  const { t } = useTranslation('terms')
  return (
    <div className="about-us-page">
      <Seo title="Terms of Service — THRJ" description="THRJTech's terms of service — free tools, privacy commitments, acceptable use, and limitations of liability." />
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <h2>{t('title')}</h2>
            <p className="fl-updated">{t('lastUpdated')}</p>

            <h3>{t('freeService.heading')}</h3>
            <p>{t('freeService.body')}</p>

            <h3>{t('privacyCore.heading')}</h3>
            <p>{t('privacyCore.body')}</p>

            <h3>{t('acceptableUse.heading')}</h3>
            <p>{t('acceptableUse.body')}</p>

            <h3>{t('noWarranty.heading')}</h3>
            <p>{t('noWarranty.body')}</p>

            <h3>{t('limitedLiability.heading')}</h3>
            <p>{t('limitedLiability.body')}</p>

            <h3>{t('changes.heading')}</h3>
            <p>{t('changes.body')}</p>

            <h3>{t('contact.heading')}</h3>
            <p>{t('contact.body')}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
