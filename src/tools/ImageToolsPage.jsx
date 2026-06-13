import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './tools-shared.css'

const TOOLS = [
  {
    path: '/image-resizer',
    screenshot: '/screenshots/resizer/Image-resizer001.png',
    nameKey: 'image.tools.resizer.name',
    descKey: 'image.tools.resizer.desc',
  },
  {
    path: '/image-watermarker',
    screenshot: '/screenshots/watermarker/watermarker001.png',
    nameKey: 'image.tools.watermarker.name',
    descKey: 'image.tools.watermarker.desc',
  },
  {
    path: '/image-collage',
    screenshot: '/screenshots/collage/image-collage001.png',
    nameKey: 'image.tools.collage.name',
    descKey: 'image.tools.collage.desc',
  },
  {
    path: '/image-crop',
    screenshot: '/screenshots/crop/crop_001.png',
    nameKey: 'image.tools.crop.name',
    descKey: 'image.tools.crop.desc',
  },
  {
    path: '/image-meme-generator',
    screenshot: '/screenshots/meme-generator/meme-generator001.png',
    nameKey: 'image.tools.meme.name',
    descKey: 'image.tools.meme.desc',
  },
  {
    path: '/image-converter',
    screenshot: '/screenshots/image-converter/image-converter-001.png',
    nameKey: 'image.tools.converter.name',
    descKey: 'image.tools.converter.desc',
  },
  {
    path: '/image-rotator',
    screenshot: '/screenshots/rotator/image-rotator-001.png',
    nameKey: 'image.tools.rotator.name',
    descKey: 'image.tools.rotator.desc',
  },
]

export default function ImageToolsPage() {
  const { t } = useTranslation('toolsLanding')

  return (
    <div className="page">
      <Navbar />
      <main className="main tools-landing-main">
        <div className="tools-landing-hero-wrap">
          <div className="container">
            <div className="tools-landing-hero">
              <h1 className="tools-landing-title">{t('image.title')}</h1>
              <p className="tools-landing-subtitle">{t('image.description')}</p>
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

            <div className="image-tools-guide-content">
              <h2>{t('image.guide.heading')}</h2>
              <p>{t('image.guide.intro')}</p>

              <h3>{t('image.guide.categoriesHeading')}</h3>
              <div className="image-tools-category-list">
                <p><strong>{t('image.guide.categories.optimization.title')}</strong></p>
                <ul>
                  <li><Link to="/image-resizer">{t('image.guide.categories.optimization.item1')}</Link></li>
                  <li><Link to="/image-crop">{t('image.guide.categories.optimization.item2')}</Link></li>
                </ul>

                <p><strong>{t('image.guide.categories.conversion.title')}</strong></p>
                <ul>
                  <li><Link to="/image-converter">{t('image.guide.categories.conversion.item1')}</Link></li>
                </ul>

                <p><strong>{t('image.guide.categories.creative.title')}</strong></p>
                <ul>
                  <li><Link to="/image-collage">{t('image.guide.categories.creative.item1')}</Link></li>
                  <li><Link to="/image-meme-generator">{t('image.guide.categories.creative.item2')}</Link></li>
                  <li><Link to="/image-watermarker">{t('image.guide.categories.creative.item3')}</Link></li>
                </ul>
              </div>

              <h3>{t('image.guide.formatHeading')}</h3>
              <div className="image-tools-table-wrap">
                <table className="image-tools-format-table">
                  <thead>
                    <tr>
                      <th>{t('image.guide.formatTable.format')}</th>
                      <th>{t('image.guide.formatTable.bestUse')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{t('image.guide.formatTable.jpg')}</td>
                      <td>{t('image.guide.formatTable.jpgUse')}</td>
                    </tr>
                    <tr>
                      <td>{t('image.guide.formatTable.png')}</td>
                      <td>{t('image.guide.formatTable.pngUse')}</td>
                    </tr>
                    <tr>
                      <td>{t('image.guide.formatTable.webp')}</td>
                      <td>{t('image.guide.formatTable.webpUse')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="image-tools-seo-note">{t('image.guide.seoNote')}</p>

              <h3>{t('image.guide.scenariosHeading')}</h3>
              <div className="image-tools-workflow-list">
                <p><strong>{t('image.guide.scenarios.social.title')}</strong></p>
                <p>{t('image.guide.scenarios.usePrefix')} <Link to="/image-resizer">{t('image.guide.categories.optimization.item1')}</Link>.</p>

                <p><strong>{t('image.guide.scenarios.branding.title')}</strong></p>
                <p>{t('image.guide.scenarios.usePrefix')} <Link to="/image-watermarker">{t('image.guide.categories.creative.item3')}</Link>.</p>

                <p><strong>{t('image.guide.scenarios.marketing.title')}</strong></p>
                <p>{t('image.guide.scenarios.usePrefix')} <Link to="/image-collage">{t('image.guide.categories.creative.item1')}</Link>.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
