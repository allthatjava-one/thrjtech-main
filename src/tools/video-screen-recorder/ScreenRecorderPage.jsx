import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Seo from '../../services/Seo'
import '../image-tools-shared.css'
import './ScreenRecorder.css'
import useScreenRecorder from './hooks/useScreenRecorder'
import ScreenRecorderView from './ScreenRecorderView'

export default function ScreenRecorderPage() {
  const props = useScreenRecorder()

  return (
    <div className="screen-recorder-page">
      <Seo title="Quick Screen Recorder — THRJ" description="Record your screen instantly in the browser. 100% client-side and private." />
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <ScreenRecorderView {...props} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
