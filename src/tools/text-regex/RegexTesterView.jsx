import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo, useCallback } from 'react'
import './RegexTester.css'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

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
  const { t } = useTranslation('regexTester')
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

  const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9']
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqKeys.map((key) => ({
      '@type': 'Question',
      name: t(`guide.faq.${key}`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`guide.faq.a${key.slice(1)}`),
      },
    })),
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      {/* ── Hero ── */}
      <div className="rt-hero">
        <div className="rt-tool-icon" aria-hidden="true">{t('hero.icon')}</div>
        <h1 className="rt-hero-title">{t('hero.title')}</h1>
        <p className="rt-hero-subtitle">
          {t('hero.tagline')} <Link to="/blogs/regex-tester-guide">{t('hero.blogLink')}</Link>
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
                  <h3>{t('details.flags.heading')}</h3>
                  <ul>
                    <li>{t('details.flags.g')}</li>
                    <li>{t('details.flags.i')}</li>
                    <li>{t('details.flags.m')}</li>
                  </ul>
                  <h3>{t('details.captureGroups.heading')}</h3>
                  <ul>
                    <li>{t('details.captureGroups.body')}</li>
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
                  </ul>
                </div>

                <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
                  <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                    <li style={{ marginBottom: '0.75rem' }}>
                      <img src="/screenshots/regex-tester/regex-tester-001.png" alt="Step 1" className="how-img" />
                        <p>{t('howItWorks.step1')}</p>
                    </li>
                    <li style={{ marginBottom: '0.75rem' }}>
                      <img src="/screenshots/regex-tester/regex-tester-002.png" alt="Step 2" className="how-img" />
                        <p>{t('howItWorks.step2')}</p>
                    </li>
                    <li style={{ marginBottom: '0.75rem' }}>
                      <img src="/screenshots/regex-tester/regex-tester-003.png" alt="Step 3" className="how-img" />
                        <p>{t('howItWorks.step3')}</p>
                    </li>
                    <li>
                      <img src="/screenshots/regex-tester/regex-tester-004.png" alt="Step 4" className="how-img" />
                        <p>{t('howItWorks.step4')}</p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* ── How to use ── */}
          <div className="rt-instructions-card">
            <h2 className="rt-instructions-heading">{t('howToUse.heading')}</h2>
            <ol className="rt-instructions-list">
              <li>{t('howToUse.step1')}</li>
              <li>{t('howToUse.step2')}</li>
              <li>{t('howToUse.step3')}</li>
              <li>{t('howToUse.step4')}</li>
            </ol>
          </div>

          {/* ── Controls ── */}
          <div className="rt-controls-bar">
            <div className="rt-search-row">
              <input
                className="rt-search-input"
                placeholder={t('controls.searchPlaceholder')}
                value={searchPattern}
                onChange={(e) => { setSearchPattern(e.target.value); setOutputText('') }}
                spellCheck={false}
                aria-label={t('controls.searchAriaLabel')}
              />
              <div className="rt-search-controls">
                <label
                  className={`rt-regex-toggle-label${isRegex ? ' active' : ''}`}
                  title={t('controls.regexTitle')}
                >
                  <input
                    type="checkbox"
                    checked={isRegex}
                    onChange={(e) => setIsRegex(e.target.checked)}
                  />
                  {t('controls.regexLabel')}
                </label>
                {isRegex && (
                  <div className="rt-flags">
                    <label title={t('controls.flagITitle')}>
                      <input type="checkbox" checked={flagsToggle.i} onChange={(e) => setFlagsToggle(f => ({ ...f, i: e.target.checked }))} />
                      {' '}{t('controls.flagI')}
                    </label>
                    <label title={t('controls.flagMTitle')}>
                      <input type="checkbox" checked={flagsToggle.m} onChange={(e) => setFlagsToggle(f => ({ ...f, m: e.target.checked }))} />
                      {' '}{t('controls.flagM')}
                    </label>
                  </div>
                )}
                <button className="rt-btn rt-btn-ghost" onClick={clearAll} disabled={!inputText && !searchPattern}>
                  {t('controls.clearBtn')}
                </button>
              </div>
            </div>
            <div className="rt-below-search-row">
              {searchPattern && !regexError && (
                <span className="rt-match-badge">
                  {matchCount > 0 ? t('controls.matchCount', {count: matchCount}) : t('controls.noMatches')}
                </span>
              )}
              <button
                className="rt-replace-toggle"
                type="button"
                onClick={() => setShowReplace(v => !v)}
              >
                {showReplace ? t('controls.replaceToggleOpen') : t('controls.replaceToggleClose')}
              </button>
            </div>
            {showReplace && (
              <div className="rt-replace-row">
                <input
                  className="rt-replace-input"
                  placeholder={t('controls.replacePlaceholder')}
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  spellCheck={false}
                  aria-label={t('controls.replaceAriaLabel')}
                  autoFocus
                />
                <button
                  className="rt-btn rt-btn-primary"
                  onClick={handleReplaceAll}
                  disabled={!searchPattern || !!regexError || matchCount === 0}
                >
                  {t('controls.replaceAllBtn')}
                </button>
              </div>
            )}
            {regexError && (
              <div className="rt-error-msg" role="alert">
                <span className="rt-error-icon" aria-hidden="true">⚠</span>
                {t('controls.patternError', {message: regexError})}
              </div>
            )}
          </div>

          {/* ── Panels ── */}
          <div className="rt-panels">

            {/* Input panel */}
            <div className="rt-panel">
              <div className="rt-panel-header">
                <span className="rt-panel-label">{t('input.label')}</span>
              </div>
              <textarea
                className="rt-textarea"
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); setOutputText('') }}
                placeholder={t('input.placeholder')}
                spellCheck={false}
                aria-label={t('input.ariaLabel')}
              />
            </div>

            {/* Preview panel */}
            <div className="rt-panel">
              <div className="rt-panel-header">
                <span className="rt-panel-label">{t('preview.label')}</span>
              </div>
              <pre
                className={`rt-preview-output${!inputText ? ' empty' : ''}`}
                aria-live="polite"
                aria-label={t('preview.label')}
                dangerouslySetInnerHTML={{ __html: highlightedHtml || '&nbsp;' }}
              />
            </div>

          </div>

          {/* ── Replaced output ── */}
          {outputText && (
            <div className="rt-panel rt-output-panel">
              <div className="rt-panel-header">
                <span className="rt-panel-label">{t('output.label')}</span>
                <button
                  className={`rt-btn rt-btn-ghost${copied ? ' copied' : ''}`}
                  onClick={handleCopy}
                  title="Copy to clipboard"
                >
                  {copied ? t('output.copiedBtn') : t('output.copyBtn')}
                </button>
              </div>
              <pre className="rt-preview-output">{outputText}</pre>
            </div>
          )}

          {/* Regex guide - orange/terminal design */}
          <div className="rt-guide">
            <div className="rt-guide-row">
              <div className="rt-guide-icon">{t('hero.icon')}</div>
              <div className="rt-guide-content">
                <h2 style={{ margin: 0, fontSize: 22 }}>{t('guide.title')}</h2>
                <p style={{ marginTop: 8 }}>{t('guide.intro')}</p>
                <p style={{ marginTop: 6, fontWeight: 700 }}>{t('guide.cta')}</p>
                <p style={{ marginTop: 8 }}>In this guide, you'll learn how to:</p>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>{t('guide.learnItems.item1')}</li>
                  <li>{t('guide.learnItems.item2')}</li>
                  <li>{t('guide.learnItems.item3')}</li>
                  <li>{t('guide.learnItems.item4')}</li>
                </ul>

                <h3 style={{ marginTop: 14 }}>{t('guide.whatIs.heading')}</h3>
                <p>{t('guide.whatIs.body')}</p>

                <h3 style={{ marginTop: 12 }}>{t('guide.whyDifficult.heading')}</h3>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>{t('guide.whyDifficult.item1')}</li>
                  <li>{t('guide.whyDifficult.item2')}</li>
                  <li>{t('guide.whyDifficult.item3')}</li>
                </ul>

                <h3 style={{ marginTop: 12 }}>{t('guide.whyUse.heading')}</h3>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>{t('guide.whyUse.item1')}</li>
                  <li>{t('guide.whyUse.item2')}</li>
                  <li>{t('guide.whyUse.item3')}</li>
                  <li>{t('guide.whyUse.item4')}</li>
                </ul>

                <h3 style={{ marginTop: 12 }}>{t('guide.example.heading')}</h3>
                <p>{t('guide.example.goal')}</p>
                <pre style={{ background: '#1a1a2e', color: '#e94560', borderRadius: 6, padding: '10px 14px', fontSize: 13, overflowX: 'auto', marginTop: 6 }}>{'^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'}</pre>
                <p style={{ marginTop: 8 }}>{t('guide.example.testInput')} <code style={{ background: '#f3f3f3', padding: '1px 5px', borderRadius: 3 }}>test@example.com</code>, <code style={{ background: '#f3f3f3', padding: '1px 5px', borderRadius: 3 }}>invalid-email</code>, <code style={{ background: '#f3f3f3', padding: '1px 5px', borderRadius: 3 }}>hello@site</code></p>
                <p style={{ marginTop: 6 }}>{t('guide.example.result')}</p>

                <h3 style={{ marginTop: 12 }}>{t('guide.mistakes.heading')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>

                  <div style={{ background: '#1a1a2e', borderRadius: 6, padding: '10px 14px', fontSize: 13 }}>
                    <div style={{ color: '#ff6b6b', marginBottom: 4 }}>{t('guide.mistakes.item1')}</div>
                    <div style={{ color: '#888', marginBottom: 2 }}>{t('guide.mistakes.item1Wrong')}</div>
                    <div style={{ color: '#e94560' }}>{'.'}</div>
                    <div style={{ color: '#888', marginTop: 6, marginBottom: 2 }}>{t('guide.mistakes.item1Right')}</div>
                    <div style={{ color: '#a8ff78' }}>{'\\.'}</div>
                  </div>

                  <div style={{ background: '#1a1a2e', borderRadius: 6, padding: '10px 14px', fontSize: 13 }}>
                    <div style={{ color: '#ff6b6b', marginBottom: 4 }}>{t('guide.mistakes.item2')}</div>
                    <div style={{ color: '#888', marginBottom: 2 }}>{t('guide.mistakes.item2Wrong')}</div>
                    <div style={{ color: '#e94560' }}>{'.*'}</div>
                    <div style={{ color: '#888', marginTop: 6, marginBottom: 2 }}>{t('guide.mistakes.item2Right')}</div>
                    <div style={{ color: '#a8ff78' }}>{'.*?'}</div>
                  </div>

                  <div style={{ background: '#1a1a2e', borderRadius: 6, padding: '10px 14px', fontSize: 13 }}>
                    <div style={{ color: '#ff6b6b', marginBottom: 4 }}>{t('guide.mistakes.item3')}</div>
                    <div style={{ color: '#888', marginBottom: 2 }}>{t('guide.mistakes.item3Wrong')}</div>
                    <div style={{ color: '#e94560' }}>{'hello'}</div>
                    <div style={{ color: '#888', marginTop: 6, marginBottom: 2 }}>{t('guide.mistakes.item3Right')}</div>
                    <div style={{ color: '#a8ff78' }}>{'\\^hello\\$'}</div>
                  </div>

                  <div style={{ background: '#1a1a2e', borderRadius: 6, padding: '10px 14px', fontSize: 13 }}>
                    <div style={{ color: '#ff6b6b', marginBottom: 4 }}>{t('guide.mistakes.item4')}</div>
                    <div style={{ color: '#888', marginBottom: 2 }}>{t('guide.mistakes.item4Wrong')}</div>
                    <div style={{ color: '#e94560' }}>{'[a-z]'}</div>
                    <div style={{ color: '#888', marginTop: 6, marginBottom: 2 }}>{t('guide.mistakes.item4Right')}</div>
                    <div style={{ color: '#a8ff78' }}>{'[a-zA-Z0-9]'}</div>
                  </div>

                </div>

                <h3 style={{ marginTop: 12 }}>{t('guide.stepByStep.heading')}</h3>
                <ol style={{ marginLeft: 16 }}>
                  <li>{t('guide.stepByStep.step1')}</li>
                  <li>{t('guide.stepByStep.step2')}</li>
                  <li>{t('guide.stepByStep.step3')}</li>
                  <li>{t('guide.stepByStep.step4')}</li>
                  <li>{t('guide.stepByStep.step5')}</li>
                </ol>

                <h3 style={{ marginTop: 12 }}>{t('guide.bestPractices.heading')}</h3>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>{t('guide.bestPractices.item1')}</li>
                  <li>{t('guide.bestPractices.item2')}</li>
                  <li>{t('guide.bestPractices.item3')}</li>
                  <li>{t('guide.bestPractices.item4')}</li>
                  <li>{t('guide.bestPractices.item5')}</li>
                </ul>

                {t('guide.architecture.heading') && (
                  <div className="rt-arch-section" style={{ marginTop: 24, marginBottom: 20 }}>
                    <h3 style={{ fontSize: 20, color: '#e94560' }}>{t('guide.architecture.heading')}</h3>
                    <div style={{ marginTop: 12 }}>
                      <h4 style={{ margin: '8px 0 4px 0', fontSize: 16 }}>{t('guide.architecture.engine.title')}</h4>
                      <p style={{ margin: 0 }}>{t('guide.architecture.engine.body')}</p>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <h4 style={{ margin: '8px 0 4px 0', fontSize: 16 }}>{t('guide.architecture.redos.title')}</h4>
                      <p style={{ margin: 0 }}>{t('guide.architecture.redos.body')}</p>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <h4 style={{ margin: '8px 0 4px 0', fontSize: 16 }}>{t('guide.architecture.privacy.title')}</h4>
                      <p style={{ margin: 0 }}>{t('guide.architecture.privacy.body')}</p>
                    </div>
                  </div>
                )}

                <h3 style={{ marginTop: 12 }}>{t('guide.useCases.heading')}</h3>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>{t('guide.useCases.item1')}</li>
                  <li>{t('guide.useCases.item2')}</li>
                  <li>{t('guide.useCases.item3')}</li>
                  <li>{t('guide.useCases.item4')}</li>
                </ul>

                <h3 style={{ marginTop: 12 }}>{t('guide.pitfalls.heading')}</h3>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>{t('guide.pitfalls.item1')}</li>
                  <li>{t('guide.pitfalls.item2')}</li>
                  <li>{t('guide.pitfalls.item3')}</li>
                  <li>{t('guide.pitfalls.item4')}</li>
                </ul>

                <h3 style={{ marginTop: 12 }}>{t('guide.comparison.heading')}</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ff6b2b33' }}>
                      <th style={{ textAlign: 'left', padding: 6 }}>{t('guide.comparison.col1')}</th>
                      <th style={{ textAlign: 'left', padding: 6 }}>{t('guide.comparison.col2')}</th>
                      <th style={{ textAlign: 'left', padding: 6 }}>{t('guide.comparison.col3')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={{ padding: 6, borderBottom: '1px solid #fff0eb' }}>{t('guide.comparison.row1col1')}</td><td style={{ padding: 6, borderBottom: '1px solid #fff0eb' }}>{t('guide.comparison.row1col2')}</td><td style={{ padding: 6, borderBottom: '1px solid #fff0eb' }}>{t('guide.comparison.row1col3')}</td></tr>
                    <tr><td style={{ padding: 6, borderBottom: '1px solid #fff0eb' }}>{t('guide.comparison.row2col1')}</td><td style={{ padding: 6, borderBottom: '1px solid #fff0eb' }}>{t('guide.comparison.row2col2')}</td><td style={{ padding: 6, borderBottom: '1px solid #fff0eb' }}>{t('guide.comparison.row2col3')}</td></tr>
                    <tr><td style={{ padding: 6 }}>{t('guide.comparison.row3col1')}</td><td style={{ padding: 6 }}>{t('guide.comparison.row3col2')}</td><td style={{ padding: 6 }}>{t('guide.comparison.row3col3')}</td></tr>
                  </tbody>
                </table>

                {t('guide.flagsTable.heading') && (
                  <div className="rt-flags-table-container" style={{ marginTop: 24, marginBottom: 20 }}>
                    <h3 style={{ fontSize: 20 }}>{t('guide.flagsTable.heading')}</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #ff6b2b33', background: '#1a1a2e', color: '#fff' }}>
                            <th style={{ textAlign: 'left', padding: 8 }}>{t('guide.flagsTable.colFlag')}</th>
                            <th style={{ textAlign: 'left', padding: 8 }}>{t('guide.flagsTable.colName')}</th>
                            <th style={{ textAlign: 'left', padding: 8 }}>{t('guide.flagsTable.colImpact')}</th>
                            <th style={{ textAlign: 'left', padding: 8 }}>{t('guide.flagsTable.colSupport')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #fff0eb' }}>
                            <td style={{ padding: 8 }}><code>{t('guide.flagsTable.rowG.flag')}</code></td>
                            <td style={{ padding: 8 }}><strong>{t('guide.flagsTable.rowG.name')}</strong></td>
                            <td style={{ padding: 8 }}>{t('guide.flagsTable.rowG.impact')}</td>
                            <td style={{ padding: 8 }}>{t('guide.flagsTable.rowG.support')}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #fff0eb' }}>
                            <td style={{ padding: 8 }}><code>{t('guide.flagsTable.rowI.flag')}</code></td>
                            <td style={{ padding: 8 }}><strong>{t('guide.flagsTable.rowI.name')}</strong></td>
                            <td style={{ padding: 8 }}>{t('guide.flagsTable.rowI.impact')}</td>
                            <td style={{ padding: 8 }}>{t('guide.flagsTable.rowI.support')}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #fff0eb' }}>
                            <td style={{ padding: 8 }}><code>{t('guide.flagsTable.rowM.flag')}</code></td>
                            <td style={{ padding: 8 }}><strong>{t('guide.flagsTable.rowM.name')}</strong></td>
                            <td style={{ padding: 8 }}>{t('guide.flagsTable.rowM.impact')}</td>
                            <td style={{ padding: 8 }}>{t('guide.flagsTable.rowM.support')}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #fff0eb' }}>
                            <td style={{ padding: 8 }}><code>{t('guide.flagsTable.rowS.flag')}</code></td>
                            <td style={{ padding: 8 }}><strong>{t('guide.flagsTable.rowS.name')}</strong></td>
                            <td style={{ padding: 8 }}>{t('guide.flagsTable.rowS.impact')}</td>
                            <td style={{ padding: 8 }}>{t('guide.flagsTable.rowS.support')}</td>
                          </tr>
                          <tr>
                            <td style={{ padding: 8 }}><code>{t('guide.flagsTable.rowU.flag')}</code></td>
                            <td style={{ padding: 8 }}><strong>{t('guide.flagsTable.rowU.name')}</strong></td>
                            <td style={{ padding: 8 }}>{t('guide.flagsTable.rowU.impact')}</td>
                            <td style={{ padding: 8 }}>{t('guide.flagsTable.rowU.support')}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <h3 style={{ marginTop: 12 }}>{t('guide.proTips.heading')}</h3>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>{t('guide.proTips.item1')}</li>
                  <li>{t('guide.proTips.item2')}</li>
                  <li>{t('guide.proTips.item3')}</li>
                  <li>{t('guide.proTips.item4')}</li>
                </ul>

                <h3 style={{ marginTop: 12 }}>{t('guide.safety.heading')}</h3>
                <p>{t('guide.safety.body')}</p>
                <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                  <li>{t('guide.safety.item1')}</li>
                  <li>{t('guide.safety.item2')}</li>
                </ul>
                <p style={{ marginTop: 6 }}>{t('guide.safety.warning')}</p>

                <h3 style={{ marginTop: 12 }}>{t('guide.faq.heading')}</h3>
                <div style={{ marginTop: 10 }}>
                  <p><strong>{t('guide.faq.q1')}</strong></p>
                  <p style={{ marginLeft: 12, marginBottom: 12 }}>{t('guide.faq.a1')}</p>
                  
                  <p><strong>{t('guide.faq.q2')}</strong></p>
                  <p style={{ marginLeft: 12, marginBottom: 12 }}>{t('guide.faq.a2')}</p>

                  <p><strong>{t('guide.faq.q3')}</strong></p>
                  <p style={{ marginLeft: 12, marginBottom: 12 }}>{t('guide.faq.a3')}</p>

                  <p><strong>{t('guide.faq.q4')}</strong></p>
                  <p style={{ marginLeft: 12, marginBottom: 12 }}>{t('guide.faq.a4')}</p>

                  {t('guide.faq.q5') && (
                    <>
                      <p><strong>{t('guide.faq.q5')}</strong></p>
                      <p style={{ marginLeft: 12, marginBottom: 12 }}>{t('guide.faq.a5')}</p>
                    </>
                  )}

                  {t('guide.faq.q6') && (
                    <>
                      <p><strong>{t('guide.faq.q6')}</strong></p>
                      <p style={{ marginLeft: 12, marginBottom: 12 }}>{t('guide.faq.a6')}</p>
                    </>
                  )}

                  {t('guide.faq.q7') && (
                    <>
                      <p><strong>{t('guide.faq.q7')}</strong></p>
                      <p style={{ marginLeft: 12, marginBottom: 12 }}>{t('guide.faq.a7')}</p>
                    </>
                  )}

                  {t('guide.faq.q8') && (
                    <>
                      <p><strong>{t('guide.faq.q8')}</strong></p>
                      <p style={{ marginLeft: 12, marginBottom: 12 }}>{t('guide.faq.a8')}</p>
                    </>
                  )}

                  {t('guide.faq.q9') && (
                    <>
                      <p><strong>{t('guide.faq.q9')}</strong></p>
                      <p style={{ marginLeft: 12, marginBottom: 12 }}>{t('guide.faq.a9')}</p>
                    </>
                  )}
                </div>

                <p style={{ marginTop: 14 }}><strong>{t('guide.conclusion')}</strong></p>

                <p style={{ marginTop: 12 }}>
                  <a
                    className="btn btn-primary"
                    href="/regex-tester"
                    onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/regex-tester') }}
                  >{t('guide.ctaBtn')}</a>
                </p>
              </div>
            </div>
          </div>

    </>
  )
}
