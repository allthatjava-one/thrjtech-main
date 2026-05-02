import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSsrData } from '../SsrDataContext.js'
import Navbar from './Navbar'
import Footer from './Footer'
import './BlogPage.css'

function naiveMarkdownToHtml(md) {
  let html = md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" style="max-width:100%;height:auto;"/>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    .replace(/\n\n+/gim, '</p><p>')
  html = '<p>' + html + '</p>'
  // avoid converting all remaining newlines to <br/> which creates many empty <br> tags
  // close stray empty paragraphs
  html = html.replace(/<p>\s*<\/p>/gim, '')
  return html
}

export default function BlogPage() {
  const { t, i18n } = useTranslation('blogs')
  const { slug } = useParams()
  const navigate = useNavigate()
  const ssrData = useSsrData()
  // Consume window.__INITIAL_DATA__ exactly once (cleared so remounts don't reuse stale data)
  const [serverBlog] = useState(() => {
    if (ssrData?.blog) return ssrData.blog
    if (typeof window === 'undefined') return null
    const data = window.__INITIAL_DATA__?.blog ?? null
    if (data) window.__INITIAL_DATA__ = null
    return data
  })
  const [createdAt, setCreatedAt] = useState(serverBlog?.createdAt ?? null)
  const [blogData, setBlogData] = useState(serverBlog)
  const [error, setError] = useState(null)
  const initialDataUsed = useRef(!!serverBlog)

  const lang = i18n.resolvedLanguage || i18n.language || 'en'
  const title = blogData ? ((lang !== 'en' && blogData[`title_${lang}`]) || blogData.title) : null
  const content = blogData
    ? naiveMarkdownToHtml((lang !== 'en' && blogData[`content_${lang}`]) || blogData.content)
    : null

  useEffect(() => {
    if (initialDataUsed.current) {
      initialDataUsed.current = false
      return
    }
    const url = `/api/blogs/${slug}`
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Blog not found (${res.status})`)
        return res.json()
      })
      .then(data => {
        setBlogData(data)
        setCreatedAt(data.createdAt)
      })
      .catch(err => setError(err.message))
  }, [slug])

  useEffect(() => {
    const prev = document.title
    if (title) document.title = `${title} | THRJ Blog`
    return () => { document.title = prev }
  }, [title, lang])

  return (
    <div className="page blog-post-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div style={{ marginBottom: '1rem' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer', textDecoration: 'underline', font: 'inherit' }}>{t('back')}</button>
          </div>
          <article className="card">
            <div style={{ color: '#000000' }}>{t('createdAt', { date: new Date(createdAt).toLocaleString() })}</div>
            {error
              ? <p style={{ color: '#dc2626' }}>{t('errorArticle', { error })}</p>
              : <>
                  <div dangerouslySetInnerHTML={{ __html: content || `<p>${t('loadingArticle')}</p>` }} />
                </>
            }
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}
