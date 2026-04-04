import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const BLOGS = [
  {
    slug: 'meme-generator-guide',
    title: 'Meme Generator Guide',
    description: 'Step-by-step guide and tips for creating memes with THRJ\'s Meme Generator.',
    thumbnail: 'https://thrjtech.com/screenshots/meme-generator/meme-generator004.png'
  }
  ,
  {
    slug: 'pdf-merger-guide',
    title: 'PDF Merger Guide',
    description: 'How to combine multiple PDF files quickly and privately using THRJ\'s PDF Merger.',
    thumbnail: 'https://thrjtech.com/screenshots/merger/merger-001.png'
  }
]


export default function BlogsListPage() {
  return (
    <div className="page">
      <Navbar />
      <main className="main">
        <div className="container">
          <h2 className="section-heading">Blog</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {/* Table-like container */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ background: '#f9fafb', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, color: '#111827' }}>Articles</div>
              <div>
                {(() => {
                  const perPage = 10
                  const [page, setPage] = (() => {
                    const state = useState(1)
                    return state
                  })()
                  const totalPages = Math.max(1, Math.ceil(BLOGS.length / perPage))
                  const start = (page - 1) * perPage
                  const pageBlogs = BLOGS.slice(start, start + perPage)

                  return (
                    <>
                      {pageBlogs.map((b, idx) => {
                        const absIndex = start + idx // absolute index across pages
                        const background = ((absIndex + 1) % 2 === 0) ? '#f8fafc' : '#e6e7eb' // even -> lighter, odd -> darker
                        return (
                          <Link
                            to={`/blogs/${b.slug}`}
                            key={b.slug}
                            className="card blog-row"
                            style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderBottom: '1px solid #e5e7eb', background }}
                            aria-label={`Read blog: ${b.title}`}
                          >
                            <img
                              src={b.thumbnail || 'https://via.placeholder.com/120x80?text=Blog'}
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

                      {/* Footer: pagination controls */}
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
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
