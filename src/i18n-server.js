import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const namespaces = [
  'common', 'home', 'contact', 'about', 'privacy', 'terms', 'blogs',
  'pdfCompressor', 'pdfMerger', 'pdfConverter', 'pdfSplitter',
  'jsonFormatter', 'regexTester', 'imageWatermarker', 'imageResizer',
  'imageCollage', 'imageCrop', 'imageMemeGenerator', 'imageConverter',
  'imageRotator', 'screenRecorder',
]

// Resolve relative to cwd (workspace root) so the path works both in source
// and when this module is bundled into dist/server/ by Vite's SSR build.
const localesDir = resolve(process.cwd(), 'public/locales/en')

const resources = { en: {} }
for (const ns of namespaces) {
  try {
    resources.en[ns] = JSON.parse(readFileSync(resolve(localesDir, `${ns}.json`), 'utf-8'))
  } catch {
    resources.en[ns] = {}
  }
}

const serverI18n = i18n.createInstance()
await serverI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: namespaces,
  defaultNS: 'common',
  resources,
  initImmediate: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

export default serverI18n
