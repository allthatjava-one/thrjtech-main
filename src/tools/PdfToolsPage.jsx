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

            <div className="pdf-tools-guide-content">
              <h2>{t('pdf.guide.heading')}</h2>
              <p>{t('pdf.guide.intro')}</p>

              <h3>{t('pdf.guide.examplesHeading')}</h3>
              <ul>
                <li>{t('pdf.guide.examples.item1')}</li>
                <li>{t('pdf.guide.examples.item2')}</li>
                <li>{t('pdf.guide.examples.item3')}</li>
                <li>{t('pdf.guide.examples.item4')}</li>
              </ul>

              <h3>{t('pdf.guide.comparisonHeading')}</h3>
              <div className="pdf-tools-table-wrap">
                <table className="pdf-tools-compare-table">
                  <thead>
                    <tr>
                      <th>{t('pdf.guide.table.tool')}</th>
                      <th>{t('pdf.guide.table.bestFor')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><Link to="/pdf-compressor">{t('pdf.tools.compressor.name')}</Link></td>
                      <td>{t('pdf.guide.table.row1')}</td>
                    </tr>
                    <tr>
                      <td><Link to="/pdf-merger">{t('pdf.tools.merger.name')}</Link></td>
                      <td>{t('pdf.guide.table.row2')}</td>
                    </tr>
                    <tr>
                      <td><Link to="/pdf-splitter">{t('pdf.tools.splitter.name')}</Link></td>
                      <td>{t('pdf.guide.table.row3')}</td>
                    </tr>
                    <tr>
                      <td><Link to="/pdf-converter">{t('pdf.tools.converter.name')}</Link></td>
                      <td>{t('pdf.guide.table.row4')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>{t('pdf.guide.workflowsHeading')}</h3>
              <div className="pdf-tools-workflow-list">
                <p><strong>{t('pdf.guide.workflows.email.title')}</strong></p>
                <p>{t('pdf.guide.workflows.usePrefix')} <Link to="/pdf-compressor">{t('pdf.tools.compressor.name')}</Link>.</p>

                <p><strong>{t('pdf.guide.workflows.report.title')}</strong></p>
                <p>{t('pdf.guide.workflows.usePrefix')} <Link to="/pdf-merger">{t('pdf.tools.merger.name')}</Link>.</p>

                <p><strong>{t('pdf.guide.workflows.contract.title')}</strong></p>
                <p>{t('pdf.guide.workflows.usePrefix')} <Link to="/pdf-splitter">{t('pdf.tools.splitter.name')}</Link>.</p>
              </div>

              <h3>{t('pdf.guide.relatedHeading')}</h3>
              <ul>
                <li><Link to="/blogs/pdf-compressor-guide">{t('pdf.guide.related.compression')}</Link></li>
                <li><Link to="/blogs/pdf-converter-guide">{t('pdf.guide.related.conversion')}</Link></li>
                <li><Link to="/blogs/pdf-compressor-guide#why-pdf-file-size-matters">{t('pdf.guide.related.whyLarge')}</Link></li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
