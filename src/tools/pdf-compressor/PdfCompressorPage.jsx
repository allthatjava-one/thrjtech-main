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
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [formStartTime, setFormStartTime] = useState(Date.now())

  const handleOpenAbout = () => {
    setFormStartTime(Date.now())
    setAboutOpen(true)
  }

  const handleCloseAbout = () => {
    setAboutOpen(false)
    setSubmitSuccess(false)
    setSubmitError(false)
  }

  const handleContactSubmit = async ({ email, message, honeypot, formStartTime: submittedTime }) => {
    if (honeypot || Date.now() - (submittedTime ?? formStartTime) < 3000) {
      setSubmitError(true)
      return
    }
    setSubmitting(true)
    setSubmitSuccess(false)
    setSubmitError(false)
    try {
      const res = await fetch('https://formspree.io/f/mgonpdvz', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      })
      if (res.ok) {
        setSubmitSuccess(true)
      } else {
        setSubmitError(true)
      }
    } catch {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pdf-compressor-page">
      <Navbar onAboutClick={handleOpenAbout} />
      <AboutUsModal
        open={aboutOpen}
        onClose={handleCloseAbout}
        onSubmit={(data) => handleContactSubmit({ ...data, formStartTime })}
        submitting={submitting}
        submitSuccess={submitSuccess}
        submitError={submitError}
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
