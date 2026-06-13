import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './tools-shared.css'

const TOOLS = [
  {
    path: '/json-formatter',
    screenshot: '/screenshots/json-formatter/JSON_formatter001.png',
    nameKey: 'developer.tools.jsonFormatter.name',
    descKey: 'developer.tools.jsonFormatter.desc',
  },
  {
    path: '/regex-tester',
    screenshot: '/screenshots/regex-tester/regex-tester-001.png',
    nameKey: 'developer.tools.regexTester.name',
    descKey: 'developer.tools.regexTester.desc',
  },
]

export default function DeveloperToolsPage() {
  const { t } = useTranslation('toolsLanding')

  return (
    <div className="page">
      <Navbar />
      <main className="main tools-landing-main">
        <div className="tools-landing-hero-wrap">
          <div className="container">
            <div className="tools-landing-hero">
              <h1 className="tools-landing-title">{t('developer.title')}</h1>
              <p className="tools-landing-subtitle">{t('developer.description')}</p>
            </div>
          </div>
        </div>

        <section className="tools-landing-section">
          <div className="container">
            <div className="tools-landing-grid">
              {TOOLS.map((tool) => (
                <Link key={tool.path} to={tool.path} className="tool-landing-card">
                  <img
                    className="tool-landing-card-img"
                    src={tool.screenshot}
                    alt={t(tool.nameKey)}
                    loading="lazy"
                  />
                  <div className="tool-landing-card-body">
                    <h2 className="tool-landing-card-name">{t(tool.nameKey)}</h2>
                    <p className="tool-landing-card-desc">{t(tool.descKey)}</p>
                    <span className="tool-landing-card-cta">{t('useTool')} →</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="developer-tools-guide-content">
              <h2>{t('developer.guide.heading')}</h2>
              <p>{t('developer.guide.intro')}</p>
              <ul>
                <li>{t('developer.guide.highlights.item1')}</li>
                <li>{t('developer.guide.highlights.item2')}</li>
                <li>{t('developer.guide.highlights.item3')}</li>
                <li>{t('developer.guide.highlights.item4')}</li>
              </ul>

              <h3>{t('developer.guide.overviewHeading')}</h3>

              <h4>{t('developer.tools.jsonFormatter.name')}</h4>
              <ul>
                <li>{t('developer.guide.json.item1')}</li>
                <li>{t('developer.guide.json.item2')}</li>
                <li>{t('developer.guide.json.item3')}</li>
              </ul>

              <h4>{t('developer.tools.regexTester.name')}</h4>
              <ul>
                <li>{t('developer.guide.regex.item1')}</li>
                <li>{t('developer.guide.regex.item2')}</li>
                <li>{t('developer.guide.regex.item3')}</li>
              </ul>

              <h3>{t('developer.guide.examplesHeading')}</h3>

              <h4>{t('developer.guide.examples.email.title')}</h4>
              <p>{t('developer.guide.examples.email.label')}</p>
              <pre className="developer-tools-code-block"><code>{t('developer.guide.examples.email.code')}</code></pre>

              <h4>{t('developer.guide.examples.api.title')}</h4>
              <p>{t('developer.guide.examples.api.label')}</p>
              <pre className="developer-tools-code-block"><code>{t('developer.guide.examples.api.code')}</code></pre>

              <h3>{t('developer.guide.mistakesHeading')}</h3>
              <p>{t('developer.guide.seoNote')}</p>
              <ul>
                <li>{t('developer.guide.mistakes.item1')}</li>
                <li>{t('developer.guide.mistakes.item2')}</li>
                <li>{t('developer.guide.mistakes.item3')}</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
