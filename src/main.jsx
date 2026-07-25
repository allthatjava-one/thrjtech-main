import { StrictMode, Suspense } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import i18n from './i18n'
import App from './App.jsx'

const rootEl = document.getElementById('root')
const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        {/* Namespaces not preloaded for the current route (see src/i18n.js)
            are lazy-loaded on demand; this boundary covers that loading gap
            when navigating client-side to a page with a different namespace. */}
        <Suspense fallback={null}>
          <App />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

function mountApp() {
  if (rootEl.hasChildNodes()) {
    hydrateRoot(rootEl, app)
  } else {
    createRoot(rootEl).render(app)
  }
}

if (i18n.isInitialized) {
  mountApp()
} else {
  i18n.on('initialized', mountApp)
}
