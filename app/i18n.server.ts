/**
 * Server-side i18next initialisation (English-first SSR).
 * Statically imports all EN locale JSON files so Vite bundles them
 * into the server build. No HTTP fetching needed on the server.
 * The global i18next instance is initialised here; client entry.client.tsx
 * re-initialises it with the browser language detector + HTTP backend.
 */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

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

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    ns: [
      'common', 'home', 'contact', 'about', 'privacy', 'terms', 'blogs',
      'pdfCompressor', 'pdfMerger', 'pdfConverter', 'pdfSplitter',
      'jsonFormatter', 'regexTester', 'imageWatermarker', 'imageResizer',
      'imageCollage', 'imageCrop', 'imageMemeGenerator', 'imageConverter',
      'imageRotator', 'screenRecorder',
    ],
    defaultNS: 'common',
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
    initImmediate: false,
    interpolation: {
      escapeValue: false,
    },
  })
}

export default i18n
