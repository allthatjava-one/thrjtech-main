import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'
import Footer from './Footer'
import "./BlogsListPage.css";

const DEFAULT_THUMB = '/images/blogs/default-thumb.svg'

export default function BlogsListPage() {
  const { t, i18n } = useTranslation('blogs')
  const [searchParams, setSearchParams] = useSearchParams()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(null)
  const [pageSize, setPageSize] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [links, setLinks] = useState({})

  const urlPage = parseInt(searchParams.get('page') || '1', 10)
  const urlPageSize = searchParams.get('page_size') ? parseInt(searchParams.get('page_size'), 10) : null

  const fetchBlogs = (targetPage, targetPageSize) => {
    setLoading(true)
    let url = '/api/blogs'
    if (targetPage) {
      const params = new URLSearchParams({ page: targetPage })
      if (targetPageSize) params.set('page_size', targetPageSize)
      url = `/api/blogs?${params.toString()}`
    }
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

  useEffect(() => {
    fetchBlogs(urlPage, urlPageSize)
  }, [urlPage, urlPageSize])

  const goToPage = (n) => {
    if (n === page) return
    const params = {}
    if (n > 1) params.page = n
    if (pageSize) params.page_size = pageSize
    setSearchParams(params)
  }
  const changePageSize = (newSize) => {
    setSearchParams({ page_size: newSize })
  }

  const pageBlogs = blogs

  return (
    <div className="page">
      <Navbar />
      <main className="main">
        <div className="container">
          <h2 className="section-heading">{t('title')}</h2>
          {loading && <p style={{ color: '#6b7280' }}>{t('loading')}</p>}
          {error && <p style={{ color: '#dc2626' }}>{t('error', { error })}</p>}
          {!loading && !error && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ background: '#f9fafb', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, color: '#111827' }}>{t('articlesHeader')}</div>
              <div>
                {pageBlogs.map((b, idx) => {
                  const background = ((idx + 1) % 2 === 0) ? '#f8fafc' : '#e6e7eb'
                  const lang = i18n.resolvedLanguage || i18n.language || 'en'
                  const displayTitle = (lang !== 'en' && b[`title_${lang}`]) || b.title
                  const displayDescription = (lang !== 'en' && b[`description_${lang}`]) || b.description
                  return (
                    <Link
                      to={`/blogs/${b.slug}`}
                      key={b.slug}
                      className="card blog-row"
                      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderBottom: '1px solid #e5e7eb', background }}
                      aria-label={`Read blog: ${displayTitle}`}
                    >
                      <img
                        src={b.thumbnail || DEFAULT_THUMB}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_THUMB }}
                        alt={`Thumbnail for ${displayTitle}`}
                        style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, flex: '0 0 auto' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ marginTop: 0, color: '#111827', fontWeight: 700 }}>{displayTitle}</h3>
                        <p style={{ color: '#6b7280', marginBottom: 0 }}>{displayDescription}</p>
                      </div>
                    </Link>
                  )
                })}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#fff' }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} role="navigation" aria-label="Pagination">
                    <button onClick={() => goToPage(1)} disabled={!links.prev} style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid transparent', background: 'transparent', color: !links.prev ? '#9ca3af' : '#111827', cursor: !links.prev ? 'default' : 'pointer' }}>{t('first')}</button>
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
                    <button onClick={() => goToPage(totalPages)} disabled={!links.next} style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid transparent', background: 'transparent', color: !links.next ? '#9ca3af' : '#111827', cursor: !links.next ? 'default' : 'pointer' }}>{t('last')}</button>
                  </div>
                  <label style={{ fontSize: 14, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {t('perPage')}
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
