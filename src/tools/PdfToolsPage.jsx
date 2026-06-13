import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './tools-shared.css'

const TOOLS = [
  {
    path: '/pdf-compressor',
    screenshot: '/screenshots/compressor/pdf-compressor-01.png',
    nameKey: 'pdf.tools.compressor.name',
    descKey: 'pdf.tools.compressor.desc',
  },
  {
    path: '/pdf-merger',
    screenshot: '/screenshots/merger/merger-001.png',
    nameKey: 'pdf.tools.merger.name',
    descKey: 'pdf.tools.merger.desc',
  },
  {
    path: '/pdf-converter',
    screenshot: '/screenshots/converter/PDF-converter001.png',
    nameKey: 'pdf.tools.converter.name',
    descKey: 'pdf.tools.converter.desc',
  },
  {
    path: '/pdf-splitter',
    screenshot: '/screenshots/splitter/PDF-splitter-001.png',
    nameKey: 'pdf.tools.splitter.name',
    descKey: 'pdf.tools.splitter.desc',
  },
]

export default function PdfToolsPage() {
  const { t } = useTranslation('toolsLanding')

  return (
    <div className="page">
      <Navbar />
      <main className="main tools-landing-main">
        <div className="tools-landing-hero-wrap">
          <div className="container">
            <div className="tools-landing-hero">
              <h1 className="tools-landing-title">{t('pdf.title')}</h1>
              <p className="tools-landing-subtitle">{t('pdf.description')}</p>
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
