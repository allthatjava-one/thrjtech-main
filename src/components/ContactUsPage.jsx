import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Seo from '../services/Seo'
import './ContactUs.css'

export default function ContactUsPage() {
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
              <h2 style={{ marginBottom: '0.75rem' }}>Contact Us</h2>
              <p>
                We love hearing from our users — your feedback is what drives us to keep improving.
                Whether you've spotted a bug, have a feature request, or just want to share your
                experience, we genuinely want to know. Drop us a message using the form below and
                we'll get back to you as soon as possible. Every message is read by a real person,
                and we do our best to respond promptly. Thank you for taking the time to reach out!
                <span style={{ display: 'block', textAlign: 'right', marginTop: '0.5em' }}>
                  - The THRJTech Team
                </span>
              </p>
            </div>
            <hr style={{ margin: '0.5rem 0 1rem', border: 'none', borderTop: '1px solid #e2e6f0' }} />
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
      </main>
      <Footer />
    </div>
  )
}
