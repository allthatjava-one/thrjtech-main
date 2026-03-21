import { useState } from 'react'
import { usePdfCompressor } from './hooks/usePdfCompressor'
import { PdfCompressorView } from './PdfCompressorView'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import AboutUsModal from '../../components/AboutUsModal'
import './PdfCompressor.css'

export default function PdfCompressorPage() {
  const props = usePdfCompressor()
  const [aboutOpen, setAboutOpen] = useState(false)

  const handleOpenAbout = () => setAboutOpen(true)
  const handleCloseAbout = () => setAboutOpen(false)

  return (
    <div className="pdf-compressor-page">
      <Navbar onAboutClick={handleOpenAbout} />
      <AboutUsModal
        open={aboutOpen}
        onClose={handleCloseAbout}
      />
      <main className="main">
        <div className="container">
          <div className="card">
            <PdfCompressorView {...props} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
