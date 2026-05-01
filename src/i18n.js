import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'

import common from '../public/locales/en/common.json'
import home from '../public/locales/en/home.json'
import contact from '../public/locales/en/contact.json'
import about from '../public/locales/en/about.json'
import privacy from '../public/locales/en/privacy.json'
import terms from '../public/locales/en/terms.json'
import blogs from '../public/locales/en/blogs.json'
import pdfCompressor from '../public/locales/en/pdfCompressor.json'
import pdfMerger from '../public/locales/en/pdfMerger.json'
import pdfConverter from '../public/locales/en/pdfConverter.json'
import pdfSplitter from '../public/locales/en/pdfSplitter.json'
import jsonFormatter from '../public/locales/en/jsonFormatter.json'
import regexTester from '../public/locales/en/regexTester.json'
import imageWatermarker from '../public/locales/en/imageWatermarker.json'
import imageResizer from '../public/locales/en/imageResizer.json'
import imageCollage from '../public/locales/en/imageCollage.json'
import imageCrop from '../public/locales/en/imageCrop.json'
import imageMemeGenerator from '../public/locales/en/imageMemeGenerator.json'
import imageConverter from '../public/locales/en/imageConverter.json'
import imageRotator from '../public/locales/en/imageRotator.json'
import screenRecorder from '../public/locales/en/screenRecorder.json'

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Keep the initial client render aligned with server-side English markup.
    lng: 'en',
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
      'screenRecorder',
    ],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    resources: {
      en: {
        common,
        home,
        contact,
        about,
        privacy,
        terms,
        blogs,
        pdfCompressor,
        pdfMerger,
        pdfConverter,
        pdfSplitter,
        jsonFormatter,
        regexTester,
        imageWatermarker,
        imageResizer,
        imageCollage,
        imageCrop,
        imageMemeGenerator,
        imageConverter,
        imageRotator,
        screenRecorder,
      },
    },
    detection: {
      // Defer language detection until after hydration to avoid SSR/client mismatches.
      order: [],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    initImmediate: false,
    react: {
      useSuspense: false,
    },
  })

export default i18n
