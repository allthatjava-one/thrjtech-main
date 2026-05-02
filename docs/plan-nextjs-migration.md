# Plan: Migrate to Next.js on Cloudflare

## Current Architecture Summary

| Layer | Technology |
|---|---|
| Build tool | Vite 7 |
| Framework | React 18, SPA (BrowserRouter) |
| Routing | React Router v7 |
| Deployment | Cloudflare Workers + Assets binding |
| Worker | `worker.js` — handles SPA fallback + 3 API proxy routes |
| i18n | i18next + i18next-http-backend, 4 languages, 19 namespaces |
| Tools (15) | All client-side, heavy browser APIs (PDF-lib, gifenc, heic2any, UTIF, MediaDevices) |
| API routes | `POST /r2-presign`, `GET /api/blogs`, `GET /api/blogs/:slug` |
| Presign | AWS SDK (Edge-compatible config) in `functions/r2-presign.js` |

---

## Target Architecture

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Runtime | Cloudflare Workers Edge Runtime |
| Adapter | `@opennextjs/cloudflare` |
| Routing | Next.js file-based (App Router) |
| API Routes | Next.js Route Handlers (`app/api/…/route.js`) |
| i18n | i18next (client-only, `'use client'` components) — no change needed |
| Deployment | `wrangler deploy` via OpenNext build output |

### Why `@opennextjs/cloudflare` over `@cloudflare/next-on-pages`

- Full Workers runtime (not Pages Functions) — supports all Cloudflare bindings (R2, KV, D1)
- Actively maintained by Cloudflare and the OpenNext community
- Supports incremental static regeneration (ISR) cache via Workers KV
- Better Node.js compatibility shim support

---

## Migration Phases

### Phase 1 — New Project Scaffold

1. Install Next.js 15 alongside the current workspace:
   ```bash
   npx create-next-app@latest . --app --js --no-tailwind --no-src-dir --import-alias "@/*"
   ```
   > Choose **not** to overwrite existing files when prompted.

2. Install the OpenNext Cloudflare adapter:
   ```bash
   npm install -D @opennextjs/cloudflare
   ```

3. Update `next.config.js` — minimal config to prepare for Edge:
   ```js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     // App Router is enabled by default in Next.js 15
     // Ensure no Node.js-only APIs leak into server components
     experimental: {
       serverComponentsExternalPackages: [],
     },
   }
   export default nextConfig
   ```

4. Update `package.json` scripts:
   ```json
   "scripts": {
     "dev":        "next dev --turbopack",
     "build":      "next build",
     "cf:build":   "opennextjs-cloudflare build",
     "cf:preview": "opennextjs-cloudflare preview",
     "cf:deploy":  "opennextjs-cloudflare deploy",
     "translate":  "node translate-and-merge.js",
     "translate:fast": "node translate-and-merge-fast.js",
     "verify-translations": "node verify-translations.js"
   }
   ```

5. Update `wrangler.toml` — remove Assets SPA config, let OpenNext generate it:
   ```toml
   name = "thrjtech-main"
   compatibility_date = "2026-03-13"
   compatibility_flags = ["nodejs_compat"]

   # OpenNext manages the [assets] and main entry point
   # Run: npx opennextjs-cloudflare build  (outputs to .open-next/)
   ```

---

### Phase 2 — App Router Directory Structure

Remove `src/App.jsx` role as router. Create `app/` at the project root:

```
app/
  layout.jsx              ← Root layout (replaces BrowserRouter + Navbar/Footer wrapper)
  page.jsx                ← HomePage (currently inline in App.jsx)
  not-found.jsx           ← 404 page
  pdf-compressor/
    page.jsx
  pdf-merger/
    page.jsx
  pdf-converter/
    page.jsx
  pdf-splitter/
    page.jsx
  json-formatter/
    page.jsx
  regex-tester/
    page.jsx
  image-watermarker/
    page.jsx
  image-resizer/
    page.jsx
  image-collage/
    page.jsx
  image-crop/
    page.jsx
  image-meme-generator/
    page.jsx
  image-converter/
    page.jsx
  image-rotator/
    page.jsx
  screen-recorder/
    page.jsx
  blogs/
    page.jsx              ← BlogsListPage
    [slug]/
      page.jsx            ← BlogPage
  about/
    page.jsx
  privacy/
    page.jsx
  terms/
    page.jsx
  contact/
    page.jsx
  api/
    r2-presign/
      route.js            ← POST handler (migrated from worker.js + functions/r2-presign.js)
    blogs/
      route.js            ← GET /api/blogs
      [slug]/
        route.js          ← GET /api/blogs/:slug
```

#### `app/layout.jsx` example

```jsx
'use client'
import '../src/i18n'          // Initialize i18next once (client-side)
import Navbar from '../src/components/Navbar'
import Footer from '../src/components/Footer'
import GtagRouteTracker from '../src/services/GtagRouteTracker'
import '../src/App.css'
import '../src/index.css'

export const metadata = {
  title: 'THRJ — Free Online Tools',
  description: 'Free, fast, privacy-friendly online utilities.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GtagRouteTracker />
        <Navbar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
```

> **Note:** Because `layout.jsx` uses hooks (via i18n/Navbar), it must be `'use client'`. For better performance later, split the client shell into a wrapper and keep layout a Server Component.

#### Tool page example — `app/pdf-compressor/page.jsx`

```jsx
'use client'
import PdfCompressorPage from '../../src/tools/pdf-compressor/PdfCompressorPage'
export default PdfCompressorPage
```

Every tool page is a thin re-export marked `'use client'` because all tools use browser APIs.

---

### Phase 3 — API Route Handlers

