import './App.css'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RotatingCards from './components/RotatingCards'
import PdfCompressorPage from './tools/pdf-compressor/PdfCompressorPage'
import PdfMergerPage from './tools/pdf-merger/PdfMergerPage'
import PdfConverterPage from './tools/pdf-converter/PdfConverterPage'
import JsonFormatterPage from './tools/json-formatter/JsonFormatterPage'

import WatermarkerPage from './tools/image-watermarker/WatermarkerPage'
import ImageResizerPage from './tools/image-resizer';
import ImageCollagePage from './tools/image-collage';

function HomePage() {

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

  return (
    <>
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pdf-compressor" element={<PdfCompressorPage />} />
        <Route path="/pdf-merger" element={<PdfMergerPage />} />
        <Route path="/pdf-converter" element={<PdfConverterPage />} />
        <Route path="/json-formatter" element={<JsonFormatterPage />} />
        <Route path="/image-watermarker" element={<WatermarkerPage />} />
        <Route path="/image-resizer" element={<ImageResizerPage />} />
        <Route path="/image-collage" element={<ImageCollagePage />} />
      </Routes>
    </BrowserRouter>
  )
}
