import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Seo from '../../services/Seo'
import '../tools-shared.css'
import './VideoToGif.css'
import useVideoToGif from './hooks/useVideoToGif'
import VideoToGifView from './VideoToGifView'

export default function VideoToGifPage() {
  const props = useVideoToGif()

  return (
    <div className="video-to-gif-page">
      <Seo
        title="Video to GIF Converter — THRJ"
        description="Convert video clips to GIF online, free and private. No upload needed — runs entirely in your browser."
      />
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <VideoToGifView {...props} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
