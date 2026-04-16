import './App.css'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RotatingCards from './components/RotatingCards'
import Seo from './services/Seo'
import GtagRouteTracker from './services/GtagRouteTracker'
import PdfCompressorPage from './tools/pdf-compressor/PdfCompressorPage'
import PdfMergerPage from './tools/pdf-merger/PdfMergerPage'
import PdfConverterPage from './tools/pdf-converter/PdfConverterPage'
import PdfSplitterPage from './tools/pdf-splitter/PdfSplitterPage'
import JsonFormatterPage from './tools/text-json-formatter/JsonFormatterPage'
import RegexTesterPage from './tools/text-regex/RegexTesterPage'

import WatermarkerPage from './tools/image-watermarker/WatermarkerPage'
import ImageResizerPage from './tools/image-resizer';
import ImageCollagePage from './tools/image-collage';
import ImageMemeGeneratorPage from './tools/image-meme-generator';
import ImageCropPage from './tools/image-crop';
import ImageConverterPage from './tools/image-converter';
import BlogsListPage from './components/BlogsListPage';
import BlogPage from './components/BlogPage';
import AboutUsPage from './components/about/AboutUsPage';
import PrivacyPolicyPage from './components/about/PrivacyPolicyPage';
import TermsOfServicePage from './components/about/TermsOfServicePage';
import ContactUsPage from './components/ContactUsPage';

