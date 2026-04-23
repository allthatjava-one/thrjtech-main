import { useTranslation } from 'react-i18next'
import Navbar from '../Navbar'
import Footer from '../Footer'
import Seo from '../../services/Seo'
import './About.css'

export default function PrivacyPolicyPage() {
  const { t } = useTranslation('privacy')
  return (
    <div className="about-us-page">
      <Seo title="Privacy Policy — THRJ" description="THRJTech's privacy policy — how we handle your data, cookies, and advertising on our free browser tools." />
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <h2>{t('title')}</h2>
            <p className="fl-updated">{t('lastUpdated')}</p>

            <h3>{t('overview.heading')}</h3>
            <p>{t('overview.body')}</p>

            <h3>{t('googleAdsense.heading')}</h3>
            <p>{t('googleAdsense.body1')}</p>
            <p>
              {t('googleAdsense.body2Pre')}{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                {t('googleAdsense.googleAdsLink')}
              </a>
              {t('googleAdsense.body2Mid')}{' '}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
                {t('googleAdsense.aboutadsLink')}
              </a>
              {t('googleAdsense.body2Post')}
            </p>

            <h3>{t('cookies.heading')}</h3>
            <p>{t('cookies.body')}</p>

            <h3>{t('userConsent.heading')}</h3>
            <p>{t('userConsent.body')}</p>

            <h3>{t('dataWeCollect.heading')}</h3>
            <p>{t('dataWeCollect.body')}</p>

            <h3>{t('googleAnalytics.heading')}</h3>
            <p>{t('googleAnalytics.body')}</p>

            <h3>{t('thirdPartyLinks.heading')}</h3>
            <p>{t('thirdPartyLinks.body')}</p>

            <h3>{t('californiaRights.heading')}</h3>
            <p>{t('californiaRights.body')}</p>

            <h3>{t('contact.heading')}</h3>
            <p>{t('contact.body')}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
