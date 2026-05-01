import type { LoaderFunctionArgs, MetaFunction } from 'react-router'
import BlogPage from '../../src/components/BlogPage'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = (data as any)?.title
  const description = (data as any)?.description
  return [
    { title: title ? `${title} | THRJ Blog` : 'Blog — THRJ' },
    { name: 'description', content: description || 'Read guides and how-tos on THRJ Blog.' },
  ]
}

export async function loader({ params, context }: LoaderFunctionArgs) {
  const slug = params.slug!

  try {
    const env = (context as any).cloudflare?.env
    const backendUrl = env?.BLOG_BACKEND_URL
    if (!backendUrl) return { slug }

    const res = await fetch(`${backendUrl}/${slug}`, {
      headers: { 'Accept': 'application/json' },
    })
    if (!res.ok) return { slug, error: `Blog not found (${res.status})` }

    const data = await res.json() as Record<string, unknown>
    return { ...data, slug }
  } catch {
    return { slug, error: 'Failed to load blog post.' }
  }
}

export default BlogPage
