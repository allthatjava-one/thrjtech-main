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
              without installing software, creating accounts, or paying subscriptions. We started because
              we were tired of hunting for simple utilities only to land on sites riddled with ads, paywalls,
              or mandatory sign-ups. There had to be a better way — so we built it ourselves.
            </p>

            <h3>Our Mission</h3>
            <p>
              We believe that powerful, practical tools should be free and accessible to all. Whether
              you need to resize a photo, compress a PDF, create a meme, or watermark an image, our goal
              is to give you a fast, private, no-friction way to do it — right in your browser. We focus
              relentlessly on simplicity: every tool is designed to be intuitive enough to use in seconds,
              with no learning curve and no manual required.
            </p>

            <h3>Built for Everyone</h3>
            <p>
              Our users range from students and freelancers to small business owners and developers.
              What they all have in common is a need to get something done quickly without jumping
              through hoops. We design every feature with that in mind — fast load times, clean
              interfaces, and outputs you can trust. If a tool feels clunky or confusing, we consider
              that a bug worth fixing.
            </p>

            <h3>Privacy First</h3>
            <p>
              Every tool we build is designed with your privacy in mind. Wherever possible, all
              processing happens locally on your device — your files never leave your browser. For
              features that do require server-side processing (such as PDF compression or merging),
              files are handled on short-lived infrastructure and deleted automatically within 30 minutes.
              We do not store, sell, or share your data. For more information on how we and our partners
              handle data, please see our full <Link to="/about/policy">Privacy Policy</Link>.
            </p>

            <h3>Always Free</h3>
            <p>
              All of our tools are completely free to use with no hidden costs, no sign-up required,
              and no usage limits. We sustain the service through transparent, non-intrusive advertising
              partnerships (including Google AdSense), which allows us to keep our tools free and accessible
              to the global community without compromising user experience. We will never put core features
              behind a paywall — that goes against everything we stand for.
            </p>

            <h3>Constantly Improving</h3>
            <p>
              We ship updates regularly based on user feedback and our own day-to-day use of the tools.
              New tools are added when we identify a gap that isn't already well-served by a simple,
              free, browser-based solution. Our roadmap is driven by what is actually useful — not by
              trends or feature bloat. If something doesn't make the experience better, it doesn't ship.
            </p>

            <h3>Get in Touch</h3>
            <p>
              We are always looking to improve. If you have suggestions, feedback, or find a bug,
              please reach out — we read every message and genuinely appreciate the time people take
              to write in. Your input has directly shaped many of the features you see today, and we
              look forward to hearing what you think next.
            </p>
            <p>
              <Link to="/contact">Contact Us →</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
