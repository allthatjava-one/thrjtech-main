import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import "./BlogsListPage.css";

const DEFAULT_THUMB = '/default-thumb.svg'

export default function BlogsListPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(null)
  const [pageSize, setPageSize] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [links, setLinks] = useState({})

  const fetchBlogs = (targetPage, targetPageSize) => {
    setLoading(true)
    const url = targetPage && targetPageSize
      ? `/api/blogs?page=${targetPage}&page_size=${targetPageSize}`
      : '/api/blogs'
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load blogs (${res.status})`)
        return res.json()
      })
      .then(data => {
        setBlogs(data.items ?? [])
        setPage(data.page ?? 1)
        setPageSize(data.page_size ?? null)
        setTotalPages(data.total_pages ?? 1)
        setLinks(data.links ?? {})
        setLoading(false)
      })
      .catch(err => { setError(err.message); setLoading(false) })
  }

  useEffect(() => { fetchBlogs(null, null) }, [])

  const goToPage = (n) => { if (n !== page) fetchBlogs(n, pageSize) }
  const changePageSize = (newSize) => { fetchBlogs(1, newSize) }

  const pageBlogs = blogs

  return (
    <div className="page">
      <Navbar />
      <main className="main">
        <div className="container">
          <h2 className="section-heading">Blog</h2>
          {loading && <p style={{ color: '#6b7280' }}>Loading articles…</p>}
          {error && <p style={{ color: '#dc2626' }}>Error: {error}</p>}
          {!loading && !error && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ background: '#f9fafb', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, color: '#111827' }}>Articles</div>
              <div>
                {pageBlogs.map((b, idx) => {
                  const background = ((idx + 1) % 2 === 0) ? '#f8fafc' : '#e6e7eb'
                  return (
                    <Link
                      to={`/blogs/${b.slug}`}
                      key={b.slug}
                      className="card blog-row"
                      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderBottom: '1px solid #e5e7eb', background }}
                      aria-label={`Read blog: ${b.title}`}
                    >
                      <img
                        src={b.thumbnail || DEFAULT_THUMB}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_THUMB }}
                        alt={`Thumbnail for ${b.title}`}
                        style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, flex: '0 0 auto' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ marginTop: 0, color: '#111827', fontWeight: 700 }}>{b.title}</h3>
                        <p style={{ color: '#6b7280', marginBottom: 0 }}>{b.description}</p>
                      </div>
                    </Link>
                  )
                })}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#fff' }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} role="navigation" aria-label="Pagination">
                    <button onClick={() => goToPage(1)} disabled={!links.prev} style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid transparent', background: 'transparent', color: !links.prev ? '#9ca3af' : '#111827', cursor: !links.prev ? 'default' : 'pointer' }}>First</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        onClick={() => goToPage(n)}
                        aria-current={page === n ? 'page' : undefined}
                        style={{
                          padding: '6px 8px',
                          borderRadius: 4,
                          border: page === n ? '1px solid #111827' : '1px solid transparent',
                          background: 'transparent',
                          color: '#111827',
                          fontWeight: page === n ? 700 : 400,
                          cursor: 'pointer'
                        }}
                      >
                        {n}
                      </button>
                    ))}
                    <button onClick={() => goToPage(totalPages)} disabled={!links.next} style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid transparent', background: 'transparent', color: !links.next ? '#9ca3af' : '#111827', cursor: !links.next ? 'default' : 'pointer' }}>Last</button>
                  </div>
                  <label style={{ fontSize: 14, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                    Per page:
                    <select
                      value={pageSize ?? ''}
                      onChange={e => changePageSize(Number(e.target.value))}
                      style={{ padding: '2px 6px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 14 }}
                    >
                      {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
