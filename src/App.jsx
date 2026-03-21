import './App.css'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AboutUsModal from './components/AboutUsModal'
import RotatingCards from './components/RotatingCards'
import PdfCompressorPage from './tools/pdf-compressor/PdfCompressorPage'
import PdfMergerPage from './tools/pdf-merger/PdfMergerPage'
import JsonFormatterPage from './tools/json-formatter/JsonFormatterPage'

function HomePage() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [formStartTime, setFormStartTime] = useState(Date.now())

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

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
    // Spam protection: block if honeypot filled or form submitted too quickly (< 3s)
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
    <>
      <Navbar onAboutClick={handleOpenAbout} />
      <AboutUsModal
        open={aboutOpen}
        onClose={handleCloseAbout}
        onSubmit={(data) => handleContactSubmit({ ...data, formStartTime })}
        submitting={submitting}
        submitSuccess={submitSuccess}
        submitError={submitError}
      />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Main content - Start */}

        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">
            <h1 className="hero-title">Online Tools,<br />Zero Hassle</h1>
            <p className="hero-subtitle">
              Free, fast, and privacy-friendly utilities that work right in your browser.
            </p>
          </div>
        </section>

        {/* Tools Section */}
        <div className="tools-section">
          <div className="container">
            <h2 className="section-heading">Available Tools</h2>
            <RotatingCards />
          </div>
        </div>

        {/* Main content - End */}
      </main>
      {/* THRJ Tech Ads */}
      <ins className="adsbygoogle" style={{ display: 'block' }}
        data-ad-client="ca-pub-1683577108258942" data-ad-slot="9546355200"
        data-ad-format="auto" data-full-width-responsive="true"></ins>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pdf-compressor" element={<PdfCompressorPage />} />
        <Route path="/pdf-merger" element={<PdfMergerPage />} />
        <Route path="/json-formatter" element={<JsonFormatterPage />} />
      </Routes>
    </BrowserRouter>
  )
}
