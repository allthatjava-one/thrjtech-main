import { useState, useEffect } from 'react'
import './AboutUsModal.css'

const AboutUsModal = ({ open, onClose }) => {
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
        <h2>About Us</h2>
        <div className="aboutus-section">
          <p>
            We are a reliable, free online software service company dedicated to making your digital
            life easier. Our mission is to provide fast, privacy-friendly, and user-centric tools
            that empower everyone to work smarter. We believe in transparency, simplicity, and
            putting our users first. Thank you for trusting us!
            <span style={{ display: 'block', textAlign: 'right', marginTop: '0.5em' }}>
              - The THRJTech Team
            </span>
          </p>
        </div>
        <hr style={{ margin: '1.5rem 0' }} />
        <div className="contactus-section">
          <h3>Contact Us</h3>
          <form onSubmit={handleSubmit} className="contactus-form" autoComplete="off">
            {/* Honeypot — hidden from real users, traps bots */}
            <div style={{ display: 'none' }}>
              <label>
                Leave this field empty
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
              Email Address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                autoComplete="email"
              />
            </label>
            <label>
              Message
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="How can we help you?"
                rows={4}
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Sending…' : 'Submit'}
            </button>
            {submitSuccess && (
              <div className="contactus-success">Thank you! We received your message.</div>
            )}
            {submitError && (
              <div className="contactus-error">Sorry, something went wrong. Please try again.</div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default AboutUsModal