function HomePage() {

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

  return (
    <>
      <Seo title="THRJ — Free Online Tools" description="Free, fast, privacy-friendly online utilities (image, PDF, and JSON tools) that run in your browser." />
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Main content - Start */}

        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">
            <h1 className="hero-title">Online Tools,<br />Zero Hassle</h1>
            <p className="hero-subtitle">
              Free, fast, and privacy-friendly utilities that work right in your browser.
            </p>
          </div>
        </section>

        {/* Tools Section */}
        <div className="tools-section">
          <div className="container">
            {/* <h2 className="section-heading">Available Tools</h2> */}
            <RotatingCards />
          </div>
        </div>

        {/* Popular Guides */}
        <section className="home-section">
          <div className="container">
            <h2 className="home-section-title">Popular Guides</h2>
            <div className="guide-links">
              <Link className="guide-link" to="/blogs/json-formatter-guide">JSON Formatter — Pretty-print, validate &amp; explore JSON</Link>
              <Link className="guide-link" to="/blogs/image-crop-guide">Image Crop — Trim and frame your images</Link>
              <Link className="guide-link" to="/blogs/meme-generator-guide">Meme Generator — Create shareable memes in seconds</Link>
              <Link className="guide-link" to="/blogs/pdf-compressor-guide">PDF Compressor — Shrink PDF file sizes quickly</Link>
              <Link className="guide-link" to="/blogs/image-collage-guide">Image Collage — Build beautiful photo collages</Link>
              <Link className="guide-link" to="/blogs/pdf-merger-guide">PDF Merger — Combine multiple PDFs into one</Link>
            </div>
          </div>
        </section>

        {/* Developer & Image Tools Spotlight */}
        <section className="home-section home-section--alt">
          <div className="container">

            {/* Developer Tools */}
            <div className="spotlight-group">
              <h2 className="home-section-title">Developer Tools</h2>
              <div className="spotlight-cards">
                <Link className="spotlight-card" to="/json-formatter">
                  <span className="spotlight-card-name">JSON Formatter</span>
                  <p className="spotlight-card-desc">Format, validate, and pretty-print JSON instantly in your browser. Supports syntax highlighting, minification, and clear error reporting.</p>
                </Link>
                <Link className="spotlight-card" to="/regex-tester">
                  <span className="spotlight-card-name">Regex Tester</span>
                  <p className="spotlight-card-desc">Test regular expressions with live match highlighting and replace support. Iterate quickly on patterns with real-time feedback.</p>
                </Link>
              </div>
            </div>

            {/* Image Tools */}
            <div className="spotlight-group">
              <h2 className="home-section-title">Image Tools</h2>
              <div className="spotlight-cards">
                <Link className="spotlight-card" to="/image-crop">
                  <span className="spotlight-card-name">Crop Image</span>
                  <p className="spotlight-card-desc">Crop any image to the exact size and aspect ratio you need. Supports free-form cropping and convenient presets like 1:1, 16:9, and 4:5 — all in your browser.</p>
                </Link>
                <Link className="spotlight-card" to="/image-meme-generator">
                  <span className="spotlight-card-name">Meme Generator</span>
                  <p className="spotlight-card-desc">Add bold text layers over any image, drag them into position, and download your custom meme as a PNG. No account needed.</p>
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Main content - End */}
      </main>
      {/* THRJ Tech Ads */}
      <ins className="adsbygoogle" style={{ display: 'block' }}
        data-ad-client="ca-pub-1683577108258942" data-ad-slot="9546355200"
        data-ad-format="auto" data-full-width-responsive="true"></ins>
      <Footer />
    </>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }) } catch (e) {}
    const main = document.querySelector('main') || document.querySelector('#root') || document.body
    if (main && main instanceof HTMLElement) {
      try { main.setAttribute('tabindex', '-1'); main.focus({ preventScroll: true }) } catch (e) {
        try { main.focus() } catch (ee) {}
      }
    }
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GtagRouteTracker />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pdf-compressor" element={<><Seo title="PDF Compressor — THRJ" description="Compress PDF files online for free with THRJ's fast, in-browser PDF compressor." /><PdfCompressorPage /></>} />
        <Route path="/pdf-merger" element={<><Seo title="PDF Merger — THRJ" description="Merge multiple PDF files into one quickly and securely in your browser." /><PdfMergerPage /></>} />
        <Route path="/pdf-converter" element={<><Seo title="PDF Converter — THRJ" description="Convert PDF document to image file — fast, free, and private." /><PdfConverterPage /></>} />
        <Route path="/json-formatter" element={<><Seo title="JSON Formatter — THRJ" description="Format and beautify JSON online with an easy-to-use JSON formatter." /><JsonFormatterPage /></>} />
        <Route path="/regex-tester" element={<><Seo title="Regex Tester — THRJ" description="Regex search & replace tool with live match highlighting." /><RegexTesterPage /></>} />
        <Route path="/image-watermarker" element={<><Seo title="Image Watermarker — THRJ" description="Add watermarks to images quickly in your browser — no uploads required." /><WatermarkerPage /></>} />
        <Route path="/image-resizer" element={<><Seo title="Image Resizer — THRJ" description="Resize images online with an easy, privacy-friendly image resizer." /><ImageResizerPage /></>} />
        <Route path="/image-collage" element={<><Seo title="Image Collage Maker — THRJ" description="Create image collages online with an intuitive collage maker." /><ImageCollagePage /></>} />
        <Route path="/image-meme-generator" element={<><Seo title="Meme Generator — THRJ" description="Create and download custom memes using the in-browser meme generator." /><ImageMemeGeneratorPage /></>} />
        <Route path="/image-crop" element={<><Seo title="Image Crop — THRJ" description="Crop images online with an intuitive, client-side cropping tool." /><ImageCropPage /></>} />
        <Route path="/image-converter" element={<><Seo title="Image Converter — THRJ" description="Convert images between JPG, PNG, WebP and more instantly in your browser." /><ImageConverterPage /></>} />
        <Route path="/pdf-splitter" element={<><Seo title="PDF Splitter — THRJ" description="Split PDF files into page ranges or combined outputs." /><PdfSplitterPage /></>} />
        <Route path="/blogs" element={<><Seo title="Blog — THRJ" description="THRJ blog" /><BlogsListPage /></>} />
        <Route path="/blogs/:slug" element={<><Seo title="Blog post — THRJ" description="Blog post" /><BlogPage /></>} />
        <Route path="/about/us" element={<AboutUsPage />} />
        <Route path="/about/policy" element={<PrivacyPolicyPage />} />
        <Route path="/about/terms" element={<TermsOfServicePage />} />
        <Route path="/contact" element={<ContactUsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
