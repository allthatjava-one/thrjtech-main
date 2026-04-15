import { Link, useNavigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import './JsonFormatter.css'

const INDENT = 2

function formatJson(raw) {
  const parsed = JSON.parse(raw) // throws on invalid JSON
  return JSON.stringify(parsed, null, INDENT)
}

export default function JsonFormatterView() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [errorLine, setErrorLine] = useState(null)
  const [openPanel, setOpenPanel] = useState('')
  const navigate = useNavigate()

  const handleFormat = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) {
      setError('Please enter some JSON to format.')
      setOutput('')
      setErrorLine(null)
      return
    }
    try {
      const formatted = formatJson(trimmed)
      setOutput(formatted)
      setError('')
      setErrorLine(null)
    } catch (e) {
      setOutput('')
      // Try to extract line number from error message
      let line = null
      const match = e.message.match(/at position (\d+)/i)
      if (match) {
        // Convert char position to line number
        const pos = parseInt(match[1], 10)
        const upToErr = trimmed.slice(0, pos)
        line = upToErr.split(/\r?\n/).length
      } else {
        // Try to match 'line X column Y' (for some browsers)
        const match2 = e.message.match(/line (\d+)/i)
        if (match2) line = parseInt(match2[1], 10)
      }
      setError(`Invalid JSON: ${e.message}`)
      setErrorLine(line)
    }
  }, [input])

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setCopied(false)
    setErrorLine(null)
  }

  const handleCopy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = output
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleKeyDown = (e) => {
    // Format on Ctrl+Enter / Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleFormat()
    }
  }

  return (
    <>
      <section className="formatter-section">
      <div className="jf-container">
        <div className="card">

        {/* Hero */}
        <div className="jf-hero">
          <div className="jf-tool-icon" aria-hidden="true">{'{}'}</div>
          <h1 className="jf-hero-title">JSON Formatter</h1>
          <p className="jf-hero-subtitle">
            Paste your JSON below, click <b>Format</b>, and get clean, readable output instantly —
             no sign-up required. Invalid JSON is caught and reported with the line number 
             so you can fix errors quickly. <Link to="/blogs/json-formatter-guide">Learn how to format JSON →</Link>
          </p>
          <div className="details-row" data-open={openPanel}>
            <div className="details-controls">
              <button
                className={`tab-btn ${openPanel === 'details' ? 'active' : ''}`}
                onClick={() => setOpenPanel(prev => (prev === 'details' ? '' : 'details'))}
                aria-expanded={openPanel === 'details'}
                type="button"
              >
                Details
              </button>
              <button
                className={`tab-btn ${openPanel === 'howitworks' ? 'active' : ''}`}
                onClick={() => setOpenPanel(prev => (prev === 'howitworks' ? '' : 'howitworks'))}
                aria-expanded={openPanel === 'howitworks'}
                type="button"
              >
                How it works
              </button>
            </div>

            <div className={`shared-collapse${!openPanel ? ' panel-hidden' : ''}`}>
                <div className={openPanel !== 'details' ? 'details-content panel-hidden' : 'details-content'}>
                    <h3>What is JSON</h3>
                    <ul>
                      <li>JSON (JavaScript Object Notation) is a lightweight, text-based format for representing structured data using key/value pairs and arrays. It's widely used for APIs, configuration, and data interchange because it's easy for humans and machines to read and write.</li>
                    </ul>

                    <h3>When to use JSON</h3>
                    <ul>
                      <li>Use JSON when you need to serialize structured data for network transfer (APIs), store configuration or settings, or exchange data between services and applications. It's a good choice when interoperability and human readability matter.</li>
                    </ul>

                    <h3>How the JSON formatter works</h3>
                    <ul>
                      <li>The formatter parses your input with a JSON parser. If parsing succeeds, it re-serializes the data with a consistent indentation (2 spaces by default) to produce readable, pretty-printed output. If parsing fails, the tool reports the parse error and attempts to show the approximate line where the problem occurred.</li>
                    </ul>

                    <h3>JSON in pretty format</h3>
                    <ul>
                      <li>"Pretty" JSON adds line breaks and indentation so nested objects and arrays are easy to scan. This improves debugging, code reviews, and documentation. The formatter preserves keys and values while only changing whitespace and ordering as allowed by the JSON spec.</li>
                    </ul>

                    <h3>Useful when</h3>
                    <ul>
                      <li>need to debug or inspect JSON data.</li>
                      <li>want to improve readability for code reviews or documentation.</li>
                      <li>preparing JSON for configuration files or API requests.</li>
                    </ul>

                    <h3>FAQs</h3>
                    <ul>
                      <li><strong>Q:</strong> Will it fix invalid JSON? <strong>A:</strong> No — it reports errors and indicates the likely line, but you must correct the input to valid JSON before it can be formatted.</li>
                      <li><strong>Q:</strong> Can I minify JSON (remove all whitespace)? <strong>A:</strong> This tool focuses on pretty-printing. To minify, remove whitespace or use a dedicated minifier; many editors and online tools can do that by serializing without indentation.</li>
                      <li><strong>Q:</strong> Does my data leave my browser? <strong>A:</strong> The formatter runs in your browser and does not upload your input to a remote server (unless you explicitly use a feature that sends data). Check the network panel if you're unsure.</li>
                      <li><strong>Q:</strong> Does it support JSON with comments or trailing commas? <strong>A:</strong> Standard JSON does not allow comments or trailing commas. Inputs containing them will usually cause a parse error. Remove comments or use a tool that supports relaxed JSON if needed.</li>
                      <li><strong>Q:</strong> Are there size limits? <strong>A:</strong> Very large inputs may be slow or hit browser memory limits; if you work with massive files, consider processing them in a dedicated environment or splitting them into smaller chunks.</li>
                    </ul>
                  </div>

                <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
                    <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/screenshots/json-formatter/JSON_formatter001.png" alt="Step 1" className="how-img" />
                        <p>Paste or type raw JSON into the input panel.</p>
                      </li>
                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/screenshots/json-formatter/JSON_formatter002.png" alt="Step 2" className="how-img" />
                        <p>Click Validate & Format (or press Ctrl+Enter) to run the parser.</p>
                      </li>
                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/screenshots/json-formatter/JSON_formatter003.png" alt="Step 3" className="how-img" />
                        <p>Review formatted output and copy or download as needed.</p>
                      </li>
                      <li>
                        <img src="/screenshots/json-formatter/JSON_formatter004.png" alt="Step 4" className="how-img" />
                        <p>Fix any parse errors indicated by the error panel and reformat.</p>
                      </li>
                    </ol>
                  </div>
            </div>
          </div>
        </div>

        {/* How to use */}
        <div className="jf-instructions-card">
          <h2 className="jf-instructions-heading">How to use</h2>
          <ol className="jf-instructions-list">
            <li>Paste or type your JSON into the input field below.</li>
            <li>Click <strong>Format JSON</strong> (or press <kbd>Ctrl</kbd>+<kbd>Enter</kbd>).</li>
            <li>Review the formatted output and click <strong>Copy</strong> to copy it.</li>
          </ol>
        </div>

        {/* Main formatter */}
        <div className="jf-panels">

          {/* Input panel */}
          <div className="jf-panel">
            <div className="jf-panel-header">
              <span className="jf-panel-label">Input JSON</span>
              <button
                className="jf-btn jf-btn-ghost"
                onClick={handleClear}
                disabled={!input && !output}
                title="Clear all"
              >
                Clear
              </button>
            </div>
            <textarea
              className={`jf-json-textarea${error ? ' has-error' : ''}`}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError('') }}
              onKeyDown={handleKeyDown}
              placeholder={'Paste your JSON here…\n\nExample:\n{\n  "name": "John",\n  "age": 30\n}'}
              spellCheck={false}
              aria-label="JSON input"
              aria-describedby={error ? 'json-error' : undefined}
            />
            {/* Notify section for JSON errors */}
            {error && (
              <div id="json-error" className="jf-error-msg" role="alert">
                <span className="jf-error-icon" aria-hidden="true">⚠</span>
                {error}
                {errorLine && (
                  <div className="jf-error-line">Problem detected near line <strong>{errorLine}</strong>.</div>
                )}
              </div>
            )}
            <div className="jf-panel-actions">
              <button
                className="jf-btn jf-btn-primary"
                onClick={handleFormat}
                disabled={!input.trim()}
              >
                Validate and Format JSON
              </button>
            </div>
          </div>

          {/* Output panel */}
          <div className="jf-panel">
            <div className="jf-panel-header">
              <span className="jf-panel-label">Formatted Output</span>
              <button
                className={`jf-btn jf-btn-ghost${copied ? ' copied' : ''}`}
                onClick={handleCopy}
                disabled={!output}
                title="Copy to clipboard"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <pre
              className={`jf-json-output${!output ? ' empty' : ''}`}
              aria-live="polite"
              aria-label="Formatted JSON output"
            >
              {output || 'Formatted JSON will appear here…'}
            </pre>
          </div>

        </div>

        {/* JSON Formatter guide - purple/code-editor vibe */}
        <div className="jf-guide" style={{ marginTop: 28, padding: 18, borderTop: '1px solid #dddaff', color: '#111' }}>
          <div className="jf-guide-row" style={{ display: 'flex', gap: 12 }}>
            <div className="jf-guide-icon" style={{ flex: '0 0 60px', fontSize: 34, lineHeight: 1, fontFamily: 'monospace', fontWeight: 700, color: '#6c63ff' }}>{'{}'}</div>
            <div className="jf-guide-content" style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>How to Read and Fix JSON Faster (A Practical Guide for Developers)</h2>
              <p style={{ marginTop: 8 }}>If you've ever worked with APIs, logs, or config files, you've seen something like this:</p>
              <pre style={{ background: '#1e1e2e', color: '#cdd6f4', borderRadius: 6, padding: '10px 14px', fontSize: 13, overflowX: 'auto', marginTop: 8 }}>{'{"user":{"id":1,"name":"John","roles":["admin","editor"],"active":true}}'}</pre>
              <p style={{ marginTop: 8 }}>Technically correct… but painful to read. That's where a JSON formatter becomes essential.</p>
              <p style={{ marginTop: 6, fontWeight: 700 }}>👉 In this guide, you'll learn how to turn messy JSON into readable structure, debug errors faster, and work more efficiently with API data.</p>

              <br />
              <h3 style={{ marginTop: 12 }}>📦 What Is JSON (Quick Refresher)</h3>
              <p>JSON (JavaScript Object Notation) is a lightweight data format used to exchange structured data between systems. It's used in APIs, backend services, config files, and databases. Machines love JSON — humans, not so much (when it's messy).</p>

              <br />
              <h3 style={{ marginTop: 10 }}>🔍 What Does a JSON Formatter Do?</h3>
              <p>A JSON formatter takes raw or minified JSON and adds indentation, organizes nested structures, and makes data readable. It doesn't change the data — only how it looks.</p>
              <p style={{ marginTop: 8, fontWeight: 600 }}>Before:</p>
              <pre style={{ background: '#1e1e2e', color: '#cdd6f4', borderRadius: 6, padding: '10px 14px', fontSize: 13, overflowX: 'auto' }}>{'{"name":"app","features":["json","image","pdf"],"active":true}'}</pre>
              <p style={{ marginTop: 8, fontWeight: 600 }}>After:</p>
              <pre style={{ background: '#1e1e2e', color: '#cdd6f4', borderRadius: 6, padding: '10px 14px', fontSize: 13, overflowX: 'auto' }}>{`{\n  "name": "app",\n  "features": [\n    "json",\n    "image",\n    "pdf"\n  ],\n  "active": true\n}`}</pre>

              <br />
              <h3 style={{ marginTop: 10 }}>😵 Why Raw JSON Slows You Down</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>🔍 <strong>Hard to scan</strong> — nested objects become dense, confusing, and easy to misread.</li>
                <li>🐞 <strong>Debugging becomes painful</strong> — one missing comma or bracket breaks everything and is hard to locate.</li>
                <li>⏱ <strong>Wasted time</strong> — you spend more time reading structure instead of solving problems.</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>⚡ When You Should Use a JSON Formatter</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>🔌 <strong>API Responses</strong> — most APIs return minified JSON; formatting reveals structure immediately.</li>
                <li>🐞 <strong>Debugging Errors</strong> — formatter + validator shows exactly where JSON breaks.</li>
                <li>⚙️ <strong>Config Files</strong> — cleaner structure means fewer mistakes in .json settings.</li>
                <li>📄 <strong>Log Analysis</strong> — formatting nested JSON blobs in logs helps spot issues quickly.</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>🧪 Common JSON Errors</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>❌ <strong>Trailing Comma</strong> — <code style={{ background: '#eee', padding: '1px 4px', borderRadius: 3 }}>{'{"name": "test",}'}</code></li>
                <li>❌ <strong>Missing Quotes on Keys</strong> — <code style={{ background: '#eee', padding: '1px 4px', borderRadius: 3 }}>{'{name: "test"}'}</code></li>
                <li>❌ <strong>Single Quotes</strong> — <code style={{ background: '#eee', padding: '1px 4px', borderRadius: 3 }}>{"{'name': 'test'}"}</code></li>
                <li>❌ <strong>Unclosed Brackets</strong> — <code style={{ background: '#eee', padding: '1px 4px', borderRadius: 3 }}>{'{"user": {"id": 1}'}</code></li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>🪜 Step-by-Step: Format JSON Easily</h3>
              <ol style={{ marginLeft: 16 }}>
                <li>📋 Paste your JSON</li>
                <li>⚙️ Click Format</li>
                <li>👀 Review structured output</li>
                <li>❗ Fix any errors shown</li>
                <li>📄 Copy clean JSON</li>
              </ol>

              <br />
              <h3 style={{ marginTop: 10 }}>🚀 Best Practices for Working With JSON</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>✅ <strong>Keep it valid</strong> — always use double quotes and match brackets correctly.</li>
                <li>✅ <strong>Format before debugging</strong> — don't debug raw JSON; always format first.</li>
                <li>✅ <strong>Use consistent indentation</strong> — 2 spaces is the most common standard.</li>
                <li>✅ <strong>Avoid over-nesting</strong> — deep nesting is hard to read and hard to maintain.</li>
                <li>✅ <strong>Validate early</strong> — catch errors before using JSON in code.</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>🧰 JSON Formatter vs JSON Validator</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #dddaff' }}>
                    <th style={{ textAlign: 'left', padding: 6 }}>Feature</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>Formatter</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>Validator</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #eeeeff' }}>Purpose</td><td style={{ padding: 6, borderBottom: '1px solid #eeeeff' }}>Improve readability</td><td style={{ padding: 6, borderBottom: '1px solid #eeeeff' }}>Check correctness</td></tr>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #eeeeff' }}>Fix errors</td><td style={{ padding: 6, borderBottom: '1px solid #eeeeff' }}>❌ No</td><td style={{ padding: 6, borderBottom: '1px solid #eeeeff' }}>✅ Yes</td></tr>
                  <tr><td style={{ padding: 6 }}>Output</td><td style={{ padding: 6 }}>Clean structure</td><td style={{ padding: 6 }}>Error messages</td></tr>
                </tbody>
              </table>
              <p style={{ marginTop: 6 }}>Best workflow: Format → Validate → Fix.</p>

              <br />
              <h3 style={{ marginTop: 10 }}>⚡ Pro Tips</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>🔍 Format before logging large JSON</li>
                <li>🧩 Break large JSON into smaller parts</li>
                <li>📋 Copy only what you need</li>
                <li>⚡ Use formatter + diff tool together</li>
              </ul>

              <br />
              <h3 style={{ marginTop: 10 }}>🔐 Is It Safe to Use Online JSON Formatters?</h3>
              <p>Most modern tools run directly in your browser and don't send data to servers. Still, avoid pasting API keys or sensitive production data.</p>

              <br />
              <h3 style={{ marginTop: 10 }}>❓ FAQ</h3>
              <p><strong>Does formatting change my JSON data?</strong> No — it only changes appearance, not content.</p>
              <p><strong>Can a formatter fix invalid JSON?</strong> No — but it helps you see where the issue is.</p>
              <p><strong>What's the best indentation style?</strong> 2 spaces is the most common standard.</p>
              <p><strong>Why does my JSON fail to format?</strong> Likely due to syntax errors, missing brackets, or incorrect quote style.</p>

              <br />
              <p style={{ marginTop: 12 }}><strong>🧾 Conclusion</strong><br/>Working with raw JSON doesn't have to be frustrating. With a JSON formatter, you can read data instantly, debug faster, and reduce errors — one of the simplest tools that can significantly improve your workflow.</p>

              <p style={{ marginTop: 12 }}>
                <a
                  className="btn btn-primary"
                  href="/json-formatter"
                  onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/json-formatter') }}
                >👉 Try it here: JSON Formatter Tool</a>
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
    </>
  )
}
