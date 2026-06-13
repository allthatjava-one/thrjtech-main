import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './tools-shared.css'

const TOOLS = [
  {
    path: '/screen-recorder',
    screenshot: null,
    nameKey: 'video.tools.screenRecorder.name',
    descKey: 'video.tools.screenRecorder.desc',
  },
  {
    path: '/video-to-gif',
    screenshot: '/screenshots/video-to-gif/video-to-gif_001.png',
    nameKey: 'video.tools.videoToGif.name',
    descKey: 'video.tools.videoToGif.desc',
  },
]

export default function VideoToolsPage() {
  const { t } = useTranslation('toolsLanding')

  return (
    <div className="page">
      <Navbar />
      <main className="main tools-landing-main">
        <div className="tools-landing-hero-wrap">
          <div className="container">
            <div className="tools-landing-hero">
              <h1 className="tools-landing-title">{t('video.title')}</h1>
              <p className="tools-landing-subtitle">{t('video.description')}</p>
            </div>
          </div>
        </div>

        <section className="tools-landing-section">
          <div className="container">
            <div className="tools-landing-grid">
              {TOOLS.map((tool) => (
                <Link key={tool.path} to={tool.path} className="tool-landing-card">
                  {tool.screenshot ? (
                    <img
                      className="tool-landing-card-img"
                      src={tool.screenshot}
                      alt={t(tool.nameKey)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="tool-landing-card-img tool-landing-card-img--placeholder" aria-hidden="true" />
                  )}
                  <div className="tool-landing-card-body">
                    <h2 className="tool-landing-card-name">{t(tool.nameKey)}</h2>
                    <p className="tool-landing-card-desc">{t(tool.descKey)}</p>
                    <span className="tool-landing-card-cta">{t('useTool')} →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
