import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import serverI18n from './i18n-server.js'
import { SsrDataContext } from './SsrDataContext.js'
import App from './App.jsx'

/**
 * @param {string} url - The route path to render (e.g. '/pdf-compressor')
 * @param {object|null} ssrData - Optional initial data injected into SsrDataContext
 * @returns {{ html: string, helmet: object }}
 */
export function render(url, ssrData = null) {
  const helmetContext = {}
  const html = renderToString(
    <SsrDataContext.Provider value={ssrData}>
      <HelmetProvider context={helmetContext}>
        <I18nextProvider i18n={serverI18n}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </I18nextProvider>
      </HelmetProvider>
    </SsrDataContext.Provider>
  )
  return { html, helmet: helmetContext.helmet }
}
