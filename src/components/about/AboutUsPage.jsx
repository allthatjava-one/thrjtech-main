import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../Navbar'
import Footer from '../Footer'
import Seo from '../../services/Seo'
import './About.css'

export default function AboutUsPage() {
  const { t } = useTranslation('about')
  return (
    <div className="about-us-page">
      <Seo title="About Us — THRJ" description="Learn about THRJTech — who we are, our mission, and our commitment to free, privacy-friendly browser tools." />
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <h2>{t('title')}</h2>

            <h3>{t('whoWeAre.heading')}</h3>
            <p>{t('whoWeAre.body')}</p>

            <h3>{t('ourMission.heading')}</h3>
            <p>{t('ourMission.body')}</p>

            <h3>{t('builtForEveryone.heading')}</h3>
            <p>{t('builtForEveryone.body')}</p>

            <h3>{t('privacyFirst.heading')}</h3>
            <p>
              {t('privacyFirst.body')}{' '}
              <Link to="/about/policy">{t('privacyFirst.privacyLink')}</Link>.
            </p>

            <h3>{t('alwaysFree.heading')}</h3>
            <p>{t('alwaysFree.body')}</p>

            <h3>{t('constantlyImproving.heading')}</h3>
            <p>{t('constantlyImproving.body')}</p>

            <h3>{t('getInTouch.heading')}</h3>
            <p>{t('getInTouch.body')}</p>
            <p>
              <Link to="/contact">{t('getInTouch.contactLink')}</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
