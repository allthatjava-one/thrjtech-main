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
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load blogs (${res.status})`)
        return res.json()
      })
      .then(data => { setBlogs(Array.isArray(data) ? data : (data.blogs ?? data.items ?? data.data ?? [])); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  const perPage = 10
  const totalPages = Math.max(1, Math.ceil(blogs.length / perPage))
  const start = (page - 1) * perPage
  const pageBlogs = blogs.slice(start, start + perPage)

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
                  const absIndex = start + idx
                  const background = ((absIndex + 1) % 2 === 0) ? '#f8fafc' : '#e6e7eb'
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
                  <div>
                    <button onClick={() => setPage(1)} disabled={page === 1} style={{ marginRight: 8 }}>First</button>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }} role="navigation" aria-label="Pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        aria-current={page === n ? 'page' : undefined}
                        style={{
                          padding: '6px 8px',
                          borderRadius: 4,
                          border: page === n ? '1px solid #111827' : '1px solid transparent',
                          background: page === n ? '#111827' : 'transparent',
                          color: page === n ? '#fff' : '#111827',
                          cursor: 'pointer'
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <div>
                    <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>Last</button>
                  </div>
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
