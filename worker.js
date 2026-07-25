import { onRequestPost } from './functions/r2-presign.js'

function isHtmlRequest(request) {
  const accept = request.headers.get('Accept') || ''
  return request.method === 'GET' && accept.includes('text/html')
}

function hasFileExtension(pathname) {
  const lastSegment = pathname.split('/').pop() || ''
  return lastSegment.includes('.')
}

function mergeHeaders(origHeaders, extra) {
  const headers = new Headers()
  try {
    if (origHeaders) for (const [k, v] of origHeaders) headers.set(k, v)
  } catch (e) {
    // origHeaders may be a plain object
    try { for (const k of Object.keys(origHeaders || {})) headers.set(k, origHeaders[k]) } catch (e) {}
  }
  for (const k of Object.keys(extra || {})) headers.set(k, extra[k])
  return headers
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (isHtmlRequest(request)) {
      // Keep non-trailing-slash URLs as canonical for route pages.
      if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
        const canonicalUrl = new URL(request.url)
        canonicalUrl.pathname = canonicalUrl.pathname.replace(/\/+$/, '')
        return Response.redirect(canonicalUrl.toString(), 308)
      }

      // Serve prerendered route pages from dist/*.html (e.g. /image-rotator -> /image-rotator.html).
      if (url.pathname !== '/' && !hasFileExtension(url.pathname)) {
        const htmlUrl = new URL(`${url.pathname}.html`, request.url)
        const htmlResponse = await env.ASSETS.fetch(new Request(htmlUrl, request))
        if (htmlResponse.status !== 404) {
          // Ensure crawler-friendly headers for HTML responses
          try {
            const buf = await htmlResponse.arrayBuffer()
            const headers = mergeHeaders(htmlResponse.headers, { 'Cache-Control': 'public, max-age=300' })
            return new Response(buf, { status: 200, headers })
          } catch (e) {
            return htmlResponse
          }
        } else {
          // If a prerendered page wasn't found for this route, return a prerendered 404.html with HTTP 404.
          try {
            const notFoundUrl = new URL('/404', request.url)
            const notFoundResponse = await env.ASSETS.fetch(new Request(notFoundUrl, request))
            if (notFoundResponse.status !== 404) {
              const body = await notFoundResponse.text()
              const headers = mergeHeaders(notFoundResponse.headers, { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' })
              return new Response(body, { status: 404, headers })
            }
          } catch (e) {
            // fall through to later fallback
          }
        }
      }
    }

    if (url.pathname === '/r2-presign' && request.method === 'POST') {
      return onRequestPost({ request, env })
    }

    // CORS helper headers - allow all origins for API endpoints
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    // Handle preflight for list endpoint
    if (url.pathname === '/api/blogs' && request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    if (url.pathname === '/api/blogs' && request.method === 'GET') {
      const origin = env.BLOG_ORIGIN || url.origin
      const backendUrl = new URL(env.BLOG_BACKEND_URL)
      url.searchParams.forEach((value, key) => backendUrl.searchParams.set(key, value))
      const upstream = await fetch(backendUrl.toString(), { headers: { 'Accept': 'application/json', 'X-Forwarded-Origin': origin } })
      const body = await upstream.text()
      return new Response(body, {
        status: upstream.status,
        headers: Object.assign({ 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' }, corsHeaders),
      })
    }

    const blogsSlugMatch = url.pathname.match(/^\/api\/blogs\/([^/]+)$/)
    // Handle preflight for item endpoint
    if (blogsSlugMatch && request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    if (blogsSlugMatch && request.method === 'GET') {
      const slug = blogsSlugMatch[1]
      const origin = env.BLOG_ORIGIN || url.origin
      const upstream = await fetch(`${env.BLOG_BACKEND_URL}/${slug}`, { headers: { 'Accept': 'application/json', 'X-Forwarded-Origin': origin } })
      const body = await upstream.text()
      return new Response(body, {
        status: upstream.status,
        headers: Object.assign({ 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' }, corsHeaders),
      })
    }

    const assetResponse = await env.ASSETS.fetch(request)
    // If the asset exists (not a 404), return it immediately. For HTML
    // assets, ensure we return crawler-friendly cache headers.
    if (assetResponse.status !== 404) {
      const contentType = (assetResponse.headers.get('Content-Type') || '')
      if (contentType.includes('text/html')) {
        try {
          const buf = await assetResponse.arrayBuffer()
          const headers = mergeHeaders(assetResponse.headers, { 'Cache-Control': 'public, max-age=300' })
          return new Response(buf, { status: assetResponse.status, headers })
        } catch (e) {
          return assetResponse
        }
      }
      return assetResponse
    }

    // If the asset is missing, but this looks like a navigation request
    // (GET and no file extension), try to serve a prerendered HTML file
    // (e.g. `/some-route.html`) and return it with HTTP 200 so crawlers
    // and clients see the page as successful.
    if (request.method === 'GET' && !hasFileExtension(url.pathname)) {
      try {
        const htmlUrl = new URL(`${url.pathname}.html`, request.url)
        const htmlResponse = await env.ASSETS.fetch(new Request(htmlUrl, request))
        if (htmlResponse.status === 200) {
          try {
            const buf = await htmlResponse.arrayBuffer()
            const headers = mergeHeaders(htmlResponse.headers, { 'Cache-Control': 'public, max-age=300' })
            return new Response(buf, { status: 200, headers })
          } catch (e) {
            return htmlResponse
          }
        }

        // If a prerendered page wasn't found, fall back to serving a
        // prerendered 404 page (with 404 status) so non-existent routes
        // are discoverable as not found.
        const notFoundUrl = new URL('/404', request.url)
        const notFoundResponse = await env.ASSETS.fetch(new Request(notFoundUrl, request))
        if (notFoundResponse.status === 200) {
          const body = await notFoundResponse.text()
          const headers = mergeHeaders(notFoundResponse.headers, { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' })
          return new Response(body, { status: 404, headers })
        }
      } catch (e) {
        // ignore and fall back to returning original asset response
      }
    }

    // Default fallback: return the original asset response (404) so non-HTML
    // requests keep their original semantics.
    return assetResponse
  },
}