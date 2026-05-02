/**
 * scripts/prerender.mjs
 *
 * Runs AFTER both Vite builds:
 *   1. vite build              → dist/  (client bundle + assets)
 *   2. vite build --ssr ...    → dist/server/  (SSR bundle)
 *
 * For each route this script:
 *   - Calls render(url, ssrData) from the SSR bundle
 *   - Injects the rendered HTML + correct <title>/<meta> into dist/index.html
 *   - Writes dist/{path}/index.html
 *
 * Blog detail pages are fetched from the API so their full content ends up in
 * the prerendered HTML.  If the API is unreachable the build still succeeds —
 * those routes are just skipped and served as a normal SPA page.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const distDir = path.resolve(root, 'dist')
const serverEntry = path.resolve(distDir, 'server/entry-server.js')

// ── helpers ──────────────────────────────────────────────────────────────────

/** Escape a string for safe embedding inside a JSON value inside <script>. */
function safeJson(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

/** Escape a string for use as an HTML attribute value. */
function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Inject SSR output into the HTML template.
 *
 * @param {string} template      - Contents of dist/index.html
 * @param {string} renderedHtml  - react-dom/server output
 * @param {object} helmet        - HelmetProvider context.helmet
 * @param {object|null} ssrData  - Data to embed as window.__INITIAL_DATA__
 * @param {string} urlPath       - Route path, used for canonical URL
 * @param {string|null} titleOverride    - Explicit <title> text (no tags)
 * @param {string|null} descOverride     - Explicit meta description text
 */
function injectHtml(template, renderedHtml, helmet, ssrData, urlPath, titleOverride, descOverride) {
  let html = template

  // 1. Remove template defaults (replaced per-route below)
  html = html.replace(/<title>[^<]*<\/title>\s*/i, '')
  html = html.replace(/<meta\s+name="description"[^>]*>\s*/i, '')

  // 2. Build head tags
  const headTags = []

  const titleText = titleOverride || (helmet?.title ? stripTags(helmet.title.toString()) : '')
  if (titleText) headTags.push(`<title>${escapeAttr(titleText)}</title>`)

  if (descOverride) {
    headTags.push(`<meta name="description" content="${escapeAttr(descOverride)}" />`)
  } else if (helmet?.meta) {
    const metaStr = helmet.meta.toString().trim()
    if (metaStr) headTags.push(metaStr)
  }

  if (headTags.length) {
    html = html.replace('</head>', `${headTags.join('\n  ')}\n</head>`)
  }

  // 3. Update canonical URL
  const canonicalHref = `https://thrjtech.com${urlPath === '/' ? '' : urlPath}`
  html = html.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${canonicalHref}" />`
  )

  // 4. Inject rendered app HTML
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${renderedHtml}</div>`
  )

  // 5. Inject initial data for hydration (placed just before </body>)
  if (ssrData) {
    const dataScript = `<script>window.__INITIAL_DATA__=${safeJson(ssrData)}</script>`
    html = html.replace('</body>', `${dataScript}\n</body>`)
  }

  return html
}

/** Strip HTML tags from a string (used to extract plain title text from Helmet). */
function stripTags(str) {
  return str.replace(/<[^>]+>/g, '').trim()
}

// ── load SSR bundle ───────────────────────────────────────────────────────────

console.log('Loading SSR bundle…')
const { render } = await import(pathToFileURL(serverEntry).href)

// ── read template ─────────────────────────────────────────────────────────────

const template = fs.readFileSync(path.resolve(distDir, 'index.html'), 'utf-8')

// ── static routes ─────────────────────────────────────────────────────────────

const staticRoutes = [
  '/',
  '/pdf-compressor',
  '/pdf-merger',
  '/pdf-converter',
  '/pdf-splitter',
  '/json-formatter',
  '/regex-tester',
  '/image-watermarker',
  '/image-resizer',
  '/image-collage',
  '/image-meme-generator',
  '/image-crop',
  '/image-converter',
  '/image-rotator',
  '/screen-recorder',
  '/about/us',
  '/about/policy',
  '/about/terms',
  '/contact',
]

// ── fetch blog list ───────────────────────────────────────────────────────────

const BLOG_API = process.env.BLOG_BACKEND_URL || 'https://preview.api-gateway.thrjtech.com/api/v1/blogs'
let blogSlugs = []
let blogsPageData = null

try {
  console.log(`Fetching blog list from ${BLOG_API}…`)
  const res = await fetch(BLOG_API)
  if (res.ok) {
    blogsPageData = await res.json()
    blogSlugs = (blogsPageData.items ?? []).map(b => b.slug)
    console.log(`Found ${blogSlugs.length} blog(s): ${blogSlugs.join(', ')}`)
  } else {
    console.warn(`Blog API returned ${res.status} — skipping blog prerender`)
  }
} catch (err) {
  console.warn(`Blog API unreachable (${err.message}) — skipping blog prerender`)
}

// ── prerender helper ──────────────────────────────────────────────────────────

async function prerenderRoute(urlPath, ssrData = null, titleOverride = null, descOverride = null) {
  try {
    const { html: renderedHtml, helmet } = render(urlPath, ssrData)
    const finalHtml = injectHtml(template, renderedHtml, helmet, ssrData, urlPath, titleOverride, descOverride)

    const outDir = urlPath === '/'
      ? distDir
      : path.resolve(distDir, urlPath.replace(/^\//, ''))

    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.resolve(outDir, 'index.html'), finalHtml)
    console.log(`  ✓  ${urlPath}`)
  } catch (err) {
    console.warn(`  ✗  ${urlPath}: ${err.message}`)
  }
}

// ── render static routes ──────────────────────────────────────────────────────

console.log('\nPrerendering static routes…')
for (const route of staticRoutes) {
  await prerenderRoute(route)
}

// ── render /blogs list ────────────────────────────────────────────────────────

await prerenderRoute('/blogs', blogsPageData)

// ── render individual blog pages ──────────────────────────────────────────────

if (blogSlugs.length) {
  console.log('\nPrerendering blog detail pages…')
  for (const slug of blogSlugs) {
    try {
      const res = await fetch(`${BLOG_API}/${slug}`)
      if (!res.ok) {
        console.warn(`  ✗  /blogs/${slug}: API returned ${res.status}`)
        continue
      }
      const blogData = await res.json()
      const titleOverride = `${blogData.title} | THRJ Blog`
      const descOverride = blogData.description || blogData.title
      await prerenderRoute(`/blogs/${slug}`, { blog: blogData }, titleOverride, descOverride)
    } catch (err) {
      console.warn(`  ✗  /blogs/${slug}: ${err.message}`)
    }
  }
}

console.log('\nPrerendering complete.')