All three routes from `worker.js` become Next.js Route Handlers under `app/api/`.  
Add `export const runtime = 'edge'` to each to target Cloudflare Workers.

#### `app/api/r2-presign/route.js`

```js
export const runtime = 'edge'

export async function POST(request) {
  // Move logic from functions/r2-presign.js here
  // Access env via process.env (mapped by wrangler/OpenNext) or
  // via the Cloudflare env binding using `getRequestContext()` from @opennextjs/cloudflare
  const { env } = getRequestContext()
  // ... existing presign logic unchanged
}
```

#### `app/api/blogs/route.js`

```js
export const runtime = 'edge'

export async function GET(request) {
  // Move logic from worker.js /api/blogs GET handler
}
```

#### `app/api/blogs/[slug]/route.js`

```js
export const runtime = 'edge'

export async function GET(request, { params }) {
  const { slug } = await params
  // Move logic from worker.js /api/blogs/:slug GET handler
}
```

---

### Phase 4 — SEO / Metadata Migration

The custom `<Seo>` component uses `react-helmet`-style head injection. In Next.js App Router, use the built-in `metadata` export instead.

**Option A (quick):** Keep `<Seo>` component using `next/head` — rename import, add `'use client'` to each page that uses it.

**Option B (proper):** Replace each page's `<Seo />` usage with a `generateMetadata()` export:

```js
// app/pdf-compressor/page.jsx
export async function generateMetadata() {
  return {
    title: 'PDF Compressor — THRJ',
    description: '…',
  }
}
```

Option A is lower risk for the initial migration; Option B is the clean Next.js pattern and enables SSR head injection.

---

### Phase 5 — i18n

The existing i18next setup (`i18next-http-backend`, `LanguageDetector`) is **entirely browser-side** and works as-is in Next.js when all consuming components are `'use client'`.

**No changes required for Phase 5** because:
- All 15 tool components are `'use client'` by nature (browser APIs)
- `src/i18n.js` is imported once inside the `layout.jsx` client shell
- Locale JSON files remain in `public/locales/` and are served statically by Next.js

**Future improvement (out of scope):** adopt `next-intl` for SSR i18n and automatic locale routing (`/ko/pdf-compressor`), which improves SEO.

---

### Phase 6 — Cloudflare Environment Variables / Bindings

The `r2-presign` route accesses `env.R2_ENDPOINT_URL` etc. via the Cloudflare `env` object. In OpenNext, use:

```js
import { getRequestContext } from '@opennextjs/cloudflare'

export async function POST(request) {
  const { env } = getRequestContext()
  const { R2_ENDPOINT_URL, R2_ACCESS_KEY_ID, ... } = env
  // rest of presign logic
}
```

Keep all R2/PDF secrets in `wrangler.toml` `[vars]` or via `wrangler secret put`.

---

### Phase 7 — Remove Vite Artifacts

Once Next.js build is verified:

- Delete `vite.config.js`
- Delete `worker.js` (replaced by API Route Handlers)
- Remove `@vitejs/plugin-react` and `vite` from `devDependencies`
- Remove `[assets]` block from `wrangler.toml`
- Delete old `src/main.jsx` entry point

---

## Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| `pdf-lib`, `gifenc`, `heic2any`, `UTIF`, `jszip` are browser-only | High | Mark all tool pages `'use client'`; never import in Server Components |
| `react-easy-crop` uses DOM APIs | Medium | `'use client'` on ImageCrop page |
| AWS SDK in Edge Runtime | Medium | Already uses `requestChecksumCalculation: 'WHEN_REQUIRED'` — verified Edge-compatible; test with `cf:preview` |
| i18next `useSuspense: true` + SSR | Medium | Client shell prevents SSR of i18n content; acceptable for now |
| Screen Recorder uses `navigator.mediaDevices` | Low | Client component; Next.js won't SSR it |
| `@opennextjs/cloudflare` OpenNext version alignment | Medium | Pin `@opennextjs/cloudflare` and `next` versions together; check release notes |
| CORS headers on `/api/blogs` | Low | Move CORS logic verbatim from `worker.js` to Route Handlers |

---

## Dependency Changes

### Add

```
next                        ^15.x
@opennextjs/cloudflare      latest
```

### Remove

```
vite
@vitejs/plugin-react
react-router-dom            (replaced by App Router file-based routing)
```

### Keep As-Is

```
react, react-dom
i18next, react-i18next, i18next-browser-languagedetector, i18next-http-backend
pdf-lib, gifenc, heic2any, jszip, utif
react-easy-crop
@aws-sdk/client-s3, @aws-sdk/s3-request-presigner  (devDeps → deps for route handlers)
wrangler
```

---

## Suggested Execution Order

1. **Branch**: create `feature/nextjs-migration` from current main
2. **Phase 1** — scaffold Next.js, install OpenNext, update scripts & wrangler.toml
3. **Phase 2** — create `app/` directory with all page re-exports
4. **Phase 3** — migrate 3 API routes from `worker.js` to route handlers
5. **Phase 4** — SEO: keep `<Seo>` with Option A first, upgrade to `generateMetadata` per page later
6. **Phase 5** — confirm i18n works (no code change expected)
7. **Phase 6** — verify `getRequestContext()` for env bindings; run `cf:preview`
8. **Phase 7** — delete Vite artifacts after full smoke test passes
9. **Testing** — run all 15 tool pages locally with `cf:preview`, verify `/api/blogs` and `/r2-presign`
10. **Deploy** — `cf:deploy` to staging environment first

---

## Local Dev Workflow After Migration

```bash
# Next.js HMR dev (no Cloudflare bindings)
npm run dev

# Full Cloudflare environment preview (with R2/env bindings)
npm run cf:preview
```

The `cf:preview` command replaces the current `pages:dev` proxy setup.
