import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
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
  const { slug } = useParams()
  const [createdAt, setCreatedAt] = useState(null)
  const [content, setContent] = useState(null)
  const [title, setTitle] = useState(null)
  const [error, setError] = useState(null)


  useEffect(() => {
    const url = `/api/blogs/${slug}`
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Blog not found (${res.status})`)
        return res.json()
      })
      .then(data => {
        setTitle(data.title)
        setContent(naiveMarkdownToHtml(data.content))
        setCreatedAt(data.createdAt)
      })
      .catch(err => setError(err.message))
  }, [slug])

  useEffect(() => {
    const prev = document.title
    if (title) document.title = `${title} | THRJ Blog`
    return () => { document.title = prev }
  }, [title])

  return (
    <div className="page blog-post-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div style={{ marginBottom: '1rem' }}>
            <Link to="/blogs">← Back to Blog</Link>
          </div>
          <article className="card">
            <div style={{ color: '#000000' }}>Created at: {new Date(createdAt).toLocaleString()}</div>
            {error
              ? <p style={{ color: '#dc2626' }}>Error: {error}</p>
              : <>
                  <div dangerouslySetInnerHTML={{ __html: content || '<p>Loading…</p>' }} />
                </>
            }
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}
