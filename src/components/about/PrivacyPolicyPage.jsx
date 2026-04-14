import Navbar from '../Navbar'
import Footer from '../Footer'
import Seo from '../../services/Seo'
import './About.css'

export default function PrivacyPolicyPage() {
  return (
    <div className="about-us-page">
      <Seo title="Privacy Policy — THRJ" description="THRJTech's privacy policy — how we handle your data, cookies, and advertising on our free browser tools." />
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <h2>Privacy Policy</h2>
            <p className="fl-updated">Last updated: April 2026</p>

            <h3>Overview</h3>
            <p>
              THRJTech ("we", "our", or "us") respects your privacy. This policy explains how information is
              collected and used when you visit this site. All image and PDF processing tools run entirely
              in your browser — your files are never uploaded to our servers unless explicitly stated for a
              specific feature (such as PDF compression or merging which use short-lived cloud processing).
            </p>

            <h3>Google AdSense &amp; Advertising</h3>
            <p>
              We use Google AdSense to display advertisements on this site. Google, as a third-party
              vendor, uses cookies (including the DoubleClick cookie) to serve ads based on your prior
              visits to this website and other sites on the internet. Google's use of advertising cookies
              enables it and its partners to serve ads to our users based on their visit to thjrtech.com
              and/or other sites on the Internet.
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

            <h3>User Consent</h3>
            <p>
              We use a Consent Management Platform (CMP) to obtain and record user consent where
              required by local laws (for example GDPR or CCPA). The CMP presents choices about cookie
              usage and personalised advertising to visitors in applicable regions; we respect those
              choices and limit data processing accordingly. You can review or change your consent
              preferences via the site's privacy controls or your browser settings. Opting out may
              prevent personalised ads but does not affect the core functionality of the tools.
              For users in the European Economic Area (EEA) and the UK, we use a Google-certified
              Consent Management Platform to manage user preferences and comply with the IAB
              Transparency and Consent Framework.
            </p>

            <h3>Data We Collect</h3>
            <p>
              We do not collect, store, or share any personally identifiable information. Usage analytics
              (if enabled) are anonymised and aggregated. Files you process with our tools remain on your
              device and are not transmitted to us. Files uploaded for server-side processing (such as PDF merging)
              are processed in memory, are never viewed by humans, and are permanently deleted from our
              servers automatically within 30 minutes of processing. We do not maintain backups or logs
              of the contents of these files.
            </p>

            <h3>Google Analytics</h3>
            <p>
              We use Google Analytics (GA4) to collect anonymised usage data such as page views,
              events, and performance metrics to help improve the website and our tools. We do not
              collect personal identifiers through Analytics; where available we enable IP
              anonymisation to minimise identifiability. Analytics data is processed by Google under
              their policies and may be subject to international transfer. Our CMP respects users'
              consent choices, and you may opt out of analytics tracking via the CMP or by using
              browser-level controls (for example, the Google Analytics opt-out add-on).
            </p>

            <h3>Third-Party Links</h3>
            <p>
              This site may contain links to external websites. We are not responsible for the privacy
              practices or content of those sites.
            </p>

            <h3>California Privacy Rights (CCPA/CPRA)</h3>
            <p>
              If you are a California resident, you have the right to opt-out of the 'sale' or 'sharing'
              of your personal information. We do not sell your personal data; however, our use of
              advertising cookies may be considered 'sharing' under California law. You may
              exercise your right to opt-out via the ad settings links provided above.
            </p>

            <h3>Contact</h3>
            <p>
              If you have any questions about this Privacy Policy, please reach out via the contact
              information provided on this site at privacy@thjrtech.com
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
