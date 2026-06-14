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
              
              <h3>{t('video.guide.sections.foundation.title')}</h3>
              <p>{t('video.guide.intro')}</p>
              <ul>
                <li><strong>{t('video.guide.highlights.item1')}</strong>: {t('video.guide.highlights.desc1')}</li>
                <li><strong>{t('video.guide.highlights.item2')}</strong>: {t('video.guide.highlights.desc2')}</li>
                <li><strong>{t('video.guide.highlights.item3')}</strong>: {t('video.guide.highlights.desc3')}</li>
                <li><strong>{t('video.guide.highlights.item4')}</strong>: {t('video.guide.highlights.desc4')}</li>
              </ul>

              <h3>{t('video.guide.sections.categories.title')}</h3>
              <p>{t('video.guide.overviewHeading')}</p>

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

              <h3>{t('video.guide.sections.formats.title')}</h3>
              <p>{t('video.guide.comparisonHeading')}</p>
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

              <h3>{t('video.guide.sections.scenarios.title')}</h3>
              <p>{t('video.guide.workflowsHeading')}</p>
              <div className="video-tools-workflow-list">
                <p><strong>{t('video.guide.workflows.bug.title')}</strong></p>
                <p>{t('video.guide.workflows.bug.desc')}</p>
                <p><Link to="/screen-recorder">{t('video.tools.screenRecorder.name')}</Link>.</p>

                <p><strong>{t('video.guide.workflows.animation.title')}</strong></p>
                <p>{t('video.guide.workflows.animation.desc')}</p>
                <p><Link to="/video-to-gif">{t('video.tools.videoToGif.name')}</Link>.</p>
              </div>

              <h3>{t('video.guide.sections.privacy.title')}</h3>
              <p>{t('video.guide.privacy.intro')}</p>
              <ul>
                <li>{t('video.guide.privacy.point1')}</li>
                <li>{t('video.guide.privacy.point2')}</li>
                <li>{t('video.guide.privacy.point3')}</li>
                <li>{t('video.guide.privacy.point4')}</li>
              </ul>

              <h3>{t('video.guide.sections.tips.title')}</h3>
              <p>{t('video.guide.tips.intro')}</p>
              <ul>
                <li><strong>{t('video.guide.tips.tip1.title')}</strong> {t('video.guide.tips.tip1.body')}</li>
                <li><strong>{t('video.guide.tips.tip2.title')}</strong> {t('video.guide.tips.tip2.body')}</li>
                <li><strong>{t('video.guide.tips.tip3.title')}</strong> {t('video.guide.tips.tip3.body')}</li>
                <li><strong>{t('video.guide.tips.tip4.title')}</strong> {t('video.guide.tips.tip4.body')}</li>
                <li><strong>{t('video.guide.tips.tip5.title')}</strong> {t('video.guide.tips.tip5.body')}</li>
              </ul>

              <h3>{t('video.guide.sections.faq.title')}</h3>
              <div className="video-tools-faq-list">
                <p><strong>{t('video.guide.faq.q1')}</strong></p>
                <p>{t('video.guide.faq.a1')}</p>
                <p><strong>{t('video.guide.faq.q2')}</strong></p>
                <p>{t('video.guide.faq.a2')}</p>
                <p><strong>{t('video.guide.faq.q3')}</strong></p>
                <p>{t('video.guide.faq.a3')}</p>
                <p><strong>{t('video.guide.faq.q4')}</strong></p>
                <p>{t('video.guide.faq.a4')}</p>
                <p><strong>{t('video.guide.faq.q5')}</strong></p>
                <p>{t('video.guide.faq.a5')}</p>
              </div>

              <h3>{t('video.guide.sections.useCases.title')}</h3>
              <p>{t('video.guide.useCases.intro')}</p>
              <ul>
                <li><strong>{t('video.guide.useCases.case1.title')}</strong> {t('video.guide.useCases.case1.body')}</li>
                <li><strong>{t('video.guide.useCases.case2.title')}</strong> {t('video.guide.useCases.case2.body')}</li>
                <li><strong>{t('video.guide.useCases.case3.title')}</strong> {t('video.guide.useCases.case3.body')}</li>
                <li><strong>{t('video.guide.useCases.case4.title')}</strong> {t('video.guide.useCases.case4.body')}</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
