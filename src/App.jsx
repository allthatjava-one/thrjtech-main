import './App.css'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RotatingCards from './components/RotatingCards'
import Seo from './components/Seo'
import GtagRouteTracker from './components/GtagRouteTracker'
import PdfCompressorPage from './tools/pdf-compressor/PdfCompressorPage'
import PdfMergerPage from './tools/pdf-merger/PdfMergerPage'
import PdfConverterPage from './tools/pdf-converter/PdfConverterPage'
import JsonFormatterPage from './tools/json-formatter/JsonFormatterPage'

import WatermarkerPage from './tools/image-watermarker/WatermarkerPage'
import ImageResizerPage from './tools/image-resizer';
import ImageCollagePage from './tools/image-collage';
import ImageMemeGeneratorPage from './tools/image-meme-generator';

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
            <h2 className="section-heading">Available Tools</h2>
            <RotatingCards />
          </div>
        </div>

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

export default function App() {
  return (
    <BrowserRouter>
      <GtagRouteTracker />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pdf-compressor" element={<><Seo title="PDF Compressor — THRJ" description="Compress PDF files online for free with THRJ's fast, in-browser PDF compressor." /><PdfCompressorPage /></>} />
        <Route path="/pdf-merger" element={<><Seo title="PDF Merger — THRJ" description="Merge multiple PDF files into one quickly and securely in your browser." /><PdfMergerPage /></>} />
        <Route path="/pdf-converter" element={<><Seo title="PDF Converter — THRJ" description="Convert PDF document to image file — fast, free, and private." /><PdfConverterPage /></>} />
        <Route path="/json-formatter" element={<><Seo title="JSON Formatter — THRJ" description="Format and beautify JSON online with an easy-to-use JSON formatter." /><JsonFormatterPage /></>} />
        <Route path="/image-watermarker" element={<><Seo title="Image Watermarker — THRJ" description="Add watermarks to images quickly in your browser — no uploads required." /><WatermarkerPage /></>} />
        <Route path="/image-resizer" element={<><Seo title="Image Resizer — THRJ" description="Resize images online with an easy, privacy-friendly image resizer." /><ImageResizerPage /></>} />
        <Route path="/image-collage" element={<><Seo title="Image Collage Maker — THRJ" description="Create image collages online with an intuitive collage maker." /><ImageCollagePage /></>} />
        <Route path="/image-meme-generator" element={<><Seo title="Meme Generator — THRJ" description="Create and download custom memes using the in-browser meme generator." /><ImageMemeGeneratorPage /></>} />
      </Routes>
    </BrowserRouter>
  )
}
