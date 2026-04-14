import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-copy">&copy; {new Date().getFullYear()} THRJTech. All rights reserved.</p>
        <nav className="footer-links" aria-label="Legal">
          <Link to="/about/us" className="footer-link-btn">About Us</Link>
          <span className="footer-link-sep" aria-hidden="true">·</span>
          <Link to="/about/policy" className="footer-link-btn">Privacy Policy</Link>
          <span className="footer-link-sep" aria-hidden="true">·</span>
          <Link to="/about/terms" className="footer-link-btn">Terms of Service</Link>
        </nav>
      </div>
    </footer>
  )
}
