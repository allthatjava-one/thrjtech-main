import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './LanguageSwitcher.css'

const LANGS = [
  { code: 'en', label: 'English', flag: '/images/flags/gb.svg' },
  { code: 'fr', label: 'Français', flag: '/images/flags/fr.svg' },
  { code: 'es', label: 'Español', flag: '/images/flags/es.svg' },
  { code: 'ko', label: '한국어', flag: '/images/flags/kr.svg' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const dropdownRef = useRef(null)
  const optionRefs = useRef([])
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 700px)').matches
  })
  const currentLanguage = i18n.resolvedLanguage || i18n.language || 'en'
  const current = LANGS.find(({ code }) => currentLanguage.startsWith(code)) || LANGS[0]

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const media = window.matchMedia('(max-width: 700px)')
    const handleChange = (e) => setIsMobile(e.matches)
    handleChange(media)
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!open || !isMobile) return
    requestAnimationFrame(() => {
      dropdownRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      optionRefs.current[0]?.focus({ preventScroll: true })
    })
  }, [open, isMobile])

  return (
    <div className={`lang-switcher${open ? ' open' : ''}`} ref={ref}>
      <button
        className="lang-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <img src={current.flag} alt={current.label} className="lang-flag" />
        <span className="lang-trigger-label">{current.label}</span>
        <span className="lang-chevron" aria-hidden="true">▾</span>
      </button>
      {open && (
        <ul className="lang-dropdown" role="listbox" ref={dropdownRef}>
          {LANGS.map(({ code, label, flag }, index) => (
            <li
              key={code}
              role="option"
              aria-selected={current.code === code}
              className={`lang-option${current.code === code ? ' active' : ''}`}
              ref={(el) => { optionRefs.current[index] = el }}
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  i18n.changeLanguage(code)
                  setOpen(false)
                }
              }}
              onClick={() => { i18n.changeLanguage(code); setOpen(false) }}
            >
              <img src={flag} alt={label} className="lang-flag" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
