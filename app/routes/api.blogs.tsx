import type { LoaderFunctionArgs } from 'react-router'

const emptyBlogsPayload = {
  items: [],
  page: 1,
  page_size: null,
  total_pages: 1,
  links: {},
}

/**
 * Client-side fallback for blog list fetches (e.g. pagination after hydration).
 * Proxies GET /api/blogs?... → env.BLOG_BACKEND_URL
 */
export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  try {
    const env = (context as any).cloudflare?.env
    const backendUrl = env?.BLOG_BACKEND_URL
    if (!backendUrl) {
      return Response.json(
        { ...emptyBlogsPayload, unavailable: true, reason: 'Blog backend not configured' },
        { status: 200 },
      )
    }

    const params = new URLSearchParams()
    url.searchParams.forEach((v, k) => params.set(k, v))
    const fetchUrl = params.toString() ? `${backendUrl}?${params}` : backendUrl

    const upstream = await fetch(fetchUrl, { headers: { 'Accept': 'application/json' } })
    const body = await upstream.text()

    if (!upstream.ok) {
      return Response.json(
        { ...emptyBlogsPayload, unavailable: true, reason: `Blog backend returned ${upstream.status}` },
        { status: 200 },
      )
    }

    return new Response(body, {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch (err: any) {
    return Response.json(
      { ...emptyBlogsPayload, unavailable: true, reason: err.message || 'Blog backend unavailable' },
      { status: 200 },
    )
  }
}
