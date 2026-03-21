import { useState } from 'react'
import { usePdfMerger } from './hooks/usePdfMerger'
import { PdfMergerView } from './PdfMergerView'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import AboutUsModal from '../../components/AboutUsModal'
import './PdfMerger.css'

export default function PdfMergerPage() {
  const props = usePdfMerger()
  const [aboutOpen, setAboutOpen] = useState(false)

  const handleOpenAbout = () => setAboutOpen(true)
  const handleCloseAbout = () => setAboutOpen(false)

  return (
    <div className="pdf-merger-page">
      <Navbar onAboutClick={handleOpenAbout} />
      <AboutUsModal
        open={aboutOpen}
        onClose={handleCloseAbout}
      />
      <main className="main">
        <div className="container">
          <div className="card">
            <PdfMergerView {...props} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
