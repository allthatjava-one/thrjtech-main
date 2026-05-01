import type { LoaderFunctionArgs } from 'react-router'

/**
 * Client-side fallback for individual blog post fetches.
 * Proxies GET /api/blogs/:slug → env.BLOG_BACKEND_URL/:slug
 */
export async function loader({ params, context }: LoaderFunctionArgs) {
  const slug = params.slug!

  try {
    const env = (context as any).cloudflare?.env
    const backendUrl = env?.BLOG_BACKEND_URL
    if (!backendUrl) return Response.json({ error: 'Blog backend not configured' }, { status: 503 })

    const upstream = await fetch(`${backendUrl}/${slug}`, {
      headers: { 'Accept': 'application/json' },
    })
    const body = await upstream.text()

    return new Response(body, {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
