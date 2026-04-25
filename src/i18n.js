import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'es', 'ko'],
    defaultNS: 'common',
    ns: [
      'common',
      'home',
      'contact',
      'about',
      'privacy',
      'terms',
      'blogs',
      'pdfCompressor',
      'pdfMerger',
      'pdfConverter',
      'pdfSplitter',
      'jsonFormatter',
      'regexTester',
      'imageWatermarker',
      'imageResizer',
      'imageCollage',
      'imageCrop',
      'imageMemeGenerator',
      'imageConverter',
      'imageRotator',
    ],
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
