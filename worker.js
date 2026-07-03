import { onRequestPost } from './functions/r2-presign.js'

function isHtmlRequest(request) {
  const accept = request.headers.get('Accept') || ''
  return request.method === 'GET' && accept.includes('text/html')
}

function hasFileExtension(pathname) {
  const lastSegment = pathname.split('/').pop() || ''
  return lastSegment.includes('.')
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
          return htmlResponse
        } else {
          // If a prerendered page wasn't found for this route, return a prerendered 404.html with HTTP 404.
          try {
            const notFoundUrl = new URL('/404', request.url)
            const notFoundResponse = await env.ASSETS.fetch(new Request(notFoundUrl, request))
            if (notFoundResponse.status !== 404) {
              const body = await notFoundResponse.text()
              return new Response(body, { status: 404, headers: notFoundResponse.headers })
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
    // If the asset exists (not a 404), return it immediately.
    if (assetResponse.status !== 404) {
      return assetResponse
    }

    // If this is a GET for a path without a file extension, treat it as a
    // navigation and try to serve a prerendered 404 page. This avoids relying
    // solely on the Accept header which may be absent for some clients.
    if (request.method === 'GET' && !hasFileExtension(url.pathname)) {
      try {
        const notFoundUrl = new URL('/404', request.url)
        const notFoundResponse = await env.ASSETS.fetch(new Request(notFoundUrl, request))
        if (notFoundResponse.status === 200) {
          const body = await notFoundResponse.text()
          return new Response(body, { status: 404, headers: notFoundResponse.headers })
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