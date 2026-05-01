import { useEffect } from 'react'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router'
import type { LinksFunction } from 'react-router'
import GtagRouteTracker from '../src/services/GtagRouteTracker'
import appCss from '../src/App.css?url'
import indexCss from '../src/index.css?url'
import navbarCss from '../src/components/Navbar.css?url'
import footerCss from '../src/components/Footer.css?url'
import rotatingCardsCss from '../src/components/RotatingCards.css?url'
import languageSwitcherCss from '../src/components/LanguageSwitcher.css?url'
import contactUsCss from '../src/components/ContactUs.css?url'
import aboutCss from '../src/components/about/About.css?url'
import blogPageCss from '../src/components/BlogPage.css?url'
import blogsListPageCss from '../src/components/BlogsListPage.css?url'
import imageToolsSharedCss from '../src/tools/image-tools-shared.css?url'
import customSelectCss from '../src/commons/CustomSelect.css?url'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: indexCss },
  { rel: 'stylesheet', href: appCss },
  { rel: 'stylesheet', href: navbarCss },
  { rel: 'stylesheet', href: footerCss },
  { rel: 'stylesheet', href: rotatingCardsCss },
  { rel: 'stylesheet', href: languageSwitcherCss },
  { rel: 'stylesheet', href: contactUsCss },
  { rel: 'stylesheet', href: aboutCss },
  { rel: 'stylesheet', href: blogPageCss },
  { rel: 'stylesheet', href: blogsListPageCss },
  { rel: 'stylesheet', href: imageToolsSharedCss },
  { rel: 'stylesheet', href: customSelectCss },
  { rel: 'icon', type: 'image/x-icon', href: '/images/main/favicon.ico' },
  { rel: 'icon', type: 'image/svg+xml', href: '/images/main/favicon.svg' },
]

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }) } catch (_) {}
    const main = document.querySelector('main') || document.querySelector('#root') || document.body
    if (main instanceof HTMLElement) {
      try { main.setAttribute('tabindex', '-1'); main.focus({ preventScroll: true }) } catch (_) {
        try { main.focus() } catch (_) {}
      }
    }
  }, [pathname])
  return null
}

function ClientThirdPartyScripts() {
  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return

    if (!document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js?id=G-CTBF109J2G"]')) {
      const gaLoader = document.createElement('script')
      gaLoader.async = true
      gaLoader.src = 'https://www.googletagmanager.com/gtag/js?id=G-CTBF109J2G'
      document.head.appendChild(gaLoader)
    }

    if (typeof (window as any).gtag !== 'function') {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).gtag = function gtag(...args: any[]) {
        ;(window as any).dataLayer.push(args)
      }
      ;(window as any).gtag('js', new Date())
      ;(window as any).gtag('config', 'G-CTBF109J2G', { send_page_view: false })
      ;(window as any).gtag('event', 'page_view', {
        page_path: window.location.pathname + window.location.search,
      })
    }

    if (!document.querySelector('script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
      const adsLoader = document.createElement('script')
      adsLoader.async = true
      adsLoader.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1683577108258942'
      adsLoader.crossOrigin = 'anonymous'
      document.head.appendChild(adsLoader)
    }
  }, [])

  return null
}

function ClientLanguageSync() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const preferredFromStorage = window.localStorage.getItem('i18nextLng')
    const storageLanguage = preferredFromStorage ? preferredFromStorage.toLowerCase().split('-')[0] : null
    const navigatorLanguage = (window.navigator.language || '').toLowerCase().split('-')[0]
    const preferred = ['en', 'fr', 'es', 'ko'].includes(storageLanguage || '')
      ? storageLanguage
      : (['en', 'fr', 'es', 'ko'].includes(navigatorLanguage) ? navigatorLanguage : 'en')

    // Run after hydration commit to avoid mismatching server-rendered HTML.
    const id = window.setTimeout(() => {
      // Dynamic import keeps i18next-http-backend out of the server bundle
      // (avoids global-scope fetch() which is disallowed in Workers).
      import('../src/i18n').then((mod) => {
        const i18n = mod.default
        if (preferred && preferred !== i18n.resolvedLanguage && preferred !== i18n.language) {
          void i18n.changeLanguage(preferred)
        }
      })
    }, 0)

    return () => window.clearTimeout(id)
  }, [])

  return null
}

export default function Root() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        <ScrollToTop />
        <ClientLanguageSync />
        <ClientThirdPartyScripts />
        <GtagRouteTracker />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
