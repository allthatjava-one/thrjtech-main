import { onRequestPost } from './functions/r2-presign.js'

function isHtmlRequest(request) {
  const accept = request.headers.get('Accept') || ''
  return request.method === 'GET' && accept.includes('text/html')
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

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
    if (assetResponse.status !== 404 || !isHtmlRequest(request)) {
      return assetResponse
    }

    const indexUrl = new URL('/index.html', request.url)
    return env.ASSETS.fetch(new Request(indexUrl, request))
  },
}