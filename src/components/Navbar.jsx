import { useState, useEffect, useRef } from 'react'
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
        <a href="https://thrjtech.com" className="logo">
          THRJ<span className="logo-accent">Tech</span>
        </a>
        <nav className="nav">
          <a href="https://thrjtech.com" className="nav-link">Home</a>
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
                <a href="https://pdf-compressor.thrjtech.com" onClick={() => setToolsOpen(false)}>PDF Compressor</a>
                <a href="https://pdf-merger.thrjtech.com" onClick={() => setToolsOpen(false)}>PDF Merger</a>
                <a href="https://json-formatter.thrjtech.com" onClick={() => setToolsOpen(false)}>JSON Formatter</a>
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
