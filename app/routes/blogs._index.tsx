import type { LoaderFunctionArgs, MetaFunction } from 'react-router'
import BlogsListPage from '../../src/components/BlogsListPage'

const emptyBlogsPayload = {
  items: [],
  page: 1,
  page_size: null,
  total_pages: 1,
  links: {},
}

export const meta: MetaFunction = () => [
  { title: 'Blog — THRJ' },
  { name: 'description', content: 'Tips, guides, and how-tos for THRJ\'s free online tools.' },
]

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const page = url.searchParams.get('page') || '1'
  const pageSize = url.searchParams.get('page_size')

  try {
    const env = (context as any).cloudflare?.env
    const backendUrl = env?.BLOG_BACKEND_URL
    if (!backendUrl) return emptyBlogsPayload

    const params = new URLSearchParams()
    if (page !== '1') params.set('page', page)
    if (pageSize) params.set('page_size', pageSize)
    const fetchUrl = params.toString() ? `${backendUrl}?${params}` : backendUrl

    const res = await fetch(fetchUrl, { headers: { 'Accept': 'application/json' } })
    if (!res.ok) return emptyBlogsPayload
    return await res.json()
  } catch {
    return emptyBlogsPayload
  }
}

export default BlogsListPage
