import { useState } from 'react'
import './Footer.css'

export default function Footer() {
  const [openDialog, setOpenDialog] = useState(null) // 'privacy' | 'terms' | 'about' | null

  return (
    <>
      <footer className="footer">
        <div className="footer-inner">
          <p className="footer-copy">&copy; {new Date().getFullYear()} THRJTech. All rights reserved.</p>
          <nav className="footer-links" aria-label="Legal">
            <button className="footer-link-btn" onClick={() => setOpenDialog('about')}>About Us</button>
            <span className="footer-link-sep" aria-hidden="true">·</span>
            <button className="footer-link-btn" onClick={() => setOpenDialog('privacy')}>Privacy Policy</button>
            <span className="footer-link-sep" aria-hidden="true">·</span>
            <button className="footer-link-btn" onClick={() => setOpenDialog('terms')}>Terms of Service</button>
          </nav>
        </div>
      </footer>

      {/* About Us dialog — always rendered, hidden via CSS */}
      <div
        className="fl-overlay"
        aria-modal="true"
        role="dialog"
        aria-label="About Us"
        style={{ display: openDialog === 'about' ? 'flex' : 'none' }}
        onClick={e => { if (e.target === e.currentTarget) setOpenDialog(null) }}
      >
        <div className="fl-dialog">
          <button className="fl-close" onClick={() => setOpenDialog(null)} aria-label="Close">&times;</button>
          <h2>About Us</h2>

          <h3>Who We Are</h3>
          <p>
            THRJTech is a small independent team of developers passionate about making everyday digital
            tasks simpler for everyone. We build free, browser-based tools so you can get things done
            without installing software, creating accounts, or paying subscriptions.
          </p>

          <h3>Our Mission</h3>
          <p>
            We believe that powerful, practical tools should be free and accessible to all. Whether
            you need to resize a photo, compress a PDF, create a meme, or watermark an image, our goal
            is to give you a fast, private, no-friction way to do it — right in your browser.
          </p>

          <h3>Privacy First</h3>
          <p>
            Every tool we build is designed with your privacy in mind. Wherever possible, all
            processing happens locally on your device — your files never leave your browser. For
            features that do require server-side processing (such as PDF compression or merging),
            files are handled on short-lived infrastructure and deleted automatically within 30 minutes.
            We do not store, sell, or share your data.
          </p>

          <h3>Always Free</h3>
          <p>
            All of our tools are completely free to use with no hidden costs, no sign-up required,
            and no usage limits. We sustain the service through non-intrusive advertising so we can
            keep everything free for everyone.
          </p>

          <h3>Get in Touch</h3>
          <p>
            We are always looking to improve. If you have suggestions, feedback, or find a bug,
            please reach out via the contact information on the site. We read every message and
            appreciate your input.
          </p>
        </div>
      </div>

      {/* Privacy Policy dialog — always rendered, hidden via CSS */}
      <div
        className="fl-overlay"
        aria-modal="true"
        role="dialog"
        aria-label="Privacy Policy"
        style={{ display: openDialog === 'privacy' ? 'flex' : 'none' }}
        onClick={e => { if (e.target === e.currentTarget) setOpenDialog(null) }}
      >
        <div className="fl-dialog">
          <button className="fl-close" onClick={() => setOpenDialog(null)} aria-label="Close">&times;</button>
          <h2>Privacy Policy</h2>
          <p className="fl-updated">Last updated: April 2026</p>

          <h3>Overview</h3>
          <p>
            THRJTech ("we", "our", or "us") respects your privacy. This policy explains how information is
            collected and used when you visit this site. All image and PDF processing tools run entirely
            in your browser — your files are never uploaded to our servers unless explicitly stated for a
            specific feature (such as PDF compression or merging which use short-lived cloud processing).
          </p>

          <h3>Google AdSense & Advertising</h3>
          <p>
            We use Google AdSense to display advertisements on this site. Google, as a third-party
            vendor, uses cookies (including the DoubleClick cookie) to serve ads based on your prior
            visits to this website and other sites on the internet. These cookies allow Google and its
            partners to serve ads to you based on your visit to our site and/or other sites on the
            internet.
          </p>
          <p>
            You may opt out of personalised advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>
            . Alternatively, you can opt out of a third-party vendor's use of cookies for personalised
            advertising by visiting{' '}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              aboutads.info
            </a>
            .
          </p>

          <h3>Cookies</h3>
          <p>
            We do not set any first-party tracking cookies. Third-party advertising partners (Google
            AdSense) may set cookies on your device subject to their own privacy policies. You can
            control cookie preferences through your browser settings or the opt-out links above.
          </p>

          <h3>Data We Collect</h3>
          <p>
            We do not collect, store, or share any personally identifiable information. Usage analytics
            (if enabled) are anonymised and aggregated. Files you process with our tools remain on your
            device and are not transmitted to us.
          </p>

          <h3>Third-Party Links</h3>
          <p>
            This site may contain links to external websites. We are not responsible for the privacy
            practices or content of those sites.
          </p>

          <h3>Contact</h3>
          <p>
            If you have any questions about this Privacy Policy, please reach out via the contact
            information provided on this site.
          </p>
        </div>
      </div>

      {/* Terms of Service dialog — always rendered, hidden via CSS */}
      <div
        className="fl-overlay"
        aria-modal="true"
        role="dialog"
        aria-label="Terms of Service"
        style={{ display: openDialog === 'terms' ? 'flex' : 'none' }}
        onClick={e => { if (e.target === e.currentTarget) setOpenDialog(null) }}
      >
        <div className="fl-dialog">
          <button className="fl-close" onClick={() => setOpenDialog(null)} aria-label="Close">&times;</button>
          <h2>Terms of Service</h2>
          <p className="fl-updated">Last updated: April 2026</p>

          <h3>Free Service</h3>
          <p>
            THRJTech provides all tools on this website free of charge. There is no account required,
            no subscription fee, and no hidden cost. We believe productive tools should be accessible
            to everyone, regardless of budget or technical background.
          </p>

          <h3>Privacy as a Core Value</h3>
          <p>
            Your privacy is the most important value we uphold. Every image and document tool on this
            site is designed to process your files locally in your browser wherever possible. Your files
            do not leave your device by default, and we never store, sell, or share your personal data
            or uploaded content.
          </p>
          <p>
            For features that require server-side processing (such as PDF compression, conversion, or
            merging), files are transmitted over encrypted HTTPS to short-lived infrastructure and are
            automatically deleted after a brief retention window (typically 30 minutes). You will always
            be informed when a feature requires a server upload.
          </p>

          <h3>Acceptable Use</h3>
          <p>
            You agree to use this service only for lawful purposes. You must not use these tools to
            process, distribute, or generate content that is illegal, harmful, or violates the rights of
            others. We reserve the right to restrict access if these terms are violated.
          </p>

          <h3>No Warranty</h3>
          <p>
            This service is provided "as is" without warranties of any kind. We make no guarantees
            about the accuracy, reliability, or fitness of the tools for any particular purpose. Use
            the outputs at your own discretion and always keep copies of important original files
            before processing.
          </p>

          <h3>Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, THRJTech shall not be liable for any direct,
            indirect, incidental, or consequential damages arising from your use of this service.
          </p>

          <h3>Changes to These Terms</h3>
          <p>
            We may update these Terms of Service from time to time. Continued use of the site after
            changes are posted constitutes acceptance of the revised terms.
          </p>

          <h3>Contact</h3>
          <p>
            If you have questions about these terms, please reach out via the contact information
            provided on this site.
          </p>
        </div>
      </div>
    </>
  )
}
