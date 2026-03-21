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

    const assetResponse = await env.ASSETS.fetch(request)
    if (assetResponse.status !== 404 || !isHtmlRequest(request)) {
      return assetResponse
    }

    const indexUrl = new URL('/index.html', request.url)
    return env.ASSETS.fetch(new Request(indexUrl, request))
  },
}