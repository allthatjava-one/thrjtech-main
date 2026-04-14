import Navbar from '../Navbar'
import Footer from '../Footer'
import Seo from '../../services/Seo'
import './About.css'

export default function TermsOfServicePage() {
  return (
    <div className="about-us-page">
      <Seo title="Terms of Service — THRJ" description="THRJTech's terms of service — free tools, privacy commitments, acceptable use, and limitations of liability." />
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
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
      </main>
      <Footer />
    </div>
  )
}
