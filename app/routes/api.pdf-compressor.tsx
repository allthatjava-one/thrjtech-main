import type { ActionFunctionArgs } from 'react-router'

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    const env = (context as any).cloudflare?.env
    const backendUrl = env?.PDF_COMPRESSOR_BACKEND_URL
    if (!backendUrl) {
      return Response.json({ error: 'PDF compressor backend not configured' }, { status: 503 })
    }

    const body = await request.json()

    const upstream = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })

    const text = await upstream.text()

    return new Response(text, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Proxy error' }, { status: 502 })
  }
}
