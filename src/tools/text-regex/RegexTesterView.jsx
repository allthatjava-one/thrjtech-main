import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo, useCallback } from 'react'
import './RegexTester.css'

function escapeRegexLiteral(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

function buildRegex(pattern, isRegex, flagsToggle) {
  const flags = 'g' + (flagsToggle.i ? 'i' : '') + (flagsToggle.m ? 'm' : '')
  try {
    const source = isRegex ? pattern : escapeRegexLiteral(pattern)
    return { regex: new RegExp(source, flags), error: null }
  } catch (e) {
    return { regex: null, error: e.message || 'Invalid pattern' }
  }
}

function highlightHtml(text, regex) {
  if (!regex) return escapeHtml(text)
  let result = ''
  let lastIndex = 0
  let m
  while ((m = regex.exec(text)) !== null) {
    result += escapeHtml(text.slice(lastIndex, m.index))
    result += `<mark class="rt-match">${escapeHtml(m[0])}</mark>`
    lastIndex = m.index + (m[0].length || 0)
    if (regex.lastIndex === m.index) regex.lastIndex++
  }
  result += escapeHtml(text.slice(lastIndex))
  return result
}

export default function RegexTesterView() {
  const navigate = useNavigate()
  const [inputText, setInputText]     = useState('')
  const [searchPattern, setSearchPattern] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [isRegex, setIsRegex]         = useState(true)
  const [flagsToggle, setFlagsToggle] = useState({ i: false, m: false })
  const [regexError, setRegexError]   = useState(null)
  const [outputText, setOutputText]   = useState('')
  const [matchCount, setMatchCount]   = useState(0)
  const [copied, setCopied]           = useState(false)
  const [openPanel, setOpenPanel]     = useState('')
  const [showReplace, setShowReplace] = useState(false)

  const { regex, error } = useMemo(
    () => buildRegex(searchPattern, isRegex, flagsToggle),
    [searchPattern, isRegex, flagsToggle]
  )

  useEffect(() => {
    setRegexError(error)
    if (!regex || !searchPattern) { setMatchCount(0); return }
    try {
      const r = new RegExp(regex.source, regex.flags)
      setMatchCount([...inputText.matchAll(r)].length)
    } catch { setMatchCount(0) }
  }, [inputText, regex, searchPattern, error])

  const highlightedHtml = useMemo(() => {
    if (!searchPattern || regexError || !regex) return escapeHtml(inputText)
    return highlightHtml(inputText, new RegExp(regex.source, regex.flags))
  }, [inputText, regex, searchPattern, regexError])

  const handleReplaceAll = useCallback(() => {
    if (!regex) return
    try {
      setOutputText(inputText.replace(new RegExp(regex.source, regex.flags), replaceText))
    } catch (e) {
      setRegexError(e.message || 'Replace failed')
    }
  }, [inputText, regex, replaceText])

  const handleCopy = async () => {
    if (!outputText) return
    try {
      await navigator.clipboard.writeText(outputText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = outputText
      ta.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(ta)
      ta.focus(); ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const clearAll = () => {
    setInputText(''); setSearchPattern(''); setReplaceText('')
    setOutputText(''); setRegexError(null); setMatchCount(0); setCopied(false)
  }

  return (
    <section className="rt-section">
      <div className="rt-container">
        <div className="card">

          {/* ── Hero ── */}
          <div className="rt-hero">
            <div className="rt-tool-icon" aria-hidden="true">.*</div>
            <h1 className="rt-hero-title">Regex Tester</h1>
            <p className="rt-hero-subtitle">
              Paste text below, enter a search pattern, and see live match highlights instantly — no sign-up required.
              Toggle <b>Regex</b> for full JavaScript regex syntax with capture groups, 
              or leave it off for plain-text search. <Link to="/blogs/regex-tester-guide">Learn how to use the Regex Tester →</Link>
            </p>

            {/* Collapsible Details / How it works — mirrors JsonFormatterView exactly */}
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
                  <h3>What is Regex</h3>
                  <ul>
                    <li>Regular expressions (regex) are sequences of characters that define a search pattern. They are powerful for matching, searching, and manipulating text using a concise syntax.</li>
                  </ul>
                  <h3>When to use Regex</h3>
                  <ul>
                    <li>Use regex when you need to find complex patterns in text, validate input formats (email, phone numbers), or perform advanced find/replace operations that plain-text search cannot handle.</li>
                  </ul>
                  <h3>Regex Flags</h3>
                  <ul>
                    <li><strong>g</strong> (global) — always on; finds all matches instead of stopping at the first.</li>
                    <li><strong>i</strong> (case-insensitive) — <code>hello</code> matches <code>Hello</code>, <code>HELLO</code>, etc.</li>
                    <li><strong>m</strong> (multiline) — <code>^</code> and <code>$</code> match the start/end of each line instead of the whole string.</li>
                  </ul>
                  <h3>Capture Groups &amp; Replacements</h3>
                  <ul>
                    <li>Wrap parts of your pattern in <code>()</code> to capture them. Reference captures in the replacement field with <code>$1</code>, <code>$2</code>, etc. For example, pattern <code>(\w+), (\w+)</code> with replacement <code>$2 $1</code> swaps two comma-separated words.</li>
                  </ul>
                  <h3>Useful when</h3>
                  <ul>
                    <li>Need to find and replace patterns across large blocks of text.</li>
                    <li>Want to extract or reformat structured data (dates, IDs, etc.).</li>
                    <li>Validating or sanitizing user input patterns.</li>
                  </ul>
                  <h3>FAQs</h3>
                  <ul>
                    <li><strong>Q:</strong> What if my regex is invalid? <strong>A:</strong> An error message appears below the controls and Replace All is disabled until the pattern is fixed.</li>
                    <li><strong>Q:</strong> Does regex mode affect plain-text search? <strong>A:</strong> No — with Regex toggled off, the search string is treated as a literal and all special regex characters are automatically escaped.</li>
                    <li><strong>Q:</strong> Does my text leave my browser? <strong>A:</strong> No. All processing runs locally in your browser; nothing is sent to a server.</li>
                  </ul>
                </div>

                <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
                  <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                    <li style={{ marginBottom: '0.75rem' }}>
                      <img src="/screenshots/regex-tester/regex-tester-001.png" alt="Step 1" className="how-img" />
                      <p>Paste or type the text you want to search in the <strong>Input Text</strong> panel on the left.</p>
                    </li>
                    <li style={{ marginBottom: '0.75rem' }}>
                      <img src="/screenshots/regex-tester/regex-tester-002.png" alt="Step 2" className="how-img" />
                      <p>Type a search pattern in the <strong>Search</strong> field. Toggle <strong>Regex</strong> to use JavaScript regex syntax, or leave it off for a plain-text search.</p>
                    </li>
                    <li style={{ marginBottom: '0.75rem' }}>
                      <img src="/screenshots/regex-tester/regex-tester-003.png" alt="Step 3" className="how-img" />
                      <p>Matches are highlighted live in the <strong>Match Preview</strong> panel on the right. The match count updates automatically.</p>
                    </li>
                    <li>
                      <img src="/screenshots/regex-tester/regex-tester-004.png" alt="Step 4" className="how-img" />
                      <p>Enter a replacement in the <strong>Replace</strong> field and click <strong>Replace All</strong> to see the result. Copy it from the output section that appears below.</p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* ── How to use ── */}
          <div className="rt-instructions-card">
            <h2 className="rt-instructions-heading">How to use</h2>
            <ol className="rt-instructions-list">
              <li>Paste or type your text into the <strong>Input Text</strong> panel.</li>
              <li>Enter a search pattern. Toggle <strong>Regex</strong> for full regex syntax.</li>
              <li>Optionally check <strong>i</strong> (case-insensitive) or <strong>m</strong> (multiline) flags.</li>
              <li>Enter replacement text, then click <strong>Replace All</strong> to apply and copy the result.</li>
            </ol>
          </div>

          {/* ── Controls ── */}
          <div className="rt-controls-bar">
            <div className="rt-search-row">
              <input
                className="rt-search-input"
                placeholder="Search pattern…"
                value={searchPattern}
                onChange={(e) => { setSearchPattern(e.target.value); setOutputText('') }}
                spellCheck={false}
                aria-label="Search pattern"
              />
              <div className="rt-search-controls">
                <label
                  className={`rt-regex-toggle-label${isRegex ? ' active' : ''}`}
                  title="Toggle regular expression mode"
                >
                  <input
                    type="checkbox"
                    checked={isRegex}
                    onChange={(e) => setIsRegex(e.target.checked)}
                  />
                  Regex
                </label>
                {isRegex && (
                  <div className="rt-flags">
                    <label title="Case-insensitive">
                      <input type="checkbox" checked={flagsToggle.i} onChange={(e) => setFlagsToggle(f => ({ ...f, i: e.target.checked }))} />
                      {' '}i
                    </label>
                    <label title="Multiline">
                      <input type="checkbox" checked={flagsToggle.m} onChange={(e) => setFlagsToggle(f => ({ ...f, m: e.target.checked }))} />
                      {' '}m
                    </label>
                  </div>
                )}
                <button className="rt-btn rt-btn-ghost" onClick={clearAll} disabled={!inputText && !searchPattern}>
                  Clear
                </button>
              </div>
            </div>
            <div className="rt-below-search-row">
              {searchPattern && !regexError && (
                <span className="rt-match-badge">
                  {matchCount > 0 ? `${matchCount} match${matchCount !== 1 ? 'es' : ''}` : 'No matches'}
                </span>
              )}
              <button
                className="rt-replace-toggle"
                type="button"
                onClick={() => setShowReplace(v => !v)}
              >
                {showReplace ? '▾ Replace with…' : '▸ Replace with…'}
              </button>
            </div>
            {showReplace && (
              <div className="rt-replace-row">
                <input
                  className="rt-replace-input"
                  placeholder="Replacement (supports $1, $2…)"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  spellCheck={false}
                  aria-label="Replacement text"
                  autoFocus
                />
                <button
                  className="rt-btn rt-btn-primary"
                  onClick={handleReplaceAll}
                  disabled={!searchPattern || !!regexError || matchCount === 0}
                >
                  Replace All
                </button>
              </div>
            )}
            {regexError && (
              <div className="rt-error-msg" role="alert">
                <span className="rt-error-icon" aria-hidden="true">⚠</span>
                Pattern error: {regexError}
              </div>
            )}
          </div>

          {/* ── Panels ── */}
          <div className="rt-panels">

            {/* Input panel */}
            <div className="rt-panel">
              <div className="rt-panel-header">
                <span className="rt-panel-label">Input Text</span>
              </div>
              <textarea
                className="rt-textarea"
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); setOutputText('') }}
                placeholder={'Paste or type text here…\n\nExample:\nHello World 123\nfoo@bar.com'}
                spellCheck={false}
                aria-label="Input text"
              />
            </div>

            {/* Preview panel */}
            <div className="rt-panel">
              <div className="rt-panel-header">
                <span className="rt-panel-label">Match Preview</span>
              </div>
              <pre
                className={`rt-preview-output${!inputText ? ' empty' : ''}`}
                aria-live="polite"
                aria-label="Match preview"
                dangerouslySetInnerHTML={{ __html: highlightedHtml || '&nbsp;' }}
              />
            </div>

          </div>

          {/* ── Replaced output ── */}
          {outputText && (
            <div className="rt-panel rt-output-panel">
              <div className="rt-panel-header">
                <span className="rt-panel-label">Replaced Output</span>
                <button
                  className={`rt-btn rt-btn-ghost${copied ? ' copied' : ''}`}
                  onClick={handleCopy}
                  title="Copy to clipboard"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="rt-preview-output">{outputText}</pre>
            </div>
          )}

          {/* Regex guide - orange/terminal design */}
          <div style={{ marginTop: 28, borderTop: '2px solid #ff6b2b22', paddingTop: 24, color: '#111' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: '0 0 56px', fontSize: 30, lineHeight: 1, fontFamily: 'monospace', fontWeight: 900, color: '#ff6b2b', letterSpacing: -1 }}>.*</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: 22 }}>How to Test and Debug Regex Quickly (Without Losing Your Mind)</h2>
                <p style={{ marginTop: 8 }}>Regular expressions are powerful… but notoriously frustrating. You write a pattern expecting it to match perfectly — and instead it matches too much, nothing, or partially works.</p>
                <p style={{ marginTop: 6, fontWeight: 700 }}>👉 The key to mastering regex isn't memorization — it's testing and iteration.</p>
                <p style={{ marginTop: 8 }}>In this guide, you'll learn how to:</p>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>🧪 Test regex patterns effectively</li>
                  <li>🐞 Debug common issues</li>
                  <li>👁 Understand what your pattern is actually doing</li>
                  <li>🚀 Build regex with confidence</li>
                </ul>

                <h3 style={{ marginTop: 14 }}>🔍 What Is a Regex Tester?</h3>
                <p>A regex tester is an interactive tool that lets you write a pattern, provide sample text, and instantly see matches — turning regex from guessing into visual feedback.</p>

                <h3 style={{ marginTop: 12 }}>🧠 Why Regex Feels Difficult</h3>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>😵 <strong>Compact</strong> — a small pattern can represent a lot of logic and be hard to read.</li>
                  <li>🔄 <strong>Sensitive</strong> — one character change can break everything or completely change behavior.</li>
                  <li>🧩 <strong>Abstract</strong> — patterns don't always "look like" what they match.</li>
                </ul>

                <h3 style={{ marginTop: 12 }}>⚡ Why You Should Always Use a Regex Tester</h3>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>👀 <strong>Instant Feedback</strong> — see matches as you type; no guessing, no running code repeatedly.</li>
                  <li>🐞 <strong>Faster Debugging</strong> — quickly identify wrong groups, missing escapes, incorrect boundaries.</li>
                  <li>🎯 <strong>Better Accuracy</strong> — test against real input data and edge cases.</li>
                  <li>🚀 <strong>Faster Learning</strong> — experimentation helps you understand patterns and remember syntax naturally.</li>
                </ul>

                <h3 style={{ marginTop: 12 }}>🧪 Example: Regex in Action</h3>
                <p>Goal: Match email addresses</p>
                <pre style={{ background: '#1a1a2e', color: '#e94560', borderRadius: 6, padding: '10px 14px', fontSize: 13, overflowX: 'auto', marginTop: 6 }}>{'^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'}</pre>
                <p style={{ marginTop: 8 }}>Test input: <code style={{ background: '#f3f3f3', padding: '1px 5px', borderRadius: 3 }}>test@example.com</code>, <code style={{ background: '#f3f3f3', padding: '1px 5px', borderRadius: 3 }}>invalid-email</code>, <code style={{ background: '#f3f3f3', padding: '1px 5px', borderRadius: 3 }}>hello@site</code></p>
                <p style={{ marginTop: 6 }}>A regex tester highlights ✅ valid matches and ❌ invalid ones — making debugging much easier.</p>

                <h3 style={{ marginTop: 12 }}>🛠 Common Regex Mistakes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>

                  <div style={{ background: '#1a1a2e', borderRadius: 6, padding: '10px 14px', fontSize: 13 }}>
                    <div style={{ color: '#ff6b6b', marginBottom: 4 }}>❌ Forgetting to escape characters</div>
                    <div style={{ color: '#888', marginBottom: 2 }}>// Wrong — matches ANY character</div>
                    <div style={{ color: '#e94560' }}>{'.'}</div>
                    <div style={{ color: '#888', marginTop: 6, marginBottom: 2 }}>// Correct — matches literal dot</div>
                    <div style={{ color: '#a8ff78' }}>{'\\.'}</div>
                  </div>

                  <div style={{ background: '#1a1a2e', borderRadius: 6, padding: '10px 14px', fontSize: 13 }}>
                    <div style={{ color: '#ff6b6b', marginBottom: 4 }}>❌ Greedy matching</div>
                    <div style={{ color: '#888', marginBottom: 2 }}>// Wrong — matches too much</div>
                    <div style={{ color: '#e94560' }}>{'.*'}</div>
                    <div style={{ color: '#888', marginTop: 6, marginBottom: 2 }}>// Correct — non-greedy</div>
                    <div style={{ color: '#a8ff78' }}>{'.*?'}</div>
                  </div>

                  <div style={{ background: '#1a1a2e', borderRadius: 6, padding: '10px 14px', fontSize: 13 }}>
                    <div style={{ color: '#ff6b6b', marginBottom: 4 }}>❌ Missing anchors</div>
                    <div style={{ color: '#888', marginBottom: 2 }}>// Matches anywhere in string</div>
                    <div style={{ color: '#e94560' }}>{'hello'}</div>
                    <div style={{ color: '#888', marginTop: 6, marginBottom: 2 }}>// Correct — anchored to full string</div>
                    <div style={{ color: '#a8ff78' }}>{'\\^hello\\$'}</div>
                  </div>

                  <div style={{ background: '#1a1a2e', borderRadius: 6, padding: '10px 14px', fontSize: 13 }}>
                    <div style={{ color: '#ff6b6b', marginBottom: 4 }}>❌ Incorrect character classes</div>
                    <div style={{ color: '#888', marginBottom: 2 }}>// Wrong — lowercase only</div>
                    <div style={{ color: '#e94560' }}>{'[a-z]'}</div>
                    <div style={{ color: '#888', marginTop: 6, marginBottom: 2 }}>// Correct — letters and digits</div>
                    <div style={{ color: '#a8ff78' }}>{'[a-zA-Z0-9]'}</div>
                  </div>

                </div>

                <h3 style={{ marginTop: 12 }}>🪜 Step-by-Step: How to Test Regex</h3>
                <ol style={{ marginLeft: 16 }}>
                  <li>✍️ Enter your regex pattern</li>
                  <li>📄 Paste sample text</li>
                  <li>👀 Observe matches</li>
                  <li>🔧 Adjust pattern</li>
                  <li>🔁 Repeat until correct</li>
                </ol>

                <h3 style={{ marginTop: 12 }}>🧠 Best Practices for Writing Regex</h3>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>✅ <strong>Start simple</strong> — build patterns step by step, add complexity gradually.</li>
                  <li>✅ <strong>Test real data</strong> — use actual user input and real-world examples.</li>
                  <li>✅ <strong>Use comments when possible</strong> — break complex regex into understandable parts.</li>
                  <li>✅ <strong>Avoid over-optimization</strong> — readable regex beats "clever" regex.</li>
                  <li>✅ <strong>Validate edge cases</strong> — test empty input and unexpected formats.</li>
                </ul>

                <h3 style={{ marginTop: 12 }}>🧑‍💻 Real-World Use Cases</h3>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>📧 <strong>Email Validation</strong> — check input format before submission</li>
                  <li>🔐 <strong>Password Rules</strong> — enforce complexity requirements</li>
                  <li>📄 <strong>Data Extraction</strong> — extract IDs, URLs, numbers from text</li>
                  <li>📊 <strong>Log Parsing</strong> — analyze and filter system logs</li>
                </ul>

                <h3 style={{ marginTop: 12 }}>⚠️ Common Pitfalls</h3>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>❌ Writing entire regex at once</li>
                  <li>❌ Not testing edge cases</li>
                  <li>❌ Copy-pasting regex without understanding it</li>
                  <li>❌ Ignoring readability</li>
                </ul>

                <h3 style={{ marginTop: 12 }}>🔍 Regex Tester vs Code Execution</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ff6b2b33' }}>
                      <th style={{ textAlign: 'left', padding: 6 }}>Feature</th>
                      <th style={{ textAlign: 'left', padding: 6 }}>Regex Tester</th>
                      <th style={{ textAlign: 'left', padding: 6 }}>Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={{ padding: 6, borderBottom: '1px solid #fff0eb' }}>Speed</td><td style={{ padding: 6, borderBottom: '1px solid #fff0eb' }}>Instant</td><td style={{ padding: 6, borderBottom: '1px solid #fff0eb' }}>Slower</td></tr>
                    <tr><td style={{ padding: 6, borderBottom: '1px solid #fff0eb' }}>Debugging</td><td style={{ padding: 6, borderBottom: '1px solid #fff0eb' }}>Visual</td><td style={{ padding: 6, borderBottom: '1px solid #fff0eb' }}>Manual</td></tr>
                    <tr><td style={{ padding: 6 }}>Learning</td><td style={{ padding: 6 }}>Easy</td><td style={{ padding: 6 }}>Harder</td></tr>
                  </tbody>
                </table>

                <h3 style={{ marginTop: 12 }}>🚀 Pro Tips</h3>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>🔍 Test small parts of regex first</li>
                  <li>🧩 Break complex patterns into chunks</li>
                  <li>⚡ Use non-greedy matching when needed</li>
                  <li>📋 Keep sample inputs saved for reuse</li>
                </ul>

                <h3 style={{ marginTop: 12 }}>🔐 Is It Safe to Use a Regex Tester?</h3>
                <p>Most modern tools:</p>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>✅ Run directly in your browser</li>
                  <li>✅ Don't store input</li>
                </ul>
                <p style={{ marginTop: 6 }}>👉 Still avoid pasting sensitive data or production secrets.</p>

                <h3 style={{ marginTop: 12 }}>❓ FAQ</h3>
                <p><strong>Why is my regex not matching anything?</strong> Possible reasons: missing anchors, incorrect syntax, or wrong test input.</p>
                <p><strong>Why does my regex match too much?</strong> Likely due to greedy patterns like <code style={{ background: '#f3f3f3', padding: '1px 4px', borderRadius: 3 }}>.*</code>. Try <code style={{ background: '#f3f3f3', padding: '1px 4px', borderRadius: 3 }}>.*?</code> instead.</p>
                <p><strong>Can I learn regex without memorizing everything?</strong> Yes — practice with testing tools is the fastest way.</p>
                <p><strong>What's the best way to improve regex skills?</strong> Build + test + iterate repeatedly.</p>

                <p style={{ marginTop: 14 }}><strong>🧾 Conclusion</strong><br/>Regex doesn't have to be frustrating. With the right approach and a good tester, you can build patterns faster, debug with confidence, and truly understand what your regex is doing.</p>

                <p style={{ marginTop: 12 }}>
                  <a
                    className="btn btn-primary"
                    href="/regex-tester"
                    onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/regex-tester') }}
                  >👉 Try your regex here: Regex Tester Tool</a>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
