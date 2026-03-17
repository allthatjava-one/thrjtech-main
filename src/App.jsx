import './App.css'
import RotatingCards from './RotatingCards';

function App() {
  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <span className="logo">THRJ<span className="logo-accent">Tech</span></span>
          <nav className="nav">
            <a href="https://thrjtech.com" className="nav-link">Home</a>
            <div className="dropdown">
              <button className="dropbtn">Tools ▾</button>
              <div className="dropdown-content">
                <a href="https://pdf-compressor.thrjtech.com">PDF Compressor</a>
                <a href="https://pdf-merger.thrjtech.com">PDF Merger</a>
              </div>
            </div>
          </nav>
        </div>
      </header>

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
  )
}

export default App
