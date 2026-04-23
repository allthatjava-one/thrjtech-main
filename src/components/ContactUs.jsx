import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './ContactUs.css'

const ContactUs = ({ open, onClose }) => {
  const { t } = useTranslation('contact')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [formStartTime, setFormStartTime] = useState(Date.now())

  useEffect(() => {
    if (open) {
      setFormStartTime(Date.now())
      setSubmitSuccess(false)
      setSubmitError(false)
      setEmail('')
      setMessage('')
      setHoneypot('')
    }
  }, [open])

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
      } else {
        setSubmitError(true)
      }
    } catch {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="aboutus-modal-overlay" onClick={onClose}>
      <div className="aboutus-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="aboutus-modal-close" onClick={onClose} aria-label="Close">&times;</button>
        <div className="aboutus-section">
          <h3>{t('title')}</h3>
          <p>
            {t('intro')}
            <span style={{ display: 'block', textAlign: 'right', marginTop: '0.5em' }}>
              {t('signature')}
            </span>
          </p>
        </div>
        <hr style={{ margin: '1.5rem 0' }} />
        <div className="contactus-section">
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
    </div>
  )
}

export default ContactUs
