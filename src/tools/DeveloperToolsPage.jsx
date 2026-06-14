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

const HIGHLIGHT_KEYS = [
  'developer.guide.highlights.item1',
  'developer.guide.highlights.item2',
  'developer.guide.highlights.item3',
  'developer.guide.highlights.item4',
]

const TOOL_OVERVIEW_SECTIONS = [
  {
    titleKey: 'developer.tools.jsonFormatter.name',
    itemKeys: [
      'developer.guide.json.item1',
      'developer.guide.json.item2',
      'developer.guide.json.item3',
    ],
  },
  {
    titleKey: 'developer.tools.regexTester.name',
    itemKeys: [
      'developer.guide.regex.item1',
      'developer.guide.regex.item2',
      'developer.guide.regex.item3',
    ],
  },
]

const EXAMPLE_SECTIONS = [
  {
    titleKey: 'developer.guide.examples.email.title',
    labelKey: 'developer.guide.examples.email.label',
    codeKey: 'developer.guide.examples.email.code',
  },
  {
    titleKey: 'developer.guide.examples.api.title',
    labelKey: 'developer.guide.examples.api.label',
    codeKey: 'developer.guide.examples.api.code',
  },
]

const MISTAKE_KEYS = [
  'developer.guide.mistakes.item1',
  'developer.guide.mistakes.item2',
  'developer.guide.mistakes.item3',
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
              <h3>{t('developer.guide.sections.foundation.title')}</h3>
              <p>{t('developer.guide.intro')}</p>
              <ul>
                {HIGHLIGHT_KEYS.map((highlightKey) => (
                  <li key={highlightKey}>{t(highlightKey)}</li>
                ))}
              </ul>

              <h3>{t('developer.guide.sections.overview.title')}</h3>
              <p>{t('developer.guide.overviewHeading')}</p>
              {TOOL_OVERVIEW_SECTIONS.map((section) => (
                <div key={section.titleKey}>
                  <h4>{t(section.titleKey)}</h4>
                  <ul>
                    {section.itemKeys.map((itemKey) => (
                      <li key={itemKey}>{t(itemKey)}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <h3>{t('developer.guide.sections.examples.title')}</h3>
              <p>{t('developer.guide.examplesHeading')}</p>
              {EXAMPLE_SECTIONS.map((example) => (
                <div key={example.titleKey}>
                  <h4>{t(example.titleKey)}</h4>
                  <p>{t(example.labelKey)}</p>
                  <pre className="developer-tools-code-block"><code>{t(example.codeKey)}</code></pre>
                </div>
              ))}

              <h3>{t('developer.guide.sections.pitfalls.title')}</h3>
              <p>{t('developer.guide.mistakesHeading')}</p>
              <p>{t('developer.guide.seoNote')}</p>
              <ul>
                {MISTAKE_KEYS.map((mistakeKey) => (
                  <li key={mistakeKey}>{t(mistakeKey)}</li>
                ))}
              </ul>

              <h3>{t('developer.guide.sections.privacy.title')}</h3>
              <p>{t('developer.guide.privacy.intro')}</p>
              <ul>
                <li>{t('developer.guide.privacy.point1')}</li>
                <li>{t('developer.guide.privacy.point2')}</li>
                <li>{t('developer.guide.privacy.point3')}</li>
                <li>{t('developer.guide.privacy.point4')}</li>
              </ul>

              <h3>{t('developer.guide.sections.tips.title')}</h3>
              <p>{t('developer.guide.tips.intro')}</p>
              <ul>
                <li><strong>{t('developer.guide.tips.tip1.title')}</strong> {t('developer.guide.tips.tip1.body')}</li>
                <li><strong>{t('developer.guide.tips.tip2.title')}</strong> {t('developer.guide.tips.tip2.body')}</li>
                <li><strong>{t('developer.guide.tips.tip3.title')}</strong> {t('developer.guide.tips.tip3.body')}</li>
                <li><strong>{t('developer.guide.tips.tip4.title')}</strong> {t('developer.guide.tips.tip4.body')}</li>
                <li><strong>{t('developer.guide.tips.tip5.title')}</strong> {t('developer.guide.tips.tip5.body')}</li>
              </ul>

              <h3>{t('developer.guide.sections.faq.title')}</h3>
              <div className="developer-tools-faq-list">
                <p><strong>{t('developer.guide.faq.q1')}</strong></p>
                <p>{t('developer.guide.faq.a1')}</p>
                <p><strong>{t('developer.guide.faq.q2')}</strong></p>
                <p>{t('developer.guide.faq.a2')}</p>
                <p><strong>{t('developer.guide.faq.q3')}</strong></p>
                <p>{t('developer.guide.faq.a3')}</p>
                <p><strong>{t('developer.guide.faq.q4')}</strong></p>
                <p>{t('developer.guide.faq.a4')}</p>
                <p><strong>{t('developer.guide.faq.q5')}</strong></p>
                <p>{t('developer.guide.faq.a5')}</p>
              </div>

              <h3>{t('developer.guide.sections.useCases.title')}</h3>
              <p>{t('developer.guide.useCases.intro')}</p>
              <ul>
                <li><strong>{t('developer.guide.useCases.case1.title')}</strong> {t('developer.guide.useCases.case1.body')}</li>
                <li><strong>{t('developer.guide.useCases.case2.title')}</strong> {t('developer.guide.useCases.case2.body')}</li>
                <li><strong>{t('developer.guide.useCases.case3.title')}</strong> {t('developer.guide.useCases.case3.body')}</li>
                <li><strong>{t('developer.guide.useCases.case4.title')}</strong> {t('developer.guide.useCases.case4.body')}</li>
              </ul>

              <h3>{t('developer.guide.why-thrj.heading')}</h3>
              <p>{t('developer.guide.why-thrj.body')}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
