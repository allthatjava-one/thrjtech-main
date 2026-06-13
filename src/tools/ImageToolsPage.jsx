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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
