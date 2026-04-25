import { Link, useNavigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import './JsonFormatter.css'
import { useTranslation } from 'react-i18next'

const INDENT = 2

function formatJson(raw) {
  const parsed = JSON.parse(raw) // throws on invalid JSON
  return JSON.stringify(parsed, null, INDENT)
}

export default function JsonFormatterView() {
  const { t } = useTranslation('jsonFormatter')
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
      setError(t('errors.empty'))
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
      setError(t('errors.invalid', {message: e.message}))
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
          <div className="jf-tool-icon" aria-hidden="true">{t('hero.icon')}</div>
          <h1 className="jf-hero-title">{t('hero.title')}</h1>
          <p className="jf-hero-subtitle">
            {t('hero.tagline')} <Link to="/blogs/json-formatter-guide">{t('hero.blogLink')}</Link>
          </p>
          <div className="details-row" data-open={openPanel}>
            <div className="details-controls">
              <button
                className={`tab-btn ${openPanel === 'details' ? 'active' : ''}`}
                onClick={() => setOpenPanel(prev => (prev === 'details' ? '' : 'details'))}
                aria-expanded={openPanel === 'details'}
                type="button"
              >
                {t('tabs.details')}
              </button>
              <button
                className={`tab-btn ${openPanel === 'howitworks' ? 'active' : ''}`}
                onClick={() => setOpenPanel(prev => (prev === 'howitworks' ? '' : 'howitworks'))}
                aria-expanded={openPanel === 'howitworks'}
                type="button"
              >
                {t('tabs.howItWorks')}
              </button>
            </div>

            <div className={`shared-collapse${!openPanel ? ' panel-hidden' : ''}`}>
                <div className={openPanel !== 'details' ? 'details-content panel-hidden' : 'details-content'}>
                    <h3>{t('details.whatIs.heading')}</h3>
                    <ul>
                      <li>{t('details.whatIs.body')}</li>
                    </ul>

                    <h3>{t('details.whenToUse.heading')}</h3>
                    <ul>
                      <li>{t('details.whenToUse.body')}</li>
                    </ul>

                    <h3>{t('details.howFormatterWorks.heading')}</h3>
                    <ul>
                      <li>{t('details.howFormatterWorks.body')}</li>
                    </ul>

                    <h3>{t('details.prettyFormat.heading')}</h3>
                    <ul>
                      <li>{t('details.prettyFormat.body')}</li>
                    </ul>

                    <h3>{t('details.usefulWhen.heading')}</h3>
                    <ul>
                      <li>{t('details.usefulWhen.item1')}</li>
                      <li>{t('details.usefulWhen.item2')}</li>
                      <li>{t('details.usefulWhen.item3')}</li>
                    </ul>

                    <h3>{t('details.faq.heading')}</h3>
                    <ul>
                      <li><strong>{t('details.faq.q1')}</strong> {t('details.faq.a1')}</li>
                      <li><strong>{t('details.faq.q2')}</strong> {t('details.faq.a2')}</li>
                      <li><strong>{t('details.faq.q3')}</strong> {t('details.faq.a3')}</li>
                      <li><strong>{t('details.faq.q4')}</strong> {t('details.faq.a4')}</li>
                      <li><strong>{t('details.faq.q5')}</strong> {t('details.faq.a5')}</li>
                    </ul>
                  </div>

                <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
                    <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/images/screenshots/json-formatter/JSON_formatter001.png" alt="Step 1" className="how-img" />
                        <p>{t('howItWorks.step1')}</p>
                      </li>
                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/images/screenshots/json-formatter/JSON_formatter002.png" alt="Step 2" className="how-img" />
                        <p>{t('howItWorks.step2')}</p>
                      </li>
                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/images/screenshots/json-formatter/JSON_formatter003.png" alt="Step 3" className="how-img" />
                        <p>{t('howItWorks.step3')}</p>
                      </li>
                      <li>
                        <img src="/images/screenshots/json-formatter/JSON_formatter004.png" alt="Step 4" className="how-img" />
                        <p>{t('howItWorks.step4')}</p>
                      </li>
                    </ol>
                  </div>
            </div>
          </div>
        </div>

        {/* How to use */}
        <div className="jf-instructions-card">
          <h2 className="jf-instructions-heading">{t('howToUse.heading')}</h2>
          <ol className="jf-instructions-list">
            <li>{t('howToUse.step1')}</li>
            <li>{t('howToUse.step2')}</li>
            <li>{t('howToUse.step3')}</li>
          </ol>
        </div>

        {/* Main formatter */}
        <div className="jf-panels">

          {/* Input panel */}
          <div className="jf-panel">
            <div className="jf-panel-header">
              <span className="jf-panel-label">{t('input.label')}</span>
              <button
                className="jf-btn jf-btn-ghost"
                onClick={handleClear}
                disabled={!input && !output}
                title={t('input.clearTitle')}
              >
                {t('input.clearBtn')}
              </button>
            </div>
            <textarea
              className={`jf-json-textarea${error ? ' has-error' : ''}`}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError('') }}
              onKeyDown={handleKeyDown}
              placeholder={t('input.placeholder')}
              spellCheck={false}
              aria-label={t('input.ariaLabel')}
              aria-describedby={error ? 'json-error' : undefined}
            />
            {/* Notify section for JSON errors */}
            {error && (
              <div id="json-error" className="jf-error-msg" role="alert">
                <span className="jf-error-icon" aria-hidden="true">⚠</span>
                {error}
                {errorLine && (
                  <div className="jf-error-line">{t('input.errorLine', {line: errorLine})}</div>
                )}
              </div>
            )}
            <div className="jf-panel-actions">
              <button
                className="jf-btn jf-btn-primary"
                onClick={handleFormat}
                disabled={!input.trim()}
              >
                {t('formatBtn')}
              </button>
            </div>
          </div>

          {/* Output panel */}
          <div className="jf-panel">
            <div className="jf-panel-header">
              <span className="jf-panel-label">{t('output.label')}</span>
              <button
                className={`jf-btn jf-btn-ghost${copied ? ' copied' : ''}`}
                onClick={handleCopy}
                disabled={!output}
                title={t('output.copyTitle')}
              >
                {copied ? t('output.copiedBtn') : t('output.copyBtn')}
              </button>
            </div>
            <pre
              className={`jf-json-output${!output ? ' empty' : ''}`}
              aria-live="polite"
              aria-label={t('output.ariaLabel')}
            >
              {output || t('output.placeholder')}
            </pre>
          </div>

        </div>

        {/* JSON Formatter guide - purple/code-editor vibe */}
        <div className="jf-guide" style={{ marginTop: 28, padding: 18, borderTop: '1px solid #dddaff', color: '#111' }}>
          <div className="jf-guide-row" style={{ display: 'flex', gap: 12 }}>
            <div className="jf-guide-icon" style={{ flex: '0 0 60px', fontSize: 34, lineHeight: 1, fontFamily: 'monospace', fontWeight: 700, color: '#6c63ff' }}>{t('hero.icon')}</div>
            <div className="jf-guide-content" style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>{t('guide.title')}</h2>
              <p style={{ marginTop: 8 }}>{t('guide.intro')}</p>
              <p style={{ marginTop: 6, fontWeight: 700 }}>{t('guide.cta')}</p>

              <h3 style={{ marginTop: 12 }}>{t('guide.whatIs.heading')}</h3>
              <p>{t('guide.whatIs.body')}</p>

              <h3 style={{ marginTop: 10 }}>{t('guide.whatDoes.heading')}</h3>
              <p>{t('guide.whatDoes.body')}
              </p>
              <p style={{ marginTop: 8, fontWeight: 600 }}>{t('guide.whatDoes.beforeLabel')}</p>
              <pre style={{ background: '#1e1e2e', color: '#cdd6f4', borderRadius: 6, padding: '10px 14px', fontSize: 13, overflowX: 'auto' }}>{'{"name":"app","features":["json","image","pdf"],"active":true}'}</pre>
              <p style={{ marginTop: 8, fontWeight: 600 }}>{t('guide.whatDoes.afterLabel')}</p>
              <pre style={{ background: '#1e1e2e', color: '#cdd6f4', borderRadius: 6, padding: '10px 14px', fontSize: 13, overflowX: 'auto' }}>{`{\n  "name": "app",\n  "features": [\n    "json",\n    "image",\n    "pdf"\n  ],\n  "active": true\n}`}</pre>

              <h3 style={{ marginTop: 10 }}>{t('guide.whySlows.heading')}</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>{t('guide.whySlows.item1')}</li>
                <li>{t('guide.whySlows.item2')}</li>
                <li>{t('guide.whySlows.item3')}</li>
              </ul>

              <h3 style={{ marginTop: 10 }}>{t('guide.whenToUse.heading')}</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>{t('guide.whenToUse.item1')}</li>
                <li>{t('guide.whenToUse.item2')}</li>
                <li>{t('guide.whenToUse.item3')}</li>
                <li>{t('guide.whenToUse.item4')}</li>
              </ul>

              <h3 style={{ marginTop: 10 }}>{t('guide.commonErrors.heading')}</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>{t('guide.commonErrors.item1')} — <code style={{ background: '#eee', padding: '1px 4px', borderRadius: 3 }}>{'{"name": "test",}'}</code></li>
                <li>{t('guide.commonErrors.item2')} — <code style={{ background: '#eee', padding: '1px 4px', borderRadius: 3 }}>{'{name: "test"}'}</code></li>
                <li>{t('guide.commonErrors.item3')} — <code style={{ background: '#eee', padding: '1px 4px', borderRadius: 3 }}>{"{' name': ' test'}"}</code></li>
                <li>{t('guide.commonErrors.item4')} — <code style={{ background: '#eee', padding: '1px 4px', borderRadius: 3 }}>{'{"user": {"id": 1}'}</code></li>
              </ul>

              <h3 style={{ marginTop: 10 }}>{t('guide.stepByStep.heading')}</h3>
              <ol style={{ marginLeft: 16 }}>
                <li>{t('guide.stepByStep.step1')}</li>
                <li>{t('guide.stepByStep.step2')}</li>
                <li>{t('guide.stepByStep.step3')}</li>
                <li>{t('guide.stepByStep.step4')}</li>
                <li>{t('guide.stepByStep.step5')}</li>
              </ol>

              <h3 style={{ marginTop: 10 }}>{t('guide.bestPractices.heading')}</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>{t('guide.bestPractices.item1')}</li>
                <li>{t('guide.bestPractices.item2')}</li>
                <li>{t('guide.bestPractices.item3')}</li>
                <li>{t('guide.bestPractices.item4')}</li>
                <li>{t('guide.bestPractices.item5')}</li>
              </ul>

              <h3 style={{ marginTop: 10 }}>{t('guide.comparison.heading')}</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #dddaff' }}>
                    <th style={{ textAlign: 'left', padding: 6 }}>{t('guide.comparison.col1')}</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>{t('guide.comparison.col2')}</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>{t('guide.comparison.col3')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #eeeeff' }}>{t('guide.comparison.row1col1')}</td><td style={{ padding: 6, borderBottom: '1px solid #eeeeff' }}>{t('guide.comparison.row1col2')}</td><td style={{ padding: 6, borderBottom: '1px solid #eeeeff' }}>{t('guide.comparison.row1col3')}</td></tr>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #eeeeff' }}>{t('guide.comparison.row2col1')}</td><td style={{ padding: 6, borderBottom: '1px solid #eeeeff' }}>{t('guide.comparison.row2col2')}</td><td style={{ padding: 6, borderBottom: '1px solid #eeeeff' }}>{t('guide.comparison.row2col3')}</td></tr>
                  <tr><td style={{ padding: 6 }}>{t('guide.comparison.row3col1')}</td><td style={{ padding: 6 }}>{t('guide.comparison.row3col2')}</td><td style={{ padding: 6 }}>{t('guide.comparison.row3col3')}</td></tr>
                </tbody>
              </table>
              <p style={{ marginTop: 6 }}>{t('guide.comparison.workflow')}</p>

              <h3 style={{ marginTop: 10 }}>{t('guide.proTips.heading')}</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>{t('guide.proTips.item1')}</li>
                <li>{t('guide.proTips.item2')}</li>
                <li>{t('guide.proTips.item3')}</li>
                <li>{t('guide.proTips.item4')}</li>
              </ul>

              <h3 style={{ marginTop: 10 }}>{t('guide.safety.heading')}</h3>
              <p>{t('guide.safety.body')}</p>

              <h3 style={{ marginTop: 10 }}>{t('guide.faq.heading')}</h3>
              <p><strong>{t('guide.faq.q1')}</strong> {t('guide.faq.a1')}</p>
              <p><strong>{t('guide.faq.q2')}</strong> {t('guide.faq.a2')}</p>
              <p><strong>{t('guide.faq.q3')}</strong> {t('guide.faq.a3')}</p>
              <p><strong>{t('guide.faq.q4')}</strong> {t('guide.faq.a4')}</p>

              <br />
              <p style={{ marginTop: 12 }}><strong>{t('guide.conclusion')}</strong></p>

              <p style={{ marginTop: 12 }}>
                <a
                  className="btn btn-primary"
                  href="/json-formatter"
                  onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/json-formatter') }}
                >{t('guide.ctaBtn')}</a>
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
