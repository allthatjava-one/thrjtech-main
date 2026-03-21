import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar({ onAboutClick }) {
  const [toolsOpen, setToolsOpen] = useState(false)
  const toolsRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setToolsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          THRJ<span className="logo-accent">Tech</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <div className="dropdown" ref={toolsRef}>
            <button
              className={`dropbtn${toolsOpen ? ' open' : ''}`}
              onClick={() => setToolsOpen((o) => !o)}
              aria-expanded={toolsOpen}
              aria-haspopup="true"
            >
              Tools ▼
            </button>
            {toolsOpen && (
              <div className="dropdown-content">
                <div className="dropdown-group">
                  <div className="dropdown-group-title">PDF</div>
                  <Link to="/pdf-compressor" onClick={() => setToolsOpen(false)}>PDF Compressor</Link>
                  <Link to="/pdf-merger" onClick={() => setToolsOpen(false)}>PDF Merger</Link>
                </div>
                <div className="dropdown-group">
                  <div className="dropdown-group-title">Text</div>
                  <Link to="/json-formatter" onClick={() => setToolsOpen(false)}>JSON Formatter</Link>
                </div>
              </div>
            )}
          </div>
          <div className="dropdown">
            <button className="dropbtn" onClick={onAboutClick}>About Us</button>
          </div>
        </nav>
      </div>
    </header>
  )
}
