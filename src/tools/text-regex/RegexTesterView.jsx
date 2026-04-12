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
              Toggle <b>Regex</b> for full JavaScript regex syntax with capture groups, or leave it off for plain-text search.
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

        </div>
      </div>
    </section>
  )
}
