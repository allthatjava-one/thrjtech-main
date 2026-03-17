import './App.css'

import RotatingCards from './RotatingCards';
import AboutUsModal from './AboutUsModal';
import { useState } from 'react';


function App() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [formStartTime, setFormStartTime] = useState(Date.now());

  // You can set your Formspree form ID in an environment variable, e.g., VITE_FORMSPREE_ID
  const formId = import.meta.env.VITE_FORMSPREE_ID;

  // Reset form start time when modal opens
  const handleOpenAbout = () => {
    setFormStartTime(Date.now());
    setAboutOpen(true);
  };

  const handleContactSubmit = async ({ email, message, honeypot, formStartTime: submittedTime }) => {
    // Spam protection: block if honeypot is filled or form submitted too quickly (< 3s)
    if (honeypot || (Date.now() - submittedTime < 3000)) {
      setSubmitError(true);
      return;
    }
    setSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(false);
    try {
      const res = await fetch(`https://formspree.io/f/mgonpdvz`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      });
      if (res.ok) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(true);
      }
    } catch (e) {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <span className="logo">THRJ<span className="logo-accent">Tech</span></span>
          <nav className="nav">
            <a href="https://thrjtech.com" className="nav-link">Home</a>
            <div className="dropdown">
              <button className="dropbtn">Tools ▼</button>
              <div className="dropdown-content">
                <a href="https://pdf-compressor.thrjtech.com">PDF Compressor</a>
                <a href="https://pdf-merger.thrjtech.com">PDF Merger</a>
              </div>
            </div>
            <div className="dropdown">
              <button className="dropbtn" onClick={handleOpenAbout}>About Us</button>
            </div>
          </nav>
        </div>
      </header>

      {/* About Us Modal */}
      <AboutUsModal
        open={aboutOpen}
        onClose={() => { setAboutOpen(false); setSubmitSuccess(false); setSubmitError(false); }}
        onSubmit={handleContactSubmit}
        formId={formId}
        submitting={submitting}
        submitSuccess={submitSuccess}
        submitError={submitError}
        formStartTime={formStartTime}
      />

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
      <main className="tools-section">
        <div className="container">
          <h2 className="section-heading">Available Tools</h2>

          {/* Rotatable Card Section */}
          <RotatingCards />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} THRJTech. All rights reserved.</p>
        </div>
      </footer>
    </div>

  );
}

export default App
