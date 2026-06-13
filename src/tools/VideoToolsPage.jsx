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

            <div className="video-tools-guide-content">
              <h2>{t('video.guide.heading')}</h2>
              <p>{t('video.guide.intro')}</p>
              <ul>
                <li>{t('video.guide.highlights.item1')}</li>
                <li>{t('video.guide.highlights.item2')}</li>
                <li>{t('video.guide.highlights.item3')}</li>
                <li>{t('video.guide.highlights.item4')}</li>
              </ul>

              <h3>{t('video.guide.overviewHeading')}</h3>

              <h4>{t('video.tools.videoToGif.name')}</h4>
              <p>{t('video.guide.useCasesLabel')}</p>
              <ul>
                <li>{t('video.guide.videoToGif.item1')}</li>
                <li>{t('video.guide.videoToGif.item2')}</li>
                <li>{t('video.guide.videoToGif.item3')}</li>
              </ul>

              <h4>{t('video.tools.screenRecorder.name')}</h4>
              <p>{t('video.guide.useCasesLabel')}</p>
              <ul>
                <li>{t('video.guide.screenRecorder.item1')}</li>
                <li>{t('video.guide.screenRecorder.item2')}</li>
                <li>{t('video.guide.screenRecorder.item3')}</li>
              </ul>

              <h3>{t('video.guide.comparisonHeading')}</h3>
              <div className="video-tools-table-wrap">
                <table className="video-tools-compare-table">
                  <thead>
                    <tr>
                      <th>{t('video.guide.table.feature')}</th>
                      <th>{t('video.guide.table.gif')}</th>
                      <th>{t('video.guide.table.mp4')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{t('video.guide.table.size')}</td>
                      <td>{t('video.guide.table.row1gif')}</td>
                      <td>{t('video.guide.table.row1mp4')}</td>
                    </tr>
                    <tr>
                      <td>{t('video.guide.table.audio')}</td>
                      <td>{t('video.guide.table.row2gif')}</td>
                      <td>{t('video.guide.table.row2mp4')}</td>
                    </tr>
                    <tr>
                      <td>{t('video.guide.table.sharing')}</td>
                      <td>{t('video.guide.table.row3gif')}</td>
                      <td>{t('video.guide.table.row3mp4')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>{t('video.guide.workflowsHeading')}</h3>
              <div className="video-tools-workflow-list">
                <p><strong>{t('video.guide.workflows.bug.title')}</strong></p>
                <p><Link to="/screen-recorder">{t('video.tools.screenRecorder.name')}</Link>.</p>

                <p><strong>{t('video.guide.workflows.animation.title')}</strong></p>
                <p><Link to="/video-to-gif">{t('video.tools.videoToGif.name')}</Link>.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
