import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'

// Maps a pathname to the namespace(s) its page actually needs. Only 'common'
// (used by Navbar/Footer on every page) plus the current route's namespace
// are fetched eagerly on init; every other namespace is lazy-loaded by
// react-i18next when a component further down the tree calls
// useTranslation('someNs') for the first time (see <Suspense> in main.jsx).
const ROUTE_NAMESPACES = [
  { test: (p) => p === '/', ns: 'home' },
  { test: (p) => p === '/pdf-compressor', ns: 'pdfCompressor' },
  { test: (p) => p === '/pdf-merger', ns: 'pdfMerger' },
  { test: (p) => p === '/pdf-converter', ns: 'pdfConverter' },
  { test: (p) => p === '/pdf-splitter', ns: 'pdfSplitter' },
  { test: (p) => p === '/json-formatter', ns: 'jsonFormatter' },
  { test: (p) => p === '/regex-tester', ns: 'regexTester' },
  { test: (p) => p === '/image-watermarker', ns: 'imageWatermarker' },
  { test: (p) => p === '/image-resizer', ns: 'imageResizer' },
  { test: (p) => p === '/image-collage', ns: 'imageCollage' },
  { test: (p) => p === '/image-meme-generator', ns: 'imageMemeGenerator' },
  { test: (p) => p === '/image-crop', ns: 'imageCrop' },
  { test: (p) => p === '/image-converter', ns: 'imageConverter' },
  { test: (p) => p === '/image-rotator', ns: 'imageRotator' },
  { test: (p) => p === '/screen-recorder', ns: 'screenRecorder' },
  { test: (p) => p === '/video-to-gif', ns: 'videoToGif' },
  { test: (p) => p.startsWith('/blogs'), ns: 'blogs' },
  { test: (p) => p === '/about/us', ns: 'about' },
  { test: (p) => p === '/about/policy', ns: 'privacy' },
  { test: (p) => p === '/about/terms', ns: 'terms' },
  { test: (p) => p === '/contact', ns: 'contact' },
  { test: (p) => ['/pdf-tools', '/image-tools', '/developer-tools', '/video-tools'].includes(p), ns: 'toolsLanding' },
]

function getInitialNamespaces() {
  const namespaces = new Set(['common'])
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname
    const match = ROUTE_NAMESPACES.find(({ test }) => test(pathname))
    namespaces.add(match ? match.ns : 'notFound')
  }
  return Array.from(namespaces)
}

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'es', 'ko'],
    defaultNS: 'common',
    // Only preload namespaces needed for the current route. Other pages'
    // namespaces are lazy-loaded on demand (see ROUTE_NAMESPACES above).
    ns: getInitialNamespaces(),
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  })

export default i18n
