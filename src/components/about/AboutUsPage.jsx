import { Link } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import Seo from '../../services/Seo'
import './About.css'

export default function AboutUsPage() {
  return (
    <div className="about-us-page">
      <Seo title="About Us — THRJ" description="Learn about THRJTech — who we are, our mission, and our commitment to free, privacy-friendly browser tools." />
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
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
              We do not store, sell, or share your data. For more information on how we and our partners
              handle data, please see our full Privacy Policy.
            </p>

            <h3>Always Free</h3>
            <p>
              All of our tools are completely free to use with no hidden costs, no sign-up required,
              and no usage limits. We sustain the service through transparent, non-intrusive advertising
              partnerships (including Google AdSense), which allows us to keep our tools free and accessible
              to the global community without compromising user experience.
            </p>

            <h3>Get in Touch</h3>
            <p>
              We are always looking to improve. If you have suggestions, feedback, or find a bug,
              please reach out via the contact information on the site. We read every message and
              appreciate your input.
            </p>
            <p>
              <Link to="/contact-us">Contact Us →</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
