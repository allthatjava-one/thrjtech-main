import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Seo from '../services/Seo'
import './ContactUs.css'
import { useTranslation } from 'react-i18next'

export default function ContactUsPage() {
  const { t } = useTranslation('contact')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [formStartTime] = useState(Date.now())

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (honeypot || Date.now() - formStartTime < 3000) {
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
        setEmail('')
        setMessage('')
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
    <div className="about-us-page">
      <Seo title="Contact Us — THRJ" description="Get in touch with the THRJTech team. Send us feedback, bug reports, or feature requests." />
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card" style={{ maxWidth: 540 }}>
            <div className="aboutus-section">
              <h2 style={{ marginBottom: '0.75rem' }}>{t('title')}</h2>
              <p>{t('intro')}<span style={{ display: 'block', textAlign: 'right', marginTop: '0.5em' }}>- {t('signature')}</span></p>
            </div>
            <hr style={{ margin: '0.5rem 0 1rem', border: 'none', borderTop: '1px solid #e2e6f0' }} />
            <form onSubmit={handleSubmit} className="contactus-form" autoComplete="off">
              {/* Honeypot — hidden from real users, traps bots */}
              <div style={{ display: 'none' }}>
                <label>
                  {t('honeypotLabel')}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </label>
              </div>
              <label>
                {t('emailLabel')}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('emailPlaceholder')}
                  autoComplete="email"
                />
              </label>
              <label>
                {t('messageLabel')}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder={t('messagePlaceholder')}
                  rows={4}
                />
              </label>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? t('sendingBtn') : t('submitBtn')}
              </button>
              {submitSuccess && (
                <div className="contactus-success">{t('successMsg')}</div>
              )}
              {submitError && (
                <div className="contactus-error">{t('errorMsg')}</div>
              )}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
